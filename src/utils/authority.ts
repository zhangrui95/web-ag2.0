import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

//通过权限编码查询权限列表获取是否有此权限，返回true或false
export function authorityIsTrue(code) {
  let isTrue = false;
  const authoMenuList =
    sessionStorage.getItem('authoMenuList') &&
    sessionStorage.getItem('authoMenuList') === 'undefined'
      ? []
      : JSON.parse(sessionStorage.getItem('authoMenuList')); //权限列表
  if (authoMenuList && authoMenuList.length > 0) {
    for (let i = 0; i < authoMenuList.length; i++) {
      let menu = authoMenuList[i];
      if (menu.resourceCode === code) {
        isTrue = true;
      }
    }
  }
  return isTrue;
}

export function checkAuthorityByName(name) {
  let isTrue = false;
  const authoMenuList =
    sessionStorage.getItem('authoMenuList') &&
    sessionStorage.getItem('authoMenuList') === 'undefined'
      ? []
      : JSON.parse(sessionStorage.getItem('authoMenuList')); //权限列表
  if (authoMenuList && authoMenuList.length > 0) {
    for (let i = 0; i < authoMenuList.length; i++) {
      let menu = authoMenuList[i];
      if (menu.name === name) {
        isTrue = true;
      }
    }
  }
  return isTrue;
}
