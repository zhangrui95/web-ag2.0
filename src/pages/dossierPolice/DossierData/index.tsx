/*
 *  dossierData/index.js 卷宗常规数据
 *  author：lyp
 *  20181031
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
  Dropdown,
  Menu,
  Tooltip,
  Radio,
  Icon,
  Empty,
} from 'antd';
import moment from 'moment/moment';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from '../../common/listPage.less';
import { exportListDataMaxDays, getUserInfos, tableList } from '../../../utils/utils';
// import DossierDetail from './DossierDetail';
// import ShareModal from '../../../src/components/ShareModal/ShareModal';
import DossierDataView from '../../../components/DossierRealData/DossierDataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import SyncTime from '../../../components/Common/SyncTime';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';

const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let timeout;
let currentValue;

@connect(({ DossierData, loading, common, global }) => ({
  DossierData,
  common,
  global,
  loading: loading.models.DossierData,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    ajlx: '', // 案件类型
    formValues: {}, // 查询条件
    activeKey: '0',
    arrayDetail: [],
    allPolice: [], // 办案人
    bahj: '', // 办案环节
    jzlb: '', // 卷宗类别
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '卷宗信息',
    tzlx: 'jzxx',
    sx: '',
    current: '',
    showCount: '', // 当前列表显示条数
    is_tz: '0',
    typeButtons: 'week', // 图表展示类别（week,month）
    showDataView: true, // 控制显示图表或者列表（true显示图表）

    dzh: '',
    selectedDateVal: null, // 手动选择的日期
    selectedDeptVal: '', // 手动选择机构
    treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
    searchHeight: false, // 查询条件展开筛选
  };

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.record) {
      let record = this.props.location.query.record;
      record.dossier_id = record.system_id;
      this.newDetail(record);
    }
    if (
      this.props.location.state &&
      this.props.location.state.code &&
      this.props.location.state.kssj &&
      this.props.location.state.jssj
    ) {
      const formValues = {
        badw: this.props.location.state.code,
        rksj_ks: this.props.location.state.kssj,
        rksj_js: this.props.location.state.jssj,
        is_tz: '1',
      };
      this.setState({
        formValues,
        is_tz: '1',
        showDataView: false,
        dbzt: true,
        badw: this.props.location.state.code,
        rksj: [moment(this.props.location.state.kssj), moment(this.props.location.state.jssj)],
      });
      const params = {
        currentPage: 1,
        showCount: tableList,
        pd: {
          ...formValues,
        },
      };
      this.getDossier(params);
    } else {
      const jigouArea = sessionStorage.getItem('user');
      const newjigouArea = JSON.parse(jigouArea);
      this.handleFormReset();
      this.getDossier();
      this.getDossierType();
      this.getDossierSaveTypeDict();
      this.getCaseProcessDict();
      this.getDepTree(newjigouArea.department);
    }
  }

  // 切换tab
  onTabChange = activeKey => {
    this.setState({
      activeKey,
    });
  };
  // 关闭页面
  onTabEdit = (targetKey, action) => {
    this[action](targetKey); // this.remove(targetKey);
  };
  onRadioChange = e => {
    this.setState({
      dzh: e.target.value,
    });
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
  // 获取卷宗数据
  getDossier = param => {
    this.props.dispatch({
      type: 'DossierData/getDossierData',
      payload: param || '',
    });
  };
  // 刷新列表
  refreshTable = () => {
    const { current, showCount, formValues } = this.state;
    const saveparam = {
      currentPage: current !== '' ? current : 1,
      showCount: showCount !== '' ? showCount : tableList,
      pd: {
        ...formValues,
      },
    };
    this.getDossier(saveparam);
  };
  // 获取卷宗类型字典
  getDossierType = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
          appCode: window.configUrl.appCode,
          code: '1215',
      },
    });
  };
  // 获取办案环节字典
  getCaseProcessDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
          appCode: window.configUrl.appCode,
          code: '500837',
      },
    });
  };
  // 获取卷宗存储状态字典
  getDossierSaveTypeDict = () => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
          appCode: window.configUrl.appCode,
          code: '500842',
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
  // 获取所有警员
  getAllPolice = name => {
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
        callback: data => {
          if (data && currentValue === name) {
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
      formValues: {},
      dzh: '',
      rksj: null,
      badw: null,
      timeName: null,
    });
    this.getDossier();
  };
  // 导出
  exportData = () => {
    const values = this.props.form.getFieldsValue();
    const rksjTime = values.rksj;
    const ljsjTime = values.ljsj;
    const formValues = {
      ajlx: values.ajlx || '',
      ajmc: values.ssaj || '',
      badw: values.bardw || '',
      bar: values.bar || '',
      ajhj: values.bahj || '',
      jzlb: values.jzlb || '',
      cczt: values.cczt || '',
      kfid: values.szkf || '',
      is_gldzj: values.dzh || '',
      rksj_ks: rksjTime && rksjTime.length > 0 ? rksjTime[0].format('YYYY-MM-DD') : '',
      rksj_js: rksjTime && rksjTime.length > 0 ? rksjTime[1].format('YYYY-MM-DD') : '',
      ljsj_ks: ljsjTime && ljsjTime.length > 0 ? ljsjTime[0].format('YYYY-MM-DD') : '',
      ljsj_js: ljsjTime && ljsjTime.length > 0 ? ljsjTime[1].format('YYYY-MM-DD') : '',
    };
    if ((rksjTime && rksjTime.length > 0) || (ljsjTime && ljsjTime.length > 0)) {
      const isAfterDate =
        rksjTime && rksjTime.length > 0
          ? moment(formValues.rksj_js).isAfter(
              moment(formValues.rksj_ks).add(exportListDataMaxDays, 'days'),
            )
          : moment(formValues.ljsj_js).isAfter(
              moment(formValues.ljsj_ks).add(exportListDataMaxDays, 'days'),
            );
      if (isAfterDate) {
        // 选择时间间隔应小于exportListDataMaxDays
        message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
      } else {
        this.props.dispatch({
          type: 'common/exportData',
          payload: {
            tableType: '30',
            ...formValues,
          },
          callback: data => {
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
  handleSearch = e => {
    e && e.preventDefault();
    const values = this.props.form.getFieldsValue();
    const rksjTime = values.rksj;
    const ljsjTime = values.ljsj;
    const formValues = {
      ajlx: values.ajlx || '',
      ajmc: values.ssaj || '',
      badw: values.bardw || '',
      bar: values.bar || '',
      ajhj: values.bahj || '',
      jzlb: values.jzlb || '',
      cczt: values.cczt || '',
      kfid: values.szkf || '',
      is_gldzj: values.dzh || '',
      rksj_ks: rksjTime && rksjTime.length > 0 ? rksjTime[0].format('YYYY-MM-DD') : '',
      rksj_js: rksjTime && rksjTime.length > 0 ? rksjTime[1].format('YYYY-MM-DD') : '',
      ljsj_ks: ljsjTime && ljsjTime.length > 0 ? ljsjTime[0].format('YYYY-MM-DD') : '',
      ljsj_js: ljsjTime && ljsjTime.length > 0 ? ljsjTime[1].format('YYYY-MM-DD') : '',
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
  handleAllPoliceOptionChange = value => {
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
    this.getDossier(params);
    this.setState({
      current: pagination.current,
      showCount: pagination.pageSize,
    });
  };
  // 打开新的详情页面
  newDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/dossierPolice/DossierData/DossierDetail',
        query: { record: record, id: record && record.dossier_id ? record.dossier_id : '1' },
      }),
    );
    // const divs = (
    //   <div>
    //     <DossierDetail
    //       {...this.props}
    //       record={record}
    //       getDossier={this.getDossier}
    //       formValues={this.state.formValues}
    //       current={this.state.current}
    //       newDetail={this.newdetail1}
    //       sfgz={record.sfgz}
    //       gzid={record.gzid}
    //       tzlx={record.tzlx}
    //       ajbh={record.ajbh}
    //       id={record.dossier_id}
    //     />
    //   </div>
    // );
    // const addDetail = { title: '卷宗详情', content: divs, key: record.dossier_id };
    // this.newdetail1(addDetail);
  };
  newdetail1 = addDetail => {
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
  // 无法选择的日期
  disabledDate = current => {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
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
  saveShare = (res, type, ajGzLx) => {
    this.setState({
      sx: (res.ajmc ? res.ajmc + '、' : '') + (res.jzlb_mc ? res.jzlb_mc : ''),
      shareRecord: res,
    });
    if (type === 2) {
      this.props.dispatch({
        type: 'share/sharePerson',
        payload: {
          code: getUserInfos().department,
        },
        callback: res => {
          this.setState({
            personList: res.list,
          });
          let shareRecord = this.state.shareRecord;
          let detail = [
            `卷宗名称：${shareRecord && shareRecord.jzmc ? shareRecord.jzmc : ''}`,
            `卷宗类别：${shareRecord && shareRecord.jzlb_mc ? shareRecord.jzlb_mc : ''}`,
            `卷宗描述：${shareRecord && shareRecord.jzms ? shareRecord.jzms : ''}`,
            `案件名称：${shareRecord && shareRecord.ajmc ? shareRecord.ajmc : ''}`,
            `案件状态：${shareRecord && shareRecord.ajzt ? shareRecord.ajzt : ''}`,
          ];
          res.detail = detail;
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/Share',
              query: {
                record: res,
                id: res && res.id ? res.id : '1',
                from: '卷宗信息',
                tzlx: 'jzxx',
                fromPath: '/dossierPolice/DossierData',
                tab: '表格',
                sx: (res.ajmc ? res.ajmc + '、' : '') + (res.jzlb_mc ? res.jzlb_mc : ''),
              },
            }),
          );
        },
      });

      // this.setState({
      //   shareVisible: true,
      //   shareItem: res,
      // });
    } else {
      this.props.dispatch({
        type: 'share/getMyFollow',
        payload: {
          agid: res.id,
          lx: this.state.lx,
          sx: (res.ajmc ? res.ajmc + '、' : '') + (res.jzlb_mc ? res.jzlb_mc : ''),
          type: type,
          tzlx: this.state.tzlx,
          wtid: res.wtid,
          ajbh: res.ajbh,
          system_id: res.dossier_id,
          ajGzLx: ajGzLx,
        },
        callback: res => {
          if (!res.error) {
            message.success('关注成功');
            this.getDossier({ currentPage: this.state.current, pd: this.state.formValues });
          }
        },
      });
    }
  };
  handleCancel = e => {
    this.setState({
      shareVisible: false,
    });
  };
  noFollow = record => {
    this.props.dispatch({
      type: 'share/getNoFollow',
      payload: {
        id: record.gzid,
        tzlx: record.tzlx,
        ajbh: record.ajbh,
        ajGzlx: record.ajgzlx,
      },
      callback: res => {
        if (!res.error) {
          message.success('取消关注成功');
          this.getDossier({ currentPage: this.state.current, pd: this.state.formValues });
        }
      },
    });
  };

  // 改变显示图表或列表
  changeListPageHeader = () => {
    const { showDataView } = this.state;
    this.setState({
      showDataView: !showDataView,
      // typeButtons: 'week',
    });
    // if(showDataView) this.handleFormReset();
  };
  // 设置手动选择日期
  setSelectedDate = val => {
    this.setState({
      typeButtons: 'selectedDate',
      selectedDateVal: val,
    });
  };
  // 设置手动选择机构
  setSelectedDep = val => {
    this.setState({
      selectedDeptVal: val,
    });
  };
  // 改变图表类别
  changeTypeButtons = val => {
    this.setState({
      typeButtons: val,
    });
  };
  // 图表点击跳转到列表页面
  changeToListPage = (search, dateArry) => {
    this.props.form.resetFields();
    this.setState({
      showDataView: false,
      timeName: search && search.timeName,
    });
    this.props.form.setFieldsValue({
      [search && search.timeName ? search.timeName : 'rksj']: [
        moment(dateArry[0], 'YYYY-MM-DD'),
        moment(dateArry[1], 'YYYY-MM-DD'),
      ],
      bardw: this.state.selectedDeptVal || null,
      ...search,
    });
    this.handleSearch();
  };
  // 展开筛选和关闭筛选
  getSearchHeight = () => {
    this.setState({
      searchHeight: !this.state.searchHeight,
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
      common: { depTree, dossierType, caseProcessDict, dossierSaveTypeDict },
      DossierData: {
        data: { page, list, tbCount },
      },
      loading,
    } = this.props;
    const newAddDetail = this.state.arrayDetail;
    const {
      showDataView,
      typeButtons,
      selectedDeptVal,
      selectedDateVal,
      treeDefaultExpandedKeys,
    } = this.state;
    const orgcodeVal = selectedDeptVal !== '' ? JSON.parse(selectedDeptVal).id : '';
    const allPoliceOptions = this.state.allPolice.map(d => (
      <Option
        key={`${d.idcard},${d.pcard}`}
        value={`${d.idcard},${d.pcard}$$`}
        title={d.name}
      >{`${d.name} ${d.pcard}`}</Option>
    ));
    const dossierSaveTypeDictGroup =
      dossierSaveTypeDict.length > 0
        ? dossierSaveTypeDict.map(item => {
            return (
              <Option key={item.code} value={item.code}>
                {item.name}
              </Option>
            );
          })
        : null;
    const caseProcessDictGroup =
      caseProcessDict.length > 0
        ? caseProcessDict.map(item => {
            return (
              <Option key={item.code} value={item.code}>
                {item.name}
              </Option>
            );
          })
        : null;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 20 } },
    };
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 8 };

    const columns = [
      {
        title: '入库时间',
        dataIndex: 'rksj',
        width: 100,
      },
      {
        title: '案件类型',
        dataIndex: 'ajlx_mc',
      },
      {
        title: '所属案件',
        dataIndex: 'ajmc',
        width: '20%',
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
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
        render: text => {
          return (
            <Ellipsis length={12} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '办案人',
        dataIndex: 'bar',
        render: text => {
          return (
            <Ellipsis length={8} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '办案环节',
        dataIndex: 'ajhj_mc',
      },
      {
        title: '卷宗类别',
        dataIndex: 'jzlb_mc',
      },
      {
        title: '存储状态',
        dataIndex: 'cczt_mc',
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.newDetail(record)}>详情</a>
            <Divider type="vertical" />
            {record.sfgz === 0 ? (
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
                getPopupContainer={() => document.getElementById('jzsjtableListForm')}
              >
                <a href="javascript:;">关注</a>
              </Dropdown>
            ) : (
              <a href="javascript:;" onClick={() => this.noFollow(record)}>
                取消{record.ajgzlx && record.ajgzlx === '0' ? '本卷宗' : '全要素'}关注
              </a>
            )}
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>
              分享
            </a>
          </div>
        ),
      },
    ];
    let DossierTypeOptions = [];
    if (dossierType.length > 0) {
      for (let i = 0; i < dossierType.length; i++) {
        const item = dossierType[i];
        DossierTypeOptions.push(
          <Option key={item.id} value={item.code}>
            {item.name}
          </Option>,
        );
      }
    }
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: page ? page.currentPage : '',
      total: page ? page.totalResult : '',
      pageSize: page ? page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.listPagination}>{`共 ${page ? page.totalPage : 1} 页， ${
          page ? page.totalResult : 0
        } 条记录 `}</span>
      ),
    };
    let className =
      this.props.global && this.props.global.dark
        ? styles.listPageWrap
        : styles.listPageWrap + ' ' + styles.lightBox;
    return (
      <div
        className={
          this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''
        }
      >
        <div className={className}>
          <div className={styles.listPageHeader}>
            {showDataView ? (
              <a className={styles.listPageHeaderCurrent}>
                <span>●</span>数据统计
              </a>
            ) : (
              <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                数据统计
              </a>
            )}
            <span>|</span>
            {showDataView ? (
              <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
                数据列表
              </a>
            ) : (
              <a className={styles.listPageHeaderCurrent}>
                <span>●</span>数据列表
              </a>
            )}
            {showDataView ? (
              ''
            ) : (
              <div style={{ float: 'right' }}>
                <Button className={styles.downloadBtn} onClick={this.exportData} icon="download">
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
              hideDayButton
              treeDefaultExpandedKeys={treeDefaultExpandedKeys}
              {...this.props}
            />
          </div>
          <DossierDataView
            showDataView={showDataView}
            searchType={typeButtons}
            orgcode={orgcodeVal}
            selectedDateVal={selectedDateVal}
            changeToListPage={this.changeToListPage}
            {...this.props}
          />
          <div style={showDataView ? { display: 'none' } : { display: 'block' }}>
            <div className={styles.tableListForm} id="jzsjtableListForm">
              <Form
                onSubmit={this.handleSearch}
                style={{ height: this.state.searchHeight ? 'auto' : '50px' }}
              >
                <Row gutter={rowLayout} className={styles.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="案件类型" {...formItemLayout}>
                      {getFieldDecorator('ajlx', {
                        initialValue: this.state.ajlx,
                      })(
                        <Select
                          placeholder="请选择案件类型"
                          style={{ width: '100%' }}
                          getPopupContainer={() => document.getElementById('jzsjtableListForm')}
                        >
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
                      })(<Input placeholder="请输入案件名称或案件编号" />)}
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
                          optionLabelProp="title"
                          showArrow={false}
                          filterOption={false}
                          placeholder="请输入办案人"
                          onChange={this.handleAllPoliceOptionChange}
                          onFocus={this.handleAllPoliceOptionChange}
                          getPopupContainer={() => document.getElementById('jzsjtableListForm')}
                        >
                          {allPoliceOptions}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="办案单位" {...formItemLayout}>
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
                          treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                          treeNodeFilterProp="title"
                          getPopupContainer={() => document.getElementById('jzsjtableListForm')}
                        >
                          {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                        </TreeSelect>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="办案环节" {...formItemLayout}>
                      {getFieldDecorator('bahj', {
                        initialValue: this.state.bahj,
                      })(
                        <Select
                          placeholder="请选择办案环节"
                          style={{ width: '100%' }}
                          getPopupContainer={() => document.getElementById('jzsjtableListForm')}
                        >
                          <Option value="">全部</Option>
                          {caseProcessDictGroup}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="卷宗类别" {...formItemLayout}>
                      {getFieldDecorator('jzlb', {
                        initialValue: this.state.jzlb,
                      })(
                        <Select
                          placeholder="请选择卷宗类别"
                          style={{ width: '100%' }}
                          getPopupContainer={() => document.getElementById('jzsjtableListForm')}
                        >
                          <Option value="">全部</Option>
                          {DossierTypeOptions}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="存储状态" {...formItemLayout}>
                      {getFieldDecorator('cczt', {
                        initialValue: this.state.cczt,
                      })(
                        <Select
                          placeholder="请选择存储状态"
                          style={{ width: '100%' }}
                          getPopupContainer={() => document.getElementById('jzsjtableListForm')}
                        >
                          <Option value="">全部</Option>
                          {dossierSaveTypeDictGroup}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  {this.state.timeName && this.state.timeName === 'ljsj' ? (
                    <Col {...colLayout}>
                      <FormItem label="立卷时间" {...formItemLayout}>
                        {getFieldDecorator('ljsj')(
                          <RangePicker
                            disabledDate={this.disabledDate}
                            style={{ width: '100%' }}
                            getCalendarContainer={() =>
                              document.getElementById('jzsjtableListForm')
                            }
                          />,
                        )}
                      </FormItem>
                    </Col>
                  ) : (
                    <Col {...colLayout}>
                      <FormItem label="入库时间" {...formItemLayout}>
                        {getFieldDecorator('rksj', {
                          initialValue: this.state.rksj ? this.state.rksj : undefined,
                        })(
                          <RangePicker
                            disabledDate={this.disabledDate}
                            style={{ width: '100%' }}
                            getCalendarContainer={() =>
                              document.getElementById('jzsjtableListForm')
                            }
                          />,
                        )}
                      </FormItem>
                    </Col>
                  )}
                  <Col {...colLayout}>
                    <FormItem label="电子化" {...formItemLayout}>
                      {getFieldDecorator('dzh', {
                        initialValue: this.state.dzh,
                      })(
                        <RadioGroup onChange={this.onRadioChange}>
                          <Radio value="">全部</Radio>
                          <Radio value="1">有电子卷</Radio>
                          <Radio value="0">无电子卷</Radio>
                        </RadioGroup>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="所在库房" {...formItemLayout}>
                      {getFieldDecorator('szkf', {
                        rules: [{ max: 128, message: '最多输入128个字！' }],
                      })(<Input placeholder="请输入所在库房" />)}
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
            <div className={styles.tableListOperator} id="jzsjtableListForm">
              <Table
                className={styles.listStandardTable}
                // size="middle"
                loading={loading}
                rowKey={record => record.dossier_id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
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
            </div>
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
        <SyncTime dataLatestTime={tbCount ? tbCount.tbsj : ''} {...this.props} />
      </div>
    );
  }
}
