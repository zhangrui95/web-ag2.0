/*
 * GeneralQuery/index.js 综合查询
 * author：lyp
 * 20180731
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Card,
    Input,
    Radio,
    DatePicker,
    TreeSelect,
    List,
    Icon,
    Tabs,
    message,
    AutoComplete,
    Affix,
    Empty, Divider,
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import { getTimeDistance, getUserInfos } from '../../../utils/utils';
import xsajImg from '../../../assets/generalQuery/xsaj.png';
import jzwjImg from '../../../assets/generalQuery/jz_jzwj.png';
import qtImg from '../../../assets/generalQuery/jz_qt.png';
import wjImg from '../../../assets/generalQuery/jz_wj.png';
import zjzbImg from '../../../assets/generalQuery/jz_zjzb.png';
import xzajImg from '../../../assets/generalQuery/xzaj.png';
import stylescommon from '@/pages/common/common.less';
import noList from '../../../assets/viewData/noList.png';
// import XsajDetail from '../../routes/CaseRealData/caseDetail';
// import XzajDetail from '../../routes/XzCaseRealData/caseDetail';
// import WpDetail from '../../routes/ItemRealData/itemDetail';
// import PersonDetail from '../AllDocuments/PersonalDocDetail';
// import PersonIntoArea from '../../routes/CaseRealData/IntoArea';
// import DossierDetail from '../../routes/DossierData/DossierDetail';

const Option = AutoComplete.Option;
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const TreeNode = TreeSelect.TreeNode;
const TabPane = Tabs.TabPane;
let timeout;
let currentValue;
let timeoutBaq;
let currentValueBaq;

@connect(({ common, generalQuery, loading }) => ({
  common,
  generalQuery,
  loading:
    loading.effects['generalQuery/getSearchData'] ||
    loading.effects['generalQuery/getSearchDataNew'],
}))
export default class GeneralQuery extends PureComponent {
  state = {
    current: 1, // 分页默认第一页
    showSearchDetail: false, // 展示更多
    searchType: '', // 查询类别
    rangePickerValue: [], // 立案日期
    ajlxValue: null, // 案件类型
    ajztValue: null, // 案件状态
    wpzlValue: null, // 物品种类
    wpztValue: null, // 物品类型
    rylxValue: null, // 人员类型
    ryxbValue: null, // 人员性别
    searchInput: null, // 搜索框
    searchInputValue: null, // 搜索框录入值
    jzlbValue: null, // 卷宗类别
    ccztValue: null, // 存储状态
    ajhjValue: null, // 办案环节
    jzdzjValue: null, // 是否有电子卷
    badwValue: [], // 办案单位
    baqValue: [], // 办案区
    searchResults: [], // 查询结果
    searchLarq: '', // 立案日期
    arrayDetail: [], // tab数组
    activeKey: '0', // 当前显示tab
    isClearData: false,
    personQueryIndex: configUrl.personQueryIndex, // 人员索引
    itemsQueryIndex: configUrl.itemsQueryIndex, // 物品索引
    caseQueryIndex: configUrl.caseQueryIndex, // 案件索引
    baqQueryIndex: configUrl.baqQueryIndex, // 办案区索引
    dossierQueryIndex: configUrl.dossierQueryIndex, // 卷宗索引
    res: [],
    autoCom: false,
    userInfo: getUserInfos(),
    treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
  };

  componentWillMount() {
    this.getDictAjlx();
    this.getDictAjzt();
    this.getDictRylx();
    this.getDictRyxb();
    this.getDictWpzl();
    this.getDictWpzt();
    this.getDossierSaveTypeDict();
    this.getDossierTypeDict();
    this.getCaseProcessDict();
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    this.getDepTree(newjigouArea.department);
    this.getBaqTree();
  }

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
  // 获取办案区树
  getBaqTree = () => {
    this.props.dispatch({
      type: 'common/getBaqTree',
      payload: {},
    });
  };
  // 获取案件类型
  getDictAjlx = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5300',
        },
        showCount: 999,
      },
    });
  };
  // 获取案件状态
  getDictAjzt = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5303',
        },
        showCount: 999,
      },
    });
  };
  // 获取物品种类
  getDictWpzl = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5308',
        },
        showCount: 999,
      },
    });
  };
  // 获取物品状态
  getDictWpzt = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5315',
        },
        showCount: 999,
      },
    });
  };
  // 获取人员类型
  getDictRylx = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5321',
        },
        showCount: 999,
      },
    });
  };
  // 获取人员性别
  getDictRyxb = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5324',
        },
        showCount: 999,
      },
    });
  };
  // 获取卷宗类型字典
  getDossierTypeDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '1215',
        },
        showCount: 999,
      },
    });
  };
  // 获取办案环节字典
  getCaseProcessDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '500837',
        },
        showCount: 999,
      },
    });
  };
  // 获取卷宗存储状态字典
  getDossierSaveTypeDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '500842',
        },
        showCount: 999,
      },
    });
  };
  // tab页onChange
  onTabChange = activeKey => {
    this.setState({
      activeKey,
    });
  };
  // 关闭tab页面
  onTabEdit = (targetKey, action) => {
    this[action](targetKey); // this.remove()targetKey;
  };
  // 关闭页面链接的函数
  remove = targetKey => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.arrayDetail.forEach((pane, i) => {
      if (pane.key === targetKey) {
        if (i === 0) {
          lastIndex = 0;
        } else {
          lastIndex = i - 1;
        }
      }
    });
    const panes = this.state.arrayDetail.filter(pane => pane.key !== targetKey);
    if (panes.length > 0) {
      if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = panes[lastIndex].key;
      }
      this.setState({
        arrayDetail: panes,
        activeKey: activeKey,
      });
    } else {
      this.setState({
        arrayDetail: panes,
        activeKey: '0',
      });
    }
  };
  // 打开新的详情页面
  newDetail = addDetail => {
    let newDetail = [];
    let isDetail = true;
    newDetail = [...this.state.arrayDetail];
    for (let a = 0; a < newDetail.length; a++) {
      if (addDetail.key === newDetail[a].key) {
        isDetail = false;
      }
    }
    if (isDetail) {
      newDetail.push(addDetail);
      this.setState({
        arrayDetail: newDetail,
        activeKey: addDetail.key,
      });
    } else {
      this.setState({
        activeKey: addDetail.key,
      });
    }
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
  // 渲染办案区树
  renderBaqloop = data =>
    data.map(item => {
      // let obj = {
      //     id: item.code,
      //     label: item.name,
      // };
      // let objStr = JSON.stringify(obj);
      if (item.children && item.children.length) {
        return (
          <TreeNode
            value={item.name}
            key={item.id}
            title={item.name}
            selectable={item.code === 'null'}
          >
            {this.renderBaqloop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          value={item.name}
          title={item.name}
          selectable={item.code === 'null'}
        />
      );
    });
  // 办案单位
  onBadwChange = (val, label) => {
    this.setState({
      badwValue: val,
    });
    const that = this;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = val;
    timeout = setTimeout(function() {
      if (currentValue === val) {
        that.getSearchData();
      }
    }, 1000);
  };
  // 办案区
  onBaqChange = (val, label) => {
    this.setState({
      baqValue: val,
    });
    const that = this;
    if (timeoutBaq) {
      clearTimeout(timeoutBaq);
      timeoutBaq = null;
    }
    currentValueBaq = val;
    timeoutBaq = setTimeout(function() {
      if (currentValueBaq === val) {
        that.getSearchData();
      }
    }, 1000);
  };
  // 获取用户所属机构及管辖机构
  getBelongDep = () => {
    const {
      userInfo: { department, geographicalLevel, groupList },
    } = this.state;
    let depStr = department;
    const shouldArry = [];
    if (geographicalLevel === 0) {
      depStr = department.substring(0, 2);
    } else if (geographicalLevel === 1) {
      depStr = department.substring(0, 4);
    } else if (geographicalLevel === 2) {
      depStr = department.substring(0, 6);
    }
    shouldArry.push({
      wildcard: {
        searchdwcode: depStr + '*',
      },
    });
    if (groupList.length > 0) {
      for (let i = 0; i < groupList.length; i++) {
        shouldArry.push({
          wildcard: {
            searchdwcode: groupList[i].code + '*',
          },
        });
      }
    }
    return shouldArry;
  };
  // 查询es
  getSearchData = () => {
    const {
      searchType,
      rangePickerValue,
      ajlxValue,
      ajztValue,
      wpzlValue,
      wpztValue,
      rylxValue,
      ryxbValue,
      searchInput,
      badwValue,
      baqValue,
      personQueryIndex,
      itemsQueryIndex,
      caseQueryIndex,
      baqQueryIndex,
      dossierQueryIndex,
      jzlbValue,
      ccztValue,
      ajhjValue,
      jzdzjValue,
    } = this.state;
    const searchArry = [];
    let searchTypeUrl = `${caseQueryIndex},${itemsQueryIndex},${personQueryIndex},${baqQueryIndex},${dossierQueryIndex}`;
    /*---------------------------------------------基础、案件查询----------------------------------------------------------*/
    // 立案日期
    let dateValue = null;
    if (rangePickerValue.length > 0 && rangePickerValue[0] !== '' && rangePickerValue[1] !== '') {
      dateValue = {
        range: {
          lasj: {
            gte: moment(rangePickerValue[0]).format('YYYY-MM-DD'),
            lte: moment(rangePickerValue[1]).format('YYYY-MM-DD'),
          },
        },
      };
      searchArry.push(dateValue);
    }
    // 案件状态
    // if (ajztValue !== null) {
    //     searchArry.push(ajztValue)
    // }
    // 案件类型
    if (ajlxValue !== null) {
      searchArry.push(ajlxValue);
    }
    // 办案单位
    let should = { should: this.getBelongDep() };
    let minimum_should_match = {
      minimum_should_match: 1,
    };
    if (badwValue.length > 0) {
      let badwSearchValue = [];
      for (let i in badwValue) {
        badwSearchValue.push({
          wildcard: {
            allorgcode: '*' + badwValue[i] + '*',
          },
        });
      }
      should = {
        should: [...should.should, ...badwSearchValue],
      };
    }
    if (ajztValue !== null) {
      let ajztValueArry = [];
      // searchArry.push(ajztValue)
      if (ajztValue.wildcard.ajztmc === '受案' || ajztValue.wildcard.ajztmc === '受理') {
        ajztValueArry = [
          {
            wildcard: {
              ajztmc: '受案',
            },
          },
          {
            wildcard: {
              ajztmc: '受理',
            },
          },
        ];
      } else {
        ajztValueArry.push(ajztValue);
      }
      searchArry.push({
        bool: {
          should: ajztValueArry,
        },
      });
      // should = {
      //     should: [...should.should, ...ajztValueArry],
      // };
    }
    /*---------------------------------------------办案区查询----------------------------------------------------------*/
    if (searchType === 'baq') {
      searchTypeUrl = baqQueryIndex;
      // 办案区
      let baqSearchValue = null;
      if (baqValue.length > 0) {
        // const str = baqValue.join(' ');
        // baqSearchValue = {
        //     match: {
        //         'baqmc': str,
        //     },
        // }
        // searchArry.push(baqSearchValue)
        let baqSearchValue = [];
        for (let i in baqValue) {
          baqSearchValue.push({
            wildcard: {
              baqmc: baqValue[i],
            },
          });
        }
        should = {
          should: [...should.should, ...baqSearchValue],
        };
      }
    }
    /*---------------------------------------------涉案人员查询----------------------------------------------------------*/
    if (searchType === 'sary') {
      searchTypeUrl = personQueryIndex;
      if (rylxValue !== null) {
        searchArry.push(rylxValue);
      }
      if (ryxbValue !== null) {
        searchArry.push(ryxbValue);
      }
    }
    /*---------------------------------------------涉案物品查询----------------------------------------------------------*/
    if (searchType === 'wp') {
      searchTypeUrl = itemsQueryIndex;
      // 物品
      if (wpztValue !== null) {
        searchArry.push(wpztValue);
      }
      if (wpzlValue !== null) {
        searchArry.push(wpzlValue);
      }
    }
    /*---------------------------------------------案件查询----------------------------------------------------------*/
    if (searchType === 'aj') {
      searchTypeUrl = caseQueryIndex;
    }
    /*---------------------------------------------卷宗查询----------------------------------------------------------*/
    if (searchType === 'jz') {
      searchTypeUrl = dossierQueryIndex;
      if (jzlbValue !== null) {
        searchArry.push(jzlbValue);
      }
      if (ccztValue !== null) {
        searchArry.push(ccztValue);
      }
      if (ajhjValue !== null) {
        searchArry.push(ajhjValue);
      }
      if (jzdzjValue !== null) {
        searchArry.push(jzdzjValue);
      }
    }

    // 搜索框查询值
    if (searchInput !== null) {
      searchArry.push(searchInput);
    }
    let queryData = '';
    // if (searchArry[0].match.ajztmc === "受案" || searchArry[0].match.ajztmc === "受理") {
    //     queryData = {
    //         query: {
    //             bool: {
    //                 must: [],
    //                 should: [
    //                     {
    //                         wildcard: {
    //                             ajztmc: '受案',
    //                         },
    //                     },
    //                     {
    //                         wildcard: {
    //                             ajztmc: '受理',
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //         from: 0,
    //         size: 1000,
    //         sort: {
    //             zxxgsj: {
    //                 order: 'desc',
    //             },
    //             sasj: {
    //                 order: 'desc',
    //             },
    //         },
    //     }
    // }
    // else {
    queryData = {
      query: {
        bool: {
          must: searchArry,
          ...should,
          ...minimum_should_match,
        },
      },
      from: 0,
      size: 1000,
      sort: {
        zxxgsj: {
          order: 'desc',
        },
        sasj: {
          order: 'desc',
        },
      },
    };
    // }

    this.props.dispatch({
      type: 'generalQuery/getSearchDataNew',
      payload: {
        pd: queryData,
        searchTypeUrl,
      },
      callback: data => {
        if (data) {
          const hits = data.hits.hits;
          if (hits) {
            this.setState({
              searchResults: hits,
              isClearData: false,
              autoCom: false,
            });
          }
        }
      },
    });
  };
  handleValue = e => {
    this.getRes(e);
    this.setState({
      searchInputValue: e,
    });
  };
  // 点击搜索按钮
  handleSearch = val => {
    this.setState({
      res: [],
    });
    this.setState({
      autoCom: true,
    });
    if (val && val.length > 0) {
      this.getSaveContent(val);
    }
    let searchInput = null;
    const newArry = [];
    let inputArry = val.split(' ');
    for (let key in inputArry) {
      if (inputArry[key] !== '') {
        newArry.push(`*${inputArry[key]}*`);
      }
    }
    if (newArry.length > 0) {
      searchInput = {
        query_string: {
          query: newArry.join(' '),
        },
      };
    }
    this.setState(
      {
        searchInput,
      },
      () => {
        if (this.state.searchType === '') {
          this.searchType('all');
        } else {
          this.getSearchData();
        }
      },
    );
  };
  //保存搜索内容信息
  getSaveContent = value => {
    this.props.dispatch({
      type: 'generalQuery/getSaveSsNrXX',
      payload: {
        ssnr: value,
      },
    });
  };
  // 查询类别
  searchType = type => {
    this.setState(
      {
        searchType: type === 'all' ? type : type.target.value,
        current: 1,
      },
      this.getSearchData,
    );
  };
  // 时间区域选择控件
  handleRangePickerChange = rangePickerValue => {
    this.setState(
      {
        rangePickerValue,
        searchLarq: '',
      },
      this.getSearchData,
    );
  };
  // 查询案件类型
  searchAjlx = e => {
    const val = e.target.value;
    let ajlxValue = null;
    if (val !== '全部') {
      ajlxValue = {
        match: {
          ajlxmc: val,
        },
      };
    }
    this.setState(
      {
        ajlxValue,
      },
      this.getSearchData,
    );
  };
  // 查询案件状态
  searchAjzt = e => {
    const val = e.target.value;
    let ajztValue = null;
    if (val !== '全部') {
      ajztValue = {
        // match: {
        //     ajztmc: val,
        // },

        wildcard: {
          ajztmc: val,
        },
      };
    }
    this.setState(
      {
        ajztValue,
      },
      this.getSearchData,
    );
  };
  // 查询物品种类
  searchWpzl = e => {
    const val = e.target.value;
    let wpzlValue = null;
    if (val !== '全部') {
      wpzlValue = {
        match: {
          wpzlmc: val,
        },
      };
    }
    this.setState(
      {
        wpzlValue,
      },
      this.getSearchData,
    );
  };
  // 查询物品状态
  searchWpzt = e => {
    const val = e.target.value;
    let wpztValue = null;
    if (val !== '全部') {
      wpztValue = {
        match: {
          wpztmc: val,
        },
      };
    }
    this.setState(
      {
        wpztValue,
      },
      this.getSearchData,
    );
  };
  // 查询人员类型
  searchRylx = e => {
    const val = e.target.value;
    let rylxValue = null;
    if (val !== '全部') {
      rylxValue = {
        match: {
          rylxmc: val,
        },
      };
    }
    this.setState(
      {
        rylxValue,
      },
      this.getSearchData,
    );
  };
  // 查询卷宗类别
  searchJzlb = e => {
    const val = e.target.value;
    let jzlbValue = null;
    if (val !== '全部') {
      jzlbValue = {
        match: {
          jzlb_bm: val,
        },
      };
    }
    this.setState(
      {
        jzlbValue,
      },
      this.getSearchData,
    );
  };
  // 查询卷宗存储状态
  searchJzCczt = e => {
    const val = e.target.value;
    let ccztValue = null;
    if (val !== '全部') {
      ccztValue = {
        match: {
          cczt_bm: val,
        },
      };
    }
    this.setState(
      {
        ccztValue,
      },
      this.getSearchData,
    );
  };
  // 查询办案环节
  searchJzBahj = e => {
    const val = e.target.value;
    let ajhjValue = null;
    if (val !== '全部') {
      ajhjValue = {
        match: {
          ajhj_bm: val,
        },
      };
    }
    this.setState(
      {
        ajhjValue,
      },
      this.getSearchData,
    );
  };
  // 查询卷宗电子卷
  searchJzdzj = e => {
    const val = e.target.value;
    let jzdzjValue = null;
    if (val !== '全部') {
      jzdzjValue = {
        match: {
          is_gldzjdm: val,
        },
      };
    }
    this.setState(
      {
        jzdzjValue,
      },
      this.getSearchData,
    );
  };
  // 查询人员性别
  searchRyxb = e => {
    const val = e.target.value;
    let ryxbValue = null;
    if (val !== '全部') {
      ryxbValue = {
        match: {
          ryxb: val,
        },
      };
    }
    this.setState(
      {
        ryxbValue,
      },
      this.getSearchData,
    );
  };
  // 查询立案日期
  searchLarq = e => {
    const type = e.target.value;
    const time = getTimeDistance(type);
    this.setState(
      {
        rangePickerValue: time,
        searchLarq: type,
      },
      this.getSearchData,
    );
  };
  // 查看查询结果详细信息
  searchResultCheckOut = item => {
    // const { caseQueryIndex, baqQueryIndex, itemsQueryIndex, personQueryIndex, dossierQueryIndex } = this.state;
    // if (item._index === caseQueryIndex) {
    //     if (item._source.ajbh && item._source.ajbh !== '暂无') {
    //         if (item._source.ajlxmc === '刑事') {
    //             const divs = (
    //                 <div>
    //                     <XsajDetail
    //                         {...this.props}
    //                         newDetail={this.newDetail}
    //                         id={item._source.ajbh}
    //                     />
    //                 </div>
    //             );
    //             const AddNewDetail = { title: '刑事案件详情', content: divs, key: item._source.ajbh };
    //             this.newDetail(AddNewDetail);
    //         } else {
    //             const divs = (
    //                 <div>
    //                     <XzajDetail
    //                         {...this.props}
    //                         newDetail={this.newDetail}
    //                         systemId={item._source.ajbh}
    //                     />
    //                 </div>
    //             );
    //             const AddNewDetail = { title: '行政案件详情', content: divs, key: item._source.ajbh };
    //             this.newDetail(AddNewDetail);
    //         }
    //     } else {
    //         message.warning('暂无相关信息！');
    //     }
    // } else if (item._index === itemsQueryIndex) {
    //     if (item._source.systemid && item._source.systemid !== '暂无') {
    //         const divs = (
    //             <div>
    //                 <WpDetail
    //                     {...this.props}
    //                     newDetail={this.newDetail}
    //                     id={item._source.systemid}
    //                 />
    //             </div>
    //         );
    //         const AddNewDetail = { title: '涉案物品详情', content: divs, key: item._source.systemid };
    //         this.newDetail(AddNewDetail);
    //     } else {
    //         message.warning('暂无相关信息！');
    //     }
    //
    // } else if (item._index === personQueryIndex) {
    //     if (item._source.ryzjhm && item._source.ryxm && item._source.ryzjhm !== '暂无' && item._source.ryxm !== '暂无') {
    //         const divs = (
    //             <div>
    //                 <PersonDetail
    //                     {...this.props}
    //                     newDetail={this.newDetail}
    //                     idcard={item._source.ryzjhm}
    //                     name={item._source.ryxm}
    //                     ly='常规数据'
    //                 />
    //             </div>
    //         );
    //         const AddNewDetail = { title: '人员档案', content: divs, key: item._source.ryzjhm + 'ryda' };
    //         this.newDetail(AddNewDetail);
    //     } else {
    //         message.warning('暂无相关信息！');
    //     }
    // } else if (item._index === baqQueryIndex) {
    //     if (item._source.ryzjhm && item._source.ajbh && item._source.ryzjhm !== '暂无' && item._source.ajbh !== '暂无') {
    //         const divs = (
    //             <div>
    //                 <PersonIntoArea
    //                     {...this.props}
    //                     newDetail={this.newDetail}
    //                     sfzh={item._source.ryzjhm}
    //                     ajbh={item._source.ajbh}
    //                 />
    //             </div>
    //         );
    //         const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: item._source.ryzjhm + 'rqxx' };
    //         this.newDetail(AddNewDetail);
    //     } else {
    //         message.warning('暂无相关信息！');
    //     }
    //
    // } else if (item._index === dossierQueryIndex) {
    //     if (item._source.systemid && item._source.ajbh && item._source.systemid !== '暂无' && item._source.ajbh !== '暂无') {
    //         const divs = (
    //             <div>
    //                 <DossierDetail
    //                     {...this.props}
    //                     id={item._source.systemid}
    //                     newDetail={this.newDetail}
    //                 />
    //             </div>
    //         );
    //         const addDetail = { title: '卷宗详情', content: divs, key: item._source.systemid };
    //         this.newDetail(addDetail);
    //     } else {
    //         message.warning('暂无相关信息！');
    //     }
    // }
  };
  // 展开搜索区域
  showSearchDetail = () => {
    this.setState({
      showSearchDetail: !this.state.showSearchDetail,
    });
  };
  // 清空所有选项
  clearAll = () => {
    this.setState(
      {
        ajlxValue: null, // 案件类型
        ajztValue: null, // 案件状态
        wpzlValue: null, // 物品种类
        wpztValue: null, // 物品类型
        rylxValue: null, // 人员类型
        ryxbValue: null, // 人员性别
        searchInput: null, // 搜索框
        jzlbValue: null,
        ccztValue: null,
        ajhjValue: null,
        jzdzjValue: null,
        searchType: 'all',
        rangePickerValue: [],
        badwValue: [],
        baqValue: [],
        searchLarq: '',
        searchInputValue: null,
        isClearData: true,
      },
      this.getSearchData,
    );
  };
  // 展示卷宗办案环节图片
  showDossierImage = item => {
    switch (item.ajhj_bm) {
      case '0': // 在侦在办
        return <img className={styles.searchResultImage} src={zjzbImg} />;
      case '1': // 久侦未决
        return <img className={styles.searchResultImage} src={jzwjImg} />;
      case '2': // 玩结
        return <img className={styles.searchResultImage} src={wjImg} />;
      case '3': // 其他
        return <img className={styles.searchResultImage} src={qtImg} />;
    }
  };
  // 创建card组件
  creatCardComponent = item => {
    const {
      caseQueryIndex,
      itemsQueryIndex,
      personQueryIndex,
      baqQueryIndex,
      dossierQueryIndex,
    } = this.state;
    if (item._index === caseQueryIndex) {
      return (
        <Card bodyStyle={{ padding: 0 }}>
          <div className={styles.searchResaultArea}>
            <div className={styles.ajCardTitle}>案件</div>
            <div className={styles.cardBody}>
              <div className={styles.cardBodyName}>{item._source ? item._source.ajmc : ''}</div>
              <div className={styles.cardBodyContent}>
                <span>{item._source ? `${item._source.ajbh}，` : ''}</span>
                <span>{item._source ? `${item._source.ajztmc}，` : ''}</span>
                <span>{item._source ? `${item._source.afdd}` : ''}</span>
              </div>
            </div>
            <div
              className={styles.searchResultCheckOut}
              onClick={() => this.searchResultCheckOut(item)}
            >
              查看
            </div>
            {item._source && item._source.ajlxmc === '刑事' ? (
              <img className={styles.searchResultImage} src={xsajImg} />
            ) : (
              <img className={styles.searchResultImage} src={xzajImg} />
            )}
          </div>
        </Card>
      );
    } else if (item._index === itemsQueryIndex) {
      return (
        <Card bodyStyle={{ padding: 0 }}>
          <div className={styles.searchResaultArea}>
            <div className={styles.sawpCardTitle}>涉案物品</div>
            <div className={styles.cardBody}>
              <div className={styles.cardBodyName}>{item._source ? item._source.wpmc : ''}</div>
              <div className={styles.cardBodyContent}>
                <span>{item._source ? `${item._source.wpzlmc}，` : ''}</span>
                <span>{item._source ? `${item._source.wpztmc}，` : ''}</span>
                <span>{item._source ? `${item._source.kwxx || ''}` : ''}</span>
              </div>
            </div>
            <div
              className={styles.searchResultCheckOut}
              onClick={() => this.searchResultCheckOut(item)}
            >
              查看
            </div>
          </div>
        </Card>
      );
    } else if (item._index === personQueryIndex) {
      return (
        <Card bodyStyle={{ padding: 0 }}>
          <div className={styles.searchResaultArea}>
            <div className={styles.saryCardTitle}>涉案人员</div>
            <div className={styles.cardBody}>
              <div className={styles.cardBodyName}>{item._source ? item._source.ryxm : ''}</div>
              <div className={styles.cardBodyContent}>
                <span>{item._source ? `${item._source.ryxb}，` : ''}</span>
                <span>{item._source ? `${item._source.rynl}，` : ''}</span>
                <span>{item._source ? `${item._source.ryzjhm}，` : ''}</span>
                <span>{item._source ? `${item._source.ryjtzz}` : ''}</span>
              </div>
            </div>
            <div
              className={styles.searchResultCheckOut}
              onClick={() => this.searchResultCheckOut(item)}
            >
              查看
            </div>
          </div>
        </Card>
      );
    } else if (item._index === baqQueryIndex) {
      return (
        <Card bodyStyle={{ padding: 0 }}>
          <div className={styles.searchResaultArea}>
            <div className={styles.baqCardTitle}>办案区</div>
            <div className={styles.cardBody}>
              <div className={styles.cardBodyName}>{item._source ? item._source.ryxm : ''}</div>
              <div className={styles.cardBodyContent}>
                <span>{item._source ? `${item._source.ajmc || ''}，` : ''}</span>
                <span>{item._source ? `${item._source.ajbh || ''}，` : ''}</span>
                <span>{item._source ? `${item._source.baqmc || ''}，` : ''}</span>
                <span>{item._source ? `${item._source.rqyymc || ''}，` : ''}</span>
                <span>{item._source ? `${item._source.jrsj || ''}` : ''}</span>
              </div>
            </div>
            <div
              className={styles.searchResultCheckOut}
              onClick={() => this.searchResultCheckOut(item)}
            >
              查看
            </div>
          </div>
        </Card>
      );
    } else if (item._index === dossierQueryIndex) {
      return (
        <Card bodyStyle={{ padding: 0 }}>
          <div className={styles.searchResaultArea}>
            <div className={styles.jzCardTitle}>卷宗</div>
            <div className={styles.cardBody}>
              <div className={styles.cardBodyName}>{item._source ? item._source.jzlb_mc : ''}</div>
              <div className={styles.cardBodyContent}>
                <span>{item._source ? `${item._source.ajbh || ''}，` : ''}</span>
                <span>{item._source ? `${item._source.ajmc || ''}，` : ''}</span>
                <span>{item._source ? `${item._source.afdd || ''}` : ''}</span>
              </div>
            </div>
            <div
              className={styles.searchResultCheckOut}
              onClick={() => this.searchResultCheckOut(item)}
            >
              查看
            </div>
            {item._source ? this.showDossierImage(item._source) : null}
          </div>
        </Card>
      );
    }
  };
  getRes = value => {
    this.setState({
      res: [],
    });
    this.props.dispatch({
      type: 'generalQuery/getssNrXX',
      payload: {
        ssnr: value,
      },
      callback: res => {
        this.setState({
          res: res.data.list,
        });
      },
    });
  };
  getFocus = () => {
    setTimeout(() => {
      if (!this.state.autoCom) {
        this.getRes(this.state.searchInputValue ? this.state.searchInputValue : '');
      }
    }, 10);
  };

  render() {
    const {
      searchType,
      rangePickerValue,
      searchResults,
      showSearchDetail,
      ajlxRadioValue,
      ajlxValue,
      ajztValue,
      wpzlValue,
      wpztValue,
      rylxValue,
      ryxbValue,
      searchInput,
      badwValue,
      baqValue,
      searchLarq,
      searchInputValue,
      current,
      isClearData,
      jzlbValue,
      ccztValue,
      ajhjValue,
      jzdzjValue,
      treeDefaultExpandedKeys,
    } = this.state;
    const {
      common: {
        searchAjlx,
        searchAjzt,
        searchWpzl,
        searchWpzt,
        searchRylx,
        searchRyxb,
        depTree,
        baqTree,
        dossierType,
        caseProcessDict,
        dossierSaveTypeDict,
      },
      loading,
    } = this.props;
    const newAddDetail = this.state.arrayDetail;
    const searchAjlxGroup =
      searchAjlx.length > 0
        ? searchAjlx.map(item => {
            return (
              <RadioButton key={item.code} value={item.name}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const searchAjztGroup =
      searchAjzt.length > 0
        ? searchAjzt.map(item => {
            return (
              <RadioButton key={item.code} value={item.name}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const searchWpzlGroup =
      searchWpzl.length > 0
        ? searchWpzl.map(item => {
            return (
              <RadioButton key={item.code} value={item.name}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const searchWpztGroup =
      searchWpzt.length > 0
        ? searchWpzt.map(item => {
            return (
              <RadioButton key={item.code} value={item.name}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const searchRylxGroup =
      searchRylx.length > 0
        ? searchRylx.map(item => {
            return (
              <RadioButton key={item.code} value={item.name}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const dossierTypeGroup =
      dossierType.length > 0
        ? dossierType.map(item => {
            return (
              <RadioButton key={item.code} value={item.code}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const dossierSaveTypeDictGroup =
      dossierSaveTypeDict.length > 0
        ? dossierSaveTypeDict.map(item => {
            return (
              <RadioButton key={item.code} value={item.code}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const caseProcessDictGroup =
      caseProcessDict.length > 0
        ? caseProcessDict.map(item => {
            return (
              <RadioButton key={item.code} value={item.code}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    const searchRyxbGroup =
      searchRyxb.length > 0
        ? searchRyxb.map(item => {
            return (
              <RadioButton key={item.code} value={item.name}>
                {item.name}
              </RadioButton>
            );
          })
        : null;
    let dataSource = this.state.res.map(e => <Option key={e.ssnr}>{e.ssnr}</Option>);
    return (
      <div className={stylescommon.statistics}>
        <Affix offsetTop={0}>
          <div className={styles.searchArea}>
            <AutoComplete
              defaultActiveFirstOption={false}
              dataSource={this.state.autoCom ? [] : dataSource}
              style={{ width: '40%' }}
              onSearch={this.handleValue}
            >
              <Search
                placeholder="默认搜索一个月内同步来的最新数据"
                enterButton="搜索"
                size="large"
                value={searchInputValue}
                onSearch={this.handleSearch}
                onFocus={this.getFocus}
              />
            </AutoComplete>
          </div>
        </Affix>
        <Card className={stylescommon.cardArea} style={{ padding: '5px 0' }} id={'formSearch'}>
          <div className={styles.searchConditionArea}>
            <div className={styles.searchType}>
              {/*<a className={searchType === 'all' ? styles.chosenType : null}*/}
              {/*   onClick={() => this.searchType('all')}>全部</a>*/}
              {/*<a className={searchType === 'aj' ? styles.chosenType : null}*/}
              {/*   onClick={() => this.searchType('aj')}>案件</a>*/}
              {/*<a className={searchType === 'wp' ? styles.chosenType : null}*/}
              {/*   onClick={() => this.searchType('wp')}>涉案物品</a>*/}
              {/*<a className={searchType === 'sary' ? styles.chosenType : null}*/}
              {/*   onClick={() => this.searchType('sary')}>涉案人员</a>*/}
              {/*<a className={searchType === 'baq' ? styles.chosenType : null}*/}
              {/*   onClick={() => this.searchType('baq')}>办案区</a>*/}
              {/*<a className={searchType === 'jz' ? styles.chosenType : null}*/}
              {/*   onClick={() => this.searchType('jz')}>卷宗</a>*/}
              <Radio.Group buttonStyle="solid" onChange={this.searchType} defaultValue={'all'} value={this.state.searchType}>
                <Radio.Button value="all">全部</Radio.Button>
                <Radio.Button value="aj">案件</Radio.Button>
                <Radio.Button value="wp">涉案物品</Radio.Button>
                <Radio.Button value="sary">涉案人员</Radio.Button>
                <Radio.Button value="baq">办案区</Radio.Button>
                <Radio.Button value="jz">卷宗</Radio.Button>
              </Radio.Group>
              {this.state.showSearchDetail ? (
                <a className={styles.showSearchDetail} onClick={this.showSearchDetail}>
                  收起选项 <Icon type="up" />
                </a>
              ) : (
                <a className={styles.showSearchDetail} onClick={this.showSearchDetail}>
                  展开选项 <Icon type="down" />
                </a>
              )}
                <Divider type="vertical" />
              <a className={styles.showSearchDetail} onClick={this.clearAll}>清空所有条件</a>
            </div>
            {showSearchDetail ? (
              <div className={styles.searchDetails}>
                <div className={styles.singleConditionArea}>
                  <span className={styles.searchTitle}>案件类型：</span>
                  <RadioGroup
                    onChange={this.searchAjlx}
                    value={ajlxValue ? ajlxValue.match.ajlxmc : '全部'}
                  >
                    <RadioButton value="全部">全部</RadioButton>
                    {searchAjlxGroup}
                  </RadioGroup>
                </div>
                <div className={styles.singleConditionArea}>
                  <span className={styles.searchTitle}>立案日期：</span>
                  <RadioGroup onChange={this.searchLarq} value={searchLarq}>
                    <RadioButton value="today">本日</RadioButton>
                    <RadioButton value="week">本周</RadioButton>
                    <RadioButton value="month">本月</RadioButton>
                    <RadioButton value="year">本年</RadioButton>
                  </RadioGroup>
                </div>
                <div className={styles.singleConditionArea}>
                  <span className={styles.searchTitle}>其他：</span>
                  <RangePicker
                    value={rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    getCalendarContainer={() => document.getElementById('formSearch')}
                  />
                </div>
                <div className={styles.singleConditionArea}>
                  <span className={styles.searchTitle}>案件状态：</span>
                  <RadioGroup
                    onChange={this.searchAjzt}
                    value={ajztValue ? ajztValue.wildcard.ajztmc : '全部'}
                  >
                    <RadioButton value="全部">全部</RadioButton>
                    {searchAjztGroup}
                  </RadioGroup>
                </div>
                {searchType === 'wp' ? (
                  <div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>物品种类：</span>
                      <RadioGroup
                        onChange={this.searchWpzl}
                        value={wpzlValue ? wpzlValue.match['wpzlmc'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {searchWpzlGroup}
                      </RadioGroup>
                    </div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>物品状态：</span>
                      <RadioGroup
                        onChange={this.searchWpzt}
                        value={wpztValue ? wpztValue.match['wpztmc'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {searchWpztGroup}
                      </RadioGroup>
                    </div>
                  </div>
                ) : null}
                {searchType === 'sary' ? (
                  <div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>人员类型：</span>
                      <RadioGroup
                        onChange={this.searchRylx}
                        value={rylxValue ? rylxValue.match['rylxmc'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {searchRylxGroup}
                      </RadioGroup>
                    </div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>人员性别：</span>
                      <RadioGroup
                        onChange={this.searchRyxb}
                        value={ryxbValue ? ryxbValue.match['ryxb'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {searchRyxbGroup}
                      </RadioGroup>
                    </div>
                  </div>
                ) : null}
                {searchType === 'jz' ? (
                  <div>
                    <div
                      className={styles.singleConditionArea}
                      style={{ display: 'flex', alignItems: 'baseline' }}
                    >
                      <span className={styles.searchTitle}>卷宗类别：</span>
                      <RadioGroup
                        onChange={this.searchJzlb}
                        value={jzlbValue ? jzlbValue.match['jzlb_bm'] : '全部'}
                        style={{ width: 1000 }}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {dossierTypeGroup}
                      </RadioGroup>
                    </div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>存储状态：</span>
                      <RadioGroup
                        onChange={this.searchJzCczt}
                        value={ccztValue ? ccztValue.match['cczt_bm'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {dossierSaveTypeDictGroup}
                      </RadioGroup>
                    </div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>办案环节：</span>
                      <RadioGroup
                        onChange={this.searchJzBahj}
                        value={ajhjValue ? ajhjValue.match['ajhj_bm'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        {caseProcessDictGroup}
                      </RadioGroup>
                    </div>
                    <div className={styles.singleConditionArea}>
                      <span className={styles.searchTitle}>电子卷：</span>
                      <RadioGroup
                        onChange={this.searchJzdzj}
                        value={jzdzjValue ? jzdzjValue.match['is_gldzjdm'] : '全部'}
                      >
                        <RadioButton value="全部">全部</RadioButton>
                        <RadioButton value="1">有电子卷</RadioButton>
                        <RadioButton value="0">无电子卷</RadioButton>
                      </RadioGroup>
                    </div>
                  </div>
                ) : null}
                <div className={styles.singleConditionArea}>
                  <span className={styles.searchTitle}>办案单位：</span>
                  <TreeSelect
                    showSearch
                    style={{ width: '20%', marginLeft: 10 }}
                    // value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请输入办案单位"
                    allowClear
                    key="badwSelect"
                    multiple
                    value={badwValue}
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    onChange={this.onBadwChange}
                    getPopupContainer={() => document.getElementById('formSearch')}
                    treeNodeFilterProp="title"
                  >
                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                  </TreeSelect>
                </div>
                {searchType === 'baq' ? (
                  <div className={styles.singleConditionArea}>
                    <span className={styles.searchTitle}>办案区：</span>
                    <TreeSelect
                      showSearch
                      style={{ width: '20%', marginLeft: 10 }}
                      // value={this.state.value}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请输入办案区"
                      allowClear
                      key="baqSelect"
                      multiple
                      value={baqValue}
                      onChange={this.onBaqChange}
                      treeNodeFilterProp="title"
                      getPopupContainer={() => document.getElementById('formSearch')}
                    >
                      {baqTree.length > 0 ? this.renderBaqloop(baqTree) : null}
                    </TreeSelect>
                  </div>
                ) : null}
                {/*<div style={{ textAlign: 'center', paddingTop: 50, paddingBottom: 20 }}>*/}
                {/*    <span className={styles.clearAll} onClick={this.clearAll}>清空所有条件</span>*/}
                {/*</div>*/}
              </div>
            ) : null}
          </div>
          <div style={{ padding: '24px' }}>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
              dataSource={searchResults}
              loading={loading}
              pagination={
                searchResults.length > 0
                  ? {
                      pageSize: 9,
                      current,
                      showTotal: (total, range) => (
                        <div style={{ position: 'absolute',left:'5px',color:'#b7b7b7' }}>
                          共 {Math.ceil(total / 9)} 页，{total}条数据
                        </div>
                      ),
                      onChange: page => {
                        this.setState({ current: page });
                      },
                    }
                  : null
              }
              renderItem={item => <List.Item>{this.creatCardComponent(item)}</List.Item>}
              locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
            />
          </div>
        </Card>
      </div>
    );
  }
}
