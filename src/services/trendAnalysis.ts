/*
* 趋势分析services
* author: lyp
* date: 20181214
* */
import request from '../utils/request';

const serverUrl = configUrl.serverUrl;

export async function getOverviewData(param) {
    return request(serverUrl + '/JqysfxZs', {
        method: 'POST',
        data: param,
    });
}

export async function getAgainstProperty(param) {
    return request(serverUrl + '/JqysQincaileiJq', {
        method: 'POST',
        data: param,
    });
}

export async function getRobGrabFraud(param) {
    return request(serverUrl + '/JqysLiangqiangAj', {
        method: 'POST',
        data: param,
    });
}

export async function getStealData(param) {
    return request(serverUrl + '/JqysDaoqie', {
        method: 'POST',
        data: param,
    });
}

export async function getCriminalCaseOverviewData(param) {
    return request(serverUrl + '/AjysZs', {
        method: 'POST',
        data: param,
    });
}

export async function getCriminalCaseType(param) {
    return request(serverUrl + '/AjysLxfx', {
        method: 'POST',
        data: param,
    });
}

export async function getCriminalCaseAndPolice(param) {
    return request(serverUrl + '/AjysJqSaFx', {
        method: 'POST',
        data: param,
    });
}

export async function getPersonOverview(param) {
    return request(serverUrl + '/RyysZs', {
        method: 'POST',
        data: param,
    });
}

export async function getPunishTypeData(param) {
    return request(serverUrl + '/RyysCfzs', {
        method: 'POST',
        data: param,
    });
}

export async function getSuspectPunishTypeData(param) {
    return request(serverUrl + '/RyysQzcs', {
        method: 'POST',
        data: param,
    });
}