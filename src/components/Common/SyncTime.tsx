/*
* SyncTime 同步时间
* author：lyp
* 20190715
* */

import React, { PureComponent } from 'react';
import { DATASYNCTIMEID } from '../../utils/utils';
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
        const { common: { syncTime: { zxxgsj } }, dataLatestTime } = this.props;
        return (
            <div className={styles.statistic}>
                <span>数据最新时间：{dataLatestTime}</span>
                <span style={{ marginLeft: 40 }}>数据同步时间：{zxxgsj}</span>
            </div>
        );
    }
}