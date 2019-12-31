/*
* AgainstProperty.js 警情分析--侵财类警情
* author：lyp
* 20181218
* */

import React, {PureComponent} from 'react';
import {Tooltip, Icon, Table, Spin, Row, Col, Empty} from 'antd';
import echarts from 'echarts'
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

let myChart;
let hurtBar;

export default class AgainstProperty extends PureComponent {
    state = {
        tableData: [],
        loadingData: false,
        shanghaiTableData: [],
    };

    componentDidMount() {
        this.getAgainstProperty(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (((nextProps.selectedDate !== null) && (this.props.selectedDate !== nextProps.selectedDate)) || this.props.global.dark !== nextProps.global.dark) {
                this.getAgainstProperty(nextProps);
            }
        }
    }

    getAgainstProperty = (propsData) => {
        this.props.changeLoadingStatus({againstPropertyLoadingStatus: true});
        this.setState({loadingData: true});
        const {dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate} = propsData;
        dispatch({
            type: 'trendAnalysis/getAgainstProperty',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
            },
            callback: (data) => {
                if (data) {
                    const {qincaileijq, xingshiqc, zhianqc, sh} = data;
                    let barData = [];
                    let tableData = [];
                    let shanghaiTableData = [];
                    let shanghaiBarData = [];
                    let xData = [];
                    if (qincaileijq && xingshiqc && zhianqc) {
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
                                    {name: '侵财类警情', value: qincaileijq.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                                    {name: '刑事侵财', value: xingshiqc.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
                                    {name: '治安侵财', value: zhianqc.nowtime || 0, itemStyle: {color: '#3AA0FF'}},
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
                                    {
                                        name: '侵财类警情',
                                        value: qincaileijq.lastyear || 0,
                                        itemStyle: {color: '#DCCA23'},
                                    },
                                    {name: '刑事侵财', value: xingshiqc.lastyear || 0, itemStyle: {color: '#DCCA23'}},
                                    {name: '治安侵财', value: zhianqc.lastyear || 0, itemStyle: {color: '#DCCA23'}},
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
                                    {
                                        name: '侵财类警情',
                                        value: qincaileijq.lastmonth || 0,
                                        itemStyle: {color: '#31BD74'},
                                    },
                                    {name: '刑事侵财', value: xingshiqc.lastmonth || 0, itemStyle: {color: '#31BD74'}},
                                    {name: '治安侵财', value: zhianqc.lastmonth || 0, itemStyle: {color: '#31BD74'}},
  ],
                            },
                        ];
                        tableData = [
                            {
                                categories: '侵财类警情（起）',
                                selectedDateStr: qincaileijq.nowtime || 0,
                                yearOnYearDateStr: qincaileijq.lastyear || 0,
                                tbzf_q: qincaileijq.tbzf || 0,
                                tbzf_l: qincaileijq.tbzf100 || '0%',
                                monthOnMonthDateStr: qincaileijq.lastmonth,
                                hbzf_q: qincaileijq.hbzf || 0,
                                hbzf_l: qincaileijq.hbzf100 || '0%',
                            }, {
                                categories: '刑事侵财类（起）',
                                selectedDateStr: xingshiqc.nowtime || 0,
                                yearOnYearDateStr: xingshiqc.lastyear || 0,
                                tbzf_q: xingshiqc.tbzf || 0,
                                tbzf_l: xingshiqc.tbzf100 || '0%',
                                monthOnMonthDateStr: xingshiqc.lastmonth,
                                hbzf_q: xingshiqc.hbzf || 0,
                                hbzf_l: xingshiqc.hbzf100 || '0%',
                            }, {
                                categories: '治安侵财类（起）',
                                selectedDateStr: zhianqc.nowtime || 0,
                                yearOnYearDateStr: zhianqc.lastyear || 0,
                                tbzf_q: zhianqc.tbzf || 0,
                                tbzf_l: zhianqc.tbzf100 || '0%',
                                monthOnMonthDateStr: zhianqc.lastmonth,
                                hbzf_q: zhianqc.hbzf || 0,
                                hbzf_l: zhianqc.hbzf100 || '0%',
                            },
                        ];
                    }
                    if (sh) {
                        shanghaiTableData = [{
                            categories: '伤害类警情（起）',
                            selectedDateStr: sh.nowtime || 0,
                            yearOnYearDateStr: sh.lastyear || 0,
                            tbzf_q: sh.tbzf || 0,
                            tbzf_l: sh.tbzf100 || '0%',
                            monthOnMonthDateStr: sh.lastmonth,
                            hbzf_q: sh.hbzf || 0,
                            hbzf_l: sh.hbzf100 || '0%',
                        }];
                        xData = [
                            selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr,
                        ];
                        shanghaiBarData = [
                            {
                                name: selectedDateStr,
                                value: sh.nowtime,
                                itemStyle: {color: '#3AA0FF'},
                            },
                            {
                                name: yearOnYearDateStr,
                                value: sh.lastyear,
                                itemStyle: {color: '#DCCA23'},
                            },
                            {
                                name: monthOnMonthDateStr,
                                value: sh.lastmonth,
                                itemStyle: {color: '#31BD74'},
                            },
                        ];
                        if (document.getElementById('hurtBar')) {
                            this.showHurtBar(shanghaiBarData, xData);
                            window.addEventListener('resize', hurtBar.resize);
                        }
                    }
                    this.setState({
                        tableData,
                        shanghaiTableData,
                    });
                    this.props.goToCarousel(1);
                    if (document.getElementById('againstPropertyChart')) {
                        this.showEchart(barData);
                        window.addEventListener('resize', myChart.resize);
                    }
                }
                this.setState({loadingData: false});
                this.props.changeLoadingStatus({againstPropertyLoadingStatus: false});
            },
        });
    };

    showEchart = (barData) => {
        myChart = echarts.init(document.getElementById('againstPropertyChart'));
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: {
                type: 'value',
                axisLabel: {   // X轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    }
                },
                splitLine: {
                    show: true, // X轴线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
                    }
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
                    }
                },
            },
            color: ['#3AA0FF', '#DCCA23', '#31BD74'],
            yAxis: {
                type: 'category',
                data: ['侵财类警情', '刑事侵财', '治安侵财'],
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
    // 伤害类警情柱状图
    showHurtBar = (shanghaiBarData, xData) => {
        hurtBar = echarts.init(document.getElementById('hurtBar'));
        const option = {
            color: ['#3AA0FF', '#DCCA23', '#31BD74'],
            xAxis: {
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
                axisLabel: {   // y轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6', //坐标值得具体的颜色
                    }
                },
                axisLine: {
                    show: true, // y轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
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
                            color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
                        },
  },
  },
                data: shanghaiBarData,
            },
        };
        hurtBar.setOption(option);
    };

    render() {
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const {tableData, loadingData, shanghaiTableData} = this.state;
        // console.log('shanghaiTableData----->', shanghaiTableData);
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
                    <AnalysisTitleArea analysisTitle="侵财类警情" {...this.props} />
                    <Row className={styles.fraudArea}>
                        <Col lg={12} md={24}>
                            <div id="againstPropertyChart" style={{height: 300}}
                                 className={this.props.global && this.props.global.dark ? '' : styles.lightChartBox}/>
                        </Col>
                        <Col lg={12} md={24}>
                            <Table columns={columns} dataSource={tableData} bordered className={styles.tableArea}
                                   locale={{
                                       emptyText: <Empty
                                           image={this.props.global && this.props.global.dark ? noList : noListLight}
                                           description={'暂无数据'}/>
                                   }}
                                   pagination={false}/>
                        </Col>
                    </Row>
                    <div className={this.props.global && this.props.global.dark ? styles.borderTop : styles.borderTops}></div>
                    <h2 className={this.props.global && this.props.global.dark ? styles.title : styles.titles}>伤害类警情</h2>
                    <Row className={styles.fraudArea}>
                        <Col lg={12} md={24}>
                            <div id="hurtBar" style={{height: 300}}
                                 className={this.props.global && this.props.global.dark ? '' : styles.lightChartBox}/>
                        </Col>
                        <Col lg={12} md={24}>
                            <Table columns={columns} dataSource={shanghaiTableData} className={styles.tableArea}
                                   locale={{
                                       emptyText: <Empty
                                           image={this.props.global && this.props.global.dark ? noList : noListLight}
                                           description={'暂无数据'}/>
                                   }}
                                   bordered pagination={false}/>
                        </Col>
                    </Row>
                </div>
            </Spin>
        );
  }
}
