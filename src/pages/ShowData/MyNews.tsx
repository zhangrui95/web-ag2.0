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
    const {query} = this.props.location;
    return (
      /*<Modal
        title="我的消息"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        maskClosable={false}
        className={styles.myNewsModal}
        centered={true}
      >
        <div>
          <Row style={{ marginBottom: '0' }}>
            <Col span={8}>案件编号：{datail.ajbh}</Col>
            <Col span={datail.name && datail.name.length > 16 ? 16 : 8}>
              案件名称：{datail.name}
            </Col>
            <Col span={8}>消息类型：督办反馈</Col>
            <Col span={8}>责任人：{datail.zrrName}</Col>
            <Col span={8}>反馈时间：{datail.time}</Col>
            <Col span={8}>问题类型：{datail.wtlxMc}</Col>
            <Col span={datail.zrrDwmc && datail.zrrDwmc.length > 16 ? 16 : 8}>
              责任单位：{datail.zrrDwmc}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={styles.content}>反馈信息：</div>
              <div className={styles.content} style={{ width: '700px' }}>
                {datail.content}
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
              <Col span={8}>案件编号：{query&&query.record&&query.record.ajbh?query.record.ajbh:''}</Col>
              <Col span={query&&query.record&&query.record.name&&query.record.name.length > 16 ? 16 : 8}>
                案件名称：{query&&query.record&&query.record.name?query.record.name:''}
              </Col>
              <Col span={8}>消息类型：督办反馈</Col>
            </Row>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={8}>责任人：{query&&query.record&&query.record.zrrName?query.record.zrrName:''}</Col>
              <Col span={8}>反馈时间：{query&&query.record&&query.record.time?query.record.time:''}</Col>
              <Col span={8}>问题类型：{query&&query.record&&query.record.wtlxMc?query.record.wtlxMc:''}</Col>
            </Row>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={24}>
                责任单位：{query&&query.record&&query.record.zrrDwmc?query.record.zrrDwmc:''}
              </Col>
            </Row>
            <Row gutter={rowLayout} style={{marginBottom:24}}>
              <Col span={24}>
                <div className={styles.content}>反馈信息：</div>
                <div className={styles.content} style={{ width: '700px' }}>
                  {query&&query.record&&query.record.content?query.record.content:''}
                </div>
              </Col>
            </Row>
        </div>
      </div>
    );
  }
}
