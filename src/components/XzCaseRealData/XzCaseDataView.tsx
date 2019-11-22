/*
* XzCaseDataView.js 行政案件数据展示
* author：lyp
* 20181112
* */
import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';
import moment from 'moment/moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import styles from '../../pages/common/dataView.less';
import { getDefaultDaysForMonth, getTimeDistance } from '../../utils/utils';
import DataViewDateShow from '../Common/DataViewDateShow';
import nonDivImg from '../../assets/viewData/nonData.png';

let xzCaseEchartRingPie;
let xzCaseEchartLine;
let caseTypeStatisticsBar;

const colors1 = ['#FF3200', '#009AFE'];

export default class XzCaseDataView extends PureComponent {
    state = {
        currentType: 'week',
        nowData: [0, 0],
        nowDataName: [],
        lastData: [0, 0],
        lastDataName: [],
        beforeLastData: [0, 0],
        beforeLastDataName: [],
        selectedDateData: ['受案：0', '结案：0'], // 头部统计警情总数——手动选择日期
        weekType: ['week', 'lastWeek', 'beforeLastWeek'],
        monthType: ['month', 'lastMonth', 'beforeLastMonth'],
        dateType: {
            'day': '0',
            'lastDay': '1',
            'beforeLastDay': '2',
            'week': '3',
            'lastWeek': '4',
            'beforeLastWeek': '5',
            'month': '6',
            'lastMonth': '7',
            'beforeLastMonth': '8',
        },
        sjqkzsNoData: false, // 受结情况无数据
    };

    componentDidMount() {
        this.getViewCountData('week');

        const weekTypeTime = this.getTime('week');
        this.getAllXzCaseProgress(weekTypeTime[0], weekTypeTime[1]);
        this.getAllXzTypeCase('week');
        this.getCaseTypeStatistics(weekTypeTime[0], weekTypeTime[1]);


        this.showXzCaseEchartRingPie();
        this.showXzCaseEchartLine();
        this.showCaseTypeStatisticsBar();


        window.addEventListener('resize', xzCaseEchartRingPie.resize);
        window.addEventListener('resize', xzCaseEchartLine.resize);
        window.addEventListener('resize', caseTypeStatisticsBar.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.searchType !== nextProps.searchType) || this.props.orgcode !== nextProps.orgcode || this.props.selectedDateVal !== nextProps.selectedDateVal) {
                if (nextProps.searchType === 'week') {
                    this.setState({
                        currentType: 'week',
                    });
                    this.getViewCountData('week', nextProps.orgcode);
                    const weekTypeTime = this.getTime('week');
                    this.getAllXzCaseProgress(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                    this.getAllXzTypeCase('week', nextProps.orgcode);
                    this.getCaseTypeStatistics(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
                } else if (nextProps.searchType === 'month') {
                    this.setState({
                        currentType: 'month',
                    });
                    this.getViewCountData('month', nextProps.orgcode);
                    const monthTypeTime = this.getTime('month');
                    this.getAllXzCaseProgress(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                    this.getAllXzTypeCase('month', nextProps.orgcode);
                    this.getCaseTypeStatistics(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
                } else if (nextProps.searchType === 'selectedDate') {
                    const { selectedDateVal } = nextProps;
                    this.setState({
                        currentType: 'selectedDate',
                    }, function() {
                        this.getAllXzCaseProgress(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                        this.getAllXzTypeCase('selectedDate', nextProps.orgcode, selectedDateVal[0], selectedDateVal[1]);
                        this.getCaseTypeStatistics(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
                    });
                }
            }
        }
    }

    // 获取头部本、上、前按键数据
    getViewCountData = (type, orgcode = this.props.orgcode) => {
        const { weekType, monthType } = this.state;
        if (type === 'week') {
            for (let i in weekType) {
                const weekTypeTime = this.getTime(weekType[i]);
                this.getAllXzCaseProgress(weekTypeTime[0], weekTypeTime[1], orgcode, weekType[i]);
            }
        } else if (type === 'month') {
            for (let i in monthType) {
                const monthTypeTime = this.getTime(monthType[i]);
                this.getAllXzCaseProgress(monthTypeTime[0], monthTypeTime[1], orgcode, monthType[i]);
            }
        }
    };
    getTime = (type) => {
        const time = getTimeDistance(type);
        const startTime = time[0] === '' ? '' : moment(time[0]).format('YYYY-MM-DD');
        const endTime = time[1] === '' ? '' : moment(time[1]).format('YYYY-MM-DD');
        return [startTime, endTime];
    };
    // 案件情况展示
    getAllXzCaseProgress = (startTime, endTime, orgcode = this.props.orgcode, type) => {
        const { weekType, monthType, currentType } = this.state;
        this.props.dispatch({
            type: 'XzCaseData/getAllXzCaseProgress',
            payload: {
                kssj: startTime,
                jssj: endTime,
                ssmk: '1',
                orgcode,
            },
            callback: (data) => {
                if (data) {
                    const legendData = [];
                    const pieData = [];
                    let countData = 0;
                    let sa = 0;
                    let ja = 0;
                    let saName = '';
                    let jaName = '';
                    for (let i = 0; i < data.list.length; i++) {
                        let obj = {
                            name: data.list[i].name,
                            icon: 'circle',
                        };
                        let pieObj = {
                            name: data.list[i].name,
                            value: data.list[i].count,
                            itemStyle: { color: colors1[i] },
                        };
                        if (data.list[i].name !== '结案') {
                            countData += data.list[i].count;
                            legendData.push(obj);
                            pieData.push(pieObj);
                        }
                        // pieData.push({name: data.list[i].name, value: data.list[i].count,itemStyle:{color:colors1[i]}});
                        if (data.list[i].code === 201) {
                            sa = data.list[i].count;
                            saName = data.list[i].name;
                        }
                        if (data.list[i].code === 206) {
                            ja = 0;
                            jaName = '结案';
                        }
                    }
                    if (currentType === 'selectedDate') {
                        this.setState({
                            selectedDateData: [
                                `${saName}：${sa}`,
                                `${jaName}：${ja}`,
                            ],
                        });
                    }
                    if (type) {
                        if (type === weekType[0] || type === monthType[0]) {
                            this.setState({
                                nowData: [sa, ja],
                                nowDataName: [saName, jaName],
                            });
                        }
                        if (type === weekType[1] || type === monthType[1]) {
                            this.setState({
                                lastData: [sa, ja],
                                lastDataName: [saName, jaName],
                            });
                        }
                        if (type === weekType[2] || type === monthType[2]) {
                            this.setState({
                                beforeLastData: [sa, ja],
                                beforeLastDataName: [saName, jaName],
                            });
                        }
                    } else {
                        xzCaseEchartRingPie.setOption({
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
                                        formatter: '案件总数\n\n' + countData,
                                    },
                                },
                            }],
                        });
                    }
                }

            },
        });
    };
    // 受结情况
    getAllXzTypeCase = (currentDateType, orgcode = this.props.orgcode, sTime, eTime) => {
        const { dateType } = this.state;
        let payload = {
            rqType: dateType[currentDateType],
            ssmk: '1',
            orgcode,
        };
        if (currentDateType === 'selectedDate') {
            payload = {
                kssj: sTime,
                jssj: eTime,
                ssmk: '1',
                orgcode,
            };
        }
        this.props.dispatch({
            type: 'XzCaseData/getAllXzTypeCase',
            payload,
            callback: (data) => {
                if (data) {
                    let xData = [];
                    let saData = []; // 受理
                    let jaData = []; // 结案
                    if (data.list && data.list.length > 0) {
                        this.setState({
                            sjqkzsNoData: false,
                        });

                        for (let i = 0; i < data.list.length; i++) {
                            xData.push(data.list[i].name);
                            saData.push(data.list[i].count1);
                            jaData.push(data.list[i].count2);
                        }

                    } else {
                        // this.setState({
                        //     sjqkzsNoData: true,
                        // })
                        let momentMonth;
                        if (dateType[currentDateType] === '6') {
                            momentMonth = moment();
                        } else if (dateType[currentDateType] === '7') {
                            momentMonth = moment().subtract(1, 'months');
                        } else if (dateType[currentDateType] === '8') {
                            momentMonth = moment().subtract(2, 'months');
                        }
                        const dayArry = getDefaultDaysForMonth(momentMonth);
                        saData = [0, 0, 0, 0, 0, 0, 0];
                        jaData = [0, 0, 0, 0, 0, 0, 0];
                        xData = dayArry;
                    }
                    xzCaseEchartLine.setOption({
                        xAxis: {
                            data: xData,
                        },
                        series: [
                            {
                                data: saData,
                                itemStyle: {
                                    color: '#FD0134',
                                },
                            },
                        ],
                    });
                }
            },
        });
    };
    // 获取行政案件类别统计
    getCaseTypeStatistics = (startTime, endTime, orgcode = this.props.orgcode) => {
        this.props.dispatch({
            type: 'XzCaseData/getCaseTypeStatistics',
            payload: {
                kssj: startTime,
                jssj: endTime,
                ajlb: 'xz',
                ssmk: '1',
                orgcode,
                is_area:window.configUrl.is_area === '1'?'1':'0',
            },
            callback: (data) => {
                const xData = [];
                const barData = [];
                let isLargeData = false;
                if (data && data.list) {
                    data.list.forEach((item, index) => {
                        xData.push(item.name);
                        barData.push({ value: item.count, code: item.code, code2: item.code_2, code3: item.code_3 });
                        if (index > 14) isLargeData = true;
                    });
                }
                if (isLargeData) {
                    caseTypeStatisticsBar.setOption({
                        xAxis: {
                            data: xData,
                        },
                        dataZoom: [{
                            show: true,
                            start: 0,
                            end: 14,
                        }],
                        series: [{
                            data: barData,
                        }],
                    });
                } else {
                    caseTypeStatisticsBar.setOption({
                        xAxis: {
                            data: xData,
                        },
                        series: [{
                            data: barData,
                        }],
                    });
                }
            },
        });
    };
    // 本、昨、前change
    changeCountButtonCurrent = (type) => {
        const { searchType } = this.props;
        let currentType = '';
        if (type === 'now') {
            currentType = searchType === 'week' ? 'week' : 'month';
        } else if (type === 'last') {
            currentType = searchType === 'week' ? 'lastWeek' : 'lastMonth';
        } else if (type === 'beforeLast') {
            currentType = searchType === 'week' ? 'beforeLastWeek' : 'beforeLastMonth';
        }
        this.setState({
            currentType,
        });
        const dataTime = this.getTime(currentType);
        this.getAllXzCaseProgress(dataTime[0], dataTime[1]);
        // this.getAdministrativePenalty(dataTime[0],dataTime[1]);
        this.getAllXzTypeCase(currentType);
        this.getCaseTypeStatistics(dataTime[0], dataTime[1]);
    };
    // 案件情况展示环形饼状图
    showXzCaseEchartRingPie = () => {
        const that = this;
        xzCaseEchartRingPie = echarts.init(document.getElementById('ajqkzs'));
        const option = {
            // title: {
            //     text: '案件情况展示',
            //     textStyle: {
            //         fontSize: 16,
            //         fontWeight: 'normal',
            //     },
            //     padding: 8,
            // },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                data: [],
                bottom: 0,
                show: false,
            },
            series: [
                {
                    name: '案件情况展示',
                    type: 'pie',
                    center: ['50%', '55%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '案件总数\n\n547',
                            textStyle: {
                                fontSize: '22',
                                // fontWeight: 'bold',
                                color: '#fff',
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
        xzCaseEchartRingPie.setOption(option, true);
        xzCaseEchartRingPie.on('click', function(params) {
            const { currentType } = that.state;
            const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
            that.props.changeToListPage({ ajzt: params.name }, dataTime);
        });
    };
    // 受案情况展示
    showXzCaseEchartLine = () => {
        xzCaseEchartLine = echarts.init(document.getElementById('sjqkzs'));
        const option = {
            // title: {
            //     text: '受案情况展示',
            //     textStyle: {
            //         fontSize: 16,
            //         fontWeight: 'normal',
            //     },
            //     padding: 8,
            // },
            tooltip: {
                trigger: 'axis',
            },
            // legend: {
            //     data:['受理'],
            //     top: '5%',
            //     right: '15%',
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            toolbox: {
                feature: {
                    // saveAsImage: {},
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel: {
                  textStyle:{
                    color:'#fff',
                  }
                },
            },
            yAxis: {
                type: 'value',
                color:'#fff',
                axisLabel: {
                  textStyle:{
                    color:'#fff',
                  }
                },
            },
            series: [
                {
                    name: '受理',
                    type: 'line',
                    data: [],
                },
                // {
                //     name:'结案',
                //     type:'line',
                //     data:[],
                // },
            ],
        };
        xzCaseEchartLine.setOption(option, true);
        let that = this;
        xzCaseEchartLine.on('click', function(params) {
            const dataTime = [params.name, params.name];
            that.props.changeToListPage(null, dataTime);
        });
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
    // 案件类型统计柱状图
    showCaseTypeStatisticsBar = () => {
        const that = this;
        caseTypeStatisticsBar = echarts.init(document.getElementById('ajlxtj'));
        const option = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            // title: {
            //     text: '案件类型统计',
            //     textStyle: {
            //         fontSize: 16,
            //         fontWeight: 'normal',
            //     },
            //     padding: 8,
            // },
            xAxis: {
                type: 'category',
                axisLine: { show: false },
                data: [],
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    interval: 0,
                    formatter: (value) => this.insertFlg(value, '\n', 10),
                    textStyle:{
                      color:'#fff',
                    }
                },
            },
            yAxis: {
                taxisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                },
            },
            series: [
                {
                    type: 'bar',
                    // barWidth: '60%',
                    data: [],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}',
                            textStyle: {
                                fontSize: 16,
                                color: '#000',
                            },
                        },
                    },
                },
            ],
        };
        caseTypeStatisticsBar.setOption(option);
        caseTypeStatisticsBar.getZr().on('click', function(params) {
            let point = [params.offsetX, params.offsetY];
            if (caseTypeStatisticsBar.containPixel('grid', point)) {
                let xIndex = parseInt(caseTypeStatisticsBar.convertFromPixel({ seriesIndex: 0 }, point)[0]);
                let op = caseTypeStatisticsBar.getOption();
                let code = op.series[0].data[xIndex].code;
                let code2 = op.series[0].data[xIndex].code2;
                let code3 = op.series[0].data[xIndex].code3;
                if (code&&code2&&code3) {
                    const { currentType } = that.state;
                    const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
                    that.props.changeToListPage({ ajlb: [code3, code2, code] }, dataTime);
                }
            }
        });
    };

    render() {
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        // const colLayout = {sm: 24, lg: 12};
        const { searchType, selectedDateVal, showDataView } = this.props;
        const { currentType, beforeLastData, lastData, nowData, nowDataName, lastDataName, beforeLastDataName, sjqkzsNoData, selectedDateData } = this.state;
        return (
          <Card style={{ position: 'relative'}} className={styles.policeDataCard}>
            <div className={styles.xzCaseDataView} style={showDataView ? {} : { position: 'absolute', zIndex: -1 }}>
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
                                <div className={styles.countButtonNumber}>
                                    <div style={{ height: 65, lineHeight: '65px' }}>{nowDataName[0]}：{nowData[0]}</div>
                                    {/*<div>结案：0</div>*/}
                                </div>
                            </div>
                            <div
                                className={(currentType === 'lastWeek' || currentType === 'lastMonth') ? styles.countButtonCurrent : styles.countButton}
                                onClick={() => this.changeCountButtonCurrent('last')}
                            >
                                {
                                    searchType === 'week' ? <DataViewDateShow dataTypeStr='前一周'/> :
                                        <DataViewDateShow dataTypeStr='前一月'/>
                                }
                                <div className={styles.countButtonNumber}>
                                    <div
                                        style={{ height: 65, lineHeight: '65px' }}>{lastDataName[0]}：{lastData[0]}</div>
                                    {/*<div>结案：0</div>*/}
                                </div>
                            </div>
                            <div
                                className={(currentType === 'beforeLastWeek' || currentType === 'beforeLastMonth') ? styles.countButtonCurrent : styles.countButton}
                                onClick={() => this.changeCountButtonCurrent('beforeLast')}
                            >
                                {
                                    searchType === 'week' ? <DataViewDateShow dataTypeStr='前二周'/> :
                                        <DataViewDateShow dataTypeStr='前二月'/>
                                }
                                <div className={styles.countButtonNumber}>
                                    <div style={{
                                        height: 65,
                                        lineHeight: '65px',
                                    }}>{beforeLastDataName[0]}：{beforeLastData[0]}</div>
                                    {/*<div>结案：0</div>*/}
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
                                    <div>{selectedDateData[0]}</div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <Row gutter={rowLayout} className={styles.listPageRow}>
                    <Col sm={24} lg={12} xl={6}>
                        <div className={styles.cardBoxTitle}>|  案件情况展示</div>
                        <div id="ajqkzs" className={styles.cardBox}></div>
                    </Col>
                    <Col sm={24} lg={12} xl={18}>
                        <div className={styles.cardBoxTitle}>|  受案情况展示</div>
                        <div id="sjqkzs" className={styles.cardBox}></div>
                        {
                            sjqkzsNoData ? (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    padding: 16,
                                    backgroundColor: '#ffffff',
                                }}>
                                    <div style={{ fontSize: 16, padding: '8px 0 0 8px' }}>受案情况展示</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}>
                                        <img src={nonDivImg} alt="暂无数据"/>
                                        <div style={{ fontSize: 18 }}>暂无数据</div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </Col>
                </Row>
                <Row gutter={rowLayout} className={styles.listPageRow}>
                    <Col span={24}>
                        <div className={styles.cardBoxTitle}>|  案件类型统计</div>
                        <div id="ajlxtj" className={styles.cardBox}></div>
                    </Col>
                </Row>
            </div>
          </Card>
        );
    }
}
