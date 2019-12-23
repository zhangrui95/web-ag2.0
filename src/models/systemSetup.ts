/*
* 配置页面models
* author：lyp
* 20190513
* */

import * as systemSetupService from '../services/systemSetup';

export default {
    namespace: 'systemSetup',

    state: {
        messageList: null,
    },

    effects: {
        // 获取消息推送配置项
        * getMessageList({payload, callback}, {call, put}) {
            const response = yield call(systemSetupService.getMessageList, payload);

            yield put({
                type: 'setMessageList',
                payload: response && response.error === null ? response.data : null,
            });
            if (callback && response && response.data) {
                callback(response.data);
            }
        },
        // 提交消息推送配置
        * setMessageData({payload, callback}, {call, put}) {
            const response = yield call(systemSetupService.setMessageData, payload);
            if (callback && response && !response.error) {
                callback();
            }
        },
    },

    reducers: {
        setMessageList(state, action) {
            return {
                ...state,
                messageList: action.payload,
            };
        },
    },
};