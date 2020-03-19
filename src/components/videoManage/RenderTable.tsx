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

    handleTableChange = (pagination, filters, sorter) => {
      // const {formValues} = this.state;
      // const params = {
      //   pd: {
      //     ...formValues,
      //     is_bbtz: '0',
      //   },
      //   currentPage: pagination.current,
      //   showCount: pagination.pageSize,
      // };
      // this.getUnCase(params);
        this.setState({
            current: pagination.current,
        });
    };

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
        this.props.dispatch(
            routerRedux.push({
                pathname: '/videoManage/videoData/videoDetail',
                query: {record: record, id: record && record.id ? record.id+type : '1', tabName:type==='0' ? '播放' : type==='1' ? '编辑' : '关联'},
            }),
        )

        // const divs = (
        //     <div>
        //         <Detail
        //             record={record}
        //             id={id}
        //             sfgz={sfgz}
        //             gzid={gzid}
        //             tzlx={tzlx}
        //             ajbh={ajbh}
        //             systemId={systemId}
        //             {...this.props}
        //             current={this.state.current}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '警情详情', content: divs, key: id };
        // this.props.newDetail(AddNewDetail);
    };
    refreshDetail = (res) => {
      // console.log('res',res);
      this.props.dispatch({
        type: 'policeData/policeDetailFetch',
        payload: {
          id: res.id,
        },
        callback: data => {
          // if (data) {
          //   this.setState({
          //     policeDetails: data,
          //     IsSure: true,
          //   });
          // }
        },
      });
    };
    saveShare = (res, type, ajGzLx) => {
        this.setState({
            sx: (res.jjdw ? res.jjdw + '、' : '') + (res.jjly_mc ? res.jjly_mc + '、' : '') + (res.jqlb ? res.jqlb + '、' : '') + (res.jjsj ? res.jjsj : ''),
            shareRecord: res,
        });
        if (type === 2) {
            let detail = [ `管辖单位：${res && res.jjdw ? res.jjdw : ''}`,`接警人：${res && res.jjr ? res.jjr : ''}`,
                `接警信息：${res && res.jjnr ? res.jjnr : ''}`, `处警单位：${res && res.cjdw ? res.cjdw : ''}`,
                `处警人：${res && res.cjr ? res.cjr : ''}`,`处警信息：${res && res.cjqk ? res.cjqk : ''}`,
                `处置结果：${res && res.czjg_mc ? res.czjg_mc : ''}`
            ];
            res.detail = detail;
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/ModuleAll/Share',
                    query: {
                        record: res,
                        id: res && res.id ? res.id : '1',
                        from: this.state.lx,
                        tzlx: this.state.tzlx,
                        fromPath: '/receivePolice/AlarmData',
                        tab: '表格',
                        sx: (res.jjdw ? res.jjdw + '、' : '') + (res.jjly_mc ? res.jjly_mc + '、' : '') + (res.jqlb ? res.jqlb + '、' : '') + (res.jjsj ? res.jjsj : ''),
                    },
                }),
            )
            // this.setState({
            //     shareVisible: true,
            //     shareItem: res,
            // });
        } else {
            this.props.dispatch({
                type: 'share/getMyFollow',
                payload: {
                    agid: res.id,
                    lx: this.state.lx,
                    sx: (res.jjdw ? res.jjdw + '、' : '') + (res.jjly_mc ? res.jjly_mc + '、' : '') + (res.jqlb ? res.jqlb + '、' : '') + (res.jjsj ? res.jjsj : ''),
                    type: type,
                    tzlx: this.state.tzlx,
                    wtid: res.wtid,
                    ajbh: res.ajbh,
                    system_id: res.id,
                    ajGzLx: ajGzLx,
                    is_fxgz:'0',
                },
                callback: (data) => {
                    if (!data.error) {
                        message.success('关注成功');
                        this.props.getList({currentPage: this.state.current, pd: this.props.formValues});
                        this.refreshDetail(res);
                    }
                },
            });
        }
    };
    handleCancel = (e) => {
        this.setState({
            shareVisible: false,
        });
    };
    noFollow = (record) => {
        this.props.dispatch({
            type: 'share/getNoFollow',
            payload: {
                id: record.gzid,
                tzlx: record.tzlx,
                ajbh: record.ajbh,
                ajGzlx: record.ajgzlx,
            },
            callback: (res) => {
                if (!res.error) {
                    message.success('取消关注成功');
                    this.props.getList({currentPage: this.state.current, pd: this.props.formValues});
                    this.refreshDetail(record);
                }
            },
        });
    };
  getDel = (record) =>{
    confirm({
      title: '确定删除该音视频？',
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
                        <Ellipsis lines={2} tooltip>
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
                        {record.sfgl === '是' ? <a onClick={()=>this.deatils(record,'1')}>编辑</a> : <a onClick={()=>this.deatils(record,'2')}>关联</a>}
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
                {/*<div>数据长度:{data.list?data.list.length:'无数据'}</div>*/}
                <Card className={styles.cardArea} id='jqsjcardArea'>
                    <Table
                        // size={'middle'}
                        loading={loading}
                        rowKey={record => record.key}
                        dataSource={data.list}
                        columns={columns}
                        pagination={paginationProps}
                        onChange={this.handleTableChange}
                        locale={{
                            emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                        scroll={this.state.allTable ? { x: '120%' } : {}}
                    />
                </Card>
                {/*<ShareModal*/}
                {/*title="警情信息分享"*/}
                {/*detail={detail}*/}
                {/*shareVisible={this.state.shareVisible}*/}
                {/*handleCancel={this.handleCancel}*/}
                {/*shareItem={this.state.shareItem}*/}
                {/*personList={this.state.personList}*/}
                {/*lx={this.state.lx}*/}
                {/*tzlx={this.state.tzlx}*/}
                {/*sx={this.state.sx}*/}
                {/*/>*/}
            </div>
        );
    }
}

export default RenderTable;
