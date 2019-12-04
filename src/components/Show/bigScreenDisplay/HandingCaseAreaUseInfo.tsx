/*
* CaseItemInfo.js 智慧案管大屏---办案区使用情况
* author：lyp
* 20190116
* */

import React, { PureComponent } from 'react';
import styles from './bigScreenDisplay.less';

export default class HandingCaseAreaUseInfo extends PureComponent {
    state = {
        lqyyzqzcsrl: '0%',
        rsaqjcl: '0%',
        fzxyrcjl: '0%',
        sswpczl: '0%',
    };

    componentDidMount() {
        const { selectDate, org, orgCode, orglist } = this.props;
        this.getHandingCaseAreaUseInfo(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getHandingCaseAreaUseInfo(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 办案区使用情况
    getHandingCaseAreaUseInfo = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getHandingCaseAreaUseInfo',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data && data.list & data.list.length > 0) {
                    const dataList = data.list;
                    let lqyyzqzcsrl = 0;
                    let rsaqjcl = 0;
                    let fzxyrcjl = 0;
                    let sswpczl = 0;
                    let num = 0;
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i].name === '离区原因转强制措施人率') lqyyzqzcsrl = dataList[i].count;
                        if (dataList[i].name === '人身安全检查率') rsaqjcl = dataList[i].count;
                        if (dataList[i].name === '犯罪嫌疑人采集率') fzxyrcjl = dataList[i].count;
                        if (dataList[i].name === '随身物品处置率') sswpczl = dataList[i].count;
                    }
                    num = num + parseInt(lqyyzqzcsrl) + parseInt(rsaqjcl) + parseInt(fzxyrcjl) + parseInt(sswpczl);
                    this.props.getAllNum(this.props.idx, num, '办案区使用情况');
                    this.setState({
                        lqyyzqzcsrl,
                        rsaqjcl,
                        fzxyrcjl,
                        sswpczl,
                    });
                }
            },
        });
    };

    render() {
        const { lqyyzqzcsrl, rsaqjcl, fzxyrcjl, sswpczl } = this.state;
        return (
            <div id="HandingCaseAreaUseInfo" style={{ height: '100%', width: '100%' }}>
                <h4 className={styles.cardTitle}>办案区使用情况</h4>
                <div className={styles.cardContent}>
                    <div className={styles.pinkFull}>
                        <div>离区转强制措施率</div>
                        <div>{lqyyzqzcsrl}</div>
                    </div>
                    <div className={styles.blueFull}>
                        <div>人身安全检查率</div>
                        <div>{rsaqjcl}</div>
                    </div>
                    <div className={styles.purpleFull}>
                        <div>信息采集率</div>
                        <div>{fzxyrcjl}</div>
                    </div>
                    <div className={styles.greenFull}>
                        <div>随身物品处置率</div>
                        <div>{sswpczl}</div>
                    </div>
                </div>
            </div>
        );
    }
}
