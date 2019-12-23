/*
*  UnDossierData.js 卷宗常规数据
*  author：jhm
*  20181206
* */
import * as dossierService from '../services/Undossier';
import {SuperviseMessage} from '../services/UnCaseData';
import {SureRefomMessage, UnpoliceDatas} from '../services/UnPoliceData';

export default {
    namespace: 'UnDossierData',

    state: {
        data: {
            list: [],
            page: {},
        },
        detailData: {
            list: [],
            page: {},
        },
        SureRefomSuperviseData: {
            list: [],
            page: {},
        },
        UnDossierSuperviseData: [],
    },

    effects: {
        * getDossierData({payload, callback}, {call, put}) {
            const response = yield call(dossierService.getDossierData, payload);
            yield put({
                type: 'setDossierData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
                callback(response.data);
            }
        },
        * NewgetDossierData({payload, callback}, {call, put}) {
            const response = yield call(dossierService.getDossierData, payload);
            yield put({
                type: 'NewsetDossierData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
                callback(response.data);
            }
        },
        * getDossierDetail({payload, callback}, {call, put}) {
            const response = yield call(dossierService.getDossierDetail, payload);
            yield put({
                type: 'setDossierDetail',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
                callback(response.data);
            }
        },
        // 保存督办
        * SureSupervise({payload, callback}, {call, put}) {
            const response = yield call(dossierService.SuperviseMessage, payload);
            yield put({
                type: 'CaseSupervise',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        * getUnDossierByProblemId({payload, callback}, {call, put}) {
            const response = yield call(dossierService.getDossierData, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 确认整改完成
        * sureRefomFetch({payload, callback}, {call, put}) {
            const response = yield call(dossierService.SureRefomMessage, payload);
            yield put({
                type: 'SureRefomSupervise',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        * getUnDossierAllTypeWarnings({payload, callback}, {call, put}) {
            const response = yield call(dossierService.UnDossierAllTypeWarnings, payload);
            yield put({
                type: 'UnDossierAllTypeWarningsSupervise',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        setDossierData(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        setDossierDetail(state, action) {
            return {
                ...state,
                detailData: action.payload,
            };
        },
        SureRefomSupervise(state, action) {
            return {
                ...state,
                SureRefomSuperviseData: action.payload,
            };
        },
        UnDossierAllTypeWarningsSupervise(state, action) {
            return {
                ...state,
                UnDossierSuperviseData: action.payload,
            };
        },
    },
};
