/*
* Online/EvaluateDetailModal.tsx 测评详情
* author：jhm
* 20200310
* */

import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button, Card, Button, Row, Col, Icon, Upload, Radio, Divider, Checkbox,Radio} from 'antd';
import styles from './EvaluateDetailModal.less';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
import {connect} from 'dva';
import {getUserInfos} from '../../utils/utils';
import moment from "moment";
import Checkbox from "antd/es/checkbox/Checkbox";

const FormItem = Form.Item;

@connect(({}) => ({

}))
class EvaluateDetailModal extends PureComponent {
  constructor(props, context) {
    super(props);

  }

  componentWillReceiveProps(nextProps) {

  }

  // 全部和错题的切换
  changeStatus = (e) => {
    console.log('e',e);
  };

  render() {
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 24}, xl: {span: 24}, xxl: {span: 24}},
      wrapperCol: {xs: {span: 24}, md: {span: 24}, xl: {span: 24}, xxl: {span: 24}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    return (
      <div>
        <Modal
          visible={this.props.visible}
          title={this.props.title}
          // onOk={this.handleOk}
          onCancel={this.props.handleCancel}
          className={styles.shareHeader}
          // confirmLoading={this.state.btnLoading}
          width={1000}
          maskClosable={false}
          // style={{top: '300px'}}
          footer={null}
        >
          <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.textHead} style={{marginLeft:-25}}>
              <Col sm={24} md={6} xl={6} style={{paddingLeft:0}}>
                <span style={{backgroundColor:'#389DF6',color:'#fff',padding:13}}>分数：100分</span>
              </Col>
              <Col sm={24} md={6} xl={6}>
                测评日期：{moment().format('YYYY年MM月DD日')}
              </Col>
              <Col sm={24} md={6} xl={6}>
                测评人员：张三
              </Col>
              <Col sm={24} md={6} xl={6}>
                测评用时：40分25秒
              </Col>
            </Row>
            <div className={styles.changePos}>
              <Radio.Group defaultValue="All" buttonStyle="solid" onChange={this.changeStatus}>
                <Radio.Button value="All">全部</Radio.Button>
                <Radio.Button value="Wrong">错题</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{padding:'0px 48px 36px'}}>
              <div>
                <Divider orientation="left" className={styles.titleLabel}>单选题</Divider>
              </div>
              <Row>
                <Col sm={24} md={24} xl={24}>
                  <div style={{padding:'12px 0'}}>1.取保候审的时长？</div>
                      <Radio.Group defaultValue="选项2" disabled={true}>
                        <Radio value='选项1' className={styles.option}>选项1</Radio>
                        <Radio value='选项2' className={styles.option}>选项2</Radio>
                        <Radio value='选项3' className={styles.option}>选项3</Radio>
                        <Radio value='选项4' className={styles.option}>选项4</Radio>
                      </Radio.Group>
                </Col>
                <Col sm={24} md={24} xl={24}>
                  <div style={{padding:'12px 0'}}>2.取保候审的时长？</div>
                      <Radio.Group defaultValue="选项1" disabled={true}>
                        <Radio value='选项1' className={styles.option}>选项1</Radio>
                        <Radio value='选项2' className={styles.option}>选项2</Radio>
                        <Radio value='选项3' className={styles.option}>选项3</Radio>
                        <Radio value='选项4' className={styles.option}>选项4</Radio>
                      </Radio.Group>
                </Col>
                <Col sm={24} md={24} xl={24}>
                  <div style={{padding:'12px 0'}}>3.取保候审的时长？</div>
                      <Radio.Group defaultValue="选项3" disabled={true}>
                        <Radio value='选项1' className={styles.option}>选项1</Radio>
                        <Radio value='选项2' className={styles.option}>选项2</Radio>
                        <Radio value='选项3' className={styles.option}>选项3</Radio>
                        <Radio value='选项4' className={styles.option}>选项4</Radio>
                      </Radio.Group>
                </Col>
              </Row>
              <div>
                <Divider orientation="left" className={styles.titleLabel}>多选题</Divider>
              </div>
              <Row>
                <Col sm={24} md={24} xl={24}>
                  <div style={{padding:'12px 0'}}>1.取保候审的时长？</div>
                      <Checkbox.Group defaultValue={['选项1','选项3','选项4']} disabled={true}>
                        <Checkbox value='选项1' className={styles.option}>选项1</Checkbox>
                        <Checkbox value='选项2' className={styles.option}>选项2</Checkbox>
                        <Checkbox value='选项3' className={styles.option}>选项3</Checkbox>
                        <Checkbox value='选项4' className={styles.option}>选项4</Checkbox>
                      </Checkbox.Group>
                </Col>
                <Col sm={24} md={24} xl={24}>
                  <div style={{padding:'12px 0'}}>2.取保候审的时长？</div>
                  <Checkbox.Group defaultValue={['选项1','选项2']} disabled={true}>
                    <Checkbox value='选项1' className={styles.option}>选项1</Checkbox>
                    <Checkbox value='选项2' className={styles.option}>选项2</Checkbox>
                    <Checkbox value='选项3' className={styles.option}>选项3</Checkbox>
                    <Checkbox value='选项4' className={styles.option}>选项4</Checkbox>
                  </Checkbox.Group>
                </Col>
              </Row>
              <div>
                <Divider orientation="left" className={styles.titleLabel}>简答题</Divider>
              </div>
              <Row>
                <Col sm={24} md={24} xl={24}>
                  <div style={{padding:'12px 0'}}>2.取保候审的时长？</div>
                  <TextArea
                    placeholder="请输入答案"
                    style={{resize:'none',cursor:'default',color:'rgba(0,0,0,0.65)',backgroundColor:'#fff'}}
                    defaultValue='见覅大家佛阿基德剂发酵东方Joan解耦桉树'
                    disabled={true}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(EvaluateDetailModal);
