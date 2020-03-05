import {
  SaveQuestion,QuestionList,DeleteList,FormatConvertService,DeleteQuestion,
} from '../services/QuestionBankConfig';

export default {
  namespace: 'QuestionBankConfig',

  state: {

  },

  effects: {
    // 获取题目列表
    * getQuestionList({payload, callback}, {call, put}) {
      const response = yield call(QuestionList, payload);
      yield put({
        type: 'returnLearningList',
        payload: response && response.error === null ? response.data : {},
      });
      // console.log('response',response)
      if (callback && response && !response.error && response.data) {
        callback(response.data);
      }
    },
    // 保存添加的题目
    * getSaveQuestion({payload, callback}, {call, put}) {
      const response = yield call(SaveQuestion, payload);
      yield put({
        type: 'returnSaveQuestion',
        payload: response && response.error === null ? response.data : {},
      });
      // console.log('response',response);
      if (callback && response && !response.error) {
        callback(response);
      }
    },
    // 删除题目
    * getDeleteQuestion({payload, callback}, {call, put}) {
      const response = yield call(DeleteQuestion, payload);
      yield put({
        type: 'returnDeleteQuestion',
        payload: response && response.error === null ? response.data : {},
      });
      // console.log('response',response);
      if (callback && response && !response.error) {
        callback(response);
      }
    },
    // * getLearningList({payload, callback}, {call, put}) {
    //   const response = yield call(LearningList, payload);
    //   yield put({
    //     type: 'returnLearningList',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   if (callback && response && !response.error && response.data) {
    //     callback(response.data);
    //   }
    // },
    // * getInsertList({payload, callback}, {call, put}) {
    //   const response = yield call(InsertList, payload);
    //   yield put({
    //     type: 'returnInsertList',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   if (callback && response ) {
    //     callback(response);
    //   }
    // },
    // * getDeleteList({payload, callback}, {call, put}) {
    //   const response = yield call(DeleteList, payload);
    //   // console.log('response',response)
    //   yield put({
    //     type: 'returnDeleteList',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   if (callback && response) {
    //     callback(response);
    //   }
    // },
    // * getFormatConvert({payload, callback}, {call, put}) {
    //   const response = yield call(FormatConvertService, payload);
    //   // console.log('response',response)
    //   yield put({
    //     type: 'returnFormatConvert',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   if (callback && response) {
    //     callback(response);
    //   }
    // },
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
