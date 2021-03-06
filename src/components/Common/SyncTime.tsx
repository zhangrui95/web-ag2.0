/*
* SyncTime 同步时间
* author：lyp
* 20190715
* */

import React, {PureComponent} from 'react';
import {DATASYNCTIMEID} from '../../utils/utils';
// import styles from '../../pages/common/common.less';
import styles from '../../pages/lawEnforcement/CriminalFile/index.less';

export default class SyncTime extends PureComponent {
    componentDidMount() {
        this.getSyncTime();
    }

    // 获取同步时间
    getSyncTime = () => {
        this.props.dispatch({
            type: 'common/getSyncTime',
            payload: {
                id: DATASYNCTIMEID,
            },
        });
    };

    render() {
        const {dataLatestTime} = this.props;
        const  zxxgsj = this.props.common.syncTime&& this.props.common.syncTime.zxxgsj ?this.props.common.syncTime.zxxgsj:'';
        return (
            <div className={this.props.global && this.props.global.dark ? styles.statistic : styles.statisticLight}>
                <span>数据最新时间：{dataLatestTime}</span>
                <span style={{marginLeft: 40}}>数据同步时间：{zxxgsj}</span>
            </div>
        );
    }
}
