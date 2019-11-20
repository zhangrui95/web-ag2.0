/*
 * generalQuery.js 综合查询
 * author：lyp
 * 20180731
 * */

import * as generalQueryService from '../services/generalQuery';

export default {
  namespace: 'generalQuery',

  state: {
    searchData: [],
  },

  effects: {
    // 综合查询
    *getSearchData({ payload, callback }, { call, put }) {
      const response = yield call(generalQueryService.getSearchData, payload);
      yield put({
        type: 'setSearchData',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error) {
        callback(response);
      }
    },

    *getSearchDataNew({ payload, callback }, { call, put }) {
      const response = yield call(generalQueryService.getSearchDataNew, payload);
      yield put({
        type: 'setSearchData',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error) {
        callback(response);
      }
    },

    *getSaveSsNrXX({ payload, callback }, { call, put }) {
      const response = yield call(generalQueryService.getSaveSsNrXX, payload);
    },

    *getssNrXX({ payload, callback }, { call, put }) {
      const response = yield call(generalQueryService.getSsNrXX, payload);
      if (callback && response) {
        callback(response);
      }
    },
  },

  reducers: {
    setSearchData(state, action) {
      return {
        ...state,
        searchData: action.payload,
      };
    },
  },
};
