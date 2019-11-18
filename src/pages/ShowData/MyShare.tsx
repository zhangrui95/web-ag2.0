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
import {routerRedux} from "dva/router";

@connect(({ home }) => ({
  home,
}))
export default class MyShare extends PureComponent {
  goCaseData = (record) =>{
    this.props.dispatch(
      routerRedux.push({
        pathname:
          record.tzlx === 'wpwt'
            ? '/CaseItem/UnItem/Transfer/Index'
            : record.tzlx === 'xzajwt1'
            ? '/register/alarm/alarmAdministration/Index'
            : record.tzlx === 'xzajwt2'
              ? '/Enforcement/alarm/alarmAdministration/Index'
              : record.tzlx === 'xzajwt3'
                ? '/newregister/newalarm/newalarmAdministration'
                : record.tzlx === 'jqwt'
                  ? '/Reception/unpolice/Transfer/Index'
                  : record.tzlx === 'xsajwt1'
                    ? '/register/alarm/alarmCriminal/Index'
                    : record.tzlx === 'xsajwt2'
                      ? '/Enforcement/alarm/alarmCriminal/Index'
                      : record.tzlx === 'xsajwt3'
                        ? '/newregister/newalarm/newalarmCriminal'
                        : record.tzlx === 'baqwt'
                          ? '/HandArea/UnArea/Transfer/Index'
                          : record.tzlx === 'jzwt'
                            ? '/Dossier/undossier/Transfer/Index'
                            : record.tzlx === 'wpxx'
                              ? '/CaseItem/Item/Transfer/Index'
                              : record.tzlx === 'xzajxx1'
                                ? '/register/case/Administration/Index'
                                : record.tzlx === 'xzajxx2'
                                  ? '/Enforcement/case/Administration/Index'
                                  : record.tzlx === 'xzajxx3'
                                    ? '/newregister/newcase/newAdministration'
                                    : record.tzlx === 'jqxx'
                                      ? '/Reception/police/Transfer/Index'
                                      : record.tzlx === 'xsajxx1'
                                        ? '/register/case/criminal/Index'
                                        : record.tzlx === 'xsajxx2'
                                          ? '/Enforcement/case/criminal/Index'
                                          : record.tzlx === 'xsajxx3'
                                            ? '/newregister/newcase/newcriminal'
                                            : record.tzlx === 'baqxx'
                                              ? '/HandArea/Area/Transfer/Index'
                                              : record.tzlx === 'jzxx'
                                                ? '/Dossier/dossier/Transfer/Index'
                                                : record.tzlx === 'jqyj'
                                                  ? '/Reception/PoliceIndex'
                                                  : record.tzlx === 'xzajyj1'
                                                    ? '/register/warn/warnAdministration'
                                                    : record.tzlx === 'xsajyj1'
                                                      ? '/register/warn/warnCriminal'
                                                      : record.tzlx === 'xzajyj2'
                                                        ? '/Enforcement/warn/warnAdministration'
                                                        : record.tzlx === 'xsajyj2'
                                                          ? '/Enforcement/warn/warnCriminal'
                                                          : record.tzlx === 'xzajyj3'
                                                            ? '/newregister/newwarn/newwarnAdministration'
                                                            : record.tzlx === 'xsajyj3'
                                                              ? '/newregister/newwarn/newwarnCriminal'
                                                              : record.tzlx === 'baqyj'
                                                                ? '/HandArea/AreaIndex'
                                                                : record.tzlx === 'wpyj'
                                                                  ? '/CaseItem/ItemIndex'
                                                                  : record.tzlx === 'jzyj'
                                                                    ? '/Dossier/DossierIndex'
                                                                    : '',
        query: {
          id: record.tzlx === 'jqwt' ? record.id : record.agid,
          system_id: record.system_id,
          wtid: record.wtid,
          record: record,
        },
      }),
    );
  }
  render() {
    console.log('this.props',this.props);
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
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
      <div>我的分享
        <div style={{ backgroundColor: '#202839' }}>
          <span style={{ margin: '16px', display: 'block',lineHeight:'61px',fontSize:20 }}>我的消息</span>
        </div>
        <div className={styles.myNewsMessage}>
          <Row gutter={rowLayout} style={{marginBottom:24}}>
            <Col span={8}>被分享人：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.fx_xm?this.props.location.query.record.fx_xm:''}</Col>
            <Col span={8}>分享事项：<a href="javascript:;" onClick={() => this.goCaseData(this.props.location.query.record)}>{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.sx?this.props.location.query.record.sx:''}</a></Col>
            <Col span={8}>分享时间：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.czsj?this.props.location.query.record.czsj:''}</Col>
          </Row>
          <Row gutter={rowLayout} style={{marginBottom:24}}>
            <Col span={24}>
              分享类型：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.lx?this.props.location.query.record.lx:''}
            </Col>
          </Row>
          <Row gutter={rowLayout} style={{marginBottom:24}}>
            <Col span={24}>
              <div className={styles.content}>分享建议：</div>
              <div className={styles.content} style={{ width: '700px' }}>
                {this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.fxjy?this.props.location.query.record.fxjy:''}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
