/*
* CriminalCaseCount.js 智慧案管大屏---刑事案件数量Bar
* author：lyp
* 20181120
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import title from 'echarts/lib/component/title';

let myChart;
let colors = [
    '#ff4d98',
    '#ff0062',
    '#00e3ff',
    '#009bcd',
    '#6f05c3',
    '#c6306c',
    '#ff4e50',
    '#f9d423',
    '#4971ff',
    '#9798ff',
    '#00c9ff',
    '#92f39d',
    '#ffe000',
    '#799f0c',
    '#00c6ff',
    '#0072ff',
];

export default class CriminalCaseCount extends PureComponent {
    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getCriminalCaseCount(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getCriminalCaseCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取警情来源数据
    getCriminalCaseCount = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getCriminalCaseCount',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    const xData = [];
                    const barData = [];
                    let num = 0;
                    for (let i = 0; i < data.list.length; i++) {
                        xData.push(data.list[i].sj_name);
                        const obj = {
                            name: data.list[i].sj_name,
                            value: data.list[i].sj_count,
                            itemStyle: {
                                color: colors[i],
                            },
                        };
                        num = num + parseInt(data.list[i].sj_count);
                        barData.push(obj);
                        myChart.setOption({
                            xAxis: {
                                data: xData,
                            },
                            series: [{
                                data: barData,
                            }],
                        });
                    }
                    this.props.getAllNum(this.props.idx, num, '刑事案件数量');
                }

            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('CriminalCaseCount'));

        const option = {
            title: {
                text: '刑事案件数量',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
                padding: 8,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            grid: {
                right: '3%',
            },
            xAxis: [
                {
                    type: 'category',
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                        rotate: 30,
                        interval: 0,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#01E7CA',
                        },
                    },
                    axisTick: {
                        inside: true,
                        length: 3,
                        lineStyle: {
                            width: 2,
                        },
                    },
                    data: [],
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#68CCFE',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#334553',
                        },
                    },
                },
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: '60%',
                    data: [],
                },
            ],
        };
        myChart.setOption(option);
    };

    render() {
        return (
            <div id="CriminalCaseCount" style={{height: '100%', width: '100%'}}></div>
        );
    }
}
