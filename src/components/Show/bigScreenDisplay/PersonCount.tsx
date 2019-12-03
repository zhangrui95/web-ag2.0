/*
* 智慧案管大屏---人员统计象形柱图PictorialBar
* author：lyp
* 20181120
* */

import React, { PureComponent } from 'react';
import echarts from 'echarts/lib/echarts';
import pictorialBar from 'echarts/lib/chart/pictorialBar';
import title from 'echarts/lib/component/title';

let myChart;
const spirit = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC';

export default class PersonCount extends PureComponent {

    componentDidMount() {
        const { selectDate, org, orgCode, orglist } = this.props;
        this.getPersonCount(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getPersonCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取强制措施人数
    getPersonCount = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'CaseData/getEnforcementMeasure',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    const yData = [];
                    const barData = [];
                    let MaxData = 0;
                    let num = 0;
                    for (let i = 0; i < data.list.length; i++) {
                        yData.push(data.list[i].name);
                        barData.push(data.list[i].count);
                        MaxData = MaxData > data.list[i].count ? MaxData : data.list[i].count;
                        num = num + parseInt(data.list[i].count);
                    }
                    this.props.getAllNum(this.props.idx, num, '强制措施人数');
                    MaxData = MaxData + 100;
                    myChart.setOption({
                        xAxis: {
                            max: MaxData,
                        },
                        yAxis: {
                            data: yData,
                        },
                        series: [{
                            symbolBoundingData: MaxData,
                            data: barData,
                        }, {
                            symbolBoundingData: MaxData,
                            data: barData,
                        }],
                    });

                }

            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('PersonCount'));

        const option = {
            title: {
                text: '强制措施人数',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
            },
            xAxis: {
                splitLine: { show: false },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                data: [],
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        color: '#fff',
                        fontSize: 16,
                    },
                },
            },
            grid: {
                top: 'center',
                height: 200,
                left: 100,
                right: 100,
            },
            series: [{
                // current data
                type: 'pictorialBar',
                symbol: spirit,
                symbolRepeat: 'fixed',
                symbolMargin: '5%',
                symbolClip: true,
                symbolSize: 25,
                data: [],
                z: 10,
            }, {
                // full data
                type: 'pictorialBar',
                itemStyle: {
                    normal: {
                        opacity: 0.2,
                    },
                },
                label: {
                    normal: {
                        show: true,
                        formatter: function(params) {
                            return params.value;
                        },
                        position: 'right',
                        offset: [10, 0],
                        textStyle: {
                            color: '#fff',
                            fontSize: 18,
                        },
                    },
                },
                animationDuration: 0,
                symbolRepeat: 'fixed',
                symbolMargin: '5%',
                symbol: spirit,
                symbolSize: 25,
                data: [],
                z: 5,
            }],
        };
        myChart.setOption(option);
    };

    render() {
        return (
            <div id="PersonCount" style={{ height: '100%', width: '100%' }}></div>
        );
    }
}
