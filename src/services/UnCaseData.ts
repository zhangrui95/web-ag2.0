import request from '../utils/request';


export async function UncaseDatas(params) {
    return request(`${configUrl.serverUrl}/getAjxxQuestionPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}


export async function UncaseDetailDatas(params) {
    return request(`${configUrl.serverUrl}/getAjxxQuestionXqById`, {
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

// 获取人员档案的请求
export async function AllDetailPersonDatas(params) {
    return request(`${configUrl.serverUrl}/getRyda`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getUnCaseAllTypeWarnings(params) {
    return request(`${configUrl.serverUrl}/getXsAjWtGjTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
