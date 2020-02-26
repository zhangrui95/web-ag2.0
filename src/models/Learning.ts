import {
  LearningList,InsertList,DeleteList,FormatConvertService,
} from '../services/Learning';

export default {
  namespace: 'Learning',

  state: {

  },

  effects: {
    * getLearningList({payload, callback}, {call, put}) {
      const response = yield call(LearningList, payload);
      yield put({
        type: 'areaSfgz',
        payload: response && response.error === null ? response.data.sfgz : {},
      });
      if (callback && response && !response.error && response.data) {
        callback(response.data);
      }
    },
    * getInsertList({payload, callback}, {call, put}) {
      const response = yield call(InsertList, payload);
      yield put({
        type: 'areaSfgz',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response ) {
        callback(response);
      }
    },
    * getDeleteList({payload, callback}, {call, put}) {
      const response = yield call(DeleteList, payload);
      // console.log('response',response)
      yield put({
        type: 'areaSfgz',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response) {
        callback(response);
      }
    },
    * getFormatConvert({payload, callback}, {call, put}) {
      const response = yield call(FormatConvertService, payload);
      // console.log('response',response)
      yield put({
        type: 'areaSfgz',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response) {
        callback(response);
      }
    },
  },

  reducers: {
    // areaSearch(state, action) {
    //   // console.log('action.payload',action.payload);
    //   return {
    //     ...state,
    //     area: action.payload,
    //   };
    // },

  },
};
