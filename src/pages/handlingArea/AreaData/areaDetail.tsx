/*
 * handlingArea/areaDetail.tsx 办案区数据
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
  Table,
  Modal,
  message,
  Empty,
} from 'antd';
// import Result from '../../components/Result';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
// import SsWoodMessage from '../../components/personnelFiles/SsWoodMessage';
// import ItemDetail from '../ItemRealData/itemDetail';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../NewXzCaseRealData/caseDetail';
// import ShareModal from '../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import nophoto from '../../../assets/common/nophoto.png';
import nophotoLight from '../../../assets/common/nophotoLight.png';
import share from '../../../assets/common/share.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share1 from '../../../assets/common/share1.png';
import left from '../../../assets/common/left.png';
import left1 from '../../../assets/common/left1.png';
import left2 from '../../../assets/common/left2.png';
import right from '../../../assets/common/right.png';
import right1 from '../../../assets/common/right1.png';
import right2 from '../../../assets/common/right2.png';

import styles from './areaDetail.less';
import liststyles from '../../common/listDetail.less';
import { autoheight, getUserInfos, userResourceCodeDb } from '../../../utils/utils';
import { authorityIsTrue } from '../../../utils/authority';
import noList from '@/assets/viewData/noList.png';
import { routerRedux } from 'dva/router';
import noListLight from '@/assets/viewData/noListLight.png';
import { tableList } from '@/utils/utils';
import moment from 'moment/moment';

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
@connect(({ areaData, loading, common, MySuperviseData, CaseData, AllDetail, global }) => ({
  areaData,
  loading,
  common,
  MySuperviseData,
  CaseData,
  AllDetail,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class areaDetail extends PureComponent {
  constructor(props) {
    super(props);
    let res = props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      ajWoodCurrent: 1, // 涉案物品信息默认在第一页
      ssWoodCurrent: 1, // 随身信息默认在第一页
      left: '0',
      colortrailleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
      colortrailright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
      wtfl: '', // 问题判定的初始状态
      zgyj: '', // 整改意见的初始状态
      areaDetails: [],

      // 问题判定模态框
      superviseVisibleModal: false,
      // 点击列表的督办显示的基本信息
      superviseWtlx: '',
      // superviseZrdw: '',
      // superviseZrr: '',
      // superviseZrdwId: '',
      // id: '',
      // sfzh: '',
      // 问题判定的来源参数
      from: '',
      // 子系统的id
      systemId: '',
      ssWpList: false,
      SsWpId: '', // 弹出随身物品详情弹窗时默认选中的状态
      isState: '0', // 是随身物品信息还是涉案物品信息，0是随身，1是涉案

      shareVisible: false,
      shareItem: null,
      personList: [],
      lx: '人员信息',
      tzlx: 'baqxx',
      sx: '',
      sfgz: res && res.sfgz === 0 ? res.sfgz : '',

      IsSure: false, // 确认详情是否加载成功
      isDb: authorityIsTrue(userResourceCodeDb.baq), // 督办权限\
      record: res, // 表格信息
    };
  }

  componentDidMount() {
    if (
      (this.props.location &&
        this.props.location.query &&
        this.state.record &&
        this.state.record.system_id) ||
      this.props.location.query.id
    ) {
      this.getDetail(
        this.state.record.system_id ? this.state.record.system_id : this.props.location.query.id,
      );
    }
    this.getDictype();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset &&
      nextProps.global.isResetList.url === '/handlingArea/AreaData/areaDetail'
    ) {
      this.getDetail(this.props.location.query.id);
    }
  }

  getDetail(id) {
    this.setState(
      {
        IsSure: false,
      },
      () => {
        this.props.dispatch({
          type: 'areaData/areaDetailFetch',
          payload: {
            system_id: id,
          },
          callback: data => {
            if (data) {
              this.setState({
                areaDetails: data,
                IsSure: true,
              });
            }
          },
        });
      },
    );
  }

  getDictype() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '2018',
      },
    });
  }

  onceSupervise = (areaDetails, flag, from) => {
      let res = {
          system_id: areaDetails.system_id,
          id: areaDetails.id,
          zrdwList:areaDetails.zrdwList
      }
    if (areaDetails) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Supervise',
          query: {
            record: res,
            id: areaDetails && areaDetails.id ? areaDetails.id : '1',
            from: '办案区详情问题判定',
            tzlx: 'baqxx',
            fromPath: '/handlingArea/AreaData/areaDetail',
            wtflId: '203203',
            wtflMc: '办案区',
            tabName: '问题判定'
          },
        }),
      );

      // this.setState({
      //   // systemId: areaDetails.ryxx.system_id,
      //   superviseVisibleModal: !!flag,
      //   superviseWtlx: areaDetails.wtlx,
      //   // superviseZrdw: areaDetails.ryxx.badw,
      //   // superviseZrdwId: areaDetails.ryxx.badwDm,
      //   // superviseZrr: areaDetails.ryxx.bar,
      //   // id: areaDetails.wtid,
      //   // sfzh: areaDetails.ryxx.barzjhm,
      //   from: from,
      // });
    } else {
      message.error('该人员无法进行问题判定');
    }
  };
  // 关闭督办模态框
  closeModal = (flag, param) => {
    this.setState({
      superviseVisibleModal: !!flag,
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
  // saveModal = (flag, param, wjxx,newdbzrr,newdbzrdw,newdbzrdwid,newdbzrrsfzh, OptionCode, OptionName,cljg_mc,cljg_yy) => {
  //     this.setState({
  //         superviseVisibleModal: !!flag,
  //         loading1: true,
  //     });
  //     const {superviseZrdwId, superviseZrdw, superviseZrr, sfzh} = this.state;
  //     if (newdbzrdwid && newdbzrdw && newdbzrr && newdbzrrsfzh) {
  //         this.props.dispatch({
  //             type: 'CaseData/CaseSureSupervise',
  //             payload: {
  //                 wjxx,
  //                 system_id: this.state.systemId,
  //                 wtfl_id: '203203',
  //                 wtfl_mc: '办案区',
  //                 wtlx_id: OptionCode,
  //                 wtlx_mc: OptionName,
  //                 zgyj: param,
  //                 zrr_dwid: newdbzrdwid,
  //                 zrr_dwmc: newdbzrdw,
  //                 zrr_name: newdbzrr,
  //                 zrr_sfzh: newdbzrrsfzh,
  //                 ajbh:this.state.areaDetails&&this.state.areaDetails.ajbh?this.state.areaDetails.ajbh:'',
  //                 ajmc: this.state.areaDetails && this.state.areaDetails.ajmc ? this.state.areaDetails.ajmc : '',
  //                 cljg_mc:cljg_mc,
  //                 cljg_yy:cljg_yy,
  //             },
  //             callback: (data) => {
  //                 message.info('问题判定保存完成');
  //                 this.getDetail(this.props.id);
  //                 this.setState({
  //                     // is_ok: '1',
  //                     loading1: false,
  //                 });
  //             },
  //         });
  //     }
  //     else {
  //         message.info('因缺少相关数据，该问题暂时无法判定。');
  //         this.setState({
  //             // is_ok: '1',
  //             loading1: false,
  //         });
  //     }
  //
  // };

  // 问题判定完成后页面刷新
  Refresh = flag => {
    this.setState({
      superviseVisibleModal: !!flag,
    });
    this.getDetail(this.props.id);
  };
  refreshTable = param => {
    if (param.movefrom === '办案区常规') {
      this.props.dispatch({
        type: 'areaData/areaFetch',
        payload: {
          // currentPage: param.current,
          // showCount: tableList,
          pd: {},
        },
      });
    } else if (param.movefrom === '办案区预警') {
      this.props.dispatch({
        type: 'EarlyWarning/getList',
        payload: {
          pd: { yj_type: 'baq' },
        },
      });
    }
  };
  // 分享和关注（2为分享，1为关注）
  saveShare = (areaDetails, res, type, ajGzLx) => {
    // console.log('aaa',(res.jjdw?res.jjdw+'、':'') + (res.jjly_mc?res.jjly_mc:''));
    this.setState({
      sx:
        (res.ajmc ? res.ajmc + '、' : '') +
        (res.salx_mc ? res.salx_mc + '、' : '') +
        (res.name ? res.name : ''),
    });
    if (type === 2) {
      let detail = [
        `人员姓名：${areaDetails && areaDetails.name ? areaDetails.name : ''}`,
        `性别：${areaDetails && areaDetails.sex ? areaDetails.sex : ''}`,
        `人员类型：${areaDetails && areaDetails.salx_mc ? areaDetails.salx_mc : ''}`,
        `强制措施：${areaDetails && areaDetails.qzcs ? areaDetails.qzcs : ''}`,
        `案件名称：${areaDetails && areaDetails.ajmc ? areaDetails.ajmc : ''}`,
        `办案单位：${areaDetails && areaDetails.badw ? areaDetails.badw : ''}`,
        `办案民警：${areaDetails && areaDetails.bar ? areaDetails.bar : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: res,
            id: res && res.id ? res.id : '1',
            from: '人员信息',
            tzlx: 'baqxx',
            fromPath: '/handlingArea/AreaData/areaDetail',
            tab: '详情',
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.salx_mc ? res.salx_mc + '、' : '') +
              (res.name ? res.name : ''),
          },
        }),
      );
      // this.setState({
      //   shareVisible: true,
      //   shareItem: res,
      // });
    } else {
      if (this.state.IsSure) {
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            agid: areaDetails.id,
            lx: this.state.lx,
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.salx_mc ? res.salx_mc + '、' : '') +
              (res.name ? res.name : ''),
            type: type,
            tzlx: this.props.yjType === 'yj' ? 'baqyj' : this.state.tzlx,
            wtid: res.wtid,
            ajbh: res.ajbh,
            system_id: areaDetails.system_id,
            ajGzLx: ajGzLx,
            is_fxgz: '0',
          },
          callback: res => {
            if (!res.error) {
              // alert(1)
              message.success('关注成功');
              this.refreshTable(this.props.location.query);
              // if (this.props.getArea) {
              //   this.props.getArea({ currentPage: this.props.current, pd: this.props.formValues });
              // }
              // this.setState(
              //   {
              //     sfgz: 1,
              //   },
              //   () => {
              this.getDetail(areaDetails.ryxx.system_id);
              //   },
              // );
            }
          },
        });
      } else {
        message.warning('您的操作太频繁，请稍后再试');
      }
    }
  };
  // 取消关注
  noFollow = areaDetails => {
    if (this.state.IsSure) {
      this.props.dispatch({
        type: 'share/getNoFollow',
        payload: {
          id: areaDetails.gzid,
          tzlx: areaDetails.tzlx,
          ajbh: areaDetails.ajbh,
        },
        callback: res => {
          if (!res.error) {
            message.success('取消关注成功');
            this.refreshTable(this.props.location.query);
            // if (this.props.getArea) {
            //   this.props.getArea({ currentPage: this.props.current, pd: this.props.formValues });
            // }
            // this.setState(
            //   {
            //     sfgz: 0,
            //   },
            //   () => {
            this.getDetail(areaDetails.ryxx.system_id);
            //   },
            // );
          }
        },
      });
    } else {
      message.warning('您的操作太频繁，请稍后再试');
    }
  };
  handleCancel = e => {
    this.setState({
      shareVisible: false,
    });
  };
  // 台账
  Ledger = res => {
      let record = {
          system_id: res.system_id,
          id: res.id
      }
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/PersonLedger',
        query: {
          record: record,
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
    const { sfgz, isDb, record } = this.state;
    // const { areaData:{areaDetails,handleAreaSfgz} } = this.props;
    let dark = this.props.global && this.props.global.dark;
    let handleAreaSfgz, areaDetails;
    if (
      this.state.areaDetails &&
      this.props.areaData &&
      this.props.areaData.areaDetails &&
      this.state.areaDetails.id === this.props.areaData.areaDetails.id
    ) {
      handleAreaSfgz = this.props.areaData.handleAreaSfgz;
      areaDetails = this.props.areaData.areaDetails;
      this.setState({
        areaDetails,
      });
    } else {
      handleAreaSfgz = this.state.areaDetails ? this.state.areaDetails.sfgz : '';
      areaDetails = this.state.areaDetails;
    }
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*{isDb && areaDetails && areaDetails.zrdwList && areaDetails.zrdwList.length > 0 ? (*/}
          {/*<div style={{ textAlign: 'left', padding: '6px 0' }}>*/}
          {/*<Button*/}
          {/*className={styles.TopMenu}*/}
          {/*onClick={() => this.onceSupervise(areaDetails, true, '办案区详情问题判定')}*/}
          {/*>*/}
          {/*问题判定*/}
          {/*</Button>*/}
          {/*</div>*/}
          {/*) : (*/}
          {/*''*/}
          {/*)}*/}
          {/*</Col>*/}
          <Col style={{ minHeight: 0 }}>
            <span>
              {areaDetails ? (
                <span>
                  <div className={styles.objMenu}>
                    <Button
                      type="primary"
                      className={styles.TopMenu}
                      onClick={() => this.Ledger(areaDetails)}
                    >
                      台账
                    </Button>
                  </div>
                  {isDb &&
                  areaDetails &&
                  areaDetails.zrdwList &&
                  areaDetails.zrdwList.length > 0 ? (
                    <div className={styles.objMenu}>
                      <Button
                        type="primary"
                        className={styles.TopMenu}
                        onClick={() => this.onceSupervise(areaDetails, true, '办案区详情问题判定')}
                      >
                        问题判定
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
                  <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
                    <span className={liststyles.collect}>
                      {handleAreaSfgz === 0 ? (
                        <Tooltip title="关注">
                          <div onClick={() => this.saveShare(areaDetails, record, 1, 0)}>
                            <img
                              src={dark ? nocollect : nocollect1}
                              width={25}
                              height={25}
                              style={{ marginLeft: 12 }}
                            />
                            <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>关注</div>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip title="取消关注">
                          <div onClick={() => this.noFollow(areaDetails)}>
                            <img
                              src={dark ? collect : collect1}
                              width={25}
                              height={25}
                              style={{ marginLeft: 12 }}
                            />
                            <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>
                              取消关注
                            </div>
                          </div>
                        </Tooltip>
                      )}
                    </span>
                    <span
                      className={liststyles.collect}
                    >
                      <Tooltip title="分享"  onClick={() => this.saveShare(areaDetails, record, 2)}>
                        <img src={dark ? share : share1} width={20} height={20} />
                        <div style={{ fontSize: 12 }}>分享</div>
                      </Tooltip>
                    </span>
                  </span>
                </span>
              ) : (
                ''
              )}
            </span>
          </Col>
        </Row>
      </div>
    );
  }

  trajectoryTitle = paneData => {
    this.props.dispatch({
      type: 'areaData/areaPartVideo',
      payload: {
        handleareaNum: paneData.handlearea_num,
        startTime: paneData.startTime?moment(paneData.startTime).format('YYYY-MM-DD hh:mm:ss'):moment(paneData.begin_time).format('YYYY-MM-DD hh:mm:ss'),
        finishTime:paneData.finishTime?moment(paneData.finishTime).format('YYYY-MM-DD hh:mm:ss'):moment(paneData.end_time).format('YYYY-MM-DD hh:mm:ss'),
        roomId: paneData.room_id,
        roomName: paneData.room_name,
      },
      callback:(data)=>{
        if(data.error!==null){
          message.error(data.error);
        }
      }
    });
  };
  Title = (roomName, trackTime, trackLeftTime, paneData) => {
    return (
      <div className={styles.trajectory} onClick={() => this.trajectoryTitle(paneData)}>
        <p className={styles.clsj_time}>
          <Ellipsis lines={1} tooltip>
            {roomName}
          </Ellipsis>
        </p>
        <p className={styles.clsj_time}>{trackTime}</p>
        <p className={styles.clsj_time}>{trackLeftTime}</p>
        {/*<p className={styles.clsj_time}>{clsj}</p>*/}
      </div>
    );
  };
  descrip = (pane) =>{
    if(pane&&pane.children&&pane.children.length>0){
        let dark = this.props.global && this.props.global.dark;
      return (
        <div className={styles.descripStyle}>
          {pane.children.map(item => (
            <div className={styles.IndexTitle} style={{backgroundColor:dark ? '#252c3c' : '#e6e6e6'}} onClick={() => this.trajectoryTitle(item)}>
              <span className={styles.spanTitle}>{item.camera_name}</span>
            </div>
          ))}
        </div>
      )
    }
  }
  // 日志左右切换
  dailyRightClick = (newObjWidth, num) => {
    if (newObjWidth === 1280) {
      if (num > 4) {
        if (this.state.left - 146 * 4 <= -(146 * (num - 4))) {
          this.setState({
            left: -(146 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            left: this.state.left - 146 * 4,
          });
        }
      } else {
        this.setState({
          left: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    } else if (newObjWidth === 1600) {
      if (num > 4) {
        if (this.state.left - 226 * 4 <= -(226 * (num - 4))) {
          this.setState({
            left: -(226 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            left: this.state.left - 226 * 4,
          });
        }
      } else {
        this.setState({
          left: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    } else if (newObjWidth === 1680) {
      if (num > 4) {
        if (this.state.left - 246 * 4 <= -(246 * (num - 4))) {
          this.setState({
            left: -(246 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            left: this.state.left - 246 * 4,
          });
        }
      } else {
        this.setState({
          left: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    } else if (newObjWidth === 1920) {
      if (num > 4) {
        if (this.state.left - 241 * 4 <= -(241 * (num - 4))) {
          this.setState({
            left: -(241 * (num - 4)),
            colortrailright: 'gray',
            colortrailleft: 'blue',
          });
          // message.info('已经到达最末端');
        } else {
          this.setState({
            colortrailright: 'blue',
            colortrailleft: 'blue',
            left: this.state.left - 241 * 4,
          });
        }
      } else {
        this.setState({
          left: 0,
          colortrailright: 'gray',
          colortrailleft: 'blue',
        });
        // message.info('已经到达最末端');
      }
    }
  };
  dailyLeftClick = (newObjWidth, num) => {
    if (newObjWidth === 1280) {
      if (this.state.left + 146 * 4 >= 0) {
        this.setState({
          left: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          left: this.state.left + 146 * 4,
        });
      }
    } else if (newObjWidth === 1600) {
      if (this.state.left + 226 * 4 >= 0) {
        this.setState({
          left: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          left: this.state.left + 226 * 4,
        });
      }
    } else if (newObjWidth === 1680) {
      if (this.state.left + 246 * 4 >= 0) {
        this.setState({
          left: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          left: this.state.left + 246 * 4,
        });
      }
    } else if (newObjWidth === 1920) {
      if (this.state.left + 241 * 4 >= 0) {
        this.setState({
          left: 0,
          colortrailleft: 'gray',
          colortrailright: 'blue',
        });
        // message.info('已经到达最开始');
      } else {
        this.setState({
          colortrailleft: 'blue',
          colortrailright: 'blue',
          left: this.state.left + 241 * 4,
        });
      }
    }
  };
  // Option = (WtlxBaqTypeData) => {
  //   console.log('WtlxBaqTypeData',WtlxBaqTypeData);
  //     const Cole = [];
  //     for (let i = 0; i < WtlxBaqTypeData.length; i++) {
  //         Cole.push(WtlxBaqTypeData[i]);
  //     }
  //     return (
  //         WtlxBaqTypeData.map(label => {
  //             return (
  //                 <Option key={label.code} value={[label.name, label.code]}>{label.name}</Option>
  //             );
  //         })
  //     );
  // };
  AllButton = (newObjWidth, length) => {
    // console.log('newObjWidth',newObjWidth);
    let dark = this.props.global && this.props.global.dark;
    if (newObjWidth === 1280) {
      if (length > 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px' }}>
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    } else if (newObjWidth === 1600) {
      if (length > 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    } else if (newObjWidth === 1680) {
      if (length > 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
            <img src={left1} width="45" height="45" />
            <img src={right1} width="45" height="45" style={{ marginLeft: '30px' }} />
          </div>
        );
      }
    } else if (newObjWidth === 1920) {
      if (length > 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
            {this.state.colortrailleft === 'blue' ? (
              <img
                src={dark ? left : left2}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                src={left1}
                width="45"
                height="45"
                onClick={() => this.dailyLeftClick(newObjWidth, length)}
              />
            )}
            {this.state.colortrailright === 'blue' ? (
              <img
                src={dark ? right : right2}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px', cursor: 'pointer' }}
              />
            ) : (
              <img
                src={right1}
                width="45"
                height="45"
                onClick={() => this.dailyRightClick(newObjWidth, length)}
                style={{ marginLeft: '30px' }}
              />
            )}
          </div>
        );
      } else if (length <= 4) {
        return (
          <div className={styles.IconStyle} style={{ width: '210px', bottom: '200px' }}>
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
  // 根据涉案物品ID打开物品详细窗口
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
  playVideo = areaDetails => {
    this.props.dispatch({
      type: 'areaData/areaAllVideo',
      payload: {
        handleareaNum: areaDetails.rqxx[0].haNum,
        personId: areaDetails.rqxx[0].person_id,
      },
      callback:(data)=>{
        if(data.error!==null){
          message.error(data.error);
        }
      }
    });
  };

  trailtitle(areaDetails) {
    return (
      <div>
        <span className={styles.trailname}>入区轨迹</span>
        <a className={styles.traillink} onClick={() => this.playVideo(areaDetails)}>
          播放完整视频
        </a>
      </div>
    );
  }

  openPersonDetail = areaDetails => {
    if (areaDetails && areaDetails.ryxx && areaDetails.ryxx.xyr_sfzh && areaDetails.ryxx.name) {
      this.props.dispatch({
        type: 'AllDetail/AllDetailPersonFetch',
        payload: {
          name: areaDetails.ryxx.name,
          sfzh: areaDetails.ryxx.xyr_sfzh,
        },
        callback: data => {
          // console.log('data', data);
          if (data && data.ryxx) {
            this.props.dispatch(
              routerRedux.push({
                pathname: '/lawEnforcement/PersonFile/Detail',
                query: { id: areaDetails.ryxx.xyr_sfzh, record: data },
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
      let res = {
          system_id: areaDetails.system_id,
          id: areaDetails.id
      }
    if (areaDetails.ajxx.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: { id: areaDetails.ajxx.system_id, record: res },
        }),
      );
      // const divs = (
      //     <div>
      //         <CaseDetail
      //             {...this.props}
      //             id={areaDetails.ajxx.system_id}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '刑事案件详情', content: divs, key: areaDetails.ajxx.ajbh };
      // this.props.newDetail(AddNewDetail);
    } else if (areaDetails.ajxx.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { id: areaDetails.ajxx.system_id, record: res },
        }),
      );
      // const divs = (
      //     <div>
      //         <XzCaseDetail
      //             {...this.props}
      //             id={areaDetails.ajxx.system_id}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '行政案件详情', content: divs, key: areaDetails.ajxx.ajbh };
      // this.props.newDetail(AddNewDetail);
    }
  };

  renderDetail() {
    const { getFieldDecorator } = this.props.form;
    const { areaDetails, isDb } = this.state;
    const colLayoutInName = { sm: 24, md: 5, xl: 5 };
    const colLayoutInData = { sm: 24, md: 19, xl: 19 };
    let dark = this.props.global && this.props.global.dark;
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
        // render: (record) => {
        //   return(
        //     record && record.length <= 20 ? record :
        //       <Tooltip title={record}>
        //         <span>{record && record.substring(0, 20) + '...'}</span>
        //       </Tooltip>
        //   )
        // },
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
            <a onClick={() => this.ajWoodDetail(areaDetails, record)}>详情</a>
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
        // render: (record) => {
        //   return(
        //     record && record.length <= 20 ? record :
        //       <Tooltip title={record}>
        //         <span>{record && record.substring(0, 20) + '...'}</span>
        //       </Tooltip>
        //   )
        // },
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
            <a onClick={() => this.ssWoodDetail(areaDetails, record)}>详情</a>
          </div>
        ),
      },
    ];
    const currentArr = [];
    if (areaDetails && areaDetails.trackList && areaDetails.trackList.length > 0) {
      for (let a = 0; a < areaDetails.trackList.length; a++) {
        if (areaDetails.trackList[a].iswc === 1) {
          currentArr.push(areaDetails.trackList[a]);
        }
      }
    }
    const obj1 = document.getElementsByTagName('body');
    const objwidth = obj1[0].clientWidth;
    const objheight = obj1[0].clientHeight;
    const allheight = obj1[0].scrollHeight;
    let newObjWidth = '',
      superveWidth = '';
    // console.log('objwidth',objwidth);
    if (objheight >= allheight) {
      if (objwidth < 1280 || objwidth === 1280) {
        newObjWidth = 1280;
        superveWidth = 584;
      } else if (objwidth > 1280 && objwidth < 1600) {
        newObjWidth = 1280;
        superveWidth = 584;
        // newObjWidth = 1600;
        // superveWidth = 1225;
      } else if (objwidth >= 1600 && objwidth < 1680) {
        newObjWidth = 1600;
        superveWidth = 904;
        // newObjWidth = 1680;
        // superveWidth = 1305;
      } else if (objwidth >= 1680 && objwidth < 1920) {
        newObjWidth = 1680;
        superveWidth = 984;
        // newObjWidth = 1920;
        // superveWidth = 1545;
      } else if (objwidth >= 1920) {
        newObjWidth = 1920;
        superveWidth = 964;
      }
    } else if (objheight < allheight) {
      if (objwidth < 1263 || objwidth === 1263) {
        newObjWidth = 1280;
        superveWidth = 584;
      } else if (objwidth > 1263 && objwidth < 1583) {
        newObjWidth = 1280;
        superveWidth = 584;
        // newObjWidth = 1600;
        // superveWidth = 1225;
      } else if (objwidth >= 1583 && objwidth < 1663) {
        newObjWidth = 1600;
        superveWidth = 904;
        // newObjWidth = 1680;
        // superveWidth = 1305;
      } else if (objwidth >= 1663 && objwidth < 1903) {
        newObjWidth = 1680;
        superveWidth = 984;
        // newObjWidth = 1920;
        // superveWidth = 1545;
      } else if (objwidth >= 1903) {
        newObjWidth = 1920;
        superveWidth = 964;
      }
    }
    const extra = (
      <div className={styles.tableExtra}>
        <div className={styles.superve} style={{ width: superveWidth }}>
          <Steps
            progressDot
            className={styles.steps}
            style={{ left: this.state.left }}
            current={
              areaDetails && areaDetails.trackList && areaDetails.trackList.length > 0
                ? areaDetails.trackList.length
                : 1
            }
          >
            {areaDetails && areaDetails.trackList && areaDetails.trackList.length > 0
              ? areaDetails.trackList.map(pane => (
                  <Step title={this.Title(pane.room_name, pane.begin_time, pane.end_time, pane)} description={this.descrip(pane)} />
                ))
              : ''}
          </Steps>
        </div>
        {areaDetails && areaDetails.trackList && areaDetails.trackList.length > 0 ? (
          <div>{this.AllButton(newObjWidth, areaDetails.trackList.length)}</div>
        ) : (
          ''
        )}
      </div>
    );
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 260 + 'px' }}
        className={styles.detailBoxScroll}
      >
        <div style={{  height: 'auto' }}>
          {areaDetails && areaDetails.ajxx ? (
            <div style={{ float: 'right', padding: '16px' }}>
              <Button
                // type="primary"
                onClick={() => this.openCaseDetail(areaDetails)}
                style={{
                  background: dark
                    ? 'linear-gradient(to right, #0084FA, #03A3FF)'
                    : 'linear-gradient(to right, #3D63D1, #333FE4)',
                }}
              >
                查看当前涉案信息
              </Button>
            </div>
          ) : (
            ''
          )}
          <div style={{ content: '', clear: 'both', display: 'block' }} />
        </div>
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
                    areaDetails && areaDetails.ryxx && areaDetails.ryxx.photo
                      ? areaDetails.ryxx.photo
                      : dark
                      ? nophoto
                      : nophotoLight
                  }
                  width="120"
                  alt="暂无图片显示"
                />
              </div>
            </Col>
            <Col md={21} sm={24} style={{ paddingLeft: '24px' }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 24 }}>
                <Col md={5} sm={24}>
                  {/*<Row className={liststyles.JzInfoDiv}>*/}
                  {/*<Col sm={24} md={8} xl={8}>人员类型：</Col>*/}
                  {/*<Col sm={24} md={16} xl={16} className={liststyles.break}>*/}
                  {/*{areaDetails && areaDetails.ryxx && areaDetails.ryxx.salx_mc ? areaDetails.ryxx.salx_mc : ''}*/}
                  {/*</Col>*/}
                  {/*</Row>*/}
                  <div className={liststyles.Indexfrom} style={{ left: 27, top: 0 }}>
                    人员类型：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.salx_mc
                      ? areaDetails.ryxx.salx_mc
                      : ''}
                  </div>
                </Col>
                <Col md={5} sm={24}>
                  {/*<Row className={liststyles.JzInfoDiv}>*/}
                  {/*<Col sm={24} md={5} xl={5}>姓名：</Col>*/}
                  {/*<Col sm={24} md={19} xl={19} className={liststyles.break}>*/}
                  {/*<a style={{textDecoration: 'underline'}} onClick={() => this.openPersonDetail(areaDetails.ryxx.xyr_sfzh, areaDetails.ryxx.name)}>{areaDetails && areaDetails.ryxx && areaDetails.ryxx.name ? areaDetails.ryxx.name : ''}</a>*/}
                  {/*</Col>*/}
                  {/*</Row>*/}
                  <div className={liststyles.Indexfrom} style={{ left: 27, top: 0 }}>
                    姓名：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 42 }}>
                    <a
                      style={{ textDecoration: 'underline' }}
                      onClick={() => this.openPersonDetail(areaDetails)}
                    >
                      {areaDetails && areaDetails.ryxx && areaDetails.ryxx.name
                        ? areaDetails.ryxx.name
                        : ''}
                    </a>
                  </div>
                </Col>
                <Col md={4} sm={24}>
                  {/*<Row className={liststyles.JzInfoDiv}>*/}
                  {/*<Col sm={24} md={6} xl={6}>年龄：</Col>*/}
                  {/*<Col sm={24} md={18} xl={18} className={liststyles.break}>*/}
                  {/*{areaDetails && areaDetails.ryxx && areaDetails.ryxx.age ? areaDetails.ryxx.age : ''}*/}
                  {/*</Col>*/}
                  {/*</Row>*/}
                  <div className={liststyles.Indexfrom} style={{ left: 27, top: 0 }}>
                    年龄：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 42 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.age
                      ? areaDetails.ryxx.age
                      : ''}
                  </div>
                </Col>
                <Col md={4} sm={24}>
                  {/*<Row className={liststyles.JzInfoDiv}>*/}
                  {/*<Col sm={24} md={6} xl={6}>性别：</Col>*/}
                  {/*<Col sm={24} md={18} xl={18} className={liststyles.break}>*/}
                  {/*{areaDetails && areaDetails.ryxx && areaDetails.ryxx.sex ? areaDetails.ryxx.sex : ''}*/}
                  {/*</Col>*/}
                  {/*</Row>*/}
                  <div className={liststyles.Indexfrom} style={{ left: 27, top: 0 }}>
                    性别：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 42 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.sex
                      ? areaDetails.ryxx.sex
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  {/*<Row className={liststyles.JzInfoDiv}>*/}
                  {/*<Col sm={24} md={6} xl={6}>证件号码：</Col>*/}
                  {/*<Col sm={24} md={16} xl={16} className={liststyles.break}>*/}
                  {/*{areaDetails && areaDetails.ryxx && areaDetails.ryxx.zjhm ? areaDetails.ryxx.zjhm : ''}*/}
                  {/*</Col>*/}
                  {/*</Row>*/}
                  <div className={liststyles.Indexfrom} style={{ left: 27, top: 0 }}>
                    证件号码：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.zjhm
                      ? areaDetails.ryxx.zjhm
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <Card title="当前涉案信息" className={styles.dqsaxxCard}>
                    <Row>
                      <Col md={6} sm={24}>
                        {/*<Row className={liststyles.JzInfoDiv} style={{marginBottom:0}}>*/}
                        {/*<Col sm={24} md={6} xl={6}>案件编号：</Col>*/}
                        {/*<Col sm={24} md={18} xl={18}>*/}
                        {/*{*/}
                        {/*areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajbh ? (*/}
                        {/*// areaDetails.ajxx.system_id && areaDetails.ajxx.ajlx ? (*/}
                        {/*//   <a*/}
                        {/*//     onClick={() => this.openCaseDetail(areaDetails.ajxx.system_id, areaDetails.ajxx.ajlx, areaDetails.ajxx.ajbh)}*/}
                        {/*//     style={{textDecoration: 'underline'}}*/}
                        {/*//   >*/}
                        {/*areaDetails.ajxx.ajbh*/}
                        {/*//   </a>*/}
                        {/*// ) : areaDetails.ajxx.ajbh*/}

                        {/*) : ''*/}
                        {/*}*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        <div className={liststyles.Indexfrom} style={{ left: 12, top: 0 }}>
                          案件编号：
                        </div>
                        <div className={liststyles.Indextail} style={{ paddingLeft: 84 }}>
                          {areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajbh
                            ? areaDetails.ajxx.ajbh
                            : ''}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        {/*<Row className={liststyles.JzInfoDiv} style={{marginBottom:0}}>*/}
                        {/*<Col sm={24} md={6} xl={6}>案件名称：</Col>*/}
                        {/*<Col sm={24} md={18} xl={18}>*/}
                        {/*{areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajmc ? areaDetails.ajxx.ajmc : ''}*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        <div className={liststyles.Indexfrom} style={{ left: 12, top: 0 }}>
                          案件名称：
                        </div>
                        <div className={liststyles.Indextail} style={{ paddingLeft: 84 }}>
                          {areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajmc
                            ? areaDetails.ajxx.ajmc
                            : ''}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        {/*<Row className={liststyles.JzInfoDiv} style={{marginBottom:0}}>*/}
                        {/*<Col sm={24} md={6} xl={6}>案件类型：</Col>*/}
                        {/*<Col sm={24} md={18} xl={18}>*/}
                        {/*{areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajxz ? areaDetails.ajxx.ajxz : ''}*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        <div className={liststyles.Indexfrom} style={{ left: 12, top: 0 }}>
                          案件类型：
                        </div>
                        <div className={liststyles.Indextail} style={{ paddingLeft: 84 }}>
                          {areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajxz
                            ? areaDetails.ajxx.ajxz
                            : ''}
                        </div>
                      </Col>
                      <Col md={6} sm={24}>
                        {/*<Row className={liststyles.JzInfoDiv} style={{marginBottom:0}}>*/}
                        {/*<Col sm={24} md={6} xl={6}>案件状态：</Col>*/}
                        {/*<Col sm={24} md={18} xl={18}>*/}
                        {/*{areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajzt ? areaDetails.ajxx.ajzt : ''}*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        <div className={liststyles.Indexfrom} style={{ left: 12, top: 0 }}>
                          案件状态：
                        </div>
                        <div className={liststyles.Indextail} style={{ paddingLeft: 84 }}>
                          {areaDetails && areaDetails.ajxx && areaDetails.ajxx.ajzt
                            ? areaDetails.ajxx.ajzt
                            : ''}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {areaDetails && areaDetails.rqxx && areaDetails.rqxx.length > 0 ? (
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
              <Row style={{ marginBottom: 12 }}>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    办案区名称：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 84 }}>
                    {areaDetails &&
                    areaDetails.rqxx &&
                    areaDetails.rqxx.length > 0 &&
                    areaDetails.rqxx[0].haName
                      ? areaDetails.rqxx[0].haName
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    入区时间：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails &&
                    areaDetails.rqxx &&
                    areaDetails.rqxx.length > 0 &&
                    areaDetails.rqxx[0].rqsj
                      ? areaDetails.rqxx[0].rqsj
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    离区时间：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails &&
                    areaDetails.rqxx &&
                    areaDetails.rqxx.length > 0 &&
                    areaDetails.rqxx[0].leave_time
                      ? areaDetails.rqxx[0].leave_time
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    滞留时长：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails &&
                    areaDetails.rqxx &&
                    areaDetails.rqxx.length > 0 &&
                    areaDetails.rqxx[0].detain_time
                      ? areaDetails.rqxx[0].detain_time
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    入区原因：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.rqyy
                      ? areaDetails.ryxx.rqyy
                      : ''}
                  </div>
                </Col>
                <Col md={6} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    办案民警：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails &&
                    areaDetails.rqxx &&
                    areaDetails.rqxx.length > 0 &&
                    areaDetails.rqxx[0].bar
                      ? areaDetails.rqxx[0].bar
                      : ''}
                  </div>
                </Col>
                <Col md={12} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    办案单位：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.badw
                      ? areaDetails.ryxx.badw
                      : ''}
                  </div>
                </Col>
              </Row>
              <Row style={{ marginBottom: 12 }}>
                <Col md={24} sm={24}>
                  <div className={liststyles.Indexfrom} style={{ top: 0 }}>
                    入区事由：
                  </div>
                  <div className={liststyles.Indextail} style={{ paddingLeft: 70 }}>
                    {areaDetails && areaDetails.ryxx && areaDetails.ryxx.rqsy
                      ? areaDetails.ryxx.rqsy
                      : ''}
                  </div>
                </Col>
              </Row>
              {areaDetails && areaDetails.trackList && areaDetails.trackList.length > 0 ? (
                <Card title={this.trailtitle(areaDetails)} className={styles.rqgjCard}>
                  {areaDetails && areaDetails.trackList && areaDetails.trackList.length > 0
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
            // size={'middle'}
            // style={{ backgroundColor: '#252C3C' }}
            className={styles.sswpxxTable}
            // bordered
            pagination={{
              pageSize: 3,
              showTotal: (total, range) => (
                <div style={{ color: '#b7b7b7' }}>
                  共 {Math.ceil(total / 3)} 页，{total} 条记录
                </div>
              ),
              onChange: page => {
                this.setState({ ssWoodCurrent: page });
              },
            }}
            dataSource={areaDetails ? areaDetails.sswoodList : []}
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
            // style={{ backgroundColor: '#252C3C' }}
            className={styles.sswpxxTable}
            // bordered
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
            dataSource={areaDetails ? areaDetails.sawoodList : []}
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
    let dark = this.props.global && this.props.global.dark;
    const { superviseVisibleModal, ssWpList, SsWpId, isState } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      common: { WtlxBaqTypeData },
      areaData: { areaDetails },
    } = this.props;
    let detail = (
      <Row
        style={{
          width: '90%',
          margin: '0 38px 10px',
          lineHeight: '36px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <Col span={6}>人员姓名：{areaDetails && areaDetails.name ? areaDetails.name : ''}</Col>
        <Col span={6}>性别：{areaDetails && areaDetails.sex ? areaDetails.sex : ''}</Col>
        <Col span={6}>
          人员类型：{areaDetails && areaDetails.salx_mc ? areaDetails.salx_mc : ''}
        </Col>
        <Col span={6}>
          强制措施：
          <Tooltip
            title={
              areaDetails && areaDetails.qzcs && areaDetails.qzcs.length > 7
                ? areaDetails.qzcs
                : null
            }
          >
            {areaDetails && areaDetails.qzcs
              ? areaDetails.qzcs.length > 7
                ? areaDetails.qzcs.substring(0, 7) + '...'
                : areaDetails.qzcs
              : ''}
          </Tooltip>
        </Col>
        <Col span={6}>
          案件名称：
          <Tooltip
            title={
              areaDetails && areaDetails.ajmc && areaDetails.ajmc.length > 7
                ? areaDetails.ajmc
                : null
            }
          >
            {areaDetails && areaDetails.ajmc
              ? areaDetails.ajmc.length > 7
                ? areaDetails.ajmc.substring(0, 7) + '...'
                : areaDetails.ajmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={6}>
          办案单位：
          <Tooltip
            title={
              areaDetails && areaDetails.badw && areaDetails.badw.length > 7
                ? areaDetails.badw
                : null
            }
          >
            {areaDetails && areaDetails.badw
              ? areaDetails.badw.length > 7
                ? areaDetails.badw.substring(0, 7) + '...'
                : areaDetails.badw
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>办案民警：{areaDetails && areaDetails.bar ? areaDetails.bar : ''}</Col>
      </Row>
    );
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
        {/*caseDetails={this.state.areaDetails}*/}
        {/*getRefresh={this.Refresh}*/}
        {/*wtflId='203203'*/}
        {/*wtflMc='办案区'*/}
        {/*// 点击列表的督办显示的四个基本信息*/}
        {/*wtlx={this.state.superviseWtlx}*/}
        {/*// zrdw={this.state.superviseZrdw}*/}
        {/*// zrdwId={this.state.superviseZrdwId}*/}
        {/*// zrr={this.state.superviseZrr}*/}
        {/*// id={this.state.id}*/}
        {/*// zjhm={this.state.sfzh}*/}
        {/*from={this.state.from}*/}
        {/*/>*/}
        {/*: ''*/}
        {/*}*/}

        {/*{ssWpList ?*/}
        {/*<SsWoodMessage*/}
        {/*visible={ssWpList}*/}
        {/*closeModal={this.closeSswpModal}*/}
        {/*isState={isState}*/}
        {/*data={isState === '0' ? areaDetails.sswoodList : areaDetails.sawoodList}*/}
        {/*wpId={SsWpId}*/}
        {/*/>*/}
        {/*: ''*/}
        {/*}*/}

        {/*<ShareModal detail={detail} shareVisible={this.state.shareVisible} handleCancel={this.handleCancel}*/}
        {/*shareItem={this.state.shareItem} personList={this.state.personList} lx={this.state.lx}*/}
        {/*tzlx={this.state.tzlx} sx={this.state.sx}/>*/}
      </div>
    );
  }
}
