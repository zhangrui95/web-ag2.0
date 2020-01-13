/*
 *  UndossierDetail.js 卷宗告警数据详情
 *  author：jhm
 *  20181205
 * */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Card,
  Steps,
  Popover,
  Button,
  Menu,
  Dropdown,
  Badge,
  Timeline,
  Table,
  Divider,
  Select,
  Icon,
  Avatar,
  List,
  Tooltip,
  Input,
  message,
  Pagination,
  Tag,
  Modal,
} from 'antd';

import liststyles from '../../common/listDetail.less';
import styles from './UnDossierDetail.less';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
// import FeedbackModal from '../../components/Common/FeedbackModal';
import { authorityIsTrue } from '../../../utils/authority';
import { autoheight, userResourceCodeDb } from '../../../utils/utils';
import SupervisionLog from '../../../components/Common/SupervisionLog';
import RenderEmpty from '../../../components/Common/RenderEmpty';
import { routerRedux } from 'dva/router';

const { Step } = Steps;
const { confirm } = Modal;
@connect(({ UnDossierData, common, MySuperviseData, AllDetail, global }) => ({
  UnDossierData,
  common,
  MySuperviseData,
  AllDetail,
  global,
  // loading: loading.models.alarmManagement,
}))
export default class DossierDetail extends PureComponent {
  state = {
    DossierDetailData: '',
    loading1: false, // 督办按钮状态，默认false没加载,true是点击后的加载状态
    loading2: false, // 再次督办按钮状态，默认false没加载,true是点击后的加载状态
    // 督办模态框
    superviseVisibleModal: false,
    // 点击列表的督办显示的基本信息
    superviseWtlx: '',
    superviseZrdw: '',
    superviseZrr: '',
    superviseZrdwId: '',
    id: '',
    sfzh: '',
    UnitemDetail: [],
    history: false, // 查看督办日志历史记录
    RestDbrz: '', // 督办日志的历史记录
    reformModal: false, // 确认整改完成的判定state
    dbid: '',
    sureChange: false, // 点击确认整改完毕时，如果点击过，判断过程的loading状态；

    seeDetail: false, // 点击督办日志中查看督办详情
    Isdetail: '', // 确认点击督办日志中哪一个'查看督办详情'
    NowDbrz: '',
    feedbackVisibleModal: false, // 反馈状态模态框
    feedbackButtonLoading: false, // 反馈按钮加载状态
    isDb: authorityIsTrue(userResourceCodeDb.dossier), // 督办权限
    record: '', // 表格信息
  };

  componentDidMount() {
    let res = this.props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.setState({
      record: res,
    });
    if (res.id && res.wtid && res.dossier_id) {
      this.getDossierDetail(res.id, res.wtid, res.dossier_id);
    }
    else if(res.id && (res.wtid || res.wt_id) && res.system_id){
        this.getDossierDetail(res.id , res.wtid || res.wt_id , res.system_id);
    }
    else if(res.agid && res.wtid && res.system_id){
      this.getDossierDetail(res.agid , res.wtid , res.system_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url ===  '/dossierPolice/DossierPolice/UnDossierDetail') {
      this.getDossierDetail(nextProps.location.query.record.id, nextProps.location.query.record.wtid,nextProps.location.query.record.dossier_id);
    }
  }

  // 再次督办
  onceSupervise = (flag, UnitemDetail) => {
    const { wtlx, kfgly_dwmc, kfgly_dwdm, kfgly, wtid, kfgly_zjhm } = UnitemDetail;
    // const {
    //   query: { record, id },
    // } = this.props.location;
    const { record } = this.state;
    this.props.dispatch({
      type: 'UnDossierData/getUnDossierByProblemId',
      payload: {
        pd: {
          wtid,
        },
        currentPage: 1,
        showCount: 9999,
      },
      callback: data => {
        if (
          data.list[0].dbzt === '00' ||
          (data.list[0].dbzt === '30' && data.list[0].fkzt === '1')
        ) {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/Supervise',
              query: {
                record: UnitemDetail,
                id: UnitemDetail && UnitemDetail.id ? UnitemDetail.id : '1',
                from: '督办',
                tzlx: 'jzwt',
                fromPath: '/dossierPolice/DossierPolice/UnDossierDetail',
                tab: '表格',
              },
            }),
          );
          // this.setState({
          //     superviseVisibleModal: !!flag,
          //     superviseWtlx: wtlx,
          //     superviseZrdw: kfgly_dwmc,
          //     superviseZrdwId: kfgly_dwdm,
          //     superviseZrr: kfgly,
          //     id: wtid,
          //     sfzh: kfgly_zjhm,
          //     // UnitemDetail: [],
          // });
        } else {
          message.warning('该问题已督办或暂无反馈信息');
          this.getDossierDetail(record.id, record.wtid, record.dossier_id);
        }
      },
    });
  };
  // 反馈
  feedback = (flag, unCaseDetailData) => {
    const { wtid } = unCaseDetailData;
    this.props.dispatch({
      type: 'UnDossierData/getUnDossierByProblemId',
      payload: {
        pd: {
          wtid: wtid,
        },
        currentPage: 1,
        showCount: 9999,
      },
      callback: data => {
        if (data.list[0].fkzt !== '1') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/FeedBack',
              query: {
                record: unCaseDetailData,
                id: unCaseDetailData && unCaseDetailData.id ? unCaseDetailData.id : '1',
                from: '反馈',
                tzlx: 'jzwt',
                fromPath: '/dossierPolice/DossierPolice/UnDossierDetail',
                tab: '详情',
              },
            }),
          );
          this.setState({
            feedbackVisibleModal: !!flag,
          });
        } else {
          message.warning('该问题已反馈');
          this.getDossierDetail(
            this.props.location.query.id,
            this.state.record.system_id,
            this.state.record.dossier_id,
          );
        }
      },
    });
  };
  // onReformCancel = () => {
  //   this.setState({
  //     reformModal: false,
  //   });
  // };

  getDossierDetail(id, wtid, dossierId) {
    this.props.dispatch({
      type: 'UnDossierData/getDossierDetail',
      payload: {
        dossier_id: dossierId,
        id: id,
        wtid: wtid,
      },
      callback: data => {
        if (data) {
          this.setState({
            DossierDetailData: data,
          });
          // 如果当前督办信息中读取状态为0，反馈状态为1，则更新读取状态
          if (data.dbList && data.dbList.length > 0) {
            const dqzt = data.dbList[0].dqzt;
            const fkzt = data.dbList[0].fkzt;
            if (dqzt === '0' && fkzt === '1') {
              this.changeReadStatus(data.dbid);
            }
          }
        }
      },
    });
  }

  // 更新未读数据状态
  changeReadStatus = id => {
    this.props.dispatch({
      type: 'MySuperviseData/changeReadStatus',
      payload: {
        dbid: id,
      },
      callback: data => {
        if (data && this.props.refreshTable && this.props.refreshNotice) {
          this.props.refreshTable();
          this.props.refreshNotice();
        }
      },
    });
  };
  // 关闭督办模态框
  closeModal = (flag, param) => {
    this.setState({
      superviseVisibleModal: !!flag,
    });
  };
  // 关闭反馈模态框
  closeFeedbackModal = (flag, param) => {
    this.setState({
      feedbackVisibleModal: !!flag,
    });
  };

  // 督办完成保存
  // saveModal = (flag, param, wjxx,newdbzrr,newdbzrdw,newdbzrdwid,newdbzrrsfzh, cljg_mc,cljg_yy) => {
  //   this.setState({
  //     superviseVisibleModal: !!flag,
  //     loading1: true,
  //   });
  //   const {superviseZrdwId, superviseZrdw, superviseZrr, sfzh} = this.state;
  //   if (newdbzrdwid && newdbzrdw && newdbzrr && newdbzrrsfzh) {
  //     this.props.dispatch({
  //       type: 'UnDossierData/SureSupervise',
  //       payload: {
  //         wtid: this.state.id,
  //         wjxx,
  //         id: this.state.id,
  //         zgyj: param,
  //         zrr_dwid: newdbzrdwid,
  //         zrr_dwmc: newdbzrdw,
  //         zrr_name: newdbzrr,
  //         zrr_sfzh: newdbzrrsfzh,
  //         ajbh: this.state.DossierDetailData && this.state.DossierDetailData.ajbh?this.state.DossierDetailData.ajbh:'',
  //         ajmc: this.state.DossierDetailData && this.state.DossierDetailData.ajmc?this.state.DossierDetailData.ajmc:'',
  //         cljg_mc:cljg_mc,
  //         cljg_yy:cljg_yy,
  //       },
  //       callback: (data) => {
  //         message.info('督办保存完成');
  //         this.getDossierDetail(this.props.id,this.props.wtid,this.props.dossierId);
  //         if(this.props.refreshTable){
  //           this.props.refreshTable();
  //         }
  //         this.setState({
  //           is_ok: '1',
  //           loading1: false,
  //         });
  //       },
  //     });
  //   }
  //   else {
  //     message.info('该数据无法督办');
  //     this.setState({
  //       is_ok: '1',
  //       loading1: false,
  //     });
  //   }
  //
  // };

  // 督办成功后刷新列表
  Refresh = flag => {
    const { record } = this.state;
    this.setState({
      superviseVisibleModal: !!flag,
      loading1: false,
    });
    this.getDossierDetail(record.id, record.wtid, record.dossier_id);
    if (this.props.refreshTable) {
      this.props.refreshTable();
    }
  };
  // 反馈
  saveFeedbackModal = params => {
    this.setState({
      feedbackVisibleModal: false,
      feedbackButtonLoading: true,
    });
    this.props.dispatch({
      type: 'MySuperviseData/saveFeedback',
      payload: params,
      callback: data => {
        this.setState({
          feedbackButtonLoading: false,
        });
        if (data) {
          message.success('反馈保存完成');
          const { record } = this.state;
          this.getDossierDetail(record.id, record.wtid, record.dossier_id);
          if (this.props.refreshTable) {
            this.props.refreshTable();
          }
        } else {
          message.error('反馈保存失败');
        }
      },
    });
  };

  // 确认整改完成
  sureReform = (dbid, flag) => {
    this.setState(
      {
        // reformModal: !!flag,
        dbid: dbid,
      },
      () => {
        let that = this;
        confirm({
          title: '确认整改完成?',
          centered: true,
          okText: '确认',
          cancelText: '取消',
          getContainer: document.getElementById('messageBox'),
          onOk() {
            that.handleReformSure();
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
      },
    );
  };

  Topdetail() {
    const { DossierDetailData, isDb } = this.state;
    let dark = this.props.global && this.props.global.dark;
    const rowLayout = { md: 8, lg: 24, xl: 48 };
    const colLayout = { sm: 24, md: 12, xl: 8 };
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        <Row gutter={rowLayout}>
          {/*<Col {...colLayout}>*/}
          {/*<span style={{ margin: '16px', display: 'block' }}>卷宗详情</span>*/}
          {/*</Col>*/}
          <Col style={{minHeight:0}}>
            <span>
              {DossierDetailData && DossierDetailData.zt === '待督办' && isDb ? (
                <Button
                  type='primary'
                  className={styles.TopMenu}
                  style={{margin:'12px 0 12px 16px'}}
                  loading={this.state.loading1}
                  onClick={() => this.onceSupervise(true, DossierDetailData)}
                >
                  督办
                </Button>
              ) : (
                ''
              )}
              {DossierDetailData &&
              (DossierDetailData.dbid === '' ||
                (DossierDetailData.dbList &&
                  DossierDetailData.dbList.length > 0 &&
                  DossierDetailData.dbList[DossierDetailData.dbList.length - 1].fkzt !== '1')) &&
              isDb ? (
                <Button
                  type='primary'
                  className={styles.TopMenu}
                  style={{margin:'12px 0 12px 16px'}}
                  loading={this.state.feedbackButtonLoading}
                  onClick={() => this.feedback(true, DossierDetailData)}
                >
                  反馈
                </Button>
              ) : null}
            </span>
          </Col>
        </Row>
      </div>
    );
  }

  handleReformSure = () => {
    this.setState({
      reformModal: false,
      sureChange: true,
    });
    this.props.dispatch({
      type: 'UnDossierData/sureRefomFetch',
      payload: {
        id: this.state.dbid,
      },
      callback: () => {
        message.success('督办整改完成');
        const { record } = this.state;
        this.getDossierDetail(record.id, record.wtid, record.dossier_id);
        this.setState({
          sureChange: false,
        });
        if (this.props.refreshTable) {
          this.props.refreshTable();
        }
      },
    });
  };
  // foot1 = () => {
  //   return (
  //     <div>
  //       <Button onClick={this.onReformCancel}>取消</Button>
  //       <Button type="primary" onClick={this.handleReformSure}>
  //         整改完毕
  //       </Button>
  //     </div>
  //   );
  // };

  renderDetail() {
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 8 };
    const colLayoutInName = { sm: 24, md: 4, xl: 4 };
    const colLayoutInData = { sm: 24, md: 20, xl: 20 };
    const specialcolLayout = { sm: 24, md: 24, xl: 24 };
    let dark = this.props.global && this.props.global.dark;
    const { DossierDetailData, isDb, sureChange, loading2 } = this.state;
    let stap1 = [];
    let stap2 = [];
    let relevanceInfo = DossierDetailData.jzgjList ? DossierDetailData.jzgjList : [];
    for (let i = 0; i < relevanceInfo.length; i++) {
      stap2.push(
        <div>
          <Row>所在单位：{relevanceInfo[i].police_unit}</Row>
          <Row>联系电话：{relevanceInfo[i].police_phone}</Row>
        </div>,
      );
    }
    for (let i = 0; i < relevanceInfo.length; i++) {
      stap1.push(
        <Timeline.Item
          dot={
            <div>
              <div
                style={
                  relevanceInfo[relevanceInfo.length - i - 1].dossierexceptionmc === '正常'
                    ? {
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        backgroundColor: '#5858DF',
                        textAlign: 'center',
                        marginBottom: 7,
                      }
                    : {
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        backgroundColor: 'rgb(255, 51, 102)',
                        textAlign: 'center',
                        marginBottom: 7,
                      }
                }
              >
                <p style={{ paddingTop: 7, color: '#fff' }}>{relevanceInfo.length - i}</p>
              </div>
            </div>
          }
          color={
            relevanceInfo[relevanceInfo.length - i - 1].dossierexceptionmc === '正常'
              ? '#00CC33'
              : 'rgb(255, 51, 102)'
          }
        >
          <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
            <Col md={2} span={24}>
              {relevanceInfo[relevanceInfo.length - i - 1].dossier_custody_categorymc}
            </Col>
            <Col md={4} span={24}>
              <Tooltip title={stap2[relevanceInfo.length - i - 1]}>
                <span>操作人：{relevanceInfo[relevanceInfo.length - i - 1].police_name}</span>
              </Tooltip>
            </Col>
          </Row>
          <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
            <Col md={2} span={24}>
              <Tag
                style={
                  relevanceInfo[relevanceInfo.length - i - 1].dossierexceptionmc === '正常'
                    ? {
                        background: '#00CC33',
                        width: 74,
                        textAlign: 'center',
                        cursor: 'default',
                      }
                    : {
                        background: 'rgb(255, 51, 102)',
                        width: 74,
                        textAlign: 'center',
                        cursor: 'default',
                      }
                }
              >
                {relevanceInfo[relevanceInfo.length - i - 1].dossierexceptionmc}
              </Tag>
            </Col>
            <Col md={4} span={24}>
              页数：{relevanceInfo[relevanceInfo.length - i - 1].dossier_now_pages_number}
            </Col>
            <Col md={4} span={24}>
              操作时间：{relevanceInfo[relevanceInfo.length - i - 1].trajectory_time}
            </Col>
            {relevanceInfo[relevanceInfo.length - i - 1].cause ? (
              <Col md={7} span={24}>
                操作原因：{relevanceInfo[relevanceInfo.length - i - 1].cause}
              </Col>
            ) : (
              ''
            )}
            {relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details &&
            relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details
              .cabinet_id ? (
              relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details
                .cabinet_id === '106202002' ? (
                <Col md={7} span={24}>
                  存储位置：
                  {`${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.kfmc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.qymc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.kwmc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.gmc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details
                      .mjjmc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.mmc
                  }`}
                </Col>
              ) : (
                <Col md={7} span={24}>
                  存储位置：
                  {`${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.kfmc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.qymc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.kwmc
                  }/${
                    relevanceInfo[relevanceInfo.length - i - 1].dossier_current_custody_details.gmc
                  }`}
                </Col>
              )
            ) : (
              ''
            )}
          </Row>
        </Timeline.Item>,
      );
    }

    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 260 + 'px' }}
        className={styles.detailBoxScroll}
      >
        <SupervisionLog
          detailData={DossierDetailData}
          sureChangeLoading={sureChange}
          superviseloading={loading2}
          isDb={isDb}
          onceSupervise={this.onceSupervise}
          sureReform={this.sureReform}
          rowLayout={rowLayout}
          frompath="/dossierPolice/DossierPolice/UnDossierDetail"
        />

        <Card
          title={<div style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}>卷宗信息</div>}
          className={dark ? styles.wpxxcard : styles.wpxxcard1}
          bordered={false}
        >
          <Row gutter={rowLayout}>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>案件名称：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajmc
                  ? DossierDetailData.ajxxList[0].ajmc
                  : DossierDetailData.ajmc
                  ? DossierDetailData.ajmc
                  : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>案件编号：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajbh
                  ? DossierDetailData.ajxxList[0].ajbh
                  : DossierDetailData.ajbh
                  ? DossierDetailData.ajbh
                  : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>案件类型：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajlx_mc
                  ? DossierDetailData.ajxxList[0].ajlx_mc
                  : DossierDetailData.ajlx_mc
                  ? DossierDetailData.ajlx_mc
                  : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>案件状态：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajzt
                  ? DossierDetailData.ajxxList[0].ajzt
                  : DossierDetailData.ajzt
                  ? DossierDetailData.ajzt
                  : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>办案单位：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].bardwmc
                  ? DossierDetailData.ajxxList[0].bardwmc
                  : DossierDetailData.bardw_name
                  ? DossierDetailData.bardw_name
                  : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>办案人：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 74 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].barxm
                  ? DossierDetailData.ajxxList[0].barxm
                  : DossierDetailData.bar
                  ? DossierDetailData.bar
                  : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>卷宗名称：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData && DossierDetailData.jzmc ? DossierDetailData.jzmc : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>卷宗编号：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData && DossierDetailData.jzbh ? DossierDetailData.jzbh : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>立卷人：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 74 }}>
                {DossierDetailData && DossierDetailData.ljr ? DossierDetailData.ljr : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>卷宗类别：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData && DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>卷宗页数：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData && DossierDetailData.jzys ? DossierDetailData.jzys : ''}
              </div>
            </Col>
            <Col {...colLayout}>
              <div className={styles.Indexfrom}>立卷时间：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData && DossierDetailData.ljsj ? DossierDetailData.ljsj : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col {...specialcolLayout} className={liststyles.JzInfoRight}>
              <div className={styles.Indexfrom}>卷宗描述：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 86 }}>
                {DossierDetailData && DossierDetailData.jzms ? DossierDetailData.jzms : ''}
              </div>
            </Col>
          </Row>
        </Card>
        <Card
          title={<div style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}>卷宗轨迹</div>}
          className={dark ? liststyles.card : liststyles.card1}
          bordered={false}
          style={{ marginBottom: 0 }}
        >
          {DossierDetailData &&
          DossierDetailData.jzgjList &&
          DossierDetailData.jzgjList.length > 0 ? (
            <div style={{ overflow: 'auto' }}>
              <Timeline style={{ marginTop: 20, marginLeft: 20 }}>{stap1}</Timeline>
            </div>
          ) : (
            <RenderEmpty emptyWords="暂无数据" />
          )}
        </Card>
      </div>
    );
  }

  render() {
    const {
      history,
      RestDbrz,
      UnitemDetail,
      reformModal,
      seeDetail,
      Isdetail,
      NowDbrz,
      superviseVisibleModal,
      feedbackVisibleModal,
    } = this.state;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div className={dark ? '' : styles.lightBox}>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail()}</div>

        {/*{superviseVisibleModal ?*/}
        {/*<SuperviseModal*/}
        {/*{...this.props}*/}
        {/*visible={superviseVisibleModal}*/}
        {/*closeModal={this.closeModal}*/}
        {/*// saveModal={this.saveModal}*/}
        {/*caseDetails={this.state.DossierDetailData}*/}
        {/*getRefresh={this.Refresh}*/}
        {/*// 点击列表的督办显示的四个基本信息*/}
        {/*wtlx={this.state.superviseWtlx}*/}
        {/*wtid={this.state.id}*/}
        {/*// zrdw={this.state.superviseZrdw}*/}
        {/*// zrdwId={this.state.superviseZrdwId}*/}
        {/*// zrr={this.state.superviseZrr}*/}
        {/*id={this.state.id}*/}
        {/*// zjhm={this.state.sfzh}*/}
        {/*from='督办'*/}
        {/*/>*/}
        {/*: ''*/}
        {/*}*/}
        {/*{*/}
        {/*feedbackVisibleModal ? (*/}
        {/*<FeedbackModal*/}
        {/*closeModal={this.closeFeedbackModal}*/}
        {/*saveModal={this.saveFeedbackModal}*/}
        {/*visible={feedbackVisibleModal}*/}
        {/*detailsData={this.state.DossierDetailData}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
        {/*{reformModal ? (*/}
        {/*<Modal*/}
        {/*maskClosable={false}*/}
        {/*visible={reformModal}*/}
        {/*title={<p>提示</p>}*/}
        {/*width="1000px"*/}
        {/*footer={this.foot1()}*/}
        {/*onCancel={() => this.onReformCancel()}*/}
        {/*// onOk={() => this.onOk(this.props.id)}*/}
        {/*centered={true}*/}
        {/*className={styles.indexdeepmodal}*/}
        {/*>*/}
        {/*<div className={styles.question}>问题是否已经整改完毕？</div>*/}
        {/*</Modal>*/}
        {/*) : (*/}
        {/*''*/}
        {/*)}*/}
      </div>
    );
  }
}
