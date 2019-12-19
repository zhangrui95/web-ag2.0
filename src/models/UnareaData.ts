import {
  UnareaDatas,
  UnareaDetailDatas,
  SuperviseMessage,
  SureRefomMessage,
  getUnAreaAllTypeWarnings,
} from '../services/UnareaData';

export default {
  namespace: 'UnareaData',

  state: {
    Unarea: [],
    UnareaDetail: [],
    loading: true,
    CaseSupervises: [],
    SureRefomSupervises: [],
    unAreaAllTypeWarnings: [],
  },

  effects: {
    *UnareaFetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(UnareaDatas, payload);
      yield put({
        type: 'UnareaSearch',
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
    *UnareaDetailFetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(UnareaDetailDatas, payload);
      yield put({
        type: 'UnareaDetailSearch',
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
    *SureSupervise({ payload, callback }, { call, put }) {
      const response = yield call(SuperviseMessage, payload);
      yield put({
        type: 'CaseSupervise',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 确认整改完成
    *sureRefomFetch({ payload, callback }, { call, put }) {
      const response = yield call(SureRefomMessage, payload);
      yield put({
        type: 'SureRefomSupervise',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && !response.error&& response.data) {
        callback(response.data);
      }
    },
    *getUnareaByProblemId({ payload, callback }, { call, put }) {
      const response = yield call(UnareaDatas, payload);
      if (callback && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 办案区问题告警图表统计
    *getUnAreaAllTypeWarnings({ payload, callback }, { call, put }) {
      const response = yield call(getUnAreaAllTypeWarnings, payload);
      yield put({
        type: 'setUnAreaAllTypeWarnings',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
  },

  reducers: {
    UnareaSearch(state, action) {
      // console.log('action.payload',action.payload);
      return {
        ...state,
        Unarea: action.payload,
      };
    },
    UnareaDetailSearch(state, action) {
      // console.log('action.payload',action.payload);
      return {
        ...state,
        UnareaDetail: action.payload,
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
    setUnAreaAllTypeWarnings(state, action) {
      return {
        ...state,
        unAreaAllTypeWarnings: action.payload,
      };
    },
  },
};
