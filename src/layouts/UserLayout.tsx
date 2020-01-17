import {DefaultFooter, MenuDataItem, getMenuData, getPageTitle} from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import {connect} from 'dva';
import SelectLang from '@/components/SelectLang';
import {ConnectProps, ConnectState} from '@/models/connect';
import logo from '../assets/logo.png';
import leftBg from '../assets/leftBg.png';
import rightBg from '../assets/rightBg.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
    const {
        route = {
            routes: [],
        },
    } = props;
    const {routes = []} = route;
    const {
        children,
        location = {
            pathname: '',
        },
    } = props;
    const {breadcrumb} = getMenuData(routes);
    return (
        <DocumentTitle
            title={getPageTitle({
                pathname: location.pathname,
                breadcrumb,
                ...props,
            })}
        >
            <div className={styles.container}>
                {/*<div className={styles.lang}>*/}
                {/*  <SelectLang />*/}
                {/*</div>*/}
                <div className={styles.top}>
                    <div className={styles.header}>
                        <img alt="logo" className={styles.logo} src={logo}/>
                        <div className={styles.title}>
                            <img src={leftBg}/>
                            <span className={styles.centerTitle}>{window.configUrl.loginName ? window.configUrl.loginName : '执法线管理系统'}</span>
                            <img src={rightBg}/>
                        </div>
                    </div>
                    {/*<div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>*/}
                </div>
                <div className={styles.content}>
                    {children}
                </div>
                {/*<DefaultFooter />*/}
            </div>
        </DocumentTitle>
    );
};

export default connect(({settings}: ConnectState) => ({...settings}))(UserLayout);
