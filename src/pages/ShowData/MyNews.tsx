/*
 * 首页我的消息查看
 * author：zr
 * 20190424
 * */
import React, { PureComponent } from 'react';
import { Col, Row, Modal, Card } from 'antd';
import { connect } from 'dva';
import styles from './HomepageCommon.less';

@connect(({ home }) => ({
  home,
}))
export default class MyNews extends PureComponent {
  render() {
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    return (
      /*<Modal
        title="我的消息"
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        footer={null}
        width={900}
        maskClosable={false}
        className={styles.myNewsModal}
        centered={true}
      >
        <div>
          <Row style={{ marginBottom: '0' }}>
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
              <div className={styles.content} style={{ width: '700px' }}>
                {this.props.datail.content}
              </div>
            </Col>
          </Row>
        </div>
      </Modal>*/
      <div>
        <div style={{ backgroundColor: '#202839' }}>
            <span style={{ margin: '16px', display: 'block',lineHeight:'61px',fontSize:20 }}>我的消息</span>
        </div>
        <div className={styles.myNewsMessage}>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={8}>案件编号：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.ajbh?this.props.location.query.record.ajbh:''}</Col>
              <Col span={this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.name&&this.props.location.query.record.name.length > 16 ? 16 : 8}>
                案件名称：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.name?this.props.location.query.record.name:''}
              </Col>
              <Col span={8}>消息类型：督办反馈</Col>
            </Row>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={8}>责任人：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.zrrName?this.props.location.query.record.zrrName:''}</Col>
              <Col span={8}>反馈时间：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.time?this.props.location.query.record.time:''}</Col>
              <Col span={8}>问题类型：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.wtlxMc?this.props.location.query.record.wtlxMc:''}</Col>
            </Row>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={24}>
                责任单位：{this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.zrrDwmc?this.props.location.query.record.zrrDwmc:''}
              </Col>
            </Row>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={24}>
                <div className={styles.content}>反馈信息：</div>
                <div className={styles.content} style={{ width: '700px' }}>
                  {this.props.location&&this.props.location.query&&this.props.location.query.record&&this.props.location.query.record.content?this.props.location.query.record.content:''}
                </div>
              </Col>
            </Row>
        </div>
      </div>
    );
  }
}
