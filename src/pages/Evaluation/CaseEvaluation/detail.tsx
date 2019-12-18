import React, {useState, useEffect, PureComponent} from 'react';
import { connect } from 'dva';
import {Col, Divider, Radio, Row, Spin, Table, Timeline, Transfer, Card, Empty, Button, message} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from "@/components/AjEvaluation/EvaluationTable.less";
import {WaterWave} from "ant-design-pro/lib/Charts";
import difference from 'lodash/difference';
import noList from "@/assets/viewData/noList.png";
import {NavigationItem} from "@/components/Navigation/navigation";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";
@connect(({ Evaluation,global }) => ({
    Evaluation,global
}))
export default class Detail extends PureComponent {
    constructor(props){
        super(props);
        let res = props.location.query.record;
        if(typeof res == 'string'){
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            kpList:[],
            allList:[],
            detail:null,
            recordKp:res,
            kpxmType:'0',
            kpjlType:'',
            targetKeys:[],
        };
    }
    componentDidMount(){
        this.getList('0');
        this.getList('');
        this.getKhDetail(this.state.recordKp,'',true);
    }
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
                    this.onEdit(true);
                    this.getKhDetail(this.state.recordKp, '',true);
                    this.setState({
                        targetKeys:[],
                    });
                }
            });
        }else{
            message.warn('请选择考评项目');
        }
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
    onEdit = (isReset) => {
        let key = '/Evaluation/CaseEvaluation/Detail'+this.props.location.query.id;
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch( routerRedux.push({pathname: '/Evaluation/CaseEvaluation',query: isReset ? {isReset} : {}}));
            dispatch({
                type: 'global/changeSessonNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
            dispatch({
                type: 'global/changeNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
        }
    };
    // 根据案件编号打开案件窗口
    openCaseDetail = (caseType, item) => {
        if (caseType === '1') { // 刑事案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                    query: { record:item,id: item.ajbh },
                }),
            )
        } else if (caseType === '2') { // 行政案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
                    query: { record:item,id:item.ajbh,system_id:item.ajbh },
                }),
            )
        }
    };
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
                            scroll={{ y: 250 }}
                            locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
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
        let dark = this.props.global&&this.props.global.dark;
        let stylesBox = dark ? '' : styles.lightBox;
        return (
            <div className={stylesBox}>
                <Card className={styles.box}>
                    <div className={styles.leftBox}>
                        <Row style={{height:'170px'}}>
                            <div className={styles.title}>基本信息</div>
                            <Col span={5}>
                                {
                                    detail&&detail.total_score.toString()  ?
                                        <WaterWave
                                            color={'#2056ef'}
                                            height={120}
                                            style={{borderRadius:'200px',overflow:'hidden'}}
                                            className={styles.water}
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
                                <Col span={24}>案件名称：<a onClick={()=>this.openCaseDetail(this.state.recordKp.ajlx, this.state.recordKp)}>{this.state.recordKp&&this.state.recordKp.ajmc ? this.state.recordKp.ajmc : ''}</a></Col>
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
                                            <div>详情：<span style={{color:item.xm_type==='0' ? (dark ? '#FF8080' : '#F94949') : item.xm_type==='1' ? (dark ?'#FFD086' :'#ffbc3b'): item.xm_type==='2' ? (dark ? '#8cffa7':'#0c0') : '#7dc6ff'}}>{item.fz_lasted}</span><span style={{marginLeft:'6px'}}>{item.xm_mc}</span></div>
                                            <div>考评人：{item.kpr_name}</div>
                                        </Timeline.Item>
                                    })
                                }
                            </Timeline>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className={styles.btns}>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleSave}>
                            保存
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

};

