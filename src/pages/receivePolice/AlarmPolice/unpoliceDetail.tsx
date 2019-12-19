import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
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
  message,
  Timeline,
  Modal,
} from 'antd';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzajDetail from '../XzCaseRealData/caseDetail';
// import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';
import liststyles from '../../common/listDetail.less';
import CaseModalStep from '../../../components/Common/CaseModalStep';
// import FeedbackModal from '../../components/Common/FeedbackModal';
import SupervisionLog from '../../../components/Common/SupervisionLog';

import styles from './unpoliceDetail.less';
import { authorityIsTrue } from '../../../utils/authority';
import { autoheight, userResourceCodeDb } from '../../../utils/utils';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const { Step } = Steps;
@connect(({ UnPoliceData, loading, MySuperviseData }) => ({
  UnPoliceData,
  loading,
  MySuperviseData, // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class unpoliceDetail extends PureComponent {
  state = {
    policeDetails: null,
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
    // 问题判定的来源参数
    from: '',
    // 子系统的id
    systemId: '',
    history: false, // 查看督办日志历史记录
    RestDbrz: '', // 督办日志的历史记录
    reformModal: false, // 确认整改完成的判定state
    sureChange: false, // 点击确认整改完毕时，如果点击过，判断过程的loading状态；
    sabar: '',
    seeDetail: false, // 点击督办日志中查看督办详情
    Isdetail: '', // 确认点击督办日志中哪一个'查看督办详情'
    NowDbrz: '',
    feedbackVisibleModal: false, // 反馈状态模态框
    feedbackButtonLoading: false, // 反馈按钮加载状态
    isDb: authorityIsTrue(userResourceCodeDb.police), // 督办权限
  };

  componentDidMount() {
    let res = this.props.location.query.record;
    if(typeof res == 'string'){
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    if (this.props.location && this.props.location.query && this.props.location.query.record) {
      this.getDetail(this.props.location.query.record);
    }
  }

  componentWillReceiveProps(nextProps) {
   if(nextProps.history.location.query.isReset&&nextProps.history.location.pathname==='/receivePolice/AlarmPolice/unpoliceDetail'){
        this.getDetail(this.props.location.query.record);
        this.props.history.replace(nextProps.history.location.pathname+'?id='+nextProps.location.query.id+'&record='+nextProps.location.query.record);
   }
  }

  getDetail(record) {
    this.props.dispatch({
      type: 'UnPoliceData/UnPoliceDetailFetch',
      payload: {
        id: this.props.location.query.id,
        wtid: record.wtid || record.wt_id,
      },
      callback: data => {
        if (data) {
          this.setState({
            policeDetails: data,
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
  // 根据案件编号打开案件窗口
  openCaseDetail = (policeDetails) => {
    if (policeDetails.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: { record:policeDetails,id: policeDetails.system_id },
        }),
      )
      // const divs = (
      //     <div>
      //         <CaseDetail
      //             {...this.props}
      //             id={systemId}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '刑事案件详情', content: divs, key: systemId };
      // this.props.newDetail(AddNewDetail);
    } else if (policeDetails.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { record:policeDetails,id: policeDetails.system_id },
        }),
      )
      // const divs = (
      //     <div>
      //         <XzajDetail
      //             {...this.props}
      //             systemId={systemId}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '行政案件详情', content: divs, key: systemId };
      // this.props.newDetail(AddNewDetail);
    }
  };
  // 问题判定
  onceSupervise = (flag, policeDetails) => {
    const { wtlx, kfgly_dwmc, kfgly_dwdm, kfgly, wtid, kfgly_zjhm } = policeDetails;
    this.props.dispatch({
      type: 'UnPoliceData/getUnPoliceByProblemId',
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
              query: { record:policeDetails,id: policeDetails && policeDetails.id ? policeDetails.id : '1',from:'督办',tzlx:'jqxx',fromPath:'/receivePolice/AlarmPolice/unpoliceDetail',tab:'详情'},
            }),
          )
          // this.setState({
          //   superviseVisibleModal: !!flag,
          //   superviseWtlx: wtlx,
          //   id: wtid,
          //   sfzh: kfgly_zjhm,
          // });
        } else {
          message.warning('该问题已督办或暂无反馈信息');
          if (
            this.props.location &&
            this.props.location.query &&
            this.props.location.query.record
          ) {
            this.getDetail(this.props.location.query.record);
          }
        }
      },
    });
  };
  // 反馈
  feedback = (flag, unCaseDetailData) => {
    const { wtid } = unCaseDetailData;
    this.props.dispatch({
      type: 'UnPoliceData/getUnPoliceByProblemId',
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
              query: { record:unCaseDetailData,id: unCaseDetailData && unCaseDetailData.id ? unCaseDetailData.id : '1',from:'反馈',tzlx:'jqxx',fromPath:'/receivePolice/AlarmPolice/unpoliceDetail',tab:'详情'},
            }),
          )
          // this.setState({
          //   feedbackVisibleModal: !!flag,
          // });
        } else {
          message.warning('该问题已反馈');
          if (
            this.props.location &&
            this.props.location.query &&
            this.props.location.query.record
          ) {
            this.getDetail(this.props.location.query.record);
          }
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
  // 督办成功后刷新列表
  Refresh = flag => {
    this.setState({
      superviseVisibleModal: !!flag,
      loading1: false,
      loading2: false,
    });
    if (this.props.location && this.props.location.query && this.props.location.query.record) {
      this.getDetail(this.props.location.query.record);
    }
    if (this.props.getPolice) {
      this.props.getPolice({ currentPage: this.props.current, pd: this.props.formValues });
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
          if (
            this.props.location &&
            this.props.location.query &&
            this.props.location.query.record
          ) {
            this.getDetail(this.props.location.query.record);
          }
          if (this.props.getPolice) {
            this.props.getPolice({ currentPage: this.props.current, pd: this.props.formValues });
          }
        } else {
          message.error('反馈保存失败');
        }
      },
    });
  };

  Topdetail() {
    const { policeDetails, isDb } = this.state;
    return (
      <div style={{ backgroundColor: '#252C3C', margin: '16px 0' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {/*<span style={{ margin: '16px', display: 'block' }}>警情详情</span>*/}
          </Col>
          {isDb ? (
            <Col>
              <span style={{ float: 'right', margin: '12px 16px 12px 0' }}>
                {policeDetails && policeDetails.zt === '待督办' ? (
                  <Button
                    className={styles.TopMenu}
                    loading={this.state.loading1}
                    onClick={() => this.onceSupervise(true, policeDetails)}
                  >
                    督办
                  </Button>
                ) : (
                  ''
                )}
                {policeDetails &&
                (policeDetails.dbid === '' ||
                  (policeDetails.dbList &&
                    policeDetails.dbList.length > 0 &&
                    policeDetails.dbList[policeDetails.dbList.length - 1].fkzt !== '1')) ? (
                  <Button
                    className={styles.TopMenu}
                    loading={this.state.feedbackButtonLoading}
                    onClick={() => this.feedback(true, policeDetails)}
                  >
                    反馈
                  </Button>
                ) : null}
              </span>
            </Col>
          ) : null}
        </Row>
      </div>
    );
  }

  // 确认整改完成
  sureReform = (dbid, flag) => {
    this.setState({
      reformModal: !!flag,
      dbid: dbid,
    });
  };
  handleReformSure = () => {
    this.setState({
      reformModal: false,
      sureChange: true,
    });
    this.props.dispatch({
      type: 'UnPoliceData/sureRefomFetch',
      payload: {
        id: this.state.dbid,
      },
      callback: () => {
        message.success('督办整改完成');
        if (this.props.location && this.props.location.query && this.props.location.query.record) {
          this.getDetail(this.props.location.query.record);
        }
        this.setState({
          sureChange: false,
        });
        if (this.props.refreshTable) {
          this.props.refreshTable();
        }
      },
    });
  };
  foot1 = () => {
    return (
      <div>
        <Button onClick={this.onReformCancel}>取消</Button>
        <Button type="primary" onClick={this.handleReformSure}>
          整改完毕
        </Button>
      </div>
    );
  };
  onReformCancel = () => {
    this.setState({
      reformModal: false,
    });
  };

  renderDetail() {
    const { getFieldDecorator } = this.props.form;
    // const { policeData:{ policeDetails } } = this.props;
    const { policeDetails, isDb, sureChange, loading2 } = this.state;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    return (
      <div
        style={{ background: '#252C3C', height: autoheight() - 290 + 'px' }}
        className={styles.detailBoxScroll}
      >
        <SupervisionLog
          detailData={policeDetails}
          rowLayout={rowLayout}
          sureChangeLoading={sureChange}
          superviseloading={loading2}
          isDb={isDb}
          onceSupervise={this.onceSupervise}
          sureReform={this.sureReform}
          frompath='/receivePolice/AlarmPolice/unpoliceDetail'
        />
        <div className={styles.title}>| 接警信息</div>
        <div className={styles.message}>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警来源：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.jjly_mc ? policeDetails.jjly_mc : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警时间：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.jjsj ? policeDetails.jjsj : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: '46px' }}>
                {policeDetails && policeDetails.jjr
                  ? policeDetails.jjr.split(',')[policeDetails.jjr.split(',').length - 1]
                  : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>管辖单位：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.jjdw
                  ? policeDetails.jjdw.split(',')[policeDetails.jjdw.split(',').length - 1]
                  : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>报案人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: '46px' }}>
                {policeDetails && policeDetails.bar ? policeDetails.bar : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>报案人联系方式：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: '102px' }}>
                {policeDetails && policeDetails.bar_lxfs ? policeDetails.bar_lxfs : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警内容：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.jjnr ? policeDetails.jjnr : ''}
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.title}>| 处警信息</div>
        <div className={styles.message}>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警单位：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjdw ? policeDetails.cjdw : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警时间：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjr_cjsj ? policeDetails.cjr_cjsj : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>到达时间：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjddsj ? policeDetails.cjddsj : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警民警：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjr
                  ? policeDetails.cjr.split(',')[policeDetails.cjr.split(',').length - 1]
                  : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处置结果：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.czjg_mc ? policeDetails.czjg_mc : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警情况：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjqk ? policeDetails.cjqk : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处理意见：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cj_clyj ? policeDetails.cj_clyj : ''}
              </div>
            </Col>
          </Row>
        </div>
        {policeDetails &&
        (policeDetails.ajbh ||
          policeDetails.barxm ||
          policeDetails.ajmc ||
          policeDetails.badw_mc ||
          policeDetails.ajxz_mc ||
          policeDetails.jyaq) ? (
          <div>
            <div className={styles.title}>案件信息</div>
            <div className={styles.message}>
              <Row gutter={rowLayout}>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>案件编号：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.ajbh ? (
                      <a
                        onClick={() => this.openCaseDetail(policeDetails)}
                        style={{ textDecoration: 'underline' }}
                      >
                        {policeDetails.ajbh}
                      </a>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>案件名称：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.ajmc ? policeDetails.ajmc : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>案件状态：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.ajzt ? policeDetails.ajzt : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>案发时段：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.fasjsx && policeDetails.fasjxx
                      ? policeDetails.fasjsx + '~' + policeDetails.fasjxx
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row gutter={rowLayout}>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>办案单位：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.badw_mc ? policeDetails.badw_mc : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>办案人：</div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: '70px' }}>
                    {policeDetails && policeDetails.barxm ? policeDetails.barxm : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom}>案发地点：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.afdd ? policeDetails.afdd : ''}
                  </div>
                </Col>
              </Row>
              <Row gutter={rowLayout}>
                <Col md={24} sm={24}>
                  <div className={liststyles.Indexfrom}>简要案情：</div>
                  <div className={liststyles.Indextail}>
                    {policeDetails && policeDetails.jyaq ? policeDetails.jyaq : ''}
                  </div>
                </Col>
              </Row>
              {policeDetails.ajgjList && policeDetails.ajgjList.length > 0 ? (
                <Card title={'案件流程'} style={{ margin: '0 12px' }}>
                  <CaseModalStep caseDetails={policeDetails} />
                </Card>
              ) : null}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  render() {
    const {
      policeDetails,
      superviseVisibleModal,
      history,
      RestDbrz,
      unCaseDetailData,
      reformModal,
      seeDetail,
      Isdetail,
      NowDbrz,
      feedbackVisibleModal,
    } = this.state;
    return (
      <div>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail()}</div>

        {/*{superviseVisibleModal ?*/}
        {/*<SuperviseModal*/}
        {/*{...this.props}*/}
        {/*visible={superviseVisibleModal}*/}
        {/*closeModal={this.closeModal}*/}
        {/*// saveModal={this.saveModal}*/}
        {/*caseDetails={policeDetails}            // 点击列表的督办显示的四个基本信息*/}
        {/*getRefresh={this.Refresh}*/}
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
        {/*detailsData={this.state.policeDetails}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
        {reformModal ?
          <Modal
            maskClosable={false}
            visible={reformModal}
            title={<p>提示</p>}
            width='1000px'
            footer={this.foot1()}
            onCancel={() => this.onReformCancel()}
            // onOk={() => this.onOk(this.props.id)}
            className={styles.indexdeepmodal}
          >
          <div className={styles.question}>问题是否已经整改完毕？</div>
          </Modal> : ''
        }
      </div>
    );
  }
}
