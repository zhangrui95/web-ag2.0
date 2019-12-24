import request from '../utils/request';

//执法考评数据列表
export async function AssessmentPgListPage(params) {
    return request(`${configUrl.serverUrl}/getAssessmentPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//执法考评数据详情
export async function AssessmentById(params) {
    return request(`${configUrl.serverUrl}/getAssessmentByAjbhAndKfx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//扣分项目统计
export async function getKfXmTjPgListPages(params) {
    return request(`${configUrl.serverUrl}/getKfXmTjPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//人员考核排名
export async function getRyKhPmTjPgListPages(params) {
    return request(`${configUrl.serverUrl}/getRyKhPmTjPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//人员考核排名
export async function getRyKhOfAjslPgListPages(params) {
    return request(`${configUrl.serverUrl}/getRyKhOfAjslPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//人员考核排名
export async function getRyKhOGjPgListPages(params) {
    return request(`${configUrl.serverUrl}/getRyKhOGjPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//机构扣分情况统计
export async function getJgKfQkTjPgListPages(params) {
    return request(`${configUrl.serverUrl}/getJgKfQkTjPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//机构扣分情况统计
export async function getJgKhOGjPgListPages(params) {
    return request(`${configUrl.serverUrl}/getJgKhOGjPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//机构扣分情况统计
export async function getJgKhOfAjslPgListPages(params) {
    return request(`${configUrl.serverUrl}/getJgKhOfAjslPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//案件考评详情-引用标准查询
export async function getKpBzByAjbhAndKfxPgListPages(params) {
    return request(`${configUrl.serverUrl}/getKpBzByAjbhAndKfxPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//扣分项目
export async function getDictPgListPages(params) {
    return request(`${configUrl.serverUrl}/getDictPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//考评配置列表
export async function getLists(params) {
    return request(`${configUrl.serverUrl}/getAssessmentPzPgListPage`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//添加配置列表
export async function getSave(params) {
    return request(`${configUrl.serverUrl}/saveAssessmentPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//删除配置列表
export async function getDel(params) {
    return request(`${configUrl.serverUrl}/delAssessmentPzXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//获取案件考评详情
export async function getDetail(params) {
    return request(`${configUrl.serverUrl}/getAjkpXqByAjbh`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

//保存考评
export async function getSaveKp(params) {
    return request(`${configUrl.serverUrl}/saveAjkpXx`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
