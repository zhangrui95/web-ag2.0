/*
*  MessagePushLogModal.js 消息推送日志详情modal
* author：lyp
* 20190617
* */

import React, {PureComponent} from 'react';
import {Row, Col, Modal, Button, message, Card} from 'antd';
import {connect} from 'dva';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './index.less';
import {pushMattersDictCode, pushTypeDictCode} from '../../../utils/utils';
import {routerRedux} from "dva/router";

@connect()
export default class MessagePushLogModal extends PureComponent {
    // 查看日志详细信息
    logDetailCheckOut = () => {
        let item = this.props.location.query.record;
        if (item.tssx_dm === pushMattersDictCode.POLICE) {
            if (item.system_id) {//警情详情
                if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/receivePolice/AlarmData/policeDetail',
                            query: {record: item, id: item.system_id},
                        }),
                    )
                } else {//警情告警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/receivePolice/AlarmPolice/unpoliceDetail',
                            query: {record: item, id: item.ag_id, wtid: item.wtid, system_id: item.system_id},
                        }),
                    )
                }

            } else {
                message.warning('暂无相关信息！');
            }
        } else if (item.tssx_dm === pushMattersDictCode.CASE) {
            if (item.system_id) {
                if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {//刑事案件预警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                            query: {record: item, id: item.system_id},
                        }),
                    )
                } else {
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                            query: {record: item, id: item.wtid, system_id: item.system_id},
                        }),
                    )
                }
            } else {
                message.warning('暂无相关信息！');
            }
        } else if (item.tssx_dm === pushMattersDictCode.XZ) {
            if (item.system_id) {
                if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {//行政案件预警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
                            query: {record: item, id: item.system_id, system_id: item.system_id},
                        }),
                    )
                } else {
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
                            query: {record: item, id: item.wtid},
                        }),
                    )
                }

            } else {
                message.warning('暂无相关信息！');
            }
        } else if (item.tssx_dm === pushMattersDictCode.ITEM) {
            if (item.system_id) {
                if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {//涉案物品预警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/articlesInvolved/ArticlesData/itemDetail',
                            query: {record: item, id: item.system_id},
                        }),
                    )
                } else {//涉案物品告警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
                            query: {record: item, id: item.wtid, system_id: item.system_id},
                        }),
                    )
                }

            } else {
                message.warning('暂无相关信息！');
            }

        } else if (item.tssx_dm === pushMattersDictCode.AREA) {
            if (item.ryzjhm && item.system_id) {
                if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {//办案区预警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/handlingArea/AreaData/areaDetail',
                            query: {record: item, id: item.system_id, sfzh: item.ryzjhm, ajbh: item.system_id},
                        }),
                    );
                } else {//人员在区告警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/handlingArea/AreaPolice/UnareaDetail',
                            query: {record: item, id: item.wtid, baqId: item.system_id},
                        }),
                    );
                }

            } else {
                message.warning('暂无相关信息！');
            }

        } else if (item.tssx_dm === pushMattersDictCode.DOSSIER) {
            if (item.system_id) {
                if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {//卷宗预警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/dossierPolice/DossierData/DossierDetail',
                            query: {record: item, id: item.dossier_id},
                        }),
                    );
                } else {//卷宗告警详情
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
                            query: {record: item, id: item.ag_id, wtid: item.wtid, dossierId: item.system_id},
                        }),
                    );
                }

            } else {
                message.warning('暂无相关信息！');
            }
        }
    };
    // 关闭modal
    cancelModal = () => {
        this.props.showLogDetailVisible(false);
    };

    render() {
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        let logDetail = this.props.location.query.record;
        if (typeof logDetail == 'string') {
            logDetail = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        return (
            <Card style={{padding: '24px'}}>
                <Row gutter={rowLayout} style={{lineHeight: '36px'}}>
                    <Col {...colLayout}>
                        推送事项：{logDetail ? <a onClick={this.logDetailCheckOut}>{logDetail.tssx_mc}</a> : ''}
                    </Col>
                    <Col {...colLayout}>接收单位：{logDetail ? logDetail.jsdw_mc : ''}</Col>
                    <Col {...colLayout}>接收人：{logDetail ? logDetail.jsr : ''}</Col>
                </Row>
                <Row gutter={rowLayout} style={{lineHeight: '36px'}}>
                    <Col {...colLayout}>问题类型：{logDetail ? logDetail.wtlx_mc : ''}</Col>
                    <Col {...colLayout}>推送时间：{logDetail ? logDetail.tssj : ''}</Col>
                    <Col {...colLayout}>推送方式：{logDetail ? logDetail.tsfs_mc : ''}</Col>
                </Row>
                <Row style={{lineHeight: '36px'}}>
                    <Col>推送内容：{logDetail ? logDetail.tsnr : ''}</Col>
                </Row>
            </Card>
        );
    }
}
