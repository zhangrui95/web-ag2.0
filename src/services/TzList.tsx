import { stringify } from 'qs';
import request from '../utils/request';

//人员处置台账
export async function getRycz(params) {
    return request(`${configUrl.serverUrl}/getRyZcTzPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//吸毒人员统计
export async function getXdrytj(params) {
  return request(`${configUrl.serverUrl}/getDrugxzTjPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//所内处罚统计
export async function getSncf(params) {
  return request(`${configUrl.serverUrl}/getPoliceStationTzPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//
export async function getAjJb(params) {
    return request(`${configUrl.serverUrl}/getAjCsDjPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function getXsAj(params) {
    return request(`${configUrl.serverUrl}/getXsAjBlJdGlTzPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function getXzAj(params) {
    return request(`${configUrl.serverUrl}/getXzAjBlJdGlTzPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function getMrJq(params) {
    return request(`${configUrl.serverUrl}/getMrJqXcQkPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function getSLA(params) {
    return request(`${configUrl.serverUrl}/getSlaQkJdGlDjbPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function getXsAjDjbPgListPage(params) {
    return request(`${configUrl.serverUrl}/getXsAjDjbPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//
export async function getXzAjDjbPgListPage(params) {
    return request(`${configUrl.serverUrl}/getXzAjDjbPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
