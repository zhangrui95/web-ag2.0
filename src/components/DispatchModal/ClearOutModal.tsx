/*
* ClearOutModal.js 警情三清清零历史组件
* author：lyp
* 20190703
* */

import React, {PureComponent} from 'react';
import {Modal, Timeline, Row, Col} from 'antd';
import styles from './DispatchModal.less';

export default class ClearOutModal extends PureComponent {

    render() {
        const list = [];
        if (this.props.clearOutRecord) {
            this.props.clearOutRecord.map((item, idx) => {
                list.push(
                    <Timeline.Item
                        dot={
                            <div>
                                <div style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 30,
                                    backgroundColor: '#5858DF',
                                    textAlign: 'center',
                                    marginBottom: 7,
                                }}>
                                    <p style={{
                                        paddingTop: 7,
                                        color: '#fff',
                                    }}>{this.props.clearOutRecord.length - idx}</p>
                                </div>
                            </div>
                        }
                        color='#00CC33'
                    >
                        <Row style={{paddingLeft: 30, paddingBottom: 8}}>
                            <Col md={10} span={24}>
                                清除人：{item.czr_name ? item.czr_name : ''}
                            </Col>
                            <Col md={14} span={24}>所属单位：{item.czr_dwmc ? item.czr_dwmc : ''}</Col>
                        </Row>
                        <Row style={{paddingLeft: 30, paddingBottom: 8}}>
                            <Col md={21} span={24}>清除时间：{item.zxxgsj ? item.zxxgsj : ''}</Col>
                        </Row>
                    </Timeline.Item>,
                );
            });
        }
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="清零历史"
                    visible={this.props.visible}
                    onCancel={this.props.ClearOuthandleCancel}
                    className={styles.shareHeader}
                    footer={null}
                    width={900}
                    maskClosable={false}
                    style={{top: '200px'}}
                >
                    <Timeline style={{marginTop: 20, marginLeft: 20}}>
                        {list}
                    </Timeline>
                </Modal>
            </div>
        );
    }
}

