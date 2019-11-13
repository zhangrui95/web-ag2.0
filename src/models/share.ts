/*
 * 分享及关注、退补
 * */
import { getFollow, getPerson, getnoFollow, getTX, getRZ, getRetrieve } from '../services/share';
import { message } from 'antd';

export default {
  namespace: 'share',

  state: {},

  effects: {
    // 关注
    *getMyFollow({ payload, callback }, { call, put }) {
      const response = yield call(getFollow, payload);
      if (callback && response) {
        callback(response);
      } else {
        message.error('操作失败，请重新操作');
      }
    },
    // 取消关注
    *getNoFollow({ payload, callback }, { call, put }) {
      const response = yield call(getnoFollow, payload);
      if (response) {
        callback(response);
      }
    },
    // 分享人员
    *sharePerson({ payload, callback }, { call, put }) {
      const response = yield call(getPerson, payload);
      if (response) {
        callback(response.result);
      }
    },
    // 提醒人员
    *getTx({ payload, callback }, { call, put }) {
      const response = yield call(getTX, payload);
      if (callback && response) {
        callback(response);
      } else {
        message.error('提醒失败，请重新操作');
      }
    },
    // 日志
    *getRz({ payload, callback }, { call, put }) {
      const response = yield call(getRZ, payload);
      if (response) {
        callback(response.data);
      }
    },
    // 退补
    *getTb({ payload, callback }, { call, put }) {
      const response = yield call(getRetrieve, payload);
      if (callback && response) {
        callback(response);
      } else {
        message.error('操作失败，请重新操作');
      }
    },
  },

  reducers: {},
};
