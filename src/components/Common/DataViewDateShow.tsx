/*
* DataViewDateShow.js 图表页通用显示日期按钮
* author：lyp
* 20190618
* */
import React, { PureComponent } from 'react';
import moment from 'moment/moment';
import styles from '../../pages/common/dataView.less';

import { getTimeDistance } from '../../utils/utils';

export default class DataViewDateShow extends PureComponent {
    setDateButton = (dataTypeStr) => {
        let dateType;
        switch (dataTypeStr) {
            case '今日':
                dateType = 'today';
                break;
            case '昨日':
                dateType = 'lastDay';
                break;
            case '前日':
                dateType = 'beforeLastDay';
                break;
            case '本周':
                dateType = 'week';
                break;
            case '前一周':
                dateType = 'lastWeek';
                break;
            case '前二周':
                dateType = 'beforeLastWeek';
                break;
            case '本月':
                dateType = 'month';
                break;
            case '前一月':
                dateType = 'lastMonth';
                break;
            case '前二月':
                dateType = 'beforeLastMonth';
                break;
            default:
                dateType = null;
        }
        const dataTime = dateType ? getTimeDistance(dateType) : ['', ''];
        const startTime = dataTime[0] === '' ? '' : moment(dataTime[0]).format('YYYY-MM-DD');
        const endTime = dataTime[1] === '' ? '' : moment(dataTime[1]).format('YYYY-MM-DD');
        if (dateType === 'today' || dateType === 'lastDay' || dateType === 'beforeLastDay') {
            return (
                <div className={styles.countButtonTitle}>
                    <div>{dataTypeStr}</div>
                    <div>{startTime}</div>
                </div>
            );
        }
        return (
            <div className={styles.countButtonTitle}>
                <div>{dataTypeStr}</div>
                <div>{startTime}</div>
                <div style={{ lineHeight: '6px' }}>~</div>
                <div>{endTime}</div>
            </div>
        );
    };

    render() {
        const { dataTypeStr } = this.props;
        return this.setDateButton(dataTypeStr);
    }
}
