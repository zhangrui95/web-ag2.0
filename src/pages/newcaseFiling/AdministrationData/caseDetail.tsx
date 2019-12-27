/*
 * XzCaseRealData/index.js 受立案行政案件详情
 * author：jhm
 * 20180605
 * */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Table, Tooltip, message, Modal, Empty } from 'antd';
import styles from './caseDetail.less';
import liststyles from '../../common/listDetail.less';
import {
  autoheight,
  getQueryString,
  userAuthorityCode,
  userResourceCodeDb,
} from '../../../utils/utils';
// import ItemDetail from '../ItemRealData/itemDetail';
// import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';
// import JqDetail from '../../routes/PoliceRealData/policeDetail';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
// import DossierDetail from '../../routes/DossierData/DossierDetail';
import ShareModal from '../../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import share from '../../../assets/common/share.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share1 from '../../../assets/common/share1.png';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
import { authorityIsTrue } from '../../../utils/authority';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import { routerRedux } from 'dva/router';
import {tableList} from "@/utils/utils";
import DetailShow from "@/components/Common/detailShow";
// import MakeTableModal from '../../../components/CaseRealData/MakeTableModal';

@connect(({ XzCaseData, loading, CaseData, AllDetail, global }) => ({
  XzCaseData,
  loading,
  CaseData,
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
      trailLeft: '0',
      is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
      loading1: false, // 按钮状态，默认false没加载,true是点击后的加载状态
      caseDetails: null,
      TrackPaddingTop: '', // 初始状态的message的paddingtop;
      TrackPaddingBottom: '', // 初始状态的message的paddingbottom;
      TrackPaddingBottom1: '220px', // 初始状态的listStyle的paddingbottom;(TrackPaddingBottom下面的一个子集)
      open: '0', // 显示‘显示更多’还是‘收起更多’；
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

      shareVisible: false,
      shareItem: null,
      personList: [],
      lx: '案件信息',
      sx: '',
      sfgz: res && res.sfgz === 0 ? res.sfgz : '',

      policevisible: false,
      resvisible: false,
      areavisible: false,
      Dossiervisible: false,
      IsSure: false, // 确认详情是否加载成功
      // IsseeArea:false, // 嫌疑人是否有在区信息，true:都有 false:反之
      isDb: authorityIsTrue(userResourceCodeDb.zfba_xz), // 督办权限
      makeTableModalVisible: false, // 制表model
      RetrieveRecord: null,
      isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
    };
  }

  componentDidMount() {
    if (
      (this.props.location &&
        this.props.location.query &&
        this.props.location.query.record &&
        this.props.location.query.record.ajbh) ||
      this.props.location.query.id
    ) {
      this.caseDetailDatas(this.props.location.query.id);
    }
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
      nextProps.history.location.pathname === '/newcaseFiling/caseData/AdministrationData/caseDetail'
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

  //修改改变模态框状态 通过id 获取数据
  caseDetailDatas = id => {
    this.setState(
      {
        IsSure: false,
      },
      () => {
        this.props.dispatch({
          type: 'XzCaseData/getXzAjxxXqById',
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
  // 根据物品案件编号和身份证号打开人员档案窗口
  openPersonDetail = (idcard, name, ajbh, xyrId) => {
    this.props.dispatch({
      type: 'AllDetail/AllDetailPersonFetch',
      payload: {
        name: name,
        sfzh: idcard,
      },
      callback: data => {
        if (data && data.ryxx) {
          // const divs = (
          //     <div>
          //         <PersonDetail
          //             {...this.props}
          //             name={name}
          //             idcard={idcard}
          //             ajbh={ajbh}
          //             ly='行政常规数据'
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
            from: '行政案件详情问题判定',
            fromPath: '/newcaseFiling/caseData/AdministrationData/caseDetail',
            wtflId: '230202',
            wtflMc: '案件',
          },
        }),
      );
      // this.setState({
      //   // systemId: caseDetails.system_id,
      //   superviseVisibleModal: !!flag,
      //   superviseWtlx: caseDetails.wtlx,
      //   // superviseZrdw: caseDetails.sldw_name,
      //   // superviseZrdwId: caseDetails.sldw_dm,
      //   // superviseZrr: caseDetails.bar_name,
      //   // id: caseDetails.wtid,
      //   // sfzh: caseDetails.bar_sfzh,
      //   from: from,
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
    this.caseDetailDatas(this.props.systemId);
  };
  refreshTable = (param) => {
    if(param.movefrom === '行政案件常规'){
      this.props.dispatch({
        type: 'XzCaseData/caseFetch',
        payload: {
          currentPage: param.current,
          showCount: tableList,
          pd: {},
        },
      });
    }
    else if(param.movefrom === '行政案件预警'){
      this.props.dispatch({
        type: 'EarlyWarning/getList',
        payload: {
          pd: { yj_type: 'xzaj' }
        },
      });
    }
  }
  // 分享和关注（2为分享，1为关注）
  saveShare = (caseDetails, res, type, ajGzLx) => {
    this.setState({
      sx:
        (caseDetails.ajmc ? caseDetails.ajmc + '、' : '') +
        (caseDetails.ajzt ? caseDetails.ajzt : ''),
    });
    if (type === 2) {
      let detail = [
        `案件名称：${caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}`,
        `受理单位：${caseDetails && caseDetails.sldw_name ? caseDetails.sldw_name : ''}`,
        `案件状态：${caseDetails && caseDetails.ajzt ? caseDetails.ajzt : ''}`,
        `办案民警：${caseDetails && caseDetails.bar_name ? caseDetails.bar_name : ''}`,
      ];
      caseDetails.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: caseDetails,
            id: caseDetails && caseDetails.system_id ? caseDetails.system_id : '1',
            from: '案件信息',
            tzlx: 'xzajxx2',
            fromPath: '/newcaseFiling/caseData/AdministrationData/caseDetail',
            tab: '详情',
            sx:
              (caseDetails.ajmc ? caseDetails.ajmc + '、' : '') +
              (caseDetails.ajzt ? caseDetails.ajzt : ''),
          },
        }),
      );
    } else {
      if (this.state.IsSure) {
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            agid: this.props.yjType === 'yj' ? this.props.yjid : caseDetails.id,
            lx: this.state.lx,
            sx:
              (caseDetails.ajmc ? caseDetails.ajmc + '、' : '') +
              (caseDetails.ajzt ? caseDetails.ajzt : ''),
            type: type,
            tzlx:
              this.props.locaton && this.props.locaton.query && this.props.locaton.query.tzlx
                ? this.props.locaton.query.tzlx
                : '',
            wtid: caseDetails.wtid,
            ajbh: caseDetails.ajbh,
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

  Topdetail() {
    const { sfgz, isDb, isZb } = this.state;
    const { record } = this.props;
    let dark = this.props.global && this.props.global.dark;
      let handleXzCaseSfgz,caseDetails;
      if(this.state.caseDetails&&this.props.XzCaseData&&this.props.XzCaseData.caseDetails&&this.state.caseDetails.id === this.props.XzCaseData.caseDetails.id){
          handleXzCaseSfgz = this.props.XzCaseData.handleXzCaseSfgz;
          caseDetails = this.props.XzCaseData.caseDetails;
          this.setState({
              caseDetails,
          });
      }else{
          handleXzCaseSfgz = this.state.caseDetails ? this.state.caseDetails.sfgz : '';
          caseDetails = this.state.caseDetails;
      }
    return (
      <div style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {/*<span style={{ margin: '16px', display: 'block' }}>行政案件详情</span>*/}
            {isDb &&
            caseDetails &&
            caseDetails.zrdwList &&
            caseDetails.zrdwList.length > 0 &&
            caseDetails.ssmk === '2' ? (
              <Button
                className={styles.TopMenu}
                loading={this.state.loading1}
                onClick={() => this.onceSupervise(caseDetails, true, '行政案件详情问题判定')}
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
            {/*{ // 案件状态为移送才能退补*/}
            {/*caseDetails.ajzt&&caseDetails.ajzt === '结案' || !isTb || caseDetails.qsrq === '' || (caseDetails.tbrq2 && caseDetails.tbyy2) ? null : (*/}
            {/*<Button type="primary" className={styles.TopMenu} onClick={() => this.saveRetrieve(caseDetails, true)}>退补</Button>*/}
            {/*)*/}
            {/*}*/}
          </Col>
          <Col>
            <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
              {caseDetails ? (
                <span>
                  <span className={liststyles.collect}>
                    {handleXzCaseSfgz === 0 ? (
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
                  {/*{*/}
                  {/*isZb ? <Button type="primary" style={{ marginLeft: 8 }}*/}
                  {/*onClick={() => this.makeTable(caseDetails, true)}>制表</Button> : null*/}
                  {/*}*/}
                </span>
              ) : null}
              {/*{*/}
              {/*isDb && caseDetails && caseDetails.zrdwList && caseDetails.zrdwList.length > 0 && caseDetails.ssmk === '2' ? (*/}
              {/*<Button*/}
              {/*type="primary" style={{ marginLeft: 8 }}*/}
              {/*loading={this.state.loading1}*/}
              {/*onClick={() => this.onceSupervise(caseDetails, true, '行政案件详情问题判定')}*/}
              {/*>*/}
              {/*问题判定*/}
              {/*</Button>*/}
              {/*) : null*/}
              {/*}*/}
            </span>
          </Col>
        </Row>
      </div>
    );
  }

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
    //             id={system_id}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '涉案物品详情', content: divs, key: system_id };
    // this.props.newDetail(AddNewDetail);
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

  policeCancel = e => {
    this.setState({
      policevisible: false,
    });
  };

  seeRes = (flag, caseDetails) => {
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
    }
  };

  // ResCancel = e => {
  //   this.setState({
  //     resvisible: false,
  //   });
  // };

  seeArea = (flag, caseDetails) => {
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
    }
  };

  // AreaCancel = e => {
  //   this.setState({
  //     areavisible: false,
  //   });
  // };
  seeDossier = (flag, caseDetails) => {
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
  };

  // DossierCancel = e => {
  //   this.setState({
  //     Dossiervisible: false,
  //   });
  // };
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

  renderDetail() {
    const {caseDetails} = this.state;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff' /*height: autoheight() - 180 + 'px'*/ }}
        className={styles.detailBoxScroll}
      >
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          {caseDetails && caseDetails.jqxxList && caseDetails.jqxxList.length > 0 ? (
            <Button
              type="primary"
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
              type="primary"
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
              type="primary"
              onClick={() => this.seeRes(true, caseDetails)}
              style={{ marginRight: 16 }}
            >
              查看涉案物品
            </Button>
          ) : (
            ''
          )}
          {caseDetails && caseDetails.jzList && caseDetails.jzList.length > 0 ? (
            <Button
              type="primary"
              onClick={() => this.seeDossier(true, caseDetails)}
              style={{ marginRight: 16 }}
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
              <div className={liststyles.Indextail} style={{ paddingLeft: 56 }}>
                <div className={liststyles.special1}>
                  <Ellipsis lines={1}>
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
                {caseDetails && caseDetails.ajlb_name ? caseDetails.ajlb_name : ''}
              </div>
            </Col>
          </Row>
          <Row className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案发时段：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.fasj_sx && caseDetails.fasj_xx
                  ? caseDetails.fasj_sx + '~' + caseDetails.fasj_xx
                  : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案发地点：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.fadxz ? caseDetails.fadxz : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>是否延期：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.sfyq
                  ? caseDetails.sfyq === '1'
                    ? '已延期至60日'
                    : '否'
                  : '否'}
              </div>
            </Col>
          </Row>
          <Row className={caseDetails && caseDetails.pajk && caseDetails.xayy ? styles.xqrow : ''}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>简要案情：</div>
                <DetailShow paddingLeft={60} word={caseDetails && caseDetails.ajjj ? caseDetails.ajjj : ''} {...this.props}/>
            </Col>
          </Row>
          {caseDetails && caseDetails.pajk ? (
            <Row className={styles.xqrow}>
              <Col md={24} sm={24} className={styles.xqcol}>
                <Row className={liststyles.JzInfoDiv}>
                  <Col
                    sm={24}
                    md={2}
                    xl={2}
                    className={liststyles.JzInfoRight}
                    style={{ width: 82.94 }}
                  >
                    破案简况：
                  </Col>
                  <Col sm={24} md={22} xl={22}>
                    {caseDetails && caseDetails.pajk ? caseDetails.pajk : ''}
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {caseDetails && caseDetails.xayy ? (
            <Row className={styles.xqrow}>
              <Col md={24} sm={24} className={styles.xqcol}>
                <Row className={liststyles.JzInfoDiv}>
                  <Col
                    sm={24}
                    md={2}
                    xl={2}
                    className={liststyles.JzInfoRight}
                    style={{ width: 82.94 }}
                  >
                    销案原因：
                  </Col>
                  <Col sm={24} md={22} xl={22}>
                    {caseDetails && caseDetails.xayy ? caseDetails.xayy : ''}
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            ''
          )}

          {caseDetails && caseDetails.ajzt ? (
            <Card
              title={'案件流程'}
              style={{ marginTop: '12px', borderRadius: 0, backgroundColor: '#171a26' }}
              className={styles.ajlczCard}
            >
              <CaseModalStep caseDetails={caseDetails} />
            </Card>
          ) : (
            ''
          )}
        </div>
        {caseDetails && caseDetails.ajzt ? (
          <div>
            <div className={styles.title}>| 案件轨迹</div>
            <CaseModalTrail {...this.props} caseDetails={caseDetails} from="行政" />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  render() {
    let dark = this.props.global && this.props.global.dark;
    const {
      superviseVisibleModal,
      caseDetails,
      policevisible,
      resvisible,
      areavisible,
      Dossiervisible,
      makeTableModalVisible,
    } = this.state;
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
            <a onClick={() => this.jqDetail(record.id)}>详情</a>
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
            <a onClick={() => this.openItemsDetail(record.system_id)}>查看</a>
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
            <a onClick={() => this.IntoArea(record.sfzh, record.ajbh)}>详情</a>
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
            <a onClick={() => this.IntoDossierDetail(record.dossier_id)}>详情</a>
          </div>
        ),
      },
    ];
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
          受理单位：
          <Tooltip
            title={
              caseDetails && caseDetails.sldw_name && caseDetails.sldw_name.length > 20
                ? caseDetails.sldw_name
                : null
            }
          >
            {caseDetails && caseDetails.sldw_name
              ? caseDetails.sldw_name.length > 20
                ? caseDetails.sldw_name.substring(0, 20) + '...'
                : caseDetails.sldw_name
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>案件状态：{caseDetails && caseDetails.ajzt ? caseDetails.ajzt : ''}</Col>
        <Col span={12}>
          办案民警：{caseDetails && caseDetails.bar_name ? caseDetails.bar_name : ''}
        </Col>
      </Row>
    );
    return (
      <div id="caseDetail" className={dark ? '' : styles.lightBox}>
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
        {/*wtflId='203205'*/}
        {/*wtflMc='行政案件'*/}
        {/*// 点击列表的督办显示的四个基本信息*/}
        {/*wtlx={this.state.superviseWtlx}*/}
        {/*from={this.state.from}*/}
        {/*/>*/}
        {/*: ''*/}
        {/*}*/}
        {/*<ShareModal*/}
        {/*detail={detail}*/}
        {/*shareVisible={this.state.shareVisible}*/}
        {/*handleCancel={this.handleCancel}*/}
        {/*shareItem={this.state.shareItem}*/}
        {/*personList={this.state.personList}*/}
        {/*lx={this.state.lx}*/}
        {/*tzlx={this.props.tzlx}*/}
        {/*sx={this.state.sx}*/}
        {/*/>*/}

        {/*<Modal*/}
        {/*visible={policevisible}*/}
        {/*title="警情信息"*/}
        {/*centered*/}
        {/*className={styles.policeModal}*/}
        {/*width={1000}*/}
        {/*maskClosable={false}*/}
        {/*onCancel={this.policeCancel}*/}
        {/*footer={null}*/}
        {/*getContainer={() => document.getElementById('caseDetail')}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => (*/}
        {/*<div style={{ position: 'absolute', left: '12px' }}>*/}
        {/*共 {total} 条记录 第 {this.state.jqcurrent} / {Math.ceil(total / 3)} 页*/}
        {/*</div>*/}
        {/*),*/}
        {/*onChange: page => {*/}
        {/*this.setState({ jqcurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.jqxxList : []}*/}
        {/*columns={JqColumns}*/}
        {/*locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}*/}
        {/*/>*/}
        {/*</Modal>*/}
        {/*<Modal*/}
        {/*visible={resvisible}*/}
        {/*title="涉案物品信息"*/}
        {/*centered*/}
        {/*className={styles.policeModal}*/}
        {/*width={1000}*/}
        {/*maskClosable={false}*/}
        {/*onCancel={this.ResCancel}*/}
        {/*footer={null}*/}
        {/*getContainer={() => document.getElementById('caseDetail')}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => (*/}
        {/*<div style={{ position: 'absolute', left: '12px' }}>*/}
        {/*共 {total} 条记录 第 {this.state.wpcurrent} / {Math.ceil(total / 3)} 页*/}
        {/*</div>*/}
        {/*),*/}
        {/*onChange: page => {*/}
        {/*this.setState({ wpcurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.sawpList : []}*/}
        {/*columns={WpColumns}*/}
        {/*locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}*/}
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
        {/*getContainer={() => document.getElementById('caseDetail')}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => (*/}
        {/*<div style={{ position: 'absolute', left: '12px' }}>*/}
        {/*共 {total} 条记录 第 {this.state.areacurrent} / {Math.ceil(total / 3)} 页*/}
        {/*</div>*/}
        {/*),*/}
        {/*onChange: page => {*/}
        {/*this.setState({ areacurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.rqxyrList : []}*/}
        {/*columns={AreaColumns}*/}
        {/*locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}*/}
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
        {/*getContainer={() => document.getElementById('caseDetail')}*/}
        {/*>*/}
        {/*<Table*/}
        {/*size={'middle'}*/}
        {/*style={{ backgroundColor: '#fff' }}*/}
        {/*pagination={{*/}
        {/*pageSize: 3,*/}
        {/*showTotal: (total, range) => (*/}
        {/*<div style={{ position: 'absolute', left: '12px' }}>*/}
        {/*共 {total} 条记录 第 {this.state.dossiercurrent} / {Math.ceil(total / 3)} 页*/}
        {/*</div>*/}
        {/*),*/}
        {/*onChange: page => {*/}
        {/*this.setState({ dossiercurrent: page });*/}
        {/*},*/}
        {/*}}*/}
        {/*dataSource={caseDetails ? caseDetails.jzList : []}*/}
        {/*columns={DossierColumns}*/}
        {/*locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}*/}
        {/*/>*/}
        {/*</Modal>*/}
        {/*{*/}
        {/*makeTableModalVisible ? (*/}
        {/*<MakeTableModal*/}
        {/*title='表格选择'*/}
        {/*makeTableModalVisible={makeTableModalVisible}*/}
        {/*MakeTableCancel={this.MakeTableCancel}*/}
        {/*caseRecord={this.state.caseDetails}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
      </div>
    );
  }
}
