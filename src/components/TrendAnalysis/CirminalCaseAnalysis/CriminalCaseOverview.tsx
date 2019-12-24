/*
* CriminalCaseOverview.js 刑事案件分析--综述
* author：lyp
* 20181226
* */

import React, {PureComponent} from 'react';
import {Tooltip, Icon, Table, Spin, Empty} from 'antd';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import grid from 'echarts/lib/component/grid';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

let myChart;

export default class CriminalCaseOverview extends PureComponent {
    state = {
        tableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getOverviewData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectedDate !== null) && (this.props.selectedDate !== nextProps.selectedDate) || this.props.global.dark !== nextProps.global.dark) {
                this.getOverviewData(nextProps);
            }
        }
    }

    getOverviewData = (propsData) => {
        this.props.changeLoadingStatus({criminalCaseOverviewLoadingStatus: true});
        this.setState({loadingData: true});
        const {dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate} = propsData;
        dispatch({
            type: 'trendAnalysis/getCriminalCaseOverviewData',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
            },
            callback: (data) => {
                if (data) {
                    const {ja, la, pa, zl, sa, pal} = data;
                    let barData = [];
                    let tableData = [];
                    const xData = ['案件总数', '受理', '立案', '破案', '结案'];
                    if (zl && ja && la && pa && sa) {
                        barData = [{
                            name: selectedDateStr,
                            type: 'bar',
                            cursor: 'default',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                },
                            },
                            data: [
                                {name: '案件总数', value: zl.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                                {name: '受理', value: sa.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                                {name: '立案', value: la.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                                {name: '破案', value: pa.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                                {name: '结案', value: ja.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                            ],
                        }, {
                            name: yearOnYearDateStr,
                            type: 'bar',
                            cursor: 'default',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                },
                            },
                            data: [
                                {name: '案件总数', value: zl.lastyear || 0, itemStyle: {color: '#DCCA23'}},
                                {name: '受理', value: sa.lastyear || 0, itemStyle: {color: '#DCCA23'}},
                                {name: '立案', value: la.lastyear || 0, itemStyle: {color: '#DCCA23'}},
                                {name: '破案', value: pa.lastyear || 0, itemStyle: {color: '#DCCA23'}},
                                {name: '结案', value: ja.lastyear || 0, itemStyle: {color: '#DCCA23'}},
                            ],
                        }, {
                            name: monthOnMonthDateStr,
                            type: 'bar',
                            cursor: 'default',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                },
                            },
                            data: [
                                {name: '案件总数', value: zl.lastmonth || 0, itemStyle: {color: '#31BD74'}},
                                {name: '受理', value: sa.lastmonth || 0, itemStyle: {color: '#31BD74'}},
                                {name: '立案', value: la.lastmonth || 0, itemStyle: {color: '#31BD74'}},
                                {name: '破案', value: pa.lastmonth || 0, itemStyle: {color: '#31BD74'}},
                                {name: '结案', value: ja.lastmonth || 0, itemStyle: {color: '#31BD74'}},
                            ],
                        }];
                    }

                    tableData = [
                        {
                            categories: '案件总量（起）',
                            selectedDateStr: zl.nowtime || 0,
                            yearOnYearDateStr: zl.lastyear || 0,
                            tbzf_q: zl.tbzf || 0,
                            tbzf_l: zl.tbzf100 || '0%',
                            monthOnMonthDateStr: zl.lastmonth,
                            hbzf_q: zl.hbzf || 0,
                            hbzf_l: zl.hbzf100 || '0%',
                        }, {
                            categories: '受理（起）',
                            selectedDateStr: sa.nowtime || 0,
                            yearOnYearDateStr: sa.lastyear || 0,
                            tbzf_q: sa.tbzf || 0,
                            tbzf_l: sa.tbzf100 || '0%',
                            monthOnMonthDateStr: sa.lastmonth,
                            hbzf_q: sa.hbzf || 0,
                            hbzf_l: sa.hbzf100 || '0%',
                        }, {
                            categories: '立案（起）',
                            selectedDateStr: la.nowtime || 0,
                            yearOnYearDateStr: la.lastyear || 0,
                            tbzf_q: la.tbzf || 0,
                            tbzf_l: la.tbzf100 || '0%',
                            monthOnMonthDateStr: la.lastmonth,
                            hbzf_q: la.hbzf || 0,
                            hbzf_l: la.hbzf100 || '0%',
                        }, {
                            categories: '破案（起）',
                            selectedDateStr: pa.nowtime || 0,
                            yearOnYearDateStr: pa.lastyear || 0,
                            tbzf_q: pa.tbzf || 0,
                            tbzf_l: pa.tbzf100 || '0%',
                            monthOnMonthDateStr: pa.lastmonth,
                            hbzf_q: pa.hbzf || 0,
                            hbzf_l: pa.hbzf100 || '0%',
                        }, {
                            categories: '结案（起）',
                            selectedDateStr: ja.nowtime || 0,
                            yearOnYearDateStr: ja.lastyear || 0,
                            tbzf_q: ja.tbzf || 0,
                            tbzf_l: ja.tbzf100 || '0%',
                            monthOnMonthDateStr: ja.lastmonth,
                            hbzf_q: ja.hbzf || 0,
                            hbzf_l: ja.hbzf100 || '0%',
                        }, {
                            categories: '破案率（%）',
                            selectedDateStr: pal.nowtime || 0,
                            yearOnYearDateStr: pal.lastyear || 0,
                            tbzf_q: pal.tbzf || 0,
                            tbzf_l: pal.tbzf100 || '0%',
                            monthOnMonthDateStr: pal.lastmonth,
                            hbzf_q: pal.hbzf || 0,
                            hbzf_l: pal.hbzf100 || '0%',
                        },

                    ];

                    this.setState({
                        tableData,
                    });
                    // myChart.setOption({
                    //     xAxis: {
                    //         data: xData,
                    //     },
                    //     series: barData,
                    // });
                    if (document.getElementById('criminalCaseOverview')) {
                        this.showEchart(xData, barData);
                        window.addEventListener('resize', myChart.resize);
                    }
                    this.props.goToCarousel(0);
                }
                this.setState({loadingData: false});
                this.props.changeLoadingStatus({criminalCaseOverviewLoadingStatus: false});
            },
        });
    };

    showEchart = (xData, barData) => {
        myChart = echarts.init(document.getElementById('criminalCaseOverview'));
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {   // x轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6',
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {   // y轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // y轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
                    }
                },
            },
            series: barData,
        };
        myChart.setOption(option);
    };

    render() {
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const {tableData, loadingData} = this.state;
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

        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={styles.analysis}>
                    <AnalysisTitleArea analysisTitle="综述" {...this.props} />
                    <div id="criminalCaseOverview" style={{height: 300}}
                         className={this.props.global && this.props.global.dark ? '' : styles.lightChartBox}/>
                    <Table columns={columns} dataSource={tableData} bordered className={styles.tableArea}
                           pagination={false} locale={{
                        emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                          description={'暂无数据'}/>
                    }}/>
                </div>
            </Spin>
        );
    }
}
