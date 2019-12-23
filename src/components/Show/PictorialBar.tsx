/*
* PictorialBar.js 大屏展示页面
* author：lyp
* 20180601
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col} from 'antd';
import echarts from 'echarts/lib/echarts';
import pictorialBar from 'echarts/lib/chart/pictorialBar';
import styles from './ComponentStyles.less';
import {getTimeDistance} from '../../utils/utils';
import moment from 'moment';

let myChart;

export default class PictorialBar extends PureComponent {

    state = {
        nowTab: 'all',
        rangePickerValue: [],
    };

    componentDidMount() {
        this.showEchart();
        this.getPoliceSituationData();
        window.onresize = myChart.resize;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.areaCode !== nextProps.areaCode)) {
                this.clickTab('all', nextProps.areaCode);
            }
        }

    }

    // 获取警情实时数据
    getPoliceSituationData = (startTime, endTime, areaCode) => {
        this.props.dispatch({
            type: 'show/getPoliceSituationData',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: areaCode,
            },
            callback: (data) => {
                if (myChart) {
                    const dataArry = [];
                    const headerArry = [];
                    let flag = false;
                    for (let i = 0; i < data.length; i++) {

                        let obj = {
                            name: data[i].sj_name,
                            value: data[i].sj_count,
                        };
                        dataArry.push(obj);
                        headerArry.push(data[i].sj_name);
                        flag = !flag;
                    }
                    myChart.setOption({
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
        myChart = echarts.init(document.getElementById('main'));

        // const dataData = [
        //     { name: '接警', value: 100 },
        //     { name: '处警', value: 160 },
        //     { name: '复议复核', value: 125 },
        //     { name: '来信来访', value: 118 },
        //     { name: '到所报案', value: 112 },
        //     { name: '电话报案', value: 119 },
        // ]

        const option = {
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'none',
            //     },
            //     formatter: function (params) {
            //         return params[0].name + ': ' + params[0].value;
            //     }
            // },
            xAxis: {
                // data: ['接警', '处警', '复议复核', '来信来访', '到所报案', '电话报案'],
                data: [],
                axisTick: {show: false},
                axisLine: {show: false},
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
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
                    {offset: 0, color: '#00ffcc'},
                    {offset: 1, color: '#009966'},
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
                // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
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
    clickTab = (type, code = this.props.areaCode) => {
        this.setState({
            nowTab: type,
            // rangePickerValue: getTimeDistance(type),
        });
        const time = getTimeDistance(type);
        const startTime = time[0] === '' ? '' : moment(time[0]).format('YYYY-MM-DD');
        const endTime = time[1] === '' ? '' : moment(time[1]).format('YYYY-MM-DD');
        this.getPoliceSituationData(startTime, endTime, code);
    };

    render() {
        const {nowTab} = this.state;
        const {areaCode} = this.props;
        return (
            <div className={styles.componentBlock}>
                <div className={styles.componentBlockHeader}>
                    <span className={nowTab === 'all' ? styles.tabHeader : null} style={{width: '20%'}}
                          onClick={() => this.clickTab('all', areaCode)}>全部</span>
                    <span className={nowTab === 'today' ? styles.tabHeader : null} style={{width: '20%'}}
                          onClick={() => this.clickTab('today', areaCode)}>本日</span>
                    <span className={nowTab === 'week' ? styles.tabHeader : null} style={{width: '20%'}}
                          onClick={() => this.clickTab('week', areaCode)}>本周</span>
                    <span className={nowTab === 'month' ? styles.tabHeader : null} style={{width: '20%'}}
                          onClick={() => this.clickTab('month', areaCode)}>本月</span>
                    <span className={nowTab === 'year' ? styles.tabHeader : null} style={{width: '20%'}}
                          onClick={() => this.clickTab('year', areaCode)}>本年</span>
                </div>
                <p id="main" style={{width: '100%', height: '90%'}}></p>
            </div>
        );
    }
}