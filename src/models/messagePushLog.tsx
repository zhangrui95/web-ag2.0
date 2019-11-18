/*
* 消息推送日志models
* author: lyp
* date: 20181214
* */

import * as messagePushLogService from '../services/messagePushLog';

export default {
    namespace: 'messagePushLog',

    state: {
        data: [],
    },

    effects: {
        // 获取日志列表
        * getMessagePushLogList({ payload, callback }, { call, put }) {
            const response = yield call(messagePushLogService.getMessagePushLogList, payload);
            yield put({
                type: 'setMessagePushLogList',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }

        },
    },
    reducers: {
        setMessagePushLogList(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
