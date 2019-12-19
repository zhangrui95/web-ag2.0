import {
    UncaseDatas,
    UncaseDetailDatas,
    SuperviseMessage,
    SureRefomMessage,
    AllDetailPersonDatas,
    getUnCaseAllTypeWarnings,
} from '../services/UnCaseData';
import { getNewAddWarnings } from '../services/UnPoliceData';

export default {
    namespace: 'UnCaseData',

    state: {
        unCaseData: [],
        unCaseDetailData: [],
        loading: true,
        CaseSupervises: [],
        SureRefomSupervises: [],
        AllDetailPersonData: [],
        unCaseAllTypeWarnings: [],
    },

    effects: {
        * UnCaseFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(UncaseDatas, payload);
            yield put({
                type: 'UnCaseSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error&& response.data) {
                callback(response.data);
            }
        },
        * UnCaseDetailFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(UncaseDetailDatas, payload);
            yield put({
                type: 'UnCaseDetailSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error&& response.data) {
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
            if (callback && response && !response.error&& response.data) {
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
            if (callback && response && !response.error&& response.data) {
                callback(response.data);
            }
        },
        // 获取人员档案
        * AllDetailPersonFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(AllDetailPersonDatas, payload);
            yield put({
                type: 'AllDetailPersonSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error&& response.data) {
                callback(response.data);
            }
        },
        * getUnCaseByProblemId({ payload, callback }, { call, put }) {
            const response = yield call(UncaseDatas, payload);
            if (callback && response && !response.error&& response.data) {
                callback(response.data);
            }
        },
        // 新增告警图表
        * getUnCaseAllTypeWarnings({ payload, callback }, { call, put }) {
            const response = yield call(getUnCaseAllTypeWarnings, payload);
            yield put({
                type: 'setUnCaseAllTypeWarnings',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error&& response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        UnCaseSearch(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                unCaseData: action.payload,
            };
        },
        UnCaseDetailSearch(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                unCaseDetailData: action.payload,
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
        AllDetailPersonSearch(state, action) {
            return {
                ...state,
                AllDetailPersonData: action.payload,
            };
        },
        setUnCaseAllTypeWarnings(state, action) {
            return {
                ...state,
                unCaseAllTypeWarnings: action.payload,
            };
        },
    },
};
