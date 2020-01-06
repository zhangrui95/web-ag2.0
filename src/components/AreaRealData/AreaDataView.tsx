/*
 * ItemDataView.js 办案区数据统计
 * author：jhm
 * 20181113
 * */
import React, {PureComponent} from 'react';
import {
    Row,
    Col,
    Card,
    Divider,
    Tooltip,
    Button,
    Radio,
    Icon,
    message,
    Progress,
    Timeline,
} from 'antd';
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
import AreaDataViewStyles from './AreaDataView.less';
import {getDefaultDaysForMonth, getTimeDistance} from '../../utils/utils';
import DataViewDateShow from '../Common/DataViewDateShow';
import {MiniProgress, ChartCard} from 'ant-design-pro/lib/Charts';
import nonDivImg from '../../assets/viewData/nonData.png';
import {connect} from "dva";

let itemEchartRYCFPie;
let itemEchartRingPie;
let itemEchartSALXBar;
let itemEchartRQYYBar;
let itemEchartRQRCQSZSPie;
let itemEchartSARYRQRCBar;
const colors1 = [
    '#FE3265',
    '#CCFF36',
    '#259DF4',
    '#40537E',
    '#EDB59C',
    '#FED501',
    '#3074B5',
    '#72C4B8',
    '#CBFF30',
    '#FE0000',
    '#42C92E',
];
@connect(({global}) => ({
    global
}))
export default class ItemDataView extends PureComponent {
    state = {
        currentType: 'week',
        type: 'now',
        rqtype: '3',
        TypeTime: [
            moment(getTimeDistance('week')[0]).format('YYYY-MM-DD'),
            getTimeDistance('week')[1].format('YYYY-MM-DD'),
        ], // 请求数据的时间
        SpecialRYCFdata: [],
        NLFBdata: [], // 年龄划分返回值
        SARYRQRCdata: '', // 涉案人员入区人次返回值
        SARYRQRCdataLength: '', // 涉案人员入区人次返回的数据长度（有几个办案区）
        NLFBTotal: 0, // 年龄划分所有年龄段的总数和
        SARYRQRCTotal: '', // 涉案人员入区所有人次的总和
        chooseBaq: '', // 选择办案区

        nowData: 0,
        lastData: 0,
        beforeLastData: 0,
        // dayType: ['today', 'lastDay', 'beforeLastDay'],
        weekType: ['week', 'lastWeek', 'beforeLastWeek'],
        monthType: ['month', 'lastMonth', 'beforeLastMonth'],
        selectedDateData: 0, // 头部统计警情总数——手动选择日期
        dateType: {
            today: '0',
            lastDay: '1',
            beforeLastDay: '2',
            week: '3',
            lastWeek: '4',
            beforeLastWeek: '5',
            month: '6',
            lastMonth: '7',
            beforeLastMonth: '8',
        },
    };

    componentDidMount() {
        this.getViewCountData('week');

        this.showCaseEchartRYCFBar(this.props);
        // this.showCaseEchartRingPie();
        this.showCaseEchartSALXBar(this.props);
        this.showCaseEchartRQYYBar(this.props);
        this.showCaseEchartRQRCQSZSPie(this.props);
        // this.showCaseEchartSARYRQRCPie();
        window.addEventListener('resize', itemEchartRYCFPie.resize);
        // window.addEventListener('resize', itemEchartRingPie.resize);
        window.addEventListener('resize', itemEchartSALXBar.resize);
        window.addEventListener('resize', itemEchartRQYYBar.resize);
        window.addEventListener('resize', itemEchartRQRCQSZSPie.resize);
        // window.addEventListener('resize', itemEchartSARYRQRCBar.resize);
        const weekTypeTime = this.getTime(this.props.searchType);
        this.getAreaRYCFCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaSpecialRYCFCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaNLHFCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaSALXCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaRQYYCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaSARYRQRCCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaRQRCQSCount('3');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (this.props.global.dark !== nextProps.global.dark) {
                this.showCaseEchartRYCFBar(nextProps);
                this.showCaseEchartSALXBar(nextProps);
                this.showCaseEchartRQYYBar(nextProps);
                this.showCaseEchartRQRCQSZSPie(nextProps);
                // this.changeCountButtonCurrent(this.state.type);
            }
            if (
                this.props.searchType !== nextProps.searchType ||
                this.props.orgcode !== nextProps.orgcode ||
                this.props.selectedDateVal !== nextProps.selectedDateVal ||
                this.props.global.dark !== nextProps.global.dark
            ) {
                if (nextProps.searchType === 'week') {
                    this.setState({
                        currentType: 'week',
                        TypeTime: [
                            moment(getTimeDistance('week')[0]).format('YYYY-MM-DD'),
                            getTimeDistance('week')[1].format('YYYY-MM-DD'),
                        ], // 请求数据的时间
                    });
                    this.getViewCountData('week', nextProps.orgcode);
                    const weekTypeTime = this.getTime(nextProps.searchType);
                    this.getAreaRYCFCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAreaSpecialRYCFCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAreaNLHFCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAreaSALXCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAreaRQYYCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAreaSARYRQRCCount(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAreaRQRCQSCount('3', nextProps.orgcode);
                } else if (nextProps.searchType === 'month') {
                    this.setState({
                        currentType: 'month',
                        TypeTime: [
                            moment(getTimeDistance('month')[0]).format('YYYY-MM-DD'),
                            getTimeDistance('month')[1].format('YYYY-MM-DD'),
                        ], // 请求数据的时间
                    });
                    this.getViewCountData('month', nextProps.orgcode);
                    const monthTypeTime = this.getTime(nextProps.searchType);
                    this.getAreaRYCFCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAreaSpecialRYCFCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAreaNLHFCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAreaSALXCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAreaRQYYCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAreaSARYRQRCCount(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAreaRQRCQSCount('6', nextProps.orgcode);
                } else if (nextProps.searchType === 'selectedDate') {
                    const {selectedDateVal} = nextProps;
                    this.setState(
                        {
                            currentType: 'selectedDate',
                            TypeTime: selectedDateVal,
                        },
                        function () {
                            this.getAreaRYCFCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.getAreaSpecialRYCFCount(
                                selectedDateVal[0],
                                selectedDateVal[1],
                                nextProps.orgcode,
                            );
                            this.getAreaNLHFCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.getAreaSALXCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.getAreaRQYYCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.getAreaSARYRQRCCount(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                            this.getAreaRQRCQSCount(
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
    // 获取头部本、上、前按键数据
    getViewCountData = (type, orgcode = this.props.orgcode) => {
        const {weekType, monthType} = this.state;
        if (type === 'week') {
            for (let i in weekType) {
                const weekTypeTime = this.getTime(weekType[i]);
                this.getAreaRYCFCount(weekTypeTime[0], weekTypeTime[1], orgcode, '', weekType[i]);
            }
        } else if (type === 'month') {
            for (let i in monthType) {
                const monthTypeTime = this.getTime(monthType[i]);
                this.getAreaRYCFCount(monthTypeTime[0], monthTypeTime[1], orgcode, '', monthType[i]);
            }
        }
    };
    // 获取人员成分统计
    getAreaRYCFCount = (startTime, endTime, orgcode = this.props.orgcode, orgid, type) => {
        const {dayType, weekType, monthType, currentType} = this.state;
        this.props.dispatch({
            type: 'areaData/areaRYXb',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgId: orgid,
                orgcode,
            },
            callback: data => {
                if (data) {
                    const data1 = data.list;
                    let countAll = 0;
                    for (let a = 0; a < data1.length; a++) {
                        if (data1[a].name === '总数') {
                            countAll = data1[a].count;
                        }
                    }
                    if (currentType === 'selectedDate') {
                        this.setState({
                            selectedDateData: countAll,
                        });
                    }
                    if (type) {
                        if (type === weekType[0] || type === monthType[0]) {
                            this.setState({
                                nowData: countAll,
                            });
                        }
                        if (type === weekType[1] || type === monthType[1]) {
                            this.setState({
                                lastData: countAll,
                            });
                        }
                        // if (type === weekType[2] || type === monthType[2]) {
                        //     this.setState({
                        //         beforeLastData: countAll,
                        //     })
                        // }
                    } else {
                        if (itemEchartRYCFPie) {
                            // const data1=data.list;
                            const newData = [];
                            const newData1 = [];
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
                            itemEchartRYCFPie.setOption({
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
                    }
                }
            },
        });
    };
    // 获取人员成分特殊人员统计
    getAreaSpecialRYCFCount = (startTime, endTime, orgcode = this.props.orgcode, orgid) => {
        this.props.dispatch({
            type: 'areaData/areaSpecialRYCFFetch',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgId: orgid,
                orgcode,
            },
            callback: data => {
                if (data) {
                    this.setState({
                        SpecialRYCFdata: data.list,
                    });
                }
            },
        });
    };
    // 获取年龄划分统计
    getAreaNLHFCount = (startTime, endTime, orgcode = this.props.orgcode, orgid) => {
        this.props.dispatch({
            type: 'areaData/areaNLHFFetch',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgId: orgid,
                orgcode,
            },
            callback: data => {
                if (data) {
                    let nlfb = 0;
                    for (let a = 0; a < data.list.length; a++) {
                        nlfb += data.list[a].count;
                    }
                    this.setState({
                        NLFBdata: data.list,
                        NLFBTotal: nlfb,
                    });
                }
            },
        });
    };
    // 获取涉案人员入区人次展示统计
    getAreaSARYRQRCCount = (startTime, endTime, orgcode = this.props.orgcode, orgid) => {
        this.setState({
            SARYRQRCdata: '',
            SARYRQRCdataLength: '',
            SARYRQRCTotal: '',
        });
        this.props.dispatch({
            type: 'areaData/areaSARYRQRCFetch',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgId: orgid,
                orgcode,
            },
            callback: data => {
                if (data) {
                    let SARYRQRC = 0;
                    const data1 = data.list;

                    if (data.list.length > 1) {
                        for (let a = 0; a < data.list.length; a++) {
                            SARYRQRC += data.list[a].count1;
                        }
                        const DataListLength = data1.length;
                        this.setState({
                            SARYRQRCdata: data1,
                            SARYRQRCdataLength: DataListLength,
                            SARYRQRCTotal: SARYRQRC,
                        });
                    } else {
                        this.setState(
                            {
                                SARYRQRCdata: data1,
                                SARYRQRCdataLength: 1,
                                SARYRQRCTotal: data.list.length === 0 ? 0 : data1[0].count1 + data1[0].count2,
                            },
                            () => {
                                this.showCaseEchartSARYRQRCPie();
                                window.addEventListener('resize', itemEchartSARYRQRCBar.resize);

                                if (itemEchartSARYRQRCBar) {
                                    const newData = [
                                        {
                                            name: '在区',
                                            icon: 'circle',
                                            value: data.list.length === 0 ? 0 : data1[0].count1,
                                        },
                                        {
                                            name: '离区',
                                            icon: 'circle',
                                            value: data.list.length === 0 ? 0 : data1[0].count2,
                                        },
                                        {
                                            name: '临时离开',
                                            icon: 'circle',
                                            value: data.list.length === 0 ? 0 : data1[0].count3,
                                        },
                                    ];
                                    const seriesData = [
                                        {
                                            name: '在区',
                                            value: data.list.length === 0 ? 0 : data1[0].count1,
                                            itemStyle: {
                                                color: colors1[9],
                                            },
                                        },
                                        {
                                            name: '离区',
                                            value: data.list.length === 0 ? 0 : data1[0].count2,
                                            itemStyle: {
                                                color: colors1[10],
                                            },
                                        },
                                        {
                                            name: '临时离开',
                                            value: data.list.length === 0 ? 0 : data1[0].count3,
                                            itemStyle: {
                                                color: colors1[2],
                                            },
                                        },
                                    ];
                                    itemEchartSARYRQRCBar.setOption({
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
                                                data: seriesData,
                                            },
                                        ],
                                    });
                                }
                            },
                        );
                    }
                }
            },
        });
    };
    // 获取人员类型统计
    getAreaSALXCount = (startTime, endTime, orgcode = this.props.orgcode, orgid) => {
        this.props.dispatch({
            type: 'areaData/areaSALXFetch',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgId: orgid,
                orgcode,
            },
            callback: data => {
                if (itemEchartSALXBar && data) {
                    const that = this;
                    const newData = [];
                    const newData1 = [];
                    const data1 = data.list;
                    const dataShadow = [];
                    const dataCode = [];
                    let salxData = '';
                    for (let a = 0; a < data1.length; a++) {
                        const legendData = data1[a].name;

                        const seriesData = data1[a].count;
                        const Numcode = data1[a].code;
                        newData.push(legendData);
                        newData1.push(seriesData);
                        dataCode.push(Numcode);
                    }
                    let yMax = Math.max(...newData1);
                    if (yMax === 0) {
                        yMax += 100;
                    }
                    for (let i = 0; i < data1.length; i++) {
                        dataShadow.push(yMax);
                    }
                    itemEchartSALXBar.setOption({
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
                    itemEchartSALXBar.on('click', function (params) {
                        for (let b = 0; b < newData.length; b++) {
                            if (newData[b] === params.name) {
                                salxData = dataCode[b];
                            }
                        }
                        const {currentType} = that.state;
                        const dataTime =
                            currentType === 'selectedDate'
                                ? that.props.selectedDateVal
                                : that.getTime(currentType);
                        that.props.changeListPageHeader({salx: salxData}, dataTime);
                    });
                }
            },
        });
    };
    // 获取入区原因统计
    getAreaRQYYCount = (startTime, endTime, orgcode = this.props.orgcode, orgid) => {
        this.props.dispatch({
            type: 'areaData/areaRQYYFetch',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgId: orgid,
                orgcode,
            },
            callback: data => {
                if (itemEchartRQYYBar && data) {
                    const data1 = data.list;
                    const newData = [];
                    const newData1 = [];
                    let count = 0;
                    for (let a = 0; a < data1.length; a++) {
                        const legendData = {
                            name: data1[a].name,
                            icon: 'circle',
                            value: data1[a].count,
                        };
                        const seriesData = {
                            name: data1[a].name,
                            icon: 'circle',
                            value: data1[a].count,
                            itemStyle: {
                                color: colors1[a + 2],
                            },
                            code: data1[a].code,
                        };
                        newData.push(legendData);
                        newData1.push(seriesData);
                        count += parseInt(data1[a].count);
                    }
                    itemEchartRQYYBar.setOption({
                        legend: {
                            data: newData,
                            formatter: function (name) {
                                for (let i = 0; i < newData1.length; i++) {
                                    if (newData1[i].name === name) {
                                        return `${name} ${newData1[i].value}`;
                                    }
                                }
                            },
                        },
                        series: [
                            {
                                label: {
                                    normal: {
                                        formatter: count.toString(),
                                    },
                                },
                                data: newData1,
                                // data:[{"name":"返回办案区","count":0},{"name":"刑事传唤","count":4}],
                            },
                        ],
                    });
                }
            },
        });
    };
    // 获取入区人次趋势统计
    getAreaRQRCQSCount = (qsTime, orgcode = this.props.orgcode, sTime, eTime, orgid) => {
        let payload = {
            rqType: qsTime,
            orgId: orgid,
            orgcode,
        };
        if (qsTime === 'selectedDate') {
            payload = {
                kssj: sTime,
                jssj: eTime,
                orgId: orgid,
                orgcode,
            };
        }
        this.props.dispatch({
            type: 'areaData/areaRQRCQSFetch',
            payload,
            callback: data => {
                if (itemEchartRQRCQSZSPie && data) {
                    let newData = [];
                    let newData1 = [];
                    if (data.list && data.list.length > 0) {
                        const data1 = data.list;
                        for (let a = 0; a < data1.length; a++) {
                            const legendData = data1[a].name;

                            const seriesData1 = data1[a].count;
                            newData1.push(seriesData1);

                            newData.push(legendData);
                        }
                    } else {
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
                        newData = dayArry;
                    }

                    const seriesDataAll = [
                        {
                            name: '人次',
                            type: 'line',
                            stack: '总量',
                            data: newData1,
                        },
                    ];
                    itemEchartRQRCQSZSPie.setOption({
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
    };
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
            rqtype,
            TypeTime: weekTypeTime,
            SARYRQRCdataLength: '',
            NLFBTotal: 0,
            SARYRQRCTotal: '',
            type,
        });

        this.getAreaRYCFCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaSpecialRYCFCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaNLHFCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaSALXCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaRQYYCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaSARYRQRCCount(weekTypeTime[0], weekTypeTime[1]);
        this.getAreaRQRCQSCount(rqtype);
    };
    // 人员成分echart
    showCaseEchartRYCFBar = (nextProps) => {
        itemEchartRYCFPie = echarts.init(document.getElementById('rycf'));
        const option = {
            title: {
                // text: '性别统计',
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
                top: 120,
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
                // data:newData,
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
                            // formatter: '总数\n\n444',
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
        itemEchartRYCFPie.setOption(option, true);
    };
    // 涉案人员入区人次展示
    showCaseEchartSARYRQRCPie = () => {
        itemEchartSARYRQRCBar = echarts.init(document.getElementById('saryrqrczs'));
        const option = {
            title: {
                // text: '办案区入区人次展示',
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
                top: 140,
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 25,
                selectedMode: true, // 点击
                textStyle: {
                    color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
                    fontSize: 16,
                    lineHeight: 24,
                },
                // data:newData,
                data: [],
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: '50%',
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            // formatter: '总数\n\n444',
                            textStyle: {
                                fontSize: '22',
                                // fontWeight: 'bold',
                                color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
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
        itemEchartSARYRQRCBar.setOption(option, true);
        let that = this;
        itemEchartSARYRQRCBar.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime =
                currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeListPageHeader({zqzt: params.data.name}, dataTime);
        });
    };
    // 人员类型echart
    showCaseEchartSALXBar = (nextProps) => {
        const that = this;
        itemEchartSALXBar = echarts.init(document.getElementById('salxBaq'));
        const dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在'];
        const data = [220, 182, 191, 234, 290, 330, 310, 123, 442];
        const yMax = Math.max(...data);
        const dataShadow = [];

        for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }

        const option = {
            title: {
                // text: '人员类型',
                // textStyle: {
                //     fontSize: 16,
                //     fontWeight: 'normal',
                // },
                // padding: 8,
            },
            xAxis: {
                // data: dataAxis,
                data: [],
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    },
                    rotate: 50,
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
                    // For shadow
                    type: 'bar',
                    itemStyle: {
                        normal: {color: 'rgba(255,255,255,0)'},
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
                    // data: data,
                    data: [],
                },
            ],
        };
        itemEchartSALXBar.setOption(option, true);
    };

    // 入区原因echart
    showCaseEchartRQYYBar = (nextProps) => {
        itemEchartRQYYBar = echarts.init(document.getElementById('rqyy'));
        const newData = [
            {
                name: '形式传唤',
                icon: 'circle',
                value: 100,
            },
            {
                name: '拘传',
                icon: 'circle',
                value: 400,
            },
            {
                name: '主动投案',
                icon: 'circle',
                value: 400,
            },
            {
                name: '案件移交',
                icon: 'circle',
                value: 400,
            },
            {
                name: '再次入区',
                icon: 'circle',
                value: 400,
            },
            {
                name: '返回办案区',
                icon: 'circle',
                value: 400,
            },
            {
                name: '其他',
                icon: 'circle',
                value: 400,
            },
        ];
        const option = {
            title: {
                // text: '入区原因',
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
                right: '5%',
                top: '10%',
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 15,
                selectedMode: true, // 点击
                textStyle: {
                    color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                    fontSize: 16,
                    lineHeight: 24,
                },
                data: [],
                // data:newData,
                // formatter: function(name){
                //   for(let i=0;i< newData.length; i++){
                //     if(newData[i].name === name){
                //       return `${name} ${newData[i].value}`;
                //     }
                //   }
                // },
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
                            formatter: '444',
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
        itemEchartRQYYBar.setOption(option, true);
        let that = this;
        itemEchartRQYYBar.on('click', function (params) {
            const {currentType} = that.state;
            const dataTime =
                currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeListPageHeader({rqyy: params.data.code}, dataTime);
        });
    };
    // 入区人次趋势展示
    showCaseEchartRQRCQSZSPie = (nextProps) => {
        itemEchartRQRCQSZSPie = echarts.init(document.getElementById('rqrcqszs'));
        const option = {
            title: {
                // text: '入区人次趋势展示',
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
                // data:[],
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
            // toolbox: {
            //   feature: {
            //     saveAsImage: {}
            //   }
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['周一','周二','周三','周四','周五','周六','周日'],
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
            series: [
                {
                    name: '入库',
                    type: 'line',
                    stack: '总量',
                    data: [],
                    // data:[1,5,9,8,4,3,7],
                    label: {
                        normal: {
                            textStyle: {
                                color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
                            },
                        },
                    },
                },
            ],
        };
        itemEchartRQRCQSZSPie.setOption(option, true);
        let that = this;
        itemEchartRQRCQSZSPie.on('click', function (params) {
            const dataTime = params.name ? [params.name, params.name] : [];
            that.props.changeListPageHeader(null, dataTime);
        });
    };
    // 点击涉案人员入区人次展示切换办案区
    chooseBaq = orgid => {
        const {TypeTime, currentType, rqtype} = this.state;
        this.setState({
            chooseBaq: orgid,
        });
        this.getAreaRYCFCount(TypeTime[0], TypeTime[1], this.props.orgcode, orgid);
        this.getAreaSpecialRYCFCount(TypeTime[0], TypeTime[1], this.props.orgcode, orgid);
        this.getAreaNLHFCount(TypeTime[0], TypeTime[1], this.props.orgcode, orgid);
        this.getAreaSALXCount(TypeTime[0], TypeTime[1], this.props.orgcode, orgid);
        this.getAreaRQYYCount(TypeTime[0], TypeTime[1], this.props.orgcode, orgid);
        // this.getAreaSARYRQRCCount(TypeTime[0],TypeTime[1]);
        this.getAreaRQRCQSCount(rqtype, this.props.orgcode, '', '', orgid);
    };
    resetBaq = () => {
        const {TypeTime, currentType, rqtype} = this.state;
        this.setState({
            chooseBaq: '',
        });
        this.getAreaRYCFCount(TypeTime[0], TypeTime[1]);
        this.getAreaSpecialRYCFCount(TypeTime[0], TypeTime[1]);
        this.getAreaNLHFCount(TypeTime[0], TypeTime[1]);
        this.getAreaSALXCount(TypeTime[0], TypeTime[1]);
        this.getAreaRQYYCount(TypeTime[0], TypeTime[1]);
        this.getAreaRQRCQSCount(rqtype);
    };
    returnSaryrqrczs = (SARYRQRCdataLength, SARYRQRCdata, SARYRQRCTotal, chooseBaq) => {
        if (SARYRQRCdataLength === 1) {
            return (
                <div>
                    <div className={styles.cardBoxTitle}>| 办案区入区人次展示</div>
                    <div id="saryrqrczs" className={styles.cardBox}></div>
                </div>
            );
        } else if (SARYRQRCdataLength > 1) {
            return (
                <div>
                    <div className={AreaDataViewStyles.IntoTitle}>
                        | 办案区入区人次展示
                        <a style={{float: 'right'}} onClick={() => this.resetBaq()}>
                            全部
                        </a>
                    </div>
                    <div className={AreaDataViewStyles.IntoAreaName}>
                        {SARYRQRCdata &&
                        SARYRQRCdata.map(item => (
                            <div className={AreaDataViewStyles.IntoPerson}>
                                <h5>{item.name}</h5>
                                <div>
                                    <Tooltip title={item.name + '入区人数：' + item.count1} placement="bottomLeft">
                                        <Progress
                                            percent={(item.count1 / parseInt(SARYRQRCTotal)) * 100}
                                            status={
                                                item.orgid === chooseBaq && chooseBaq !== '' ? 'exception' : 'active'
                                            }
                                            strokeWidth={16}
                                            className={AreaDataViewStyles.Progress}
                                            onClick={() => this.chooseBaq(item.orgid)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    render() {
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, lg: 8};
        const colLayout1 = {sm: 24, lg: 24};
        const colLayout2 = {sm: 24, lg: 16};
        const {searchType, selectedDateVal, showDataView} = this.props;
        const {
            currentType,
            SpecialRYCFdata,
            NLFBdata,
            NLFBTotal,
            SARYRQRCdata,
            SARYRQRCdataLength,
            SARYRQRCTotal,
            nowData,
            lastData,
            beforeLastData,
            chooseBaq,
            selectedDateData,
        } = this.state;
        let className = this.props.global && this.props.global.dark ? styles.policeDataCard : styles.policeDataCard + ' ' + styles.lightBox;
        return (
            <Card style={{position: 'relative'}} className={className}>
                <div
                    className={styles.AreaDataView}
                    style={showDataView ? {} : {position: 'absolute', zIndex: -1}}
                >
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
                                <div className={styles.bigCountButtonNumber}>
                                    <div>入区：{nowData}</div>
                                </div>
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
                                <div className={styles.bigCountButtonNumber}>
                                    <div>入区：{lastData}</div>
                                </div>
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
                                <div className={styles.bigCountButtonNumber}>
                                    <div>入区：{beforeLastData}</div>
                                </div>
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
                                <div className={styles.countButtonNumber}>
                                    <div>入区：{selectedDateData}</div>
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
                                {/*<div className={AreaDataViewStyles.rycfBox}>*/}
                                <div className={styles.cardBoxTitle}>| 性别统计</div>
                                <div id="rycf" className={styles.cardBox} style={{height: '350px'}}></div>
                                {/*</div>*/}
                            </Col>
                            <Col {...colLayout2}>
                                <div className={styles.cardBoxTitle}>| 年龄划分</div>
                                {/*<ChartCard*/}
                                {/*  // title="年龄划分"*/}
                                {/*  // contentHeight={46}*/}
                                {/*  className={AreaDataViewStyles.nlhfBox}*/}
                                {/*>*/}
                                <div id="nlhf" className={styles.cardBox} style={{height: 350, padding: 30}}>
                                    {NLFBdata.length > 0
                                        ? NLFBdata.map(item => (
                                            <Row gutter={rowLayout} style={{height: 44}}>
                                                <Col sm={24} lg={2}>
                                                    <div className={AreaDataViewStyles.ageTitle}>{item.name}</div>
                                                </Col>
                                                <Col sm={24} lg={22}>
                                                    <Tooltip
                                                        title={item.name + '年龄段数量：' + item.count}
                                                        placement="bottomLeft"
                                                    >
                                                        <Progress
                                                            percent={(item.count / NLFBTotal) * 100}
                                                            strokeWidth={12}
                                                        />
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        ))
                                        : ''}
                                </div>
                                {/*</ChartCard>*/}
                            </Col>
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout}>
                                {/*<div*/}
                                {/*  className={styles.cardBox}*/}
                                {/*  style={{ padding: SARYRQRCdataLength > 1 ? 21 : 0 }}*/}
                                {/*>*/}
                                {/*<div className={styles.cardBoxTitle}>|  办案区入区人次展示</div>*/}
                                {this.returnSaryrqrczs(
                                    SARYRQRCdataLength,
                                    SARYRQRCdata,
                                    SARYRQRCTotal,
                                    chooseBaq,
                                )}
                                {/*</div>*/}
                            </Col>
                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}>| 人员类型</div>
                                <div id="salxBaq" className={styles.cardBox}></div>
                            </Col>
                            <Col {...colLayout}>
                                <div className={styles.cardBoxTitle}>| 入区原因</div>
                                <div id="rqyy" className={styles.cardBox}></div>
                            </Col>
                        </Row>
                        <Row gutter={rowLayout} className={styles.listPageRow}>
                            <Col {...colLayout1} style={{marginBottom: 32}}>
                                <div className={styles.cardBoxTitle}>| 人员入区人次展示</div>
                                <div id="rqrcqszs" className={styles.cardBox} style={{width:'98%',marginLeft:'1%'}}></div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        );
    }
}
