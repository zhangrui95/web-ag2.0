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
import addStyle from '@/assets/common/addStyle.png';
import deletewhite from '@/assets/common/deletewhite.png';
import deleteblack from '@/assets/common/deleteblack.png';
import { connect } from 'dva';
import {tableList} from "@/utils/utils";

const FormItem = Form.Item;
const {TextArea} = Input;

@connect(({ global,QuestionBankConfig }) => ({
  global,QuestionBankConfig,
}))
@Form.create()
export default class addDataVisibleModal extends PureComponent {
  state = {
    messageSuccess:false, // 添加成功提示框
    questionType:'00001', // 添加的题型
    // closeAdd:true, // 默认题目添加的模板是否显示
    showDataList:[], // 以保存的题目存入到该数组中
    showData:[], // 点击添加按钮题目数量的集合
    i:1, // 添加的题目数量统计
  };

  componentDidMount() {

  }



  // 关闭添加题目模态框
  handleCancel = () => {
    this.props.CloseCancelModal();
    this.setState({
      showData:[],
    })
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
          // this.setState({
          //   closeAdd:false,
          // });
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
    // if(this.state.showDataList.length>0){
    //   this.setState({
    //     messageSuccess:true,
    //   })
    // }
    // else {
    //   message.warning('请添加试题');
    // }
    this.props.form.validateFields((err, values) => {
      // console.log('1');
      if(!err){
        // const param = {
        //   dajx:values.dajx,
        //   jdtdagjz:'',
        //   tm:values.tm,
        //   tmlx:num,
        //   tmlxzw:item,
        //   tmxx_1:values.xx1,
        //   tmxx_2:values.xx2,
        //   tmxx_3:values.xx3,
        //   tmxx_4:values.xx4,
        //   xztda:values.zqda,
        // }
        // this.SaveQuestion(param,item);
      }
    })
  }

  // 选择添加的题型
  onChangeType = (e) => {
    this.setState({
      questionType:e.target.value,
    })
  }

  // 添加题目
  addQuestion = () => {
    // this.setState({
    //   closeAdd:true,
    // })
    const { questionType,showData,i } = this.state;

    if(questionType === '00001'){
      const obj = {
        questionType:questionType,
        tab:questionType+i,
      }
      showData.push(obj)
      this.setState({
        i:i+1,
      })
    }
    else if(questionType === '00002'){
      const obj = {
        questionType:questionType,
        tab:questionType+i,
      }
      showData.push(obj)
      this.setState({
        i:i+1,
      })
    }
    else{
      const obj = {
        questionType:questionType,
        tab:questionType+i,
      }
      showData.push(obj)
      this.setState({
        i:i+1,
      })
    }
    this.setState({
      showData:[...showData],
    })
  }

  addQuestions = () => {
    const { questionType,showData,i } = this.state;
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 6};
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 10}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 14}},
    };
    const formItemLayouts = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const formItemLayouts1 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 18}},
    };
    const formItemLayouts2 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 3}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 21}},
    };
    const {form: {getFieldDecorator}} = this.props;

    if(questionType === '00001'){
      // const obj = {
      //   questionType:questionType,
      //   tab:questionType+i,
      // }
      showData.push(<Card style={{padding:'16px 64px 0'}} className={styles.testCard}>
        <div style={{position:'absolute',left:'50%',top:24,marginLeft:-30,zIndex:1001}} onClick={()=>this.deleteAddText(i)}><img src={suspend} width={25} height={25} /></div>
        <Row gutter={rowLayout}>
          <Col sm={24} md={12} xl={12}>
            <FormItem label={"题目"+i+1} {...formItemLayouts1}>
              {getFieldDecorator('tm'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
              })(<Input placeholder="请输入题目,最多50个字"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowLayout}>
          <Col {...colLayout}>
            <FormItem label="选项1" {...formItemLayout}>
              {getFieldDecorator('xx1'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{required:true,message: '请填写选项1'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="选项2" {...formItemLayout}>
              {getFieldDecorator('xx2'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{required:true,message: '请填写选项2'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="选项3" {...formItemLayout}>
              {getFieldDecorator('xx3'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{required:true,message: '请填写选项3'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="选项4" {...formItemLayout}>
              {getFieldDecorator('xx4'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{required:true,message: '请填写选项4'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowLayout}>
          <Col sm={24} md={24} xl={18}>
            <FormItem label="正确答案" {...formItemLayouts}>
              {getFieldDecorator('zqda'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{required:true,message: '请选择正确答案'}],
              })(
                <Radio.Group style={{paddingLeft:'8px'}}>
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
            <FormItem label={"答案解析"+i+1} {...formItemLayouts2}>
              {getFieldDecorator('dajx'+i+1, {
                // initialValue: this.state.caseType,
                rules: [{required:true,message: '请填写答案解析'}],
              })(<textarea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析，若没有请填写“无”"/>)}
            </FormItem>
          </Col>
        </Row>
      </Card>)
      this.setState({
        i:i+1,
      })
    }
    // else if(questionType === '00002'){
    //   const obj = {
    //     questionType:questionType,
    //     tab:questionType+i,
    //   }
    //   showData.push(obj)
    //   this.setState({
    //     i:i+1,
    //   })
    // }
    // else{
    //   const obj = {
    //     questionType:questionType,
    //     tab:questionType+i,
    //   }
    //   showData.push(obj)
    //   this.setState({
    //     i:i+1,
    //   })
    // }
    this.setState({
      showData:[...showData],
    })
  }

  // 保存当前添加的一个单选题目
  HoldOne = (item,num) => {
    if(this.state.showData.length>0){
      this.props.form.validateFields((err, values) => {
        if(!err){
          console.log('2')
          // const param = {
          //   dajx:values.dajx,
          //   jdtdagjz:'',
          //   tm:values.tm,
          //   tmlx:num,
          //   tmlxzw:item,
          //   tmxx_1:values.xx1,
          //   tmxx_2:values.xx2,
          //   tmxx_3:values.xx3,
          //   tmxx_4:values.xx4,
          //   xztda:values.zqda,
          // }
          // this.SaveQuestion(param,item);
        }else{
          console.log('1');
        }
      })
    }
    else {
      message.warning('请添加试题');
    }

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
    let deleteId = [];
    let objDelete={
      tkid:item.id,
    }
    deleteId.push(objDelete);
    this.props.delete(deleteId);
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

  // 删除新增的题目
  deleteAddText = (item,index) => {
    console.log('item',item);
    const {showData} = this.state;
    let newshowData = [];
    showData.forEach((pane, a) => {
      console.log('pane',pane);
      if (pane.tab !== item.tab) {
        newshowData.push(pane);
      }
    });
    this.setState({
      showData:newshowData,
    })
  }


  render() {
    const {questionType,closeAdd,showDataList,showData} = this.state;
    // console.log('showDataList',showDataList);
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 6};
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 10}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 14}},
    };
    const formItemLayouts = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const formItemLayouts1 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 18}},
    };
    const formItemLayouts2 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 3}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 21}},
    };
    const formItemLayouts3 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 2}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const {form: {getFieldDecorator},dark} = this.props;
    return (
      <div>
        <Modal
          title={<div><img src={addStyle} width={20} height={20} style={{marginTop:'-5px',marginRight:"12px"}} />{this.props.title}</div>}
          visible={this.props.visible}
          className={dark?styles.darkshareHeader:styles.shareHeader}
          width={800}
          // style={{top: '250px'}}
          maskClosable={false}
          cancelText={null}
          onCancel={this.handleCancel}
          footer={null}
          // footer={<button onClick={this.addSuccess} className={styles.successBtn}>确定</button>}
        >
          <div className={styles.RadioStyle}>
            <Radio.Group buttonStyle="solid" onChange={this.onChangeType} defaultValue={questionType} >
              <Radio.Button value='00001'>单选</Radio.Button>
              <Radio.Button value='00002'>多选</Radio.Button>
              <Radio.Button value='00003'>简答</Radio.Button>
            </Radio.Group>
          </div>
          <Form onSubmit={()=>this.HoldOne('单选','00001')}>
            {/*{showData}*/}
            {showData.map((item,index)=>{
              if(item.questionType === '00001'){
                return (
                  <Card style={{padding:'16px 64px 0'}} className={styles.testCard}>
                    <div style={{position:'absolute',right:140,top:24,marginLeft:-30,zIndex:1001}} onClick={()=>this.deleteAddText(item,index)}><img src={dark?deleteblack:deletewhite} width={25} height={25} /></div>
                      <Row gutter={rowLayout} style={{paddingLeft:5}}>
                        <Col sm={24} md={22} xl={22}>
                          <FormItem label={"题目"} {...formItemLayouts3}>
                            {getFieldDecorator('tm'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
                            })(<Input placeholder="请输入题目,最多50个字"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col {...colLayout}>
                          <FormItem label="选项1" {...formItemLayout}>
                            {getFieldDecorator('xx1'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项1'}],
                            })(<Input placeholder="请输入"/>)}
                          </FormItem>
                        </Col>
                        <Col {...colLayout}>
                          <FormItem label="选项2" {...formItemLayout}>
                            {getFieldDecorator('xx2'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项2'}],
                            })(<Input placeholder="请输入"/>)}
                          </FormItem>
                        </Col>
                        <Col {...colLayout}>
                          <FormItem label="选项3" {...formItemLayout}>
                            {getFieldDecorator('xx3'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项3'}],
                            })(<Input placeholder="请输入"/>)}
                          </FormItem>
                        </Col>
                        <Col {...colLayout}>
                          <FormItem label="选项4" {...formItemLayout}>
                            {getFieldDecorator('xx4'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项4'}],
                            })(<Input placeholder="请输入"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={24} xl={18}>
                          <FormItem label="正确答案" {...formItemLayouts}>
                            {getFieldDecorator('zqda'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请选择正确答案'}],
                            })(
                              <Radio.Group style={{paddingLeft:'8px'}}>
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
                          <FormItem label={"答案解析"} {...formItemLayouts2}>
                            {getFieldDecorator('dajx'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写答案解析'}],
                            })(<TextArea className={styles.TextareaStyle} placeholder="请输入答案解析，若没有请填写“无”"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                  </Card>
                )
              }
              else if(item.questionType === '00002'){
                return (
                  <Card className={styles.testCard}>
                    <div style={{position:'absolute',right:140,top:24,marginLeft:-30,zIndex:1001}} onClick={()=>this.deleteAddText(item,index)}><img src={dark?deleteblack:deletewhite} width={25} height={25} /></div>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={22} xl={22}>
                          <FormItem label="题目" {...formItemLayouts3}>
                            {getFieldDecorator('dxtm'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
                            })(<Input placeholder="请输入题目,最多50个字"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col {...colLayout}>
                          <FormItem label="选项1" {...formItemLayout}>
                            {getFieldDecorator('dxxx1'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项1'}],
                            })(<Input placeholder="请输入选项1"/>)}
                          </FormItem>
                        </Col>
                        <Col {...colLayout}>
                          <FormItem label="选项2" {...formItemLayout}>
                            {getFieldDecorator('dxxx2'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项2'}],
                            })(<Input placeholder="请输入选项2"/>)}
                          </FormItem>
                        </Col>
                        <Col {...colLayout}>
                          <FormItem label="选项3" {...formItemLayout}>
                            {getFieldDecorator('dxxx3'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项3'}],
                            })(<Input placeholder="请输入选项3"/>)}
                          </FormItem>
                        </Col>
                        <Col {...colLayout}>
                          <FormItem label="选项4" {...formItemLayout}>
                            {getFieldDecorator('dxxx4'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写选项4'}],
                            })(<Input placeholder="请输入选项4"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={24} xl={18}>
                          <FormItem label="正确答案" {...formItemLayouts}>
                            {getFieldDecorator('dxzqda'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请选择正确答案'}],
                            })(
                              <Checkbox.Group style={{paddingLeft:'8px'}}>
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
                          <FormItem label="答案解析" {...formItemLayouts2}>
                            {getFieldDecorator('dxdajx'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写答案解析'}],
                            })(<TextArea className={styles.TextareaStyle} placeholder="请输入答案解析，若没有请填写“无”"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                  </Card>
                )
              }
              else if(item.questionType === '00003'){
                return (
                  <Card className={styles.testCard}>
                    <div style={{position:'absolute',right:140,top:24,marginLeft:-30,zIndex:1001}} onClick={()=>this.deleteAddText(item,index)}><img src={dark?deleteblack:deletewhite} width={25} height={25} /></div>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={22} xl={22}>
                          <FormItem label="题目" {...formItemLayouts3}>
                            {getFieldDecorator('jdtm'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写题目'}],
                            })(<Input placeholder="请输入题目"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={24} xl={24}>
                          <FormItem label="正确答案" {...formItemLayouts2}>
                            {getFieldDecorator('jdzqda'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写正确答案'}],
                            })(<TextArea style={{width:'100%',resize:'none'}} placeholder="请输入答案解析，若没有请填写“无”"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={rowLayout}>
                        <Col sm={24} md={24} xl={24}>
                          <FormItem label="答案解析" {...formItemLayouts2}>
                            {getFieldDecorator('jddajx'+item.tab, {
                              // initialValue: this.state.caseType,
                              rules: [{required:true,message: '请填写答案解析'}],
                            })(<TextArea className={styles.TextareaStyle} placeholder="请输入答案解析，若没有请填写“无”"/>)}
                          </FormItem>
                        </Col>
                      </Row>
                  </Card>
                )
              }
            })}
            <div style={{padding:'18px 148px'}}>
              <Button onClick={() => this.addQuestion()} type="primary" style={{width: '100%'}}>
                <Icon type="plus" /> 新增题目
              </Button>
            </div>
            <div style={{padding:18,textAlign:'center'}}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </div>
          </Form>
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
