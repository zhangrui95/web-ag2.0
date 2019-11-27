/*
* PersonIllegalPunish.js 涉案人员分析--违法行为人处罚
* author：lyp
* 20181227
* */

import React, { PureComponent } from 'react';
import { Tooltip, Icon, Table, Spin } from 'antd';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import grid from 'echarts/lib/component/grid';
import title from 'echarts/lib/component/title';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import moment from 'moment';

let myChart;
let ratePie;

export default class PersonIllegalPunish extends PureComponent {
    state = {
        tableData: [],
        rateTableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getPunishTypeData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectedDate !== null) && ((this.props.selectedDate !== nextProps.selectedDate) || (this.props.userOrgCode !== nextProps.userOrgCode))) {
                this.getPunishTypeData(nextProps);
            }
        }
    }

    getPunishTypeData = (propsData) => {
        this.props.changeLoadingStatus({ personIllegalPunishLoadingStatus: true });
        this.setState({ loadingData: true });
        const { dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate, userOrgCode } = propsData;
        dispatch({
            type: 'trendAnalysis/getPunishTypeData',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
                orgcode12: userOrgCode,
            },
            callback: (data) => {
                if (data) {
                    const { bc, cfrs, fk, jg, jl, qt, wcfrs, wf } = data;
                    let barData = [];
                    let tableData = [];
                    let rateTableData = [];
                    let pie1 = [];
                    let pie2 = [];
                    let pie3 = [];
                    const xData = ['罚款', '拘留', '并处', '警告', '其他'];
                    if (fk && jl && bc && jg && qt) {
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
                                { name: '罚款', value: fk.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
                                { name: '拘留', value: jl.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
                                { name: '并处', value: bc.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
                                { name: '警告', value: jg.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
                                { name: '其他', value: qt.nowtime || 0, itemStyle: { color: '#3AA0FF' } },
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
                                { name: '罚款', value: fk.lastyear || 0, itemStyle: { color: '#DCCA23' } },
                                { name: '拘留', value: jl.lastyear || 0, itemStyle: { color: '#DCCA23' } },
                                { name: '并处', value: bc.lastyear || 0, itemStyle: { color: '#DCCA23' } },
                                { name: '警告', value: jg.lastyear || 0, itemStyle: { color: '#DCCA23' } },
                                { name: '其他', value: qt.lastyear || 0, itemStyle: { color: '#DCCA23' } },
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
                                { name: '罚款', value: fk.lastmonth || 0, itemStyle: { color: '#31BD74' } },
                                { name: '拘留', value: jl.lastmonth || 0, itemStyle: { color: '#31BD74' } },
                                { name: '并处', value: bc.lastmonth || 0, itemStyle: { color: '#31BD74' } },
                                { name: '警告', value: jg.lastmonth || 0, itemStyle: { color: '#31BD74' } },
                                { name: '其他', value: qt.lastmonth || 0, itemStyle: { color: '#31BD74' } },
                            ],
                        }];
                        tableData = [
                            {
                                categories: '罚款（人）',
                                selectedDateStr: fk.nowtime || 0,
                                yearOnYearDateStr: fk.lastyear || 0,
                                tbzf_q: fk.tbzf || 0,
                                tbzf_l: fk.tbzf100 || '0%',
                                monthOnMonthDateStr: fk.lastmonth,
                                hbzf_q: fk.hbzf || 0,
                                hbzf_l: fk.hbzf100 || '0%',
                            }, {
                                categories: '拘留（人）',
                                selectedDateStr: jl.nowtime || 0,
                                yearOnYearDateStr: jl.lastyear || 0,
                                tbzf_q: jl.tbzf || 0,
                                tbzf_l: jl.tbzf100 || '0%',
                                monthOnMonthDateStr: jl.lastmonth,
                                hbzf_q: jl.hbzf || 0,
                                hbzf_l: jl.hbzf100 || '0%',
                            }, {
                                categories: '并处（人）',
                                selectedDateStr: bc.nowtime || 0,
                                yearOnYearDateStr: bc.lastyear || 0,
                                tbzf_q: bc.tbzf || 0,
                                tbzf_l: bc.tbzf100 || '0%',
                                monthOnMonthDateStr: bc.lastmonth,
                                hbzf_q: bc.hbzf || 0,
                                hbzf_l: bc.hbzf100 || '0%',
                            }, {
                                categories: '警告（人）',
                                selectedDateStr: jg.nowtime || 0,
                                yearOnYearDateStr: jg.lastyear || 0,
                                tbzf_q: jg.tbzf || 0,
                                tbzf_l: jg.tbzf100 || '0%',
                                monthOnMonthDateStr: jg.lastmonth,
                                hbzf_q: jg.hbzf || 0,
                                hbzf_l: jg.hbzf100 || '0%',
                            }, {
                                categories: '其他（人）',
                                selectedDateStr: qt.nowtime || 0,
                                yearOnYearDateStr: qt.lastyear || 0,
                                tbzf_q: qt.tbzf || 0,
                                tbzf_l: qt.tbzf100 || '0%',
                                monthOnMonthDateStr: qt.lastmonth,
                                hbzf_q: qt.hbzf || 0,
                                hbzf_l: qt.hbzf100 || '0%',
                            },
                        ];
                    }
                    if (cfrs && wcfrs && wf) {
                        pie1 = [
                            { name: '处罚人数', value: cfrs.nowtime },
                            { name: '未处罚人数', value: wcfrs.nowtime },
                        ];
                        pie2 = [
                            { name: '处罚人数', value: cfrs.lastyear },
                            { name: '未处罚人数', value: wcfrs.lastyear },
                        ];
                        pie3 = [
                            { name: '处罚人数', value: cfrs.lastmonth },
                            { name: '未处罚人数', value: wcfrs.lastmonth },
                        ];
                        rateTableData = [
                            {
                                categories: '违法行为人数（人）',
                                selectedDateStr: wf.nowtime || 0,
                                yearOnYearDateStr: wf.lastyear || 0,
                                tbzf_q: wf.tbzf || 0,
                                tbzf_l: wf.tbzf100 || '0%',
                                monthOnMonthDateStr: wf.lastmonth,
                                hbzf_q: wf.hbzf || 0,
                                hbzf_l: wf.hbzf100 || '0%',
                            },
                            {
                                categories: '处罚人数（人）',
                                selectedDateStr: cfrs.nowtime || 0,
                                yearOnYearDateStr: cfrs.lastyear || 0,
                                tbzf_q: cfrs.tbzf || 0,
                                tbzf_l: cfrs.tbzf100 || '0%',
                                monthOnMonthDateStr: cfrs.lastmonth,
                                hbzf_q: cfrs.hbzf || 0,
                                hbzf_l: cfrs.hbzf100 || '0%',
                            },
                            {
                                categories: '未处罚人数（人）',
                                selectedDateStr: wcfrs.nowtime || 0,
                                yearOnYearDateStr: wcfrs.lastyear || 0,
                                tbzf_q: wcfrs.tbzf || 0,
                                tbzf_l: wcfrs.tbzf100 || '0%',
                                monthOnMonthDateStr: wcfrs.lastmonth,
                                hbzf_q: wcfrs.hbzf || 0,
                                hbzf_l: wcfrs.hbzf100 || '0%',
                            },
                        ];
                        let title = [
                            {
                                text: `${selectedDateStr}\n\n违法行为人${wf.nowtime}人`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color:'#fff'
                                },
                                x: '50%',
                                y: '45%',
                                padding: 7,
                                textAlign: 'center',
                            },
                            {
                                text: `${yearOnYearDateStr}\n\n违法行为人${wf.lastyear}人`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color:'#fff'
                                },
                                x: '20%',
                                y: '45%',
                                padding: [7, 0],
                                textAlign: 'center',
                            },
                            {
                                text: `${monthOnMonthDateStr}\n\n违法行为人${wf.lastmonth}人`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color:'#fff'
                                },
                                x: '80%',
                                y: '45%',
                                textAlign: 'center',
                                padding: [7, 0],
                            },
                        ];
                        let series =[{
                            data: pie1,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = ['#dcca23','#3aa0ff', '#31bd74'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }, {
                            data: pie2,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = ['#dcca23','#3aa0ff', '#31bd74'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }, {
                            data: pie3,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = ['#dcca23','#3aa0ff', '#31bd74'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }];
                        this.showRatePieEchart(title,series);
                        window.addEventListener('resize', ratePie.resize);
                    }


                    this.setState({
                        tableData,
                        rateTableData,
                    });
                    this.showEchart(xData,barData);
                    window.addEventListener('resize', myChart.resize);
                    this.props.goToCarousel(1);
                }
                this.setState({ loadingData: false });
                this.props.changeLoadingStatus({ personIllegalPunishLoadingStatus: false });
            },
        });
    };

    showEchart = (xData,barData) => {
        const that = this;
        myChart = echarts.init(document.getElementById('illegalPunishType'));
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
                axisLabel: {   // X轴线 标签修改
                    textStyle: {
                        color: '#fff', //坐标值得具体的颜色
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
                type: 'value',
                axisLabel: {   // X轴线 标签修改
                    textStyle: {
                        color: '#fff', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: '#fff'
                    }
                },
            },
            series: barData,
        };
        myChart.setOption(option);
        // 运维中无行政案件强制措施
        // if(window.configUrl.is_area==='2'){
        //   myChart.on('click',function(param){
        //     const { departorgan } = that.props
        //     const { selectedDateStr,selectedDate, yearOnYearDateStr,yearOnYearDate, monthOnMonthDateStr,monthOnMonthDate } = that.props.dateArr;
        //     that.props.dispatch(routerRedux.push({
        //       pathname: '/allDocuments/personalDocTransfer/personalDoc',
        //       queryChange: {
        //         departmentId: departorgan&&departorgan.id?departorgan.id:'',
        //         qzcsName:param.data.code,
        //         searchTime:param.seriesName===selectedDateStr?selectedDate:param.seriesName===yearOnYearDateStr?yearOnYearDate:monthOnMonthDate,
        //       },
        //     }));
        //
        //   })
        // }
    };
    showRatePieEchart = (title,series) => {
        ratePie = echarts.init(document.getElementById('illegalPunishRate'));
        const option = {
            title,
            series: [
                {
                    type: 'pie',
                    center: ['50%', '55%'],
                    radius: ['55%', '70%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            formatter: `{b}:{c}\n\n占比{d}%`,
                        },
                    },
                    ...series[0]
                },
                {
                    type: 'pie',
                    center: ['20%', '55%'],
                    radius: ['45%', '60%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            formatter: `{b}:{c}\n\n占比{d}%`,
                        },
                    },
                    ...series[1]
                },
                {
                    type: 'pie',
                    center: ['80%', '55%'],
                    radius: ['45%', '60%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            formatter: `{b}:{c}\n\n占比{d}%`,
                        },
                    },
                    ...series[2]
                },
            ],
        };
        ratePie.setOption(option);
    };

    render() {
        const { selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr } = this.props;
        const { tableData, rateTableData, loadingData } = this.state;
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
        const rateTableColumns = [{
            title: '类别',
            dataIndex: 'categories',
            key: 'categories1',

        }, {
            title: selectedDateStr,
            dataIndex: 'selectedDateStr',
            key: 'selectedDateStr1',
        }, {
            title: yearOnYearDateStr,
            dataIndex: 'yearOnYearDateStr',
            key: 'yearOnYearDateStr1',
        }, {
            title: <span>同比增幅（起）<Tooltip title="同比增幅=本期数-同期数"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'tbzf_q1',
            dataIndex: 'tbzf_q',
        }, {
            title: <span>同比增幅（%）<Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'tbzf_l1',
            dataIndex: 'tbzf_l',
        }, {
            title: monthOnMonthDateStr,
            dataIndex: 'monthOnMonthDateStr',
            key: 'monthOnMonthDateStr1',
        }, {
            title: <span>环比增幅（起）<Tooltip title="环比增幅=本期数-上期数"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'hbzf_q1',
            dataIndex: 'hbzf_q',
        }, {
            title: <span>环比增幅（%）<Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%"><Icon type="info-circle-o"/></Tooltip></span>,
            key: 'hbzf_l1',
            dataIndex: 'hbzf_l',
        }];

        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={styles.analysis}>
                    <AnalysisTitleArea analysisTitle="违法行为人处罚措施分析" {...this.props} />
                    <div id="illegalPunishType" style={{ height: 300 }}/>
                    <Table columns={columns} dataSource={tableData} bordered className={styles.tableArea}
                           pagination={false}/>
                    <h2 className={styles.areaTitle}>违法行为人处罚占比分析</h2>
                    <div id="illegalPunishRate" style={{ height: 400 }}/>
                    <Table columns={rateTableColumns} dataSource={rateTableData} bordered className={styles.tableArea}
                           pagination={false}/>
                </div>
            </Spin>
        );
    }
}
