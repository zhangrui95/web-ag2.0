/*
 * DailyRecord/index.tsx 日志
 * author：jhm
 * 20191212
 * */

import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, button, Timeline, Row, Col, Tooltip, Tag, Card, Button } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const Option = Select.Option;
import { connect } from 'dva';
import { getUserInfos } from '../../../utils/utils';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const FormItem = Form.Item;

@connect(({ share }) => ({
  share,
}))
class DailyRecord extends PureComponent {

  render() {
    const {query:{record,RzList}} = this.props.location;
    console.log('record',record);
    let list = [];
    if (RzList) {
      RzList.map((item, idx) => {
        let yjName = '';
        if (item.yjjbdm === '5008473') {
          yjName = '一级';
        } else if (item.yjjbdm === '5008472') {
          yjName = '二级';
        } else if (item.yjjbdm === '5008471') {
          yjName = '三级';
        } else if (item.yjjbdm === '5008474') {
          yjName = '失效';
        }
        if (item.name_dm === '0') {
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
                    <p style={{ paddingTop: 7, color: '#fff' }}>{RzList.length - idx}</p>
                  </div>
                </div>
              }
              color='#00CC33'
            >
              <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                <Col md={3} span={24}>
                  {item.name}
                  <Tag style={{
                    background: item.yjjbmc,
                    width: 74,
                    textAlign: 'center',
                    cursor: 'default',
                    color: '#fff',
                    marginLeft:24,
                  }}>{yjName}</Tag>
                </Col>
                <Col md={2} span={24}>
                  <div className={styles.Line} />
                </Col>
                <Col md={4} span={24}>预警时间：{item.insertime}</Col>
                <Col md={15} span={24}>
                  <span>预警类型：{item.yjlxmc}</span>
                </Col>
              </Row>
            </Timeline.Item>,
          );
        }
        else if (item.name_dm === '1') {
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
                    <p style={{ paddingTop: 7, color: '#fff' }}>{RzList.length - idx}</p>
                  </div>
                </div>
              }
              color='#00CC33'
            >
              <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                <Col md={3} span={24}>
                  {item.name}
                  <Tag style={{
                    background: item.yjjbmc,
                    width: 74,
                    textAlign: 'center',
                    cursor: 'default',
                    color: '#fff',
                    // position: 'absolute',
                    // top: '-28px',
                    marginLeft:24,
                  }}>{yjName}</Tag>
                </Col>
                <Col md={2} span={24}>
                  <div className={styles.Line} />
                </Col>
                {item.jsr.split(',').map((e, idx) => {
                  return <Col md={19} span={24} key={idx}>
                    <Row>
                      <Col md={5} span={24}>发送时间：{item.insertime}</Col>
                      <Col md={4} span={24}>接收人：{e}</Col>
                      <Col md={11} span={24} style={{ paddingBottom: 8 }}>接收单位：<Tooltip
                        title={item.jsdw.split(',')[idx].length > 15 ? item.jsdw.split(',')[idx] : null}>{item.jsdw.split(',')[idx].length > 15 ? item.jsdw.split(',')[idx].substring(0, 15) + '...' : item.jsdw.split(',')[idx]}</Tooltip></Col>
                    </Row>
                    <Row>
                      <Col md={24} span={24}>提醒建议：{item.txjy}</Col>
                    </Row>
                  </Col>;
                })}
              </Row>

              {/*<Row style={{ paddingLeft: 30, paddingBottom: 8 }}>*/}

                {/**/}
              {/*</Row>*/}
            </Timeline.Item>,
          );
        }
        else if (item.name_dm === '2') {
          list.push(<div>
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
                    <p style={{ paddingTop: 7, color: '#fff' }}>{RzList.length - idx}</p>
                  </div>
                </div>
              }
              color='#00CC33'
            >
              <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                <Col span={3}>
                  {item.name}
                  <Tag style={{
                    background: '#aaa',
                    width: 74,
                    textAlign: 'center',
                    cursor: 'default',
                    color: '#fff',
                    marginLeft:24,
                  }}>{yjName}</Tag>
                </Col>
                <Col span={2}>
                  <div className={styles.Line} />
                </Col>
                <Col span={4}>失效时间：{item.insertime}</Col>
                <Col span={15}>
                  <span>失效原因：{item.sxyy}</span>
                </Col>
              </Row>
            </Timeline.Item>
          </div>);
        }
      });
    }
    return (
      <div>
        <Card className={styles.standardTable}>
          <Timeline style={{ marginTop: 20, marginLeft: 20 }} className={styles.timeline}>
            {list}
          </Timeline>
        </Card>
          <Card>
            <div className={styles.btns}>
              <Button type="primary" style={{ marginLeft: 8 }} className={styles.qxBtn} onClick={()=>this.onEdit(false)}>
                取消
              </Button>
            </div>
          </Card>
      </div>
    );
  }
}

export default Form.create()(DailyRecord);


