/*
* AnalysisTitleArea.js 趋势分析公用头部
* author：lyp
* 20181214
* */

import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import styles from './analysisStyles.less';

export default class AnalysisTitleArea extends PureComponent {
    render() {
        const {analysisTitle} = this.props;
        let className = this.props.global && this.props.global.dark ? styles.titleArea : styles.titleArea + ' ' + styles.lightBox
        return (
            <div className={className}>
                <h2 className={styles.title}>{analysisTitle}</h2>
                <Row className={styles.titleDate}>
                    <Col xxl={6} xl={8} md={12}>
                        <span className={styles.dateColorA}/>
                        <span className={styles.dateString}>当前时间：{this.props.selectedDateStr}</span>
                    </Col>
                    <Col xxl={6} xl={8} md={12}>
                        <span className={styles.dateColorB}/>
                        <span className={styles.dateString}>同比时间：{this.props.yearOnYearDateStr}</span>
                    </Col>
                    <Col xxl={6} xl={8} md={12}>
                        <span className={styles.dateColorC}/>
                        <span className={styles.dateString}>环比时间：{this.props.monthOnMonthDateStr}</span>
                    </Col>
                </Row>
            </div>
        );
    }
}