/*
* HandingCaseAreaInfo.js 智慧案管大屏---办案区信息巡检
* author：lyp
* 20181122
* */

import React, { PureComponent } from 'react';
import styles from './bigScreenDisplay.less';

export default class HandingCaseAreaInfo extends PureComponent {
    state = {
        baqUse: 0,
        baqCase: 0,
        baqPolice: 0,
        baqCriminal: 0,
    };

    componentDidMount() {
        const { selectDate, org, orgCode, orglist } = this.props;
        this.getHandingCaseAreaInfo(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getHandingCaseAreaInfo(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 办案区信息巡检
    getHandingCaseAreaInfo = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getBaqZqTj',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    let baqUse = 0;
                    let baqCase = 0;
                    let baqPolice = 0;
                    let baqCriminal = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].sj_name === '在办案件') baqCase = data[i].sj_count;
                        if (data[i].sj_name === '办案区使用数') baqUse = data[i].sj_count;
                        if (data[i].sj_name === '在区民警') baqPolice = data[i].sj_count;
                        if (data[i].sj_name === '在区涉案人员') baqCriminal = data[i].sj_count;
                    }
                    this.setState({
                        baqUse,
                        baqCase,
                        baqPolice,
                        baqCriminal,
                    });
                    let num = parseInt(baqUse) + parseInt(baqCase) + parseInt(baqPolice) + parseInt(baqCriminal);
                    this.props.getAllNum(this.props.idx, num, '办案区信息巡检');
                }
            },
        });
    };

    render() {
        const { baqUse, baqCase, baqPolice, baqCriminal } = this.state;
        return (
            <div id="HandingCaseAreaInfo" style={{ height: '100%', width: '100%' }}>
                <h4 className={styles.cardTitle}>办案区信息巡检</h4>
                <div className={styles.cardContent}>
                    <div className={styles.baqUse}>
                        <div>办案区使用数</div>
                        <div>{baqUse}</div>
                    </div>
                    <div className={styles.baqCase}>
                        <div>在办案件数</div>
                        <div>{baqCase}</div>
                    </div>
                    <div className={styles.baqPolice}>
                        <div>在区民警数</div>
                        <div>{baqPolice}</div>
                    </div>
                    <div className={styles.baqCriminal}>
                        <div>涉案人员数</div>
                        <div>{baqCriminal}</div>
                    </div>
                </div>
            </div>
        );
    }
}
