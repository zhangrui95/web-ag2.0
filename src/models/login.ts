import {Reducer} from 'redux';
import {routerRedux} from 'dva/router';
import {Effect} from 'dva';
import {stringify} from 'querystring';
import {fakeAccountLogin, getFakeCaptcha, tokenLogin} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';
import {reloadAuthorized} from '@/utils/Authorized';

export interface StateType {
    status?: 'ok' | 'error';
    type?: string;
    currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
    namespace: string;
    state: StateType;
    effects: {
        login: Effect;
        getCaptcha: Effect;
        logout: Effect;
    };
    reducers: {
        changeLoginStatus: Reducer<StateType>;
    };
}

const Model: LoginModelType = {
    namespace: 'login',

    state: {
        status: undefined,
    },

    effects: {
        * login({payload, callback}, {call, put}) {
            const response = yield call(fakeAccountLogin, payload);
            if (response && response.data && response.data.token) {
                const authoMenuList = response.data.menu;
                sessionStorage.setItem('userToken', response.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                sessionStorage.setItem('authoMenuList', JSON.stringify(authoMenuList));
                reloadAuthorized();
                yield put(routerRedux.replace('/ShowData/RegulatePanel'));
            } else {
                return false;
            }
        },
        * tokenLogin({payload, callback}, {call, put}) {
            const response = yield call(tokenLogin, payload);
            yield put({
                type: 'setTokenLogin',
                payload: response && response.error === null ? response.data : [],
            });
            if (response && response.data && response.data.token) {
                sessionStorage.setItem('userToken', response.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                sessionStorage.setItem('authoMenuList', JSON.stringify(response.data.menu));
                reloadAuthorized();
                if (callback) {
                    callback(response);
                }
            }
        },
        * getCaptcha({payload}, {call}) {
            yield call(getFakeCaptcha, payload);
        },
        * logout(_, {put}) {
            sessionStorage.clear();
            const {redirect} = getPageQuery();
            // redirect
            if (window.location.pathname !== '/user/login' && !redirect) {
                yield put(
                    routerRedux.replace({
                        pathname: '/user/login',
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    }),
                );
            }
        },
    },

    reducers: {
        changeLoginStatus(state, {payload}) {
            setAuthority(payload.currentAuthority);
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            };
        },
    },
};

export default Model;
