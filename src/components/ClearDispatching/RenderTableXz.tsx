import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, Row, Col } from 'antd';
import styles from './common.less';
import SLAXZDetail from '../../routes/UnXzCaseRealData/caseDetail';
import DispatchModal from '../DispatchModal/DispatchModal';
import DispatchingRecordModal from '../DispatchModal/DispatchingRecordModal';
import Ellipsis from '../Ellipsis';
import { authorityIsTrue } from '../../utils/authority';

class RenderTableXz extends PureComponent {
    state = {
        searchDetail: '',
        shareVisible: false,
        shareItem: null,
        personList: [],
        lx: '案件信息',
        tzlx: 'xzaj',
        sx: '',
        ResOpin: '', // 反馈的原因和结果(案件暂无)
        current: '',
        ddBtn:authorityIsTrue('zhag_dd_btn'),
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.deatils(this.props.location.query.record);
        }
    }

    deatils = (record) => {
        // if(this.props.belongTo==='受立案'){
        const divs = (
            <div>
                <SLAXZDetail
                    {...this.props}
                    id={record.id}
                    systemId={record.system_id}
                    dbzt={record.dbzt}
                    supervise={this.supervise}
                    record={record}
                    saveDispatch={this.saveDispatch}
                    isDd={this.state.ddBtn}
                />
            </div>
        );
        const AddNewDetail = { title: '行政案件详情', content: divs, key: record.id };
        this.props.newDetail(AddNewDetail);

    };
    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
        this.setState({
            current: pagination.current,
        });
    };
    closehandleCancel = () => {
      this.setState({
        shareVisible: false,
        AnnouncementVisible: false,
      });
    };
    handleCancel = (e) => {
      this.setState({
        shareVisible: false,
        AnnouncementVisible: false,
      });
    };
    DispatchinghandleCancel = () => {
      this.setState({
        AnnouncementVisible: false,
        RzList:[],
        ResOpin:'',
      });
    };
    saveDispatch = (res) => {
        this.setState({
            shareVisible: true,
            shareItem: res,
        });
    };
    getTg = (record) => {
        this.setState({
            AnnouncementVisible: true,
        });
        this.props.dispatch({
            type: 'Dispatch/getDdjl',
            payload: {
                dd_type: 'xzaj',
                glid: record.wtid,
            },
            callback: (res) => {
                this.setState({
                    RzList: res.list,
                });
            },
        });
    };

    render() {
        const { data, loading } = this.props;
        let columns;
        if (this.props.ddqk) {
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
                    title: '案件编号',
                    dataIndex: 'ajbh',
                    width: 200,
                },
                {
                    title: '案件名称',
                    dataIndex: 'ajmc',
                    width: '15%',
                    render: (text) => {
                        return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '受理单位',
                    dataIndex: 'sldw_name',
                    width: '12%',
                    render: (text) => {
                        return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '办案人',
                    dataIndex: 'bar_name',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '案件状态',
                    dataIndex: 'ajzt',
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
                    title: '调度人',
                    dataIndex: 'ddr_name',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '调度时间',
                    dataIndex: 'ddsj',
                    width: 100,
                },
                {
                    title: '调度意见',
                    dataIndex: 'ddyj',
                    width: '15%',
                    render: (text) => {
                        return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
                    },
                },
            ];
        } else {
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
                    title: '案件编号',
                    dataIndex: 'ajbh',
                    width: 200,
                },
                {
                    title: '案件名称',
                    dataIndex: 'ajmc',
                    width: '20%',
                    render: (text) => {
                        return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '受理单位',
                    dataIndex: 'sldw_name',
                    width: '15%',
                    render: (text) => {
                        return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '办案人',
                    dataIndex: 'bar_name',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '案件状态',
                    dataIndex: 'ajzt',
                },
                {
                    title: '消息状态',
                    dataIndex: 'dbztMc',
                },
                {
                    title: '产生方式',
                    dataIndex: 'csfs',
                },
                this.props.showDataView ? {} : {
                    title: '调度时间',
                    dataIndex: 'ddsj',
                    width: 100,
                },
                {
                    title: '操作',
                    render: (record) => {
                        return (
                            <div>
                                <a onClick={() => this.deatils(record)}>详情</a>
                                <Divider type="vertical"/>
                                {
                                    this.props.showDataView ?
                                        this.state.ddBtn ?
                                        <a href="javascript:;" onClick={() => this.saveDispatch(record)}>调度</a> : ''
                                        : <a href="javascript:;" onClick={() => this.getTg(record)}>调度记录</a>
                                }
                            </div>
                        );
                    },
                },
            ];
        }

        const paginationProps = {
            showSizeChanger: this.props.ddqk ? false : true,
            showQuickJumper: true,
            current: data.page ? data.page.currentPage : '',
            total: data.page ? data.page.totalResult : '',
            pageSize: data.page ? data.page.showCount : '',
            showTotal: (total, range) =>
                <span
                    className={styles.pagination}>{`共 ${data.page ? data.page.totalResult : 0} 条记录 第 ${data.page ? data.page.currentPage : 1} / ${data.page ? data.page.totalPage : 1} 页`}</span>,
        };
        let detail = (
            <Row style={{ width: '90%', margin: '0 38px 10px', lineHeight: '36px', color: 'rgba(0, 0, 0, 0.85)' }}>
                <Col span={12}>案件名称：<Tooltip
                    title={this.state.shareItem && this.state.shareItem.ajmc && this.state.shareItem.ajmc.length > 20 ? this.state.shareItem.ajmc : null}>{this.state.shareItem && this.state.shareItem.ajmc ? this.state.shareItem.ajmc.length > 20 ? this.state.shareItem.ajmc.substring(0, 20) + '...' : this.state.shareItem.ajmc : ''}</Tooltip></Col>
                <Col span={12}>受理单位：<Tooltip
                    title={this.state.shareItem && this.state.shareItem.sldw_name && this.state.shareItem.sldw_name.length > 20 ? this.state.shareItem.sldw_name : null}>{this.state.shareItem && this.state.shareItem.sldw_name ? this.state.shareItem.sldw_name.length > 20 ? this.state.shareItem.sldw_name.substring(0, 20) + '...' : this.state.shareItem.sldw_name : ''}</Tooltip></Col>
                <Col
                    span={12}>案件状态：{this.state.shareItem && this.state.shareItem.ajzt ? this.state.shareItem.ajzt : ''}</Col>
                <Col
                    span={12}>办案民警：{this.state.shareItem && this.state.shareItem.bar_name ? this.state.shareItem.bar_name : ''}</Col>
            </Row>
        );
        return (
            <div className={styles.standardTable}>
                <Table
                    size={'middle'}
                    loading={loading}
                    rowKey={record => record.key}
                    dataSource={data.list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                />
                {
                  this.state.shareVisible?
                    <DispatchModal
                      handleSearch={this.props.handleSearch}
                      title="行政案件调度"
                      detail={detail}
                      shareVisible={this.state.shareVisible}
                      handleCancel={this.handleCancel}
                      closehandleCancel={this.closehandleCancel}
                      shareItem={this.state.shareItem}
                      personList={this.state.personList}
                      lx={this.state.lx}
                      tzlx={this.state.tzlx}
                      sx={this.state.sx}
                    />
                    : null
                }
                {
                  this.state.AnnouncementVisible?
                    <DispatchingRecordModal visible={this.state.AnnouncementVisible} DispatchinghandleCancel={this.DispatchinghandleCancel}  ResOpin={this.state.ResOpin} NowRecord={this.state.NowRecord} saveDispatch={this.saveDispatch} RzList={this.state.RzList} from='三清行政案件告警'/>
                    :
                    null
                }
            </div>
        );
    }
}

export default RenderTableXz;
