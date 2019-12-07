/*
*  dossier.js 卷宗常规数据
*  author：lyp
*  20181031
* */
import request from '../utils/request';

export async function getDossierData(params) {
    return request(`${configUrl.serverUrl}/getJzQuestionPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getDossierDetail(params) {
    return request(`${configUrl.serverUrl}/getJzQuestionXqById`, {
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

export async function UnDossierAllTypeWarnings(params) {
    return request(`${configUrl.serverUrl}/getJzJrXzGjTbTj`, {
        method: 'POST',
        data: params,
    });
}
