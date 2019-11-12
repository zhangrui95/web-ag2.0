import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  history:"hash",
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
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
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: '首页',
              icon: 'smile',
              component: './Welcome',
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
                  },{
                      path: '/receivePolice/AlarmWarning',
                      name: '警情预警',
                      icon: 'smile',
                      component: './receivePolice/AlarmWarning',
                  },{
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
                        },{
                            name: '行政案件数据',
                            icon: 'smile',
                            path: '/caseFiling/caseData/AdministrationData',
                            component: './caseFiling/AdministrationData',
                        }
                    ]
                },{
                  name: '案件预警',
                  icon: 'smile',
                  path: '/caseFiling/caseWarning',
                    routes: [
                        {
                            name: '刑事案件预警',
                            icon: 'smile',
                            path: '/caseFiling/caseWarning/CriminalWarning',
                            component: './caseFiling/CriminalWarning',
                        },{
                            name: '行政案件预警',
                            icon: 'smile',
                            path: '/caseFiling/caseWarning/AdministrationWarning',
                            component: './caseFiling/AdministrationWarning',
                        }
                    ]
                },{
                  name: '案件告警',
                  icon: 'smile',
                  path: '/caseFiling/casePolice',
                    routes: [
                        {
                            name: '刑事案件告警',
                            icon: 'smile',
                            path: '/caseFiling/casePolice/CriminalPolice',
                            component: './caseFiling/CriminalPolice',
                        },{
                            name: '行政案件告警',
                            icon: 'smile',
                            path: '/caseFiling/casePolice/AdministrationPolice',
                            component: './caseFiling/AdministrationPolice',
                        }
                    ]
                },
              ]
            },{
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
                              },{
                                  name: '行政案件数据',
                                  icon: 'smile',
                                  path: '/enforcementCase/caseData/AdministrationData',
                                  component: './enforcementCase/AdministrationData',
                              }
                          ]
                      },{
                          name: '案件预警',
                          icon: 'smile',
                          path: '/enforcementCase/caseWarning',
                          routes: [
                              {
                                  name: '刑事案件预警',
                                  icon: 'smile',
                                  path: '/enforcementCase/caseWarning/CriminalWarning',
                                  component: './enforcementCase/CriminalWarning',
                              },{
                                  name: '行政案件预警',
                                  icon: 'smile',
                                  path: '/enforcementCase/caseWarning/AdministrationWarning',
                                  component: './enforcementCase/AdministrationWarning',
                              }
                          ]
                      },{
                          name: '案件告警',
                          icon: 'smile',
                          path: '/enforcementCase/casePolice',
                          routes: [
                              {
                                  name: '刑事案件告警',
                                  icon: 'smile',
                                  path: '/enforcementCase/casePolice/CriminalPolice',
                                  component: './enforcementCase/CriminalPolice',
                              },{
                                  name: '行政案件告警',
                                  icon: 'smile',
                                  path: '/enforcementCase/casePolice/AdministrationPolice',
                                  component: './enforcementCase/AdministrationPolice',
                              }
                          ]
                      },
                  ]
              },{
                  name: '办案区',
                  icon: 'smile',
                  path: '/handlingArea',
                  routes: [
                      {
                          path: '/handlingArea/AreaData',
                          name: '办案区数据',
                          icon: 'smile',
                          component: './handlingArea/AreaData',
                      },{
                          path: '/handlingArea/AreaWarning',
                          name: '办案区预警',
                          icon: 'smile',
                          component: './handlingArea/AreaWarning',
                      },{
                          path: '/handlingArea/AreaPolice',
                          name: '办案区告警',
                          icon: 'smile',
                          component: './handlingArea/AreaPolice',
                      },
                  ],
              },{
                  name: '涉案物品',
                  icon: 'smile',
                  path: '/articlesInvolved',
                  routes: [
                      {
                          path: '/articlesInvolved/ArticlesData',
                          name: '涉案物品数据',
                          icon: 'smile',
                          component: './articlesInvolved/ArticlesData',
                      },{
                          path: '/articlesInvolved/ArticlesWarning',
                          name: '涉案物品预警',
                          icon: 'smile',
                          component: './articlesInvolved/ArticlesWarning',
                      },{
                          path: '/articlesInvolved/ArticlesPolice',
                          name: '涉案物品告警',
                          icon: 'smile',
                          component: './articlesInvolved/ArticlesPolice',
                      },
                  ],
              },{
                  name: '卷宗',
                  icon: 'smile',
                  path: '/dossierPolice',
                  routes: [
                      {
                          path: '/dossierPolice/DossierData',
                          name: '卷宗数据',
                          icon: 'smile',
                          component: './dossierPolice/DossierData',
                      },{
                          path: '/dossierPolice/DossierWarning',
                          name: '卷宗预警',
                          icon: 'smile',
                          component: './dossierPolice/DossierWarning',
                      },{
                          path: '/dossierPolice/DossierPolice',
                          name: '卷宗告警',
                          icon: 'smile',
                          component: './dossierPolice/DossierPolice',
                      },
                  ],
              },{
                  name: '要素趋势分析',
                  icon: 'smile',
                  path: '/trendAnalysis',
                  routes: [
                      {
                          path: '/trendAnalysis/PoliceAnalysis',
                          name: '警情分析',
                          icon: 'smile',
                          component: './trendAnalysis/PoliceAnalysis',
                      },{
                          path: '/trendAnalysis/caseAnalysis',
                          name: '案件分析',
                          icon: 'smile',
                          routes: [
                              {
                                  name: '刑事案件告警',
                                  icon: 'smile',
                                  path: '/trendAnalysis/caseAnalysis/CriminaAnalysis',
                                  component: './trendAnalysis/CriminaAnalysis',
                              },{
                                  name: '行政案件告警',
                                  icon: 'smile',
                                  path: '/trendAnalysis/caseAnalysis/AdministrationAnalysis',
                                  component: './trendAnalysis/AdministrationAnalysis',
                              }
                          ]
                      },{
                          path: '/trendAnalysis/PersonPolice',
                          name: '涉案人员分析',
                          icon: 'smile',
                          component: './trendAnalysis/PersonPolice',
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
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
} as IConfig;
