/*
 * 首页我的分享弹框
 * author：zr
 * 20190424
 * */
import React, { PureComponent } from 'react';
import { Col, Row, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../../pages/ShowData/Show.less';

@connect(({ home }) => ({
  home,
}))
export default class MyShare extends PureComponent {
  render() {
    return (
      <Modal
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
      </Modal>
    );
  }
}
