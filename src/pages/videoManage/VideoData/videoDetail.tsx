/*
 * PoliceRealData/policeDetail.js 警情数据详情
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Button, Card, Col, Form, message, Row, Tooltip, Radio, Table, Empty, Input, Modal} from 'antd';
import styles from './videoDetail.less';
import video from '@/assets/video.mp4';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
const { TextArea } = Input;
let res = {};
const { Search } = Input;
const {confirm} = Modal;
const FormItem = Form.Item;
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
      tab:'0',
      add:'',
      selectedRowKeys: [],
      selectedRows: [],
      bz:false,
    };
  }
  getBz = () =>{
    this.setState({
      bz:true,
    });
  }
  getBzHide = () =>{
    this.setState({
      bz:false,
    });
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
  getAdd = (tab) =>{
    this.setState({
      add:tab,
    });
  }
  onEdit = () =>{
    this.setState({
      add:'',
      selectedRowKeys: [],
      selectedRows: [],
    });
  }
  getOk = () =>{
    console.log('selectedRowKeys',this.state.selectedRowKeys);
  }
  getDel = (record) =>{
    confirm({
      title: `确定取消该关联${this.state.tab=='0' ? '警情' : '案件'}？`,
      content: '',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      getContainer: document.getElementById('messageBox'),
      onOk() {
        console.log('record.id------->',record.id);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  render() {
    let dark = this.props.global && this.props.global.dark;
    let {data,tab,add,record} = this.state;
    let columns = tab === '0' ? [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index) => index+1
      },
      {
        title: '接警编号',
        dataIndex: 'jjbh',
      },
      {
        title: '接警名称',
        dataIndex: 'jjmc',
      },
      {
        title: '警情类型',
        dataIndex: 'jqlx',
      },{
        title: '接警单位',
        dataIndex: 'jjdw',
      },{
        title: '接警人员',
        dataIndex: 'jjry',
      },{
        title: '报案时间',
        dataIndex: 'basj',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a onClick={()=>this.getDel(record)}>取消关联</a>
          </div>
        ),
      },
    ]:[
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index) => index+1
      },
      {
        title: '案件编号',
        dataIndex: 'ajbh',
      },
      {
        title: '案件名称',
        dataIndex: 'ajmc',
      },
      {
        title: '涉案人员',
        dataIndex: 'sary',
      },{
        title: '办案单位',
        dataIndex: 'badw',
      },{
        title: '办案人',
        dataIndex: 'bar',
      },{
        title: '立案时间',
        dataIndex: 'lasj',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a onClick={()=>this.getDel(record)}>取消关联</a>
          </div>
        ),
      },
    ];
    let columns1 = tab === '0' ? [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index) => index+1
      },
      {
        title: '接警编号',
        dataIndex: 'jjbh',
      },
      {
        title: '接警名称',
        dataIndex: 'jjmc',
      },
      {
        title: '警情类型',
        dataIndex: 'jqlx',
      },{
        title: '接警单位',
        dataIndex: 'jjdw',
      },{
        title: '接警人员',
        dataIndex: 'jjry',
      },{
        title: '报案时间',
        dataIndex: 'basj',
      },
    ]:[
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index) => index+1
      },
      {
        title: '案件编号',
        dataIndex: 'ajbh',
      },
      {
        title: '案件名称',
        dataIndex: 'ajmc',
      },
      {
        title: '涉案人员',
        dataIndex: 'sary',
      },{
        title: '办案单位',
        dataIndex: 'badw',
      },{
        title: '办案人',
        dataIndex: 'bar',
      },{
        title: '立案时间',
        dataIndex: 'lasj',
      },
    ];
    let policeList = [{id:'27837',jjbh:'J783465239908374667',jjmc:'20191223殴打案'},{id:'67291',jjbh:'J99074739908374654',jjmc:'2020123案件',basj:'2020-01-24'}];
    let caseList = [{id:'6666',ajbh:'A4367985267345',ajmc:'自行车盗窃案'},{id:'7777',ajbh:'A748375235543',ajmc:'张三抢劫案'},{id:'8888',ajbh:'A884535234321',ajmc:'诈骗案'}];
    let policeList1 = [{id:'555',jjbh:'J1111111111111',jjmc:'抢劫案',jqlx:'110报警',jjdw:'辽阳市公安局',jjry:'李素',basj:'2020-02-24 13:58:11'},{id:'333',jjbh:'J22222222222',jjmc:'盗窃案',basj:'2020-01-26 19:55:13',jqlx:'110报警'}];
    let caseList1 = [{id:'222',ajbh:'A4367985267345',ajmc:'吸毒案'},{id:'111',ajbh:'A748375235543',ajmc:'殴打他人案'},{id:'999',ajbh:'A884535234321',ajmc:'诈骗案',sary:'张三',badw:'抚顺公安局',bar:'孙树',lasj:'2019-12-28'}];
    const paginationProps = {
      current: data.page ? data.page.currentPage : '',
      total: data.page ? data.page.totalResult : '',
      pageSize: data.page ? data.page.showCount : '',
      showTotal: (total, range) =>
        <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${data.page ? data.page.totalResult : 0} 条记录`}</span>,
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: `${selectedRows}`,
        })
      },
      selectedRowKeys: this.state.selectedRowKeys ? [...this.state.selectedRowKeys]:[],
    };
    let styleBox = this.props.location.query.tabName === '播放' ? {
      width:'38%',
      margin:'0 1%',
    } : {};
    let styleBox1 = this.props.location.query.tabName === '播放' ? {border:0,padding:'10px 20px'} : {};
    const colSpan = this.props.location.query.tabName === '播放' ? {md:12} : {md:12,xl:8,xxl:8};
    return (
      <div className={dark ? styles.darkBox: styles.lightBox}>
        <div className={styles.detailBox}>{
          this.props.location.query.tabName === '播放' ? <div className={styles.videoBox}>
            <div className={styles.title}>视频</div>
            <video src={video} controls="controls" className={styles.video}></video>
          </div> : ''
        }
            <div className={styles.videoWord} style={styleBox}>
              <div className={styles.title}>音视频信息</div>
              {this.state.bz ? '' : <Button className={styles.wsxxBtn} onClick={this.getBz}>完善信息</Button>}
              <Row className={styles.word} style={styleBox1}>
                <Col {...colSpan}>视频格式：MP4</Col>
                <Col {...colSpan}>视频大小：25M</Col>
                <Col {...colSpan}>视频时长：00:32:27</Col>
                <Col {...colSpan}>视频厂商：海康</Col>
                <Col {...colSpan}>上传用户：孙志</Col>
                <Col {...colSpan}>上传单位：辽阳分局</Col>
                <Col {...colSpan}>上传时间：2020-01-23 09:45:31</Col>
                <Col {...colSpan}>对接设备：接入</Col>
                <Col {...colSpan}>数据来源：办案区</Col>
                {
                  this.state.bz ? <Col span={24}>
                    <div className={styles.leftTitle}>备注：</div>
                    <TextArea placeholder="请输入备注" rows={3} className={styles.textArea}/>
                    <div className={styles.btns} style={{margin:'40px 0 0'}}>
                      <Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn} onClick={this.getBzHide}>
                        取消
                      </Button>
                      <Button type="primary" style={{marginLeft: 8}} className={styles.okBtn}>
                        确定
                      </Button>
                    </div>
                  </Col> : ''
                }
              </Row>
            </div>
        </div>
        {
          record.type === '0' ? '' : <div className={styles.detailBox}>
            <div className={styles.title}>{add ? tab ==='0' ? '添加关联警情' : '添加关联案件' : '关联信息'}</div>
            {
              add ? <div className={styles.tableBox}>
                <Search
                  placeholder= {tab==='0' ? "请输入警情编号、名称、接警人员、单位" : "请输入案件编号、名称、接警人员、单位"}
                  enterButton="搜索"
                  size="large"
                  onSearch={value => console.log(value)}
                  className={styles.searchBox}
                />
                <Table
                  // size={'middle'}
                  // loading={loading}
                  dataSource={tab==='0' ? policeList : caseList}
                  columns={columns1}
                  rowKey={record => record.id}
                  pagination={paginationProps}
                  rowSelection={rowSelection}
                  onChange={this.handleTableChange}
                  locale={{
                    emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                      description={'暂无数据'}/>
                  }}
                />
                <div className={styles.btns}>
                  <Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}
                          onClick={this.onEdit}>
                    取消
                  </Button>
                  <Button type="primary" style={{marginLeft: 8}} className={styles.okBtn} onClick={this.getOk}>
                    确定
                  </Button>
                </div>
              </div> :
                <div>
                  <div>
                    <Radio.Group defaultValue="0" buttonStyle="solid" className={styles.radioBox} onChange={this.getChangeTable} value={tab}>
                      <Radio.Button value="0">关联警情</Radio.Button>
                      <Radio.Button value="1">关联案件</Radio.Button>
                    </Radio.Group>
                    <Button className={styles.addBtn} onClick={()=>this.getAdd(tab)}>{tab==='0' ? '添加关联警情' : '添加关联案件'}</Button>
                  </div>
                  <div className={styles.tableBox}>
                    <Table
                      // size={'middle'}
                      // loading={loading}
                      rowKey={record => record.key}
                      dataSource={tab==='0' ? policeList1 : caseList1}
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
            }
          </div>
        }
      </div>
    );
  }
}
