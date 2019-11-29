/*
* PersonalDocDetail 人员档案详情
* author：lyp
* 20180123
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Card, Steps, message, Tabs, Button, Spin } from 'antd';
import html2canvas from 'html2canvas';
import echarts from 'echarts';
import tree from 'echarts/lib/chart/tree';
import nophoto from '../../../assets/common/nophoto.png'
import tooltip from 'echarts/lib/component/tooltip';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
// import ItemDetail from '../../routes/ItemRealData/itemDetail';
// import CaseDetail from '../../routes/CaseRealData/caseDetail';
// import XzCaseDetail from '../../routes/XzCaseRealData/caseDetail';
// import PersonDetail from '../../routes/AllDocuments/PersonalDocDetail';
// import JzDetail from '../../routes/DossierData/DossierDetail';
import PersonDetailTab from '../../../components/AllDocuments/PersonDetailTab';
import styles from '../docDetail.less';
import listStyles from '../docListStyle.less';
import { autoheight } from '../../../utils/utils';

const FormItem = Form.Item;
const { Step } = Steps;
const TabPane = Tabs.TabPane;
let echartTree;
let imgBase = [];
@connect(({ UnPoliceData,common }) => ({
    UnPoliceData,common
}))
export default class PersonalDocDetail extends PureComponent {
    state = {
        personData: '',
        loading: false, // 默认详情页是否为加载状态
    };

    componentDidMount() {
        console.log('this.props.location.query',this.props.location.query.record)
        const idcard = this.props.location.query.record.xyr_sfzh;
        this.getPersonDetail(idcard);
    }

    getPersonDetail = (sfzh) => {
        console.log('sfzh====>',sfzh);
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
                        this.showEchart(data);
                        // window.addEventListener("resize", echartTree.resize);
                    });
                } else {
                    message.error('该人员暂无人员档案');
                }
            },
        });
    };
    // 根据案件编号打开案件窗口
    openCaseDetail = (systemId, caseType, ajbh) => {
        // if (caseType === '22001') { // 刑事案件
        //     const divs = (
        //         <div>
        //             <CaseDetail
        //                 {...this.props}
        //                 id={systemId}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '刑事案件详情', content: divs, key: ajbh };
        //     this.props.newDetail(AddNewDetail);
        // } else if (caseType === '22002') { // 行政案件
        //     const divs = (
        //         <div>
        //             <XzCaseDetail
        //                 {...this.props}
        //                 systemId={systemId}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '行政案件详情', content: divs, key: 'xz' + ajbh };
        //     this.props.newDetail(AddNewDetail);
        // }
    };
    // 入区信息详情
    IntoArea = (ajbh) => {
        // const { personData: { ryxx: { xyr_sfzh } } } = this.state;
        // const divs = (
        //     <div>
        //         <PersonIntoArea
        //             {...this.props}
        //             sfzh={xyr_sfzh}
        //             ajbh={ajbh}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: xyr_sfzh };
        // this.props.newDetail(AddNewDetail);
    };
    // 人员档案详情
    openPersonDetail = (rec) => {
        // const { xyr_sfzh: idcard } = rec;
        // if (idcard) {
        //     this.props.dispatch({
        //         type: 'AllDetail/AllDetailPersonFetch',
        //         payload: {
        //             sfzh: idcard,
        //         },
        //         callback: (data) => {
        //             if (data && data.ryxx) {
        //                 const divs = (
        //                     <div>
        //                         <PersonDetail
        //                             {...this.props}
        //                             idcard={idcard}
        //                             ly='常规数据'
        //                         />
        //                     </div>
        //                 );
        //                 const AddNewDetail = { title: '人员档案', content: divs, key: idcard + 'ryda' };
        //                 this.props.newDetail(AddNewDetail);
        //             } else {
        //                 message.error('该人员暂无人员档案');
        //             }
        //         },
        //     });
        // } else {
        //     message.error('该人员暂无人员档案');
        // }
    };
    // 卷宗详情
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
    // 涉案物品详情
    SaWpdeatils = (systemId, flag) => {
        // const divs = (
        //     <div>
        //         <ItemDetail
        //             {...this.props}
        //             id={systemId}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '涉案物品详情', content: divs, key: '人员档案' + systemId };
        // this.props.newDetail(AddNewDetail);
    };
    // 换行
    formatter = (val) => {
        if (val) {
            let strs = val.split(''); // 字符串数组
            let str = '';
            for (let i = 0, s; s = strs[i++];) { // 遍历字符串数组
                str += s;
                if (!(i % 15)) str += '\n'; // 按需要求余
            }
            return str;
        }
        return '';
    };
    getX = (x,d,idx,r) =>{
        return x + Math.sin(d*idx) * r;
    }
    getY = (y,d,idx,r) =>{
        return y - Math.cos(d*idx) * r;
    }
    // 脑图
    showEchart = (data) => {
        echartTree = echarts.init(document.getElementById('ryRegulateTree' + this.props.idcard));
        const { ajxx, ryxx } = data;
        console.log('data------>',data);
        let link = [];
        let datas = [ {
            name: this.formatter(ryxx.name),
            attributes:{
                modularity_class:0,
            },
            symbolSize: 40,
            x: -1500,
            y: 350,
        }];
        if (ajxx && ajxx.length > 0) {
            for (let i = 0; i < ajxx.length; i++) {
                const caseData = ajxx[i];
                let x = this.getX(-1500,90,i,3000);
                let y = this.getY(350,90,i,3000);
                let lxX =  this.getX(x,20,1,1200);
                let lxY = this.getY(y,20,1,1200);
                let tarX = this.getX(x,20,2,2000);
                let tarY = this.getY(y,20,2,2000);
                let qzX = this.getX(x,20,3,1200);
                let qzY = this.getY(y,20,3,1200);
                let xzX = this.getX(x,20,4,2200);
                let xzY = this.getY(y,20,4,2200);
                let ssX = this.getX(x,20,5,1200);
                let ssY = this.getY(y,20,5,1200);
                let saX = this.getX(x,20,6,1200);
                let saY = this.getY(y,20,6,1200);
                let jzX = this.getX(x,20,7,1200);
                let jzY = this.getY(y,20,7,1200);
                link.push({
                    source: this.formatter(ryxx.name),
                    target: ajxx[i].ajmc+i,
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '历史入区信息'+i
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '同案人'+i
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '行政处罚记录'+i
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '强制措施记录'+i
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '随身物品'+i
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '涉案物品'+i
                }, {
                    source: ajxx[i].ajmc+i,
                    target: '相关卷宗'+i
                })
                datas.push({
                        name: ajxx[i].ajmc,
                        id:ajxx[i].ajmc +i,
                        attributes:{
                            modularity_class:1,
                        },
                        symbolSize: 40,
                        x: x,
                        y: y,
                    },
                    {
                        name: '历史入区信息',
                        id: '历史入区信息'+i,
                        attributes:{
                            modularity_class:2,
                        },
                        symbolSize: 30,
                        x: lxX,
                        y: lxY
                    }, {
                        name: '同案人',
                        id:'同案人' +i,
                        attributes:{
                            modularity_class:3,
                        },
                        symbolSize: 30,
                        x: tarX,
                        y: tarY
                    }, {
                        name: '行政处罚记录',
                        id: '行政处罚记录'+i,
                        attributes:{
                            modularity_class:4,
                        },
                        symbolSize: 30,
                        x: xzX,
                        y: xzY
                    }, {
                        name: '强制措施记录',
                        id: '强制措施记录'+i,
                        attributes:{
                            modularity_class:5,
                        },
                        symbolSize: 30,
                        x: qzX,
                        y: qzY
                    }, {
                        name: '随身物品',
                        id: '随身物品'+i,
                        attributes:{
                            modularity_class:6,
                        },
                        symbolSize: 30,
                        x: ssX,
                        y: ssY
                    }, {
                        name: '涉案物品',
                        id: '涉案物品'+i,
                        attributes:{
                            modularity_class:7,
                        },
                        symbolSize: 30,
                        x: saX,
                        y: saY
                    }, {
                        name: '相关卷宗',
                        id: '相关卷宗'+i,
                        attributes:{
                            modularity_class:8,
                        },
                        symbolSize: 30,
                        x: jzX,
                        y: jzY
                    })
                if (caseData.rqList && caseData.rqList.length > 0) {
                    caseData.rqList.forEach((item, index) => {
                        link.push({
                            source: '历史入区信息'+i,
                            target: `${item.rqsj} ${item.haName}`+index + i,
                        });
                        datas.push({
                            name: `${item.rqsj} ${item.haName}`,
                            id: `${item.rqsj} ${item.haName}`+index + i,
                            attributes:{
                                modularity_class:2,
                            },
                            symbolSize: 20,
                            x: this.getX(lxX,30,index,80),
                            y: this.getY(lxY,30,index,80),
                        });
                    });
                }
                if (caseData.tarList && caseData.tarList.length > 0) {
                    caseData.tarList.forEach((item, index) => {
                        link.push({
                            source: '同案人'+i,
                            target: this.formatter(`${item.name} (${item.xszk_name ? item.xszk_name : '未知'})`)+index + i,
                        });
                        datas.push({
                            name: this.formatter(`${item.name} (${item.xszk_name ? item.xszk_name : '未知'})`),
                            id: this.formatter(`${item.name} (${item.xszk_name ? item.xszk_name : '未知'})`)+index + i,
                            attributes:{
                                modularity_class:3,
                            },
                            symbolSize: 20,
                            x: this.getX(tarX,20,index,800),
                            y: this.getY(tarY,20,index,800),
                        });
                    });
                }
                if (caseData.xzcfList && caseData.xzcfList.length > 0) {
                    caseData.xzcfList.forEach((item, index) => {
                        link.push({
                            source: '行政处罚记录'+i,
                            target: this.formatter(item.qzcsName)+index + i,
                        });
                        datas.push({
                            name: this.formatter(item.qzcsName),
                            id:this.formatter(item.qzcsName)+index + i,
                            attributes:{
                                modularity_class:4,
                            },
                            symbolSize: 20,
                            x: this.getX(xzX,20,index,1000),
                            y: this.getY(xzY,20,index,1000),
                        });
                    });
                }
                if ( caseData.qzcsList &&  caseData.qzcsList.length > 0) {
                    caseData.qzcsList.forEach((item, index) => {
                        link.push({
                            source: '强制措施记录'+i,
                            target: this.formatter(item.qzcsName)+index + i,
                        });
                        datas.push({
                            name: this.formatter(item.qzcsName),
                            id:this.formatter(item.qzcsName)+index + i,
                            attributes:{
                                modularity_class:5,
                            },
                            symbolSize: 20,
                            x: this.getX(qzX,20,index,700),
                            y: this.getY(qzY,20,index,700),
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
                };
                if (caseData.sawpList && caseData.sawpList.length > 0) {
                    caseData.sawpList.forEach((item, index) => {
                        link.push({
                            source: '涉案物品'+i,
                            target: this.formatter(item.wpmc)+index + i,
                        });
                        datas.push({
                            name: this.formatter(item.wpmc),
                            id: this.formatter(item.wpmc)+index + i,
                            attributes:{
                                modularity_class:7,
                            },
                            symbolSize: 20,
                            x: this.getX(saX,20,index,600),
                            y: this.getY(saY,20,index,600),
                        });
                    });
                }
                if (caseData.jzList && caseData.jzList.length > 0) {
                    caseData.jzList.forEach((item, index) => {
                        link.push({
                            source: '相关卷宗'+i,
                            target: this.formatter(item.jzmc)+index + i,
                        });
                        datas.push({
                            name: this.formatter(item.jzmc),
                            id: this.formatter(item.jzmc)+index + i,
                            attributes:{
                                modularity_class:8,
                            },
                            symbolSize: 20,
                            x: this.getX(jzX,20,index,800),
                            y: this.getY(jzY,20,index,800),
                        });
                    });
                }
            }
        }
        console.log('link==========>',link);
        console.log('datas==========>',datas);
        let categories = [];
        for (let i = 0; i < 9; i++) {
            categories[i] = {
                name: i
            };
        }
        const categories2 =[                //节点分类的类目，可选。
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
                name:  '行政处罚记录',    //类目名称
            },
            {
                name: "强制措施记录",    //类目名称
            },
            {
                name: '随身物品',    //类目名称
            },{
                name: '涉案物品',    //类目名称
            },{
                name: '相关卷宗',    //类目名称
            },
        ];
        datas.forEach(function (node) {
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
            color:['#52818c','#A2A16C','#a27970','#6d9289','#5b6a87','#92687E','#528747','#6F6F8C','#926254'],
            tooltip : {
                trigger: 'item',
                show:false,
                formatter: "{a}"
            },
            series : [
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
    };
    // 获取关系图谱的实际高度
    getChartTreeHeight = (ajxx) => {
        let heightCount = 560;
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
    addBase = (add) => {
        const { personData } = this.state;
        imgBase.push(add);
        // console.log('imgBase',imgBase)
        const ajxxLength = personData.ajxx ? personData.ajxx.length : 0;
        if (imgBase.length === 3 + ajxxLength) {
            this.exprotService(imgBase, personData);
        }
    };
    // 图表统计导出功能
    ExportStatistics = () => {
        const { personData } = this.state;
        this.setState({
            loading: true,
        });
        imgBase = [];
        const Nameryxx = `#Nameryxx${this.props.id}`;
        const Namegxtp = `#Namegxtp${this.props.id}`;
        const CardCharts = `#cardCharts${this.props.id}`;
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
                                // console.log('canvascontent', canvascontent.toDataURL())
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
                    html2canvas(document.querySelector(CardCharts).getElementsByClassName('ant-card-head')[0]).then(canvashead => {
                        this.addBase(canvashead.toDataURL().split('base64,')[1]);
                        this.setState({
                            loading: false,
                        });
                    });
                }
            });
        });
    };

    render() {
        const { personData, loading } = this.state;
        return (
            <div>
                <Spin spinning={loading}>
                    <Card>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={8} sm={24}>
                                <span style={{ margin: '16px', display: 'block' }}>人员档案</span>
                            </Col>
                            <Col md={8}/>

                            <Col md={8} sm={24}>
                                <Button type='primary' style={{ margin: '10px', float: 'right' }}
                                        onClick={() => this.ExportStatistics()}>导出</Button>
                            </Col>

                        </Row>
                    </Card>
                    <Card style={{ height: autoheight() - 210 + 'px',marginTop:'12px' }} ref={'scroll'}
                          className={styles.detailBoxScroll}>
                        <div>
                            <div id={`Nameryxx${this.props.id}`} className={styles.borderBottom}>
                                <Card title="|  人员信息" className={listStyles.cardCharts} bordered={false} id='capture1'>
                                    <div style={{ padding: 16 }}>
                                        <Row>
                                            <Col md={2} sm={24} style={{textAlign:'right'}}>
                                                <div>
                                                    <img
                                                        src={personData && personData.ryxx && personData.ryxx.photo ? personData.ryxx.photo : nophoto}
                                                        alt='暂无图片显示'
                                                        width='100'
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={22} sm={24} style={{ paddingLeft: '24px' }}>
                                                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 24 }}>
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
                                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}
                                                     style={{ marginBottom: '24px' }}>
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
                            <div id={`Namegxtp${this.props.id}`} className={styles.borderBottom}>
                                <Card title="|  关系图谱" className={listStyles.cardCharts} bordered={false}>
                                    <div
                                        id={'ryRegulateTree' + this.props.idcard}
                                        style={
                                            {
                                                height: this.getChartTreeHeight(personData.ajxx),
                                                width: '100%',
                                            }
                                        }
                                    />
                                </Card>
                            </div>
                            <Card title="|  涉案信息" className={listStyles.cardCharts + ' ' + styles.saxx} id={`cardCharts${this.props.id}`}
                                  bordered={false}>
                                {
                                    personData.ajxx ? (
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
                                            />
                                        ))
                                    ) : null
                                }
                            </Card>
                        </div>
                    </Card>
                </Spin>
            </div>
        );
    }
}
