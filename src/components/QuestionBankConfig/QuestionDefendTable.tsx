/*
 * QuestionBankConfig 办案区数据
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal } from 'antd';
import styles from './QuestionDefendTable.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
// import ShareModal from './../ShareModal/ShareModal';
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
class learningTable extends PureComponent {
  state = {
    selectedRows:[],
    previewRecord:'',
    tablechoose:[], // 表格中的选中项
  };

  componentDidMount() {

  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  //查看
  playVideo=(record)=>{
    this.setState({
      previewModal:true,
      previewRecord:record,
    })
  }

  // 删除
  DeleteVideo = (record) => {
    this.props.deleteOneData(record);
  }

  previewModalCancel = () => {
    this.setState({
      previewModal:false,
      previewRecord:'',
    })
  }
  render() {
    const { data } = this.props;
    const { mode,tablechoose } = this.state;
    let columns, checkboxchooseObj = [];
    columns = [
      {
        title: '序号',
        dataIndex: 'xh',
        // width: 100,
      },
      {
        title: '题目类型',
        dataIndex: 'tmlx',
        // width: 100,
      },
      {
        title: '题目',
        dataIndex: 'tm',
        // width: 100,
      },
      {
        title: '答案解析',
        dataIndex: 'dajx',
        // width: 100,
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.playVideo(record)}>详情</a>
            <Divider type="vertical"/>
            <a onClick={() => this.DeleteVideo(record)}>删除</a>
          </div>
        ),
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys',selectedRowKeys);
        // console.log('selectedRows',selectedRows);
        this.setState({
          tablechoose:selectedRowKeys,

        })
        if(this.props.chooseSelect){
          this.props.chooseSelect(selectedRowKeys);
        }

        // this.setState({
        //   selectedRows,
        // })
      },
      selectedRowKeys: [...tablechoose],
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
    // const paginationProps = {
    //   // showSizeChanger: true,
    //   // showQuickJumper: true,
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
        <Table
          rowKey={record => record.id}
          // dataSource={data.list}
          columns={columns}
          rowSelection={rowSelection}
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
      </div>
    )
  }
}

export default learningTable;
