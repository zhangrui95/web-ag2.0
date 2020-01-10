/*
 * SupervisionLog.js 督办日志组件
 * author：lyp
 * 20190422
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button, Steps, Tooltip } from 'antd';
import styles from './SupervisionLog.less';
import listStyles from '../../pages/common/listDetail.less';
// import DbHistory from '../../personnelFiles/HistoryModal';
// import SeeDetail from '../../personnelFiles/SeeDetail';

const { Step } = Steps;
@connect(({ share, global }) => ({
  share,
  global,
}))
export default class SupervisionLog extends PureComponent {
  state = {
    history: false, // 查看督办日志历史记录
    RestDbrz: '', // 督办日志的历史记录
    seeDetailVisible: false, // 点击督办日志中查看督办详情
    Isdetail: '', // 确认点击督办日志中哪一个'查看督办详情'
    NowDbrzState: '',
  };

  // 查看历史督办记录
  SeeHistory = (RestDbrz, detail) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/DbHistory',
        query: {
          record: RestDbrz,
          id: detail && detail.id ? detail.id : '1',
          fromPath: '/handlingArea/AreaPolice/UnareaDetail',
          detail,
        },
      }),
    );
    // this.setState({
    //   history: !!flag,
    //   RestDbrz,
    // });
  };
  // 关闭历史督办记录
  closeHistoryModal = flag => {
    this.setState({
      history: !!flag,
    });
  };

  seeDetail = (Isdetail, NowDbrz, detail) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/SeeDetail',
        query: {
          record: NowDbrz,
          id: detail && detail.wtid ? detail.wtid : '1',
          fromPath: this.props.frompath,
          detail,
          Isdetail,
        },
      }),
    );

    // this.setState({
    //   seeDetailVisible: !!flag,
    //   Isdetail,
    //   NowDbrzState: NowDbrz,
    // });
  };
  closeSeeDetailModal = () => {
    this.setState({
      seeDetailVisible: false,
    });
  };

  extraDescription = (NowDbrz, Isdetail, detailData) => {
    const { zrrMc, zrdwMc, clsj } = NowDbrz;
    return (
      <div style={{ position: 'relative', left: '-30px', top: '10px', paddingBottom: '10px' }}>
        <p className={styles.clsj_time}>
          <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={zrrMc || ''}>
            {zrrMc || ''}
          </Tooltip>
        </p>
        <p className={styles.clsj_time}>
          <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={zrdwMc || ''}>
            {zrdwMc || ''}
          </Tooltip>
        </p>
        <p className={styles.clsj_time}>
          <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={clsj || ''}>
            {clsj || ''}
          </Tooltip>
        </p>
        {Isdetail === '发起督办' ? (
          <div>
            <Button type="primary" onClick={() => this.seeDetail(Isdetail, NowDbrz, detailData)}>
              查看督办详情
            </Button>
          </div>
        ) : Isdetail === '处理反馈' && zrrMc && zrdwMc && clsj ? (
          <div>
            <Button type="primary" onClick={() => this.seeDetail(Isdetail, NowDbrz, detailData)}>
              查看反馈详情
            </Button>
          </div>
        ) : null}
      </div>
    );
  };

  render() {
    const { detailData, rowLayout, sureChangeLoading, superviseloading, isDb } = this.props;
    const { history, RestDbrz, seeDetailVisible, Isdetail, NowDbrzState } = this.state;
    const obj1 = document.getElementsByTagName('body');
    const objwidth = obj1[0].clientWidth;
    const objheight = obj1[0].clientHeight;
    const allheight = obj1[0].scrollHeight;
    let superveWidth = '';
    if (objheight >= allheight) {
      if (objwidth < 1280 || objwidth === 1280) {
        superveWidth = 905;
      } else if (objwidth > 1280 && objwidth < 1600) {
        superveWidth = 905;
      } else if (objwidth >= 1600 && objwidth < 1680) {
        superveWidth = 1225;
      } else if (objwidth >= 1680 && objwidth < 1920) {
        superveWidth = 1305;
      } else if (objwidth >= 1920) {
        superveWidth = 1458;
      }
    } else if (objheight < allheight) {
      if (objwidth < 1263 || objwidth === 1263) {
        superveWidth = 813;
      } else if (objwidth > 1263 && objwidth < 1583) {
        superveWidth = 813;
      } else if (objwidth >= 1583 && objwidth < 1663) {
        superveWidth = 1133;
      } else if (objwidth >= 1663 && objwidth < 1903) {
        superveWidth = 1213;
      } else if (objwidth >= 1903) {
        superveWidth = 1453;
      }
    }
    const dbrz = [];
    const dbHistoryData = [];
    let NowDbrz;
    if (detailData && detailData.dbList && detailData.dbList.length > 0) {
      dbrz.push(detailData.dbList[detailData.dbList.length - 1]);
      NowDbrz = dbrz[0].dbgj;
      for (let b = 0; b < detailData.dbList.length; b++) {
        if (detailData.dbList.length > 1 && b < detailData.dbList.length - 1) {
          dbHistoryData.push(detailData.dbList[b]);
        }
      }
    }
    const currentArr = [];
    let currentNum;
    if (detailData && detailData.dbList && NowDbrz && NowDbrz.length > 0) {
      for (let a = 0; a < NowDbrz.length; a++) {
        if (NowDbrz[a].iswc === 1) {
          currentArr.push(NowDbrz[a]);
        }

        if (currentArr[currentArr.length - 1].dbzt === '10') {
          currentNum = 0;
        } else if (currentArr[currentArr.length - 1].dbzt === '20') {
          currentNum = 1;
        } else if (currentArr[currentArr.length - 1].dbzt === '30') {
          currentNum = 2;
        } else if (currentArr[currentArr.length - 1].dbzt === '99') {
          currentNum = 3;
        }
      }
    }
    let dark = this.props.global && this.props.global.dark;
    return (
      <div className={dark ? '' : styles.lightBox}>
        {detailData && detailData.dbList && detailData.dbList.length > 0 ? (
          <div>
            <div className={styles.title}>
              <span className={styles.DbrzSpan}><div style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #fff', paddingLeft: '16px' }}>督办日志</div></span>
            </div>
            <div
              className={styles.message}
              style={{ padding: '0 38px 12px', borderBottom: '1px solid #171925' }}
            >
              <Row style={{ margin: '16px 46px' }}>
                <Col md={8} sm={24}>
                  <div className={listStyles.Indexfrom} style={{ top: 0 }}>
                    问题类型：
                  </div>
                  <div className={listStyles.Indextail} style={{ paddingLeft: 72 }}>
                    {detailData && detailData.wtlx ? detailData.wtlx : ''}
                  </div>
                </Col>
                <Col md={8} sm={24}>
                  <div className={listStyles.Indexfrom} style={{ top: 0 }}>
                    产生方式：
                  </div>
                  <div className={listStyles.Indextail} style={{ paddingLeft: 72 }}>
                    {detailData && detailData.fxfs ? detailData.fxfs : ''}
                  </div>
                </Col>
                <Col md={8} sm={24}>
                  <div className={listStyles.Indexfrom} style={{ top: 0 }}>
                    责任人：
                  </div>
                  <div className={listStyles.Indextail}>
                    {dbrz.length > 0 ? dbrz[0].bdbrMC : ''}
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: '16px 46px' }}>
                <Col md={24} sm={24}>
                  <div className={listStyles.Indexfrom} style={{ top: 0 }}>
                    责任单位：
                  </div>
                  <div className={listStyles.Indextail} style={{ paddingLeft: 72 }}>
                    {dbrz.length > 0 ? dbrz[0].bdbrDwmc : ''}
                  </div>
                </Col>
              </Row>
              <div className={styles.superve} style={{ width: superveWidth }}>
                <Steps current={currentNum}>
                  <Step
                    title={<span style={{ fontSize: 14 }}>发起督办</span>}
                    description={this.extraDescription(NowDbrz[0], '发起督办', detailData)}
                  />
                  <Step
                    title={<span style={{ fontSize: 14 }}>整改中</span>}
                    description={this.extraDescription(NowDbrz[1], '整改中', detailData)}
                  />
                  <Step
                    title={<span style={{ fontSize: 14 }}>处理反馈</span>}
                    description={this.extraDescription(NowDbrz[2], '处理反馈', detailData)}
                  />
                  <Step
                    title={<span style={{ fontSize: 14 }}>完成</span>}
                    description={this.extraDescription(NowDbrz[3], '完成', detailData)}
                  />
                </Steps>
                <div>
                  {detailData.zt === '待督办' ? null : (
                    <span style={{ float: 'right' }}>
                      {detailData.dbList.length > 1 ? (
                        <span
                          className={styles.recordList}
                          onClick={() => this.SeeHistory(dbHistoryData, detailData)}
                        >
                          查看历史督办记录
                        </span>
                      ) : null}
                      {isDb ? (
                        <span>
                          <Button
                            type="primary"
                            onClick={() => this.props.onceSupervise(true, detailData)}
                            loading={superviseloading}
                            style={{ marginLeft: 8, marginTop: 16 }}
                            className={
                              currentArr.length > 0 &&
                              currentArr[currentArr.length - 1].dbzt === '30' &&
                              currentArr[currentArr.length - 1].fkzt === '1'
                                ? ''
                                : styles.dbBtn
                            }
                            disabled={
                              currentArr.length > 0 &&
                              currentArr[currentArr.length - 1].dbzt === '30' &&
                              currentArr[currentArr.length - 1].fkzt === '1'
                                ? false
                                : true
                            }
                          >
                            再次督办
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => this.props.sureReform(detailData.dbid, true)}
                            loading={sureChangeLoading}
                            style={{ marginLeft: 8, marginTop: 16 }}
                            className={
                              currentArr.length > 0 &&
                              currentArr[currentArr.length - 1].dbzt === '30' &&
                              currentArr[currentArr.length - 1].fkzt === '1'
                                ? ''
                                : styles.dbBtn
                            }
                            disabled={
                              currentArr.length > 0 &&
                              currentArr[currentArr.length - 1].dbzt === '30'
                                ? false
                                : true
                            }
                          >
                            确认整改完毕
                          </Button>
                        </span>
                      ) : null}
                    </span>
                  )}
                </div>
              </div>
              {/*<Row>*/}
              {/*<Col md={24} sm={24}>*/}
              {/**/}
              {/*</Col>*/}
              {/*</Row>*/}
            </div>
          </div>
        ) : (
          <div>
            <div
              className={styles.title}
              style={{
                background: '#252c3c',
                color: '#fff',
              }}
            >
              <div style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: '16px' }}>
                问题信息
              </div>
            </div>
            <div className={styles.message} style={{ borderBottom: '1px solid #1e2230' }}>
              <Row>
                <Col md={6} sm={24} className={styles.xqcol}>
                  <div className={listStyles.Indexfrom}>问题类型：</div>
                  <div className={listStyles.Indextail}>
                    {detailData && detailData.wtlx ? detailData.wtlx : ''}
                  </div>
                </Col>
                <Col md={6} sm={24} className={styles.xqcol}>
                  <div className={listStyles.Indexfrom}>产生方式：</div>
                  <div className={listStyles.Indextail}>
                    {detailData && detailData.fxfs ? detailData.fxfs : ''}
                  </div>
                </Col>
                <Col md={6} sm={24} className={styles.xqcol}>
                  <div className={listStyles.Indexfrom}>告警时间：</div>
                  <div className={listStyles.Indextail}>
                    {detailData && detailData.gjsj ? detailData.gjsj : ''}
                  </div>
                </Col>
                <Col md={6} sm={24} className={styles.xqcol}>
                  <div className={listStyles.Indexfrom}>状态：</div>
                  <div className={listStyles.Indextail} style={{ paddingLeft: '32px' }}>
                    {detailData && detailData.zt ? detailData.zt : ''}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
        {/*{*/}
        {/*history ? (*/}
        {/*<DbHistory*/}
        {/*visible={history}*/}
        {/*closeHistoryModal={this.closeHistoryModal}*/}
        {/*dblist={RestDbrz}*/}
        {/*DetailData={detailData}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
        {/*{*/}
        {/*seeDetailVisible ? (*/}
        {/*<SeeDetail*/}
        {/*visible={seeDetailVisible}*/}
        {/*closeSeeDetailModal={this.closeSeeDetailModal}*/}
        {/*Isdetail={Isdetail}*/}
        {/*NowDbrz={NowDbrzState}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
      </div>
    );
  }
}
