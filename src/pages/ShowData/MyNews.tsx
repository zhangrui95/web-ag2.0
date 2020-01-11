/*
 * 首页我的消息查看
 * author：zr
 * 20190424
 * */
import React, {PureComponent} from 'react';
import {Col, Row, Modal, Card} from 'antd';
import {connect} from 'dva';
import styles from './HomepageCommon.less';

@connect(({home, global}) => ({
    home, global
}))
export default class MyNews extends PureComponent {
    constructor(props) {
        super(props);
        let res = this.props.location.query && this.props.location.query.record ? this.props.location.query.record : '';
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            res:res,
        }
    }
    render() {
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const {query} = this.props.location;
        let dark = this.props.global && this.props.global.dark;
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
            <div  className={styles.box}>
                <div style={{backgroundColor: dark ? '#202839' : '#fff',padding:'16px 16px 0'}}>
                    <span className={ dark ? styles.title : styles.titles}>我的消息</span>
                </div>
                <div className={styles.myNewsMessage} style={{backgroundColor: dark ? '#202839' : '#fff'}}>
                    <Row gutter={rowLayout} style={{marginBottom: 24}}>
                        <Col span={8}>案件编号：{query && this.state.res && this.state.res.ajbh ? this.state.res.ajbh : ''}</Col>
                        <Col
                            span={query && this.state.res && this.state.res.name && this.state.res.name.length > 16 ? 16 : 8}>
                            案件名称：{query && this.state.res && this.state.res.name ? this.state.res.name : ''}
                        </Col>
                        <Col span={8}>消息类型：督办反馈</Col>
                        <Col
                            span={8}>责任人：{query && this.state.res && this.state.res.zrrName ? this.state.res.zrrName : ''}</Col>
                        <Col span={8}>反馈时间：{query && this.state.res && this.state.res.time ? this.state.res.time : ''}</Col>
                        <Col
                            span={8}>问题类型：{query && this.state.res && this.state.res.wtlxMc ? this.state.res.wtlxMc : ''}</Col>
                        <Col span={24}>
                            责任单位：{query && this.state.res && this.state.res.zrrDwmc ? this.state.res.zrrDwmc : ''}
                        </Col>
                        <Col span={24}>
                            <div className={styles.content}>反馈信息：</div>
                            <div className={styles.content} style={{width: '700px'}}>
                                {query && this.state.res && this.state.res.content ? this.state.res.content : ''}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
