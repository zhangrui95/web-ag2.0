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
            if (this.props.searchType !== nextProps.searchType || this.props.orgcode !== nextProps.orgcode || this.props.selectedDateVal !== nextProps.selectedDateVal) {
                if (nextProps.searchType === 'week') {
                    this.setState({
                        currentType: 'week',
                        TypeTime: [moment(getTimeDistance('week')[0]).format('YYYY-MM-DD'), (getTimeDistance('week')[1]).format('YYYY-MM-DD')],// 请求数据的时间
                    });
                    const weekTypeTime = this.getTime(nextProps.searchType);
                    this.getDossierNumCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getDossierCRKCount(weekTypeTime[0], weekTypeTime[1], '3', nextProps.orgcode);
                    this.showCaseZKNumpie(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.showCaseJzqspie('3', nextProps.orgcode);
                    this.getDossierDZHQKShow(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                } else if (nextProps.searchType === 'month') {
                    this.setState({
                        currentType: 'month',
                        TypeTime: [moment(getTimeDistance('month')[0]).format('YYYY-MM-DD'), (getTimeDistance('month')[1]).format('YYYY-MM-DD')],// 请求数据的时间
                    });
                    const monthTypeTime = this.getTime(nextProps.searchType);
                    this.getDossierNumCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getDossierCRKCount(monthTypeTime[0], monthTypeTime[1], '3', nextProps.orgcode);
                    this.showCaseZKNumpie(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.showCaseJzqspie('6', nextProps.orgcode);
                    this.getDossierDZHQKShow(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                } else if (nextProps.searchType === 'selectedDate') {
                    this.setState({
                        currentType: 'selectedDate',
                        TypeTime: nextProps.selectedDateVal,
                    }, function () {
                        const {selectedDateVal} = nextProps;
                        this.getDossierNumCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.getDossierCRKCount(selectedDateVal[0], selectedDateVal[1], '3', nextProps.orgcode);
                        this.showCaseZKNumpie(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.getDossierDZHQKShow(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.showCaseJzqspie('selectedDate', selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                    });
                }

            }
            if (this.props.global.dark !== nextProps.global.dark) {
                this.showCaseEchartBar(nextProps);
                this.showCaseEchartRingPie(nextProps);
                this.showCaseEchartwpqsBar(nextProps);
                this.showCaseEchartdzhqkzsBar(nextProps);
                this.changeCountButtonCurrent(this.state.type);
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
                                        formatter: '卷宗总数\n\n' + count.toString(),
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

    // 卷宗趋势
    showCaseJzqspie(qsTime, orgcode = this.props.orgcode, sTime, eTime) {
        let payload = {
            rqType: qsTime,
            orgcode,
        };
        if (qsTime === 'selectedDate') {
            payload = {
                kssj: sTime,
                jssj: eTime,
                orgcode,
            };
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
                        });
                        const data1 = data.list;
                        for (let a = 0; a < data1.length; a++) {
                            const legendData = data1[a].name;

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
                        let momentMonth;
                        if (qsTime === '6') {
                            momentMonth = moment();
                        } else if (qsTime === '7') {
                            momentMonth = moment().subtract(1, 'months');
                        } else if (qsTime === '8') {
                            momentMonth = moment().subtract(2, 'months');
                        }
                        const dayArry = getDefaultDaysForMonth(momentMonth);
                        newData1 = [0, 0, 0, 0, 0, 0, 0];
                        newData2 = [0, 0, 0, 0, 0, 0, 0];
                        newData = dayArry;
                    }
                    const seriesDataAll = [
                        {
                            name: '在库',
                            type: 'line',
                            stack: '总量',
                            data: newData1,
                            itemStyle: {
                                color: '#FD0132',
                            },
                        },
                        {
                            name: '出库',
                            type: 'line',
                            stack: '总量',
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
                                        formatter: '总数\n\n' + count.toString(),
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
        itemEchartpictorialBar = echarts.init(document.getElementById('wpcrkqk'));
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
                    rotate: 30,
                    interval: 0,
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
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'},
                                ],
                            ),
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#2378f7'},
                                    {offset: 0.7, color: '#2378f7'},
                                    {offset: 1, color: '#83bff6'},
                                ],
                            ),
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
            const dataTime = [params.name, params.name];
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
                selectedMode: true, // 点击
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
                selectedMode: true, // 点击
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
        const colLayout1 = {sm: 24, lg: 16};
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
                                <div className={styles.cardBoxTitle}>| 卷宗数量展示</div>
                                <div id="jzslzs" className={styles.cardBox}></div>
                            </Col>
                            <Col {...colLayout}>
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
                                <div className={styles.cardBoxTitle}>| 卷宗在库情况</div>
                                <div id="wpcrkqk" className={styles.cardBox}></div>
                            </Col>
                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}>| 在库卷宗数量展示</div>
                                <div className={styles.cardBoxzk} style={{padding: '0 5px'}}>
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
                                                                status="active" strokeColor='#000' strokeWidth={16}/>
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
                                                marginTop: 22,
                                            }}>
                                                <img
                                                    src={this.props.global && this.props.global.dark ? nonDivImg : noListLight}
                                                    height={200} alt="暂无数据"/>
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
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout1} style={{marginBottom: 32}}>
                                <div className={styles.cardBoxTitle}>| 卷宗趋势</div>
                                <div id="jzqs" className={styles.cardBox}></div>
                                {
                                    jzqsNoData ? (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            padding: 16,
                                            backgroundColor: '#ffffff',
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
                            <Col {...colLayout2} style={{marginBottom: 32}}>
                                <div className={styles.cardBoxTitle}>| 电子化情况展示</div>
                                <div id="dzhqkzs" className={styles.cardBox}></div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        );
    }
}
