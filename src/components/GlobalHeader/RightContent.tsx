import {Icon, Tooltip, Button,message} from 'antd';
import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import Link from 'umi/link';
import {ConnectProps, ConnectState} from '@/models/connect';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles1 from './index.less';
import styles2 from './indexLight.less';
import iconFont from '../../utils/iconfont'
import {authorityIsTrue} from "@/utils/authority";
import {getUserInfos, userAuthorityCode} from "@/utils/utils";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconFont
})
export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends ConnectProps {
    theme?: SiderTheme;
    layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
    let styles = props.dark ? styles1 : styles2;
    let topList = props.topList ? props.topList : [];
    let baqHttp = '';
    let sacwHttp = '';
    let jzHttp = '';
    topList.map((item)=>{
        if(item.id === '8e503d6f-5a4c-4601-a599-7c07fb752f86'){
            baqHttp = item.address;
        }else if(item.id === 'c5516ec3-5965-4803-874c-799239049cdb'){
            sacwHttp = item.address;
        }else if(item.id === '990230a8-8ebd-4b83-8db6-1b7f84148f48'){
            jzHttp = item.address;
        }
    });
    let token = sessionStorage.getItem('userToken');
    const goLinkGo = (path)=>{
        if(path){
            window.location.href = `${path}/#/loginByToken?token=${token}`
        }else {
            message.warning('该用户无访问权限');
        }
    }
    return (
        <div className={styles.right}>
            <div className={styles.btnBox}>
                <div className={styles.border}></div>
                <Button type="primary" shape="round">
                    <IconFont type='icon-jiankongmianban-mianxing'/> 执法管理
                </Button>
                {
                    JSON.stringify(topList).indexOf('8e503d6f-5a4c-4601-a599-7c07fb752f86')> -1 ?
                            <Button shape="round" onClick={()=>goLinkGo(baqHttp)}>
                                <IconFont type='icon-gongzuojingli'/> 办案区管理
                            </Button>
                        : ''
                }
                {
                    JSON.stringify(topList).indexOf('c5516ec3-5965-4803-874c-799239049cdb')> -1  ?
                        <Button shape="round" onClick={()=>goLinkGo(sacwHttp)}>
                    <IconFont type='icon-caiwu'/> 涉案财物管理
                        </Button> : ''}
                {
                    JSON.stringify(topList).indexOf('990230a8-8ebd-4b83-8db6-1b7f84148f48')> -1  ?
                      <Button shape="round" onClick={()=>goLinkGo(jzHttp)}>
                    <IconFont type='icon-dangan1'/> 卷宗管理
                        </Button>: ''}
            </div>
            <Avatar/>
        </div>
    );
};

export default connect(({global, settings,login}: ConnectState) => ({
    theme: settings.navTheme,
    layout: settings.layout,
    dark: global.dark,
    topList:login.topList,
}))(GlobalHeaderRight);
