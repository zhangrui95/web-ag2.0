/*
* 人员档案services
* author: lyp
* date: 20181225
* */
import request from '../utils/request';

const serverUrl = configUrl.serverUrl;

export async function getPersonData(param) {
    return request(serverUrl + '/getPeoplePgListPage', {
        method: 'POST',
        data: param,
    });
}
