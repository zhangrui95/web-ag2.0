import {
    MySuperviseDatas,
    changeReadStatus,
    getAllTypeWarningCount,
    MySuperviseDatasCount,
    saveFeedback,
    goLink,
} from '../services/MySuperviseData';

export default {
    namespace: 'MySuperviseData',

    state: {
        returnData: [],
        loading: true,
        superviseCount: 0,
        allTypeWarningCount: [],
        childLink: [],
    },

    effects: {
        * MySuperviseFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(MySuperviseDatas, payload);
            yield put({
                type: 'MySuperviseSearch',
                payload: response && response.error === null ? response.data : {},
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        * MySuperviseCount({ payload, callback }, { call, put }) {
            // yield put({
            //   type: 'changeLoading',
            //   payload: true,
            // });
            const response = yield call(MySuperviseDatasCount, payload);
            yield put({
                type: 'setMySuperviseCount',
                payload: response && response.data ? response.data.list.length : 0,
            });
            // yield put({
            //   type: 'changeLoading',
            //   payload: false,
            // });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        * changeReadStatus({ payload, callback }, { call, put }) {
            const response = yield call(changeReadStatus, payload);
            if (callback && !response.error) {
                callback(response.data);
            }
        },
        // 告警情况
        * getAllTypeWarningCount({ payload, callback }, { call, put }) {
            const response = yield call(getAllTypeWarningCount, payload);
            yield put({
                type: 'setAllTypeWarningCount',
                payload: response && response.data ? response.data : [],
            });
            if (callback && response && !response.error) {
                callback(response.data);
            }
        },
        // 反馈
        * saveFeedback({ payload, callback }, { call, put }) {
            const response = yield call(saveFeedback, payload);
            if (callback && response) {
                callback(response.data);
            }
        },
        //获取跳转子系统
        * goLinkList({ payload, callback }, { call, put }) {
            const response = yield call(goLink, payload);
            yield put({
                type: 'getChildLink',
                payload: response && response.error === null ? response.data.list : [],
            });
        },
        //修改跳转子系统
        * updateLink({ payload, callback }, { call, put }) {
            yield put({
                type: 'getChildLink',
                payload: payload,
            });
        },
    },

    reducers: {
        MySuperviseSearch(state, action) {
            //console.log('action.payload',action.payload);
            return {
                ...state,
                returnData: action.payload,
            };
        },
        setMySuperviseCount(state, action) {
            //console.log('action.payload',action.payload);
            return {
                ...state,
                superviseCount: action.payload,
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        setAllTypeWarningCount(state, action) {
            return {
                ...state,
                allTypeWarningCount: action.payload,
            };
        },
        getChildLink(state, action) {
            return {
                ...state,
                childLink: action.payload,
            };
        },
    },

};
