import request from '../utils/request';


export async function MySuperviseDatas(params) {
    return request(`${configUrl.serverUrl}/getWddbPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function MySuperviseDatasCount(params) {
    return request(`${configUrl.serverUrl}/getWddbByDqztPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function changeReadStatus(params) {
    return request(`${configUrl.serverUrl}/changeDqzt`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getAllTypeWarningCount(params) {
    return request(`${configUrl.serverUrl}/ChartGjqkTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function saveFeedback(params) {
    return request(`${configUrl.serverUrl}/questionZjFk`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//获取子系统
export async function goLink(params) {
    return request(`${configUrl.serverUrl}/queryConfigList`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
