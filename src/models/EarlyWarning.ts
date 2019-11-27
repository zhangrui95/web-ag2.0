import { getLists } from '../services/EarlyWarning.js';

export default {
  namespace: 'EarlyWarning',

  state: {
    data: {
      list: [],
      page: {},
    },
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getLists, payload);
      yield put({
        type: 'setList',
        payload: response && response.error === null ? response.data : [],
      });
      if (callback && response && response.error === null) {
        callback(response.data);
      }
    },
  },

  reducers: {
    setList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
