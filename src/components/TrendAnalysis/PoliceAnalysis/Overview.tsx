/*
* Overview.js 警情分析--综述
* author：lyp
* 20181214
* */

import React, { PureComponent } from 'react';
import {Tooltip, Icon, Table, Spin, Empty} from 'antd';
import echarts from 'echarts'
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from "@/assets/viewData/noList.png";

let myChart;

export default class Overview extends PureComponent {
    state = {
        tableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getOverviewData(this.props);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectedDate !== null) && (this.props.selectedDate !== nextProps.selectedDate)) {
                this.getOverviewData(nextProps);
            }
        }
    }

    getOverviewData = (propsData) => {
        this.props.changeLoadingStatus({ overViewLoadingStatus: true });
        this.setState({ loadingData: true });
        const { dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate } = propsData;
        dispatch({
            type: 'trendAnalysis/getOverviewData',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
            },
            callback: (data) => {
                if (data) {
                    const { jjzl, xsl, xzl } = data;
                    let barData = [];
                    let tableData = [];
                    if (jjzl && xsl && xzl) {
                        barData = [
                            {
                                name: selectedDateStr,
                                type: 'bar',
                                cursor: 'default',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                    },
                                },
                                data: [
                                    { name: '刑事', value: xsl.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
                                    { name: '行政', value: xzl.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
                                    {
                                        name: '其他',
                                        value: jjzl.nowtime - xsl.nowtime - xzl.nowtime,
                                        itemStyle: { color: '#3AA0FF' },
                                    },
                                ],
                            },
                            {
                                name: yearOnYearDateStr,
                                type: 'bar',
                                cursor: 'default',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                    },
                                },
                                data: [
                                    { name: '刑事', value: xsl.lastyear || 0, itemStyle: { color: '#DCCA23' } },
                                    { name: '行政', value: xzl.lastyear || 0, itemStyle: { color: '#DCCA23' } },
                                    {
                                        name: '其他',
                                        value: jjzl.lastyear - xsl.lastyear - xzl.lastyear,
                                        itemStyle: { color: '#DCCA23' },
                                    },
                                ],
                            },
                            {
                                name: monthOnMonthDateStr,
                                type: 'bar',
                                cursor: 'default',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                    },
                                },
                                data: [
                                    { name: '刑事', value: xsl.lastmonth, itemStyle: { color: '#31BD74' } },
                                    { name: '行政', value: xzl.lastmonth, itemStyle: { color: '#31BD74' } },
                                    {
                                        name: '其他',
                                        value: jjzl.lastmonth - xsl.lastmonth - xzl.lastmonth,
                                        itemStyle: { color: '#31BD74' },
                                    },
                                ],
                            },
                        ];
                        tableData = [
                            {
                                categories: '接警总量（起）',
                                selectedDateStr: jjzl.nowtime || 0,
                                yearOnYearDateStr: jjzl.lastyear || 0,
                                tbzf_q: jjzl.tbzf || 0,
                                tbzf_l: jjzl.tbzf100 || '0%',
                                monthOnMonthDateStr: jjzl.lastmonth,
                                hbzf_q: jjzl.hbzf || 0,
                                hbzf_l: jjzl.hbzf100 || '0%',
                            }, {
                                categories: '刑事类（起）',
                                selectedDateStr: xsl.nowtime || 0,
                                yearOnYearDateStr: xsl.lastyear || 0,
                                tbzf_q: xsl.tbzf || 0,
                                tbzf_l: xsl.tbzf100 || '0%',
                                monthOnMonthDateStr: xsl.lastmonth,
                                hbzf_q: xsl.hbzf || 0,
                                hbzf_l: xsl.hbzf100 || '0%',
                            }, {
                                categories: '行政类（起）',
                                selectedDateStr: xzl.nowtime || 0,
                                yearOnYearDateStr: xzl.lastyear || 0,
                                tbzf_q: xzl.tbzf || 0,
                                tbzf_l: xzl.tbzf100 || '0%',
                                monthOnMonthDateStr: xzl.lastmonth,
                                hbzf_q: xzl.hbzf || 0,
                                hbzf_l: xzl.hbzf100 || '0%',
                            },
                        ];
                    }
                    this.setState({
                        tableData,
                    });
                    myChart.setOption({
                        yAxis: {
                            data: ['刑事', '行政', '其他'],
                        },
                        series: barData,
                    });
                    this.props.goToCarousel(0);
                }
                this.setState({ loadingData: false });
                this.props.changeLoadingStatus({ overViewLoadingStatus: false });
            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('overviewCharts'));
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            legend: {
                data: ['行政', '刑事', '其他'],
                bottom: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            xAxis: {
                type: 'value',
                axisLabel: {   // X轴线 标签修改
                    textStyle: {
                        color: '#fff', //坐标值得具体的颜色
                    }
                },
                splitLine:{
                    show: true, // X轴线 颜色类型的修改
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: '#fff'
                    }
                },
            },
            yAxis: {
                type: 'category',
                data: [],
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
            series: [],
        };
        myChart.setOption(option);
    };

    render() {
        const { selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr } = this.props;
        const { tableData, loadingData } = this.state;
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
                    <div id="overviewCharts" style={{ height: 300 }}/>
                    <Table columns={columns} dataSource={tableData} bordered className={styles.tableArea}
                           pagination={false}  locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}/>
                </div>
            </Spin>
        );
    }
}