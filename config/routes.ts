// import home from '../src/assets/menuIcon/home.png'
// import jcj from '../src/assets/menuIcon/jcj.png'
export function routes() {
  let route = [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          // authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/ShowData/RegulatePanel',
            },
            {
              path: '/ShowData/RegulatePanel',
              name: '首页',
              icon: 'home',
              component: './ShowData/RegulatePanel',
            },
            {
              path: '/ShowData/MyNews',
              name: '首页我的消息查看',
              icon: 'home',
              component: './ShowData/MyNews',
              hideInMenu: true,
            },
            {
              name: '接处警',
              icon: 'smile',
              path: '/receivePolice',
              routes: [
                {
                  path: '/receivePolice/AlarmData',
                  name: '警情数据',
                  icon: 'smile',
                  component: './receivePolice/AlarmData',
                },
                {
                  path: '/receivePolice/AlarmWarning',
                  name: '警情预警',
                  icon: 'smile',
                  component: './receivePolice/AlarmWarning',
                },
                {
                  path: '/receivePolice/AlarmPolice',
                  name: '警情告警',
                  icon: 'smile',
                  component: './receivePolice/AlarmPolice',
                },
              ],
            },
            {
              name: '受立案',
              icon: 'smile',
              path: '/caseFiling',
              routes: [
                {
                  name: '案件数据',
                  icon: 'smile',
                  path: '/caseFiling/caseData',
                  routes: [
                    {
                      name: '刑事案件数据',
                      icon: 'smile',
                      path: '/caseFiling/caseData/CriminalData',
                      component: './caseFiling/CriminalData',
                    },
                    {
                      name: '行政案件数据',
                      icon: 'smile',
                      path: '/caseFiling/caseData/AdministrationData',
                      component: './caseFiling/AdministrationData',
                    },
                  ],
                },
                {
                  name: '案件预警',
                  icon: 'smile',
                  path: '/caseFiling/caseWarning',
                  routes: [
                    {
                      name: '刑事案件预警',
                      icon: 'smile',
                      path: '/caseFiling/caseWarning/CriminalWarning',
                      component: './caseFiling/CriminalWarning',
                    },
                    {
                      name: '行政案件预警',
                      icon: 'smile',
                      path: '/caseFiling/caseWarning/AdministrationWarning',
                      component: './caseFiling/AdministrationWarning',
                    },
                  ],
                },
                {
                  name: '案件告警',
                  icon: 'smile',
                  path: '/caseFiling/casePolice',
                  routes: [
                    {
                      name: '刑事案件告警',
                      icon: 'smile',
                      path: '/caseFiling/casePolice/CriminalPolice',
                      component: './caseFiling/CriminalPolice',
                    },
                    {
                      name: '行政案件告警',
                      icon: 'smile',
                      path: '/caseFiling/casePolice/AdministrationPolice',
                      component: './caseFiling/AdministrationPolice',
                    },
                  ],
                },
              ],
            },
            {
              name: '执法办案',
              icon: 'smile',
              path: '/enforcementCase',
              routes: [
                {
                  name: '案件数据',
                  icon: 'smile',
                  path: '/enforcementCase/caseData',
                  routes: [
                    {
                      name: '刑事案件数据',
                      icon: 'smile',
                      path: '/enforcementCase/caseData/CriminalData',
                      component: './enforcementCase/CriminalData',
                    },
                    {
                      name: '行政案件数据',
                      icon: 'smile',
                      path: '/enforcementCase/caseData/AdministrationData',
                      component: './enforcementCase/AdministrationData',
                    },
                  ],
                },
                {
                  name: '案件预警',
                  icon: 'smile',
                  path: '/enforcementCase/caseWarning',
                  routes: [
                    {
                      name: '刑事案件预警',
                      icon: 'smile',
                      path: '/enforcementCase/caseWarning/CriminalWarning',
                      component: './enforcementCase/CriminalWarning',
                    },
                    {
                      name: '行政案件预警',
                      icon: 'smile',
                      path: '/enforcementCase/caseWarning/AdministrationWarning',
                      component: './enforcementCase/AdministrationWarning',
                    },
                  ],
                },
                {
                  name: '案件告警',
                  icon: 'smile',
                  path: '/enforcementCase/casePolice',
                  routes: [
                    {
                      name: '刑事案件告警',
                      icon: 'smile',
                      path: '/enforcementCase/casePolice/CriminalPolice',
                      component: './enforcementCase/CriminalPolice',
                    },
                    {
                      name: '行政案件告警',
                      icon: 'smile',
                      path: '/enforcementCase/casePolice/AdministrationPolice',
                      component: './enforcementCase/AdministrationPolice',
                    },
                  ],
                },
              ],
            },
            {
              name: '办案区',
              icon: 'smile',
              path: '/handlingArea',
              routes: [
                {
                  path: '/handlingArea/AreaData',
                  name: '办案区数据',
                  icon: 'smile',
                  component: './handlingArea/AreaData',
                },
                {
                  path: '/handlingArea/AreaWarning',
                  name: '办案区预警',
                  icon: 'smile',
                  component: './handlingArea/AreaWarning',
                },
                {
                  path: '/handlingArea/AreaPolice',
                  name: '办案区告警',
                  icon: 'smile',
                  component: './handlingArea/AreaPolice',
                },
              ],
            },
            {
              name: '涉案物品',
              icon: 'smile',
              path: '/articlesInvolved',
              routes: [
                {
                  path: '/articlesInvolved/ArticlesData',
                  name: '涉案物品数据',
                  icon: 'smile',
                  component: './articlesInvolved/ArticlesData',
                },
                {
                  path: '/articlesInvolved/ArticlesWarning',
                  name: '涉案物品预警',
                  icon: 'smile',
                  component: './articlesInvolved/ArticlesWarning',
                },
                {
                  path: '/articlesInvolved/ArticlesPolice',
                  name: '涉案物品告警',
                  icon: 'smile',
                  component: './articlesInvolved/ArticlesPolice',
                },
              ],
            },
            {
              name: '卷宗',
              icon: 'smile',
              path: '/dossierPolice',
              routes: [
                {
                  path: '/dossierPolice/DossierData',
                  name: '卷宗数据',
                  icon: 'smile',
                  component: './dossierPolice/DossierData',
                },
                {
                  path: '/dossierPolice/DossierWarning',
                  name: '卷宗预警',
                  icon: 'smile',
                  component: './dossierPolice/DossierWarning',
                },
                {
                  path: '/dossierPolice/DossierPolice',
                  name: '卷宗告警',
                  icon: 'smile',
                  component: './dossierPolice/DossierPolice',
                },
              ],
            },
            {
              name: '要素趋势分析',
              icon: 'smile',
              path: '/trendAnalysis',
              routes: [
                {
                  path: '/trendAnalysis/PoliceAnalysis',
                  name: '警情分析',
                  icon: 'smile',
                  component: './trendAnalysis/PoliceAnalysis',
                },
                {
                  path: '/trendAnalysis/caseAnalysis',
                  name: '案件分析',
                  icon: 'smile',
                  routes: [
                    {
                      name: '刑事案件告警',
                      icon: 'smile',
                      path: '/trendAnalysis/caseAnalysis/CriminaAnalysis',
                      component: './trendAnalysis/CriminaAnalysis',
                    },
                    {
                      name: '行政案件告警',
                      icon: 'smile',
                      path: '/trendAnalysis/caseAnalysis/AdministrationAnalysis',
                      component: './trendAnalysis/AdministrationAnalysis',
                    },
                  ],
                },
                {
                  path: '/trendAnalysis/PersonPolice',
                  name: '涉案人员分析',
                  icon: 'smile',
                  component: './trendAnalysis/PersonPolice',
                },
              ],
            },
            {
              name: '执法考评',
              icon: 'smile',
              path: '/Evaluation',
              routes: [
                {
                  path: '/Evaluation/CaseEvaluation',
                  name: '案件考评',
                  icon: 'smile',
                  component: './Evaluation/CaseEvaluation',
                },
                {
                  path: '/Evaluation/File',
                  name: '执法档案',
                  icon: 'smile',
                  routes: [
                    {
                      name: '单位执法档案',
                      icon: 'smile',
                      path: '/Evaluation/File/CompanyFile',
                      component: './Evaluation/CompanyFile',
                    },
                    {
                      name: '民警执法档案',
                      icon: 'smile',
                      path: '/Evaluation/File/PoliceFile',
                      component: './Evaluation/PoliceFile',
                    },
                  ],
                },
              ],
            },
            {
              name: '全息执法档案',
              icon: 'smile',
              path: '/lawEnforcement',
              routes: [
                {
                  path: '/lawEnforcement/File',
                  name: '案件档案',
                  icon: 'smile',
                  routes: [
                    {
                      name: '刑事案件档案',
                      icon: 'smile',
                      path: '/lawEnforcement/File/CriminalFile',
                      component: './lawEnforcement/CriminalFile',
                    },
                    {
                      name: '行政案件档案',
                      icon: 'smile',
                      path: '/lawEnforcement/File/AdministrativeFile',
                      component: './lawEnforcement/AdministrativeFile',
                    },
                  ],
                },
                {
                  path: '/lawEnforcement/PersonFile',
                  name: '人员档案',
                  icon: 'smile',
                  component: './lawEnforcement/PersonFile',
                },
              ],
            },
            {
              name: '全局综合查统',
              icon: 'smile',
              path: '/seo',
              routes: [
                {
                  path: '/seo/Search',
                  name: '综合查询',
                  icon: 'smile',
                  component: './seo/Search',
                },
                {
                  path: '/seo/Form',
                  name: '统计报表',
                  icon: 'smile',
                  routes: [
                    {
                      name: '刑事案件登记表',
                      icon: 'smile',
                      path: '/seo/Form/CriminalForm',
                      component: './seo/CriminalForm',
                    },
                    {
                      name: '行政案件登记表',
                      icon: 'smile',
                      path: '/seo/Form/AdministrationForm',
                      component: './seo/AdministrationForm',
                    },
                  ],
                },
              ],
            },
            {
              name: '消息中心',
              icon: 'smile',
              path: '/Message',
              routes: [
                {
                  path: '/Message/mySupervise',
                  name: '我的督办',
                  icon: 'smile',
                  component: './Message/mySupervise',
                },
                {
                  path: '/Message/MessageLog',
                  name: '消息推送日志',
                  icon: 'smile',
                  component: './Message/MessageLog',
                },
              ],
            },
            {
              name: '系统配置',
              icon: 'smile',
              path: '/systemSetup',
              routes: [
                {
                  path: '/systemSetup/SuperviseSetup',
                  name: '监管配置',
                  icon: 'smile',
                  component: './systemSetup/SuperviseSetup',
                },
                {
                  path: '/systemSetup/ShowSetup',
                  name: '投屏设置',
                  icon: 'smile',
                  component: './systemSetup/ShowSetup',
                },
                {
                  path: '/systemSetup/SuperviseSetup/Detail',
                  name: '监管配置详情',
                  icon: 'smile',
                  component: './systemSetup/SuperviseSetup/detail.tsx',
                  hideInMenu: true,
                },
                {
                  path: '/systemSetup/MessagePush',
                  name: '消息推送',
                  icon: 'smile',
                  component: './systemSetup/MessagePush',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ];
  return route;
}
