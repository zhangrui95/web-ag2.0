/*
 * XzCaseRealData/index.js 受立案行政案件表格组件
 * author：jhm
 * 20180605
 * */

import React, {PureComponent} from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Card, Empty} from 'antd';
import {connect} from 'dva';
import styles from './RenderTable.less';
// import ShareModal from './../ShareModal/ShareModal';
// import Detail from '../../routes/NewXzCaseRealData/caseDetail';
// import MakeTableModal from '../CaseRealData/MakeTableModal';
// import AdministrativeCaseDocDetail from '../../routes/AllDocuments/AdministrativeCaseDocDetail';
import {userAuthorityCode} from '../../utils/utils';
import {authorityIsTrue} from '../../utils/authority';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import stylescommon from '@/pages/common/common.less';
import {routerRedux} from 'dva/router';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

@connect(({share, global}) => ({
    share, global
}))
class RenderTable extends PureComponent {
    state = {
        shareVisible: false,
        shareItem: null,
        personList: [],
        lx: '案件信息',
        tzlx: window.configUrl.is_area === '1' ? 'xzajxx' + 3 : 'xzajxx' + this.props.ssmk,
        sx: '',
        current: 1,
        makeTableModalVisible: false, // 制表
        isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
        caseRecord: null,
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

    deatils = record => {
        // const divs = (
        //     <div>
        //         <Detail
        //             {...this.props}
        //             id={record.id}
        //             systemId={record.system_id}
        //             record={record}
        //             sfgz={record.sfgz}
        //             gzid={record.gzid}
        //             tzlx={this.state.tzlx}
        //             ajbh={record.ajbh}
        //             details={this.deatils}
        //             current={this.state.current}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '行政案件详情', content: divs, key: record.system_id };
        // this.props.newDetail(AddNewDetail);
        // this.props.dispatch({
        //   type: 'global/changeNavigation',
        //   payload: {
        //     key: record && record.id ? record.id : '1',
        //     name: '行政案件详情',
        //     path: '/caseFiling/caseData/AdministrationData/caseDetail',
        //     isShow: true,
        //     query: { record, id: record && record.id ? record.id : '1' },
        //   },
        //   callback: () => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
                query: {id: record && record.system_id ? record.system_id : '1', record: record,movefrom:'行政案件常规',current:this.state.current},
            }),
        );
        //   },
        // });
    };
    // 行政案件档案详情
    administrativeCaseDocDetails = record => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/lawEnforcement/File/AdministrativeFile/Detail',
                query: {id: record && record.system_id ? record.system_id : '1', record: record},
            }),
        );
    };
    refreshDetail = (res) => {
      // console.log('res',res);
      this.props.dispatch({
        type: 'XzCaseData/getXzAjxxXqById',
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
    saveShare = (res, type, ajGzLx) => {
        this.setState({
            sx: (res.ajmc ? res.ajmc + '、' : '') + (res.ajzt ? res.ajzt : ''),
            shareRecord: res,
        });
        if (type === 2) {
            let caseDetails = this.state.shareRecord;
            let detail = [`案件名称：${caseDetails && caseDetails.ajmc ? caseDetails.ajmc : ''}`, `受理单位：${caseDetails && caseDetails.sldwName ? caseDetails.sldwName : ''}`,
                `案件状态：${caseDetails && caseDetails.ajzt ? caseDetails.ajzt : ''}`, `办案民警：${caseDetails && caseDetails.barxm ? caseDetails.barxm : ''}`,
            ];
            res.detail = detail;
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/ModuleAll/Share',
                    query: {
                        record: res,
                        id: res && res.system_id ? res.system_id : '1',
                        from: '案件信息',
                        tzlx: 'xzajxx2',
                        fromPath: '/newcaseFiling/caseData/AdministrationData',
                        tab: '表格',
                        sx: (res.ajmc ? res.ajmc + '、' : '') + (res.ajzt ? res.ajzt : ''),
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
                    sx: (res.ajmc ? res.ajmc + '、' : '') + (res.ajzt ? res.ajzt : ''),
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
    // 关闭制表modal
    MakeTableCancel = () => {
        this.setState({
            makeTableModalVisible: false,
        });
    };

    render() {
        const {data, loading} = this.props;
        const {makeTableModalVisible, caseRecord, isZb} = this.state;
        let columns;
        columns = [
            {
                title: '案件编号',
                dataIndex: 'ajbh',
            },
            {
                title: '案件名称',
                width: '20%',
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
                title: '受理单位',
                width: '15%',
                dataIndex: 'sldwName',
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
                title: '受理日期',
                dataIndex: 'slrq',
            },
            {
                title: '案件状态',
                dataIndex: 'ajzt',
            },
            {
                title: '案件类别',
                dataIndex: 'ajlb_name',
                width: '10%',
                render: text => {
                    return (
                        <Ellipsis lines={2} tooltip>
                            {text}
                        </Ellipsis>
                    );
                },
            },
            // window.configUrl.is_area === '1'?
            //   {
            //     title: '强制措施',
            //     dataIndex: 'qzcsmc',
            //   }:{},
            {
                title: '操作',
                render: record => {
                    if (this.props.isDocument) {
                        return (
                            <div>
                                <a onClick={() => this.administrativeCaseDocDetails(record)}>详情</a>
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
                                    getPopupContainer={() => document.getElementById('xzajcardArea')}
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
                        </div>
                    );
                },
            },
        ];

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
            <Card className={stylescommon.cardArea} id='xzajcardArea'>
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
