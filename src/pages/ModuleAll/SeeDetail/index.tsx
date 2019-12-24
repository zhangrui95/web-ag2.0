/*
 * SeeDetail/index.tsx 查看督办详情
 * author：jhm
 * 20191214
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
  Steps,
  Card,
} from 'antd';
import { routerRedux } from 'dva/router';
import { getSysAuthority } from '../../utils/authority';
import styles from './index.less';

const { Option } = Select;
const { Step } = Steps;

@connect(({ common, global }) => ({
  common,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class DbHistory extends PureComponent {
  state = {};

  componentDidMount() {}

  onCancel1 = () => {
    this.props.closeSeeDetailModal(false);
  };
  extraDescription = (zrrMc, zrdwMc, clsj) => {
    return (
      <div style={{ position: 'relative', left: '-30px', top: '10px' }}>
        <p className={styles.clsj_time}>
          <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={zrrMc}>
            {zrrMc}
          </Tooltip>
        </p>
        <p className={styles.clsj_time}>
          <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={zrdwMc}>
            {zrdwMc}
          </Tooltip>
        </p>
        <p className={styles.clsj_time}>
          <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={clsj}>
            {clsj}
          </Tooltip>
        </p>
      </div>
    );
  };

  title(Isdetail) {
    if (Isdetail === '发起督办') {
      return <div style={{ color: '#fff' }}>督办详情</div>;
    } else {
      return <div style={{ color: '#fff' }}>反馈详情</div>;
    }
  }

  onEdit = isReset => {
    const {
      query: { record, detail, tab },
    } = this.props.location;
    let key = '/ModuleAll/SeeDetail' + this.props.location.query.id;
    // 鍒犻櫎褰撳墠tab骞朵笖灏嗚矾鐢辫烦杞嚦鍓嶄竴涓猼ab鐨刾ath
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch(
        routerRedux.push({
          pathname: this.props.location.query.fromPath,
          query: isReset
            ? {
                isReset,
                id: tab === '表格' ? '' : this.props.location.query.id,
                record: tab === '表格' ? '' : this.props.location.query.record,
              }
            : {
                id: tab === '表格' ? '' : this.props.location.query.id,
                record: tab === '表格' ? '' : this.props.location.query.record,
              },
        }),
      );
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
    // const { Isdetail, NowDbrz } = this.props;
    const {
      query: { record, detail, Isdetail },
    } = this.props.location;
    return (
      <div
        className={
          this.props.global && this.props.global.dark
            ? styles.ModalTitle
            : styles.ModalTitle + ' ' + styles.lightBox
        }
      >
        {/*<Modal*/}
        {/*maskClosable={false}*/}
        {/*visible={this.props.visible}*/}
        {/*title={this.title(Isdetail)}*/}
        {/*onCancel={() => this.onCancel1()}*/}
        {/*width={800}*/}
        {/*footer={null}*/}
        {/*centered={true}*/}
        {/*className={styles.indexSeeDetailmodal}*/}
        {/*>*/}
        <Card className={styles.standardTable} id="SeeDetailModule">
          <div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              {Isdetail === '发起督办' ? (
                ''
              ) : (
                <Col md={8} sm={24}>
                  <div className={styles.dbrz}>{record.zrrMcOfXq ? record.zrrMcOfXq : ''}</div>
                </Col>
              )}
              {Isdetail === '发起督办' ? (
                ''
              ) : (
                <Col md={16} sm={24}>
                  <div className={styles.dbrz}>{record.zrdwMcOfXq ? record.zrdwMcOfXq : ''}</div>
                </Col>
              )}
              <Col md={8} sm={24}>
                <div className={styles.dbrz}>
                  {Isdetail === '发起督办'
                    ? record.zrrMc
                    : record.fkrXmOfXq
                    ? record.fkrXmOfXq
                    : ''}
                </div>
              </Col>
              <Col md={Isdetail === '发起督办' ? 8 : 16} sm={24}>
                <div className={styles.dbrz}>
                  {Isdetail === '发起督办'
                    ? record.zrdwMc
                    : record.fkrdwOfXq
                    ? record.fkrdwOfXq
                    : ''}
                </div>
              </Col>
              <Col md={8} sm={24}>
                <div className={styles.dbrz}>
                  {Isdetail === '发起督办'
                    ? record.clsj
                      ? record.clsj
                      : ''
                    : record.fksj
                    ? record.fksj
                    : ''}
                </div>
              </Col>
              <Col md={8} sm={24}>
                <div className={styles.historydbrz}>
                  问题类型：<span className={styles.dbrzName}>{record.wtlxMc}</span>
                </div>
              </Col>
              {Isdetail === '发起督办' ? (
                ''
              ) : (
                <Col md={8} sm={24}>
                  <div className={styles.historydbrz}>
                    <span className={styles.dbrzName}>{record.cljg ? record.cljg : ''}</span>
                  </div>
                </Col>
              )}
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <div className={styles.historydbrz}>
                  <span className={styles.dbrzName1}>{record.fkyj ? record.fkyj : ''}</span>
                </div>
              </Col>
              <Col md={24} sm={24}>
                <div className={styles.historydbrz}>
                  <span className={styles.dbrzName1}>
                    {Isdetail === '发起督办' ? '整改意见：' : ''}
                    {record.zgyj}
                  </span>
                </div>
              </Col>
            </Row>
            {Isdetail === '发起督办' ? (
              record && record.fileList && record.fileList.length > 0 ? (
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={24} sm={24}>
                    <div className={styles.dbrzfj}>
                      <span className={styles.dbrzName1}>附件信息： </span>
                      <span className={styles.dbrzName2}>
                        <Upload fileList={record.fileList} />
                      </span>
                    </div>
                  </Col>
                </Row>
              ) : (
                ''
              )
            ) : record && record.fileListOfFk && record.fileListOfFk.length > 0 ? (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <div className={styles.dbrzfj}>
                    <span className={styles.dbrzName1}>附件信息： </span>
                    <span className={styles.dbrzName2}>
                      <Upload fileList={record.fileListOfFk} />
                    </span>
                  </div>
                </Col>
              </Row>
            ) : (
              ''
            )}
          </div>
        </Card>
        {/*<Card>*/}
        {/*  <div className={styles.btns}>*/}
        {/*    <Button*/}
        {/*      type="primary"*/}
        {/*      style={{ marginLeft: 8 }}*/}
        {/*      className={styles.qxBtn}*/}
        {/*      onClick={() => this.onEdit(false)}*/}
        {/*    >*/}
        {/*      取消*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</Card>*/}
        {/*</Modal>*/}
      </div>
    );
  }
}
