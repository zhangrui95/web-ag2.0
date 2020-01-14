/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
    MenuDataItem,
    BasicLayoutProps as ProLayoutProps,
    Settings,
} from '@ant-design/pro-layout';
import React, {useEffect, useState} from 'react';
import Link from 'umi/link';
import {Dispatch} from 'redux';
import {connect} from 'dva';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {ConnectState} from '@/models/connect';
import logo from '../assets/logo.png';
import Navigation from '@/components/Navigation';
import styles from '@/theme/darkTheme.less';
import stylesLight from '@/theme/lightTheme.less';
import {message} from "antd";
import { watermark } from '../utils/function';


export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    settings: Settings;
    dispatch: Dispatch;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
    menuList.map(item => {
        const localItem = {...item, children: item.children ? menuDataRender(item.children) : []};
        return Authorized.check(item.authority, localItem, null) as MenuDataItem;
    });

// const defaultFooterDom = (
//   <DefaultFooter
//     copyright="2019 蚂蚁金服体验技术部出品"
//     links={[
//       {
//         key: 'Ant Design Pro',
//         title: 'Ant Design Pro',
//         href: 'https://pro.ant.design',
//         blankTarget: true,
//       },
//       {
//         key: 'github',
//         title: <Icon type="github" />,
//         href: 'https://github.com/ant-design/ant-design-pro',
//         blankTarget: true,
//       },
//       {
//         key: 'Ant Design',
//         title: 'Ant Design',
//         href: 'https://ant.design',
//         blankTarget: true,
//       },
//     ]}
//   />
// );

// const footerRender: BasicLayoutProps['footerRender'] = () => {
//   if (!isAntDesignPro()) {
//     return defaultFooterDom;
//   }

//   return (
//     <>
//       {defaultFooterDom}
//       <div
//         style={{
//           padding: '0px 24px 24px',
//           textAlign: 'center',
//         }}
//       >
//         <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
//           <img
//             src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
//             width="82px"
//             alt="netlify logo"
//           />
//         </a>
//       </div>
//     </>
//   );
// };

const BasicLayout: React.FC<BasicLayoutProps> = props => {
    const {dispatch, children, settings, dark,location} = props;
    /**
     * constructor
     */
    useEffect(() => {
        let options = {top:20,getContainer: () => document.getElementById('root')};
        message.config(options);
        if (dispatch) {
            // dispatch({
            //   type: 'user/fetchCurrent',
            // });
            dispatch({
                type: 'settings/getSetting',
            });
        }
        watermark('messageBox');
    }, []);
    /**
     * init variables
     */

    const handleMenuCollapse = (payload: boolean): void => {
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload,
            });
        }
    };
    return (
        <div className={dark ? styles.dark : stylesLight.light} id={'messageBox'}>
            <ProLayout
                //修改logo以及title
                logo={logo}
                onCollapse={handleMenuCollapse}
                //控制隐藏menu-fold展示
                collapsedButtonRender={false}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl) {
                        return defaultDom;
                    }

                    return (
                        <Link to={menuItemProps.path}>
                            {defaultDom}
                        </Link>
                    );
                }}
                breadcrumbRender={(routers = []) => [
                    {
                        path: '/',
                        breadcrumbName: '首页',
                    },
                    ...routers,
                ]}
                itemRender={(route, params, routes, paths) => {
                    const first = routes.indexOf(route) === 0;
                    return first ? (
                        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
                    ) : (
                        <span>{route.breadcrumbName}</span>
                    );
                }}
                footerRender={false}
                menuDataRender={menuDataRender}
                rightContentRender={rightProps => <RightContent {...rightProps} />}
                {...props}
                {...settings}
            >
                <Navigation {...props} />
                {/*{children}*/}
            </ProLayout>
        </div>
    );
};

export default connect(({global, settings}: ConnectState) => ({
    collapsed: global.collapsed,
    dark: global.dark,
    settings,
}))(BasicLayout);
