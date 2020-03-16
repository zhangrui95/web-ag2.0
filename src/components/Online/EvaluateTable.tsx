/*
* Online/EvaluateTable.tsx 测评历史表格
* author：jhm
* 20200310
* */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal } from 'antd';
import styles from './learningTable.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
import EvaluateDetailModal from './EvaluateDetailModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import suspend from '@/assets/common/suspend.png';
import { connect } from 'dva';
import {tableList} from "@/utils/utils";
@connect(({ global }) => ({
  global,
}))
class EvaluateTable extends PureComponent {
  state = {
    EvaluateDetailVisible:false, // 测评详情
  };

  componentDidMount() {

  }

  // 查看测评详情
  playVideo = (record) => {
    this.setState({
      EvaluateDetailVisible:true
    })
  }
  // 继续测评
  ContinueplayVideo = () => {

  }

  // 测评历史详情关闭
  handleCancel = () => {
    this.setState({
      EvaluateDetailVisible:false,
    })
  }

  render() {
    const { data } = this.props;
    const { mode,checkboxchoose,tablechoose,EvaluateDetailVisible } = this.state;
    let columns, checkboxchooseObj = [];
    columns = [
      {
        title: '测评日期',
        dataIndex: 'cprq',
        // width: 100,
      },
      {
        title: '测评人',
        dataIndex: 'cpr',
        // width: 100,
      },
      {
        title: '测评结果',
        dataIndex: 'cpjg',
        // width: 100,
      },
      {
        title: '测评类型',
        dataIndex: 'cplx',
        // width: 100,
      },
      {
        title: '测评机构',
        dataIndex: 'cpjgo',
        // width: 100,
      },
      {
        title: '是否完成',
        dataIndex: 'sfwc',
        // width: 100,
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.playVideo(record)}>测评详情</a>
            <a onClick={() => this.ContinueplayVideo(record)}>继续测评</a>
          </div>
        ),
      },
    ];
    // const paginationProps = {
    //   current: data.page ? data.page.currentPage : '',
    //   total: data.page ? data.page.totalResult : '',
    //   pageSize: data.page ? data.page.showCount : '',
    //   showTotal: (total, range) => (
    //     <span className={styles.pagination}  style={{
    //       color: this.props.global && this.props.global.dark ? '#fff' : '#999'
    //     }}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${
    //       data.page ? data.page.totalResult : 0
    //       } 条记录 `}</span>
    //   ),
    // };
    return (
      <div>
        <a onClick={() => this.playVideo()}>测评详情</a>
        <Table
          // size={'middle'}
          // loading={loading}
          rowKey={record => record.id}
          // dataSource={data.list}
          columns={columns}
          // pagination={paginationProps}
          onChange={this.handleTableChange}
          className={styles.showTable}
          locale={{
            emptyText: (
              <Empty
                image={this.props.global && this.props.global.dark ? noList : noListLight}
                description={'暂无数据'}
              />
            ),
          }}
        />

        {
          EvaluateDetailVisible?
            <EvaluateDetailModal
              title='执法能力好评'
              visible={EvaluateDetailVisible}
              handleCancel={this.handleCancel}
            />
            :
            ''
        }
      </div>
    );
  }
}

export default EvaluateTable;
