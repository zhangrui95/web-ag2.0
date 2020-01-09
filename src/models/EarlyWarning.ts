import {getLists} from '../services/EarlyWarning';

export default {
    namespace: 'EarlyWarning',

    state: {
        jqyjdata: {
            list: [],
            page: {},
        },
        xsajyjdata: {
          list: [],
          page: {},
        },
        xzajyjdata: {
          list: [],
          page: {},
        },
        baqyjdata: {
          list: [],
          page: {},
        },
        wpyjdata: {
          list: [],
          page: {},
        },
        jzyjdata: {
          list: [],
          page: {},
        },
    },

    effects: {
        * getList({payload, callback}, {call, put}) {
            const response = yield call(getLists, payload);
          if (payload&&payload.pd&&payload.pd.yj_type === 'jq') {
            // 警情预警数据
            yield put({
              type: 'returnjqyjList',
              payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
              callback(response.data);
            }
          }
          if (payload&&payload.pd&&payload.pd.yj_type === 'xsaj') {
            // 刑事案件预警数据
            yield put({
              type: 'returnxsajyjList',
              payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
              callback(response.data);
            }
          }
          if (payload&&payload.pd&&payload.pd.yj_type === 'xzaj') {
            // 行政案件预警数据
            yield put({
              type: 'returnxzajyjList',
              payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
              callback(response.data);
            }
          }
          if (payload&&payload.pd&&payload.pd.yj_type === 'baq') {
            // 办案区预警数据
            yield put({
              type: 'returnbaqyjList',
              payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
              callback(response.data);
            }
          }
          if (payload&&payload.pd&&payload.pd.yj_type === 'sawp') {
            // 物品预警数据
            yield put({
              type: 'returnwpyjList',
              payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
              callback(response.data);
            }
          }
          if (payload&&payload.pd&&payload.pd.yj_type === 'jz') {
            // 卷宗预警数据
            yield put({
              type: 'returnjzyjList',
              payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
              callback(response.data);
            }
          }


            // yield put({
            //     type: 'setList',
            //     payload: response && response.error === null ? response.data : [],
            // });
            // if (callback && response && response.error === null && response.data) {
            //     callback(response.data);
            // }
        },
    },

    reducers: {
      returnjqyjList(state, action) {
        return {
          ...state,
          jqyjdata: action.payload,
        };
      },
      returnxsajyjList(state, action) {
        return {
          ...state,
          xsajyjdata: action.payload,
        };
      },
      returnxzajyjList(state, action) {
        return {
          ...state,
          xzajyjdata: action.payload,
        };
      },
      returnbaqyjList(state, action) {
        return {
          ...state,
          baqyjdata: action.payload,
        };
      },
      returnwpyjList(state, action) {
        return {
          ...state,
          wpyjdata: action.payload,
        };
      },
      returnjzyjList(state, action) {
        return {
          ...state,
          jzyjdata: action.payload,
        };
      },

    },
};
