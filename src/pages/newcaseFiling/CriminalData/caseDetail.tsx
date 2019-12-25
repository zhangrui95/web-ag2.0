/*
 * CaseRealData/caseDetailjs 受立案刑事案件数据详情
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
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
  Modal,
} from 'antd';
import styles from './caseDetail.less';
import liststyles from '../../../pages/common/listDetail.less';
import {
  getQueryString,
  userResourceCodeDb,
  getUserInfos,
  autoheight,
  tableList,
  userAuthorityCode,
} from '../../../utils/utils';
// import ItemDetail from '../ItemRealData/itemDetail';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';
// import JqDetail from '../../routes/PoliceRealData/policeDetail';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
// import DossierDetail from '../../routes/DossierData/DossierDetail';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import ShareModal from '../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import share from '../../../assets/common/share.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share1 from '../../../assets/common/share1.png';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
// import RetrieveModal from '../../components/ShareModal/RetrieveModal';
import { authorityIsTrue } from '../../../utils/authority';
import { routerRedux } from 'dva/router';
import DetailShow from "@/components/Common/detailShow";
// import MakeTableModal from '../../../components/CaseRealData/MakeTableModal';
import {tableList} from "@/utils/utils";

@connect(({ CaseData, loading, MySuperviseData, AllDetail, global }) => ({
  CaseData,
  loading,
  MySuperviseData,
  AllDetail,
  global,
  // loading: loading.models.alarmManagement,
}))
export default class caseDetail extends PureComponent {
  constructor(props) {
    super(props);
    let res = props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      current: 1, // 涉案物品默认在第一页
      jqcurrent: 1, // 警情信息默认在第一页
      wpcurrent: 1, // 物品信息默认在第一页
      areacurrent: 1, // 人员再区情况默认在第一页
      dossiercurrent: 1, // 查看关联卷宗默认在第一页
      trailLeft: 0,
      is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
      loading1: false, // 按钮状态，默认false没加载,true是点击后的加载状态
      caseDetails: '',
      TrackPaddingTop: 0, // 初始状态的message的paddingtop;
      TrackPaddingBottom: 0, // 初始状态的message的paddingbottom;
      TrackPaddingBottom1: '220px', // 初始状态的listStyle的paddingbottom;(TrackPaddingBottom下面的一个子集)
      open: '0', // 显示‘显示更多’还是‘收起更多’,默认显示更多；
      colortrailleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
      colortrailright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
      // 督办模态框
      superviseVisibleModal: false,
      // 点击列表的督办显示的基本信息
      superviseWtlx: '',
      // 问题判定的来源参数
      from: '',
      // 子系统的id
      // systemId: '',
      sabar: '',

      shareVisible: false,
      shareItem: null,
      personList: [],
      tzlx: window.configUrl.is_area === '1' ? 'xsajxx' + 3 : 'xsajxx' + this.props.ssmk,
      lx: '案件信息',
      sx: '',
      sfgz: res && res.sfgz === 0 ? res.sfgz : '',
      policevisible: false,
      resvisible: false,
      areavisible: false,
      Dossiervisible: false,
      IsSure: false, // 确认详情是否加载成功
      isDb: authorityIsTrue(userResourceCodeDb.zfba_xs), // 督办权限
      RetrieveVisible: false, // 退补
      makeTableModalVisible: false, // 制表model
      isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
      isTb: authorityIsTrue(userAuthorityCode.TUIBU), // 退补权限
      record: res, // 表格信息record,
    };
  }

  componentDidMount() {
    this.caseDetailDatas(this.props.location.query.id);
    // if (
    //   this.props.location &&
    //   this.props.location.query &&
    //   this.props.location.query.record &&
    //   (this.props.location.query.record.system_id || this.props.location.query.id)
    // ) {
    //   this.caseDetailDatas(this.props.location.query.id);
    // }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps) {
    //   if (nextProps.sfgz !== null && nextProps.sfgz !== this.props.sfgz) {
    //     this.setState({
    //       sfgz: nextProps.sfgz,
    //     });
    //   }
    // }

    if (
      nextProps &&
      nextProps.history.location.query.isReset &&
      nextProps.history.location.pathname === '/newcaseFiling/caseData/CriminalData/caseDetail'
    ) {
      this.caseDetailDatas(this.props.location.query.id);
      this.props.history.replace(
        nextProps.history.location.pathname +
          '?id=' +
          nextProps.location.query.id +
          '&record=' +
          nextProps.location.query.record,
      );
    }
  }

  // 修改改变模态框状态 通过id 获取数据
  caseDetailDatas = id => {
    this.setState(
      {
        IsSure: false,
      },
      () => {
        this.props.dispatch({
          type: 'CaseData/getAjxxXqById',
          payload: {
            system_id: id,
          },
          callback: data => {
            if (data) {
              this.setState({
                caseDetails: data,
                IsSure: true,
              });
            }
          },
        });
      },
    );
  };

  // 问题判定
  onceSupervise = (caseDetails, flag, from) => {
    if (caseDetails) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Supervise',
          query: {
            record: caseDetails,
            id: caseDetails && caseDetails.id ? caseDetails.id : '1',
            from: '刑事案件详情问题判定',
            fromPath: '/newcaseFiling/caseData/CriminalData/caseDetail',
            wtflId: '230202',
            wtflMc: '案件',
          },
        }),
      );
      // this.setState({
      //   // systemId: caseDetails.system_id,
      //   superviseVisibleModal: !!flag,
      //   superviseWtlx: caseDetails.wtlx,
      //   // superviseZrdw: caseDetails.bardwmc,
      //   // superviseZrdwId: caseDetails.bardw,
      //   // superviseZrr: caseDetails.barxm,
      //   // id: caseDetails.wtid,
      //   // sfzh: caseDetails.barzjhm,
      //   from: from,
      //   // sabar: caseDetails.sabar,
      // });
    } else {
      message.info('该案件无法进行问题判定');
    }
  };
  // 关闭督办模态框
  closeModal = (flag, param) => {
    this.setState({
      superviseVisibleModal: !!flag,
    });
  };

  // 问题判定完成后页面刷新
  Refresh = flag => {
    this.setState({
      superviseVisibleModal: !!flag,
      loading1: false,
    });
    this.caseDetailDatas(this.props.id);
  };
  refreshTable = (param) => {
    if(param.movefrom === '刑事案件常规'){
      this.props.dispatch({
        type: 'CaseData/caseFetch',
        payload: {
          currentPage: param.current,
          showCount: tableList,
          pd: {},
        },
      });
    }
    else if(param.movefrom === '刑事案件预警'){
      this.props.dispatch({
        type: 'EarlyWarning/getList',
        payload: {
          pd: { yj_type: 'xsaj' }
        },
      });
    }
  }
  // 分享和关注（2为分享，1为关注）
  saveShare = (caseDetails, res, type, ajGzLx) => {
    this.setState({
      sx: (res && res.ajmc ? res.ajmc + '、' : '') + (res && res.schj ? res.schj : ''),
    });
    if (type === 2) {
      let detail = [
        `案件名称：${res && res.ajmc ? res.ajmc : ''}`,
        `办案单位：${res && res.bardwmc ? res.bardwmc : ''}`,
        `案件状态：${res && res.schj ? res.schj : ''}`,
        `办案民警：${res && res.barxm ? res.barxm : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: res,
            id: res && res.system_id ? res.system_id : '1',
            from: this.state.lx,
            tzlx: this.state.tzlx,
            fromPath: '/newcaseFiling/caseData/CriminalData/caseDetail',
            detail,
            tab: '详情',
            sx: (res.ajmc ? res.ajmc + '、' : '') + (res.schj ? res.schj : ''),
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
            agid: this.props.yjType === 'yj' ? this.props.yjid : caseDetails.id,
            lx: this.state.lx,
            sx: (res && res.ajmc ? res.ajmc + '、' : '') + (res && res.schj ? res.schj : ''),
            type: type,
            tzlx: this.props.location.query.tzlx,
            wtid: res.wtid,
            ajbh: res.ajbh,
            system_id: caseDetails.system_id,
            ajGzLx: ajGzLx,
          },
          callback: res => {
            if (!res.error) {
              message.success('关注成功');
              this.refreshTable(this.props.location.query);
              // if (this.props.getCase) {
              //   this.props.getCase({ currentPage: this.props.current, pd: this.props.formValues });
              // }
              // this.setState(
              //   {
              //     sfgz: 1,
              //   },
              //   () => {
                  this.caseDetailDatas(caseDetails.system_id);
              //   },
              // );
            }
          },
        });
      } else {
        message.info('您的操作太频繁，请稍后再试');
      }
    }
  };
  // 取消关注
  noFollow = caseDetails => {
    if (this.state.IsSure) {
      this.props.dispatch({
        type: 'share/getNoFollow',
        payload: {
          id: caseDetails.gzid,
          tzlx: caseDetails.tzlx,
          ajbh: caseDetails.ajbh,
        },
        callback: res => {
          if (!res.error) {
            message.success('取消关注成功');
            this.refreshTable(this.props.location.query);
            // if (this.props.getCase) {
            //   this.props.getCase({ currentPage: this.props.current, pd: this.props.formValues });
            // }
            // this.setState(
            //   {
            //     sfgz: 0,
            //   },
            //   () => {
                this.caseDetailDatas(caseDetails.system_id);
            //   },
            // );
          }
        },
      });
    } else {
      message.info('您的操作太频繁，请稍后再试');
    }
  };
  handleCancel = e => {
    this.setState({
      shareVisible: false,
    });
  };
  // 制表
  makeTable = (record, flag) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/Tabulation/Make',
        query: { id: record && record.ajbh ? record.ajbh : '1', record: record },
      }),
    );
    // this.setState({
    //   makeTableModalVisible: !!flag,
    // });
  };
  // 关闭制表modal
  MakeTableCancel = () => {
    this.setState({
      makeTableModalVisible: false,
    });
  };
  // 退补
  saveRetrieve = (res, flag) => {
    this.props.dispatch({
      type: 'CaseData/caseRetrieveFetch',
      payload: {
        currentPage: 1,
        showCount: tableList,
        pd: {
          ajbh: res.system_id,
        },
      },
      callback: data => {
        if (data && data.list.length > 0 && data.list[0].tbrq2 && data.list[0].tbyy2) {
          message.warning('该数据已完成退补功能');
          this.caseDetailDatas(this.props.location.query.id);
        } else {
          res.url = this.props.location.pathname;
          this.props.dispatch(
            routerRedux.push({
              pathname: '/Retrieve',
              query: { id: res && res.ajbh ? res.ajbh : '1', record: res, isDetail: true },
            }),
          );
          // this.setState({
          //   RetrieveVisible: !!flag,
          //   tbDetail: data.list[0],
          // });
        }
      },
    });
  };
  // 退补设置成功或取消退补
  RetrieveHandleCancel = e => {
    this.setState({
      RetrieveVisible: false,
    });
  };
  // 刷新详情
  refreshCaseDetail = () => {
    this.caseDetailDatas(this.props.id);
  };

  Topdetail() {
    const { sfgz, isDb, isZb, isTb, record } = this.state;
    const { CaseData:{handleXsCaseSfgz,caseDetails} } = this.props;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {/*<span style={{ margin: '16px', display: 'block' }}>刑事案件详情</span>*/}
            {isDb &&
            caseDetails.zrdwList &&
            caseDetails.zrdwList.length > 0 &&
            caseDetails.ssmk === '2' ? (
              <Button
                type="primary"
                className={styles.TopMenu}
                loading={this.state.loading1}
                onClick={() => this.onceSupervise(caseDetails, true, '刑事案件详情问题判定')}
              >
                问题判定
              </Button>
            ) : null}
            {isZb ? (
              <Button
                type="primary"
                className={styles.TopMenu}
                onClick={() => this.makeTable(caseDetails, true)}
              >
                制表
              </Button>
            ) : null}
            {// 案件状态为移送才能退补
            (caseDetails.ajzt && caseDetails.ajzt === '结案') ||
            !isTb ||
            caseDetails.qsrq === '' ||
            (caseDetails.tbrq2 && caseDetails.tbyy2) ? null : (
              <Button
                type="primary"
                className={styles.TopMenu}
                onClick={() => this.saveRetrieve(caseDetails, true)}
              >
                退补
              </Button>
            )}
          </Col>
          <Col>
            <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
              {caseDetails ? (
                <span>
                  <span className={liststyles.collect}>
                    {handleXsCaseSfgz === 0 ? (
                      <Tooltip title="关注">
                        <img
                          src={dark ? nocollect : nocollect1}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                          onClick={() => this.saveShare(caseDetails, record, 1, 0)}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>关注</div>
                      </Tooltip>
                    ) : (
                      <Tooltip title="取消关注">
                        <img
                          src={dark ? collect : collect1}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                          onClick={() => this.noFollow(caseDetails)}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>取消关注</div>
                      </Tooltip>
                    )}
                  </span>
                  <span
                    className={liststyles.collect}
                    onClick={() => this.saveShare(caseDetails, record, 2)}
                  >
                    <Tooltip title="分享">
                      <img src={dark ? share : share1} width={25} height={25} />
                      <div style={{ fontSize: 12 }}>分享</div>
                    </Tooltip>
                  </span>
                </span>
              ) : null}
            </span>
          </Col>
        </Row>
      </div>
    );
  }

  IntoDossierDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/dossierPolice/DossierData/DossierDetail',
        query: { record: record, id: record && record.dossier_id ? record.dossier_id : '1' },
      }),
    );
    // const divs = (
    //     <div>
    //         <DossierDetail
    //             {...this.props}
    //             id={id}
    //         />
    //     </div>
    // );
    // const AddJqDetail = { title: '卷宗详情', content: divs, key: id };
    // this.props.newDetail(AddJqDetail);
  };

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
  // 根据物品ID打开物品详细窗口
  openItemsDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/articlesInvolved/ArticlesData/itemDetail',
        query: { record: record, id: record && record.system_id ? record.system_id : '1' },
      }),
    );
    // const divs = (
    //     <div>
    //         <ItemDetail
    //             {...this.props}
    //             id={systemId}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '涉案物品详情', content: divs, key: systemId };
    // this.props.newDetail(AddNewDetail);
  };
  // 点击案件轨迹人员的在区情况
  IntoArea = record => {
    if (record) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/IntoArea',
          query: {
            record: record,
            id: record && record.id ? record.id : '1',
            movefrom: '警情常规',
          },
        }),
      );
      // const divs = (
      //     <div>
      //         <PersonIntoArea
      //             {...this.props}
      //             sfzh={sfzh}
      //             ajbh={ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: sfzh + 'ryzq' };
      // this.props.newDetail(AddNewDetail);
    } else {
      message.warning('暂无涉案人员在区情况');
    }
  };
  seePolice = (flag, caseDetails) => {
    if (caseDetails && caseDetails.jqxxList) {
      if (caseDetails.jqxxList.length === 1) {
        this.jqDetail(caseDetails.jqxxList[0]);
      } else {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/ModuleAll/RelevancePolice',
            query: {
              record: caseDetails.jqxx,
              id: caseDetails && caseDetails.id ? caseDetails.id : '1',
            },
          }),
        );
        // this.setState({
        //   policevisible: !!flag,
        // });
      }
    }
  };

  // policeCancel = e => {
  //   this.setState({
  //     policevisible: false,
  //   });
  // };

  seeRes = (flag, caseDetails) => {
    if (caseDetails && caseDetails.sawpList) {
      if (caseDetails && caseDetails.sawpList.length === 1) {
        this.openItemsDetail(caseDetails.sawpList[0]);
      } else {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/ModuleAll/RelevanceRes',
            query: {
              record: caseDetails.sawpList,
              id: caseDetails && caseDetails.id ? caseDetails.id : '1',
            },
          }),
        );
        // this.setState({
        //   resvisible: !!flag,
        // });
      }
    }
  };

  // ResCancel = e => {
  //   this.setState({
  //     resvisible: false,
  //   });
  // };

  seeArea = (flag, caseDetails) => {
    if (caseDetails && caseDetails.rqxyrList) {
      if (caseDetails && caseDetails.rqxyrList.length === 1) {
        this.IntoArea(caseDetails.rqxyrList[0]);
      } else {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/ModuleAll/RelevancePerson',
            query: {
              record: caseDetails.rqxyrList,
              id: caseDetails && caseDetails.id ? caseDetails.id : '1',
            },
          }),
        );
        // this.setState({
        //   areavisible: !!flag,
        // });
      }
    }
  };

  // AreaCancel = e => {
  //   this.setState({
  //     areavisible: false,
  //   });
  // };

  seeDossier = (flag, caseDetails) => {
    if (caseDetails && caseDetails.jzList) {
      if (caseDetails && caseDetails.jzList.length === 1) {
        this.IntoDossierDetail(caseDetails.jzList[0]);
      } else {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/ModuleAll/RelevanceDossier',
            query: {
              record: caseDetails.jzList,
              id: caseDetails && caseDetails.id ? caseDetails.id : '1',
            },
          }),
        );
        // this.setState({
        //   Dossiervisible: !!flag,
        // });
      }
    }
  };

  // DossierCancel = e => {
  //   this.setState({
  //     Dossiervisible: false,
  //   });
  // };

  renderDetail() {
    const {
      CaseData: { loading,caseDetails },
    } = this.props;
    const {
      trailLeft,
      TrackPaddingBottom1,
      TrackPaddingTop,
      TrackPaddingBottom,
    } = this.state;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayoutInName = { sm: 24, md: 6, xl: 6 };
    const colLayoutInData = { sm: 24, md: 18, xl: 18 };
    const status = ['否', '是'];
    const statusMap = ['default', 'success'];
    const obj1 = document.getElementsByTagName('body');
    const objheight = obj1[0].clientHeight;
    const allheight = obj1[0].scrollHeight;
    const objwidth = obj1[0].clientWidth;
    let dark = this.props.global && this.props.global.dark;
    let newObjWidth = '',
      superveWidth = '';
    if (objheight >= allheight) {
      if (objwidth < 1280 || objwidth === 1280) {
        newObjWidth = 1280;
        superveWidth = 905;
      } else if (objwidth > 1280 && objwidth < 1600) {
        newObjWidth = 1280;
        superveWidth = 905;
        // newObjWidth = 1600;
        // superveWidth = 1225;
      } else if (objwidth >= 1600 && objwidth < 1680) {
        newObjWidth = 1600;
        superveWidth = 1225;
        // newObjWidth = 1680;
        // superveWidth = 1305;
      } else if (objwidth >= 1680 && objwidth < 1920) {
        newObjWidth = 1680;
        superveWidth = 1305;
        // newObjWidth = 1920;
        // superveWidth = 1545;
      } else if (objwidth >= 1920) {
        newObjWidth = 1920;
        superveWidth = 1545;
      }
    } else if (objheight < allheight) {
      if (objwidth < 1263 || objwidth === 1263) {
        newObjWidth = 1280;
        superveWidth = 905;
      } else if (objwidth > 1263 && objwidth < 1583) {
        newObjWidth = 1280;
        superveWidth = 905;
        // newObjWidth = 1600;
        // superveWidth = 1225;
      } else if (objwidth >= 1583 && objwidth < 1663) {
        newObjWidth = 1600;
        superveWidth = 1225;
        // newObjWidth = 1680;
        // superveWidth = 1305;
      } else if (objwidth >= 1663 && objwidth < 1903) {
        newObjWidth = 1680;
        superveWidth = 1305;
        // newObjWidth = 1920;
        // superveWidth = 1545;
      } else if (objwidth >= 1903) {
        newObjWidth = 1920;
        superveWidth = 1545;
      }
    }
    return (
      <div
        style={{
          padding: '24px 0',
          background: dark ? '#252c3c' : '#fff' /*height: autoheight() - 280 + 'px'*/,
        }}
        className={styles.detailBoxScroll}
      >
        <div style={{ textAlign: 'right' }}>
          {caseDetails && caseDetails.jqxxList && caseDetails.jqxxList.length > 0 ? (
            <Button
              // type="primary"
              onClick={() => this.seePolice(true, caseDetails)}
              style={{
                marginRight: 70,
                background: dark
                  ? 'linear-gradient(to right, #0084FA, #03A3FF)'
                  : 'linear-gradient(to right, #3D63D1, #333FE4)',
              }}
            >
              查看关联警情
            </Button>
          ) : (
            ''
          )}
          {caseDetails && caseDetails.rqxyrList && caseDetails.rqxyrList.length > 0 ? (
            <Button
              // type="primary"
              onClick={() => this.seeArea(true, caseDetails)}
              style={{
                marginRight: 16,
                background: dark
                  ? 'linear-gradient(to right, #0084FA, #03A3FF)'
                  : 'linear-gradient(to right, #3D63D1, #333FE4)',
              }}
            >
              查看涉案人员在区情况
            </Button>
          ) : (
            ''
          )}
          {caseDetails && caseDetails.sawpList && caseDetails.sawpList.length > 0 ? (
            <Button
              // type="primary"
              onClick={() => this.seeRes(true, caseDetails)}
              style={{ marginRight: 16, background: 'linear-gradient(to right, #0084FA, #03A3FF)' }}
            >
              查看涉案物品
            </Button>
          ) : (
            ''
          )}
          {caseDetails && caseDetails.jzList && caseDetails.jzList.length > 0 ? (
            <Button
              // type="primary"
              onClick={() => this.seeDossier(true, caseDetails)}
              style={{ marginRight: 16, background: 'linear-gradient(to right, #0084FA, #03A3FF)' }}
            >
              查看卷宗信息
            </Button>
          ) : (
            ''
          )}
        </div>
        <div className={styles.title}>| 案件信息</div>
        <div className={styles.message} style={{ padding: '24px 70px' }}>
          <Row className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>
                <div className={liststyles.special}>案件名称：</div>
              </div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 58 }}>
                <div className={liststyles.special1}>
                  <Ellipsis lines={1} tooltip>
                    {caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}
                  </Ellipsis>
                </div>
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件编号：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.ajbh ? caseDetails.ajbh : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件类别：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.ajlbmc ? caseDetails.ajlbmc : ''}
              </div>
            </Col>
          </Row>
          <Row className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案发时段：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.fasjsx && caseDetails.fasjxx
                  ? caseDetails.fasjsx + '~' + caseDetails.fasjxx
                  : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案发地点：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.afdd ? caseDetails.afdd : ''}
              </div>
            </Col>
          </Row>
          <Row
            className={caseDetails && (caseDetails.pajk || caseDetails.xayy) ? styles.xqrow : ''}
          >
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>简要案情：</div>
                <DetailShow paddingLeft={60} word={caseDetails && caseDetails.jyaq ? caseDetails.jyaq : ''} {...this.props}/>
            </Col>
          </Row>
          {caseDetails && caseDetails.pajk ? (
            <Row className={styles.xqrow}>
              <Col md={24} sm={24} className={styles.xqcol}>
                <div className={liststyles.Indexfrom}>破案简况：</div>
                  <DetailShow paddingLeft={60} word={caseDetails && caseDetails.pajk ? caseDetails.pajk : ''} {...this.props}/>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {caseDetails && caseDetails.xayy ? (
            <Row className={styles.xqrow}>
              <Col md={24} sm={24} className={styles.xqcol}>
                <div className={liststyles.Indexfrom}>销案原因：</div>
                <div className={liststyles.Indextail} style={{ paddingLeft: 60 }}>
                  {caseDetails && caseDetails.xayy ? caseDetails.xayy : ''}
                </div>
              </Col>
            </Row>
          ) : (
            ''
          )}

          {caseDetails && caseDetails.ajzt ? (
            <div>
              <Card
                title={'案件流程'}
                style={{ marginTop: '12px', borderRadius: 0, backgroundColor: '#171a26' }}
                className={styles.ajlcCard}
              >
                <CaseModalStep caseDetails={caseDetails} />
              </Card>
            </div>
          ) : (
            ''
          )}
        </div>
        {caseDetails && caseDetails.ajzt ? (
          <div>
            <div className={styles.title}>| 案件轨迹</div>
            <CaseModalTrail {...this.props} caseDetails={caseDetails} from="刑事" />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  ResultId = () => {
    return 'caseDetail' + this.props.ajbh;
  };

  render() {
    let dark = this.props.global && this.props.global.dark;
    const {
      superviseVisibleModal,
      caseDetails,
      policevisible,
      resvisible,
      areavisible,
      Dossiervisible,
      RetrieveVisible,
      makeTableModalVisible,
      tbDetail,
    } = this.state;
    let detail = (
      <Row
        style={{
          width: '90%',
          margin: '0 38px 10px',
          lineHeight: '36px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <Col span={12}>
          案件名称：
          <Tooltip
            title={
              caseDetails && caseDetails.ajmc && caseDetails.ajmc.length > 20
                ? caseDetails.ajmc
                : null
            }
          >
            {caseDetails && caseDetails.ajmc
              ? caseDetails.ajmc.length > 20
                ? caseDetails.ajmc.substring(0, 20) + '...'
                : caseDetails.ajmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          办案单位：
          <Tooltip
            title={
              caseDetails && caseDetails.sadwmc && caseDetails.sadwmc.length > 20
                ? caseDetails.sadwmc
                : null
            }
          >
            {caseDetails && caseDetails.sadwmc
              ? caseDetails.sadwmc.length > 20
                ? caseDetails.sadwmc.substring(0, 20) + '...'
                : caseDetails.sadwmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>案件状态：{caseDetails && caseDetails.schj ? caseDetails.schj : ''}</Col>
        <Col span={12}>办案民警：{caseDetails && caseDetails.barxm ? caseDetails.barxm : ''}</Col>
      </Row>
    );

    const JqColumns = [
      {
        title: '接警来源',
        dataIndex: 'jjly_mc',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '接警时间',
        dataIndex: 'jjsj',
        render: text => {
          return text ? (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '管辖单位',
        dataIndex: 'jjdw',
        render: text => {
          if (text) {
            let str = '';
            const strArry = text.split(',');
            if (strArry.length > 0) {
              str = strArry[strArry.length - 1];
              return (
                <Ellipsis length={20} tooltip>
                  {str}
                </Ellipsis>
              );
            }
            return str;
          }
          return '';
          // return(
          //   text.split(',')[record.split(',').length-1] && record.split(',')[record.split(',').length-1].length <= 20 ? record.split(',')[record.split(',').length-1] :
          //     <Tooltip title={record.split(',')[record.split(',').length-1]}>
          //       <span>{record.split(',')[record.split(',').length-1] && record.split(',')[record.split(',').length-1].substring(0, 20) + '...'}</span>
          //     </Tooltip>
          // )
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
    const WpColumns = [
      {
        title: '物品名称',
        dataIndex: 'wpmc',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '物品种类',
        dataIndex: 'wpzlMc',
        render: text => {
          return text ? (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '操作',
        width: 50,
        render: record => (
          <div>
            <a onClick={() => this.openItemsDetail(record)}>查看</a>
          </div>
        ),
      },
    ];
    const AreaColumns = [
      {
        title: '姓名',
        dataIndex: 'xyrName',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: text => {
          return text ? (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '证件号',
        dataIndex: 'sfzh',
        render: text => {
          if (text) {
            let str = '';
            const strArry = text.split(',');
            if (strArry.length > 0) {
              str = strArry[strArry.length - 1];
              return (
                <Ellipsis length={20} tooltip>
                  {str}
                </Ellipsis>
              );
            }
            return str;
          }
          return '';
          // return(
          //   text.split(',')[record.split(',').length-1] && record.split(',')[record.split(',').length-1].length <= 20 ? record.split(',')[record.split(',').length-1] :
          //     <Tooltip title={record.split(',')[record.split(',').length-1]}>
          //       <span>{record.split(',')[record.split(',').length-1] && record.split(',')[record.split(',').length-1].substring(0, 20) + '...'}</span>
          //     </Tooltip>
          // )
        },
      },
      {
        title: '操作',
        width: 50,
        render: record => (
          <div>
            <a onClick={() => this.IntoArea(record)}>详情</a>
          </div>
        ),
      },
    ];
    const DossierColumns = [
      {
        title: '卷宗名称',
        dataIndex: 'jzmc',
        render: text => {
          return text ? (
            <Ellipsis length={16} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '卷宗类别',
        dataIndex: 'jzlb_mc',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '储存状态',
        dataIndex: 'cczt_mc',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '卷宗页数',
        dataIndex: 'jzys',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '电子化',
        dataIndex: 'is_gldzj',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '操作',
        width: 50,
        render: record => (
          <div>
            <a onClick={() => this.IntoDossierDetail(record)}>详情</a>
          </div>
        ),
      },
    ];
    return (
      <div id={this.ResultId()} className={dark ? '' : styles.lightBox}>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail()}</div>

        {/*{superviseVisibleModal ?*/}
        {/*<SuperviseModal*/}
        {/*{...this.props}*/}
        {/*visible={superviseVisibleModal}*/}
        {/*closeModal={this.closeModal}*/}
        {/*// saveModal={this.saveModal}*/}
        {/*caseDetails={this.state.caseDetails}*/}
        {/*getRefresh={this.Refresh}*/}
        {/*wtflId='203202'*/}
        {/*wtflMc='刑事案件'*/}
        {/*// 点击列表的督办显示的四个基本信息*/}
        {/*wtlx={this.state.superviseWtlx}*/}
        {/*from={this.state.from}*/}
        {/*/>*/}
        {/*: ''*/}
        {/*}*/}
        {/*<ShareModal detail={detail} shareVisible={this.state.shareVisible} handleCancel={this.handleCancel}*/}
        {/*shareItem={this.state.shareItem} personList={this.state.personList} lx={this.state.lx}*/}
        {/*tzlx={this.props.tzlx} sx={this.state.sx}/>*/}
        {/*{*/}
        {/*RetrieveVisible ? (*/}
        {/*<RetrieveModal*/}
        {/*title="退补侦查设置"*/}
        {/*RetrieveVisible={RetrieveVisible}*/}
        {/*handleCancel={this.RetrieveHandleCancel}*/}
        {/*RetrieveRecord={caseDetails} // 列表对应数据的详情*/}
        {/*refreshPage={this.refreshCaseDetail}*/}
        {/*tbDetail={tbDetail}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}

        <Modal
        visible={policevisible}
        title="警情信息"
        centered
        className={styles.policeModal}
        width={1000}
        maskClosable={false}
        onCancel={this.policeCancel}
        footer={null}
        getContainer={() => document.getElementById(this.ResultId())}
        >
        <Table
        size={'middle'}
        style={{ backgroundColor: '#fff' }}
        pagination={{
        pageSize: 3,
        showTotal: (total, range) => <div
        style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
        第 {this.state.jqcurrent} / {(Math.ceil(total / 3))} 页</div>,
        onChange: (page) => {
        this.setState({ jqcurrent: page });
        },
        }}
        dataSource={caseDetails ? caseDetails.jqxxList : []}
        columns={JqColumns}
        />
        </Modal>
        {/*<Modal*/}
        {/*visible={resvisible}*/}
        {/*title="涉案物品信息"*/}
        {/*centered*/}
        {/*className={styles.policeModal}*/}
        {/*width={1000}*/}
        {/*maskClosable={false}*/}
        {/*onCancel={this.ResCancel}*/}
        {/*footer={null}*/}
        {/*getContainer={() => document.getElementById(this.ResultId())}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => <div*/}
        {/*style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录*/}
        {/*第 {this.state.wpcurrent} / {(Math.ceil(total / 3))} 页</div>,*/}
        {/*onChange: (page) => {*/}
        {/*this.setState({ wpcurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.sawpList : []}*/}
        {/*columns={WpColumns}*/}

        {/*/>*/}
        {/*</Modal>*/}
        {/*<Modal*/}
        {/*visible={areavisible}*/}
        {/*title="选择查看人员在区情况"*/}
        {/*centered*/}
        {/*className={styles.policeModal}*/}
        {/*width={1000}*/}
        {/*maskClosable={false}*/}
        {/*onCancel={this.AreaCancel}*/}
        {/*footer={null}*/}
        {/*getContainer={() => document.getElementById(this.ResultId())}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => <div*/}
        {/*style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录*/}
        {/*第 {this.state.areacurrent} / {(Math.ceil(total / 3))} 页</div>,*/}
        {/*onChange: (page) => {*/}
        {/*this.setState({ areacurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.rqxyrList : []}*/}
        {/*columns={AreaColumns}*/}

        {/*/>*/}
        {/*</Modal>*/}
        {/*<Modal*/}
        {/*visible={Dossiervisible}*/}
        {/*title="选择查看卷宗"*/}
        {/*centered*/}
        {/*className={styles.policeModal}*/}
        {/*width={1000}*/}
        {/*maskClosable={false}*/}
        {/*onCancel={this.DossierCancel}*/}
        {/*footer={null}*/}
        {/*getContainer={() => document.getElementById(this.ResultId())}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => <div*/}
        {/*style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录*/}
        {/*第 {this.state.dossiercurrent} / {(Math.ceil(total / 3))} 页</div>,*/}
        {/*onChange: (page) => {*/}
        {/*this.setState({ dossiercurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.jzList : []}*/}
        {/*columns={DossierColumns}*/}
        {/*/>*/}
        {/*</Modal>*/}
        {/*{*/}
        {/*makeTableModalVisible ? (*/}
        {/*<MakeTableModal*/}
        {/*title='表格选择'*/}
        {/*makeTableModalVisible={makeTableModalVisible}*/}
        {/*MakeTableCancel={this.MakeTableCancel}*/}
        {/*caseRecord={caseDetails}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
      </div>
    );
  }
}
