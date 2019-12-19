/*
* 人员档案models
* author: lyp
* date: 20181225
* */

import * as personDocDataService from '../services/personDocData';

export default {
    namespace: 'personDocData',

    state: {
        personData: [],
    },

    effects: {
        // 综述
        * getPersonData({ payload, callback }, { call, put }) {
            const response = yield call(personDocDataService.getPersonData, payload);
            yield put({
                type: 'setPersonData',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) {
                callback(response.data);
            }
        },

    },
    reducers: {
        setPersonData(state, action) {
            return {
                ...state,
                personData: action.payload,
            };
        },
    },
};