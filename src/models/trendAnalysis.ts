/*
* 趋势分析models
* author: lyp
* date: 20181214
* */

import * as trendAnalysisService from '../services/trendAnalysis';

export default {
    namespace: 'trendAnalysis',

    state: {},

    effects: {
        // 警情综述
        * getOverviewData({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getOverviewData, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 侵财类警情
        * getAgainstProperty({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getAgainstProperty, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 两抢案件、诈骗案件
        * getRobGrabFraud({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getRobGrabFraud, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 盗窃类警情
        * getStealData({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getStealData, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 刑事案件--综述
        * getCriminalCaseOverviewData({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getCriminalCaseOverviewData, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 刑事案件--类型分析
        * getCriminalCaseType({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getCriminalCaseType, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 刑事案件--警情、受理、立案
        * getCriminalCaseAndPolice({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getCriminalCaseAndPolice, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 人员---综述
        * getPersonOverview({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getPersonOverview, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 人员--违法行为人处罚
        * getPunishTypeData({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getPunishTypeData, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
        // 人员--犯罪嫌疑人处罚
        * getSuspectPunishTypeData({payload, callback}, {call, put}) {
            const response = yield call(trendAnalysisService.getSuspectPunishTypeData, payload);
            if (callback && !response.error && response.data) {
                callback(response.data);
            } else {
                callback();
            }
        },
    },
    reducers: {},
};
