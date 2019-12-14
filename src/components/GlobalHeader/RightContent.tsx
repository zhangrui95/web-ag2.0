import { Icon, Tooltip,Button } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles1 from './index.less';
import styles2 from './indexLight.less';
import iconFont from '../../utils/iconfont'
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
  return (
    <div className={styles.right}>
        <div className={styles.btnBox}>
            <div className={styles.border}></div>
            <Button type="primary" shape="round">
                <IconFont type='icon-jiankongmianban-mianxing' /> 监管问题
            </Button>
            <Button shape="round">
                <IconFont type='icon-gongzuojingli' /> 办案区管理
            </Button>
            <Button shape="round">
                <IconFont type='icon-caiwu' /> 涉案物品管理
            </Button>
            <Button shape="round">
                <IconFont type='icon-dangan1' /> 卷宗管理
            </Button>
        </div>
      <Avatar />
    </div>
  );
};

export default connect(({ global,settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  dark:global.dark,
}))(GlobalHeaderRight);
