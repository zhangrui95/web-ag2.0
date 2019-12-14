import { AllDetailPersonDatas } from '../services/AllDetail';

export default {
    namespace: 'AllDetail',

    state: {
        AllDetailPersonData: [],
        loading: true,
    },

    effects: {
        * AllDetailPersonFetch({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(AllDetailPersonDatas, payload);
            yield put({
                type: 'AllDetailPersonSearch',
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
    },


    reducers: {
        AllDetailPersonSearch(state, action) {
            return {
                ...state,
                AllDetailPersonData: action.payload,
            };
        },

        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
    },
};
