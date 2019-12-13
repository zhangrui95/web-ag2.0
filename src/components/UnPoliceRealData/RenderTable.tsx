import React, { PureComponent } from 'react';
import {Table, Badge, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty} from 'antd';
import { connect } from 'dva';
import styles from './RenderTable.less';
import ShareModal from './../ShareModal/ShareModal';
import {routerRedux} from "dva/router";
// import Detail from '../../routes/UnPoliceRealData/unpoliceDetail';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import noList from "@/assets/viewData/noList.png";

@connect(({ share }) => ({
    share,
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
            tzlx: 'jqwt',
            sx: '',
            current: '',

            searchDetail: '',
        };
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
        this.setState({
            current: pagination.current,
        });
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.deatils(this.props.location.query);
        }
    }

    deatils = (record) => {
        // const divs = (
        //     <div>
        //         <Detail
        //             id={id}
        //             wtid={wtid}
        //             {...this.props}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '警情告警详情', content: divs, key: id };
        // this.props.newDetail(AddNewDetail);
        this.props.dispatch({
          type: 'global/changeNavigation',
          payload: {
            key: record && record.id ? record.id : '1',
            name: '警情告警详情',
            path: '/receivePolice/AlarmPolice/unpoliceDetail',
            isShow: true,
            query: { record, id: record && record.id ? record.id : '1' },
          },
          callback: () => {
            this.props.dispatch(
              routerRedux.push({
                pathname: '/receivePolice/AlarmPolice/unpoliceDetail',
                query: { record: record,id: record && record.id ? record.id : '1' },
              }),
            )
          },
        });
    };
    saveShare = (res, type, ajGzLx) => {
        this.setState({
            sx: (res.jqmc ? res.jqmc + '、' : '') + (res.wtlx ? res.wtlx + '、' : '') + (res.gjsj ? res.gjsj : ''),
            shareRecord: res,
        });
        if (type === 2) {
          let detail = (
            <Row style={{ lineHeight: '50px',paddingLeft:66 }}>
              <Col
                span={8}>接警人：{res && res.jjr ? res.jjr : ''}</Col>
              <Col span={8}>管辖单位：<Tooltip
                title={res && res.jjdw_mc && res.jjdw_mc.length > 12 ? res.jjdw_mc : null}>{res && res.jjdw_mc ? res.jjdw_mc.length > 12 ? res.jjdw_mc.substring(0, 12) + '...' : res.jjdw_mc : ''}</Tooltip></Col>
              <Col span={8}>接警信息：<Tooltip
                title={res && res.jjnr && res.jjnr.length > 12 ? res.jjnr : null}>{res && res.jjnr ? res.jjnr.length > 12 ? res.jjnr.substring(0, 12) + '...' : res.jjnr : ''}</Tooltip></Col>
              <Col
                span={8}>处警人：{res && res.cjr ? res.cjr : ''}</Col>
              <Col span={8}>处警单位：<Tooltip
                title={res && res.cjdw_mc && res.cjdw_mc.length > 12 ? res.cjdw_mc : null}>{res && res.cjdw_mc ? res.cjdw_mc.length > 12 ? res.cjdw_mc.substring(0, 12) + '...' : res.cjdw_mc : ''}</Tooltip></Col>
              <Col span={8}>处警信息：<Tooltip
                title={res && res.cjqk && res.cjqk.length > 12 ? res.cjqk : null}>{res && res.cjqk ? res.cjqk.length > 12 ? res.cjqk.substring(0, 12) + '...' : res.cjqk : ''}</Tooltip></Col>
            </Row>
          )
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/Share',
              query: { record: res,id: res && res.id ? res.id : '1',from:'警情信息',tzlx:'jqxx',fromPath:'/receivePolice/AlarmPolice',detail,tab:'表格' },
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
                    agid: res.wtid,
                    lx: this.state.lx,
                    sx: (res.jqmc ? res.jqmc + '、' : '') + (res.wtlx ? res.wtlx + '、' : '') + (res.gjsj ? res.gjsj : ''),
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
    // 打开督办模态框
    supervise = (flag, record) => {
        const { id, wtid } = record;
        this.props.dispatch({
            type: 'UnPoliceData/UnPoliceDetailFetch',
            payload: {
                id,
                wtid,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        searchDetail: data,
                    });
                    this.searchDetail(flag, record);
                }
            },
        });
    };
    searchDetail = (flag, record) => {
        const { wtid } = record;
        this.props.dispatch({
            type: 'UnPoliceData/getUnPoliceByProblemId',
            payload: {
                pd: {
                    wtid,
                },
                currentPage: 1,
                showCount: 9999,
            },
            callback: (data) => {
                if (data.list[0].dbzt === '00') {
                  const {searchDetail} = this.state;
                    // this.props.openModal(this.state.searchDetail, flag, record);
                    this.props.dispatch(
                      routerRedux.push({
                        pathname: '/ModuleAll/Supervise',
                        query: { record:searchDetail,searchDetail:record,id: searchDetail && searchDetail.id ? searchDetail.id : '1',from:'督办',tzlx:'jqxx',fromPath:'/receivePolice/AlarmPolice',tab:'表格'},
                      }),
                    )
                } else {
                    message.warning('该问题已督办，请点击详情查看');
                    this.props.refreshTable();
                }
            },
        });
    };

    render() {
        const { data, loading, isDb } = this.props;
        const status = ['否', '是'];
        let columns;
        columns = [
            {
                title: '告警时间',
                dataIndex: 'gjsj',
                width: 100,
            },
            {
                title: '问题类型',
                dataIndex: 'wtlx',
            },
            {
                title: '接警来源',
                dataIndex: 'jjly_mc',
            },
            {
                title: '管辖单位',
                dataIndex: 'jjdw_mc',
                width: '15%',
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
                width: 100,
            },
            {
                title: '处警单位',
                dataIndex: 'cjdw_mc',
                width: '15%',
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
                title: '是否受案',
                dataIndex: 'is_sa',
                width: 50,
                render(text) {
                    return <span>{status[text]}</span>;
                },
            },
            {
                title: '消息状态',
                dataIndex: 'dbztMc',
            },
            {
                title: '产生方式',
                dataIndex: 'csfs',
            },
            {
                title: '操作',
                render: (record) => {
                    return (
                        <div>
                            {
                                isDb ? (
                                    <span style={{ display: 'inlineBlock' }}>
                                        {
                                            record.dbzt === '00' ?
                                                <a onClick={() => this.supervise(true, record)}>督办</a>
                                                :
                                                <a style={{ color: '#C3C3C3' }}>督办</a>
                                        }
                                        <Divider type="vertical"/>
                                    </span>
                                ) : null
                            }
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
                                        getPopupContainer={() => document.getElementById('jqgjcardArea')}
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
                    );
                },
            },
        ];

        const paginationProps = {
            // showSizeChanger: true,
            // showQuickJumper: true,
            current: data.page ? data.page.currentPage : '',
            total: data.page ? data.page.totalResult : '',
            pageSize: data.page ? data.page.showCount : '',
            showTotal: (total, range) =>
      <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页，${data.page ? data.page.totalResult : 0} 条记录`}</span>,
        };
        let detail = (
            <Row style={{ width: '90%', margin: '0 52px 10px', lineHeight: '36px', color: 'rgba(0, 0, 0, 0.85)' }}>
                <Col
                    span={8}>接警人：{this.state.shareRecord && this.state.shareRecord.jjr ? this.state.shareRecord.jjr : ''}</Col>
                <Col span={8}>管辖单位：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.jjdw_mc && this.state.shareRecord.jjdw_mc.length > 12 ? this.state.shareRecord.jjdw_mc : null}>{this.state.shareRecord && this.state.shareRecord.jjdw_mc ? this.state.shareRecord.jjdw_mc.length > 12 ? this.state.shareRecord.jjdw_mc.substring(0, 12) + '...' : this.state.shareRecord.jjdw_mc : ''}</Tooltip></Col>
                <Col span={8}>接警信息：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.jjnr && this.state.shareRecord.jjnr.length > 12 ? this.state.shareRecord.jjnr : null}>{this.state.shareRecord && this.state.shareRecord.jjnr ? this.state.shareRecord.jjnr.length > 12 ? this.state.shareRecord.jjnr.substring(0, 12) + '...' : this.state.shareRecord.jjnr : ''}</Tooltip></Col>
                <Col
                    span={8}>处警人：{this.state.shareRecord && this.state.shareRecord.cjr ? this.state.shareRecord.cjr : ''}</Col>
                <Col span={8}>处警单位：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.cjdw_mc && this.state.shareRecord.cjdw_mc.length > 12 ? this.state.shareRecord.cjdw_mc : null}>{this.state.shareRecord && this.state.shareRecord.cjdw_mc ? this.state.shareRecord.cjdw_mc.length > 12 ? this.state.shareRecord.cjdw_mc.substring(0, 12) + '...' : this.state.shareRecord.cjdw_mc : ''}</Tooltip></Col>
                <Col span={8}>处警信息：<Tooltip
                    title={this.state.shareRecord && this.state.shareRecord.cjqk && this.state.shareRecord.cjqk.length > 12 ? this.state.shareRecord.cjqk : null}>{this.state.shareRecord && this.state.shareRecord.cjqk ? this.state.shareRecord.cjqk.length > 12 ? this.state.shareRecord.cjqk.substring(0, 12) + '...' : this.state.shareRecord.cjqk : ''}</Tooltip></Col>
            </Row>
        );
        return (
            <div className={styles.standardTable} id='jqgjcardArea'>
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
