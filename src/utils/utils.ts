import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

//获取token
export const getUserToken = (): string => {
  return sessionStorage.getItem('userToken') || '';
};

// 获取sessionStorage中user信息
export function getUserInfos() {
  let userInfo = null;
  const userStr = sessionStorage.getItem('user');
  if (userStr) {
    userInfo = JSON.parse(userStr);
  }
  return userInfo;
}
// 用户权限code
export const userAuthorityCode = {
    TUIBU: 'zhag_zfba_tb', // 退补
    ZHIBIAO: 'zhag_zfba_zb', // 制表
    RIQING: 'zhag_sqdd_jqrq', // 日清
    TIANJIAJIANGUANDIAN:'zhag_xtpz_jgpz_tjjgd', // 添加监管点
    SHANCHUJIANGUANDIAN:'zhag_xtpz_jgpz_scjgd', // 删除监管点
};
