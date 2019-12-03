/*
*  MessagePushLogModal.js 消息推送日志详情modal
* author：lyp
* 20190617
* */

import React, { PureComponent } from 'react';
import { Row, Col, Modal, Button, message,Card } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import XsajDetail from '../../CaseRealData/caseDetail';
// import XzajDetail from '../XzCaseRealData/caseDetail';
// import WpDetail from '../ItemRealData/itemDetail';
// import PersonIntoArea from '../CaseRealData/IntoArea';
// import DossierDetail from '../DossierData/DossierDetail';
// import PoliceDetail from '../PoliceRealData/policeDetail';
// import UncaseDetail from '../UnCaseRealData/uncaseDetail';
// import UnareaDetail from '../UnAreaRealData/unareaDetail';
// import UnitemDetail from '../UnItemRealData/unitemDetail';
// import UnXzCaseDetail from '../UnXzCaseRealData/caseDetail';
// import UnDossierDetail from '../UnDossierData/UnDossierDetail';
// import UnPoliceDetail from '../UnPoliceRealData/unpoliceDetail';
import styles from './index.less';
import { pushMattersDictCode, pushTypeDictCode } from '../../../utils/utils';

export default class MessagePushLogModal extends PureComponent {
    // 查看日志详细信息
    logDetailCheckOut = () => {
        // const { logDetail: item } = this.props;
        // console.log('item------------------->', item);
        // if (item.tssx_dm === pushMattersDictCode.POLICE) {
        //     if (item.system_id) {
        //         if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
        //             const divs = (
        //                 <div>
        //                     <PoliceDetail
        //                         id={item.system_id}
        //                         {...this.props}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '警情详情', content: divs, key: item.system_id };
        //             this.props.newDetail(AddNewDetail);
        //         } else {
        //             const divs = (
        //                 <div>
        //                     <UnPoliceDetail
        //                         id={item.ag_id}
        //                         wtid={item.wtid}
        //                         {...this.props}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '警情告警详情', content: divs, key: item.system_id };
        //             this.props.newDetail(AddNewDetail);
        //         }
        //
        //     } else {
        //         message.warning('暂无相关信息！');
        //     }
        // } else if (item.tssx_dm === pushMattersDictCode.CASE) {
        //     if (item.system_id) {
        //         if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
        //             const divs = (
        //                 <div>
        //                     <XsajDetail
        //                         {...this.props}
        //                         id={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '刑事案件预警详情', content: divs, key: item.system_id };
        //             this.props.newDetail(AddNewDetail);
        //         } else {
        //             const divs = (
        //                 <div>
        //                     <UncaseDetail
        //                         {...this.props}
        //                         id={item.wtid}
        //                         systemId={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '刑事案件告警详情', content: divs, key: item.wtid };
        //             this.props.newDetail(AddNewDetail);
        //         }
        //
        //     } else {
        //         message.warning('暂无相关信息！');
        //     }
        // } else if (item.tssx_dm === pushMattersDictCode.XZ) {
        //     if (item.system_id) {
        //         if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
        //             const divs = (
        //                 <div>
        //                     <XzajDetail
        //                         {...this.props}
        //                         systemId={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '行政案件预警详情', content: divs, key: item.system_id };
        //             this.props.newDetail(AddNewDetail);
        //         } else {
        //             const divs = (
        //                 <div>
        //                     <UnXzCaseDetail
        //                         {...this.props}
        //                         id={item.wtid}
        //                         systemId={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '行政案件告警详情', content: divs, key: item.wtid };
        //             this.props.newDetail(AddNewDetail);
        //         }
        //
        //     } else {
        //         message.warning('暂无相关信息！');
        //     }
        // } else if (item.tssx_dm === pushMattersDictCode.ITEM) {
        //     if (item.system_id) {
        //         if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
        //             const divs = (
        //                 <div>
        //                     <WpDetail
        //                         {...this.props}
        //                         newDetail={this.props.newDetail}
        //                         id={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '涉案物品预警详情', content: divs, key: item.system_id };
        //             this.props.newDetail(AddNewDetail);
        //         } else {
        //             const divs = (
        //                 <div>
        //                     <UnitemDetail
        //                         {...this.props}
        //                         id={item.wtid}
        //                         systemId={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '涉案物品告警详情', content: divs, key: item.wtid };
        //             this.props.newDetail(AddNewDetail);
        //         }
        //
        //     } else {
        //         message.warning('暂无相关信息！');
        //     }
        //
        // } else if (item.tssx_dm === pushMattersDictCode.AREA) {
        //     if (item.ryzjhm && item.system_id) {
        //         if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
        //             const divs = (
        //                 <div>
        //                     <PersonIntoArea
        //                         {...this.props}
        //                         newDetail={this.props.newDetail}
        //                         sfzh={item.ryzjhm}
        //                         ajbh={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '办案区预警详情', content: divs, key: item.ryzjhm + 'rqxx' };
        //             this.props.newDetail(AddNewDetail);
        //         } else {
        //             const divs = (
        //                 <div>
        //                     <UnareaDetail
        //                         {...this.props}
        //                         id={item.wtid}
        //                         baqId={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '人员在区告警详情', content: divs, key: item.wtid };
        //             this.props.newDetail(AddNewDetail);
        //         }
        //
        //     } else {
        //         message.warning('暂无相关信息！');
        //     }
        //
        // } else if (item.tssx_dm === pushMattersDictCode.DOSSIER) {
        //     if (item.system_id) {
        //         if (pushTypeDictCode.EARLYWARNING === item.tslx_dm) {
        //             const divs = (
        //                 <div>
        //                     <DossierDetail
        //                         {...this.props}
        //                         id={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const addDetail = { title: '卷宗预警详情', content: divs, key: item.system_id };
        //             this.props.newDetail(addDetail);
        //         } else {
        //             const divs = (
        //                 <div>
        //                     <UnDossierDetail
        //                         {...this.props}
        //                         id={item.ag_id}
        //                         wtid={item.wtid}
        //                         dossierId={item.system_id}
        //                     />
        //                 </div>
        //             );
        //             const AddNewDetail = { title: '卷宗告警详情', content: divs, key: item.wtid };
        //             this.props.newDetail(AddNewDetail);
        //         }
        //
        //     } else {
        //         message.warning('暂无相关信息！');
        //     }
        // }
    };
    // 关闭modal
    cancelModal = () => {
        this.props.showLogDetailVisible(false);
    };

    render() {
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayout = { sm: 24, md: 12, xl: 8 };
        const logDetail = this.props.location.query.record;
        console.log('logDetail=====>',logDetail)
        return (
          <Card style={{padding:'24px'}}>
                <Row gutter={rowLayout} style={{ lineHeight: '36px' }}>
                    <Col {...colLayout}>
                        推送事项：{logDetail ? <a onClick={this.logDetailCheckOut}>{logDetail.tssx_mc}</a> : ''}
                    </Col>
                    <Col {...colLayout}>接收单位：{logDetail ? logDetail.jsdw_mc : ''}</Col>
                    <Col {...colLayout}>接收人：{logDetail ? logDetail.jsr : ''}</Col>
                </Row>
                <Row gutter={rowLayout} style={{ lineHeight: '36px' }}>
                    <Col {...colLayout}>问题类型：{logDetail ? logDetail.wtlx_mc : ''}</Col>
                    <Col {...colLayout}>推送时间：{logDetail ? logDetail.tssj : ''}</Col>
                    <Col {...colLayout}>推送方式：{logDetail ? logDetail.tsfs_mc : ''}</Col>
                </Row>
                <Row style={{ lineHeight: '36px' }}>
                    <Col>推送内容：{logDetail ? logDetail.tsnr : ''}</Col>
                </Row>
          </Card>
        );
    }
}