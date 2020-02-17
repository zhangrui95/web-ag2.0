/*
 * generalQuery.js 综合查询
 * author：lyp
 * 20180731
 * */

import request from '../utils/request';

const generalQueryUrl = window.configUrl&&window.configUrl.generalQueryUrl ? window.configUrl.generalQueryUrl : '';

export async function getSearchData(param) {
    return request(generalQueryUrl, {
        method: 'POSTS',
        data: param,
    });
}

export async function getSearchDataNew(param) {
    return request(generalQueryUrl + param.searchTypeUrl + '/_search', {
        method: 'POSTS',
        data: param.pd,
    });
}

export async function getSaveSsNrXX(params) {
    return request(`${configUrl.serverUrl}/saveSsNrXX`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getSsNrXX(params) {
    return request(`${configUrl.serverUrl}/getSsNrXX`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
