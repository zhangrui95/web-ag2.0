import { stringify } from 'qs';
import request from '../utils/request';

//我的消息
export async function myNewsList(params) {
  return request(`${configUrl.serverUrl}/getSyWdXxPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//督办消息
export async function dbList(params) {
  return request(`${configUrl.serverUrl}/getWddbPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//日志
export async function getTodayLog(params) {
  return request(`${configUrl.serverUrl}/getXtRzOfToday`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//关注列表
export async function getFollow(params) {
  return request(`${configUrl.serverUrl}/getGxXXPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//关注历史列表
export async function getHistoryFollow(params) {
  return request(`${configUrl.serverUrl}/getGxLsXXPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//分享给我的列表
export async function getShare(params) {
  return request(`${configUrl.serverUrl}/getFxXXPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//我的分享
export async function getmyShare(params) {
  return request(`${configUrl.serverUrl}/getWdFxXXPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//已读，未读
export async function changeRead(params) {
  return request(`${configUrl.serverUrl}/changeDqzt`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//分享总数
export async function shareNum(params) {
  return request(`${configUrl.serverUrl}/getFxSl`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//关注总数
export async function followNum(params) {
  return request(`${configUrl.serverUrl}/getGzSl`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//综合统计
export async function getlistNum(params) {
  return request(`${configUrl.serverUrl}/getZhTjSlByDw`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//疑似警情
export async function getPoliceNum(params) {
  return request(`${configUrl.serverUrl}/getYsAjJqTjSlByDw`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//首页数据统计版本2
export async function getZhTjSlByDwOfSeconds(params) {
  return request(`${configUrl.serverUrl}/getZhTjSlByDwOfSecond`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//数据总览
export async function getsjNum(params) {
  return request(`${configUrl.serverUrl}/getAjAndZfXx`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取三清总数量
export async function getClearNums(params) {
  return request(`${configUrl.serverUrl}/getSqMkWddTj`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
