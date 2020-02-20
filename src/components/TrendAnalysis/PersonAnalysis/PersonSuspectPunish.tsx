/*
* PersonSuspectPunish.js 涉案人员分析--强制措施
* author：lyp
* 20181228
* */

import React, {PureComponent} from 'react';
import {Tooltip, Icon, Table, Spin, Empty} from 'antd';
import {routerRedux} from 'dva/router';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import grid from 'echarts/lib/component/grid';
import title from 'echarts/lib/component/title';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import moment from 'moment';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

let myChart;
let ratePie;

export default class PersonSuspectPunish extends PureComponent {
    state = {
        tableData: [],
        rateTableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getSuspectPunishTypeData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (((nextProps.selectedDate !== null) && ((this.props.selectedDate !== nextProps.selectedDate) || (this.props.userOrgCode !== nextProps.userOrgCode))) || this.props.global.dark !== nextProps.global.dark) {
                this.getSuspectPunishTypeData(nextProps);
            }
        }
    }

    getSuspectPunishTypeData = (propsData) => {
        this.props.changeLoadingStatus({personSuspectPunishLoadingStatus: true});
        this.setState({loadingData: true});
        const {dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate, userOrgCode} = propsData;
        dispatch({
            type: 'trendAnalysis/getSuspectPunishTypeData',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
                orgcode12: userOrgCode,
            },
            callback: (data) => {
                if (data) {
                    const {db, fzxyrs, jc, jsjz, jl, noqzcsrs, qbhs, qzcsl, qzcsrs} = data;
                    let barData = [];
                    let tableData = [];
                    let rateTableData = [];
                    let pie1 = [];
                    let pie2 = [];
                    let pie3 = [];
                    const xData = ['逮捕', '拘传', '拘留', '监视居住', '取保候审'];
                    if (db && jl && jc && jsjz && qbhs) {
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
                                {name: '逮捕', value: db.nowtime || 0, itemStyle: {color: '#3AA0FF'}, code: '22'},
                                {name: '拘传', value: jc.nowtime || 0, itemStyle: {color: '#3AA0FF'}, code: '7'},
                                {name: '拘留', value: jl.nowtime || 0, itemStyle: {color: '#3AA0FF'}, code: '1'},
                                {name: '监视居住', value: jsjz.nowtime || 0, itemStyle: {color: '#3AA0FF'}, code: '4'},
                                {name: '取保候审', value: qbhs.nowtime || 0, itemStyle: {color: '#3AA0FF'}, code: '3'},
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
                                {name: '逮捕', value: db.lastyear || 0, itemStyle: {color: '#DCCA23'}, code: '22'},
                                {name: '拘传', value: jc.lastyear || 0, itemStyle: {color: '#DCCA23'}, code: '7'},
                                {name: '拘留', value: jl.lastyear || 0, itemStyle: {color: '#DCCA23'}, code: '1'},
                                {name: '监视居住', value: jsjz.lastyear || 0, itemStyle: {color: '#DCCA23'}, code: '4'},
                                {name: '取保候审', value: qbhs.lastyear || 0, itemStyle: {color: '#DCCA23'}, code: '3'},
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
                                {name: '逮捕', value: db.lastmonth || 0, itemStyle: {color: '#31BD74'}, code: '22'},
                                {name: '拘传', value: jc.lastmonth || 0, itemStyle: {color: '#31BD74'}, code: '7'},
                                {name: '拘留', value: jl.lastmonth || 0, itemStyle: {color: '#31BD74'}, code: '1'},
                                {name: '监视居住', value: jsjz.lastmonth || 0, itemStyle: {color: '#31BD74'}, code: '4'},
                                {name: '取保候审', value: qbhs.lastmonth || 0, itemStyle: {color: '#31BD74'}, code: '3'},
                            ],
                        }];
                        tableData = [
                            {
                                categories: '逮捕（人）',
                                selectedDateStr: db.nowtime || 0,
                                yearOnYearDateStr: db.lastyear || 0,
                                tbzf_q: db.tbzf || 0,
                                tbzf_l: db.tbzf100 || '0%',
                                monthOnMonthDateStr: db.lastmonth,
                                hbzf_q: db.hbzf || 0,
                                hbzf_l: db.hbzf100 || '0%',
                            }, {
                                categories: '拘传（人）',
                                selectedDateStr: jc.nowtime || 0,
                                yearOnYearDateStr: jc.lastyear || 0,
                                tbzf_q: jc.tbzf || 0,
                                tbzf_l: jc.tbzf100 || '0%',
                                monthOnMonthDateStr: jc.lastmonth,
                                hbzf_q: jc.hbzf || 0,
                                hbzf_l: jc.hbzf100 || '0%',
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
                                categories: '监视居住（人）',
                                selectedDateStr: jsjz.nowtime || 0,
                                yearOnYearDateStr: jsjz.lastyear || 0,
                                tbzf_q: jsjz.tbzf || 0,
                                tbzf_l: jsjz.tbzf100 || '0%',
                                monthOnMonthDateStr: jsjz.lastmonth,
                                hbzf_q: jsjz.hbzf || 0,
                                hbzf_l: jsjz.hbzf100 || '0%',
                            }, {
                                categories: '取保候审（人）',
                                selectedDateStr: qbhs.nowtime || 0,
                                yearOnYearDateStr: qbhs.lastyear || 0,
                                tbzf_q: qbhs.tbzf || 0,
                                tbzf_l: qbhs.tbzf100 || '0%',
                                monthOnMonthDateStr: qbhs.lastmonth,
                                hbzf_q: qbhs.hbzf || 0,
                                hbzf_l: qbhs.hbzf100 || '0%',
                            },
                        ];
                    }
                    if (fzxyrs && noqzcsrs && qzcsl && qzcsrs) {
                        pie1 = [
                            {name: '强制措施人数', value: qzcsrs.nowtime},
                            {name: '未强制措施人数', value: noqzcsrs.nowtime},
                        ];
                        pie2 = [
                            {name: '强制措施人数', value: qzcsrs.lastyear},
                            {name: '未强制措施人数', value: noqzcsrs.lastyear},
                        ];
                        pie3 = [
                            {name: '强制措施人数', value: qzcsrs.lastmonth},
                            {name: '未强制措施人数', value: noqzcsrs.lastmonth},
                        ];
                        rateTableData = [
                            {
                                categories: '犯罪嫌疑人数（人）',
                                selectedDateStr: fzxyrs.nowtime || 0,
                                yearOnYearDateStr: fzxyrs.lastyear || 0,
                                tbzf_q: fzxyrs.tbzf || 0,
                                tbzf_l: fzxyrs.tbzf100 || '0%',
                                monthOnMonthDateStr: fzxyrs.lastmonth,
                                hbzf_q: fzxyrs.hbzf || 0,
                                hbzf_l: fzxyrs.hbzf100 || '0%',
                            },
                            {
                                categories: '强制措施人数（人）',
                                selectedDateStr: qzcsrs.nowtime || 0,
                                yearOnYearDateStr: qzcsrs.lastyear || 0,
                                tbzf_q: qzcsrs.tbzf || 0,
                                tbzf_l: qzcsrs.tbzf100 || '0%',
                                monthOnMonthDateStr: qzcsrs.lastmonth,
                                hbzf_q: qzcsrs.hbzf || 0,
                                hbzf_l: qzcsrs.hbzf100 || '0%',
                            },
                            {
                                categories: '未强制措施人数（人）',
                                selectedDateStr: noqzcsrs.nowtime || 0,
                                yearOnYearDateStr: noqzcsrs.lastyear || 0,
                                tbzf_q: noqzcsrs.tbzf || 0,
                                tbzf_l: noqzcsrs.tbzf100 || '0%',
                                monthOnMonthDateStr: noqzcsrs.lastmonth,
                                hbzf_q: noqzcsrs.hbzf || 0,
                                hbzf_l: noqzcsrs.hbzf100 || '0%',
                            },
                            {
                                categories: '强制措施率（%）',
                                selectedDateStr: qzcsl.nowtime || 0,
                                yearOnYearDateStr: qzcsl.lastyear || 0,
                                tbzf_q: qzcsl.tbzf || 0,
                                tbzf_l: qzcsl.tbzf100 || '0%',
                                monthOnMonthDateStr: qzcsl.lastmonth,
                                hbzf_q: qzcsl.hbzf || 0,
                                hbzf_l: qzcsl.hbzf100 || '0%',
                            },
                        ];
                        let title = [
                            {
                                text: `${selectedDateStr}\n\n犯罪嫌疑人${fzxyrs.nowtime}人`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                                },
                                x: '50%',
                                y: '45%',
                                padding: 7,
                                textAlign: 'center',
                            },
                            {
                                text: `${yearOnYearDateStr}\n\n犯罪嫌疑人${fzxyrs.lastyear}人`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                                },
                                x: '20%',
                                y: '45%',
                                padding: [7, 0],
                                textAlign: 'center',
                            },
                            {
                                text: `${monthOnMonthDateStr}\n\n犯罪嫌疑人${fzxyrs.lastmonth}人`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                                },
                                x: '80%',
                                y: '45%',
                                textAlign: 'center',
                                padding: [7, 0],
                            },
                        ]
                        let series = [{
                            data: pie1,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = ['#dcca23', '#3aa0ff', '#31bd74'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }, {
                            data: pie2,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = ['#dcca23', '#3aa0ff', '#31bd74'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }, {
                            data: pie3,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = ['#dcca23', '#3aa0ff', '#31bd74'];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }]
                        if (document.getElementsByClassName('suspectPunishRate')[1]) {
                            this.showRatePieEchart(title, series);
                            window.addEventListener('resize', ratePie.resize);
                        }
                    }

                    this.setState({
                        tableData,
                        rateTableData,
                    });
                    if (document.getElementsByClassName('suspectPunishType')[1]) {
                        this.showEchart(xData, barData);
                        window.addEventListener('resize', myChart.resize);
                    }
                    this.props.goToCarousel(2);
                }
                this.setState({loadingData: false});
                this.props.changeLoadingStatus({personSuspectPunishLoadingStatus: false});
            },
        });
    };

    showEchart = (xData, barData) => {
        const that = this;
        myChart = echarts.init(document.getElementsByClassName('suspectPunishType')[1]);
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
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {   // X轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
                    }
                },
            },
            series: barData,
        };
        myChart.setOption(option);
        // if (window.configUrl.is_area === '2') {
        //     myChart.on('click', function (param) {
        //         const {departorgan} = that.props;
        //         const {selectedDateStr, selectedDate, yearOnYearDateStr, yearOnYearDate, monthOnMonthDateStr, monthOnMonthDate} = that.props.dateArr;
        //         that.props.dispatch(routerRedux.push({
        //             pathname: '/allDocuments/personalDocTransfer/personalDoc',
        //             queryChange: {
        //                 departmentId: departorgan && departorgan.id ? departorgan.id : '',
        //                 qzcsName: param.data.code,
        //                 searchTime: param.seriesName === selectedDateStr ? selectedDate : param.seriesName === yearOnYearDateStr ? yearOnYearDate : monthOnMonthDate,
        //             },
        //         }));
        //
        //     })
        // }
    };
    showRatePieEchart = (title, series) => {
        ratePie = echarts.init(document.getElementsByClassName('suspectPunishRate')[1]);
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
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const {tableData, rateTableData, loadingData} = this.state;
        const columns = [
            {
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
                title: <span>同比增幅（起）<Tooltip title="同比增幅=本期数-同期数"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'tbzf_q',
                dataIndex: 'tbzf_q',
            }, {
                title: <span>同比增幅（%）<Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'tbzf_l',
                dataIndex: 'tbzf_l',
            }, {
                title: monthOnMonthDateStr,
                dataIndex: 'monthOnMonthDateStr',
                key: 'monthOnMonthDateStr',
            }, {
                title: <span>环比增幅（起）<Tooltip title="环比增幅=本期数-上期数"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'hbzf_q',
                dataIndex: 'hbzf_q',
            }, {
                title: <span>环比增幅（%）<Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'hbzf_l',
                dataIndex: 'hbzf_l',
            }];
        const rateTableColumns = [
            {
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
                title: <span>同比增幅（起）<Tooltip title="同比增幅=本期数-同期数"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'tbzf_q1',
                dataIndex: 'tbzf_q',
            }, {
                title: <span>同比增幅（%）<Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'tbzf_l1',
                dataIndex: 'tbzf_l',
            }, {
                title: monthOnMonthDateStr,
                dataIndex: 'monthOnMonthDateStr',
                key: 'monthOnMonthDateStr1',
            }, {
                title: <span>环比增幅（起）<Tooltip title="环比增幅=本期数-上期数"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'hbzf_q1',
                dataIndex: 'hbzf_q',
            }, {
                title: <span>环比增幅（%）<Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%"><Icon type="info-circle-o" theme={this.props.global && this.props.global.dark ? "twoTone" : "outlined"} twoToneColor={this.props.global && this.props.global.dark ? "#aaa" :''} /></Tooltip></span>,
                key: 'hbzf_l1',
                dataIndex: 'hbzf_l',
            }];
        let className = this.props.global && this.props.global.dark ? styles.analysis : styles.analysis + ' ' + styles.lightBox
        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={className}>
                    <AnalysisTitleArea analysisTitle="犯罪嫌疑人强制措施分析" {...this.props} />
                    <div
                        className={"suspectPunishType" + ' ' + (this.props.global && this.props.global.dark ? '' : styles.lightChartBox)}
                        style={{height: 300}}/>
                    <Table columns={columns} dataSource={tableData} bordered className={styles.tableArea} locale={{
                        emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                          description={'暂无数据'}/>
                    }}
                           pagination={false}/>
                    <div className={this.props.global && this.props.global.dark ? styles.borderTop : styles.borderTops}></div>
                    <h2 className={styles.areaTitle}>犯罪嫌疑人强制措施占比分析</h2>
                    <div className={"suspectPunishRate"} style={{height: 400}}/>
                    <Table columns={rateTableColumns} dataSource={rateTableData} bordered className={styles.tableArea}
                           locale={{
                               emptyText: <Empty
                                   image={this.props.global && this.props.global.dark ? noList : noListLight}
                                   description={'暂无数据'}/>
                           }}
                           pagination={false}/>
                </div>
            </Spin>
        );
    }
}
