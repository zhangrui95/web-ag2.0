/*
*  dossier.js 卷宗常规数据
*  author：lyp
*  20181031
* */
import request from '../utils/request';

export async function getDossierData(params) {
    return request(`${configUrl.serverUrl}/getJzPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getDossierDetail(params) {
    return request(`${configUrl.serverUrl}/getJzXqById`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function getjzDossierDataView(params) {
    return request(`${configUrl.serverUrl}/getJzSlZsTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function DossierCRKDatasView(params) {
    return request(`${configUrl.serverUrl}/getJzCrkQkTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function DossierZKNumDatasView(params) {
    return request(`${configUrl.serverUrl}/getZkJzZsTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function DossierJzqsDatasView(params) {
    return request(`${configUrl.serverUrl}/getJzQsTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function DossierDZHQKZSDatasView(params) {
    return request(`${configUrl.serverUrl}/getDzhQkZsTbTj`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function DossierSynchronizationDatasView(params) {
    return request(`${configUrl.jzUrl}/electronicd/getElectronicCataloguesList`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function DossierElectronicPageListDatasView(params) {
    return request(`${configUrl.jzUrl}/electronicd/getElectronicPageList`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
