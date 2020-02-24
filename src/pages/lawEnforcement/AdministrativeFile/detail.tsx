/*
* AdministrativeCaseDocDetail.js 行政案件档案
* author：lyp
* 20190122
* */
import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, Button, Badge, Table, List, Tooltip, message, Anchor, Spin, Empty, Icon} from 'antd';
import html2canvas from 'html2canvas';
import styles from '../docDetail.less';
import liststyles from '../docListStyle.less';
import {autoheight, getQueryString, userAuthorityCode} from '../../../utils/utils';
import echarts from 'echarts'
import tree from 'echarts/lib/chart/tree';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
import {authorityIsTrue} from '../../../utils/authority';
import noList from "@/assets/viewData/noList.png";
import aj from "@/assets/common/aj.png";
import tar from "@/assets/common/tar.png";
import wp from "@/assets/common/wp.png";
import jzxx from "@/assets/common/jzxx.png";
import jqImg from "@/assets/common/jq.png";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";
import DetailShow from "@/components/Common/detailShow";

const {Link} = Anchor;
let echartTree;
let imgBase = [];

@connect(({XzCaseData, CaseData, AllDetail, global}) => ({
    XzCaseData, CaseData, AllDetail, global
}))


export default class AdministrativeCaseDocDetail extends PureComponent {
    constructor(props) {
        super(props);
        let res = this.props.location.query && this.props.location.query.record ? this.props.location.query.record : '';
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            current: 1, // 涉案物品默认在第一页
            jqcurrent: 1, // 警情信息默认在第一页
            jzcurrent: 1, // 卷宗信息默认在第一页
            gjcurrent: 1, // 告警信息默认在第一页
            trailLeft: '0',
            is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
            loading1: false, // 按钮状态，默认false没加载,true是点击后的加载状态
            caseDetails: null,
            TrackPaddingTop: '', // 初始状态的message的paddingtop;
            TrackPaddingBottom: '',// 初始状态的message的paddingbottom;
            TrackPaddingBottom1: '220px', // 初始状态的listStyle的paddingbottom;(TrackPaddingBottom下面的一个子集)
            open: '0', // 显示‘显示更多’还是‘收起更多’；
            colortrailleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
            colortrailright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
            // 督办模态框
            superviseVisibleModal: false,
            // 点击列表的督办显示的基本信息
            superviseWtlx: '',
            superviseZrdw: '',
            superviseZrr: '',
            superviseZrdwId: '',
            id: '',
            sfzh: '',
            // 问题判定的来源参数
            from: '',
            // 子系统的id
            systemId: '',
            AnchorShow: false,
            Anchor: false,
            afterScrollTop: 0,
            load: false,
            makeTableModalVisible: false, // 制表model
            RetrieveRecord: null,
            isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
            loading: false, // 默认详情页是否为加载状态
            first: true,
            res: res,
            link: '',
            isdc:false,
        };
    }

    componentDidMount() {
        this.caseDetailDatas(this.props.location.query.id);
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.location.pathname !== nextProps.pathname && this.state.link) {
        //     this.props.history.replace(`${this.props.location.pathname}?id=${this.state.res.ajbh}&record=${this.state.res}/${this.state.link}`);
        //     this.setState({
        //         link: ''
        //     });
        // }
        if (this.props.global.dark !== nextProps.global.dark) {
            if (this.state.caseDetails) {
                this.showEchart(this.state.caseDetails, nextProps.global.dark);
            }
        }
    }

    scrollHandler = () => {
        if (this.state.first) {
            let scroll = document.getElementById("scrollAdmin"+this.state.res.ajbh);
            if (scroll) {
                scroll.addEventListener("scroll", e => {
                    let afterScrollTop = e.target.scrollTop;
                    if (afterScrollTop > this.state.afterScrollTop) {
                        this.setState({
                            AnchorShow: true,
                            Anchor: true,
                        });
                    } else {
                        this.setState({
                            AnchorShow: false,
                            Anchor: true,
                        });
                    }
                    this.setState({
                        afterScrollTop: afterScrollTop,
                    });
                });
            }
            this.setState({
                first: false,
            });
        }
    };
    // 换行
    formatter = (val) => {
        let strs = val.split(''); //字符串数组
        let str = '';
        for (let i = 0, s; s = strs[i++];) { //遍历字符串数组
            str += s;
            if (!(i % 35)) str += '\n'; //按需要求余
        }
        return str;
    };
    // 获取警情内容长度
    getPoliceContentLength = (data) => {
        let jqLength = 0;
        if (data && data.length > 0) {
            jqLength = data.length;
            const jqContent = data[0].jjnr;
            if (jqContent && jqContent.length > 100) { // 当内容长度大于100时，增加高度
                jqLength = jqContent.length / 25;
            }
        }
        return jqLength;
    };
    // 获取关系图谱的实际高度
    getChartTreeHeight = (data) => {
        let heightCount = 460;
        // if (data) {
        //     const jq = this.getPoliceContentLength(data.jqxxList);
        //     const xyr = data.xyrList ? data.xyrList.length : 0;
        //     const sawp = data.sawpList ? data.sawpList.length : 0;
        //     const jz = data.jzList ? data.jzList.length : 0;
        //     heightCount += (jq + xyr + sawp + jz) * 20 + 140;
        //
        // }
        return heightCount;
    };
    getX = (x, d, idx, r) => {
        return x + Math.sin(d * idx) * r;
    }
    getY = (y, d, idx, r) => {
        return y - Math.cos(d * idx) * r;
    }
    // 脑图
    showEchart = (data, dark) => {
        let jq = [];
        let sar = [];
        let sawp = [];
        let jz = [];
        let datas = [                     //data就是node
            {
                name: data.ajmc,
                attributes: {
                    modularity_class: 0,
                },
                symbolSize: 40,
                x: -900,
                y: 350,
            }, {
                name: '卷宗',
                attributes: {
                    modularity_class: 4,
                },
                symbolSize: 30,
                x: -700,
                y: 450
            }, {
                name: '警情',
                attributes: {
                    modularity_class: 1,
                },
                symbolSize: 30,
                x: -700,
                y: 250
            }, {
                name: '涉案人员',
                attributes: {
                    modularity_class: 2,
                },
                symbolSize: 30,
                x: -1100,
                y: 300
            }, {
                name: '涉案物品',
                attributes: {
                    modularity_class: 3,
                },
                symbolSize: 30,
                x: -900,
                y: 150
            }
        ]
        let list = [];
        if (data.jqxxList && data.jqxxList.length > 0) {
            data.jqxxList.map((event, index) => {
                jq.push({
                    source: '警情',
                    target: (event.jjnr ? this.formatter(event.jjnr) : null) + index,
                });
                // console.log('list.indexOf(event.jjnr)',JSON.stringify(list).indexOf(this.formatter(event.jjnr)))
                list.push({
                    name: event.jjnr ? this.formatter(event.jjnr) : null,
                    id: (event.jjnr ? this.formatter(event.jjnr) : null) + index,
                    attributes: {
                        modularity_class: 1,
                    },
                    symbolSize: 20,
                    x: this.getX(-500, 45, index, 200),
                    y: this.getY(250, 45, index, 200),
                });
            });
        }
        if (data.xyrList && data.xyrList.length > 0) {
            data.xyrList.map((event, index) => {
                // const sartag=event.xszk_name&&event.xszk_name==='在逃'?(event.xszk_name):'';
                const sartag = event.xszk_name ? `(${event.xszk_name})` : '';
                sar.push({
                    source: '涉案人员',
                    target: (event.xyrName ? this.formatter(event.xyrName + sartag) : null) + index,
                });
                list.push(
                    {
                        name: event.xyrName ? this.formatter(event.xyrName + sartag) : null,
                        id: (event.xyrName ? this.formatter(event.xyrName + sartag) : null) + index,
                        attributes: {
                            modularity_class: 2,
                        },
                        symbolSize: 20,
                        x: this.getX(-1100, 20, index, 100),
                        y: this.getY(300, 20, index, 100),
                    }
                )
            });
        }
        if (data.sawpList && data.sawpList.length > 0) {
            data.sawpList.map((event, index) => {
                sawp.push({
                    source: '涉案物品',
                    target: (event.wpmc ? this.formatter(event.wpmc) : null) + index,
                });
                list.push(
                    {
                        name: event.wpmc ? this.formatter(event.wpmc) : null,
                        id: (event.wpmc ? this.formatter(event.wpmc) : null) + index,
                        attributes: {
                            modularity_class: 2,
                        },
                        symbolSize: 20,
                        x: this.getX(-900, 20, index, 80),
                        y: this.getY(150, 20, index, 80),
                    }
                )
            });
        }
        if (data.jzList && data.jzList.length > 0) {
            data.jzList.map((event, index) => {
                jz.push({
                    source: '卷宗',
                    target: (event.jzmc ? this.formatter(event.jzmc) : null) + index,
                })
                list.push(
                    {
                        name: event.jzmc ? this.formatter(event.jzmc) : null,
                        id: (event.jzmc ? this.formatter(event.jzmc) : null) + index,
                        attributes: {
                            modularity_class: 2,
                        },
                        symbolSize: 20,
                        x: this.getX(-700, 20, index, 70),
                        y: this.getY(450, 20, index, 70),
                    }
                )
            });
        }
        let link = [
            {
                source: data.ajmc,
                target: '卷宗'
            }, {
                source: data.ajmc,
                target: '警情'
            }, {
                source: data.ajmc,
                target: '涉案人员'
            }, {
                source: data.ajmc,
                target: '涉案物品'
            }, {
                source: data.ajmc,
                target: '卷宗'
            }
        ]
        let links = link.concat(jq).concat(sar).concat(sawp).concat(jz);
        echartTree = echarts.init(document.getElementById('RegulateTree' + this.props.location.query.id));
        echartTree.hideLoading();

        var categories = [];
        for (var i = 0; i < 9; i++) {
            categories[i] = {
                name: i
            };
        }
        const categories2 = [                //节点分类的类目，可选。
            {
                name: '案件名称',    //类目名称
            },
            {
                name: '警情',    //类目名称
            },
            {
                name: '涉案人员',    //类目名称
            },
            {
                name: "涉案物品",    //类目名称
            },
            {
                name: '卷宗',    //类目名称
            },
        ];
        let dataList = datas.concat(list);
        // console.log('dataList======>',dataList)
        dataList.forEach(function (node) {
            node.itemStyle = null;
            node.symbolSize /= 1.5;
            node.label = {
                normal: {
                    show: true,
                    formatter: '{b}',
                    textStyle: {
                        color: dark ? '#eee' : '#4D4D4D',
                        fontSize: node.attributes.modularity_class === 0 ? 16 :
                          node.name === '涉案人员' || node.name === "涉案物品" || node.name === "卷宗" || node.name === "警情" ? 14 : 12
                    },
                }
            };
            node.category = node.attributes.modularity_class;
            node.symbol = node.attributes.modularity_class === 0 ? `image://${aj}` :
                node.name === '涉案人员' ? `image://${tar}` :
                    node.name === "涉案物品" ? `image://${wp}` :
                        node.name === "卷宗" ? `image://${jzxx}` :
                            node.name === "警情" ? `image://${jqImg}` :
                                "circle";
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
            color: ['#52818c', '#A2A16C', '#5b6a87', '#a27970', '#6d9289', '#92687E'],
            tooltip: {
                trigger: 'item',
                show: false,
                formatter: "{a}"
            },
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    data: dataList,
                    links: links,
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
                        width: '2',
                        color: 'source',
                        curveness: 0.2
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
    }
    // 修改改变模态框状态 通过id 获取数据
    caseDetailDatas = (id) => {
        this.setState({
            load: true,
        });
        this.props.dispatch({
            type: 'XzCaseData/getXzAjxxXqById',
            payload: {
                system_id: id,
            },
            callback: (data) => {
                this.setState({
                    load: false,
                });
                if (data) {
                    this.setState({
                        caseDetails: data,
                    }, () => {
                        this.showEchart(data, this.props.global.dark);
                        // window.addEventListener("resize", echartTree.resize);
                    });
                }
            },

        });
    };

    // 图表统计导出功能请求
    exprotService = (imagesBase) => {
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
                docx_name: '行政案件档案分析图表统计导出',
                header: '行政案件档案分析',
                tiles: objArr,
            },
            callback: (data) => {
                if (data && data.result) {
                    window.location.href = `${configUrl.tbtjExportUrl}/down-docx/行政案件档案分析图表统计导出.docx`;
                }
            },
        });
    };
    // 图表统计导出功能参数集合
    addBase = (add) => {
        imgBase.push(add);
        if (imgBase.length === 7) {
            this.exprotService(imgBase);
        }
    };
    // 图表统计导出功能
    ExportStatistics = () => {
        this.setState({
            loading: true,
            isdc:!this.state.isdc,
        });
        imgBase = [];
        const Namegxtp = `#Namegxtp${this.props.location.query.id}`;
        const Namejqxx = `#Namejqxx${this.props.location.query.id}`;
        const Nameajxx = `#Nameajxx${this.props.location.query.id}`;
        const Nameajgj = `#Nameajgj${this.props.location.query.id}`;
        const Namesawp = `#Namesawp${this.props.location.query.id}`;
        const Namejzxx = `#Namejzxx${this.props.location.query.id}`;
        const Namegjxx = `#Namegjxx${this.props.location.query.id}`;
        html2canvas(document.querySelector(Namegxtp)).then(canvas1 => {
            this.addBase(canvas1.toDataURL().split('base64,')[1]);
            html2canvas(document.querySelector(Namejqxx)).then(canvas2 => {
                this.addBase(canvas2.toDataURL().split('base64,')[1]);
                html2canvas(document.querySelector(Nameajxx)).then(canvas3 => {
                    this.addBase(canvas3.toDataURL().split('base64,')[1]);
                    html2canvas(document.querySelector(Nameajgj)).then(canvas4 => {
                        this.addBase(canvas4.toDataURL().split('base64,')[1]);
                        html2canvas(document.querySelector(Namesawp)).then(canvas5 => {
                            this.addBase(canvas5.toDataURL().split('base64,')[1]);
                            html2canvas(document.querySelector(Namejzxx)).then(canvas6 => {
                                this.addBase(canvas6.toDataURL().split('base64,')[1]);
                                html2canvas(document.querySelector(Namegjxx)).then(canvas7 => {
                                    this.addBase(canvas7.toDataURL().split('base64,')[1]);
                                    this.setState({
                                        loading: false,
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    Topdetail() {
        const {caseDetails, isZb} = this.state;
        const menu = sessionStorage.getItem('authoMenuList');
        const menus = JSON.parse(menu);
        const dbmenu = [];
        for (let a = 0; a < menus.length; a++) {
            if (menus[a].name === '我的督办') {
                dbmenu.push(menus[a]);
            }
        }
        return (
            <Card style={{margin:'16px 0'}}>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col>
                        <span style={{float: 'left', margin: '10px'}}>
                            {
                                isZb ? <Button type="primary" style={{marginLeft: 8}}
                                               onClick={() => this.makeTable(caseDetails)}>制表</Button> : null
                            }
                            <Button type="primary" style={{marginLeft: 8}}
                                    onClick={() => this.ExportStatistics()}>导出</Button>
                        </span>
                    </Col>
                </Row>
            </Card>
        );
    }

    // 根据物品ID打开物品详细窗口
    openItemsDetail = (item) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/articlesInvolved/ArticlesData/itemDetail',
                query: {record: item, id: item.system_id},
            }),
        )
    };


    sawpCol(sawpList) {
        return (
            <List
                itemLayout="vertical"
                size="small"
                locale={{
                    emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                      description={'暂无数据'}/>
                }}
                pagination={sawpList.length > 0 ? {
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{
                        color: this.props.global && this.props.global.dark ? '#fff' : '#999'
                    }}>共 {total} 条记录
                        第 {this.state.current} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({current: page});
                    },
                } : false}
                dataSource={sawpList}
                className={styles.sawpListName}
                style={{color: '#faa'}}
                renderItem={item => (
                    <List.Item>
                        <div className={styles.colsImg}>
                            <div className={styles.sawpImg}>
                                <img width='70' height='70'
                                     src={item && item.imageList && item.imageList.length > 0 ? item.imageList[0].imageurl : 'images/nophoto.png'}/>
                            </div>
                            <div className={styles.sawpName}>
                                <div className={styles.sawpName1}>物品名称：<Tooltip
                                    overlayStyle={{wordBreak: 'break-all'}} title={item.wpmc}>{item.wpmc}</Tooltip>
                                </div>
                                <div className={styles.sawpName1}>物品种类：<Tooltip
                                    overlayStyle={{wordBreak: 'break-all'}}
                                    title={item.wpzlMc}>{item.wpzlMc}</Tooltip></div>
                            </div>
                            <div className={styles.sawpSee} onClick={() => this.openItemsDetail(item)}>在区情况
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        );
    };

    // 告警信息名称
    getWarningTitle = (wtflId) => {
        switch (wtflId) {
            case '203201':
                return '警情告警';
            case '203202':
                return '刑事案件告警';
            case '203203':
                return '办案区告警';
            case '203204':
                return '涉案物品告警';
            case '203205':
                return '行政案件告警';
            case '203206':
                return '卷宗告警';
        }
    };
    // 制表
    makeTable = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/Tabulation/Make',
                query: {id: record && record.ajbh ? record.ajbh : '1', record: record},
            }),
        );
    };

    gjxxCol(gjxxList) {
        return (
            <List
                itemLayout="vertical"
                size="small"
                locale={{
                    emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                      description={'暂无数据'}/>
                }}
                pagination={gjxxList.length > 0 ? {
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{
                        color: this.props.global && this.props.global.dark ? '#fff' : '#999'
                    }}>共 {total} 条记录
                        第 {this.state.gjcurrent} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({gjcurrent: page});
                    },
                } : false}
                dataSource={gjxxList}
                className={styles.sawpListName}
                style={{color: '#faa'}}
                renderItem={item => (
                    <List.Item>
                        <div className={styles.colsImg} style={{marginRight: 16}}>
                            <div className={styles.gzxxTitle}
                                 style={{borderTopColor: '#FF0000'}}>{this.getWarningTitle(item.wtfl_id)}</div>
                            <div className={styles.gjxxName}>
                                <div className={styles.sawpName1}>问题类型：<Tooltip
                                    overlayStyle={{wordBreak: 'break-all'}}
                                    title={item.wtlx_mc}>{item.wtlx_mc}</Tooltip></div>
                                <div className={styles.sawpName1}>告警时间：<Tooltip
                                    overlayStyle={{wordBreak: 'break-all'}} title={item.gjsj}>{item.gjsj}</Tooltip>
                                </div>
                                <div className={styles.sawpName1}>产生方式：<Tooltip
                                    overlayStyle={{wordBreak: 'break-all'}} title={item.fxfs}>{item.fxfs}</Tooltip>
                                </div>
                            </div>
                            <div className={styles.sawpSee} onClick={() => this.openGjxxDetail(item)}>查看</div>
                        </div>
                    </List.Item>
                )}
            />
        );
    }

    openGjxxDetail = (item) => {
        if (item.wtfl_id === '203201') {//警情告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/receivePolice/AlarmPolice/unpoliceDetail',
                    query: {record: item, id: item.id, wtid: item.wtid},
                }),
            )
        } else if (item.wtfl_id === '203202') {//刑事案件告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                    query: {record: item, id: item.wtid, system_id: item.system_id},
                }),
            )
        } else if (item.wtfl_id === '203203') {//人员在区告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/handlingArea/AreaPolice/UnareaDetail',
                    query: {record: item, id: item.wtid, baqId: item.id},
                }),
            );
        } else if (item.wtfl_id === '203204') {//涉案物品告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
                    query: {record: item, id: item.wtid, system_id: item.system_id},
                }),
            )

        } else if (item.wtfl_id === '203205') {//行政案件告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
                    query: {record: item, id: item.wtid, system_id: item.system_id},
                }),
            )
        } else if (item.wtfl_id === '203206') {//卷宗告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
                    query: {record: item, id: item.id, wtid: item.wtid, dossierId: item.system_id},
                }),
            );
        }
    };
    jqDetail = (record, id) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/receivePolice/AlarmData/policeDetail',
                query: {record: record, id: id},
            }),
        )
    };
    JzDetail = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/dossierPolice/DossierData/DossierDetail',
                query: {record: record, id: record.dossier_id},
            }),
        );
    };

    renderDetail() {
        const {caseDetails, loading} = this.state;
        const status = ['否', '是'];
        const statusMap = ['default', 'success'];
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayoutInName = {sm: 24, md: 5, xl: 5};
        const colLayoutInData = {sm: 24, md: 19, xl: 19};
        const JqColumns = [
            {
                title: '接警来源',
                dataIndex: 'jjly_mc',
                width:280,
            },
            {
                title: '接警时间',
                dataIndex: 'jjsj',
            },
            {
                title: '管辖单位',
                dataIndex: 'jjdw',
            },
{
                title: '接警人',
                dataIndex: 'jjr',
            },
            {
                title: '处警单位',
                dataIndex: 'cjdw',
            },
            {
                title: '处警人',
                dataIndex: 'cjr',
            },
            {
                title: '报案人',
                dataIndex: 'bar',
            },
            {
                title: '是否受案',
                dataIndex: 'is_sa',
                render(text) {
                    return <span style={{color:statusMap[text] === 'success' ? '#27D427':'#c41a1a'}}>{status[text]}</span>;
                },
            },
            {
                title: '操作',
                width: 50,
                render: (record) => (
                    <div>
                        <a onClick={() => this.jqDetail(record, record.id)}>详情</a>
                    </div>
                ),
  },
        ];
        const JzColumns = [
            {
                title: '卷宗名称',
                dataIndex: 'jzmc',
  },
            {
                title: '卷宗类别',
                dataIndex: 'jzlb_mc',
  },
            {
                title: '存储状态',
                dataIndex: 'cczt_mc',
  },
            {
                title: '卷宗页数',
                dataIndex: 'jzys',
  },
            {
                title: '电子化',
                dataIndex: 'is_gldzj',
  },
            {
                title: '操作',
                width: 50,
                render: (record) => (
                    <div>
                        <a onClick={() => this.JzDetail(record)}>查看</a>
                    </div>
                ),
  },
        ];
        let className = this.props.global && this.props.global.dark ? styles.detailBoxScroll : styles.detailBoxScroll + ' ' + styles.detailBoxLight;
        let dark = this.props.global&&this.props.global.dark;
        return (
            <Card style={{height: autoheight() - 240 + 'px', marginTop: '12px'}}
                onScrollCapture={this.scrollHandler}
                  id={'scrollAdmin'+this.state.res.ajbh}
                  className={className}>
                <Spin spinning={loading}>
                    <div>
                        <div id={`Namegxtp${this.props.location.query.id}`} className={styles.borderBottom}>
                            <Card title={ <div
                                style={{
                                    borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                    paddingLeft: 16,
                                }}
                            >关系图谱</div>} className={liststyles.cardCharts} bordered={false}
                                  id={this.props.location.query.id + 'gxtp'}>
                                <Spin spinning={this.state.load}>
                                    <div
                                        id={'RegulateTree' + this.props.location.query.id}
                                        style={
                                            {
                                                height: this.getChartTreeHeight(caseDetails),
                                                width: '100%',
                                            }
                                        }
                                    />
                                </Spin>
                            </Card>
                        </div>
                        <div id={`Namejqxx${this.props.location.query.id}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.props.location.query.id + 'jqxx'}><span
                                style={{
                                    borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                    paddingLeft: 16,
                                }}
                            >警情信息</span></div>
                            <div className={styles.tablemessage} style={{marginBottom: '24px', padding: '24px'}}>
                                <Table
                                    bordered
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{
                                                color: this.props.global && this.props.global.dark ? '#fff' : '#999'
                                            }}>共 {total} 条记录
                                            第 {this.state.jqcurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({jqcurrent: page});
  },
                                    }}
                                    locale={{
                                        emptyText: <Empty
                                            image={this.props.global && this.props.global.dark ? noList : noListLight}
                                            description={'暂无数据'}/>
                                    }}
                                    dataSource={caseDetails ? caseDetails.jqxxList : []}
                                    columns={JqColumns}
                                />
                            </div>
                        </div>
                        <div id={`Nameajxx${this.props.location.query.id}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.props.location.query.id + 'ajxx'}>
                                 <span
                                     style={{
                                         borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                         paddingLeft: 16,
                                     }}
                                 >
                                    案件信息
                                </span>
                            </div>
                            <div className={styles.message} style={{padding: '24px'}}>
                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件编号：</div>
                                        <div className={liststyles.Indextail}>
                                            {caseDetails && caseDetails.ajbh ? caseDetails.ajbh : ''}
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件名称：</div>
                                        <div className={liststyles.Indextail}>
                                            {caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>是否延期：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.sfyq ? (caseDetails.sfyq === '1' ? '已延期至60日' : '否') : '否'}</div>
                                    </Col>

                                </Row>
                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案发时段：</div>
                                        <div className={liststyles.Indextail}>
                                            {caseDetails && caseDetails.fasj_sx && caseDetails.fasj_xx ? caseDetails.fasj_sx + '~' + caseDetails.fasj_xx : ''}
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案发地点：</div>
                                        <div className={liststyles.Indextail}>
                                            {caseDetails && caseDetails.fadxz ? caseDetails.fadxz : ''}
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={24} sm={24}>
                                        <div className={liststyles.Indexfrom}>简要案情：</div>
                                        <DetailShow isdc={this.state.isdc} word={caseDetails && caseDetails.ajjj ? caseDetails.ajjj : ''} {...this.props}/>
                                    </Col>
                                </Row>

                                {caseDetails && caseDetails.ajzt ?
                                    <div className={styles.ajlxBg}>
                                        <Card title={'案件流程'} style={{width: '100%',marginTop:20}}>
                                            {/*{this.ajlc(caseDetails,superveWidth)}*/}
                                            <CaseModalStep
                                                caseDetails={caseDetails}
                                                {...this.props}
                                            />
                                        </Card>
                                    </div>
                                    :
                                    ''
                                }

                            </div>
                        </div>
                        {caseDetails && caseDetails.ajzt ?
                            <div id={`Nameajgj${this.props.location.query.id}`} className={styles.borderBottom}>
                                <div className={styles.title} id={this.props.location.query.id + 'ajgj'}><span
                                    style={{
                                        borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                        paddingLeft: 16,
                                    }}
                                >案件轨迹</span></div>
                                <CaseModalTrail
                                    {...this.props}
                                    caseDetails={caseDetails}
                                    ly='档案'
                                    from='行政'
                                />
                            </div>
                            :
                            ''
                        }
                        <div id={`Namesawp${this.props.location.query.id}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.props.location.query.id + 'sawp'}><span
                                style={{
                                    borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                    paddingLeft: 16,
                                }}
                            >涉案物品</span></div>
                            <div className={styles.tablemessage}>
                                <div style={{padding: '24px 0'}}>
                                    {this.sawpCol(caseDetails && caseDetails.sawpList ? caseDetails.sawpList : [])}
                                </div>
                            </div>
                        </div>
                        <div id={`Namejzxx${this.props.location.query.id}`} className={styles.borderBottom}>
                            <Card title={ <div
                                style={{
                                    borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                    paddingLeft: 16,
                                }}
                            >卷宗信息</div>} className={liststyles.card} bordered={false}
                                  id={this.props.location.query.id + 'jzxx'}>
                                <Table
                                    bordered
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{
                                                color: this.props.global && this.props.global.dark ? '#fff' : '#999'
                                            }}>共 {total} 条记录
                                            第 {this.state.jzcurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({jzcurrent: page});
                                        },
                                    }}
                                    locale={{
                                        emptyText: <Empty
                                            image={this.props.global && this.props.global.dark ? noList : noListLight}
                                            description={'暂无数据'}/>
                                    }}
                                    dataSource={caseDetails ? caseDetails.jzList : []}
                                    columns={JzColumns}

                                />
                            </Card>
                        </div>
                        <div id={`Namegjxx${this.props.location.query.id}`} className={styles.borderBottom}>
                            <Card title={ <div
                                style={{
                                    borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                    paddingLeft: 16,
                                }}
                            >告警信息</div>} className={liststyles.card+' '+liststyles.cardLast} bordered={false}
                                  id={this.props.location.query.id + 'gjxx'}>
                                <div>
                                    {this.gjxxCol(caseDetails && caseDetails.problemList ? caseDetails.problemList : [])}
                                </div>
                            </Card>
                        </div>
                    </div>
                </Spin>
            </Card>
        );
    }

    goLink = (link) => {
        this.setState({
            link: link
        });
    }

    render() {
        const {makeTableModalVisible, superviseVisibleModal} = this.state;
        return (
            <div>
                <div>
                    {this.Topdetail()}
                </div>
                <div>
                    {this.renderDetail()}
                </div>

                <div className={styles.anchorBox}>
                    <Anchor
                        getContainer={() => document.querySelector('#scrollAdmin'+this.state.res.ajbh)}
                        className={!(this.state.Anchor && this.state.AnchorShow) ? styles.AnchorHide : this.state.AnchorShow ? styles.fadeBoxIn : styles.fadeBoxOut}
                        offsetTop={0} onChange={this.goLink}>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}gxtp`}
                            title="关系图谱"/>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}jqxx`}
                            title="警情信息"/>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}ajxx`}
                            title="案件信息"/>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}ajgj`}
                            title="案件轨迹"/>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}sawp`}
                            title="涉案物品"/>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}jzxx`}
                            title="卷宗信息"/>
                        <Link
                            href={`${location.hash}#${this.state.res.ajbh}gjxx`}
                            title="告警信息"/>
                    </Anchor>
                </div>
            </div>
        );
    }

}
