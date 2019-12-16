import React, { PureComponent } from 'react';
import {
    Col,
    Form,
    Input,
    Modal,
    Row,
    Table,
    Tooltip,
    Divider,
    Transfer,
    Radio,
    Timeline,
    message,
    Card,
    Empty
} from 'antd';
import styles from './EvaluationTable.less';
import DetailModal from './DetailModal';
import { connect } from 'dva';
import stylescommon from '../../pages/common/common.less';
import { WaterWave } from 'ant-design-pro/lib/Charts';
import difference from 'lodash/difference';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";
// import CaseDetail from '../../routes/CaseRealData/caseDetail';
// import XzCaseDetail from '../../routes/XzCaseRealData/caseDetail';

export default class EvaluationTable extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            current: '',
            visible: false,
            record: null,
            kpVisible: false,
            detail:'',
            targetKeys:[],
            kpList:[],
            kpxmType:'0',
            kpjlType:'',
        };
    }
    // 根据案件编号打开案件窗口
    openCaseDetail = (caseType, ajbh) => {
        // if (caseType === '1') { // 刑事案件
        //     const divs = (
        //         <div>
        //             <CaseDetail
        //                 {...this.props}
        //                 id={ajbh}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '刑事案件详情', content: divs, key: ajbh };
        //     this.props.newDetail(AddNewDetail);
        // } else if (caseType === '2') { // 行政案件
        //     const divs = (
        //         <div>
        //             <XzCaseDetail
        //                 {...this.props}
        //                 systemId={ajbh}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '行政案件详情', content: divs, key: 'xz' + ajbh };
        //     this.props.newDetail(AddNewDetail);
        // }
        // this.handleCancel();
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
        this.setState({
            current: pagination.current,
        });
    };
    deatils = (record) => {
        this.setState({
            visible: true,
            record: record,
        });
    };
    handleSave = () =>{
        let kpxx =[];
        this.state.targetKeys.map((event)=>{
            this.state.allList.map((item)=>{
                if(event === item.id){
                    kpxx.push({ ajbh:this.state.recordKp&&this.state.recordKp.ajbh ? this.state.recordKp.ajbh:'',
                        ajkp_pz_id: event,
                        ajlx:this.state.recordKp&&this.state.recordKp.ajlx ? this.state.recordKp.ajlx:'',
                        bkpr_dwdm:this.state.recordKp&&this.state.recordKp.zbrdw_dm ? this.state.recordKp.zbrdw_dm:'',
                        bkpr_dwmc:this.state.recordKp&&this.state.recordKp.zbrdw_mc ? this.state.recordKp.zbrdw_mc:'',
                        bkpr_jh:this.state.recordKp&&this.state.recordKp.zbrjh ? this.state.recordKp.zbrjh:'',
                        bkpr_name:this.state.recordKp&&this.state.recordKp.zbrxm ? this.state.recordKp.zbrxm:'',
                        bkpr_sfzh:this.state.recordKp&&this.state.recordKp.zbrdw_sfzh ? this.state.recordKp.zbrdw_sfzh:'',
                        fz:item.fz,
                        xm_dm:item.xm_dm,
                        xm_mc:item.xm_mc,
                        xm_type:item.xm_type})
                }
            })
        });
        if(this.state.targetKeys&&this.state.targetKeys.length > 0){
            this.props.dispatch({
                type: 'Evaluation/saveAjkpXx',
                payload: {
                    kpxx:kpxx
                },
                callback: (data) => {
                    message.success('操作成功');
                    this.getKhDetail(this.state.recordKp, '',true);
                    this.props.getKpSearch();
                    this.handleCancel();
                }
            });
        }else{
            message.warn('请选择考评项目');
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            kpVisible: false,
            record: null,
            kpxmType:'0',
            kpjlType:'',
            targetKeys:[],
        });
    };
    getKp = async (record) =>{
        console.log('record=====>',record)
        this.props.dispatch(
            routerRedux.push({
                pathname: '/Evaluation/CaseEvaluation/Detail',
                query: { record: record, id: record && record.ajbh ? record.ajbh : '1' },
            }),
        );
    }
    getModelShow = (record) =>{
        this.setState({
            recordKp:record,
            kpVisible: true,
        });
    }
    getKhDetail = (record, xm_type, isdetailNull) =>{
        if(isdetailNull){
            this.setState({
                detail:null,
            });
        };
        this.props.dispatch({
            type: 'Evaluation/getAjkpXqByAjbh',
            payload: {
                ajbh:record.ajbh,
                kprq_ks:this.props.kprq && this.props.kprq[0] ? this.props.kprq[0].format('YYYY-MM-DD') : '',
                kprq_js:this.props.kprq && this.props.kprq[1] ? this.props.kprq[1].format('YYYY-MM-DD') : '',
                xm_type: xm_type
            },
            callback: (data) => {
                this.setState({
                    detail:data,
                })
            }
        });
    }
    getKpjl = (e) =>{
        this.setState({
            kpjlType: e.target.value,
        });
        this.getKhDetail(this.state.recordKp,e.target.value,false);
    }
    getChangeXm = (e) =>{
        this.setState({
            kpxmType: e.target.value,
        });
        this.getList(e.target.value);
    }
    getList = (type) =>{//获取考评项目
        this.props.dispatch({
            type: 'Evaluation/getList',
            payload: {
                currentPage: 1,
                pd: {
                    xm_type: type
                },
                showCount: 999,
            },
            callback: (data) => {
                if(type){
                    data.list.map((item)=>{
                        item.key = item.id;
                    })
                    this.setState({
                        kpList:data.list,
                    })
                }else{
                    this.setState({
                        allList:data.list,
                    })
                }
            }
        });
    }
    onChange = (nextTargetKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    render() {
        const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
            <Transfer {...restProps} showSelectAll={false}>
                {({
                      direction,
                      filteredItems,
                      onItemSelectAll,
                      onItemSelect,
                      selectedKeys: listSelectedKeys,
                      disabled: listDisabled,
                  }) => {
                    const columns = direction === 'left' ? leftColumns : rightColumns;

                    const rowSelection = {
                        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
                                .map(({ key }) => key);
                            const diffKeys = selected
                                ? difference(treeSelectedKeys, listSelectedKeys)
                                : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({ key }, selected) {
                            onItemSelect(key, selected);
                        },
                        selectedRowKeys: listSelectedKeys,
                    };

                    return (
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            style={{ pointerEvents: listDisabled ? 'none' : null }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                            pagination={{pageSize:999}}
                            scroll={{ y: 220 }}
                            locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
                        />
                    );
                }}
            </Transfer>
        );

        const TableColumns = [
            {
                dataIndex: 'fz',
                title: '分值',
                width:50,
                render:(text)=>{
                    return <span>{'+' + text}</span>
                }
            },
            {
                dataIndex: 'xm_mc',
                title: '项目',
            },
        ];

        const TableColumnsKf = [
            {
                dataIndex: 'fz',
                title: '分值',
                width:50,
                render:(text)=>{
                    return <span>{'-' + text}</span>
                }
            },
            {
                dataIndex: 'xm_mc',
                title: '项目',
            },
        ];
        const { data, loading } = this.props;
        let columns;
        columns = [
            {
                title: '案件编号',
                dataIndex: 'ajbh',
                align: 'center',
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                align: 'center',
                render: (text) => {
                    return (
                        text && text.length <= 15 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 15) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '案件类别',
                dataIndex: 'ajlbmc',
                align: 'center',
            },
            {
                title: '被考评单位',
                dataIndex: 'zbrdw_mc',//zbrdw_mc，bkpr_dwmc
                align: 'center',
                render: (text) => {
                    return (
                        text && text.length <= 15 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 15) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
            {
                title: '被考评人',
                align: 'center',
                dataIndex: 'zbrxm',//zbrxm，bkpr_name
            },
            {
                title: '考评日期',
                dataIndex: 'kprq',
                align: 'center',
            },
            {
                title: '操作',
                align: 'center',
                render: (record) => {
                    return (
                        <div>
                            {/*<a onClick={() => this.deatils(record)}>详情</a>*/}
                            <a onClick={() => this.getKp(record)}>考评</a>
                        </div>
                    );
                },
            },
        ];
        if (this.props.chartIdx === '0') {
            columns.splice(3, 1);
            columns.splice(2, 0, {
                title: '被考评单位',
                dataIndex: 'zbrdw_mc',
                align: 'center',
                render: (text) => {
                    return (
                        text && text.length <= 15 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 15) + '...'}</span>
                            </Tooltip>
                    );
                },
            });
        } else if (this.props.chartIdx === '2') {
            columns.splice(4, 1);
            columns.splice(2, 0, {
                title: '被考评人',
                align: 'center',
                dataIndex: 'zbrxm',
            });
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
        const { targetKeys,detail,kpList } = this.state;
        return (
            <Card style={{marginTop:'12px'}}>
                <Table
                    loading={loading}
                    rowKey={record => record.key}
                    dataSource={data.list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    className={styles.standardTable}
                    locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
                />
                <DetailModal visible={this.state.visible} record={this.state.record} handleCancel={this.handleCancel}/>
                <Modal
                    title={'考评'}
                    width={1006}
                    visible={this.state.kpVisible}
                    onOk={this.handleSave}
                    okText={'保存'}
                    onCancel={this.handleCancel}
                    className={stylescommon.modalStyle}
                    maskClosable={false}
                    centered={true}
                >
                    <div className={styles.box}>
                        <div className={styles.leftBox}>
                            <Row style={{height:'120px'}}>
                                <Col span={5}>
                                    {
                                        detail&&detail.total_score.toString()  ?
                                    <WaterWave
                                        height={120}
                                        style={{borderRadius:'200px',overflow:'hidden'}}
                                        title={<div>
                                            <div className={styles.zf}>总分</div>
                                            <div className={styles.fs}>{detail&&detail.total_score ? detail.total_score : 0}</div>
                                        </div>}
                                        percent={detail&&detail.total_score ? detail.total_score : 0}
                                    />
                                        : ''
                                    }
                                </Col>
                                <Col span={19} className={styles.topDetail}>
                                    <Col span={24}>案件名称：<a onClick={()=>this.openCaseDetail(this.state.recordKp.ajlx, this.state.recordKp.ajbh)}>{this.state.recordKp&&this.state.recordKp.ajmc ? this.state.recordKp.ajmc : ''}</a></Col>
                                    <Col span={12}>案件编号：{this.state.recordKp&&this.state.recordKp.ajbh ? this.state.recordKp.ajbh : ''}</Col>
                                    <Col span={6}>案件状态：{this.state.recordKp&&this.state.recordKp.ajzt ? this.state.recordKp.ajzt : ''}</Col>
                                    <Col span={6}>被考评人：{this.state.recordKp&&this.state.recordKp.zbrxm ? this.state.recordKp.zbrxm : ''}</Col>
                                    <Col span={24}>被考评单位：{this.state.recordKp&&this.state.recordKp.zbrdw_mc ? this.state.recordKp.zbrdw_mc : ''}</Col>
                                </Col>
                            </Row>
                            <Divider orientation="left">考评项目</Divider>
                            <Row>
                                <Radio.Group style={{ marginBottom: 16 }} defaultValue={'0'} value={this.state.kpxmType} className={styles.redioGroup} onChange={this.getChangeXm}>
                                    <Radio.Button value="0">扣分</Radio.Button>
                                    <Radio.Button value="1">补分</Radio.Button>
                                    <Radio.Button value="2">加分</Radio.Button>
                                </Radio.Group>
                                <TableTransfer
                                    dataSource={kpList}
                                    targetKeys={targetKeys}
                                    showSearch={true}
                                    onChange={this.onChange}
                                    filterOption={(inputValue, item) =>
                                        item.fz.indexOf(inputValue) !== -1 || item.xm_mc.indexOf(inputValue) !== -1
                                    }
                                    leftColumns={this.state.kpxmType==='0' ? TableColumnsKf : TableColumns}
                                    rightColumns={this.state.kpxmType==='0' ? TableColumnsKf : TableColumns}
                                    className={styles.tableTransferBox}
                                />
                            </Row>
                        </div>
                        <div className={styles.rightBox}>
                            <div className={styles.khjl}>考评记录</div>
                            <Radio.Group style={{ marginBottom: 16, left: 24 }} defaultValue={''} value={this.state.kpjlType} className={styles.redioGroup} onChange={this.getKpjl}>
                                <Radio.Button value="">全部</Radio.Button>
                                <Radio.Button value="0">{detail&&detail.total_kf ? detail.total_kf : ''}</Radio.Button>
                                <Radio.Button value="1">{detail&&detail.total_bf ? detail.total_bf : ''}</Radio.Button>
                                <Radio.Button value="2">{detail&&detail.total_jf ? detail.total_jf : ''}</Radio.Button>
                            </Radio.Group>
                            <div className={styles.timeLine}>
                                <Timeline>
                                    {
                                        detail&&detail.kpJlList&&detail.kpJlList.map((item)=>{
                                           return <Timeline.Item color={item.xm_type==='0' ? '#f00' : item.xm_type==='1' ? '#ff6600': item.xm_type==='2' ? '#0c0' : '#1890ff'}>
                                                <div>时间：{item.kpsj}</div>
                                               <div>详情：<span style={{color:item.xm_type==='0' ? '#f00' : item.xm_type==='1' ? '#ff6600': item.xm_type==='2' ? '#0c0' : '#1890ff'}}>{item.fz_lasted}</span><span style={{marginLeft:'6px'}}>{item.xm_mc}</span></div>
                                                <div>考评人：{item.kpr_name}</div>
                                            </Timeline.Item>
                                        })
                                    }
                                </Timeline>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Card>
        );
    }
}

