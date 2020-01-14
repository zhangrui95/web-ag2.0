/*
* PersonalDocDetail 人员档案详情
* author：lyp
* 20180123
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Card, Steps, message, Tabs, Button, Spin} from 'antd';
import html2canvas from 'html2canvas';
import echarts from 'echarts';
import tree from 'echarts/lib/chart/tree';
import nophoto from '../../../assets/common/nophoto.png'
import nophotoLight from '../../../assets/common/nophotoLight.png'
import tooltip from 'echarts/lib/component/tooltip';
import PersonDetailTab from '../../../components/AllDocuments/PersonDetailTab';
import styles from '../docDetail.less';
import listStyles from '../docListStyle.less';
import {autoheight} from '../../../utils/utils';
import user from '../../../assets/common/userPerson.png'
import tar from '../../../assets/common/tar.png'
import aj from '../../../assets/common/aj.png'
import wp from '../../../assets/common/wp.png'
import qzcsjl from '../../../assets/common/qzcsjl.png'
import xzcfjl from '../../../assets/common/xzcfjl.png'
import rqjl from '../../../assets/common/rqjl.png'
import jzxx from '../../../assets/common/jzxx.png'
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const {Step} = Steps;
const TabPane = Tabs.TabPane;
let echartTree;
let imgBase = [];
@connect(({UnPoliceData, common, global}) => ({
    UnPoliceData, common, global
}))
export default class PersonalDocDetail extends PureComponent {
    constructor(props) {
        super(props);
        let res = props.location.query.record;
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            personData: '',
            loading: false, // 默认详情页是否为加载状态
            res: res,
        };
    }

    componentDidMount() {
        const idcard = this.state.res.xyr_sfzh;
        const {query: {id}} = this.props.location;
        // console.log('id',id)
        if (id) {
            this.getPersonDetail(id);
        } else {
            this.getPersonDetail(idcard);
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.dark !== nextProps.global.dark) {
            if (this.state.personData) {
                this.showEchart(this.state.personData, nextProps.global.dark);
            }
        }
    }

    getPersonDetail = (sfzh) => {
        this.props.dispatch({
            type: 'UnPoliceData/AllDetailPersonFetch',
            payload: {
                sfzh,
            },
            callback: (data) => {
                if (data && data.ryxx) {
                    this.setState({
                        personData: data,
                    }, () => {
                        this.showEchart(data, this.props.global.dark);
                        // window.addEventListener("resize", echartTree.resize);
                    });
                } else {
                    message.error('该人员暂无人员档案');
                }
            },
        });
    };
    // 根据案件编号打开案件窗口
    openCaseDetail = (item) => {
        let caseType = item.ajlx;
        if (caseType === '22001') { // 刑事案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                    query: {record: item, id: item.system_id},
                }),
            )
        } else if (caseType === '22002') { // 行政案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
                    query: {record: item, id: item.system_id, system_id: item.system_id},
                }),
            )
        }
    };
    // 入区信息详情
    IntoArea = (item) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/handlingArea/AreaData/areaDetail',
                query: {record: item, id: item.system_id},
            }),
        );
    };
    // 人员档案详情
    openPersonDetail = (record) => {
        const {xyr_sfzh: idcard} = record;
        if (idcard) {
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/lawEnforcement/PersonFile/Detail',
                    query: {id: idcard, record: record},
                }),
            );
        } else {
            message.error('该人员暂无人员档案');
        }
    };
    // 卷宗详情
    JzDetail = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/dossierPolice/DossierData/DossierDetail',
                query: {record: record, id: record.dossier_id},
            }),
        );
    };
    // 涉案物品详情
    SaWpdeatils = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/articlesInvolved/ArticlesData/itemDetail',
                query: {record: record, id: record.system_id},
            }),
        )
    };
    // 换行
    formatter = (val, len) => {
        if (val) {
            let strs = val.split(''); // 字符串数组
            let str = '';
            for (let i = 0, s; s = strs[i++];) { // 遍历字符串数组
                str += s;
                if (!(i % (len ? len : 10))) str += '\n'; // 按需要求余
            }
            return str;
        }
        return '';
    };
    getX = (x, d, idx, r) => {
        return x + Math.sin(d * idx) * r;
    }
    getY = (y, d, idx, r) => {
        return y - Math.cos(d * idx) * r;
    }
    // 脑图
    showEchart = (data, dark) => {
        echartTree = echarts.init(document.getElementById('ryRegulateTree' + this.state.res.xyr_sfzh));
        const {ajxx, ryxx} = data;
        let link = [];
        let datas = [{
            name: this.formatter(ryxx.name),
            attributes: {
                modularity_class: 0,
            },
            symbolSize: 60,
            x: -1500,
            y: 350,
        }];
        if (ajxx && ajxx.length > 0) {
            for (let i = 0; i < ajxx.length; i++) {
                const caseData = ajxx[i];
                let deg = 270 / ajxx.length;
                let x = this.getX(-1500, deg, i, ajxx.length > 3 ? ajxx.length % 2 == 0 ? 5000 : 3000 : 3000);
                let y = this.getY(350, deg, i, 3000);
                let lxX = this.getX(x, 20, 1, 3000);
                let lxY = this.getY(y, 20, 1, 3500);
                let tarX = this.getX(x, 20, 2, 2000);
                let tarY = this.getY(y, 20, 2, 2000);
                let qzX = this.getX(x, 20, 3, 3000);
                let qzY = this.getY(y, 20, 3, 1200);
                let xzX = this.getX(x, 20, 4, 2200);
                let xzY = this.getY(y, 20, 4, 2200);
                let ssX = this.getX(x, 20, 5, 1200);
                let ssY = this.getY(y, 20, 5, 1200);
                let saX = this.getX(x, 20, 6, 2000);
                let saY = this.getY(y, 20, 6, 2000);
                let jzX = this.getX(x, 20, 7, 2200);
                let jzY = this.getY(y, 20, 7, 1200);
                link.push({
                    source: this.formatter(ryxx.name),
                    target: this.formatter(ajxx[i].ajmc) + i,
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '历史入区信息' + i
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '同案人' + i
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '行政处罚记录' + i
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '强制措施记录' + i
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '随身物品' + i
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '涉案物品' + i
                }, {
                    source: this.formatter(ajxx[i].ajmc) + i,
                    target: '相关卷宗' + i
                })
                datas.push({
                        name: this.formatter(ajxx[i].ajmc),
                        id: this.formatter(ajxx[i].ajmc) + i,
                        attributes: {
                            modularity_class: 1,
                        },
                        symbolSize: 50,
                        x: x,
                        y: y,
                    },
                    {
                        name: '历史入区信息',
                        id: '历史入区信息' + i,
                        attributes: {
                            modularity_class: 2,
                        },
                        symbolSize: 35,
                        x: lxX,
                        y: lxY
                    }, {
                        name: '同案人',
                        id: '同案人' + i,
                        attributes: {
                            modularity_class: 3,
                        },
                        symbolSize: 35,
                        x: tarX,
                        y: tarY,
                    }, {
                        name: '行政处罚记录',
                        id: '行政处罚记录' + i,
                        attributes: {
                            modularity_class: 4,
                        },
                        symbolSize: 35,
                        x: xzX,
                        y: xzY
                    }, {
                        name: '强制措施记录',
                        id: '强制措施记录' + i,
                        attributes: {
                            modularity_class: 5,
                        },
                        symbolSize: 35,
                        x: qzX,
                        y: qzY
                    }, {
                        name: '随身物品',
                        id: '随身物品' + i,
                        attributes: {
                            modularity_class: 6,
                        },
                        symbolSize: 35,
                        x: ssX,
                        y: ssY
                    }, {
                        name: '涉案物品',
                        id: '涉案物品' + i,
                        attributes: {
                            modularity_class: 7,
                        },
                        symbolSize: 35,
                        x: saX,
                        y: saY
                    }, {
                        name: '相关卷宗',
                        id: '相关卷宗' + i,
                        attributes: {
                            modularity_class: 8,
                        },
                        symbolSize: 35,
                        x: jzX,
                        y: jzY
                    })
                if (caseData.rqList && caseData.rqList.length > 0) {
                    caseData.rqList.forEach((item, index) => {
                        link.push({
                            source: '历史入区信息' + i,
                            target: `${item.rqsj} ${item.haName}` + index + i,
                        });
                        datas.push({
                            name: `${item.rqsj} ${item.haName}`,
                            id: `${item.rqsj} ${item.haName}` + index + i,
                            attributes: {
                                modularity_class: 2,
                            },
                            symbolSize: 20,
                            x: this.getX(lxX, 30, index, 580),
                            y: this.getY(lxY, 30, index, 580),
                        });
                    });
                }
                if (caseData.tarList && caseData.tarList.length > 0) {
                    caseData.tarList.forEach((item, index) => {
                        link.push({
                            source: '同案人' + i,
                            target: this.formatter(`${item.name} (${item.xszk_name ? item.xszk_name : '未知'})`) + index + i,
                        });
                        datas.push({
                            name: this.formatter(`${item.name} (${item.xszk_name ? item.xszk_name : '未知'})`),
                            id: this.formatter(`${item.name} (${item.xszk_name ? item.xszk_name : '未知'})`) + index + i,
                            attributes: {
                                modularity_class: 3,
                            },
                            symbolSize: 20,
                            x: index > 10 ? this.getX(tarX, 30, index, 1200) : this.getX(tarX, 20, index, 800),
                            y: index > 10 ? this.getY(tarY, 30, index, 1200) : this.getY(tarY, 20, index, 800),
                        });
                    });
                }
                if (caseData.xzcfList && caseData.xzcfList.length > 0) {
                    caseData.xzcfList.forEach((item, index) => {
                        link.push({
                            source: '行政处罚记录' + i,
                            target: this.formatter(item.qzcsName) + index + i,
                        });
                        datas.push({
                            name: this.formatter(item.qzcsName),
                            id: this.formatter(item.qzcsName) + index + i,
                            attributes: {
                                modularity_class: 4,
                            },
                            symbolSize: 20,
                            x: this.getX(xzX, 20, index, 1000),
                            y: this.getY(xzY, 20, index, 1000),
                        });
                    });
                }
                if (caseData.qzcsList && caseData.qzcsList.length > 0) {
                    caseData.qzcsList.forEach((item, index) => {
                        link.push({
                            source: '强制措施记录' + i,
                            target: this.formatter(item.qzcsName) + index + i,
                        });
                        datas.push({
                            name: this.formatter(item.qzcsName),
                            id: this.formatter(item.qzcsName) + index + i,
                            attributes: {
                                modularity_class: 5,
                            },
                            symbolSize: 20,
                            x: this.getX(qzX, 20, index, 500),
                            y: this.getY(qzY, 20, index, 500),
                        });
                    });
                }
                if (caseData.sswpList && caseData.sswpList.length > 0) {
                    caseData.sswpList.forEach((item, index) => {
                        link.push({
                            source: '随身物品' + i,
                            target: this.formatter(item.wpName) + index + i,
                        });
                        datas.push({
                            name: this.formatter(item.wpName),
                            id: this.formatter(item.wpName) + index + i,
                            attributes: {
                                modularity_class: 6,
                            },
                            symbolSize: 20,
                            x: this.getX(ssX, 30, index, 900),
                            y: this.getY(ssY, 30, index, 900),
                        });
                    });
                }
                ;
                if (caseData.sawpList && caseData.sawpList.length > 0) {
                    caseData.sawpList.forEach((item, index) => {
                        link.push({
                            source: '涉案物品' + i,
                            target: this.formatter(item.wpmc) + index + i,
                        });
                        datas.push({
                            name: this.formatter(item.wpmc),
                            id: this.formatter(item.wpmc) + index + i,
                            attributes: {
                                modularity_class: 7,
                            },
                            symbolSize: 20,
                            x: this.getX(saX, 20, index, 600),
                            y: this.getY(saY, 20, index, 600),
                        });
                    });
                }
                if (caseData.jzList && caseData.jzList.length > 0) {
                    caseData.jzList.forEach((item, index) => {
                        link.push({
                            source: '相关卷宗' + i,
                            target: this.formatter(item.jzmc) + index + i,
                        });
                        datas.push({
                            name: this.formatter(item.jzmc),
                            id: this.formatter(item.jzmc) + index + i,
                            attributes: {
                                modularity_class: 8,
                            },
                            symbolSize: 20,
                            x: this.getX(jzX, 20, index, 800),
                            y: this.getY(jzY, 20, index, 800),
                        });
                    });
                }
            }
        }
        let categories = [];
        for (let i = 0; i < 9; i++) {
            categories[i] = {
                name: i
            };
        }
        const categories2 = [                //节点分类的类目，可选。
            {
                name: '人员姓名',    //类目名称
            },
            {
                name: '案件名称',    //类目名称
            },
            {
                name: '历史入区信息',    //类目名称
            },
            {
                name: '同案人',    //类目名称
            },
            {
                name: '行政处罚记录',    //类目名称
            },
            {
                name: "强制措施记录",    //类目名称
            },
            {
                name: '随身物品',    //类目名称
            }, {
                name: '涉案物品',    //类目名称
            }, {
                name: '相关卷宗',    //类目名称
            },
        ];
        datas.forEach(function (node) {
            node.itemStyle = null;
            node.symbolSize /= 1.5;
            node.label = {
                normal: {
                    show: true,
                    formatter: '{b}',
                    textStyle: {
                        color: dark ? '#eee' : '#4D4D4D',
                        fontSize: node.attributes.modularity_class === 0 ? 18 :
                            node.attributes.modularity_class === 1 ? 14 : 12
                    },
                },
            };
            node.symbol = node.attributes.modularity_class === 0 ? `image://${user}` :
                node.attributes.modularity_class === 1 ? `image://${aj}` :
                    node.name === '同案人' ? `image://${tar}` :
                        node.name === "随身物品" || node.name === "涉案物品" ? `image://${wp}` :
                            node.name === "强制措施记录" ? `image://${qzcsjl}` :
                                node.name === "行政处罚记录" ? `image://${xzcfjl}` :
                                     node.name === "历史入区信息" ? `image://${rqjl}` :
                                        node.name === "相关卷宗" ? `image://${jzxx}` :
                                            "circle";
            node.category = node.attributes.modularity_class;
        });
        let option = {
            tooltip: {},
            legend: [{
                // selectedMode: 'single',
                data: categories2.map(function (a) {
                    return a.name;
                }),
                textStyle: {color: dark ? "#fff" : '#4D4D4D'},
            }],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            color: ['#495A85', '#497B85', '#A57971', '#A57971', '#A57971', '#A57971', '#A57971', '#A57971', '#A57971', '#A57971'],
            tooltip: {
                trigger: 'item',
                show: false,
                formatter: "{a}"
            },
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    data: datas,
                    links: link,
                    categories: categories2,
                    roam: true,
                    focusNodeAdjacency: true,
                    itemStyle: {
                        normal: {
                            borderColor: dark ? '#fff' : '#e6e6e6',
                            borderWidth: 1,
                            shadowBlur: 0,
                            shadowColor: 'rgba(0, 0, 0, 0)',
                        }
                    },
                    label: {
                        position: 'bottom',
                        formatter: '{b}',
                        textStyle: {
                            color: dark ? '#eee' : '#4D4D4D',
                        }
                    },
                    lineStyle: {
                        width: 2,
                        color: 'source',
                        curveness: -0.3
                    },
                    emphasis: {
                        lineStyle: {
                            width: 10
                        }
                    },
                }
            ]
        };

        echartTree.setOption(option);
    };
    // 获取关系图谱的实际高度
    getChartTreeHeight = (ajxx) => {
        let heightCount = ajxx && ajxx.length > 1 ? 800 : 600;
        // if (ajxx && ajxx.length > 0) {
        //     for (let i = 0; i < ajxx.length; i++) {
        //         const rq = ajxx[i].rqList ? ajxx[i].rqList.length : 0;
        //         const tar = ajxx[i].tarList ? ajxx[i].tarList.length : 0;
        //         const xzcf = ajxx[i].xzcfList ? ajxx[i].xzcfList.length : 0;
        //         const xscf = ajxx[i].qzcsList ? ajxx[i].qzcsList.length : 0;
        //         const sswp = ajxx[i].sswpList ? ajxx[i].sswpList.length : 0;
        //         const sawp = ajxx[i].sawpList ? ajxx[i].sawpList.length : 0;
        //         const jz = ajxx[i].jzList ? ajxx[i].jzList.length : 0;
        //         heightCount += (rq + tar + xzcf + xscf + sswp + sawp + jz) * 20 + 300;
        //     }
        // }
        return heightCount;
    };
    // 图表统计导出功能请求
    exprotService = (imagesBase, Data) => {
        let obj = {}, objArr = [];
        for (let a = 0; a < imagesBase.length; a++) {
            obj = {
                type: 'image',
                width: 6.3,
                base64: imagesBase[a],
            };
            objArr.push(obj);
        }
        this.props.dispatch({
            type: 'common/getExportEffect',
            payload: {
                docx_name: '人员档案分析图表统计导出' + Data.ryxx.zjhm,
                header: '人员档案分析',
                tiles: objArr,
            },
            callback: (data) => {
                if (data && data.result) {
                    window.location.href = `${configUrl.tbtjExportUrl}/down-docx/人员档案分析图表统计导出${Data.ryxx.zjhm}.docx`;
                }
            },
        });
    };
    // 图表统计导出功能参数集合
    addBase = (add,type) => {
        const {personData} = this.state;
        if(add){
            imgBase.push(add);
        }
        const ajxxLength = personData.ajxx ? personData.ajxx.length : 0;
        if ((imgBase.length === 3 + ajxxLength) || type) {
            this.exprotService(imgBase, personData);
        }
    };
    // 图表统计导出功能
    ExportStatistics = () => {
        const {personData} = this.state;
        this.setState({
            loading: true,
        });
        imgBase = [];
        const Nameryxx = `#Nameryxx${this.props.location.query.id}`;
        const Namegxtp = `#Namegxtp${this.props.location.query.id}`;
        const CardCharts = `#cardCharts${this.props.location.query.id}`;
        html2canvas(document.querySelector(Nameryxx)).then(canvasryxx => {
            this.addBase(canvasryxx.toDataURL().split('base64,')[1]);
            html2canvas(document.querySelector(Namegxtp)).then(canvasgxtp => {
                this.addBase(canvasgxtp.toDataURL().split('base64,')[1]);
                if (personData && personData.ajxx && personData.ajxx.length > 0) {
                    html2canvas(document.querySelector(CardCharts).getElementsByClassName('ant-card-head')[0]).then(canvashead => {
                        this.addBase(canvashead.toDataURL().split('base64,')[1]);
                        for (let a = 0; a < personData.ajxx.length; a++) {
                            document.querySelector(CardCharts).getElementsByClassName('NameShow')[a].style.display = 'none';
                            document.querySelector(CardCharts).getElementsByClassName('NameHide')[a].style.display = 'block';
                            html2canvas(document.querySelector(CardCharts).getElementsByClassName('NameHide')[a]).then(canvascontent => {
                                this.addBase(canvascontent.toDataURL().split('base64,')[1]);
                                document.querySelector(CardCharts).getElementsByClassName('NameShow')[a].style.display = 'block';
                                document.querySelector(CardCharts).getElementsByClassName('NameHide')[a].style.display = 'none';
                                this.setState({
                                    loading: false,
                                });
                            });
                        }
                    });
                } else {
                    if(document.querySelector(CardCharts)){
                        html2canvas(document.querySelector(CardCharts).getElementsByClassName('ant-card-head')[0]).then(canvashead => {
                            this.addBase(canvashead.toDataURL().split('base64,')[1]);
                            this.setState({
                                loading: false,
                            });
                        });
                    }else {
                        this.addBase('',true);
                        this.setState({
                            loading: false,
                        });
                    }
                }
            });
        });
    };

    render() {
        const {personData, loading} = this.state;
        let className = this.props.global&&this.props.global.dark ? styles.detailBoxScroll : styles.detailBoxScroll + ' ' + styles.detailBoxLight;
        let dark = this.props.global&&this.props.global.dark;
        return (
            <div>
                <Spin spinning={loading}>
                    <Card style={{margin:'16px 0'}}>
                        <Row gutter={{md: 8, lg: 24, xl: 48}}>
                            <Col>
                                <Button type='primary' style={{margin: '10px', float: 'left'}}
                                        onClick={() => this.ExportStatistics()}>导出</Button>
                            </Col>

                        </Row>
                    </Card>
                    <Card style={{height: autoheight() - 240 + 'px', marginTop: '12px'}} ref={'scroll'}
                          className={className}>
                        <div>
                            <div id={`Nameryxx${this.props.location.query.id}`} className={styles.borderBottom}>
                                <Card title={ <div
                                    style={{
                                        borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                        paddingLeft: 16,
                                    }}
                                >人员信息</div>} className={listStyles.cardCharts} bordered={false}>
                                    <div style={{padding: 16}}>
                                        <Row>
                                            <Col md={2} sm={24} style={{textAlign: 'right'}}>
                                                <div>
                                                    <img
                                                        src={personData && personData.ryxx && personData.ryxx.photo ? personData.ryxx.photo : this.props.global && this.props.global.dark ? nophoto : nophotoLight}
                                                        alt='暂无图片显示'
                                                        width='100'
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={22} sm={24} style={{paddingLeft: '24px'}}>
                                                <Row gutter={{md: 8, lg: 24, xl: 48}} style={{marginBottom: 24}}>
                                                    <Col md={4} sm={24}>
                                                        <div
                                                            className={styles.break}>姓名：{personData && personData.ryxx ? personData.ryxx.name : ''}</div>
                                                    </Col>
                                                    <Col md={4} sm={24}>
                                                        <div
                                                            className={styles.break}>年龄：{personData && personData.ryxx ? personData.ryxx.age : ''}</div>
                                                    </Col>
                                                    <Col md={4} sm={24}>
                                                        <div
                                                            className={styles.break}>性别：{personData && personData.ryxx ? personData.ryxx.sex : ''}</div>
                                                    </Col>
                                                    <Col md={6} sm={24}>
                                                        <div
                                                            className={styles.break}>证件号：{personData && personData.ryxx ? personData.ryxx.zjhm : ''}</div>
                                                    </Col>
                                                    <Col md={6} sm={24}>
                                                        <div
                                                            className={styles.break}>现阶段强制措施：{personData && personData.ryxx ? personData.ryxx.qzcsName : ''}</div>
                                                    </Col>
                                                </Row>
                                                <Row gutter={{md: 8, lg: 24, xl: 48}}
                                                     style={{marginBottom: '24px'}}>
                                                    <Col md={12} sm={24}>
                                                        <div
                                                            className={styles.break}>现住址：{personData && personData.ryxx.jtzz ? personData.ryxx.jtzz : ''}</div>
                                                    </Col>
                                                    <Col md={12} sm={24}>
                                                        <div
                                                            className={styles.break}>联系电话：{personData && personData.ryxx ? personData.ryxx.phone : ''}</div>
                                                    </Col>
                                                </Row>
                                                <div>
                                                    {personData && personData.qgsd ?
                                                        <span className={styles.bjhcTitle}>{personData.qgsd}</span>
                                                        :
                                                        ''
                                                    }
                                                    {personData && personData.qgwf ?
                                                        <span className={styles.bjhcTitle}>{personData.qgwf}</span>
                                                        :
                                                        ''
                                                    }
                                                    {personData && personData.qgzt ?
                                                        <span className={styles.bjhcTitle}>{personData.qgzt}</span>
                                                        :
                                                        ''
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </div>
                            <div id={`Namegxtp${this.props.location.query.id}`} className={styles.borderBottom}>
                                <Card title={ <div
                                    style={{
                                        borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                        paddingLeft: 16,
                                    }}
                                >关系图谱</div>} className={listStyles.cardCharts} bordered={false}>
                                    <div
                                        id={'ryRegulateTree' + this.state.res.xyr_sfzh}
                                        style={
                                            {
                                                height: this.getChartTreeHeight(personData.ajxx),
                                                width: '100%',
                                            }
                                        }
                                    />
                                </Card>
                            </div>
                          {personData.ajxx ?
                            (<Card title={ <div
                                style={{
                                    borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                    paddingLeft: 16,
                                }}
                            >涉案信息</div>} className={listStyles.cardCharts + ' ' + styles.saxx}
                                  id={`cardCharts${this.props.location.query.id}`}
                                  bordered={false}>
                                {
                                    personData.ajxx.map(item => (
                                        <PersonDetailTab
                                            SaWpdeatils={this.SaWpdeatils}
                                            IntoArea={this.IntoArea}
                                            openCaseDetail={this.openCaseDetail}
                                            openPersonDetail={this.openPersonDetail}
                                            JzDetail={this.JzDetail}
                                            {...this.props}
                                            caseData={item}
                                            key={item.ajbh}
                                            {...this.props}
                                        />
                                    ))
                                }
                            </Card>):null}
                        </div>
                    </Card>
                </Spin>
            </div>
        );
    }
}
