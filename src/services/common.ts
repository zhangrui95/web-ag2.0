import request from '../utils/request';
let configUrl = window.configUrl;

export async function getDictType(params) {
  return request(`${configUrl.maintainCenterUrl}/dictionary`, {
    method: 'POST',
    data: params,
  });
}

export async function getItemsStorage(params) {
  return request(`${configUrl.serverUrl}/getSacwCkList`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getDepTree(params) {
  return request(`${configUrl.securityCenterUrl}/lowcase/getDepartmentTreeWithCheck`, {
    method: 'POST',
    data: params,
  });
}

export async function getAllPolice(params) {
  return request(`${configUrl.securityCenterUrl}/lowcase/findAllUser`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportData(params) {
  return request(`${configUrl.serverUrl}/exportExcel`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function findSubordinateDeptByCodeAndUids(params) {
  return request(`${configUrl.securityCenterUrl}/lowcase/findSubordinateDeptByCodeAndUid`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getBaqTree(params) {
  return request(`${configUrl.maintainCenterUrl}/AreaHandleTreeByName`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function downFile(params) {
  return request(`${configUrl.serverUrl}/downFile`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getNextLevelDeps(params) {
  return request(`${configUrl.securityCenterUrl}/lowcase/findSubordinateDeptByCode`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getDeptmentByCodes(params) {
  return request(`${configUrl.securityCenterUrl}/lowcase/getDeptmentByCode`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function saveSystemInfo(params) {
  return request(`${configUrl.serverUrl}/saveCzJl`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getQueryLowerDept(params) {
  return request(`${configUrl.securityCenterUrl}/qjqcl/queryLowerDept`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getCaseTypeTree(params) {
  return request(`${configUrl.serverUrl}/findDictTree`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getPoliceTypeTreeServices(params) {
  return request(`${configUrl.serverUrl}/findDictTreeTY`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getDepGxTree(params) {
  return request(
    `${configUrl.securityCenterUrl}/lowcase/getMechanismTreeByUnitcodeAndDepartmentWithCheck`,
    {
      method: 'POST',
      data: {
        ...params,
      },
    },
  );
}

export async function getExportEffectServices(params) {
  return request(`${configUrl.tbtjExportUrl}/gen-docx`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getSyncTime(params) {
  return request(`${configUrl.serverUrl}/getSjTbsj`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getCaseManagementDicts(params) {
  return request(`${configUrl.serverUrl}/getDictPgListPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getResponsePersonService(params) {
  return request(`${configUrl.securityCenterUrl}/lowcase/findAllUserLevel`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
