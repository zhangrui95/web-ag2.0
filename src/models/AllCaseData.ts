import { caseDatas } from '../services/AllCaseData';

export default {
    namespace: 'AllCaseData',

    state: {
        returnData: [],
        caseDetails: [],
        loading: true,
        CaseSupervises: [],
        intoAreaData: null,
        allCaseProgress: [],
        enforcementMeasure: [],
    },

    effects: {
        // 获取案件列表
        * caseFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(caseDatas, payload);
            yield put({
                type: 'caseSearch',
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
    },

    reducers: {
        caseSearch(state, action) {
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
    },
};
