/*
* AdministrativeCaseDocDetail.js 行政案件档案
* author：lyp
* 20190122
* */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Row, Col, Card, Button, Badge, Table, List, Tooltip, message, Anchor, Spin, Empty} from 'antd';
import html2canvas from 'html2canvas';
import styles from '../docDetail.less';
import liststyles from '../docListStyle.less';
import { autoheight, getQueryString, userAuthorityCode } from '../../../utils/utils';
// import ItemDetail from '../ItemRealData/itemDetail';
// import JqDetail from '../../routes/PoliceRealData/policeDetail';
// import JzDetail from '../../routes/DossierData/DossierDetail';
// import XsDetail from '../../routes/UnCaseRealData/uncaseDetail';
// import BaqDetail from '../../routes/UnAreaRealData/unareaDetail';
// import JzgjDetail from '../../routes/UnDossierData/UnDossierDetail';
// import WpDetail from '../../routes/UnItemRealData/unitemDetail';
// import JqgjDetail from '../../routes/UnPoliceRealData/unpoliceDetail';
// import XzDetail from '../../routes/UnXzCaseRealData/caseDetail';
// import PersonDetail from './PersonalDocDetail';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
import echarts from 'echarts'
import tree from 'echarts/lib/chart/tree';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
import MakeTableModal from '../../../components/CaseRealData/MakeTableModal';
import { authorityIsTrue } from '../../../utils/authority';
import noList from "@/assets/viewData/noList.png";

const { Link } = Anchor;
let echartTree;
let imgBase = [];

@connect(({ XzCaseData, CaseData, AllDetail }) => ({
    XzCaseData, CaseData, AllDetail,
}))


export default class AdministrativeCaseDocDetail extends PureComponent {
    state = {
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
        afterScrollTop: document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset,
        load: false,
        makeTableModalVisible: false, // 制表model
        RetrieveRecord: null,
        isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
        loading: false, // 默认详情页是否为加载状态
    };

    componentDidMount() {
        this.caseDetailDatas(this.props.location.query.id);
        window.addEventListener('scroll', this.scrollHandler);
    }

    scrollHandler = () => {
        let afterScrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
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
    getX = (x,d,idx,r) =>{
        return x + Math.sin(d*idx) * r;
    }
    getY = (y,d,idx,r) =>{
        return y - Math.cos(d*idx) * r;
    }
    // 脑图
    showEchart = (data) =>{
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
                x: -700,
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
                    target: (event.jjnr ? this.formatter(event.jjnr) : null) + index,
                });
                console.log('list.indexOf(event.jjnr)',JSON.stringify(list).indexOf(this.formatter(event.jjnr)))
                list.push({
                    name: event.jjnr ? this.formatter(event.jjnr) : null,
                    id:(event.jjnr ? this.formatter(event.jjnr) : null) + index,
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
                        id:(event.xyrName ? this.formatter(event.xyrName + sartag) : null)+index,
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
        echartTree = echarts.init(document.getElementById('RegulateTree' + this.props.id));
        echartTree.hideLoading();

        var categories = [];
        for (var i = 0; i < 9; i++) {
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
        console.log('dataList======>',dataList)
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
        });
        let option = {
            tooltip: {},
            legend: [{
                // selectedMode: 'single',
                data: categories2.map(function (a) {
                    return a.name;
                }),
                textStyle: { color: "#fff" },
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
                            borderColor: '#fff',
                            borderWidth: 1,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    label: {
                        position: 'bottom',
                        formatter: '{b}'
                    },
                    lineStyle: {
                        width : '5',
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
                        this.showEchart(data);
                        // window.addEventListener("resize", echartTree.resize);
                    });
                }
            },

        });
    };
    // 根据物品案件编号和身份证号打开人员档案窗口
    openPersonDetail = (idcard, name, ajbh, xyrId) => {
        // this.props.dispatch({
        //     type: 'AllDetail/AllDetailPersonFetch',
        //     payload: {
        //         name: name,
        //         sfzh: idcard,
        //     },
        //     callback: (data) => {
        //         if (data && data.ryxx) {
        //             const divs = (
        //                 <div>
        //                     <PersonDetail
        //                         {...this.props}
        //                         name={name}
        //                         idcard={idcard}
        //                         ajbh={ajbh}
        //                         ly='行政常规数据'
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '人员档案', content: divs, key: idcard + name + 'ryda' };
        //             this.props.newDetail(AddNewDetail);
        //         } else {
        //             message.error('该人员暂无人员档案');
        //         }
        //     },
        // });
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
        });
        imgBase = [];
        const Namegxtp = `#Namegxtp${this.props.id}`;
        const Namejqxx = `#Namejqxx${this.props.id}`;
        const Nameajxx = `#Nameajxx${this.props.id}`;
        const Nameajgj = `#Nameajgj${this.props.id}`;
        const Namesawp = `#Namesawp${this.props.id}`;
        const Namejzxx = `#Namejzxx${this.props.id}`;
        const Namegjxx = `#Namegjxx${this.props.id}`;
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
        const { caseDetails, isZb } = this.state;
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
                        <span style={{ margin: '16px', display: 'block' }}>行政案件档案详情</span>
                    </Col>
                    <Col>
                        <span style={{ float: 'right', margin: '12px 16px 12px 0' }}>
                            {
                                isZb ? <Button type="primary" style={{ marginLeft: 8 }}
                                               onClick={() => this.makeTable(caseDetails, true)}>制表</Button> : null
                            }
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.ExportStatistics()}>导出</Button>
                        </span>
                    </Col>
                </Row>
            </Card>
        );
    }

    // 根据物品ID打开物品详细窗口
    openItemsDetail = (system_id) => {
        // const divs = (
        //     <div>
        //         <ItemDetail
        //             {...this.props}
        //             id={system_id}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '涉案物品详情', content: divs, key: system_id };
        // this.props.newDetail(AddNewDetail);
    };
    // 点击案件轨迹人员的在区情况
    IntoArea = (idCard, ajbh) => {
        // const divs = (
        //     <div>
        //         <PersonIntoArea
        //             {...this.props}
        //             // idcard={idcard}
        //             ajbh={ajbh}
        //             sfzh={idCard}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: idCard + 'xzaj' };
        // this.props.newDetail(AddNewDetail);
    };


    sawpCol(sawpList) {
        return (
            <List
                itemLayout="vertical"
                size="small"
                locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                pagination={sawpList.length > 0 ? {
                    size: 'small',
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                        第 {this.state.current} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({ current: page });
                    },
                } : false}
                dataSource={sawpList}
                className={styles.sawpListName}
                style={{ color: '#faa' }}
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
                            <div className={styles.sawpSee} onClick={() => this.openItemsDetail(item.system_id)}>在区情况
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
    makeTable = (record, flag) => {
        this.setState({
            makeTableModalVisible: !!flag,
        });
    };
    // 关闭制表modal
    MakeTableCancel = () => {
        this.setState({
            makeTableModalVisible: false,
        });
    };

    gjxxCol(gjxxList) {
        return (
            <List
                itemLayout="vertical"
                size="small"
                locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                pagination={gjxxList.length > 0 ? {
                    size: 'small',
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                        第 {this.state.gjcurrent} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({ gjcurrent: page });
                    },
                } : false}
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
        // let divs;
        // if (item.wtfl_id === '203201') {
        //     divs = (
        //         <div>
        //             <JqgjDetail
        //                 {...this.props}
        //                 id={item.id}
        //                 wtid={item.wtid}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '警情告警详情', content: divs, key: item.id };
        //     this.props.newDetail(AddNewDetail);
        // } else if (item.wtfl_id === '203202') {
        //     divs = (
        //         <div>
        //             <XsDetail
        //                 {...this.props}
        //                 id={item.wtid}
        //                 systemId={item.system_id}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '刑事案件告警详情', content: divs, key: item.wtid };
        //     this.props.newDetail(AddNewDetail);
        // } else if (item.wtfl_id === '203203') {//unareaDetail
        //     divs = (
        //         <div>
        //             <BaqDetail
        //                 {...this.props}
        //                 id={item.wtid}
        //                 baqId={item.id}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '人员在区告警详情', content: divs, key: item.wtid };
        //     this.props.newDetail(AddNewDetail);
        // } else if (item.wtfl_id === '203204') {//unitemDetail
        //     divs = (
        //         <div>
        //             <WpDetail
        //                 {...this.props}
        //                 id={item.wtid}
        //                 systemId={item.system_id}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '涉案物品告警详情', content: divs, key: item.wtid };
        //     this.props.newDetail(AddNewDetail);
        //
        // } else if (item.wtfl_id === '203205') {//unXzcaseDetail
        //     divs = (
        //         <div>
        //             <XzDetail
        //                 {...this.props}
        //                 id={item.wtid}
        //                 systemId={item.system_id}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '行政案件告警详情', content: divs, key: item.wtid };
        //     this.props.newDetail(AddNewDetail);
        // } else if (item.wtfl_id === '203206') {//UnDossierDetail
        //     divs = (
        //         <div>
        //             <JzgjDetail
        //                 {...this.props}
        //                 id={item.id}
        //                 wtid={item.wtid}
        //                 dossierId={item.system_id}
        //             />
        //         </div>
        //     );
        //     const addDetail = { title: '卷宗告警详情', content: divs, key: item.wtid };
        //     this.props.newDetail(addDetail);
        // }
    };
    jqDetail = (id) => {
        // const divs = (
        //     <div>
        //         <JqDetail
        //             {...this.props}
        //             id={id}
        //         />
        //     </div>
        // );
        // const AddJqDetail = { title: '警情详情', content: divs, key: id };
        // this.props.newDetail(AddJqDetail);
    };
    JzDetail = (record) => {
        // const divs = (
        //     <div>
        //         <JzDetail
        //             {...this.props}
        //             record={record}
        //             sfgz={record.sfgz}
        //             gzid={record.gzid}
        //             tzlx={record.tzlx}
        //             ajbh={record.ajbh}
        //             id={record.dossier_id}
        //             current={this.state.jzcurrent}
        //         />
        //     </div>
        // );
        // const addDetail = { title: '卷宗详情', content: divs, key: record.dossier_id };
        // this.props.newDetail(addDetail);
    };

    renderDetail() {
        const { caseDetails, loading } = this.state;
        const status = ['否', '是'];
        const statusMap = ['default', 'success'];
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayoutInName = { sm: 24, md: 5, xl: 5 };
        const colLayoutInData = { sm: 24, md: 19, xl: 19 };
        const JqColumns = [
            {
                title: '接警来源',
                dataIndex: 'jjly_mc',
                render: (record) => {
                    return (
                        record && record.length <= 10 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 10) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '接警时间',
                dataIndex: 'jjsj',
                render: (record) => {
                    return (
                        record && record.length <= 20 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 20) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '管辖单位',
                dataIndex: 'jjdw',
                render: (record) => {
                    return (
                        record && record.length <= 20 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 20) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '接警人',
                dataIndex: 'jjr',
                render: (record) => {
                    return (
                        record && record.length <= 20 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 20) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '处警单位',
                dataIndex: 'cjdw',
                render: (record) => {
                    return (
                        record && record.length <= 20 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 20) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '处警人',
                dataIndex: 'cjr',
                render: (record) => {
                    return (
                        record && record.length <= 20 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 20) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '报案人',
                dataIndex: 'bar',
                render: (record) => {
                    return (
                        record && record.length <= 20 ? record :
                            <Tooltip title={record}>
                                <span>{record && record.substring(0, 20) + '...'}</span>
                            </Tooltip>
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
                        <a onClick={() => this.jqDetail(record.id)}>详情</a>
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
        return (
            <Card style={{ height: autoheight() - 210 + 'px',marginTop:'12px' }} ref={'scroll'}
                  className={styles.detailBoxScroll}>
                <Spin spinning={loading}>
                    <div id='capture1'>
                        <div id={`Namegxtp${this.props.id}`} className={styles.borderBottom}>
                            <Card title="| 关系图谱" className={liststyles.cardCharts} bordered={false}
                                  id={this.props.id + 'gxtp'}>
                                <Spin spinning={this.state.load}>
                                    <div
                                        id={'RegulateTree' + this.props.id}
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
                        <div id={`Namejqxx${this.props.id}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.props.id + 'jqxx'}>| 警情信息</div>
                            <div className={styles.tablemessage} style={{ marginBottom: '24px', padding: '24px' }}>
                                <Table
                                    bordered
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{ position: 'absolute', left: '-150px',color:'#fff' }}>共 {total} 条记录
                                            第 {this.state.jqcurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({ jqcurrent: page });
                                        },
                                    }}
                                    locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                                    dataSource={caseDetails ? caseDetails.jqxxList : []}
                                    columns={JqColumns}
                                />
                            </div>
                        </div>
                        <div id={`Nameajxx${this.props.id}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.props.id + 'ajxx'}>| 案件信息</div>
                            <div className={styles.message} style={{ padding: '24px' }}>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件编号：</div>
                                        <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                                            {caseDetails && caseDetails.ajbh ? caseDetails.ajbh : ''}
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案件名称：</div>
                                        <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                                            {caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>是否延期：</div>
                                        <div
                                            className={liststyles.Indextail}>{caseDetails && caseDetails.sfyq ? (caseDetails.sfyq === '1' ? '已延期至60日' : '否') : '否'}</div>
                                    </Col>

                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案发时段：</div>
                                        <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                                            {caseDetails && caseDetails.fasj_sx && caseDetails.fasj_xx ? caseDetails.fasj_sx + '~' + caseDetails.fasj_xx : ''}
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={liststyles.Indexfrom}>案发地点：</div>
                                        <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                                            {caseDetails && caseDetails.fadxz ? caseDetails.fadxz : ''}
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={24} sm={24}>
                                        <div className={liststyles.Indexfrom}>简要案情：</div>
                                        <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                                            {caseDetails && caseDetails.ajjj ? caseDetails.ajjj : ''}
                                        </div>
                                    </Col>
                                </Row>

                                {caseDetails && caseDetails.ajzt ?
                                    <div className={styles.ajlxBg}>
                                        <Card title={'| 案件流程'} style={{ width: '100%' }}>
                                            {/*{this.ajlc(caseDetails,superveWidth)}*/}
                                            <CaseModalStep
                                                caseDetails={caseDetails}
                                            />
                                        </Card>
                                    </div>
                                    :
                                    ''
                                }

                            </div>
                        </div>
                        {caseDetails && caseDetails.ajzt ?
                            <div id={`Nameajgj${this.props.id}`} className={styles.borderBottom}>
                                <div className={styles.title} id={this.props.id + 'ajgj'}>| 案件轨迹</div>
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
                        <div id={`Namesawp${this.props.id}`} className={styles.borderBottom}>
                            <div className={styles.title} id={this.props.id + 'sawp'}>| 涉案物品</div>
                            <div className={styles.tablemessage}>
                                <div style={{ padding: '24px 0' }}>
                                    {this.sawpCol(caseDetails && caseDetails.sawpList ? caseDetails.sawpList : [])}
                                </div>
                            </div>
                        </div>
                        <div id={`Namejzxx${this.props.id}`} className={styles.borderBottom}>
                            <Card title="| 卷宗信息" className={liststyles.card} bordered={false} id={this.props.id + 'jzxx'}>
                                <Table
                                    bordered
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{ position: 'absolute', left: '-150px',color:'#fff' }}>共 {total} 条记录
                                            第 {this.state.jzcurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({ jzcurrent: page });
                                        },
                                    }}
                                    locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                                    dataSource={caseDetails ? caseDetails.jzList : []}
                                    columns={JzColumns}

                                />
                            </Card>
                        </div>
                        <div id={`Namegjxx${this.props.id}`} className={styles.borderBottom}>
                            <Card title="| 告警信息" className={liststyles.card} bordered={false} id={this.props.id + 'gjxx'}>
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


    render() {
        const { makeTableModalVisible, superviseVisibleModal } = this.state;
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
                        offsetTop={70}>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'gxtp'}
                            title="关系图谱"/>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'jqxx'}
                            title="警情信息"/>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'ajxx'}
                            title="案件信息"/>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'ajgj'}
                            title="案件轨迹"/>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'sawp'}
                            title="涉案物品"/>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'jzxx'}
                            title="卷宗信息"/>
                        <Link
                            href={'#/allDocuments/caseDoc/administrativeCaseDocTransfer/administrativeCaseDoc#' + this.props.id + 'gjxx'}
                            title="告警信息"/>
                    </Anchor>
                </div>
                {
                    makeTableModalVisible ? (
                        <MakeTableModal
                            title='表格选择'
                            makeTableModalVisible={makeTableModalVisible}
                            MakeTableCancel={this.MakeTableCancel}
                            caseRecord={this.state.caseDetails}
                        />
                    ) : null
                }
            </div>
        );
    }

}
