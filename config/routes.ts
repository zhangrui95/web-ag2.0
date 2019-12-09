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
              icon:  'icon-jingwuicon_svg_huaban',
              component: './ShowData/RegulatePanel',
            },
            {
              path: '/ShowData/MyNews',
              name: '首页我的消息查看',
              icon: 'icon-jingwuicon_svg_huaban',
              component: './ShowData/MyNews',
              hideInMenu: true,
            },
            {
              path: '/ShowData/MyShare',
              name: '首页我的分享查看',
              icon: 'icon-jingwuicon_svg_huaban',
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
              icon: 'icon-yichuligaojing',
              path: '/receivePolice',
              routes: [
                {
                  path: '/receivePolice/AlarmData',
                  name: '警情数据',
                  icon: 'icon-weibiaoti--',
                  component: './receivePolice/AlarmData',
                },
                {
                  path: '/receivePolice/AlarmData/policeDetail',
                  name: '警情数据详情',
                  icon: 'icon-weibiaoti--',
                  component: './receivePolice/AlarmData/policeDetail',
                  hideInMenu: true,
                },
                {
                  path: '/receivePolice/AlarmWarning',
                  name: '警情预警',
                  icon: 'icon-yujing',
                  component: './receivePolice/AlarmWarning',
                },
                {
                  path: '/receivePolice/AlarmPolice',
                  name: '警情告警',
                  icon: 'icon-gaojing',
                  component: './receivePolice/AlarmPolice',
                },
                {
                  path: '/receivePolice/AlarmPolice/unpoliceDetail',
                  name: '警情告警详情',
                  icon: 'icon-gaojing',
                  component: './receivePolice/AlarmPolice/unpoliceDetail',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: '受立案',
              icon: 'icon-lianxinxi',
              path: '/caseFiling',
              routes: [
                {
                  name: '案件数据',
                  icon: 'icon-weibiaoti--',
                  path: '/caseFiling/caseData',
                  routes: [
                    {
                      name: '刑事案件数据',
                      path: '/caseFiling/caseData/CriminalData',
                      component: './caseFiling/CriminalData',
                    },
                    {
                      path: '/caseFiling/caseData/CriminalData/caseDetail',
                      name: '刑事案件数据详情',
                      component: './caseFiling/CriminalData/caseDetail',
                      hideInMenu: true,
                    },
                    {
                      name: '行政案件数据',
                      path: '/caseFiling/caseData/AdministrationData',
                      component: './caseFiling/AdministrationData',
                    },
                    {
                      path: '/caseFiling/caseData/AdministrationData/caseDetail',
                      name: '行政案件数据详情',
                      component: './caseFiling/AdministrationData/caseDetail',
                      hideInMenu: true,
                    },
                  ],
                },
                {
                  name: '案件预警',
                  icon: 'icon-yujing',
                  path: '/caseFiling/caseWarning',
                  routes: [
                    {
                      name: '刑事案件预警',
                      path: '/caseFiling/caseWarning/CriminalWarning',
                      component: './caseFiling/CriminalWarning',
                    },
                    {
                      name: '行政案件预警',
                      path: '/caseFiling/caseWarning/AdministrationWarning',
                      component: './caseFiling/AdministrationWarning',
                    },
                  ],
                },
                {
                  name: '案件告警',
                  icon: 'icon-gaojing',
                  path: '/caseFiling/casePolice',
                  routes: [
                    {
                      name: '刑事案件告警',
                      path: '/caseFiling/casePolice/CriminalPolice',
                      component: './caseFiling/CriminalPolice',
                    },
                    {
                      name: '刑事案件告警详情',
                      path: '/caseFiling/casePolice/CriminalPolice/uncaseDetail',
                      component: './caseFiling/CriminalPolice/uncaseDetail',
                      hideInMenu: true,
                    },
                    {
                      name: '行政案件告警',
                      path: '/caseFiling/casePolice/AdministrationPolice',
                      component: './caseFiling/AdministrationPolice',
                    },
                    {
                      name: '行政案件告警详情',
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
              icon: 'icon-chouchajiancha',
              path: '/enforcementCase',
              routes: [
                {
                  name: '案件数据',
                  icon: 'icon-weibiaoti--',
                  path: '/enforcementCase/caseData',
                  routes: [
                    {
                      name: '刑事案件数据',
                      path: '/enforcementCase/caseData/CriminalData',
                      component: './enforcementCase/CriminalData',
                    },
                    {
                      name: '行政案件数据',
                      path: '/enforcementCase/caseData/AdministrationData',
                      component: './enforcementCase/AdministrationData',
                    },
                  ],
                },
                {
                  name: '案件预警',
                  icon: 'icon-yujing',
                  path: '/enforcementCase/caseWarning',
                  routes: [
                    {
                      name: '刑事案件预警',
                      path: '/enforcementCase/caseWarning/CriminalWarning',
                      component: './enforcementCase/CriminalWarning',
                    },
                    {
                      name: '行政案件预警',
                      path: '/enforcementCase/caseWarning/AdministrationWarning',
                      component: './enforcementCase/AdministrationWarning',
                    },
                  ],
                },
                {
                  name: '案件告警',
                  icon: 'icon-gaojing',
                  path: '/enforcementCase/casePolice',
                  routes: [
                    {
                      name: '刑事案件告警',
                      path: '/enforcementCase/casePolice/CriminalPolice',
                      component: './enforcementCase/CriminalPolice',
                    },
                    {
                      name: '行政案件告警',
                      path: '/enforcementCase/casePolice/AdministrationPolice',
                      component: './enforcementCase/AdministrationPolice',
                    },
                  ],
                },
              ],
            },
            {
              name: '办案区',
              icon: 'icon-bananzhushou',
              path: '/handlingArea',
              routes: [
                {
                  path: '/handlingArea/AreaData',
                  name: '办案区数据',
                  icon: 'icon-weibiaoti--',
                  component: './handlingArea/AreaData',
                },
                {
                  path: '/handlingArea/AreaData/areaDetail',
                  name: '办案区数据详情',
                  component: './handlingArea/AreaData/areaDetail',
                  hideInMenu: true,
                },
                {
                  path: '/handlingArea/AreaWarning',
                  name: '办案区预警',
                  icon: 'icon-yujing',
                  component: './handlingArea/AreaWarning',
                },
                {
                  path: '/handlingArea/AreaPolice',
                  name: '办案区告警',
                  icon: 'icon-gaojing',
                  component: './handlingArea/AreaPolice',
                },
                {
                  path: '/handlingArea/AreaPolice/UnareaDetail',
                  name: '办案区告警详情',
                  component: './handlingArea/AreaPolice/UnareaDetail',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: '涉案物品',
              icon: 'icon-cz-wpdj',
              path: '/articlesInvolved',
              routes: [
                {
                  path: '/articlesInvolved/ArticlesData',
                  name: '涉案物品数据',
                  icon: 'icon-weibiaoti--',
                  component: './articlesInvolved/ArticlesData',
                },
                {
                  path: '/articlesInvolved/ArticlesData/itemDetail',
                  name: '涉案物品数据详情',
                  component: './articlesInvolved/ArticlesData/itemDetail',
                  hideInMenu: true,
                },
                {
                  path: '/articlesInvolved/ArticlesWarning',
                  name: '涉案物品预警',
                  icon: 'icon-yujing',
                  component: './articlesInvolved/ArticlesWarning',
                },
                {
                  path: '/articlesInvolved/ArticlesPolice',
                  name: '涉案物品告警',
                  icon: 'icon-gaojing',
                  component: './articlesInvolved/ArticlesPolice',
                },
                {
                  path: '/articlesInvolved/ArticlesPolice/unitemDetail',
                  name: '涉案物品告警详情',
                  component: './articlesInvolved/ArticlesPolice/unitemDetail',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: '卷宗',
              icon: 'icon-shijuanguanli',
              path: '/dossierPolice',
              routes: [
                {
                  path: '/dossierPolice/DossierData',
                  name: '卷宗数据',
                  icon: 'icon-weibiaoti--',
                  component: './dossierPolice/DossierData',
                },
                {
                  path: '/dossierPolice/DossierWarning',
                  name: '卷宗预警',
                  icon: 'icon-yujing',
                  component: './dossierPolice/DossierWarning',
                },
                {
                  path: '/dossierPolice/DossierPolice',
                  name: '卷宗告警',
                  icon: 'icon-gaojing',
                  component: './dossierPolice/DossierPolice',
                },
              ],
            },
            {
              name: '要素趋势分析',
              icon: 'icon-xiaoshouqushi',
              path: '/trendAnalysis',
              routes: [
                {
                  path: '/trendAnalysis/PoliceAnalysis',
                  name: '警情分析',
                  icon: 'icon-ico_fenxi',
                  component: './trendAnalysis/PoliceAnalysis',
                },
                {
                  path: '/trendAnalysis/caseAnalysis',
                  name: '案件分析',
                  icon: 'icon-kehangxingfenxi',
                  routes: [
                    {
                      name: '刑事案件分析',
                      path: '/trendAnalysis/caseAnalysis/CriminaAnalysis',
                      component: './trendAnalysis/CriminaAnalysis',
                    },
                    // {
                    //   name: '行政案件分析',
                    //   path: '/trendAnalysis/caseAnalysis/AdministrationAnalysis',
                    //   component: './trendAnalysis/AdministrationAnalysis',
                    // },
                  ],
                },
                {
                  path: '/trendAnalysis/PersonPolice',
                  name: '涉案人员分析',
                  icon: 'icon-fenxi1',
                  component: './trendAnalysis/PersonPolice',
                },
              ],
            },
            {
              name: '执法考评',
              icon: 'icon-jixiaokaoping',
              path: '/Evaluation',
              routes: [
                {
                  path: '/Evaluation/CaseEvaluation',
                  name: '案件考评',
                  icon: 'icon-pingjiaguanli',
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
                  icon: 'icon-dangan1',
                  routes: [
                    {
                      name: '单位执法档案',
                      path: '/Evaluation/File/CompanyFile',
                      component: './Evaluation/CompanyFile',
                    },
                    {
                      name: '民警执法档案',
                      path: '/Evaluation/File/PoliceFile',
                      component: './Evaluation/PoliceFile',
                    },
                  ],
                },
              ],
            },
            {
              name: '全息执法档案',
              icon: 'icon-changyongtubiao-xianxingdaochu-zhuanqu-',
              path: '/lawEnforcement',
              routes: [
                {
                  path: '/lawEnforcement/File',
                  name: '案件档案',
                  icon: 'icon-wj-jcda',
                  routes: [
                    {
                      name: '刑事案件档案',
                      path: '/lawEnforcement/File/CriminalFile',
                      component: './lawEnforcement/CriminalFile',
                    },
                    {
                      name: '刑事案件档案详情',
                      path: '/lawEnforcement/File/CriminalFile/Detail',
                      component: './lawEnforcement/CriminalFile/detail.tsx',
                      hideInMenu: true,
                    },
                    {
                      name: '行政案件档案',
                      path: '/lawEnforcement/File/AdministrativeFile',
                      component: './lawEnforcement/AdministrativeFile',
                    },
                    {
                      name: '行政案件档案详情',
                      path: '/lawEnforcement/File/AdministrativeFile/Detail',
                      component: './lawEnforcement/AdministrativeFile/detail.tsx',
                      hideInMenu: true,
                    },
                  ],
                },
                {
                  path: '/lawEnforcement/PersonFile',
                  name: '人员档案',
                  icon: 'icon-renyuankaoqin-copy-copy',
                  component: './lawEnforcement/PersonFile',
                },
                {
                  name: '人员档案详情',
                  path: '/lawEnforcement/PersonFile/Detail',
                  component: './lawEnforcement/PersonFile/detail.tsx',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: '全局综合查统',
              icon: 'icon-zonghezhenduan',
              path: '/seo',
              routes: [
                {
                  path: '/seo/Search',
                  name: '综合查询',
                  icon: 'icon-sousuo',
                  component: './seo/Search',
                },
                {
                  path: '/seo/Form',
                  name: '统计报表',
                  icon: 'icon-baobiao',
                  routes: [
                    {
                      name: '刑事案件登记表',
                      path: '/seo/Form/AllForm/XSAJDJB',
                      component: './seo/AllForm/XSAJDJB',
                    },
                    {
                      name: '行政案件登记表',
                      path: '/seo/Form/AllForm/XZAJDJB',
                      component: './seo/AllForm/XZAJDJB',
                    },
                    {
                      name: '人员处置台账',
                      path: '/seo/Form/AllForm/RYCZTZ',
                      component: './seo/AllForm/RYCZTZ',
                    },
                    {
                      name: '吸毒人员统计',
                      path: '/seo/Form/AllForm/XZAJXDRYTJ',
                      component: './seo/AllForm/XZAJXDRYTJ',
                    },
                    {
                      name: '所内处罚',
                      path: '/seo/Form/AllForm/XZAJSNCF',
                      component: './seo/AllForm/XZAJSNCF',
                    },
                    {
                      name: '案卷出室登记',
                      path: '/seo/Form/AllForm/JZCSDJB',
                      component: './seo/AllForm/JZCSDJB',
                    },
                    {
                      name: '刑事案件办理监督',
                      path: '/seo/Form/AllForm/XSAJBLJDGLTZ',
                      component: './seo/AllForm/XSAJBLJDGLTZ',
                    },
                    {
                      name: '行政案件办理监督',
                      path: '/seo/Form/AllForm/XZAJBLJDGLTZ',
                      component: './seo/AllForm/XZAJBLJDGLTZ',
                    },
                    {
                      name: '每日警情巡查',
                      path: '/seo/Form/AllForm/MRJQXCDJB',
                      component: './seo/AllForm/MRJQXCDJB',
                    },
                    {
                      name: '受立案监督管理',
                      path: '/seo/Form/AllForm/SLAQKJDGLDJB',
                      component: './seo/AllForm/SLAQKJDGLDJB',
                    },
                  ],
                },
              ],
            },
            {
              name: '消息中心',
              icon: 'icon-mn_xiaoxi1',
              path: '/Message',
              routes: [
                {
                  path: '/Message/mySupervise',
                  name: '我的督办',
                  icon: 'icon-jianduchuanhuo',
                  component: './Message/mySupervise',
                },
                {
                  path: '/Message/MessageLog',
                  name: '消息推送日志',
                  icon: 'icon-quanju_duanxintuisong',
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
              icon: 'icon-peizhiguanli',
              path: '/systemSetup',
              routes: [
                {
                  path: '/systemSetup/SuperviseSetup',
                  name: '监管配置',
                  icon: 'icon-erji-dapingjianguan',
                  component: './systemSetup/SuperviseSetup',
                },
                {
                  path: '/setupShow',
                  name: '投屏设置',
                  icon: 'icon-touping',
                  target: '_blank',
                },
              {
                  path: '/systemSetup/EvaluationSetup',
                  name: '考评配置',
                  icon: 'icon-jixiaokaoping',
                  component: './systemSetup/EvaluationSetup',
              },{
                      path: '/systemSetup/EvaluationSetup/Add',
                      name: '添加考评配置',
                      component: './systemSetup/EvaluationSetup/add.tsx',
                      hideInMenu: true,
                  },
                {
                  path: '/systemSetup/SuperviseSetup/Detail',
                  name: '监管点详情',
                  component: './systemSetup/SuperviseSetup/detail.tsx',
                  hideInMenu: true,
                },{
                  path: '/systemSetup/SuperviseSetup/Add',
                  name: '添加监管点',
                  component: './systemSetup/SuperviseSetup/add.tsx',
                  hideInMenu: true,
                },{
                  path: '/systemSetup/SuperviseSetup/Update',
                  name: '修改监管点',
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
                  icon: 'icon-xiaoxixinfengnews',
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
