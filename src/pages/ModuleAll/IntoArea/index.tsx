/*
 * IntoArea/index.tsx 人员入区情况
 * author：jhm
 * 20191211
 * */

import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, message, Table} from 'antd';
import styles from './index.less';
// import AreaDetail from '../../routes/AreaRealData/areaDetail';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
import liststyles from '../../common/listDetail.less';
import {routerRedux} from "dva/router";
import nophoto from "@/assets/common/nophoto.png";
import nophotoLight from "@/assets/common/nophotoLight.png";

@connect(({CaseData, loading, common,global}) => ({
    common,
    CaseData,
    loading: loading.models.CaseData,
    global,
}))

export default class IntoArea extends PureComponent {
    constructor(props){
      super(props);
      let record = props.location.query.record;
      if(record && typeof record === 'string'){
        record = JSON.parse(sessionStorage.getItem('query')).query.record;
      }
      this.state={
        intoAreaData: null,
        record,
      }
    }
    componentWillMount() {
        this.getIntoAreaData();
    }

    getIntoAreaData = () => {
        // const {query: {record}} = this.props.location;
        const {record} = this.state;
        this.props.dispatch({
            type: 'CaseData/getIntoAreaData',
            payload: {
                ajbh: record.ajbh,
                sfzh: record.sfzh,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        intoAreaData: data,
                    });
                }
            },
        });
    };

    deatils = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/handlingArea/AreaData/areaDetail',
                query: {record: record, id: record && record.person_id ? record.person_id : '1'},
            }),
        );
        // const divs = (
        //   <div>
        //     <AreaDetail
        //       {...this.props}
        //       id={id}
        //     />
        //   </div>
        // );
        // const AddNewDetail = { title: '人员在区详情', content: divs, key: id };
        // this.props.newDetail(AddNewDetail);
    };
    // 根据案件编号打开案件窗口
    openCaseDetail = (intoAreaData) => {
        // intoAreaData.ajxx.system_id, intoAreaData.ajxx.ajlx, intoAreaData.ajxx.ajbh
        if (intoAreaData.ajxx.ajlx === '22001') { // 刑事案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                    query: {id: intoAreaData.ajxx.system_id, record: intoAreaData.ajxx},
                }),
            );
            // const divs = (
            //   <div>
            //     <CaseDetail
            //       {...this.props}
            //       id={systemId}
            //     />
            //   </div>
            // );
            // const AddNewDetail = { title: '刑事案件详情', content: divs, key: systemId };
            // this.props.newDetail(AddNewDetail);
        } else if (intoAreaData.ajxx.ajlx === '22002') { // 行政案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                    query: {id: intoAreaData.ajxx.system_id, record: intoAreaData.ajxx},
                }),
            );
            // const divs = (
            //   <div>
            //     <XzCaseDetail
            //       {...this.props}
            //       id={systemId}
            //     />
            //   </div>
            // );
            // const AddNewDetail = { title: '行政案件详情', content: divs, key: ajbh };
            // this.props.newDetail(AddNewDetail);
        }
    };

    render() {
        // const { CaseData: { intoAreaData }} = this.props;
        let dark = this.props.global && this.props.global.dark;
        const {intoAreaData} = this.state;
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayoutInName = {sm: 24, md: 6, xl: 6};
        const colLayoutInData = {sm: 24, md: 18, xl: 18};
        const columns = [
            {
                title: '序号',
                key: 'number',
                render: (text, record, index) => {
                    // console.log('df---',text)
                    // console.log('df---',record)
                    // console.log('df---',index)
                    return (index + 1);
                },
            }, {
                title: '入区时间',
                dataIndex: 'rqsj',
                key: 'rqsj',
            }, {
                title: '离区时间',
                dataIndex: 'leave_time',
                key: 'leave_time',
            }, {
                title: '滞留时长',
                dataIndex: 'detain_time',
                key: 'detain_time',
            }, {
                title: '入区原因',
                dataIndex: 'entry_cause',
                key: 'entry_cause',
            }, {
                title: '办案民警',
                dataIndex: 'bar',
                key: 'bar',
            }, {
                title: '操作',
                key: 'option',
                render: (text, record, index) => (
                    <a onClick={() => this.deatils(record)}>详情</a>
                ),
            }];
        return (
            <div className={dark ? '' : styles.lightBox}>
                <div style={{backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10,overflow:"hidden"}}>
                    <div className={styles.title}>
                        <div
                            style={{
                                borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                paddingLeft: '16px',
                            }}
                        >人员信息</div></div>
                    <div className={styles.message+' '+styles.messageBox}>
                        <Row>
                            <Col md={2} sm={24}>
                                <div>
                                    <img
                                        src={intoAreaData && intoAreaData.ryxx && intoAreaData.ryxx.photo ? intoAreaData.ryxx.photo :  dark
                                            ? nophoto
                                            : nophotoLight}
                                        width='100%' alt='暂无图片显示'/>
                                </div>
                            </Col>
                            <Col md={22} sm={24} style={{paddingLeft: '24px'}}>
                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={4} sm={24}>
                                        <Row className={liststyles.JzInfoDiv}>
                                            <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                姓名：
                                            </Col>
                                            <Col {...colLayoutInData}>
                                                {intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.name : ''}
                                            </Col>
                                        </Row>
                                        {/*<div className={styles.break}>姓名：{intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.name : ''}</div>*/}
                                    </Col>
                                    <Col md={4} sm={24}>
                                        <Row className={liststyles.JzInfoDiv}>
                                            <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                年龄：
                                            </Col>
                                            <Col {...colLayoutInData}>
                                                {intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.age : ''}
                                            </Col>
                                        </Row>
                                        {/*<div className={styles.break}>年龄：{intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.age : ''}</div>*/}
                                    </Col>
                                    <Col md={4} sm={24}>
                                        <Row className={liststyles.JzInfoDiv}>
                                            <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                性别：
                                            </Col>
                                            <Col {...colLayoutInData}>
                                                {intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.sex : ''}
                                            </Col>
                                        </Row>
                                        {/*<div className={styles.break}>性别：{intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.sex : ''}</div>*/}
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <Row className={liststyles.JzInfoDiv}>
                                            <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                证件号码：
                                            </Col>
                                            <Col {...colLayoutInData}>
                                                {intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.zjhm : ''}
                                            </Col>
                                        </Row>
                                        {/*<div className={styles.break}>证件号码：{intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.zjhm : ''}</div>*/}
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <Row className={liststyles.JzInfoDiv}>
                                            <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                人员类型：
                                            </Col>
                                            <Col {...colLayoutInData}>
                                                {intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.salx_mc : ''}
                                            </Col>
                                        </Row>
                                        {/*<div className={styles.break}>人员类型：{intoAreaData && intoAreaData.ryxx ? intoAreaData.ryxx.salx_mc : ''}</div>*/}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={24} sm={24}>
                                        <Card title="涉案信息" className={styles.dqsaxxCard}>
                                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                                <Col md={8} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                            案件编号：
                                                        </Col>
                                                        <Col {...colLayoutInData}>
                                                            {
                                                                intoAreaData && intoAreaData.ajxx && intoAreaData.ajxx.ajbh ? (
                                                                    intoAreaData.ajxx.system_id && intoAreaData.ajxx.ajlx ? (
                                                                        <a
                                                                            onClick={() => this.openCaseDetail(intoAreaData)}
                                                                            style={{textDecoration: 'underline'}}
                                                                        >
                                                                            {intoAreaData.ajxx.ajbh}
                                                                        </a>
                                                                    ) : intoAreaData.ajxx.ajbh

                                                                ) : ''
                                                            }
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>案件编号：*/}
                                                    {/*{*/}
                                                    {/*intoAreaData && intoAreaData.ajxx && intoAreaData.ajxx.ajbh ? (*/}
                                                    {/*intoAreaData.ajxx.system_id && intoAreaData.ajxx.ajlx ? (*/}
                                                    {/*<a*/}
                                                    {/*onClick={() => this.openCaseDetail(intoAreaData.ajxx.system_id, intoAreaData.ajxx.ajlx, intoAreaData.ajxx.ajbh)}*/}
                                                    {/*style={{textDecoration: 'underline'}}*/}
                                                    {/*>*/}
                                                    {/*{intoAreaData.ajxx.ajbh}*/}
                                                    {/*</a>*/}
                                                    {/*) : intoAreaData.ajxx.ajbh*/}

                                                    {/*) : ''*/}
                                                    {/*}*/}
                                                    {/*</div>*/}
                                                </Col>
                                                <Col md={8} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                            案件名称：
                                                        </Col>
                                                        <Col {...colLayoutInData}>
                                                            {intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.ajmc : ''}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>案件名称：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.ajmc : ''}</div>*/}
                                                </Col>
                                                <Col md={8} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                            案件状态：
                                                        </Col>
                                                        <Col {...colLayoutInData}>
                                                            {intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.ajzt : ''}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>案件状态：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.ajzt : ''}</div>*/}
                                                </Col>
                                            </Row>
                                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                                <Col md={8} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                            案发时段：
                                                        </Col>
                                                        <Col {...colLayoutInData}>
                                                            {(intoAreaData && intoAreaData.ajxx && intoAreaData.ajxx.fasjsx && intoAreaData.ajxx.fasjxx ? intoAreaData.ajxx.fasjsx + '~' + intoAreaData.ajxx.fasjxx : '')}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>案发时段：{(intoAreaData && intoAreaData.ajxx && intoAreaData.ajxx.fasjsx && intoAreaData.ajxx.fasjxx? intoAreaData.ajxx.fasjsx+'~'+ intoAreaData.ajxx.fasjxx : '')}</div>*/}
                                                </Col>
                                                <Col md={8} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                            办案单位：
                                                        </Col>
                                                        <Col {...colLayoutInData}>
                                                            {intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.bardwmc : ''}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>办案单位：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.bardwmc  : ''}</div>*/}
                                                    {/*<div className={styles.break}>办案单位：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.bardwmc  : ''}</div>*/}
                                                </Col>
                                                <Col md={8} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col {...colLayoutInName} className={liststyles.JzInfoRight}>
                                                            办案人：
                                                        </Col>
                                                        <Col {...colLayoutInData}>
                                                            {intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.barxm : ''}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>办案人：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.barxm  : ''}</div>*/}
                                                </Col>
                                                <Col md={24} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col sm={24} md={3} xl={3} className={liststyles.JzInfoRight}
                                                             style={{width: 99}}>
                                                            案发地点：
                                                        </Col>
                                                        <Col sm={24} md={21} xl={21}>
                                                            {intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.afdd : ''}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>案发地点：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.afdd  : ''}</div>*/}
                                                </Col>
                                            </Row>
                                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                                <Col md={24} sm={24}>
                                                    <Row className={liststyles.JzInfoDiv}>
                                                        <Col sm={24} md={2} xl={2} className={liststyles.JzInfoRight}
                                                             style={{width: 99}}>
                                                            简要案情：
                                                        </Col>
                                                        <Col sm={24} md={22} xl={22}>
                                                            {intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.jyaq : ''}
                                                        </Col>
                                                    </Row>
                                                    {/*<div className={styles.break}>简要案情：{intoAreaData && intoAreaData.ajxx ? intoAreaData.ajxx.jyaq  : ''}</div>*/}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.title} style={{marginTop: '24px'}}>
                        <div
                            style={{
                                borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                                paddingLeft: '16px',
                            }}
                        >人员在区信息</div></div>
                    <div className={styles.message}>
                        {intoAreaData && intoAreaData.haList ? (
                            intoAreaData.haList.map((item, index) => {
                                return (
                                    <Card
                                        title={
                                            <div>
                                                <span style={{fontSize: 16, fontWeight: 600}}>{item.haName}</span>
                                                <span style={{
                                                    fontSize: 14,
                                                    color: '#5875A8',
                                                    marginLeft: 8,
                                                }}>入区次数：{item.rqList.length}次</span>
                                            </div>
                                        }
                                        key={item.haName + index}
                                        bordered={true}
                                        style={{marginBottom: 16}}
                                    >
                                        <Table
                                            columns={columns}
                                            dataSource={item.rqList}
                                            rowKey={record => record.record_id}
                                            pagination={{
                                                pageSize: 3,
                                                showTotal: (total, range) => <div style={{color: '#b7b7b7'}}>共 {total} 条记录
                                                    第 {(Math.ceil(range[1] / 3))} / {(Math.ceil(total / 3))} 页</div>,
                                                // onChange: (page)=>{this.setState({current:page})},
                                            }}
                                        />
                                    </Card>
                                );
                            })
                        ) : (
                            <div style={{textAlign: 'center', color: '#ccc'}}>暂无在区信息</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

}





