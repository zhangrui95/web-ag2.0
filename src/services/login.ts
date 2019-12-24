import request from '@/utils/request';

const {securityCenterUrl} = window.configUrl;

export interface LoginParamsType {
    userName: string;
    password: string;
    mobile: string;
    captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
    return request(`${securityCenterUrl}/api/login`, {
        method: 'POST',
        data: params,
    });
}

export async function getFakeCaptcha(mobile: string) {
    return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function tokenLogin(params) {
    return request(`${securityCenterUrl}/api/loginToken`, {
        method: 'POST',
        data: params,
    });
}
