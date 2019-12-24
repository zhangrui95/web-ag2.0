/*
* CloseAndDetectionRate.js 智慧案管大屏----结案、破案率展示
* author：lyp
* 20181120
* */

import React, {PureComponent} from 'react';
import styles from './bigScreenDisplay.less';
import img1 from '../../../assets/show/policeWarningCount_1.png';
import img2 from '../../../assets/show/policeWarningCount_2.png';

export default class CloseAndDetectionRate extends PureComponent {
    state = {
        detectionRate: '0',
        closeRate: '0',
    };

    componentDidMount() {
        const {selectDate, org, orgCode, orglist} = this.props;
        this.getCloseAndDetectionRate(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps) {
                if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                    this.getCloseAndDetectionRate(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
                }
            }
        }
    }

    // 获取行政处罚数量
    getCloseAndDetectionRate = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getCloseAndDetectionRate',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data) {
                    let detectionRate = 0;
                    let closeRate = 0;
                    let num = 0;
                    for (let i = 0; i < data.list.length; i++) {
                        if (data.list[i].sj_name === '刑事案件破案率') detectionRate = data.list[i].sj_count;
                        if (data.list[i].sj_name === '行政案件结案率') closeRate = data.list[i].sj_count;
                        num = parseInt(data.list[i].sj_count) + parseInt(data.list[i].sj_count);
                    }
                    this.props.getAllNum(this.props.idx, num, '结案、破案率');
                    this.setState({
                        detectionRate,
                        closeRate,
                    });
                }
            },
        });
    };

    render() {
        const {detectionRate, closeRate} = this.state;
        return (
            <div id="PoliceSituationWarningCount" style={{height: '100%', width: '100%'}}>
                <h4 className={styles.cardTitle}>结案、破案率展示</h4>
                <div className={styles.cardContent}>
                    <div className={styles.animateArea}>
                        <img src={img1} alt=""/>
                        <div className={styles.pWarningCoutNum}>{detectionRate}</div>
                        <div className={styles.pWarningCoutName}>刑事案件破案率</div>
                    </div>
                    <div className={styles.animateArea}>
                        <img src={img2} alt=""/>
                        <div className={styles.pWarningCoutNum}>{closeRate}</div>
                        <div className={styles.pWarningCoutName}>行政案件结案率</div>
                    </div>
                </div>
            </div>
        );
    }
}
