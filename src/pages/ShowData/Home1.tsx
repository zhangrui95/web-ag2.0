/*
 * RegulatePanel.js 监管面板页面（非鹤壁）
 * author：lyp
 * 20180623
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    DatePicker,
    Card,
    Table,
    Tag,
    Tooltip,
    Divider,
    message,
    Tabs,
    Form,
    Select,
    Dropdown,
    Menu,
    TreeSelect, Empty, Icon,
} from 'antd';
import styles from './Show.less';
import stylescommon from '../common/common.less';
import { getUserInfos } from '../../utils/utils';
import { routerRedux } from 'dva/router';
import Statistics from '../../components/HomePage/Statistics';
import MyShare from '../../components/HomePage/MyShare';
import MyNews from '../../components/HomePage/MyNews';
import TabsTable from '../../components/HomePage/TabsTable';
import TabsFollowTable from '../../components/HomePage/TabsFollowTable';
import header from '../../assets/common/header.png';
import noList from "@/assets/viewData/noList.png";
import iconFont from '../../utils/iconfont'
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconFont
})
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
@connect(({ home, share, common,global }) => ({
  home,
  share,
  common,
  global
}))
@Form.create()
export default class Home1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newsTime: moment().format('YYYY[年]MMMDo'),
      newsTime1: moment().format('HH:mm:ss'),
      tableTilte: '我的消息',
      xz_num: 0,
      xs_num: 0,
      yj_num: 0,
      gj_num: 0,
      idx: 0,
      pageTotal: 0,
      // visible: false,
      myLog: [],
      pageSize: 10,
      pageSizeShare: 6,
      pageSizeFollow: 8,
      datail: {
        time: '',
        name: '',
        type: '',
        content: '',
        zrrName: '',
        zrrDwmc: '',
        wtlxMc: '',
      },
      shareDetail: null,
      // visibleShare: false,
      loading: false,
      pageNew: 1,
      columns: [],
      data: [],
      yjjb: '',
      personList: [],
      treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
      headerList: [
        {
          icon:'icon-fasong',
          name: '我的消息',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#0084EA, #009BF6)' },
        },
        {
          icon:'icon-jishi',
          name: '我的督办',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#03CBE6, #01BDFB)' },
        },
        {
          icon:'icon-fenxiang',
          name: '我的分享',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#9281F9, #AE87FB)' },
        },
        {
          icon:'icon-xingxing',
          name: '我的关注',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#FF6852, #FF824B)' },
        },
      ],
    };
  }

  componentDidMount() {
    this.getHeaderNum();
    this.myNews(1);
    this.myFollow(1, false);
    this.myShare(1, false);
    this.myDb(1, false);
    this.getLog();
    setInterval(() => {
      this.setState({
        newsTime: moment().format('YYYY[年]MMMDo'),
        newsTime1: moment().format('HH:mm:ss'),
      });
    }, 1000);
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    this.getDepTree(newjigouArea.department);
  }

  // 获取数据总览数
  getHeaderNum = () => {
    this.props.dispatch({
      type: 'Home/sjzlNum',
      payload: {},
      callback: res => {
        if (!res.error) {
          let list = res.data.list[0];
          this.setState({
            xz_num: list.xzaj_num.toString(),
            xs_num: list.xsaj_num.toString(),
            yj_num: list.yj_num.toString(),
            gj_num: list.gj_num.toString(),
          });
        }
      },
    });
  };
  // 获取机构树
  getDepTree = area => {
    const areaNum = [];
    if (area) {
      areaNum.push(area);
    }
    this.props.dispatch({
      type: 'common/getDepTree',
      payload: {
        departmentNum: areaNum,
      },
      callback: data => {
        if (data) {
          this.setState({
            treeDefaultExpandedKeys: [data[0].code],
          });
        }
      },
    });
  };
  changeTable = idx => {
    this.props.form.resetFields();
    this.setState({
      tableTilte: this.state.headerList[idx].name,
      idx: idx,
      columns: [],
      data: [],
      pageNew: 1,
      pd: null,
    });
    if (idx === 0) {
      this.myNews(1);
    } else if (idx === 1) {
      this.myDb(1, true);
    } else if (idx === 2) {
      if (this.state.tabs === 's2') {
        this.myShare(1, true, 'Home/getShareList', null, this.state.tabs);
      } else {
        this.setState({
          tabs: 's1',
        });
        this.myShare(1, true, 'Home/getmyShareList');
      }
    } else if (idx === 3) {
      if (this.state.tabs === 'f2') {
        this.myFollow(1, true, 'Home/getHistoryFollowList', null, this.state.tabs);
      } else {
        this.setState({
          tabs: 'f1',
        });
        this.myFollow(1, true, 'Home/getFollowList');
      }
    }
  };
  shareDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ShowData/MyShare',
        query: { record: record, id: record && record.id ? record.id : '1' },
      }),
    );
    // this.setState({
    // visibleShare: true,
    // shareDatail: record,
    // });
  };
  goLook = (record, read) => {
    if (record) {
      if (read === 0) {
        this.props.dispatch({
          type: 'Home/getChangeRead',
          payload: {
            dbid: record.dbid,
          },
          callback: res => {
            if (res.error === null) {
              this.myNews(this.state.pageNew);
              if (record) {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/ShowData/MyNews',
                    query: {
                      record: record,
                      id: res && res.data && res.data.dbid ? res.data.dbid : '1',
                    },
                  }),
                );
              }
            }
          },
        });
        // this.setState({
        //   visible: true,
        //   datail: record,
        // });
      } else if (read === 1) {
        if (record.wtflMc === '警情') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/receivePolice/AlarmPolice/unpoliceDetail',
              query: { record: record, id: record && record.id ? record.id : '1' },
            }),
          );
        } else if (record.wtflMc === '刑事案件') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
              query: { record: record, id: record && record.id ? record.id : '1' },
            }),
          );
        } else if (record.wtflMc === '行政案件') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
              query: { record: record, id: record && record.id ? record.id : '1' },
            }),
          );
        } else if (record.wtflMc === '办案区') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/handlingArea/AreaPolice/UnareaDetail',
              query: { record: record, id: record && record.id ? record.id : '1' },
            }),
          );
        } else if (record.wtflMc === '涉案物品') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
              query: { record: record, id: record && record.id ? record.id : '1' },
            }),
          );
        } else if (record.wtflMc === '卷宗') {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
              query: { record: record, id: record && record.id ? record.id : '1' },
            }),
          );
        }
      } else if (read === 2 || read === 3) {
        record['id'] = record.agid;
        this.props.dispatch(
          routerRedux.push({
            pathname:
              record.tzlx === 'wpwt'
                ? '/articlesInvolved/ArticlesPolice/unitemDetail'
                : record.tzlx === 'xzajwt1'
                ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
                : record.tzlx === 'xzajwt2'
                ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
                : record.tzlx === 'xzajwt3'
                ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
                : record.tzlx === 'jqwt'
                ? '/receivePolice/AlarmPolice/unpoliceDetail'
                : record.tzlx === 'xsajwt1'
                ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
                : record.tzlx === 'xsajwt2'
                ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
                : record.tzlx === 'xsajwt3'
                ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
                : record.tzlx === 'baqwt'
                ? '/handlingArea/AreaPolice/UnareaDetail'
                : record.tzlx === 'jzwt'
                ? '/dossierPolice/DossierPolice/UnDossierDetail'
                : record.tzlx === 'wpxx'
                ? '/articlesInvolved/ArticlesPolice/unitemDetail'
                : record.tzlx === 'xzajxx1'
                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                : record.tzlx === 'xzajxx2'
                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                : record.tzlx === 'xzajxx3'
                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                : record.tzlx === 'jqxx'
                ? '/receivePolice/AlarmData/policeDetail'
                : record.tzlx === 'xsajxx1'
                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                : record.tzlx === 'xsajxx2'
                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                : record.tzlx === 'xsajxx3'
                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                : record.tzlx === 'baqxx'
                ? '/handlingArea/AreaData/areaDetail'
                : record.tzlx === 'jzxx'
                ? '/dossierPolice/DossierData/DossierDetail'
                : record.tzlx === 'jqyj'
                ? '/receivePolice/AlarmData/policeDetail'
                : record.tzlx === 'xzajyj1'
                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                : record.tzlx === 'xsajyj1'
                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                : record.tzlx === 'xzajyj2'
                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                : record.tzlx === 'xsajyj2'
                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                : record.tzlx === 'xzajyj3'
                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                : record.tzlx === 'xsajyj3'
                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                : record.tzlx === 'baqyj'
                ? '/handlingArea/AreaData/areaDetail'
                : record.tzlx === 'wpyj'
                ? '/articlesInvolved/ArticlesData/itemDetail'
                : record.tzlx === 'jzyj'
                ? '/dossierPolice/DossierData/DossierDetail'
                : '',
            query: {
              id: record.tzlx === 'jqwt' ? record.id : record.agid,
              system_id: record.system_id,
              wtid: record.wtid,
              record: record,
            },
          }),
        );
      }
    }
  };
  myDb = (page, type, pageSize) => {
    if (type) {
      this.setState({
        loading: true,
        columns: [
          {
            title: '督办时间',
            key: 'dbsj',
            dataIndex: 'dbsj',
          },
          {
            title: '问题类型',
            dataIndex: 'wtlxMc',
            key: 'wtlxMc',
          },
          {
            title: '案件名称',
            dataIndex: 'ajmc',
            key: 'ajmc',
            render: text => (
              <Tooltip placement="top" title={text}>
                <span>{text && text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
              </Tooltip>
            ),
          },
          {
            title: '案件编号',
            dataIndex: 'ajbh',
            key: 'ajbh',
          },
          {
            title: '督办状态',
            dataIndex: 'dbztMc',
            key: 'dbztMc',
          },
          {
            title: '操作',
            width: 70,
            key: 'action',
            render: (text, record) => (
              <span>
                <a href="javascript:;" onClick={() => this.goLook(record, 1)}>
                  查看
                </a>
              </span>
            ),
          },
        ],
      });
      this.props.dispatch({
        type: 'Home/getdbList',
        payload: {
          currentPage: page,
          currentResult: 0,
          entityOrField: true,
          pageStr: 'string',
          pd: {},
          showCount: pageSize ? pageSize : this.state.pageSize,
          totalPage: 0,
          totalResult: 0,
        },
        callback: res => {
          this.state.headerList[1].tital = res.page.totalResult;
          this.setState({
            headerList: this.state.headerList,
          });
          if (type) {
            if (this.state.idx === 1) {
              this.setState({
                data: res.list,
                pageTotal: res.page.totalResult,
                loading: false,
              });
            }
          }
        },
      });
    } else {
      this.props.dispatch({
        type: 'Home/getdbList',
        payload: {
          currentPage: 1,
          currentResult: 0,
          entityOrField: true,
          pageStr: 'string',
          pd: {},
          showCount: 1,
          totalPage: 0,
          totalResult: 0,
        },
        callback: res => {
          this.state.headerList[1].tital = res.page.totalResult;
        },
      });
    }
  };
  myNews = (page, pageSize) => {
    this.setState({
      loading: true,
      columns: [
        {
          title: '消息状态',
          key: 'tags',
          dataIndex: 'tags',
          render: tags => (
            <Tag
              style={{ cursor: 'default' }}
              color={tags === '未读' ? '#ee5655' : '#0c0'}
              key={tags}
            >
              {tags}
            </Tag>
          ),
        },
        {
          title: '发送时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '消息类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '标题',
          dataIndex: 'wtlxMc',
          key: 'wtlxMc',
        },
        {
          title: '简述',
          dataIndex: 'xxjs',
          key: 'xxjs',
          render: text => (
            <Tooltip placement="top" title={text}>
              <span>{text && text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
            </Tooltip>
          ),
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={() => this.goLook(record, 0)}>
                查看
              </a>
            </span>
          ),
        },
      ],
    });
    this.props.dispatch({
      type: 'Home/getMyNews',
      payload: {
        currentPage: page,
        currentResult: 0,
        entityOrField: true,
        pageStr: 'string',
        pd: {},
        showCount: pageSize ? pageSize : this.state.pageSize,
        totalPage: 0,
        totalResult: 0,
      },
      callback: res => {
        this.state.headerList[0].tital = res.page.totalResult;
        this.setState({
          headerList: this.state.headerList,
        });
        let list = [];
        res.list.map((item, i) => {
          list.push({
            key: i,
            time: item.fksj,
            name: item.ajmc,
            type: '督办反馈',
            content: item.fkr_fkyj,
            tags: item.dqztMc,
            dbid: item.dbid,
            zrrName: item.zrrName,
            zrrDwmc: item.zrrDwmc,
            wtlxMc: item.wtlxMc,
            ajbh: item.ajbh,
            xxjs:
              `${item.ajbh ? item.ajbh : ''}` +
              `${item.ajbh && item.ajmc ? '、' : ''}` +
              `${item.ajmc ? item.ajmc : ''}`,
          });
        });
        if (this.state.idx === 0) {
          this.setState({
            data: list,
            pageTotal: res.page.totalResult,
            loading: false,
          });
        }
      },
    });
  };
  saveShare = (res, type, ajGzLx) => {
    this.props.dispatch({
      type: 'share/getMyFollow',
      payload: {
        agid: res.id,
        lx: res.lx,
        sx: res.sx,
        type: type,
        tzlx: res.tzlx,
        wtid: res.wtid,
        ajbh: res.ajbh,
        system_id: res.tzlx === 'jqxx' ? res.agid : res.system_id,
        ajGzLx: ajGzLx,
      },
      callback: res => {
        if (!res.error) {
          message.success('关注成功');
          if (this.state.tabs === 's2') {
            this.myShare(
              this.state.pageNew,
              true,
              'Home/getShareList',
              this.state.pd ? this.state.pd : null,
              this.state.tabs,
            );
          } else if (this.state.tabs === 's1') {
            this.myShare(
              this.state.pageNew,
              true,
              'Home/getmyShareList',
              this.state.pd ? this.state.pd : null,
              this.state.tabs,
            );
          } else if (this.state.tabs === 'f2') {
            this.myFollow(
              this.state.pageNew,
              true,
              'Home/getHistoryFollowList',
              this.state.pd ? this.state.pd : null,
              this.state.tabs,
            );
          }
          this.myFollow(1, false);
        }
      },
    });
  };
  myShare = (page, type, path, pd, tabs) => {
    this.setState({
      data: [],
    });
    if (type) {
      this.setState({
        loading: true,
        columns: [
          {
            title: '分享时间',
            dataIndex: 'czsj',
            key: 'czsj',
          },
          {
            title:
              (tabs && tabs === 's2') || (!tabs && this.state.tabs === 's2')
                ? '分享人'
                : '被分享人',
            dataIndex: 'person',
            key: 'person',
            render: (text, record) =>
              (tabs && tabs === 's2') || (!tabs && this.state.tabs === 's2') ? (
                <Tooltip
                  placement="top"
                  title={(record.czr_dwmc ? record.czr_dwmc : '') + (record.czr ? record.czr : '')}
                >
                  {record.czr_dwmc ? (
                    <span>
                      {record.czr_dwmc
                        ? record.czr_dwmc.length > 15
                          ? record.czr_dwmc.substring(0, 15) + '...'
                          : record.czr_dwmc
                        : ''}
                      <br />
                    </span>
                  ) : (
                    ''
                  )}
                  <span>{record.czr ? record.czr : ''}</span>
                </Tooltip>
              ) : (
                <Tooltip
                  placement="top"
                  title={
                    (record.czr_dwmc ? record.czr_dwmc : '') + (record.fx_xm ? record.fx_xm : '')
                  }
                >
                  {record.czr_dwmc ? (
                    <span>
                      {record.czr_dwmc
                        ? record.czr_dwmc.length > 15
                          ? record.czr_dwmc.substring(0, 15) + '...'
                          : record.czr_dwmc
                        : ''}
                      <br />
                    </span>
                  ) : (
                    ''
                  )}
                  <span>
                    {record.fx_xm
                      ? record.fx_xm.length > 15
                        ? record.fx_xm.substring(0, 15) + '...'
                        : record.fx_xm
                      : ''}
                  </span>
                </Tooltip>
              ),
          },
          {
            title: '分享事项',
            dataIndex: 'sx',
            key: 'sx',
            render: text => (
              <Tooltip placement="top" title={text}>
                <span>{text && text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
              </Tooltip>
            ),
          },
          {
            title: '分享类型',
            dataIndex: 'lx',
            key: 'lx',
          },
          {
            title: '分享建议',
            dataIndex: 'fxjy',
            key: 'fxjy',
            render: text => (
              <Tooltip placement="top" title={text}>
                <span>{text && text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
              </Tooltip>
            ),
          },
          {
            title: '操作',
            key: 'action',
            // width: 180,
            render: (text, record) => (
              <span>
                <a href="javascript:;" onClick={() => this.shareDetail(record)}>
                  查看
                </a>
                <Divider type="vertical" />
                {record.sfgz === 0 ? (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="0">
                          <a onClick={() => this.saveShare(record, 1, 0)}>
                            本{record.lx ? record.lx.substring(0, 2) : '案件'}关注
                          </a>
                        </Menu.Item>
                        <Menu.Item key="1">
                          <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                    getPopupContainer={() => document.getElementById('home1ID')}
                  >
                    <a href="javascript:;">关注</a>
                  </Dropdown>
                ) : (
                  <a
                    href="javascript:;"
                    onClick={() =>
                      this.noFollow(record.gzid, 2, record.tzlx, record.ajbh, record.ajgzlx)
                    }
                  >
                    取消
                    {record.ajgzlx && record.ajgzlx === '0'
                      ? record.lx
                        ? '本' + record.lx.substring(0, 2)
                        : '本案件'
                      : '全要素'}
                    关注
                  </a>
                )}
              </span>
            ),
          },
        ],
      });
      this.props.dispatch({
        type: path,
        payload: {
          currentPage: page,
          currentResult: 0,
          entityOrField: true,
          pageStr: 'string',
          pd: pd ? pd : {},
          showCount: this.state.pageSizeShare,
          totalPage: 0,
          totalResult: 0,
        },
        callback: res => {
          this.setState({
            headerList: this.state.headerList,
          });
          if (this.state.idx === 2) {
            this.setState({
              data: res.list,
              pageTotal: res.page.totalResult,
              loading: false,
            });
          }
        },
      });
    } else {
      this.props.dispatch({
        type: 'Home/getShareNum',
        payload: {},
        callback: res => {
          this.state.headerList[2].tital = res.gzCount;
        },
      });
      this.props.dispatch({
        type: 'Home/getShareList',
        payload: {
          currentPage: 1,
          currentResult: 0,
          pd: {},
        },
        callback: res => {
          this.setState({
            fxgw: res.page.totalResult,
          });
        },
      });
      this.props.dispatch({
        type: 'Home/getmyShareList',
        payload: {
          currentPage: 1,
          currentResult: 0,
          pd: {},
        },
        callback: res => {
          this.setState({
            wdfx: res.page.totalResult,
          });
        },
      });
    }
  };
  noFollow = (id, type, tzlx, ajbh, ajgzlx) => {
    this.props.dispatch({
      type: 'share/getNoFollow',
      payload: {
        id: id,
        tzlx: tzlx,
        ajbh: ajbh,
        ajGzlx: ajgzlx,
      },
      callback: res => {
        if (!res.error) {
          message.success('取消关注成功');
          this.changeFollowNum();
          if (type === 3) {
            this.myFollow(
              this.state.pageNew,
              true,
              'Home/getFollowList',
              this.state.pd ? this.state.pd : null,
            );
          } else if (type === 2) {
            this.myShare(
              this.state.pageNew,
              true,
              this.state.tabs === 's2' ? 'Home/getShareList' : 'Home/getmyShareList',
              this.state.pd ? this.state.pd : null,
              this.state.tabs,
            );
            this.myFollow(1, false);
          }
        }
      },
    });
  };
  myFollow = (page, type, path, pd, tabs) => {
    if (type) {
      this.setState({
        loading: true,
        columns: [
          {
            title: '关注时间',
            dataIndex: 'czsj',
            key: 'czsj',
          },
          {
            title: '关注事项',
            dataIndex: 'sx',
            key: 'sx',
            render: text => (
              <Tooltip placement="top" title={text}>
                <span>{text && text.length > 30 ? text.substring(0, 30) + '...' : text}</span>
              </Tooltip>
            ),
          },
          {
            title: '关注类型',
            dataIndex: 'lx',
            key: 'lx',
          },
          {
            title: '操作',
            key: 'action',
            width: tabs && tabs === 'f2' ? 110 : 180,
            render: (text, record) => (
              <span>
                <a href="javascript:;" onClick={() => this.goLook(record, 3)}>
                  查看
                </a>
                <Divider type="vertical" />
                {tabs && tabs === 'f2' ? (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="0">
                          <a onClick={() => this.saveShare(record, 1, 0)}>
                            本{record.lx ? record.lx.substring(0, 2) : '案件'}关注
                          </a>
                        </Menu.Item>
                        <Menu.Item key="1">
                          <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <a href="javascript:;">关注</a>
                  </Dropdown>
                ) : (
                  <a
                    href="javascript:;"
                    onClick={() =>
                      this.noFollow(record.id, 3, record.tzlx, record.ajbh, record.ajgzlx)
                    }
                  >
                    取消
                    {record.ajgzlx && record.ajgzlx === '0'
                      ? record.lx
                        ? '本' + record.lx.substring(0, 2)
                        : '本案件'
                      : '全要素'}
                    关注
                  </a>
                )}
              </span>
            ),
          },
        ],
      });
      this.props.dispatch({
        type: path,
        payload: {
          currentPage: page,
          currentResult: 0,
          entityOrField: true,
          pageStr: 'string',
          pd: pd ? pd : {},
          showCount: this.state.pageSizeFollow,
          totalPage: 0,
          totalResult: 0,
        },
        callback: res => {
          this.setState({
            headerList: this.state.headerList,
          });
          if (this.state.idx === 3) {
            this.setState({
              data: res.list,
              pageTotal: res.page.totalResult,
              loading: false,
            });
          }
        },
      });
    } else {
      this.props.dispatch({
        type: 'Home/getFollowNum',
        payload: {},
        callback: res => {
          this.state.headerList[3].tital = res.gzCount;
        },
      });
      this.changeFollowNum();
    }
  };
  changeFollowNum = () => {
    this.props.dispatch({
      type: 'Home/getFollowList',
      payload: {
        currentPage: 1,
        currentResult: 0,
        pd: {},
      },
      callback: res => {
        this.setState({
          zzgz: res.page.totalResult,
        });
      },
    });
    this.props.dispatch({
      type: 'Home/getHistoryFollowList',
      payload: {
        currentPage: 1,
        currentResult: 0,
        pd: {},
      },
      callback: res => {
        this.setState({
          lsgz: res.page.totalResult,
        });
      },
    });
  };
  // handleCancel = () => {
  // this.setState({
  // visible: false,
  // visibleShare: false,
  // });
  // };
  getLog = () => {
    this.props.dispatch({
      type: 'Home/getToday',
      payload: {},
      callback: res => {
        this.setState({
          myLog: res.data.list,
        });
      },
    });
  };
  handleFormReset = () => {
    //重置
    this.changeTable(this.state.idx);
  };
  callBackTabs = e => {
    this.setState({
      tabs: e,
      pageNew: 1,
      pd: null,
    });
    this.props.form.resetFields();
    if (e === 's2') {
      this.myShare(1, true, 'Home/getShareList', null, e);
    } else if (e === 's1') {
      this.myShare(1, true, 'Home/getmyShareList', null, e);
    } else if (e === 'f2') {
      this.myFollow(1, true, 'Home/getHistoryFollowList', null, e);
    } else if (e === 'f1') {
      this.myFollow(1, true, 'Home/getFollowList', null, e);
    }
  };
  handleSearch = type => {
    const values = this.props.form.getFieldsValue();
    this.setState({
      pageNew: 1,
    });
    if (type === 0) {
      let pd = {
        fxsj_ks: values.fxsj && values.fxsj.length > 0 ? values.fxsj[0].format('YYYY-MM-DD') : '',
        fxsj_js: values.fxsj && values.fxsj.length > 0 ? values.fxsj[1].format('YYYY-MM-DD') : '',
        fxdw: values.fxdw ? JSON.parse(values.fxdw).id : '',
        fxr: values.fxr ? values.fxr : '',
        fxlx: values.fxlx ? values.fxlx : '',
      };
      this.setState({
        pd: pd,
      });
      this.myShare(
        1,
        true,
        this.state.tabs === 's2' ? 'Home/getShareList' : 'Home/getmyShareList',
        pd,
        this.state.tabs,
      );
    } else {
      const values = this.props.form.getFieldsValue();
      let pd = {
        gzsj_ks: values.gzsj && values.gzsj.length > 0 ? values.gzsj[0].format('YYYY-MM-DD') : '',
        gzsj_js: values.gzsj && values.gzsj.length > 0 ? values.gzsj[1].format('YYYY-MM-DD') : '',
        gzlx: values.gzlx ? values.gzlx : '',
      };
      this.setState({
        pd: pd,
      });
      this.myFollow(
        1,
        true,
        this.state.tabs === 'f2' ? 'Home/getHistoryFollowList' : 'Home/getFollowList',
        pd,
        this.state.tabs,
      );
    }
  };
  //被分享人
  handleSearchPerson = value => {
    this.setState({
      personList: [],
      loadings: true,
    });
    this.props.dispatch({
      type: 'share/sharePerson',
      payload: {
        pd: {
          code: getUserInfos().department,
          name: value,
        },
        showCount: 999999,
      },
      callback: res => {
        this.setState({
          personList: res.list,
          loadings: false,
        });
      },
    });
  };
  // 渲染机构树
  renderloop = data =>
    data.map(item => {
      if (item.childrenList && item.childrenList.length) {
        return (
          <TreeNode value={item.code} key={item.code} title={item.name}>
            {this.renderloop(item.childrenList)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.code} value={item.code} title={item.name} />;
    });
  getBlur = () => {
    this.setState({
      personList: [],
    });
  };

  render() {
    const children = [];
    if (this.state.personList && this.state.personList.length > 0) {
      this.state.personList.map((event, idx) => {
        if (event.idcard !== getUserInfos().idCard) {
          children.push(<Option value={event.name}>{event.name}</Option>);
        }
      });
    }
    const paginationPage = {
      current: this.state.pageNew,
      total: this.state.pageTotal,
      pageSize:
        this.state.idx === 2
          ? this.state.pageSizeShare
          : this.state.idx === 3
          ? this.state.pageSizeFollow
          : this.state.pageSize,
      size: 'middle',
      // showQuickJumper: true,
      showTotal: () => (
        <span className={styles.pagination}>{`共 ${Math.ceil(
          parseInt(this.state.pageTotal) / parseInt(this.state.pageSize),
        )} 页， ${this.state.pageTotal} 条记录`}</span>
      ),
      onChange: e => {
        this.setState({
          pageNew: e,
        });
        if (this.state.idx === 0) {
          this.myNews(e);
        } else if (this.state.idx === 1) {
          this.myDb(e, true);
        } else if (this.state.idx === 2) {
          this.myShare(
            e,
            true,
            this.state.tabs === 's2' ? 'Home/getShareList' : 'Home/getmyShareList',
            this.state.pd ? this.state.pd : null,
            this.state.tabs,
          );
        } else if (this.state.idx === 3) {
          this.myFollow(
            e,
            true,
            this.state.tabs === 'f2' ? 'Home/getHistoryFollowList' : 'Home/getFollowList',
            this.state.pd ? this.state.pd : null,
            this.state.tabs,
          );
        }
      },
    };
    let className = this.props.global&&this.props.global.dark ? styles.allBox : styles.lightBox;
    console.log('this.props.global.dark',this.props.global.dark)
    return (
      <div id="home1ID" className={className}>
        <div className={styles.homeStyle}>
          <Card
            title={
              <div className={styles.iconPerson}>
                <IconFont type={'icon-shuju'} className={styles.iconLefts}/>
                <span>数据总览</span>
              </div>
            }
          >
            <div className={styles.leftBox}>
              <div style={{ width: '100%', height: '60px', marginBottom: '16px' }}>
                <img src={header} className={styles.header} />
                <div className={styles.personNews}>{getUserInfos().name} 警官，您好！</div>
                <span className={styles.timeLogin}>
                  日期：{this.state.newsTime}&nbsp;&nbsp;&nbsp;&nbsp; 时间：{this.state.newsTime1}
                </span>
              </div>
              <div className={styles.glajStyle}>
                <span className={styles.headerNumGlaj}>管理案件：</span>
                <span
                  className={styles.glajNum}
                  style={{
                    fontSize:
                      this.state.xz_num.length + this.state.xs_num.length > 9 ||
                      this.state.yj_num.length + this.state.gj_num.length > 9
                        ? '13px'
                        : '14px',
                  }}
                >
                  行政{' '}
                  <a
                    className={styles.DataTotal}
                    style={{
                      textDecoration: 'underline',
                      color: '#47B2FF',
                      fontSize: 18,
                      cursor: 'auto',
                    }}
                  >
                    {this.state.xz_num}
                  </a>{' '}
                  起&nbsp;&nbsp;&nbsp;&nbsp; 刑事{' '}
                  <a
                    style={{
                      textDecoration: 'underline',
                      color: '#47B2FF',
                      fontSize: 18,
                      cursor: 'auto',
                    }}
                  >
                    {this.state.xs_num}
                  </a>{' '}
                  起
                </span>
              </div>
              <div className={styles.glajStyle}>
                <span className={styles.headerNumZfxx}>执法消息：</span>
                <span
                  className={styles.headerNum}
                  style={{
                    fontSize:
                      this.state.yj_num.length + this.state.gj_num.length > 9 ||
                      this.state.xz_num.length + this.state.xs_num.length > 9
                        ? '13px'
                        : '14px',
                  }}
                >
                  预警{' '}
                  <a
                    style={{
                      textDecoration: 'underline',
                      color: '#47B2FF',
                      fontSize: 18,
                      cursor: 'auto',
                    }}
                  >
                    {this.state.yj_num}
                  </a>{' '}
                  条 &nbsp;&nbsp;&nbsp;&nbsp;告警{' '}
                  <a
                    style={{
                      textDecoration: 'underline',
                      color: '#47B2FF',
                      fontSize: 18,
                      cursor: 'auto',
                    }}
                  >
                    {this.state.gj_num}
                  </a>{' '}
                  条
                </span>
              </div>
            </div>
            <div className={styles.rightBox}>
              <Row gutter={16}>
                {this.state.headerList.map((item, i) => {
                  return (
                    <Col span={6} key={i} onClick={() => this.changeTable(i)}>
                      <Row className={styles.gutterBox} style={item.colorBg}>
                        <Row className={styles.gutterTabs}>
                          <Col span={24}>
                            <IconFont type={item.icon} style={{ float: 'left', margin: '8px 10px',fontSize:18 }}/>
                            <div className={styles.tiltleTop}>{item.name}</div>
                          </Col>
                        </Row>
                        <Row className={styles.gutterTabs1}>
                          <Col span={24}>
                            <div className={styles.numBottom} style={item.style}>
                              {item.tital}
                            </div>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Card>
        </div>
        <Row gutter={16}>
          <Col
            span={8}
            xxl={{ span: 8 }}
            xl={{ span: 9 }}
            lg={{ span: 24 }}
            className={styles.timeLineBox}
            style={{ marginTop: '16px' }}
          >
            <Statistics />
          </Col>
          <Col
            span={16}
            xxl={{ span: 16 }}
            xl={{ span: 15 }}
            lg={{ span: 24 }}
            className={styles.tableBox}
            style={{ marginTop: '16px' }}
          >
            {this.state.idx === 0 || this.state.idx === 1 ? (
              <Card
                title={
                  <div className={styles.iconPerson}>
                    <IconFont type={this.state.idx === 0 ? 'icon-fasong':'icon-jishi'} className={styles.iconLefts}/>
                    <span>{this.state.tableTilte}</span>
                  </div>
                }
                className={styles.rightStyle}
              >
                <Table
                  loading={this.state.loading}
                  pagination={paginationPage}
                  columns={this.state.columns}
                  dataSource={this.state.data}
                  className={styles.homeTable}
                  locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
                />
              </Card>
            ) : this.state.idx === 2 ? (
              <div className={styles.tabsBox}>
                <TabsTable
                  {...this.state}
                  {...this.props}
                  callBackTabs={this.callBackTabs}
                  renderloop={this.renderloop}
                  handleSearchPerson={this.handleSearchPerson}
                  getBlur={this.getBlur}
                  children={children}
                  paginationPage={paginationPage}
                  handleSearch={this.handleSearch}
                  handleFormReset={this.handleFormReset}
                />
              </div>
            ) : (
              <div className={styles.tabsBox}>
                <TabsFollowTable
                  {...this.state}
                  {...this.props}
                  callBackTabs={this.callBackTabs}
                  paginationPage={paginationPage}
                  handleSearch={this.handleSearch}
                  handleFormReset={this.handleFormReset}
                />
              </div>
            )}
          </Col>
        </Row>
        <div className={styles.version}>
          {window.configUrl.headName}&nbsp;&nbsp;版本号：{window.configUrl.version}
        </div>
      </div>
    );
  }
}
