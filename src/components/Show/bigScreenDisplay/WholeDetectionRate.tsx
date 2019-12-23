/*
* 智慧案管大屏---整体破案率
* author：lyp
* 20190112
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import line from 'echarts/lib/chart/line';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';

let myChart;

export default class WholeDetectionRate extends PureComponent {
    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getWholeDetectionRate(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getWholeDetectionRate(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取整体破案率
    getWholeDetectionRate = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getWholeDetectionRate',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                const xData = [];
                const lineData = [];
                let num = 0;
                for (let i = 0; i < data.length; i++) {
                    xData.push(data[i].bardwmc);
                    lineData.push(data[i].xsajpal);
                    num = num + parseInt(data[i].xsajpal);
                }
                this.props.getAllNum(this.props.idx, num, '整体破案率');
                myChart.setOption({
                    xAxis: {
                        data: xData,
                    },
                    series: [{
                        data: lineData,
                    }],
                });
            },

        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('WholeDetectionRate'));

        const option = {
            title: {
                text: '整体破案率',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    },
                },
                formatter: '{b}:{c}%',
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLabel: {
                        show: false,
                        textStyle: {
                            color: '#fff',
                        },
                        // rotate: 20,
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
                    name: '',
                    type: 'line',
                    stack: '破案率',
                    symbol: 'none',
                    areaStyle: {},
                    smooth: true,//平滑曲线显示
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#4971ff', // 0% 处的颜色
                            }, {
                                offset: 1, color: '#9798ff', // 100% 处的颜色
                            }],
                        },
                    },
                    data: [],
                },
            ],
        };
        myChart.setOption(option);
    };

    render() {
        return (
            <div id="WholeDetectionRate" style={{height: '100%', width: '100%'}}></div>
        );
    }

}
