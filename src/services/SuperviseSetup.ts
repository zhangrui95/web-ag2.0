import {stringify} from 'qs';
import request from '../utils/request';

let configUrl = window.configUrl;

//监管配置
export async function jgList(params) {
    return request(`${configUrl.serverUrl}/getJgPzPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//删除监管点
export async function delJgd(params) {
    return request(`${configUrl.serverUrl}/delJgPzXxById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//新增监管点
export async function addJgd(params) {
    return request(`${configUrl.serverUrl}/saveJgPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//修改监管点
export async function updateJgd(params) {
    return request(`${configUrl.serverUrl}/updateJgPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//获取监管复用机构列表信息
export async function fyJg(params) {
    return request(`${configUrl.serverUrl}/getJgPzSsJg`, {
        method: 'POST',
        data: params,
    });
}

//获取监管复用事项
export async function fyJgsx(params) {
    return request(`${configUrl.serverUrl}/getJgPzOfSxBySsJg`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//获取监管复用监管点
export async function fyJgd(params) {
    return request(`${configUrl.serverUrl}/getJgXxByParam`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//保存复用监管点
export async function saveFy(params) {
    return request(`${configUrl.serverUrl}/saveFYJgPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//获取监管点具体算法说明
export async function getExplainModalService(params) {
    return request(`${configUrl.serverUrl}/getJgPzXxxq`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//启用禁用监管点
export async function getchangeJgPzXxService(params) {
    return request(`${configUrl.serverUrl}/changeJgPzXxById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}