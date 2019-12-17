/*
* PersonDetailTab 人员档案详情Tab组件行政、刑事处罚时间轴
* author：lyp
* 20180128
* */
import React, {PureComponent} from 'react';
import {Tabs, Row, Col, Table, List, Steps, Tooltip, Empty} from 'antd';
import styles from './personDetailTab.less';
import RenderEmpty from '../Common/RenderEmpty';
import noList from "@/assets/viewData/noList.png";
import {connect} from "dva";

const Step = Steps.Step;
const imgLeft = require('../../assets/common/leftButton.png');
const imgRight = require('../../assets/common/rightButton.png');
const imgLeftDisabled = require('../../assets/common/leftButtonDisabled.png');
const imgRightDisabled = require('../../assets/common/rightButtonDisabled.png');

// let moveStep = 0;
@connect(({ global }) => ({
    global,
}))
export default class PunishTimeLine extends PureComponent {

    state = {
        moveStep: 0,
        moreStepNum: 0,
        leftPx: 0,
        showStepButton: false,
    };

    componentDidMount() {
        this.changeStepButtonStatus(this.props.oWidth);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (this.props.oWidth !== nextProps.oWidth) {
                this.changeStepButtonStatus(nextProps.oWidth);
            }
        }
    }

    changeStepButtonStatus = (oWidth) => {

        const {punishData} = this.props;
        const punishDataLenght = punishData.length;
        let isShow = false;
        let moreStepNum = 0;

        if (punishDataLenght > 9 && punishDataLenght * 140 > oWidth) {
            isShow = true;
        }

        if (isShow) {
            const restWidth = punishDataLenght * 140 - oWidth;
            moreStepNum = parseInt(restWidth / 140) + (restWidth % 140 ? 1 : 0);
        }
        this.setState({
            showStepButton: isShow,
            moreStepNum,
            leftPx: 0,
        });


    };
    // 处罚步骤
    showSteps = (punishData) => {
        const {leftPx} = this.state;
        const stepData = [...punishData] || [];
        const stepLenght = stepData.length;
        if (stepLenght > 0 && stepLenght < 4) {
            const emptyStepLength = 4 - stepLenght;
            for (let i = 0; i < emptyStepLength; i++) {
                stepData.push('');
            }
        }
        return stepData.length > 0 ? (
            <div className={styles.stepDiv} style={leftPx !== 0 ? {left: leftPx * -1} : {left: 0}}>
                {
                    <Steps progressDot current={stepLenght - 1} size='small'>
                        {
                            stepData.map((item,idx) => (
                                    item === '' ? (
                                        <Step title="" description=""/>
                                    ) : (
                                        <Step title={item.qzcsName} description={item.qzrq} />
                                    )
                                ),
                            )
                        }
                    </Steps>
                }

            </div>
        ) : (
            <RenderEmpty emptyWords="暂无数据" {...this.props}/>
        );
    };
    moveLeft = () => {
        let {moveStep} = this.state;
        moveStep = moveStep - 1 > 0 ? moveStep - 1 : 0;
        this.setState({
            leftPx: 140 * moveStep,
            moveStep,
        });
    };
    moveRight = () => {
        let {moreStepNum, moveStep} = this.state;
        moveStep = moveStep + 1 > moreStepNum ? moreStepNum : moveStep + 1;
        this.setState({
            leftPx: 140 * moveStep,
            moveStep,
        });
    };

    render() {
        const {punishData} = this.props;
        const {leftPx, moreStepNum, showStepButton} = this.state;
        return (
            <div
                className={this.props.global && this.props.global.dark ? styles.tabDiv : styles.tabDiv + ' ' + styles.lightBox}>
                {this.showSteps(punishData)}
{
                    showStepButton ? (
                        <div className={styles.stepButtons}>
                            <img
                                className={leftPx !== 0 ? styles.showButton : styles.disableButton}
                                src={leftPx !== 0 ? imgLeft : imgLeftDisabled}
                                onClick={() => this.moveLeft()}
                            />
                            <img
                                className={leftPx === 140 * moreStepNum ? styles.disableButton : styles.showButton}
                                src={leftPx === 140 * moreStepNum ? imgRightDisabled : imgRight}
                                onClick={() => this.moveRight()}
                            />
                        </div>
                    ) : null
  }
            </div>
        );
}
}