/*
 * 监管配置页面
 * */
import {
    jgList,
    delJgd,
    addJgd,
    updateJgd,
    fyJg,
    fyJgsx,
    fyJgd,
    saveFy,
    getchangeJgPzXxService,
    getExplainModalService
} from '../services/SuperviseSetup';
import {getDictType} from '../services/common';

export default {
    namespace: 'SuperviseSetup',

    state: {
        JgdType: [], //监管点
    },

    effects: {
        // 监管点列表
        * getJgList({payload, callback}, {call, put}) {
            const response = yield call(jgList, payload);
            if (response && response.data) {
                callback(response.data);
            }
        },
        // 删除监管点
        * getdelJgd({payload, callback}, {call, put}) {
            const response = yield call(delJgd, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 新增监管点
        * getaddJgd({payload, callback}, {call, put}) {
            const response = yield call(addJgd, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 修改监管点
        * getupdateJgd({payload, callback}, {call, put}) {
            const response = yield call(updateJgd, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 获取监管复用机构列表信息
        * getfyJg({payload, callback}, {call, put}) {
            const response = yield call(fyJg, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 获取监管复用监管事项
        * getfyJgsx({payload, callback}, {call, put}) {
            const response = yield call(fyJgsx, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 获取监管复用监管点
        * getfyJgd({payload, callback}, {call, put}) {
            const response = yield call(fyJgd, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 保存复用监管点
        * getSaveFy({payload, callback}, {call, put}) {
            const response = yield call(saveFy, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        //根据id,获取字典项
        * getDictType({payload, callback}, {call, put}) {
            const response = yield call(getDictType, payload);
            yield put({
                type: 'setJgd',
                payload: response && response.error === null ? response.data : [],
            });
        },
        // 监管配置启用禁用功能
        * changeJgPzXx({payload, callback}, {call, put}) {
            const response = yield call(getchangeJgPzXxService, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
        // 获取监管点具体算法说明
        * getExplainModal({payload, callback}, {call, put}) {
            const response = yield call(getExplainModalService, payload);
            if (response && !response.error) {
                callback(response);
            }
        },
    },

    reducers: {
        setJgd(state, action) {
            return {
                ...state,
                JgdType: action.payload,
            };
        },
    },
};
