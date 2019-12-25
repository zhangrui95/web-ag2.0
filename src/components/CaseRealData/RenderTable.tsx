/*
 * CaseRealData/RenderTable.js 受立案刑事案件表格组件
 * author：jhm
 * 20180605
 * */

import React, {PureComponent} from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Card, Empty} from 'antd';
import styles from './RenderTable.less';
// import Detail from '../../routes/CaseRealData/caseDetail';
// import CriminalCaseDocDetail from '../../routes/AllDocuments/CriminalCaseDocDetail';
// import ShareModal from './../ShareModal/ShareModal';
// import MakeTableModal from './MakeTableModal';
// import RetrieveModal from './../ShareModal/RetrieveModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {getUserInfos, tableList, userAuthorityCode} from '../../utils/utils';
import {authorityIsTrue} from '../../utils/authority';
import stylescommon from '../../pages/common/common.less';
import noList from '../../assets/viewData/noList.png';
import {routerRedux} from 'dva/router';
import noListLight from "@/assets/viewData/noListLight.png";
import {connect} from "dva";

@connect(({global}) => ({
    global
}))
class RenderTable extends PureComponent {
    state = {
        shareVisible: false,
        shareItem: null,
        personList: [],
        lx: '案件信息',
        tzlx: window.configUrl.is_area === '1' ? 'xsajxx' + 3 : 'xsajxx' + this.props.ssmk,
        sx: '',
        current: 1,
        shareRecord: null,
        RetrieveRecord: null,
        makeTableModalVisible: false, // 制表
        caseRecord: null,
        isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
        isTb: authorityIsTrue(userAuthorityCode.TUIBU), // 退补权限
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
        this.setState({
            current: pagination.current,
        });
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            let record = this.props.location.query.record;
            this.deatils(record);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isReset !== nextProps.isReset) {
            this.refreshTable();
        }
    }

    deatils = record => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                query: {id: record.system_id, record: record,movefrom: '刑事案件常规',current:this.state.current},
            }),
        );
    };
    refreshDetail = (res) => {
      console.log('res',res);
      this.props.dispatch({
        type: 'CaseData/getAjxxXqById',
        payload: {
          system_id: res.system_id,
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
    // 刑事案件档案
    caseDocdeatils = record => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/lawEnforcement/File/CriminalFile/Detail',
                query: {id: record && record.system_id ? record.system_id : '1', record: record},
            }),
        );
    };
    saveShare = (res, type, ajGzLx) => {
        this.setState({
            sx: (res.ajmc ? res.ajmc + '、' : '') + (res.schj ? res.schj : ''),
            shareRecord: res,
        });
        if (type === 2) {
            let detail = [`案件名称：${res && res.ajmc ? res.ajmc : ''}`, `办案单位：${res && res.bardwmc ? res.bardwmc : ''}`,
                `案件状态：${res && res.schj ? res.schj : ''}`, `办案民警：${res && res.barxm ? res.barxm : ''}`,
            ];
            res.detail = detail;
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/ModuleAll/Share',
                    query: {
                        record: res,
                        id: res && res.system_id ? res.system_id : '1',
                        from: '案件信息',
                        tzlx: 'xsajxx2',
                        fromPath: '/newcaseFiling/caseData/CriminalData',
                        tab: '表格',
                        sx: (res.ajmc ? res.ajmc + '、' : '') + (res.schj ? res.schj : '')
                    },
                }),
            )
            // this.setState({
            //   shareVisible: true,
            //   shareItem: res,
            // });
        } else {
            this.props.dispatch({
                type: 'share/getMyFollow',
                payload: {
                    agid: res.id,
                    lx: this.state.lx,
                    sx: (res.ajmc ? res.ajmc + '、' : '') + (res.schj ? res.schj : ''),
                    type: type,
                    tzlx: this.state.tzlx,
                    wtid: res.wtid,
                    ajbh: res.ajbh,
                    system_id: res.system_id,
                    ajGzLx: ajGzLx,
                    ssmk: this.props.ssmk,
                },
                callback: data => {
                    if (!data.error) {
                        message.success('关注成功');
                        this.props.getCase({currentPage: this.state.current, pd: this.props.formValues});
                        this.refreshDetail(res)
                    }
                },
            });
        }
    };
    handleCancel = e => {
        this.setState({
            shareVisible: false,
        });
    };
    noFollow = record => {
        this.props.dispatch({
            type: 'share/getNoFollow',
            payload: {
                id: record.gzid,
                tzlx: record.tzlx,
                ajbh: record.ajbh,
                ajGzlx: record.ajgzlx,
            },
            callback: res => {
                if (!res.error) {
                    message.success('取消关注成功');
                    this.props.getCase({currentPage: this.state.current, pd: this.props.formValues});
                    this.refreshDetail(record)
                }
            },
        });
    };
    // 制表
    makeTable = (record) => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/Tabulation/Make',
                query: {id: record && record.ajbh ? record.ajbh : '1', record: record},
            }),
        );
    };
    // 退补
    saveRetrieve = (res, flag) => {
        this.props.dispatch({
            type: 'CaseData/caseRetrieveFetch',
            payload: {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    ajbh: res.system_id,
                },
            },
            callback: data => {
                if (data && data.list.length > 0 && data.list[0].tbrq2 && data.list[0].tbyy2) {
                    message.warning('该数据已完成退补功能');
                    this.refreshTable();
                } else {
                    res.url = this.props.location.pathname;
                    this.props.dispatch(
                        routerRedux.push({
                            pathname: '/Retrieve',
                            query: {id: res && res.ajbh ? res.ajbh : '1', record: res},
                        }),
                    );
                }
            },
        });
    };
    // 退补设置成功或取消退补
    RetrieveHandleCancel = e => {
        this.setState({
            RetrieveVisible: false,
        });
    };
    MakeTableCancel = () => {
        this.setState({
            makeTableModalVisible: false,
        });
    };
    refreshTable = () => {
        this.props.getCase({currentPage: this.state.current, pd: this.props.formValues});
    };

    render() {
        const {data, loading} = this.props;
        const {RetrieveVisible, makeTableModalVisible, caseRecord, isTb, isZb} = this.state;
        let columns;
        {
            this.props.from === '执法办案' || this.props.isDocument
                ? (columns = [
                    {
                        title: '案件编号',
                        dataIndex: 'ajbh',
                    },
                    {
                        title: '案件名称',
                        dataIndex: 'ajmc',
                        render: text => {
                            return (
                                <Ellipsis lines={2} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '案件类别',
                        dataIndex: 'ajlbmc',
                        render: text => {
                            return (
                                <Ellipsis length={12} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '办案单位',
                        dataIndex: 'bardwmc',
                        render: text => {
                            return (
                                <Ellipsis lines={2} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '办案人',
                        dataIndex: 'barxm',
                        render: text => {
                            return (
                                <Ellipsis length={8} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '移送起诉时间',
                        dataIndex: 'qsrq',
                    },
                    {
                        title: '立案日期',
                        dataIndex: 'larq',
                    },
                    {
                        title: '案件状态',
                        dataIndex: 'schj',
                    },
                    window.configUrl.is_area === '1'
                        ? {
                            title: '强制措施',
                            dataIndex: 'qzcsmc',
                        }
                        : {},
                    {
                        title: '操作',
                        render: record => {
                            if (this.props.isDocument) {
                                return (
                                    <div>
                                        <a onClick={() => this.caseDocdeatils(record)}>详情</a>
                                        {isZb ? (
                                            <span>
                          <Divider type="vertical"/>
                          <a onClick={() => this.makeTable(record)}>制表</a>
                        </span>
                                        ) : null}
                                        {isTb ? (
                                            record.ajzt === '结案' ||
                                            record.qsrq === '' ||
                                            (record.tbrq2 && record.tbyy2) ? (
                                                <span>
                            <Divider type="vertical"/>
                            <a style={{color: '#C3C3C3'}}>退补</a>
                          </span>
                                            ) : (
                                                <span>
                            <Divider type="vertical"/>
                            <a onClick={() => this.saveRetrieve(record, true)}>退补</a>
                          </span>
                                            )
                                        ) : null}
                                    </div>
                                );
                            }
                            return (
                                <div>
                                    <a onClick={() => this.deatils(record)}>详情</a>
                                    <Divider type="vertical"/>
                                    {record.sfgz === 0 ? (
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    <Menu.Item key="0">
                                                        <a onClick={() => this.saveShare(record, 1, 0)}>本案件关注</a>
                                                    </Menu.Item>
                                                    <Menu.Item key="1">
                                                        <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                            trigger={['click']}
                                            getPopupContainer={() => document.getElementById('slacardArea')}
                                        >
                                            <a href="javascript:;">关注</a>
                                        </Dropdown>
                                    ) : (
                                        <a href="javascript:;" onClick={() => this.noFollow(record)}>
                                            取消{record.ajgzlx && record.ajgzlx === '0' ? '本案件' : '全要素'}关注
                                        </a>
                                    )}
                                    <Divider type="vertical"/>
                                    <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>
                                        分享
                                    </a>
                                    {isZb ? (
                                        <span>
                        <Divider type="vertical"/>
                        <a onClick={() => this.makeTable(record)}>制表</a>
                      </span>
                                    ) : null}
                                    {isTb ? (
                                        record.ajzt === '结案' ||
                                        record.qsrq === '' ||
                                        (record.tbrq2 && record.tbyy2) ? (
                                            <span>
                          <Divider type="vertical"/>
                          <a style={{color: '#C3C3C3'}}>退补</a>
                        </span>
                                        ) : (
                                            <span>
                          <Divider type="vertical"/>
                          <a onClick={() => this.saveRetrieve(record, true)}>退补</a>
                        </span>
                                        )
                                    ) : null}
                                </div>
                            );
                        },
                    },
                ])
                : (columns = [
                    {
                        title: '案件编号',
                        dataIndex: 'ajbh',
                        width: 200,
                    },
                    {
                        title: '案件名称',
                        dataIndex: 'ajmc',
                        width: '25%',
                        render: text => {
                            return (
                                <Ellipsis lines={2} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '案件类别',
                        dataIndex: 'ajlbmc',
                        render: text => {
                            return (
                                <Ellipsis length={12} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '办案单位',
                        dataIndex: 'bardwmc',
                        width: '17%',
                        render: text => {
                            return (
                                <Ellipsis lines={2} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '办案人',
                        dataIndex: 'barxm',
                        render: text => {
                            return (
                                <Ellipsis length={8} tooltip>
                                    {text}
                                </Ellipsis>
                            );
                        },
                    },
                    {
                        title: '立案日期',
                        dataIndex: 'larq',
                        width: 100,
                    },
                    {
                        title: '案件状态',
                        dataIndex: 'schj',
                        width: 50,
                    },
                    window.configUrl.is_area === '1'
                        ? {
                            title: '强制措施',
                            dataIndex: 'qzcsmc',
                        }
                        : {},
                    {
                        title: '操作',
                        render: record => {
                            if (this.props.isDocument) {
                                return (
                                    <div>
                                        <a onClick={() => this.caseDocdeatils(record)}>详情</a>
                                        {isZb ? (
                                            <span>
                          <Divider type="vertical"/>
                          <a onClick={() => this.makeTable(record)}>制表</a>
                        </span>
                                        ) : null}
                                    </div>
                                );
                            }
                            return (
                                <div>
                                    <a onClick={() => this.deatils(record)}>详情</a>
                                    <Divider type="vertical"/>
                                    {record.sfgz === 0 ? (
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    <Menu.Item key="0">
                                                        <a onClick={() => this.saveShare(record, 1, 0)}>本案件关注</a>
                                                    </Menu.Item>
                                                    <Menu.Item key="1">
                                                        <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                            trigger={['click']}
                                            getPopupContainer={() => document.getElementById('slacardArea')}
                                        >
                                            <a href="javascript:;">关注</a>
                                        </Dropdown>
                                    ) : (
                                        <a href="javascript:;" onClick={() => this.noFollow(record)}>
                                            取消{record.ajgzlx && record.ajgzlx === '0' ? '本案件' : '全要素'}关注
                                        </a>
                                    )}
                                    <Divider type="vertical"/>
                                    <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>
                                        分享
                                    </a>
                                    {isZb ? (
                                        <span>
                        <Divider type="vertical"/>
                        <a onClick={() => this.makeTable(record, true)}>制表</a>
                      </span>
                                    ) : null}
                                </div>
                            );
                        },
                    },
                ]);
        }

        const paginationProps = {
            current: data && data.page ? data.page.currentPage : '',
            total: data && data.page ? data.page.totalResult : '',
            pageSize: data && data.page ? data.page.showCount : '',
            showTotal: (total, range) => (
                <span
                    className={
                        data &&
                        data.page &&
                        data.page.totalResult &&
                        data.page.totalResult.toString().length < 5
                            ? stylescommon.pagination
                            : stylescommon.paginations
                    }
                >{`共 ${data && data.page ? data.page.totalPage : 1} 页，${
                    data && data.page ? data.page.totalResult : 0
                    } 条数据 `}</span>
            ),
        };

        return (
            <Card className={stylescommon.cardArea} id='slacardArea'>
                <Table
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
        );
    }
}

export default RenderTable;
