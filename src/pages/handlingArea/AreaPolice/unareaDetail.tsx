/*
 * UnAreaDetail.js 办案区告警数据详情
 * author：lyp
 * 20181117
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
  Table,
  message,
  Modal,
  Empty,
} from 'antd';
// import Result from '../../components/Result';
// import SuperviseModal from '../../../components/NewUnCaseRealData/SuperviseModal';
// import SsWoodMessage from '../../components/personnelFiles/SsWoodMessage';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
import styles from './unareaDetail.less';
// import liststyles from '../listDetail.less';
// import FeedbackModal from '../../components/Common/FeedbackModal';
import { authorityIsTrue } from '../../../utils/authority';
import { autoheight, userResourceCodeDb } from '../../../utils/utils';
import SupervisionLog from '../../../components/Common/SupervisionLog';
import nophoto from '../../../assets/common/nophoto.png';
import noList from '@/assets/viewData/noList.png';
import { routerRedux } from 'dva/router';
import noListLight from '@/assets/viewData/noListLight.png';
import nophotoLight from '@/assets/common/nophotoLight.png';
import DetailShow from '@/components/Common/detailShow';

import left from '../../../assets/common/left.png';
import left1 from '../../../assets/common/left1.png';
import left2 from '../../../assets/common/left2.png';
import right from '../../../assets/common/right.png';
import right1 from '../../../assets/common/right1.png';
import right2 from '../../../assets/common/right2.png';

const FormItem = Form.Item;
const { Step } = Steps;
const { confirm } = Modal;
@connect(({ UnareaData, loading, MySuperviseData, areaData, AllDetail, global }) => ({
  UnareaData,
  loading,
  MySuperviseData,
  areaData,
  AllDetail,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class unareaDetail extends PureComponent {
  state = {
    ajWoodCurrent: 1, // 涉案物品信息默认在第一页
    ssWoodCurrent: 1, // 随身信息默认在第一页
    left: '0',
    trailLeft: '0',
    is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
    loading1: false, // 督办按钮状态，默认false没加载,true是点击后的加载状态
    loading2: false, // 再次督办按钮状态，默认false没加载,true是点击后的加载状态
    colordailyleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(日志)
    colordailyright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(日志)
    colortrailleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
    colortrailright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
    // 督办模态框
    superviseVisibleModal: false,
    problemAid: false, // 模态框打开
    // 点击列表的督办显示的基本信息
    superviseWtlx: '',
    superviseZrdw: '',
    superviseZrr: '',
    superviseZrdwId: '',
    id: '',
    sfzh: '',
    UnareaDetail: [],
    history: false, // 查看督办日志历史记录
    RestDbrz: '', // 督办日志的历史记录
    // 子系统的id
    systemId: '',
    ssWpList: false,
    SsWpId: '', // 弹出随身物品详情弹窗时默认选中的状态
    isState: '0', // 是随身物品信息还是涉案物品信息，0是随身，1是涉案
    reformModal: false, // 确认整改完成的判定state
    dbid: '',
    sureChange: false, // 点击确认整改完毕时，如果点击过，判断过程的loading状态；

    seeDetail: false, // 点击督办日志中查看督办详情
    Isdetail: '', // 确认点击督办日志中哪一个'查看督办详情'
    NowDbrz: '',
    feedbackVisibleModal: false, // 反馈状态模态框
    feedbackButtonLoading: false, // 反馈按钮加载状态
    isDb: authorityIsTrue(userResourceCodeDb.baq), // 督办权限
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
    const { location } = this.props;
    if (location && location.query && res && res.id && res.baq_id) {
      this.getDetail(res.id, res.baq_id);
    } else if (location && location.query && res && res.agid && res.system_id) {
      this.getDetail(res.agid, res.system_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset &&
      nextProps.global.isResetList.url === '/handlingArea/AreaPolice/UnareaDetail'
    ) {
      this.getDetail(nextProps.location.query.record.id, nextProps.location.query.record.baq_id);
    }
  }

  // 再次督办
  onceSupervise = (flag, UnareaDetail) => {
    // this.props.supervise(flag,wtlx,zrdw,zrdwId,zrr,wtid,zjhm)
    const {
      wtlx,
      wtid,
      ryxx: { badw, badwDm, bar, barzjhm },
    } = UnareaDetail;
    this.props.dispatch({
      type: 'UnareaData/getUnareaByProblemId',
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
                record: UnareaDetail,
                id: UnareaDetail && UnareaDetail.wtid ? UnareaDetail.wtid : '1',
                from: '办案区详情问题判定',
                tzlx: 'baqwt',
                fromPath: '/handlingArea/AreaPolice/UnareaDetail',
                wtflId: '203203',
                wtflMc: '办案区',
              },
            }),
          );
          // this.setState({
          //   superviseVisibleModal: !!flag,
          //   superviseWtlx: wtlx,
          //   superviseZrdw: badw,
          //   superviseZrdwId: badwDm,
          //   superviseZrr: bar,
          //   id: wtid,
          //   sfzh: barzjhm,
          // });
        } else {
          message.warning('该问题已督办或暂无反馈信息');
          this.getDetail(this.state.record.id, this.state.record.baq_id);
        }
      },
    });
  };
  // 反馈
  feedback = (flag, unCaseDetailData) => {
    const { wtid } = unCaseDetailData;
    this.props.dispatch({
      type: 'UnareaData/getUnareaByProblemId',
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
                tzlx: 'baqwt',
                fromPath: '/handlingArea/AreaPolice/UnareaDetail',
                tab: '详情',
              },
            }),
          );
          // this.setState({
          //   feedbackVisibleModal: !!flag,
          // });
        } else {
          message.warning('该问题已反馈');
          this.getDetail(this.state.record.id, this.state.record.system_id);
        }
      },
    });
  };

  getDetail(id, baqId) {
    this.props.dispatch({
      type: 'UnareaData/UnareaDetailFetch',
      payload: {
        id: id,
        baq_id: baqId,
      },
      callback: data => {
        if (data) {
          this.setState({
            sureChange: false,
            UnareaDetail: data,
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
  onCancel = () => {
    this.setState({
      problemAid: false,
    });
  };
  onReformCancel = () => {
    this.setState({
      reformModal: false,
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

  // 关闭随身物品模态框
  closeSswpModal = flag => {
    this.setState({
      is_state: '0',
      ssWpList: !!flag,
      SsWpId: '',
    });
  };
  // 督办完成保存
  // saveModal = (flag, param, wjxx,newdbzrr,newdbzrdw,newdbzrdwid,newdbzrrsfzh,cljg_mc,cljg_yy) => {
  //     this.setState({
  //         superviseVisibleModal: !!flag,
  //         loading1: true,
  //         loading2: true,
  //     });
  //     const {superviseZrdwId, superviseZrdw, superviseZrr, sfzh} = this.state;
  //     if (newdbzrdwid && newdbzrdw && newdbzrr && newdbzrrsfzh) {
  //         this.props.dispatch({
  //             type: 'UnareaData/SureSupervise',
  //             payload: {
  //                 wtid: this.state.id,
  //                 wjxx,
  //                 id: this.state.id,
  //                 zgyj: param,
  //                 zrr_dwid: newdbzrdwid,
  //                 zrr_dwmc: newdbzrdw,
  //                 zrr_name: newdbzrr,
  //                 zrr_sfzh: newdbzrrsfzh,
  //                 ajbh: this.state.UnareaDetail && this.state.UnareaDetail.ajbh?this.state.UnareaDetail.ajbh:'',
  //                 ajmc: this.state.UnareaDetail && this.state.UnareaDetail.ajmc?this.state.UnareaDetail.ajmc:'',
  //                 cljg_mc:cljg_mc,
  //                 cljg_yy:cljg_yy,
  //             },
  //             callback: (data) => {
  //                 message.info('督办保存完成');
  //                 if(this.props.refreshTable){
  //                   this.props.refreshTable();
  //                 }
  //                 this.getDetail(this.props.id, this.props.baqId);
  //                 this.setState({
  //                     is_ok: '1',
  //                     loading1: false,
  //                     loading2: false,
  //                 });
  //             },
  //         });
  //     }
  //     else {
  //         message.info('该数据无法督办');
  //         this.setState({
  //             is_ok: '1',
  //             loading1: false,
  //             loading2: false,
  //         });
  //     }
  // };

  // 督办成功后刷新列表
  Refresh = flag => {
    this.setState({
      superviseVisibleModal: !!flag,
      loading1: false,
      loading2: false,
    });
    if (this.props.refreshTable) {
      this.props.refreshTable();
    }
    this.getDetail(this.props.id, this.props.baqId);
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
          this.getDetail(this.props.id, this.props.baqId);
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
  handleReformSure = () => {
    this.setState({
      reformModal: false,
      sureChange: true,
    });
    this.props.dispatch({
      type: 'UnareaData/sureRefomFetch',
      payload: {
        id: this.state.dbid,
      },
      callback: () => {
        const { record } = this.state;
        message.success('督办整改完成');
        this.getDetail(record.id, record.baqId);
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
  // 台账
  Ledger = res => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/PersonLedger',
        query: {
          record: res,
          id: res && res.system_id ? res.system_id : '1',
          // from: this.state.lx,
          // tzlx: this.state.tzlx,
          // fromPath: '/handlingArea/AreaData',
          // tab: '表格',
        },
      }),
    );
  };
  Topdetail() {
    const { UnareaDetail, isDb } = this.state;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*<span style={{ margin: '16px', display: 'block' }}>人员在区详情</span>*/}
          {/*</Col>*/}
          <Col style={{ minHeight: 0 }}>
            <div>
              {UnareaDetail ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  onClick={() => this.Ledger(UnareaDetail)}
                >
                  台账
                </Button>
              ) : (
                ''
              )}
              {UnareaDetail && UnareaDetail.zt === '待督办' && isDb ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  loading={this.state.loading1}
                  onClick={() => this.onceSupervise(true, UnareaDetail)}
                >
                  督办
                </Button>
              ) : (
                ''
              )}
              {UnareaDetail &&
              (UnareaDetail.dbid === '' ||
                (UnareaDetail.dbList &&
                  UnareaDetail.dbList.length > 0 &&
                  UnareaDetail.dbList[0].fkzt !== '1')) &&
              isDb ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  loading={this.state.feedbackButtonLoading}
                  onClick={() => this.feedback(true, UnareaDetail)}
                >
                  反馈
                </Button>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  // 日志左右切换
  dailyLeftClick = (newObjWidth, num) => {
    if (newObjWidth === 1280) {
      if (this.state.left + 146 * 4 > 0) {
        this.setState({
          left: 0,
          colordailyleft: 'gray',
          colordailyright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colordailyleft: 'blue',
          colordailyright: 'blue',
          left: this.state.left + 146 * 4,
        });
      }
    } else if (newObjWidth === 1600) {
      if (this.state.left + 242 * 4 > 0) {
        this.setState({
          left: 0,
          colordailyleft: 'gray',
          colordailyright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colordailyleft: 'blue',
          colordailyright: 'blue',
          left: this.state.left + 242 * 4,
        });
      }
    } else if (newObjWidth === 1680) {
      if (this.state.left + 262 * 4 > 0) {
        this.setState({
          left: 0,
          colordailyleft: 'gray',
          colordailyright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colordailyleft: 'blue',
          colordailyright: 'blue',
          left: this.state.left + 262 * 4,
        });
      }
    } else if (newObjWidth === 1920) {
      if (this.state.left + 322 * 4 > 0) {
        this.setState({
          left: 0,
          colordailyleft: 'gray',
          colordailyright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colordailyleft: 'blue',
          colordailyright: 'blue',
          left: this.state.left + 322 * 4,
        });
      }
    }
  };
  dailyRightClick = (newObjWidth, num) => {
    if (newObjWidth === 1280) {
      if (this.state.left - 162 * 4 < -(162 * (num - 4))) {
        this.setState({
          left: -(162 * (num - 4)),
          colordailyright: 'gray',
          colordailyleft: 'blue',
        });
        // message.info('已经到达最末端');
      } else {
        this.setState({
          colordailyright: 'blue',
          colordailyleft: 'blue',
          left: this.state.left - 162 * 4,
        });
      }
    } else if (newObjWidth === 1600) {
      if (this.state.left - 242 * 4 < -(242 * (num - 4))) {
        this.setState({
          left: -(242 * (num - 4)),
          colordailyright: 'gray',
          colordailyleft: 'blue',
        });
        // message.info('已经到达最末端');
      } else {
        this.setState({
          colordailyright: 'blue',
          colordailyleft: 'blue',
          left: this.state.left - 242 * 4,
        });
      }
    } else if (newObjWidth === 1680) {
      if (this.state.left - 262 * 4 < -(262 * (num - 4))) {
        this.setState({
          left: -(262 * (num - 4)),
          colordailyright: 'gray',
          colordailyleft: 'blue',
        });
        // message.info('已经到达最末端');
      } else {
        this.setState({
          colordailyright: 'blue',
          colordailyleft: 'blue',
          left: this.state.left - 262 * 4,
        });
      }
    } else if (newObjWidth === 1920) {
      if (this.state.left - 241 * 4 < -(241 * (num - 4))) {
        this.setState({
          left: -(241 * (num - 4)),
          colordailyright: 'gray',
          colordailyleft: 'blue',
        });
        // message.info('已经到达最末端');
      } else {
        this.setState({
          colordailyright: 'blue',
          colordailyleft: 'blue',
          left: this.state.left - 241 * 4,
        });
      }
    }
  };

  // 轨迹左右切换
  trailLeftClick = (newObjWidth, num) => {
    if (newObjWidth === 1280) {
      if (this.state.trailLeft + 146 * 4 > 0) {
        this.setState({
          trailLeft: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          trailLeft: this.state.trailLeft + 146 * 4,
        });
      }
    } else if (newObjWidth === 1600) {
      if (this.state.trailLeft + 226 * 4 > 0) {
        this.setState({
          trailLeft: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          trailLeft: this.state.trailLeft + 226 * 4,
        });
      }
    } else if (newObjWidth === 1680) {
      if (this.state.trailLeft + 246 * 4 > 0) {
        this.setState({
          trailLeft: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          trailLeft: this.state.trailLeft + 246 * 4,
        });
      }
    } else if (newObjWidth === 1920) {
      if (this.state.trailLeft + 241 * 4 > 0) {
        this.setState({
          trailLeft: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          trailLeft: this.state.trailLeft + 241 * 4,
        });
      }
    }
  };
  trailRightClick = (newObjWidth, num) => {
    if (newObjWidth === 1280) {
      if (num > 4) {
        if (this.state.trailLeft - 146 * 4 < -(146 * (num - 4))) {
          this.setState({
            trailLeft: -(146 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            trailLeft: this.state.trailLeft - 146 * 4,
          });
        }
      } else {
        this.setState({
          trailLeft: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    } else if (newObjWidth === 1600) {
      if (num > 4) {
        if (this.state.trailLeft - 226 * 4 < -(226 * (num - 4))) {
          this.setState({
            trailLeft: -(226 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            trailLeft: this.state.trailLeft - 226 * 4,
          });
        }
      } else {
        this.setState({
          trailLeft: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    } else if (newObjWidth === 1680) {
      if (num > 4) {
        if (this.state.trailLeft - 246 * 4 < -(246 * (num - 4))) {
          this.setState({
            trailLeft: -(246 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            trailLeft: this.state.trailLeft - 246 * 4,
          });
        }
      } else {
        this.setState({
          trailLeft: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    } else if (newObjWidth === 1920) {
      if (num > 4) {
        if (this.state.trailLeft - 241 * 4 < -(241 * (num - 4))) {
          this.setState({
            colortrailright: 'gray',
            colortrailleft: 'blue',
            trailLeft: -(241 * (num - 4)),
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            trailLeft: this.state.trailLeft - 241 * 4,
          });
        }
      } else {
        this.setState({
          trailLeft: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    }
  };
  // foot = () => {
  //   return (
  //     <div>
  //       <Button onClick={this.onCancel}>取消</Button>
  //       <Button type="primary" onClick={this.onCancel}>
  //         确定
  //       </Button>
  //     </div>
  //   );
  // };
  trajectoryTitle = paneData => {
    this.props.dispatch({
      type: 'areaData/areaPartVideo',
      payload: {
        handleareaNum: paneData.handlearea_num,
        startTime: paneData.startTime,
        finishTime: paneData.finishTime,
        roomId: paneData.room_id,
        roomName: paneData.room_name,
      },
    });
  };
  Title = (roomName, trackTime, trackLeftTime, paneData) => {
    return (
      <div className={styles.trajectory} onClick={() => this.trajectoryTitle(paneData)}>
        <p className={styles.clsj_times}>
          <Ellipsis lines={1} tooltip>
            {roomName}
          </Ellipsis>
        </p>
        <p className={styles.clsj_times}>{trackTime}</p>
        <p className={styles.clsj_times}>{trackLeftTime}</p>
        {/*<p className={styles.clsj_time}>{clsj}</p>*/}
      </div>
    );
  };

  openPersonDetail = (idcard, name) => {
    if (idcard && name) {
      this.props.dispatch({
        type: 'AllDetail/AllDetailPersonFetch',
        payload: {
          name: name,
          sfzh: idcard,
        },
        callback: data => {
          if (data && data.ryxx) {
            this.props.dispatch(
              routerRedux.push({
                pathname: '/lawEnforcement/PersonFile/Detail',
                query: { id: idcard, record: data },
              }),
            );
            // const divs = (
            //     <div>
            //         <PersonDetail
            //             {...this.props}
            //             name={name}
            //             idcard={idcard}
            //         />
            //     </div>
            // );
            // const AddNewDetail = { title: '人员档案', content: divs, key: idcard + name + 'ryda' };
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
  // 根据案件编号打开案件窗口
  openCaseDetail = areaDetails => {
    // console.log('areaDetails', areaDetails);
    if (areaDetails.ajxx.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: { id: areaDetails.ajxx.system_id, record: areaDetails },
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
    } else if (areaDetails.ajxx.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { id: areaDetails.ajxx.system_id, record: areaDetails },
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

  AllButton1 = (newObjWidth, length) => {
    let dark = this.props.global && this.props.global.dark;
    if (newObjWidth === 1280) {
      if (length > 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    } else if (newObjWidth === 1600) {
      if (length > 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    } else if (newObjWidth === 1680) {
      if (length > 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    } else if (newObjWidth === 1920) {
      if (length > 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.trailLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.trailRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div
            className={styles.IconStyle}
            style={{ width: '186px', top: '50%', marginTop: '-30px' }}
          >
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    }
  };
  // 根据随身物品ID打开物品随身物品信息的弹窗
  ssWoodDetail = (res, record) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/SsWoodMessage',
        query: { record: res.sswoodList, res: record, id: record && record.id ? record.id : '1' },
      }),
    );
    // this.setState({
    //   isState: '0',
    //   SsWpId: systemId,
    //   ssWpList: !!flag,
    // });
  };
  ajWoodDetail = (res, record) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/SaWoodMessage',
        query: { record: res.sawoodList, res: record, id: record && record.id ? res.id : '1' },
      }),
    );
    // this.setState({
    //   isState: '1',
    //   SsWpId: systemId,
    //   ssWpList: !!flag,
    // });
  };
  playVideo = UnareaDetail => {
    this.props.dispatch({
      type: 'areaData/areaAllVideo',
      payload: {
        handleareaNum: UnareaDetail.rqxx[0].haNum,
        personId: UnareaDetail.rqxx[0].person_id,
      },
    });
  };

  trailtitle(UnareaDetail) {
    return (
      <div>
        <span className={styles.trailname}>入区轨迹</span>
        <a className={styles.traillink} onClick={() => this.playVideo(UnareaDetail)}>
          播放完整视频
        </a>
      </div>
    );
  }

  renderDetail() {
    const { getFieldDecorator } = this.props.form;
    const { UnareaDetail, isDb, sureChange, loading2 } = this.state;
    // const { UnareaData:{ UnareaDetail } } = this.props;
    const ajWoodColumns = [
      {
        title: '物品名称',
        dataIndex: 'wpName',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'sl',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '物管员',
        dataIndex: 'wgr',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '办案民警',
        dataIndex: 'bary',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '处置结果',
        dataIndex: 'czjg',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '接领人员',
        dataIndex: 'jlry',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.ajWoodDetail(UnareaDetail, record)}>详情</a>
          </div>
        ),
      },
    ];
    const ssWoodColumns = [
      {
        title: '物品名称',
        dataIndex: 'wpName',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'sl',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '物管员',
        dataIndex: 'wgr',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '办案民警',
        dataIndex: 'bary',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '处置结果',
        dataIndex: 'czjg',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '接领人员',
        dataIndex: 'jlry',
        render: record => {
          return record && record.length <= 20 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 20) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.ssWoodDetail(UnareaDetail, record)}>详情</a>
          </div>
        ),
      },
    ];
    const obj1 = document.getElementsByTagName('body');
    const objwidth = obj1[0].clientWidth;
    const objheight = obj1[0].clientHeight;
    const allheight = obj1[0].scrollHeight;
    let newObjWidth = '',
      superveWidth = '',
      trackWidth = '';
    if (objheight >= allheight) {
      if (objwidth < 1280 || objwidth === 1280) {
        newObjWidth = 1280;
        superveWidth = 918;
        trackWidth = 584;
      } else if (objwidth > 1280 && objwidth < 1600) {
        newObjWidth = 1280;
        superveWidth = 918;
        trackWidth = 584;
      } else if (objwidth >= 1600 && objwidth < 1680) {
        newObjWidth = 1600;
        superveWidth = 1238;
        trackWidth = 904;
      } else if (objwidth >= 1680 && objwidth < 1920) {
        newObjWidth = 1680;
        superveWidth = 1318;
        trackWidth = 984;
      } else if (objwidth >= 1920) {
        newObjWidth = 1920;
        superveWidth = 1548;
        trackWidth = 964;
      }
    } else if (objheight < allheight) {
      if (objwidth < 1263 || objwidth === 1263) {
        newObjWidth = 1280;
        superveWidth = 918;
        trackWidth = 584;
      } else if (objwidth > 1263 && objwidth < 1583) {
        newObjWidth = 1280;
        superveWidth = 918;
        trackWidth = 584;
      } else if (objwidth >= 1583 && objwidth < 1663) {
        newObjWidth = 1600;
        superveWidth = 1238;
        trackWidth = 904;
      } else if (objwidth >= 1663 && objwidth < 1903) {
        newObjWidth = 1680;
        superveWidth = 1318;
        trackWidth = 984;
      } else if (objwidth >= 1903) {
        newObjWidth = 1920;
        superveWidth = 1548;
        trackWidth = 964;
      }
    }
    const extra = (
      <div className={styles.tableExtra}>
        <div className={styles.track} style={{ width: trackWidth }}>
          <Steps
            progressDot
            className={styles.steps}
            style={{ left: this.state.trailLeft, top: '70px' }}
            current={
              UnareaDetail && UnareaDetail.trackList && UnareaDetail.trackList.length > 0
                ? UnareaDetail.trackList.length
                : 1
            }
          >
            {UnareaDetail && UnareaDetail.trackList && UnareaDetail.trackList.length > 0
              ? UnareaDetail.trackList.map(pane => (
                  <Step title={this.Title(pane.room_name, pane.begin_time, pane.end_time, pane)} />
                ))
              : ''}
          </Steps>
        </div>
        {UnareaDetail && UnareaDetail.trackList && UnareaDetail.trackList.length > 0 ? (
          <div>{this.AllButton1(newObjWidth, UnareaDetail.trackList.length)}</div>
        ) : (
          ''
        )}
      </div>
    );
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 260 + 'px' }}
        className={styles.detailBoxScroll}
      >
        <SupervisionLog
          detailData={UnareaDetail}
          sureChangeLoading={sureChange}
          superviseloading={loading2}
          isDb={isDb}
          onceSupervise={this.onceSupervise}
          sureReform={this.sureReform}
          frompath="/handlingArea/AreaPolice/UnareaDetail"
        />
        <div className={styles.title}>
          <div
            style={{
              borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
              paddingLeft: '16px',
            }}
          >
            人员信息
          </div>
        </div>
        <div className={styles.message}>
          <Row>
            <Col md={3} sm={24}>
              <div>
                <img
                  src={
                    UnareaDetail && UnareaDetail.photo
                      ? UnareaDetail.photo
                      : dark
                      ? nophoto
                      : nophotoLight
                  }
                  style={{ width: '100%' }}
                  alt="暂无图片显示"
                />
              </div>
            </Col>
            <Col md={21} sm={24} style={{ paddingLeft: '24px' }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={5} sm={24}>
                  <div className={styles.Indexfrom}>姓名：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '42px' }}>
                    <a
                      style={{ textDecoration: 'underline' }}
                      onClick={() =>
                        this.openPersonDetail(UnareaDetail.ryxx.xyr_sfzh, UnareaDetail.ryxx.name)
                      }
                    >
                      {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.name
                        ? UnareaDetail.ryxx.name
                        : ''}
                    </a>
                  </div>
                </Col>
                <Col md={5} sm={24}>
                  <div className={styles.Indexfrom}>年龄：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '42px' }}>
                    {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.age
                      ? UnareaDetail.ryxx.age
                      : ''}
                  </div>
                </Col>
                <Col md={4} sm={24}>
                  <div className={styles.Indexfrom}>性别：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '42px' }}>
                    {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.sex
                      ? UnareaDetail.ryxx.sex
                      : ''}
                  </div>
                </Col>
                <Col md={5} sm={24}>
                  <div className={styles.Indexfrom}>证件号码：</div>
                  <div className={styles.Indextail}>
                    {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.zjhm
                      ? UnareaDetail.ryxx.zjhm
                      : ''}
                  </div>
                </Col>
                <Col md={5} sm={24}>
                  <div className={styles.Indexfrom}>人员类型：</div>
                  <div className={styles.Indextail}>
                    {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.salx_mc
                      ? UnareaDetail.ryxx.salx_mc
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <Card title="涉案信息" className={styles.saxxCard}>
                    <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
                      <Col md={6} sm={24}>
                        <div className={styles.Indexfrom}>案件编号：</div>
                        <div className={styles.Indextail}>
                          {UnareaDetail && UnareaDetail.ajxx && UnareaDetail.ajxx.ajbh ? (
                            UnareaDetail.ajxx.system_id && UnareaDetail.ajxx.ajlx ? (
                              <a
                                onClick={() => this.openCaseDetail(UnareaDetail)}
                                style={{ textDecoration: 'underline' }}
                              >
                                {UnareaDetail.ajxx.ajbh}
                              </a>
                            ) : (
                              UnareaDetail.ajxx.ajbh
                            )
                          ) : (
                            ''
                          )}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        <div className={styles.Indexfrom}>案件名称：</div>
                        <div className={styles.Indextail}>
                          {UnareaDetail && UnareaDetail.ajxx && UnareaDetail.ajxx.ajmc
                            ? UnareaDetail.ajxx.ajmc
                            : ''}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        <div className={styles.Indexfrom}>案件状态：</div>
                        <div className={styles.Indextail}>
                          {UnareaDetail && UnareaDetail.ajxx && UnareaDetail.ajxx.ajzt
                            ? UnareaDetail.ajxx.ajzt
                            : ''}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        <div className={styles.Indexfrom}>案发时段：</div>
                        <div className={styles.Indextail}>
                          {UnareaDetail &&
                          UnareaDetail.ajxx &&
                          UnareaDetail.ajxx.fasjsx &&
                          UnareaDetail.ajxx.fasjxx
                            ? UnareaDetail.ajxx.fasjsx + '~' + UnareaDetail.ajxx.fasjxx
                            : ''}
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
                      <Col md={6} sm={24}>
                        <div className={styles.Indexfrom}>办案单位：</div>
                        <div className={styles.Indextail}>
                          {UnareaDetail && UnareaDetail.ajxx && UnareaDetail.ajxx.bardwmc
                            ? UnareaDetail.ajxx.bardwmc
                            : ''}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        <div className={styles.Indexfrom}>办案人：</div>
                        <div className={styles.Indextail} style={{ paddingLeft: '56px' }}>
                          {UnareaDetail && UnareaDetail.ajxx && UnareaDetail.ajxx.barxm
                            ? UnareaDetail.ajxx.barxm
                            : ''}
                        </div>
                      </Col>
                      <Col md={12} sm={24}>
                        <div className={styles.Indexfrom}>案发地点：</div>
                        <div className={styles.Indextail}>
                          {UnareaDetail && UnareaDetail.ajxx && UnareaDetail.ajxx.afdd
                            ? UnareaDetail.ajxx.afdd
                            : ''}
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
                      <Col md={24} sm={24}>
                        <div className={styles.Indexfrom}>简要案情：</div>
                        <DetailShow
                          paddingLeft={70}
                          word={UnareaDetail && UnareaDetail.jyaq ? UnareaDetail.jyaq : ''}
                          {...this.props}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {UnareaDetail && UnareaDetail.rqxx && UnareaDetail.rqxx.length > 0 ? (
          <div>
            <div className={styles.title}>
              <div
                style={{
                  borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                  paddingLeft: '16px',
                }}
              >
                入区详情
              </div>
            </div>
            <div className={styles.message}>
              <Row style={{ marginLeft: -24 }}>
                <Col md={6} sm={24}>
                  <div className={styles.Indexfrom}>办案区名称：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '112px' }}>
                    {UnareaDetail &&
                    UnareaDetail.rqxx &&
                    UnareaDetail.rqxx.length > 0 &&
                    UnareaDetail.rqxx[0].haName
                      ? UnareaDetail.rqxx[0].haName
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={styles.Indexfrom}>入区时间：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail &&
                    UnareaDetail.rqxx &&
                    UnareaDetail.rqxx.length > 0 &&
                    UnareaDetail.rqxx[0].rqsj
                      ? UnareaDetail.rqxx[0].rqsj
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={styles.Indexfrom}>离区时间：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail &&
                    UnareaDetail.rqxx &&
                    UnareaDetail.rqxx.length > 0 &&
                    UnareaDetail.rqxx[0].leave_time
                      ? UnareaDetail.rqxx[0].leave_time
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={styles.Indexfrom}>滞留时长：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail &&
                    UnareaDetail.rqxx &&
                    UnareaDetail.rqxx.length > 0 &&
                    UnareaDetail.rqxx[0].detain_time
                      ? UnareaDetail.rqxx[0].detain_time
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row style={{ marginLeft: -24 }}>
                <Col md={6} sm={24}>
                  <div className={styles.Indexfrom}>入区原因：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.rqyy
                      ? UnareaDetail.ryxx.rqyy
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={styles.Indexfrom}>办案民警：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail &&
                    UnareaDetail.rqxx &&
                    UnareaDetail.rqxx.length > 0 &&
                    UnareaDetail.rqxx[0].bar
                      ? UnareaDetail.rqxx[0].bar
                      : ''}
                  </div>
                </Col>
                <Col md={12} sm={24}>
                  <div className={styles.Indexfrom}>办案单位：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail &&
                    UnareaDetail.rqxx &&
                    UnareaDetail.rqxx.length > 0 &&
                    UnareaDetail.rqxx[0].badw_mc
                      ? UnareaDetail.rqxx[0].badw_mc
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row style={{ marginLeft: -24 }}>
                <Col md={24} sm={24}>
                  <div className={styles.Indexfrom}>入区事由：</div>
                  <div className={styles.Indextail} style={{ paddingLeft: '98px' }}>
                    {UnareaDetail && UnareaDetail.ryxx && UnareaDetail.ryxx.rqsy
                      ? UnareaDetail.ryxx.rqsy
                      : ''}
                  </div>
                </Col>
              </Row>
              {UnareaDetail && UnareaDetail.trackList && UnareaDetail.trackList.length > 0 ? (
                <Card title={this.trailtitle(UnareaDetail)}>
                  {UnareaDetail && UnareaDetail.trackList && UnareaDetail.trackList.length > 0
                    ? extra
                    : ''}
                </Card>
              ) : (
                ''
              )}
            </div>
          </div>
        ) : (
          ''
        )}

        <div className={styles.title}>
          <div
            style={{
              borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
              paddingLeft: '16px',
            }}
          >
            随身物品信息
          </div>
        </div>
        <div className={styles.tablemessage} style={{ padding: '0 24px 24px' }}>
          <Table
            bordered
            // size={'middle'}
            style={{ backgroundColor: dark ? '#252C3C' : '#fff' }}
            className={styles.sswpxxTable}
            pagination={{
              pageSize: 3,
              showTotal: (total, range) => (
                <div style={{ color: '#b7b7b7' }}>
                  共 {Math.ceil(total / 3)} 页， {total} 条记录
                </div>
              ),
              onChange: page => {
                this.setState({ ssWoodCurrent: page });
              },
            }}
            dataSource={UnareaDetail ? UnareaDetail.sswoodList : []}
            columns={ssWoodColumns}
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

        <div className={styles.title}>
          <div
            style={{
              borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
              paddingLeft: '16px',
            }}
          >
            涉案物品信息
          </div>
        </div>
        <div className={styles.tablemessage} style={{ padding: '0 24px 24px' }}>
          <Table
            // size={'middle'}
            bordered
            style={{ backgroundColor: '#252C3C' }}
            className={styles.sswpxxTable}
            pagination={{
              pageSize: 3,
              showTotal: (total, range) => (
                <div style={{ color: '#b7b7b7' }}>
                  共 {Math.ceil(total / 3)} 页， {total} 条记录
                </div>
              ),
              onChange: page => {
                this.setState({ ajWoodCurrent: page });
              },
            }}
            dataSource={UnareaDetail ? UnareaDetail.sawoodList : []}
            columns={ajWoodColumns}
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
      </div>
    );
  }

  render() {
    const {
      superviseVisibleModal,
      history,
      UnareaDetail,
      ssWpList,
      SsWpId,
      isState,
      RestDbrz,
      reformModal,
      seeDetail,
      Isdetail,
      NowDbrz,
      feedbackVisibleModal,
    } = this.state;
    // const { getFieldDecorator } = this.props.form;
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
        {/*caseDetails={this.state.UnareaDetail}*/}
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
        {/*detailsData={this.state.UnareaDetail}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
        {/*{ssWpList ?*/}
        {/*<SsWoodMessage*/}
        {/*visible={ssWpList}*/}
        {/*closeModal={this.closeSswpModal}*/}
        {/*isState={isState}*/}
        {/*data={isState === '0' ? UnareaDetail.sswoodList : UnareaDetail.sawoodList}*/}
        {/*wpId={SsWpId}*/}
        {/*/>*/}
        {/*: ''*/}
        {/*}*/}

        {/*{reformModal ?*/}
        {/*<Modal*/}
        {/*maskClosable={false}*/}
        {/*visible={reformModal}*/}
        {/*title={<p>提示</p>}*/}
        {/*width='1000px'*/}
        {/*footer={this.foot1()}*/}
        {/*onCancel={() => this.onReformCancel()}*/}
        {/*// onOk={() => this.onOk(this.props.id)}*/}
        {/*centered={true}*/}
        {/*className={styles.indexdeepmodal}*/}
        {/*>*/}
        {/*<div className={styles.question}>问题是否已经整改完毕？</div>*/}
        {/*</Modal> : ''*/}
        {/*}*/}
      </div>
    );
  }
}
