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
            // token登录
            path: '/loginByToken',
            component: '../layouts/LoginByToken',
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
                            icon: 'icon-jingwuicon_svg_huaban',
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
                            authority: ['zhag_jcj'],
                            routes: [
                                {
                                    path: '/receivePolice/AlarmData',
                                    name: '警情数据',
                                    icon: 'icon-weibiaoti--',
                                    component: './receivePolice/AlarmData',
                                    authority: ['zhag_jcj_jqsj'],
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
                                    authority: ['zhag_jcj_jqyj'],
                                },
                                {
                                    path: '/receivePolice/AlarmPolice',
                                    name: '警情告警',
                                    icon: 'icon-gaojing',
                                    component: './receivePolice/AlarmPolice',
                                    authority: ['zhag_jcj_jqgj'],
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
                        // {
                        //     name: '受立案',
                        //     icon: 'icon-lianxinxi',
                        //     path: '/caseFiling',
                        //     authority: ['zhag_sla'],
                        //     routes: [
                        //         {
                        //             name: '案件数据',
                        //             icon: 'icon-weibiaoti--',
                        //             path: '/caseFiling/caseData',
                        //             authority: ['zhag_sla_sj'],
                        //             routes: [
                        //                 {
                        //                     name: '刑事案件数据',
                        //                     path: '/caseFiling/caseData/CriminalData',
                        //                     component: './caseFiling/CriminalData',
                        //                     authority: ['zhag_sla_sj_xs'],
                        //                 },
                        //                 {
                        //                     path: '/caseFiling/caseData/CriminalData/caseDetail',
                        //                     name: '刑事案件数据详情',
                        //                     component: './caseFiling/CriminalData/caseDetail',
                        //                     hideInMenu: true,
                        //                 },
                        //                 {
                        //                     name: '行政案件数据',
                        //                     path: '/caseFiling/caseData/AdministrationData',
                        //                     component: './caseFiling/AdministrationData',
                        //                     authority: ['zhag_sla_sj_xz'],
                        //                 },
                        //                 {
                        //                     path: '/caseFiling/caseData/AdministrationData/caseDetail',
                        //                     name: '行政案件数据详情',
                        //                     component: './caseFiling/AdministrationData/caseDetail',
                        //                     hideInMenu: true,
                        //                 },
                        //             ],
                        //         },
                        //         {
                        //             name: '案件预警',
                        //             icon: 'icon-yujing',
                        //             path: '/caseFiling/caseWarning',
                        //             authority: ['zhag_sla_yj'],
                        //             routes: [
                        //                 {
                        //                     name: '刑事案件预警',
                        //                     path: '/caseFiling/caseWarning/CriminalWarning',
                        //                     component: './caseFiling/CriminalWarning',
                        //                     authority: ['zhag_sla_yj_xs'],
                        //                 },
                        //                 {
                        //                     name: '行政案件预警',
                        //                     path: '/caseFiling/caseWarning/AdministrationWarning',
                        //                     component: './caseFiling/AdministrationWarning',
                        //                     authority: ['zhag_sla_yj_xz'],
                        //                 },
                        //             ],
                        //         },
                        //         {
                        //             name: '案件告警',
                        //             icon: 'icon-gaojing',
                        //             path: '/caseFiling/casePolice',
                        //             authority: ['zhag_jcj_gj'],
                        //             routes: [
                        //                 {
                        //                     name: '刑事案件告警',
                        //                     path: '/caseFiling/casePolice/CriminalPolice',
                        //                     component: './caseFiling/CriminalPolice',
                        //                     authority: ['zhag_jcj_gj_xs'],
                        //                 },
                        //                 {
                        //                     name: '刑事案件告警详情',
                        //                     path: '/caseFiling/casePolice/CriminalPolice/uncaseDetail',
                        //                     component: './caseFiling/CriminalPolice/uncaseDetail',
                        //                     hideInMenu: true,
                        //                 },
                        //                 {
                        //                     name: '行政案件告警',
                        //                     path: '/caseFiling/casePolice/AdministrationPolice',
                        //                     component: './caseFiling/AdministrationPolice',
                        //                     authority: ['zhag_jcj_gj_xz'],
                        //                 },
                        //                 {
                        //                     name: '行政案件告警详情',
                        //                     path: '/caseFiling/casePolice/AdministrationPolice/uncaseDetail',
                        //                     component: './caseFiling/AdministrationPolice/caseDetail',
                        //                     hideInMenu: true,
                        //                 },
                        //             ],
                        //         },
                        //     ],
                        // },
                      /*新受立案（受立案和执法办案合并开始）*/
                      {
                        name: '受立案',
                        icon: 'icon-lianxinxi',
                        path: '/newcaseFiling',
                        routes: [
                          {
                            name: '案件数据',
                            icon: 'icon-weibiaoti--',
                            path: '/newcaseFiling/caseData',
                            routes: [
                              {
                                name: '刑事案件数据',
                                path: '/newcaseFiling/caseData/CriminalData',
                                component: './newcaseFiling/CriminalData',
                              },
                              {
                                path: '/newcaseFiling/caseData/CriminalData/caseDetail',
                                name: '刑事案件数据详情',
                                component: './newcaseFiling/CriminalData/caseDetail',
                                hideInMenu: true,
                              },
                              {
                                name: '行政案件数据',
                                path: '/newcaseFiling/caseData/AdministrationData',
                                component: './newcaseFiling/AdministrationData',
                              },
                              {
                                path: '/newcaseFiling/caseData/AdministrationData/caseDetail',
                                name: '行政案件数据详情',
                                component: './newcaseFiling/AdministrationData/caseDetail',
                                hideInMenu: true,
                              },
                            ],
                          },
                          {
                            name: '案件预警',
                            icon: 'icon-yujing',
                            path: '/newcaseFiling/caseWarning',
                            routes: [
                              {
                                name: '刑事案件预警',
                                path: '/newcaseFiling/caseWarning/CriminalWarning',
                                component: './newcaseFiling/CriminalWarning',
                              },
                              {
                                name: '行政案件预警',
                                path: '/newcaseFiling/caseWarning/AdministrationWarning',
                                component: './newcaseFiling/AdministrationWarning',
                              },
                            ],
                          },
                          {
                            name: '案件告警',
                            icon: 'icon-gaojing',
                            path: '/newcaseFiling/casePolice',
                            routes: [
                              {
                                name: '刑事案件告警',
                                path: '/newcaseFiling/casePolice/CriminalPolice',
                                component: './newcaseFiling/CriminalPolice',
                              },
                              {
                                name: '刑事案件告警详情',
                                path: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                                component: './newcaseFiling/CriminalPolice/uncaseDetail',
                                hideInMenu: true,
                              },
                              {
                                name: '行政案件告警',
                                path: '/newcaseFiling/casePolice/AdministrationPolice',
                                component: './newcaseFiling/AdministrationPolice',
                              },
                              {
                                name: '行政案件告警详情',
                                path: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
                                component: './newcaseFiling/AdministrationPolice/caseDetail',
                                hideInMenu: true,
                              },
                            ],
                          },
                        ],
                      },
                      /*新受立案（受立案和执法办案合并结束）*/
                        // {
                        //     name: '执法办案',
                        //     icon: 'icon-chouchajiancha',
                        //     path: '/enforcementCase',
                        //     authority: ['zhag_zfba'],
                        //     routes: [
                        //         {
                        //             name: '案件数据',
                        //             icon: 'icon-weibiaoti--',
                        //             path: '/enforcementCase/caseData',
                        //             authority: ['zhag_zfba_ajsj'],
                        //             routes: [
                        //                 {
                        //                     name: '刑事案件数据',
                        //                     path: '/enforcementCase/caseData/CriminalData',
                        //                     component: './enforcementCase/CriminalData',
                        //                     authority: ['zhag_zfba_xsajsj'],
                        //                 },
                        //                 {
                        //                     name: '行政案件数据',
                        //                     path: '/enforcementCase/caseData/AdministrationData',
                        //                     component: './enforcementCase/AdministrationData',
                        //                     authority: ['zhag_zfba_xzajsj'],
                        //                 },
                        //             ],
                        //         },
                        //         {
                        //             name: '案件预警',
                        //             icon: 'icon-yujing',
                        //             path: '/enforcementCase/caseWarning',
                        //             authority: ['zhag_zfba_ajyj'],
                        //             routes: [
                        //                 {
                        //                     name: '刑事案件预警',
                        //                     path: '/enforcementCase/caseWarning/CriminalWarning',
                        //                     component: './enforcementCase/CriminalWarning',
                        //                     authority: ['zhag_zfba_xsajyj'],
                        //                 },
                        //                 {
                        //                     name: '行政案件预警',
                        //                     path: '/enforcementCase/caseWarning/AdministrationWarning',
                        //                     component: './enforcementCase/AdministrationWarning',
                        //                     authority: ['zhag_zfba_xzajyj'],
                        //                 },
                        //             ],
                        //         },
                        //         {
                        //             name: '案件告警',
                        //             icon: 'icon-gaojing',
                        //             path: '/enforcementCase/casePolice',
                        //             authority: ['zhag_zfba_ajgj'],
                        //             routes: [
                        //                 {
                        //                     name: '刑事案件告警',
                        //                     path: '/enforcementCase/casePolice/CriminalPolice',
                        //                     component: './enforcementCase/CriminalPolice',
                        //                     authority: ['zhag_zfba_xsajgj'],
                        //                 },
                        //                 {
                        //                     name: '行政案件告警',
                        //                     path: '/enforcementCase/casePolice/AdministrationPolice',
                        //                     component: './enforcementCase/AdministrationPolice',
                        //                     authority: ['zhag_zfba_xzajgj'],
                        //                 },
                        //             ],
                        //         },
                        //     ],
                        // },
                        {
                            name: '办案区',
                            icon: 'icon-bananzhushou',
                            path: '/handlingArea',
                            authority: ['zhag_baq'],
                            routes: [
                                {
                                    path: '/handlingArea/AreaData',
                                    name: '办案区数据',
                                    icon: 'icon-weibiaoti--',
                                    component: './handlingArea/AreaData',
                                    authority: ['zhag_baq_sj'],
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
                                    authority: ['zhag_baq_yj'],
                                },
                                {
                                    path: '/handlingArea/AreaPolice',
                                    name: '办案区告警',
                                    icon: 'icon-gaojing',
                                    component: './handlingArea/AreaPolice',
                                    authority: ['zhag_baq_gj'],
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
                            authority: ['zhag_sawp'],
                            routes: [
                                {
                                    path: '/articlesInvolved/ArticlesData',
                                    name: '涉案物品数据',
                                    icon: 'icon-weibiaoti--',
                                    component: './articlesInvolved/ArticlesData',
                                    authority: ['zhag_sawp_sj'],
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
                                    authority: ['zhag_sawp_yj'],
                                    component: './articlesInvolved/ArticlesWarning',
                                },
                                {
                                    path: '/articlesInvolved/ArticlesPolice',
                                    name: '涉案物品告警',
                                    icon: 'icon-gaojing',
                                    authority: ['zhag_sawp_gj'],
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
                            authority: ['zhag_jz'],
                            routes: [
                                {
                                    path: '/dossierPolice/DossierData',
                                    name: '卷宗数据',
                                    icon: 'icon-weibiaoti--',
                                    authority: ['zhag_jz_sj'],
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
                                    icon: 'icon-yujing',
                                    authority: ['zhag_jz_yj'],
                                    component: './dossierPolice/DossierWarning',
                                },
                                {
                                    path: '/dossierPolice/DossierPolice',
                                    name: '卷宗告警',
                                    icon: 'icon-gaojing',
                                    authority: ['zhag_jz_gj'],
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
                            icon: 'icon-xiaoshouqushi',
                            path: '/trendAnalysis',
                            authority: ['zhag_qsfx'],
                            routes: [
                                {
                                    path: '/trendAnalysis/PoliceAnalysis',
                                    name: '警情分析',
                                    icon: 'icon-ico_fenxi',
                                    authority: ['zhag_qsfx_jq'],
                                    component: './trendAnalysis/PoliceAnalysis',
                                },
                                {
                                    path: '/trendAnalysis/caseAnalysis',
                                    name: '案件分析',
                                    icon: 'icon-kehangxingfenxi',
                                    authority: ['zhag_qsfx_aj'],
                                    routes: [
                                        {
                                            name: '刑事案件分析',
                                            path: '/trendAnalysis/caseAnalysis/CriminaAnalysis',
                                            component: './trendAnalysis/CriminaAnalysis',
                                            authority: ['zhag_qsfx_aj_xs'],
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
                                    authority: ['zhag_qsfx_ry'],
                                    component: './trendAnalysis/PersonPolice',
                                },
                            ],
                        },
                        {
                            name: '执法考评',
                            icon: 'icon-jixiaokaoping',
                            path: '/Evaluation',
                            authority: ['zhag_zfkp'],
                            routes: [
                                {
                                    path: '/Evaluation/CaseEvaluation',
                                    name: '案件考评',
                                    icon: 'icon-pingjiaguanli',
                                    authority: ['zhag_zfkp_ajkp'],
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
                                    authority: ['zhag_zfkp_zfda'],
                                    routes: [
                                        {
                                            name: '单位执法档案',
                                            path: '/Evaluation/File/CompanyFile',
                                            component: './Evaluation/CompanyFile',
                                            authority: ['zhag_zfkp_zfda_dwzfda'],
                                        },
                                        {
                                            name: '案件查询',
                                            path: '/Evaluation/File/Search/ajSearch',
                                            component: './Evaluation/Search/ajSearch.tsx',
                                            hideInMenu: true,
                                        },
                                        {
                                            name: '民警执法档案',
                                            path: '/Evaluation/File/PoliceFile',
                                            component: './Evaluation/PoliceFile',
                                            authority: ['zhag_zfkp_zfda_mjzfda'],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: '全息执法档案',
                            icon: 'icon-changyongtubiao-xianxingdaochu-zhuanqu-',
                            path: '/lawEnforcement',
                            authority: ['zhag_zfda'],
                            routes: [
                                {
                                    path: '/lawEnforcement/File',
                                    name: '案件档案',
                                    icon: 'icon-wj-jcda',
                                    authority: ['zhag_zfda_aj'],
                                    routes: [
                                        {
                                            name: '刑事案件档案',
                                            path: '/lawEnforcement/File/CriminalFile',
                                            component: './lawEnforcement/CriminalFile',
                                            authority: ['zhag_zfda_aj_xs'],
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
                                            authority: ['zhag_zfda_aj_xz'],
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
                                    authority: ['zhag_zfda_ry'],
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
                            path: '/Tabulation/Make',
                            name: '制表',
                            component: './Tabulation/MakeTableModal.tsx',
                            hideInMenu: true,
                        }, {
                            path: '/Retrieve',
                            name: '退补侦查',
                            component: './Retrieve/RetrieveModal.tsx',
                            hideInMenu: true,
                        },
                        {
                            name: '全局综合查统',
                            icon: 'icon-zonghezhenduan',
                            path: '/seo',
                            authority: ['zhag_zhct'],
                            routes: [
                                {
                                    path: '/seo/Search',
                                    name: '综合查询',
                                    icon: 'icon-sousuo',
                                    component: './seo/Search',
                                    authority: ['zhag_zhct_zhcx'],
                                },
                                {
                                    path: '/seo/Form',
                                    name: '统计报表',
                                    icon: 'icon-baobiao',
                                    authority: ['zhag_zhct_tjbb'],
                                    routes: [
                                        {
                                            name: '刑事案件登记表',
                                            path: '/seo/Form/AllForm/XSAJDJB',
                                            component: './seo/AllForm/XSAJDJB',
                                            authority: ['zhag_dq_xsajdjb'],
                                        },
                                        {
                                            name: '行政案件登记表',
                                            path: '/seo/Form/AllForm/XZAJDJB',
                                            component: './seo/AllForm/XZAJDJB',
                                            authority: ['zhag_dq_xzajdjb'],
                                        },
                                        {
                                            name: '人员处置台账',
                                            path: '/seo/Form/AllForm/RYCZTZ',
                                            component: './seo/AllForm/RYCZTZ',
                                            authority: ['zhag_tj_rycztz'],
                                        },
                                        {
                                            name: '吸毒人员统计',
                                            path: '/seo/Form/AllForm/XZAJXDRYTJ',
                                            component: './seo/AllForm/XZAJXDRYTJ',
                                            authority: ['zhag_tj_xzajxdrytj'],
                                        },
                                        {
                                            name: '所内处罚',
                                            path: '/seo/Form/AllForm/XZAJSNCF',
                                            component: './seo/AllForm/XZAJSNCF',
                                            authority: ['zhag_tj_xzajsncf'],
                                        },
                                        {
                                            name: '案卷出室登记',
                                            path: '/seo/Form/AllForm/JZCSDJB',
                                            component: './seo/AllForm/JZCSDJB',
                                            authority: ['zhag_tj_jzcsdj'],
                                        },
                                        {
                                            name: '刑事案件办理监督',
                                            path: '/seo/Form/AllForm/XSAJBLJDGLTZ',
                                            component: './seo/AllForm/XSAJBLJDGLTZ',
                                            authority: ['zhag_tj_xsajzfjd'],
                                        },
                                        {
                                            name: '行政案件办理监督',
                                            path: '/seo/Form/AllForm/XZAJBLJDGLTZ',
                                            component: './seo/AllForm/XZAJBLJDGLTZ',
                                            authority: ['zhag_tj_xzajzfjd'],
                                        },
                                        {
                                            name: '每日警情巡查',
                                            path: '/seo/Form/AllForm/MRJQXCDJB',
                                            component: './seo/AllForm/MRJQXCDJB',
                                            authority: ['zhag_tj_mrjqxc'],
                                        },
                                        {
                                            name: '受立案监督管理',
                                            path: '/seo/Form/AllForm/SLAQKJDGLDJB',
                                            component: './seo/AllForm/SLAQKJDGLDJB',
                                            authority: ['zhag_tj_slajdgl'],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: '消息中心',
                            icon: 'icon-mn_xiaoxi1',
                            path: '/Message',
                            authority: ['zhag_xxzx'],
                            routes: [
                                {
                                    path: '/Message/mySupervise',
                                    name: '我的督办',
                                    icon: 'icon-jianduchuanhuo',
                                    component: './Message/mySupervise',
                                    authority: ['zhag_xxzx_wddb'],
                                },
                                {
                                    path: '/Message/MessageLog',
                                    name: '消息推送日志',
                                    icon: 'icon-quanju_duanxintuisong',
                                    component: './Message/MessageLog',
                                    authority: ['zhag_xxzx_xxtsrz'],
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
                            authority: ['zhag_xtpz'],
                            routes: [
                                {
                                    path: '/systemSetup/SuperviseSetup',
                                    name: '监管配置',
                                    icon: 'icon-erji-dapingjianguan',
                                    component: './systemSetup/SuperviseSetup',
                                    authority: ['zhag_xtpz_jgpz'],
                                },
                                {
                                    path: '/setupShow',
                                    name: '投屏设置',
                                    icon: 'icon-touping',
                                    target: '_blank',
                                    authority: ['zhag_xtpz_tpsz'],
                                },
                                {
                                    path: '/systemSetup/EvaluationSetup',
                                    name: '考评配置',
                                    icon: 'icon-jixiaokaoping',
                                    component: './systemSetup/EvaluationSetup',
                                    authority: ['zhag_xtpz_kppz'],
                                }, {
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
                                }, {
                                    path: '/systemSetup/SuperviseSetup/Add',
                                    name: '添加监管点',
                                    component: './systemSetup/SuperviseSetup/add.tsx',
                                    hideInMenu: true,
                                }, {
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
                                    authority: ['zhag_xtpz_xxts'],
                                },
                            ],
                        },
                        {
                            name: '监管看板',
                            target: '_blank',
                            icon: 'fullscreen',
                            path: '/Show',
                            authority: ['zhag_jgkb'],
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
