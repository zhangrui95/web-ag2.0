import request from '../utils/request';

//物品实时列表
export async function itemDatas(params) {
    return request(`${configUrl.serverUrl}/getSawpPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//物品详情
export async function getSawpXqById(params) {
    return request(`${configUrl.serverUrl}/getSawpXqBySystemId`, {
        method: 'POST',
        data: params,
    });
}


export async function ywzxWpzlDatas(params) {
    return request(`${configUrl.maintainCenterUrl}/dictionary`, {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

// 数据展示
export async function ItemDatasView(params) {
    return request(`${configUrl.serverUrl}/getSawpSlTbTj`, {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

// 物品出入库情况
export async function ItemCRKDatasView(params) {
    return request(`${configUrl.serverUrl}/getSawpCrkQkTbTj`, {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

// 在库物品数量展示
export async function ItemZKNumDatasView(params) {
    return request(`${configUrl.serverUrl}/getSawpZkSlTbTj`, {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

// 物品趋势
export async function ItemWpqsDatasView(params) {
    return request(`${configUrl.serverUrl}/getSawpQsTbTj`, {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}
