import request from '../utils/request';

export async function getMessageList(params) {
    return request(`${configUrl.serverUrl}/getZyPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function setMessageData(params) {
    return request(`${configUrl.serverUrl}/saveZyPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}