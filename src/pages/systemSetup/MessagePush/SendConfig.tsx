/*
* 消息推送配置——参数配置
* author：lyp
* 20190513
* */

import React, {Component, PureComponent} from 'react';
import {Tabs, Form, Input, Button, Switch, Modal, TimePicker, Icon, Card,message} from 'antd';
import style from './systemSetup.less';
import moment from 'moment';
import {connect} from "dva";

const {TabPane} = Tabs;
const confirm = Modal.confirm;

@connect(({systemSetup, global}) => ({
    systemSetup, global
}))
class SendConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoHeight: false,
            list: [],
            num: 0,
            startTime: [],
            endTime: [],
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.systemSetup.messageList !== this.props.systemSetup.messageList) {
            this.getTimeChange(nextProps);
        }
    }

    getTimeChange = (nextProps) => {
        let messageList = nextProps.systemSetup.messageList;
        let time = messageList && messageList.mdrsd ? messageList.mdrsd.replace("$$1", "").split(",") : '';
        let startTime = [time && time[0] ? time[0].split("~")[0] : '', time && time[1] ? time[1].split("~")[0] : '', time && time[2] ? time[2].split("~")[0] : ''];
        let endTime = [time && time[0] ? time[0].split("~")[1] : '', time && time[1] ? time[1].split("~")[1] : '', time && time[2] ? time[2].split("~")[1] : ''];

        this.setState({
            startTime: startTime,
            endTime: endTime,
        });
    }
    // 保存确认框
    showConfirm = () => {
        const that = this;
        let isTrue = true;
        this.state.startTime.map((item, idx) => {
            if((!item && this.state.endTime[idx]) || (item && !this.state.endTime[idx])){
                isTrue = false;
            }
        })
        if(isTrue) {
            confirm({
                title: '确定要保存配置信息吗？',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                getContainer: document.getElementById('boxSend'),
                onOk() {
                    that.saveSendConfig();
                },
            });
        }else{
            message.warning('免打扰不能存在未闭合区间');
        }
    };
    // 保存配置信息
    saveSendConfig = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let time = [];
                let times = [];
                this.state.startTime.map((item, idx) => {
                    console.log(item && this.state.endTime[idx],item,this.state.endTime[idx])
                    if (item && this.state.endTime[idx]) {
                        if (item > this.state.endTime[idx]) {
                            times.push(item + '~23:59:59,00:00:00~' + this.state.endTime[idx]);
                        } else {
                            times.push(item + '~' + this.state.endTime[idx]);
                        }
                        time.push(item + '~' + this.state.endTime[idx]);
                    }
                })
                values.mdrsd = time.toString();
                values.mdrsd_sy = times.toString();
                const valuesArry = Object.entries(values);
                const newArry = [];
                valuesArry.forEach((val, ind) => { // 将结果集拼成数组
                    let objValue = val[1];
                    if (val[0] === 'dxts_sfqy' || val[0] === 'isNeedBack') {
                        objValue = objValue ? 1 : 0;
                    }
                    newArry.push({
                        key: val[0],
                        value: objValue,
                        sf_qy: 1,
                    });
                });
                this.props.setMessageData(newArry);
            }
        });
    };

    onChangeTime(time, timeString, idx) {
        let startTime = [...this.state.startTime];
        startTime[idx] = timeString;
        this.setState({
            ['startTime' + idx]: time ? time : 'clear',
            startTime: startTime,
        });
    }

    onChangeTimes(time, timeString, idx) {
        let endTime = [...this.state.endTime];
        endTime[idx] = timeString;
        this.setState({
            ['endTime' + idx]: time ? time : 'clear',
            endTime: endTime
        });
    }

    getAdd = () => {
        this.setState({
            autoHeight: !this.state.autoHeight,
        })
    }
    timeList = () => {
        let timeList = [];
        let dark = this.props.global && this.props.global.dark;
        const {systemSetup: {messageList}} = this.props;
        let time = messageList && messageList.mdrsd ? messageList.mdrsd.replace("$$1", "").split(",") : null;
        for (let i = 0; i < 3; i++) {
            let startTime = time && time[i] ? time[i].split("~")[0] : null;
            let endTime = time && time[i] ? time[i].split("~")[1] : null;
            timeList.push(<div>
                <TimePicker
                    value={this.state['startTime' + i] ? this.state['startTime' + i] === 'clear' ? null : this.state['startTime' + i] : startTime ? moment(startTime, 'HH:mm:ss') : ''}
                    getPopupContainer={() => document.getElementById('Messageform')}
                    onChange={(time, timeString) => this.onChangeTime(time, timeString, i)}
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}/> <span
                style={{color: dark ? '#fff' : '#999'}}>  ~  </span>
                <TimePicker
                    value={this.state['endTime' + i] ? this.state['endTime' + i] === 'clear' ? null : this.state['endTime' + i] : endTime ? moment(endTime, 'HH:mm:ss') : ''}
                    getPopupContainer={() => document.getElementById('Messageform')}
                    onChange={(time, timeString) => this.onChangeTimes(time, timeString, i)}
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}/>
                <span onClick={this.getAdd}
                      className={i == 0 ? style.iconAdd : style.none}><span>  {this.state.autoHeight ? '折叠' : '展开'}  </span><Icon
                    type={this.state.autoHeight ? "up" : "down"}/></span>
            </div>);
        }
        return timeList;
    }

    render() {
        const {formItemLayout, form: {getFieldDecorator}, systemSetup: {messageList}} = this.props;
        return (
            <div id={'boxSend'}>
                <Card className={style.cardBox} id={'Messageform'}>
                    <Form>
                        <h6 className={style.title}>参数配置</h6>
                        <Form.Item label="是否启用" {...formItemLayout}>
                            {getFieldDecorator('dxts_sfqy', {
                                valuePropName: 'checked',
                                initialValue: messageList ? parseInt(messageList.dxts_sfqy) : 0,
                            })(
                                <Switch/>,
                            )}
                        </Form.Item>
                        <Form.Item label="接口地址" {...formItemLayout}>
                            {getFieldDecorator('dxts_server', {
                                initialValue: messageList ? messageList.dxts_server : '',
                                rules: [{
                                    required: true, message: '接口地址!',
                                }],
                            })(
                                <Input/>,
                            )}
                        </Form.Item>
                        <Form.Item label="系统代码" {...formItemLayout}>
                            {getFieldDecorator('shortNo', {
                                initialValue: messageList ? messageList.shortNo : '',
                                rules: [{
                                    required: true, message: '系统代码!',
                                }],
                            })(
                                <Input/>,
                            )}
                        </Form.Item>
                        <Form.Item label="系统模块代码" {...formItemLayout}>
                            {getFieldDecorator('modCode', {
                                initialValue: messageList ? messageList.modCode : '',
                                rules: [{
                                    required: true, message: '系统模块代码!',
                                }],
                            })(
                                <Input/>,
                            )}
                        </Form.Item>
                        <Form.Item label="是否需要回复" {...formItemLayout}>
                            {getFieldDecorator('isNeedBack', {
                                initialValue: messageList ? parseInt(messageList.isNeedBack) : 0,
                                valuePropName: 'checked',
                            })(
                                <Switch/>,
                            )}
                        </Form.Item>
                        <Form.Item label="免打扰时段" {...formItemLayout}>
                            {getFieldDecorator('mdrsd', {
                                initialValue: '',
                            })(
                                <div style={{height: this.state.autoHeight ? 'auto' : '40px', overflow: 'hidden'}}>
                                    {this.timeList()}
                                </div>
                            )}
                        </Form.Item>
                    </Form>
                </Card>
                <Card>
                    <Button type="primary" className={style.submitButton} onClick={this.showConfirm}>提交</Button>
                </Card>
            </div>
        );
    }
}

export default Form.create()(
    connect((systemSetup, common) => ({systemSetup, common}))(SendConfig),
);
