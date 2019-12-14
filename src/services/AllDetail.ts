import request from '../utils/request';

//物品实时列表
export async function AllDetailPersonDatas(params) {
    return request(`${configUrl.serverUrl}/getRyda`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}


