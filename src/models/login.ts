import {Reducer} from 'redux';
import {routerRedux} from 'dva/router';
import {Effect} from 'dva';
import {stringify} from 'querystring';
import {fakeAccountLogin, getFakeCaptcha, tokenLogin, httpPermission} from '@/services/login';
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
        setTopList:Effect;
    };
    reducers: {
        changeLoginStatus: Reducer<StateType>;
    };
}

const Model: LoginModelType = {
    namespace: 'login',

    state: {
        status: undefined,
        topList:[]
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
        * httpPermission({payload, callback}, {call, put}) {
            const response = yield call(httpPermission, payload);
            yield put({
                type: 'setTopList',
                payload: response && !response.error && response.data ? response.data : [],
            });
        },
        * tokenLogin({payload, callback}, {call, put}) {
            const response = yield call(tokenLogin, payload);
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
                if(window.configUrl.loginHttp){
                    window.location.href = `${window.configUrl.loginHttp}/#/user/login`;
                }else{
                    yield put(
                        routerRedux.replace({
                            pathname: '/user/login',
                            search: stringify({
                                redirect: window.location.href,
                            }),
                        }),
                    );
                }
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
        setTopList(state, action) {
            return {
                ...state,
                topList: action.payload,
            };
        },
    },
};

export default Model;
