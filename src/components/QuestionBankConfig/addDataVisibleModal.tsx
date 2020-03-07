/*
 * QuestionBankConfig/addDataVisibleModal.tsx 添加题目
 * author：jhm
 * 20200305
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

@connect(({ global,QuestionBankConfig }) => ({
  global,QuestionBankConfig,
}))
@Form.create()
export default class addDataVisibleModal extends PureComponent {
  state = {
    messageSuccess:false, // 添加成功提示框
    questionType:'chooseOne', // 添加的题型
    closeAdd:true, // 默认题目添加的模板是否显示
    showDataList:[], // 以保存的题目存入到该数组中
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
    const refreshParam={
      currentPage: 1,
      showCount: tableList,
      pd: {},
    }
    this.props.getItemConfigList(refreshParam);
    this.props.closeAddDataVisibleModal();
  }

  // 保存添加的题目
  SaveQuestion = (obj,item) => {
    this.props.dispatch({
      type:'QuestionBankConfig/getSaveQuestion',
      payload:obj?obj:'',
      callback:(data)=>{
        if(data&&data.error===null){
          this.setState({
            closeAdd:false,
          });
          let showDataList=[...this.state.showDataList];
          showDataList.push(data.data.list);
          this.setState({
            showDataList,
          })
        }
      }
    })
  }

  // 确认添加的题目关闭题目添加模态框，刷新列表
  addSuccess = () => {
    if(this.state.showDataList.length>0){
      this.setState({
        messageSuccess:true,
      })
    }
    else {
      message.warning('请添加试题');
    }
  }

  // 选择添加的题型
  onChangeType = (e) => {
    this.setState({
      questionType:e.target.value,
    })
  }

  // 添加题目
  addQuestion = () => {
    this.setState({
      closeAdd:true,
    })
  }

  // 保存当前添加的一个单选题目
  HoldOne = (item,num) => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        const param = {
          dajx:values.dajx,
          jdtdagjz:'',
          tm:values.tm,
          tmlx:num,
          tmlxzw:item,
          tmxx_1:values.xx1,
          tmxx_2:values.xx2,
          tmxx_3:values.xx3,
          tmxx_4:values.xx4,
          xztda:values.zqda,
        }
        this.SaveQuestion(param,item);
      }
    })
  }

  HoldMore = (item,num) => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        const param = {
          dajx:values.dxdajx,
          jdtdagjz:'',
          tm:values.dxtm,
          tmlx:num,
          tmlxzw:item,
          tmxx_1:values.dxxx1,
          tmxx_2:values.dxxx2,
          tmxx_3:values.dxxx3,
          tmxx_4:values.dxxx4,
          xztda:values.dxzqda.toString(),
        }
        this.SaveQuestion(param,item);
      }
    })
  }


  // 保存当前添加的一个简答题目
  HoldShortAnswer = (item,num) => {
    this.props.form.validateFields((err, values) => {
      // console.log('values',values);
      if(!err){
        const param = {
          dajx:values.jddajx,
          jdtdagjz:values.jdzqda,
          tm:values.jdtm,
          tmlx:num,
          tmlxzw:item,
        }
        this.SaveQuestion(param,item);
      }
    })
  }


  // 题目添加完成后再预览的地方删除
  deleteNowChange = (item) => {
    const {showDataList} = this.state;
    let newshowDataList = [];
    console.log('item',item)
    this.props.deleteListData(item);
    showDataList&&showDataList.length>0?(
      showDataList.map((obj)=>{
        if(obj.id===item.id){
          // newshowDataList.push(obj)
          this.setState({
            showDataList:[],
          })
        }

      })
    ):''
  }

  render() {
    const {questionType,closeAdd,showDataList} = this.state;
    console.log('showDataList',showDataList);
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 6};
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
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
            questionType === 'chooseOne'&&closeAdd?
              <div style={{padding:16}}>
                <Form onSubmit={()=>this.HoldOne('单选','00001')}>
                  <Row gutter={rowLayout}>
                    <Col sm={24} md={12} xl={8}>
                      <FormItem label="题目" {...formItemLayouts}>
                        {getFieldDecorator('tm', {
                          // initialValue: this.state.caseType,
                          rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
                        })(<Input placeholder="请输入题目,最多50个字"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={rowLayout}>
                    <Col {...colLayout}>
                      <FormItem label="选项1" {...formItemLayout}>
                        {getFieldDecorator('xx1', {
                          // initialValue: this.state.caseType,
                          rules: [{required:true,message: '请填写选项1'}],
                        })(<Input placeholder="请输入选项1"/>)}
                      </FormItem>
                    </Col>
                    <Col {...colLayout}>
                      <FormItem label="选项2" {...formItemLayout}>
                        {getFieldDecorator('xx2', {
                          // initialValue: this.state.caseType,
                          rules: [{required:true,message: '请填写选项2'}],
                        })(<Input placeholder="请输入选项2"/>)}
                      </FormItem>
                    </Col>
                    <Col {...colLayout}>
                      <FormItem label="选项3" {...formItemLayout}>
                        {getFieldDecorator('xx3', {
                          // initialValue: this.state.caseType,
                          rules: [{required:true,message: '请填写选项3'}],
                        })(<Input placeholder="请输入选项3"/>)}
                      </FormItem>
                    </Col>
                    <Col {...colLayout}>
                      <FormItem label="选项4" {...formItemLayout}>
                        {getFieldDecorator('xx4', {
                          // initialValue: this.state.caseType,
                          rules: [{required:true,message: '请填写选项4'}],
                        })(<Input placeholder="请输入选项4"/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={rowLayout}>
                    <Col sm={24} md={24} xl={12}>
                      <FormItem label="正确答案" {...formItemLayouts}>
                        {getFieldDecorator('zqda', {
                          // initialValue: this.state.caseType,
                          rules: [{required:true,message: '请选择正确答案'}],
                        })(
                          <Radio.Group onChange={this.onRightAnswer} >
                            <Radio value='选项1'>选项1</Radio>
                            <Radio value='选项2'>选项2</Radio>
                            <Radio value='选项3'>选项3</Radio>
                            <Radio value='选项4'>选项4</Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={rowLayout}>
                    <Col sm={24} md={24} xl={24}>
                      <FormItem label="答案解析">
                        {getFieldDecorator('dajx', {
                          // initialValue: this.state.caseType,
                          rules: [{required:true,message: '请填写答案解析'}],
                        })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析，若没有请填写“无”"/>)}
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
              questionType === 'chooseMore'&&closeAdd?
                <div style={{padding:16}}>
                  <Form onSubmit={()=>this.HoldMore('多选','00002')}>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={12} xl={8}>
                        <FormItem label="题目" {...formItemLayouts}>
                          {getFieldDecorator('dxtm', {
                            // initialValue: this.state.caseType,
                            rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
                          })(<Input placeholder="请输入题目,最多50个字"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Col {...colLayout}>
                        <FormItem label="选项1" {...formItemLayout}>
                          {getFieldDecorator('dxxx1', {
                            // initialValue: this.state.caseType,
                            rules: [{required:true,message: '请填写选项1'}],
                          })(<Input placeholder="请输入选项1"/>)}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="选项2" {...formItemLayout}>
                          {getFieldDecorator('dxxx2', {
                            // initialValue: this.state.caseType,
                            rules: [{required:true,message: '请填写选项2'}],
                          })(<Input placeholder="请输入选项2"/>)}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="选项3" {...formItemLayout}>
                          {getFieldDecorator('dxxx3', {
                            // initialValue: this.state.caseType,
                            rules: [{required:true,message: '请填写选项3'}],
                          })(<Input placeholder="请输入选项3"/>)}
                        </FormItem>
                      </Col>
                      <Col {...colLayout}>
                        <FormItem label="选项4" {...formItemLayout}>
                          {getFieldDecorator('dxxx4', {
                            // initialValue: this.state.caseType,
                            rules: [{required:true,message: '请填写选项4'}],
                          })(<Input placeholder="请输入选项4"/>)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={24} xl={12}>
                        <FormItem label="正确答案" {...formItemLayouts}>
                          {getFieldDecorator('dxzqda', {
                            // initialValue: this.state.caseType,
                            rules: [{required:true,message: '请选择正确答案'}],
                          })(
                            <Checkbox.Group onChange={this.onRightAnswer} >
                              <Checkbox  value='选项1'>选项1</Checkbox>
                              <Checkbox  value='选项2'>选项2</Checkbox>
                              <Checkbox  value='选项3'>选项3</Checkbox>
                              <Checkbox  value='选项4'>选项4</Checkbox>
                            </Checkbox.Group>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={rowLayout}>
                      <Col sm={24} md={24} xl={24}>
                        <FormItem label="答案解析">
                          {getFieldDecorator('dxdajx', {
                            // initialValue: this.state.caseType,
                            rules: [{required:true,message: '请填写答案解析'}],
                          })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析，若没有请填写“无”"/>)}
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
                questionType === 'shortAnswer'&&closeAdd?
                  <div style={{padding:16}}>
                    <Form onSubmit={()=>this.HoldShortAnswer('简答','00003')}>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={12} xl={8}>
                          <FormItem label="题目" {...formItemLayouts}>
                            {getFieldDecorator('jdtm', {
                              // initialValue: this.state.caseType,
                              rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
                            })(<Input placeholder="请输入题目"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={24} xl={24}>
                          <FormItem label="正确答案">
                            {getFieldDecorator('jdzqda', {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写正确答案'}],
                            })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析，若没有请填写“无”"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={24} xl={24}>
                          <FormItem label="答案解析">
                            {getFieldDecorator('jddajx', {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写答案解析'}],
                            })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析，若没有请填写“无”"/>)}
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
                  ''
          }
          <div style={{padding:18}}>
            <Button onClick={() => this.addQuestion()} type="primary" style={{width: '100%', background: '#A3C2FE', border: '1px #6600FF dashed'}}>
              <Icon type="plus" /> 新增题目
            </Button>
          </div>
          <div>
            {showDataList.map((item)=>{
              const reftem = item.tmlx==='00003'?(
                <Card title={'题目类型：'+item.tmlx} extra={<Button type='primary' onClick={()=>this.deleteNowChange(item)}>删除</Button>}>
                  <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}</Row>
                  <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.jdtdagjz}</Row>
                  <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
                </Card>
              ):(
                <Card title={'题目类型：'+item.tmlx} extra={<Button type='primary' onClick={()=>this.deleteNowChange(item)}>删除</Button>}>
                  <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}</Row>
                  <Row>选项：&nbsp;&nbsp;&nbsp;&nbsp;选项1：{item.tmxx1} 选项2：{item.tmxx2} 选项3：{item.tmxx3} 选项4：{item.tmxx4}</Row>
                  <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.da}</Row>
                  <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
                </Card>
              )
              return <div style={{border:'1px solid #ccc',borderRadius:5,margin:18}}>{reftem}</div>
            })}
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
          footer={<button onClick={this.closeTipsCancel} className={styles.successBtn}>确定</button>}
        >
          题目添加成功！
        </Modal>
      </div>
    )
  }
}
