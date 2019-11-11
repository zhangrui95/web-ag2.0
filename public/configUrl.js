/*!
* configUrl.js
* author:ghn
* date: 2019/10/30
* 此文件用来配置访问地址变更
*/

// 必须修改，服务器地址，不带http://
const ip = '192.168.40.1';

// 开发模式地址
const developConfigUrl = {
  sid: 'baq_sys',
  serverUrl: `http://${ip}:7500`, // 接口请求地址
  securityCenterUrl: `http://${ip}:8100`, // 安全中心地址
}

// window.configUrl = developModa === true ? developConfigUrl : onlineConfigUrl;
window.configUrl = developConfigUrl;
