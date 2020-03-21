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
import Ellipsis from "ant-design-pro/lib/Ellipsis";
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
      tab:'0',
      add:'',
      selectedRowKeys: [],
      selectedRows: [],
      bz:false,
      current: 1,
      count: 10,
      detail:{},
        listLoading:false,
        jqGlList:{},
        ajGlList:{},
        compose_search:'',
    };
  }
  componentDidMount(): void {
      let {id} = this.state.record;
      console.log(id)
      this.getDetail(id);
  }

    getDetail = (id) =>{
        this.props.dispatch({
            type: 'VideoDate/getDetail',
            payload: {id:id},
            callback:(data)=>{
               this.setState({
                   detail:data,
               })
            }
        });
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
  //关联信息Tab切换
  getChangeTable = (e) =>{
    //tab:'0'警情，'1'案件
    this.setState({
      tab:e.target.value,
    })
  }
  //table分页
  handleTableChange = (pagination, filters, sorter) => {
      const { compose_search } = this.state;
      const params = {
          pd: {
              ...compose_search,
          },
          currentPage: pagination.current,
          showCount: pagination.pageSize,
      };
      if(this.state.tab === '0'){
          this.getGlJq(params);
      }else{
          this.getGlaAj(params);
      }
    this.setState({
      current: pagination.current,
      count: pagination.pageSize,
    });
  };
  //添加关联警情或案件（tab：0警情，1案件）
  getAdd = (tab) =>{
    this.setState({
      add:tab,
        current: 1,
        count: 10,
    });
    if(tab === '0'){
        this.getGlJq({});
    }else{
        this.getGlaAj({});
    }
  }
  //可关联警情列表
  getGlJq = (params) =>{
      this.setState({
          listLoading:true,
      });
      this.props.dispatch({
          type: 'VideoDate/getGlJq',
          payload: params,
          callback:(data)=>{
              console.log('getGlJq',data);
              this.setState({
                  jqGlList:data,
                  listLoading:false,
              });
          }
      });
  }
  //可关联案件列表
    getGlaAj = (params) =>{
        this.setState({
            listLoading:true,
        });
        this.props.dispatch({
            type: 'VideoDate/getGlAj',
            payload: params,
            callback:(data)=>{
                console.log('getGlaAj',data);
                this.setState({
                    ajGlList:data,
                    listLoading:false,
                })
            }
        });
    }
  //取消
  onEdit = () =>{
    this.setState({
      add:'',
      selectedRowKeys: [],
      selectedRows: [],
    });
  }
  //确定
  getOk = () =>{
    console.log('selectedRowKeys',this.state.selectedRowKeys);
      let {id} = this.state.record;
      this.props.dispatch({
          type: 'VideoDate/addAudioVideoGL',
          payload: {
              gl_id:this.state.selectedRowKeys.toString(),
              gl_lx:this.state.tab === '0' ? '1' : '2',
              id:id
          },
          callback:(data)=>{
              console.log('data------>',data);
              message.success('关联成功');
              this.getDetail(id);
              this.onEdit();
              this.props.dispatch({
                  type: 'global/changeResetList',
                  payload: {
                      isReset: !this.props.global.isResetList.isReset,
                      url: '/videoManage/videoData',
                  },
              });
          }
      });
  }
  //取消关联
  getDel = (record) =>{
    let {id} = this.state.record;
    let that = this;
    confirm({
      title: `确定取消该关联${that.state.tab=='0' ? '警情' : '案件'}？`,
      content: '',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      getContainer: document.getElementById('messageBox'),
      onOk() {
        console.log('record.id------->',record.id);
          that.props.dispatch({
              type: 'VideoDate/cancelAudioVideoGL',
              payload: {
                  gl_lx:that.state.tab === '0' ? '1' : '2',
                  id: id,
                  gl_id: that.state.tab === '0' ? record.jqbh : record.ajbh,
              },
              callback:(data)=>{
                  message.success('取消成功');
                  that.getDetail(id);
                  that.props.dispatch({
                      type: 'global/changeResetList',
                      payload: {
                          isReset: !that.props.global.isResetList.isReset,
                          url: '/videoManage/videoData',
                      },
                  });
              }
          });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  //可关联列表搜索
  getSearch = (value) =>{
      console.log(value);
      this.setState({
          compose_search:value,
          current: 1,
          count: 10,
      },()=>{
          const params = {
              pd: {
                  compose_search:value,
              },
              currentPage: 1,
              showCount: 10,
          };
          if(this.state.tab === '0'){
              this.getGlJq(params);
          }else{
              this.getGlaAj(params);
          }
      })
  }
  render() {
    let dark = this.props.global && this.props.global.dark;
    let {tab,add,record,detail,jqGlList,ajGlList,listLoading} = this.state;
    let columns = tab === '0' ? [
      {
        title: '序号',
        dataIndex: 'index',
          render: (text, record, index) => {
              return index+1;
          },
      },
      {
        title: '警情编号',
        dataIndex: 'jqbh',
      },
      {
        title: '接警内容',
        dataIndex: 'jjnr',
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
        title: '警情类型',
        dataIndex: 'jqlbmc',
      },{
        title: '接警单位',
        dataIndex: 'jjdw',
      },{
        title: '接警人员',
        dataIndex: 'jjr',
      },{
        title: '报案时间',
        dataIndex: 'jjsj',
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
          render: (text, record, index) => {
              return index+1;
          },
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
        dataIndex: 'xyrName',
      },{
        title: '办案单位',
        dataIndex: 'zbrdw_mc',
      },{
        title: '办案人',
        dataIndex: 'zbrxm',
      },{
        title: '立案时间',
        dataIndex: 'larq',
      },{
            title: '受理时间',
            dataIndex: 'slrq',
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
          render: (text, record, index) => {
              return <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>;
          },
      },
      {
        title: '警情编号',
        dataIndex: 'system_id',
      },
      {
        title: '接警内容',
        dataIndex: 'jjnr',
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
        title: '警情类型',
        dataIndex: 'jqlbmc',
      },{
        title: '接警单位',
        dataIndex: 'jjdw',
      },{
        title: '接警人员',
        dataIndex: 'jjr',
      },{
        title: '报案时间',
        dataIndex: 'jjsj',
      },
    ]:[
      {
        title: '序号',
        dataIndex: 'index',
          render: (text, record, index) => {
              return <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>;
          },
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
        dataIndex: 'xyrName',
      },{
        title: '办案单位',
        dataIndex: 'zbrdw_mc',
      },{
        title: '办案人',
        dataIndex: 'zbrxm',
      },{
            title: '立案时间',
            dataIndex: 'larq',
        },{
            title: '受理时间',
            dataIndex: 'slrq',
        }
    ];
    let policeList = jqGlList&&jqGlList.list ? jqGlList.list : [];
    let caseList = ajGlList&&ajGlList.list ? ajGlList.list : [];
    const paginationProps = {
      current: 10,
      total: tab==='0' ? detail&&detail.jqList ? detail.jqList.length : '0' : detail&&detail.ajList ? detail.ajList.length : '0',
      showTotal: (total, range) =>
        <span className={styles.pagination}>{`共 ${Math.ceil(parseInt(total)/10)} 页， ${total} 条记录`}</span>,
    };
      let data = tab==='0' ? jqGlList : ajGlList;
      const paginationPropsGl = {
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
              <iframe
                  className={styles.video}
                  src={video}
              />
          </div> : ''
        }
            <div className={styles.videoWord} style={styleBox}>
              <div className={styles.title}>音视频信息</div>
              {/*{this.state.bz || this.props.location.query.tabName === '播放' ? '' : <Button className={styles.wsxxBtn} onClick={this.getBz}>完善信息</Button>}*/}
              <Row className={styles.word} style={styleBox1}>
                <Col {...colSpan}>文件名称：{detail.mc || ''}</Col>
                <Col {...colSpan}>视频格式：{detail.format || ''}</Col>
                <Col {...colSpan}>视频大小：{detail.size || ''}</Col>
                <Col {...colSpan}>视频时长：{detail.time_length || ''}</Col>
                <Col {...colSpan}>视频厂商：{detail.company || ''}</Col>
                <Col {...colSpan}>上传用户：{detail.uploaduser_name || ''}</Col>
                <Col {...colSpan}>上传单位：{detail.upload_dwmc || ''}</Col>
                <Col {...colSpan}>上传时间：{detail.upload_rq || ''}</Col>
                <Col {...colSpan}>对接设备：{detail.djsb || ''}</Col>
                <Col {...colSpan}>数据来源：{detail.sjly || ''}</Col>
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
                  placeholder= {tab==='0' ? "请输入警情编号、接警内容、接警人员、单位" : "请输入案件编号、名称、接警人员、单位"}
                  enterButton="搜索"
                  size="large"
                  onSearch={this.getSearch}
                  className={styles.searchBox}
                />
                <Table
                  loading={listLoading}
                  dataSource={tab==='0' ? policeList : caseList}
                  columns={columns1}
                  rowKey={record => tab==='0' ? record.jqbh :  record.ajbh}
                  pagination={paginationPropsGl}
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
                      dataSource={tab==='0' ? detail.jqList : detail.ajList}
                      columns={columns}
                      pagination={paginationProps}
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
