/*
 * ItemRealData/itemDetail.js 涉案财物详情数据
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
  message,
  Carousel, Timeline, Tag,
} from 'antd';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../NewXzCaseRealData/caseDetail';

import styles from './itemDetail.less';
import liststyles from '../../common/listDetail.less';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import SuperviseModal from '../../components/NewUnCaseRealData/SuperviseModal';
// import ShareModal from '../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import nophoto from '../../../assets/common/zwwpDark.png';
import share from '../../../assets/common/share.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share1 from '../../../assets/common/share1.png';
import { autoheight, getUserInfos, userResourceCodeDb } from '../../../utils/utils';
import { authorityIsTrue } from '../../../utils/authority';
import { routerRedux } from 'dva/router';
import nophotoLight from '@/assets/common/zwwp.png';
import { tableList } from '@/utils/utils';

const FormItem = Form.Item;

@connect(({ itemData, loading, MySuperviseData, CaseData, global }) => ({
  itemData,
  loading,
  MySuperviseData,
  CaseData,
  global,
  // loading: loading.models.alarmManagement,
}))
export default class itemDetail extends PureComponent {
  constructor(props) {
    super(props);
    let res = props.location.query.record;
    if (typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      itemDetails: [],

      // 督办模态框
      superviseVisibleModal: false,
      // 点击列表的督办显示的基本信息
      superviseWtlx: '',
      // superviseZrdw: '',
      // superviseZrr: '',
      // superviseZrdwId: '',
      // id:'',
      // sfzh:'',
      // 问题判定的来源参数
      from: '',
      // 子系统的id
      // systemId: '',

      shareVisible: false,
      shareItem: null,
      personList: [],
      lx: '物品信息',
      tzlx: 'wpxx',
      sx: '',
      sfgz: res && res.sfgz && res.sfgz === 0 ? res.sfgz : '',
      IsSure: false, // 确认详情是否加载成功
      isDb: authorityIsTrue(userResourceCodeDb.item), // 督办权限
      record: res,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    // conosle.log('location',location);
    if (
      location &&
      location.query &&
      location.query.record &&
      (location.query.system_id || location.query.id)
    ) {
      this.itemDetailDatas(location.query.system_id || location.query.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps',nextProps.sfgz);
    // alert(1)
    if (nextProps) {
      if (nextProps.sfgz !== null && nextProps.sfgz !== this.props.sfgz) {
        this.setState({
          sfgz: nextProps.sfgz,
        });
      }
    }
  }

  // 问题判定
  onceSupervise = (itemDetails, flag, from) => {
    if (itemDetails) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Supervise',
          query: {
            record: itemDetails,
            id: itemDetails && itemDetails.system_id ? itemDetails.system_id : '1',
            from: from,
            tzlx: 'wpwt',
            fromPath: '/articlesInvolved/ArticlesData/itemDetail',
            wtflId: '203204',
            wtflMc: '涉案财物',
            tabName: '问题判定'
          },
        }),
      );
      // this.setState({
      //     // systemId: itemDetails.system_id,
      //     superviseVisibleModal: !!flag,
      //     superviseWtlx: itemDetails.wtlx,
      //     // superviseZrdw: itemDetails.kfgly_dwmc,
      //     // superviseZrdwId: itemDetails.kfgly_dwdm,
      //     // superviseZrr: itemDetails.kfgly,
      //     // id: itemDetails.wtid,
      //     // sfzh: itemDetails.kfgly_zjhm,
      //     from: from,
      // });
    } else {
      message.error('该物品无法进行问题判定');
    }
  };
  // 修改改变模态框状态 通过id 获取数据
  itemDetailDatas = id => {
    this.setState(
      {
        IsSure: false,
      },
      () => {
        this.props.dispatch({
          type: 'itemData/getSawpXqById',
          payload: {
            system_id: id,
          },
          callback: data => {
            if (data) {
              this.setState({
                itemDetails: data,
                IsSure: true,
              });
            }
          },
        });
      },
    );
  };

  person = itemDetails => {
    this.props.dispatch({
      type: 'AllDetail/AllDetailPersonFetch',
      payload: {
        ajbh: itemDetails.ajbh,
        sfzh: itemDetails.syrSfzh,
      },
      callback: data => {
        if (data && data.ryxx) {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/lawEnforcement/PersonFile/Detail',
              query: {
                record: itemDetails,
                id: itemDetails && itemDetails.syrSfzh ? itemDetails.syrSfzh : '1',
                fromPath: '/articlesInvolved/ArticlesData/itemDetail',
              },
            }),
          );
          // const divs = (
          //     <div>
          //         <PersonDetail
          //             {...this.props}
          //             ajbh={ajbh}
          //             idcard={sfzh}
          //             ly='常规数据'
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
  openCaseDetail = itemDetails => {
    if (itemDetails.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: {
            id: itemDetails && itemDetails.ajbh ? itemDetails.ajbh : '1',
            record: itemDetails,
          },
        }),
      );
      // const divs = (
      //     <div>
      //         <CaseDetail
      //             {...this.props}
      //             id={ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '刑事案件详情', content: divs, key: ajbh };
      // this.props.newDetail(AddNewDetail);
    } else if (itemDetails.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { id: itemDetails && itemDetails.ajbh ? itemDetails.ajbh : '1', record: itemDetails },
        }),
      );
      // const divs = (
      //     <div>
      //         <XzCaseDetail
      //             {...this.props}
      //             ajbh={ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '行政案件详情', content: divs, key: ajbh };
      // this.props.newDetail(AddNewDetail);
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
    });
    this.itemDetailDatas(this.props.id);
  };
  // 是否关注列表刷新
  refreshTable = param => {
    if (param.movefrom === '物品常规') {
      this.props.dispatch({
        type: 'itemData/itemFetch',
        payload: {
          currentPage: param.current,
          showCount: tableList,
          pd: {},
        },
      });
    } else if (param.movefrom === '物品预警') {
      this.props.dispatch({
        type: 'EarlyWarning/getList',
        payload: {
          pd: { yj_type: 'sawp' },
        },
      });
    }
  };
  // 分享和关注（2为分享，1为关注）
  saveShare = (itemDetails, res, type, ajGzLx) => {
    // console.log('res',res);
    // console.log('aaa',(res.jjdw?res.jjdw+'、':'') + (res.jjly_mc?res.jjly_mc:''));
    this.setState({
      sx:
        (res.ajmc ? res.ajmc + '、' : '') +
        (res.wpmc ? res.wpmc + '、' : '') +
        (res.zt ? res.zt : ''),
    });
    if (type === 2) {
      let detail = [
        `财物名称：${itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}`,
        `财物分类：${itemDetails && itemDetails.cwflzw ? itemDetails.cwflzw : ''}`,
        `财物状态：${itemDetails && itemDetails.wpzt ? itemDetails.wpzt : ''}`,
        `库房信息：${itemDetails && itemDetails.szkf ? itemDetails.szkf : ''}`,
        `案件名称：${itemDetails && itemDetails.ajmc ? itemDetails.ajmc : ''}`,
        `办案单位：${itemDetails && itemDetails.kfgly_dwmc ? itemDetails.kfgly_dwmc : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: res,
            id: res && res.system_id ? res.system_id : '1',
            from: '物品信息',
            tzlx: 'wpxx',
            fromPath: '/articlesInvolved/ArticlesData/itemDetail',
            tab: '详情',
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.wpmc ? res.wpmc + '、' : '') +
              (res.zt ? res.zt : ''),
          },
        }),
      );
      // this.setState({
      //     shareVisible: true,
      //     shareItem: res,
      // });
    } else {
      if (this.state.IsSure) {
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            agid: itemDetails.id,
            lx: this.state.lx,
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.wpmc ? res.wpmc + '、' : '') +
              (res.zt ? res.zt : ''),
            type: type,
            tzlx: this.state.tzlx,
            wtid: res.wtid,
            ajbh: res.ajbh,
            system_id: itemDetails.system_id,
            ajGzLx: ajGzLx,
            is_fxgz: '0',
          },
          callback: res => {
            if (!res.error) {
              // alert(1)
              message.success('关注成功');
              this.refreshTable(this.props.location.query);
              // if (this.props.getItem) {
              //   this.props.getItem({ currentPage: this.props.current, pd: this.props.formValues });
              // }
              // this.setState(
              //   {
              //     sfgz: 1,
              //   },
              //   () => {
              this.itemDetailDatas(itemDetails.system_id);
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
  noFollow = itemDetails => {
    if (this.state.IsSure) {
      this.props.dispatch({
        type: 'share/getNoFollow',
        payload: {
          id: itemDetails.gzid,
          tzlx: itemDetails.tzlx,
          ajbh: itemDetails.ajbh,
        },
        callback: res => {
          if (!res.error) {
            message.success('取消关注成功');
            this.refreshTable(this.props.location.query);
            // if (this.props.getItem) {
            //   this.props.getItem({ currentPage: this.props.current, pd: this.props.formValues });
            // }
            // this.setState(
            //   {
            //     sfgz: 0,
            //   },
            //   () => {
            this.itemDetailDatas(itemDetails.system_id);
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

  Topdetail() {
    const { sfgz, isDb, record } = this.state;
    // const { itemData:{handleWpSfgz,itemDetails} } = this.props;
    let dark = this.props.global && this.props.global.dark;
    let handleWpSfgz, itemDetails;
    if (
      this.state.itemDetails &&
      this.props.itemData &&
      this.props.itemData.itemDetails &&
      this.state.itemDetails.id === this.props.itemData.itemDetails.id
    ) {
      handleWpSfgz = this.props.itemData.handleWpSfgz;
      itemDetails = this.props.itemData.itemDetails;
      this.setState({
        itemDetails,
      });
    } else {
      handleWpSfgz = this.state.itemDetails ? this.state.itemDetails.sfgz : '';
      itemDetails = this.state.itemDetails;
    }
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        {itemDetails ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24} style={{ minHeight: 0 }}>
              {/*<span style={{ margin: '16px', display: 'block' }}>涉案财物详情</span>*/}
              {isDb && itemDetails && itemDetails.zrdwList && itemDetails.zrdwList.length > 0 ? (
                <Button
                  type="primary"
                  style={{ margin: '12px 0 12px 16px' }}
                  className={styles.TopMenu}
                  onClick={() => this.onceSupervise(itemDetails, true, '涉案财物详情问题判定')}
                >
                  问题判定
                </Button>
              ) : (
                ''
              )}
            </Col>
            <Col style={{ minHeight: 0 }}>
              <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
                <span>
                  <span className={liststyles.collect}>
                    {handleWpSfgz === 0 ? (
                      <Tooltip
                        title="关注"
                        onClick={() => this.saveShare(itemDetails, record, 1, 0)}
                      >
                        <img
                          src={dark ? nocollect : nocollect1}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>关注</div>
                      </Tooltip>
                    ) : (
                      <Tooltip title="取消关注" onClick={() => this.noFollow(itemDetails)}>
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
                    <Tooltip title="分享"  onClick={() => this.saveShare(itemDetails, record, 2)}>
                      <img
                        src={dark ? share : share1}
                        style={{ marginLeft: 12 }}
                        width={25}
                        height={25}
                      />
                    </Tooltip>
                    <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>分享</div>
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
    const { itemDetails, isDb } = this.state;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    let dark = this.props.global && this.props.global.dark;
    let stap1 = [];
    itemDetails&&itemDetails.wpgjList&&itemDetails.wpgjList.map((item,index)=>{
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
                <p style={{ paddingTop: 7, color: '#fff' }}>{itemDetails.wpgjList.length - index}</p>
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
                </Tag> : ''}
              </Row>
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
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 260 + 'px' }}
        className={styles.detailBoxScroll}
      >
        <div style={{ height: 'auto' }}>
          {itemDetails && itemDetails.system_id && itemDetails.ajlx ? (
            <div style={{ float: 'right', padding: '16px' }}>
              <Button
                type="primary"
                onClick={() => this.openCaseDetail(itemDetails)}
                style={{
                  background: dark
                    ? 'linear-gradient(to right, #0084FA, #03A3FF)'
                    : 'linear-gradient(to right, #3D63D1, #333FE4)',
                }}
              >
                查看关联案件
              </Button>
            </div>
          ) : (
            ''
          )}
          <div style={{ content: '', clear: 'both', display: 'block' }} />
        </div>
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
          <Row gutter={rowLayout} style={{ marginLeft: 0, marginRight: 0 }}>
            <Col md={6} sm={24}>
              <div>
                {itemDetails && itemDetails.imageList && itemDetails.imageList.length > 0 ? (
                  <Carousel autoplay>
                    {itemDetails.imageList.map(pane => (
                      <div>
                        <img
                          width="200"
                          src={pane.url ? pane.url : dark ? nophoto : nophotoLight}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <img width="200" src={dark ? nophoto : nophotoLight} />
                )}
              </div>
            </Col>
            <Col md={18} sm={24}>
              <div>
                {
                  itemDetails && itemDetails.wpzlCode && itemDetails.wpzlCode == 1 ?   <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.wpxx}>
                    <Col md={8} sm={24}>
                      名称：{itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      来源：{itemDetails && itemDetails.wply ? itemDetails.wply : ''}
                    </Col>
                    <Col span={8}>采取措施日期：{itemDetails && itemDetails.cqcsrq ? itemDetails.cqcsrq : ''}</Col>
                    <Col span={8}>
                      款项分类：{itemDetails && itemDetails.wpzlname2 ? itemDetails.wpzlname2 : ''}
                    </Col>
                    <Col span={8}>
                      货币/金融工具分类：{itemDetails && itemDetails.wpzlname3 ? itemDetails.wpzlname3 : ''}
                    </Col>
                    <Col span={8}>
                      款项类别：{itemDetails && itemDetails.kxlbzw ? itemDetails.kxlbzw : ''}
                    </Col>
                    <Col span={8}>
                      总金额：{itemDetails && itemDetails.zje ? itemDetails.zje : ''}
                    </Col>
                    <Col span={8}>
                      存入账户：{itemDetails && itemDetails.crzh ? itemDetails.crzh : ''}
                    </Col>
                    <Col span={8}>
                      存入日期：{itemDetails && itemDetails.crrq ? itemDetails.crrq : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      存入人：{itemDetails && itemDetails.crr ? itemDetails.crr : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      入账单据号：{itemDetails && itemDetails.rzdjh ? itemDetails.rzdjh : ''}
                    </Col>
                    <Col md={24} sm={24}>
                      所在库房名称：{itemDetails && itemDetails.szkf ? itemDetails.szkf : ''}
                    </Col>
                    <Col md={24} sm={24}>
                      备注：{itemDetails && itemDetails.bz ? itemDetails.bz : ''}
                    </Col>
                  </Row> : <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.wpxx}>
                    <Col md={8} sm={24}>
                      物品名称：{itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      物品来源：{itemDetails && itemDetails.wply ? itemDetails.wply : ''}
                    </Col>
                    <Col span={8}>采取措施日期：{itemDetails && itemDetails.cqcsrq ? itemDetails.cqcsrq : ''}</Col>
                    <Col span={8}>
                      物品分类：{itemDetails && itemDetails.wpzlname2 ? itemDetails.wpzlname2 : ''}
                    </Col>
                    <Col span={8}>
                      三级分类：{itemDetails && itemDetails.wpzlname3 ? itemDetails.wpzlname3 : ''}
                    </Col>
                    <Col span={8}>
                      是否具有财产属性：{itemDetails && itemDetails.sfyccsx ? itemDetails.sfyccsx === '1' ? '是' : '否' : ''}
                    </Col>
                    <Col span={8}>
                      是否贵重物品：{itemDetails && itemDetails.sfgzwp ? itemDetails.sfgzwp=== '1' ? '是' : '否' : ''}
                    </Col>
                    <Col span={8}>
                      是否易损易贬值：{itemDetails && itemDetails.sfysybz ? itemDetails.sfysybz=== '1' ? '是' : '否' : ''}
                    </Col>
                    <Col span={8}>
                      唯一编号：{itemDetails && itemDetails.wpbh ? itemDetails.wpbh : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      重量：{itemDetails && itemDetails.wpzl ? itemDetails.wpzl : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      型号：{itemDetails && itemDetails.wpxh ? itemDetails.wpxh : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      规格：{itemDetails && itemDetails.wpgg ? itemDetails.wpgg : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      物品所有人：
                      <a
                        onClick={() => this.person(itemDetails)}
                        style={{ textDecoration: 'underline' }}
                      >
                        {itemDetails.syrName}
                      </a>
                    </Col>
                    {/*<Col md={8} sm={24}>*/}
                    {/*  缺损特征：{itemDetails && itemDetails.tzlx ? itemDetails.tzlx : ''}*/}
                    {/*</Col>*/}
                    <Col md={8} sm={24}>
                      数量：{itemDetails && itemDetails.wpsl ? itemDetails.wpsl : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      保存期限：{itemDetails && itemDetails.bcqx ? itemDetails.bcqx : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      库房管理员：{itemDetails && itemDetails.kfgly ? itemDetails.kfgly : ''}
                    </Col>
                    {/*<Col md={8} sm={24}>*/}
                    {/*  保存方式：{itemDetails && itemDetails.bcfsName ? itemDetails.bcfsName : ''}*/}
                    {/*</Col>*/}
                    <Col md={8} sm={24}>
                      财物状态：{itemDetails && itemDetails.wpztzw ? itemDetails.wpztzw : ''}
                    </Col>
                    <Col md={8} sm={24}>
                      所在库位：{itemDetails && itemDetails.szkw ? itemDetails.szkw : ''}
                    </Col>
                    <Col md={24} sm={24}>
                      所在库房名称：{itemDetails && itemDetails.szkf ? itemDetails.szkf : ''}
                    </Col>
                    <Col md={24} sm={24}>
                      备注：{itemDetails && itemDetails.bz ? itemDetails.bz : ''}
                    </Col>
                  </Row>
                }
              </div>
            </Col>
          </Row>
        </Card>
        {itemDetails && itemDetails.wpgjList && itemDetails.wpgjList.length > 0 ?
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
                className={liststyles.card}
                bordered={false}
              >
                <Timeline style={{ marginTop: 20 }}>{stap1}</Timeline>
              </Card>
            </div>
        : (
          ''
        )}
      </div>
    );
  }

  render() {
    let dark = this.props.global && this.props.global.dark;
    const { superviseVisibleModal, itemDetails } = this.state;
    return (
      <div className={dark ? '' : styles.lightBox}>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail()}</div>
      </div>
    );
  }
}
