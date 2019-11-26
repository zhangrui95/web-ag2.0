/*
* RobGrabFraud.js 警情分析--抢劫、抢夺、诈骗
* author：lyp
* 20181218
* */

import React, { PureComponent } from 'react';
import {Tooltip, Icon, Table, Row, Col, Spin, Empty} from 'antd';
import echarts from 'echarts'
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from "@/assets/viewData/noList.png";

let treePie;
let fraudBar;

export default class RobGrabFraud extends PureComponent {
    state = {
        liangqiangTableData: [],
        zhapianTableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getRobGrabFraud(this.props);
        this.showEchart();
        this.showFraudBar();
        window.addEventListener('resize', treePie.resize);
        window.addEventListener('resize', fraudBar.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectedDate !== null) && (this.props.selectedDate !== nextProps.selectedDate)) {
                this.getRobGrabFraud(nextProps);
            }
        }
    }

    getRobGrabFraud = (propsData) => {
        this.props.changeLoadingStatus({ robGrabFraudLoadingStatus: true });
        this.setState({ loadingData: true });
        const { dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate } = propsData;
        dispatch({
            type: 'trendAnalysis/getRobGrabFraud',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
            },
            callback: (data) => {
                if (data) {
                    const { liangqiang, zhapian } = data;
                    let pie1 = [];
                    let pie2 = [];
                    let pie3 = [];
                    let liangqiangTableData = [];
                    let zhapianTableData = [];
                    let xData = [];
                    let barData = [];
                    if (liangqiang) {
                        pie1 = [
                            {
                                name: selectedDateStr,
                                value: liangqiang.nowtime,
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0, color: '#00c6ff', // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#0072ff', // 100% 处的颜色
                                        }],
                                    },
                                },
                            },
                        ];
                        pie2 = [
                            {
                                name: yearOnYearDateStr,
                                value: liangqiang.lastyear,
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0, color: '#edde5d', // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#f09819', // 100% 处的颜色
                                        }],
                                    },
                                },
                            },
                        ];
                        pie3 = [
                            {
                                name: monthOnMonthDateStr,
                                value: liangqiang.lastmonth,
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0, color: '#799f0c', // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#92f39d', // 100% 处的颜色
                                        }],
                                    },
                                },
                            },
                        ];
                        liangqiangTableData = [
                            {
                                categories: '两抢案件（起）',
                                selectedDateStr: liangqiang.nowtime || 0,
                                yearOnYearDateStr: liangqiang.lastyear || 0,
                                tbzf_q: liangqiang.tbzf || 0,
                                tbzf_l: liangqiang.tbzf100 || '0%',
                                monthOnMonthDateStr: liangqiang.lastmonth,
                                hbzf_q: liangqiang.hbzf || 0,
                                hbzf_l: liangqiang.hbzf100 || '0%',
                            },
                        ];
                        treePie.setOption({
                            series: [{
                                data: pie1,
                                label: {
                                    normal: {
                                        formatter: `${selectedDateStr}\n\n案发${liangqiang.nowtime}起`,
                                    },
                                },
                            }, {
                                data: pie2,
                                label: {
                                    normal: {
                                        formatter: `${yearOnYearDateStr}\n\n案发${liangqiang.lastyear}起`,
                                    },
                                },
                            }, {
                                data: pie3,
                                label: {
                                    normal: {
                                        formatter: `${monthOnMonthDateStr}\n\n案发${liangqiang.lastmonth}起`,
                                    },
                                },
                            }],
                        });
                    }
                    if (zhapian) {
                        zhapianTableData = [
                            {
                                categories: selectedDateStr,
                                fraud: zhapian.nowtime,
                            },
                            {
                                categories: yearOnYearDateStr,
                                fraud: zhapian.lastyear,
                            },
                            {
                                categories: '同比增幅（起）',
                                fraud: zhapian.tbzf,
                            },
                            {
                                categories: '同比增幅（%）',
                                fraud: zhapian.tbzf100,
                            },
                            {
                                categories: monthOnMonthDateStr,
                                fraud: zhapian.lastmonth,
                            },
                            {
                                categories: '环比增幅（起）',
                                fraud: zhapian.hbzf,
                            },
                            {
                                categories: '环比增幅（%）',
                                fraud: zhapian.hbzf100,
                            },
                        ];
                        xData = [
                            selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr,
                        ];
                        barData = [
                            {
                                name: selectedDateStr,
                                value: zhapian.nowtime,
                                itemStyle: { color: '#3AA0FF' },
                            },
                            {
                                name: yearOnYearDateStr,
                                value: zhapian.lastyear,
                                itemStyle: { color: '#DCCA23' },
                            },
                            {
                                name: monthOnMonthDateStr,
                                value: zhapian.lastmonth,
                                itemStyle: { color: '#31BD74' },
                            },
                        ];
                        fraudBar.setOption({

                            xAxis: {
                                data: xData,
                            },
                            series: {
                                data: barData,
                            },
                        });
                    }
                    this.setState({
                        liangqiangTableData,
                        zhapianTableData,
                    });
                    this.props.goToCarousel(2);
                }
                this.setState({ loadingData: false });
                this.props.changeLoadingStatus({ robGrabFraudLoadingStatus: false });
            },
        });
    };

    showEchart = () => {
        treePie = echarts.init(document.getElementById('robGrabPie'));
        const option = {
            series: [
                {
                    type: 'pie',
                    center: ['50%', '55%'],
                    radius: ['65%', '80%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
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
                {
                    type: 'pie',
                    center: ['20%', '55%'],
                    radius: ['55%', '70%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '{c}',
                            textStyle: {
                                fontSize: '20',
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
                {
                    type: 'pie',
                    center: ['80%', '55%'],
                    radius: ['55%', '70%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '{c}',
                            textStyle: {
                                fontSize: '20',
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
        treePie.setOption(option);
    };
    // 诈骗bar
    showFraudBar = () => {
        fraudBar = echarts.init(document.getElementById('fraudBar'));
        const option = {
            color: ['#3AA0FF', '#DCCA23', '#31BD74'],
            xAxis: {
                type: 'category',
                axisLine: { show: false },
                data: [],
                axisTick: {
                    alignWithLabel: true,
                },
            },
            yAxis: {
                axisLabel: {   // y轴线 标签修改
                    textStyle: {
                        color: '#fff', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // y轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: '#fff'
                    }
                },
            },
            series: {
                type: 'bar',
                cursor: 'default',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{c}',
                        textStyle: {
                            fontSize: 16,
                            color: '#fff',
                        },
                    },
                },
                data: [],
            },
        };
        fraudBar.setOption(option);
    };

    render() {
        const { selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr } = this.props;
        const { liangqiangTableData, zhapianTableData, loadingData } = this.state;
        const columns = [{
            title: '类别',
            dataIndex: 'categories',
            key: 'categories',

        }, {
            title: selectedDateStr,
            dataIndex: 'selectedDateStr',
            key: 'selectedDateStr',
        }, {
            title: yearOnYearDateStr,
            dataIndex: 'yearOnYearDateStr',
            key: 'yearOnYearDateStr',
        }, {
            title: <span>同比增幅（起）<Tooltip title="同比增幅=本期数-同期数"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'tbzf_q',
            dataIndex: 'tbzf_q',
        }, {
            title: <span>同比增幅（%）<Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'tbzf_l',
            dataIndex: 'tbzf_l',
        }, {
            title: monthOnMonthDateStr,
            dataIndex: 'monthOnMonthDateStr',
            key: 'monthOnMonthDateStr',
        }, {
            title: <span>环比增幅（起）<Tooltip title="环比增幅=本期数-上期数"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'hbzf_q',
            dataIndex: 'hbzf_q',
        }, {
            title: <span>环比增幅（%）<Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'hbzf_l',
            dataIndex: 'hbzf_l',
        }];
        const fraudColumns = [
            {
                title: '对比时间',
                dataIndex: 'categories',
                key: 'categories',

                render: (text) => {
                    if (text === '同比增幅（起）') {
                        return <span>同比增幅（起）<Tooltip title="同比增幅=本期数-同期数"><Icon type="info-circle-o"/></Tooltip></span>;
                    } else if (text === '同比增幅（%）') {
                        return <span>同比增幅（%）<Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%"><Icon
                            type="info-circle-o"/></Tooltip></span>;
                    } else if (text === '环比增幅（起）') {
                        return <span>环比增幅（起）<Tooltip title="环比增幅=本期数-上期数"><Icon type="info-circle-o"/></Tooltip></span>;
                    } else if (text === '环比增幅（%）') {
                        return <span>环比增幅（%）<Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%"><Icon
                            type="info-circle-o"/></Tooltip></span>;
                    } else {
                        return text;
                    }
                },
            }, {
                title: '诈骗案（起）',
                dataIndex: 'fraud',
                key: 'fraud',
            },
        ];

        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={styles.analysis}>
                    <AnalysisTitleArea analysisTitle="两抢案件" {...this.props} />
                    <div id="robGrabPie" style={{ height: 300 }}/>
                    <Table columns={columns} dataSource={liangqiangTableData} bordered className={styles.tableArea}  locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                           pagination={false} />
                    <h2 className={styles.areaTitle}>诈骗案件</h2>
                    <Row className={styles.fraudArea}>
                        <Col lg={12} md={24}>
                            <div id="fraudBar" style={{ height: 300 }}/>
                        </Col>
                        <Col lg={12} md={24}>
                            <Table columns={fraudColumns} dataSource={zhapianTableData} className={styles.fraudTable}  locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                                   bordered pagination={false}/>
                        </Col>
                    </Row>
                </div>
            </Spin>
        );
    }
}