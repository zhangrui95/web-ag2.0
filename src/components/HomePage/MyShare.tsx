/*
 * 首页我的分享弹框
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
export default class MyShare extends PureComponent {
    render() {
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        return (
            /*<Modal
              title="我的分享"
              visible={this.props.visibleShare}
              onCancel={this.props.handleCancel}
              footer={null}
              width={900}
              maskClosable={false}
              className={styles.myNewsModal}
              centered={true}
            >
              <Row>
                {this.props.tabs === 's2' ? (
                  <Col
                    span={
                      this.props.shareDatail &&
                      this.props.shareDatail.shareItem &&
                      this.props.shareDatail.shareItem.length > 20
                        ? 6
                        : 8
                    }
                  >
                    分享人：
                    {this.props.shareDatail && this.props.shareDatail.czr
                      ? this.props.shareDatail.czr
                      : ''}
                  </Col>
                ) : (
                  <Col
                    span={
                      this.props.shareDatail &&
                      this.props.shareDatail.shareItem &&
                      this.props.shareDatail.shareItem.length > 20
                        ? 6
                        : 8
                    }
                  >
                    被分享人：
                    {this.props.shareDatail && this.props.shareDatail.fx_xm
                      ? this.props.shareDatail.fx_xm
                      : ''}
                  </Col>
                )}
                <Col
                  span={
                    this.props.shareDatail &&
                    this.props.shareDatail.shareItem &&
                    this.props.shareDatail.shareItem.length > 20
                      ? 12
                      : 10
                  }
                >
                  分享事项：
                  <a href="javascript:;" onClick={() => this.props.goLook(this.props.shareDatail, 2)}>
                    {this.props.shareDatail && this.props.shareDatail.sx ? this.props.shareDatail.sx : ''}
                  </a>
                </Col>
                <Col span={6}>
                  分享时间：
                  {this.props.shareDatail && this.props.shareDatail.czsj
                    ? this.props.shareDatail.czsj
                    : ''}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  分享类型：
                  {this.props.shareDatail && this.props.shareDatail.lx ? this.props.shareDatail.lx : ''}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className={styles.content}>分享建议：</div>
                  <div className={styles.content} style={{ width: '700px' }}>
                    {this.props.shareDatail && this.props.shareDatail.fxjy
                      ? this.props.shareDatail.fxjy
                      : ''}
                  </div>
                </Col>
              </Row>
            </Modal>*/
            <div>
                <div style={{backgroundColor: '#202839'}}>
                    <span style={{margin: '16px', display: 'block', lineHeight: '61px', fontSize: 20}}>我的消息</span>
                </div>
                <div className={styles.myNewsMessage}>
                    {/*<Card title="我的消息" className={styles.card} bordered={false}>*/}
                    <Row gutter={rowLayout} style={{marginBottom: 24}}>
                        <Col
                            span={8}>案件编号：{this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.ajbh ? this.props.location.query.record.ajbh : ''}</Col>
                        <Col
                            span={this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.name && this.props.location.query.record.name.length > 16 ? 16 : 8}>
                            案件名称：{this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.name ? this.props.location.query.record.name : ''}
                        </Col>
                        <Col span={8}>消息类型：督办反馈</Col>
                    </Row>
                    <Row gutter={rowLayout} style={{marginBottom: 24}}>
                        <Col
                            span={8}>责任人：{this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.zrrName ? this.props.location.query.record.zrrName : ''}</Col>
                        <Col
                            span={8}>反馈时间：{this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.time ? this.props.location.query.record.time : ''}</Col>
                        <Col
                            span={8}>问题类型：{this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.wtlxMc ? this.props.location.query.record.wtlxMc : ''}</Col>
                    </Row>
                    <Row gutter={rowLayout} style={{marginBottom: 24}}>
                        <Col span={24}>
                            责任单位：{this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.zrrDwmc ? this.props.location.query.record.zrrDwmc : ''}
                        </Col>
                    </Row>
                    <Row gutter={rowLayout} style={{marginBottom: 24}}>
                        <Col span={24}>
                            <div className={styles.content}>反馈信息：</div>
                            <div className={styles.content} style={{width: '700px'}}>
                                {this.props.location && this.props.location.query && this.props.location.query.record && this.props.location.query.record.content ? this.props.location.query.record.content : ''}
                            </div>
                        </Col>
                    </Row>
                    {/*</Card>*/}
                </div>
            </div>
        );
    }
}
