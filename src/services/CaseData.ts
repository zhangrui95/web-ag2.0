import request from '../utils/request';

//刑事案件
export async function caseDatas(params) {
    return request(`${configUrl.serverUrl}/getAjxxPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function CaseSuperviseMessage(params) {
    return request(`${configUrl.serverUrl}/questionFqdb`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getAjxxXqById(params) {
    return request(`${configUrl.serverUrl}/getAjxxXqById `, {
        method: 'POST',
        data: params,
    });
}

//行政案件

export async function xzCaseDatas(params) {
    return request(`${configUrl.serverUrl}/getXzAjxxPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getXzAjxxXqById(params) {
    return request(`${configUrl.serverUrl}/getXzAjxxXqById `, {
        method: 'POST',
        data: params,
    });
}

export async function getIntoAreaData(params) {
    return request(`${configUrl.serverUrl}/getRyZqQk `, {
        method: 'POST',
        data: params,
    });
}

export async function getAllCaseProgress(params) {
    return request(`${configUrl.serverUrl}/getXSAjxxTbTj `, {
        method: 'POST',
        data: params,
    });
}

export async function getEnforcementMeasure(params) {
    return request(`${configUrl.serverUrl}/getXSAjxxRyQzcsTbTj `, {
        method: 'POST',
        data: params,
    });
}

export async function getSLAEnforcementMeasure(params) {
    return request(`${configUrl.serverUrl}/getXSAjlxCount `, {
        method: 'POST',
        data: params,
    });
}

export async function getAllXzCaseProgress(params) {
    return request(`${configUrl.serverUrl}/getXzAjxxTbTj `, {
        method: 'POST',
        data: params,
    });
}

export async function getAllXzTypeCase(params) {
    return request(`${configUrl.serverUrl}/getXzAjSJTbTj `, {
        method: 'POST',
        data: params,
    });
}

export async function getAdministrativePenalty(params) {
    return request(`${configUrl.serverUrl}/getXzAjRyXzcfTbTj `, {
        method: 'POST',
        data: params,
    });
}

export async function getCaseTypeStatistics(params) {
    return request(`${configUrl.serverUrl}/getAjxxLbTj `, {
        method: 'POST',
        data: params,
    });
}