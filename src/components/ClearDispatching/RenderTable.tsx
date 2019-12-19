import React, { PureComponent } from 'react';
import {Table, Divider, Tooltip, Row, Col, Popconfirm, message, Empty} from 'antd';
import styles from './common.less';
import Detail from '../../routes/PoliceRealData/policeDetail';
import DispatchModal from './../DispatchModal/DispatchModal';
import DispatchingRecordModal from './../DispatchModal/DispatchingRecordModal';
import ClearOutModal from './../DispatchModal/ClearOutModal';
import FeedModal from './../DispatchModal/FeedModal';
import LeightWord from './LeightWord';
import Ellipsis from '../Ellipsis';
import { authorityIsTrue } from '../../utils/authority';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

class RenderTable extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            addDetail: props.addDetail,
            shareVisible: false,
            shareItem: null,
            personList: [],
            lx: '警情信息',
            tzlx: 'jq',
            sx: '',
            current: '',
            RzList: [],
            ResOpin: '', // 反馈的原因和结果
            clearOutRecord: [], // 清除数据
            clearOutModalVisible: false, // 清除模态框
            feddBackVisible:false, // 反馈模态框
            ddBtn:authorityIsTrue('zhag_dd_btn'),
            qlBtn:authorityIsTrue('zhag_ql_btn'),
            // keyWord:['打','杀','伤','刀','剑','棍','棒','偷','盗','抢','骗','死','赌','毒','卖淫','嫖娼','侮辱'],
            NowRecord:'', // 选中调度记录的警情详情
        };
        this.getPoliceKeyword();
    }

    // 获取接警内容关键字
    getPoliceKeyword = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                currentPage: 1,
                pd: {
                    pid: '500948',//'500502'
                    isCaseAll: true,
                },
                showCount: 999,
            },
            callback: (data) => {
                this.setState({
                    keyWord: data && data.map(item => {
                        return item.name;
                    }),
                });
            },
        });
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
            this.deatils(record, this.props.location.query.id, record.sfgz, record.gzid, record.tzlx, record.ajbh);
        }
    }

    deatils = (record, id, sfgz, gzid, tzlx, ajbh, systemId) => {
        const divs = (
            <div>
                <Detail
                    record={record}
                    id={id}
                    sfgz={sfgz}
                    gzid={gzid}
                    tzlx={tzlx}
                    ajbh={ajbh}
                    systemId={systemId}
                    {...this.props}
                    current={this.state.current}
                    saveDispatch={this.saveDispatch}
                    handleSearch={this.props.handleSearch}
                    isDd={this.state.ddBtn}
                />
            </div>
        );
        const AddNewDetail = { title: '警情详情', content: divs, key: id };
        this.props.newDetail(AddNewDetail);
    };
    closehandleCancel = () => {
        this.setState({
          shareVisible: false,
          AnnouncementVisible: false,
        });

    };
    handleCancel = () => {
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
    ClearOuthandleCancel = () => {
      this.setState({
        clearOutModalVisible: false,
      });
    };
    feedhandleCancel = () => {
        this.setState({
           feddBackVisible:false,
        });
    }
    saveDispatch = (res) => {
        this.setState({
            shareVisible: true,
            shareItem: res,
        });
    };
    // 反馈
    feddBack = (record) => {
        this.setState({
          feddBackVisible: true,
          NowRecord:record,
        });
    }
    // 调度记录
    getTg = (record) => {
        this.setState({
            AnnouncementVisible: true,
            NowRecord:record,
        });
        this.props.dispatch({
            type: 'Dispatch/getDdjl',
            payload: {
                dd_type: 'jq',
                glid: record.id,
            },
            callback: (res) => {
                this.setState({
                    RzList: res.list,
                });
            },
        });
        this.props.dispatch({
          type: 'Dispatch/feedBackReturnModel',
          payload: {
            glid: record.id,
          },
          callback: (res) => {
            this.setState({
              ResOpin: res,
            });
          },
        })
    };
    // 清零历史
    getClearOutHistory = (record) => {
        this.setState({
            clearOutRecord: [record],
            clearOutModalVisible: true,
        });
    };
    // 清除
    clearOutPolice = (rec,is_sqdd) => {
        this.props.dispatch({
            type: 'Dispatch/clearOutPolice',
            payload: {
                qc_type: 'jq',
                glid: rec.id,
            },
            callback: (data) => {
                if (data) message.success('清零成功');
                this.props.handleSearch(null,is_sqdd);
            },
        });
    };

    render() {
        const { data, loading } = this.props;
        let columns;
        if (this.props.ddqk) {
            columns = [
                {
                    title: '接警单位',
                    dataIndex: 'jjdw',
                    width: '12%',
                    render: (text) => {
                        return <Ellipsis tooltip lines={2}>{text}</Ellipsis>;
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
                                <Ellipsis length={7} tooltip>{arry[num]}</Ellipsis>
                            );
                        }
                    },
                },
                {
                    title: '接警详情',
                    dataIndex: 'jjnr',
                    width: '10%',
                    render: (text) => {
                        return <Ellipsis lines={3} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '接警时间',
                    dataIndex: 'jjsj',
                    width: 100,
                },
                {
                    title: '处警单位',
                    dataIndex: 'cjdw',
                    width: '12%',
                    render: (text) => {
                        if (text) {
                            let arry = text.split(',');
                            const num = arry.length - 1;
                            return <Ellipsis lines={2} tooltip>{arry[num]}</Ellipsis>;
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
                            return <Ellipsis length={7} tooltip>{arry[num]}</Ellipsis>;
                        }
                    },
                },
                {
                    title: '处警时间',
                    dataIndex: 'cjddsj',
                    width: 100,
                },
                {
                    title: '处置结果',
                    dataIndex: 'czjg_mc',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '处警详情',
                    dataIndex: 'cjqk',
                    width: '10%',
                    render: (text) => {
                        return <Ellipsis lines={3} tooltip>{text}</Ellipsis>;
                    },
                },
                this.props.reportForm === '0' ?  (this.props.from === 'db'?
                  {
                    title: '督办单位',
                    dataIndex: 'ddr_dwmc',
                    render: (text) => {
                      return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                  }
                  :
                  {
                    title: '调度单位',
                    dataIndex: 'ddr_dwmc',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                  }
                ) : {},
                this.props.from === 'db'?
                {
                  title: '督办人',
                  dataIndex: 'ddr_name',
                  render: (text) => {
                    return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                  },
                }
                :
                {
                    title: '调度人',
                    dataIndex: 'ddr_name',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                this.props.from === 'db'?
                {
                  title: '督办时间',
                  dataIndex: 'ddsj',
                  width: 100,
                }
                :
                {
                    title: '调度时间',
                    dataIndex: 'ddsj',
                    width: 100,
                },
                {
                    title: '现场调度',
                    dataIndex: 'is_xcdd',
                },
                this.props.from === 'db'?
                  {
                    title: '督办意见',
                    dataIndex: 'ddyj',
                    width: '10%',
                    render: (text) => {
                      return <Ellipsis lines={3} tooltip>{text}</Ellipsis>;
                    },
                  }
                :
                {
                    title: '调度意见',
                    dataIndex: 'ddyj',
                    width: '10%',
                    render: (text) => {
                        return <Ellipsis lines={3} tooltip>{text}</Ellipsis>;
                    },
                },
            ];
        } else {
            columns = [
                {
                    title: '接警来源',
                    dataIndex: 'jjly_mc',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '报警类别',
                    dataIndex: 'jqlb',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '管辖单位',
                    dataIndex: 'jjdw',
                    width: '15%',
                    render: (text) => {
                        if (text) {
                            let arry = text.split(',');
                            const num = arry.length - 1;
                            return <Ellipsis lines={2} tooltip>{arry[num]}</Ellipsis>;
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
                            return <Ellipsis length={7} tooltip>{arry[num]}</Ellipsis>;
                        }
                    },
                },
                {
                    title: '接警时间',
                    dataIndex: 'jjsj',
                    width: 100,
                },
                {
                    title: '接警内容',
                    dataIndex: 'jjnr',
                    width: '15%',
                    render: (text) => {
                        return <Ellipsis lines={3} tooltip>{text}</Ellipsis>;
                    },
                },
                {
                    title: '处警单位',
                    dataIndex: 'cjdw',
                    width: '15%',
                    render: (text) => {
                        if (text) {
                            let arry = text.split(',');
                            const num = arry.length - 1;
                            return <Ellipsis lines={2} tooltip>{arry[num]}</Ellipsis>;
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
                            return <Ellipsis length={7} tooltip>{arry[num]}</Ellipsis>;
                        }
                    },
                },
                {
                    title: '是否处警',
                    dataIndex: 'is_cj',
                    width: 50,
                },
                this.props.showDataView === '0' ? {
                        title: '处置状态',
                        dataIndex: 'czztlx',
                    }:{},
                this.props.showDataView === '1' ? {
                    title: '调度时间',
                    dataIndex: 'ddsj',
                    width: 100,
                } : this.props.showDataView === '2' ? {
                    title: '清零时间',
                    dataIndex: 'zxxgsj',
                    width: 100,
                } : {},
                this.props.isDayClear ? {
                    title: '处警结果',
                    dataIndex: 'czjg_mc',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                } : {},
                this.props.isDayClear ? {
                    title: '处警情况',
                    dataIndex: 'cjqk',
                    render: (text) => {
                        return <Ellipsis length={7} tooltip>{text}</Ellipsis>;
                    },
                } : {},
                this.props.showDataView === '1' ? {
                    title: '现场调度',
                    dataIndex: 'is_xcdd',
                } : {},
                this.props.showDataView === '1' ? {
                    title: '重点关注',
                    dataIndex: 'is_zdgz',
                } : {},
                this.props.showDataView === '1' ? {
                  title: '调度状态',
                  dataIndex: 'qtpdlx',
                  render:(text)=>{
                    if(text === '已处理'){
                      return (
                        <span style={{color:'#73CB85'}}>{text}</span>
                      )
                    }
                    else if(text === '已督办未处理'){
                      return (
                        <span style={{color:'#FF0000'}}>{text}</span>
                      )
                    }
                    else{
                      return (
                        <span>{text}</span>
                      )
                    }
                  },
                } : {},
                {
                    title: '操作',
                    render: (record) => (
                        <div>
                            <a onClick={() => this.deatils(record, record.id, record.sfgz, record.gzid, record.tzlx, record.ajbh, record.system_id)}>详情</a>
                            <Divider type="vertical"/>
                            {
                                record.is_sqdd === '0' ? (
                                    <span>
                                        {
                                            this.state.ddBtn ? <span>
                                                 <a onClick={() => this.saveDispatch(record)}>调度</a>
                                                 <Divider type="vertical"/>
                                            </span> : ''
                                        }
                                        {
                                            this.state.qlBtn ? <Popconfirm
                                                title="确定要清零这条数据吗"
                                                onConfirm={() => this.clearOutPolice(record,this.props.is_sqdd)}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <a href="#">确认清零</a>
                                            </Popconfirm> : ''
                                        }
                                    </span>
                                ) : (
                                    record.is_sqdd === '1' ? <span>
                                        {
                                          record.qtpdlx === '已处理'?
                                            <span style={{ color: '#C3C3C3' }}>反馈</span>
                                            :
                                            <a onClick={() => this.feddBack(record)}>反馈</a>
                                        }

                                        <Divider type="vertical"/>
                                        <a onClick={() => this.getTg(record)}>调度记录</a>
                                        <Divider type="vertical"/>
                                            {
                                                this.state.qlBtn ?
                                                  record.qtpdlx === '已处理' ?
                                                    <Popconfirm
                                                      title="确定要清零这条数据吗"
                                                      onConfirm={() => this.clearOutPolice(record, this.props.czzt ? this.props.czzt : '1')}
                                                      okText="确定"
                                                      cancelText="取消"
                                                    >
                                                      <a href="#">确认清零</a>
                                                    </Popconfirm>
                                                    :
                                                    <span style={{color: '#C3C3C3'}}>确认清零</span>
                                                  :
                                                  ''
                                            }
                                    </span> :
                                        record.is_sqdd === '2' ? <a onClick={() => this.getClearOutHistory(record)}>清零历史</a> : ''
                                )
                            }
                        </div>
                    ),
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
                <span className={styles.pagination}>{`共 ${data.page ? data.page.totalResult : 0} 条记录 第 ${data.page ? data.page.currentPage : 1} / ${data.page ? data.page.totalPage : 1} 页`}</span>,
        };
        let detail = (
            <Row style={{ width: '90%', margin: '0 38px 10px', lineHeight: '36px', color: 'rgba(0, 0, 0, 0.85)' }}>
                <Col
                    span={5}>接警人：{this.state.shareItem && this.state.shareItem.jjr ? this.state.shareItem.jjr : ''}</Col>
                <Col span={9}>管辖单位：<Tooltip
                    title={this.state.shareItem && this.state.shareItem.jjdw && this.state.shareItem.jjdw.length > 13 ? this.state.shareItem.jjdw : null}>{this.state.shareItem && this.state.shareItem.jjdw ? this.state.shareItem.jjdw.length > 13 ? this.state.shareItem.jjdw.substring(0, 13) + '...' : this.state.shareItem.jjdw : ''}</Tooltip></Col>
                <Col span={10}>接警信息：<LeightWord keyWord={this.state.keyWord ? this.state.keyWord : []}
                                                newsString={this.state.shareItem && this.state.shareItem.jjnr ? this.state.shareItem.jjnr : ''}/></Col>
                <Col
                    span={5}>处警人：{this.state.shareItem && this.state.shareItem.cjr ? this.state.shareItem.cjr : ''}</Col>
                <Col span={9}>处警单位：<Tooltip
                    title={this.state.shareItem && this.state.shareItem.cjdw && this.state.shareItem.cjdw.length > 13 ? this.state.shareItem.cjdw : null}>{this.state.shareItem && this.state.shareItem.cjdw ? this.state.shareItem.cjdw.length > 13 ? this.state.shareItem.cjdw.substring(0, 13) + '...' : this.state.shareItem.cjdw : ''}</Tooltip></Col>
                <Col span={10}>处警信息：<Tooltip
                    title={this.state.shareItem && this.state.shareItem.cjqk && this.state.shareItem.cjqk.length > 16 ? this.state.shareItem.cjqk : null}>{this.state.shareItem && this.state.shareItem.cjqk ? this.state.shareItem.cjqk.length > 16 ? this.state.shareItem.cjqk.substring(0, 16) + '...' : this.state.shareItem.cjqk : ''}</Tooltip></Col>
                <Col span={8}>处置结果：<span style={{
                    color: '#f00',
                    fontWeight: '700',
                }}>{this.state.shareItem && this.state.shareItem.czjg_mc ? this.state.shareItem.czjg_mc : ''}</span></Col>
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
                    locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                />
              {
                this.state.shareVisible?
                  <DispatchModal
                    handleSearch={this.props.handleSearch}
                    title="警情调度"
                    isPoliceDispatch
                    detail={detail}
                    shareVisible={this.state.shareVisible}
                    handleCancel={this.handleCancel}
                    closehandleCancel={this.closehandleCancel}
                    shareItem={this.state.shareItem}
                    tzlx={this.state.tzlx}
                  />
                  : null
              }

              {
                this.state.AnnouncementVisible?
                  (<DispatchingRecordModal visible={this.state.AnnouncementVisible} DispatchinghandleCancel={this.DispatchinghandleCancel} RzList={this.state.RzList} ResOpin={this.state.ResOpin} NowRecord={this.state.NowRecord} saveDispatch={this.saveDispatch} />)
                  :
                  null
              }
                {
                    this.state.clearOutModalVisible ? (
                        <ClearOutModal visible={this.state.clearOutModalVisible} ClearOuthandleCancel={this.ClearOuthandleCancel} clearOutRecord={this.state.clearOutRecord} />
                    ) : null
                }
                {
                    this.state.feddBackVisible ? (
                      <FeedModal visible={this.state.feddBackVisible} NowRecord={this.state.NowRecord} feedhandleCancel={this.feedhandleCancel} handleSearch={this.props.handleSearch} />
                    ) : null
                }
            </div>
        );
    }
}

export default RenderTable;
