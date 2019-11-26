const developModa = true; // 是否为开发模式
// 线上服务地址
const onlineips = {
  ip: 'http://192.168.3.201', // 服务地址[需配置]
};
// 开发服务模式
const developips = {
  // ip: 'http://192.168.3.17',  // 汝亚莉
  // ip: 'http://192.168.3.159',// 范敏
  // ip: 'http://192.168.3.155',// 李卓奇
  // ip: 'http://192.168.3.224', // zyz
  // ip: 'http://192.168.38.179', // 孙金龙
  ip: 'http://192.168.3.201', // 202
  maintainIp: 'http://192.168.3.202', // 运维中心地址
  aqzxIp: 'http://192.168.3.201', // 安全中心地址
  // aqzxIp: 'http://192.168.3.155',// 李卓奇安全中心地址
  // aqzxIp:'http://192.168.41.249',// 安全中心地址
  TbtjDcIp: 'http://192.168.3.245', // 图表统计导出功能地址
  downLoadIp: 'http://192.168.3.201', // 下载地址
  jz: 'http://192.168.3.116',
};
const ips = developModa ? developips : onlineips; // ip地址
// 通用配置项[需配置]
const configItem = {
  sysName: '鹤壁市公安局智慧法制案管系统',
  headName: '鹤壁市公安局智慧法制案管系统', // 左侧导航顶部显示名称
  footName: '哈尔滨海邻科信息技术有限公司',
  version: 'V 1.2.13.1', // 版本号
  sid: 'zhag', // 系统资源ID
  showDataTitle: '鹤壁市', // 大屏展示标题
  mapCityName: 'hebi', // 大屏展示地图名称（可配置项： mudanjiang/ hulunbeier/baishan/hebi/erduosi/guiLin）
  mapAreaChangeTime: 5, // 大屏地图轮换间隔时间（秒）
  refreshNoticeTime: 30, // 自动获取消息时间（秒）
  isShowBaqsstj: true, // 首页是否显示办案区实时统计数据（false则显示案件状态统计）
  isSyncBaq: true, // 办案区
  isSyncCaseOnTime: true, // 案件实时数据
  isSyncCaseCount: true, // 案件统计
  isSyncCaseItems: true, // 涉案物品
  isSmartLinKey: true, // 是否登录smartlinkey客户端
  mainlineMenu: true, // 首页是否存在办案区/涉案物品/卷宗数据
  personQueryIndex: 'index_saryxx_dq', // 人员索引
  itemsQueryIndex: 'index_wpxx_dq', // 物品索引
  caseQueryIndex: 'index_ajxx_dq', // 案件索引
  baqQueryIndex: 'index_rqxx_dq', // 办案区索引
  dossierQueryIndex: 'index_jzxx_dq', // 卷宗索引
  smartlinKeyUrl: 'http://127.0.0.1isy:1234', // smartlinkey登录地址(无需修改)
  clearHome: false, //是否显示三清调度首页（鹤壁定制）
  is_zsj: '0', //首页综合统计显示本级还是下级'1'本级，'0'下级
  is_area: '0', // 刑事案件案件类别根据不同地区调用不同的接口；1表示牡丹江,2表示平乐,0表示主线，5表示达拉特旗
  is_ssds: 'hb', // 接处警报警类别的所属地市
};
// 开发模式地址
const developConfigUrl = {
  jzUrl: `${ips.jz}:7200`, // 卷宗子系统
  serverUrl: `${ips.ip}:7700`, // 本地开发案管服务
  // securityCenterUrl: `${ips.aqzxIp}:8080`,// 孙金龙安全中心
  // securityCenterUrl: `${ips.aqzxIp}:8080`,// 李卓奇安全中心
  // securityCenterUrl: `${ips.aqzxIp}:8100/security-service`, // 安全中心
  securityCenterUrl: `${ips.aqzxIp}:8100`, // 安全中心
  baqServerUrl: `${ips.maintainIp}:7500`, // 办案区服务
  maintainCenterUrl: `${ips.maintainIp}:7400`, // 运维中心
  generalQueryUrl: `http://192.168.3.201:9200/`, // 综合查询es服务地址,
  srcUrl: `${ips.maintainIp}:7300/raqReport-service/reportJsp/`, //润乾报表地址
  tbtjExportUrl: `${ips.TbtjDcIp}:8750`, // 图表统计导出功能
  smartLinkWindow7: `${ips.downLoadIp}/download/SmartLinkey_win7_2.3.0.1.zip`, //samrtLinkeyWindows版下载地址
  smartLinkWindowXp: `${ips.downLoadIp}/download/SmartLinkey_winxp_2.3.0.1.zip`, //samrtLinkeyWindows版下载地址
  google32: `${ips.downLoadIp}/download/chrome49_32.zip`, //谷歌32位版下载地址
  google64: `${ips.downLoadIp}/download/chrome49_64.zip`, //谷歌64位版下载地址
  userManual: '', //用户手册版下载地址
  ieUnit: `${ips.downLoadIp}/download/OpenWithIE_REG.zip`, //IE插件下载地址
};
// 线上模式地址
const onlineConfigUrl = {
  jzUrl: `${ips.ip}:7200`, // 卷宗子系统
  serverUrl: `${ips.ip}:7700`, // 案管服务
  baqServerUrl: `${ips.ip}:7500`, // 办案区服务地址
  maintainCenterUrl: `${ips.ip}:7400`, // 运维中心地址
  securityCenterUrl: `${ips.ip}:8100`, // 安全中心地址
  generalQueryUrl: `${ips.ip}:9200/`, // 综合查询es服务地址
  srcUrl: `${ips.ip}:7300/raqReport-service/reportJsp/`, //润乾报表地址
  tbtjExportUrl: `${ips.ip}:8750`, // 图表统计导出功能
  smartLinkWindow7: `${ips.ip}/download/SmartLinkey_win7_2.3.0.1.zip`, //samrtLinkeyWindows版下载地址
  smartLinkWindowXp: `${ips.ip}/download/SmartLinkey_winxp_2.3.0.1.zip`, //samrtLinkeyWindows版下载地址
  google32: `${ips.ip}/download/chrome49_32.zip`, //谷歌32位版下载地址
  google64: `${ips.ip}/download/chrome49_64.zip`, //谷歌64位版下载地址
  userManual: '', //用户手册版下载地址
  ieUnit: `${ips.ip}/download/OpenWithIE_REG.zip`, //IE插件下载地址
};
window.configUrl = Object.assign(
  configItem,
  developModa === true ? developConfigUrl : onlineConfigUrl,
);
