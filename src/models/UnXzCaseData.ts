import {
    UnXzCaseDatas,
    getUnXzAjxxXqById,
    getUnXzCaseAllTypeWarnings,
    UnXzcaseDetailDatas,
} from '../services/UnXzCaseData';
import {UncaseDetailDatas} from '../services/UnCaseData';

export default {
    namespace: 'UnXzCaseData',

    state: {
        returnData: [],
        caseDetails: [],
        loading: true,
        unXzCaseAllTypeWarnings: [],
        unXzCaseDetailData: [],
    },

    effects: {
        * caseFetch({payload, callback}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(UnXzCaseDatas, payload);
            yield put({
                type: 'caseSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 按ID查询案件详情
        * getXzAjxxXqById({payload, callback}, {call, put}) {
            const response = yield call(getUnXzAjxxXqById, payload);
            yield put({
                type: 'caseDetail',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        * UnXzCaseDetailFetch({payload, callback}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(UnXzcaseDetailDatas, payload);
            yield put({
                type: 'UnXzCaseDetailSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 根据问题ID查询问题数据
        * getUnXzCaseByProblemId({payload, callback}, {call, put}) {
            const response = yield call(UnXzCaseDatas, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 行政案件问题告警图表统计
        * getUnXzCaseAllTypeWarnings({payload, callback}, {call, put}) {
            const response = yield call(getUnXzCaseAllTypeWarnings, payload);
            yield put({
                type: 'setUnXzCaseAllTypeWarnings',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        caseSearch(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                returnData: action.payload,
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        UnXzCaseDetailSearch(state, action) {
            return {
                ...state,
                unXzCaseDetailData: action.payload,
            };
        },
        caseDetail(state, action) {
            return {
                ...state,
                caseDetails: action.payload,
            };
        },
        setUnXzCaseAllTypeWarnings(state, action) {
            return {
                ...state,
                unXzCaseAllTypeWarnings: action.payload,
            };
        },
    },
};
