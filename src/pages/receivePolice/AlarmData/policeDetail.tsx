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
import SuperviseModal from '../../../components/UnCaseRealData/SuperviseModal';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
import ShareModal from '../../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import share from '../../../assets/common/share.png';
import LeightWord from '../../../components/ClearDispatching/LeightWord';
import styles from './policeDetail.less';
import liststyles from '../../common/listDetail.less';
import { autoheight, userResourceCodeDb } from '../../../utils/utils';
import { authorityIsTrue } from '../../../utils/authority';
import DispatchModal from '../../../components/DispatchModal/DispatchModal';
import {routerRedux} from "dva/router";

let imgBase = [];

@connect(({ policeData, loading }) => ({
  policeData,
  loading,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class policeDetail extends PureComponent {
  constructor(props) {
    super(props);
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
      sfgz: props.location&&props.location.query&&props.location.query.record&&props.location.query.record.sfgz===0?props.location.query.record.sfgz:'',
      IsSure: false, // 确认详情是否加载成功
      isDb: authorityIsTrue(userResourceCodeDb.police), // 督办权限
      isDd: props.location&&props.location.query&&props.location.query.record&&props.location.query.record.isDd?props.location.query.record.isDd : false,
      // keyWord:['打','杀','伤','刀','剑','棍','棒','偷','盗','抢','骗','死','赌','毒','卖淫','嫖娼','侮辱'],
      policeDispatchVisible: false, // 调度模态框
      policeDispatchItem: null, // 调度信息
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
    if (this.props.location && this.props.location.query && this.props.location.query.id&&this.props.location.query.movefrom&&this.props.location.query.movefrom==='警情常规'){
      this.getDetail(this.props.location.query.id);
    }
    else if(this.props.location && this.props.location.query &&this.props.location.query.record&&this.props.location.query.record.system_id&&this.props.location.query.movefrom&&this.props.location.query.movefrom==='警情预警'){
      this.getDetail(this.props.location.query.record.system_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (nextProps.location.query&&nextProps.location.query.record&&nextProps.location.query.record.sfgz&&nextProps.location.query.record.sfgz !== null && nextProps.location.query.record.sfgz !== this.props.location.query.record.sfgz) {
        this.setState({
          sfgz: nextProps.location.query.record.sfgz,
        });
      }
      else if(nextProps.history.location.query.isReset&&nextProps.history.location.pathname==='/receivePolice/AlarmData/policeDetail'){
        this.getDetail(this.props.location.query.id);
        this.props.history.replace(nextProps.history.location.pathname+'?id='+nextProps.location.query.id+'&record='+nextProps.location.query.record);
      }
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
    if (policeDetails.ajlx === '22001') { // 刑事案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
          query: { id: policeDetails && policeDetails.id ? policeDetails.id : '1', record: policeDetails },
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
    } else if (policeDetails.ajlx === '22002') { // 行政案件
      this.props.dispatch(
        routerRedux.push({
          pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
          query: { id: policeDetails && policeDetails.id ? policeDetails.id : '1', record: policeDetails },
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
          query: { record: policeDetails,id: policeDetails && policeDetails.id ? policeDetails.id : '1',from:'警情详情问题判定',tzlx:'jqxx',fromPath:'/receivePolice/AlarmData/policeDetail',wtflId:'230201',wtflMc:'警情' },
        }),
      )
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
    this.getDetail(this.props.id);
  };
  // 分享和关注（2为分享，1为关注）
  saveShare = (policeDetails, res, type, ajGzLx) => {
    this.setState({
      sx:
        (res.jjdw ? res.jjdw + '、' : '') +
        (res.jjly_mc ? res.jjly_mc + '、' : '') +
        (res.jqlb ? res.jqlb + '、' : '') +
        (res.jjsj ? res.jjsj : ''),
    });
    if (type === 2) {
      let detail=(<Row style={{ lineHeight: '50px',paddingLeft:66 }}>
        <Col
          span={8}>接警人：{res && res.jjr ? res.jjr : ''}</Col>
        <Col span={8}>管辖单位：<Tooltip
          title={res && res.jjdw && res.jjdw.length > 25 ? res.jjdw : null}>{res && res.jjdw ? res.jjdw.length > 25 ? res.jjdw.substring(0, 25) + '...' : res.jjdw : ''}</Tooltip></Col>
        <Col span={8}>接警信息：<Tooltip
          title={res && res.jjnr && res.jjnr.length > 25 ? res.jjnr : null}>{res && res.jjnr ? res.jjnr.length > 25 ? res.jjnr.substring(0, 25) + '...' : res.jjnr : ''}</Tooltip></Col>
        <Col
          span={8}>处警人：{res && res.cjr ? res.cjr : ''}</Col>
        <Col span={8}>处警单位：<Tooltip
          title={res && res.cjdw && res.cjdw.length > 25 ? res.cjdw : null}>{res && res.cjdw ? res.cjdw.length > 25 ? res.cjdw.substring(0, 25) + '...' : res.cjdw : ''}</Tooltip></Col>
        <Col span={8}>处警信息：<Tooltip
          title={res && res.cjqk && res.cjqk.length > 25 ? res.cjqk : null}>{res && res.cjqk ? res.cjqk.length > 25 ? res.cjqk.substring(0, 25) + '...' : res.cjqk : ''}</Tooltip></Col>
      </Row>)
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: { record: res,id: res && res.id ? res.id : '1',from:'警情信息',tzlx:'jqxx',fromPath:'/receivePolice/AlarmData/policeDetail',detail,tab:'详情' },
        }),
      )
      // this.setState({
      //   shareVisible: true,
      //   shareItem: res,
      // });
    } else {
      if (this.state.IsSure) {
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            agid: this.props.tzlx === 'jqyj' ? this.props.yjid : policeDetails.id,
            lx: this.state.lx,
            sx:
              (res.jjdw ? res.jjdw + '、' : '') +
              (res.jjly_mc ? res.jjly_mc + '、' : '') +
              (res.jqlb ? res.jqlb + '、' : '') +
              (res.jjsj ? res.jjsj : ''),
            type: type,
            tzlx: this.props.tzlx,
            wtid: res.wtid,
            ajbh: res.ajbh,
            system_id:
              this.props.tzlx === 'jqyj' || this.props.tzlx === 'jqxx'
                ? policeDetails.id
                : policeDetails.system_id,
            ajGzLx: ajGzLx,
          },
          callback: res => {
            if (!res.error) {
              // alert(1)
              message.success('关注成功');
              if (this.props.getPolice) {
                this.props.getPolice({
                  currentPage: this.props.current,
                  pd: this.props.formValues,
                });
              }
              this.setState(
                {
                  sfgz: 1,
                },
                () => {
                  this.getDetail(this.state.policeDetails.id);
                },
              );
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
            if (this.props.getPolice) {
              this.props.getPolice({ currentPage: this.props.current, pd: this.props.formValues });
            }
            this.setState(
              {
                sfgz: 0,
              },
              () => {
                this.getDetail(this.state.policeDetails.id);
              },
            );
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
    const exportId = `#jqDetail${this.props.id}`;
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
    const { policeDetails, sfgz, isDb } = this.state;
    const { query:{record} } = this.props.location;
    return (
      <div style={{ backgroundColor: '#252C3C', margin: '16px 0' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            {/*<span style={{ margin: '16px', display: 'block' }}>警情详情</span>*/}
            <Button className={styles.TopMenu} onClick={() => this.ExportStatistics()}>
              导出
            </Button>
            {isDb && policeDetails && policeDetails.zrdwList && policeDetails.zrdwList.length > 0 ? (
              <Button
                className={styles.TopMenu}
                onClick={() => this.onceSupervise(policeDetails, true, '警情详情问题判定')}
              >
                问题判定
              </Button>
            ) : (
              ''
            )}
            {this.state.isDd && this.props.record && this.props.record.is_sqdd === '0' ? (
              <Button
                className={styles.TopMenu}
                onClick={() => this.saveDispatch(this.props.record)}
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
                    {sfgz === 0 ? (
                      <Tooltip title="关注">
                        <img
                          src={collect}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                          onClick={() => this.saveShare(policeDetails, record, 1, 0)}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>关注</div>
                      </Tooltip>
                    ) : (
                      <Tooltip title="取消关注">
                        <img
                          src={nocollect}
                          width={25}
                          height={25}
                          style={{ marginLeft: 12 }}
                          onClick={() => this.noFollow(policeDetails)}
                        />
                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>取消关注</div>
                      </Tooltip>
                    )}
                  </span>
                  <span
                    className={liststyles.collect}
                    onClick={() => this.saveShare(policeDetails, record, 2)}
                  >
                    <Tooltip title="分享">
                      <img src={share} width={25} height={25} />
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
    const { policeDetails } = this.state;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    return (
      <div
        style={{ background: '#252c3c', height: autoheight() - 280 + 'px' }}
        id={`jqDetail${this.props.id}`}
        className={styles.detailBoxScroll}
      >
        {policeDetails && policeDetails.ajbh && policeDetails.is_sa === 0 ? (
          ''
        ) : (
          <div style={{ textAlign: 'right', padding: '16px 32px' }}>
            <Button
              className={styles.connectBtn}
              onClick={() => this.openCaseDetail(policeDetails)}
            >
              查看关联案件
            </Button>
          </div>
        )}
        <Card
          title={<div style={{ borderLeft: '1px solid #fff', paddingLeft: 16 }}>接警信息</div>}
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
          title={<div style={{ borderLeft: '1px solid #fff', paddingLeft: 16 }}>处警信息</div>}
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
                  style={{ color: this.props.isDd ? '#f00' : 'rgba(255, 255, 255)' }}
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
      <div>
        <div>{this.Topdetail()}</div>
        <div>{this.renderDetail()}</div>

        {/*{superviseVisibleModal ? (*/}
          {/*<SuperviseModal*/}
            {/*{...this.props}*/}
            {/*visible={superviseVisibleModal}*/}
            {/*closeModal={this.closeModal}*/}
            {/*// saveModal={this.saveModal}*/}
            {/*caseDetails={this.state.policeDetails}*/}
            {/*getRefresh={this.Refresh}*/}
            {/*wtflId="203201"*/}
            {/*wtflMc="警情"*/}
            {/*// 点击列表的督办显示的四个基本信息*/}
            {/*wtlx={this.state.superviseWtlx}*/}
            {/*from={this.state.from}*/}
          {/*/>*/}
        {/*) : (*/}
          {/*''*/}
        {/*)}*/}
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

        {/*<DispatchModal*/}
          {/*handleSearch={this.props.handleSearch}*/}
          {/*title="警情调度"*/}
          {/*isPoliceDispatch*/}
          {/*detail={detail}*/}
          {/*shareVisible={this.state.policeDispatchVisible}*/}
          {/*handleCancel={this.handleCancel}*/}
          {/*closehandleCancel={this.closehandleCancel}*/}
          {/*shareItem={this.state.policeDispatchItem}*/}
          {/*tzlx="jq"*/}
          {/*refreshDetail={this.refreshDetail}*/}
          {/*hideDispatchButton={this.hideDispatchButton}*/}
        {/*/>*/}
      </div>
    );
  }
}
