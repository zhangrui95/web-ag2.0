/*
* PoliceSituationToCaseCount.js 智慧案管大屏----警情转化案件数量Line
* author：lyp
* 20181120
* */
import React, { PureComponent } from 'react';
import styles from './bigScreenDisplay.less';

export default class CenterStatistics extends PureComponent {
    state = {
        caseCountNum: 0,
        warningCountNum: 0,
        criminalNum: 0,
        illegalPersonNum: 0,
        qzcsNum: 0,
    };

    componentDidMount() {
        this.getCaseAndWarningCount();
    }

    // 获取案件、告警总数
    getCaseAndWarningCount = (startTime, endTime, orgCode) => {
        this.props.dispatch({
            type: 'show/getCaseAndWarningCount',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: orgCode,
            },
            callback: (data) => {
                if (data) {
                    let caseCountNum = 0;
                    let warningCountNum = 0;
                    let criminalNum = 0;
                    let illegalPersonNum = 0;
                    let qzcsNum = 0;
                    data.list.forEach(item => {
                        if (item.sj_name === '案件总数') caseCountNum = item.sj_count;
                        if (item.sj_name === '告警总数') warningCountNum = item.sj_count;
                        if (item.sj_name === '违法人员') illegalPersonNum = item.sj_count;
                        if (item.sj_name === '犯罪人员') criminalNum = item.sj_count;
                        if (item.sj_name === '强制措施人数') qzcsNum = item.sj_count;
                    });
                    this.setState({
                        caseCountNum,
                        warningCountNum,
                        criminalNum,
                        illegalPersonNum,
                        qzcsNum,
                    });
                }
            },
        });
    };

    render() {
        const { caseCountNum, warningCountNum, criminalNum, illegalPersonNum, qzcsNum } = this.state;
        return (
            <div className={styles.centerStatistics}>
                <div style={{ paddingTop: 250 }}>
                    <div className={styles.caseNum}>{caseCountNum}</div>
                    <div className={styles.caseNumText}>当前案件总数</div>
                </div>
                <div className={styles.fourArea}>
                    <div className={styles.singleDiv}>
                        <div className={styles.singleTitle}>违法人员数</div>
                        <div className={styles.singleNum}>{illegalPersonNum}</div>
                    </div>
                    <div className={styles.singleDiv}>
                        <div className={styles.singleTitle}>犯罪人员数</div>
                        <div className={styles.singleNum}>{criminalNum}</div>
                    </div>
                    <div className={styles.singleDiv}>
                        <div className={styles.singleTitle}>强制措施人员数</div>
                        <div className={styles.singleNum}>{qzcsNum}</div>
                    </div>
                    <div className={styles.singleDiv}>
                        <div className={styles.singleTitle}>告警总数</div>
                        <div className={styles.singleNum}>{warningCountNum}</div>
                    </div>
                </div>
            </div>
        );
    }
}