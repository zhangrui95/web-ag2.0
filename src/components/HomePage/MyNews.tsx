/*
 * 首页我的消息弹框
 * author：zr
 * 20190424
 * */
import React, {PureComponent} from 'react';
import {Col, Row, Modal} from 'antd';
import {connect} from 'dva';
import styles from '../../pages/ShowData/Show.less';

@connect(({home}) => ({
    home,
}))
export default class MyNews extends PureComponent {
    render() {
        return (
            <Modal
                title="我的消息"
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
                footer={null}
                width={900}
                maskClosable={false}
                className={styles.myNewsModal}
                centered={true}
            >
                <Row style={{marginBottom: '0'}}>
                    <Col span={8}>案件编号：{this.props.datail.ajbh}</Col>
                    <Col span={this.props.datail.name && this.props.datail.name.length > 16 ? 16 : 8}>
                        案件名称：{this.props.datail.name}
                    </Col>
                    <Col span={8}>消息类型：督办反馈</Col>
                    <Col span={8}>责任人：{this.props.datail.zrrName}</Col>
                    <Col span={8}>反馈时间：{this.props.datail.time}</Col>
                    <Col span={8}>问题类型：{this.props.datail.wtlxMc}</Col>
                    <Col span={this.props.datail.zrrDwmc && this.props.datail.zrrDwmc.length > 16 ? 16 : 8}>
                        责任单位：{this.props.datail.zrrDwmc}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className={styles.content}>反馈信息：</div>
                        <div className={styles.content} style={{width: '700px'}}>
                            {this.props.datail.content}
                        </div>
                    </Col>
                </Row>
            </Modal>
        );
    }
}
