/*
 * QuestionBankConfig/ListDetailVisibleModal.tsx 题目详情
 * author：jhm
 * 20200305
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal,Button,Form,Input } from 'antd';
import styles from './ListDetailVisibleModal.less';
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
export default class ListDetailVisibleModal extends PureComponent {
  state = {

  };

  componentDidMount() {

  }

  // 关闭详情模态框
  handleCancel = () => {
    this.props.closeListDetailModal();
  }

  render() {
    const { listDetail } = this.props;
    console.log('listDetail',listDetail);
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          className={styles.shareHeader}
          width={800}
          style={{top: '250px'}}
          maskClosable={false}
          cancelText={null}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Row gutter={rowLayout} style={{padding:'12px 0 0 0'}}>
            <Col {...colLayout}>
              题目：&nbsp;&nbsp;{listDetail.tm}
            </Col>
            <Col {...colLayout}>
              添加日期：&nbsp;&nbsp;{listDetail.tbsj}
            </Col>
          </Row>
          <Row gutter={rowLayout}>
            {
              listDetail.tmlx!=='00003'?
                <div style={{padding:'12px 12px 0 12px'}}>选项：&nbsp;&nbsp;选项1-{listDetail.tmxx_1} 选项2-{listDetail.tmxx_2} 选项3-{listDetail.tmxx_3} 选项4-{listDetail.tmxx_4}</div>
                :
               ''
            }
          </Row>
          <Row gutter={rowLayout} style={{padding:'12px 12px 0 12px'}}>
            答案：&nbsp;&nbsp;{listDetail&&listDetail.xztda?listDetail.xztda:listDetail.jdtdagjz}
          </Row>
          <Row gutter={rowLayout} style={{padding:'12px 12px 0 12px'}}>
            答案解析：&nbsp;&nbsp;{listDetail.dajx}
          </Row>
          <Row gutter={rowLayout} style={{padding:'12px'}}>
            统计：&nbsp;&nbsp;{listDetail.tj}
          </Row>
        </Modal>

      </div>
    )
  }
}
