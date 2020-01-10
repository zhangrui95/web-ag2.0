/*
 * 首页综合统计
 * author：zr
 * 20190304
 * */
import React, { PureComponent } from 'react';
import { Card, Table, Radio, Tooltip, message, Tabs, Empty, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../pages/ShowData/Show.less';
import stylescommon from '../../pages/common/common.less';
import { span, routerRedux } from 'dva/router';
import { getUserInfos } from '../../utils/utils';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { userAuthorityCode } from '../../utils/utils';
import { authorityIsTrue } from '../../utils/authority';
import noList from '@/assets/viewData/noList.png';
import iconFont from '../../utils/iconfont';
import noListLight from '@/assets/viewData/noListLight.png';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});
const back = require('../../assets/common/back.png');
const zhtjImage = require('../../assets/common/tj.png');
const mainlineMenu = window.configUrl.mainlineMenu;
const { TabPane } = Tabs;
let levelNum = 0;
@connect(({ home, global }) => ({
  home,
  global,
}))
export default class Statistics extends PureComponent {
  state = {
    data: [],
    newData: null,
    firstList: true,
    loading: false,
    kssj: moment()
      .day(-5)
      .format('YYYY-MM-DD'),
    jssj: moment().format('YYYY-MM-DD'),
    code: '',
    rqType: '3',
    current: 1,
    showCount: 10,
    tabs: authorityIsTrue(userAuthorityCode.RIQING) ? 'tab1' : 'tab2', // 日清权限
  };

  componentDidMount() {
    levelNum = 0;
    if (window.configUrl.clearHome) {
      this.getZhTjSlByDwOfSecond(getUserInfos().department, '3');
    } else {
      if (authorityIsTrue(userAuthorityCode.RIQING)) {
        this.canPolice(getUserInfos().department);
      } else {
        this.getNextLevelDeps(getUserInfos().department, '3');
      }
    }
  }

  getZhTjSlByDwOfSecond = (code, rqType, current) => {
    // 获取下一级
    this.setState({
      loading: true,
    });
    let data_ks = '';
    let data_js = '';
    if (rqType === '3') {
      data_ks = moment(new Date())
        .add(-1, 'days')
        .format('YYYY-MM-DD 08:00:00');
      data_js = moment(new Date()).format('YYYY-MM-DD 08:00:00');
    } else if (rqType === '6') {
      data_ks = moment()
        .subtract('days', 31)
        .format('YYYY-MM-DD 00:00:00');
      data_js = moment()
        .subtract('days', 1)
        .format('YYYY-MM-DD 23:59:59');
    } else if (rqType === '9') {
      data_ks = moment()
        .subtract('days', 90)
        .format('YYYY-MM-DD 00:00:00');
      data_js = moment()
        .subtract('days', 1)
        .format('YYYY-MM-DD 23:59:59');
    }
    this.props.dispatch({
      type: 'Home/getZhTjSlByDwOfSecond',
      payload: {
        showCount: this.state.showCount,
        pd: {
          currentPage: current ? current : this.state.current,
          dw_code: code,
          kssj: data_ks > '2019-06-01 00:00:00' ? data_ks : '2019-06-01 00:00:00',
          jssj: data_js,
          firstSearch: levelNum === 0 ? '1' : '0',
          is_zsj: levelNum === 0 ? window.configUrl.is_zsj : '0',
        },
      },
      callback: res => {
        if (res.error === null) {
          if (res.data && res.data.list.length > 0) {
            let data = this.state.data;
            if (
              getUserInfos().department === data[data.length - 1] ||
              data[data.length - 1] !== code
            ) {
              data.push(code);
            }
            this.setState({
              data: data,
              newData: res.data,
              loading: false,
              firstList: levelNum === 0 ? true : false,
              kssj: res.data.page.pd.kssj,
              jssj: res.data.page.pd.jssj,
              code: code,
            });
          } else {
            this.setState({
              loading: false,
            });
            levelNum--;
          }
        } else {
          message.error(res.error);
          levelNum--;
        }
      },
    });
  };
  canPolice = (code, current) => {
    // 获取下一级疑似警情
    this.setState({
      loading: true,
    });
    let data_ks = moment(new Date())
      .add(-1, 'days')
      .format('YYYY-MM-DD 08:00:00');
    let data_js = moment(new Date()).format('YYYY-MM-DD 08:00:00');
    this.props.dispatch({
      type: 'Home/ysjqNum',
      payload: {
        showCount: this.state.showCount,
        pd: {
          currentPage: current ? current : this.state.current,
          dw_code: code,
          jjsj_ks: data_ks,
          jjsj_js: data_js,
          is_zsj: levelNum === 0 ? window.configUrl.is_zsj : '0',
        },
      },
      callback: res => {
        if (res.error === null) {
          if (res.data && res.data.list.length > 0) {
            let data = this.state.data;
            if (
              getUserInfos().department === data[data.length - 1] ||
              data[data.length - 1] !== code
            ) {
              data.push(code);
            }
            this.setState({
              data: data,
              newData: res.data,
              loading: false,
              firstList: levelNum === 0 ? true : false,
              kssj: res.data.page.pd.kssj,
              jssj: res.data.page.pd.jssj,
              code: code,
            });
          } else {
            this.setState({
              loading: false,
            });
            levelNum--;
          }
        } else {
          message.error(res.error);
          levelNum--;
        }
      },
    });
  };
  getNext = (code, rqType) => {
    //点击获取下一级
    levelNum++;
    this.getNextLevelDeps(code, rqType);
  };
  getNextSecond = (code, rqType) => {
    //点击获取下一级
    levelNum++;
    this.getZhTjSlByDwOfSecond(code, rqType);
  };
  getNextPolice = (code, rqType) => {
    //点击获取下一级警情机构
    levelNum++;
    this.canPolice(code, rqType);
  };
  getNextLevelDeps = (code, rqType, current) => {
    //统计列表查询
    this.setState({
      loading: true,
    });
    this.props.dispatch({
      type: 'Home/zhtjNum',
      payload: {
        showCount: this.state.showCount,
        pd: {
          currentPage: current ? current : this.state.current,
          dw_code: code,
          rqType: rqType,
          firstSearch: levelNum === 0 ? '1' : '0',
          is_zsj: levelNum === 0 ? window.configUrl.is_zsj : '0',
        },
      },
      callback: res => {
        if (res.error === null) {
          if (res.data && res.data.list.length > 0) {
            let data = this.state.data;
            if (
              getUserInfos().department === data[data.length - 1] ||
              data[data.length - 1] !== code
            ) {
              data.push(code);
            }
            // console.log('code',code);
            this.setState({
              data: data,
              newData: res.data,
              loading: false,
              firstList: levelNum === 0 ? true : false,
              kssj: res.data.page.pd.kssj,
              jssj: res.data.page.pd.jssj,
              code: code,
            });
          } else {
            this.setState({
              loading: false,
            });
            levelNum--;
            // message.warn('暂无下级机构');
          }
        } else {
          levelNum--;
          message.error(res.error);
        }
      },
    });
  };
  getPop = type => {
    //返回上一级
    levelNum--;
    let data = this.state.data;
    data.pop();
    let code = data[data.length - 1];
    if (type === '0') {
      this.canPolice(code);
    } else if (type === '1') {
      this.getNextLevelDeps(code, this.state.rqType);
    } else if (type === '2') {
      this.getZhTjSlByDwOfSecond(code, this.state.rqType);
    }
  };
  getRadioChange = e => {
    this.setState({
      rqType: e.target.value,
    });
    if (window.configUrl.clearHome) {
      this.getZhTjSlByDwOfSecond(this.state.code, e.target.value);
    } else {
      this.getNextLevelDeps(this.state.code, e.target.value);
    }
  };
  getNoList = () => {
    message.warn('暂无相关数据');
  };
  handleTableChange = pagination => {
    if (window.configUrl.clearHome) {
      this.getZhTjSlByDwOfSecond(this.state.code, this.state.rqType, pagination.current);
    } else {
      if (this.state.tabs === 'tab1') {
        this.canPolice(this.state.code, pagination.current);
      } else {
        this.getNextLevelDeps(this.state.code, this.state.rqType, pagination.current);
      }
    }
  };
  changeTabs = e => {
    this.setState({
      tabs: e,
      rqType: '3',
      firstList: true,
    });
    levelNum = 0;
    if (e === 'tab1') {
      this.canPolice(getUserInfos().department);
    } else {
      this.getNextLevelDeps(getUserInfos().department, '3');
    }
  };
  getLink = (pathname, res) => {
    let state = {
      code: res.dw_code,
      kssj: this.state.kssj,
      jssj: this.state.jssj,
      dw_name: res.dw_name,
      dbzt: '',
    };
    this.props.dispatch(
      routerRedux.push({
        pathname: pathname,
        state: state,
      }),
    );
    this.props.dispatch({
      type: 'global/changeResetList',
      payload: {
        isReset: !this.props.global.isResetList.isReset,
        url: pathname,
        state: { location: { state: state } },
      },
    });
  };
  render() {
    let tjColumns = [
      {
        title: '单位名称',
        dataIndex: 'dw_name',
        align: 'left',
        key: 'dw_name',
        render: (text, res) => (
          <div
            className={styles.dwmcName}
            style={{ width: mainlineMenu ? '126px' : 'auto' }}
            onClick={() => this.getNext(res.dw_code, this.state.rqType)}
          >
            <Ellipsis tooltip length={mainlineMenu ? 18 : 20}>
              {text}
            </Ellipsis>
          </div>
        ),
      },
      {
        title: '刑事案件',
        render: (text, res) => (
          <div>
            {!res.xsajwt_num || (res.xsajwt_num && res.xsajwt_num === 0) ? (
              <span className={styles.redNum} onClick={this.getNoList}>
                0
              </span>
            ) : (
              <span
                className={styles.redNum}
                onClick={() => this.getLink('/newcaseFiling/casePolice/CriminalPolice', res)}
              >
                {res.xsajwt_num}
              </span>
            )}
            {!res.xsaj_num || (res.xsaj_num && res.xsaj_num === 0) ? (
              <span onClick={this.getNoList} className={styles.redAllNum}>
                /0
              </span>
            ) : (
              <span
                className={styles.redAllNum}
                onClick={() => this.getLink('/newcaseFiling/caseData/CriminalData', res)}
              >
                /{res.xsaj_num}
              </span>
            )}
          </div>
        ),
      },
      {
        title: '行政案件',
        render: (text, res) => (
          <div>
            {!res.xzajwt_num || (res.xzajwt_num && res.xzajwt_num === 0) ? (
              <span onClick={this.getNoList} className={styles.redNum}>
                0
              </span>
            ) : (
              <span
                className={styles.redNum}
                onClick={() => this.getLink('/newcaseFiling/casePolice/AdministrationPolice', res)}
              >
                {res.xzajwt_num}
              </span>
            )}
            {!res.xzaj_num || (res.xzaj_num && res.xzaj_num === 0) ? (
              <span onClick={this.getNoList} className={styles.redAllNum}>
                /0
              </span>
            ) : (
              <span
                className={styles.redAllNum}
                onClick={() => this.getLink('/newcaseFiling/caseData/AdministrationData', res)}
              >
                /{res.xzaj_num}
              </span>
            )}
          </div>
        ),
      },
      {
        title: '人员',
        render: (text, res) => (
          <div>
            {!res.rywt_num || (res.rywt_num && res.rywt_num === 0) ? (
              <span onClick={this.getNoList} className={styles.redNum}>
                0
              </span>
            ) : (
              <span
                className={styles.redNum}
                onClick={() => this.getLink('/lawEnforcement/PersonFile', res)}
              >
                {res.rywt_num}
              </span>
            )}
            {!res.ry_num || (res.ry_num && res.ry_num === 0) ? (
              <span onClick={this.getNoList} className={styles.redAllNum}>
                /0
              </span>
            ) : (
              <span
                className={styles.redAllNum}
                onClick={() => this.getLink('/lawEnforcement/PersonFile', res)}
              >
                /{res.ry_num}
              </span>
            )}
          </div>
        ),
      },
    ];
    if (mainlineMenu) {
      tjColumns.push(
        {
          title: '办案区',
          render: (text, res) => (
            <div>
              {!res.baqwt_num || (res.baqwt_num && res.baqwt_num === 0) ? (
                <span onClick={this.getNoList} className={styles.redNum}>
                  0
                </span>
              ) : (
                <span
                  className={styles.redNum}
                  onClick={() => this.getLink('/handlingArea/AreaPolice', res)}
                >
                  {res.baqwt_num}
                </span>
              )}
              {!res.baq_num || (res.baq_num && res.baq_num === 0) ? (
                <span onClick={this.getNoList} className={styles.redAllNum}>
                  /0
                </span>
              ) : (
                <span
                  className={styles.redAllNum}
                  onClick={() => this.getLink('/handlingArea/AreaData', res)}
                >
                  /{res.baq_num}
                </span>
              )}
            </div>
          ),
        },
        {
          title: '物品',
          render: (text, res) => (
            <div>
              {!res.wpwt_num || (res.wpwt_num && res.wpwt_num === 0) ? (
                <span className={styles.redNum} onClick={this.getNoList}>
                  0
                </span>
              ) : (
                <span
                  className={styles.redNum}
                  onClick={() => this.getLink('/articlesInvolved/ArticlesPolice', res)}
                >
                  {res.wpwt_num}
                </span>
              )}
              {!res.wp_num || (res.wp_num && res.wp_num === 0) ? (
                <span className={styles.redAllNum} onClick={this.getNoList}>
                  /0
                </span>
              ) : (
                <span
                  className={styles.redAllNum}
                  onClick={() => this.getLink('/articlesInvolved/ArticlesData', res)}
                >
                  /{res.wp_num}
                </span>
              )}
            </div>
          ),
        },
        {
          title: '卷宗',
          render: (text, res) => (
            <div>
              {!res.jzwt_num || (res.jzwt_num && res.jzwt_num === 0) ? (
                <span className={styles.redNum} onClick={this.getNoList}>
                  0
                </span>
              ) : (
                <span
                  className={styles.redNum}
                  onClick={() => this.getLink('/dossierPolice/DossierPolice', res)}
                >
                  {res.jzwt_num}
                </span>
              )}
              {!res.jz_num || (res.jz_num && res.jz_num === 0) ? (
                <span className={styles.redAllNum} onClick={this.getNoList}>
                  /0
                </span>
              ) : (
                <span
                  className={styles.redAllNum}
                  onClick={() => this.getLink('/dossierPolice/DossierData', res)}
                >
                  /{res.jz_num}
                </span>
              )}
            </div>
          ),
        },
      );
    }
    const paginationPage = {
      showQuickJumper: false,
      current:
        this.state.newData && this.state.newData.page ? this.state.newData.page.currentPage : '',
      total:
        this.state.newData && this.state.newData.page ? this.state.newData.page.totalResult : '',
      pageSize:
        this.state.newData && this.state.newData.page ? this.state.newData.page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.pagination}>{`共 ${
          this.state.newData && this.state.newData.page ? this.state.newData.page.totalPage : 1
        } 页， ${
          this.state.newData && this.state.newData.page ? this.state.newData.page.totalResult : 0
        }条记录`}</span>
      ),
    };
    let colums = [
      {
        title: '单位名称',
        dataIndex: 'dw_name',
        key: 'dw_name',
        align: 'left',
        render: (text, res) => (
          <div className={styles.dwmcName} onClick={() => this.getNextPolice(res.dw_code)}>
            <Ellipsis tooltip length={20}>
              {text}
            </Ellipsis>
          </div>
        ),
      },
      {
        title: '疑似警情',
        dataIndex: 'ysajjqsl',
        render: (text, res) => (
          <div>
            {!text || (text && text === 0) ? (
              <span className={styles.redAllNum} onClick={this.getNoList}>
                0
              </span>
            ) : (
              <Link
                className={styles.redAllNum}
                to={{ pathname: '/ClearDispatching/DayPoliceClear', state: { res: res } }}
              >
                {text}
              </Link>
            )}
          </div>
        ),
      },
    ];
    let tjColumns2 = [
      {
        title: '单位名称',
        dataIndex: 'dw_name',
        key: 'dw_name',
        align: 'left',
        width: 400,
        render: (text, res) => (
          <div
            className={styles.dwmcName}
            onClick={() => this.getNextSecond(res.dw_code, this.state.rqType)}
          >
            <Ellipsis tooltip length={30}>
              {text}
            </Ellipsis>
          </div>
        ),
      },
      {
        title: '警情总数',
        dataIndex: 'jq_num',
        render: (text, res) => (
          <div>
            {!text || (text && text === 0) ? (
              <span className={styles.redAllNum} onClick={this.getNoList}>
                0
              </span>
            ) : (
              <Link
                className={styles.redAllNum}
                to={{
                  pathname: '/Reception/police/Transfer/Index',
                  state: { res: res, rqType: this.state.rqType },
                }}
              >
                {text}
              </Link>
            )}
          </div>
        ),
      },
      {
        title: '疑似警情',
        dataIndex: 'ysajjq_num',
        render: (text, res) => (
          <div>
            {!text || (text && text === 0) ? (
              <span className={styles.redAllNum} onClick={this.getNoList}>
                0
              </span>
            ) : (
              <Link
                className={styles.redAllNum}
                to={{
                  pathname:
                    this.state.rqType === '3'
                      ? '/ClearDispatching/DayPoliceClear'
                      : this.state.rqType === '6'
                      ? '/ClearDispatching/MonthClear/MonthPoliceClear'
                      : '/ClearDispatching/QuarterClear/QuarterPoliceClear',
                  state: { res: res, jqzt: '4' },
                }}
              >
                {text}
              </Link>
            )}
          </div>
        ),
      },
      {
        title: '已清零',
        dataIndex: 'yql_num',
        render: (text, res) => (
          <div>
            {!text || (text && text === 0) ? (
              <span className={styles.redAllNum} onClick={this.getNoList}>
                0
              </span>
            ) : (
              <Link
                className={styles.redAllNum}
                to={{
                  pathname:
                    this.state.rqType === '3'
                      ? '/ClearDispatching/DayPoliceClear'
                      : this.state.rqType === '6'
                      ? '/ClearDispatching/MonthClear/MonthPoliceClear'
                      : '/ClearDispatching/QuarterClear/QuarterPoliceClear',
                  state: { res: res, jqzt: '2' },
                }}
              >
                {text}
              </Link>
            )}
          </div>
        ),
      },
      {
        title: '未清零',
        dataIndex: 'wql_num',
        render: (text, res) => (
          <div>
            {!text || (text && text === 0) ? (
              <span className={styles.redAllNum} onClick={this.getNoList}>
                0
              </span>
            ) : (
              <Link
                className={styles.redAllNum}
                to={{
                  pathname:
                    this.state.rqType === '3'
                      ? '/ClearDispatching/DayPoliceClear'
                      : this.state.rqType === '6'
                      ? '/ClearDispatching/MonthClear/MonthPoliceClear'
                      : '/ClearDispatching/QuarterClear/QuarterPoliceClear',
                  state: { res: res, jqzt: '3' },
                }}
              >
                {text}
              </Link>
            )}
          </div>
        ),
      },
    ];
    let m_data_ks = moment()
      .subtract('days', 31)
      .format('YYYY-MM-DD');
    let m_data_js = moment()
      .subtract('days', 1)
      .format('YYYY-MM-DD');
    let p_data_ks = moment()
      .subtract('days', 90)
      .format('YYYY-MM-DD');
    let P_data_js = moment()
      .subtract('days', 1)
      .format('YYYY-MM-DD');
    return (
      <div className={styles.tableBox}>
        <div className={styles.tabsBox}>
          {/*{window.configUrl.clearHome ? (*/}
          {/*    <Card*/}
          {/*        className={styles.tableBox}*/}
          {/*        title={*/}
          {/*            <div className={styles.iconPerson}>*/}
          {/*                <IconFont type={'icon-biaoge'} className={styles.iconLefts}/>*/}
          {/*                <span>综合统计</span>*/}
          {/*                <Tooltip placement="top" title="返回">*/}
          {/*                    <img*/}
          {/*                        src={back}*/}
          {/*                        className={styles.rollBack}*/}
          {/*                        onClick={() => this.getPop('2')}*/}
          {/*                        style={{display: this.state.firstList ? 'none' : 'block'}}*/}
          {/*                    />*/}
          {/*                </Tooltip>*/}
          {/*                <Radio.Group*/}
          {/*                    defaultValue="3"*/}
          {/*                    buttonStyle="solid"*/}
          {/*                    className={styles.redioGroup}*/}
          {/*                    style={{right: this.state.firstList ? '20px' : '45px'}}*/}
          {/*                    onChange={this.getRadioChange}*/}
          {/*                    disabled={this.state.loading ? true : false}*/}
          {/*                >*/}
          {/*                    <Radio.Button value="3">*/}
          {/*                        <Tooltip placement="top" title="昨日">*/}
          {/*                            日*/}
          {/*                        </Tooltip>*/}
          {/*                    </Radio.Button>*/}
          {/*                    <Radio.Button value="6">*/}
          {/*                        <Tooltip placement="top" title={m_data_ks + '~' + m_data_js}>*/}
          {/*                            月*/}
          {/*                        </Tooltip>*/}
          {/*                    </Radio.Button>*/}
          {/*                    <Radio.Button value="9">*/}
          {/*                        <Tooltip*/}
          {/*                            placement="top"*/}
          {/*                            title={*/}
          {/*                                (p_data_ks > '2019-06-01' ? p_data_ks : '2019-06-01') + '~' + P_data_js*/}
          {/*                            }*/}
          {/*                        >*/}
          {/*                            季*/}
          {/*                        </Tooltip>*/}
          {/*                    </Radio.Button>*/}
          {/*                </Radio.Group>*/}
          {/*            </div>*/}
          {/*        }*/}
          {/*    >*/}
          {/*        <Table*/}
          {/*            loading={this.state.loading}*/}
          {/*            size="middle"*/}
          {/*            columns={tjColumns2}*/}
          {/*            dataSource={*/}
          {/*                this.state.newData && this.state.newData.list ? this.state.newData.list : []*/}
          {/*            }*/}
          {/*            className={styles.homeTable}*/}
          {/*            pagination={paginationPage}*/}
          {/*            onChange={this.handleTableChange}*/}
          {/*            locale={{*/}
          {/*                emptyText: <Empty*/}
          {/*                    image={this.props.global && this.props.global.dark ? noList : noListLight}*/}
          {/*                    description={'暂无数据'}/>*/}
          {/*            }}*/}
          {/*        />*/}
          {/*    </Card>*/}
          {/*) : (*/}
          <Tabs defaultActiveKey="tab1" type="card" onChange={this.changeTabs}>
            {/*{authorityIsTrue(userAuthorityCode.RIQING) ? (*/}
            {/*    <TabPane*/}
            {/*        tab={*/}
            {/*            <div className={styles.iconPerson}>*/}
            {/*                <IconFont type={'icon-biaoge'} className={styles.iconLefts}/>*/}
            {/*                <span>疑似警情</span>*/}
            {/*            </div>*/}
            {/*        }*/}
            {/*        key="tab1"*/}
            {/*    >*/}
            {/*        <div>*/}
            {/*            <Tooltip placement="top" title="返回">*/}
            {/*                <img*/}
            {/*                    src={back}*/}
            {/*                    className={styles.rollBack}*/}
            {/*                    onClick={() => this.getPop('0')}*/}
            {/*                    style={{display: this.state.firstList ? 'none' : 'block'}}*/}
            {/*                />*/}
            {/*            </Tooltip>*/}
            {/*        </div>*/}
            {/*        <Card title={null}>*/}
            {/*            <Table*/}
            {/*                loading={this.state.loading}*/}
            {/*                size="middle"*/}
            {/*                columns={colums}*/}
            {/*                dataSource={*/}
            {/*                    this.state.newData && this.state.newData.list ? this.state.newData.list : []*/}
            {/*                }*/}
            {/*                className={styles.homeTable}*/}
            {/*                pagination={paginationPage}*/}
            {/*                onChange={this.handleTableChange}*/}
            {/*                locale={{*/}
            {/*                    emptyText: <Empty*/}
            {/*                        image={this.props.global && this.props.global.dark ? noList : noListLight}*/}
            {/*                        description={'暂无数据'}/>*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </Card>*/}
            {/*    </TabPane>*/}
            {/*) : null}*/}
            <TabPane
              tab={
                <div className={styles.iconPerson}>
                  <IconFont type={'icon-biaoge'} className={styles.iconLefts} />
                  <span>综合统计</span>
                </div>
              }
              key="tab2"
            >
              <div>
                <Tooltip placement="top" title="返回">
                  <img
                    src={back}
                    className={styles.rollBack}
                    onClick={() => this.getPop('1')}
                    style={{ display: this.state.firstList ? 'none' : 'block' }}
                  />
                </Tooltip>
                <Radio.Group
                  value={this.state.rqType}
                  defaultValue="3"
                  buttonStyle="solid"
                  className={styles.redioGroup}
                  style={{ right: this.state.firstList ? '20px' : '45px' }}
                  onChange={this.getRadioChange}
                  disabled={this.state.loading ? true : false}
                >
                  <Radio.Button value="3">
                    <Tooltip placement="top" title="本周">
                      周
                    </Tooltip>
                  </Radio.Button>
                  <Radio.Button value="6">
                    <Tooltip placement="top" title="本月">
                      月
                    </Tooltip>
                  </Radio.Button>
                  <Radio.Button value="9">
                    <Tooltip placement="top" title="本年">
                      年
                    </Tooltip>
                  </Radio.Button>
                </Radio.Group>
              </div>
              <Card title={null} className={styles.BottomLeftStyle}>
                <Table
                  loading={this.state.loading}
                  // size="middle"
                  columns={tjColumns}
                  dataSource={
                    this.state.newData && this.state.newData.list ? this.state.newData.list : []
                  }
                  className={styles.homeTable}
                  pagination={paginationPage}
                  onChange={this.handleTableChange}
                  locale={{
                    emptyText: (
                      <Empty
                        image={this.props.global && this.props.global.dark ? noList : noListLight}
                        description={'暂无数据'}
                      />
                    ),
                  }}
                />
              </Card>
            </TabPane>
          </Tabs>
          {/*)}*/}
        </div>
      </div>
    );
  }
}
