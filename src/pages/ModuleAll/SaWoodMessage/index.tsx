/*
 * PersonWoods/index.tsx 涉案物品信息
 * author：jhm
 * 20191213
 * */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
// import numeral from 'numeral';
import {
    Row,
    Col,
    Form,
    Card,
    Select,
    Icon,
    Avatar,
    List,
    Tooltip,
    Dropdown,
    Menu,
    Button,
    Input,
    Steps,
    Table,
    Modal,
    Tabs,
} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './index.less';
import nophoto from '../../../assets/common/nophoto.png';
import nophotoLight from "@/assets/common/nophotoLight.png";


const FormItem = Form.Item;
const {Step} = Steps;
const TabPane = Tabs.TabPane;
export default class SaWoodMessage extends PureComponent {
    constructor(props){
      super(props);
      let record = props.location.query.record;
      let res = props.location.query.res;
      if(record&& typeof record === 'string'||typeof record === 'object'){
        record = JSON.parse(sessionStorage.getItem('query')).query.record;
      }
      if(res&& typeof res === 'string'||typeof res === 'object'){
        res = JSON.parse(sessionStorage.getItem('query')).query.res;
      }
      this.state={
        record,
        res,
      }
    }

    content = (pane) => {
        const picture = pane.photo;
        return (
            <Card>
                <Row>
                    <Col md={8}>
                        <div className={styles.woodName}>
                            <ul className={styles.indexmenu} style={{padding: '0 12px'}}>
                                {/*<li>*/}
                                {/*<img width={250} src={pane.photo_url} alt='暂无图片' />*/}
                                {/*</li>*/}
                                {picture.map(pic => <li><img width={250} ref={'imgBox'} src={pic ? pic : this.props.global && this.props.global.dark ? nophoto : nophotoLight}
                                                             alt='暂无图片'/></li>)}
                            </ul>
                        </div>
                    </Col>
                    <Col md={16}>
                        <div className={styles.woodNameThird}>
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={24} sm={24}>
                                    <div className={styles.break1}>物品名称：{pane.wpName}</div>
                                </Col>
                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={8} sm={24}>
                                    <div className={styles.break2}>人员类型：{pane.salx_mc}</div>
                                </Col>
                                <Col md={8} sm={24}>
                                    <div className={styles.break2}>数量：{pane.sl}</div>
                                </Col>
                                <Col md={8} sm={24}>
                                    <div className={styles.break2}>单位：{pane.unit}</div>
                                </Col>
                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={24} sm={24}>
                                    <div className={styles.break2}>特征：{pane.tz}</div>
                                </Col>
                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={24} sm={24}>
                                    <div className={styles.break2}>备注：{pane.remark}</div>
                                </Col>
                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={24} sm={24}>
                                    <div className={styles.break3}>处置结果：{pane.czjg}</div>
                                </Col>
                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={8} sm={24}>
                                    <div className={styles.break4}>物管员：{pane.wgr}</div>
                                </Col>
                                <Col md={8} sm={24}>
                                    <div className={styles.break4}>办案民警：{pane.bary}</div>
                                </Col>
                                <Col md={8} sm={24}>
                                    <div className={styles.break4}>接领人员：{pane.jlry}</div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    };

    render() {
        // const { data, wpId } = this.props;
        const { record,res } = this.state;
        return (
            <Tabs
                defaultActiveKey={res.wp_id.toString()}
                tabPosition='left'
                className={styles.indexmenu}
                type='card'
            >
                {record.map(pane => <TabPane tab={pane.wpName}
                                             key={pane.wp_id.toString()}>{this.content(pane)}</TabPane>)}
            </Tabs>
        );
    }
}



