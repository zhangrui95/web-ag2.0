/*
* Online/StartExamModal.tsx 开始测评
* author：jhm
* 20200310
* */

import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button, Card, Button, Row, Col, Icon, Upload, Radio, Divider, Checkbox} from 'antd';
import styles from './StartExamModal.less';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
import {connect} from 'dva';
import {getUserInfos} from '../../utils/utils';
import moment from "moment";
import Checkbox from "antd/es/checkbox/Checkbox";

const FormItem = Form.Item;

@connect(({}) => ({

}))
class StartExamModal extends PureComponent {
  constructor(props, context) {
    super(props);
    console.log('props',props);
    let record = JSON.parse(sessionStorage.getItem('user'));
    this.state = {
      record,
      textTime:'',
      TextRules:props.TextRules,
      textData:{},
    };
  }

  componentDidMount(){
    this.getTemplate(); // 获取模板信息详情
  }

  componentWillReceiveProps(nextProps) {

  }

  // 获取模板信息详情
  getTemplate = () => {
    this.props.dispatch({
      type:'QuestionBankConfig/getTemplateDetail',
      payload:{
        id:this.props.TextRules.id,
      },
      callback:(data)=>{
        console.log('data',data);
        if(data){
          this.setState({
            textTime:data.cpsj+':00',
            textData:data,
          })
          this.showtime(parseInt(data.cpsj));
        }
      }
    })
  }

  // 交卷
  handleExam = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        console.log('values',values);
      }
    });
  }

  // 考试倒计时
  showtime(num){
    let that = this
    let time = num*60;
    let newTime = '';
    let timer=setInterval(function () {
      time--;
      const m=Math.floor(time%3600/60);
      const s=time%60;
      // console.log('m',m);
      // console.log('s',s);
      // let m1=Math.floor(m/10).toString();
      // let m2=(m%10).toString();
      // let s1=Math.floor(s/10);
      // let s2=s%10;
      // that.setState({
      //   textTime: Math.floor(m/10)+m%10+':'+Math.floor(s/10)+s%10,
      // })
      newTime = Math.floor(m/10).toString()+(m%10).toString()+':'+Math.floor(s/10).toString()+(s%10).toString()
      // console.log('newTime',newTime);
      that.setState({
        textTime:newTime,
      })
    },1000);

  }
  // 单选题展示
  OneChoose(textDataList,getFieldDecorator,formItemLayout){
    let textDataList1 = [],dxt=[];
    textDataList&&textDataList.length>0?textDataList.map((item)=>{
      if(item.tmlx === '00001'){
        textDataList1.push(item)
      }
    }):'';
    textDataList1&&textDataList1.length>0?textDataList1.map((obj,index)=>{
      dxt.push(<Col sm={24} md={24} xl={24}>
        <FormItem label={index+1+'.'+obj.tm} {...formItemLayout} className={styles.formItem}>
          {getFieldDecorator('dxt'+index+1, {
          })(
            <Radio.Group style={{width:'100%'}}>
              <Radio value={obj.tmxx_1} style={{width:'25%',marginRight:0}}>{obj.tmxx_1}</Radio>
              <Radio value={obj.tmxx_2} style={{width:'25%',marginRight:0}}>{obj.tmxx_2}</Radio>
              <Radio value={obj.tmxx_3} style={{width:'25%',marginRight:0}}>{obj.tmxx_3}</Radio>
              <Radio value={obj.tmxx_4} style={{width:'25%',marginRight:0}}>{obj.tmxx_4}</Radio>
            </Radio.Group>

          )}
        </FormItem>
      </Col>)
    }):'';
    return dxt
  }

  // 多选题展示
  MoreChoose(textDataList,getFieldDecorator,formItemLayout){
    let textDataList1 = [],dxt=[];
    textDataList&&textDataList.length>0?textDataList.map((item)=>{
      if(item.tmlx === '00002'){
        textDataList1.push(item)
      }
    }):'';
    textDataList1&&textDataList1.length>0?textDataList1.map((obj,index)=>{
      dxt.push(<Col sm={24} md={24} xl={24}>
        <FormItem label={index+1+'.'+obj.tm} {...formItemLayout} className={styles.formItem}>
          {getFieldDecorator('mdxt'+index+1, {
            // initialValue: this.state.caseType,
            // rules: [{required:true, message: '请选择发布单位'}],
          })(
            <Checkbox.Group style={{width:'100%'}}>
              <Checkbox value={obj.tmxx_1} style={{width:'25%',marginLeft:0}}>{obj.tmxx_1}</Checkbox>
              <Checkbox value={obj.tmxx_2} style={{width:'25%',marginLeft:0}}>{obj.tmxx_2}</Checkbox>
              <Checkbox value={obj.tmxx_3} style={{width:'25%',marginLeft:0}}>{obj.tmxx_3}</Checkbox>
              <Checkbox value={obj.tmxx_4} style={{width:'25%',marginLeft:0}}>{obj.tmxx_4}</Checkbox>
            </Checkbox.Group>

          )}
        </FormItem>
      </Col>)
    }):'';
    return dxt
  }

  // 简答题展示
  jdtChoose(textDataList,getFieldDecorator,formItemLayout){
    let textDataList1 = [],dxt=[];
    textDataList&&textDataList.length>0?textDataList.map((item)=>{
      if(item.tmlx === '00003'){
        textDataList1.push(item)
      }
    }):'';
    textDataList1&&textDataList1.length>0?textDataList1.map((obj,index)=>{
      dxt.push(<Col sm={24} md={24} xl={24}>
        <FormItem label={index+1+'.'+obj.tm} {...formItemLayout} className={styles.formItem}>
          {getFieldDecorator('jdt'+index+1, {
            // initialValue: this.state.caseType,
            // rules: [{required:true, message: '请选择发布单位'}],
          })(
            <TextArea placeholder="请输入答案" style={{resize:'none'}} />
          )}
        </FormItem>
      </Col>)
    }):'';
    return dxt
  }

  render() {
    const { SureModalVisible,record, from,textTime,textData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 24}, xl: {span: 24}, xxl: {span: 24}},
      wrapperCol: {xs: {span: 24}, md: {span: 24}, xl: {span: 24}, xxl: {span: 24}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    return (
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
          <Form className={styles.standardForm} onSubmit={this.handleExam}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.textHead} style={{marginLeft:-25}}>
              <Col sm={24} md={8} xl={8} style={{paddingLeft:0}}>
                <span style={{backgroundColor:'#389DF6',color:'#fff',padding:13}}>剩余考试时间：{textTime}</span>
              </Col>
              <Col sm={24} md={8} xl={8}>
                考试日期：{moment().format('YYYY年MM月DD日')}
              </Col>
              <Col sm={24} md={8} xl={8}>
                {record&&record.group&&record.group.name?record.group.name:''}：{record&&record.name?record.name:''}
              </Col>
            </Row>
            <div style={{padding:'0px 48px 24px'}}>
              <div>
                <Divider orientation="left" className={styles.titleLabel}>单选题</Divider>
              </div>
              <Row>
                {this.OneChoose(textData.list,getFieldDecorator,formItemLayout)}
                {/*<Col sm={24} md={24} xl={24}>*/}
                  {/*<FormItem label="1.取保候审最长时限为？" {...formItemLayout} className={styles.formItem}>*/}
                    {/*{getFieldDecorator('dxt1', {*/}
                      {/*// initialValue: this.state.caseType,*/}
                      {/*// rules: [{required:true, message: '请选择发布单位'}],*/}
                    {/*})(*/}
                      {/*<Radio.Group onChange={this.onRightAnswer}>*/}
                        {/*<Radio value='选项1'>选项1</Radio>*/}
                        {/*<Radio value='选项2'>选项2</Radio>*/}
                        {/*<Radio value='选项3'>选项3</Radio>*/}
                        {/*<Radio value='选项4'>选项4</Radio>*/}
                      {/*</Radio.Group>*/}

                    {/*)}*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
              </Row>
              <div>
                <Divider orientation="left" className={styles.titleLabel}>多选题</Divider>
              </div>
              <Row>
                {this.MoreChoose(textData.list,getFieldDecorator,formItemLayout)}
                {/*<Col sm={24} md={24} xl={24}>*/}
                  {/*<FormItem label="1.取保候审最长时限为？" {...formItemLayout} className={styles.formItem}>*/}
                    {/*{getFieldDecorator('mdxt1', {*/}
                      {/*// initialValue: this.state.caseType,*/}
                      {/*// rules: [{required:true, message: '请选择发布单位'}],*/}
                    {/*})(*/}
                      {/*<Checkbox.Group onChange={this.onRightAnswer}>*/}
                        {/*<Checkbox value='选项1'>选项1</Checkbox>*/}
                        {/*<Checkbox value='选项2'>选项2</Checkbox>*/}
                        {/*<Checkbox value='选项3'>选项3</Checkbox>*/}
                        {/*<Checkbox value='选项4'>选项4</Checkbox>*/}
                      {/*</Checkbox.Group>*/}

                    {/*)}*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
              </Row>
              <div>
                <Divider orientation="left" className={styles.titleLabel}>简答题</Divider>
              </div>
              <Row>
                {this.jdtChoose(textData.list,getFieldDecorator,formItemLayout)}
                {/*<Col sm={24} md={24} xl={24}>*/}
                  {/*<FormItem label="1.取保候审最长时限为？" {...formItemLayout} className={styles.formItem}>*/}
                    {/*{getFieldDecorator('jdt1', {*/}
                      {/*// initialValue: this.state.caseType,*/}
                      {/*// rules: [{required:true, message: '请选择发布单位'}],*/}
                    {/*})(*/}
                      {/*<TextArea placeholder="请输入答案" style={{resize:'none'}} />*/}
                    {/*)}*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
              </Row>
            </div>
            <div>
              <Row>
                <div className={styles.startButton}>
                  <Button type="primary" htmlType="submit">
                    交卷
                  </Button>
                </div>
              </Row>
            </div>
          </Form>

          <Modal
            title=""
            visible={this.state.success}
            className={this.props.global && this.props.global.dark ? styles.success : styles.successLight}
            width={350}
            style={{top: '250px'}}
            maskClosable={false}
            cancelText={null}
            // onCancel={this.handleCancel}
            footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
          >
            交卷成功！
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(StartExamModal);
