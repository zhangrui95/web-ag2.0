/*
* DoughnutChart.js 大屏展示页面 南丁格尔图
* author：lyp
* 20180611
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col} from 'antd';
import echarts from 'echarts/lib/echarts';
import pie from 'echarts/lib/chart/pie';
import styles from './ComponentStyles.less';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import img1 from '../../assets/show/anjian.png';
import img2 from '../../assets/show/shean.png';
import img3 from '../../assets/show/gongan.png';
import {getTimeDistance} from '../../utils/utils';
import moment from 'moment/moment';

let customizedPie;
const colors = [['#cc0066', '#ff9999'], ['#660066', '#ff0066'], ['#cc3366', '#ffcccc'], ['#660066', '#ff0066'], ['#ff6699', '#ffcccc'], ['#660066', '#ff0066'], ['#660033', '#cc0066']];

export default class CustomizedPie extends PureComponent {

    state = {
        warningCount: 0,
        warningList: [],
        nowTab: 'all',
        zqData: {
            zqsary: 0,
            zqmj: 0,
            zbaj: 0,
        },
    };

    componentDidMount() {
        this.showEchart();
        this.getCaseHandArea();
        this.getBaqZxGjPgListPage();
        this.getBaqZqTj();
        window.addEventListener('resize', customizedPie.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.areaCode !== nextProps.areaCode)) {
                this.clickTab('all', nextProps.areaCode);
                this.getBaqZxGjPgListPage(nextProps.areaCode);
                this.getBaqZqTj(nextProps.areaCode);
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
                    // const data = [
                    //         {"sj_lx":"201801","sj_name":"离岗告警","sj_count":123},
                    //         {"sj_lx":"201802","sj_name":"执法流程告警","sj_count":166},
                    //         {"sj_lx":"201803","sj_name":"双人审讯告警","sj_count":146},
                    //         {"sj_lx":"201804","sj_name":"防串供告警","sj_count":178},
                    //         {"sj_lx":"201805","sj_name":"滞留超时告警","sj_count":219},
                    //         {"sj_lx":"201806","sj_name":"人身自救告警","sj_count":133},
                    //         {"sj_lx":"201807","sj_name":"逃离告警","sj_count":214},
                    //     ];
                    const arry = [];
                    let warningCount = 0;
                    for (let i = 0; i < data.length; i++) {
                        warningCount += data[i].sj_count;
                        arry.push({
                            value: data[i].sj_count,
                            name: data[i].sj_name,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: colors[i][0]},
                                        {offset: 1, color: colors[i][1]},
                                    ],
                                ),
                            },
                        });
                    }
                    this.setState({
                        warningCount,
                    });
                    customizedPie.setOption({
                        series: [{
                            data: arry,
                        }],
                    });
                }
            },
        });
    };
    // 获取办案区最新告警信息数据
    getBaqZxGjPgListPage = (area) => {
        this.props.dispatch({
            type: 'show/getBaqZxGjPgListPage',
            payload: {
                currentPage: 1,
                showCount: 3,
                pd: {
                    org: area,
                },
            },
            callback: (data) => {
                if (data && data.list) {
                    const arry = [];
                    const list = data.list;
                    for (let i = 0; i < list.length; i++) {
                        const str = list[i].name;
                        arry.push(str);
                    }
                    this.setState({
                        warningList: arry,
                    });
                }
            },
        });
    };
    // 获取办案区在区信息数据
    getBaqZqTj = (area) => {
        this.props.dispatch({
            type: 'show/getBaqZqTj',
            payload: {
                org: area,
            },
            callback: (data) => {
                if (data) {
                    // const arry = [];
                    // for(let i=0;i<data.length;i++){
                    //     const str = data[i].name;
                    //     arry.push(str)
                    // }
                    let obj = {};
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].sj_name === '在办案件') {
                            obj.zbaj = data[i].sj_count;
                        } else if (data[i].sj_name === '在区民警') {
                            obj.zqmj = data[i].sj_count;
                        } else if (data[i].sj_name === '在区涉案人员') {
                            obj.zqsary = data[i].sj_count;
                        }
                    }
                    this.setState({
                        zqData: {...obj},
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
        this.getCaseHandArea(startTime, endTime, areaCode);
    };
    showEchart = () => {
        customizedPie = echarts.init(document.getElementById('customizedPie'));
        const count = '2323432';
        // const dataData = [
        //     {value:335, name:'强制措施超期',itemStyle:{color: '#034cd4'}},
        //     {value:310, name:'涉案财物保管超期',itemStyle:{color: '#d7165a'}},
        //     {value:234, name:'办案区滞留超期',itemStyle:{color: '#16fcc8'}},
        //     {value:135, name:'其他',itemStyle:{color: '#fc9b00'}},
        //     ]
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
                colors: '#fff',
            },

            // visualMap: {
            //     show: false,
            //     min: 0,
            //     max: 100,
            //     inRange: {
            //         colorLightness: [0.3, 0.7]
            //     }
            // },
            series: [
                {
                    // name:'面积模式',
                    type: 'pie',
                    radius: [30, 90],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff',
                                fontSize: 14,
                            },
                            formatter: '{b} {c}',
                        },
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#66CBFF',
                            },
                            smooth: 0.2,
                            length: 8,
                            length2: 16,

                        },
                    },
                    // itemStyle: {
                    //     normal: {
                    //         color: '#E00F55',
                    //         shadowBlur: 200,
                    //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //     }
                    // },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    },
                },
            ],
        };
        customizedPie.setOption(option);
    };

    render() {
        const {warningList, warningCount, zqData, nowTab} = this.state;
        return (
            <div className={styles.fullPartBlock}>
                <div className={styles.echartBlock}>
                    <div className={styles.componentBlockHeader}>
                        <span className={nowTab === 'all' ? styles.tabHeader : null} style={{width: '20%'}}
                              onClick={() => this.clickTab('all')}>全部</span>
                        <span className={nowTab === 'today' ? styles.tabHeader : null} style={{width: '20%'}}
                              onClick={() => this.clickTab('today')}>本日</span>
                        <span className={nowTab === 'week' ? styles.tabHeader : null} style={{width: '20%'}}
                              onClick={() => this.clickTab('week')}>本周</span>
                        <span className={nowTab === 'month' ? styles.tabHeader : null} style={{width: '20%'}}
                              onClick={() => this.clickTab('month')}>本月</span>
                        <span className={nowTab === 'year' ? styles.tabHeader : null} style={{width: '20%'}}
                              onClick={() => this.clickTab('year')}>本年</span>
                    </div>
                    <p id="customizedPie" style={{width: '100%', height: '90%'}}></p>
                </div>
                <div className={styles.zqdata}>
                    <Row className={styles.itemCount} gutter={24}>
                        <Col span={8} className={styles.itemType}>
                            <div className={styles.itemTypeImage}><img src={img1} alt=""/></div>
                            <div className={styles.itemTypeNumber}>{zqData.zbaj}</div>
                            <div className={styles.itemTypeName}>在办案件</div>
                        </Col>
                        <Col span={8} className={styles.itemType}>
                            <div className={styles.itemTypeImage}><img src={img3} alt=""/></div>
                            <div className={styles.itemTypeNumber}>{zqData.zqmj}</div>
                            <div className={styles.itemTypeName}>在区民警</div>
                        </Col>
                        <Col span={8} className={styles.itemType}>
                            <div className={styles.itemTypeImage}><img src={img2} alt=""/></div>
                            <div className={styles.itemTypeNumber}>{zqData.zqsary}</div>
                            <div className={styles.itemTypeName}>在区涉案人员</div>
                        </Col>
                    </Row>
                    <Row className={styles.warningList} gutter={24}>
                        <Col span={16} className={styles.warningListBlock}>
                            <div className={styles.wlist}>
                                {
                                    warningList.length > 0 ? (
                                        warningList.map((item) =>
                                            <div style={{
                                                overflow: 'hidden',
                                                width: '100%',
                                                height: 25,
                                                lineHeight: '25px',
                                            }}>{item}</div>,
                                        )
                                    ) : (
                                        <div style={{
                                            overflow: 'hidden',
                                            width: '100%',
                                            height: '100%',
                                            textAlign: 'center',
                                            fontSize: '1.4rem',
                                            color: '#13227B',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            marginTop: -15,
                                        }}>暂无告警信息</div>
                                    )
                                }
                            </div>
                        </Col>
                        <Col span={8} className={styles.countNumber}>
                            <div style={{
                                fontSize: '1.8rem',
                                color: '#ff9600',
                                fontWeight: 'bolder',
                                paddingTop: 5,
                            }}>{warningCount}</div>
                            <div>告警</div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}