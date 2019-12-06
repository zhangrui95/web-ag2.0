import React, { useState, useEffect } from 'react';
import { Tabs, Card, Icon } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { routerRedux } from 'dva/router';
import { getMenuData } from '@ant-design/pro-layout';
import { NavigationItem } from './navigation';
import styles from './index.less';
import stylesAll from '@/theme/darkTheme.less';

const { TabPane } = Tabs;
const Navigation = props => {
  const { navigationData, dispatch, location,children,history } = props; // //如果导航是空数组，则将当前路由
  // 获取到当前路由
  const currentUrl = location.pathname;
  let queryLoc = location.query;
  const id = location.query && location.query.id ? location.query.id : '';
  // 获取到当前路由对应的路径的唯一标识key
  let index = navigationData.findIndex((item: NavigationItem) => {
    return (
      item.path + '?id=' + (item.query && item.query.id ? item.query.id : '') ===
      currentUrl + '?id=' + id
    );
  });
  const selectTabKey = index > -1 ? navigationData[index].key : '';
  // 定义当前选中的Tab
  const [activeKey, setActiveKey] = useState<string>('');
  // 监听页面路由变化，一旦路由变化，默认选中的tab跟着变化
  useEffect(() => {
    if (selectTabKey) {
        if(navigationData[index].children){
            if(navigationData[index].isReset){
                props.history.replace("/");
                dispatch(routerRedux.push({pathname:navigationData[index].path, query:{isReset: true}}));
            }
            setActiveKey(selectTabKey);
        }else{
            let query = navigationData[index].query;
            if(query){
                dispatch( routerRedux.push({
                    pathname: navigationData[index].path,
                    query: query,
                }));
            }else {
                dispatch(routerRedux.push(navigationData[index].path));
            }
            navigationData[index].children = children;
            setActiveKey(selectTabKey);
        }
    } else {
      // 没有tab情况下，将当前页面的路由对比数据添加tab
      const {
        route: { routes },
      } = props;
      //根据路由获取到所有平铺路由
      const { breadcrumb } = getMenuData(routes);
      const item = breadcrumb[currentUrl];
      if (dispatch && item) {
          let payload = {
              key: id ? item.path + id : item.path,
              name: item.name,
              path: item.path,
              isShow: true,
              query:queryLoc,
          };
        sessionStorage.setItem('query',JSON.stringify(payload));
        dispatch({
          type: 'global/changeNavigation',
          payload: {
            ...payload,
            children,
          },
        });
          dispatch({
              type: 'global/changeSessonNavigation',
              payload: payload,
          });
      }
    }
  }, [selectTabKey]);
  // tab选中值切换变化
  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    //根据key获取到当前tab信息，并跳转页面
    const tabItem = getItemByKey(activeKey);
    let query = tabItem.query;
    if(query){
        dispatch( routerRedux.push({
            pathname: tabItem.path,
            query: query,
        }));
    }else {
        dispatch(routerRedux.push(tabItem.path));
    }
  };

  const getItemByKey = (key: string): NavigationItem => {
    const index = navigationData.findIndex((item: NavigationItem) => item.key === key);
    return navigationData[index];
  };

  const onEdit = key => {
    // 删除当前tab并且将路由跳转至前一个tab的path
    if (dispatch) {
        dispatch({
            type: 'global/changeSessonNavigation',
            payload: {
                key,
                isShow: false,
            },
        });
      dispatch({
        type: 'global/changeNavigation',
        payload: {
          key,
          isShow: false,
        },
        callback: (data: NavigationItem[]) => {
          // 当前删除为选中项
          //   // 将路由跳转至前一个tab
            const selectTabKey = data[data.length - 1].key;
            setActiveKey(selectTabKey);
              let query = data[data.length - 1].query ? data[data.length - 1].query : null
              if(query){
                  let pathUrl = data[data.length - 1].path;
                  dispatch( routerRedux.push({
                      pathname: pathUrl,
                      query: query,
                  }));
              }else{
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
        dispatch(routerRedux.push('/ShowData/RegulatePanel')),
    });
      dispatch({
          type: 'global/changeSessonNavigation',
          payload: {},
      });
  };

  const showTab = [...navigationData];
  return (
      <div
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
              animated={false}
              onEdit={onEdit}
          >
              {showTab.map((pane: NavigationItem) => (
                  <TabPane
                      tab={pane.name}
                      key={pane.key}
                      closable={pane.key !== '/ShowData/RegulatePanel'}
                  >
                      <div className={styles.box}>{pane.children}</div>
                  </TabPane>
              ))}
          </Tabs>
          {showTab.length > 3 ? (
              <div className={styles.close} onClick={closeAll}>
                  关闭所有
                  <Icon className={styles.closeIcon} type="close" />
              </div>
          ) :  <div className={styles.closes}></div>}
      </div>
  );
};

export default connect(({ global }: ConnectState) => ({
  navigationData: global.navigation,
}))(Navigation);
