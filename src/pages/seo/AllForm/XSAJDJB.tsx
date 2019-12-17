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
    Empty, List,
} from 'antd';
import moment from 'moment';
import { autoheight, getUserInfos, tableList } from '../../../utils/utils';
import stylescommon from '../../common/common.less';
import StatisticsDateSelect from '../../../components/ReportStatistics/StatisticsDateSelect';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import noList from '@/assets/viewData/noList.png';
import noListLight from "@/assets/viewData/noListLight.png";

// const {Column, ColumnGroup} = Table;

@connect(({ common, TzList, global }) => ({
  common,
  TzList,
  global
}))
@Form.create()
export default class XSAJDJB extends PureComponent {
  state = {
    selectDateValue: {
      kssj: moment().format('YYYY-MM-DD'),
      jssj: moment().format('YYYY-MM-DD'),
    },
    nowLevel: '',
    loading: false,
    levels: [], // 查询层级
    data: [],
    current: 1,
    count: autoheight() > 900 ? 10 : 5,
  };

  componentDidMount() {
    this.searchData(this.state.selectDateValue);
  }

  //清除列表
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
      type: 'TzList/getXsAjDjb',
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
    const userInfo = getUserInfos();
    if (userInfo) {
      const userDep = userInfo.department;
      const params = {
        pd: {
          ...value,
        },
        currentPage: 1,
        showCount: this.state.count,
      };
      this.setState({
        nowLevel: '',
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
    const { selectDateValue } = this.state;
    const params = {
      pd: {
        ...selectDateValue,
      },
      currentPage: pagination.current,
      showCount: pagination.pageSize,
    };
    this.getStatisticsData(params);
  };

  search() {
    const { levels } = this.state;
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <StatisticsDateSelect
              setSelectDateValue={this.setSelectDateValue}
              selectDateValue={this.state.selectDateValue}
              emptyData={this.emptyData}
              id={'XSAJDJB'}
            />
          </Col>
          <Col md={12} sm={24}>
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
        tableType: '35',
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
      {
        title: '案件序号',
        render: (text, record, index) => (
          <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>
        ),
      },
      {
        title: '案件性质',
        dataIndex: 'ajxz',
        width: 200,
        render: text => (
          <Ellipsis lines={2} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '案件编号（六代平台）',
        dataIndex: 'ajbh',
      },
      {
        title: '接警时间',
        dataIndex: 'jjsj',
      },
      {
        title: '立案时间',
        dataIndex: 'larq',
      },
      {
        title: '人员序号',
        dataIndex: 'ryxh',
      },
      {
        title: '犯罪嫌疑人姓名',
        dataIndex: 'fzxyrxm',
      },
      {
        title: '身份信息',
        dataIndex: 'sfxx',
      },
      {
        title: '采取强制措施',
        dataIndex: 'cqqzcs',
        children: [
          {
            title: '取保候审',
            dataIndex: 'qbhs',
          },
          {
            title: '监视居住',
            dataIndex: 'jsjz',
          },
          {
            title: '刑拘',
            dataIndex: 'xsjl',
          },
          {
            title: '逮捕',
            dataIndex: 'db',
          },
          {
            title: '不捕',
            dataIndex: 'bb',
          },
          {
            title: '移送起诉',
            dataIndex: 'ysqs',
          },
          {
            title: '撤销案件',
            dataIndex: 'cxaj',
          },
        ],
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
              scroll={{
                x:
                  this.state.data && this.state.data.list && this.state.data.list.length > 0
                    ? '150%'
                    : '100%',
              }}
              locale={{ emptyText:  <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} />}}
            />
          </div>
        </Card>
      </div>
    );
  }
}
