import {stringify} from 'qs';
import request from '../utils/request';

let configUrl = window.configUrl;

//关注
export async function getFollow(params) {
    return request(`${configUrl.serverUrl}/saveGzFxXX`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//取消关注
export async function getnoFollow(params) {
    return request(`${configUrl.serverUrl}/qxGzXX`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//分享人
export async function getPerson(params) {
    return request(`${configUrl.securityCenterUrl}/user/findAllUserLevelBlistPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//提醒
export async function getTX(params) {
    return request(`${configUrl.serverUrl}/saveYjTxXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//日志
export async function getRZ(params) {
    return request(`${configUrl.serverUrl}/getYjLogXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//退补
export async function getRetrieve(params) {
    return request(`${configUrl.serverUrl}/addTuiBu`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
