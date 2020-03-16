/*
* CriminalCaseType.js 刑事案件分析--类型分析
* author：lyp
* 20181226
* */

import React, {PureComponent} from 'react';
import {Tooltip, Icon, Table, Button, Spin, Empty} from 'antd';
import echarts from 'echarts/lib/echarts';
import line from 'echarts/lib/chart/line';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import grid from 'echarts/lib/component/grid';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

let myChart;

export default class CriminalCaseType extends PureComponent {
    state = {
        tableData: [],
        caseType: 'blaj', // 默认显示八类案件
        blaj: null, // 八类案件
        lq: null, // 两抢
        qc: null, // 侵财
        sh: null, // 伤害
        loadingData: false,
    };

    componentDidMount() {
        this.getCriminalCaseType(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectedDate !== null) && (this.props.selectedDate !== nextProps.selectedDate) || this.props.global.dark !== nextProps.global.dark) {
                this.getCriminalCaseType(nextProps);
            }
        }
    }

    getCriminalCaseType = (propsData) => {
        this.props.changeLoadingStatus({criminalCaseTypeLoadingStatus: true});
        this.setState({loadingData: true});
        const {dispatch, selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr, selectedDate, yearOnYearDate, monthOnMonthDate} = propsData;
        dispatch({
            type: 'trendAnalysis/getCriminalCaseType',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
            },
            callback: (data) => {
                if (data) {
                    const {blaj, lq, qc, sh} = data;
                    if (blaj && lq && qc && sh) {
                        this.setState({
                            blaj, lq, qc, sh,
                        }, () => {
                            this.setChartsAndTableData('blaj');
                        });
                    }
                }
                this.setState({loadingData: false});
                this.props.changeLoadingStatus({criminalCaseTypeLoadingStatus: false});
            },
        });
    };
    setChartsAndTableData = (caseType) => {
        const {blaj, lq, qc, sh} = this.state;
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        let lineData = [];
        let tableData = [];
        let typeData = null;
        let categories = '';
        const xData = ['5日', '10日', '15日', '20日', '25日', '30日'];
        if (caseType === 'blaj') {
            typeData = blaj;
        }
        switch (caseType) {
            case 'blaj':
                typeData = blaj;
                categories = '八类案件';
                break;
            case 'lq':
                typeData = lq;
                categories = '两抢一盗';
                break;
            case 'qc':
                typeData = qc;
                categories = '侵财';
                break;
            case 'sh':
                typeData = sh;
                categories = '伤害';
                break;
            default:
                typeData = null;
                categories = '';
        }
        if (typeData) {
            lineData = [{
                name: selectedDateStr,
                type: 'line',
                cursor: 'default',
                data: [
                  typeData.now&&typeData.now.count5 ? typeData.now.count5 : 0,
                  typeData.now&&typeData.now.count10 ? typeData.now.count10 : 0,
                  typeData.now&&typeData.now.count15 ? typeData.now.count15 : 0,
                  typeData.now&&typeData.now.count20 ? typeData.now.count20 : 0,
                  typeData.now&&typeData.now.count25 ? typeData.now.count25 : 0,
                  typeData.now&&typeData.now.count30 ? typeData.now.count30 : 0,
  ],
                itemStyle: {
                    color: '#3AA0FF',
                },
            }, {
                name: yearOnYearDateStr,
                type: 'line',
                cursor: 'default',
                data: [
                  typeData.tongbi&&typeData.tongbi.count5 ? typeData.tongbi.count5 : 0,
                  typeData.tongbi&&typeData.tongbi.count10 ? typeData.tongbi.count10 : 0,
                  typeData.tongbi&&typeData.tongbi.count15 ? typeData.tongbi.count15 : 0,
                  typeData.tongbi&&typeData.tongbi.count20 ? typeData.tongbi.count20 : 0,
                  typeData.tongbi&&typeData.tongbi.count25 ? typeData.tongbi.count25 : 0,
                  typeData.tongbi&&typeData.tongbi.count30 ? typeData.tongbi.count30 : 0,
                ],
                itemStyle: {
                    color: '#DCCA23',
                },
            }, {
                name: monthOnMonthDateStr,
                type: 'line',
                cursor: 'default',
                data: [
                  typeData.huanbi&&typeData.huanbi.count5 ? typeData.huanbi.count5 : 0,
                  typeData.huanbi&&typeData.huanbi.count10 ? typeData.huanbi.count10 : 0,
                  typeData.huanbi&&typeData.huanbi.count15 ? typeData.huanbi.count15 : 0,
                  typeData.huanbi&&typeData.huanbi.count20 ? typeData.huanbi.count20 : 0,
                  typeData.huanbi&&typeData.huanbi.count25 ? typeData.huanbi.count25 : 0,
                  typeData.huanbi&&typeData.huanbi.count30 ? typeData.huanbi.count30 : 0,
                ],
                itemStyle: {
                    color: '#31BD74',
                },
            }];
            tableData = [
                {
                    categories,
                    selectedDateStr: typeData.list.nowtime || 0,
                    yearOnYearDateStr: typeData.list.lastyear || 0,
                    tbzf_q: typeData.list.tbzf || 0,
                    tbzf_l: typeData.list.tbzf100 || '0%',
                    monthOnMonthDateStr: typeData.list.lastmonth,
                    hbzf_q: typeData.list.hbzf || 0,
                    hbzf_l: typeData.list.hbzf100 || '0%',
  },
            ];
        }
        this.setState({
            tableData,
        });
        if (document.getElementById('criminalCaseType')) {
            this.showEchart(xData, lineData);
            window.addEventListener('resize', myChart.resize);
        }
        this.props.goToCarousel(1);
    };

    showEchart = (xData, lineData) => {
        myChart = echarts.init(document.getElementById('criminalCaseType'));
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const option = {
            backgroundColor: this.props.global && this.props.global.dark ? '#252c3c' : '#fff',
            grid:{
                x:80,
                x2:180,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: '{a0}:{c0}<br />{a1}:{c1}<br />{a2}:{c2}<br />',
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
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6'
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
            series: lineData,
        };
        myChart.setOption(option);
    };

    changeCaseType = (caseType) => {
        this.setState({
            caseType,
        }, () => {
            this.setChartsAndTableData(caseType);
        });
    };

    render() {
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const {tableData, caseType, loadingData} = this.state;
        const columns = [{
            title: '类别',
            dataIndex: 'categories',
            key: 'categories',
            width:120,
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

        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={styles.analysis}>
                    <AnalysisTitleArea analysisTitle="类型分析" {...this.props} />
                    <div id="criminalCaseType" style={{height: 300}}
                         className={this.props.global && this.props.global.dark ? '' : styles.lightChartBox}/>
                    <div className={styles.buttonOnChartArea}>
                        <Button type={caseType === 'blaj' ? 'primary' : 'dashed'} size="large"
                                onClick={() => this.changeCaseType('blaj')}>八类案件</Button>
                        <Button type={caseType === 'lq' ? 'primary' : 'dashed'} size="large"
                                onClick={() => this.changeCaseType('lq')}>两抢一盗</Button>
                        <Button type={caseType === 'qc' ? 'primary' : 'dashed'} size="large"
                                onClick={() => this.changeCaseType('qc')}>侵财</Button>
                        <Button type={caseType === 'sh' ? 'primary' : 'dashed'} size="large"
                                onClick={() => this.changeCaseType('sh')}>伤害</Button>
                    </div>
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
