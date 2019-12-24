import {stringify} from 'qs';
import request from '../utils/request';

//保存设置
export async function save(params) {
    return request(`${configUrl.serverUrl}/addConfig`, {
        method: 'PUT',
        data: {
            ...params,
        },
    });
}

//获取设置值
export async function query(params) {
    return request(`${configUrl.serverUrl}/queryConfigList`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
