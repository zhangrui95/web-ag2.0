/*
 * 首页我的分享查看
 * author：zr
 * 20190424
 * */
import React, { PureComponent } from 'react';
import { Col, Row, Modal } from 'antd';
import { connect } from 'dva';
// import styles from '../../pages/ShowData/Show.less';
import styles from './HomepageCommon.less';
import { routerRedux } from 'dva/router';

@connect(({ home,global }) => ({
  home,global
}))
export default class MyShare extends PureComponent {
  goCaseData = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname:
          record.tzlx === 'wpwt'
            ? '/articlesInvolved/ArticlesPolice/unitemDetail'
            : record.tzlx === 'xzajwt1'
            ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
            : record.tzlx === 'xzajwt2'
            ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
            : record.tzlx === 'xzajwt3'
            ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
            : record.tzlx === 'jqwt'
            ? '/receivePolice/AlarmPolice/unpoliceDetail'
            : record.tzlx === 'xsajwt1'
            ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
            : record.tzlx === 'xsajwt2'
            ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
            : record.tzlx === 'xsajwt3'
            ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
            : record.tzlx === 'baqwt'
            ? '/handlingArea/AreaPolice/UnareaDetail'
            : record.tzlx === 'jzwt'
            ? '/dossierPolice/DossierPolice/UnDossierDetail'
            : record.tzlx === 'wpxx'
            ? '/articlesInvolved/ArticlesPolice/unitemDetail'
            : record.tzlx === 'xzajxx1'
            ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
            : record.tzlx === 'xzajxx2'
            ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
            : record.tzlx === 'xzajxx3'
            ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
            : record.tzlx === 'jqxx'
            ? '/receivePolice/AlarmData/policeDetail'
            : record.tzlx === 'xsajxx1'
            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
            : record.tzlx === 'xsajxx2'
            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
            : record.tzlx === 'xsajxx3'
            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
            : record.tzlx === 'baqxx'
            ? '/handlingArea/AreaData/areaDetail'
            : record.tzlx === 'jzxx'
            ? '/dossierPolice/DossierData/DossierDetail'
            : record.tzlx === 'jqyj'
            ? '/receivePolice/AlarmData/policeDetail'
            : record.tzlx === 'xzajyj1'
            ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
            : record.tzlx === 'xsajyj1'
            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
            : record.tzlx === 'xzajyj2'
            ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
            : record.tzlx === 'xsajyj2'
            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
            : record.tzlx === 'xzajyj3'
            ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
            : record.tzlx === 'xsajyj3'
            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
            : record.tzlx === 'baqyj'
            ? '/handlingArea/AreaData/areaDetail'
            : record.tzlx === 'wpyj'
            ? '/articlesInvolved/ArticlesData/itemDetail'
            : record.tzlx === 'jzyj'
            ? '/dossierPolice/DossierData/DossierDetail'
            : '',
        query: {
          id: record.tzlx === 'jqwt' ? record.id : record.agid,
          system_id: record.system_id,
          wtid: record.wtid,
          record: record,
        },
      }),
    );
  };
  render() {
    console.log('this.props', this.props);
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
      let dark = this.props.global&&this.props.global.dark;
    return (
      /*<Modal
        title="我的分享"
        visible={this.props.visibleShare}
        onCancel={this.props.handleCancel}
        footer={null}
        width={900}
        maskClosable={false}
        className={styles.myNewsModal}
        centered={true}
      >
        <Row>
          {this.props.tabs === 's2' ? (
            <Col
              span={
                this.props.shareDatail &&
                this.props.shareDatail.shareItem &&
                this.props.shareDatail.shareItem.length > 20
                  ? 6
                  : 8
              }
            >
              分享人：
              {this.props.shareDatail && this.props.shareDatail.czr
                ? this.props.shareDatail.czr
                : ''}
            </Col>
          ) : (
            <Col
              span={
                this.props.shareDatail &&
                this.props.shareDatail.shareItem &&
                this.props.shareDatail.shareItem.length > 20
                  ? 6
                  : 8
              }
            >
              被分享人：
              {this.props.shareDatail && this.props.shareDatail.fx_xm
                ? this.props.shareDatail.fx_xm
                : ''}
            </Col>
          )}
          <Col
            span={
              this.props.shareDatail &&
              this.props.shareDatail.shareItem &&
              this.props.shareDatail.shareItem.length > 20
                ? 12
                : 10
            }
          >
            分享事项：
            <a href="javascript:;" onClick={() => this.props.goLook(this.props.shareDatail, 2)}>
              {this.props.shareDatail && this.props.shareDatail.sx ? this.props.shareDatail.sx : ''}
            </a>
          </Col>
          <Col span={6}>
            分享时间：
            {this.props.shareDatail && this.props.shareDatail.czsj
              ? this.props.shareDatail.czsj
              : ''}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            分享类型：
            {this.props.shareDatail && this.props.shareDatail.lx ? this.props.shareDatail.lx : ''}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className={styles.content}>分享建议：</div>
            <div className={styles.content} style={{ width: '700px' }}>
              {this.props.shareDatail && this.props.shareDatail.fxjy
                ? this.props.shareDatail.fxjy
                : ''}
            </div>
          </Col>
        </Row>
      </Modal>*/
      <div>
        <div style={{ backgroundColor: dark ? '#202839' : '#fff' }}>
          <span style={{ margin: '16px', display: 'block', lineHeight: '61px', fontSize: 20 }}>
            我的分享
          </span>
        </div>
        <div className={styles.myNewsMessage} style={{ backgroundColor: dark ? '#202839' : '#fff' }}>
          <Row gutter={rowLayout} style={{ marginBottom: 24 }}>
            <Col span={8}>
              被分享人：
              {this.props.location &&
              this.props.location.query &&
              this.props.location.query.record &&
              this.props.location.query.record.fx_xm
                ? this.props.location.query.record.fx_xm
                : ''}
            </Col>
            <Col span={8}>
              分享事项：
              <a
                href="javascript:;"
                onClick={() => this.goCaseData(this.props.location.query.record)}
              >
                {this.props.location &&
                this.props.location.query &&
                this.props.location.query.record &&
                this.props.location.query.record.sx
                  ? this.props.location.query.record.sx
                  : ''}
              </a>
            </Col>
            <Col span={8}>
              分享时间：
              {this.props.location &&
              this.props.location.query &&
              this.props.location.query.record &&
              this.props.location.query.record.czsj
                ? this.props.location.query.record.czsj
                : ''}
            </Col>
          </Row>
          <Row gutter={rowLayout} style={{ marginBottom: 24 }}>
            <Col span={24}>
              分享类型：
              {this.props.location &&
              this.props.location.query &&
              this.props.location.query.record &&
              this.props.location.query.record.lx
                ? this.props.location.query.record.lx
                : ''}
            </Col>
          </Row>
          <Row gutter={rowLayout} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <div className={styles.content}>分享建议：</div>
              <div className={styles.content} style={{ width: '700px' }}>
                {this.props.location &&
                this.props.location.query &&
                this.props.location.query.record &&
                this.props.location.query.record.fxjy
                  ? this.props.location.query.record.fxjy
                  : ''}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
