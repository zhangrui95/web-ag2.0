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
      path: '/setupShow',
      component: '../layouts/setupShow',
    },
    {
      path: '/Show',
      component: '../layouts/bigShow',
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
              icon:
                'https://drm-file.lanhuapp.com/skthumb-f7300995-a0a1-4223-82f2-b40cde5f36d5-CDs7odnJl0WXGDq1.png',
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
              path: '/ShowData/MyShare',
              name: '首页我的分享查看',
              icon: 'home',
              component: './ShowData/MyShare',
              hideInMenu: true,
            },
            // {
            //   path: '/ShowData/MyDb',
            //   name: '首页我的督办查看',
            //   icon: 'home',
            //   component: './ShowData/MyDb',
            //   hideInMenu: true,
            // },
            {
              name: '接处警',
              icon:
                'https://drm-file.lanhuapp.com/skthumb-862316d9-fc77-49b9-8ab1-bd1660d7d337-DzC7LFXGSfsvJZka.png',
              path: '/receivePolice',
              routes: [
                {
                  path: '/receivePolice/AlarmData',
                  name: '警情数据',
                  icon: 'smile',
                  component: './receivePolice/AlarmData',
                },
                {
                  path: '/receivePolice/AlarmData/policeDetail',
                  name: '警情数据详情',
                  icon: 'smile',
                  component: './receivePolice/AlarmData/policeDetail',
                  hideInMenu: true,
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
                {
                  path: '/receivePolice/AlarmPolice/unpoliceDetail',
                  name: '警情告警详情',
                  icon: 'smile',
                  component: './receivePolice/AlarmPolice/unpoliceDetail',
                  hideInMenu: true,
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
                      path: '/caseFiling/caseData/CriminalData/caseDetail',
                      name: '刑事案件数据详情',
                      icon: 'smile',
                      component: './caseFiling/CriminalData/caseDetail',
                      hideInMenu: true,
                    },
                    {
                      name: '行政案件数据',
                      icon: 'smile',
                      path: '/caseFiling/caseData/AdministrationData',
                      component: './caseFiling/AdministrationData',
                    },
                    {
                      path: '/caseFiling/caseData/AdministrationData/caseDetail',
                      name: '行政案件数据详情',
                      icon: 'smile',
                      component: './caseFiling/AdministrationData/caseDetail',
                      hideInMenu: true,
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
                      name: '刑事案件告警详情',
                      icon: 'smile',
                      path: '/caseFiling/casePolice/CriminalPolice/uncaseDetail',
                      component: './caseFiling/CriminalPolice/uncaseDetail',
                      hideInMenu: true,
                    },
                    {
                      name: '行政案件告警',
                      icon: 'smile',
                      path: '/caseFiling/casePolice/AdministrationPolice',
                      component: './caseFiling/AdministrationPolice',
                    },
                    {
                      name: '行政案件告警详情',
                      icon: 'smile',
                      path: '/caseFiling/casePolice/AdministrationPolice/uncaseDetail',
                      component: './caseFiling/AdministrationPolice/caseDetail',
                      hideInMenu: true,
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
                  path: '/handlingArea/AreaData/areaDetail',
                  name: '办案区数据详情',
                  icon: 'smile',
                  component: './handlingArea/AreaData/areaDetail',
                  hideInMenu: true,
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
                {
                  path: '/handlingArea/AreaPolice/UnareaDetail',
                  name: '办案区告警详情',
                  icon: 'smile',
                  component: './handlingArea/AreaPolice/UnareaDetail',
                  hideInMenu: true,
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
                  path: '/articlesInvolved/ArticlesData/itemDetail',
                  name: '涉案物品数据详情',
                  icon: 'smile',
                  component: './articlesInvolved/ArticlesData/itemDetail',
                  hideInMenu: true,
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
                {
                  path: '/articlesInvolved/ArticlesPolice/unitemDetail',
                  name: '涉案物品告警详情',
                  icon: 'smile',
                  component: './articlesInvolved/ArticlesPolice/unitemDetail',
                  hideInMenu: true,
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
                  path: '/dossierPolice/DossierData/DossierDetail',
                  name: '卷宗数据详情',
                  icon: 'smile',
                  component: './dossierPolice/DossierData/DossierDetail',
                  hideInMenu: true,
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
                {
                  path: '/dossierPolice/DossierPolice/UnDossierDetail',
                  name: '卷宗告警详情',
                  icon: 'smile',
                  component: './dossierPolice/DossierPolice/UnDossierDetail',
                  hideInMenu: true,
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
                      name: '刑事案件分析',
                      icon: 'smile',
                      path: '/trendAnalysis/caseAnalysis/CriminaAnalysis',
                      component: './trendAnalysis/CriminaAnalysis',
                    },
                    // {
                    //   name: '行政案件分析',
                    //   icon: 'smile',
                    //   path: '/trendAnalysis/caseAnalysis/AdministrationAnalysis',
                    //   component: './trendAnalysis/AdministrationAnalysis',
                    // },
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
                  name: '考评',
                  icon: 'smile',
                  path: '/Evaluation/CaseEvaluation/Detail',
                  component: './Evaluation/CaseEvaluation/detail',
                  hideInMenu: true,
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
                      name: '刑事案件档案详情',
                      icon: 'smile',
                      path: '/lawEnforcement/File/CriminalFile/Detail',
                      component: './lawEnforcement/CriminalFile/detail.tsx',
                      hideInMenu: true,
                    },
                    {
                      name: '行政案件档案',
                      icon: 'smile',
                      path: '/lawEnforcement/File/AdministrativeFile',
                      component: './lawEnforcement/AdministrativeFile',
                    },
                    {
                      name: '行政案件档案详情',
                      icon: 'smile',
                      path: '/lawEnforcement/File/AdministrativeFile/Detail',
                      component: './lawEnforcement/AdministrativeFile/detail.tsx',
                      hideInMenu: true,
                    },
                  ],
                },
                {
                  path: '/lawEnforcement/PersonFile',
                  name: '人员档案',
                  icon: 'smile',
                  component: './lawEnforcement/PersonFile',
                },
                {
                  name: '人员档案详情',
                  icon: 'smile',
                  path: '/lawEnforcement/PersonFile/Detail',
                  component: './lawEnforcement/PersonFile/detail.tsx',
                  hideInMenu: true,
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
                      path: '/seo/Form/AllForm/XSAJDJB',
                      component: './seo/AllForm/XSAJDJB',
                    },
                    {
                      name: '行政案件登记表',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/XZAJDJB',
                      component: './seo/AllForm/XZAJDJB',
                    },
                    {
                      name: '人员处置台账',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/RYCZTZ',
                      component: './seo/AllForm/RYCZTZ',
                    },
                    {
                      name: '吸毒人员统计',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/XZAJXDRYTJ',
                      component: './seo/AllForm/XZAJXDRYTJ',
                    },
                    {
                      name: '所内处罚',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/XZAJSNCF',
                      component: './seo/AllForm/XZAJSNCF',
                    },
                    {
                      name: '案卷出室登记',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/JZCSDJB',
                      component: './seo/AllForm/JZCSDJB',
                    },
                    {
                      name: '刑事案件办理监督',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/XSAJBLJDGLTZ',
                      component: './seo/AllForm/XSAJBLJDGLTZ',
                    },
                    {
                      name: '行政案件办理监督',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/XZAJBLJDGLTZ',
                      component: './seo/AllForm/XZAJBLJDGLTZ',
                    },
                    {
                      name: '每日警情巡查',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/MRJQXCDJB',
                      component: './seo/AllForm/MRJQXCDJB',
                    },
                    {
                      name: '受立案监督管理',
                      icon: 'smile',
                      path: '/seo/Form/AllForm/SLAQKJDGLDJB',
                      component: './seo/AllForm/SLAQKJDGLDJB',
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
                {
                  path: '/Message/MessageLog/MessagePushLog',
                  name: '消息推送日志详情',
                  icon: 'smile',
                  component: './Message/MessageLog/MessagePushLog.tsx',
                  hideInMenu: true,
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
                  path: '/setupShow',
                  name: '投屏设置',
                  icon: 'smile',
                  target: '_blank',
                },
              {
                  path: '/systemSetup/EvaluationSetup',
                  name: '考评配置',
                  icon: 'smile',
                  component: './systemSetup/EvaluationSetup',
              },{
                      path: '/systemSetup/EvaluationSetup/Add',
                      name: '添加考评配置',
                      icon: 'smile',
                      component: './systemSetup/EvaluationSetup/add.tsx',
                      hideInMenu: true,
                  },
                {
                  path: '/systemSetup/SuperviseSetup/Detail',
                  name: '监管点详情',
                  icon: 'smile',
                  component: './systemSetup/SuperviseSetup/detail.tsx',
                  hideInMenu: true,
                },{
                  path: '/systemSetup/SuperviseSetup/Add',
                  name: '添加监管点',
                  icon: 'smile',
                  component: './systemSetup/SuperviseSetup/add.tsx',
                  hideInMenu: true,
                },{
                  path: '/systemSetup/SuperviseSetup/Update',
                  name: '修改监管点',
                  icon: 'smile',
                  component: './systemSetup/SuperviseSetup/update.tsx',
                  hideInMenu: true,
                },
                {
                  path: '/systemSetup/SuperviseSetup/Copy',
                  name: '复用监管点',
                  component: './systemSetup/SuperviseSetup/SuperviseCopy.tsx',
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
              name: '监管看板',
              target: '_blank',
              icon: 'fullscreen',
              path: '/Show',
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
