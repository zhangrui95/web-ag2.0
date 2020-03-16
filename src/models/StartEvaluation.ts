import {
  EvaluateLabelService,
} from '../services/StartEvaluation';

export default {
  namespace: 'StartEvaluation',

  state: {

  },

  effects: {
    // 获取测评类型及须知
    * getEvaluateLabel({payload, callback}, {call, put}) {
      const response = yield call(EvaluateLabelService, payload);
      yield put({
        type: 'returnEvaluateLabel',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && response.error === null && response.data) {
        callback(response.data);
      }
    },

    // // 获取题目列表
    // * getQuestionList({payload, callback}, {call, put}) {
    //   const response = yield call(QuestionList, payload);
    //   yield put({
    //     type: 'returnLearningList',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   // console.log('response',response)
    //   if (callback && response && !response.error && response.data) {
    //     callback(response.data);
    //   }
    // },
    // // 保存添加的题目
    // * getSaveQuestion({payload, callback}, {call, put}) {
    //   const response = yield call(SaveQuestion, payload);
    //   yield put({
    //     type: 'returnSaveQuestion',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   // console.log('response',response);
    //   if (callback && response && !response.error) {
    //     callback(response);
    //   }
    // },
    // // 删除题目
    // * getDeleteQuestion({payload, callback}, {call, put}) {
    //   const response = yield call(DeleteQuestion, payload);
    //   yield put({
    //     type: 'returnDeleteQuestion',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   // console.log('response',response);
    //   if (callback && response && !response.error) {
    //     callback(response);
    //   }
    // },
    // // 获取模板列表
    // * getTemplateList({payload, callback}, {call, put}) {
    //   const response = yield call(TemplateList, payload);
    //   yield put({
    //     type: 'returnTemplateList',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   // console.log('response',response)
    //   if (callback && response && !response.error && response.data) {
    //     callback(response.data);
    //   }
    // },
    // // 模板详情
    // * getTemplateDetail({payload, callback}, {call, put}) {
    //   const response = yield call(TemplateDetail, payload);
    //   yield put({
    //     type: 'returnTemplateDetaik',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   // console.log('response',response)
    //   if (callback && response && !response.error && response.data) {
    //     callback(response.data);
    //   }
    // },
    // // 保存添加的模板
    // * getSaveTemplate({payload, callback}, {call, put}) {
    //   const response = yield call(SaveTemplate, payload);
    //   yield put({
    //     type: 'returnSaveTemplate',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   console.log('response',response);
    //   if (callback && response){
    //     callback(response);
    //   }
    // },
    // // 删除模板
    // * getDeleteTemplate({payload, callback}, {call, put}) {
    //   const response = yield call(DeleteTemplate, payload);
    //   yield put({
    //     type: 'returnDeleteTemplate',
    //     payload: response && response.error === null ? response.data : {},
    //   });
    //   // console.log('response',response);
    //   if (callback && response && !response.error) {
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
