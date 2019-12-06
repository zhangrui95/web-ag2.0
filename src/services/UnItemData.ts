import request from '../utils/request';

//物品实时列表
export async function UnitemDatas(params) {
    return request(`${configUrl.serverUrl}/getSawpQuestionPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function UnitemDetailDatas(params) {
    return request(`${configUrl.serverUrl}/getSawpQuestionXqById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

// 保存督办
export async function SuperviseMessage(params) {
    return request(`${configUrl.serverUrl}/questionZcfb`, {
        method: 'POST',
        data: params,
    });
}

// 确认整改完成
export async function SureRefomMessage(params) {
    return request(`${configUrl.serverUrl}/questionDbzgwc`, {
        method: 'POST',
        data: params,
    });
}

export async function getUnItemAllTypeWarnings(params) {
    return request(`${configUrl.serverUrl}/getSawpWtGjTbTj`, {
        method: 'POST',
        data: params,
    });
}
