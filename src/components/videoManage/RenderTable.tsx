/*
* AlarmData/index.js/rendertable 接处警警情数据表格组件
* author：jhm
* 20180605
* */

import React, {PureComponent} from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Card, Empty, Icon, Modal} from 'antd';
import styles from './RenderTable.less';
import Detail from '../../pages/receivePolice/AlarmData/policeDetail';
import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
import {connect} from "dva";
import {tableList, userAuthorityCode} from "@/utils/utils";
import {authorityIsTrue} from "@/utils/authority";
const {confirm} = Modal;
@connect(({global}) => ({
    global
}))
class RenderTable extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            addDetail: props.addDetail,
            shareVisible: false,
            shareItem: null,
            personList: [],
            lx: '音视频信息',
            tzlx: 'yspxx',
            sx: '',
            current: 1,
            allTable: false,
        };
    }

    componentDidMount() {
        // if (this.props.location.query && this.props.location.query.id) {
        //     let record = this.props.location.query.record;
        //     this.deatils(record);
        // }
    }

    getAllTable = () =>{
        this.setState({
            allTable: !this.state.allTable,
        });
    }

    deatils = (record,type) => {
      // console.log('current',this.state.current);
        record.type = type;
        if(record.ly_dm === '2' && type==='0'){
            this.props.dispatch({
                type: 'VideoDate/mccHistoricalVideo',
                payload: {
                    beginTime:'',
                    cameraName:'',
                    cameraNum:'',
                    endTime:'',
                    handleareaNum:'',
                    roomName:'',
                },
                callback: (data) => {
                    console.log('播放办案区视频');
                }
            })
        }else{
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/videoManage/videoData/videoDetail',
                    query: {record: record, id: record && record.id ? record.id+type : '1', tabName:type==='0' ? '播放' : type==='1' ? '编辑' : '关联'},
                }),
            )
        }
    };
  getDel = (record) =>{
    let that = this;
    confirm({
      title: '确定删除该音视频？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      getContainer: document.getElementById('messageBox'),
      onOk() {
        console.log('record.id------->',record.id);
          that.props.dispatch({
              type: 'VideoDate/delAudioAndVideoByid',
              payload: {
                  id: record.id,
              },
              callback:(data)=>{
                  message.success('删除成功');
                  const {formValues} = that.props;
                  const params = {
                      pd: {
                          ...formValues,
                      },
                      currentPage: that.props.data && that.props.data.page ? that.props.data.page.currentPage : 1,
                      showCount: that.props.data && that.props.data.page ? that.props.data.page.pageSize : 10,
                  };
                  that.props.getList(params);
              }
          });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
    render() {
        const {data, loading} = this.props;
        const {shareVisible} = this.state;
        const status = ['否', '是'];
        let columns;
        columns = [
            {
                title: '文件名称',
                dataIndex: 'mc',
                fixed: 'left',
                width: 200,
                render: text => {
                    return (
                        <Ellipsis length={23} tooltip>
                            {text}
                        </Ellipsis>
                    );
                },
            },
            {
                title: '文件类别',
                dataIndex: 'lb_mc',
            },
            {
                title: '录制日期',
                dataIndex: 'lz_rq',
            },
            {
                title: '上传日期',
                dataIndex: 'upload_rq',
            },
          {
            title: '音视频来源',
            dataIndex: 'ly_mc',
          },{
            title: '案件名称',
            dataIndex: 'ajmc',
          },{
            title: '案件类别',
            dataIndex: 'ajlbmc',
          },{
            title: '办案单位',
            dataIndex: 'zbrdw_mc',
            render: text => {
                return (
                    <span>
                        {
                            this.state.allTable ? <Ellipsis lines={2} tooltip>{text}</Ellipsis> : text
                        }
                    </span>
                );
            },
          },{
            title: '办案人',
            dataIndex: 'zbrxm'
          },{
            title: '案件状态',
            dataIndex: 'ajzt'
          },{
            title: <div>是否关联 <Icon type={this.state.allTable ? 'left' : 'right'} className={styles.iconStyle} onClick={this.getAllTable}/></div>,
            dataIndex: 'sfgl',
                render: text => {
                    return (
                        <span>{text == 1 ? '是':'否'}</span>
                    );
                },
          },
          this.state.allTable ? {
            title: '案件编号',
            dataIndex: 'ajbh',
            width: 200,
          } : {},
          this.state.allTable ? {
            title: '警情编号',
            dataIndex: 'jqbh',
            width: 210,
          }: {},
            {
                title: '操作',
                fixed: 'right',
                width: 200,
                render: (record) => (
                    <div>
                      {authorityIsTrue('zhag_yspsj_bf') ?
                       <span>
                           <a onClick={()=>this.deatils(record,'0')}>播放</a>
                        <Divider type="vertical"/>
                       </span> : ''}
                      {authorityIsTrue('zhag_yspsj_gl') ?<span>
                        {record.sfgl == '1' ? <a onClick={()=>this.deatils(record,'1')}>编辑</a> : <a onClick={()=>this.deatils(record,'2')}>关联</a>}
                        <Divider type="vertical"/>
                        </span> : ''}
                      {authorityIsTrue('zhag_yspsj_xz') ?<span>
                        <a>下载</a>
                        <Divider type="vertical"/>
                        </span> : ''}
                      {authorityIsTrue('zhag_yspsj_sc') ?<a onClick={()=>this.getDel(record)}>删除</a>: ''}
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
            <div className={styles.standardTable}>
                <Card className={styles.cardArea} id='jqsjcardArea'>
                    <Table
                        // size={'middle'}
                        loading={loading}
                        rowKey={record => record.key}
                        dataSource={data.list}
                        columns={columns}
                        pagination={paginationProps}
                        onChange={this.props.onChange}
                        locale={{
                            emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                        scroll={this.state.allTable ? { x: '120%' } : {}}
                    />
                </Card>
            </div>
        );
    }
}

export default RenderTable;
