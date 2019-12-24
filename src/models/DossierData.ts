/*
*  DossierData.js 卷宗常规数据
*  author：lyp
*  20181031
* */
import * as dossierService from '../services/dossier';
import {ItemCRKDatasView, ItemDatasView, ItemWpqsDatasView, ItemZKNumDatasView} from '../services/itemData';

export default {
    namespace: 'DossierData',

    state: {
        data: {
            list: [],
            page: {},
        },
        detailData: {
            list: [],
            page: {},
        },
        returnjzdetailData: [],
        DossierZKNumDataView: [],
        returnZKNumdetailData: [],
        returnJzqsdetailData: [],
        returnSynchronizationData: [],
        returnElectronicPageListData: [],
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
        * DossierJZSLDataView({payload, callback}, {call, put}) {
            const response = yield call(dossierService.getjzDossierDataView, payload);
            yield put({
                type: 'setDossierDataView',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        * DossierCRKDataView({payload, callback}, {call, put}) {
            const response = yield call(dossierService.DossierCRKDatasView, payload);
            yield put({
                type: 'setDossierCRKDataView',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 在库卷宗数量展示
        * DossierZKNumDataView({payload, callback}, {call, put}) {
            const response = yield call(dossierService.DossierZKNumDatasView, payload);
            yield put({
                type: 'setDossierZKNumDataView',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 卷宗趋势
        * DossierJzqsDataView({payload, callback}, {call, put}) {
            const response = yield call(dossierService.DossierJzqsDatasView, payload);
            yield put({
                type: 'setDossierJzqsDataView',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 电子化情况展示
        * DossierDZHQKDataView({payload, callback}, {call, put}) {
            const response = yield call(dossierService.DossierDZHQKZSDatasView, payload);
            yield put({
                type: 'setDossierDZHQKZSDataView',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 卷宗列表获取
        * fetchSynchronizationList({payload, callback}, {call, put}) {
            const response = yield call(dossierService.DossierSynchronizationDatasView, payload);
            yield put({
                type: 'setDossierSynchronizationDataView',
                payload: response && response.reason === null ? response.data : {},
            });
            if (callback && response && !response.reason && response.data) {
                callback(response.result);
            }
        },
        // 卷宗文书获取
        * fetchElectronicPageList({payload, callback}, {call, put}) {
            const response = yield call(dossierService.DossierElectronicPageListDatasView, payload);
            yield put({
                type: 'setDossierElectronicPageListDataView',
                payload: response && response.reason === null ? response.data : {},
            });
            if (callback && response && !response.reason && response.data) {
                callback(response.result);
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
        setDossierDataView(state, action) {
            return {
                ...state,
                returnjzdetailData: action.payload,
            };
        },
        setDossierCRKDataView(state, action) {
            return {
                ...state,
                returnCRKdetailData: action.payload,
            };
        },
        setDossierZKNumDataView(state, action) {
            return {
                ...state,
                returnZKNumdetailData: action.payload,
            };
        },
        setDossierJzqsDataView(state, action) {
            return {
                ...state,
                returnJzqsdetailData: action.payload,
            };
        },
        setDossierSynchronizationDataView(state, action) {
            return {
                ...state,
                returnSynchronizationData: action.payload,
            };
        },
        setDossierElectronicPageListDataView(state, action) {
            return {
                ...state,
                returnElectronicPageListData: action.payload,
            };
        },
    },
};
