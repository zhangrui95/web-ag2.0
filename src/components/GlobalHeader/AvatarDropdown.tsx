import { Avatar, Icon } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import styles from './index.less';
import {routerRedux} from "dva/router";

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

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
  onClick = () => {
    const { dispatch } = this.props;

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

  render(): React.ReactNode {
    return (
      // currentUser && currentUser.name ? 
      // <HeaderDropdown overlay={}>
      //   <span className={`${styles.action} ${styles.account}`}>
      //     <Avatar size="small" className={styles.avatar} src={require('@/assets/user.png')} alt="avatar" />
      //     <span className={styles.name}>李华</span>
      //   </span>
      // </HeaderDropdown>
      <div style={{ paddingRight: '48px' }}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={require('@/assets/user.png')} alt="avatar" />
          <span className={styles.name}>李华</span>
        </span>
        <span className={styles.logout} onClick={this.onClick}>
          <Icon className={styles.logoutIcon} type="poweroff" />
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

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
