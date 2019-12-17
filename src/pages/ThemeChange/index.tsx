/*
 * 主题切换
 * author：zr
 * 20191213
 * */
import React, { Component,  useState, useEffect } from 'react';
import { connect } from 'dva';
import styles1 from './index.less';
import styles2 from './indexLight.less';
import {Card,Checkbox,Icon} from 'antd';
import theme from "../../assets/common/theme.png";
import {ConnectState} from "@/models/connect";
import iconFont from '../../utils/iconfont'
import cookie from 'react-cookies'
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconFont
})

class ThemeChange extends Component {
    constructor(props) {
        super(props);
    }
    getChangeTheme = (bgColor) =>{
        this.props.dispatch({
            type: 'global/changeBgColor',
            payload: bgColor,
        });
        cookie.save('dark', bgColor);
    }
    render() {
        let styles = this.props.dark ? styles1 : styles2;
        return (
          <Card className={styles.box}>
              <div className={styles.header}><IconFont className={styles.Icon} type='icon-zhuti' />主题切换</div>
              <div className={styles.allBox}>
                  <div className={styles.boxItem}>
                      <Card className={styles.bgCard} onClick={()=>this.getChangeTheme(false)}>
                          默认主题
                          <img src={theme}/>
                      </Card>
                      <Checkbox checked={!this.props.dark} onClick={()=>this.getChangeTheme(false)}></Checkbox>
                  </div>
                  <div className={styles.boxItem}>
                    <Card className={styles.bgCardDark} onClick={()=>this.getChangeTheme(true)}>
                        深色模式
                        <img src={theme}/>
                    </Card>
                     <Checkbox checked={this.props.dark} onClick={()=>this.getChangeTheme(true)}></Checkbox>
                  </div>
              </div>
          </Card>
        );
    }
}

export default connect(({ global, settings }: ConnectState) => ({
    collapsed: global.collapsed,
    dark:global.dark,
    settings,
}))(ThemeChange);