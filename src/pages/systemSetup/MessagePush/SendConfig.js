/*
* 消息推送配置——参数配置
* author：lyp
* 20190513
* */

import React, {Component, PureComponent} from 'react';
import { Tabs, Form, Input, Button, Switch, Modal,TimePicker,Icon, Card } from 'antd';
import style from './systemSetup.less';
import moment from 'moment';
import {connect} from "dva";

const { TabPane } = Tabs;
const confirm = Modal.confirm;

class SendConfig extends Component {
    constructor(props){
        super(props);
        this.state = {
            autoHeight: false,
            list:[],
            num:0,
        }
        this.startTime = [];
        this.endTime = [];
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.systemSetup.messageList !== this.props.systemSetup.messageList){
           this.getTimeChange(nextProps);
        }
    }
    getTimeChange = (nextProps) =>{
        let messageList = nextProps.systemSetup.messageList;
        let time = messageList&&messageList.mdrsd ? messageList.mdrsd.replace("$$1","").split(",") : '';
        this.setState({
            time0:time&&time[0] ? time[0].split("~")[0] : '',
            time1:time&&time[0] ? time[0].split("~")[1] : '',
            time2:time&&time[1] ? time[1].split("~")[0] : '',
            time3:time&&time[1] ? time[1].split("~")[1] : '',
            time4:time&&time[2] ? time[2].split("~")[0] : '',
            time5:time&&time[2] ? time[2].split("~")[1] : '',
        });
        this.startTime = [time&&time[0] ? time[0].split("~")[0] : '',time&&time[1] ? time[1].split("~")[0] : '',time&&time[2] ? time[2].split("~")[0] : ''];
        this.endTime = [time&&time[0] ? time[0].split("~")[1] : '',time&&time[1] ? time[1].split("~")[1] : '',time&&time[2] ? time[2].split("~")[1] : ''];
    }
    // 保存确认框
    showConfirm = () => {
        const that = this;
        confirm({
            title: '确定要保存配置信息吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.saveSendConfig();
            },
        });
    };
    // 保存配置信息
    saveSendConfig = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let time = [];
                let times = [];
                this.startTime.map((item,idx)=>{
                    if(item){
                        if(item > this.endTime[idx]){
                            times.push(item+'~23:59:59,00:00:00~'+this.endTime[idx]);
                        }else{
                            times.push(item+'~'+this.endTime[idx]);
                        }
                        time.push(item+'~'+this.endTime[idx]);
                    }else{
                        time.push('');
                    }
                    this.endTime[idx] = '';
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
    onChangeTime(time, timeString,idx) {
        this.setState({
             ['startTime'+idx]:time ? time : 'clear'
        });
        this.startTime[idx] = timeString;
    }
    onChangeTimes(time, timeString,idx) {
        this.setState({
            ['endTime'+idx]:time ? time : 'clear'
        });
        this.endTime[idx] = timeString;
    }
    getAdd = () =>{
        this.setState({
            autoHeight:!this.state.autoHeight,
        })
    }
    render() {
        const { formItemLayout, form: { getFieldDecorator }, systemSetup:{systemSetup: { messageList }} } = this.props;
        console.log('this.props',this.props.systemSetup,messageList)
        let time = messageList&&messageList.mdrsd ? messageList.mdrsd.replace("$$1","").split(",") : '';
        let time0 = time&&time[0] ? time[0].split("~")[0] : '';
        let time1 =  time&&time[0] ? time[0].split("~")[1] : '';
        let time2 =  time&&time[1] ? time[1].split("~")[0] : '';
        let time3 =  time&&time[1] ? time[1].split("~")[1] : '';
        let time4 =  time&&time[2] ? time[2].split("~")[0] : '';
        let time5 =  time&&time[2] ? time[2].split("~")[1] : '';
        return (
            <div>
                <Card className={style.cardBox}>
                    <Form>
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
                                <div style={{height: this.state.autoHeight ? 'auto' : '40px',overflow: 'hidden'}}>
                                    <div>
                                        <TimePicker value={this.state.startTime0 ? this.state.startTime0 === 'clear' ? null:this.state.startTime0 : time0 ? moment(time0, 'HH:mm:ss') : ''} onChange={(time, timeString)=>this.onChangeTime(time, timeString, 0)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> <span>  ~  </span>
                                        <TimePicker value={this.state.endTime0 ? this.state.endTime0 === 'clear' ? null:this.state.endTime0 : time1 ? moment(time1, 'HH:mm:ss') : ''} onChange={(time, timeString)=>this.onChangeTimes(time, timeString, 0)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                        <span onClick={this.getAdd} className={style.iconAdd}><Icon type={this.state.autoHeight ? "up" : "down"}/><span>  {this.state.autoHeight ? '折叠' : '展开'} </span></span>
                                    </div>
                                    <div>
                                        <TimePicker value={this.state.startTime1 ? this.state.startTime1=== 'clear' ? null:this.state.startTime1 : time2 ? moment(time2, 'HH:mm:ss') : ''}  onChange={(time, timeString)=>this.onChangeTime(time, timeString, 1)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> <span>  ~  </span>
                                        <TimePicker value={this.state.endTime1 ? this.state.endTime1=== 'clear' ? null:this.state.endTime1 : time3 ? moment(time3, 'HH:mm:ss') : ''} onChange={(time, timeString)=>this.onChangeTimes(time, timeString, 1)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                    </div>
                                    <div>
                                        <TimePicker value={this.state.startTime2 ? this.state.startTime2=== 'clear' ? null:this.state.startTime2 : time4 ? moment(time4, 'HH:mm:ss') : ''} onChange={(time, timeString)=>this.onChangeTime(time, timeString, 2)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> <span>  ~  </span>
                                        <TimePicker value={this.state.endTime2 ? this.state.endTime2=== 'clear' ? null:this.state.endTime2: time5 ? moment(time5, 'HH:mm:ss') : ''} onChange={(time, timeString)=>this.onChangeTimes(time, timeString, 2)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                    </div>
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
    connect((systemSetup, common) => ({ systemSetup, common }))(SendConfig),
);
