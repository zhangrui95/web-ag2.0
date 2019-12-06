/*
* indxe.js 案件考评配置
* author：zr
* 20190827
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
import stylescommon from '../../common/common.less';
import noList from "@/assets/viewData/noList.png";
import {routerRedux} from "dva/router";
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { confirm } = Modal;
const { TextArea } = Input;
@connect(({ common,Evaluation }) => ({
   common,Evaluation
}))
@Form.create()
export default class PoliceClear extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            loading:false,
            data:null,
            tab:'0',
        };
    }

    componentDidMount() {
        console.log('this.props.location',this.props.location);
        this.getList('0',1);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.history.location.query.isReset){
            this.state = {
                tab:'0',
            };
            this.getList('0',1);
        }
    }
    getList = (type,current) =>{
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
                    data:data,
                    loading: false,
                })
            }
        });
    }
    addList = () =>{
        // this.setState({
        //     visible:true,
        // })
        this.props.dispatch(
            routerRedux.push({
                pathname: '/systemSetup/EvaluationSetup/Add',
                query: { id: this.state.tab },
            }),
        );
    }
    getNum = (rule, value, callback) =>{
        let reg = new RegExp("^([1-9]|[1-9]\\d|100)$");
        if(value&&!reg.test(value)) {
            callback('请输入1-100数字');
        }
        callback();
    }
    handleOk = ()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.dispatch({
                    type: 'Evaluation/addList',
                    payload: {
                        fz:values.kfz,
                        xm_mc:values.kfxm,
                        xm_type:this.state.tab
                    },
                    callback:()=>{
                        message.success('操作成功');
                        this.getList(this.state.tab);
                        this.handleCancel();
                    }
                });
            }
        });
    }
    handleCancel = () =>{
        this.setState({
            visible:false,
        });
        this.props.form.resetFields();
    }
    // 表格分页
    handleTableChange = (pagination) => {
        this.setState({
            current: pagination.current,
            count: pagination.pageSize,
        });
        this.getList('0', pagination.current);
    };
    changeTab = (e) => {
        this.setState({
            tab:e,
            selectedRowKeys:[],
            selectedRows:[],
        });
        this.getList(e,1);
    }
    getDel = () =>{
        let that = this;
        if(this.state.selectedRows&&this.state.selectedRows.length > 0){
            confirm({
                title: this.state.tab==='0' ? '确定删除选中的扣分项？' : this.state.tab==='1' ? '确定删除选中的补分项？' : '确定删除选中的加分项？',
                content: '',
                okText:'确定',
                cancelText:'取消',
                centered:true,
                getContainer:document.getElementById('boxEval'),
                onOk() {
                    that.getDelList(that.state.selectedRowKeys.toString());
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }else{
            message.warn('请选择删除项')
        }
    }
    getEmpty = () =>{
        let that = this;
        if(this.state.data && this.state.data.list && this.state.data.list.length > 0){
            confirm({
                title: '确定清空'+(this.state.tab==='0' ? '扣分项' : this.state.tab==='1' ? '补分项' : '加分项')+'列表？',
                content: '',
                okText:'确定',
                cancelText:'取消',
                centered:true,
                getContainer:document.getElementById('boxEval'),
                onOk() {
                    that.getDelList('');
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }else{
            message.warn('当前列表暂无数据，无需清空')
        }
    }
    getDelList = (ids) =>{
        this.props.dispatch({
            type: 'Evaluation/delList',
            payload: {
                xm_type:this.state.tab,
                id:ids,
            },
            callback:()=>{
                message.success('操作成功');
                this.getList(this.state.tab);
            }
        });
    }
    render() {
        const {form: { getFieldDecorator }} = this.props
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const modleLayouts = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };
        const { data } = this.state;
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
        const columns = [
            {
                title: '分值',
                dataIndex: 'fz',
                render:(text)=>{
                   return <span>{this.state.tab==='0' ? '-' + text : '+' + text}</span>
                }
            }, {
                title: '项目',
                dataIndex: 'xm_mc',
            }
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.state.selectedRowKeys = selectedRowKeys;
                this.setState({
                    selectedRowKeys:this.state.selectedRowKeys,
                    selectedRows: `${selectedRows}`,
                })
            },
            selectedRowKeys:this.state.selectedRowKeys,
        };
        let list = (
            <Table
                loading={this.state.loading}
                rowKey={record => record.id}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                columns={columns}
                dataSource={this.state.data&&this.state.data.list ? this.state.data.list : []}
                rowSelection={rowSelection}
                locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
            />
        );
        return (
            <div className={stylescommon.statistics} id={'boxEval'}>
                <Card className={stylescommon.titleArea}>
                    <Button type="primary" onClick={this.addList}>添加{this.state.tab==='0' ? '扣分' : this.state.tab==='1' ? '补分' : '加分'}项</Button>
                    <div className={stylescommon.btnBox}>
                        <Button style={{marginLeft:10}} onClick={this.getDel}>删除</Button>
                        <Button style={{marginLeft:10}} onClick={this.getEmpty}>清空</Button>
                    </div>
                </Card>
                <Card className={stylescommon.cardArea + ' ' + stylescommon.kfTab}>
                    <Tabs defaultActiveKey="0" onChange={this.changeTab} activeKey={this.state.tab}>
                        <TabPane tab="扣分设置" key="0">
                            {list}
                        </TabPane>
                        <TabPane tab="补分设置" key="1">
                            {list}
                        </TabPane>
                        <TabPane tab="加分设置" key="2">
                           {list}
                        </TabPane>
                    </Tabs>
                </Card>
                {/*<Modal*/}
                {/*    title={'添加'+(this.state.tab==='0' ? '扣分' : this.state.tab==='1' ? '补分' : '加分')+'项'}*/}
                {/*    width={800}*/}
                {/*    visible={this.state.visible}*/}
                {/*    onOk={this.handleOk}*/}
                {/*    okText={'添加'}*/}
                {/*    onCancel={this.handleCancel}*/}
                {/*    className={stylescommon.modalStyle}*/}
                {/*    maskClosable={false}*/}
                {/*    centered={true}*/}
                {/*>*/}
                {/*    <Form>*/}
                {/*        <Row gutter={rowLayout}>*/}
                {/*            <Col span={24}>*/}
                {/*                <FormItem label={this.state.tab==='0' ? '扣分项目' : this.state.tab==='1' ? '补分项目' : '加分项目'} {...modleLayouts}>*/}
                {/*                    {getFieldDecorator('kfxm', {*/}
                {/*                        initialValue: this.state.kfxm,*/}
                {/*                        rules: [*/}
                {/*                            { required: true, message: this.state.tab==='0' ? '请输入扣分项目' : this.state.tab==='1' ? '请输入补分项目' : '请输入加分项目' },*/}
                {/*                            {max:50, message:'最多输入50字'}*/}
                {/*                        ],*/}
                {/*                    })(*/}
                {/*                        <TextArea placeholder="最多输入50字" autosize />*/}
                {/*                    )}*/}
                {/*                </FormItem>*/}
                {/*                <FormItem label={this.state.tab==='0' ? '扣分值' : this.state.tab==='1' ? '补分值' : '加分值'} {...modleLayouts}>*/}
                {/*                    {getFieldDecorator('kfz', {*/}
                {/*                        initialValue: this.state.kfz,*/}
                {/*                        rules: [*/}
                {/*                            { required: true, message: this.state.tab==='0' ? '请输入扣分值' : this.state.tab==='1' ? '请输入补分值' : '请输入加分值' },*/}
                {/*                             {validator: this.getNum},*/}
                {/*                        ],*/}
                {/*                    })(*/}
                {/*                        <Input placeholder='1-100数字'/>,*/}
                {/*                    )}*/}
                {/*                </FormItem>*/}
                {/*            </Col>*/}
                {/*        </Row>*/}
                {/*    </Form>*/}
                {/*</Modal>*/}
            </div>
        );
    }
}
