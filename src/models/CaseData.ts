import {
    getAjxxXqById,
    CaseSuperviseMessage,
    caseDatas,
    getIntoAreaData,
    getAllCaseProgress,
    getEnforcementMeasure,
    getSLAEnforcementMeasure,
    getCaseTypeStatistics,
} from '../services/CaseData';
// import {SuperviseMessage} from "../services/UnCaseData";

export default {
    namespace: 'CaseData',

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
        // 通过详情请求案件编号获取表格的退补信息
        * caseRetrieveFetch({ payload, callback }, { call, put }) {
            const response = yield call(caseDatas, payload);
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 按ID查询案件详情
        * getAjxxXqById({ payload, callback }, { call, put }) {
            const response = yield call(getAjxxXqById, payload);
            yield put({
                type: 'caseDetail',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }

        },
        // 问题判定
        * CaseSureSupervise({ payload, callback }, { call, put }) {
            const response = yield call(CaseSuperviseMessage, payload);
            yield put({
                type: 'CaseSupervise',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 获取入区信息
        * getIntoAreaData({ payload, callback }, { call, put }) {
            const response = yield call(getIntoAreaData, payload);
            yield put({
                type: 'setIntoAreaData',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 案件办理进度
        * getAllCaseProgress({ payload, callback }, { call, put }) {
            const response = yield call(getAllCaseProgress, payload);
            yield put({
                type: 'setAllCaseProgress',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 人员强制措施情况
        * getEnforcementMeasure({ payload, callback }, { call, put }) {
            const response = yield call(getEnforcementMeasure, payload);
            yield put({
                type: 'setEnforcementMeasure',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 受立案人员强制措施情况
        * getSLAEnforcementMeasure({ payload, callback }, { call, put }) {
            const response = yield call(getSLAEnforcementMeasure, payload);
            yield put({
                type: 'setEnforcementMeasure',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 获取刑事案件类别统计
        * getCaseTypeStatistics({ payload, callback }, { call, put }) {
            const response = yield call(getCaseTypeStatistics, payload);
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
        caseDetail(state, action) {
            return {
                ...state,
                caseDetails: action.payload,
            };
        },
        CaseSuperviseMessage(state, action) {
            return {
                ...state,
                CaseSupervises: action.payload,
            };
        },
        setIntoAreaData(state, action) {
            return {
                ...state,
                intoAreaData: action.payload,
            };
        },
        setAllCaseProgress(state, action) {
            return {
                ...state,
                allCaseProgress: action.payload,
            };
        },
        setEnforcementMeasure(state, action) {
            return {
                ...state,
                enforcementMeasure: action.payload,
            };
        },
    },
};
