import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Tabs, message } from 'antd';
import style from './systemSetup.less';
import WarningMessages from './WarningMessages';
import SendConfig from './SendConfig';
import EarlyWarningMessages from './EarlyWarningMessages';
import SuperviseMessages from './SuperviseMessages';
import {Dispatch} from "redux";
import {ConnectState} from "@/models/connect";
const { TabPane } = Tabs;
interface MessagePushProps {
    dispatch: Dispatch
}
const MessagePush = (props: MessagePushProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tab,setTab] = useState('cspz');
  useEffect(() => {
      getMessageList();
  }, []);
    const  getMessageList = () => {
        props.dispatch({
            type: 'systemSetup/getMessageList',
            payload: {},
        });
    };
    const setMessageData = (valus) => {
        props.dispatch({
            type: 'systemSetup/setMessageData',
            payload: {
                value: valus,
            },
            callback: () => {
                message.success('消息推送配置保存成功！');
                getMessageList();
            },
        });
    };
    const   splitMessage = (data, id) => {
        let mData = '';
        let sfqy = 0;
        if (data && data[id]) {
            const str = data[id].split('$$');
            mData = str[0];
            sfqy = parseInt(str[1]);
        }
        const obj = { mData, sfqy };
        return obj;
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
            lg: { span: 6 },
            xxl: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
            lg: { span: 18 },
            xxl: { span: 16 },
        },
    };
    const getTabs = (e) =>{
        console.log('e--->',e)
        setTab(e);
    }
    console.log('global========>',props.global)
    let className = props.global.dark ? style.sendMessage : style.sendMessage + ' ' + style.lightBox;
  return (
    <div className={className}>
        <Tabs defaultActiveKey="cspz" onChange={getTabs} activeKey={tab}>
            <TabPane tab={tab === "cspz" ? "● 参数配置" : "参数配置"} key="cspz">
                <SendConfig formItemLayout={formItemLayout} setMessageData={setMessageData}
                            splitMessage={splitMessage} {...props} />
            </TabPane>
            <TabPane tab={tab === "gj" ? "● 告警" : "告警"} key="gj">
                <WarningMessages formItemLayout={formItemLayout} setMessageData={setMessageData}
                                 splitMessage={splitMessage} {...props} />
            </TabPane>
            <TabPane tab={tab === "yj" ? "● 预警" : "预警"} key="yj">
                <EarlyWarningMessages formItemLayout={formItemLayout} setMessageData={setMessageData}
                                      splitMessage={splitMessage} {...props} />
            </TabPane>
            <TabPane tab={tab === "db" ? "● 督办" : "督办"} key="db">
                <SuperviseMessages formItemLayout={formItemLayout} setMessageData={setMessageData}
                                   splitMessage={splitMessage} {...props} />
            </TabPane>
        </Tabs>
    </div>
  );
};
export default connect(({ systemSetup,global }: ConnectState) => ({
    messageList: systemSetup.messageList,
    global,
}))(MessagePush);