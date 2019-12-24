import {getLists} from '../services/EarlyWarning';

export default {
    namespace: 'EarlyWarning',

    state: {
        data: {
            list: [],
            page: {},
        },
    },

    effects: {
        * getList({payload, callback}, {call, put}) {
            const response = yield call(getLists, payload);
            yield put({
                type: 'setList',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && response && response.error === null && response.data) {
                callback(response.data);
            }
        },
    },

    reducers: {
        setList(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
