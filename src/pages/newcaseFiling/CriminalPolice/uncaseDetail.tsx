/*
 * CriminalPolice/uncaseDetail.tsx 受立案刑事案件告警详情
 * author：jhm
 * 20180605
 * */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Card,
  Steps,
  Button,
  Badge,
  Table,
  List,
  Tooltip,
  message,
  Modal,
  Empty,
} from 'antd';
// import DescriptionList from 'components/DescriptionList';
import styles from './uncaseDetail.less';
import liststyles from '../../common/listDetail.less';
import { autoheight, getQueryString, userResourceCodeDb } from '../../../utils/utils';
import SuperviseModal from '../../../components/NewUnCaseRealData/SuperviseModal';
// import ItemsDetail from '../../ItemRealData/itemDetail';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import JqDetail from '../../routes/PoliceRealData/policeDetail';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
import FeedbackModal from '../../../components/Common/FeedbackModal';
import { authorityIsTrue } from '../../../utils/authority';
import SupervisionLog from '../../../components/Common/SupervisionLog';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import noList from '@/assets/viewData/noList.png';
import { routerRedux } from 'dva/router';
import noListLight from '@/assets/viewData/noListLight.png';
import DetailShow from "@/components/Common/detailShow";

const FormItem = Form.Item;
// const { Description } = DescriptionList;
const { Step } = Steps;
const { confirm } = Modal;
@connect(({ UnCaseData, loading, MySuperviseData, AllDetail, global }) => ({
  UnCaseData,
  loading,
  MySuperviseData,
  AllDetail,
  global,
  // loading: loading.models.alarmManagement,
}))
export default class uncaseDetail extends PureComponent {
  state = {
    current: 1, // 涉案物品默认在第一页
    jqcurrent: 1, // 警情信息默认在第一页
    left: '0',
    trailLeft: '0',
    TrackPaddingTop: '', // 初始状态的message的paddingtop;
    TrackPaddingBottom: '', // 初始状态的message的paddingbottom;
    TrackPaddingBottom1: '220px', // 初始状态的listStyle的paddingbottom;(TrackPaddingBottom下面的一个子集)
    open: '0', // 显示‘显示更多’还是‘收起更多’,默认显示更多；
    is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
    loading1: false, // 督办按钮状态，默认false没加载,true是点击后的加载状态
    loading2: false, // 再次督办按钮状态，默认false没加载,true是点击后的加载状态
    colordailyleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(日志)
    colordailyright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(日志)
    colortrailleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
    colortrailright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
    // 督办模态框
    superviseVisibleModal: false,
    // 点击列表的督办显示的基本信息
    superviseWtlx: '',
    superviseZrdw: '',
    superviseZrr: '',
    superviseZrdwId: '',
    id: '',
    sfzh: '',
    unCaseDetailData: [],
    history: false, // 查看督办日志历史记录
    RestDbrz: '', // 督办日志的历史记录
    reformModal: false, // 确认整改完成的判定state
    dbid: '',
    sureChange: false, // 点击确认整改完毕时，如果点击过，判断过程的loading状态；
    sabar: '',
    seeDetail: false, // 点击督办日志中查看督办详情
    Isdetail: '', // 确认点击督办日志中哪一个'查看督办详情'
    NowDbrz: '',
    btnType: '',
    feedbackVisibleModal: false, // 反馈状态模态框
    feedbackButtonLoading: false, // 反馈按钮加载状态
    isDb: authorityIsTrue(userResourceCodeDb.zfba_xs), // 督办权限判断
    record: '', // 表格信息
  };

  componentDidMount() {
    let res = this.props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    if (
      this.props.location &&
      this.props.location.query &&
      res &&
      this.props.location.query.id &&
      res.system_id
    ) {
      this.caseDetailDatas(this.props.location.query.id, res.system_id);
      this.setState({
        record: res,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
     if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail') {
      this.caseDetailDatas(nextProps.location.query.record.id, nextProps.location.query.record.system_id);
    }
  }

  // 再次督办
  onceSupervise = (flag, unCaseDetailData) => {
    const { wtlx, bardwmc, bardw, barxm, wtid, barzjhm, sabar } = unCaseDetailData;
    this.props.dispatch({
      type: 'UnCaseData/getUnCaseByProblemId',
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
                record: unCaseDetailData,
                id: unCaseDetailData && unCaseDetailData.wtid ? unCaseDetailData.wtid : '1',
                from: '督办',
                tzlx: 'xsajwt3',
                fromPath: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                tab: '详情',
              },
            }),
          );
        } else {
          this.setState({
            dbzt: data.list[0].dbzt,
          });
          message.warning('该问题已督办或暂无反馈信息');
          this.caseDetailDatas(this.props.location.query.id, this.state.record.system_id);
        }
      },
    });
    // this.props.supervise(flag,wtlx,zrdw,zrdwId,zrr,wtid,zjhm)
  };
  // 反馈
  feedback = (flag, unCaseDetailData) => {
    const { wtid } = unCaseDetailData;
    this.props.dispatch({
      type: 'UnCaseData/getUnCaseByProblemId',
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
                id: unCaseDetailData && unCaseDetailData.wtid ? unCaseDetailData.wtid : '1',
                from: '案件信息',
                tzlx: 'xsajwt3',
                fromPath: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                tab: '详情',
              },
            }),
          );
          // this.setState({
          //   feedbackVisibleModal: !!flag,
          // });
        } else {
          message.warning('该问题已反馈');
          this.caseDetailDatas(this.props.location.query.id, this.state.record.system_id);
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
  // saveModal = (flag, param, wjxx, newdbzrr, newdbzrdw, newdbzrdwid, newdbzrrsfzh,cljg_mc,cljg_yy) => {
  //     this.setState({
  //         superviseVisibleModal: !!flag,
  //         loading1: true,
  //         loading2: true,
  //     });
  //     const {superviseZrdwId, superviseZrdw, superviseZrr, sfzh} = this.state;
  //     if (newdbzrdwid && newdbzrdw && newdbzrr && newdbzrrsfzh) {
  //         this.props.dispatch({
  //             type: 'UnCaseData/SureSupervise',
  //             payload: {
  //                 wtid: this.state.id,
  //                 wjxx,
  //                 id: this.state.id,
  //                 zgyj: param,
  //                 zrr_dwid: newdbzrdwid,
  //                 zrr_dwmc: newdbzrdw,
  //                 zrr_name: newdbzrr,
  //                 zrr_sfzh: newdbzrrsfzh,
  //                 ajbh: this.state.unCaseDetailData && this.state.unCaseDetailData.ajbh?this.state.unCaseDetailData.ajbh:'',
  //                 ajmc: this.state.unCaseDetailData && this.state.unCaseDetailData.ajmc?this.state.unCaseDetailData.ajmc:'',
  //                 cljg_mc:cljg_mc,
  //                 cljg_yy:cljg_yy,
  //             },
  //             callback: (data) => {
  //                 message.info('督办保存完成');
  //                 this.caseDetailDatas(this.props.id, this.props.systemId);
  //                 if(this.props.refreshTable){
  //                   this.props.refreshTable();
  //                 }
  //                 this.setState({
  //                     is_ok: '1',
  //                     loading1: false,
  //                     loading2: false,
  //                 })
  //             },
  //         });
  //     }
  //     else {
  //         message.info('该数据无法督办');
  //         this.setState({
  //             is_ok: '1',
  //             loading1: false,
  //             loading2: false,
  //         })
  //     }
  // };

  // 督办成功后刷新列表
  Refresh = flag => {
    this.setState({
      superviseVisibleModal: !!flag,
      loading1: false,
      loading2: false,
    });
    this.caseDetailDatas(this.props.location.query.id, this.state.record.system_id);
    if (this.props.refreshTable) {
      this.props.refreshTable();
    }
  };
  // // 反馈
  // saveFeedbackModal = params => {
  //   this.setState({
  //     feedbackVisibleModal: false,
  //     feedbackButtonLoading: true,
  //   });
  //   this.props.dispatch({
  //     type: 'MySuperviseData/saveFeedback',
  //     payload: params,
  //     callback: data => {
  //       this.setState({
  //         feedbackButtonLoading: false,
  //       });
  //       if (data) {
  //         message.success('反馈保存完成');
  //         this.caseDetailDatas(this.props.location.query.id, this.state.record.system_id);
  //         if (this.props.refreshTable) {
  //           this.props.refreshTable();
  //         }
  //       } else {
  //         message.error('反馈保存失败');
  //       }
  //     },
  //   });
  // };
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
  // onReformCancel = () => {
  //   this.setState({
  //     reformModal: false,
  //   });
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
            console.log('Cancel');
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
      type: 'UnCaseData/sureRefomFetch',
      payload: {
        id: this.state.dbid,
      },
      callback: () => {
        message.info('督办整改完成');
        if (this.props.location && this.props.location.query && this.state.record) {
          this.caseDetailDatas(this.props.location.query.id, this.state.record.system_id);
        }

        // if (this.props.refreshTable) {
        //   this.props.refreshTable();
        // }
      },
    });
  };
  //  修改改变模态框状态 通过id 获取数据
  caseDetailDatas = (id, systemId) => {
    this.props.dispatch({
      type: 'UnCaseData/UnCaseDetailFetch',
      payload: {
        id: id,
        system_id: systemId,
      },
      callback: data => {
        if (data) {
          this.setState({
            unCaseDetailData: data,
            sureChange: false,
          });
          if (data.ajzt === '受理') {
            if (data.xyrList.length > 0) {
              const AllLength = [];
              for (let a = 0; a < data.xyrList.length; a++) {
                AllLength.push(data.xyrList[a].qzcsList.length);
              }
              const maxLength = AllLength.sort(function(a, b) {
                return a - b;
              }).reverse()[0];
              if (maxLength > 5) {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: '170px',
                });
              } else {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                });
              }
            } else {
              this.setState({
                TrackPaddingTop: '90px',
                TrackPaddingBottom: '0px',
              });
            }
          } else if (data.ajzt === '立案') {
            if (data.xyrList.length > 0) {
              const AllLength = [];
              for (let a = 0; a < data.xyrList.length; a++) {
                AllLength.push(data.xyrList[a].qzcsList.length);
              }
              const maxLength = AllLength.sort(function(a, b) {
                return a - b;
              }).reverse()[0];
              if (maxLength > 5) {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: '170px',
                });
              } else {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                });
              }
            } else {
              this.setState({
                TrackPaddingTop: '90px',
                TrackPaddingBottom: '0px',
              });
            }
          } else if (data.ajzt === '破案') {
            if (data.xyrList.length > 0) {
              const AllLength = [];
              for (let a = 0; a < data.xyrList.length; a++) {
                AllLength.push(data.xyrList[a].qzcsList.length);
              }
              const maxLength = AllLength.sort(function(a, b) {
                return a - b;
              }).reverse()[0];
              if (maxLength > 5) {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: '170px',
                });
              } else {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                });
              }
            } else {
              this.setState({
                TrackPaddingTop: '90px',
                TrackPaddingBottom: '0px',
              });
            }
          } else if (data.ajzt === '结案') {
            if (data.xyrList.length > 0) {
              const AllLength = [];
              for (let a = 0; a < data.xyrList.length; a++) {
                AllLength.push(data.xyrList[a].qzcsList.length);
              }
              const maxLength = AllLength.sort(function(a, b) {
                return a - b;
              }).reverse()[0];
              if (maxLength > 5) {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: '170px',
                });
              } else {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                });
              }
            } else {
              this.setState({
                TrackPaddingTop: '90px',
                TrackPaddingBottom: '0px',
              });
            }
          } else if (data.ajzt === '销案') {
            if (data.xyrList.length > 0) {
              const AllLength = [];
              for (let a = 0; a < data.xyrList.length; a++) {
                AllLength.push(data.xyrList[a].qzcsList.length);
              }
              const maxLength = AllLength.sort(function(a, b) {
                return a - b;
              }).reverse()[0];
              if (maxLength > 5) {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: '170px',
                  TrackPaddingBottom1: '220px',
                });
              } else {
                this.setState({
                  TrackPaddingTop: '150px',
                  TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                });
              }
            } else {
              this.setState({
                TrackPaddingTop: '90px',
                TrackPaddingBottom: '0px',
              });
            }
          }
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

  // 根据物品案件编号和身份证号打开人员档案窗口
  openPersonDetail = (idcard, xyrName, xyrId) => {
    if (idcard && xyrName && xyrId) {
      this.props.dispatch({
        type: 'AllDetail/AllDetailPersonFetch',
        payload: {
          name: xyrName,
          sfzh: idcard,
          xyrId,
        },
        callback: data => {
          if (data && data.ryxx) {
            // const divs = (
            //     <div>
            //         <PersonDetail
            //             {...this.props}
            //             idcard={idcard}
            //             name={xyrName}
            //             xyrId={xyrId}
            //             ly='问题数据'
            //         />
            //     </div>
            // );
            // const AddNewDetail = { title: '人员档案', content: divs, key: idcard + 'ryda' };
            // this.props.newDetail(AddNewDetail);
          } else {
            message.error('该人员暂无人员档案');
          }
        },
      });
    } else {
      message.error('该人员暂无人员档案');
    }
  };
  // 点击案件轨迹人员的在区情况
  IntoArea = (sfzh, ajbh) => {
    if (sfzh && ajbh) {
      // const divs = (
      //     <div>
      //         <PersonIntoArea
      //             {...this.props}
      //             sfzh={sfzh}
      //             ajbh={ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: sfzh + 'ucryzq' };
      // this.props.newDetail(AddNewDetail);
    } else {
      message.warning('暂无涉案人员在区情况');
    }
  };

  Topdetail() {
    const { unCaseDetailData, isDb } = this.state;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
            {/*<span style={{ margin: '16px', display: 'block' }}>刑事案件详情</span>*/}
          {/*</Col>*/}
          <Col style={{minHeight:0}}>
            <span>
              {unCaseDetailData.zt === '待督办' && isDb ? (
                <Button
                  type='primary'
                  className={styles.TopMenu}
                  style={{margin:'12px 0 12px 16px'}}
                  loading={this.state.loading1}
                  onClick={() => this.onceSupervise(true, unCaseDetailData)}
                >
                  督办
                </Button>
              ) : null}
              {unCaseDetailData &&
              (unCaseDetailData.dbid === '' ||
                (unCaseDetailData.dbList &&
                  unCaseDetailData.dbList.length > 0 &&
                  unCaseDetailData.dbList[unCaseDetailData.dbList.length - 1].fkzt !== '1')) &&
              isDb ? (
                <Button
                  type='primary'
                  className={styles.TopMenu}
                  style={{margin:'12px 0 12px 16px'}}
                  loading={this.state.feedbackButtonLoading}
                  onClick={() => this.feedback(true, unCaseDetailData)}
                >
                  反馈
                </Button>
              ) : null}
              {this.props.isDd && this.props.record && this.props.record.is_sqdd === '0' ? (
                <Button
                  type="primary"
                  className={styles.TopMenu}
                  style={{margin:'12px 0 12px 16px'}}
                  onClick={() => this.props.saveDispatch(this.props.record)}
                >
                  调度
                </Button>
              ) : (
                ''
              )}
            </span>
          </Col>
        </Row>
      </div>
    );
  }

  // 根据物品ID打开物品详情窗口
  openItemsDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/articlesInvolved/ArticlesData/itemDetail',
        query: { record: record, id: record && record.system_id ? record.system_id : '1' },
      }),
    );
    // const divs = (
    //     <div>
    //         <ItemsDetail
    //             {...this.props}
    //             id={systemId}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '涉案物品详情', content: divs, key: systemId };
    // this.props.newDetail(AddNewDetail);
  };

  sawpCol(sawpList) {
    return (
      <List
        itemLayout="vertical"
        size="small"
        locale={{
          emptyText: (
            <Empty
              image={this.props.global && this.props.global.dark ? noList : noListLight}
              description={'暂无数据'}
            />
          ),
        }}
        pagination={
          sawpList.length > 0
            ? {
                size: 'small',
                pageSize: 8,
                showTotal: (total, range) => (
                  <div style={{color: '#b7b7b7'}}>
                    共 {total} 条记录 第 {this.state.current} / {Math.ceil(total / 8)} 页
                  </div>
                ),
                onChange: page => {
                  this.setState({ current: page });
                },
              }
            : false
        }
        dataSource={sawpList}
        className={styles.sawpListName}
        renderItem={item => (
          <List.Item>
            <div className={styles.colsImg}>
              <div className={styles.sawpImg}>
                <img
                  width="70"
                  height="70"
                  src={item && item.url ? item.url : 'images/nophoto.png'}
                />
              </div>
              <div className={styles.sawpName}>
                <div className={styles.sawpName1}>
                  物品名称：
                  <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={item.wpmc}>
                    {item.wpmc}
                  </Tooltip>
                </div>
                <div className={styles.sawpName1}>
                  物品种类：
                  <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={item.wpzlMc}>
                    {item.wpzlMc}
                  </Tooltip>
                </div>
              </div>
              <div className={styles.sawpSee} onClick={() => this.openItemsDetail(item)}>
                在区情况
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  }

  jqDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/receivePolice/AlarmData/policeDetail',
        query: { record: record, id: record && record.id ? record.id : '1', movefrom: '警情常规' },
      }),
    );
    // const divs = (
    //     <div>
    //         <JqDetail
    //             {...this.props}
    //             id={id}
    //         />
    //     </div>
    // );
    // const AddJqDetail = { title: '警情详情', content: divs, key: id };
    // this.props.newDetail(AddJqDetail);
  };

  renderDetail(unCaseDetailData) {
    const {
      UnCaseData: { loading },
    } = this.props;
    const { isDb, sureChange, loading2 } = this.state;
    const status = ['否', '是'];
    const statusMap = ['default', 'success'];
    const JqColumns = [
      {
        title: '接警来源',
        dataIndex: 'jjly_mc',
          width:280,
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '接警时间',
        dataIndex: 'jjsj',
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '管辖单位',
        dataIndex: 'jjdw',
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '接警人',
        dataIndex: 'jjr',
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '处警单位',
        dataIndex: 'cjdw',
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '处警人',
        dataIndex: 'cjr',
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '报案人',
        dataIndex: 'bar',
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '是否受案',
        dataIndex: 'is_sa',
        render(text) {
          return <span style={{color:statusMap[text] === 'success' ? '#27D427':'#c41a1a'}}>{status[text]}</span>;
        },
      },
      {
        title: '操作',
        width: 50,
        render: record => (
          <div>
            <a onClick={() => this.jqDetail(record)}>详情</a>
          </div>
        ),
      },
    ];

    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 260 + 'px',padding:'16px 0 0' }}
        className={styles.detailBoxScroll}
      >
        <SupervisionLog
          detailData={unCaseDetailData}
          sureChangeLoading={sureChange}
          superviseloading={loading2}
          isDb={isDb}
          onceSupervise={this.onceSupervise}
          sureReform={this.sureReform}
          rowLayout={rowLayout}
          frompath="/newcaseFiling/casePolice/CriminalPolice/uncaseDetail"
        />
        <div className={styles.title}>| 警情信息</div>
        <div className={styles.tablemessage}>
          <Table
            // size={'middle'}
            style={{ borderRadius: 0, padding: 24 }}
            bordered
            pagination={{
              pageSize: 3,
              showTotal: (total, range) => (
                <div style={{color: '#b7b7b7'}}>
                  共 {Math.ceil(total / 3)} 页， {total} 条记录
                </div>
              ),
              onChange: page => {
                this.setState({ jqcurrent: page });
              },
            }}
            className={styles.jqxxTable}
            dataSource={unCaseDetailData ? unCaseDetailData.jqxxList : []}
            columns={JqColumns}
            locale={{
              emptyText: (
                <Empty
                  image={this.props.global && this.props.global.dark ? noList : noListLight}
                  description={'暂无数据'}
                />
              ),
            }}
          />
        </div>
        <div className={styles.title}>| 案件信息</div>
        <div className={styles.message} style={{ padding: '0 64px 12px 64px' }}>
          <Row style={{ marginRight: 0 }} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件编号：</div>
              <div className={liststyles.Indextail}>
                {unCaseDetailData && unCaseDetailData.ajbh ? unCaseDetailData.ajbh : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件名称：</div>
              <div className={liststyles.Indextail}>
                {unCaseDetailData && unCaseDetailData.ajmc ? unCaseDetailData.ajmc : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件类别：</div>
              <div className={liststyles.Indextail}>
                {unCaseDetailData && unCaseDetailData.ajlbmc ? unCaseDetailData.ajlbmc : ''}
              </div>
            </Col>
          </Row>
          <Row style={{ marginRight: 0 }} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案发时段：</div>
              <div className={liststyles.Indextail}>
                {unCaseDetailData && unCaseDetailData.fasjsx && unCaseDetailData.fasjxx
                  ? unCaseDetailData.fasjsx + '~' + unCaseDetailData.fasjxx
                  : ''}
              </div>
            </Col>
            {/*{*/}
            {/*    this.props.is_da ? '' : <div>*/}
            {/*        <Col md={6} sm={24}>*/}
            {/*            <div className={liststyles.Indexfrom}>办案单位：</div>*/}
            {/*            <div*/}
            {/*                className={liststyles.Indextail}>{unCaseDetailData && unCaseDetailData.bardwmc ? unCaseDetailData.bardwmc : ''}</div>*/}
            {/*        </Col>*/}
            {/*        <Col md={6} sm={24}>*/}
            {/*            <div className={liststyles.Indexfrom}>办案人：</div>*/}
            {/*            <div className={liststyles.Indextail}*/}
            {/*                 style={{ paddingLeft: '70px' }}>{unCaseDetailData && unCaseDetailData.barxm ? unCaseDetailData.barxm : ''}</div>*/}
            {/*        </Col>*/}
            {/*    </div>*/}
            {/*}*/}
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案发地点：</div>
              <div className={liststyles.Indextail}>
                {unCaseDetailData && unCaseDetailData.afdd ? unCaseDetailData.afdd : ''}
              </div>
            </Col>
          </Row>
          <Row style={{ marginRight: 0 }} className={styles.xqrow}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>简要案情：</div>
                <DetailShow paddingLeft={60} word= {unCaseDetailData && unCaseDetailData.jyaq ? unCaseDetailData.jyaq : ''} {...this.props}/>
            </Col>
          </Row>
          {unCaseDetailData && unCaseDetailData.ajzt ? (
            <Card
              title={'案件流程'}
              style={{ backgroundColor: '#171A26', marginTop: 12, borderRadius: 0 }}
              className={styles.ajlcCard}
            >
              <CaseModalStep {...this.props} caseDetails={unCaseDetailData} />
            </Card>
          ) : (
            ''
          )}
        </div>
        {unCaseDetailData && unCaseDetailData.ajzt ? (
          <div style={{ borderBottom: dark ? '1px solid #171925' : '1px solid #e6e6e6' }}>
            <div className={styles.title}>| 案件轨迹</div>
            <CaseModalTrail {...this.props} caseDetails={unCaseDetailData} from="刑事" />
          </div>
        ) : (
          ''
        )}
        <div className={styles.title}>| 涉案物品</div>
        <div className={styles.tablemessage}>
          <div style={{ padding: '24px' }}>
            {this.sawpCol(
              unCaseDetailData && unCaseDetailData.sawpList ? unCaseDetailData.sawpList : [],
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let dark = this.props.global && this.props.global.dark;
    const {
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
      <div className={dark ? '' : styles.lightBox}>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail(unCaseDetailData)}</div>

        {/*{superviseVisibleModal ? (*/}
        {/*<SuperviseModal*/}
        {/*visible={superviseVisibleModal}*/}
        {/*closeModal={this.closeModal}*/}
        {/*// saveModal={this.saveModal}*/}
        {/*caseDetails={this.state.unCaseDetailData}*/}
        {/*getRefresh={this.Refresh}*/}
        {/*// 点击列表的督办显示的四个基本信息*/}
        {/*wtlx={this.state.superviseWtlx}*/}
        {/*wtid={this.state.id}*/}
        {/*// zrdw={this.state.superviseZrdw}*/}
        {/*// zrdwId={this.state.superviseZrdwId}*/}
        {/*// zrr={this.state.sabar}*/}
        {/*id={this.state.id}*/}
        {/*// zjhm={this.state.sfzh}*/}
        {/*btnType={this.state.btnType}*/}
        {/*from="督办"*/}
        {/*/>*/}
        {/*) : (*/}
        {/*''*/}
        {/*)}*/}
        {/*{feedbackVisibleModal ? (*/}
        {/*<FeedbackModal*/}
        {/*closeModal={this.closeFeedbackModal}*/}
        {/*saveModal={this.saveFeedbackModal}*/}
        {/*visible={feedbackVisibleModal}*/}
        {/*detailsData={this.state.unCaseDetailData}*/}
        {/*/>*/}
        {/*) : null}*/}
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
