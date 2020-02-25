/*
* AdministrativeCaseCount.js 智慧案管大屏---行政案件数量Bar
* author：lyp
* 20181122
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';

let myChart;

export default class AdministrativeCaseCount extends PureComponent {

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getAdministrativeCaseCount(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getAdministrativeCaseCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取行政处罚数量
    getAdministrativeCaseCount = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getAdministrativeCaseCount',
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
                        xData.push(data.list[i].name);
                        barData.push(data.list[i].count);
                        num = num + parseInt(data.list[i].count);
                    }
                    this.props.getAllNum(this.props.idx, num, '行政案件数量');
                    let yAxis = {};
                    let yMax = Math.max(...barData);
                    if (yMax < 5) {
                        yAxis.max = 5;
                    }else{
                        yAxis.max = yMax;
                    }
                    myChart.setOption({
                        xAxis: {
                            data: xData,
                        },
                        yAxis:yAxis,
                        series: [{
                            data: barData,
                        }],
                    });
                }
            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('AdministrativeCaseCount'));

        const option = {
            title: {
                text: '行政案件数量',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
            },
            tooltip: {
                formatter: '{b}:{c}',
            },
            xAxis: {
                data: [],
                silent: false,
                // splitLine: {show: false},
                splitArea: {show: false},
                axisLabel: {
                    // textStyle: {
                    //     color: '#fff'
                    // },
                    // rotate: 20,
                    // interval: 0,
                    show: false,
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
            },
            yAxis: {
                // inverse: true,
                splitArea: {show: false},
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
                min: 0,
            },
            series: [
                {
                    name: '行政案件数量',
                    type: 'bar',
                    stack: 'one',
                    barWidth: '60%',
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#6f0573', // 0% 处的颜色
                            }, {
                                offset: 1, color: '#c6306c', // 100% 处的颜色
                            }],
                        },
                    },
                    // itemStyle: itemStyle,
                    data: [],
                },
                // {
                //     name: 'bar2',
                //     type: 'bar',
                //     stack: 'one',
                //     barWidth: '60%',
                //     itemStyle: {
                //         color: {
                //             type: 'linear',
                //             x: 0,
                //             y: 0,
                //             x2: 0,
                //             y2: 1,
                //             colorStops: [{
                //                 offset: 0, color: '#009bcd' // 0% 处的颜色
                //             }, {
                //                 offset: 1, color: '#00e3ff' // 100% 处的颜色
                //             }],
                //         },
                //     },
                //     // itemStyle: itemStyle,
                //     data: [-1,-2,-3,-4,-5,-6,-7]
                // },

            ],
        };
        myChart.setOption(option);
    };

    render() {
        return (
            <div id="AdministrativeCaseCount" style={{height: '100%', width: '100%'}}></div>
        );
    }
}
