/*
 * QuestionBankConfig/LTemplateDetailVisibleModal.tsx 模板详情
 * author：jhm
 * 20200305
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal,Button,Form,Input } from 'antd';
import styles from './TemplateDetailVisibleModal.less';
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
export default class TemplateDetailVisibleModal extends PureComponent {
  state = {

  };

  componentDidMount() {

  }

  // 关闭详情模态框
  handleCancel = () => {
    this.props.closeListDetailModal();
  }

  // 展示单选题详情
  showaddobj1(showDataList1){
    let obj=[];
    showDataList1.map((item)=>{
      return(
        obj.push(<Card className={styles.Card}>
          <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}</Row>
          <Row>选项：&nbsp;&nbsp;&nbsp;&nbsp;选项1：{item.tmxx_1} 选项2：{item.tmxx_2} 选项3：{item.tmxx_3} 选项4：{item.tmxx_4}</Row>
          <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.xztda}</Row>
          <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
        </Card>)
      )
    })
    return <div>{obj}</div>;
  }

  // 展示多选题详情
  showaddobj2(showDataList2){
    let obj=[];
    showDataList2.map((item)=>{
      return(
        obj.push(<Card className={styles.Card}>
          <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}</Row>
          <Row>选项：&nbsp;&nbsp;&nbsp;&nbsp;选项1：{item.tmxx_1} 选项2：{item.tmxx_2} 选项3：{item.tmxx_3} 选项4：{item.tmxx_4}</Row>
          <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.xztda}</Row>
          <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
        </Card>)
      )
    })
    return <div>{obj}</div>;
  }

  // 展示简答题详情
  showaddobj3(showDataList3){
    let obj=[];
    showDataList3.map((item)=>{
      return(
        obj.push(<Card className={styles.Card}>
          <Row>题目：&nbsp;&nbsp;&nbsp;&nbsp;{item.tm}</Row>
          <Row>答案：&nbsp;&nbsp;&nbsp;&nbsp;{item.jdtdagjz}</Row>
          <Row>答案解析：&nbsp;&nbsp;&nbsp;&nbsp;{item.dajx}</Row>
        </Card>)
      )
    })
    return <div>{obj}</div>;
  }
  render() {
    const { TemplateDetail } = this.props;
    let dxt = [],mdxt = [], jdt = [];
    TemplateDetail?(TemplateDetail.list.map((item)=>{
        if(item.tmlx==='00001'){
          dxt.push(item)
        }
        else if(item.tmlx==='00002'){
          mdxt.push(item)
        }
        else if(item.tmlx==='00003'){
          jdt.push(item)
        }
      })
    ):'';
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          className={styles.shareHeader}
          width={800}
          // style={{top: '250px'}}
          maskClosable={false}
          cancelText={null}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Row>
            <Col {...colLayout} className={styles.Col}>
              测评模板名称：{TemplateDetail?TemplateDetail.cpmbzw:''}
            </Col>
            <Col {...colLayout} className={styles.Col}>
              测评时间：{TemplateDetail?TemplateDetail.cpsj+'分钟':''}
            </Col>
          </Row>
          <Row>
            <Col {...colLayout} className={styles.Col}>
              单选题：{TemplateDetail?TemplateDetail.dxtsl:''}个，每个{TemplateDetail?TemplateDetail.dxtfz:""}分
            </Col>
            <Col {...colLayout} className={styles.Col}>
              多选题：{TemplateDetail?TemplateDetail.duoxtsl:''}个，每个{TemplateDetail?TemplateDetail.duoxtfz:""}分
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12} xl={12} className={styles.Col}>
              简答题：{TemplateDetail?TemplateDetail.jdtsl:''}个，每个{TemplateDetail?TemplateDetail.jdtfz:""}分
            </Col>
          </Row>
          <div style={{fontSize:16,fontWeight:'bold'}}>
            <Divider orientation="left">单选题</Divider>
          </div>
          {this.showaddobj1(dxt)}
          <div style={{fontSize:16,fontWeight:'bold'}}>
            <Divider orientation="left">多选题</Divider>
          </div>
          {this.showaddobj2(mdxt)}

          <div style={{fontSize:16,fontWeight:'bold'}}>
            <Divider orientation="left">简答题</Divider>
          </div>
          {this.showaddobj3(jdt)}
        </Modal>

      </div>
    )
  }
}
