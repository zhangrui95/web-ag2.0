import React, {useState, useEffect, PureComponent} from 'react';
import {connect} from 'dva';
import {Col, Divider, Radio, Row, Spin, Table, Timeline, Transfer, Card, Empty, Button, message, Modal} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from "@/components/AjEvaluation/EvaluationTable.less";
import {WaterWave} from "ant-design-pro/lib/Charts";
import difference from 'lodash/difference';
import noList from "@/assets/viewData/noList.png";
import {NavigationItem} from "@/components/Navigation/navigation";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";
import Ellipsis from "ant-design-pro/lib/Ellipsis";
const confirm = Modal.confirm;
let key = 0;
@connect(({Evaluation, global}) => ({
    Evaluation, global
}))
export default class Detail extends PureComponent {
    constructor(props) {
        super(props);
        let res = props.location.query.record;
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            kpList: [],
            kpList0: [],
            kpList1: [],
            kpList2: [],
            allList: [],
            detail: null,
            recordKp: res,
            kpxmType: '0',
            kpjlType: '',
            targetKeys: [],
            btnLoading: false,
        };
    }

    componentDidMount() {
        this.getList('0');
        this.getList('');
        this.getKhDetail(this.state.recordKp, '', true);
    }

    handleSave = () => {
      this.setState({
        btnLoading:true,
      });
        let kpxx = [];
        let num = 0;
        this.state.targetKeys.map((event) => {
            this.state.allList.map((item) => {
                if (event === item.key) {
                    if(item.xm_type === '0'){
                        num = num - parseInt(item.fz);
                    }else{
                        num = num + parseInt(item.fz);
                    }
                    kpxx.push({
                        ajbh: this.state.recordKp && this.state.recordKp.ajbh ? this.state.recordKp.ajbh : '',
                        ajkp_pz_id: event,
                        ajlx: this.state.recordKp && this.state.recordKp.ajlx ? this.state.recordKp.ajlx : '',
                        bkpr_dwdm: this.state.recordKp && this.state.recordKp.zbrdw_dm ? this.state.recordKp.zbrdw_dm : '',
                        bkpr_dwmc: this.state.recordKp && this.state.recordKp.zbrdw_mc ? this.state.recordKp.zbrdw_mc : '',
                        bkpr_jh: this.state.recordKp && this.state.recordKp.zbrjh ? this.state.recordKp.zbrjh : '',
                        bkpr_name: this.state.recordKp && this.state.recordKp.zbrxm ? this.state.recordKp.zbrxm : '',
                        bkpr_sfzh: this.state.recordKp && this.state.recordKp.zbrdw_sfzh ? this.state.recordKp.zbrdw_sfzh : '',
                        fz: item.fz,
                        xm_dm: item.xm_dm,
                        xm_mc: item.xm_mc,
                        xm_type: item.xm_type
                    })
                }
            })
        });
        let allNum = this.state.detail.total_score + num;
        if(allNum < 0){
            let that = this;
            confirm({
                title: '您的考评将低于最低分数0分，是否仍要执行当前操作？',
                centered: true,
                okText: '确认',
                cancelText: '取消',
                getContainer: document.getElementById('messageBox'),
                onOk() {
                    that.getSaveAllNum(kpxx);
                },
                onCancel() {
                    that.setState({
                        btnLoading:false,
                    });
                },
            });
        }else if(allNum > 100){
            let that = this;
            confirm({
                title: '您的考评将超过最高分数100分，是否仍要执行当前操作？',
                centered: true,
                okText: '确认',
                cancelText: '取消',
                getContainer: document.getElementById('messageBox'),
                onOk() {
                    that.getSaveAllNum(kpxx);
                },
                onCancel() {
                    that.setState({
                        btnLoading:false,
                    });
                },
            });
        }else{
            this.getSaveAllNum(kpxx);
        }
    }
    getSaveAllNum = (kpxx) =>{
        if (this.state.targetKeys && this.state.targetKeys.length > 0) {
            this.props.dispatch({
                type: 'Evaluation/saveAjkpXx',
                payload: {
                    kpxx: kpxx
                },
                callback: (data) => {
                    message.success('操作成功');
                    this.onEdit(true);
                    this.getKhDetail(this.state.recordKp, '', true);
                    this.getList(this.state.kpxmType,true);
                    this.getList('');
                    this.setState({
                        targetKeys: [],
                        btnLoading:false,
                    });
                }
            });
        } else {
            message.warn('请选择考评项目');
            this.setState({
                btnLoading:false,
            });
        }
    }
    getList = (type,isReset) => {//获取考评项目
        if(isReset){
            this.setState({
                ['kpList'+type]: [],
            });
        }
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
                if (type) {
                    if(!(this.state['kpList'+type]&&this.state['kpList'+type].length > 0)||isReset){
                        data.list.map((item) => {
                            item.key = item.id;
                        })
                        this.setState({
                            ['kpList'+type]: data.list,
                        });
                    }
                } else {
                    data.list.map((item) => {
                        item.key = item.id;
                    })
                    this.setState({
                        allList: data.list,
                    })
                }
            }
        });
    }
    getKhDetail = (record, xm_type, isdetailNull) => {
        if (isdetailNull) {
            this.setState({
                detail: null,
            });
        };
        this.props.dispatch({
            type: 'Evaluation/getAjkpXqByAjbh',
            payload: {
                ajbh: record.ajbh,
                kprq_ks: record.kprq_time && record.kprq_time[0] ? record.kprq_time[0].format('YYYY-MM-DD') : '',
                kprq_js: record.kprq_time && record.kprq_time[1] ? record.kprq_time[1].format('YYYY-MM-DD') : '',
                xm_type: xm_type
            },
            callback: (data) => {
                this.setState({
                    detail: data,
                })
            }
        });
    }
    getChangeXm = (e) => {
        this.setState({
            kpxmType: e.target.value,
        });
        this.getList(e.target.value,!(this.state.targetKeys&&this.state.targetKeys.length > 0));
    }
    onChange = (nextTargetKeys, direction, moveKeys) => {
        let list = [];
        let kpList = [...this.state['kpList'+this.state.kpxmType]];
        let allList = [...this.state.allList];
        moveKeys.map((event)=>{
            if(event){
                this.state['kpList'+this.state.kpxmType].map((item)=>{
                    if(event === item.key){
                        list.push(item);
                    }
                });
            }
        });
        if(direction === 'right'){
            key++;
            this.setState({targetKeys: nextTargetKeys},()=>{
                list.forEach((item)=>{
                    let index = kpList.indexOf(item);
                    let event = {id: item.id,
                        xm_mc: item.xm_mc,
                        xm_type: item.xm_type,
                        fz: item.fz,
                        zxxgsj: item.zxxgsj,
                        key: item.key+key}
                    kpList.splice(index, 0, event);
                    allList.splice(index, 0, event);
                });
                this.setState({
                    ['kpList'+this.state.kpxmType]:kpList,
                    allList,
                });
            });
        }else{
            this.setState({targetKeys: nextTargetKeys},()=>{
                list.forEach((item)=>{
                    let index = kpList.indexOf(item);
                    kpList.splice(index, 1);
                    allList.splice(index, 1);
                });
                this.setState({
                    ['kpList'+this.state.kpxmType]:kpList,
                    allList
                });
            });
        }
    };
    getKpjl = (e) => {
        this.setState({
            kpjlType: e.target.value,
        });
        this.getKhDetail(this.state.recordKp, e.target.value, false);
    }
    onEdit = (isReset) => {
        // let key = '/Evaluation/CaseEvaluation/Detail' + this.props.location.query.id;
        const {dispatch} = this.props;
        if (dispatch) {
            // dispatch(routerRedux.push({pathname: '/Evaluation/CaseEvaluation'}));
            if(isReset){
                dispatch({
                    type: 'global/changeResetList',
                    payload: {
                        isReset: !this.props.global.isResetList.isReset,
                        url:'/Evaluation/CaseEvaluation'
                    },
                });
            }
            // dispatch({
            //     type: 'global/changeSessonNavigation',
            //     payload: {
            //         key,
            //         isShow: false,
            //     },
            // });
            // dispatch({
            //     type: 'global/changeNavigation',
            //     payload: {
            //         key,
            //         isShow: false,
            //     },
            // });
        }
    };
    // 根据案件编号打开案件窗口
    openCaseDetail = (caseType, item) => {
        if (caseType === '1') { // 刑事案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
                    query: {record: item, id: item.ajbh},
                }),
            )
        } else if (caseType === '2') { // 行政案件
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
                    query: {record: item, id: item.ajbh, system_id: item.ajbh},
                }),
            )
        }
    };

    render() {
        const {targetKeys, detail} = this.state;
        let kpList = this.state['kpList'+this.state.kpxmType];
        const TableTransfer = ({leftColumns, rightColumns, ...restProps}) => (
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
                        getCheckboxProps: item => ({disabled: listDisabled || item.disabled}),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
                                .map(({key}) => key);
                            const diffKeys = selected
                                ? difference(treeSelectedKeys, listSelectedKeys)
                                : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({key}, selected) {
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
                            style={{pointerEvents: listDisabled ? 'none' : null}}
                            onRow={({key, disabled: itemDisabled}) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                            pagination={{pageSize: 999}}
                            scroll={{y: 250}}
                            locale={{
                                emptyText: <Empty
                                    image={this.props.global && this.props.global.dark ? noList : noListLight}
                                    description={'暂无数据'}/>
                            }}
                        />
                    );
                }}
            </Transfer>
        );

        const TableColumns = [
            {
                dataIndex: 'fz',
                title: '分值',
                width: 50,
                render: (text) => {
                    return <span>{'+' + text}</span>
                }
            },
            {
                dataIndex: 'xm_mc',
                title: '项目',
                render: text => {
                    return (
                       text
                    );
                },
            },
        ];

        const TableColumnsKf = [
            {
                dataIndex: 'fz',
                title: '分值',
                width: 50,
                render: (text) => {
                    return <span>{'-' + text}</span>
                }
            },
            {
                dataIndex: 'xm_mc',
                title: '项目',
                render: text => {
                    return (
                            text
                    );
                },
            },
        ];
        let dark = this.props.global && this.props.global.dark;
        let stylesBox = dark ? '' : styles.lightBox;
        return (
            <div className={stylesBox}>
                <Card className={styles.box}>
                    <div className={styles.leftBox}>
                        <Row style={{height: '170px'}}>
                            <div className={styles.title}>基本信息</div>
                            <Col span={5}>
                                {
                                    detail && detail.total_score.toString() ?
                                        <WaterWave
                                            color={'#2056ef'}
                                            height={120}
                                            style={{borderRadius: '200px', overflow: 'hidden'}}
                                            className={styles.water}
                                            title={<div>
                                                <div className={styles.zf}>总分</div>
                                                <div
                                                    className={styles.fs}>{detail && detail.total_score ? detail.total_score : 0}</div>
                                            </div>}
                                            percent={detail && detail.total_score ? detail.total_score : 0}
                                        />
                                        : ''
                                }
                            </Col>
                            <Col span={19} className={styles.topDetail}>
                                <Col span={24}>案件名称：{this.state.recordKp && this.state.recordKp.ajmc ? this.state.recordKp.ajmc : ''}</Col>
                                <Col
                                    span={12}>案件编号：<a
                                    onClick={() => this.openCaseDetail(this.state.recordKp.ajlx, this.state.recordKp)}>{this.state.recordKp && this.state.recordKp.ajbh ? this.state.recordKp.ajbh : ''}</a></Col>
                                <Col
                                    span={6}>案件状态：{this.state.recordKp && this.state.recordKp.ajzt ? this.state.recordKp.ajzt : ''}</Col>
                                <Col
                                    span={6}>被考评人：{this.state.recordKp && this.state.recordKp.zbrxm ? this.state.recordKp.zbrxm : ''}</Col>
                                <Col
                                    span={24}>被考评单位：{this.state.recordKp && this.state.recordKp.zbrdw_mc ? this.state.recordKp.zbrdw_mc : ''}</Col>
                            </Col>
                        </Row>
                        <Divider></Divider>
                        <Row>
                            <div className={styles.title}>考评项目</div>
                            <Radio.Group style={{marginBottom: 16}} defaultValue={'0'} value={this.state.kpxmType}
                                         className={styles.redioGroup} onChange={this.getChangeXm}>
                                <Radio.Button value="0">扣分</Radio.Button>
                                <Radio.Button value="1">补分</Radio.Button>
                                <Radio.Button value="2">加分</Radio.Button>
                            </Radio.Group>
                            <TableTransfer
                                dataSource={kpList ? kpList : []}
                                targetKeys={targetKeys}
                                showSearch={true}
                                onChange={this.onChange}
                                filterOption={(inputValue, item) =>
                                    item.fz.indexOf(inputValue) !== -1 || item.xm_mc.indexOf(inputValue) !== -1
                                }
                                leftColumns={this.state.kpxmType === '0' ? TableColumnsKf : TableColumns}
                                rightColumns={this.state.kpxmType === '0' ? TableColumnsKf : TableColumns}
                                className={styles.tableTransferBox}
                            />
                        </Row>
                    </div>
                    <div className={styles.rightBox}>
                        <div className={styles.title}>考评记录</div>
                        <Radio.Group style={{marginBottom: 16, right: 0}} defaultValue={''} value={this.state.kpjlType}
                                     className={styles.redioGroup} onChange={this.getKpjl}>
                            <Radio.Button value="">全部</Radio.Button>
                            <Radio.Button value="0">{detail && detail.total_kf ? detail.total_kf : ''}</Radio.Button>
                            <Radio.Button value="1">{detail && detail.total_bf ? detail.total_bf : ''}</Radio.Button>
                            <Radio.Button value="2">{detail && detail.total_jf ? detail.total_jf : ''}</Radio.Button>
                        </Radio.Group>
                        <div className={styles.timeLine}>
                            <Timeline>
                                {
                                    detail && detail.kpJlList && detail.kpJlList.map((item) => {
                                        return <Timeline.Item
                                            className={item.xm_type === '0' ? styles.typeColorRed : item.xm_type === '1' ? styles.typeColorOrange : item.xm_type === '2' ? styles.typeColorGreen : styles.typeColorBlue}>
                                            <div>时间：{item.kpsj}</div>
                                            <div>详情：<span
                                                style={{color: item.xm_type === '0' ? (dark ? '#FF8080' : '#F94949') : item.xm_type === '1' ? (dark ? '#FFD086' : '#ffbc3b') : item.xm_type === '2' ? (dark ? '#8cffa7' : '#0c0') : '#7dc6ff'}}>{item.fz_lasted}</span><span
                                                style={{marginLeft: '6px'}}>{item.xm_mc}</span></div>
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
                        <Button type="primary" style={{marginLeft: 8}} onClick={this.handleSave} loading={this.state.btnLoading}>
                            保存
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

};

