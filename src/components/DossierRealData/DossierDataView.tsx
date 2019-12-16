/*
* DossierDataView.js 涉案物品数据展示
* author：jhm
* 20180111
* */
import React, {PureComponent} from 'react';
import {Row, Col, Card, Divider, Tooltip, Button, Radio, Icon, message, Progress} from 'antd';
import moment from 'moment/moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pictorialBar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import styles from '../../pages/common/dataView.less';
import {getDefaultDaysForMonth, getTimeDistance} from '../../utils/utils';
import DataViewDateShow from '../Common/DataViewDateShow';
// import { MiniProgress, ChartCard } from '../../components/Charts';
import {MiniProgress, ChartCard} from 'ant-design-pro/lib/Charts';
import nonDivImg from '../../assets/viewData/nonData.png';
import {connect} from "dva";
import noListLight from "@/assets/viewData/noListLight.png";
import {marginLeft} from "html2canvas/dist/types/css/property-descriptors/margin";
import {getDefaultDays, getDefaultDaysForWeek, getDefaultMonths, getDefaultWeeks, getDefaultYears} from "@/utils/utils";

let itemEchartpictorialBar;
let itemEchartRingPie;
let itemEchartdzhqkPie;
let itemEchartwpqsBar;
const colors1 = ['#0099FF', '#33CC00', '#FF3300', '#9933FF', '#33CBCC', '#0198FF', '#9933FF'];
const colors2 = ['#0198FF', '#9933FF'];
@connect(({global}) => ({
    global
}))
export default class DossierDataView extends PureComponent {
    state = {
        currentType: 'week',
        type: 'now',
        ZkjzData: [],
        ZkjzTotal: '',
        showrkDataView: true, // 控制显示入库或者出库（true显示入库）
        TypeTime: [moment(getTimeDistance('week')[0]).format('YYYY-MM-DD'), (getTimeDistance('week')[1]).format('YYYY-MM-DD')],// 请求数据的时间
        jzqsNoData: false, // 卷宗趋势无数据
        selectedDateData: 0, // 头部统计警情总数——手动选择日期
        typeLabel:'', // 通过时间判断趋势是什么类型；'天','周','月','年'
        qsTime:'', // 确认点击的是本周、前一周、前两周还是本月、前一月、前两月
    };

    componentDidMount() {
        this.showCaseEchartBar(this.props);
        this.showCaseEchartRingPie(this.props);
        this.showCaseEchartwpqsBar(this.props);
        this.showCaseEchartdzhqkzsBar(this.props);
        window.addEventListener('resize', itemEchartpictorialBar.resize);
        window.addEventListener('resize', itemEchartRingPie.resize);
        window.addEventListener('resize', itemEchartwpqsBar.resize);
        window.addEventListener('resize', itemEchartdzhqkPie.resize);
        const weekTypeTime = this.getTime(this.props.searchType);
        this.getDossierNumCount(weekTypeTime[0], weekTypeTime[1]);
        this.getDossierCRKCount(weekTypeTime[0], weekTypeTime[1], '3');
        this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1]);
        this.showCaseJzqspie('3');
        this.getDossierDZHQKShow(weekTypeTime[0], weekTypeTime[1]);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (this.props.global.dark !== nextProps.global.dark) {
                this.showCaseEchartBar(nextProps);
                this.showCaseEchartRingPie(nextProps);
                this.showCaseEchartwpqsBar(nextProps);
                this.showCaseEchartdzhqkzsBar(nextProps);
                // this.changeCountButtonCurrent(this.state.type);
            }
            let currentType = '';
            if(this.props.searchType !== nextProps.searchType){
                if (nextProps.searchType === 'week') {
                    currentType='week';
                }else if (nextProps.searchType === 'month') {
                    currentType='month';
                }else if (nextProps.searchType === 'selectedDate') {
                    currentType='selectedDate';
                }
                this.setState({
                    currentType,
                });
            }
            if (this.props.searchType !== nextProps.searchType || this.props.orgcode !== nextProps.orgcode || this.props.selectedDateVal !== nextProps.selectedDateVal||this.props.global.dark !== nextProps.global.dark) {
                currentType = currentType ? currentType : this.state.currentType;
                let type = this.state.type;
                let rqtype = '';
                if (type === 'now') {
                    currentType = nextProps.searchType === 'week' ? 'week' : 'month';
                    rqtype = currentType === 'week' ? '3' : '6';
                } else if (type === 'last') {
                    currentType = nextProps.searchType === 'week' ? 'lastWeek' : 'lastMonth';
                    rqtype = currentType === 'lastWeek' ? '4' : '7';
                } else if (type === 'beforeLast') {
                    currentType = nextProps.searchType === 'week' ? 'beforeLastWeek' : 'beforeLastMonth';
                    rqtype = currentType === 'beforeLastWeek' ? '5' : '8';
                }
                if (nextProps.searchType === 'week') {
                    this.setState({
                        TypeTime: [moment(getTimeDistance(currentType)[0]).format('YYYY-MM-DD'), (getTimeDistance(currentType)[1]).format('YYYY-MM-DD')],// 请求数据的时间
                    });
                    const weekTypeTime = this.getTime(currentType);
                    this.getDossierNumCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getDossierCRKCount(weekTypeTime[0], weekTypeTime[1], this.state.showrkDataView ? '3' : '1', nextProps.orgcode);
                    this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.showCaseJzqspie(rqtype ? rqtype : '3', nextProps.orgcode);
                    this.getDossierDZHQKShow(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                } else if (nextProps.searchType === 'month') {
                    this.setState({
                        TypeTime: [moment(getTimeDistance(currentType)[0]).format('YYYY-MM-DD'), (getTimeDistance(currentType)[1]).format('YYYY-MM-DD')],// 请求数据的时间
                    });
                    const monthTypeTime = this.getTime(currentType);
                    this.getDossierNumCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getDossierCRKCount(monthTypeTime[0], monthTypeTime[1], this.state.showrkDataView ? '3' : '1', nextProps.orgcode);
                    this.showCaseZKNumpie(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.showCaseJzqspie(rqtype ? rqtype : '6', nextProps.orgcode);
                    this.getDossierDZHQKShow(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                } else if (nextProps.searchType === 'selectedDate') {
                    this.setState({
                        TypeTime: nextProps.selectedDateVal,
                    }, function () {
                        const {selectedDateVal} = nextProps;
                        this.getDossierNumCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.getDossierCRKCount(selectedDateVal[0], selectedDateVal[1], this.state.showrkDataView ? '3' : '1', nextProps.orgcode);
                        this.showCaseZKNumpie(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.getDossierDZHQKShow(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.showCaseJzqspie('selectedDate', nextProps.orgcode, selectedDateVal[0], selectedDateVal[1]);
                    });
                }
            }
        }
    }

    getTime = (type) => {
        const time = getTimeDistance(type);
        const startTime = time && time [0] ? moment(time[0]).format('YYYY-MM-DD') : '';
        const endTime = time && time[1] ? moment(time[1]).format('YYYY-MM-DD') : '';
        return [startTime, endTime];
    };

    // 获取卷宗数量图表统计
    getDossierNumCount(startTime, endTime, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'DossierData/DossierJZSLDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgcode,
            },
            callback: (data) => {
                if (itemEchartRingPie && data) {
                    const newData = [];
                    const newData1 = [];
                    const data1 = data.list;
                    let count = 0;
                    for (let a = 1; a < data1.length; a++) {
                        const legendData = {
                            name: data1[a].name,
                            icon: 'circle',
                            value: data1[a].count,
                        };
                        const seriesData = {
                            name: data1[a].name,
                            value: data1[a].count,
                            itemStyle: {
                                color: colors1[a - 1],
                            },
                        };
                        newData.push(legendData);
                        newData1.push(seriesData);
                        count = parseInt(data1[0].count);
                    }
                    ;
                    itemEchartRingPie.setOption({
                        title:[{
                            text:'卷宗总数\n\n' + count.toString(),
                            textStyle: {
                                fontSize: 22,
                                fontWeight: 'normal',
                                color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                            },
                            x: '29%',
                            y: '40%',
                            padding: 7,
                            textAlign: 'center',
                        }],
                        legend: {
                            data: newData,
                            formatter: function (name) {
                                for (let i = 0; i < newData.length; i++) {
                                    if (newData[i].name === name) {
                                        return `${name} ${newData[i].value}`;
                                    }
                                }
                            },
                        },
                        series: [
                            {
                                label: {
                                    normal: {
                                        formatter: ``,
                                    },
                                },
                                data: newData1,
                            },
                        ],
                    });
                }
            },
        });
    }

    // 获取物品出入库情况图表统计
    getDossierCRKCount(startTime, endTime, wpStatus, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'DossierData/DossierCRKDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                jzzt: wpStatus,
                orgcode,
            },
            callback: (data) => {
                this.setState({
                    wpStatus: wpStatus,
                });
                if (itemEchartpictorialBar && data) {
                    const newData = [];
                    const newData1 = [];
                    const data1 = data.list;
                    const dataShadow = [];
                    for (let a = 0; a < data1.length; a++) {
                        const legendData = data1[a].name;
                        const seriesData = {
                            name: data1[a].name,
                            value: data1[a].count,
                            code: data1[a].code,
                        };
                        newData.push(legendData);
                        newData1.push(seriesData);
                    }
                    let yMax = Math.max(...newData1);
                    if (yMax === 0) {
                        yMax += 100;
                    }
                    for (let i = 0; i < data1.length; i++) {
                        dataShadow.push({value: yMax, code: data1[i].code});
                    }
                    itemEchartpictorialBar.setOption({
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'none',
                            },
                            formatter: function (params) {
                                return params[0].name + ': ' + params[1].value;
                            },
                        },
                        xAxis: {
                            data: newData,
                        },
                        series: [
                            {
                                data: dataShadow,
                                barWidth: 10,
                            },
                            {
                                data: newData1,
                                barWidth: 10,
                            },
                        ],
                    });
                }
            },
        });
    }

    // 在库卷宗数量展示
    showCaseZKNumpie(startTime, endTime, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'DossierData/DossierZKNumDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgcode,
            },
            callback: (data) => {
                if (data) {
                    let total = 0;
                    const data1 = data.list;
                    for (let a = 0; a < data1.length; a++) {
                        total += data1[a].count;
                    }
                    this.setState({
                        ZkjzTotal: total,
                        ZkjzData: data1,
                    });
                }
            },
        });
    }
    //换行
    formatter = (val) => {
        let strs = val.split(''); //字符串数组
        let str = '';
        for (let i = 0, s; s = strs[i++];) { //遍历字符串数组
            str += s;
            if (!(i % 11)) str += '\n'; //按需要求余
        }
        return str;
    };
    // 卷宗趋势
    showCaseJzqspie(qsTime, orgcode = this.props.orgcode, sTime, eTime) {
      let aDate, oDate1, oDate2, iDays,typeLabel;
      if(sTime&&eTime){
        aDate = sTime.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为9-25-2017格式
        aDate = eTime.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)+1 // 把相差的毫秒数转换为天数
        if(iDays>=1&&iDays<=14){
          typeLabel = 'day'
        }
        else if(iDays>14&&iDays<=98){
          typeLabel = 'week'
        }
        else if(iDays>98&&iDays<=420){
          typeLabel = 'month'
        }
        else if(iDays>420&&iDays<=5110){
          typeLabel = 'year'
        }
        else {
          this.setState({
            wpqsNoData:true,
          })
          // message.info('时间过于久远，趋势数据无法查询')
          return false;
        }
      }

      let payload = {};
      if (qsTime === 'selectedDate') {
        payload = {
          kssj: sTime,
          jssj: eTime,
          orgcode,
          typeLabel:typeLabel,
        };
      }
      else if(qsTime === '6'||qsTime === '7'||qsTime === '8'){
        payload = {
          rqType: qsTime,
          orgcode,
          typeLabel:'week',
        };
      }
      else if(qsTime === '3'||qsTime === '4'||qsTime === '5'){
        payload = {
          rqType: qsTime,
          orgcode,
          typeLabel:'day',
        };
      }
      else{
        payload = {
          rqType: qsTime,
          orgcode,
        }
      }
        this.props.dispatch({
            type: 'DossierData/DossierJzqsDataView',
            payload,
            callback: (data) => {
                if (itemEchartwpqsBar && data) {
                    let newData = [];
                    let newData1 = [];
                    let newData2 = [];
                    if (data.list && data.list.length > 0) {
                        this.setState({
                            jzqsNoData: false,
                            typeLabel:qsTime === 'selectedDate'?typeLabel:qsTime === '6'||qsTime === '7'||qsTime === '8'?'week':'day',
                            qsTime:qsTime,
                        });
                        const data1 = data.list;
                        for (let a = 0; a < data1.length; a++) {
                            const legendData = this.formatter(data1[a].name);
                            const seriesData1 = data1[a].count1;
                            const seriesData2 = data1[a].count2;
                            newData1.push(seriesData1);
                            newData2.push(seriesData2);
                            newData.push(legendData);
                        }

                    } else {
                        // this.setState({
                        //     jzqsNoData: true,
                        // })
                        let momentMonth,dayArry;
                        if (qsTime === '6') {
                            momentMonth = moment();
                            dayArry = getDefaultDaysForMonth(momentMonth);
                        } else if (qsTime === '7') {
                            momentMonth = moment().subtract(1, 'months');
                            dayArry = getDefaultDaysForMonth(momentMonth);
                        } else if (qsTime === '8') {
                            momentMonth = moment().subtract(2, 'months');
                            dayArry = getDefaultDaysForMonth(momentMonth);
                        } else if (qsTime === '3') {
                            momentMonth = moment();
                            dayArry = getDefaultDaysForWeek(momentMonth);
                        } else if (qsTime === '4') {
                            momentMonth = moment().subtract(1, 'weeks');
                            dayArry = getDefaultDaysForWeek(momentMonth);
                        } else if (qsTime === '5') {
                            momentMonth = moment().subtract(2, 'weeks');
                            dayArry = getDefaultDaysForWeek(momentMonth);
                        } else if (qsTime === 'selectedDate'){
                          if(typeLabel === 'day'){
                            dayArry = getDefaultDays(sTime,eTime);
                          }else if(typeLabel === 'week'){
                            dayArry = getDefaultWeeks(sTime,eTime);
                          }else if(typeLabel === 'month'){
                            dayArry = getDefaultMonths(sTime,eTime);
                          }else if(typeLabel === 'year'){
                            dayArry = getDefaultYears(sTime,eTime);
                          }
                        }
                        newData1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        newData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        newData = dayArry;
                    }
                    const seriesDataAll = [
                        {
                            name: '在库',
                            type: 'line',
                            data: newData1,
                            itemStyle: {
                                color: '#FD0132',
                            },
                        },
                        {
                            name: '出库',
                            type: 'line',
                            data: newData2,
                            itemStyle: {
                                color: '#2A9DF6',
                            },
                        },
                    ];
                    itemEchartwpqsBar.setOption({
                        legend: {
                            data: ['在库', '出库'],
                            top: '5%',
                            right: '5%',
                            // data:[],
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: newData,
                        },
                        series: seriesDataAll,
                    });
                }
            },
        });
    }

    // 获取电子化情况展示统计
    getDossierDZHQKShow(startTime, endTime, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'DossierData/DossierDZHQKDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgcode,
            },
            callback: (data) => {
                if (itemEchartdzhqkPie && data) {
                    const newData = [];
                    const newData1 = [];
                    const data1 = data.list;
                    let count = 0;
                    for (let a = 1; a < data1.length; a++) {
                        const legendData = {
                            name: data1[a].name,
                            icon: 'circle',
                            value: data1[a].count,
                        };
                        const seriesData = {
                            name: data1[a].name,
                            value: data1[a].count,
                            itemStyle: {
                                color: colors2[a - 1],
                            },
                        };
                        newData.push(legendData);
                        newData1.push(seriesData);
                        count = parseInt(data1[0].count);
                    }
                    ;
                    itemEchartdzhqkPie.setOption({
                        title:[{
                            text:'总数\n\n' + count.toString(),
                            textStyle: {
                                fontSize: 22,
                                fontWeight: 'normal',
                                color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                            },
                            x: '29%',
                            y: '40%',
                            padding: 7,
                            textAlign: 'center',
                        }],
                        legend: {
                            data: newData,
                            formatter: function (name) {
                                for (let i = 0; i < newData.length; i++) {
                                    if (newData[i].name === name) {
                                        return `${name} ${newData[i].value}`;
                                    }
                                }
                            },
                        },
                        series: [
                            {
                                label: {
                                    normal: {
                                        formatter: ``,
                                    },
                                },
                                data: newData1,
                            },
                        ],
                    });
                }
            },
        });
    }

    // 本、昨、前change
    changeCountButtonCurrent = (type) => {
        const {searchType} = this.props;
        let currentType = '';
        let rqtype = '';
        if (type === 'now') {
            currentType = searchType === 'week' ? 'week' : 'month';
            rqtype = currentType === 'week' ? '3' : '6';
        } else if (type === 'last') {
            currentType = searchType === 'week' ? 'lastWeek' : 'lastMonth';
            rqtype = currentType === 'lastWeek' ? '4' : '7';
        } else if (type === 'beforeLast') {
            currentType = searchType === 'week' ? 'beforeLastWeek' : 'beforeLastMonth';
            rqtype = currentType === 'beforeLastWeek' ? '5' : '8';
        }

        const weekTypeTime = this.getTime(currentType);
        this.setState({
            currentType,
            TypeTime: weekTypeTime,
            showrkDataView: true,
            type,
        });
        this.getDossierNumCount(weekTypeTime[0], weekTypeTime[1]);
        this.getDossierCRKCount(weekTypeTime[0], weekTypeTime[1], '3');
        this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1]);
        this.showCaseJzqspie(rqtype);
        this.getDossierDZHQKShow(weekTypeTime[0], weekTypeTime[1]);
    };
    // 物品出入库情况柱状图
    showCaseEchartBar = (nextProps) => {
        itemEchartpictorialBar = echarts.init(document.getElementById('jzcrkqk'));
        const option = {
            title: {
                // text: '卷宗在库情况',
                // textStyle: {
                //     fontSize: 16,
                //     fontWeight: 'normal',
                // },
            },
            xAxis: {
                // data: newData,
                data: [],
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    },
                    // rotate: 30,
                    interval: 0,
                    formatter: value => this.insertFlg(value, '\n', 6),
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                z: 10,
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            yAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    },
                },
            },
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {color: 'rgba(0,0,0,0)'},
                        emphasis: {color: 'rgba(0,0,0,0.05)'},
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    // data: dataShadow,
                    data: [],
                    animation: false,
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: ['#1EB8CE'],
                        },
                        emphasis: {
                            color: ['#1EB8CE'],
                        },
                    },
                    // data: newData1,
                    data: [],
                },
            ],
        };
        itemEchartpictorialBar.setOption(option, true);
        let that = this;
        itemEchartpictorialBar.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({jzlb: params.data.code, cczt: that.state.wpStatus}, dataTime);
        });
    };
    // 入库出库切换
    changeRkListPageHeader = () => {
        const {showrkDataView, TypeTime} = this.state;
        this.setState({
            showrkDataView: !showrkDataView,
        });
        // const weekTypeTime = this.getTime('week');
        if (showrkDataView) {
            this.getDossierCRKCount(TypeTime[0], TypeTime[1], '1');
        } else {
            this.getDossierCRKCount(TypeTime[0], TypeTime[1], '3');
        }
    };
    goList = (name) => {
        const {currentType} = this.state;
        const dataTime = currentType === 'selectedDate' ? this.props.selectedDateVal : this.getTime(currentType);
        this.props.changeToListPage({szkf: name, cczt: '3'}, dataTime);
    };
    // 字符串指定位置插入字符： flag：字符；sn：位置
    insertFlg = (str, flg, sn) => {
      let newstr = '';
      for (let i = 0; i < str.length; i += sn) {
        const tmp = str.substring(i, i + sn);
        newstr += tmp + flg;
      }
      return newstr;
    };
    // 卷宗趋势
    showCaseEchartRingPie = (nextProps) => {
        itemEchartwpqsBar = echarts.init(document.getElementById('jzqs'));
        const option = {
            title: {
                // text: '卷宗趋势',
                // textStyle: {
                //     fontSize: 16,
                //     fontWeight: 'normal',
                // },
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                // data:['邮件营销','联盟广告'],
                data: [],
                textStyle: {
                    color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['周一','周二','周三','周四','周五','周六','周日']
                data: [],
                axisLabel: {
                  textStyle: {
                      color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                  },
                  interval:0,
                  formatter: value => this.insertFlg(value, '\n', 11),
                  // formatter:function(value,index) {
                  //   let ret = "";//拼接加\n返回的类目项
                  //   const maxLength = 5;//每项显示文字个数
                  //   const valLength = value.length;//X轴类目项的文字个数
                  //   const rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                  //   if (rowN > 1)//如果类目项的文字大于3,
                  //   {
                  //     for (let i = 0; i < rowN; i++) {
                  //       const temp = "";//每次截取的字符串
                  //       const start = i * maxLength;//开始截取的位置
                  //       const end = start + maxLength;//结束截取的位置
                  //       //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  //       temp = value.substring(start, end) + "\n";
                  //       ret += temp; //凭借最终的字符串
                  //     }
                  //     return ret;
                  //   }
                  //   else {
                  //     return value;
                  //   }
                  // },
                },

            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    },
                },
            },
            series: [],
        };
        itemEchartwpqsBar.setOption(option, true);
        let that = this;
        itemEchartwpqsBar.on('click', function (params) {
          const {typeLabel,qsTime} = that.state;
          let dataTime = [];
          if(qsTime==='selectedDate'&&typeLabel === 'day'&&params.name){
            dataTime=[params.name,params.name]
          }
          else if(qsTime==='selectedDate'&&typeLabel === 'week'&&params.name){
            dataTime=[params.name.split('~')[0],params.name.split('~')[1]]
          }
          else if(qsTime==='selectedDate'&&typeLabel === 'month'&&params.name){
            const newDate = params.name.replace(new RegExp('-','g'),"/")
            const endDate = new Date(newDate); //date 是需要传递的时间如：2018-08
            const month=endDate.getMonth();
            const nextMonth=month+1;
            const nextMonthFirstDay=new Date(endDate.getFullYear(),nextMonth,1);
            const oneDay=1000*60*60*24;
            const dateString=new Date(nextMonthFirstDay-oneDay);
            const dateTimeEnd=dateString.toLocaleDateString().replace(new RegExp('/','g'),"-");
            dataTime=[params.name+'-01',dateTimeEnd]
          }
          else if(qsTime==='selectedDate'&&typeLabel === 'year'&&params.name){
            dataTime=[params.name+'-01-01',params.name+'-12-31']
          }
          else if(qsTime!=='selectedDate'){
            dataTime=[params.name,params.name]
          }
            that.props.changeToListPage({cczt: params.seriesName && params.seriesName === '出库' ? '1' : '3'}, dataTime);
        });
    };
    // 卷宗数量展示
    showCaseEchartwpqsBar = (nextProps) => {
        itemEchartRingPie = echarts.init(document.getElementById('jzslzs'));
        const option = {
            title: {
                // text: '卷宗数量展示',
                // textStyle: {
                //     fontSize: 16,
                //     fontWeight: 'normal',
                // },
                // padding: 8,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: '7%',
                top: 60,
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 25,
                selectedMode:false, // 点击
                textStyle: {
                    color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    fontSize: 16,
                    lineHeight: 24,
                },
                data: [],
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '',
                            textStyle: {
                                fontSize: '22',
                                // fontWeight: 'bold',
                                color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                            },
                        },
                        emphasis: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data: [],
                },
            ],
        };
        itemEchartRingPie.setOption(option, true);
        let that = this;
        itemEchartRingPie.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({cczt: params.name === '出库' ? '1' : params.name === '在库' ? '3' : params.name}, dataTime);
        });
    };
    // 电子化情况展示
    showCaseEchartdzhqkzsBar = (nextProps) => {
        itemEchartdzhqkPie = echarts.init(document.getElementById('dzhqkzs'));
        const option = {
            title: {
                // text: '电子化情况展示',
                // textStyle: {
                //     fontSize: 16,
                //     fontWeight: 'normal',
                // },
                // padding: 8,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: '7%',
                top: 60,
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 25,
                selectedMode: false, // 点击
                textStyle: {
                    color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    fontSize: 16,
                    lineHeight: 24,
                },
                data: [],
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '',
                            textStyle: {
                                fontSize: '22',
                                // fontWeight: 'bold',
                                color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                            },
                        },
                        emphasis: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data: [],
                },
            ],
        };
        itemEchartdzhqkPie.setOption(option, true);
        let that = this;
        itemEchartdzhqkPie.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({
                dzh: params.name === '有电子卷' ? '1' : params.name === '无电子卷' ? '0' : params.name,
                timeName: 'ljsj',
            }, dataTime);
        });
    };

    render() {
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, lg: 24, xl: 8, xxl: 8};
        const colLayout1 = {sm: 24, lg: 24};
        const colLayout2 = {sm: 24, lg: 8};
        const {searchType, selectedDateVal, showDataView} = this.props;
        const {currentType, ZkjzData, ZkjzTotal, showrkDataView, jzqsNoData, selectedDateData} = this.state;
        let className = this.props.global && this.props.global.dark ? styles.policeDataCard : styles.policeDataCard + ' ' + styles.lightBox;
        return (
            <Card style={{position: 'relative'}} className={className}>
                <div className={styles.ItemDataView} style={showDataView ? {} : {position: 'absolute', zIndex: -1}}>
                    {
                        currentType !== 'selectedDate' ? (
                            <div className={styles.viewCount}>
                                <div
                                    className={(currentType === 'week' || currentType === 'month') ? styles.countButtonCurrent : styles.countButton}
                                    onClick={() => this.changeCountButtonCurrent('now')}
                                >
                                    {
                                        searchType === 'week' ? <DataViewDateShow dataTypeStr='本周'/> :
                                            <DataViewDateShow dataTypeStr='本月'/>
                                    }
                                </div>
                                <div
                                    className={(currentType === 'lastWeek' || currentType === 'lastMonth') ? styles.countButtonCurrent : styles.countButton}
                                    onClick={() => this.changeCountButtonCurrent('last')}
                                >
                                    {
                                        searchType === 'week' ? <DataViewDateShow dataTypeStr='前一周'/> :
                                            <DataViewDateShow dataTypeStr='前一月'/>
                                    }
                                </div>
                                <div
                                    className={(currentType === 'beforeLastWeek' || currentType === 'beforeLastMonth') ? styles.countButtonCurrent : styles.countButton}
                                    onClick={() => this.changeCountButtonCurrent('beforeLast')}
                                >
                                    {
                                        searchType === 'week' ? <DataViewDateShow dataTypeStr='前二周'/> :
                                            <DataViewDateShow dataTypeStr='前二月'/>
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className={styles.viewCount}>
                                <div className={styles.countButtonCurrent}>
                                    <div className={styles.countButtonTitle}>
                                        <div>{selectedDateVal[0]}</div>
                                        <div style={{lineHeight: '6px'}}>~</div>
                                        <div>{selectedDateVal[1]}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div style={{
                        backgroundColor: this.props.global && this.props.global.dark ? '#252c3c' : '#fff',
                        padding: '0 16px',
                        borderRadius: 10
                    }}>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}>
                                  <span
                                    style={{
                                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                                        paddingLeft: 10,
                                    }}>卷宗数量展示</span>
                                </div>
                                <div id="jzslzs" className={styles.cardBox} ></div>
                            </Col>

                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}><span
                                    style={{
                                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                                        paddingLeft: 10,
                                    }}
                                >在库卷宗数量展示</span></div>
                                <div className={styles.cardBoxzk} style={{padding: '10px 5px'}}>
                                    {ZkjzData.length > 0 ?
                                        <div>
                                            <Row gutter={rowLayout}>
                                                {/*<Col sm={24} lg={24} style={{*/}
                                                {/*fontSize: 16,*/}
                                                {/*marginBottom: 20,*/}
                                                {/*paddingTop: 18,*/}
                                                {/*paddingLeft: 28,*/}
                                                {/*}}>在库卷宗数量展示</Col>*/}
                                            </Row>
                                            {ZkjzData.map((item) =>
                                                <div onClick={() => this.goList(item.name)} style={{cursor: 'pointer'}}>
                                                    <div className={styles.progressName}>{item.name}</div>
                                                    <div className={styles.progressCount}>
                                                        <Tooltip title={item.name + ':' + item.count}>
                                                            <Progress
                                                                percent={Math.round((item.count / ZkjzTotal) * 100)}
                                                                status="active" format={percent => `${percent}%`}
                                                                strokeColor={'#2092fb'} strokeWidth={16}/>
                                                        </Tooltip>
                                                    </div>
                                                </div>,
                                            )}
                                        </div>
                                        :
                                        <div style={{padding: 16}}>
                                            {/*<div style={{ fontSize: 16, paddingTop: 2, color: 'rgba(0,0,0,0.85)' }}>在库卷宗数量展示*/}
                                            {/*</div>*/}
                                            <div style={{
                                                height: '100%',
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                marginTop: this.props.global && this.props.global.dark ? 60 : 0,
                                            }}>
                                                <img
                                                    src={this.props.global && this.props.global.dark ? nonDivImg : noListLight}
                                                    height={this.props.global && this.props.global.dark ? 100 : 200} alt="暂无数据"/>
                                                <div style={{
                                                    fontSize: 18,
                                                    color: this.props.global && this.props.global.dark ? '#fff' : '#999',
                                                }}>暂无数据
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Col>
                            <Col {...colLayout}>
                              <div className={styles.cardBoxTitle}><span
                                style={{
                                  borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                                  paddingLeft: 10,
                                }}
                              >电子化情况展示</span></div>
                              <div id="dzhqkzs" className={styles.cardBox} ></div>
                            </Col>
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                          <Col {...colLayout1}>
                            <div className={styles.listPageWrap} style={{top: 52}}>
                              <div className={styles.listPageHeader}>
                                {
                                  showrkDataView ? (
                                    <a className={styles.listPageHeaderCurrent}>在库</a>
                                  ) : (
                                    <a className={styles.UnlistPageHeaderCurrent}
                                       onClick={this.changeRkListPageHeader}>在库</a>
                                  )
                                }
                                <span>|</span>
                                {
                                  showrkDataView ? (
                                    <a className={styles.UnlistPageHeaderCurrent}
                                       onClick={this.changeRkListPageHeader}>出库</a>
                                  ) : (
                                    <a className={styles.listPageHeaderCurrent}>出库</a>
                                  )
                                }
                              </div>
                            </div>
                            <div className={styles.cardBoxTitle}><span
                              style={{
                                borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                                paddingLeft: 10,
                              }}
                            >卷宗在库情况</span></div>
                            <div id="jzcrkqk" className={styles.cardBox} style={{ width: '98.5%', marginLeft: '0.7%' }}></div>
                          </Col>
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout1} style={{marginBottom: 32}}>
                                <div className={styles.cardBoxTitle}><span
                                    style={{
                                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                                        paddingLeft: 10,
                                    }}
                                >卷宗趋势</span></div>
                                <div id="jzqs" className={styles.cardBox} style={{ width: '98.5%', marginLeft: '0.7%' }}></div>
                                {
                                    jzqsNoData ? (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            padding: 16,
                                        }}>
                                            <div style={{fontSize: 16, padding: '8px 0 0 8px'}}>卷宗趋势</div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}>
                                                <img
                                                    src={this.props.global && this.props.global.dark ? nonDivImg : noListLight}
                                                    alt="暂无数据" height={200}/>
                                                <div style={{
                                                    fontSize: 18,
                                                    color: this.props.global && this.props.global.dark ? '#fff' : '#999'
                                                }}>暂无数据
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </Col>
                        </Row>

                    </div>
                </div>
            </Card>
        );
    }
}
