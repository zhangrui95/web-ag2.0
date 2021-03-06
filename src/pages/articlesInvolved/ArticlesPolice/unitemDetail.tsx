/*
 * ArticlesPolice/index.tsx 涉案财物告警详情
 * author：jhm
 * 20180605
 * */

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
  Carousel,
  Modal, Timeline, Tag,
} from 'antd';
import styles from './unitemDetail.less';
import liststyles from '../../common/listDetail.less';
import { autoheight, getQueryString, userResourceCodeDb } from '../../../utils/utils';
// import SuperviseModal from '../../../components/NewUnCaseRealData/SuperviseModal';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
// import FeedbackModal from '../../components/Common/FeedbackModal';
import { authorityIsTrue } from '../../../utils/authority';
import SupervisionLog from '../../../components/Common/SupervisionLog';
import nophoto from '../../../assets/common/zwwpDark.png';
import { routerRedux } from 'dva/router';
import nophotoLight from '@/assets/common/zwwp.png';
import DetailShow from '@/components/Common/detailShow';

const FormItem = Form.Item;
const { Step } = Steps;
const { confirm } = Modal;
@connect(({ UnItemData, loading, MySuperviseData, global }) => ({
  UnItemData,
  loading,
  MySuperviseData,
  global,
  // loading: loading.models.alarmManagement,
}))
export default class unitemDetail extends PureComponent {
  state = {
    left: '0',
    is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
    loading1: false, // 督办按钮状态，默认false没加载,true是点击后的加载状态
    loading2: false, // 再次督办按钮状态，默认false没加载,true是点击后的加载状态
    colordailyleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(日志)
    colordailyright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(日志)
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
    isDb: authorityIsTrue(userResourceCodeDb.item), // 督办权限
    record: '', // 表格信息
      idDetail:'',
      system_idDetail:'',
  };

  componentDidMount() {
    let res = this.props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    const { location } = this.props;
    if (res && res.id && res.system_id) {
      this.itemDetailDatas(res.id, res.system_id);
      this.setState({
        record: res,
          idDetail:res.id,
          system_idDetail:res.system_id,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset &&
      nextProps.global.isResetList.url === '/articlesInvolved/ArticlesPolice/unitemDetail'
    ) {
      this.itemDetailDatas(
        nextProps.location.query.record.id ? nextProps.location.query.record.id : this.state.idDetail,
        nextProps.location.query.record.system_id ? nextProps.location.query.record.system_id : this.state.system_idDetail,
      );
    }
  }

  // 再次督办
  onceSupervise = (flag, UnitemDetail) => {
    const { wtlx, kfgly_dwmc, kfgly_dwdm, kfgly, wtid, kfgly_zjhm } = UnitemDetail;
    this.props.dispatch({
      type: 'UnItemData/getUnitemByProblemId',
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
                id: UnitemDetail && UnitemDetail.wtid ? UnitemDetail.wtid : '1',
                from: '涉案财物详情问题判定',
                tzlx: 'wpwt',
                fromPath: '/articlesInvolved/ArticlesPolice/unitemDetail',
                wtflId: '203204',
                wtflMc: '涉案财物',
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
          this.itemDetailDatas(this.props.id, this.props.systemId);
        }
      },
    });
  };
  // 反馈
  feedback = (flag, unItemDetailData) => {
    const { wtid } = unItemDetailData;
    this.props.dispatch({
      type: 'UnItemData/getUnitemByProblemId',
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
                record: unItemDetailData,
                id: unItemDetailData && unItemDetailData.wtid ? unItemDetailData.wtid : '1',
                from: '反馈',
                tzlx: 'wpwt',
                fromPath: '/articlesInvolved/ArticlesPolice/unitemDetail',
                tab: '详情',
              },
            }),
          );
        } else {
          message.warning('该问题已反馈');
          this.itemDetailDatas(this.state.record.id, this.state.record.system_id);
        }
      },
    });
  };
  //  修改改变模态框状态 通过id 获取数据
  caseDetailDatas = (id, systemId) => {
    this.props.dispatch({
      type: 'UnItemData/UnitemDetailFetch',
      payload: {
        id: id,
        system_id: systemId,
      },
      callback: data => {
        if (data) {
          this.setState({
            sureChange: false,
            UnitemDetail: data,
          });
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
    this.caseDetailDatas(this.props.id, this.props.systemId);
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
          this.itemDetailDatas(this.props.id, this.props.systemId);
          if (this.props.refreshTable) {
            this.props.refreshTable();
          }
        } else {
          message.error('反馈保存失败');
        }
      },
    });
  };
  // foot1 = () => {
  //     return (
  //         <div>
  //             <Button onClick={this.onReformCancel}>取消</Button>
  //             <Button type="primary" onClick={this.handleReformSure}>整改完毕</Button>
  //         </div>
  //     );
  // };
  // onReformCancel = () => {
  //     this.setState({
  //         reformModal: false,
  //     });
  // };

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
  handleReformSure = () => {
    this.setState({
      reformModal: false,
      sureChange: true,
    });
    this.props.dispatch({
      type: 'UnItemData/sureRefomFetch',
      payload: {
        id: this.state.dbid,
      },
      callback: () => {
        const { record } = this.state;
        message.success('督办整改完成');
        this.caseDetailDatas(record.id, record.systemId);
        if (this.props.refreshTable) {
          this.props.refreshTable();
        }
      },
    });
  };
  //  修改改变模态框状态 通过id 获取数据
  itemDetailDatas = (id, systemId) => {
    this.props.dispatch({
      type: 'UnItemData/UnitemDetailFetch',
      payload: {
        id: id,
        system_id: systemId,
      },
      callback: data => {
        if (data) {
          this.setState({
            UnitemDetail: data,
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
  };
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

  Topdetail() {
    const { UnitemDetail, isDb } = this.state;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*<span style={{ margin: '16px', display: 'block' }}>涉案财物详情</span>*/}
          {/*</Col>*/}
          <Col style={{ minHeight: 0 }}>
            <span>
              {UnitemDetail && UnitemDetail.zt === '待督办' && isDb ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  loading={this.state.loading1}
                  onClick={() => this.onceSupervise(true, UnitemDetail)}
                >
                  督办
                </Button>
              ) : (
                ''
              )}
              {UnitemDetail &&
              (UnitemDetail.dbid === '' ||
                (UnitemDetail.dbList &&
                  UnitemDetail.dbList.length > 0 &&
                  UnitemDetail.dbList[UnitemDetail.dbList.length - 1].fkzt !== '1')) &&
              isDb ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  loading={this.state.feedbackButtonLoading}
                  onClick={() => this.feedback(true, UnitemDetail)}
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

  // 点击物品所有人查询人员档案
  person = UnitemDetail => {
    this.props.dispatch({
      type: 'AllDetail/AllDetailPersonFetch',
      payload: {
        ajbh: UnitemDetail.ajbh,
        sfzh: UnitemDetail.syrSfzh,
      },
      callback: data => {
        if (data && data.ryxx) {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/lawEnforcement/PersonFile/Detail',
              query: {
                record: UnitemDetail,
                id: UnitemDetail && UnitemDetail.syrSfzh ? UnitemDetail.syrSfzh : '1',
                fromPath: '/articlesInvolved/ArticlesPolice/unitemDetail',
              },
            }),
          );
          // const divs = (
          //     <div>
          //         <PersonDetail
          //             {...this.props}
          //             ajbh={ajbh}
          //             idcard={sfzh}
          //             ly='问题数据'
          //         />
          //     </div>
          // );
          // const person = { title: '人员档案', content: divs, key: sfzh + 'ryda' };
          // this.props.newDetail(person);
        } else {
          message.error('该人员暂无档案信息！');
        }
      },
    });
  };

  // 根据案件编号打开案件窗口
  openCaseDetail = UnitemDetail => {
    if (UnitemDetail.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: { record: UnitemDetail, id: UnitemDetail.ajbh },
        }),
      );
      // const divs = (
      //     <div>
      //         <CaseDetail
      //             {...this.props}
      //             id={systemId}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '刑事案件详情', content: divs, key: ajbh };
      // this.props.newDetail(AddNewDetail);
    } else if (UnitemDetail.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { record: UnitemDetail, id: UnitemDetail.ajbh },
        }),
      );
      // const divs = (
      //     <div>
      //         <XzCaseDetail
      //             {...this.props}
      //             id={systemId}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '行政案件详情', content: divs, key: ajbh };
      // this.props.newDetail(AddNewDetail);
    }
  };

  renderDetail() {
    // const { UnItemData:{ UnitemDetail, loading } } = this.props;
    const { UnitemDetail, isDb, sureChange, loading2 } = this.state;
    let dark = this.props.global && this.props.global.dark;
    let stap1 = [];
    UnitemDetail&&UnitemDetail.wpgjList&&UnitemDetail.wpgjList.map((item,index)=>{
      stap1.push(
        <Timeline.Item
          dot={
            <div>
              <div
                style={
                  // item.dossierexceptionmc === '正常'
                  //   ?
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    backgroundColor: '#5858DF',
                    textAlign: 'center',
                    marginBottom: 7,
                  }
                  // : {
                  //   width: 30,
                  //   height: 30,
                  //   borderRadius: 30,
                  //   backgroundColor: 'rgb(255, 51, 102)',
                  //   textAlign: 'center',
                  //   marginBottom: 7,
                  // }
                }
              >
                <p style={{ paddingTop: 7, color: '#fff' }}>{UnitemDetail.wpgjList.length - index}</p>
              </div>
            </div>
          }
          color={
            // item.dossierexceptionmc === '正常'
            //   ?
            '#00CC33'
            // : 'rgb(255, 51, 102)'
          }
        >
          <Row gutter={8} style={{ paddingLeft:20 }}>
            <Col span={4}>
              <Row style={{marginBottom:6}}>{item.wpzt}</Row>
              <Row>
                {item.sfzc ? <Tag
                style={
                  item.sfzc === '0'
                    ? {
                      background: '#00CC33',
                      padding: '2px 12px',
                      textAlign: 'center',
                      cursor: 'default',
                      border:0,
                    }
                    : {
                      background: 'rgb(255, 51, 102)',
                      padding: '2px 12px',
                      textAlign: 'center',
                      cursor: 'default',
                      border:0,
                    }
                }
              >
                  {item.sfzc === '0' ? '正常' : item.ycmc}
              </Tag>: ''}</Row>
            </Col>
            <Col span={20}>
          <Row>
            {/*<Col md={8} sm={24} style={{marginBottom:8}}>*/}
            {/*  <div className={styles.break}>{window.configUrl.is_area === '5' || window.configUrl.is_area === '2' ? '财物状态：' : ''}{item.wpzt}</div>*/}
            {/*</Col>*/}
            <Col md={8} sm={24} style={{marginBottom:8}}>
              <div className={styles.break}>{window.configUrl.is_area === '5' || window.configUrl.is_area === '2' ? '操作时间：' : ''}{item.czsj}</div>
            </Col>
            <Col md={8} sm={24} style={{marginBottom:8}}>
              <div className={styles.break}>{window.configUrl.is_area === '5' || window.configUrl.is_area === '2' ? '操作人：' : ''}{item.czr}</div>
            </Col>
            <Col md={8} sm={24} style={{marginBottom:8}}>
              <div className={styles.break}>{window.configUrl.is_area === '5' || window.configUrl.is_area === '2' ? '操作原因：' : ''}{item.czyy}</div>
            </Col>
            {/*<Col md={8} sm={24} style={{marginBottom:8}}>*/}
            {/*  <div className={styles.break}>{window.configUrl.is_area === '5' || window.configUrl.is_area === '2' ? '归还期限：' : ''}{item.ghqx}</div>*/}
            {/*</Col>*/}
            <Col md={16} sm={24} style={{marginBottom:8}}>
              <div className={styles.break}>{window.configUrl.is_area === '5' || window.configUrl.is_area === '2' ? '存储位置：' : ''}{item.ccwz_zw}</div>
            </Col>
          </Row>
            </Col>
          </Row>
        </Timeline.Item>,
      );
    })
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 250 + 'px' }}
        className={styles.detailBoxScroll}
      >
        <SupervisionLog
          detailData={UnitemDetail}
          sureChangeLoading={sureChange}
          superviseloading={loading2}
          isDb={isDb}
          onceSupervise={this.onceSupervise}
          sureReform={this.sureReform}
          frompath="/articlesInvolved/ArticlesPolice/unitemDetail"
        />
        <Card
          title={
            <div
              style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}
            >
              物品信息
            </div>
          }
          className={styles.wpxxcard}
          bordered={false}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <div>
                {/*</Carousel>*/}
                {UnitemDetail && UnitemDetail.imageList && UnitemDetail.imageList.length > 0 ? (
                  <Carousel autoplay>
                    {UnitemDetail.imageList.map(pane => (
                      <div>
                        <img width="200" src={pane.url ? pane.url : dark ? nophoto : nophotoLight} />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div>
                    <img width="200" src={dark ? nophoto : nophotoLight} />
                  </div>
                )}
              </div>
            </Col>
            <Col md={18} sm={24}>
              <div style={{ paddingRight: 24 }}>
                {
                  UnitemDetail && UnitemDetail.wpzlCode && UnitemDetail.wpzlCode == 1 ?   <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.wpxx}>
                      <Col md={8} sm={24}>
                        名称：{UnitemDetail && UnitemDetail.wpmc ? UnitemDetail.wpmc : ''}
                      </Col>
                      <Col md={8} sm={24}>
                        来源：{UnitemDetail && UnitemDetail.wply ? UnitemDetail.wply : ''}
                      </Col>
                      <Col span={8}>
                        款项分类：{UnitemDetail && UnitemDetail.wpzlname2 ? UnitemDetail.wpzlname2 : ''}
                      </Col>
                      <Col span={8}>
                        货币/金融工具分类：{UnitemDetail && UnitemDetail.wpzlname3 ? UnitemDetail.wpzlname3 : ''}
                      </Col>
                      <Col span={8}>
                        货币/金融工具分类：{UnitemDetail && UnitemDetail.hbjrgjflzw ? UnitemDetail.hbjrgjflzw : ''}
                      </Col>
                      <Col span={8}>
                        款项类别：{UnitemDetail && UnitemDetail.kxlbzw ? UnitemDetail.kxlbzw : ''}
                      </Col>
                      <Col span={8}>
                        总金额：{UnitemDetail && UnitemDetail.zje ? UnitemDetail.zje : ''}
                      </Col>
                      <Col span={8}>
                        存入账户：{UnitemDetail && UnitemDetail.crzh ? UnitemDetail.crzh : ''}
                      </Col>
                      <Col span={8}>
                        存入日期：{UnitemDetail && UnitemDetail.crrq ? UnitemDetail.crrq : ''}
                      </Col>
                      <Col md={8} sm={24}>
                        存入人：{UnitemDetail && UnitemDetail.crr ? UnitemDetail.crr : ''}
                      </Col>
                      <Col md={8} sm={24}>
                        入账单据号：{UnitemDetail && UnitemDetail.rzdjh ? UnitemDetail.rzdjh : ''}
                      </Col>
                      <Col md={24} sm={24}>
                        所在库房名称：{UnitemDetail && UnitemDetail.szkf ? UnitemDetail.szkf : ''}
                      </Col>
                      <Col md={24} sm={24}>
                        备注：{UnitemDetail && UnitemDetail.bz ? UnitemDetail.bz : ''}
                      </Col>
                    </Row> :
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.wpxx}>
                  <Col md={8} sm={24}>
                    物品名称：{UnitemDetail ? UnitemDetail.wpmc : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    物品来源：{UnitemDetail && UnitemDetail.wply ? UnitemDetail.wply : ''}
                  </Col>
                  <Col span={8}>采取措施日期：{UnitemDetail && UnitemDetail.cqcsrq ? UnitemDetail.cqcsrq : ''}</Col>
                  <Col span={8}>
                    物品分类：{UnitemDetail && UnitemDetail.wpzlname2 ? UnitemDetail.wpzlname2 : ''}
                  </Col>
                  <Col span={8}>
                    三级分类：{UnitemDetail && UnitemDetail.wpzlname3 ? UnitemDetail.wpzlname3 : ''}
                  </Col>
                  <Col span={8}>
                    是否具有财产属性：{UnitemDetail && UnitemDetail.sfyccsx ? UnitemDetail.sfyccsx=== '1' ? '是' : '否' : ''}
                  </Col>
                  <Col span={8}>
                    是否贵重物品：{UnitemDetail && UnitemDetail.sfgzwp ? UnitemDetail.sfgzwp=== '1' ? '是' : '否' : ''}
                  </Col>
                  <Col span={8}>
                    是否易损易贬值：{UnitemDetail && UnitemDetail.sfysybz ? UnitemDetail.sfysybz=== '1' ? '是' : '否' : ''}
                  </Col>
                  <Col span={8}>
                    唯一编号：{UnitemDetail && UnitemDetail.wpbh ? UnitemDetail.wpbh : ''}
                  </Col>
                  <Col md={8} sm={24}>
                   重量：{UnitemDetail ? UnitemDetail.wpzl : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    型号：{UnitemDetail ? UnitemDetail.wpxh : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    规格：{UnitemDetail ? UnitemDetail.wpgg : ''}
                  </Col>
                  <Col md={8} sm={24}>
                   物品所有人：
                      <a
                        onClick={() => this.person(UnitemDetail)}
                        style={{ textDecoration: 'underline' }}
                      >
                        {UnitemDetail.syrName}
                      </a>
                  </Col>
                  {/*<Col md={8} sm={24}>*/}
                  {/*  特征：{UnitemDetail ? UnitemDetail.wptz : ''}*/}
                  {/*</Col>*/}
                  <Col md={8} sm={24}>
                   数量：{UnitemDetail ? UnitemDetail.wpsl : ''}
                  </Col>
                  <Col md={8} sm={24}>
                   扣押原因：{UnitemDetail ? UnitemDetail.kyyy : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    扣押时间：{UnitemDetail ? UnitemDetail.kysj : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    保存期限：{UnitemDetail ? UnitemDetail.bcqx : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    扣押批准人：{UnitemDetail ? UnitemDetail.kypzr : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    库房管理员：{UnitemDetail ? UnitemDetail.kfgly : ''}
                  </Col>
                  {/*<Col md={8} sm={24}>*/}
                  {/* 保存方式：{UnitemDetail ? UnitemDetail.bcfsName : ''}*/}
                  {/*</Col>*/}
                  <Col md={8} sm={24}>
                    财物状态：{UnitemDetail ? UnitemDetail.wpztzw : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    所在库位：{UnitemDetail ? UnitemDetail.szkw : ''}
                  </Col>
                  <Col md={8} sm={24}>
                    所在库房名称：{UnitemDetail ? UnitemDetail.szkf : ''}
                  </Col>
                  <Col md={24} sm={24}>
                    备注：{UnitemDetail ? UnitemDetail.bz : ''}
                  </Col>
                </Row>}
              </div>
            </Col>
          </Row>
        </Card>
        {UnitemDetail && UnitemDetail.wpgjList && UnitemDetail.wpgjList.length > 0 ? (
            <div>
              <Card
                title={
                  <div
                    style={{
                      borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                      paddingLeft: 16,
                    }}
                  >
                    物品轨迹
                  </div>
                }
                className={styles.wpxxcard}
                bordered={false}
              >
                <Timeline style={{ marginTop: 20 }}>{stap1}</Timeline>
              </Card>
            </div>
          ) : (
          ''
        )}
        <Card
          title={
            <div
              style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}
            >
              案件信息
            </div>
          }
          className={styles.wpxxcard}
          bordered={false}
        >
          <Row style={{ paddingRight: 24 }}>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom} style={{ left: '-12px' }}>
                案件名称：
              </div>
              <div className={styles.Indextail} style={{ paddingLeft: 58 }}>
                {UnitemDetail ? UnitemDetail.ajmc : ''}
              </div>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom}>案件编号：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 80 }}>
                {UnitemDetail && UnitemDetail.ajbh ? (
                  UnitemDetail.system_id && UnitemDetail.ajlx ? (
                    <a
                      onClick={() => this.openCaseDetail(UnitemDetail)}
                      style={{ textDecoration: 'underline' }}
                    >
                      {UnitemDetail.ajbh}
                    </a>
                  ) : (
                    UnitemDetail.ajbh
                  )
                ) : (
                  ''
                )}
              </div>
            </Col>
          </Row>

          <Row style={{ paddingRight: 24 }}>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom} style={{ left: '-12px' }}>
                案件状态：
              </div>
              <div className={styles.Indextail} style={{ paddingLeft: 58 }}>
                {UnitemDetail ? UnitemDetail.ajzt : ''}
              </div>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom}>立案时间：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 80 }}>
                {UnitemDetail ? UnitemDetail.larq : ''}
              </div>
            </Col>
          </Row>

          <Row style={{ paddingRight: 24 }}>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom} style={{ left: '-12px' }}>
                办案单位：
              </div>
              <div className={styles.Indextail} style={{ paddingLeft: 58 }}>
                {UnitemDetail ? UnitemDetail.badw : ''}
              </div>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom}>办案人：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 66 }}>
                {UnitemDetail ? UnitemDetail.bar : ''}
              </div>
            </Col>
          </Row>
          <Row style={{ paddingRight: 24 }}>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom} style={{ left: '-12px' }}>
                案发时段：
              </div>
              <div className={styles.Indextail} style={{ paddingLeft: 58 }}>
                {UnitemDetail && UnitemDetail.fasjsx && UnitemDetail.fasjxx
                  ? UnitemDetail.fasjsx + '~' + UnitemDetail.fasjxx
                  : ''}
              </div>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.Indexfrom}>案发地点：</div>
              <div className={styles.Indextail} style={{ paddingLeft: 80 }}>
                {UnitemDetail ? UnitemDetail.fadd : ''}
              </div>
            </Col>
          </Row>
          <Row style={{ paddingRight: 24 }}>
            <Col md={24} sm={24}>
              <div className={styles.Indexfrom} style={{ left: '-12px' }}>
                简要案情：
              </div>
              <DetailShow
                paddingLeft={58}
                word={UnitemDetail ? UnitemDetail.jyaq : ''}
                {...this.props}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  render() {
    const {
      superviseVisibleModal,
      history,
      RestDbrz,
      UnitemDetail,
      reformModal,
      seeDetail,
      Isdetail,
      NowDbrz,
      feedbackVisibleModal,
    } = this.state;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div className={dark ? '' : styles.lightBox}>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail()}</div>

        {/*{superviseVisibleModal ?*/}
        {/*<SuperviseModal*/}
        {/*visible={superviseVisibleModal}*/}
        {/*closeModal={this.closeModal}*/}
        {/*// saveModal={this.saveModal}*/}
        {/*caseDetails={this.state.UnitemDetail}*/}
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
        {/*detailsData={this.state.UnitemDetail}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*{reformModal ?*/}
        {/*<Modal*/}
        {/*maskClosable={false}*/}
        {/*visible={reformModal}*/}
        {/*title={<p>提示</p>}*/}
        {/*width='1000px'*/}
        {/*footer={this.foot1()}*/}
        {/*onCancel={() => this.onReformCancel()}*/}
        {/*// onOk={() => this.onOk(this.props.id)}*/}
        {/*className={styles.indexdeepmodal}*/}
        {/*centered={true}*/}
        {/*>*/}
        {/*<div className={styles.question}>问题是否已经整改完毕？</div>*/}
        {/*</Modal> : ''*/}
        {/*}*/}
      </div>
    );
  }
}
