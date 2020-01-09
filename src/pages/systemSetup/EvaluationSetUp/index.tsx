/*
* indxe.js 案件考评配置
* author：zr
* 20190827
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Tabs,
    message,
    Card, Modal, Table, Empty,
} from 'antd';
import stylescommon1 from '../../common/common.less';
import stylescommon2 from '../../common/commonLight.less';
import noList from "@/assets/viewData/noList.png";
import {routerRedux} from "dva/router";
import noListLight from "@/assets/viewData/noListLight.png";
import {inspect} from "util";
import styles = module
import stylescommon from "@/pages/common/common.less";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const {confirm} = Modal;
const {TextArea} = Input;
@connect(({common, Evaluation, global}) => ({
    common, Evaluation, global
}))
@Form.create()
export default class PoliceClear extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            data: null,
            tab: '0',
            selectedRowKeys:[],
        };
    }

    componentDidMount() {
        this.getList('0', 1);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/systemSetup/EvaluationSetup') {
            this.setState({
                loading: true,
            });
            this.getList(this.state.tab);
        }
    }

    getList = (type, current) => {
        this.setState({
            loading: true,
        })
        this.props.dispatch({
            type: 'Evaluation/getList',
            payload: {
                currentPage: current,
                pd: {
                    xm_type: type
                },
                showCount: 10,
            },
            callback: (data) => {
                this.setState({
                    data: data,
                    loading: false,
                })
            }
        });
    }
    addList = () => {
        // this.setState({
        //     visible:true,
        // })
        this.props.dispatch(
            routerRedux.push({
                pathname: '/systemSetup/EvaluationSetup/Add',
                query: {id: this.state.tab},
            }),
        );
    }
    getNum = (rule, value, callback) => {
        let reg = new RegExp("^([1-9]|[1-9]\\d|100)$");
        if (value && !reg.test(value)) {
            callback('请输入1-100数字');
        }
        callback();
    }
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'Evaluation/addList',
                    payload: {
                        fz: values.kfz,
                        xm_mc: values.kfxm,
                        xm_type: this.state.tab
                    },
                    callback: () => {
                        message.success('操作成功');
                        this.getList(this.state.tab);
                        this.handleCancel();
                    }
                });
            }
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    }
    // 表格分页
    handleTableChange = (pagination) => {
        this.setState({
            current: pagination.current,
            count: pagination.pageSize,
        });
        this.getList(this.state.tab, pagination.current);
    };
    changeTab = (e) => {
        this.setState({
            tab: e,
            selectedRowKeys: [],
            selectedRows: [],
        });
        this.getList(e, 1);
    }
    getDel = () => {
        let that = this;
        if (this.state.selectedRows && this.state.selectedRows.length > 0) {
            confirm({
                title: this.state.tab === '0' ? '确定删除选中的扣分项？' : this.state.tab === '1' ? '确定删除选中的补分项？' : '确定删除选中的加分项？',
                content: '',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                getContainer: document.getElementById('boxEval'),
                onOk() {
                    that.getDelList(that.state.selectedRowKeys.toString());
                },
                onCancel() {
                    // console.log('Cancel');
                },
            });
        } else {
            message.warn('请选择删除项')
        }
    }
    getEmpty = () => {
        let that = this;
        if (this.state.data && this.state.data.list && this.state.data.list.length > 0) {
            confirm({
                title: '确定清空' + (this.state.tab === '0' ? '扣分项' : this.state.tab === '1' ? '补分项' : '加分项') + '列表？',
                content: '',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                getContainer: document.getElementById('boxEval'),
                onOk() {
                    that.getDelList('');
                },
                onCancel() {
                    // console.log('Cancel');
                },
            });
        } else {
            message.warn('当前列表暂无数据，无需清空')
        }
    }
    getDelList = (ids) => {
        this.props.dispatch({
            type: 'Evaluation/delList',
            payload: {
                xm_type: this.state.tab,
                id: ids,
            },
            callback: () => {
                message.success('操作成功');
                this.setState({
                    selectedRowKeys:[],
                });
                this.getList(this.state.tab);
            }
        });
    }

    render() {
        let stylescommon = this.props.global && this.props.global.dark ? stylescommon1 : stylescommon2;
        const {form: {getFieldDecorator}} = this.props
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const modleLayouts = {
            labelCol: {span: 7},
            wrapperCol: {span: 13},
        };
        const {data} = this.state;
        const paginationProps = {
            current: data && data.page ? data.page.currentPage : '',
            total: data && data.page ? data.page.totalResult : '',
            pageSize: data && data.page ? data.page.showCount : '',
            showTotal: (total, range) => (
                <span
                    className={stylescommon.pagination}
                >{`共 ${data && data.page ? data.page.totalPage : 1} 页，${
                    data && data.page ? data.page.totalResult : 0
                    } 条数据 `}</span>
            ),
        };
        const columns = [
            {
                title: '分值',
                width:150,
                dataIndex: 'fz',
                render: (text) => {
                    return <span>{this.state.tab === '0' ? '-' + text : '+' + text}</span>
                }
            }, {
                title: '项目',
                dataIndex: 'xm_mc',
            }
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys,
                    selectedRows: `${selectedRows}`,
                })
            },
            selectedRowKeys: this.state.selectedRowKeys ? [...this.state.selectedRowKeys]:[],
        };
        return (
            <div className={stylescommon.statistics} id={'boxEval'}>
                <Card className={stylescommon.titleArea}>
                    <div className={stylescommon.tabTopBox}>
                        <Tabs defaultActiveKey="0" onChange={this.changeTab} activeKey={this.state.tab}>
                            <TabPane tab={(this.state.tab === '0' ? "● " : '') + "扣分设置"} key="0"></TabPane>
                            <TabPane tab={(this.state.tab === '1' ? "● " : '') + "补分设置"} key="1"></TabPane>
                            <TabPane tab={(this.state.tab === '2' ? "● " : '') + "加分设置"} key="2"></TabPane>
                        </Tabs>
                    </div>
                    <div className={stylescommon.btnBox}>
                        <Button type="primary"
                                onClick={this.addList}>添加{this.state.tab === '0' ? '扣分' : this.state.tab === '1' ? '补分' : '加分'}项</Button>
                        <Button style={{marginLeft: 10}} onClick={this.getDel}
                                className={stylescommon.topDelBtn}>删除</Button>
                        <Button style={{marginLeft: 10}} onClick={this.getEmpty}
                                className={stylescommon.topDelBtn}>清空</Button>
                    </div>
                </Card>
                <Card style={{marginTop: 12}}>
                    <Table
                        loading={this.state.loading}
                        rowKey={record => record.id}
                        pagination={paginationProps}
                        onChange={this.handleTableChange}
                        columns={columns}
                        dataSource={this.state.data && this.state.data.list ? this.state.data.list : []}
                        rowSelection={rowSelection}
                        locale={{
                            emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                    />
                </Card>
            </div>
        );
    }
}
