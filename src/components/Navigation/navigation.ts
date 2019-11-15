//导航中的数据格式
export interface NavigationItem {
  //展示名称
  name: string;
  //tab的唯一标识，同path相同
  key: string;
  //tab对应的路由
  path: string;
  content?: string;
  isShow?: boolean;
}
//导航组件中父组件传递参数的格式
export interface NavigationProps {
  navigationData: NavigationItem[];
}

//控制刚进入页面导航的展示
export let welcomeItem: NavigationItem = {
  key: '/ShowData/RegulatePanel',
  isShow: true,
  name: '首页',
  path: '/ShowData/RegulatePanel',
};
