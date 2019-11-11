import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

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
    }

    return;
  }

  render(): React.ReactNode {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
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
