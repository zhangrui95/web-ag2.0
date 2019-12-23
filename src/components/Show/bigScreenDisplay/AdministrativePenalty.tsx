/*
* SCMAdministrativePenalty.js 智慧案管大屏---行政处罚数量象形柱图PictorialBar
* author：lyp
* 20181120
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import pictorialBar from 'echarts/lib/chart/pictorialBar';
import title from 'echarts/lib/component/title';

let myChart;

export default class AdministrativePenalty extends PureComponent {

    componentDidMount() {
        const {selectDate, orgCode, org, orglist} = this.props;
        this.getAdministrativePenalty(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getAdministrativePenalty(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取行政处罚数量
    getAdministrativePenalty = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'XzCaseData/getAdministrativePenalty',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    let xData = [];
                    let barData = [];
                    let num = 0;
                    if (data.list.length > 0) {
                        for (let i = 0; i < data.list.length; i++) {
                            xData.push(data.list[i].name);
                            barData.push(data.list[i].count);
                            num += parseInt(data.list[i].count);
                        }
                    } else {
                        xData = ['扣押', '行政拘留并处罚', '责令社区戒毒', '罚款', '行政拘留'];
                        barData = [0, 0, 0, 0, 0];
                    }
                    this.props.getAllNum(this.props.idx, num, '行政处罚数量');
                    myChart.setOption({
                        xAxis: {
                            data: xData,
                        },
                        series: [{
                            data: barData,
                        }],
                    });
                }
            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('SCMAdministrativePenalty'));

        const option = {
            title: {
                text: '行政处罚数量',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
            },
            xAxis: {
                data: [],
                axisTick: {show: false},
                axisLine: {show: false},
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                    rotate: 20,
                    interval: 0,
                },
            },
            yAxis: {
                splitLine: {show: false},
                axisTick: {show: false},
                axisLine: {show: false},
                axisLabel: {show: false},
            },
            color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                    {offset: 0, color: 'rgba(111,5,195,0.85)'},
                    {offset: 1, color: 'rgba(198,48,108,0.85)'},
                ],
            ),
            series: [{
                name: 'hill',
                type: 'pictorialBar',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{c}',
                        textStyle: {
                            fontSize: 16,
                            color: '#fff',
                        },
                    },
                },
                barCategoryGap: '-100%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                itemStyle: {
                    normal: {
                        opacity: 0.8,
                    },
                    emphasis: {
                        opacity: 1,
                    },
                },
                data: [],
                z: 10,
            }],
        };
        myChart.setOption(option);
    };

    render() {
        return (
            <div id="SCMAdministrativePenalty" style={{height: '100%', width: '100%'}}></div>
        );
    }
}
