/*
* RegulaterWarnings.js 监管面板页面--告警
* author：lyp
* 20180623
* */

import React, {PureComponent} from 'react';
import {Row, Col, List, Button, Card} from 'antd';
import echarts from 'echarts/lib/echarts';
import pie from 'echarts/lib/chart/pie';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import styles from './Regulate.less';
import {routerRedux} from 'dva/router';

let myChart;
const colors = ['#f3637c', '#975fe6', '#3399ff', '#87d2e9', '#35cbca', '#4fcb73', '#fbd437'];

export default class RegulaterWarnings extends PureComponent {

    state = {
        warningCount: 0,
        warningList: [],
        zqData: [],
    };

    componentDidMount() {
        this.showEchar();
        // this.getCaseHandArea();
        // this.getBaqZxGjPgListPage();
        // this.getBaqZqTj();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.condition !== null) && (this.props.condition !== nextProps.condition)) {
                const {startTime, endTime, areaCode} = nextProps.condition;
                this.getCaseHandArea(startTime, endTime, areaCode);
                this.getBaqZxGjPgListPage(startTime, endTime, areaCode);
                this.getBaqZqTj(startTime, endTime, areaCode);
            }
        }
    }

    // 获取办案区实时数据
    getCaseHandArea = (startTime, endTime, areaCode) => {
        this.props.dispatch({
            type: 'show/getCaseHandArea',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: areaCode,
            },
            callback: (data) => {
                if (data) {
                    const arry = [];
                    let warningCount = 0;
                    for (let i = 0; i < data.length; i++) {
                        warningCount += data[i].sj_count;
                        arry.push({
                            value: data[i].sj_count,
                            name: data[i].sj_name,
                            code: data[i].sj_lx,
                            itemStyle: {
                                color: colors[i],
                            },
                        });
                    }
                    this.setState({
                        warningCount,
                    });
                    myChart.setOption({
                        legend: {
                            data: arry,
                            formatter: function (name) {
                                for (let i = 0; i < arry.length; i++) {
                                    if (arry[i].name === name) {
                                        return '{title|' + name + ' ' + arry[i].value + '}';
                                    }
                                }
                            },
                            textStyle: {
                                rich: {
                                    title: {
                                        color: 'rgba(0, 0, 0, 0.65)',
                                        align: 'left',
                                        width: 110,
                                        textAlign: 'left',
                                        fontSize: 14,
                                    },
                                },
                            },
                        },
                        series: [{
                            data: arry,
                        }],
                    });
                }
            },
        });
    };
    // 获取办案区最新告警信息数据
    getBaqZxGjPgListPage = (startTime, endTime, areaCode) => {
        this.props.dispatch({
            type: 'show/getBaqZxGjPgListPage',
            payload: {
                currentPage: 1,
                showCount: 5,
                pd: {
                    kssj: startTime,
                    jssj: endTime,
                    org: areaCode,
                },
            },
            callback: (data) => {
                if (data && data.list) {
                    this.setState({
                        warningList: [...data.list],
                    });
                }
            },
        });
    };
    // 获取办案区在区信息数据
    getBaqZqTj = (startTime, endTime, areaCode) => {
        this.props.dispatch({
            type: 'show/getBaqZqTj',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: areaCode,
            },
            callback: (data) => {
                if (data) {
                    // const arry = [];
                    // for(let i=0;i<data.length;i++){
                    //     const str = data[i].name;
                    //     arry.push(str)
                    // }
                    this.setState({
                        zqData: [...data],
                    });
                }
            },
        });
    };

    showEchar = () => {
        myChart = echarts.init(document.getElementById('warningEchar'));
        const config = window.configUrl;
        const that = this;
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
            },
            legend: {
                x: 'center',
                y: 'bottom',
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                width: 400,
                data: [],
            },
            calculable: true,
            series: [
                {
                    // name:'半径模式',
                    type: 'pie',
                    radius: config.isShowBaqsstj ? [30, 110] : [50, 150],
                    center: ['50%', '40%'],
                    roseType: 'radius',
                    label: {
                        normal: {
                            show: false,
                            position: 'inside',
                            formatter: function (data) {
                                return data.data.value;
                            },
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    lableLine: {
                        normal: {
                            show: false,
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    data: [],
                },
            ],
        };
        myChart.setOption(option);
        if (config.isShowBaqsstj) {
            myChart.on('click', function (params) {
                that.enterListPage(params);
            });
        }

    };
    // 进入列表页
    enterListPage = (params) => {
        // console.log('params', params);
        const code = params.data.code;
        const {startTime, endTime, areaCode} = this.props.condition;
        this.props.dispatch(routerRedux.push(`/problem/unarea/Transfer/Index?org=${areaCode}&endTime=${endTime}&startTime=${startTime}&code=${code}`));
    };

    render() {
        const {warningCount, warningList, zqData} = this.state;
        const configUrl = window.configUrl;
        return (
            <Card bodyStyle={{height: 565, padding: '10px 24px'}}>
                <Row>
                    <Col span={12}>
                        <div className={styles.blockTitle}>{configUrl.isShowBaqsstj ? '办案区数据' : '案件状态统计'}</div>
                        {configUrl.isShowBaqsstj ? (
                            <Row className={styles.warningType}>
                                {
                                    zqData.map((item) =>
                                        <Col span={6} className={styles.rightBorderCol}>
                                            <div className={styles.warningNumber}>{item.sj_count}</div>
                                            <div className={styles.warningInfo}>{item.sj_name}</div>
                                        </Col>,
                                    )
                                }
                                <Col span={6}>
                                    <div className={styles.warningCount}>{warningCount}</div>
                                    <div className={styles.warningCountInfo}>告警</div>
                                </Col>
                            </Row>
                        ) : null}
                        <div className={styles.warningEcharArea}
                             style={window.configUrl.isShowBaqsstj ? null : {height: 470}}>
                            <div id="warningEchar" style={{height: '100%', width: '85%'}}></div>
                        </div>
                    </Col>
                    <Col span={12} className={styles.leftBorderCol}>
                        <List
                            itemLayout="horizontal"
                            dataSource={warningList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            configUrl.isShowBaqsstj ? (
                                                <div className={styles.warningListTitle}>
                                                    <span className={styles.title}>●<span className={styles.date}
                                                                                          style={{padding: '0 10px'}}>{item.gjsj}</span>{item.name}</span>
                                                </div>
                                            ) : (
                                                <div className={styles.warningListTitle}>
                                                    <span className={styles.title}>●<span className={styles.date}
                                                                                          style={{padding: '0 10px'}}>{item.sasj}</span>{item.ajmc}</span>
                                                </div>
                                            )

                                        }
                                        description={<div className={styles.warningListContent}></div>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Card>
        );
    }
}
