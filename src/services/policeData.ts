import request from '../utils/request';

export async function policeDatas(params) {
  return request(`${configUrl.serverUrl}/getJcjPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function policeDetailDatas(params) {
  return request(`${configUrl.serverUrl}/getJcjXqById`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function PoliceSuperviseMessage(params) {
  return request(`${configUrl.serverUrl}/questionFqdb`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getPoliceSituationCount(params) {
  return request(`${configUrl.serverUrl}/getJqsl`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getHandleResult(params) {
  return request(`${configUrl.serverUrl}/getCzjg`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getHandlePoliceSituationHadResult(params) {
  return request(`${configUrl.serverUrl}/getISCzjg`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getHandlePoliceSituation(params) {
  return request(`${configUrl.serverUrl}/getJcjCount`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getAcceptPoliceSituation(params) {
  return request(`${configUrl.serverUrl}/getISsa`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getComment(params) {
  return request(`${configUrl.serverUrl}/insertJqdddp`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function commentsItems(params) {
  return request(`${configUrl.serverUrl}/getJqdddp`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
