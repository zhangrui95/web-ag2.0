/*
* CaseItemWarningCount.js 智慧案管大屏---涉案物品告警数量Pie
* author：lyp
* 20181122
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import pie from 'echarts/lib/chart/pie';
import title from 'echarts/lib/component/title';
import legend from 'echarts/lib/component/legend';
import tooltip from 'echarts/lib/component/tooltip';

let myChart;

export default class CaseItemWarningCount extends PureComponent {

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.showEchart();
        this.getCaseItemWarningCount(selectDate[0], selectDate[1], org, orgCode, orglist);
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getCaseItemWarningCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 涉案物品告警数量
    getCaseItemWarningCount = (startTime, endTime, org, orgCode, orglist) => {
        const {shadeColors} = this.props;
        this.props.dispatch({
            type: 'UnItemData/getUnItemAllTypeWarnings',
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
                    let countData = 0;
                    for (let i = 0; i < data.list.length; i++) {
                        const obj = {
                            name: data.list[i].name,
                            icon: 'circle',
                        };
                        legendData.push(obj);
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
                        countData += parseInt(data.list[i].count);
                    }
                    this.props.getAllNum(this.props.idx, countData, '涉案物品告警数量');
                    myChart.setOption({
                        legend: {
                            data: legendData,
                            formatter: function (name) {
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
                            label: {
                                normal: {
                                    formatter: `告警总数\n\n${countData}`,
                                },
                            },
                        }],
                    });

                }

            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('CaseItemWarningCount'));

        const option = {
            title: {
                text: '涉案物品告警数量',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },

            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: '8%',
                top: '25%',
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 25,
                selectedMode: true, // 点击
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    lineHeight: 16,
                },
                data: [],
            },
            series: [
                {
                    name: '涉案物品告警数量',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '22',
                                // fontWeight: 'bold',
                                color: '#66ccff',
                            },
                        },
                        emphasis: {
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
            <div id="CaseItemWarningCount" style={{height: '100%', width: '100%'}}></div>
        );
    }
}
