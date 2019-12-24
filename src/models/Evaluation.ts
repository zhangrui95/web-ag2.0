import {
    AssessmentPgListPage,
    AssessmentById,
    getKfXmTjPgListPages,
    getRyKhPmTjPgListPages,
    getJgKfQkTjPgListPages,
    getKpBzByAjbhAndKfxPgListPages,
    getDictPgListPages,
    getLists,
    getSave,
    getSaveKp,
    getDel,
    getDetail,
    getJgKhOfAjslPgListPages,
    getRyKhOfAjslPgListPages,
    getJgKhOGjPgListPages,
    getRyKhOGjPgListPages
} from '../services/Evaluation';
import {message} from 'antd'

export default {
    namespace: 'Evaluation',

    state: {
        AssessmentPgList: [],
        AssessmentById: null,
    },

    effects: {
        * getAssessmentPgListPage({payload, callback}, {call, put}) {
            const response = yield call(AssessmentPgListPage, payload);
            yield put({
                type: 'setAssessmentPgList',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getAssessmentByAjbhAndKfx({payload, callback}, {call, put}) {
            const response = yield call(AssessmentById, payload);
            yield put({
                type: 'setAssessmentById',
                payload: response && response.error === null ? response.data : {},
            });
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getJgKfQkTjPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getJgKfQkTjPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getJgKhOfAjslPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getJgKhOfAjslPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getJgKhOGjPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getJgKhOGjPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getKfXmTjPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getKfXmTjPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getRyKhOfAjslPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getRyKhOfAjslPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getRyKhPmTjPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getRyKhPmTjPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getKpBzByAjbhAndKfxPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getKpBzByAjbhAndKfxPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getRyKhOGjPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getRyKhOGjPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getDictPgListPage({payload, callback}, {call, put}) {
            const response = yield call(getDictPgListPages, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * getList({payload, callback}, {call, put}) {
            const response = yield call(getLists, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
            ;
        },
        * addList({payload, callback}, {call, put}) {
            const response = yield call(getSave, payload);
            if (callback && response && !response.error) {
                callback(response.data);
            }
            ;
        },
        * delList({payload, callback}, {call, put}) {
            const response = yield call(getDel, payload);
            if (callback && response && !response.error) {
                callback(response.data);
            }
            ;
        },
        * getAjkpXqByAjbh({payload, callback}, {call, put}) {
            const response = yield call(getDetail, payload);
            if (callback && response && !response.error) {
                callback(response.data);
            }
            ;
        },
        * saveAjkpXx({payload, callback}, {call, put}) {
            const response = yield call(getSaveKp, payload);
            if (callback && response && !response.error) {
                callback(response.data);
            }
            ;
        },
    },
    reducers: {
        setAssessmentPgList(state, action) {
            return {
                ...state,
                AssessmentPgList: action.payload,
            };
        },
        setAssessmentById(state, action) {
            return {
                ...state,
                AssessmentById: action.payload,
            };
        },
    },
};
