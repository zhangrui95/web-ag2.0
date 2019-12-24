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
import stylescommon from '../../common/common.less';
import styles from "@/pages/systemSetup/SuperviseSetup/index.less";
import {NavigationItem} from "@/components/Navigation/navigation";
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const {TextArea} = Input;
@connect(({common, Evaluation, global}) => ({
    common, Evaluation, global
}))
@Form.create()
export default class Add extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
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
                        xm_type: this.props.location.query.id
                    },
                    callback: () => {
                        message.success('操作成功');
                        this.onEdit(true);
                    }
                });
            }
        });
    }
    onEdit = (isReset) => {
        let key = '/systemSetup/EvaluationSetup/Add' + this.props.location.query.id;
        // 删除当前tab并且将路由跳转至前一个tab的path
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(routerRedux.push({pathname: '/systemSetup/EvaluationSetup', query: isReset ? {isReset} : {}}));
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
                }
            });
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const modleLayouts = {
            labelCol: {span: 5},
            wrapperCol: {span: 15},
        };
        return (
            <div className={this.props.global && this.props.global.dark ? styles.darkBox : styles.lightBox}>
                <Card style={{padding: '20px 0 300px', marginBottom: 12}}>
                    <div
                        className={styles.title}>添加{this.props.location.query.id === '0' ? '扣分项目' : this.props.location.query.id === '1' ? '补分项目' : '加分项目'}</div>
                    <Form>
                        <Row gutter={rowLayout}>
                            <Col span={24}>
                                <FormItem
                                    label={this.props.location.query.id === '0' ? '扣分项目' : this.props.location.query.id === '1' ? '补分项目' : '加分项目'} {...modleLayouts}>
                                    {getFieldDecorator('kfxm', {
                                        initialValue: this.state.kfxm,
                                        rules: [
                                            {
                                                required: true,
                                                message: this.props.location.query.id === '0' ? '请输入扣分项目' : this.props.location.query.id === '1' ? '请输入补分项目' : '请输入加分项目'
                                            },
                                            {max: 50, message: '最多输入50字'}
                                        ],
                                    })(
                                        <TextArea placeholder="最多输入50字" autosize rows={3}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label={this.props.location.query.id === '0' ? '扣分值' : this.props.location.query.id === '1' ? '补分值' : '加分值'} {...modleLayouts}>
                                    {getFieldDecorator('kfz', {
                                        initialValue: this.state.kfz,
                                        rules: [
                                            {
                                                required: true,
                                                message: this.props.location.query.id === '0' ? '请输入扣分值' : this.props.location.query.id === '1' ? '请输入补分值' : '请输入加分值'
                                            },
                                            {validator: this.getNum},
                                        ],
                                    })(
                                        <Input placeholder='1-100数字'/>,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card>
                    <div className={styles.btns}>
                        {/*<Button type="primary" style={{ marginLeft: 8 }} className={styles.qxBtn} onClick={()=>this.onEdit(false)}>*/}
                        {/*    取消*/}
                        {/*</Button>*/}
                        <Button type="primary" style={{marginLeft: 8}} onClick={this.handleOk} className={styles.okBtn}>
                            添加
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }
}
