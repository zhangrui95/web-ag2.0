/*
* 大屏展示model
* author: lyp
* date: 20180607
* */
import * as showService from '../services/show';

export default {
    namespace: 'show',

    state: {
        policeSituation: [],
        policeCase: [],
        timeWarning: [],
        involvedItems: [],
        caseHandArea: [],
        newWarningList: [],
        baqZqTj: [],
        warehouseData: [],
        warehouseInfos: [],
        mapData: [],
        caseCountByArea: [],
        videoList: [],
    },

    effects: {
        // 获取警情数据
        * getPoliceSituationData({payload, callback}, {call, put}) {
            const response = yield call(showService.getPoliceSituationData, payload);
            yield put({
                type: 'setPoliceSituationData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取案件数据
        * getPoliceCaseData({payload, callback}, {call, put}) {
            const response = yield call(showService.getPoliceCaseData, payload);
            yield put({
                type: 'setPoliceCaseData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取時限告警数据
        * getTimeWarningData({payload, callback}, {call, put}) {
            const response = yield call(showService.getTimeWarningData, payload);
            yield put({
                type: 'setTimeWarningData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取涉案财物数据
        * getInvolvedItems({payload, callback}, {call, put}) {
            const response = yield call(showService.getInvolvedItems, payload);
            yield put({
                type: 'setInvolvedItems',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取办案区数据
        * getCaseHandArea({payload, callback}, {call, put}) {
            let response;
            if (window.configUrl.isShowBaqsstj) {
                response = yield call(showService.getCaseHandArea, payload);
            } else {
                response = yield call(showService.getAjslByState, payload);
            }
            yield put({
                type: 'setCaseHandArea',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取办案区最新告警信息数据
        * getBaqZxGjPgListPage({payload, callback}, {call, put}) {
            let response;
            if (window.configUrl.isShowBaqsstj) {
                response = yield call(showService.getBaqZxGjPgListPage, payload);
            } else {
                response = yield call(showService.getNewAjxx, payload);
            }
            yield put({
                type: 'setBaqZxGjPgListPage',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取办案区在区信息数据
        * getBaqZqTj({payload, callback}, {call, put}) {
            const response = yield call(showService.getBaqZqTj, payload);
            yield put({
                type: 'setBaqZqTj',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取涉案财物仓库数据统计
        * getSacwCkTj({payload, callback}, {call, put}) {
            const response = yield call(showService.getSacwCkTj, payload);
            yield put({
                type: 'setSacwCkTj',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        * getSacwSsTj({payload, callback}, {call, put}) {
            const response = yield call(showService.getSacwSsTj, payload);
            yield put({
                type: 'setSacwSsTj',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取地图数据
        * getMapData({payload, callback}, {call, put}) {
            const response = yield call(showService.getMapData, payload);
            yield put({
                type: 'setMapData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取案件数量
        * getCaseCountByArea({payload, callback}, {call, put}) {
            const response = yield call(showService.getCaseCountByArea, payload);
            yield put({
                type: 'setCaseCountByArea',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 获取办案区视频数据
        * getVideoList({payload, callback}, {call, put}) {
            const response = yield call(showService.getVideoList, payload);
            yield put({
                type: 'setVideoList',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 播放轨迹视频
        * videoPlay({payload, callback}, {call, put}) {
            const response = yield call(showService.videoPlay, payload);
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 我的消息
        * getMyNews({payload, callback}, {call, put}) {
            const response = yield call(myNewsList, payload);
            if (response) {
                callback(response);
            }
        },
        // 警情转化案件数量
        * getPoliceSituationToCaseCount({payload, callback}, {call, put}) {
            const response = yield call(showService.getPoliceSituationToCaseCount, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 获取卷宗数量
        * getDossierCount({payload, callback}, {call, put}) {
            const response = yield call(showService.getDossierCount, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 行政案件数量
        * getAdministrativeCaseCount({payload, callback}, {call, put}) {
            const response = yield call(showService.getAdministrativeCaseCount, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 大屏配置项查询
        * getScreenConfig({payload, callback}, {call, put}) {
            const response = yield call(showService.getScreenConfig, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 案件、告警总数
        * getCaseAndWarningCount({payload, callback}, {call, put}) {
            const response = yield call(showService.getCaseAndWarningCount, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 结案率、破案率
        * getCloseAndDetectionRate({payload, callback}, {call, put}) {
            const response = yield call(showService.getCloseAndDetectionRate, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        * getCriminalCaseCount({payload, callback}, {call, put}) {
            const response = yield call(showService.getCriminalCaseCount, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 直属机构案件数
        * getDirectlyDepCase({payload, callback}, {call, put}) {
            const response = yield call(showService.getDirectlyDepCase, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 卷宗数据
        * getDossierData({payload, callback}, {call, put}) {
            const response = yield call(showService.getDossierData, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 专项类别案件占比
        * getSpecialCase({payload, callback}, {call, put}) {
            const response = yield call(showService.getSpecialCase, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 整体破案率
        * getWholeDetectionRate({payload, callback}, {call, put}) {
            const response = yield call(showService.getWholeDetectionRate, payload);
            if (response && !response.error && call) {
                callback(response.data);
            }
        },
        // 涉案财物数据
        * getCaseItemInfo({payload, callback}, {call, put}) {
            const response = yield call(showService.getCaseItemInfo, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 卷宗异常数据
        * getDossierWarning({payload, callback}, {call, put}) {
            const response = yield call(showService.getDossierWarning, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 在办案件
        * getHandingCaseCount({payload, callback}, {call, put}) {
            const response = yield call(showService.getHandingCaseCount, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 办案区使用情况
        * getHandingCaseAreaUseInfo({payload, callback}, {call, put}) {
            const response = yield call(showService.getHandingCaseAreaUseInfo, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
        // 个人使用情况
        * getSystemUseInfo({payload, callback}, {call, put}) {
            const response = yield call(showService.getSystemUseInfo, payload);
            if (response && !response.error && call && response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        setPoliceSituationData(state, action) {
            return {
                ...state,
                policeSituation: action.payload,
            };
        },
        setPoliceCaseData(state, action) {
            return {
                ...state,
                policeCase: action.payload,
            };
        },
        setTimeWarningData(state, action) {
            return {
                ...state,
                timeWarning: action.payload,
            };
        },
        setInvolvedItems(state, action) {
            return {
                ...state,
                involvedItems: action.payload,
            };
        },
        setCaseHandArea(state, action) {
            return {
                ...state,
                caseHandArea: action.payload,
            };
        },
        setBaqZxGjPgListPage(state, action) {
            return {
                ...state,
                newWarningList: action.payload,
            };
        },
        setBaqZqTj(state, action) {
            return {
                ...state,
                baqZqTj: action.payload,
            };
        },
        setSacwCkTj(state, action) {
            return {
                ...state,
                warehouseData: action.payload,
            };
        },
        setSacwSsTj(state, action) {
            return {
                ...state,
                warehouseInfos: action.payload,
            };
        },
        setMapData(state, action) {
            return {
                ...state,
                mapData: action.payload,
            };
        },
        setCaseCountByArea(state, action) {
            return {
                ...state,
                caseCountByArea: action.payload,
            };
        },
        setVideoList(state, action) {
            return {
                ...state,
                videoList: action.payload,
            };
        },
    },
};
