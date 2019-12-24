/*
* DossierCount.js 智慧案管大屏----卷宗数量bar
* author：lyp
* 20181120
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import title from 'echarts/lib/component/title';

let myChart;

export default class DossierCount extends PureComponent {

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getDossierCount(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getDossierCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取卷宗数量
    getDossierCount = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getDossierCount',
            payload: {
                time_ks: startTime,
                time_js: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                let num = 0;
                if (data && data.list) {
                    const xData = [];
                    const barData1 = [];
                    const barData2 = [];
                    const dataList = data.list;

                    for (let i = 0; i < dataList.length; i++) {
                        xData.push(dataList[i].name);
                        barData1.push(dataList[i].count1);
                        barData2.push(dataList[i].count2);
                        num = num + parseInt(dataList[i].count1) + parseInt(dataList[i].count2);
                    }
                    this.props.getAllNum(this.props.idx, num, '卷宗数量');
                    myChart.setOption({
                        xAxis: {
                            data: xData,
                        },
                        series: [{
                            data: barData1,
                        }, {
                            data: barData2,
                        }],
                    });
                }
            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('DossierCount'));

        const option = {
            title: {
                text: '卷宗数量',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: [
                {
                    type: 'category',
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                        rotate: 20,
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
                    name: '出库',
                    type: 'bar',
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#ff0062', // 0% 处的颜色
                            }, {
                                offset: 1, color: '#ff4d98', // 100% 处的颜色
                            }],
                        },
                    },
                    data: [],
                },
                {
                    name: '入库',
                    type: 'bar',
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#009bcd', // 0% 处的颜色
                            }, {
                                offset: 1, color: '#00e3ff', // 100% 处的颜色
                            }],
                        },
                    },
                    data: [],
                },

                // {
                //     name:'出库',
                //     type:'bar',
                //     itemStyle: {
                //         color: {
                //             type: 'linear',
                //             x: 0,
                //             y: 0,
                //             x2: 0,
                //             y2: 1,
                //             colorStops: [{
                //                 offset: 0, color: '#4971ff' // 0% 处的颜色
                //             }, {
                //                 offset: 1, color: '#9798ff' // 100% 处的颜色
                //             }],
                //         },
                //     },
                //     data:[862, 1018, 964, 1026, 1679, 1600, 1570],
                // }
            ],
        };
        myChart.setOption(option);
    };

    render() {
        return (
            <div id="DossierCount" style={{height: '100%', width: '100%'}}></div>
        );
    }
}
