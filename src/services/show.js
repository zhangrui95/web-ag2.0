/*
* 大屏展示services
* author: lyp
* date: 20180607
* */

import request from '../utils/request';

const serverUrl = configUrl.serverUrl;
const baqServerUrl = configUrl.baqServerUrl;

export async function getPoliceSituationData(param) {
    return request(serverUrl + '/getJqSsTj', {
        method: 'POST',
        data: param,
    });
}

export async function getPoliceCaseData(param) {
    return request(serverUrl + '/getAjSsTj', {
        method: 'POST',
        data: param,
    });
}

export async function getTimeWarningData(param) {
    return request(serverUrl + '/getSxgjTj', {
        method: 'POST',
        data: param,
    });
}

export async function getInvolvedItems(param) {
    return request(serverUrl + '/getSacwSsTj', {
        method: 'POST',
        data: param,
    });
}

export async function getCaseHandArea(param) {
    return request(serverUrl + '/getBaqSsTj', {
        method: 'POST',
        data: param,
    });
}

export async function getAjslByState(param) {
    return request(serverUrl + '/getAjslByState', {
        method: 'POST',
        data: param,
    });
}

export async function getBaqZxGjPgListPage(param) {
    return request(serverUrl + '/getBaqZxGjPgListPage', {
        method: 'POST',
        data: param,
    });
}

export async function getNewAjxx(param) {
    return request(serverUrl + '/getNewAjxx', {
        method: 'POST',
        data: param,
    });
}

export async function getBaqZqTj(param) {
    return request(serverUrl + '/getBaqZqTj', {
        method: 'POST',
        data: param,
    });
}

export async function getSacwCkTj(param) {
    return request(serverUrl + '/getSacwCkTj', {
        method: 'POST',
        data: param,
    });
}

export async function getSacwSsTj(param) {
    return request(serverUrl + '/getSacwSsTj', {
        method: 'POST',
        data: param,
    });
}

export async function getMapData(param) {
    return request(serverUrl + '/getAjTj', {
        method: 'POST',
        data: param,
    });
}

export async function getCaseCountByArea(param) {
    return request(serverUrl + '/getAjsjTj', {
        method: 'POST',
        data: param,
    });
}

export async function getVideoList(param) {
    return request(serverUrl + '/getBaqZxrq', {
        method: 'POST',
        data: param,
    });
}

export async function videoPlay(param) {
    return request(baqServerUrl + '/mqtt/superviseVideo', {
        method: 'POST',
        data: param,
    });
}

export async function getPoliceSituationToCaseCount(param) {
    return request(serverUrl + '/getJcZhAjSlTbTj', {
        method: 'POST',
        data: param,
    });
}

export async function getDossierCount(param) {
    return request(serverUrl + '/JzSlCount', {
        method: 'POST',
        data: param,
    });
}

export async function getAdministrativeCaseCount(param) {
    return request(serverUrl + '/getXzAjSlByDwTbTj', {
        method: 'POST',
        data: param,
    });
}

export async function getScreenConfig(param) {
    return request(serverUrl + '/queryConfigList', {
        method: 'POST',
        data: param,
    });
}

export async function getCaseAndWarningCount(param) {
    return request(serverUrl + '/BigAjxxAndGjxxCount', {
        method: 'POST',
        data: param,
    });
}

export async function getCloseAndDetectionRate(param) {
    return request(serverUrl + '/CaseRate', {
        method: 'POST',
        data: param,
    });
}

export async function getCriminalCaseCount(param) {
    return request(serverUrl + '/XsaflfbTj', {
        method: 'POST',
        data: param,
    });
}

export async function getDirectlyDepCase(param) {
    return request(serverUrl + '/getGjJzXzSyhJdTj', {
        method: 'POST',
        data: param,
    });
}

export async function getDossierData(param) {
    return request(serverUrl + '/JzKfAndZhlTj', {
        method: 'POST',
        data: param,
    });
}

export async function getSpecialCase(param) {
    return request(serverUrl + '/getzxlbCount', {
        method: 'POST',
        data: param,
    });
}

export async function getWholeDetectionRate(param) {
    return request(serverUrl + '/XsCaseRate', {
        method: 'POST',
        data: param,
    });
}

export async function getCaseItemInfo(param) {
    return request(serverUrl + '/sawpSlKfZylJs', {
        method: 'POST',
        data: param,
    });
}

export async function getDossierWarning(param) {
    return request(serverUrl + '/jzYcSjTj', {
        method: 'POST',
        data: param,
    });
}

export async function getHandingCaseCount(param) {
    return request(serverUrl + '/bigScreenZbaj', {
        method: 'POST',
        data: param,
    });
}

export async function getHandingCaseAreaUseInfo(param) {
    return request(serverUrl + '/bigScreenLqyy', {
        method: 'POST',
        data: param,
    });
}

export async function getSystemUseInfo(param) {
    return request(serverUrl + '/grSyQkTj', {
        method: 'POST',
        data: param,
    });
}