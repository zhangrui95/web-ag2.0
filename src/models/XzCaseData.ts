import {
    xzCaseDatas,
    getXzAjxxXqById,
    getAllXzCaseProgress,
    getAllXzTypeCase,
    getAdministrativePenalty,
    getCaseTypeStatistics,
} from '../services/CaseData';

export default {
    namespace: 'XzCaseData',

    state: {
        returnData: [],
        caseDetails: [],
        loading: true,
        allXzCaseProgressData: [],
        allXzTypeCaseData: [],
        administrativePenalty: [],
    },

    effects: {
        * caseFetch({payload}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(xzCaseDatas, payload);
            yield put({
                type: 'caseSearch',
                payload: response && response.error === null ? response.data : [],
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        },
        // 按ID查询案件详情
        * getXzAjxxXqById({payload, callback}, {call, put}) {
            const response = yield call(getXzAjxxXqById, payload);
            yield put({
                type: 'caseDetail',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 案件情况展示
        * getAllXzCaseProgress({payload, callback}, {call, put}) {
            const response = yield call(getAllXzCaseProgress, payload);
            yield put({
                type: 'setAllXzCaseProgress',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 受结情况展示
        * getAllXzTypeCase({payload, callback}, {call, put}) {
            const response = yield call(getAllXzTypeCase, payload);
            yield put({
                type: 'setAllXzTypeCase',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 人员行政处罚情况
        * getAdministrativePenalty({payload, callback}, {call, put}) {
            const response = yield call(getAdministrativePenalty, payload);
            yield put({
                type: 'setAdministrativePenalty',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 案件类型统计
        * getCaseTypeStatistics({payload, callback}, {call, put}) {
            const response = yield call(getCaseTypeStatistics, payload);
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
        caseDetail(state, action) {
            return {
                ...state,
                caseDetails: action.payload,
            };
        },
        setAllXzCaseProgress(state, action) {
            return {
                ...state,
                allXzCaseProgressData: action.payload,
            };
        },
        setAllXzTypeCase(state, action) {
            return {
                ...state,
                allXzTypeCaseData: action.payload,
            };
        },
        setAdministrativePenalty(state, action) {
            return {
                ...state,
                administrativePenalty: action.payload,
            };
        },
    },
};
