import {
  UnpoliceDatas,
  UnPoliceDetailDatas,
  SuperviseMessage,
  SureRefomMessage,
  AllDetailPersonDatas,
  getNewAddWarnings,
} from '../services/UnPoliceData';
import { UncaseDatas } from '../services/UnCaseData';

export default {
  namespace: 'UnPoliceData',

  state: {
    unPoliceDatas: [],
    unPoliceDetailData: [],
    loading: true,
    CaseSupervises: [],
    SureRefomSupervises: [],
    AllDetailPersonData: [],
    newAddWarnings: [],
  },

  effects: {
    *UnPoliceFetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(UnpoliceDatas, payload);
      yield put({
        type: 'UnPoliceSearch',
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
    *UnPoliceDetailFetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(UnPoliceDetailDatas, payload);
      yield put({
        type: 'UnPoliceDetailSearch',
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
      if (callback && response && !response.error&& response.data) {
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
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    *getUnPoliceByProblemId({ payload, callback }, { call, put }) {
      const response = yield call(UnpoliceDatas, payload);
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 获取人员档案
    *AllDetailPersonFetch({ payload, callback }, { call, put }) {
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
    // 新增告警图表
    *getNewAddWarnings({ payload, callback }, { call, put }) {
      const response = yield call(getNewAddWarnings, payload);
      yield put({
        type: 'setNewAddWarnings',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
  },

  reducers: {
    UnPoliceSearch(state, action) {
      // console.log('action.payload',action.payload);
      return {
        ...state,
        unPoliceDatas: action.payload,
      };
    },
    UnPoliceDetailSearch(state, action) {
      // console.log('action.payload',action.payload);
      return {
        ...state,
        unPoliceDetailData: action.payload,
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
    setNewAddWarnings(state, action) {
      return {
        ...state,
        newAddWarnings: action.payload,
      };
    },
  },
};
