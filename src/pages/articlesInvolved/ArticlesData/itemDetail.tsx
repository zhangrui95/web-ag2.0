/*
* ItemRealData/itemDetail.js 涉案物品详情数据
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
    Carousel,
} from 'antd';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';

import styles from './itemDetail.less';
import liststyles from '../../common/listDetail.less';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';
// import ShareModal from '../../components/ShareModal/ShareModal';
import collect from '../../../assets/common/collect.png';
import nocollect from '../../../assets/common/nocollect.png';
import nophoto from '../../../assets/common/nophoto.png';
import share from '../../../assets/common/share.png';
import collect1 from '../../../assets/common/collect1.png';
import nocollect1 from '../../../assets/common/nocollect1.png';
import share1 from '../../../assets/common/share1.png';
import { autoheight, getUserInfos, userResourceCodeDb } from '../../../utils/utils';
import { authorityIsTrue } from '../../../utils/authority';
import {routerRedux} from "dva/router";
import nophotoLight from "@/assets/common/nophotoLight.png";

const FormItem = Form.Item;

@connect(({ itemData, loading, MySuperviseData, CaseData,global }) => ({
    itemData, loading, MySuperviseData, CaseData,global
    // loading: loading.models.alarmManagement,
}))


export default class itemDetail extends PureComponent {
    constructor(props) {
        super(props);
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
            sfgz: props.location&&props.location.query&&props.location.query.record&&props.location.query.record.sfgz===0?props.location.query.record.sfgz:'',
            IsSure: false, // 确认详情是否加载成功
            isDb: authorityIsTrue(userResourceCodeDb.item), // 督办权限
        };
    }

    componentDidMount() {
      const { location } = this.props;
      // conosle.log('location',location);
      if (location && location.query && location.query.record && location.query.id) {
        this.itemDetailDatas(location.query.id);
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
              query: { record: itemDetails,id: itemDetails && itemDetails.system_id ? itemDetails.system_id : '1',from:from,tzlx:'wpwt',fromPath:'/articlesInvolved/ArticlesData/itemDetail',wtflId:'230204',wtflMc:'涉案财物' },
            }),
          )
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
            message.info('该物品无法进行问题判定');
        }
    };
    // 修改改变模态框状态 通过id 获取数据
    itemDetailDatas = (id) => {
        this.setState({
                IsSure: false,
            }, () => {
                this.props.dispatch({
                    type: 'itemData/getSawpXqById',
                    payload: {
                        system_id: id,
                    },
                    callback: (data) => {
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

    person = (itemDetails) => {
        this.props.dispatch({
            type: 'AllDetail/AllDetailPersonFetch',
            payload: {
                ajbh: itemDetails.ajbh,
                sfzh: itemDetails.syrSfzh,
            },
            callback: (data) => {
                if (data && data.ryxx) {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: '/lawEnforcement/PersonFile/Detail',
                      query: { record: itemDetails,id: itemDetails && itemDetails.syrSfzh ? itemDetails.syrSfzh : '1',fromPath:'/articlesInvolved/ArticlesData/itemDetail'},
                    }),
                  )
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
    openCaseDetail = (itemDetails) => {
        if (itemDetails.ajlx === '22001') { // 刑事案件
          this.props.dispatch(
            routerRedux.push({
              pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
              query: { id: itemDetails && itemDetails.system_id ? itemDetails.system_id : '1', record: itemDetails },
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
        } else if (itemDetails.ajlx === '22002') { // 行政案件
          this.props.dispatch(
            routerRedux.push({
              pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
              query: { id: itemDetails && itemDetails.id ? itemDetails.id : '1', record: itemDetails },
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
    Refresh = (flag) => {
        this.setState({
            superviseVisibleModal: !!flag,
        });
        this.itemDetailDatas(this.props.id);
    };
    // 分享和关注（2为分享，1为关注）
    saveShare = (itemDetails, res, type, ajGzLx) => {
      // console.log('res',res);
        // console.log('aaa',(res.jjdw?res.jjdw+'、':'') + (res.jjly_mc?res.jjly_mc:''));
        this.setState({
            sx: (res.ajmc ? res.ajmc + '、' : '') + (res.wpmc ? res.wpmc + '、' : '') + (res.zt ? res.zt : ''),
        });
        if (type === 2) {
          let detail=(
            <Row style={{ lineHeight:'50px',paddingLeft:66 }}>
              <Col span={6}>物品名称：{itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}</Col>
              <Col span={6}>物品种类：{itemDetails && itemDetails.wpzlName ? itemDetails.wpzlName : ''}</Col>
              <Col span={6}>物品状态：{itemDetails && itemDetails.wpzt ? itemDetails.wpzt : ''}</Col>
              <Col span={6}>库房信息：<Tooltip
                title={itemDetails && itemDetails.szkf && itemDetails.szkf.length > 8 ? itemDetails.szkf : null}>{itemDetails && itemDetails.szkf ? itemDetails.szkf.length > 8 ? itemDetails.szkf.substring(0, 8) + '...' : itemDetails.szkf : ''}</Tooltip></Col>
              <Col span={12}>关联案件名称：<Tooltip
                title={itemDetails && itemDetails.ajmc && itemDetails.ajmc.length > 18 ? itemDetails.ajmc : null}>{itemDetails && itemDetails.ajmc ? itemDetails.ajmc.length > 18 ? itemDetails.ajmc.substring(0, 18) + '...' : itemDetails.ajmc : ''}</Tooltip></Col>
              <Col span={12}>办案单位：<Tooltip
                title={itemDetails && itemDetails.kfgly_dwmc && itemDetails.kfgly_dwmc.length > 18 ? itemDetails.kfgly_dwmc : null}>{itemDetails && itemDetails.kfgly_dwmc ? itemDetails.kfgly_dwmc.length > 18 ? itemDetails.kfgly_dwmc.substring(0, 18) + '...' : itemDetails.kfgly_dwmc : ''}</Tooltip></Col>
            </Row>
          )
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/Share',
              query: { record: res,id: res && res.system_id ? res.system_id : '1',from:'物品信息',tzlx:'wpxx',fromPath:'/articlesInvolved/ArticlesData/itemDetail',detail,tab:'详情',sx: (res.ajmc ? res.ajmc + '、' : '') + (res.wpmc ? res.wpmc + '、' : '') + (res.zt ? res.zt : ''), },
            }),
          )
            // this.setState({
            //     shareVisible: true,
            //     shareItem: res,
            // });
        } else {
            if (this.state.IsSure) {
                this.props.dispatch({
                    type: 'share/getMyFollow',
                    payload: {
                        agid: this.props.yjType === 'yj' ? this.props.yjid : itemDetails.id,
                        lx: this.state.lx,
                        sx: (res.ajmc ? res.ajmc + '、' : '') + (res.wpmc ? res.wpmc + '、' : '') + (res.zt ? res.zt : ''),
                        type: type,
                        tzlx: this.props.yjType === 'yj' ? 'wpyj' : this.state.tzlx,
                        wtid: res.wtid,
                        ajbh: res.ajbh,
                        system_id: itemDetails.system_id,
                        ajGzLx: ajGzLx,
                    },
                    callback: (res) => {
                        if (!res.error) {
                            // alert(1)
                            message.success('关注成功');
                            if (this.props.getItem) {
                                this.props.getItem({ currentPage: this.props.current, pd: this.props.formValues });
                            }
                            this.setState({
                                sfgz: 1,
                            }, () => {
                                this.itemDetailDatas(itemDetails.system_id);
                            });

                        }
                    },
                });
            } else {
                message.info('您的操作太频繁，请稍后再试');
            }
        }
    };
    // 取消关注
    noFollow = (itemDetails) => {
        if (this.state.IsSure) {
            this.props.dispatch({
                type: 'share/getNoFollow',
                payload: {
                    id: itemDetails.gzid,
                    tzlx: itemDetails.tzlx,
                    ajbh: itemDetails.ajbh,
                },
                callback: (res) => {
                    if (!res.error) {
                        message.success('取消关注成功');
                        if (this.props.getItem) {
                            this.props.getItem({ currentPage: this.props.current, pd: this.props.formValues });
                        }
                        this.setState({
                            sfgz: 0,
                        }, () => {
                            this.itemDetailDatas(itemDetails.system_id);
                        });
                    }
                },
            });
        } else {
            message.info('您的操作太频繁，请稍后再试');
        }
    };
    handleCancel = (e) => {
        this.setState({
            shareVisible: false,
        });
    };

    Topdetail() {
        const { itemDetails, sfgz, isDb } = this.state;
        const { query:{record} } = this.props.location;
        let dark = this.props.global&&this.props.global.dark;
        return (
            <div style={{ backgroundColor:  dark ? '#252C3C' : '#fff', margin: '16px 0' }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        {/*<span style={{ margin: '16px', display: 'block' }}>涉案物品详情</span>*/}
                      {isDb && itemDetails && itemDetails.zrdwList && itemDetails.zrdwList.length > 0 ?
                        <Button type="primary" className={styles.TopMenu} onClick={() => this.onceSupervise(itemDetails, true, '涉案物品详情问题判定')}>问题判定</Button>
                        :
                        ''
                      }
                    </Col>
                    <Col>
                       <span style={{ float: 'right', margin: '6px 16px 6px 0' }}>
                            {
                                itemDetails ?
                                    <span>
                                      <span className={liststyles.collect}>
                                        {sfgz === 0 ?
                                          <Tooltip title="关注">
                                            <img src={dark ? nocollect : nocollect1} width={25} height={25} style={{ marginLeft: 12 }} onClick={() => this.saveShare(itemDetails, record, 1, 0)}/>
                                            <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>关注</div>
                                          </Tooltip> :
                                          <Tooltip title="取消关注">
                                            <img src={dark ? collect : collect1} width={25} height={25} style={{ marginLeft: 12 }} onClick={() => this.noFollow(itemDetails)}/>
                                            <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>取消关注</div>
                                          </Tooltip>}
                                      </span>
                                      <span className={liststyles.collect} onClick={() => this.saveShare(itemDetails, record, 2)}>
                                        <Tooltip title="分享"><img src={dark ? share : share1} style={{ marginLeft: 12 }} width={25} height={25}/></Tooltip>
                                        <div style={{ fontSize: 12, textAlign: 'center', width: 48 }}>分享</div>
                                      </span>
                                    </span>
                                    :
                                    ''
                            }
                        </span>
                    </Col>
                </Row>
            </div>
        );
    }

    renderDetail() {
        const { itemDetails,isDb } = this.state;
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        let dark = this.props.global&&this.props.global.dark;
        return (
            <div style={{ background:  dark ? '#202839' : '#fff', /*height: autoheight() - 180 + 'px'*/ }} className={styles.detailBoxScroll}>
              {itemDetails && itemDetails.system_id && itemDetails.ajlx ?
                <div style={{ textAlign: 'center' }}>
                  <Button type='primary' onClick={() => this.openCaseDetail(itemDetails)}>查看关联案件</Button>
                </div>
                :
                ''
              }
                <Card title="| 物品信息" className={styles.wpxxcard} bordered={false}>
                    <Row gutter={rowLayout} style={{ marginLeft: 0, marginRight: 0 }}>
                        <Col md={6} sm={24}>
                            <div>
                                {itemDetails && itemDetails.imageList && itemDetails.imageList.length > 0 ?
                                    <Carousel autoplay>
                                        {itemDetails.imageList.map(pane =>
                                            <div>
                                                <img width='200'
                                                     src={pane.imageurl ? pane.imageurl : dark ? nophoto : nophotoLight}/>
                                            </div>,
                                        )
                                        }
                                    </Carousel>
                                    :
                                    <img width='200' src={dark ? nophoto : nophotoLight} />
                                }
                            </div>
                        </Col>
                        <Col md={18} sm={24}>
                            <div>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>物品名称：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>物品种类：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.wpzlName ? itemDetails.wpzlName : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>重量：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: 42 }}>{itemDetails && itemDetails.wpzl ? itemDetails.wpzl : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>物品编码：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.wpbh ? itemDetails.wpbh : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>型号：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: '42px' }}>{itemDetails && itemDetails.wpxh ? itemDetails.wpxh : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>规格：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: '42px' }}>{itemDetails && itemDetails.wpgg ? itemDetails.wpgg : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>物品所有人：</div>
                                        <div className={styles.Indextail} style={{ paddingLeft: '84px' }}>
                                            <a onClick={() => this.person(itemDetails)} style={{ textDecoration: 'underline' }}>{itemDetails.syrName}</a>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>缺损特征：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: '42px' }}>{itemDetails && itemDetails.tzlx ? itemDetails.tzlx : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>数量：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: '42px' }}>{itemDetails && itemDetails.wpsl ? itemDetails.wpsl : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                      <div className={styles.Indexfrom}>物品来源：</div>
                                      <div className={styles.Indextail} style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.wply ? itemDetails.wply : ''}</div>
                                    </Col>
                                    {/*<Col md={8} sm={24}>*/}
                                        {/*<div className={styles.Indexfrom}>扣押原因：</div>*/}
                                        {/*<div className={styles.Indextail}*/}
                                             {/*style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.kyyy ? itemDetails.kyyy : ''}</div>*/}
                                    {/*</Col>*/}
                                    {/*<Col md={8} sm={24}>*/}
                                        {/*<div className={styles.Indexfrom}>扣押时间：</div>*/}
                                        {/*<div className={styles.Indextail}*/}
                                             {/*style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.kysj ? itemDetails.kysj : ''}</div>*/}
                                    {/*</Col>*/}
                                    <Col md={8} sm={24}>

                                        <div className={styles.Indexfrom}>保存期限：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.bcqx ? itemDetails.bcqx : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                      <div className={styles.Indexfrom}>库房管理员：</div>
                                      <div className={styles.Indextail}
                                           style={{ paddingLeft: '84px' }}>{itemDetails && itemDetails.kfgly ? itemDetails.kfgly : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    {/*<Col md={8} sm={24}>*/}
                                        {/*<div className={styles.Indexfrom}>扣押批准人：</div>*/}
                                        {/*<div className={styles.Indextail}*/}
                                             {/*style={{ paddingLeft: '84px' }}>{itemDetails && itemDetails.kypzr ? itemDetails.kypzr : ''}</div>*/}
                                    {/*</Col>*/}

                                    <Col md={8} sm={24}>
                                        <div className={styles.Indexfrom}>保存方式：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.bcfsName ? itemDetails.bcfsName : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                      <div className={styles.Indexfrom}>物品状态：</div>
                                      <div className={styles.Indextail}
                                           style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.wpzt ? itemDetails.wpzt : ''}</div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                      <div className={styles.Indexfrom}>所在库位：</div>
                                      <div className={styles.Indextail}
                                           style={{ paddingLeft: 70 }}>{itemDetails && itemDetails.szkw ? itemDetails.szkw : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={24} sm={24}>
                                        <div className={styles.Indexfrom}>所在库房名称：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: '98px' }}>{itemDetails && itemDetails.szkf ? itemDetails.szkf : ''}</div>
                                    </Col>
                                </Row>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={24} sm={24}>
                                        <div className={styles.Indexfrom}>备注：</div>
                                        <div className={styles.Indextail}
                                             style={{ paddingLeft: '42px' }}>{itemDetails && itemDetails.bz ? itemDetails.bz : ''}</div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Card>
                {itemDetails && itemDetails.wpgjList && itemDetails.wpgjList.length > 0 ?
                  (window.configUrl.is_area === '5' ?
                      <div>
                        <Card title="| 物品轨迹" className={liststyles.card} bordered={false}>
                          {itemDetails.wpgjList.map(wpgj =>
                            <Row gutter={8} style={{ marginBottom: '24px' }}>
                              <Col md={4} sm={24} style={{ paddingLeft: 36 }}>
                                <div className={styles.break}>物品状态：{wpgj.wpzt}</div>
                              </Col>
                              <Col md={5} sm={24}>
                                <div className={styles.break}>操作时间：{wpgj.czsj}</div>
                              </Col>
                              <Col md={4} sm={24}>
                                <div className={styles.break}>操作人：{wpgj.czr}</div>
                              </Col>
                              <Col md={4} sm={24}>
                                <div className={styles.break}>操作原因：{wpgj.czyy}</div>
                              </Col>
                              <Col md={4} sm={24}>
                                <div className={styles.break}>归还期限：{wpgj.ghqx}</div>
                              </Col>
                            </Row>,
                          )}
                        </Card>
                      </div>
                      :
                      <div>
                        <Card title="| 物品轨迹" className={liststyles.card} bordered={false}>
                          {itemDetails.wpgjList.map(wpgj =>
                            <Row gutter={8} style={{ marginBottom: '24px' }}>
                              <Col md={4} sm={24} style={{ paddingLeft: 36 }}>
                                <div className={styles.break}>{wpgj.wpzt}</div>
                              </Col>
                              <Col md={5} sm={24}>
                                <div className={styles.break}>{wpgj.czsj}</div>
                              </Col>
                              <Col md={4} sm={24}>
                                <div className={styles.break}>{wpgj.czr}</div>
                              </Col>
                              <Col md={4} sm={24}>
                                <div className={styles.break}>{wpgj.czyy}</div>
                              </Col>
                              <Col md={4} sm={24}>
                                <div className={styles.break}>{wpgj.ghqx}</div>
                              </Col>
                            </Row>,
                          )}
                        </Card>
                      </div>)
                    :
                    ''
                }
            </div>
        );
    }

    render() {
        let dark = this.props.global&&this.props.global.dark;
        const { superviseVisibleModal, itemDetails } = this.state;
        let detail = (
            <Row style={{ width: '90%', margin: '0 38px 10px', lineHeight: '36px', color: 'rgba(0, 0, 0, 0.85)' }}>
                <Col span={6}>物品名称：{itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}</Col>
                <Col span={6}>物品种类：{itemDetails && itemDetails.wpzlName ? itemDetails.wpzlName : ''}</Col>
                <Col span={6}>物品状态：{itemDetails && itemDetails.wpzt ? itemDetails.wpzt : ''}</Col>
                <Col span={6}>库房信息：<Tooltip
                    title={itemDetails && itemDetails.szkf && itemDetails.szkf.length > 8 ? itemDetails.szkf : null}>{itemDetails && itemDetails.szkf ? itemDetails.szkf.length > 8 ? itemDetails.szkf.substring(0, 8) + '...' : itemDetails.szkf : ''}</Tooltip></Col>
                <Col span={12}>关联案件名称：<Tooltip
                    title={itemDetails && itemDetails.ajmc && itemDetails.ajmc.length > 18 ? itemDetails.ajmc : null}>{itemDetails && itemDetails.ajmc ? itemDetails.ajmc.length > 18 ? itemDetails.ajmc.substring(0, 18) + '...' : itemDetails.ajmc : ''}</Tooltip></Col>
                <Col span={12}>办案单位：<Tooltip
                    title={itemDetails && itemDetails.kfgly_dwmc && itemDetails.kfgly_dwmc.length > 18 ? itemDetails.kfgly_dwmc : null}>{itemDetails && itemDetails.kfgly_dwmc ? itemDetails.kfgly_dwmc.length > 18 ? itemDetails.kfgly_dwmc.substring(0, 18) + '...' : itemDetails.kfgly_dwmc : ''}</Tooltip></Col>
            </Row>
        );
        return (
            <div className={dark?'':styles.lightBox}>
                <div>
                    {this.Topdetail()}
                </div>
                <div>
                    {this.renderDetail()}
                </div>

                {/*{superviseVisibleModal ?*/}
                    {/*<SuperviseModal*/}
                        {/*{...this.props}*/}
                        {/*visible={superviseVisibleModal}*/}
                        {/*closeModal={this.closeModal}*/}
                        {/*// saveModal={this.saveModal}*/}
                        {/*caseDetails={this.state.itemDetails}*/}
                        {/*getRefresh={this.Refresh}*/}
                        {/*wtflId='203204'*/}
                        {/*wtflMc='涉案财物'*/}
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
            </div>
        );
    }

}
