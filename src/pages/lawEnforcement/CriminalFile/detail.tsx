/*
* CriminalCaseDocDetail.js 刑事案件档案
* author：lyp
* 20190122
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row, Col, Form, Card, Steps, Popover, Button,
    Menu,
    Dropdown,
    Badge,
    Timeline,
    Table,
    Divider, Select, Icon, Avatar, List, Tooltip, Input, message, Pagination, Anchor, Spin, Empty,
} from 'antd';
import html2canvas from 'html2canvas';
import echarts from 'echarts'
import tree from 'echarts/lib/chart/tree';
import styles from '../docDetail.less';
import liststyles from '../docListStyle.less';
import { autoheight, getQueryString, tableList, userAuthorityCode } from '../../../utils/utils';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
import RetrieveModal from '../../../components/ShareModal/RetrieveModal';
import { authorityIsTrue } from '../../../utils/authority';
import noList from "@/assets/viewData/noList.png";
import user from "@/assets/common/userPerson.png";
import aj from "@/assets/common/aj.png";
import tar from "@/assets/common/tar.png";
import wp from "@/assets/common/wp.png";
import jzxx from "@/assets/common/jzxx.png";
import jqImg from "@/assets/common/jq.png";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";

const FormItem = Form.Item;
const { Link } = Anchor;
const { Step } = Steps;
let echartTree;
let imgBase = [];

@connect(({ CaseData, MySuperviseData, AllDetail,global }) => ({
    CaseData, MySuperviseData, AllDetail,global
}))


export default class CriminalCaseDocDetail extends PureComponent {
    constructor(props) {
        super(props);
        let res = this.props.location.query&&this.props.location.query.record ? this.props.location.query.record : '';
        if(typeof res == 'string'){
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
            open: '0', // 显示‘显示更多’还是‘收起更多’,默认显示更多；
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
            sabar: '',
            AnchorShow: false,
            Anchor: false,
            afterScrollTop: 0,
            load: false,
            makeTableModalVisible: false, // 制表model
            RetrieveRecord: null,
            RetrieveVisible: false,
            isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
            isTb: authorityIsTrue(userAuthorityCode.TUIBU), // 退补权限
            loading: false, // 默认详情页是否为加载状态
            first:true,
            path:this.props.location.pathname,
            res:res,
            link:'',
        };
    }

    componentDidMount() {
        this.caseDetailDatas(this.props.location.query.id);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.history.location.query.isReset){
            if(nextProps.history.location.pathname === this.state.path){
                this.refreshCaseDetail();
                this.props.history.replace(`${nextProps.history.location.pathname}?id=${nextProps.history.location.query.id}&record=${nextProps.history.location.query.record}`);
            }
        }
        if(this.props.location.pathname!==nextProps.pathname&&this.state.link){
            this.props.history.replace(`${this.props.location.pathname}?id=${this.state.res.ajbh}&record=${this.state.res}/${this.state.link}`);
            this.setState({
                link:''
            });
        }
        if(this.props.global.dark !== nextProps.global.dark){
            if(this.state.caseDetails){
                this.showEchart(this.state.caseDetails,nextProps.global.dark);
            }
        }
    }

    scrollHandler = () => {
        if(this.state.first){
            let scroll = document.getElementById("scroll");
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
                first:false,
            });
        }
    };
//换行
    formatter = (val) => {
        let strs = val.split(''); //字符串数组
        let str = '';
        for (let i = 0, s; s = strs[i++];) { //遍历字符串数组
            str += s;
            if (!(i % 35)) str += '\n'; //按需要求余
        }
        return str;
    };
    getX = (x,d,idx,r) =>{
        return x + Math.sin(d*idx) * r;
    }
    getY = (y,d,idx,r) =>{
        return y - Math.cos(d*idx) * r;
    }
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
        //
        //     const xyr = data.xyrList ? data.xyrList.length : 0;
        //     const sawp = data.sawpList ? data.sawpList.length : 0;
        //     const jz = data.jzList ? data.jzList.length : 0;
        //     heightCount += (jq + xyr + sawp + jz) * 20 + 140;
        // }
        return heightCount;
    };
    showEchart = (data,dark) =>{
        let jq = [];
        let sar = [];
        let sawp = [];
        let jz = [];
        let datas = [                     //data就是node
            {
                name: data.ajmc,
                attributes:{
                    modularity_class:0,
                },
                symbolSize: 40,
                x: -900,
                y: 350,
            }, {
                name: '卷宗',
                attributes:{
                    modularity_class:4,
                },
                symbolSize: 30,
                x: -700,
                y: 450
            }, {
                name: '警情',
                attributes:{
                    modularity_class:1,
                },
                symbolSize: 30,
                x: -500,
                y: 250
            }, {
                name: '涉案人员',
                attributes:{
                    modularity_class:2,
                },
                symbolSize: 30,
                x: -1100,
                y: 300
            }, {
                name: '涉案物品',
                attributes:{
                    modularity_class:3,
                },
                symbolSize: 30,
                x: -900,
                y: 150
            }
        ]
        let list = [];
        if (data.jqxxList && data.jqxxList.length > 0) {
            data.jqxxList.map((event,index) => {
                jq.push({
                    source: '警情',
                    target: (event.jjnr ? this.formatter(event.jjnr):'')+ index,
                });
                list.push({
                    name: event.jjnr ? this.formatter(event.jjnr) : null,
                    id:(event.jjnr ? this.formatter(event.jjnr):'')+ index,
                    attributes:{
                        modularity_class:1,
                    },
                    symbolSize: 20,
                    x: this.getX(-500,45,index,200),
                    y: this.getY(250,45,index,200),
                });
            });
        }
        if (data.xyrList && data.xyrList.length > 0) {
            data.xyrList.map((event,index) => {
                // const sartag=event.xszk_name&&event.xszk_name==='在逃'?(event.xszk_name):'';
                const sartag = event.xszk_name ? `(${event.xszk_name})` : '';
                sar.push({
                    source: '涉案人员',
                    target: (event.xyrName ? this.formatter(event.xyrName + sartag) : null)+index,
                });
                list.push(
                    {
                        name: event.xyrName ? this.formatter(event.xyrName + sartag) : null,
                        id: (event.xyrName ? this.formatter(event.xyrName + sartag) : null)+index,
                        attributes:{
                            modularity_class:2,
                        },
                        symbolSize: 20,
                        x: this.getX(-1100,20,index,100),
                        y: this.getY(300,20,index,100),
                    }
                )
            });
        }
        if (data.sawpList && data.sawpList.length > 0) {
            data.sawpList.map((event,index) => {
                sawp.push({
                    source: '涉案物品',
                    target: (event.wpmc ? this.formatter(event.wpmc) : null)+index,
                });
                list.push(
                    {
                        name: event.wpmc ? this.formatter(event.wpmc) : null,
                        id:(event.wpmc ? this.formatter(event.wpmc) : null)+index,
                        attributes:{
                            modularity_class:2,
                        },
                        symbolSize: 20,
                        x: this.getX(-900,20,index,80),
                        y: this.getY(150,20,index,80),
                    }
                )
            });
        }
        if (data.jzList && data.jzList.length > 0) {
            data.jzList.map((event,index) => {
                jz.push({
                    source: '卷宗',
                    target: (event.jzmc ? this.formatter(event.jzmc) : null)+index,
                })
                list.push(
                    {
                        name: event.jzmc ? this.formatter(event.jzmc) : null,
                        id:(event.jzmc ? this.formatter(event.jzmc) : null)+index,
                        attributes:{
                            modularity_class:2,
                        },
                        symbolSize: 20,
                        x: this.getX(-700,20,index,70),
                        y: this.getY(450,20,index,70),
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
        echartTree = echarts.init(document.getElementById('RegulateTree' + this.state.res.ajbh));
        echartTree.hideLoading();

        let categories = [];
        for (let i = 0; i < 9; i++) {
            categories[i] = {
                name: i
            };
        }
        const categories2 =[                //节点分类的类目，可选。
            {
                name: '案件名称',    //类目名称
            },
            {
                name: '警情',    //类目名称
            },
            {
                name:  '涉案人员',    //类目名称
            },
            {
                name: "涉案物品",    //类目名称
            },
            {
                name: '卷宗',    //类目名称
            },
        ];
        let dataList = datas.concat(list);
        dataList.forEach(function (node) {
            node.itemStyle = null;
            node.symbolSize /= 1.5;
            node.label = {
                normal: {
                    show: true,
                    formatter: '{b}'
                }
            };
            node.category = node.attributes.modularity_class;
            node.symbol= node.attributes.modularity_class===0 ? `image://${aj}` :
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
                textStyle: { color: dark ? "#fff" : '#4D4D4D' },
            }],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            color:['#52818c','#A2A16C','#5b6a87','#a27970','#6d9289','#92687E'],
            tooltip : {
                trigger: 'item',
                show:false,
                formatter: "{a}"
            },
            series : [
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
                            color: dark ?  '#eee' : '#4D4D4D',
                        }
                    },
                    lineStyle: {
                        width : '2',
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
//修改改变模态框状态 通过id 获取数据
    caseDetailDatas = (id) => {
        this.setState({
            load: true,
        });
        this.props.dispatch({
            type: 'CaseData/getAjxxXqById',
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
                        this.showEchart(data,this.props.global.dark);
                        // window.addEventListener("resize", echartTree.resize);
                    });
                }
            },
        });

    };
// 根据物品案件编号和身份证号打开人员档案窗口
    openPersonDetail = (record,idcard, xyrName, xyrId) => {
        if (idcard && xyrName && xyrId) {
            record.xyr_sfzh = idcard;
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/lawEnforcement/PersonFile/Detail',
                    query: { id: idcard, record: record},
                }),
            );
        } else {
            message.error('该人员暂无人员档案');
        }
    };

    // 制表
    makeTable = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/Tabulation/Make',
                query: { id: record && record.ajbh ? record.ajbh : '1', record: record },
            }),
        );
    };
    // 退补
    saveRetrieve = (res, flag) => {
        this.props.dispatch({
            type: 'CaseData/caseRetrieveFetch',
            payload: {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    ajbh: res.system_id,
                },
            },
            callback: (data) => {
                if (data && data.list.length > 0 && data.list[0].tbrq2 && data.list[0].tbyy2) {
                    message.warning('该数据已完成退补功能');
                    this.refreshCaseDetail();
                } else {
                    let reson = data.list[0];
                    reson.url = this.state.path;
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/Retrieve',
                            query: { id: reson && reson.ajbh ? reson.ajbh : '1', record: reson, isDetail: true },//如果详情跳转isDetail为true
                        }),
                    );
                }
            },
        });
    };
    // 退补设置成功或取消退补
    RetrieveHandleCancel = (e) => {
        this.setState({
            RetrieveVisible: false,
        });
    };
    // 刷新详情
    refreshCaseDetail = () => {
        this.caseDetailDatas(this.state.res.ajbh);
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
                docx_name: '刑事案件档案分析图表统计导出',
                header: '刑事案件档案分析',
                tiles: objArr,
            },
            callback: (data) => {
                if (data && data.result) {
                    window.location.href = `${configUrl.tbtjExportUrl}/down-docx/刑事案件档案分析图表统计导出.docx`;
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
        });
        imgBase = [];
        const Namegxtp = `#Namegxtp${this.state.res.ajbh}`;
        const Namejqxx = `#Namejqxx${this.state.res.ajbh}`;
        const Nameajxx = `#Nameajxx${this.state.res.ajbh}`;
        const Nameajgj = `#Nameajgj${this.state.res.ajbh}`;
        const Namesawp = `#Namesawp${this.state.res.ajbh}`;
        const Namejzxx = `#Namejzxx${this.state.res.ajbh}`;
        const Namegjxx = `#Namegjxx${this.state.res.ajbh}`;
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
        const { caseDetails, isZb, isTb } = this.state;
        const menu = sessionStorage.getItem('authoMenuList');
        const menus = JSON.parse(menu);
        const dbmenu = [];
        for (let a = 0; a < menus.length; a++) {
            if (menus[a].name === '我的督办') {
                dbmenu.push(menus[a]);
            }
        }
        return (
                <Card>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={8} sm={24}>
                            <span style={{ margin: '16px', display: 'block' }}>刑事案件档案详情</span>
                        </Col>
                        <Col>
                      <span style={{ float: 'right', margin: '12px 16px 12px 0' }}>
                          {
                              caseDetails ? (
                                  <span>
                                      {
                                          isZb ? <Button type="primary" style={{ marginLeft: 8 }}
                                                         onClick={() => this.makeTable(caseDetails)}>制表</Button> : null
                                      }
                                      { // 案件状态为移送才能退补
                                          caseDetails.ajzt === '结案' ||  !isTb || caseDetails.qsrq === '' || (caseDetails.tbrq2 && caseDetails.tbyy2) ? null : (
                                              <Button type="primary" style={{ marginLeft: 8 }}
                                                      onClick={() => this.saveRetrieve(caseDetails, true)}>退补</Button>
                                          )
                                      }
                                      <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.ExportStatistics()}>导出</Button>
                                  </span>
                              ) : null
                          }

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
                query: { record:item,id: item.system_id },
            }),
        )
    };

    extraBottomTitle(text, caseDetails) {
        return (
            <div className={styles.personFiles}>
                <div className={styles.TopPersonFiles}>
                    <Row>
                        <Col md={24} sm={24} style={{ paddingLeft: '12px' }}>
                            <Row style={{ textAlign: 'left', padding: '5px 0' }}>
                                <Col md={18} sm={24}>
                                    姓名：{text.xyrName}
                                </Col>
                                <Col md={6} sm={24}>
                                    <a onClick={() => this.openPersonDetail(text,text.sfzh, text.xyrName, text.xyrId)}>人员档案</a>
                                </Col>
                            </Row>
                            <div style={{ textAlign: 'left', padding: '5px 0' }}>
                                性别：{text.sex}
                            </div>
                            <div className={styles.CdCard}>
                                证件号：{text.sfzh}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/*<div className={styles.sawpSee} onClick={() => this.openPersonDetail(text.sfzh, text.ajbh)}>人员档案</div>*/}
            </div>
        );
    };

    sawpCol(sawpList) {
        return (
            <List
                itemLayout="vertical"
                size="small"
                pagination={sawpList.length > 0 ? {
                    size: 'small',
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{ position: 'absolute', left: '12px',color:this.props.global&&this.props.global.dark ? '#fff':'#999' }}>共 {total} 条记录
                        第 {this.state.current} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({ current: page });
                    },
                } : false}
                dataSource={sawpList}
                className={styles.sawpListName}
                style={{ color: '#faa' }}
                locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                renderItem={item => (
                    <List.Item>
                        <div className={styles.colsImg}>
                            <div className={styles.sawpImg}>
                                <img width='70' height='70'
                                     src={item && item.imageList && item.imageList.length > 0 ? item.imageList[0].imageurl : 'images/nophoto.png'}/>
                            </div>
                            <div className={styles.sawpName}>
                                <div className={styles.sawpName1}>物品名称：<Tooltip
                                    overlayStyle={{ wordBreak: 'break-all' }} title={item.wpmc}>{item.wpmc}</Tooltip>
                                </div>
                                <div className={styles.sawpName1}>物品种类：<Tooltip
                                    overlayStyle={{ wordBreak: 'break-all' }}
                                    title={item.wpzlMc}>{item.wpzlMc}</Tooltip></div>
                            </div>
                            <div className={styles.sawpSee} onClick={() => this.openItemsDetail(item,item.system_id)}>查看
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        );
    }

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

    gjxxCol(gjxxList) {
        return (
            <List
                itemLayout="vertical"
                size="small"
                pagination={gjxxList.length > 0 ? {
                    size: 'small',
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{ position: 'absolute', left: '12px',color:this.props.global&&this.props.global.dark ? '#fff':'#999' }}>共 {total} 条记录
                        第 {this.state.gjcurrent} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({ gjcurrent: page });
                    },
                } : false}
                locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                dataSource={gjxxList}
                className={styles.sawpListName}
                style={{ color: '#faa' }}
                renderItem={item => (
                    <List.Item>
                        <div className={styles.colsImg} style={{marginRight:16}}>
                            <div className={styles.gzxxTitle}
                                 style={{ borderTopColor: '#FF0000' }}>{this.getWarningTitle(item.wtfl_id)}</div>
                            <div className={styles.gjxxName}>
                                <div className={styles.sawpName1}>问题类型：<Tooltip
                                    overlayStyle={{ wordBreak: 'break-all' }}
                                    title={item.wtlx_mc}>{item.wtlx_mc}</Tooltip></div>
                                <div className={styles.sawpName1}>告警时间：<Tooltip
                                    overlayStyle={{ wordBreak: 'break-all' }} title={item.gjsj}>{item.gjsj}</Tooltip>
                                </div>
                                <div className={styles.sawpName1}>产生方式：<Tooltip
                                    overlayStyle={{ wordBreak: 'break-all' }} title={item.fxfs}>{item.fxfs}</Tooltip>
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
                    query: { record:item,id: item.id,wtid:item.wtid},
                }),
            )
        } else if (item.wtfl_id === '203202') {//刑事案件告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                    query: { record:item,id: item.wtid,system_id:item.system_id },
                }),
            )
        } else if (item.wtfl_id === '203203') {//人员在区告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/handlingArea/AreaPolice/UnareaDetail',
                    query: { record:item,id: item.wtid,baqId:item.id},
                }),
            );
        } else if (item.wtfl_id === '203204') {//涉案物品告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
                    query: { record:item,id: item.wtid,system_id:item.system_id },
                }),
            )

        } else if (item.wtfl_id === '203205') {//行政案件告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
                    query: { record:item,id: item.wtid,system_id:item.system_id },
                }),
            )
        } else if (item.wtfl_id === '203206') {//卷宗告警详情
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
                    query: { record:item,id: item.id, wtid:item.wtid,dossierId:item.system_id},
                }),
            );
        }
    };
    jqDetail = (record,id) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/receivePolice/AlarmData/policeDetail',
                query: { record:record, id: id },
            }),
        )
    };
    JzDetail = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/dossierPolice/DossierData/DossierDetail',
                query: { record:record,id: record.dossier_id},
            }),
        );
    };

    renderDetail() {
        const { caseDetails, loading } = this.state;
        const rowLayout = { md: 8, xl: 24, xxl: 48 };
        const status = ['否', '是'];
        const statusMap = ['default', 'success'];
        const JqColumns = [
            {
                title: '接警来源',
                dataIndex: 'jjly_mc',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={10} tooltip>{text}</Ellipsis> : ''
                    );
                },
            },
            {
                title: '接警时间',
                dataIndex: 'jjsj',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={20} tooltip>{text}</Ellipsis> : ''
                    );
                },
            },
            {
                title: '管辖单位',
                dataIndex: 'jjdw',
                render: (text) => {
                    if (text) {
                        let str = '';
                        const strArry = text.split(',');
                        if (strArry.length > 0) {
                            str = strArry[strArry.length - 1];
                            return (
                                <Ellipsis length={20} tooltip>{str}</Ellipsis>
                            );
                        }
                        return str;
                    }
                    return '';
                },
            },
            {
                title: '接警人',
                dataIndex: 'jjr',
                render: (text) => {
                    if (text) {
                        let str = '';
                        const strArry = text.split(',');
                        if (strArry.length > 0) {
                            str = strArry[strArry.length - 1];
                            return (
                                <Ellipsis length={20} tooltip>{str}</Ellipsis>
                            );
                        }
                        return str;
                    }
                    return '';
                },
            },
            {
                title: '处警单位',
                dataIndex: 'cjdw',
                render: (text) => {
                    if (text) {
                        let str = '';
                        const strArry = text.split(',');
                        if (strArry.length > 0) {
                            str = strArry[strArry.length - 1];
                            return (
                                <Ellipsis length={20} tooltip>{str}</Ellipsis>
                            );
                        }
                        return str;
                    }
                    return '';
                },
            },
            {
                title: '处警人',
                dataIndex: 'cjr',
                render: (text) => {
                    if (text) {
                        let str = '';
                        const strArry = text.split(',');
                        if (strArry.length > 0) {
                            str = strArry[strArry.length - 1];
                            return (
                                <Ellipsis length={20} tooltip>{str}</Ellipsis>
                            );
                        }
                        return str;
                    }
                    return '';
                },
            },
            {
                title: '报案人',
                dataIndex: 'bar',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={20} tooltip>{text}</Ellipsis> : ''
                    );
                },
            },
            {
                title: '是否受案',
                dataIndex: 'is_sa',
                render(text) {
                    return <Badge status={statusMap[text]} text={status[text]}/>;
                },
            },
            {
                title: '操作',
                width: 50,
                render: (record) => (
                    <div>
                        <a onClick={() => this.jqDetail(record,record.id)}>详情</a>
                    </div>
                ),
            },
        ];
        const JzColumns = [
            {
                title: '卷宗名称',
                dataIndex: 'jzmc',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={20} tooltip>{text}</Ellipsis> : ''
                    );
                },
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
        let className  = this.props.global&&this.props.global.dark ? styles.detailBoxScroll : styles.detailBoxScroll+' ' + styles.detailBoxLight;
        return (
            <Card style={{ height: autoheight() - 225 + 'px',marginTop:'12px' }}
                  // onScrollCapture={this.scrollHandler}
                  id={'scroll'}
                 className={className}>
                <Spin spinning={loading}>
                    <div id='capture1'>
                        <div id={`Namegxtp${this.state.res.ajbh}`} className={styles.borderBottom}>
                            <Card title="| 关系图谱" className={liststyles.cardCharts} bordered={false}
                                  id={this.state.res.ajbh + 'gxtp'}>
                                <Spin spinning={this.state.load}>
                                    <div
                                        id={'RegulateTree' + this.state.res.ajbh}
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
                        <div id={`Namejqxx${this.state.res.ajbh}`} className={styles.borderBottom}>
                            <Card title="| 警情信息" className={liststyles.card} bordered={false} id={this.state.res.ajbh + 'jqxx'}>
                                <Table
                                    bordered
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{ position: 'absolute', left: '-150px',color:this.props.global&&this.props.global.dark ? '#fff':'#999' }}>共 {total} 条记录
                                            第 {this.state.jqcurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({ jqcurrent: page });
                                        },
                                    }}
                                    dataSource={caseDetails ? caseDetails.jqxxList : []}
                                    columns={JqColumns}
                                    locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                                />
                            </Card>
                        </div>
                        <div id={`Nameajxx${this.state.res.ajbh}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.state.res.ajbh + 'ajxx'}>| 案件信息</div>
                            <div className={styles.message} style={{ padding: '24px' }}>
                                <Row gutter={rowLayout}>
                                    <Col md={6} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件编号：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.ajbh ? caseDetails.ajbh : ''}</div>
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件名称：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}</div>
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件类别：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.ajlbmc ? caseDetails.ajlbmc : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={rowLayout}>
                                    <Col md={6} sm={24}>
                                        <div className={liststyles.Indexfrom}>案发时段：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.fasjsx && caseDetails.fasjxx ? caseDetails.fasjsx + '~' + caseDetails.fasjxx : ''}</div>
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <div className={liststyles.Indexfrom}>案发地点：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.afdd ? caseDetails.afdd : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={rowLayout}>
                                    <Col md={24} sm={24}>
                                        <div className={liststyles.Indexfrom}>简要案情：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.jyaq ? caseDetails.jyaq : ''}</div>
                                    </Col>
                                </Row>

                                {caseDetails && caseDetails.ajzt ?
                                    <div className={styles.ajlxBg}>
                                        <Card title={'案件流程'} style={{ width: '100%' }}>
                                            {/*{this.ajlc(caseDetails, superveWidth)}*/}
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
                            <div id={`Nameajgj${this.state.res.ajbh}`} className={styles.borderBottom}>
                                <div className={styles.title} id={this.state.res.ajbh + 'ajgj'}>| 案件轨迹</div>
                                <CaseModalTrail
                                    {...this.props}
                                    caseDetails={caseDetails}
                                    ly='档案'
                                    from='刑事'
                                />
                            </div>
                            :
                            ''
                        }
                        <div id={`Namesawp${this.state.res.ajbh}`} className={styles.borderBottom}>
                            <Card title="| 涉案物品" className={liststyles.card} bordered={false} id={this.state.res.ajbh + 'sawp'}>
                                <div>
                                    {this.sawpCol(caseDetails && caseDetails.sawpList ? caseDetails.sawpList : [])}
                                </div>
                            </Card>
                        </div>
                        <div id={`Namejzxx${this.state.res.ajbh}`} className={styles.borderBottom}>
                            <Card title="| 卷宗信息" className={liststyles.card} bordered={false} id={this.state.res.ajbh + 'jzxx'}>
                                <Table
                                    bordered
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{ position: 'absolute', left: '-150px',color:this.props.global&&this.props.global.dark ? '#fff':'#999' }}>共 {total} 条记录
                                            第 {this.state.jzcurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({ jzcurrent: page });
                                        },
                                    }}
                                    dataSource={caseDetails ? caseDetails.jzList : []}
                                    columns={JzColumns}
                                    locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                                />
                            </Card>
                        </div>
                        <div id={`Namegjxx${this.state.res.ajbh}`} className={styles.borderBottom}>
                            <Card title="| 告警信息" className={liststyles.card} bordered={false} id={this.state.res.ajbh + 'gjxx'}>
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

    goLink = (link) =>{
        this.setState({
            link:link
        });
    }
    render() {
        const { makeTableModalVisible, RetrieveVisible, RetrieveRecord,tbDetail } = this.state;
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
                        className={!(this.state.Anchor && this.state.AnchorShow) ? styles.AnchorHide : this.state.AnchorShow ? styles.fadeBoxIn : styles.fadeBoxOut}
                        offsetTop={70} onChange={this.goLink}>
                        <Link
                            href={`#${this.state.res.ajbh}gxtp`}
                            title="关系图谱"/>
                        <Link
                            href={`#${this.state.res.ajbh}jqxx`}
                            title="警情信息"/>
                        <Link
                            href={`#${this.state.res.ajbh}ajxx`}
                            title="案件信息"/>
                        <Link
                            href={`#${this.state.res.ajbh}ajgj`}
                            title="案件轨迹"/>
                        <Link
                            href={`#${this.state.res.ajbh}sawp`}
                            title="涉案物品"/>
                        <Link
                            href={`#${this.state.res.ajbh}jzxx`}
                            title="卷宗信息"/>
                        <Link
                            href={`#${this.state.res.ajbh}gjxx`}
                            title="告警信息"/>
                    </Anchor>
                </div>
            </div>
        );
    }

}
