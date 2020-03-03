/*
 * PoliceRealData/policeDetail.js 警情数据详情
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, message, Row, Tooltip,Radio,Table,Empty } from 'antd';
import styles from './videoDetail.less';
import video from '@/assets/video.mp4';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
let res = {};

@connect(({ policeData, loading, global }) => ({
  policeData,
  loading,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class policeDetail extends PureComponent {
  constructor(props) {
    super(props);
    res = props.location.query.record;
    if (res && typeof res == 'string') {
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      record: res, // 表格信息
      data:{},
      tab:'0'
    };
  }
  getChangeTable = (e) =>{
    this.setState({
      tab:e.target.value,
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      current: pagination.current,
    });
  };
  render() {
    let dark = this.props.global && this.props.global.dark;
    let {data,tab} = this.state;
    let columns = tab === '0' ? [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index) => index
      },
      {
        title: '接警编号',
        dataIndex: 'wjlbmc',
      },
      {
        title: '接警名称',
        dataIndex: 'sprq',
      },
      {
        title: '警情类型',
        dataIndex: 'sply',
      },{
        title: '接警单位',
        dataIndex: 'ajmc',
      },{
        title: '接警人员',
        dataIndex: 'ajlb',
      },{
        title: '报案时间',
        dataIndex: 'badw',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a>取消关联</a>
          </div>
        ),
      },
    ]:[
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index) => index
      },
      {
        title: '案件编号',
        dataIndex: 'wjlbmc',
      },
      {
        title: '案件名称',
        dataIndex: 'sprq',
      },
      {
        title: '涉案人员',
        dataIndex: 'sply',
      },{
        title: '办案单位',
        dataIndex: 'ajmc',
      },{
        title: '办案人',
        dataIndex: 'ajlb',
      },{
        title: '立案时间',
        dataIndex: 'badw',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a>取消关联</a>
          </div>
        ),
      },
    ];
    const paginationProps = {
      current: data.page ? data.page.currentPage : '',
      total: data.page ? data.page.totalResult : '',
      pageSize: data.page ? data.page.showCount : '',
      showTotal: (total, range) =>
        <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${data.page ? data.page.totalResult : 0} 条记录`}</span>,
    };
    return (
      <div className={dark ? styles.darkBox: styles.lightBox}>
        <div className={styles.detailBox}>
            <div className={styles.videoBox}>
              <video src={video} controls="controls" className={styles.video}></video>
            </div>
            <div className={styles.videoWord}>
              <div className={styles.title}>音视频信息</div>
              <Row className={styles.word}>
                <Col span={12}>视频格式：MP4</Col>
                <Col span={12}>视频大小：25M</Col>
                <Col span={12}>视频时长：00:32:27</Col>
                <Col span={12}>视频厂商：海康</Col>
                <Col span={24}>上传用户：孙志</Col>
                <Col span={24}>上传单位：辽阳分局</Col>
                <Col span={24}>上传时间：2020-01-23 09:45:31</Col>
                <Col span={24}>对接设备：接入</Col>
                <Col span={24}>数据来源：办案区</Col>
              </Row>
            </div>
        </div>
        <div className={styles.detailBox}>
          <div>
            <Radio.Group defaultValue="0" buttonStyle="solid" className={styles.radioBox} onChange={this.getChangeTable}>
              <Radio.Button value="0">关联警情</Radio.Button>
              <Radio.Button value="1">关联案件</Radio.Button>
            </Radio.Group>
            <Button className={styles.addBtn}>{tab==='0' ? '添加关联警情' : '添加关联案件'}</Button>
          </div>
          <Table
            // size={'middle'}
            // loading={loading}
            rowKey={record => record.key}
            dataSource={[]}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            locale={{
              emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                description={'暂无数据'}/>
            }}
          />
        </div>
      </div>
    );
  }
}
