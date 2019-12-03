/*
* CaseItemInfo.js 智慧案管大屏---涉案物品数据
* author：lyp
* 20190116
* */

import React, { PureComponent } from 'react';
import styles from './bigScreenDisplay.less';

export default class CaseItemInfo extends PureComponent {
    state = {
        itemCount: '0',
        itemDisposeRate: '0',
        storeHouseCount: '0',
        storeHouseUseRate: '0',
    };

    componentDidMount() {
        const { selectDate, org, orgCode, orglist } = this.props;
        this.getCaseItemInfo(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getCaseItemInfo(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 涉案物品数据
    getCaseItemInfo = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getCaseItemInfo',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    let itemCount = 0;
                    let itemDisposeRate = 0;
                    let storeHouseCount = 0;
                    let storeHouseUseRate = 0;
                    let num = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name === '物品总数') itemCount = data[i].count;
                        if (data[i].name === '物品处理率') itemDisposeRate = data[i].count;
                        if (data[i].name === '库房数') storeHouseCount = data[i].count;
                        if (data[i].name === '库房占用率') storeHouseUseRate = data[i].count;
                    }
                    num = parseInt(itemCount) + parseInt(itemDisposeRate) + parseInt(storeHouseCount) + parseInt(storeHouseUseRate);
                    this.props.getAllNum(this.props.idx, num, '涉案物品数据');
                    this.setState({
                        itemCount,
                        itemDisposeRate,
                        storeHouseCount,
                        storeHouseUseRate,
                    });
                }
            },
        });
    };

    render() {
        const { itemCount, itemDisposeRate, storeHouseCount, storeHouseUseRate } = this.state;
        return (
            <div id="CaseItemInfo" style={{ height: '100%', width: '100%' }}>
                <h4 className={styles.cardTitle}>涉案物品数据</h4>
                <div className={styles.cardContent}>
                    <div className={styles.pinkFull}>
                        <div>物品总数</div>
                        <div>{itemCount}</div>
                    </div>
                    <div className={styles.blueFull}>
                        <div>物品处理率</div>
                        <div>{itemDisposeRate}</div>
                    </div>
                    <div className={styles.purpleBorder}>
                        <div>库房数</div>
                        <div>{storeHouseCount}</div>
                    </div>
                    <div className={styles.greenBorder}>
                        <div>库房占用率</div>
                        <div>{storeHouseUseRate}</div>
                    </div>
                </div>
            </div>
        );
    }
}
