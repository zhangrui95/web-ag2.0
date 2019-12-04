import request from '../utils/request';


export async function UnareaDatas(params) {
    return request(`${configUrl.serverUrl}/getBaqQuestionPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}


export async function UnareaDetailDatas(params) {
    return request(`${configUrl.serverUrl}/getBaqQuestionXqById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//保存督办
export async function SuperviseMessage(params) {
    return request(`${configUrl.serverUrl}/questionZcfb`, {
        method: 'POST',
        data: params,
    });
}

//确认整改完成
export async function SureRefomMessage(params) {
    return request(`${configUrl.serverUrl}/questionDbzgwc`, {
        method: 'POST',
        data: params,
    });
}

export async function getUnAreaAllTypeWarnings(params) {
    return request(`${configUrl.serverUrl}/getBaqXzgjTbTj`, {
        method: 'POST',
        data: params,
    });
}
