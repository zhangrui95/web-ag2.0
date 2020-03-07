/*
 * QuestionBankConfig/EvaluateTemplateTable.tsx 测评模板表格
 * author：jhm
 * 20200303
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal } from 'antd';
import styles from './QuestionDefendTable.less';
import TemplateDetailVisibleModal from '../../components/QuestionBankConfig/TemplateDetailVisibleModal';
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
class EvaluateTemplateTable extends PureComponent {
  state = {
    previewRecord:'', // 请求的详情数据
    previewVisible:false, // 详情模态框
  };

  componentDidMount() {

  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  //详情
  playVideo=(record)=>{
    this.props.dispatch({
      type:'QuestionBankConfig/getTemplateDetail',
      payload:{
        id:record.id,
      },
      callback:(data)=>{
        if(data){
          this.setState({
            previewVisible:true,
            previewRecord:data,
          })
        }
      }
    })
  }

  // 删除
  DeleteVideo = (record) => {
    this.props.deleteTemplateData(record);
  }

  // 关闭详情模态框
  previewModalCancel = () => {
    this.setState({
      previewVisible:false,
      previewRecord:'',
    })
  }
  render() {
    const { data } = this.props;
    const { mode,previewVisible,previewRecord } = this.state;
    let columns, checkboxchooseObj = [];
    columns = [
      {
        title: '序号',
        dataIndex: 'xh',
        // width: 100,
      },
      {
        title: '模板名称',
        dataIndex: 'cpmbzw',
        // width: 100,
      },
      {
        title: '模板概况',
        dataIndex: 'mbgk',
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
        if(this.props.chooseSelect){
          this.props.chooseSelect(selectedRowKeys);
        }

        // this.setState({
        //   selectedRows,
        // })
      },

      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: data.page ? data.page.currentPage : '',
      total: data.page ? data.page.totalResult : '',
      pageSize: data.page ? data.page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.pagination}  style={{
          color: this.props.global && this.props.global.dark ? '#fff' : '#999'
        }}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${
          data.page ? data.page.totalResult : 0
          } 条记录 `}</span>
      ),
    };
    return (
      <div>
        <Table
          rowKey={record => record.id}
          dataSource={data.list}
          columns={columns}
          rowSelection={rowSelection}
          pagination={paginationProps}
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
          previewVisible?
            <TemplateDetailVisibleModal
              visible={previewVisible}
              title="模板详情"
              closeListDetailModal={this.previewModalCancel} // 关闭详情模态框
              TemplateDetail={previewRecord} // 模板详情
            />
            :
            ''
        }
      </div>
    )
  }
}

export default EvaluateTemplateTable;
