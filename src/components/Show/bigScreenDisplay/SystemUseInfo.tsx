/*
* CaseItemInfo.js 智慧案管大屏---个人使用情况
* author：lyp
* 20190116
* */

import React, {PureComponent} from 'react';
import styles from './bigScreenDisplay.less';

export default class SystemUseInfo extends PureComponent {
    state = {
        loginCount: '0',
        dbCount: '0',
        modelUseCount: '0',
        shareCount: '0',
    };

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getSystemUseInfo(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getSystemUseInfo(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 个人使用情况
    getSystemUseInfo = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getSystemUseInfo',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                // console.log('data-------', data);
                if (data && data.list && data.list.length > 0) {
                    const dataList = data.list;
                    let loginCount = 0;
                    let dbCount = 0;
                    let modelUseCount = 0;
                    let shareCount = 0;
                    let num = 0;
                    // console.log('dataList', dataList);
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i].name === '登录次数') loginCount = dataList[i].count;
                        if (dataList[i].name === '督办次数') dbCount = dataList[i].count;
                        if (dataList[i].name === '各模块使用次数') modelUseCount = dataList[i].count;
                        if (dataList[i].name === '共享次数') shareCount = dataList[i].count;
                    }
                    num = num + parseInt(loginCount) + parseInt(dbCount) + parseInt(modelUseCount) + parseInt(shareCount);
                    this.props.getAllNum(this.props.idx, num, '个人使用情况');
                    this.setState({
                        loginCount,
                        dbCount,
                        modelUseCount,
                        shareCount,
                    });
                }
            },
        });
    };

    render() {
        const {loginCount, dbCount, modelUseCount, shareCount} = this.state;
        return (
            <div id="HandingCaseAreaUseInfo" style={{height: '100%', width: '100%'}}>
                <h4 className={styles.cardTitle}>系统使用情况</h4>
                <div className={styles.cardContent}>
                    <div className={styles.pinkFull}>
                        <div>总登录人次</div>
                        <div>{loginCount}</div>
                    </div>
                    <div className={styles.blueBorder}>
                        <div>总督办次数</div>
                        <div>{dbCount}</div>
                    </div>
                    <div className={styles.purpleFull}>
                        <div>总功能使用数</div>
                        <div>{modelUseCount}</div>
                    </div>
                    <div className={styles.greenBorder}>
                        <div>总分享数</div>
                        <div>{shareCount}</div>
                    </div>
                </div>
            </div>
        );
    }
}
