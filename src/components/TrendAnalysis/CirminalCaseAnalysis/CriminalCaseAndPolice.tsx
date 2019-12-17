/*
* CriminalCaseAndPolice.js 刑事案件分析--警情、受理、立案
* author：lyp
* 20181227
* */

import React, { PureComponent } from 'react';
import {Tooltip, Icon, Table, Row, Col, Spin, Empty} from 'antd';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import pie from 'echarts/lib/chart/pie';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import grid from 'echarts/lib/component/grid';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

let treePie;
let criminalCaseAcceptBar;

export default class CriminalCaseAndPolice extends PureComponent {
    state = {
        caseAndPoliceTableData: [],
        acceptCaseTableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getCriminalCaseAndPolice(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectedDate !== null) && (this.props.selectedDate !== nextProps.selectedDate)) {
                this.getCriminalCaseAndPolice(nextProps);
            }
        }
    }

    getCriminalCaseAndPolice = (propsData) => {
        this.props.changeLoadingStatus({ criminalCaseAndPoliceLoadingStatus: true });
        this.setState({ loadingData: true });
        const { dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate } = propsData;
        dispatch({
            type: 'trendAnalysis/getCriminalCaseAndPolice',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
            },
            callback: (data) => {
                if (data) {
                    const { ajla, ajsa, jqnosa, jqsa, jqzl, lal, sal } = data;
                    let pie1 = [];
                    let pie2 = [];
                    let pie3 = [];
                    let caseAndPoliceTableData = [];
                    let acceptCaseTableData = [];
                    let xData = [];
                    let barData = [];
                    if (jqnosa && jqsa && jqzl && sal) {
                        pie1 = [
                            { name: '未受案', value: jqnosa.nowtime, itemStyle: { color: '#3AA0FF' } },
                            { name: '受理', value: jqsa.nowtime },
                        ];
                        pie2 = [
                            { name: '未受案', value: jqnosa.lastyear, itemStyle: { color: '#DCCA23' } },
                            { name: '受理', value: jqsa.lastyear },
                        ];
                        pie3 = [
                            { name: '未受案', value: jqnosa.lastmonth, itemStyle: { color: '#31BD74' } },
                            { name: '受理', value: jqsa.lastmonth },
                        ];
                        caseAndPoliceTableData = [
                            {
                                categories: '警情总量（起）',
                                selectedDateStr: jqzl.nowtime || 0,
                                yearOnYearDateStr: jqzl.lastyear || 0,
                                tbzf_q: jqzl.tbzf || 0,
                                tbzf_l: jqzl.tbzf100 || '0%',
                                monthOnMonthDateStr: jqzl.lastmonth,
                                hbzf_q: jqzl.hbzf || 0,
                                hbzf_l: jqzl.hbzf100 || '0%',
                            },
                            {
                                categories: '受理（起）',
                                selectedDateStr: jqsa.nowtime || 0,
                                yearOnYearDateStr: jqsa.lastyear || 0,
                                tbzf_q: jqsa.tbzf || 0,
                                tbzf_l: jqsa.tbzf100 || '0%',
                                monthOnMonthDateStr: jqsa.lastmonth,
                                hbzf_q: jqsa.hbzf || 0,
                                hbzf_l: jqsa.hbzf100 || '0%',
                            },
                            {
                                categories: '未受案（起）',
                                selectedDateStr: jqnosa.nowtime || 0,
                                yearOnYearDateStr: jqnosa.lastyear || 0,
                                tbzf_q: jqnosa.tbzf || 0,
                                tbzf_l: jqnosa.tbzf100 || '0%',
                                monthOnMonthDateStr: jqnosa.lastmonth,
                                hbzf_q: jqnosa.hbzf || 0,
                                hbzf_l: jqnosa.hbzf100 || '0%',
                            },
                            {
                                categories: '受案率（%）',
                                selectedDateStr: sal.nowtime || 0,
                                yearOnYearDateStr: sal.lastyear || 0,
                                tbzf_q: sal.tbzf || 0,
                                tbzf_l: sal.tbzf100 || '0%',
                                monthOnMonthDateStr: sal.lastmonth,
                                hbzf_q: sal.hbzf || 0,
                                hbzf_l: sal.hbzf100 || '0%',
                            },
                        ];
                        let title = [
                            {
                                text: `${selectedDateStr}\n\n警情总数${jqzl.nowtime}起`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color:this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                                },
                                x: '50%',
                                y: '45%',
                                padding: 7,
                                textAlign: 'center',
                            },
                            {
                                text: `${yearOnYearDateStr}\n\n警情总数${jqzl.lastyear}起`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color:this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                                },
                                x: '20%',
                                y: '45%',
                                padding: [7, 0],
                                textAlign: 'center',
                            },
                            {
                                text: `${monthOnMonthDateStr}\n\n警情总数${jqzl.lastmonth}起`,
                                textStyle: {
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color:this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                                },
                                x: '80%',
                                y: '45%',
                                textAlign: 'center',
                                padding: [7, 0],
                            },
                        ];
                        if(document.getElementsByClassName('criminalCaseAndPolice')[1]){
                            this.showEchart(title,pie1,pie2,pie3);
                            window.addEventListener('resize', treePie.resize);
                        }
                    }
                    if (ajla && ajsa && lal) {
                        acceptCaseTableData = [
                            {
                                categories: selectedDateStr,
                                acceptCase: ajsa.nowtime,
                                registerCase: ajla.nowtime,
                                registerCaseRate: lal.nowtime,
                            },
                            {
                                categories: yearOnYearDateStr,
                                acceptCase: ajsa.lastyear,
                                registerCase: ajla.lastyear,
                                registerCaseRate: lal.lastyear,
                            },
                            {
                                categories: '同比增幅（起）',
                                acceptCase: ajsa.tbzf,
                                registerCase: ajla.tbzf,
                                registerCaseRate: lal.tbzf,
                            },
                            {
                                categories: '同比增幅（%）',
                                acceptCase: ajsa.tbzf100,
                                registerCase: ajla.tbzf100,
                                registerCaseRate: lal.tbzf100,
                            },
                            {
                                categories: monthOnMonthDateStr,
                                acceptCase: ajsa.lastmonth,
                                registerCase: ajla.lastmonth,
                                registerCaseRate: lal.lastmonth,
                            },
                            {
                                categories: '环比增幅（起）',
                                acceptCase: ajsa.hbzf,
                                registerCase: ajla.hbzf,
                                registerCaseRate: lal.hbzf,
                            },
                            {
                                categories: '环比增幅（%）',
                                acceptCase: ajsa.hbzf100,
                                registerCase: ajla.hbzf100,
                                registerCaseRate: lal.hbzf100,
                            },
                        ];
                        xData = [
                            selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr,
                        ];
                        barData = [{
                            name: '受理',
                            type: 'bar',
                            cursor: 'default',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                },
                            },
                            data: [
                                { name: selectedDateStr, value: ajsa.nowtime || 0 },
                                { name: yearOnYearDateStr, value: ajsa.lastyear || 0 },
                                { name: monthOnMonthDateStr, value: ajsa.lastmonth || 0 },
                            ],
                            itemStyle: {
                                normal: {
                                    //这里是重点
                                    color: ['#3aa0ff']
                                }
                            }
                        }, {
                            name: '立案',
                            type: 'bar',
                            cursor: 'default',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                },
                            },
                            data: [
                                { name: selectedDateStr, value: ajla.nowtime || 0 },
                                { name: yearOnYearDateStr, value: ajla.lastyear || 0 },
                                { name: monthOnMonthDateStr, value: ajla.lastmonth || 0 },
                            ], itemStyle: {
                                normal: {
                                    //这里是重点
                                    color: ['#dcca23']
                                }
                            }
                        }];
                        if(document.getElementsByClassName('criminalCaseAccept')[1]){
                            this.showAcceptCaseBar(xData,barData);
                            window.addEventListener('resize', criminalCaseAcceptBar.resize);
                        }
                    }
                    this.setState({
                        caseAndPoliceTableData,
                        acceptCaseTableData,
                    });
                    this.props.goToCarousel(2);
                }
                this.setState({ loadingData: false });
                this.props.changeLoadingStatus({ criminalCaseAndPoliceLoadingStatus: false });
            },
        });
    };

    showEchart = (title,pie1,pie2,pie3) => {
        treePie = echarts.init(document.getElementsByClassName('criminalCaseAndPolice')[1]);
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
                            formatter: `{b}警情{c}起\n\n占比{d}%`,
                        },
                    },
                    data: pie1,
                },
                {
                    type: 'pie',
                    center: ['20%', '55%'],
                    radius: ['48%', '63%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            formatter: `{b}警情{c}起\n\n占比{d}%`,
                        },
                    },
                    data: pie2,
                },
                {
                    type: 'pie',
                    center: ['80%', '55%'],
                    radius: ['48%', '63%'],
                    avoidLabelOverlap: false,
                    cursor: 'default',
                    label: {
                        normal: {
                            formatter: `{b}警情{c}起\n\n占比{d}%`,
                        },
                    },
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'center',
                    //         formatter: '{c}',
                    //         textStyle: {
                    //             fontSize: '20',
                    //             color:'#555555',
                    //         },
                    //     },
                    //     emphasis: {
                    //         show: true,
                    //     },
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: false,
                    //     },
                    // },
                    data: pie3,
                },
            ],
        };
        treePie.setOption(option);
    };
    // 受立案bar
    showAcceptCaseBar = (xData,barData) => {
        criminalCaseAcceptBar = echarts.init(document.getElementsByClassName('criminalCaseAccept')[1]);
        const { selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr } = this.props;
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            legend: {
                data: ['受理', '立案'],
                textStyle: { color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d' },
                bottom: 0,
            },
            xAxis: {
                type: 'category',
                axisLine: { show: false },
                data: xData,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {   // X轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    }
                },
                // splitLine:{
                //     show: true, // X轴线 颜色类型的修改
                //     lineStyle: {
                //         color: '#fff'
                //     }
                // },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
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
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
                    },
                },
            },
            series: barData,
        };
        criminalCaseAcceptBar.setOption(option);
    };

    render() {
        const { selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr } = this.props;
        const { caseAndPoliceTableData, acceptCaseTableData, loadingData } = this.state;
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
        const acceptCaseColumns = [
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
                title: '受理（起）',
                dataIndex: 'acceptCase',
                key: 'acceptCase',
            }, {
                title: '立案（起）',
                dataIndex: 'registerCase',
                key: 'registerCase',
            }, {
                title: '受案率（%）',
                dataIndex: 'registerCaseRate',
                key: 'registerCaseRate',
            },
        ];
        let className = this.props.global && this.props.global.dark ? styles.analysis : styles.analysis+' '+styles.lightBox
        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={className}>
                    <AnalysisTitleArea analysisTitle="警情、受案分析" {...this.props} />
                    <div className="criminalCaseAndPolice" style={{ height: 310 }}/>
                    <Table columns={columns} dataSource={caseAndPoliceTableData} bordered className={styles.tableArea}
                           pagination={false}/>
                    <h2 className={styles.areaTitle}>受、立案分析</h2>
                    <Row className={styles.fraudArea}>
                        <Col lg={12} md={24}>
                            <div className="criminalCaseAccept" style={{ height: 310 }}/>
                        </Col>
                        <Col lg={12} md={24}>
                            <Table columns={acceptCaseColumns} dataSource={acceptCaseTableData} locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                                   className={styles.fraudTable} bordered pagination={false}/>
                        </Col>
                    </Row>
                </div>
            </Spin>
        );
    }
}
