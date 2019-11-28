/*
 * ReportStatistics/XZAJSNCF.js 行政案件所内处罚
 * author：jhm
 * 20190919
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Button,
  DatePicker,
  Tabs,
  Radio,
  message,
  Table,
  Card,
  Tooltip,
  TreeSelect,
  Empty,
} from 'antd';
import moment from 'moment';
import { getUserInfos, tableList, autoheight } from '../../../utils/utils';
import stylescommon from '../../common/common.less';
import StatisticsDateSelect from '../../../components/ReportStatistics/StatisticsDateSelect';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import noList from '@/assets/viewData/noList.png';

// const {Column, ColumnGroup} = Table;
const TreeNode = TreeSelect.TreeNode;

@connect(({ common, TzList }) => ({
  common,
  TzList,
}))
@Form.create()
export default class RYCZTZ extends PureComponent {
  state = {
    selectDateValue: {
      kssj: moment().format('YYYY-MM-DD'),
      jssj: moment().format('YYYY-MM-DD'),
    },
    loading: false,
    levels: [], // 查询层级
    data: [],
    current: 1,
    count: autoheight() > 900 ? 10 : 5,
    treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
    formValues: {},
    caseTypeTree: [],
  };

  componentDidMount() {
    const jigouArea = sessionStorage.getItem('user');
    const newjigouArea = JSON.parse(jigouArea);
    this.getDepTree(newjigouArea.department); // 获取机构树
    this.searchData(this.state.selectDateValue);
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
          console.log('data--------->', data);
          this.setState({
            caseTypeTree: data,
            treeDefaultExpandedKeys: [data[0].code],
          });
        }
      },
    });
  };
  // 清除列表
  emptyData = () => {
    this.setState({
      data: [],
      selectDateValue: {
        kssj: '',
        jssj: '',
      },
    });
  };
  // 获取统计数据
  getStatisticsData = params => {
    let formValues = params.pd ? params.pd : {};
    this.setState({
      formValues,
      loading: true,
      data: [],
    });
    this.props.dispatch({
      type: 'TzList/getSNCF',
      payload: params,
      callback: res => {
        this.setState({
          data: res.data,
          loading: false,
        });
      },
    });
  };
  // 设置已选择的日期
  setSelectDateValue = value => {
    this.setState({
      selectDateValue: value,
    });
    this.searchData(value);
  };
  // 查询数据
  searchData = value => {
    this.setState({
      current: 1,
    });
    const { formValues } = this.state;
    const userInfo = getUserInfos();
    if (userInfo) {
      const params = {
        pd: {
          ...formValues,
          ...value,
        },
        currentPage: 1,
        showCount: this.state.count,
      };
      this.setState({
        levels: [],
      });
      this.getStatisticsData(params);
    }
  };
  // 表格分页
  handleTableChange = (pagination, filtersArg, sorter) => {
    this.setState({
      current: pagination.current,
      count: pagination.pageSize,
    });
    const { selectDateValue, formValues } = this.state;
    const params = {
      pd: {
        ...formValues,
      },
      currentPage: pagination.current,
      showCount: pagination.pageSize,
    };
    this.getStatisticsData(params);
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
  cJTreeSelectChange = (value, label, extra) => {
    let newNum = [];
    if (extra && extra.triggerNode && extra.triggerNode.props && extra.triggerNode.props.children) {
      extra.triggerNode.props.children.map(item => newNum.push("'" + item.props.value + "'"));
    } else {
      newNum.push("'" + value + "'");
    }
    const userInfo = getUserInfos();
    const { formValues } = this.state;
    if (userInfo) {
      const params = {
        pd: {
          ...formValues,
          // jgdm:value,
          pcsids: newNum.toString(),
        },
        currentPage: 1,
        showCount: this.state.count,
      };
      this.setState({
        levels: [],
        formValues: params.pd,
      });
      this.getStatisticsData(params);
    }
  };
  // onSearch = (value) => {
  //     console.log('onSearch',value);
  // }
  search() {
    const { levels, treeDefaultExpandedKeys, caseTypeTree } = this.state;
    const screeWidth = document.body.offsetWidth;
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <StatisticsDateSelect
                  setSelectDateValue={this.setSelectDateValue}
                  selectDateValue={this.state.selectDateValue}
                  emptyData={this.emptyData}
                />
              </Col>
              <Col md={12} sm={24}>
                <span>机构名称：</span>
                <span>
                  <TreeSelect
                    showSearch
                    style={{ width: screeWidth > 1690 ? 365 : 220 }}
                    // value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择机构"
                    allowClear
                    key="cjSelect"
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    onChange={this.cJTreeSelectChange}
                    treeNodeFilterProp="title"
                    getPopupContainer={() => document.getElementById('form')}
                    // searchValue='派出所'
                    // onSearch={this.onSearch}
                  >
                    {caseTypeTree && caseTypeTree.length > 0 ? this.renderloop(caseTypeTree) : null}
                  </TreeSelect>
                </span>
              </Col>
            </Row>
          </Col>
          <Col md={6} sm={24}>
            <div className={stylescommon.buttonArea}>
              <Button type="submit" onClick={() => this.exportData()}>
                导出
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  // 导出
  exportData = () => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'common/exportData',
      payload: {
        tableType: '39',
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
  };

  render() {
    const { data } = this.state;
    const paginationProps = {
      current: data && data.page ? data.page.currentPage : '',
      total: data && data.page ? data.page.totalResult : '',
      pageSize: data && data.page ? data.page.showCount : '',
      showTotal: (total, range) => (
        <span
          className={
            data &&
            data.page &&
            data.page.totalResult &&
            data.page.totalResult.toString().length < 5
              ? stylescommon.pagination
              : stylescommon.paginations
          }
        >{`共 ${data && data.page ? data.page.totalPage : 1} 页，${
          data && data.page ? data.page.totalResult : 0
        } 条数据 `}</span>
      ),
    };
    const columns = [
      //   {
      //     title: '序号',
      //     render: (text, record, index) => <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>,
      // },
      {
        title: '案件编号',
        // width: 200,
        dataIndex: 'ajbh',
      },
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        // width: 200,
        render: text => (
          <Ellipsis lines={2} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '案件类型',
        dataIndex: 'ajlx',
      },
      {
        title: '人员姓名',
        dataIndex: 'ryxm',
      },
      {
        title: '身份证号',
        dataIndex: 'sfzh',
      },
      {
        title: '机构名称',
        dataIndex: 'jg_mc',
      },

      {
        title: '罚款',
        dataIndex: 'fk',
        children: [
          {
            title: '执行时间',
            dataIndex: 'fk_zxsj',
          },
          {
            title: '金额',
            dataIndex: 'fk_je',
          },
        ],
      },
      {
        title: '拘留并处罚款',
        dataIndex: 'jlbfk',
        children: [
          {
            title: '执行时间',
            dataIndex: 'jlfk_zxsj',
          },
          {
            title: '拘留时限',
            dataIndex: 'jlfk_jlsx',
          },
          {
            title: '金额',
            dataIndex: 'jlfk_je',
          },
        ],
      },
      {
        title: '警告',
        dataIndex: 'jg',
      },
    ];
    return (
      <div className={stylescommon.statistics}>
        <Card className={stylescommon.listPageWrap}>{this.search()}</Card>
        <Card className={stylescommon.cardArea}>
          <div>
            <Table
              bordered
              loading={this.state.loading}
              rowKey={record => record.id}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              columns={columns}
              dataSource={this.state.data.list}
              scroll={{ x: '100%' }}
              className={stylescommon.scrollTable}
              locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
            />
          </div>
        </Card>
      </div>
    );
  }
}
