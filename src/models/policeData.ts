import {
    policeDatas,
    policeDetailDatas,
    PoliceSuperviseMessage,
    getPoliceSituationCount,
    getHandleResult,
    getHandlePoliceSituationHadResult,
    getAcceptPoliceSituation,
    getHandlePoliceSituation,
    getComment,
    commentsItems
} from '../services/policeData';
import {message} from 'antd';

export default {
    namespace: 'policeData',

    state: {
        police: [],
        policeDetails: [],
        loading: true,
        PoliceSupervises: [],
        policeSituationCount: [],
        handleResult: [],
        handlePoliceSituationHadResult: [],
        acceptPoliceSituation: [],
        handlePoliceSituation: [],
        handlePoliceSfgz:null,
    },

    effects: {
        * policeFetch({payload, callback}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(policeDatas, payload.param ? payload.param : payload);
            if (!payload.num) {
                yield put({
                    type: 'policeSearch',
                    payload: response && response.error === null ? response.data : {},
                });
            }
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        * policeDetailFetch({payload, callback}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(policeDetailDatas, payload);
            yield put({
                type: 'policeDetailSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
              type: 'policeSfgz',
              payload: response && response.error === null ? response.data.sfgz : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 问题判定
        * PoliceSureSupervise({payload, callback}, {call, put}) {
            const response = yield call(PoliceSuperviseMessage, payload);
            yield put({
                type: 'PoliceSuperviseMessage',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 警情数量
        * getPoliceSituationCount({payload, callback}, {call, put}) {
            const response = yield call(getPoliceSituationCount, payload);
            yield put({
                type: 'setPoliceSituationCount',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 处置结果
        * getHandleResult({payload, callback}, {call, put}) {
            const response = yield call(getHandleResult, payload);
            yield put({
                type: 'setHandleResult',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 处警情况
        * getHandlePoliceSituationHadResult({payload, callback}, {call, put}) {
            const response = yield call(getHandlePoliceSituationHadResult, payload);
            yield put({
                type: 'setHandlePoliceSituationHadResult',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 受案情况
        * getAcceptPoliceSituation({payload, callback}, {call, put}) {
            const response = yield call(getAcceptPoliceSituation, payload);
            yield put({
                type: 'setAcceptPoliceSituation',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 警情状况
        * getHandlePoliceSituation({payload, callback}, {call, put}) {
            const response = yield call(getHandlePoliceSituation, payload);
            yield put({
                type: 'setHandlePoliceSituation',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 领导点评
        * getComments({payload, callback}, {call, put}) {
            const response = yield call(getComment, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            } else {
                message.warn('点评失败，请重新操作');
            }
        },
        // 获取领导点评
        * commentsItem({payload, callback}, {call, put}) {
            const response = yield call(commentsItems, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        policeSearch(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                police: action.payload,
            };
        },
        policeDetailSearch(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                policeDetails: action.payload,
            };
        },
        PoliceSuperviseMessage(state, action) {
            return {
                ...state,
                PoliceSupervises: action.payload,
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        setPoliceSituationCount(state, action) {
            return {
                ...state,
                policeSituationCount: action.payload,
            };
        },
        setHandleResult(state, action) {
            return {
                ...state,
                handleResult: action.payload,
            };
        },
        setHandlePoliceSituationHadResult(state, action) {
            return {
                ...state,
                handlePoliceSituationHadResult: action.payload,
            };
        },
        setAcceptPoliceSituation(state, action) {
            return {
                ...state,
                acceptPoliceSituation: action.payload,
            };
        },
        setHandlePoliceSituation(state, action) {
            return {
                ...state,
                handlePoliceSituation: action.payload,
            };
        },
        policeSfgz(state, action) {
          return {
            ...state,
            handlePoliceSfgz: action.payload,
          };
        },
    },
};
