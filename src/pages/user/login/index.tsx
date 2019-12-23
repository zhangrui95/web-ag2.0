import {Alert, Checkbox, Icon} from 'antd';
import React, {Component} from 'react';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {Dispatch, AnyAction} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import Link from 'umi/link';
import {connect} from 'dva';
import {StateType} from '@/models/login';
import LoginComponents from './components/Login';
import styles from './style.less';
import {LoginParamsType} from '@/services/login';
import {ConnectState} from '@/models/connect';
import MD5 from 'md5-es';


const {Tab, UserName, Password, Mobile, Captcha, Submit} = LoginComponents;

interface LoginProps {
    dispatch: Dispatch<AnyAction>;
    userLogin: StateType;
    submitting: boolean;
}

interface LoginState {
    type: string;
    autoLogin: boolean;
}

@connect(({login, loading}: ConnectState) => ({
    userLogin: login,
    submitting: loading.effects['login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
    loginForm: FormComponentProps['form'] | undefined | null = undefined;

    state: LoginState = {
        type: 'account',
        autoLogin: true,
    };

    changeAutoLogin = (e: CheckboxChangeEvent) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    handleSubmit = (err: unknown, values: LoginParamsType) => {
        const {type} = this.state;
        // console.log('values', values);

        if (!err) {
            const {dispatch} = this.props;
            const param = {
                username: values.userName,
                password: MD5.hash(values.password),
                sid: window.configUrl.sid,
            };
            dispatch({
                type: 'login/login',
                payload: {...param},
            });
        }
    };

    onTabChange = (type: string) => {
        this.setState({
            type,
        });
    };

    onGetCaptcha = () =>
        new Promise<boolean>((resolve, reject) => {
            if (!this.loginForm) {
                return;
            }

            this.loginForm.validateFields(
                ['mobile'],
                {},
                async (err: unknown, values: LoginParamsType) => {
                    if (err) {
                        reject(err);
                    } else {
                        const {dispatch} = this.props;

                        try {
                            const success = await ((dispatch({
                                type: 'login/getCaptcha',
                                payload: values.mobile,
                            }) as unknown) as Promise<unknown>);
                            resolve(!!success);
                        } catch (error) {
                            reject(error);
                        }
                    }
                },
            );
        });

    renderMessage = (content: string) => (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );

    render() {
        const {userLogin, submitting} = this.props;
        const {status, type: loginType} = userLogin;
        const {type, autoLogin} = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    onCreate={(form?: FormComponentProps['form']) => {
                        this.loginForm = form;
                    }}
                >
                    <div className={styles.loginBox}>
                        <UserName
                            name="userName"
                            placeholder={`${'用户名'}`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={`${'密码'}`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                            onPressEnter={e => {
                                e.preventDefault();

                                if (this.loginForm) {
                                    this.loginForm.validateFields(this.handleSubmit);
                                }
                            }}
                        />
                    </div>
                    <Submit loading={submitting}>登录</Submit>
                </LoginComponents>
            </div>
        );
    }
}

export default Login;
