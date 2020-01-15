/*
 *  dossierDetail.js 卷宗常规数据详情
 *  author：lyp
 *  20181031
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
import styles from './DossierDetail.less';
// import ShareModal from '../../components/ShareModal/ShareModal';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
// import Detail from '../../routes/CaseRealData/caseDetail';
// import XZDetail from '../../routes/NewXzCaseRealData/caseDetail';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import share from '../../../assets/common/share.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share1 from '../../../assets/common/share1.png';
import { autoheight, getUserInfos, userResourceCodeDb } from '../../../utils/utils';
// import DossierMarkingModal from '../../components/DossierRealData/DossierMarkingModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { authorityIsTrue } from '../../../utils/authority';
import { routerRedux } from 'dva/router';
import { tableList } from '@/utils/utils';

@connect(({ DossierData, common, MySuperviseData, AllDetail, global }) => ({
  DossierData,
  common,
  MySuperviseData,
  AllDetail,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class DossierDetail extends PureComponent {
  constructor(props) {
    super(props);
    let res = props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      DossierDetailData: '',

      shareVisible: false,
      shareItem: null,
      personList: [],
      lx: '卷宗信息',
      tzlx: 'jzxx', // 跳转类型
      sx: '',
      // sfgz: this.props.sfgz,
      casecurrent: 1, // 查看关联案件默认在第一页
      // 问题判定模态框
      superviseVisibleModal: false,
      // systemId: '',
      superviseWtlx: '',
      superviseZrdw: '',
      superviseZrr: '',
      superviseZrdwId: '',
      id: '',
      sfzh: '',
      // 问题判定的来源参数
      from: '',
      // 阅卷
      mark: false,
      casevisible: false,
      IsSure: false, // 确认详情是否加载成功
      isDb: authorityIsTrue(userResourceCodeDb.dossier), // 督办权限
      record: res,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    if (location && location.query && location.query && (location.query.id || location.system_id)) {
      this.getDossierDetail(location.query.system_id || location.query.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps) {
    //     if (nextProps.sfgz !== null && nextProps.sfgz !== this.props.sfgz) {
    //         // this.setState({
    //         //     sfgz: nextProps.sfgz,
    //         // })
    //         this.getDossierDetail(this.props.id);
    //     }
    // }
    if (
      this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset &&
      nextProps.global.isResetList.url === '/receivePolice/AlarmData/policeDetail'
    ) {
      this.getDossierDetail(this.props.location.query.id);
    }
  }

  onceSupervise = (DossierDetailData, flag, from) => {
    if (DossierDetailData) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Supervise',
          query: {
            record: DossierDetailData,
            id:
              DossierDetailData && DossierDetailData.dossier_id
                ? DossierDetailData.dossier_id
                : '1',
            from: '卷宗详情问题判定',
            tzlx: 'jzxx',
            fromPath: '/dossierPolice/DossierData/DossierDetail',
            wtflId: '203206',
            wtflMc: '卷宗',
          },
        }),
      );

      // this.setState({
      //     // systemId: systemId,
      //     superviseVisibleModal: !!flag,
      //     superviseWtlx: DossierDetailData.wtlx,
      //     // superviseZrdw: zrdw,
      //     // superviseZrdwId: zrdwId,
      //     // superviseZrr: zrr,
      //     // id: wtid,
      //     // sfzh: zjhm,
      //     from: from,
      // });
    } else {
      message.error('该人员无法进行问题判定');
    }
  };

  getDossierDetail(id) {
    this.setState(
      {
        IsSure: false,
      },
      () => {
        this.props.dispatch({
          type: 'DossierData/getDossierDetail',
          payload: {
            dossier_id: id,
          },
          callback: data => {
            if (data) {
              this.setState({
                DossierDetailData: data,
                IsSure: true,
              });
            }
          },
        });
      },
    );
  }
  // 是否关注刷新列表
  refreshTable = param => {
    if (param.movefrom === '卷宗常规') {
      this.props.dispatch({
        type: 'DossierData/getDossierData',
        payload: {
          currentPage: param.current,
          showCount: tableList,
          pd: {},
        },
      });
    } else if (param.movefrom === '卷宗预警') {
      this.props.dispatch({
        type: 'EarlyWarning/getList',
        payload: {
          pd: { yj_type: 'jz' },
        },
      });
    }
  };
  // 分享和关注（2为分享，1为关注）
  saveShare = (DossierDetailData, type, ajGzLx) => {
    this.setState({
      sx:
        (DossierDetailData.ajmc ? DossierDetailData.ajmc + '、' : '') +
        (DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''),
    });
    if (type === 2) {
      let detail = [
        `卷宗名称：${DossierDetailData && DossierDetailData.jzmc ? DossierDetailData.jzmc : ''}`,
        `卷宗类别：${
          DossierDetailData && DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''
        }`,
        `卷宗描述：${DossierDetailData && DossierDetailData.jzms ? DossierDetailData.jzms : ''}`,
        `案件名称：${DossierDetailData && DossierDetailData.ajmc ? DossierDetailData.ajmc : ''}`,
        `案件状态：${DossierDetailData && DossierDetailData.ajzt ? DossierDetailData.ajzt : ''}`,
      ];
      DossierDetailData.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: DossierDetailData,
            id:
              DossierDetailData && DossierDetailData.dossier_id
                ? DossierDetailData.dossier_id
                : '1',
            from: '卷宗信息',
            tzlx: 'jzxx',
            fromPath: '/dossierPolice/DossierData/DossierDetail',
            tab: '详情',
            sx:
              (DossierDetailData.ajmc ? DossierDetailData.ajmc + '、' : '') +
              (DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''),
          },
        }),
      );
      // this.setState({
      //     shareVisible: true,
      //     shareItem: DossierDetailData,
      // });
    } else {
      if (this.state.IsSure) {
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            agid: DossierDetailData.id,
            lx: this.state.lx,
            sx:
              (DossierDetailData.ajmc ? DossierDetailData.ajmc + '、' : '') +
              (DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''),
            type: type,
            tzlx: this.state.tzlx,
            wtid: DossierDetailData.wtid,
            ajbh: DossierDetailData.ajbh,
            system_id: DossierDetailData.system_id,
            ajGzLx: ajGzLx,
            is_fxgz: '0',
          },
          callback: res => {
            if (!res.error) {
              // alert(1)
              message.success('关注成功');
              this.refreshTable(this.props.location.query);
              // if (this.props.getDossier) {
              //   this.props.getDossier({
              //     currentPage: this.props.current,
              //     pd: this.props.formValues,
              //   });
              // }
              // this.setState({
              //     sfgz: 1,
              // }, () => {
              //     this.getDossierDetail(DossierDetailData.dossier_id)
              // })
              this.getDossierDetail(DossierDetailData.dossier_id);
            }
          },
        });
      } else {
        message.warning('您的操作太频繁，请稍后再试');
      }
    }
  };
  // 取消关注
  noFollow = DossierDetailData => {
    if (this.state.IsSure) {
      this.props.dispatch({
        type: 'share/getNoFollow',
        payload: {
          id: DossierDetailData.gzid,
          tzlx: DossierDetailData.tzlx,
          ajbh: DossierDetailData.ajbh,
        },
        callback: res => {
          if (!res.error) {
            message.success('取消关注成功');
            this.refreshTable(this.props.location.query);
            // if (this.props.getDossier) {
            //   this.props.getDossier({ currentPage: this.props.current, pd: this.props.formValues });
            // }
            // this.setState({
            //     sfgz: 0,
            // }, () => {
            //     this.getDossierDetail(DossierDetailData.dossier_id)
            // });
            this.getDossierDetail(DossierDetailData.dossier_id);
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
  // 关闭督办模态框
  closeModal = (flag, param) => {
    this.setState({
      superviseVisibleModal: !!flag,
    });
  };
  // 督办完成保存
  // saveModal = (flag, param, wjxx, newdbzrr, newdbzrdw, newdbzrdwid, newdbzrrsfzh, OptionCode, OptionName, cljg_mc, cljg_yy) => {
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
  //                 wtfl_id: '203206',
  //                 wtfl_mc: '卷宗',
  //                 wtlx_id: OptionCode,
  //                 wtlx_mc: OptionName,
  //                 zgyj: param,
  //                 zrr_dwid: newdbzrdwid,
  //                 zrr_dwmc: newdbzrdw,
  //                 zrr_name: newdbzrr,
  //                 zrr_sfzh: newdbzrrsfzh,
  //                 cljg_mc: cljg_mc,
  //                 cljg_yy: cljg_yy,
  //                 ajbh: this.state.DossierDetailData && this.state.DossierDetailData.ajbh ? this.state.DossierDetailData.ajbh : '',
  //                 ajmc: this.state.DossierDetailData && this.state.DossierDetailData.ajmc ? this.state.DossierDetailData.ajmc : '',
  //             },
  //             callback: (data) => {
  //                 message.info('问题判定保存完成');
  //                 this.getDossierDetail(this.props.id);
  //                 this.setState({
  //                     // is_ok: '1',
  //                     loading1: false,
  //                 });
  //             },
  //         });
  //     }
  //     else {
  //         message.info('因缺少相关数据，该问题暂时无法判定。');            this.setState({
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
    this.getDossierDetail(this.props.id);
  };
  Marking = (DossierDetailData, flag) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/DossierMarking',
        query: {
          record: DossierDetailData,
          id:
            DossierDetailData && DossierDetailData.dossier_id ? DossierDetailData.dossier_id : '1',
          from: '卷宗信息',
          tzlx: 'jzxx',
          fromPath: '/dossierPolice/DossierData/DossierDetail',
          tab: '详情',
        },
      }),
    );
    // this.setState({
    //     mark: !!flag,
    // });
  };
  // MarkClose = () => {
  //     this.setState({
  //         mark: false,
  //     });
  // };

  IntoCase = record => {
    if (record.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: { record: record, id: record.system_id },
        }),
      );
      // const divs = (
      //     <div>
      //         <Detail
      //             {...this.props}
      //             id={record.system_id}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '刑事案件详情', content: divs, key: record.system_id };
      // this.props.newDetail(AddNewDetail);
    } else if (record.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { id: record.system_id, record: record },
        }),
      );
      // const divs = (
      //     <div>
      //         <XZDetail
      //             {...this.props}
      //             systemId={record.system_id}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '行政案件详情', content: divs, key: record.system_id };
      // this.props.newDetail(AddNewDetail);
    }
  };
  seeCase = (flag, caseDetails) => {
    if (caseDetails && caseDetails.ajxxList) {
      if (caseDetails.ajxxList.length === 1) {
        this.IntoCase(caseDetails.ajxxList[0]);
      } else {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/ModuleAll/RelateCase',
            query: {
              record: caseDetails.ajxxList,
              id: caseDetails && caseDetails.id ? caseDetails.id : '1',
            },
          }),
        );
        // this.setState({
        //   policevisible: !!flag,
        // });
      }
    }

    // if (list&&list.length === 1) {
    //   this.IntoCase(list[0]);
    // } else {
    //   this.setState({
    //     casevisible: !!flag,
    //   });
    // }
  };

  // CaseCancel = e => {
  //   this.setState({
  //     casevisible: false,
  //   });
  // };

  Topdetail() {
    const { isDb } = this.state;
    // const {record} = this.props;
    // const {DossierDetailData:{DossierDetailData,handleDossierSfgz}} = this.props;
    const rowLayout = { md: 8, lg: 24, xl: 48 };
    const colLayout = { sm: 24, md: 12, xl: 8 };
    let dark = this.props.global && this.props.global.dark;
    let handleDossierSfgz, DossierDetailData;
    if (
      this.state.DossierDetailData &&
      this.props.DossierData &&
      this.props.DossierData.DossierDetailData &&
      this.state.DossierDetailData.id === this.props.DossierData.DossierDetailData.id
    ) {
      handleDossierSfgz = this.props.DossierData.handleDossierSfgz;
      DossierDetailData = this.props.DossierData.DossierDetailData;
      this.setState({
        DossierDetailData,
      });
    } else {
      handleDossierSfgz = this.state.DossierDetailData ? this.state.DossierDetailData.sfgz : '';
      DossierDetailData = this.state.DossierDetailData;
    }
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        {DossierDetailData ? (
          <Row gutter={rowLayout}>
            <Col {...colLayout} style={{ minHeight: 0 }}>
              {/*<span style={{ margin: '16px', display: 'block' }}>卷宗详情</span>*/}
              {isDb &&
              DossierDetailData &&
              DossierDetailData.zrdwList &&
              DossierDetailData.zrdwList.length > 0 ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  onClick={() => this.onceSupervise(DossierDetailData, true, '卷宗详情问题判定')}
                >
                  问题判定
                </Button>
              ) : (
                ''
              )}
              {DossierDetailData &&
              DossierDetailData.is_gldzj &&
              DossierDetailData.is_gldzjdm === '1' ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  onClick={() => this.Marking(DossierDetailData, true)}
                >
                  阅卷
                </Button>
              ) : (
                ''
              )}
            </Col>
            <Col style={{ minHeight: 0 }}>
              <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
                <span>
                  <span className={liststyles.collect}>
                    {handleDossierSfgz === 0 ? (
                      <Tooltip title="关注" onClick={() => this.saveShare(DossierDetailData, 1, 0)}>
                        <img
                          src={dark ? nocollect : nocollect1}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>关注</div>
                      </Tooltip>
                    ) : (
                      <Tooltip title="取消关注" onClick={() => this.noFollow(DossierDetailData)}>
                        <img
                          src={dark ? collect : collect1}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>取消关注</div>
                      </Tooltip>
                    )}
                  </span>
                  <span
                    className={liststyles.collect}
                  >
                    <Tooltip title="分享" onClick={() => this.saveShare(DossierDetailData, 2)}>
                      <img src={dark ? share : share1} width={20} height={20} />
                      <div style={{ fontSize: 12 }}>分享</div>
                    </Tooltip>
                  </span>
                </span>
              </span>
            </Col>
          </Row>
        ) : (
          ''
        )}
      </div>
    );
  }

  renderDetail() {
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 8 };
    const colLayoutInName = { sm: 24, md: 4, xl: 4 };
    const colLayoutInData = { sm: 24, md: 20, xl: 20 };
    const specialcolLayout = { sm: 24, md: 24, xl: 24 };
    const { DossierDetailData } = this.state;
    let dark = this.props.global && this.props.global.dark;
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
        <div style={{ textAlign: 'right', padding: '16px 0' }}>
          {DossierDetailData &&
          DossierDetailData.ajxxList &&
          DossierDetailData.ajxxList.length > 0 ? (
            <Button
              type="primary"
              onClick={() => this.seeCase(true, DossierDetailData)}
              style={{
                marginRight: 16,
                backgroundColor: dark
                  ? 'linear-gradient(to right, #0084FA, #03A3FF)'
                  : 'linear-gradient(to right, #3D63D1, #333FE4)',
              }}
            >
              查看关联案件
            </Button>
          ) : (
            ''
          )}
        </div>
        <Card
          title={
            <div
              style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}
            >
              卷宗信息
            </div>
          }
          className={styles.card}
          bordered={false}
        >
          <Row className={styles.xqrow}>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件名称：</div>
              <div className={liststyles.Indextail}>
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
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件编号：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData &&
                DossierDetailData.ajxxList &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajbh
                  ? DossierDetailData.ajxxList[0].ajbh
                  : DossierDetailData.ajbh
                  ? DossierDetailData.ajbh
                  : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件类型：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData &&
                DossierDetailData.ajxxList &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajlx_mc
                  ? DossierDetailData.ajxxList[0].ajlx_mc
                  : DossierDetailData.ajlx_mc
                  ? DossierDetailData.ajlx_mc
                  : ''}
              </div>
            </Col>
          </Row>
          <Row className={styles.xqrow}>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件状态：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData &&
                DossierDetailData.ajxxList &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].ajzt
                  ? DossierDetailData.ajxxList[0].ajzt
                  : DossierDetailData.ajzt
                  ? DossierDetailData.ajzt
                  : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>办案单位：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData &&
                DossierDetailData.ajxxList &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].bardwmc
                  ? DossierDetailData.ajxxList[0].bardwmc
                  : DossierDetailData.bardw_name
                  ? DossierDetailData.bardw_name
                  : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>办案人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 46 }}>
                {DossierDetailData &&
                DossierDetailData.ajxxList &&
                DossierDetailData.ajxxList.length > 0 &&
                DossierDetailData.ajxxList[0].barxm
                  ? DossierDetailData.ajxxList[0].barxm
                  : DossierDetailData.bar
                  ? DossierDetailData.bar
                  : ''}
              </div>
            </Col>
          </Row>
          <Row className={styles.xqrow}>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>卷宗名称：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData && DossierDetailData.jzmc ? DossierDetailData.jzmc : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>卷宗编号：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData && DossierDetailData.jzbh ? DossierDetailData.jzbh : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>立卷人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 46 }}>
                {DossierDetailData && DossierDetailData.ljr ? DossierDetailData.ljr : ''}
              </div>
            </Col>
          </Row>
          <Row className={styles.xqrow}>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>卷宗类别：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData && DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>卷宗页数：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData && DossierDetailData.jzys ? DossierDetailData.jzys : ''}
              </div>
            </Col>
            <Col {...colLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>立卷时间：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData && DossierDetailData.ljsj ? DossierDetailData.ljsj : ''}
              </div>
            </Col>
          </Row>
          <Row className={styles.xqrow}>
            <Col {...specialcolLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>电子化：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 46 }}>
                {DossierDetailData && DossierDetailData.is_gldzj ? DossierDetailData.is_gldzj : ''}
              </div>
            </Col>
          </Row>
          <Row>
            <Col {...specialcolLayout} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>卷宗描述：</div>
              <div className={liststyles.Indextail}>
                {DossierDetailData && DossierDetailData.jzms ? DossierDetailData.jzms : ''}
              </div>
            </Col>
          </Row>
        </Card>
        {DossierDetailData.jzgjList && DossierDetailData.jzgjList.length > 0 ? (
          <Card
            title={
              <div
                style={{
                  borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1',
                  paddingLeft: 16,
                }}
              >
                卷宗轨迹
              </div>
            }
            className={styles.card}
            bordered={false}
            style={{ marginBottom: 0 }}
          >
            <div style={{ overflow: 'auto' }}>
              <Timeline style={{ marginTop: 20, marginLeft: 20 }}>{stap1}</Timeline>
            </div>
          </Card>
        ) : (
          ''
        )}
      </div>
    );
  }

  ResultId = () => {
    return 'caseDetail' + this.state.DossierDetailData.ajbh;
  };

  render() {
    let dark = this.props.global && this.props.global.dark;
    const { superviseVisibleModal, mark, DossierDetailData, casevisible } = this.state;
    let detail = (
      <Row
        style={{
          width: '90%',
          margin: '0 38px 10px',
          lineHeight: '36px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <Col span={8}>
          卷宗名称：
          <Tooltip
            title={
              DossierDetailData && DossierDetailData.jzmc && DossierDetailData.jzmc.length > 12
                ? DossierDetailData.jzmc
                : null
            }
          >
            {DossierDetailData && DossierDetailData.jzmc
              ? DossierDetailData.jzmc.length > 12
                ? DossierDetailData.jzmc.substring(0, 12) + '...'
                : DossierDetailData.jzmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={8}>
          卷宗类别：
          {DossierDetailData && DossierDetailData.jzlb_mc ? DossierDetailData.jzlb_mc : ''}
        </Col>
        <Col span={8}>
          卷宗描述：
          <Tooltip
            title={
              DossierDetailData && DossierDetailData.jzms && DossierDetailData.jzms.length > 12
                ? DossierDetailData.jzms
                : null
            }
          >
            {DossierDetailData && DossierDetailData.jzms
              ? DossierDetailData.jzms.length > 12
                ? DossierDetailData.jzms.substring(0, 12) + '...'
                : DossierDetailData.jzms
              : ''}
          </Tooltip>
        </Col>
        <Col span={8}>
          案件名称：
          <Tooltip
            title={
              DossierDetailData && DossierDetailData.ajmc && DossierDetailData.ajmc.length > 12
                ? DossierDetailData.ajmc
                : null
            }
          >
            {DossierDetailData && DossierDetailData.ajmc
              ? DossierDetailData.ajmc.length > 12
                ? DossierDetailData.ajmc.substring(0, 12) + '...'
                : DossierDetailData.ajmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={8}>
          案件状态：{DossierDetailData && DossierDetailData.ajzt ? DossierDetailData.ajzt : ''}
        </Col>
      </Row>
    );
    const AreaColumns = [
      {
        title: '案件名称',
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
        title: '案件类别',
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
        title: '操作',
        width: 50,
        render: record => (
          <div>
            <a onClick={() => this.IntoCase(record)}>详情</a>
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
        {/*caseDetails={this.state.DossierDetailData}*/}
        {/*getRefresh={this.Refresh}*/}
        {/*wtflId='203206'*/}
        {/*wtflMc='卷宗'*/}
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

        {/*<ShareModal detail={detail} shareVisible={this.state.shareVisible} handleCancel={this.handleCancel}*/}
        {/*shareItem={this.state.shareItem} personList={this.state.personList} lx={this.state.lx}*/}
        {/*tzlx={this.state.tzlx} sx={this.state.sx}/>*/}

        {/*{mark ?*/}
        {/*<DossierMarkingModal*/}
        {/*{...this.props}*/}
        {/*visible={mark}*/}
        {/*DossierDetailData={DossierDetailData}*/}
        {/*closeModal={this.MarkClose}*/}
        {/*/>*/}
        {/*:*/}
        {/*''*/}
        {/*}*/}
        <Modal
          visible={casevisible}
          title="选择查看案件"
          centered
          className={styles.policeModal}
          width={1000}
          maskClosable={false}
          onCancel={this.CaseCancel}
          footer={null}
          getContainer={() => document.getElementById(this.ResultId())}
        >
          <Table
            size={'middle'}
            style={{ backgroundColor: '#262C3D' }}
            pagination={{
              pageSize: 3,
              showTotal: (total, range) => (
                <div style={{ color: '#b7b7b7' }}>
                  共 {total} 条记录 第 {this.state.casecurrent} / {Math.ceil(total / 3)} 页
                </div>
              ),
              onChange: page => {
                this.setState({ casecurrent: page });
              },
            }}
            dataSource={DossierDetailData ? DossierDetailData.jzList : []}
            columns={AreaColumns}
          />
        </Modal>
      </div>
    );
  }
}
