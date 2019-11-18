/*
* 消息推送日志services
* author: lyp
* date: 20190616
* */
import request from '../utils/request';

export async function getMessagePushLogList(params) {
    return request(`${configUrl.serverUrl}/getXxtsLogPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
