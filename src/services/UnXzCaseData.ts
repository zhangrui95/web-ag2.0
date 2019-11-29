import request from '../utils/request';

export async function UnXzcaseDetailDatas(params) {
    return request(`${configUrl.serverUrl}/getXzAjxxQuestionXqById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//刑事案件
export async function UnXzCaseDatas(params) {
    return request(`${configUrl.serverUrl}/getXzAjxxQuestionPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getUnXzAjxxXqById(params) {
    return request(`${configUrl.serverUrl}/getXzAjxxQuestionXqById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getUnXzCaseAllTypeWarnings(params) {
    return request(`${configUrl.serverUrl}/getXzAjWtGjTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

