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
  Empty,
} from 'antd';
import moment from 'moment';
import { autoheight, getUserInfos, tableList } from '../../../utils/utils';
import stylescommon from '../../common/common.less';
import StatisticsDateSelect from '../../../components/ReportStatistics/StatisticsDateSelect';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import noList from '@/assets/viewData/noList.png';

// const {Column, ColumnGroup} = Table;

@connect(({ common, TzList }) => ({
  common,
  TzList,
}))
@Form.create()
export default class XSAJBLJDGLTZ extends PureComponent {
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
      type: 'TzList/getXsAjTz',
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
        tableType: '23',
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
        title: ' ',
        dataIndex: '0',
        children: [
          {
            title: '序号',
            render: (text, record, index) => (
              <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>
            ),
          },
          {
            title: '案件名称',
            dataIndex: 'ajmc',
            width: 200,
            render: text => (
              <Ellipsis lines={2} tooltip>
                {text}
              </Ellipsis>
            ),
          },
        ],
      },
      {
        title: ' ',
        dataIndex: '1',
        children: [
          {
            title: '立案时间',
            dataIndex: 'lasj',
          },
          {
            title: '到案情况',
            dataIndex: 'daqk',
          },
          {
            title: '涉案人员',
            dataIndex: 'sary',
          },
          {
            title: '强制措施',
            dataIndex: 'qzcs',
            children: [
              {
                title: '刑拘',
                dataIndex: 'xj',
              },
              {
                title: '取保',
                dataIndex: 'qb',
              },
              {
                title: '监视居住',
                dataIndex: 'jsjz',
              },
              {
                title: '逮捕',
                dataIndex: 'db',
              },
            ],
          },
        ],
      },
      {
        title: '审核人员：',
        align: 'left',
        children: [
          {
            title: '移送起诉情况',
            dataIndex: 'ysqsqk',
          },
          {
            title: '卷宗整理上传情况',
            dataIndex: 'jzzlqk',
          },
          {
            title: '办案民警',
            dataIndex: 'bamj',
          },
          {
            title: '巡查人员',
            dataIndex: 'xcry',
          },
        ],
      },
      {
        title: '责任人：',
        align: 'left',
        children: [
          {
            title: '巡查问题',
            dataIndex: 'xcwt',
          },
          {
            title: '巡查时间',
            dataIndex: 'xcsj',
          },
          {
            title: '整改情况',
            dataIndex: 'zgqk',
          },
          {
            title: '存放位置',
            dataIndex: 'cfwz',
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
              locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
            />
          </div>
        </Card>
      </div>
    );
  }
}
