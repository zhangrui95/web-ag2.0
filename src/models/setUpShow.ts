/*
* 首页
* */
import {save, query} from '../services/setUpShow';
import {message} from 'antd';

export default {
    namespace: 'setUpShow',

    state: {
        code: null,
    },

    effects: {
        // 保存配置
        * getSave({payload, callback}, {call, put}) {
            const response = yield call(save, payload);
            if (response.error === null) {
                message.success('提示：设置成功');
                callback();
            }
        },
        // 获取配置值
        * getQueryList({payload, callback}, {call, put}) {
            const response = yield call(query, payload);
            yield put({
                type: 'getQuery',
                payload: response,
            });
            if (response) {
                callback(response);
            }
        },
    },

    reducers: {
        getQuery(state, action) {
            return {
                ...state,
                code: action.payload,
            };
        },
    },
};
