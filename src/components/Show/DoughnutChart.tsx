/*
* DoughnutChart.js 大屏展示页面 圆环饼图
* author：lyp
* 20180601
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import echarts from 'echarts/lib/echarts';
import pie from 'echarts/lib/chart/pie';
import styles from './ComponentStyles.less';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import title from 'echarts/lib/component/title';
import moment from 'moment/moment';
import { getTimeDistance } from '../../utils/utils';

let myChart;
const colors = [['#00ccff', '#0000ff'], ['#00ffcc', '#009966'], ['#ffff00', '#ff9933']];

export default class DoughnutChart extends PureComponent {

    state = {
        nowTab: 'all',
        rangePickerValue: [],
    };

    componentDidMount() {
        this.showEchart();
        // this.getTimeWarningData();
        this.clickTab('all', this.props.areaCode);
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.areaCode !== nextProps.areaCode)) {
                this.clickTab('all', nextProps.areaCode);
            }
        }

    }

    // 获取时限告警数据
    // getTimeWarningData = (areaCode) => {
    //     this.props.dispatch({
    //         type: 'show/getTimeWarningData',
    //         payload: {
    //             org: areaCode,
    //         },
    //         callback: (data) => {
    //             if(myChart){
    //                 const dataArry = [];
    //                 const headerArry = [];
    //                 let count = 0;
    //                 for(let i = 0; i < data.length; i++){
    //                     let obj = {
    //                         name: data[i].sj_name,
    //                         value: data[i].sj_count,
    //                         itemStyle:{
    //                             color: colors[i],
    //                         }
    //                     }
    //                     dataArry.push(obj);
    //                     headerArry.push({
    //                         name: data[i].sj_name,
    //                         icon: 'circle',
    //                     });
    //                     count += parseInt(data[i].sj_count);
    //                 }
    //                 myChart.setOption({
    //                     legend: {
    //                         data: headerArry,
    //                         formatter: function(name){
    //                             for(let i=0;i< dataArry.length; i++){
    //                                 if(dataArry[i].name === name){
    //                                     return name + ' ' + dataArry[i].value
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     series: [{
    //                         data: dataArry,
    //                         label:{
    //                             normal: {
    //                                 formatter: count.toString(),
    //                             },
    //                         }
    //                     }],
    //                 })
    //             }
    //         },
    //     })
    // }
    // 获取案件统计数据
    getCaseCountByArea = (startTime, endTime, areaCode) => {
        this.props.dispatch({
            type: 'show/getCaseCountByArea',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: areaCode,
            },
            callback: (data) => {
                if (myChart) {
                    const dataArry = [];
                    const headerArry = [];
                    let count = 0;
                    for (let i = 0; i < data.length; i++) {
                        let obj = {
                            name: data[i].sj_name,
                            value: data[i].sj_count,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        { offset: 0, color: colors[i][0] },
                                        { offset: 1, color: colors[i][1] },
                                    ],
                                ),
                            },
                        };
                        dataArry.push(obj);
                        headerArry.push({
                            name: data[i].sj_name,
                            icon: 'circle',
                        });
                        count += parseInt(data[i].sj_count);
                    }
                    myChart.setOption({
                        title: {
                            text: '案件总数{number|' + count + '}',

                            textStyle: {
                                rich: {
                                    number: {
                                        color: '#E4860A',
                                        align: 'center',
                                        width: 50,
                                        fontSize: 14,
                                        textAlign: 'center',
                                    },
                                },
                            },
                        },
                        legend: {
                            data: headerArry,
                            formatter: function(name) {
                                for (let i = 0; i < dataArry.length; i++) {
                                    if (dataArry[i].name === name) {
                                        return '{title|' + name + '}{number|' + dataArry[i].value + '}';
                                    }
                                }
                            },
                            textStyle: {
                                rich: {
                                    title: {
                                        padding: [0, 10, 0, 10],
                                        fontSize: 14,
                                    },
                                    number: {
                                        color: '#E4860A',
                                        align: 'center',
                                        width: 50,
                                        fontSize: 14,
                                        textAlign: 'center',
                                    },
                                },
                            },
                        },
                        series: [{
                            data: dataArry,
                            label: {
                                normal: {
                                    formatter: count.toString(),
                                },
                            },
                        }],
                    });
                }
            },
        });
    };

    clickTab = (type, code) => {
        let areaCode = this.props.areaCode;
        if (code || code === '') {
            areaCode = code;
        }
        this.setState({
            nowTab: type,
            // rangePickerValue: getTimeDistance(type),
        });
        const time = getTimeDistance(type);
        const startTime = time[0] === '' ? '' : moment(time[0]).format('YYYY-MM-DD');
        const endTime = time[1] === '' ? '' : moment(time[1]).format('YYYY-MM-DD');
        this.getCaseCountByArea(startTime, endTime, areaCode);
    };

    showEchart = () => {
        myChart = echarts.init(document.getElementById('oughnutChart'));
        const count = '2323432';
        // const dataData = [
        //     {value:335, name:'强制措施超期',itemStyle:{color: '#034cd4'}},
        //     {value:310, name:'涉案财物保管超期',itemStyle:{color: '#d7165a'}},
        //     {value:234, name:'办案区滞留超期',itemStyle:{color: '#16fcc8'}},
        //     {value:135, name:'其他',itemStyle:{color: '#fc9b00'}},
        //     ]
        const option = {
            title: {
                right: 70,
                top: 30,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                    color: '#fff',
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: 30,
                top: 80,
                show: true,
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 25,
                selectedMode: false, // 点击
                textStyle: {
                    color: '#fff',
                    fontSize: 20,
                    lineHeight: 24,
                },
                data: [],

            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '',
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold',
                                color: '#fc9b00',
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
        const { nowTab } = this.state;
        return (
            <div className={styles.componentBlock}>
                <div className={styles.componentBlockHeader}>
                    <span className={nowTab === 'all' ? styles.tabHeader : null} style={{ width: '20%' }}
                          onClick={() => this.clickTab('all')}>全部</span>
                    <span className={nowTab === 'today' ? styles.tabHeader : null} style={{ width: '20%' }}
                          onClick={() => this.clickTab('today')}>本日</span>
                    <span className={nowTab === 'week' ? styles.tabHeader : null} style={{ width: '20%' }}
                          onClick={() => this.clickTab('week')}>本周</span>
                    <span className={nowTab === 'month' ? styles.tabHeader : null} style={{ width: '20%' }}
                          onClick={() => this.clickTab('month')}>本月</span>
                    <span className={nowTab === 'year' ? styles.tabHeader : null} style={{ width: '20%' }}
                          onClick={() => this.clickTab('year')}>本年</span>
                </div>
                <p id="oughnutChart" style={{ width: '100%', height: '90%' }}></p>
            </div>
        );
    }
}