/*
* UnXzCaseDataView.js 问题行政案件数据展示
* author：lyp
* 20181116
* */
import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment/moment';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import pie from 'echarts/lib/chart/pie';
import line from 'echarts/lib/chart/line';
import funnel from 'echarts/lib/chart/funnel';
import title from 'echarts/lib/component/title';
import legend from 'echarts/lib/component/legend';
import tooltip from 'echarts/lib/component/tooltip';
import styles from '../Styles/dataView.less';
import { getTimeDistance } from '../../utils/utils';
import warningCountButtonNumberPink from '../../assets/viewData/warningCountButtonNumberPink.png';
import warningCountButtonNumberBlue from '../../assets/viewData/warningCountButtonNumberBlue.png';
import nonDivImg from '../../assets/viewData/nonData.png';

let unXzCaseEchartFunnel;
let unXzCaseEchartRingPie;

export default class UnXzCaseDataView extends PureComponent {
    state = {
        currentType: 'today',
        nowData: 0,
        lastData: 0,
        beforeLastData: 0,
        selectedDateData: 0, // 头部统计警情总数——手动选择日期
        dayType: ['today', 'lastDay'],
        dateType: {
            'today': '0',
            'lastDay': '1',
            'beforeLastDay': '2',
            'week': '3',
            'lastWeek': '4',
            'beforeLastWeek': '5',
            'month': '6',
            'lastMonth': '7',
            'beforeLastMonth': '8',
        },
    };

    componentDidMount() {
        this.getViewCountData('day');

        const dayTypeTime = this.getTime('today');
        this.getNewAddWarnings(dayTypeTime[0], dayTypeTime[1], 'today');
        this.getAllTypeWarningCount(dayTypeTime[0], dayTypeTime[1], 'today');

        // this.showUnXzCaseEchartFunnel();
        this.showUnXzCaseEchartRingPie();
        //

        window.addEventListener('resize', unXzCaseEchartRingPie.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.searchType !== nextProps.searchType) || this.props.orgcode !== nextProps.orgcode || this.props.selectedDateVal !== nextProps.selectedDateVal) {
                if (nextProps.searchType === 'day') {
                    this.setState({
                        currentType: 'today',
                    });
                    this.getViewCountData('day', nextProps.orgcode);
                    const dayTypeTime = this.getTime('today');
                    this.getNewAddWarnings(dayTypeTime[0], dayTypeTime[1], 'today', nextProps.orgcode);
                    this.getAllTypeWarningCount(dayTypeTime[0], dayTypeTime[1], 'today', nextProps.orgcode);
                } else if (nextProps.searchType === 'selectedDate') {
                    this.setState({
                        currentType: 'selectedDate',
                    }, function() {
                        const { selectedDateVal } = nextProps;
                        this.getNewAddWarnings(selectedDateVal[0], selectedDateVal[1], 'selectedDate', nextProps.orgcode);
                        this.getAllTypeWarningCount(selectedDateVal[0], selectedDateVal[1], 'selectedDate', nextProps.orgcode);
                    });
                }
            }
        }
    }

    // 获取头部本、上、前按键数据
    getViewCountData = (type, orgcode = this.props.orgcode) => {
        const { dayType } = this.state;
        if (type === 'day') {
            for (let i in dayType) {
                const dateTypeTime = this.getTime(dayType[i]);
                this.getAllTypeWarningCount(dateTypeTime[0], dateTypeTime[1], dayType[i], orgcode, true);
            }
        }
    };
    getTime = (type) => {
        const time = getTimeDistance(type);
        const startTime = time[0] === '' ? '' : moment(time[0]).format('YYYY-MM-DD');
        const endTime = time[1] === '' ? '' : moment(time[1]).format('YYYY-MM-DD');
        return [startTime, endTime];
    };

    // 本、昨、前change
    changeCountButtonCurrent = (type) => {

        let currentType = '';
        if (type === 'now') {
            currentType = 'today';
        } else if (type === 'last') {
            currentType = 'lastDay';
        } else if (type === 'beforeLast') {
            currentType = 'beforeLastDay';
        }
        this.setState({
            currentType,
        });
        const dataTime = this.getTime(currentType);
        this.getViewCountData('day');
        this.getAllTypeWarningCount(dataTime[0], dataTime[1], currentType);
        this.getNewAddWarnings(dataTime[0], dataTime[1], currentType);

    };
    // 新增告警
    getNewAddWarnings = (startTime, endTime, currentType, orgcode = this.props.orgcode) => {
        this.props.dispatch({
            type: 'UnXzCaseData/getUnXzCaseAllTypeWarnings',
            payload: {
                kssj: startTime,
                jssj: endTime,
                ssmk: '2',
                orgcode,
            },
            callback: (data) => {
                if (data) {
                    const xData = [];
                    const barData = [];
                    let bigestNum = 0;
                    let isAllZero = true;
                    for (let i = 0; i < data.list.length; i++) {
                        if (data.list[i].count !== 0) isAllZero = false;
                        xData.push(data.list[i].name);
                        const obj = {
                            name: data.list[i].name,
                            value: data.list[i].count,
                            code: data.list[i].code,
                        };
                        bigestNum = data.list[i].count > bigestNum ? data.list[i].count : bigestNum;
                        barData.push(obj);
                    }
                    if (isAllZero) {
                        unXzCaseEchartFunnel = document.getElementById('unXzCaseXzgj');
                        const nonDataDiv = <div style={styles.noneDataDiv}><img src={nonDivImg} alt="暂无数据"/>
                            <div>暂无数据</div>
                        </div>;
                        // unXzCaseEchartFunnel.innerHTML = '<div style="height: 100%;width: 100%;display: flex;align-items: center;flex-direction: column;justify-content: center">' +
                        //                                     '<img src='+nonDivImg+' alt="暂无数据" />' +
                        //                                     '<div style="font-size:18px">暂无数据</div>' +
                        //                                 '</div>';
                        unXzCaseEchartFunnel.innerHTML = '<div style="height: 100%;width: 100%;">' +
                            '<div style="font-size: 16px;padding: 4px 0 0 4px;color:rgba(0,0,0,0.85)">今日新增告警</div>' +
                            '<div style="display: flex;align-items: center;flex-direction: column;justify-content: center">' +
                            '<img src=' + nonDivImg + ' alt="暂无数据" />' +
                            '<div style="font-size:18px">暂无数据</div>' +
                            '</div>' +
                            '</div>';
                    } else {
                        this.showUnXzCaseEchartFunnel();
                        unXzCaseEchartFunnel.setOption({
                            title: {
                                text: currentType === 'today' ? '今日新增告警' : (currentType === 'selectedDate' ? '告警' : '昨日告警'),
                            },
                            series: [{
                                data: barData,
                            }],
                        });
                    }

                }

            },
        });
    };
    // 新增告警漏斗图
    showUnXzCaseEchartFunnel = () => {
        const that = this;
        unXzCaseEchartFunnel = echarts.init(document.getElementById('unXzCaseXzgj'));
        const option = {
            color: ['#3233FF'],
            title: {
                text: '新增告警',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                },
                padding: 8,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}',
            },
            series: [{
                name: '新增告警',
                type: 'funnel',
                sort: 'descending',
                gap: 3,
                width: '80%',
                maxSize: '80%',
                label: {
                    normal: {
                        formatter: '{b}',
                    },
                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1,
                    },
                },
                data: [],
            }],

        };
        unXzCaseEchartFunnel.setOption(option);
        unXzCaseEchartFunnel.on('click', function(params) {
            const { currentType } = that.state;
            const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({ 'wtlx': params.data.code, dbzt: { dbzt: '', zgzt: '' } }, dataTime);
        });
        window.addEventListener('resize', unXzCaseEchartFunnel.resize);
    };
    // 告警情况
    getAllTypeWarningCount = (startTime, endTime, currentType, orgcode = this.props.orgcode, isCountData) => {
        this.props.dispatch({
            type: 'MySuperviseData/getAllTypeWarningCount',
            payload: {
                time_ks: startTime,
                time_js: endTime,
                wtfl_id: '203205',
                ssmk: '2',
                orgcode,
            },
            callback: (data) => {
                if (data) {
                    let legendData = [];
                    let pieData = [];
                    let countData = 0;

                    for (let i = 0; i < data.list.length; i++) {
                        if (data.list[i].name !== '告警总数') {
                            let obj = {
                                name: data.list[i].name,
                                icon: 'circle',
                            };
                            legendData.push(obj);
                            pieData.push({
                                name: data.list[i].name,
                                value: data.list[i].count,
                                code: data.list[i].dbzt,
                            });
                        } else {
                            countData = data.list[i].count;
                        }


                    }
                    if (currentType === 'selectedDate') {
                        this.setState({
                            selectedDateData: countData,
                        });
                    }
                    if (isCountData) {
                        if (currentType === 'today') {
                            this.setState({
                                nowData: countData,
                            });
                        } else {
                            this.setState({
                                lastData: countData,
                            });
                        }
                    } else {
                        unXzCaseEchartRingPie.setOption({
                            title: {
                                text: currentType === 'today' ? '今日告警情况' : (currentType === 'selectedDate' ? '告警情况' : '昨日告警情况'),
                            },
                            legend: {
                                data: legendData,
                                formatter: function(name) {
                                    let formatStr = '';
                                    for (let i = 0; i < pieData.length; i++) {
                                        if (name === pieData[i].name) {
                                            formatStr = `${name} ${pieData[i].value}`;
                                            break;
                                        }
                                    }
                                    return formatStr;
                                },
                            },
                            series: [{
                                data: pieData,
                                label: {
                                    normal: {
                                        formatter: `告警总数\n\n${countData}`,
                                    },
                                },
                            }],
                        });
                    }


                }

            },
        });
    };
    // 告警情况环形饼状图
    showUnXzCaseEchartRingPie = () => {
        const that = this;
        unXzCaseEchartRingPie = echarts.init(document.getElementById('unXzCaseGjqk'));
        const option = {
            title: {
                text: '告警情况',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                },
                padding: 8,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: 60,
                top: 60,
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 25,
                selectedMode: true, // 点击
                textStyle: {
                    color: '#000',
                    fontSize: 16,
                    lineHeight: 24,
                },
                data: [],

            },
            series: [
                {
                    name: '告警情况',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '22',
                                color: '#66ccff',
                            },
                        },
                        emphasis: {
                            show: true,
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
        unXzCaseEchartRingPie.setOption(option, true);
        unXzCaseEchartRingPie.on('click', function(params) {
            const { currentType } = that.state;
            const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({ dbzt: { 'dbzt': params.data.code, zgzt: '' } }, dataTime);
        });
    };

    render() {
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayout = { sm: 24, lg: 12 };
        const { searchType, selectedDateVal, showDataView } = this.props;
        const { lastData, nowData, selectedDateData, currentType } = this.state;
        return (
            <div className={styles.policeDataView} style={showDataView ? {} : { position: 'absolute', zIndex: -1 }}>
                {
                    currentType !== 'selectedDate' ? (
                        <div className={styles.viewCount}>
                            <div onClick={() => this.changeCountButtonCurrent('now')}>
                                <div className={styles.warningCountButtonArea}>
                                    <div className={styles.warningCountButtonTitleBlue}>今日新增告警</div>
                                    <div className={styles.warningCountButtonNumberBlue}>
                                        <img src={warningCountButtonNumberBlue} alt=""/>
                                        {nowData}
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => this.changeCountButtonCurrent('last')}>
                                <div className={styles.warningCountButtonArea}>
                                    <div className={styles.warningCountButtonTitlePink}>昨日告警数量</div>
                                    <div className={styles.warningCountButtonNumberPink}>
                                        <img src={warningCountButtonNumberPink} alt=""/>
                                        {lastData}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.viewCount}>
                            <div className={styles.countButtonCurrent}>
                                <div className={styles.countButtonTitle}>
                                    <div>{selectedDateVal[0]}</div>
                                    <div style={{ lineHeight: '6px' }}>~</div>
                                    <div>{selectedDateVal[1]}</div>
                                </div>
                                <div className={styles.countButtonNumber}>
                                    <div>告警：{selectedDateData}</div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <Row gutter={rowLayout} className={styles.listPageRow}>
                    <Col {...colLayout}>
                        <div id="unXzCaseXzgj" className={styles.cardBox}></div>
                    </Col>
                    <Col {...colLayout}>
                        <div id="unXzCaseGjqk" className={styles.cardBox}></div>
                    </Col>
                </Row>
            </div>
        );
    }
}
