import {Avatar, Icon, Modal, Button, Tooltip} from 'antd';
import {ClickParam} from 'antd/es/menu';
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {ConnectProps, ConnectState} from '@/models/connect';
import {CurrentUser} from '@/models/user';
import styles1 from './index.less';
import styles2 from './indexLight.less';
import {routerRedux} from 'dva/router';
import iconFont from '../../utils/iconfont'

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconFont
})
const {confirm} = Modal;

export interface GlobalHeaderRightProps extends ConnectProps {
    currentUser?: CurrentUser;
    menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
    onMenuClick = (event: ClickParam) => {
        const {key} = event;

        if (key === 'logout') {
            const {dispatch} = this.props;

            if (dispatch) {
                dispatch({
                    type: 'login/logout',
                });
            }

            return;
        }

        router.push(`/account/${key}`);
    };

    //退出
    onClickBack = () => {
        let that = this;
        confirm({
            title: '确认退出当前系统?',
            centered: true,
            okText: '确认',
            cancelText: '取消',
            getContainer: document.getElementById('messageBox'),
            onOk() {
                that.onClick();
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    //退出
    onClick = () => {
        const {dispatch} = this.props;

        if (dispatch) {
            dispatch({
                type: 'login/logout',
            });
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
        }

        return;
    }
    getChangeBg = () => {
        const {dispatch} = this.props;
        dispatch(routerRedux.push('/ThemeChange'));
    }

    render(): React.ReactNode {
        let styles = this.props.dark ? styles1 : styles2;
        return (
            // currentUser && currentUser.name ?
            // <HeaderDropdown overlay={}>
            //   <span className={`${styles.action} ${styles.account}`}>
            //     <Avatar size="small" className={styles.avatar} src={require('@/assets/user.png')} alt="avatar" />
            //     <span className={styles.name}>李华</span>
            //   </span>
            // </HeaderDropdown>
            <div style={{paddingRight: '48px'}} className={styles.goOut}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={require('@/assets/user.png')} alt="avatar"/>
          <span className={styles.name}>{JSON.parse(sessionStorage.getItem('user')).name}</span>
        </span>
                <Tooltip title={'主题切换'}>
               <span className={styles.logout} onClick={this.getChangeBg}>
                    <IconFont className={styles.logoutIcon} type='icon-zhuti'/>
                </span>
                </Tooltip>
                <span className={styles.logout} onClick={this.onClickBack}>
          <Icon className={styles.logoutIcon} type="poweroff"/>
        </span>
            </div>
        )
        // : (
        //     <Spin
        //       size="small"
        //       style={{
        //         marginLeft: 8,
        //         marginRight: 8,
        //       }}
        //     />
        //   );
    }
}

export default connect(({user, global}: ConnectState) => ({
    currentUser: user.currentUser,
    dark: global.dark,
}))(AvatarDropdown);
