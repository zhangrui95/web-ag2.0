/*
 * CaseRealData/index.js 受立案行政案件数据
 * author：jhm
 * 20180605
 * */

import React, { PureComponent, Fragment } from 'react';
import numeral from 'numeral';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
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
  Collapse,
  Divider,
  Select,
  Icon,
  Avatar,
  List,
  Tooltip,
  Input,
  message,
  Modal,
  Empty,
} from 'antd';

// import DescriptionList from 'components/DescriptionList';
import styles from './caseDetail.less';
import liststyles from '../../common/listDetail.less';
import { autoheight, getQueryString, userResourceCodeDb } from '../../../utils/utils';
import classNames from 'classnames';
// import ItemDetail from '../ItemRealData/itemDetail';
// import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';
// import JqDetail from '../../routes/PoliceRealData/policeDetail';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
import CaseModalTrail from '../../../components/Common/CaseModalTrail';
import CaseModalStep from '../../../components/Common/CaseModalStep';
// import FeedbackModal from '../../components/Common/FeedbackModal';
import { authorityIsTrue } from '../../../utils/authority';
import SupervisionLog from '../../../components/Common/SupervisionLog';
import noList from '@/assets/viewData/noList.png';
import { routerRedux } from 'dva/router';
import noListLight from '@/assets/viewData/noListLight.png';

const FormItem = Form.Item;
// const { Description } = DescriptionList;
const { Step } = Steps;
const Panel = Collapse.Panel;

function callback(key) {
  console.log(key);
}

@connect(({ UnXzCaseData, loading, UnCaseData, AllDetail, MySuperviseData, global }) => ({
  UnXzCaseData,
  loading,
  UnCaseData,
  AllDetail,
  MySuperviseData,
  global,
  // loading: loading.models.alarmManagement,
}))
export default class caseDetail extends PureComponent {
  state = {
    current: 1, // 涉案物品默认在第一页
    jqcurrent: 1, // 警情信息默认在第一页
    trailLeft: '0',
    is_ok: '0', // 是否在该详情页督办过，默认0,没有督办过
    loading1: false, // 督办按钮状态，默认false没加载,true是点击后的加载状态
    loading2: false, // 再次督办按钮状态，默认false没加载,true是点击后的加载状态
    sureChange: false, // 点击确认整改完毕时，如果点击过，判断过程的loading状态；
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
    dbid: '',
    seeDetail: false, // 点击督办日志中查看督办详情
    Isdetail: '', // 确认点击督办日志中哪一个'查看督办详情'
    NowDbrz: '',
    feedbackVisibleModal: false, // 反馈状态模态框
    feedbackButtonLoading: false, // 反馈按钮加载状态
    isDb: authorityIsTrue(userResourceCodeDb.zfba_xz), // 督办权限
    record: '', // 表格信息
  };

  componentDidMount() {
    let res = this.props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    if (this.props.location && res && this.props.location.query.id && res.system_id) {
      this.caseDetailDatas(this.props.location.query.id, res.system_id);
      this.setState({
        record: res,
      });
    }
  }

  //修改改变模态框状态 通过id 获取数据
  caseDetailDatas = (id, systemId) => {
    this.props.dispatch({
      type: 'UnXzCaseData/getXzAjxxXqById',
      payload: {
        id: id,
        system_id: systemId,
      },
      callback: data => {
        if (data) {
          this.setState({
            caseDetails: data,
            sureChange: false,
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
  // 问题判定
  onceSupervise = (flag, caseDetails) => {
    const { wtlx, sldw_name, sldw_dm, bar_name, wtid, barzjhm } = caseDetails;
    this.props.dispatch({
      type: 'UnXzCaseData/getUnXzCaseByProblemId',
      payload: {
        pd: {
          wtid,
        },
        currentPage: 1,
        showCount: 9999,
      },
      callback: data => {
        if (data.list.length > 0) {
          if (
            data.list[0].dbzt === '00' ||
            (data.list[0].dbzt === '30' && data.list[0].fkzt === '1')
          ) {
            this.props.dispatch(
              routerRedux.push({
                pathname: '/ModuleAll/Supervise',
                query: {
                  record: caseDetails,
                  id: caseDetails && caseDetails.wtid ? caseDetails.wtid : '1',
                  from: '案件信息',
                  tzlx: 'xzajwt',
                  fromPath: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
                  tab: '详情',
                },
              }),
            );
            // this.setState({
            //   superviseVisibleModal: !!flag,
            //   superviseWtlx: wtlx,
            //   superviseZrdw: sldw_name,
            //   superviseZrdwId: sldw_dm,
            //   superviseZrr: bar_name,
            //   id: wtid,
            //   sfzh: barzjhm,
            // });
          } else {
            message.warning('该问题已督办或暂无反馈信息');
            // this.caseDetailDatas(this.props.id, this.props.systemId);
            this.caseDetailDatas(this.props.location.query.id, this.state.record.system_id);
          }
        } else {
          message.info('该数据无法督办');
        }
      },
    });
  };
  // 反馈
  feedback = (flag, unCaseDetailData) => {
    const { wtid } = unCaseDetailData;
    this.props.dispatch({
      type: 'UnXzCaseData/getUnXzCaseByProblemId',
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
                tzlx: 'xzajwt',
                fromPath: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
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
  // 根据物品案件编号和身份证号打开人员档案窗口
  openPersonDetail = (idcard, name, xyrId) => {
    if (idcard && name && xyrId) {
      this.props.dispatch({
        type: 'AllDetail/AllDetailPersonFetch',
        payload: {
          name: name,
          sfzh: idcard,
          xyrId,
        },
        callback: data => {
          if (data && data.ryxx) {
            // const divs = (
            //     <div>
            //         <PersonDetail
            //             {...this.props}
            //             name={name}
            //             idcard={idcard}
            //             xyrId={xyrId}
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
    } else {
      message.error('该人员暂无人员档案');
    }
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
  // saveModal = (flag, param, wjxx,newdbzrr,newdbzrdw,newdbzrdwid,newdbzrrsfzh,cljg_mc,cljg_yy) => {
  //   this.setState({
  //     superviseVisibleModal: !!flag,
  //     loading1: true,
  //       loading2: true,
  //   });
  //   const {superviseZrdwId, superviseZrdw, superviseZrr, sfzh} = this.state;
  //   if (newdbzrdwid && newdbzrdw && newdbzrr && newdbzrrsfzh) {
  //     this.props.dispatch({
  //       type: 'UnCaseData/SureSupervise',
  //       payload: {
  //         wtid: this.state.id,
  //         wjxx,
  //         id: this.state.id,
  //         zgyj: param,
  //         zrr_dwid: newdbzrdwid,
  //         zrr_dwmc: newdbzrdw,
  //         zrr_name: newdbzrr,
  //         zrr_sfzh: newdbzrrsfzh,
  //         ajbh: this.state.caseDetails && this.state.caseDetails.ajbh ? this.state.caseDetails.ajbh : '',
  //         ajmc: this.state.caseDetails && this.state.caseDetails.ajmc ? this.state.caseDetails.ajmc : '',
  //         cljg_mc:cljg_mc,
  //         cljg_yy:cljg_yy,
  //       },
  //       callback: (data) => {
  //         message.info('督办保存完成');
  //         this.caseDetailDatas(this.props.id, this.props.systemId);
  //         if (this.props.refreshTable) {
  //           this.props.refreshTable();
  //         }
  //         this.setState({
  //           is_ok: '1',
  //           loading1: false,
  //             loading2: false,
  //         });
  //       },
  //     });
  //   }
  //   else {
  //     message.info('该数据无法督办');
  //     this.setState({
  //       is_ok: '1',
  //       loading1: false,
  //         loading2: false,
  //     });
  //   }
  //
  // };

  // 问题判定完成后页面刷新
  Refresh = flag => {
    this.setState({
      superviseVisibleModal: !!flag,
      loading1: false,
      loading2: false,
    });
    this.caseDetailDatas(this.props.id, this.props.systemId);
  };
  // 反馈
  saveFeedbackModal = params => {
    // console.log('params----------->', params);
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
          this.caseDetailDatas(this.props.id, this.props.systemId);
          if (this.props.refreshTable) {
            this.props.refreshTable();
          }
        } else {
          message.error('反馈保存失败');
        }
      },
    });
  };

  Topdetail() {
    const { caseDetails, isDb } = this.state;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*  <span style={{ margin: '16px', display: 'block' }}>行政案件详情</span>*/}
          {/*</Col>*/}
          <Col>
            <span style={{ float: 'right', margin: '12px 16px 12px 0' }}>
              {caseDetails && caseDetails.zt === '待督办' && isDb ? (
                <Button
                  className={styles.TopMenu}
                  loading={this.state.loading1}
                  onClick={() => this.onceSupervise(true, caseDetails)}
                >
                  督办
                </Button>
              ) : (
                ''
              )}
              {caseDetails &&
              (caseDetails.dbid === '' ||
                (caseDetails.dbList &&
                  caseDetails.dbList.length > 0 &&
                  caseDetails.dbList[caseDetails.dbList.length - 1].fkzt !== '1')) &&
              isDb ? (
                <Button
                  className={styles.TopMenu}
                  loading={this.state.feedbackButtonLoading}
                  onClick={() => this.feedback(true, caseDetails)}
                >
                  反馈
                </Button>
              ) : null}
              {this.props.isDd && this.props.record && this.props.record.is_sqdd === '0' ? (
                <Button
                  type="primary"
                  style={{ marginLeft: 8 }}
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
  // 点击案件轨迹人员的在区情况
  IntoArea = (sfzh, ajbh) => {
    if (sfzh && ajbh) {
      // const divs = (
      //     <div>
      //         <PersonIntoArea
      //             {...this.props}
      //             ajbh={ajbh}
      //             sfzh={sfzh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: ajbh + sfzh };
      // this.props.newDetail(AddNewDetail);
    } else {
      message.warning('暂无涉案人员在区情况');
    }
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
                  <div style={{ color: '#fff' }}>
                    共 {Math.ceil(total / 8)} 页， {total} 条记录{' '}
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
                查看
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
            () => that.handleReformSure();
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
        // this.caseDetailDatas(this.props.id, this.props.systemId);
        // if (this.props.refreshTable) {
        //   this.props.refreshTable();
        // }
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
    // const {UnXzCaseData: {caseDetails, loading}} = this.props;
    const { caseDetails, isDb, loading2, sureChange } = this.state;
    const status = ['否', '是'];
    const statusMap = ['default', 'success'];
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const JqColumns = [
      {
        title: '接警来源',
        dataIndex: 'jjly_mc',
        render: record => {
          return record && record.length <= 10 ? (
            record
          ) : (
            <Tooltip title={record}>
              <span>{record && record.substring(0, 10) + '...'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '接警时间',
        dataIndex: 'jjsj',
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
        title: '管辖单位',
        dataIndex: 'jjdw',
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
        title: '接警人',
        dataIndex: 'jjr',
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
        title: '处警单位',
        dataIndex: 'cjdw',
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
        title: '处警人',
        dataIndex: 'cjr',
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
        title: '报案人',
        dataIndex: 'bar',
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
        title: '是否受案',
        dataIndex: 'is_sa',
        render(text) {
          return <Badge status={statusMap[text]} text={status[text]} />;
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
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff' /*height: autoheight() - 290 + 'px'*/ }}
        className={styles.detailBoxScroll}
      >
        <SupervisionLog
          detailData={caseDetails}
          sureChangeLoading={sureChange}
          superviseloading={loading2}
          isDb={isDb}
          onceSupervise={this.onceSupervise}
          sureReform={this.sureReform}
          rowLayout={rowLayout}
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
                <div style={{ color: '#fff' }}>
                  共 {Math.ceil(total / 3)} 页， {total} 条记录
                </div>
              ),
              onChange: page => {
                this.setState({ jqcurrent: page });
              },
            }}
            className={styles.jqxxTable}
            dataSource={caseDetails ? caseDetails.jqxxList : []}
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
        <div className={styles.message} style={{ padding: '24px 70px' }}>
          <Row style={{ marginRight: 0 }} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件编号：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.ajbh ? caseDetails.ajbh : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件名称：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>案件状态：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.ajzt ? caseDetails.ajzt : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>发案日期：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.fasj_sx && caseDetails.fasj_xx
                  ? caseDetails.fasj_sx + '~' + caseDetails.fasj_xx
                  : ''}
              </div>
            </Col>
          </Row>
          <Row style={{ marginRight: 0 }} className={styles.xqrow}>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>受理单位：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.sldw_name ? caseDetails.sldw_name : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>受理日期：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.slrq ? caseDetails.slrq : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>办案单位：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.sldw_name ? caseDetails.sldw_name : ''}
              </div>
            </Col>
            <Col md={6} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>办案人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: '46px' }}>
                {caseDetails && caseDetails.bar_name ? caseDetails.bar_name : ''}
              </div>
            </Col>
          </Row>
          <Row style={{ marginRight: 0 }} className={styles.xqrow}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>简要案情：</div>
              <div className={liststyles.Indextail}>
                {caseDetails && caseDetails.ajjj ? caseDetails.ajjj : ''}
              </div>
            </Col>
          </Row>

          {caseDetails && caseDetails.ajzt ? (
            <Card
              title={'案件流程'}
              style={{ backgroundColor: '#171A26', marginTop: 12, borderRadius: 0 }}
              className={styles.ajlcCard}
            >
              <CaseModalStep caseDetails={caseDetails} />
            </Card>
          ) : (
            ''
          )}
        </div>

        {caseDetails && caseDetails.ajzt ? (
          <div style={{ borderBottom: dark ? '1px solid #171925' : '1px solid #e6e6e6' }}>
            <div className={styles.title}>案件轨迹</div>
            <CaseModalTrail {...this.props} caseDetails={caseDetails} from="行政" />
          </div>
        ) : (
          ''
        )}

        <div className={styles.title}>| 涉案物品</div>
        <div className={styles.tablemessage}>
          <div style={{ padding: '24px' }}>
            {this.sawpCol(caseDetails && caseDetails.sawpList ? caseDetails.sawpList : [])}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let dark = this.props.global && this.props.global.dark;
    const {
      superviseVisibleModal,
      reformModal,
      seeDetail,
      Isdetail,
      NowDbrz,
      history,
      RestDbrz,
      feedbackVisibleModal,
    } = this.state;
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
        {/*caseDetails={this.state.caseDetails}*/}
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
        {/*{*/}
        {/*feedbackVisibleModal ? (*/}
        {/*<FeedbackModal*/}
        {/*closeModal={this.closeFeedbackModal}*/}
        {/*saveModal={this.saveFeedbackModal}*/}
        {/*visible={feedbackVisibleModal}*/}
        {/*detailsData={this.state.caseDetails}*/}
        {/*/>*/}
        {/*) : null*/}
        {/*}*/}
      </div>
    );
  }
}
