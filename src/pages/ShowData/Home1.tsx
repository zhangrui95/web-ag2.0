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
  TreeSelect,
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
import iconpreson from '../../assets/menuimage/iconpreson.png';
import header from '../../assets/common/header.png';

const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
@connect(({ home, share, common }) => ({
  home,
  share,
  common,
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
          icon:
            '<path d="M731.683485 292.581809h-24.349571c-34.23134 0-62.146323-27.901465-62.146323-62.146324V150.007551C645.187591 115.769452 673.102574 87.867987 707.333914 87.867987h24.349571c34.249927 0 62.144634 27.901465 62.144634 62.139564v80.434693c-0.006759 34.23134-27.894706 62.139564-62.144634 62.139565z m-24.349571-154.145796c-6.245386 0-11.571538 5.326152-11.571538 11.571538v80.434693c0 6.238627 5.326152 11.571538 11.571538 11.571538h24.349571c6.257215 0 11.583366-5.332911 11.583366-11.571538V150.007551c0-6.252145-5.326152-11.571538-11.583366-11.571538h-24.349571zM422.594323 292.581809h-24.35633c-34.238099 0-62.139564-27.901465-62.139564-62.146324V150.007551C336.098429 115.769452 363.993135 87.867987 398.237993 87.867987h24.35633c34.238099 0 62.137875 27.901465 62.137875 62.139564v80.434693c-0.006759 34.23134-27.899776 62.139564-62.137875 62.139565z m-24.35633-154.145796c-6.250455 0-11.571538 5.326152-11.571538 11.571538v80.434693c0 6.238627 5.321083 11.571538 11.571538 11.571538h24.35633c6.250455 0 11.571538-5.332911 11.571538-11.571538V150.007551c0-6.252145-5.321083-11.571538-11.571538-11.571538h-24.35633z m0 0" fill="#fff" p-id="940"></path>\n' +
            '<path d="M641.644145 929.075538H256.322746c-55.610297 0-100.864-45.246944-100.864-100.857241V265.80235c0-55.617056 45.253703-100.956937 100.864-100.956937h104.965069c13.992977 0 25.280634 11.287657 25.280634 25.287392 0 13.992977-11.287657 25.280634-25.280634 25.280634h-104.965069c-27.72235 0-50.295974 22.587142-50.295974 50.295974v562.409188c0 27.730799 22.573624 50.304422 50.295974 50.304422H641.53769a25.284013 25.284013 0 0 1 17.894653 7.392739 25.285703 25.285703 0 0 1 7.399499 17.887895 25.189386 25.189386 0 0 1-7.306561 17.933518 25.219802 25.219802 0 0 1-17.881136 7.438363z" fill="#fff" p-id="941"></path>\n' +
            '<path d="M532.672634 929.075538h-70.052753c-13.992977 0-25.292462-11.285967-25.292462-25.278944 0-13.987908 11.299485-25.280634 25.292462-25.280634h70.052753a25.248528 25.248528 0 0 1 25.287392 25.280634 25.245149 25.245149 0 0 1-25.287392 25.278944zM879.386191 929.075538H606.57468a25.23332 25.23332 0 0 1-25.273875-25.278944 25.238389 25.238389 0 0 1 25.273875-25.280634h272.811511c27.708832 0 50.309492-22.582073 50.309492-50.297663v-77.056845a25.248528 25.248528 0 0 1 7.392739-17.892964 25.214733 25.214733 0 0 1 17.887895-7.392739 25.253597 25.253597 0 0 1 25.280633 25.285703v77.056845c0 55.610297-45.253703 100.857241-100.870759 100.857241zM954.976317 590.185611a25.228251 25.228251 0 0 1-25.280634-25.273875V265.80235c0-27.715591-22.60066-50.297663-50.309492-50.297664H768.540726a25.267116 25.267116 0 0 1-17.887894-7.397808 25.272185 25.272185 0 0 1-7.385981-17.887895 25.278944 25.278944 0 0 1 7.385981-17.887894 25.253597 25.253597 0 0 1 17.887894-7.392739h110.745769c55.617056 0 100.970455 45.246944 100.970455 100.950178v299.109386a25.224871 25.224871 0 0 1-7.424844 17.827063 25.214733 25.214733 0 0 1-17.855789 7.360634zM670.388805 215.504686H459.439736a25.240079 25.240079 0 0 1-17.882825-7.397808 25.207974 25.207974 0 0 1-7.39105-17.887895 25.255287 25.255287 0 0 1 25.273875-25.280633h210.955828a25.248528 25.248528 0 0 1 17.887895 7.392739 25.219802 25.219802 0 0 1 7.392739 17.887894c0.086178 13.999736-11.292726 25.285703-25.287393 25.285703zM510.923617 697.960766c-6.43464 0-12.963908-2.428198-17.913241-7.358944l-122.317307-122.324066a25.23501 25.23501 0 0 1 0-35.741994 25.211353 25.211353 0 0 1 35.730165 0l122.322377 122.322377a25.265426 25.265426 0 0 1 7.419775 17.874376c0 6.706693-2.673215 13.136264-7.419775 17.869307a24.978165 24.978165 0 0 1-17.821994 7.358944z m0 0" fill="#fff" p-id="942"></path>\n' +
            '<path d="M516.812462 694.12668a25.30598 25.30598 0 0 1-16.245439-44.69439l255.849611-213.93996a25.280634 25.280634 0 0 1 24.924092-4.349465 25.299221 25.299221 0 0 1 7.53637 43.168528L533.049452 688.251353a24.861571 24.861571 0 0 1-16.23699 5.875327z m0 0" fill="#fff" p-id="943"></path>',
          name: '我的消息',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#0084EA, #009BF6)'},
        },
        {
          icon:
            '<path d="M730.492 991.707c-139.125 0-251.901-112.725-251.901-251.783 0-139.05 112.777-251.782 251.901-251.782 139.13 0 251.905 112.732 251.905 251.782 0 139.058-112.776 251.783-251.905 251.783zM730.614 535.999c-112.659 0-203.999 91.341-203.999 203.999s91.341 203.999 203.999 203.999 203.999-91.341 203.999-203.999-91.34-203.999-203.999-203.999zM833.022 822.845l-124.055-48.525c-0.047-0.028-0.075-0.075-0.145-0.098-1.317-0.577-2.348-1.561-3.548-2.348-1.298-0.844-2.766-1.491-3.844-2.569-2.878-2.883-4.608-6.647-5.662-10.706-0.553-1.969-1.106-3.891-1.153-5.953l0-121.584c0-12.741 10.322-23.062 23.063-23.062l1.875 0c12.741 0 23.063 10.322 23.063 23.062l0 106.078 105.459 41.259c11.4 4.463 17.302 18.023 13.148 30.309-4.177 12.267-16.8 18.6-28.2 14.137zM766.614 199.761c0-26.522-21.478-48-48-48l-48 0 0-47.761 48 0c53.016 0 96 42.984 96 96l0 252.142c-15.525-4.512-31.561-7.8-48-9.792l0-242.589zM623.551 224l-1.875 0c-12.741 0-23.062-10.319-23.062-23.064l0-145.87c0-12.745 10.322-23.064 23.062-23.064l1.875 0c12.741 0 23.062 10.319 23.062 23.064l0 145.87c0 12.744-10.322 23.064-23.062 23.064zM286.615 104l287.999 0 0 47.761-287.999 0 0-47.761zM239.55 224l-1.87 0c-12.745 0-23.064-10.319-23.064-23.064l0-145.87c-0.001-12.745 10.319-23.065 23.064-23.065l1.87 0c12.745 0 23.064 10.319 23.064 23.064l0 145.87c0 12.745-10.319 23.065-23.064 23.065zM238.615 366.703l0 2.592c0 12.553-10.153 22.703-22.703 22.703l-2.592 0c-12.55 0-22.703-10.15-22.703-22.703l0-2.592c0-12.553 10.153-22.703 22.703-22.703l2.592 0c12.55-0.001 22.703 10.15 22.703 22.703zM215.911 535.999l-2.592 0c-12.55 0-22.703-10.153-22.703-22.703l0-2.592c0-12.553 10.153-22.703 22.703-22.703l2.592 0c12.55 0 22.703 10.15 22.703 22.703l0 2.592c0 12.55-10.153 22.703-22.703 22.703zM238.615 657.292c0 12.553-10.153 22.706-22.703 22.706l-2.592 0c-12.55 0-22.703-10.153-22.703-22.706l0-2.587c0-12.553 10.153-22.706 22.703-22.706l2.592 0c12.55 0 22.703 10.153 22.703 22.706l0 2.587zM309.68 631.998l141.288 0c-5.977 15.459-10.969 31.416-14.33 48l-126.958 0c-12.745 0-23.064-10.322-23.064-23.063l0-1.847c-0.001-12.769 10.319-23.091 23.064-23.091zM286.615 369.511l0-3c0-12.431 10.08-22.511 22.488-22.511l363.021 0c12.412 0 22.491 10.081 22.491 22.511l0 3c0 12.408-10.078 22.488-22.491 22.488l-363.02 0c-12.408 0-22.489-10.08-22.489-22.488zM309.68 535.999c-12.745 0-23.064-10.322-23.064-23.064l0-1.87c0-12.745 10.319-23.064 23.064-23.064l258.527 0c-21.023 13.584-40.153 29.737-57.117 48l-201.41 0zM94.616 199.761l0 623.998c0 26.517 21.48 48 48 48l318.791 0c8.377 17.063 18.288 33.192 29.616 48.239l-348.407 0c-53.016 0-96-42.984-96-96l0-623.998c0-53.016 42.984-96 96-96l48 0 0 47.761-48 0c-26.52 0-48 21.478-48 48z" p-id="1066"></path>\n',
          name: '我的督办',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#03CBE6, #01BDFB)' },
        },
        {
          icon:
            '<path d="M836.2 504.2c-16.3 0-29.5 13.2-29.5 29.5v274.9H215.9V217.8h270.2c16.3 0 29.5-13.2 29.5-29.5s-13.2-29.5-29.5-29.5H215.9c-9.5 0-18 1.2-25.2 3.6l14.7 44.9-14.7-44.9c-15.2 5-25.3 15.1-30.3 30.3-2.4 7.2-3.6 15.7-3.6 25.2v590.8c0 9.6 1.2 18 3.6 25.3 5 15.1 15.1 25.3 30.3 30.2l14.7-44.9-14.7 44.9c7.3 2.4 15.7 3.6 25.2 3.6h590.8c9.6 0 18-1.2 25.3-3.6l-14.7-44.9 14.7 44.9c15.2-4.9 25.3-15.1 30.3-30.2 2.4-7.3 3.6-15.7 3.6-25.3V533.8c-0.1-16.4-13.3-29.6-29.7-29.6z" p-id="2027"></path>\n' +
            '<path d="M862.3 192.6c-5-15.2-15.1-25.3-30.3-30.3l-14.7 44.9 14.7-44.9c-7.3-2.4-15.7-3.6-25.3-3.6H657c-16.3 0-29.5 13.2-29.5 29.5s13.3 29.5 29.5 29.5h98.1l-282.9 283c-11.6 11.5-11.6 30.2 0 41.8 5.8 5.8 13.3 8.6 20.9 8.6 7.5 0 15.1-2.9 20.9-8.6L806.4 250c0.1-0.1 0.1-0.3 0.3-0.4V372c0 16.3 13.2 29.5 29.5 29.5s29.6-13.2 29.6-29.5V217.8c0-9.6-1.2-18-3.5-25.2z"  p-id="2028"></path>',
          name: '我的分享',
          tital: 0,
          style: {},
          colorIcon: '#fff',
          colorBg: { background: 'linear-gradient(#9281F9, #AE87FB)' },
        },
        {
          icon:
            '<path d="M508.771 62.025c-248.377 0-449.727 201.353-449.727 449.73s201.349 449.729 449.727 449.729c248.379 0 449.729-201.351 449.729-449.729S757.151 62.025 508.771 62.025z m0 860.35c-226.781 0-410.622-183.841-410.622-410.62 0-226.78 183.841-410.622 410.622-410.622s410.622 183.841 410.622 410.622c0 226.779-183.841 410.62-410.622 410.62z m269.888-508.647H587.546l-59.128-181.671a19.536 19.536 0 0 0-18.589-13.498h-0.086a19.553 19.553 0 0 0-18.56 13.652l-57.372 181.516H243.767a19.552 19.552 0 0 0-18.636 13.635 19.552 19.552 0 0 0 7.37 21.902l147.71 104.167-54.802 179.799a19.55 19.55 0 0 0 7.121 21.46c6.703 4.949 15.774 5.1 22.61 0.383l155.92-106.512 151.406 106.38a19.52 19.52 0 0 0 11.237 3.553c4.104 0 8.209-1.3 11.668-3.86a19.56 19.56 0 0 0 6.893-21.843l-58.011-174.894 155.594-108.576a19.567 19.567 0 0 0 7.469-21.902 19.566 19.566 0 0 0-18.657-13.691zM599.911 534.163c-7.094 4.965-10.093 13.975-7.372 22.187l43.966 132.56-114.055-80.143a19.48 19.48 0 0 0-22.263-0.135L379.046 691.39l42.697-140.079a19.567 19.567 0 0 0-7.436-21.695l-108.881-76.78h142.716c8.527 0 16.079-5.538 18.646-13.652l43.319-137.046 44.654 137.198a19.536 19.536 0 0 0 18.589 13.5h143.117l-116.556 81.327z" p-id="693"></path>\n',
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
        query: { record: record,id:record&&record.id ? record.id : '1' },
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
              if(record){
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/ShowData/MyNews',
                    query: { record: record,id:res&&res.data&&res.data.dbid ? res.data.dbid : '1' },
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

      }
      else if (read === 1) {
        if(record.wtflMc==='警情'){
          this.props.dispatch(
            routerRedux.push({
              pathname: '/receivePolice/AlarmPolice/unpoliceDetail',
              query: { record: record,id:record&&record.id ? record.id : '1' },
            }));
        }
        else if(record.wtflMc==='刑事案件'){
          this.props.dispatch(
            routerRedux.push({
              pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
              query: { record: record,id:record&&record.id ? record.id : '1' },
            }));
        }
        else if(record.wtflMc==='行政案件'){
          this.props.dispatch(
            routerRedux.push({
              pathname: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
              query: { record: record,id:record&&record.id ? record.id : '1' },
            }));
        }
        else if(record.wtflMc==='办案区'){
          this.props.dispatch(
            routerRedux.push({
              pathname: '/handlingArea/AreaPolice/UnareaDetail',
              query: { record: record,id:record&&record.id ? record.id : '1' },
            }));
        }
        else if(record.wtflMc==='涉案物品'){
          this.props.dispatch(
            routerRedux.push({
              pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
              query: { record: record,id:record&&record.id ? record.id : '1' },
            }));
        }
        else if(record.wtflMc==='卷宗'){
          this.props.dispatch(
            routerRedux.push({
              pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
              query: { record: record,id:record&&record.id ? record.id : '1' },
            }));
        }

      }
      else if (read === 2 || read === 3) {
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
                    getPopupContainer={()=>document.getElementById('home1ID')}
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
          }
          else if (type === 2) {
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
    return (
      <div id='home1ID'>
        <div className={styles.homeStyle}>
          <Card
            title={
              <div className={styles.iconPerson}>
                <img src={iconpreson} />
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
                  <a className={styles.DataTotal} style={{ textDecoration: 'underline', color: '#47B2FF', fontSize: 18,cursor:'auto' }}>
                    {this.state.xz_num}
                  </a>{' '}
                  起&nbsp;&nbsp;&nbsp;&nbsp; 刑事{' '}
                  <a style={{ textDecoration: 'underline', color: '#47B2FF', fontSize: 18,cursor:'auto' }}>
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
                  <a style={{ textDecoration: 'underline', color: '#47B2FF', fontSize: 18,cursor:'auto' }}>
                    {this.state.yj_num}
                  </a>{' '}
                  条 &nbsp;&nbsp;&nbsp;&nbsp;告警{' '}
                  <a style={{ textDecoration: 'underline', color: '#47B2FF', fontSize: 18,cursor:'auto' }}>
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
                            <svg
                              width="46px"
                              height="23px"
                              fill={item.colorIcon}
                              viewBox="0 0 1024 1024"
                              style={{ float: 'left', marginTop: 8 }}
                              dangerouslySetInnerHTML={{ __html: item.icon }}
                            ></svg>
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
                    <img src={iconpreson} />
                    <span>{this.state.tableTilte}</span>
                  </div>
                }
                className={styles.rightStyle}
              >
                <Table
                  // size="middle"
                  loading={this.state.loading}
                  pagination={paginationPage}
                  columns={this.state.columns}
                  dataSource={this.state.data}
                  className={styles.homeTable}
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
        {/*<MyNews*/}
          {/*visible={this.state.visible}*/}
          {/*handleCancel={this.handleCancel}*/}
          {/*datail={this.state.datail}*/}
        {/*/>*/}
        {/*<MyShare*/}
          {/*visibleShare={this.state.visibleShare}*/}
          {/*shareDatail={this.state.shareDatail}*/}
          {/*handleCancel={this.handleCancel}*/}
          {/*tabs={this.state.tabs}*/}
          {/*goLook={(record, read) => this.goLook(record, read)}*/}
        {/*/>*/}
        <div className={styles.version}>
          {window.configUrl.headName}&nbsp;&nbsp;版本号：{window.configUrl.version}
        </div>
      </div>
    );
  }
}
