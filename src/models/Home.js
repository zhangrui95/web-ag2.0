/*
* 首页
* */
import {
    myNewsList,
    changeRead,
    dbList,
    getTodayLog,
    getFollow,
    getShare,
    getmyShare,
    getHistoryFollow,
    shareNum,
    followNum,
    getClearNums,
    getlistNum,
    getsjNum,
    getPoliceNum,
    getZhTjSlByDwOfSeconds,
} from '../services/home.js';

export default {
    namespace: 'Home',

    state: {},

    effects: {
        // 我的消息
        * getMyNews({ payload, callback }, { call, put }) {
            const response = yield call(myNewsList, payload);
            if (response) {
                callback(response.data);
            }
        },
        // 督办消息
        * getdbList({ payload, callback }, { call, put }) {
            const response = yield call(dbList, payload);
            if (response) {
                callback(response.data);
            }
        },
        // 已读未读
        * getChangeRead({ payload, callback }, { call, put }) {
            const response = yield call(changeRead, payload);
            if (response) {
                callback(response);
            }
        },
        // 日志
        * getToday({ payload, callback }, { call, put }) {
            const response = yield call(getTodayLog, payload);
            if (response) {
                callback(response);
            }
        },
        // 关注列表
        * getFollowList({ payload, callback }, { call, put }) {
            const response = yield call(getFollow, payload);
            if (response) {
                callback(response.data);
            }
        },
        // 关注历史列表
        * getHistoryFollowList({ payload, callback }, { call, put }) {
            const response = yield call(getHistoryFollow, payload);
            if (response) {
                callback(response.data);
            }
        },
        // 分享列表
        * getShareList({ payload, callback }, { call, put }) {
            const response = yield call(getShare, payload);
            if (response) {
                callback(response.data);
            }
        },
        // 我的分享列表
        * getmyShareList({ payload, callback }, { call, put }) {
            const response = yield call(getmyShare, payload);
            if (response) {
                callback(response.data);
            }
        },
        // 分享数量
        * getShareNum({ payload, callback }, { call, put }) {
            const response = yield call(shareNum, payload);
            if (response) {
                callback(response);
            }
        },
        // 关注数量
        * getFollowNum({ payload, callback }, { call, put }) {
            const response = yield call(followNum, payload);
            if (response) {
                callback(response);
            }
        },
        // 综合统计
        * zhtjNum({ payload, callback }, { call, put }) {
            const response = yield call(getlistNum, payload);
            if (response) {
                callback(response);
            }
        },
        // 疑似警情
        * ysjqNum({ payload, callback }, { call, put }) {
            const response = yield call(getPoliceNum, payload);
            if (response) {
                callback(response);
            }
        },
        // 首页数据统计版本2
        * getZhTjSlByDwOfSecond({ payload, callback }, { call, put }) {
            const response = yield call(getZhTjSlByDwOfSeconds, payload);
            if (response) {
                callback(response);
            }
        },
        // 数据总览数据
        * sjzlNum({ payload, callback }, { call, put }) {
            const response = yield call(getsjNum, payload);
            if (response) {
                callback(response);
            }
        },
        // 获取三清总数量
        * getNums({ payload, callback }, { call, put }) {
            const response = yield call(getClearNums, payload);
            if (response) {
                callback(response);
            }
        },
    },

    reducers: {},
};
