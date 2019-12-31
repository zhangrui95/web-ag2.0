import React, {PureComponent} from 'react';
import {Tooltip, Select, Steps} from 'antd';
import {getSysAuthority} from '../../utils/authority';
import styles from './CaseModalTrail.less';

const {Step} = Steps;

export default class CaseModalTrail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    currentNum(policeDetails) {
        // console.log('policeDetails',policeDetails);
        // if(policeDetails.ajgjList){
        return policeDetails.ajgjList.length - 1;
        // }
        // else{
        //   return (
        //     0
        //   );
        // }
    }

    extraDescription = (singleData, idx, ajgjList) => {
        const {time, dwmc, zbrxm, xbrxm, tbyy} = singleData;
        let dwmcTrue = false;
        let zbrxmTrue = false;
        let xbrxmTrue = false;
        if ((idx > 0 && dwmc && dwmc !== ajgjList[idx - 1].dwmc) || idx === 0) {
            dwmcTrue = true;
        }
        if ((idx > 0 && zbrxm && zbrxm !== ajgjList[idx - 1].zbrxm) || idx === 0) {
            zbrxmTrue = true;
        }
        if ((idx > 0 && xbrxm && xbrxm !== ajgjList[idx - 1].xbrxm) || idx === 0) {
            xbrxmTrue = true;
        }
        return (
            <div style={{position: 'relative', left: '-40px', top: '10px'}}
                 className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
                {time ? (
                    <p className={styles.clsj_time}>
                        <Tooltip overlayStyle={{wordBreak: 'break-all'}} title={time}>
                            日期：{time}
                        </Tooltip>
                    </p>
                ) : null}
                {dwmcTrue ? (
                    <p className={styles.clsj_time}>
                        <Tooltip overlayStyle={{wordBreak: 'break-all'}} title={dwmc}>
                            单位：{dwmc}
                        </Tooltip>
                    </p>
                ) : null}
                {zbrxmTrue ? (
                    <p className={styles.clsj_time}>
                        <Tooltip overlayStyle={{wordBreak: 'break-all'}} title={zbrxm}>
                            主办人：{zbrxm}
                        </Tooltip>
                    </p>
                ) : null}
                {xbrxmTrue ? (
                    <p className={styles.clsj_time}>
                        <Tooltip overlayStyle={{wordBreak: 'break-all'}} title={xbrxm}>
                            协办人：{xbrxm}
                        </Tooltip>
                    </p>
                ) : null}
                {tbyy ? (
                    <p className={styles.clsj_time}>
                        <Tooltip overlayStyle={{wordBreak: 'break-all'}} title={tbyy}>
                            退补原因：{tbyy}
                        </Tooltip>
                    </p>
                ) : null}
            </div>
        );
    };

    ajlc(policeDetails, superveWidth) {
        return (
            <div style={{width: superveWidth}} className={styles.superve}>
                <Steps current={this.currentNum(policeDetails)}>
                    {policeDetails.ajgjList.map((item, idx) => (
                        <Step
                            title={<span style={{
                                fontSize: 14,
                                color: this.props.dark ? '#fff' : '#4D4D4D'
                            }}>{item.ajzt}</span>}
                            description={this.extraDescription(item, idx, policeDetails.ajgjList)}
                        />
                    ))}
                </Steps>
            </div>
        );
    }

    render() {
        const {caseDetails} = this.props;
        const obj1 = document.getElementsByTagName('body');
        const objheight = obj1[0].clientHeight;
        const allheight = obj1[0].scrollHeight;
        const objwidth = obj1[0].clientWidth;
        let superveWidth = '';
        if (objheight >= allheight) {
            if (objwidth < 1280 || objwidth === 1280) {
                superveWidth = 905;
            } else if (objwidth > 1280 && objwidth < 1600) {
                superveWidth = 905;
            } else if (objwidth >= 1600 && objwidth < 1680) {
                superveWidth = 1225;
            } else if (objwidth >= 1680 && objwidth < 1920) {
                superveWidth = 1305;
            } else if (objwidth >= 1920) {
                superveWidth = 1545;
            }
        } else if (objheight < allheight) {
            if (objwidth < 1263 || objwidth === 1263) {
                superveWidth = 905;
            } else if (objwidth > 1263 && objwidth < 1583) {
                superveWidth = 905;
            } else if (objwidth >= 1583 && objwidth < 1663) {
                superveWidth = 1225;
            } else if (objwidth >= 1663 && objwidth < 1903) {
                superveWidth = 1305;
            } else if (objwidth >= 1903) {
                superveWidth = 1545;
            }
        }
        return <div>{this.ajlc(caseDetails, superveWidth)}</div>;
    }
}
