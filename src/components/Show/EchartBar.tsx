/*
* PictorialBar.js 大屏展示页面
* author：lyp
* 20180601
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import styles from './ComponentStyles.less';
import moment from 'moment/moment';
import { getTimeDistance } from '../../utils/utils';

let echartBar;

export default class EchartBar extends PureComponent {

    state = {
        nowTab: 'all',
        rangePickerValue: [],
    };

    componentDidMount() {
        this.showEchart();
        // this.getPoliceCaseData(this.state.nowTab);
        this.clickTab('all', this.props.areaCode);
        window.addEventListener('resize', echartBar.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.areaCode !== nextProps.areaCode)) {
                this.clickTab('all', nextProps.areaCode);
            }
        }

    }

    // 获取案件实时数据
    getPoliceCaseData = (startTime, endTime, areaCode) => {
        this.props.dispatch({
            type: 'show/getPoliceCaseData',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: areaCode,
            },
            callback: (data) => {
                if (echartBar) {
                    const dataArry = [];
                    const dataArry2 = [];
                    const headerArry = [];
                    let flag = false;
                    for (let i = 0; i < data.length; i++) {
                        let obj = {
                            name: data[i].sj_name,
                            value: data[i].sj_count,
                        };
                        let obj2 = {
                            name: data[i].sj_name,
                            value: data[i].sj_count * 0.5,
                        };
                        dataArry.push(obj);
                        dataArry2.push(obj2);
                        headerArry.push(data[i].sj_name);
                        flag = !flag;
                    }
                    echartBar.setOption({
                        xAxis: {
                            data: headerArry,
                        },
                        series: [{
                            data: dataArry,
                        }],
                    });
                }
            },
        });
    };

    showEchart = () => {
        echartBar = echarts.init(document.getElementById('echartBar'));
        const option = {
            xAxis: {
                // data: ['行政案件','刑事案件','立案侦查','案件侦破','侦查终结','移送起诉','监视居住','其他'],
                // axisTick: { show: false },
                // axisLine: { show: false },
                // axisLabel: {
                //     textStyle: {
                //         color: '#fff'
                //     }
                // },
                // z: 10,
                data: [],
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                    interval: 0,
                },
            },
            yAxis: {
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
            },
            series: [
                {
                    // type: 'bar',
                    type: 'pictorialBar',
                    symbol: 'rect',
                    symbolSize: [20, 1],
                    symbolMargin: 1,
                    symbolRepeat: true,
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
                    itemStyle: {
                        normal: {
                            // color: new echarts.graphic.LinearGradient(
                            //     0, 0, 0, 1,
                            //     [
                            //         {offset: 0, color: '#00c6fa'},
                            //         {offset: 1, color: '#005fec'}
                            //     ]
                            // )
                            color: function(params) {
                                var normalColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: '#00c6fa',
                                }, { offset: 1, color: '#005fec' }]);
                                return normalColor;

                            },
                        },
                        // emphasis: {
                        //     color: new echarts.graphic.LinearGradient(
                        //         0, 0, 0, 1,
                        //         [
                        //             {offset: 0, color: '#2378f7'},
                        //             {offset: 1, color: '#83bff6'}
                        //         ]
                        //     )
                        // }
                    },
                    data: [],
                },
                // {
                //     name: 'data',
                //     type: 'pictorialBar',
                //     // symbol: starPath,
                //     symbolRepeat: true,
                //     symbolMargin: 1,
                //     // symbolClip: true,
                //     symbolSize: [20, 1],
                //     itemStyle: {
                //         normal: {
                //             color: '#005EEB',
                //         },
                //     },
                //     // symbolBoundingData: [-60, 40],
                //     data: []
                // }
            ],
        };
        echartBar.setOption(option);
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
        this.getPoliceCaseData(startTime, endTime, areaCode);
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
                <p id="echartBar" style={{ width: '100%', height: '90%' }}></p>
            </div>
        );
    }
}