/*
* PoliceSituationWariningCount.js 智慧案管大屏----警情告警统计
* author：lyp
* 20181120
* */

import React, {PureComponent} from 'react';
import styles from './bigScreenDisplay.less';
import img1 from '../../../assets/show/policeWarningCount_1.png';
import img2 from '../../../assets/show/policeWarningCount_2.png';

let myChart;

export default class PoliceSituationWarningCount extends PureComponent {
    state = {
        notHandleNum: 0,
        noResultNum: 0,
    };

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getPoliceSituationWarningCount(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getPoliceSituationWarningCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取行政处罚数量
    getPoliceSituationWarningCount = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'UnPoliceData/getNewAddWarnings',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    let notHandleNum = 0;
                    let noResultNum = 0;
                    for (let i = 0; i < data.list.length; i++) {
                        if (data.list[i].name === '未受案警情') notHandleNum = data.list[i].count;
                        if (data.list[i].name === '无处置结果') noResultNum = data.list[i].count;
                    }
                    this.setState({
                        notHandleNum,
                        noResultNum,
                    });
                    let num = parseInt(notHandleNum) + parseInt(noResultNum);
                    this.props.getAllNum(this.props.idx, num, '警情告警统计');
                }
            },
        });
    };

    render() {
        const {notHandleNum, noResultNum} = this.state;
        return (
            <div id="PoliceSituationWarningCount" style={{height: '100%', width: '100%'}}>
                <h4 className={styles.cardTitle}>警情告警统计</h4>
                <div className={styles.cardContent}>
                    <div className={styles.animateArea}>
                        <img src={img1} alt=""/>
                        <div className={styles.pWarningCoutNum}>{noResultNum}</div>
                        <div className={styles.pWarningCoutName}>24小时无处置结果</div>
                    </div>
                    <div className={styles.animateArea}>
                        <img src={img2} alt=""/>
                        <div className={styles.pWarningCoutNum}>{notHandleNum}</div>
                        <div className={styles.pWarningCoutName}>未受案警情</div>
                    </div>
                </div>
            </div>
        );
    }
}
