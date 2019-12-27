/*
* AlarmData/index.js/rendertable 接处警警情数据表格组件
* author：jhm
* 20180605
* */

import React, {PureComponent} from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Card, Empty} from 'antd';
import styles from './RenderTable.less';
import Detail from '../../pages/receivePolice/AlarmData/policeDetail';
import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
import {connect} from "dva";
import {tableList} from "@/utils/utils";

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
            lx: '警情信息',
            tzlx: 'jqxx',
            sx: '',
            current: 1,
        };
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
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

    deatils = (record) => {
      console.log('current',this.state.current);
        this.props.dispatch(
            routerRedux.push({
                pathname: '/receivePolice/AlarmData/policeDetail',
                query: {record: record, id: record && record.id ? record.id : '1', movefrom: '警情常规',current:this.state.current},
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
      console.log('res',res);
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
            let detail = [`接警人：${res && res.jjr ? res.jjr : ''}`, `管辖单位：${res && res.jjdw ? res.jjdw : ''}`,
                `接警信息：${res && res.jjnr ? res.jjnr : ''}`, `处警人：${res && res.cjr ? res.cjr : ''}`,
                `处警单位：${res && res.cjdw ? res.cjdw : ''}`, `处警信息：${res && res.cjqk ? res.cjqk : ''}`,
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
                },
                callback: (data) => {
                    if (!data.error) {
                        message.success('关注成功');
                        this.props.getPolice({currentPage: this.state.current, pd: this.props.formValues});
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
                    this.props.getPolice({currentPage: this.state.current, pd: this.props.formValues});
                    this.refreshDetail(record);
                }
            },
        });
    };

    render() {
        const {data, loading} = this.props;
        const {shareVisible} = this.state;
        const status = ['否', '是'];
        let columns;
        columns = [
            {
                title: '接警来源',
                dataIndex: 'jjly_mc',
            },
            {
                title: '报警类别',
                dataIndex: 'jqlbmc',
                width: 80,
                render: (text) => {
                    return (
                        <Ellipsis tooltip length='7'>{text}</Ellipsis>
                    );
                },
            },
            {
                title: '管辖单位',
                dataIndex: 'jjdw',
                // width: '15%',
                render: (text) => {
                    if (text) {
                        let arry = text.split(',');
                        const num = arry.length - 1;
                        return (
                            <Ellipsis tooltip lines={2}>{arry[num]}</Ellipsis>
                        );
                    }
                },
            },
            {
                title: '接警人',
                dataIndex: 'jjr',
                render: (text) => {
                    if (text) {
                        let arry = text.split(',');
                        const num = arry.length - 1;
                        return (
                            <Ellipsis tooltip length='7'>{arry[num]}</Ellipsis>
                        );
                    }
                },
            },
            {
                title: '接警时间',
                dataIndex: 'jjsj',
                // width: 150,
                // render: (text) => {
                //     return (
                //         <Ellipsis tooltip length='12'>{text}</Ellipsis>
                //     )
                // }
            },
            {
                title: '接警内容',
                dataIndex: 'jjnr',
                width: 287,
                render: (text) => {
                    return (
                        <Ellipsis tooltip lines={2}>{text}</Ellipsis>
                    );
                },
            },
            {
                title: '处警单位',
                dataIndex: 'cjdw',
                width: 239,
                render: (text) => {
                    if (text) {
                        let arry = text.split(',');
                        const num = arry.length - 1;
                        return (
                            <Ellipsis tooltip lines={2}>{arry[num]}</Ellipsis>
                        );
                    }
                },
            },
            {
                title: '处警人',
                dataIndex: 'cjr',
                render: (text) => {
                    if (text) {
                        let arry = text.split(',');
                        const num = arry.length - 1;
                        return (
                            <Ellipsis tooltip length='7'>{arry[num]}</Ellipsis>
                        );
                    }
                },
            },
            {
                title: window.configUrl.is_area === '2' ? '是否分流' : '是否处警',
                dataIndex: 'is_cj',
                // width: 50,
            },
            {
                title: '是否受案',
                dataIndex: 'is_sa',
                // width: 50,
                render(text) {
                    return <span>{status[text]}</span>;
                },
            },
            {
                title: '操作',
                render: (record) => (
                    <div>
                        <a onClick={() => this.deatils(record)}>详情</a>
                        <Divider type="vertical"/>
                        {
                            record.sfgz === 0 ? (
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="0">
                                                <a onClick={() => this.saveShare(record, 1, 0)}>本警情关注</a>
                                            </Menu.Item>
                                            <Menu.Item key="1">
                                                <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={['click']}
                                    getPopupContainer={() => document.getElementById('jqsjcardArea')}
                                >
                                    <a href="javascript:;">关注</a>
                                </Dropdown>
                            ) : (
                                <a href="javascript:;"
                                   onClick={() => this.noFollow(record)}>取消{record.ajgzlx && record.ajgzlx === '0' ? '本警情' : '全要素'}关注</a>
                            )
                        }
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>分享</a>
                    </div>
                ),
            },
        ];

        const paginationProps = {
            // showSizeChanger: true,
            // showQuickJumper: true,
            current: data.page ? data.page.currentPage : '',
            total: data.page ? data.page.totalResult : '',
            pageSize: data.page ? data.page.showCount : '',
            showTotal: (total, range) =>
                <span
                    className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${data.page ? data.page.totalResult : 0} 条记录`}</span>,
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
