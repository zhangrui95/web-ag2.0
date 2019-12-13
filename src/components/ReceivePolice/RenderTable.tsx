/*
* AlarmData/index.js/rendertable 接处警警情数据表格组件
* author：jhm
* 20180605
* */

import React, { PureComponent } from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Card, Empty} from 'antd';
import styles from './RenderTable.less';
import Detail from '../../pages/receivePolice/AlarmData/policeDetail';
import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";

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
            current: '',
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
          this.props.dispatch(
            routerRedux.push({
              pathname: '/receivePolice/AlarmData/policeDetail',
              query: { record: record,id: record && record.id ? record.id : '1' },
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
    saveShare = (res, type, ajGzLx) => {
        this.setState({
            sx: (res.jjdw ? res.jjdw + '、' : '') + (res.jjly_mc ? res.jjly_mc + '、' : '') + (res.jqlb ? res.jqlb + '、' : '') + (res.jjsj ? res.jjsj : ''),
            shareRecord: res,
        });
        if (type === 2) {
            this.setState({
                shareVisible: true,
                shareItem: res,
            });
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
                callback: (res) => {
                    if (!res.error) {
                        message.success('关注成功');
                        this.props.getPolice({ currentPage: this.state.current, pd: this.props.formValues });
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
                    this.props.getPolice({ currentPage: this.state.current, pd: this.props.formValues });
                }
            },
        });
    };

    render() {
        const { data, loading } = this.props;
        const { shareVisible } = this.state;
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
                width:80,
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
                        <Ellipsis tooltip lines={3} >{text}</Ellipsis>
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
                title: window.configUrl.is_area === '2'?'是否分流':'是否处警',
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
                <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${data.page ? data.page.totalResult : 0} 条记录`}</span>,
        };
        let detail = (
            <Row style={{ width: '90%', margin: '0 52px 10px', lineHeight: '36px', color: 'rgba(0, 0, 0, 0.85)' }}>
                <Col
                    span={8}>接警人：{this.state.shareRecord && this.state.shareRecord.jjr ? this.state.shareRecord.jjr : ''}</Col>
                <Col span={8}>管辖单位：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.jjdw && this.state.shareRecord.jjdw.length > 12 ? this.state.shareRecord.jjdw : null}>{this.state.shareRecord && this.state.shareRecord.jjdw ? this.state.shareRecord.jjdw.length > 12 ? this.state.shareRecord.jjdw.substring(0, 12) + '...' : this.state.shareRecord.jjdw : ''}</Tooltip></Col>
                <Col span={8}>接警信息：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.jjnr && this.state.shareRecord.jjnr.length > 12 ? this.state.shareRecord.jjnr : null}>{this.state.shareRecord && this.state.shareRecord.jjnr ? this.state.shareRecord.jjnr.length > 12 ? this.state.shareRecord.jjnr.substring(0, 12) + '...' : this.state.shareRecord.jjnr : ''}</Tooltip></Col>
                <Col
                    span={8}>处警人：{this.state.shareRecord && this.state.shareRecord.cjr ? this.state.shareRecord.cjr : ''}</Col>
                <Col span={8}>处警单位：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.cjdw && this.state.shareRecord.cjdw.length > 12 ? this.state.shareRecord.cjdw : null}>{this.state.shareRecord && this.state.shareRecord.cjdw ? this.state.shareRecord.cjdw.length > 12 ? this.state.shareRecord.cjdw.substring(0, 12) + '...' : this.state.shareRecord.cjdw : ''}</Tooltip></Col>
                <Col span={8}>处警信息：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.cjqk && this.state.shareRecord.cjqk.length > 12 ? this.state.shareRecord.cjqk : null}>{this.state.shareRecord && this.state.shareRecord.cjqk ? this.state.shareRecord.cjqk.length > 12 ? this.state.shareRecord.cjqk.substring(0, 12) + '...' : this.state.shareRecord.cjqk : ''}</Tooltip></Col>
            </Row>
        );
        return (
            <div className={styles.standardTable}>
                {/*<div>数据长度:{data.list?data.list.length:'无数据'}</div>*/}
              <Card className={styles.cardArea}>
                <Table
                    // size={'middle'}
                    loading={loading}
                    rowKey={record => record.key}
                    dataSource={data.list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
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
