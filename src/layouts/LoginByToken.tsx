/*
* LoginByToken 利用token登录案管系统
* author：lyp
* 20180704
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {routerRedux, Route} from 'dva/router';
import DocumentTitle from 'react-document-title';
import {message} from 'antd';
import styles from './UserLayout.less';
import {getQueryString} from '../utils/utils';
import cookie from 'react-cookies'

@connect(({login}) => ({
    login,
}))

export default class LoginByToken extends PureComponent {
    state = {
        word: '跳转中，请稍等……'
    }

    componentDidMount() {
        const token = getQueryString(this.props.location.search, 'token');
        const type = getQueryString(this.props.location.search, 'type');
        const wtid = getQueryString(this.props.location.search, 'wtid') || '';
        const old_id = getQueryString(this.props.location.search, 'old_id') || '';
        const system_id = getQueryString(this.props.location.search, 'system_id');
        const backUrl = getQueryString(this.props.location.search, 'backUrl');
        const dark = getQueryString(this.props.location.search, 'dark') ? getQueryString(this.props.location.search, 'dark') : false;
        cookie.save('dark', dark, {maxAge: 31536000});
        if(backUrl){
            window.configUrl.loginHttp = backUrl;
        }
        // console.log('LoginByToken token', token);
        // console.log('LoginByToken type', type);
        if (token !== null) {
            sessionStorage.setItem('userToken', token);
            this.props.dispatch({
                type: 'login/tokenLogin',
                payload: {
                    token,
                    sid: window.configUrl.sid,
                },
                callback: (res) => {
                    // console.log('res---------------------', res);
                    if (res.error === null) {
                        this.props.dispatch(routerRedux.push('/ShowData/RegulatePanel'));
                    } else {
                        this.setState({
                            word: '暂无访问权限'
                        });
                    }
                },
            });
        } else {
            this.setState({
                word: '暂无访问权限'
            });
        }
    }

    getUrl(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    render() {
        return (
            <DocumentTitle title="">
                <div className={styles.containers}>
                    <div className={styles.top}>
                        {this.state.word}
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
