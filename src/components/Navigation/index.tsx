import React, { useState, useEffect } from 'react';
import { Tabs, Card, Icon } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { routerRedux } from 'dva/router';
import { getMenuData } from '@ant-design/pro-layout';
import { NavigationItem } from './navigation';
import styles from './index.less';

const { TabPane } = Tabs;

const Navigation = props => {
  const { navigationData, dispatch, location } = props; // //如果导航是空数组，则将当前路由

  // 获取到当前路由
  const currentUrl = location.pathname;
  const query = location.query;
  // 获取到当前路由对应的路径的唯一标识key
  const index = navigationData.findIndex((item: NavigationItem) => item.path === currentUrl);
  const selectTabKey = index > -1 ? navigationData[index].key : '';

  // 定义当前选中的Tab
  const [activeKey, setActiveKey] = useState<string>('');
  // 监听页面路由变化，一旦路由变化，默认选中的tab跟着变化
  useEffect(() => {
    if (selectTabKey) {
      dispatch(routerRedux.push(navigationData[index].query ? {pathname: navigationData[index].path, query: navigationData[index].query} : navigationData[index].path));
      setActiveKey(selectTabKey);
    } else {
      // 没有tab情况下，将当前页面的路由对比数据添加tab
      const {
        route: { routes },
      } = props;
      //根据路由获取到所有平铺路由
      const { breadcrumb } = getMenuData(routes);
      const item = breadcrumb[currentUrl];
      if (dispatch && item) {
        dispatch({
          type: 'global/changeNavigation',
          payload: {
            key: item.path,
            name: item.name,
            path: item.path,
            isShow: true,
            query,
          },
        });
      }
    }
  }, [selectTabKey]);
  // tab选中值切换变化
  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    //根据key获取到当前tab信息，并跳转页面
    const tabItem = getItemByKey(activeKey);
    dispatch(routerRedux.push(tabItem.query ? {pathname: tabItem.path, query: tabItem.query} : tabItem.path));
  };

  const getItemByKey = (key: string): NavigationItem => {
    const index = navigationData.findIndex((item: NavigationItem) => item.key === key);
    return navigationData[index];
  };

  const onEdit = key => {
    // 删除当前tab并且将路由跳转至前一个tab的path
    if (dispatch) {
      dispatch({
        type: 'global/changeNavigation',
        payload: {
          key,
          isShow: false,
        },
        callback: (data: NavigationItem[]) => {
          // 当前删除为选中项
          if (key === activeKey) {
            // 将路由跳转至前一个tab
            const selectTabKey = data[data.length - 1].key;
            setActiveKey(selectTabKey);
            dispatch(routerRedux.push(data[data.length - 1].path));
          }
        },
      });
    }
  };

  //关闭所有tab并将路由跳转回首页
  const closeAll = () => {
    dispatch({
      type: 'global/changeNavigation',
      payload: {},
      callback: () =>
        //跳转回首页
        dispatch(routerRedux.push('/')),
    });
  };

  const showTab = [...navigationData];
  return (
    <Card
      className={styles.card}
      bodyStyle={{
        padding: '0',
        position: 'relative',
        // display: 'flex',
        // alignItems: 'center',
      }}
    >
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        animated={true}
        onEdit={onEdit}
      >
        {showTab.map((pane: NavigationItem) => (
          <TabPane
            tab={pane.name}
            key={pane.key}
            closable={pane.key !== '/ShowData/RegulatePanel'}
          ></TabPane>
        ))}
      </Tabs>
      {/*{showTab.length > 3 ? (*/}
      {/*  <div className={styles.close} onClick={closeAll}>*/}
      {/*    关闭所有*/}
      {/*    <Icon className={styles.closeIcon} type="close" />*/}
      {/*  </div>*/}
      {/*) : null}*/}
    </Card>
  );
};

export default connect(({ global }: ConnectState) => ({
  navigationData: global.navigation,
}))(Navigation);
