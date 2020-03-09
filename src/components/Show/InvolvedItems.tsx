/*
* InvolvedItems.js 大屏展示 涉案财物模块
* author：lyp
* 20180612
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col} from 'antd';
import {Pie} from '../Charts';
import styles from './ComponentStyles.less';
import img1 from '../../assets/show/5-1.png';
import img2 from '../../assets/show/5-2.png';
import img3 from '../../assets/show/5-3.png';


export default class InvolvedItems extends PureComponent {
    state = {
        zkwp: 0, // 在库物品
        ckwp: 0, // 出库物品
        qkwp: 0, // 清库物品
        pdyc: 0, // 盘点异常
        ffck: 0, // 非法出库
        warehouseData: [],
        warehouseGroupA: [],
        warehouseGroupB: [],
    };

    componentDidMount() {
        // this.getInvolvedItems();
        this.getSacwCkTj();
        this.getSacwSsTj();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.areaCode !== '') && (this.props.areaCode !== nextProps.areaCode)) {
                this.getSacwCkTj(nextProps.areaCode);
                this.getSacwSsTj(nextProps.areaCode);
                // this.getBaqZqTj(nextProps.areaCode);
            }
        }

    }

    // 获取涉案财物信息
    getInvolvedItems = () => {
        this.props.dispatch({
            type: 'show/getInvolvedItems',
            payload: {
                time_flag: 'month',
            },
            callback: (data) => {
                const obj = {
                    zkwp: 0,
                    ckwp: 0,
                    qkwp: 0,
                    pdyc: 0,
                    ffck: 0,
                };
                for (let i = 0; i < data.length; i++) {
                    if (data[i].sj_lx === 'zkwp') {
                        obj.zkwp = data[i].sj_count;
                    } else if (data[i].sj_lx === 'ckwp') {
                        obj.ckwp = data[i].sj_count;
                    } else if (data[i].sj_lx === 'qkwp') {
                        obj.qkwp = data[i].sj_count;
                    } else if (data[i].sj_lx === 'pdyc') {
                        obj.pdyc = data[i].sj_count;
                    } else if (data[i].sj_lx === 'ffck') {
                        obj.ffck = data[i].sj_count;
                    }
                }
                this.setState({
                    ...obj,
                });
            },
        });
    };
    // 获取涉案财物仓库数据统计
    getSacwCkTj = (area) => {
        this.props.dispatch({
            type: 'show/getSacwCkTj',
            payload: {
                org: area,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        warehouseData: data,
                    });
                }

            },
        });
    };
    // 获取涉案财物实时数据
    getSacwSsTj = (area) => {
        this.props.dispatch({
            type: 'show/getSacwSsTj',
            payload: {
                org: area,
            },
            callback: (data) => {
                if (data) {
                    const warehouseGroupA = [];
                    let qkwp = 0, zkwp = 0, ckwp = 0;
                    const warehouseGroupB = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].sj_name === '清库物品') {
                            qkwp = data[i].sj_count;
                        } else if (data[i].sj_name === '在库物品') {
                            zkwp = data[i].sj_count;
                        } else if (data[i].sj_name === '出库物品') {
                            ckwp = data[i].sj_count;
                        } else {
                            warehouseGroupB.push(data[i]);
                        }
                    }
                    this.setState({
                        qkwp,
                        zkwp,
                        ckwp,
                        warehouseGroupB,
                    });
                }

            },
        });
    };

    render() {
        const {ffck, pdyc, warehouseData, warehouseGroupB, qkwp, zkwp, ckwp} = this.state;
        return (
            <div className={styles.fullPartBlock}>
                {/*<div className={styles.echartBlock}>*/}
                {/*<Row>*/}
                {/*{*/}
                {/*warehouseData.map((item) =>*/}
                {/*<Col span={12}>*/}
                {/*<Pie percent={item.sj_count} total={<div style={{paddingTop:20}}>{item.sj_count}</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>{item.sj_name}</div>*/}
                {/*</Col>*/}
                {/*)*/}
                {/*}*/}
                {/*<Col span={12}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>一号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={12}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>二号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={6}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>三号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={6}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>四号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={6}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>五号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={6}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>六号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={6}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>七号仓库</div>*/}
                {/*</Col>*/}
                {/*<Col span={6}>*/}
                {/*<Pie percent={28} total={<div style={{paddingTop:20}}>28%</div>} height={140} bigScreenColor="#013c5f" color="#06d9a9" />*/}
                {/*<div className={styles.warehouse}>八号仓库</div>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*</div>*/}
                <Row className={styles.itemCount} gutter={24}>
                    <Col span={8} className={styles.itemType}>
                        <div className={styles.itemTypeImage}><img src={img2} alt=""/></div>
                        <div className={styles.itemTypeNumber}>{zkwp}</div>
                        <div className={styles.itemTypeName}>在库物品</div>
                    </Col>
                    <Col span={8} className={styles.itemType}>
                        <div className={styles.itemTypeImage}><img src={img3} alt=""/></div>
                        <div className={styles.itemTypeNumber}>{ckwp}</div>
                        <div className={styles.itemTypeName}>出库物品</div>
                    </Col>
                    <Col span={8} className={styles.itemType}>
                        <div className={styles.itemTypeImage}><img src={img1} alt=""/></div>
                        <div className={styles.itemTypeNumber}>{qkwp}</div>
                        <div className={styles.itemTypeName}>清库物品</div>
                    </Col>
                </Row>
                <Row className={styles.warningCount} gutter={16}>
                    {
                        warehouseGroupB.map((item) =>
                            <Col span={6} className={styles.countNumber} style={{paddingBottom: 0}}>
                                <div style={{
                                    fontSize: '1.8rem',
                                    color: '#ff9600',
                                    fontWeight: 'bolder',
                                    paddingTop: 5,
                                }}>{item.sj_count}</div>
                                <div>{item.sj_name}</div>
                            </Col>,
                        )
                    }
                    {/*<Col span={6} className={styles.countNumber} style={{paddingBottom:0}}>*/}
                    {/*<div style={{fontSize:'2.4rem',color:'#ff9600',fontWeight:'bolder',paddingTop:10}}>{pdyc}</div>*/}
                    {/*<div>异常盘点</div>*/}
                    {/*</Col>*/}
                    {/*<Col span={6} className={styles.countNumber} style={{paddingBottom:0}}>*/}
                    {/*<div style={{fontSize:'2.4rem',color:'#ff9600',fontWeight:'bolder',paddingTop:10}}>{ffck}</div>*/}
                    {/*<div>非法出库</div>*/}
                    {/*</Col>*/}
                    {/*<Col span={6} className={styles.countNumber} style={{paddingBottom:0}}>*/}
                    {/*<div style={{fontSize:'2.4rem',color:'#ff9600',fontWeight:'bolder',paddingTop:10}}>{pdyc}</div>*/}
                    {/*<div>异常盘点</div>*/}
                    {/*</Col>*/}
                    {/*<Col span={6} className={styles.countNumber} style={{paddingBottom:0}}>*/}
                    {/*<div style={{fontSize:'2.4rem',color:'#ff9600',fontWeight:'bolder',paddingTop:10}}>{ffck}</div>*/}
                    {/*<div>非法出库</div>*/}
                    {/*</Col>*/}
                </Row>
            </div>
        );
    }
}
