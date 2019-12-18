/*
*  UndossierData/index.js 卷宗问题告警
*  author：jhm
*  20181205
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Form,
    Select,
    Table,
    TreeSelect,
    Input,
    Button,
    DatePicker,
    Tabs,
    message,
    Divider,
    Dropdown, Menu, Tooltip, Icon, Empty,
} from 'antd';
import moment from 'moment/moment';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from '../../common/listPage.less';
import { exportListDataMaxDays, getUserInfos, tableList, userResourceCodeDb } from '../../../utils/utils';
// import UnDossierDetail from './UnDossierDetail';
// import ShareModal from '../../../src/components/ShareModal/ShareModal';
// import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';
import UnDossierDataView from '../../../components/UnDossierRealData/UnDossierDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import MessageState from '../../../components/Common/MessageState';
import { authorityIsTrue } from '../../../utils/authority';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";

const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;

let timeout;
let currentValue;

@connect(({ UnDossierData, loading, common }) => ({
  UnDossierData,
  common,
  loading: loading.models.UnDossierData,
}))
@Form.create()

export default class Index extends PureComponent {
  state = {
    ajlx: '', // 案件类型
    formValues: {}, // 查询条件
    activeKey: '0',
    arrayDetail: [],
    allPolice: [], // 办案人
    // bahj: '', // 办案环节
    jzlb: '', // 卷宗类别
    wtlx: '',
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '卷宗信息',
    tzlx: 'jzwt',
    sx: '',
    current: '',
    DossierDetail: '',
    NewDossierDetail: '',
    // 督办模态框
    superviseVisibleModal: false,
    superviseWtlx: '',
    superviseZrdw: '',
    superviseZrr: '',
    superviseZrdwId: '',
    id: '',
    sfzh: '',
    opendata: '',
    NowDataPage: '', // 督办完成时当前督办的数据在第几页
    NowShowCount: '', // 督办完成时当前督办的数据每页显示几条
    wtid: '',
    is_tz: '0',
    showDataView: true, // 控制显示图表或者列表（true显示图表）
    isDb: authorityIsTrue(userResourceCodeDb.dossier), // 督办权限
    selectedDateVal: null, // 手动选择的日期
    selectedDeptVal: '', // 手动选择机构
    typeButtons: 'day', // 图表展示类别（week,month）
    treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
    dbzt: '00',
    searchHeight: false, // 查询条件展开筛选
  };

  componentDidMount() {
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    this.getDepTree(newjigouArea.department);
    if (this.props.location.query && this.props.location.query.id) {
      // this.newDetail(this.props.location.query.id, this.props.location.query.wtid, this.props.location.query.system_id);
      this.setState({
        showDataView: false,
      });
    }
    this.getAllList(this.props);
    this.getSuperviseStatusDict();
    this.getWtlxDictionary();
    this.getRectificationStatusDict();
    this.getDossierSaveTypeDict();
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps',nextProps);
    if(nextProps.history.location.query.isReset&&nextProps.history.location.pathname==='/dossierPolice/DossierPolice'){
      this.getAllList(nextProps);
      this.props.history.replace(nextProps.history.location.pathname);
    }
  }

  getAllList = (props) =>{
      if (props.location.state && props.location.state.code) {
          this.setState({
              showDataView: false,
              dbzt: '',
              badw: props.location.state.code,
              gjsj:  [props.location.state.kssj ? moment(props.location.state.kssj) : null, props.location.state.jssj ? moment(props.location.state.jssj) : null],
          });
          this.props.form.setFieldsValue({
              bar: props.location.state.bar_name,
          });
          const formValues = {
              badw: props.location.state.code,
              gjsj_ks: props.location.state.kssj,
              gjsj_js: props.location.state.jssj,
              is_tz: props.location.state.is_tz ? props.location.state.is_tz : '1',
              bar:props.location.state.bar_name || '',
          };
          this.setState({
              formValues,
              is_tz: props.location.state.is_tz ? props.location.state.is_tz : '1',
          });
          const params = {
              currentPage: 1,
              showCount: tableList,
              pd: {
                  ...formValues,
              },
          };
          this.getDossier(params);
      }
      else if(props.history.location.query.isReset){
        this.setState({
          dbzt: '',
        });
        const formValues = {

        };
        this.setState({
          formValues,
        });
        const params = {
          currentPage: 1,
          showCount: tableList,
          pd: {
            ...formValues,
          },
        };
        this.getDossier(params);
      }
      else {
         this.getDossier();
      }
    }

  // 切换tab
  onTabChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  };
  // 关闭页面
  onTabEdit = (targetKey, action) => {
    this[action](targetKey);  // this.remove(targetKey);
  };
  // 关闭页面链接的函数
  remove = (targetKey) => {
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
  // 获取卷宗数据
  getDossier = (param) => {
    const defaultParams = {
      currentPage: 1,
      showCount: tableList,
      pd: {
        dbzt: '00',
      },
    };
    this.props.dispatch({
      type: 'UnDossierData/getDossierData',
      payload: param || defaultParams,
      callback: (data) => {
        if (data) {
          this.setState({
            DossierDetail: data,
          });
        }
      },
    });
  };
  getWtlxDictionary = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '5007725',
        },
        showCount: 999,
      },
    });
  };
  // 获取督办状态
  getSuperviseStatusDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '2039',
        },
        showCount: 999,
      },
    });
  };
  // 获取整改完毕状态
  getRectificationStatusDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: '500740',
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
  // 获取机构树
  getDepTree = (area) => {
    const areaNum = [];
    if (area) {
      areaNum.push(area);
    }
    this.props.dispatch({
      type: 'common/getDepTree',
      payload: {
        departmentNum: areaNum,
      },
      callback: (data) => {
        if (data) {
          this.setState({
            treeDefaultExpandedKeys: [data[0].code],
          });
        }
      },
    });
  };
  // 获取所有警员
  getAllPolice = (name) => {
    const that = this;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = name;
    timeout = setTimeout(() => {
      that.props.dispatch({
        type: 'common/getAllPolice',
        payload: {
          search: name,
        },
        callback: (data) => {
          if (data && (currentValue === name)) {
            that.setState({
              allPolice: data.slice(0, 50),
            });
          }
        },
      });
    }, 300);

  };

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      formValues: {
        dbzt: '00',
      },
      dbzt: '00',
      badw: null,
      gjsj: null,
    });
    this.getDossier();
  };
  // 导出
  exportData = () => {
    const values = this.props.form.getFieldsValue();
    const gjsjTime = values.gjsj;
    const formValues = {
      wtlx_id: values.wtlx || '',
      ajlx: values.ajlx || '',
      ajmc: values.ssaj || '',
      badw: values.bardw || '',
      bar: values.bar || '',
      cczt: values.cczt || '',
      dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
      cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
      csfs: values.csfs || '',
      gjsj_ks: gjsjTime && gjsjTime.length > 0 ? gjsjTime[0].format('YYYY-MM-DD') : '',
      gjsj_js: gjsjTime && gjsjTime.length > 0 ? gjsjTime[1].format('YYYY-MM-DD') : '',
    };
    if (gjsjTime && gjsjTime.length > 0) {
      const isAfterDate = moment(formValues.gjsj_js).isAfter(moment(formValues.gjsj_ks).add(exportListDataMaxDays, 'days'));
      if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
        message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
      } else {
        this.props.dispatch({
          type: 'common/exportData',
          payload: {
            tableType: '31',
            ...formValues,
          },
          callback: (data) => {
            if (data.text) {
              message.error(data.text);
            } else {
              window.open(configUrl.serverUrl + data.url);
            }
          },
        });
      }
    } else {
      message.warning(`请选择需要导出的数据日期，日期间隔需小于${exportListDataMaxDays}天`);
    }

  };

  // 查询
  handleSearch = (e) => {
    if (e) e.preventDefault();
    const values = this.props.form.getFieldsValue();
    const gjsjTime = values.gjsj;
    const formValues = {
      wtlx_id: values.wtlx || '',
      ajlx: values.ajlx || '',
      ajmc: values.ssaj || '',
      badw: values.bardw || '',
      bar: values.bar || '',
      cczt: values.cczt || '',
      dbzt: values.dbzt && values.dbzt.dbzt ? values.dbzt.dbzt : '',
      cljg_dm: values.dbzt && values.dbzt.zgzt ? values.dbzt.zgzt : '',
      csfs: values.csfs || '',
      gjsj_ks: gjsjTime && gjsjTime.length > 0 && gjsjTime[0]? gjsjTime[0].format('YYYY-MM-DD') : '',
      gjsj_js: gjsjTime && gjsjTime.length > 0 && gjsjTime[1]? gjsjTime[1].format('YYYY-MM-DD') : '',
      is_tz: this.state.is_tz,
    };
    this.setState({
      formValues,
    });
    const params = {
      currentPage: 1,
      showCount: tableList,
      pd: {
        ...formValues,
      },
    };
    this.getDossier(params);
  };
  // 获取办案人信息
  handleAllPoliceOptionChange = (value) => {
    this.getAllPolice(value);
  };
  // 表格分页功能
  handleTableChange = (pagination, filters, sorter) => {
    const { formValues } = this.state;
    const params = {
      pd: {
        ...formValues,
      },
      currentPage: pagination.current,
      showCount: pagination.pageSize,
    };
    this.setState({
      NowDataPage: pagination.current,
      NowShowCount: pagination.pageSize,
    });
    this.getDossier(params);
    this.setState({
      current: pagination.current,
    });
  };
  // 打开新的详情页面
  newDetail = (record) => { //record.id, record.wtid, record.dossier_id
    this.props.dispatch(
      routerRedux.push({
        pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
        query: { record: record, id: record && record.id ? record.id : '1' },
      }),
    );
    // const divs = (
    //   <div>
    //     <UnDossierDetail
    //       {...this.props}
    //       id={id}
    //       wtid={wtid}
    //       dossierId={dossierId}
    //       refreshTable={this.getDossier}
    //     />
    //   </div>
    // );
    // const addDetail = { title: '卷宗详情', content: divs, key: id };
    // let newDetail = [];
    // let isDetail = true;
    // newDetail = [...this.state.arrayDetail];
    // for (let a = 0; a < newDetail.length; a++) {
    //   if (addDetail.key === newDetail[a].key) {
    //     isDetail = false;
    //   }
    // }
    // if (isDetail) {
    //   newDetail.push(addDetail);
    //   this.setState({
    //     arrayDetail: newDetail,
    //     activeKey: addDetail.key,
    //   });
    // } else {
    //   this.setState({
    //     activeKey: addDetail.key,
    //   });
    // }

  };
  // 无法选择的日期
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  };

  // 渲染机构树
  renderloop = data => data.map((item) => {

    if (item.childrenList && item.childrenList.length) {
      return <TreeNode value={item.code} key={item.code}
                       title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
    }
    return <TreeNode key={item.code} value={item.code} title={item.name}/>;
  });
  saveShare = (res, type, ajGzLx) => {
    this.setState({
      sx: (res.ajmc ? res.ajmc + '、' : '') + (res.jzlb_mc ? res.jzlb_mc + '、' : '') + (res.wtlxMc ? res.wtlxMc + '、' : '') + (res.gjsj ? res.gjsj : ''),
      shareRecord: res,
    });
    if (type === 2) {
      let detail = (
        <Row style={{ lineHeight:'55px',paddingLeft:66 }}>
          <Col span={8}>卷宗名称：<Tooltip
            title={res && res.jzmc && res.jzmc.length > 12 ? res.jzmc : null}>{res && res.jzmc ? res.jzmc.length > 12 ? res.jzmc.substring(0, 12) + '...' : res.jzmc : ''}</Tooltip></Col>
          <Col
            span={8}>卷宗类别：{res && res.jzlb_mc ? res.jzlb_mc : ''}</Col>
          <Col span={8}>卷宗描述：<Tooltip
            title={res && res.jzms && res.jzms.length > 12 ? res.jzms : null}>{res && res.jzms ? res.jzms.length > 12 ? res.jzms.substring(0, 12) + '...' : res.jzms : ''}</Tooltip></Col>
          <Col span={8}>案件名称：<Tooltip
            title={res && res.ajmc && res.ajmc.length > 12 ? res.ajmc : null}>{res && res.ajmc ? res.ajmc.length > 12 ? res.ajmc.substring(0, 12) + '...' : res.ajmc : ''}</Tooltip></Col>
          <Col
            span={8}>案件状态：{res && res.ajzt ? res.ajzt : ''}</Col>
        </Row>
      );
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: { record: res,id: res && res.id ? res.id : '1',from:'卷宗信息',tzlx:'jzwt',fromPath:'/dossierPolice/DossierPolice',detail,tab:'表格' },
        }),
      )
      // this.setState({
      //   shareVisible: true,
      //   shareItem: res,
      // });
    } else {
      this.props.dispatch({
        type: 'share/getMyFollow',
        payload: {
          agid: res.wtid,
          lx: this.state.lx,
          sx: (res.ajmc ? res.ajmc + '、' : '') + (res.jzlb_mc ? res.jzlb_mc + '、' : '') + (res.wtlxMc ? res.wtlxMc + '、' : '') + (res.gjsj ? res.gjsj : ''),
          type: type,
          tzlx: this.state.tzlx,
          wtid: res.wtid,
          ajbh: res.ajbh,
          system_id: res.dossier_id,
          ajGzLx: ajGzLx,
        },
        callback: (res) => {
          if (!res.error) {
            message.success('关注成功');
            this.getDossier({ currentPage: this.state.current, pd: this.state.formValues });
          }
        },
      });
    }
  };
  handleCancel = (e) => {
    this.setState({
      shareVisible: false,
    });
  };
  noFollow = (record) => {
    this.props.dispatch({
      type: 'share/getNoFollow',
      payload: {
        id: record.gzid,
        tzlx: record.tzlx,
        ajbh: record.ajbh,
        ajGzlx: record.ajgzlx,
      },
      callback: (res) => {
        if (!res.error) {
          message.success('取消关注成功');
          this.getDossier({ currentPage: this.state.current, pd: this.state.formValues });
        }
      },
    });
  };
  // 打开督办模态框
  supervise = (flag, record) => {
    const { id, wtid, dossier_id } = record;
    this.props.dispatch({
      type: 'UnDossierData/getDossierDetail',
      payload: {
        id,
        wtid,
        dossier_id,
      },
      callback: (data) => {
        if (data) {
          this.setState({
            NewDossierDetail: data,
          });
          this.searchDetail(flag, record);
        }
      },
    });
  };
  searchDetail = (flag, record) => {
    const { wtid } = record;
    this.props.dispatch({
      type: 'UnDossierData/NewgetDossierData',
      payload: {
        pd: {
          wtid,
        },
        currentPage: 1,
        showCount: 9999,
      },
      callback: (data) => {
        if (data.list.length > 0) {
          if (data.list[0].dbzt === '00') {
            const {NewDossierDetail} = this.state;
            this.props.dispatch(
              routerRedux.push({
                pathname: '/ModuleAll/Supervise',
                query: { record:NewDossierDetail,searchDetail:record,id: NewDossierDetail && NewDossierDetail.id ? NewDossierDetail.id : '1',from:'督办',tzlx:'jzwt',fromPath:'/dossierPolice/DossierPolice',tab:'表格'},
              }),
            )
            // this.openModal(this.state.NewDossierDetail, flag, record);
          } else {
            message.warning('该问题已督办，请点击详情查看');
            this.refreshTable();
          }
        } else {
          message.info('该数据无法督办');
        }
      },
    });
  };
  // 刷新列表
  refreshTable = () => {
    const { NowDataPage, NowShowCount, formValues } = this.state;
    const saveparam = {
      currentPage: NowDataPage !== '' ? NowDataPage : 1,
      showCount: NowShowCount !== '' ? NowShowCount : 10,
      pd: {
        ...formValues,
      },
    };
    this.getDossier(saveparam);
  };
  // 关闭督办模态框
  closeModal = (flag, param) => {
    this.setState({
      superviseVisibleModal: !!flag,
    });
  };
  // 打开督办模态框
  openModal = (opendata, flag, record) => {
    this.setState({
      superviseVisibleModal: !!flag,
      opendata: opendata,
      superviseWtlx: record.wtlxMc,
      superviseZrdw: record.bardwmc,
      superviseZrdwId: record.bardw,
      superviseZrr: record.barxm,
      id: record.id,
      sfzh: record.barzjhm,
      wtid: record.wtid,
    });
  };

  // 督办成功后刷新列表
  Refresh = (flag) => {
    this.setState({
      superviseVisibleModal: !!flag,
    });
    this.refreshTable();
  };

  // 改变显示图表或列表
  changeListPageHeader = () => {
    const { showDataView } = this.state;
    this.setState({
      showDataView: !showDataView,
    });
  };
  // 设置手动选择日期
  setSelectedDate = (val) => {
    this.setState({
      typeButtons: 'selectedDate',
      selectedDateVal: val,
    });
  };
  // 设置手动选择机构
  setSelectedDep = (val) => {
    this.setState({
      selectedDeptVal: val,
    });
  };
  // 改变图表类别
  changeTypeButtons = (val) => {
    this.setState({
      typeButtons: val,
    });
  };
  // 图表点击跳转到列表页面
  changeToListPage = (name, dateArry) => {
    this.props.form.resetFields();
    this.setState({
      showDataView: false,
    }, () => {
      this.props.form.setFieldsValue({
        gjsj: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')],
        bardw: this.state.selectedDeptVal || null,
        ...name,
      });

      this.handleSearch();
    });
  };
  getCsfs = (e) =>{
    if(e !== ''){
      this.props.form.resetFields(['dbzt']);
      this.setState({
        dbzt:'',
      })
    }
  }
  // 展开筛选和关闭筛选
  getSearchHeight = () => {
    this.setState({
      searchHeight: !this.state.searchHeight,
    });
  };
  render() {
    const { form: { getFieldDecorator }, common: { depTree, superviseStatusDict, rectificationStatusDict, JzCaseStatusType, dossierSaveTypeDict }, UnDossierData: { data: { page, list, tbCount } }, loading } = this.props;
    const { superviseVisibleModal, DossierDetail, showDataView, isDb, typeButtons, selectedDeptVal, selectedDateVal, treeDefaultExpandedKeys } = this.state;
    const orgcodeVal = selectedDeptVal !== '' ? JSON.parse(selectedDeptVal).id : '';
    const newAddDetail = this.state.arrayDetail;
    const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                   value={`${d.idcard},${d.pcard}$$`}
                                                                   title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 20 } },
    };
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 8 };

    const columns = [
      {
        title: '告警时间',
        dataIndex: 'gjsj',
        width: 100,
      },
      {
        title: '问题类型',
        dataIndex: 'wtlxMc',
      },
      {
        title: '案件类型',
        dataIndex: 'ajlx_mc',
      },
      {
        title: '所属案件',
        dataIndex: 'ajmc',
        width: '20%',
        render: (text) => {
          return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
        },
      },
      {
        title: '案件编号',
        dataIndex: 'ajbh',
        width: 200,
      },
      {
        title: '办案单位',
        dataIndex: 'badw_mc',
        render: (text) => {
          return <Ellipsis length={12} tooltip>{text}</Ellipsis>;
        },
      },
      {
        title: '办案人',
        dataIndex: 'bar',
        render: (text) => {
          return <Ellipsis length={8} tooltip>{text}</Ellipsis>;
        },
      },
      {
        title: '存储状态',
        dataIndex: 'cczt_mc',
      },
      {
        title: '督办状态',
        dataIndex: 'dbztMc',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            {
              isDb ? (
                <span style={{ display: 'inlineBlock' }}>
                                    {
                                      record.dbzt === '00' ? (
                                        <a onClick={() => this.supervise(true, record)}>督办</a>
                                      ) : (
                                        <a style={{ color: '#C3C3C3' }}>督办</a>
                                      )
                                    }
                  <Divider type="vertical"/>
                                </span>
              ) : null
            }
            <a onClick={() => this.newDetail(record)}>详情</a>
            <Divider type="vertical"/>
            {
              record.sfgz === 0 ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <a onClick={() => this.saveShare(record, 1, 0)}>本卷宗关注</a>
                      </Menu.Item>
                      <Menu.Item key="1">
                        <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  getPopupContainer={() => document.getElementById('jzgjtableListOperator')}
                >
                  <a href="javascript:;">关注</a>
                </Dropdown>
              ) : (
                <a href="javascript:;"
                   onClick={() => this.noFollow(record)}>取消{record.ajgzlx && record.ajgzlx === '0' ? '本卷宗' : '全要素'}关注</a>
              )
            }
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>分享</a>
          </div>
        ),
      },
    ];
    let superviseStatusOptions = [];
    if (superviseStatusDict.length > 0) {
      for (let i = 0; i < superviseStatusDict.length; i++) {
        const item = superviseStatusDict[i];
        superviseStatusOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    let superviseJzGjStatusOptions = [];
    if (JzCaseStatusType.length > 0) {
      for (let i = 0; i < JzCaseStatusType.length; i++) {
        const item = JzCaseStatusType[i];
        superviseJzGjStatusOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    let rectificationStatusOptions = [];
    if (rectificationStatusDict.length > 0) {
      for (let i = 0; i < rectificationStatusDict.length; i++) {
        const item = rectificationStatusDict[i];
        rectificationStatusOptions.push(
          <Option key={item.id} value={item.code}>{item.name}</Option>,
        );
      }
    }
    const dossierSaveTypeDictGroup = dossierSaveTypeDict.length > 0 ? dossierSaveTypeDict.map(item => {
      return <Option key={item.code} value={item.code}>{item.name}</Option>;
    }) : null;
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: page ? page.currentPage : '',
      total: page ? page.totalResult : '',
      pageSize: page ? page.showCount : '',
      showTotal: (total, range) =>
        <span className={styles.listPagination}>{`共 ${page ? page.totalPage : 1} 页， ${page ? page.totalResult : 0} 条记录 `}</span>,
    };
    return (
      <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>
            <div className={styles.listPageWrap}>
              <div className={styles.listPageHeader}>
                {
                  showDataView ? (
                    <a className={styles.listPageHeaderCurrent}><span>●</span>告警统计</a>
                  ) : (
                    <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>告警统计</a>
                  )
                }
                <span>|</span>
                {
                  showDataView ? (
                    <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>告警列表</a>
                  ) : (
                    <a className={styles.listPageHeaderCurrent}><span>●</span>告警列表</a>
                  )
                }
                {showDataView ? (
                  ''
                ) : (
                  <div style={{ float: 'right' }}>
                    <Button
                      style={{
                        color: '#3285FF',
                        backgroundColor: '#171925',
                        border: '1px solid #3285FF',
                        borderRadius: '5px',
                      }}
                      onClick={this.exportData}
                    >
                      导出表格
                    </Button>
                  </div>
                )}
                <DataViewButtonArea
                  showDataView={showDataView}
                  styles={styles}
                  typeButtons={typeButtons}
                  changeTypeButtons={this.changeTypeButtons}
                  disabledDate={this.disabledDate}
                  depTree={depTree}
                  renderloop={this.renderloop}
                  setSelectedDate={this.setSelectedDate}
                  setSelectedDep={this.setSelectedDep}
                  hideWeekButton={true}
                  hideMonthButton={true}
                  treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                />
              </div>
              <UnDossierDataView
                style={{ display: 'none' }}
                changeToListPage={this.changeToListPage}
                showDataView={showDataView}
                searchType={typeButtons}
                orgcode={orgcodeVal}
                selectedDateVal={selectedDateVal}
                {...this.props}
              />
              <div style={showDataView ? { display: 'none' } : { display: 'block' }}>
                <div className={styles.tableListForm} id='jzgjtableListForm' style={{ position: 'relative' }}>
                  <Form onSubmit={this.handleSearch} style={{ height: this.state.searchHeight ? 'auto' : '59px' }}>
                    <Row gutter={rowLayout} className={styles.searchForm}>
                      <Col {...colLayout}>
                        <FormItem label="问题类型" {...formItemLayout}>
                          {getFieldDecorator('wtlx', {
                            initialValue: this.state.wtlx,
                          })(
                            <Select placeholder="请选择问题类型" style={{ width: '100%' }} getPopupContainer={() => document.getElementById('jzgjtableListForm')}>
                              <Option value="">全部</Option>
                              {/*<Option value="1">超期归还</Option>*/}
                              {/*<Option value="0">超期送卷</Option>*/}
                              {/*/!*<Option value="201903">归还预警</Option>*!/*/}
                              {superviseJzGjStatusOptions}
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="案件类型" {...formItemLayout}>
                          {getFieldDecorator('ajlx', {
                            initialValue: this.state.ajlx,
                          })(
                            <Select placeholder="请选择案件类型" style={{ width: '100%' }} getPopupContainer={() => document.getElementById('jzgjtableListForm')}>
                              <Option value="">全部</Option>
                              <Option value="0">刑事案件</Option>
                              <Option value="1">行政案件</Option>
                              <Option value="2">其他</Option>
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="所属案件" {...formItemLayout}>
                          {getFieldDecorator('ssaj', {
                            rules: [{ max: 128, message: '最多输入128个字！' }],
                          })(
                            <Input placeholder="请输入案件名称或案件编号"/>,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout} >
                          {getFieldDecorator('bardw', {
                            initialValue: this.state.badw ? this.state.badw : undefined,
                          })(
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder="请输入办案单位"
                              allowClear
                              key="badwSelect"
                              treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                              treeNodeFilterProp="title"
                              getPopupContainer={() => document.getElementById('jzgjtableListForm')}
                            >
                              {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                            </TreeSelect>,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="办案人" {...formItemLayout}>
                          {getFieldDecorator('bar', {
                            rules: [{ max: 32, message: '最多输入32个字！' }],
                          })(
                            <Select
                              mode="combobox"
                              defaultActiveFirstOption={false}
                              optionLabelProp='title'
                              showArrow={false}
                              filterOption={false}
                              placeholder="请输入办案人"
                              onChange={this.handleAllPoliceOptionChange}
                              onFocus={this.handleAllPoliceOptionChange}
                              // getPopupContainer={() => document.getElementById('jzgjtableListForm')}
                            >
                              {allPoliceOptions}
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="存储状态" {...formItemLayout}>
                          {getFieldDecorator('cczt', {
                            initialValue: this.state.cczt,
                          })(
                            <Select placeholder="请选择存储状态" style={{ width: '100%' }} getPopupContainer={() => document.getElementById('jzgjtableListForm')}>
                              <Option value="">全部</Option>
                              {dossierSaveTypeDictGroup}
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="消息状态" {...formItemLayout}>
                          {getFieldDecorator('dbzt', {
                            initialValue: { dbzt: this.state.dbzt, zgzt: '' },
                          })(
                            <MessageState superviseStatusOptions={superviseStatusOptions}
                                          rectificationStatusOptions={rectificationStatusOptions}
                                          newId='jzgjtableListForm' />,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="告警时间" {...formItemLayout}>
                          {getFieldDecorator('gjsj', {
                            initialValue: this.state.gjsj ? this.state.gjsj : undefined,
                          })(
                            <RangePicker
                              disabledDate={this.disabledDate}
                              style={{ width: '100%' }}
                              getCalendarContainer={() => document.getElementById('jzgjtableListForm')}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="产生方式" {...formItemLayout}>
                          {getFieldDecorator('csfs', {
                            initialValue: '',
                          })(
                            <Select placeholder="请选择产生方式" style={{ width: '100%' }} onChange={this.getCsfs} getPopupContainer={() => document.getElementById('jzgjtableListForm')}>
                              <Option value="">全部</Option>
                              <Option value="系统判定">系统判定</Option>
                              <Option value="人工判定">人工判定</Option>
                            </Select>,
                          )}
                        </FormItem>
                      </Col>

                    </Row>
                    <Row className={styles.search}>
                      <span style={{ float: 'right', marginBottom: 24, marginTop: 5 }}>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                          查询
                        </Button>
                        <Button
                          style={{ marginLeft: 8 }}
                          onClick={this.handleFormReset}
                          className={styles.empty}
                        >
                          重置
                        </Button>
                        <Button
                          style={{ marginLeft: 8 }}
                          onClick={this.getSearchHeight}
                          className={styles.empty}
                        >
                          {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                          <Icon type={this.state.searchHeight ? 'up' : 'down'} />
                        </Button>
                      </span>
                    </Row>
                  </Form>
                </div>
                <div className={styles.tableListOperator} id='jzgjtableListOperator'>
                  <Table
                    className={styles.listStandardTable}
                    // size="middle"
                    loading={loading}
                    rowKey={record => record.wtid}
                    dataSource={DossierDetail.list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
                  />
                  {/*<ShareModal*/}
                    {/*title="卷宗信息分享"*/}
                    {/*detail={detail}*/}
                    {/*shareVisible={this.state.shareVisible}*/}
                    {/*handleCancel={this.handleCancel}*/}
                    {/*shareItem={this.state.shareItem}*/}
                    {/*personList={this.state.personList}*/}
                    {/*lx={this.state.lx}*/}
                    {/*tzlx={this.state.tzlx}*/}
                    {/*sx={this.state.sx}*/}
                  {/*/>*/}
                </div>
              </div>
            </div>

        {/*{superviseVisibleModal ?*/}
          {/*<SuperviseModal*/}
            {/*visible={superviseVisibleModal}*/}
            {/*closeModal={this.closeModal}*/}
            {/*caseDetails={this.state.opendata}*/}
            {/*getRefresh={this.Refresh}*/}
            {/*// 点击列表的督办显示的四个基本信息*/}
            {/*wtlx={this.state.superviseWtlx}*/}
            {/*wtid={this.state.wtid}*/}
            {/*id={this.state.id}*/}
            {/*from='督办'*/}
          {/*/>*/}
          {/*: ''*/}
        {/*}*/}
      </div>
    );
  }

}
