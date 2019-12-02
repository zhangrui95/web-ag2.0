import React, {useState, useEffect, PureComponent} from 'react';
import { connect } from 'dva';
import {Col, Divider, Radio, Row, Spin, Table, Timeline, Transfer, Card, Empty} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from "@/components/AjEvaluation/EvaluationTable.less";
import {WaterWave} from "ant-design-pro/lib/Charts";
import difference from 'lodash/difference';
import noList from "@/assets/viewData/noList.png";
@connect(({ Evaluation }) => ({
    Evaluation,
}))
export default class Detail extends PureComponent {
    constructor(props){
        super(props);
        console.log('props.location.query.record========>',props.location.query.record);
        this.state = {
            kpList:[],
            allList:[],
            detail:null,
            recordKp:props.location.query.record,
            kpxmType:'0',
            kpjlType:'',
        };
    }
    componentDidMount(){
        let record = this.props.location.query.record;
        this.getList('0');
        this.getList('');
        this.getKhDetail(record,'',true);
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
    getChangeXm = (e) =>{
        this.setState({
            kpxmType: e.target.value,
        });
        this.getList(e.target.value);
    }
    onChange = (nextTargetKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    getKpjl = (e) =>{
        this.setState({
            kpjlType: e.target.value,
        });
        this.getKhDetail(this.state.recordKp,e.target.value,false);
    }
    render(){
        const { targetKeys,detail,kpList } = this.state;
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
                            locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
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
        return (
            <Card className={styles.box}>
                <div className={styles.leftBox}>
                    <Row style={{height:'170px'}}>
                        <div className={styles.title}>基本信息</div>
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
                    <Divider></Divider>
                    <Row>
                        <div className={styles.title}>考评项目</div>
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
                    <div className={styles.title}>考评记录</div>
                    <Radio.Group style={{ marginBottom: 16, right: 0 }} defaultValue={''} value={this.state.kpjlType} className={styles.redioGroup} onChange={this.getKpjl}>
                        <Radio.Button value="">全部</Radio.Button>
                        <Radio.Button value="0">{detail&&detail.total_kf ? detail.total_kf : ''}</Radio.Button>
                        <Radio.Button value="1">{detail&&detail.total_bf ? detail.total_bf : ''}</Radio.Button>
                        <Radio.Button value="2">{detail&&detail.total_jf ? detail.total_jf : ''}</Radio.Button>
                    </Radio.Group>
                    <div className={styles.timeLine}>
                        <Timeline>
                            {
                                detail&&detail.kpJlList&&detail.kpJlList.map((item)=>{
                                    return <Timeline.Item className={item.xm_type==='0' ? styles.typeColorRed : item.xm_type==='1' ? styles.typeColorOrange: item.xm_type==='2' ? styles.typeColorGreen : styles.typeColorBlue}>
                                        <div>时间：{item.kpsj}</div>
                                        <div>详情：<span style={{color:item.xm_type==='0' ? '#FF8080' : item.xm_type==='1' ? '#FFD086': item.xm_type==='2' ? '#8cffa7' : '#7dc6ff'}}>{item.fz_lasted}</span><span style={{marginLeft:'6px'}}>{item.xm_mc}</span></div>
                                        <div>考评人：{item.kpr_name}</div>
                                    </Timeline.Item>
                                })
                            }
                        </Timeline>
                    </div>
                </div>
            </Card>
        );
    }

};

