import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, Button, Timeline, Row, Col, Tooltip, Tag } from 'antd';
import styles from './DispatchModal.less';

const { TextArea } = Input;
const Option = Select.Option;
import { connect } from 'dva';
import { getUserInfos } from '../../utils/utils';
import Ellipsis from '../../../src/components/Ellipsis';
import SuperviseModal from '../../components/UnCaseRealData/SuperviseModal';

const FormItem = Form.Item;

@connect(({ share }) => ({
    share,
}))
class DispatchingRecordModal extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            shareSuccess: false,
            superviseVisibleModal:false, // 督办模态框
            caseDetails:null, // 督办的警情详情
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.shareVisible !== nextProps.shareVisible) {
            this.props.form.resetFields();
        }
    }
    journal = (NowRecord) => {
      if(NowRecord&&NowRecord.qtpdlx==='第二次调度未处理'){
        return(
          <div>
            <Button onClick={this.props.DispatchinghandleCancel}>关闭</Button>
            <Button type='primary' onClick={()=>this.props.saveDispatch(NowRecord)}>督办</Button>
          </div>
        )
      }
      else if(NowRecord&&(NowRecord.qtpdlx==='已处理'||NowRecord.qtpdlx==='已督办未处理')){
        return(
          <div>
            <Button onClick={this.props.DispatchinghandleCancel}>关闭</Button>
          </div>
        )
      }
      else{
        return(
          <div>
            <Button onClick={this.props.DispatchinghandleCancel}>关闭</Button>
            <Button type='primary' onClick={()=>this.props.saveDispatch(this.props.NowRecord)}>调度</Button>
          </div>
        )
      }
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        const children = [];
        if (this.props.personList && this.props.personList.length > 0) {
            this.props.personList.map((event, idx) => {
                if (event.idcard !== getUserInfos().idCard) {
                    children.push(<Option key={event.idcard}>{event.name}</Option>);
                }
            });
        }
        const { getFieldDecorator } = this.props.form;
        const { ResOpin,NowRecord } = this.props;
        const {superviseVisibleModal} = this.state;
        let list = [];
        if (this.props.RzList) {
            this.props.RzList.map((item, idx) => {
                list.push(
                    <Timeline.Item
                        dot={
                            <div>
                                <div style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 30,
                                    backgroundColor: '#5858DF',
                                    textAlign: 'center',
                                    marginBottom: 7,
                                }}>
                                    <p style={{ paddingTop: 7, color: '#fff' }}>{this.props.RzList.length - idx}</p>
                                </div>
                            </div>
                        }
                        color='#00CC33'
                    >
                        <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                            <Col md={8} span={24}>
                              {this.props.RzList.length === 3&&idx === 0?
                                '督办人：':'调度人：'
                              }
                              {item.ddr_name ? item.ddr_name : ''}
                            </Col>
                            <Col md={8} span={24}>
                              {this.props.RzList.length === 3&&idx === 0?
                                '督办人单位名称：':'调度人单位名称：'
                              }
                              {item.ddr_dwmc ? item.ddr_dwmc : ''}
                            </Col>
                        </Row>
                        <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                            <Col md={16} span={24}>
                              {this.props.RzList.length === 3&&idx === 0?
                                '督办时间：':'调度时间：'
                              }
                              {item.ddsj ? item.ddsj : ''}
                              </Col>
                        </Row>
                        <Row style={{ paddingLeft: 30, paddingBottom: 8 }}>
                            <Col md={22} span={24}>
                              {this.props.RzList.length === 3&&idx === 0?
                                '督办意见：':'调度意见：'
                              }
                              {item.ddyj ? item.ddyj : ''}
                              </Col>
                        </Row>
                    </Timeline.Item>,
                );
            });
        }
        return (
            <div className={styles.standardTable}>
                <Modal
                    title="调度日志"
                    visible={this.props.visible}
                    onCancel={this.props.DispatchinghandleCancel}
                    className={styles.shareHeader}
                    footer={this.props.from==='三清刑事案件告警'||this.props.from==='三清行政案件告警'?null:this.journal(NowRecord)}
                    width={900}
                    maskClosable={false}
                    style={{ top: '200px' }}
                >
                    <Timeline style={{ marginTop: 20, marginLeft: 20 }}>
                        {list}
                    </Timeline>
                  {
                    ResOpin?
                      <div>
                        <p>反馈结果：{ResOpin.fkjg}</p>
                        <p>反馈意见：{ResOpin.fkyj}</p>
                      </div>
                      :
                      null
                  }
                </Modal>
            </div>


        );
    }
}

export default Form.create()(DispatchingRecordModal);
