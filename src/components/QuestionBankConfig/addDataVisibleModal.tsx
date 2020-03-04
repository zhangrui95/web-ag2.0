/*
 * QuestionBankConfig/addDataVisibleModal.tsx 办案区数据
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal,Button,Form,Input } from 'antd';
import styles from './addDataVisibleModal.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
// import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import suspend from '@/assets/common/suspend.png';
import { connect } from 'dva';
import {tableList} from "@/utils/utils";

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
@Form.create()
export default class addDataVisibleModal extends PureComponent {
  state = {
    messageSuccess:false, // 添加成功提示框
    questionType:'chooseOne', // 添加的题型
  };

  componentDidMount() {

  }

  // 关闭添加题目模态框
  handleCancel = () => {
    this.props.CloseCancelModal();
  }
  // 关闭提示语模态框
  closeTipsCancel = () => {
    this.setState({
      messageSuccess:false,
    })
  }

  // 题目添加确认
  addSuccess = () => {
    // this.props.dispatch({
    //   type:'',
    //   payload:'',
    //   callback:(data)=>{
    //     if(data){
    //       this.setState({
    //         messageSuccess:true,
    //       })
    //     }
    //
    //   }
    // })
  }

  // 选择添加的题型
  onChangeType = (e) => {
    this.setState({
      questionType:e.target.value,
    })
  }

  // 添加题目
  addQuestion = () => {

  }

  // 保存当前添加的一个题目
  HoldOne = () => {

  }

  render() {
    const {questionType} = this.state;
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 6};
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const formItemLayouts = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 3}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 21}},
    };
    const {form: {getFieldDecorator}} = this.props;
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          className={styles.shareHeader}
          width={1200}
          // style={{top: '250px'}}
          maskClosable={false}
          cancelText={null}
          onCancel={this.handleCancel}
          footer={<button onClick={this.addSuccess} className={styles.successBtn}>确定</button>}
        >
          <div style={{borderBottom:'2px solid #000',padding:'0 24px 12px'}}>
            <Radio.Group onChange={this.onChangeType} defaultValue={questionType}>
              <Radio.Button value='chooseOne'>单选</Radio.Button>
              <Radio.Button value='chooseMore'>多选</Radio.Button>
              <Radio.Button value='shortAnswer'>简答</Radio.Button>
            </Radio.Group>
          </div>
          {
            questionType === 'chooseOne'?
              <div style={{padding:16}}>
                <Form onSubmit={this.HoldOne}>
                  <Row gutter={rowLayout}>
                    <Col sm={24} md={12} xl={8}>
                      <FormItem label="题目" {...formItemLayouts}>
                        {getFieldDecorator('tm', {
                          // initialValue: this.state.caseType,
                          //rules: [{max: 32, message: '最多输入32个字！'}],
                        })(<Input placeholder="请输入题目"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={rowLayout}>
                    <Col {...colLayout}>
                      <FormItem label="选项1" {...formItemLayout}>
                        {getFieldDecorator('tm', {
                          // initialValue: this.state.caseType,
                          //rules: [{max: 32, message: '最多输入32个字！'}],
                        })(<Input placeholder="请输入选项1"/>)}
                      </FormItem>
                    </Col>
                    <Col {...colLayout}>
                      <FormItem label="选项2" {...formItemLayout}>
                        {getFieldDecorator('tm', {
                          // initialValue: this.state.caseType,
                          //rules: [{max: 32, message: '最多输入32个字！'}],
                        })(<Input placeholder="请输入选项2"/>)}
                      </FormItem>
                    </Col>
                    <Col {...colLayout}>
                      <FormItem label="选项3" {...formItemLayout}>
                        {getFieldDecorator('tm', {
                          // initialValue: this.state.caseType,
                          //rules: [{max: 32, message: '最多输入32个字！'}],
                        })(<Input placeholder="请输入选项3"/>)}
                      </FormItem>
                    </Col>
                    <Col {...colLayout}>
                      <FormItem label="选项4" {...formItemLayout}>
                        {getFieldDecorator('tm', {
                          // initialValue: this.state.caseType,
                          //rules: [{max: 32, message: '最多输入32个字！'}],
                        })(<Input placeholder="请输入选项4"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={rowLayout}>
                    <Col sm={24} md={24} xl={24}>
                      <FormItem label="答案解析">
                        {getFieldDecorator('dajx', {
                          // initialValue: this.state.caseType,
                          //rules: [{max: 32, message: '最多输入32个字！'}],
                        })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={rowLayout}>
                    <Button style={{marginRight: '8px',float: 'right',}} type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Row>
                </Form>
              </div>
              :
              questionType === 'chooseMore'?
                <div style={{padding:16}}>
                  <Form onSubmit={this.HoldOne}>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={12} xl={8}>
                        <FormItem label="题目" {...formItemLayouts}>
                          {getFieldDecorator('tm', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<Input placeholder="请输入题目"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Col {...colLayout}>
                        <FormItem label="选项1" {...formItemLayout}>
                          {getFieldDecorator('tm', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<Input placeholder="请输入选项1"/>)}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="选项2" {...formItemLayout}>
                          {getFieldDecorator('tm', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<Input placeholder="请输入选项2"/>)}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="选项3" {...formItemLayout}>
                          {getFieldDecorator('tm', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<Input placeholder="请输入选项3"/>)}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="选项4" {...formItemLayout}>
                          {getFieldDecorator('tm', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<Input placeholder="请输入选项4"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={24} xl={24}>
                        <FormItem label="答案解析">
                          {getFieldDecorator('dajx', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Button style={{marginRight: '8px',float: 'right',}} type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Row>
                  </Form>
                </div>
                :
                <div style={{padding:16}}>
                  <Form onSubmit={this.HoldOne}>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={12} xl={8}>
                        <FormItem label="题目" {...formItemLayouts}>
                          {getFieldDecorator('tm', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<Input placeholder="请输入题目"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={24} xl={24}>
                        <FormItem label="答案解析">
                          {getFieldDecorator('dajx', {
                            // initialValue: this.state.caseType,
                            //rules: [{max: 32, message: '最多输入32个字！'}],
                          })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Button style={{marginRight: '8px',float: 'right',}} type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Row>
                  </Form>
                </div>
          }
          <div>
            <Button onClick={() => this.addQuestion()} type="primary" style={{width: '100%', background: '#A3C2FE', border: '1px #6600FF dashed'}}>
              <Icon type="plus" /> 新增题目
            </Button>
          </div>
          <div>
            已添加的题目
          </div>
        </Modal>
        <Modal
          title=""
          visible={this.state.messageSuccess}
          className={this.props.global && this.props.global.dark ? styles.success : styles.successLight}
          width={350}
          style={{top: '250px'}}
          maskClosable={false}
          cancelText={null}
          // onCancel={this.handleCancel}
          footer={<button onClick={this.closeTipsCancel} className={styles.successBtn}>确定</button>}
        >
          题目添加成功！
        </Modal>
      </div>
    )
  }
}
