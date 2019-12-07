import {
    UnitemDatas,
    UnitemDetailDatas,
    SuperviseMessage,
    SureRefomMessage,
    getUnItemAllTypeWarnings,
} from '../services/UnItemData';

export default {
    namespace: 'UnItemData',

    state: {
        Unitem: [],
        UnitemDetail: [],
        loading: true,
        CaseSupervises: [],
        SureRefomSupervises: [],
        unItemAllTypeWarnings: [],
    },

    effects: {
        * UnitemFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(UnitemDatas, payload);
            yield put({
                type: 'UnitemSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        * UnitemDetailFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(UnitemDetailDatas, payload);
            yield put({
                type: 'UnitemDetailSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 保存督办
        * SureSupervise({ payload, callback }, { call, put }) {
            const response = yield call(SuperviseMessage, payload);
            yield put({
                type: 'CaseSupervise',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 确认整改完成
        * sureRefomFetch({ payload, callback }, { call, put }) {
            const response = yield call(SureRefomMessage, payload);
            yield put({
                type: 'SureRefomSupervise',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        * getUnitemByProblemId({ payload, callback }, { call, put }) {
            const response = yield call(UnitemDatas, payload);
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 涉案物品问题告警图表统计
        * getUnItemAllTypeWarnings({ payload, callback }, { call, put }) {
            const response = yield call(getUnItemAllTypeWarnings, payload);
            yield put({
                type: 'setUnItemAllTypeWarnings',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
    },


    reducers: {
        UnitemSearch(state, action) {
            return {
                ...state,
                Unitem: action.payload,
            };
        },
        UnitemDetailSearch(state, action) {
            return {
                ...state,
                UnitemDetail: action.payload,
            };
        },

        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        CaseSupervise(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                CaseSupervises: action.payload,
            };
        },
        SureRefomSupervise(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                SureRefomSupervises: action.payload,
            };
        },
        setUnItemAllTypeWarnings(state, action) {
            return {
                ...state,
                unItemAllTypeWarnings: action.payload,
            };
        },
    },
};
