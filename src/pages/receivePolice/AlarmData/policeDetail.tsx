/*
 * PoliceRealData/policeDetail.js 警情数据详情
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, message, Row, Tooltip } from 'antd';
import html2canvas from 'html2canvas';
// import CaseDetail from '../CaseRealData/caseDetail';
// import SuperviseModal from '../../../components/UnCaseRealData/SuperviseModal';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
// import ShareModal from '../../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share from '../../../assets/common/share.png';
import share1 from '../../../assets/common/share1.png';
import LeightWord from '../../../components/ClearDispatching/LeightWord';
import styles from './policeDetail.less';
import liststyles from '../../common/listDetail.less';
import { autoheight, userResourceCodeDb } from '../../../utils/utils';
import { authorityIsTrue } from '../../../utils/authority';
// import DispatchModal from '../../../components/DispatchModal/DispatchModal';
import { routerRedux } from 'dva/router';
import {tableList} from "@/utils/utils";

let imgBase = [];
let res = {};

@connect(({ policeData, loading, global }) => ({
  policeData,
  loading,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class policeDetail extends PureComponent {
  constructor(props) {
    super(props);
    res = props.location.query.record;
    if (res && typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      policeDetails: null,
      // 督办模态框
      superviseVisibleModal: false,
      // 问题判定的来源参数
      from: '',
      shareVisible: false,
      shareItem: null,
      personList: [],
      lx: '警情信息',
      tzlx: 'jqxx',
      sx: '',
      sfgz: res && res.sfgz === 0 ? res.sfgz : '',
      IsSure: false, // 确认详情是否加载成功
      isDb: authorityIsTrue(userResourceCodeDb.police), // 督办权限
      isDd: res && res.isDd ? res.isDd : false,
      // keyWord:['打','杀','伤','刀','剑','棍','棒','偷','盗','抢','骗','死','赌','毒','卖淫','嫖娼','侮辱'],
      policeDispatchVisible: false, // 调度模态框
      policeDispatchItem: null, // 调度信息
      record:res, // 表格信息
    };
    if (props.isDd) {
      this.getPoliceKeyword();
    }
  }

  // 获取接警内容关键字
  getPoliceKeyword = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '500948', //'500502'
          isCaseAll: true,
        },
        showCount: 999,
      },
      callback: data => {
        this.setState({
          keyWord:
            data &&
            data.map(item => {
              return item.name;
            }),
        });
      },
    });
  };

  componentDidMount() {
      this.getDetail(this.props.location.query.id);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.history.location.query.isReset &&
      nextProps.history.location.pathname === '/receivePolice/AlarmData/policeDetail'
    ) {
      this.getDetail(this.props.location.query.id);
      this.props.history.replace(
        nextProps.history.location.pathname +
          '?id=' +
          nextProps.location.query.id +
          '&record=' +
          nextProps.location.query.record,
      );
    }
  }

  getDetail(id) {
    this.setState(
      {
        IsSure: false,
      },
      () => {
        this.props.dispatch({
          type: 'policeData/policeDetailFetch',
          payload: {
            id: id,
          },
          callback: data => {
            if (data) {
              this.setState({
                policeDetails: data,
                IsSure: true,
              });
            }
          },
        });
      },
    );
  }

  // 根据案件编号打开案件窗口
  openCaseDetail = policeDetails => {
    if (policeDetails.ajlx === '22001') {
      // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: {
            id: policeDetails && policeDetails.ajbh ? policeDetails.ajbh : '1',
            record: policeDetails,
          },
        }),
      );
      // const divs = (
      //     <div>
      //         <CaseDetail
      //             {...this.props}
      //             id={policeDetails.ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '刑事案件详情', content: divs, key: policeDetails.ajbh };
      // this.props.newDetail(AddNewDetail);
    } else if (policeDetails.ajlx === '22002') {
      // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: {
            id: policeDetails && policeDetails.system_id ? policeDetails.system_id : '1',
            record: policeDetails,
          },
        }),
      );
      // const divs = (
      //     <div>
      //         <XzCaseDetail
      //             {...this.props}
      //             systemId={policeDetails.ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '行政案件详情', content: divs, key: policeDetails.ajbh };
      // this.props.newDetail(AddNewDetail);
    }
  };

  // 问题判定
  onceSupervise = (policeDetails, flag, from) => {
    if (policeDetails) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Supervise',
          query: {
            record: policeDetails,
            id: policeDetails && policeDetails.id ? policeDetails.id : '1',
            from: from,
            tzlx: this.state.tzlx,
            fromPath: '/receivePolice/AlarmData/policeDetail',
            wtflId: '230201',
            wtflMc: '警情',
          },
        }),
      );
      // this.setState({
      //   superviseVisibleModal: !!flag,
      //   superviseWtlx: policeDetails.wtlx,
      //   from,
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
    });
    this.getDetail(this.props.location.query.id);
  };
  refreshTable = (param) => {
    if(param.movefrom === '警情常规'){
      this.props.dispatch({
        type: 'policeData/policeFetch',
        payload: {
          currentPage: param.current,
          showCount: tableList,
          pd: {
            is_sa: '0',
          },
        },
      });
    }
    else if(param.movefrom === '警情预警'){
      this.props.dispatch({
        type: 'EarlyWarning/getList',
        payload: {
          // currentPage: param.current,
          // showCount: tableList,
          pd: {
            yj_type: 'jq',
          },
        },
      });
    }
  }
  // 分享和关注（2为分享，1为关注）
  saveShare = (policeDetails, res, type, ajGzLx) => {
    // console.log('res',res);
    // console.log('policeDetails',policeDetails)
    this.setState({
      sx:
        (policeDetails.jjdw ? policeDetails.jjdw + '、' : '') +
        (policeDetails.jjly_mc ? policeDetails.jjly_mc + '、' : '') +
        (policeDetails.jqlb ? policeDetails.jqlb + '、' : '') +
        (policeDetails.jjsj ? policeDetails.jjsj : ''),
    });
    if (type === 2) {
      let res = policeDetails;
      let detail = [
        `接警人：${res && res.jjr ? res.jjr : ''}`,
        `管辖单位：${res && res.jjdw ? res.jjdw : ''}`,
        `接警信息：${res && res.jjnr ? res.jjnr : ''}`,
        `处警人：${res && res.cjr ? res.cjr : ''}`,
        `处警单位：${res && res.cjdw ? res.cjdw : ''}`,
        `处警信息：${res && res.cjqk ? res.cjqk : ''}`,
        `处置结果：${res && res.czjg_mc ? res.czjg_mc : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: policeDetails,
            id: policeDetails && policeDetails.id ? policeDetails.id : '1',
            from: this.state.lx,
            tzlx: this.state.tzlx,
            fromPath: '/receivePolice/AlarmData/policeDetail',
            tab: '详情',
            sx:
              (policeDetails.jjdw ? policeDetails.jjdw + '、' : '') +
              (policeDetails.jjly_mc ? policeDetails.jjly_mc + '、' : '') +
              (policeDetails.jqlb ? policeDetails.jqlb + '、' : '') +
              (policeDetails.jjsj ? policeDetails.jjsj : ''),
          },
        }),
      );
    } else {
      if (this.state.IsSure) {
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            agid:
              this.props.location.query.tzlx === 'jqyj'
                ? this.props.location.query.yjid
                : policeDetails.id,
            lx: this.state.lx,
            sx:
              (policeDetails.jjdw ? policeDetails.jjdw + '、' : '') +
              (policeDetails.jjly_mc ? policeDetails.jjly_mc + '、' : '') +
              (policeDetails.jqlb ? policeDetails.jqlb + '、' : '') +
              (policeDetails.jjsj ? policeDetails.jjsj : ''),
            type: type,
            tzlx: this.props.location.query.tzlx,
            wtid: policeDetails.wtid,
            ajbh: policeDetails.ajbh,
            system_id:
              this.props.location.query.tzlx === 'jqyj' || this.props.location.query.tzlx === 'jqxx'
                ? policeDetails.id
                : policeDetails.system_id,
            ajGzLx: ajGzLx,
          },
          callback: res => {
            if (!res.error) {
              // alert(1)
              message.success('关注成功');
              // if (this.props.getPolice) {
              //   this.props.getPolice({
              //     currentPage: this.props.current,
              //     pd: this.props.formValues,
              //   });
              // }
              this.refreshTable(this.props.location.query);
              // this.props.dispatch({
              //   type:'policeData/policeNewSfgz',
              //   payload:{
              //     sfgz:1,
              //   },
              // })
              // this.setState(
              //   {
              //     sfgz: 1,
              //   },
              //   () => {
                  this.getDetail(this.state.policeDetails.id);
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
  noFollow = policeDetails => {
    console.log('policeDetails',policeDetails)
    if (this.state.IsSure) {
      this.props.dispatch({
        type: 'share/getNoFollow',
        payload: {
          id: policeDetails.gzid,
          tzlx: policeDetails.tzlx,
          ajbh: policeDetails.ajbh,
        },
        callback: res => {
          if (!res.error) {
            message.success('取消关注成功');
            // if (this.props.getPolice) {
            //   this.props.getPolice({ currentPage: this.props.current, pd: this.props.formValues });
            // }
            this.refreshTable(this.props.location.query);
            // this.props.dispatch({
            //   type:'policeData/policeNewSfgz',
            //   payload:{
            //     sfgz:0,
            //   },
            // })
            // this.setState(
            //   {
            //     sfgz: 0,
            //   },
            //   () => {
                this.getDetail(this.state.policeDetails.id);
            //   },
            // );
          }
        },
      });
    } else {
      message.info('您的操作太频繁，请稍后再试');
    }
  };
  // 调度
  saveDispatch = res => {
    this.setState({
      policeDispatchVisible: true,
      policeDispatchItem: res,
    });
  };
  // 隐藏调度按钮
  hideDispatchButton = () => {
    this.setState({
      isDd: false,
    });
  };
  handleCancel = e => {
    this.setState({
      shareVisible: false,
      policeDispatchVisible: false,
    });
  };
  closehandleCancel = () => {
    this.setState({
      shareVisible: false,
      policeDispatchVisible: false,
    });
  };
  // 刷新详情
  refreshDetail = () => {
    this.getDetail(this.state.policeDetails.id);
  };
  // 详情导出word功能
  ExportStatistics = () => {
    imgBase = [];
    const exportId = `#jqDetail${this.props.location.query.id}`;
    html2canvas(document.querySelector(exportId)).then(canvas => {
      imgBase.push(canvas.toDataURL().split('base64,')[1]);
      this.exprotService(imgBase);
    });
  };
  // 详情导出word功能请求
  exprotService = imagesBase => {
    this.props.dispatch({
      type: 'common/getExportEffect',
      payload: {
        docx_name: '警情详情导出',
        header: '警情详情',
        tiles: [
          {
            type: 'image',
            width: 6.3,
            base64: imagesBase[0],
          },
        ],
      },
      callback: data => {
        if (data && data.result) {
          window.location.href = `${configUrl.tbtjExportUrl}/down-docx/警情详情导出.docx`;
        }
      },
    });
  };


  Topdetail() {
    const { sfgz, isDb,record } = this.state;
    const { policeData:{handlePoliceSfgz,policeDetails} } = this.props
    console.log('handlePoliceSfgz',handlePoliceSfgz);
    // const {query: { record }} = this.props.location;
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ backgroundColor: dark ? '#252C3C' : '#fff', margin: '16px 0', borderRadius: 10 }}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {/*<span style={{ margin: '16px', display: 'block' }}>警情详情</span>*/}
            <Button className={styles.TopMenu} onClick={() => this.ExportStatistics()}>
              导出
            </Button>
            {isDb &&
            policeDetails &&
            policeDetails.zrdwList &&
            policeDetails.zrdwList.length > 0 ? (
              <Button
                className={styles.TopMenu}
                onClick={() => this.onceSupervise(policeDetails, true, '警情详情问题判定')}
              >
                问题判定
              </Button>
            ) : (
              ''
            )}
            {this.state.isDd &&
            record &&
            record.is_sqdd === '0' ? (
              <Button
                className={styles.TopMenu}
                onClick={() => this.saveDispatch(record)}
              >
                调度
              </Button>
            ) : (
              ''
            )}
          </Col>
          <Col>
            <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
              {policeDetails ? (
                <span>
                  <span className={liststyles.collect}>
                    {handlePoliceSfgz === 0 ? (
                      <Tooltip title="关注">
                        <div onClick={() => this.saveShare(policeDetails, record, 1, 0)}>
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
                        <div onClick={() => this.noFollow(policeDetails)}>
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
                    onClick={() => this.saveShare(policeDetails, record, 2)}
                  >
                    <Tooltip title="分享">
                      <img src={dark ? share : share1} width={20} height={20} />
                      <div style={{ fontSize: 12 }}>分享</div>
                    </Tooltip>
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
  renderDetail() {
    const { record } = this.state;
    const { policeData:{policeDetails} } = this.props
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    let dark = this.props.global && this.props.global.dark;
    return (
      <div
        style={{ background: dark ? '#252c3c' : '#fff', height: autoheight() - 280 + 'px' }}
        id={`jqDetail${this.props.location.query.id}`}
        className={styles.detailBoxScroll}
      >
        {policeDetails && policeDetails.ajbh && policeDetails.is_sa === 1 ? (
          <div style={{ textAlign: 'right', padding: '16px 32px' }}>
            <Button
              className={styles.connectBtn}
              onClick={() => this.openCaseDetail(policeDetails)}
            >
              查看关联案件
            </Button>
          </div>
        ) : (
          ''
        )}
        <Card
          title={
            <div
              style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}
            >
              接警信息
            </div>
          }
          className={liststyles.card}
          bordered={false}
        >
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>
                <div className={liststyles.special}>接警来源：</div>
              </div>
              <div className={liststyles.Indextail}>
                <div className={liststyles.special1}>
                  {policeDetails && policeDetails.jjly_mc ? policeDetails.jjly_mc : ''}
                </div>
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>报案人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 46 }}>
                {policeDetails && policeDetails.bar ? policeDetails.bar : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>报案人联系方式：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 100 }}>
                {policeDetails && policeDetails.bar_lxfs ? policeDetails.bar_lxfs : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警时间：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.jjsj ? policeDetails.jjsj : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警人：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 46 }}>
                {policeDetails && policeDetails.jjr
                  ? policeDetails.jjr.split(',')[policeDetails.jjr.split(',').length - 1]
                  : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>管辖单位：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 60 }}>
                {policeDetails && policeDetails.jjdw
                  ? policeDetails.jjdw.split(',')[policeDetails.jjdw.split(',').length - 1]
                  : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>接警内容：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 60 }}>
                <LeightWord
                  type={'all'}
                  keyWord={this.state.keyWord ? this.state.keyWord : []}
                  newsString={policeDetails && policeDetails.jjnr ? policeDetails.jjnr : ''}
                />
              </div>
            </Col>
          </Row>
        </Card>

        <Card
          title={
            <div
              style={{ borderLeft: dark ? '3px solid #fff' : '3px solid #3D63D1', paddingLeft: 16 }}
            >
              处警信息
            </div>
          }
          className={liststyles.card}
          bordered={false}
        >
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>
                <div className={liststyles.special}>处置结果：</div>
              </div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 58 }}>
                <div
                  className={liststyles.special1}
                  style={{ color: record.isDd ? '#f00' : 'rgba(255, 255, 255)' }}
                >
                  {policeDetails && policeDetails.czjg_mc ? policeDetails.czjg_mc : ''}
                </div>
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警民警：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjr
                  ? policeDetails.cjr.split(',')[policeDetails.cjr.split(',').length - 1]
                  : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警单位：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjdw
                  ? policeDetails.cjdw.split(',')[policeDetails.cjdw.split(',').length - 1]
                  : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout} className={styles.xqrow}>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>警情编号：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.jqbh ? policeDetails.jqbh : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警时间：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjr_cjsj ? policeDetails.cjr_cjsj : ''}
              </div>
            </Col>
            <Col md={8} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>到达时间：</div>
              <div className={liststyles.Indextail}>
                {policeDetails && policeDetails.cjddsj ? policeDetails.cjddsj : ''}
              </div>
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            <Col md={24} sm={24} className={styles.xqcol}>
              <div className={liststyles.Indexfrom}>处警情况：</div>
              <div className={liststyles.Indextail} style={{ paddingLeft: 60 }}>
                {policeDetails && policeDetails.cjqk ? policeDetails.cjqk : ''}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  render() {
    const { superviseVisibleModal, policeDetails } = this.state;
    let dark = this.props.global && this.props.global.dark;
    let detail = (
      <Row
        style={{
          width: '90%',
          margin: '0 38px 10px',
          lineHeight: '36px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <Col span={5}>接警人：{policeDetails && policeDetails.jjr ? policeDetails.jjr : ''}</Col>
        <Col span={9}>
          管辖单位：
          <Tooltip
            title={
              policeDetails && policeDetails.jjdw && policeDetails.jjdw.length > 13
                ? policeDetails.jjdw
                : null
            }
          >
            {policeDetails && policeDetails.jjdw
              ? policeDetails.jjdw.length > 13
                ? policeDetails.jjdw.substring(0, 13) + '...'
                : policeDetails.jjdw
              : ''}
          </Tooltip>
        </Col>
        <Col span={10}>
          接警信息：
          <LeightWord
            keyWord={this.state.keyWord ? this.state.keyWord : []}
            newsString={policeDetails && policeDetails.jjnr ? policeDetails.jjnr : ''}
          />
        </Col>
        <Col span={5}>处警人：{policeDetails && policeDetails.cjr ? policeDetails.cjr : ''}</Col>
        <Col span={9}>
          处警单位：
          <Tooltip
            title={
              policeDetails && policeDetails.cjdw && policeDetails.cjdw.length > 13
                ? policeDetails.cjdw
                : null
            }
          >
            {policeDetails && policeDetails.cjdw
              ? policeDetails.cjdw.length > 13
                ? policeDetails.cjdw.substring(0, 13) + '...'
                : policeDetails.cjdw
              : ''}
          </Tooltip>
        </Col>
        <Col span={10}>
          处警信息：
          <Tooltip
            title={
              policeDetails && policeDetails.cjqk && policeDetails.cjqk.length > 16
                ? policeDetails.cjqk
                : null
            }
          >
            {policeDetails && policeDetails.cjqk
              ? policeDetails.cjqk.length > 16
                ? policeDetails.cjqk.substring(0, 16) + '...'
                : policeDetails.cjqk
              : ''}
          </Tooltip>
        </Col>
        <Col span={8}>
          处置结果：
          <span
            style={{
              color: '#f00',
              fontWeight: '700',
            }}
          >
            {policeDetails && policeDetails.czjg_mc ? policeDetails.czjg_mc : ''}
          </span>
        </Col>
      </Row>
    );
    return (
      <div className={dark ? '' : styles.lightBox}>
        <div>{this.Topdetail()}</div>
        <div className={styles.detailBox}>{this.renderDetail()}</div>
      </div>
    );
  }
}
