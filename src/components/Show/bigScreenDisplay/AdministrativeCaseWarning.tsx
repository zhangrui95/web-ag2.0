/*
* AdministrativeCaseWarning.js 智慧案管大屏---行政案件告警统计pie
* author：lyp
* 20181122
* */

import React, {PureComponent} from 'react';
import echarts from 'echarts/lib/echarts';
import pie from 'echarts/lib/chart/pie';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';
import {routerRedux} from 'dva/router';

let myChart;

export default class AdministrativeCaseWarning extends PureComponent {

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getAdministrativeCaseWarning(selectDate[0], selectDate[1], org, orgCode, orglist);
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getAdministrativeCaseWarning(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 行政案件告警统计
    getAdministrativeCaseWarning = (startTime, endTime, org, orgCode, orglist) => {
        const {shadeColors} = this.props;
        this.props.dispatch({
            type: 'UnXzCaseData/getUnXzCaseAllTypeWarnings',
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
                            code: data.list[i].code,
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
                    this.props.getAllNum(this.props.idx, num, '行政案件告警统计');
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
                        }],
                    });


                }

            },
        });
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('AdministrativeCaseWarning'));

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}',
            },
            title: {
                text: '行政案件告警统计',
                textStyle: {
                    color: '#66ccff',
                    fontSize: 20,
                },
            },
            legend: {
                orient: 'vertical',
                right: '2%',
                top: '20%',
                show: true,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 25,
                selectedMode: false, // 点击
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    lineHeight: 24,
                },
                data: [],
            },
            series: [
                // {
                //     name:'',
                //     type:'pie',
                //     center: ['30%', '50%'],
                //     radius: ['20%', '35%'],
                //     label: {
                //         normal: {
                //             // position: 'inner',
                //             // formatter:function(value){
                //             //     return value.value;
                //             // }
                //             show: false,
                //         }
                //     },
                //     labelLine: {
                //         normal: {
                //             show: false
                //         }
                //     },
                //     data:[
                //         {
                //             value:135,
                //             name:'应受未受案件',
                //             itemStyle:{
                //                 color: {
                //                     type: 'linear',
                //                     x: 0,
                //                     y: 0,
                //                     x2: 1,
                //                     y2: 0,
                //                     colorStops: [{
                //                         offset: 0, color: '#6f05c3' // 0% 处的颜色
                //                     }, {
                //                         offset: 1, color: '#c6306c' // 100% 处的颜色
                //                     }],
                //                 },
                //             }
                //         },
                //     ]
                // },
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
        let that = this;
        myChart.setOption(option);
        myChart.on('click', function (params) {
            that.props.dispatch(routerRedux.push({
                pathname: '/newcaseFiling/casePolice/AdministrationPolice', state: {
                    code: that.props.dep ? that.props.dep : '',
                    kssj: that.props.selectDate[0] ? that.props.selectDate[0] : '',
                    jssj: that.props.selectDate[1] ? that.props.selectDate[1] : '',
                    wtlx_id: params.data.code ? params.data.code : '',
                }
            }));
        });
    };

    render() {
        return (
            <div id="AdministrativeCaseWarning" style={{height: '100%', width: '100%'}}></div>
        );
    }
}
