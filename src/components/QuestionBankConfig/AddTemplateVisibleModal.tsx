/*
 * QuestionBankConfig/addDataVisibleModal.tsx 添加测评模板
 * author：jhm
 * 20200305
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal,Button,Form,Input,Select } from 'antd';
import styles from './AddTemplateVisibleModal.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
// import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import suspend from '@/assets/common/suspend.png';
import QuestionListmodal from '../../components/QuestionBankConfig/QuestionListModal';
import { connect } from 'dva';
import {tableList} from "@/utils/utils";

const FormItem = Form.Item;
const {Option} = Select;

@connect(({ global,QuestionBankConfig,common }) => ({
  global,QuestionBankConfig,common
}))
@Form.create()
export default class AddTemplateVisibleModal extends PureComponent {
  state = {
    messageSuccess:false, // 添加成功提示框
    closeAdd:true, // 默认题目添加的模板是否显示
    showDataList1:[], // 已保存的单选题目存入到该数组中
    showDataList2:[], // 已保存的多选题目存入到该数组中
    showDataList3:[], // 已保存的简答题目存入到该数组中
    QuestionListVisible:false,
    questionTypeLabel:''// 添加的题型（单选，多选，简答）
  };

  componentDidMount() {
    this.getDictNum1(); // 单选题分值字典项
    this.getDictNum2(); // 单选题数量字典项
    this.getDictNum3(); // 多选题分值字典项
    this.getDictNum4(); // 多选题数量字典项
    this.getDictNum5(); // 简答题数量字典项
    this.getDictNum6(); // 简答题分值字典项
  }
  // 单选题分值字典项
  getDictNum1 = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd:{
          id: "169f3e8a-2805-404a-a802-1c160d0e262c",
          name: "",
          appCode: "106305",
        },
        showCount: tableList,
      },
    })
  };
  // 单选题数量字典项
  getDictNum2 = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd:{
          id: "1368b400-c289-4d11-b67c-a79af7269913",
          name: "",
          appCode: "106305",
        },
        showCount: tableList,
      },
    })
  };
  // 多选题分值字典项
  getDictNum3 = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd:{
          id: "9f624ef3-01de-457c-a7f4-da1fe2c22bd2",
          name: "",
          appCode: "106305",
        },
        showCount: tableList,
      },
    })
  };
  // 多选题数量字典项
  getDictNum4 = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd:{
          id: "ebbfd1d8-425d-49dc-a9a8-9a3612a8659e",
          name: "",
          appCode: "106305",
        },
        showCount: tableList,
      },
    })
  };
  // 简答题数量字典项
  getDictNum5 = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd:{
          id: "2186a256-871d-43df-9176-2cd5cf40d1d6",
          name: "",
          appCode: "106305",
        },
        showCount: tableList,
      },
    })
  };
  // 简答题分值字典项
  getDictNum6 = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd:{
          id: "d7901059-ed7a-4dc0-93f9-8926ef7ac592",
          name: "",
          appCode: "106305",
        },
        showCount: tableList,
      },
    })
  };

  // 关闭添加模板的模态框
  handleCancel = () => {
    this.props.CloseCancelModal()
  }

  // 模板保存
  addSuccess = () => {
    const {showDataList1,showDataList2,showDataList3} = this.state;
    this.props.form.validateFields((err, values) => {
      if(!err){
        if(parseInt(values.dxt)*parseInt(values.dxtfz)+parseInt(values.mdxt)*parseInt(values.mdxtfz)+parseInt(values.jdt)*parseInt(values.jdtfz)>100){
          message.warning('所选题目的分数超过总分')
        }
        else if(parseInt(values.dxt)*parseInt(values.dxtfz)+parseInt(values.mdxt)*parseInt(values.mdxtfz)+parseInt(values.jdt)*parseInt(values.jdtfz)!==100){
          message.warning('所选题目的分数与定义的总分不符')
        }
        else if(showDataList1.length!==parseInt(values.dxt)){
          message.warning('单选题数量与设定的不符合')
        }
        else if(showDataList2.length!==parseInt(values.mdxt)){
          message.warning('多选题数量与设定的不符合')
        }
        else if(showDataList3.length!==parseInt(values.jdt)){
          message.warning('简答题数量与设定的不符合')
        }
        else {
          let newId = [];
          showDataList1.map((item=>{
            const tlid={
              tkid:item.id,
            }
            newId.push(tlid)
          }))
          showDataList2.map((item=>{
            const tlid={
              tkid:item.id,
            }
            newId.push(tlid)
          }))
          showDataList3.map((item=>{
            const tlid={
              tkid:item.id,
            }
            newId.push(tlid)
          }))
          this.props.dispatch({
            type:'QuestionBankConfig/getSaveTemplate',
            payload:{
              cpmbzw:values.cpmbmc,
              cpsj:values.cpsj,
              duoxtfz:values.mdxtfz,
              duoxtsl:values.mdxt,
              dxtfz:values.dxtfz,
              dxtsl:values.dxt,
              jdtfz:values.jdtfz,
              jdtsl:values.jdt,
              tkxx:newId,
            },
            callback:(data)=>{
              if(data&&data.error===null){
                this.setState({
                  messageSuccess:true,
                })
              }
            }
          })
        }

      }
    })
  }
  // 提示成功模态框
  closeTipsCancel = () => {
    const param = {
      pd:{},
      currentPage:1,
      showCount:10,
    }
    this.props.getTemplateConfigList(param);
    this.props.CloseCancelModal();
    this.setState({
      messageSuccess:false,
    })
  }
  // 添加题目
  addQuestion = (obj) => {
    this.setState({
      QuestionListVisible:true,
      questionTypeLabel:obj,
    })
  }
  // 关闭题目列表模态框
  closeAddCancel = (flag) => {
    this.setState({
      QuestionListVisible:!!flag,
    })
  }
  // 选中添加的题目
  chooseSelect = (item,label) => {
    if(label==='00001'){
      this.setState({
        showDataList1:item,
        QuestionListVisible:false,
      })
    }
    else if(label==='00002'){
      this.setState({
        showDataList2:item,
        QuestionListVisible:false,
      })
    }
    else if(label==='00003'){
      this.setState({
        showDataList3:item,
        QuestionListVisible:false,
      })
    }
  }
  // 删除当前添加的题目
  deleteNowChange = (item,label) =>{
    const {showDataList1,showDataList2,showDataList3} = this.state;
    let newshowDataList1 = [],newshowDataList2 = [],newshowDataList3 = [];
    if(label==='00001'){
      showDataList1&&showDataList1.length>0?(
        showDataList1.map((obj)=>{
          if(obj.id!==item.id){
            newshowDataList1.push(obj)
            this.setState({
              showDataList1:newshowDataList1,
            })
          }
        })
      ):''
    }
    else if(label==='00002'){
      showDataList2&&showDataList2.length>0?(
        showDataList2.map((obj)=>{
          if(obj.id!==item.id){
            newshowDataList2.push(obj)
            this.setState({
              showDataList2:newshowDataList2,
            })
          }
        })
      ):''
    }
    else if(label==='00003'){
      showDataList3&&showDataList3.length>0?(
        showDataList3.map((obj)=>{
          if(obj.id!==item.id){
            newshowDataList3.push(obj)
            this.setState({
              showDataList3:newshowDataList3,
            })
          }
        })
      ):''
    }

  }

  // 展示添加的单选题
  showaddobj1(showDataList1){
    let obj=[];
    showDataList1.map((item)=>{
      return(
        obj.push(<Card className={styles.Card}>
          <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}<Button type='primary' onClick={()=>this.deleteNowChange(item,'00001')} style={{float:'right'}}>删除</Button></Row>
          <Row>选项：&nbsp;&nbsp;&nbsp;&nbsp;选项1：{item.tmxx_1} 选项2：{item.tmxx_2} 选项3：{item.tmxx_3} 选项4：{item.tmxx_4}</Row>
          <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.xztda}</Row>
          <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
        </Card>)
      )
    })
    return <div>{obj}</div>;
  }
  // 展示添加的多选题
  showaddobj2(showDataList2){
    let obj=[];
    showDataList2.map((item)=>{
      return(
        obj.push(<Card className={styles.Card}>
          <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}<Button type='primary' onClick={()=>this.deleteNowChange(item,'00002')} style={{float:'right'}}>删除</Button></Row>
          <Row>选项：&nbsp;&nbsp;&nbsp;&nbsp;选项1：{item.tmxx_1} 选项2：{item.tmxx_2} 选项3：{item.tmxx_3} 选项4：{item.tmxx_4}</Row>
          <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.xztda}</Row>
          <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
        </Card>)
      )
    })
    return <div>{obj}</div>;
  }

  // 展示添加的简答题
  showaddobj3(showDataList3){
    let obj=[];
    showDataList3.map((item)=>{
      return(
        obj.push(<Card className={styles.Card}>
          <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}<Button type='primary' onClick={()=>this.deleteNowChange(item,'00003')} style={{float:'right'}}>删除</Button></Row>
          <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.jdtdagjz}</Row>
          <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
        </Card>)
      )
    })
    return <div>{obj}</div>;
  }

  render() {
    const {closeAdd,showDataList1,QuestionListVisible,questionTypeLabel,showDataList2,showDataList3,messageSuccess} = this.state;
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 12};
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
    };
    const formItemLayout1 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 6}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 18}},
    };
    const formItemLayouts1 = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 14}},
    };
    const formItemLayouts = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 6}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 14}},
    };
    const {form: {getFieldDecorator},common:{DxtTypeData, DxtNumTypeData, mDxtNumTypeData, mDxtTypeData, jdtNumTypeData, jdtTypeData}} = this.props;
    console.log('DxtTypeData',DxtTypeData)
    console.log('DxtNumTypeData',DxtNumTypeData)
    console.log('mDxtNumTypeData',mDxtNumTypeData)
    console.log('mDxtTypeData',mDxtTypeData)
    console.log('jdtNumTypeData',jdtNumTypeData)
    console.log('jdtTypeData',jdtTypeData)
    let DxtTypeDataDictOptions = [],DxtNumTypeDataDictOptions = [],mDxtNumTypeDataDictOptions = [],mDxtTypeDataDictOptions = [],jdtNumTypeDataDictOptions = [],jdtTypeDataDictOptions = [];
    if (DxtTypeData.length > 0) {
      for (let i = 0; i < DxtTypeData.length; i++) {
        const item = DxtTypeData[i];
        DxtTypeDataDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    if (DxtNumTypeData.length > 0) {
      for (let i = 0; i < DxtNumTypeData.length; i++) {
        const item = DxtNumTypeData[i];
        DxtNumTypeDataDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    if (mDxtNumTypeData.length > 0) {
      for (let i = 0; i < mDxtNumTypeData.length; i++) {
        const item = mDxtNumTypeData[i];
        mDxtNumTypeDataDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    if (mDxtTypeData.length > 0) {
      for (let i = 0; i < mDxtTypeData.length; i++) {
        const item = mDxtTypeData[i];
        mDxtTypeDataDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    if (jdtNumTypeData.length > 0) {
      for (let i = 0; i < jdtNumTypeData.length; i++) {
        const item = jdtNumTypeData[i];
        jdtNumTypeDataDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    if (jdtTypeData.length > 0) {
      for (let i = 0; i < jdtTypeData.length; i++) {
        const item = jdtTypeData[i];
        jdtTypeDataDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
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
          footer={<button onClick={this.addSuccess} className={styles.successBtn}>保存</button>}
        >
         <Form>
           <Row>
             <Col {...colLayout} className={styles.Col}>
               <FormItem label="测评模板名称" {...formItemLayouts1}>
                {getFieldDecorator('cpmbmc', {
                  // initialValue: this.state.caseType,
                  rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写模板名称'}],
                })(<Input placeholder="请输入题目,最多50个字"/>)}
               </FormItem>
             </Col>
             <Col {...colLayout} className={styles.Col}>
               <FormItem label="测评时间（分钟）" {...formItemLayouts}>
                {getFieldDecorator('cpsj', {
                  // initialValue: this.state.caseType,
                  rules: [{max: 50, message: '最多输入50个字！'},{required:true,message: '请填写测评时间'},{pattern: /^[0-9]+$/, message: '请输入数字！'},],
                })(<Input placeholder="请输入时间,单位：分钟"/>)}
               </FormItem>
             </Col>
           </Row>
            <Row>
              <Col sm={24} md={12} xl={12} className={styles.Col}>
                <Row>
                  <Col sm={24} md={12} xl={12} style={{paddingLeft:9}}>
                    <FormItem label="单选题" {...formItemLayout1}>
                      {getFieldDecorator('dxt', {
                        rules: [{required:true,message: '请选择单选题数量'}],
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '100%'}}
                          // getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
                        >
                          {/*<Option value="">全部</Option>*/}
                          {/*<Option value="5">5</Option>*/}
                          {/*<Option value="8">8</Option>*/}
                          {/*<Option value="10">10</Option>*/}
                          {/*<Option value="15">15</Option>*/}
                          {DxtNumTypeDataDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={24} md={12} xl={2} style={{padding:'9px 0 0 9px'}}>
                    个，
                  </Col>
                  <Col sm={24} md={12} xl={8}>
                    <FormItem label="每个" {...formItemLayout}>
                      {getFieldDecorator('dxtfz', {
                        rules: [{required:true,message: '请选择单选题每题分值'}],
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '100%'}}
                          // getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
                        >
                          {/*<Option value="">全部</Option>*/}
                          {/*<Option value="1">1</Option>*/}
                          {/*<Option value="2">2</Option>*/}
                          {DxtTypeDataDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={24} md={12} xl={2} style={{padding:'9px 0 0 9px'}}>
                    分
                  </Col>
                </Row>
              </Col>
              <Col sm={24} md={12} xl={12} className={styles.Col}>
                <Row>
                  <Col sm={24} md={12} xl={12} style={{paddingLeft:9}}>
                    <FormItem label="多选题" {...formItemLayout1}>
                      {getFieldDecorator('mdxt', {
                        rules: [{required:true,message: '请选择多选题数量'}],
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '100%'}}
                          // getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
                        >
                          {/*<Option value="">全部</Option>*/}
                          {/*<Option value="5">5</Option>*/}
                          {/*<Option value="8">8</Option>*/}
                          {/*<Option value="10">10</Option>*/}
                          {/*<Option value="15">15</Option>*/}
                          {mDxtNumTypeDataDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={24} md={12} xl={2} style={{padding:'9px 0 0 9px'}}>
                    个，
                  </Col>
                  <Col sm={24} md={12} xl={8}>
                    <FormItem label="每个" {...formItemLayout}>
                      {getFieldDecorator('mdxtfz', {
                        rules: [{required:true,message: '请选择多选题每题分值'}],
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '100%'}}
                          // getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
                        >
                          {/*<Option value="">全部</Option>*/}
                          {/*<Option value="10">10</Option>*/}
                          {/*<Option value="20">20</Option>*/}
                          {mDxtTypeDataDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={24} md={12} xl={2} style={{padding:'9px 0 0 9px'}}>
                    分
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12} xl={12} className={styles.Col}>
                <Row>
                  <Col sm={24} md={12} xl={12} style={{paddingLeft:9}}>
                    <FormItem label="简答题" {...formItemLayout1}>
                      {getFieldDecorator('jdt', {
                        rules: [{required:true,message: '请选择简答题数量'}],
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '100%'}}
                          // getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
                        >
                          {/*<Option value="">全部</Option>*/}
                          {/*<Option value="1">1</Option>*/}
                          {/*<Option value="2">2</Option>*/}
                          {/*<Option value="3">3</Option>*/}
                          {jdtNumTypeDataDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={24} md={12} xl={2} style={{padding:'9px 0 0 9px'}}>
                    个，
                  </Col>
                  <Col sm={24} md={12} xl={8}>
                    <FormItem label="每个" {...formItemLayout}>
                      {getFieldDecorator('jdtfz', {
                        rules: [{required:true,message: '请选择简答题每题分值'}],
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '100%'}}
                          // getPopupContainer={() => document.getElementById('cptkpzsjtableListForm')}
                        >
                          {/*<Option value="">全部</Option>*/}
                          {/*<Option value="10">10</Option>*/}
                          {/*<Option value="20">20</Option>*/}
                          {/*<Option value="30">30</Option>*/}
                          {jdtTypeDataDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col sm={24} md={12} xl={2} style={{padding:'9px 0 0 9px'}}>
                    分
                  </Col>
                </Row>
              </Col>
            </Row>
           <div style={{fontSize:16,fontWeight:'bold'}}>
             <Divider orientation="left">单选题</Divider>
           </div>
           {this.showaddobj1(showDataList1)}
           <div style={{padding:18}}>
             <Button onClick={() => this.addQuestion('00001')} type="primary" style={{width: '100%', background: '#A3C2FE', border: '1px #6600FF dashed'}}>
               <Icon type="plus" />
             </Button>
           </div>

           <div style={{fontSize:16,fontWeight:'bold'}}>
             <Divider orientation="left">多选题</Divider>
           </div>
           {this.showaddobj2(showDataList2)}
           <div style={{padding:18}}>
             <Button onClick={() => this.addQuestion('00002')} type="primary" style={{width: '100%', background: '#A3C2FE', border: '1px #6600FF dashed'}}>
               <Icon type="plus" />
             </Button>
           </div>

           <div style={{fontSize:16,fontWeight:'bold'}}>
             <Divider orientation="left">简答题</Divider>
           </div>
           {this.showaddobj3(showDataList3)}
           <div style={{padding:18}}>
             <Button onClick={() => this.addQuestion('00003')} type="primary" style={{width: '100%', background: '#A3C2FE', border: '1px #6600FF dashed'}}>
               <Icon type="plus" />
             </Button>
           </div>

        </Form>
       </Modal>

        {
          messageSuccess?
            <Modal
              title=""
              visible={messageSuccess}
              className={this.props.global && this.props.global.dark ? styles.success : styles.successLight}
              width={350}
              style={{top: '250px'}}
              maskClosable={false}
              cancelText={null}
              footer={<button onClick={this.closeTipsCancel} className={styles.successBtn}>确定</button>}
            >
              模板添加成功！
            </Modal>
            :
            ''
        }

        {
          QuestionListVisible?
            <QuestionListmodal
              visible={QuestionListVisible}
              closeAddCancel={this.closeAddCancel} // 关闭题目列表模态框
              questionTypeLabel={questionTypeLabel} // 添加的题型
              chooseSelect={this.chooseSelect}
              showDataList1={showDataList1} // 当前添加的模板所选择过的单选题目
              showDataList2={showDataList2} // 当前添加的模板所选择过的多选题目
              showDataList3={showDataList3} // 当前添加的模板所选择过的简答题目
            />
            :
            ''
        }
      </div>
    )
  }
}
