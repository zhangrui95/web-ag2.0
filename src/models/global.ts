import {Reducer} from 'redux';
import {Subscription, Effect} from 'dva';

import {NoticeIconData} from '@/components/NoticeIcon';
import {queryNotices} from '@/services/user';
import {ConnectState} from './connect.d';
import {NavigationItem, welcomeItem} from '@/components/Navigation/navigation.ts';

export interface NoticeItem extends NoticeIconData {
    id: string;
    type: string;
    status: string;
}

export interface GlobalModelState {
    collapsed?: boolean;
    notices?: NoticeItem[];
    navigation: NavigationItem[];
    navigationSession: NavigationItem[];
}

export interface GlobalModelType {
    namespace: 'global';
    state: GlobalModelState;
    effects: {
        fetchNotices: Effect;
        clearNotices: Effect;
        changeNoticeReadState: Effect;
        changeNavigation: Effect;
    };
    reducers: {
        changeLayoutCollapsed: Reducer<GlobalModelState>;
        saveNotices: Reducer<GlobalModelState>;
        saveClearedNotices: Reducer<GlobalModelState>;
        saveNavigation: Reducer<GlobalModelState>;
    };
    subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
    namespace: 'global',
    state: {
        collapsed: false,
        notices: [],
        navigation: sessionStorage.getItem('navigationNews') ? JSON.parse(sessionStorage.getItem('navigationNews')) : [welcomeItem],
        navigationSession: sessionStorage.getItem('navigationNews') ? JSON.parse(sessionStorage.getItem('navigationNews')) : [welcomeItem],
    },
    effects: {
        * fetchNotices(_, {call, put, select}) {
            const data = yield call(queryNotices);
            yield put({
                type: 'saveNotices',
                payload: data,
            });
            const unreadCount: number = yield select(
                (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: data.length,
                    unreadCount,
                },
            });
        },
        * clearNotices({payload}, {put, select}) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            });
            const count: number = yield select((state: ConnectState) => state.global.notices.length);
            const unreadCount: number = yield select(
                (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount,
                },
            });
        },
        * changeNoticeReadState({payload}, {put, select}) {
            const notices: NoticeItem[] = yield select((state: ConnectState) =>
                state.global.notices.map(item => {
                    const notice = {...item};
                    if (notice.id === payload) {
                        notice.read = true;
                    }
                    return notice;
                }),
            );

            yield put({
                type: 'saveNotices',
                payload: notices,
            });

            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter(item => !item.read).length,
                },
            });
        },
        * changeNavigation({payload, callback}, {put, select}) {
            let navigation: NavigationItem[] = yield select((state: ConnectState) => state.global.navigation);
            let navigationNew = [...navigation];
            //如果key存在为对tab的增加和删除操作，否则为清楚全部tab
            if (payload.key) {
                const index = navigationNew.findIndex(item => {
                    return item.key === payload.key
                });
                if (payload.isShow) {
                    //获取state中存储的数据
                    if (index === -1) {
                        navigationNew.push(payload)
                    }
                } else {
                    if (index > -1) {
                        navigationNew.splice(index, 1);
                    }
                }
            } else {
                navigationNew = [navigationNew[0]];
            }
            yield put({
                type: 'saveNavigation',
                payload: navigationNew,
            });
            if (callback) {
                callback(navigationNew);
            }
        },
        * changeSessonNavigation({payload, callback}, {put, select}) {
            let navigationSession: NavigationItem[] = yield select((state: ConnectState) => state.global.navigationSession);
            let navigationNews = [...navigationSession];
            navigationNews.map((item) => {
                item.children = '';
            })
            //如果key存在为对tab的增加和删除操作，否则为清楚全部tab
            if (payload.key) {
                const index = navigationNews.findIndex(item => {
                    return item.key === payload.key
                });
                if (payload.isShow) {
                    //获取state中存储的数据
                    if (index === -1) {
                        navigationNews.push(payload)
                    }
                } else {
                    if (index > -1) {
                        navigationNews.splice(index, 1);
                    }
                }
            } else {
                navigationNews = [welcomeItem];
            }
            yield put({
                type: 'saveSessonNavigation',
                payload: navigationNews,
            });
            sessionStorage.setItem('navigationNews', JSON.stringify(navigationNews));
        },
    },

    reducers: {
        changeLayoutCollapsed(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
            return {
                ...state,
                collapsed: payload,
            };
        },
        saveNotices(state, {payload}): GlobalModelState {
            return {
                collapsed: false,
                // ...state,
                notices: payload,
            };
        },
        saveClearedNotices(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
            return {
                collapsed: false,
                ...state,
                notices: state.notices.filter((item): boolean => item.type !== payload),
            };
        },

        saveNavigation(state, {payload}): GlobalModelState {
            return {
                ...state,
                // collapsed: false,
                navigation: payload,
            };
        },

        saveSessonNavigation(state, {payload}): GlobalModelState {
            return {
                ...state,
                // collapsed: false,
                navigationSession: payload,
            };
        },
    },

    subscriptions: {
        setup({history}): void {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            history.listen(({pathname, search}): void => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};

export default GlobalModel;
