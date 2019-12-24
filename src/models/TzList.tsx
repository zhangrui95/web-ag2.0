/*
* 台账列表
* */
import {
    getRycz,
    getAjJb,
    getXsAj,
    getXzAj,
    getMrJq,
    getSLA,
    getXsAjDjbPgListPage,
    getXzAjDjbPgListPage,
    getXdrytj,
    getSncf,
} from '../services/TzList';

export default {
    namespace: 'TzList',

    state: {},

    effects: {
        //人员处置台账
        * getRyCzTz({payload, callback}, {call, put}) {
            const response = yield call(getRycz, payload);
            if (response) {
                callback(response);
            }
        },
        // 吸毒人员统计
        * getXDRYTJ({payload, callback}, {call, put}) {
            const response = yield call(getXdrytj, payload);
            if (response) {
                callback(response);
            }
        },
        // 所内处罚统计
        * getSNCF({payload, callback}, {call, put}) {
            const response = yield call(getSncf, payload);
            if (response) {
                callback(response);
            }
        },
        //
        * getAjCsDjb({payload, callback}, {call, put}) {
            const response = yield call(getAjJb, payload);
            if (response) {
                callback(response);
            }
        },
        //
        * getXsAjTz({payload, callback}, {call, put}) {
            const response = yield call(getXsAj, payload);
            if (response) {
                callback(response);
            }
        },
        //
        * getXzAjTz({payload, callback}, {call, put}) {
            const response = yield call(getXzAj, payload);
            if (response) {
                callback(response);
            }
        },
        //
        * geMrJqTz({payload, callback}, {call, put}) {
            const response = yield call(getMrJq, payload);
            if (response) {
                callback(response);
            }
        },
        //
        * getSLAQK({payload, callback}, {call, put}) {
            const response = yield call(getSLA, payload);
            if (response) {
                callback(response);
            }
        },
        //刑事案件登记表
        * getXsAjDjb({payload, callback}, {call, put}) {
            const response = yield call(getXsAjDjbPgListPage, payload);
            if (response) {
                callback(response);
            }
        },
        //行政案件登记表
        * getXzAjDjb({payload, callback}, {call, put}) {
            const response = yield call(getXzAjDjbPgListPage, payload);
            if (response) {
                callback(response);
            }
        },
    },

    reducers: {},
};
