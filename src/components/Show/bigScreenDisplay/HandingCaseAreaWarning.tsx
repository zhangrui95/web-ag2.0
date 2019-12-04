/*
* HandingCaseAreaWarning.js 智慧案管大屏---办案区告警统计pie
* author：lyp
* 20181207
* */

import React, { PureComponent } from 'react';
import echarts from 'echarts/lib/echarts';
import pie from 'echarts/lib/chart/pie';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';

let myChart;

export default class HandingCaseAreaWarning extends PureComponent {

    componentDidMount() {
        const { selectDate, org, orgCode, orglist } = this.props;
        this.getHandingCaseAreaWarning(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getHandingCaseAreaWarning(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 行政案件告警统计
    getHandingCaseAreaWarning = (startTime, endTime, org, orgCode, orglist) => {
        const { shadeColors } = this.props;
        this.props.dispatch({
            type: 'UnareaData/getUnAreaAllTypeWarnings',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    const legendData = [];
                    const pieData = [];
                    let num = 0;
                    for (let i = 0; i < data.list.length; i++) {
                        const obj = {
                            name: data.list[i].name,
                            icon: 'circle',
                        };
                        legendData.push(obj);
                        num = num + parseInt(data.list[i].count);
                        pieData.push({
                            name: data.list[i].name,
                            value: data.list[i].count,
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 1,
                                    y2: 0,
                                    colorStops: [{
                                        offset: 0, color: shadeColors[i][0], // 0% 处的颜色
                                    }, {
                                        offset: 1, color: shadeColors[i][1], // 100% 处的颜色
                                    }],
                                },
                            },
                        });
                    }
                    this.props.getAllNum(this.props.idx, num, '办案区告警统计');
                    myChart.setOption({
                        legend: {
                            data: legendData,
                            formatter: function(name) {
                                let formatStr = '';
                                for (let i = 0; i < pieData.length; i++) {
                                    if (name === pieData[i].name) {
                                        formatStr = `${name} ${pieData[i].value}`;
                                        break;
                                    }
                                }
                                return formatStr;
                            },
                        },
                        series: [{
                            data: pieData,
                        }],
                    });


                }

            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('HandingCaseAreaWarning'));

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}({d}%)',
            },
            title: {
                text: '办案区告警统计',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
                padding: 8,
            },
            legend: {
                orient: 'vertical',
                right: '3%',
                top: '10%',
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 8,
                selectedMode: false, // 点击
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    lineHeight: 24,
                },
                data: [],
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    center: ['30%', '55%'],
                    // radius: ['50%', '65%'],
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
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
            <div id="HandingCaseAreaWarning" style={{ height: '100%', width: '100%' }}></div>
        );
    }
}
