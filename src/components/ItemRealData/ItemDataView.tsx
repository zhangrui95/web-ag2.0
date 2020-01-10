/*
 * ItemDataView.js 涉案物品数据展示
 * author：jhm
 * 20181112
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
// import datastyles from '../Styles/dataView.less';
import {getDefaultDaysForMonth, getTimeDistance} from '../../utils/utils';
import DataViewDateShow from '../Common/DataViewDateShow';
import {MiniProgress, ChartCard} from 'ant-design-pro/lib/Charts';
import nonDivImg from '../../assets/viewData/nonData.png';
import {connect} from "dva";
import noListLight from "@/assets/viewData/noListLight.png";
import {getDefaultDaysForWeek} from "@/utils/utils";

let itemEchartpictorialBar;
let itemEchartRingPie;
let itemEchartwpqsBar;
const colors1 = ['#0099FF', '#33CC00', '#FF3300', '#9933FF', '#33CBCC'];
@connect(({global}) => ({
    global
}))
export default class ItemDataView extends PureComponent {
    state = {
        currentType: 'week',
        type: 'now',
        ZkwpData: [],
        ZkwpTotal: '',
        showrkDataViewDJ: true, // 控制物品出入库情况登记状态选择；true为选中状态，false为未选中状态
        showrkDataViewZK: false, // 控制物品出入库情况在库状态选择；true为选中状态，false为未选中状态
        showrkDataViewDY: false, // 控制物品出入库情况调用状态选择；true为选中状态，false为未选中状态
        showrkDataViewYS: false, // 控制物品出入库情况移送状态选择；true为选中状态，false为未选中状态
        showrkDataViewCZ: false, // 控制物品出入库情况处置状态选择；true为选中状态，false为未选中状态
        showrkDataViewYCCK: false, // 控制物品出入库情况异常出库状态选择；true为选中状态，false为未选中状态
        TypeTime: [
            moment(getTimeDistance('week')[0]).format('YYYY-MM-DD'),
            getTimeDistance('week')[1].format('YYYY-MM-DD'),
        ], // 请求数据的时间
        wpqsNoData: false, // 物品趋势无数据
        selectedDateData: 0, // 头部统计警情总数——手动选择日期
        typeLabel: '', // 通过时间判断趋势是什么类型；'天','周','月','年'
        qsTime: '', // 确认点击的是本周、前一周、前两周还是本月、前一月、前两月
    };

    componentDidMount() {
        this.showCaseEchartBar(this.props);
        this.showCaseEchartRingPie(this.props);
        this.showCaseEchartwpqsBar(this.props);
        window.addEventListener('resize', itemEchartpictorialBar.resize);
        window.addEventListener('resize', itemEchartRingPie.resize);
        window.addEventListener('resize', itemEchartwpqsBar.resize);
        const weekTypeTime = this.getTime(this.props.searchType);
        this.getItemNumCount(weekTypeTime[0], weekTypeTime[1]);
        this.getItemCRKCount(weekTypeTime[0], weekTypeTime[1], '登记');
        this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1]);
        this.showCaseWpqspie('3');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (this.props.global.dark !== nextProps.global.dark) {
                this.showCaseEchartBar(nextProps);
                this.showCaseEchartRingPie(nextProps);
                this.showCaseEchartwpqsBar(nextProps);
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
            if (
                this.props.searchType !== nextProps.searchType ||
                this.props.orgcode !== nextProps.orgcode ||
                this.props.selectedDateVal !== nextProps.selectedDateVal ||
                this.props.global.dark !== nextProps.global.dark
            ) {
                currentType = currentType ? currentType : this.state.currentType;
                if (nextProps.searchType === 'week') {
                    this.setState({
                        TypeTime: [
                            moment(getTimeDistance(currentType)[0]).format('YYYY-MM-DD'),
                            getTimeDistance(currentType)[1].format('YYYY-MM-DD'),
                        ], // 请求数据的时间
                        showrkDataViewDJ: true,
                        showrkDataViewZK: false,
                        showrkDataViewDY: false,
                        showrkDataViewYS: false,
                        showrkDataViewCZ: false,
                        showrkDataViewYCCK: false,
                    });
                    const weekTypeTime = this.getTime(currentType);
                    this.getItemNumCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getItemCRKCount(weekTypeTime[0], weekTypeTime[1], '登记', nextProps.orgcode);
                    this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.showCaseWpqspie('3', nextProps.orgcode);
                } else if (nextProps.searchType === 'month') {
                    this.setState({
                        TypeTime: [
                            moment(getTimeDistance(currentType)[0]).format('YYYY-MM-DD'),
                            getTimeDistance(currentType)[1].format('YYYY-MM-DD'),
                        ], // 请求数据的时间
                        showrkDataViewDJ: true,
                        showrkDataViewZK: false,
                        showrkDataViewDY: false,
                        showrkDataViewYS: false,
                        showrkDataViewCZ: false,
                        showrkDataViewYCCK: false,
                    });
                    const monthTypeTime = this.getTime(currentType);
                    this.getItemNumCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getItemCRKCount(monthTypeTime[0], monthTypeTime[1], '登记', nextProps.orgcode);
                    this.showCaseZKNumpie(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.showCaseWpqspie('6', nextProps.orgcode);
                } else if (nextProps.searchType === 'selectedDate') {
                    this.setState(
                        {
                            TypeTime: nextProps.selectedDateVal, // 请求数据的时间
                            showrkDataViewDJ: true,
                            showrkDataViewZK: false,
                            showrkDataViewDY: false,
                            showrkDataViewYS: false,
                            showrkDataViewCZ: false,
                            showrkDataViewYCCK: false,
                        },
                        function () {
                            const {selectedDateVal} = nextProps;
                            this.getItemNumCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.getItemCRKCount(
                                selectedDateVal[0],
                                selectedDateVal[1],
                                '登记',
                                nextProps.orgcode,
                            );
                            this.showCaseZKNumpie(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.showCaseWpqspie(
                                'selectedDate',
                                nextProps.orgcode,
                                selectedDateVal[0],
                                selectedDateVal[1],
                            );
                        },
                    );
                }
            }
        }
    }

    getTime = type => {
        const time = getTimeDistance(type);
        const startTime = time && time [0] ? moment(time[0]).format('YYYY-MM-DD') : '';
        const endTime = time && time[1] ? moment(time[1]).format('YYYY-MM-DD') : '';
        return [startTime, endTime];
    };

    // 获取涉案物品数量图表统计
    getItemNumCount(startTime, endTime, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'itemData/itemDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgcode,
                sjbb: window.configUrl.is_sawpbb,
            },
            callback: data => {
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
                    itemEchartRingPie.setOption({
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
                        title:[{
                            text:'物品总数\n\n' + count.toString(),
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
                        series: [
                            {
                                label: {
                                    normal: {
                                        formatter: ``,
                                    },
                                    textStyle: {
                                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
                                    }
                                },
                                data: newData1,
                            },
                        ],
                    });
                }
            },
        });
    }

    // 获取涉案物品出入库情况图表统计
    getItemCRKCount(startTime, endTime, wpStatus, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'itemData/itemCRKDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                wpzt: wpStatus,
                sjbb: window.configUrl.is_sawpbb,
                orgcode,
            },
            callback: data => {
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
                            code: a + 1,
                        };
                        newData.push(legendData);
                        newData1.push(seriesData);
                    }
                    let yMax = Math.max(...newData1);
                    if (yMax === 0) {
                        yMax += 100;
                    }
                    for (let i = 0; i < data1.length; i++) {
                        dataShadow.push({value: yMax, code: i + 1});
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
                            },
                            {
                                data: newData1,
                            },
                        ],
                    });
                }
            },
        });
    }

    // 在库物品数量展示
    showCaseZKNumpie(startTime, endTime, orgcode = this.props.orgcode) {
        this.props.dispatch({
            type: 'itemData/itemZKNumDataView',
            payload: {
                kssj: startTime,
                jssj: endTime,
                sjbb: window.configUrl.is_sawpbb,
                orgcode,
            },
            callback: data => {
                if (data) {
                    let total = 0;
                    const data1 = data.list;
                    for (let a = 0; a < data1.length; a++) {
                        total += data1[a].count;
                    }
                    this.setState({
                        ZkwpTotal: total,
                        ZkwpData: data1,
                    });
                }
            },
        });
    }

    // 物品趋势
    showCaseWpqspie(qsTime, orgcode = this.props.orgcode, sTime, eTime) {
        let aDate, oDate1, oDate2, iDays, typeLabel;
        if (sTime && eTime) {
            aDate = sTime.split('-');
            oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); // 转换为9-25-2017格式
            aDate = eTime.split('-');
            oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1; // 把相差的毫秒数转换为天数
            if (iDays >= 1 && iDays <= 14) {
                typeLabel = 'day';
            } else if (iDays > 14 && iDays <= 98) {
                typeLabel = 'week';
            } else if (iDays > 98 && iDays <= 420) {
                typeLabel = 'month';
            } else if (iDays > 420 && iDays <= 5110) {
                typeLabel = 'year';
            } else {
                this.setState({
                    wpqsNoData: true,
                });
                // message.info('时间过于久远，趋势数据无法查询')
                return false;
            }
        }

        let payload = {};
        if (qsTime === 'selectedDate') {
            payload = {
                kssj: sTime,
                jssj: eTime,
                sjbb: window.configUrl.is_sawpbb,
                orgcode,
                typeLabel: typeLabel,
            };
        } else if (qsTime === '6' || qsTime === '7' || qsTime === '8') {
            payload = {
                rqType: qsTime,
                sjbb: window.configUrl.is_sawpbb,
                orgcode,
                typeLabel: 'week',
            };
        } else if (qsTime === '3' || qsTime === '4' || qsTime === '5') {
            payload = {
                rqType: qsTime,
                sjbb: window.configUrl.is_sawpbb,
                orgcode,
                typeLabel: 'day',
            };
        } else {
            payload = {
                rqType: qsTime,
                sjbb: window.configUrl.is_sawpbb,
                orgcode,
            };
        }
        this.props.dispatch({
            type: 'itemData/itemWpqsDataView',
            payload,
            callback: data => {
                if (itemEchartwpqsBar && data) {
                    let newData = [];
                    let newData1 = [];
                    let newData2 = [];
                    let newData3 = [];
                    let newData4 = [];
                    let newData5 = [];
                    let newData6 = [];
                    if (data.list && data.list.length > 0) {
                        // console.log('data---', data);
                        this.setState({
                            wpqsNoData: false,
                            typeLabel:
                                qsTime === 'selectedDate'
                                    ? typeLabel
                                    : qsTime === '6' || qsTime === '7' || qsTime === '8'
                                    ? 'week'
                                    : 'day',
                            qsTime: qsTime,
                        });

                        const data1 = data.list;
                        for (let a = 0; a < data1.length; a++) {
                            const legendData = data1[a].name;
                            const seriesData1 = data1[a].count1;
                            const seriesData2 = data1[a].count2;
                            const seriesData3 = data1[a].count3;
                            const seriesData4 = data1[a].count4;
                            const seriesData5 = data1[a].count5;
                            const seriesData6 = data1[a].count6;
                            newData1.push(seriesData1);
                            newData2.push(seriesData2);
                            newData3.push(seriesData3);
                            newData4.push(seriesData4);
                            newData5.push(seriesData5);
                            newData6.push(seriesData6);
                            newData.push(legendData);
                        }
                    }
                    else {
                        // this.setState({
                        //     wpqsNoData: true,
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
                      }
                        // const dayArry = getDefaultDaysForMonth(momentMonth);
                        newData1 = [0, 0, 0, 0, 0, 0, 0];
                        newData2 = [0, 0, 0, 0, 0, 0, 0];
                        newData3 = [0, 0, 0, 0, 0, 0, 0];
                        newData4 = [0, 0, 0, 0, 0, 0, 0];
                        newData5 = [0, 0, 0, 0, 0, 0, 0];
                        newData6 = [0, 0, 0, 0, 0, 0, 0];
                        newData = dayArry;
                    }
                    const seriesDataAll = [
                        {
                            name: '登记',
                            type: 'line',
                            // stack: '总量',
                            data: newData1,
                            itemStyle: {
                                color: '#0099FF',
                            },
                        },
                        {
                            name: '在库',
                            type: 'line',
                            // stack: '总量',
                            data: newData2,
                            itemStyle: {
                                color: '#33CC00',
                            },
                        },
                        {
                            name: '调用',
                            type: 'line',
                            // stack: '总量',
                            data: newData3,
                            itemStyle: {
                                color: '#FF3300',
                            },
                        },
                        {
                            name: '移送',
                            type: 'line',
                            // stack: '总量',
                            data: newData4,
                            itemStyle: {
                                color: '#9933FF',
                            },
                        },
                        {
                            name: '处置',
                            type: 'line',
                            // stack: '总量',
                            data: newData5,
                            itemStyle: {
                                color: '#33CBCC',
                            },
                        },
                        {
                            name: '异常出库',
                            type: 'line',
                            // stack: '总量',
                            data: newData6,
                            itemStyle: {
                                color: '#C23531',
                            },
                        },
                    ];
                    itemEchartwpqsBar.setOption({
                        legend: {
                            data: ['登记', '在库', '调用', '移送', '处置', '异常出库'],
                            top: '5%',
                            right: '15%',
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

    // 本、昨、前change
    changeCountButtonCurrent = type => {
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
            showrkDataViewDJ: true,
            showrkDataViewZK: false,
            showrkDataViewDY: false,
            showrkDataViewYS: false,
            showrkDataViewCZ: false,
            showrkDataViewYCCK: false,
            type,
        });
        this.getItemNumCount(weekTypeTime[0], weekTypeTime[1]);
        this.getItemCRKCount(weekTypeTime[0], weekTypeTime[1], '登记');
        this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1]);
        this.showCaseWpqspie(rqtype);
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

    // 物品出入库情况柱状图
    showCaseEchartBar = (nextProps) => {
        itemEchartpictorialBar = echarts.init(document.getElementById('wpcrkqk'));
        const option = {
            title: {
                // text: '物品出入库情况',
                // textStyle: {
                //   fontSize: 16,
                //   fontWeight: 'normal',
                // },
            },
            xAxis: {
                // data: dataAxis,
                data: [],
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    },
                    // rotate: 10,
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
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'},
                            ]),
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'},
                            ]),
                        },
                    },
                    // data:  data,
                    data: [],
                },
            ],
        };
        itemEchartpictorialBar.setOption(option, true);
        let that = this;
        itemEchartpictorialBar.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime =
                currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage(
                {
                    // wplx: params.data ? params.data.code.toString() : '',
                    wplx: params.data ? params.data.name : '',
                    wpzt: that.state.showrkDataViewDJ
                        ? '登记'
                        : that.state.showrkDataViewZK
                            ? '在库'
                            : that.state.showrkDataViewDY
                                ? '调用'
                                : that.state.showrkDataViewYS
                                    ? '移送'
                                    : that.state.showrkDataViewCZ
                                        ? '处置'
                                        : that.state.showrkDataViewYCCK
                                            ? '异常出库'
                                            : '',
                },
                dataTime,
            );
        });
    };
    // 入库出库各种状态切换
    changeRkListPageHeader = zt => {
        // showrkDataViewDJ: true,
        // showrkDataViewZK: false,
        // showrkDataViewDY: false,
        // showrkDataViewYS: false,
        // showrkDataViewCZ: false,
        // showrkDataViewYCCK: false,

        const {
            showrkDataViewZK,
            showrkDataViewDY,
            showrkDataViewYS,
            showrkDataViewCZ,
            showrkDataViewYCCK,
            TypeTime,
        } = this.state;
        this.setState({
            showrkDataViewDJ: zt === 'dj' ? true : false,
            showrkDataViewZK: zt === 'zk' ? true : false,
            showrkDataViewDY: zt === 'dy' ? true : false,
            showrkDataViewYS: zt === 'ys' ? true : false,
            showrkDataViewCZ: zt === 'cz' ? true : false,
            showrkDataViewYCCK: zt === 'ycck' ? true : false,
        });
        // const weekTypeTime = this.getTime('week');
        if (zt === 'dj') {
            this.getItemCRKCount(TypeTime[0], TypeTime[1], '登记');
        } else if (zt === 'zk') {
            this.getItemCRKCount(TypeTime[0], TypeTime[1], '在库');
        } else if (zt === 'dy') {
            this.getItemCRKCount(TypeTime[0], TypeTime[1], '调用');
        } else if (zt === 'ys') {
            this.getItemCRKCount(TypeTime[0], TypeTime[1], '移送');
        } else if (zt === 'cz') {
            this.getItemCRKCount(TypeTime[0], TypeTime[1], '处置');
        } else if (zt === 'ycck') {
            this.getItemCRKCount(TypeTime[0], TypeTime[1], '异常出库');
        }
    };
    // 物品趋势
    showCaseEchartRingPie = (nextProps) => {
        itemEchartwpqsBar = echarts.init(document.getElementById('wpqs'));
        const option = {
            title: {
                // text: '物品趋势',
                // textStyle: {
                //   fontSize: 16,
                //   fontWeight: 'normal',
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
                    fontSize: 16,
                    // lineHeight: 24,
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
            const {typeLabel, qsTime} = that.state;
            let dataTime = [];
            if (qsTime === 'selectedDate' && typeLabel === 'day' && params.name) {
                dataTime = [params.name, params.name];
            } else if (qsTime === 'selectedDate' && typeLabel === 'week' && params.name) {
                dataTime = [params.name.split('~')[0], params.name.split('~')[1]];
            } else if (qsTime === 'selectedDate' && typeLabel === 'month' && params.name) {
                const newDate = params.name.replace(new RegExp('-', 'g'), '/');
                const endDate = new Date(newDate); //date 是需要传递的时间如：2018-08
                const month = endDate.getMonth();
                const nextMonth = month + 1;
                const nextMonthFirstDay = new Date(endDate.getFullYear(), nextMonth, 1);
                const oneDay = 1000 * 60 * 60 * 24;
                const dateString = new Date(nextMonthFirstDay - oneDay);
                const dateTimeEnd = dateString.toLocaleDateString().replace(new RegExp('/', 'g'), '-');
                dataTime = [params.name + '-01', dateTimeEnd];
            } else if (qsTime === 'selectedDate' && typeLabel === 'year' && params.name) {
                dataTime = [params.name + '-01-01', params.name + '-12-31'];
            } else if (qsTime !== 'selectedDate') {
                dataTime = [params.name, params.name];
            }

            that.props.changeToListPage({wpzt: params.seriesName ? params.seriesName : ''}, dataTime);
        });
    };
    // 物品数量展示
    showCaseEchartwpqsBar = (nextProps) => {
        itemEchartRingPie = echarts.init(document.getElementById('wpslzs'));
        const option = {
            title: {
                // text: '物品数量展示',
                // textStyle: {
                //   fontSize: 16,
                //   fontWeight: 'normal',
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
                top: 40,
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
        itemEchartRingPie.setOption(option, true);
        let that = this;
        itemEchartRingPie.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime =
                currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({wpzt: params.name, timeName: 'rksj'}, dataTime);
        });
    };

    render() {
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, lg: 24, xl: 12, xxl: 12};
        const colLayout1 = {sm: 24, lg: 24};
        const {searchType, selectedDateVal, showDataView} = this.props;
        const {
            currentType,
            ZkwpData,
            ZkwpTotal,
            showrkDataViewDJ,
            showrkDataViewZK,
            showrkDataViewDY,
            showrkDataViewYS,
            showrkDataViewCZ,
            showrkDataViewYCCK,
            wpqsNoData,
            selectedDateData,
        } = this.state;
        let className = this.props.global && this.props.global.dark ? styles.policeDataCard : styles.policeDataCard + ' ' + styles.lightBox;
        return (
            <Card style={{position: 'relative'}} className={className}>
                <div className={styles.ItemDataView} style={showDataView ? {} : {position: 'absolute', zIndex: -1}}>
                    {currentType !== 'selectedDate' ? (
                        <div className={styles.viewCount}>
                            <div
                                className={
                                    currentType === 'week' || currentType === 'month'
                                        ? styles.countButtonCurrent
                                        : styles.countButton
                                }
                                onClick={() => this.changeCountButtonCurrent('now')}
                            >
                                {searchType === 'week' ? (
                                    <DataViewDateShow dataTypeStr="本周"/>
                                ) : (
                                    <DataViewDateShow dataTypeStr="本月"/>
                                )}
                            </div>
                            <div
                                className={
                                    currentType === 'lastWeek' || currentType === 'lastMonth'
                                        ? styles.countButtonCurrent
                                        : styles.countButton
                                }
                                onClick={() => this.changeCountButtonCurrent('last')}
                            >
                                {searchType === 'week' ? (
                                    <DataViewDateShow dataTypeStr="前一周"/>
                                ) : (
                                    <DataViewDateShow dataTypeStr="前一月"/>
                                )}
                            </div>
                            <div
                                className={
                                    currentType === 'beforeLastWeek' || currentType === 'beforeLastMonth'
                                        ? styles.countButtonCurrent
                                        : styles.countButton
                                }
                                onClick={() => this.changeCountButtonCurrent('beforeLast')}
                            >
                                {searchType === 'week' ? (
                                    <DataViewDateShow dataTypeStr="前二周"/>
                                ) : (
                                    <DataViewDateShow dataTypeStr="前二月"/>
                                )}
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
                    )}
                    <div style={{
                        backgroundColor: this.props.global && this.props.global.dark ? '#252c3c' : '#fff',
                        padding: '0 16px',
                        borderRadius: 10
                    }}>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}>| 物品数量展示</div>
                                <div id="wpslzs" className={styles.cardBox}></div>
                            </Col>
                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}>| 在库物品数量展示</div>
                                <Card className={styles.cardBoxzk} style={{padding: '0 5px'}}>
                                    {ZkwpData.length > 0 ? (
                                        <div>
                                            <Row gutter={rowLayout}>
                                                <Col
                                                    sm={24}
                                                    lg={24}
                                                    style={{
                                                        fontSize: 16,
                                                        marginBottom: 20,
                                                        paddingTop: 18,
                                                        paddingLeft: 28,
                                                    }}
                                                >
                                                    {/*在库物品数量展示*/}
                                                </Col>
                                            </Row>
                                            {ZkwpData.map(item => (
                                                <div>
                                                    <div className={styles.progressName}>{item.name}</div>
                                                    <div className={styles.progressCount}>
                                                        <Tooltip title={item.name + ':' + item.count}>
                                                            <Progress
                                                                percent={Math.round((item.count / ZkwpTotal) * 100)}
                                                                status="active"
                                                                format={percent => `${percent}%`}
                                                                strokeColor={'#2092fb'}
                                                                strokeWidth={16}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{padding: 16}}>
                                            <div style={{fontSize: 16, paddingTop: 2, color: 'rgba(0,0,0,0.85)'}}>
                                                {/*在库物品数量展示*/}
                                            </div>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    marginTop: this.props.global && this.props.global.dark ? 60 : 16,
                                                }}
                                            >
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
                                    )}
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout1}>
                                <div className={styles.listPageWrap} style={{top: 51, right: 45}}>
                                    <div className={styles.listPageHeader}>
                                        {showrkDataViewDJ ? (
                                            <a className={styles.listPageHeaderCurrent}>登记</a>
                                        ) : (
                                            <a className={styles.UnlistPageHeaderCurrent}
                                               onClick={() => this.changeRkListPageHeader('dj')}>登记</a>
                                        )}
                                        <span>|</span>
                                        {showrkDataViewZK ? (
                                            <a className={styles.listPageHeaderCurrent}>在库</a>
                                        ) : (
                                            <a className={styles.UnlistPageHeaderCurrent}
                                               onClick={() => this.changeRkListPageHeader('zk')}>在库</a>
                                        )}
                                        <span>|</span>
                                        {showrkDataViewDY ? (
                                            <a className={styles.listPageHeaderCurrent}>调用</a>
                                        ) : (
                                            <a className={styles.UnlistPageHeaderCurrent}
                                               onClick={() => this.changeRkListPageHeader('dy')}>调用</a>
                                        )}
                                        <span>|</span>
                                        {showrkDataViewYS ? (
                                            <a className={styles.listPageHeaderCurrent}>移送</a>
                                        ) : (
                                            <a className={styles.UnlistPageHeaderCurrent}
                                               onClick={() => this.changeRkListPageHeader('ys')}>移送</a>
                                        )}
                                        <span>|</span>
                                        {showrkDataViewCZ ? (
                                            <a className={styles.listPageHeaderCurrent}>处置</a>
                                        ) : (
                                            <a className={styles.UnlistPageHeaderCurrent}
                                               onClick={() => this.changeRkListPageHeader('cz')}>处置</a>
                                        )}
                                        <span>|</span>
                                        {showrkDataViewYCCK ? (
                                            <a className={styles.listPageHeaderCurrent}>异常出库</a>
                                        ) : (
                                            <a className={styles.UnlistPageHeaderCurrent}
                                               onClick={() => this.changeRkListPageHeader('ycck')}>异常出库</a>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.cardBoxTitle}>| 物品出入库情况</div>
                                <div id="wpcrkqk" className={styles.cardBox} style={{width:'98%',marginLeft:'1%'}}></div>
                            </Col>
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout1} style={{marginBottom: 32}}>
                                <div className={styles.cardBoxTitle}>| 物品趋势</div>
                                <div id="wpqs" className={wpqsNoData ? styles.none : styles.cardBox}  style={{width:'98%',marginLeft:'1%'}}></div>
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        // position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        padding: 16,
                                        backgroundColor: '#ffffff',
                                    }}
                                    className={!wpqsNoData ? styles.none : ''}
                                >
                                    <div style={{fontSize: 16, padding: '8px 0 0 8px'}}>物品趋势</div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            marginTop: this.props.global && this.props.global.dark ? 60 : 16,
                                        }}
                                    >
                                        <img src={this.props.global && this.props.global.dark ? nonDivImg : noListLight}
                                             alt="暂无数据" height={this.props.global && this.props.global.dark ? 100 : 200}/>
                                        <div style={{
                                            fontSize: 18,
                                            color: this.props.global && this.props.global.dark ? '#fff' : '#999'
                                        }}>暂无数据
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        );
    }
}
