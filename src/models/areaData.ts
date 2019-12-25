import {
    areaDatas,
    areaDetail,
    problemAid,
    AllVideo,
    PartVideo,
    areaRYCFDatas,
    getAreaRYXb,
    areaSpecialRYCFDatas,
    areaNLHFDatas,
    areaSALXDatas,
    areaRQYYDatas,
    areaRQRCQSDatas,
    areaSARYRQRCDatas,
} from '../services/areaData';

export default {
    namespace: 'areaData',

    state: {
        area: [],
        areaDetails: [],
        loading: true,
        ProblemAids: [],
        returnAllVideo: [],
        returnPartVideo: [],
        returnRYCFarea: '',
        returnSpecialRYCFarea: '',
        returnNLHFarea: '',
        returnSALXarea: '',
        returnRQYYarea: '',
        returnRQRCQSarea: '',
        returnSARYRQRCarea: '',
        handleAreaSfgz:null,
    },

    effects: {
        * areaFetch({payload}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(areaDatas, payload);
            yield put({
                type: 'areaSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        },
        * areaDetailFetch({payload, callback}, {call, put}) {
            const response = yield call(areaDetail, payload);
            yield put({
                type: 'areaDetail',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
              type: 'areaSfgz',
              payload: response && response.error === null ? response.data.sfgz : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 问题判定的督办
        * problemAidFetch({payload, callback}, {call, put}) {
            const response = yield call(problemAid, payload);
            yield put({
                type: 'ReturnProblemAid',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 播放完整的轨迹视频
        * areaAllVideo({payload, callback}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(AllVideo, payload);
            yield put({
                type: 'AllVideoSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 播放部分的轨迹视频
        * areaPartVideo({payload, callback}, {call, put}) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(PartVideo, payload);
            yield put({
                type: 'PartVideoSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 人员成分图表统计
        * areaRYCFFetch({payload, callback}, {call, put}) {
            const response = yield call(areaRYCFDatas, payload);
            yield put({
                type: 'areaRYCFSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 人员性别图表统计
        * areaRYXb({payload, callback}, {call, put}) {
            const response = yield call(getAreaRYXb, payload);
            yield put({
                type: 'setAreaRYXb',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 人员成分特殊人员图表统计
        * areaSpecialRYCFFetch({payload, callback}, {call, put}) {
            const response = yield call(areaSpecialRYCFDatas, payload);
            yield put({
                type: 'areaSpecialRYCFSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 年龄划分图表统计
        * areaNLHFFetch({payload, callback}, {call, put}) {
            const response = yield call(areaNLHFDatas, payload);
            yield put({
                type: 'areaNLHFSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 涉案人员入区人次展示图表统计
        * areaSARYRQRCFetch({payload, callback}, {call, put}) {
            const response = yield call(areaSARYRQRCDatas, payload);
            yield put({
                type: 'areaSARYRQRCSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 人员类型图表统计
        * areaSALXFetch({payload, callback}, {call, put}) {
            const response = yield call(areaSALXDatas, payload);
            yield put({
                type: 'areaSALXSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 入区原因图表统计
        * areaRQYYFetch({payload, callback}, {call, put}) {
            const response = yield call(areaRQYYDatas, payload);
            yield put({
                type: 'areaRQYYSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        // 入区人次趋势图表统计
        * areaRQRCQSFetch({payload, callback}, {call, put}) {
            const response = yield call(areaRQRCQSDatas, payload);
            yield put({
                type: 'areaRQRCQSSearch',
                // payload: response,
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        areaSearch(state, action) {
            // console.log('action.payload',action.payload);
            return {
                ...state,
                area: action.payload,
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        areaDetail(state, action) {
            return {
                ...state,
                areaDetails: action.payload,
            };
        },
        ReturnProblemAid(state, action) {
            return {
                ...state,
                ProblemAids: action.payload,
            };
        },
        AllVideoSearch(state, action) {
            return {
                ...state,
                returnAllVideo: action.payload,
            };
        },
        PartVideoSearch(state, action) {
            return {
                ...state,
                returnPartVideo: action.payload,
            };
        },

        areaRYCFSearch(state, action) {
            return {
                ...state,
                returnRYCFarea: action.payload,
            };
        },
        areaSpecialRYCFSearch(state, action) {
            return {
                ...state,
                returnRYCFarea: action.payload,
            };
        },
        areaNLHFSearch(state, action) {
            return {
                ...state,
                returnNLHFarea: action.payload,
            };
        },
        areaSARYRQRCSearch(state, action) {
            return {
                ...state,
                returnSARYRQRCarea: action.payload,
            };
        },
        areaSALXSearch(state, action) {
            return {
                ...state,
                returnSALXarea: action.payload,
            };
        },
        areaRQYYSearch(state, action) {
            return {
                ...state,
                returnRQYYarea: action.payload,
            };
        },
        areaRQRCQSSearch(state, action) {
            return {
                ...state,
                returnRQRCQSarea: action.payload,
            };
        },
        areaSfgz(state, action) {
          return {
            ...state,
            handleAreaSfgz: action.payload,
          };
        },
    },
};
