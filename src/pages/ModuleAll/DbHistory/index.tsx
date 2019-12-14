/*
 * DbHistory/index.tsx 督办历史记录
 * author：jhm
 * 20191213
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Table,
  Divider,
  Button,
  Popconfirm,
  message,
  Icon,
  Tag,
  Tooltip,
  Row,
  Col,
  Form,
  Select,
  Upload,
  Steps,Card
} from 'antd';
import { routerRedux } from 'dva/router';
import { getSysAuthority } from '../../../utils/authority';
import styles from './index.less';

const { Option } = Select;
const { Step } = Steps;

@connect(({ common }) => ({
  common,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class DbHistory extends PureComponent {
  state = {};

  componentDidMount() {

  }

  onCancel1 = () => {
    this.props.closeHistoryModal(false);
  };

  stepname(pane) {
    if (pane.dbztMc === '整改中') {
      // return(
      //
      // )
    } else if (pane.dbztMc === '发起督办') {
      return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <div className={styles.dbrz}>
              <span className={styles.dbrzName1}>整改意见：{pane.zgyj}</span>
            </div>
          </Col>
        </Row>
      );
    } else if (pane.dbztMc === '处理反馈') {
      return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <div className={styles.dbrz}>
              <span className={styles.dbrzName1}>{pane.fkyj}</span>
            </div>
          </Col>
        </Row>
      );
    }
  }

  extraDescription = (pane) => {
    return (
      <div style={{ position: 'relative', top: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <p className={styles.clsj_time}>
              <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={pane.zrrMc}>
                {pane.zrrMc}
              </Tooltip>
            </p>
          </Col>
          <Col md={8} sm={24}>
            <p className={styles.clsj_time}>
              <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={pane.zrdwMc}>
                {pane.zrdwMc}
              </Tooltip>
            </p>
          </Col>
          <Col md={8} sm={24}>
            <p className={styles.clsj_time}>
              <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={pane.clsj}>
                {pane.clsj}
              </Tooltip>
            </p>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <div className={styles.historydbrz}>问题类型：<span className={styles.dbrzName}>{pane.wtlxMc}</span>
            </div>
          </Col>
        </Row>
        {this.stepname(pane)}
        {pane.dbztMc === '发起督办' ?
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <div className={styles.dbrzfj}>
                <span className={styles.dbrzName1}>附件信息： </span>
                <span className={styles.dbrzName2}>
                  <Upload fileList={pane.fileList}/>
                </span>
              </div>
            </Col>
          </Row>
          :
          ''
        }
      </div>
    );
  };

  title() {
    return (
      <div style={{ color: '#fff' }}>历史督办日志</div>
    );
  }

  onEdit = (isReset) => {
    const {query:{record,detail,tab}} = this.props.location;
    let key = '/ModuleAll/DbHistory'+this.props.location.query.id;
    // 鍒犻櫎褰撳墠tab骞朵笖灏嗚矾鐢辫烦杞嚦鍓嶄竴涓猼ab鐨刾ath
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch( routerRedux.push({pathname: this.props.location.query.fromPath,query: isReset ? {isReset,id:tab==='表格'?'':this.props.location.query.id,record:tab==='表格'?'':this.props.location.query.record} : {id:tab==='表格'?'':this.props.location.query.id,record:tab==='表格'?'':this.props.location.query.record}}));
      dispatch({
        type: 'global/changeSessonNavigation',
        payload: {
          key,
          isShow: false,
        },
      });
      dispatch({
        type: 'global/changeNavigation',
        payload: {
          key,
          isShow: false,
        },
      });
    }
  };
  render() {
    // const { dblist, DetailData } = this.props;
    const { query:{record,detail} } = this.props.location;
    const newDblist = [];
    for (let a = 0; a < record.length; a++) {
      for (let b = 0; b < record[a].dbgj.length; b++) {
        newDblist.push(record[a].dbgj[b]);
      }
    }
    return (
      <div className={styles.ModalTitle}>
        <Card className={styles.standardTable}  id='DbhistoryModule'>
          <div style={{ borderBottom: '1px solid #ccc' }}>
            <div className={styles.title}>
              <Steps direction="vertical" current={newDblist.length > 0 ? (newDblist.length - 1) : ''}>
                {newDblist ?
                  newDblist.map(pane =>
                    <Step title={<span style={{ fontSize: 14 }}>{pane.dbztMc}</span>}
                          description={this.extraDescription(pane)}/>,
                  )
                  :
                  ''
                }
              </Steps>
            </div>
          </div>
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





