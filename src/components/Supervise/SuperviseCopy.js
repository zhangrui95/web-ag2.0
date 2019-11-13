/*
 * 监管点复用弹框
 * author：zr
 * 20190314
 * */
import React, { PureComponent } from 'react';
import {
  Card,
  Col,
  Table,
  Radio,
  Tooltip,
  Icon,
  message,
  Modal,
  Form,
  Row,
  Select,
  Transfer,
} from 'antd';
import { connect } from 'dva';
import styles from '../../pages/systemSetup/SuperviseSetup/index.less';
import { getUserInfos } from '../../utils/utils';

const FormItem = Form.Item;
@Form.create()
@connect(({ SuperviseSetup, common, share }) => ({
  SuperviseSetup,
  common,
  share,
}))
export default class SuperviseCopy extends PureComponent {
  state = {
    fyjgList: [],
    fyjgsxList: [],
    ssjg_dm: '',
    fyjgdList: [],
    yyjgdList: [],
    list: [],
    listKey: [],
    selectedKeys: [],
  };

  componentDidMount() {
    this.getfyJg();
  }

  componentWillReceiveProps(next) {
    if (this.props.yyjgdList !== next.yyjgdList) {
      this.setState({
        fyjgsxList: [],
        selectedKeys: [],
        list: [],
        listKey: [],
      });
      this.props.form.resetFields();
      this.getJgd(next);
      this.getfyJg();
    }
  }

  getfyJg = () => {
    this.props.dispatch({
      type: 'SuperviseSetup/getfyJg',
      payload: {
        ssjg_dm: this.props.fyxzjg.id,
      },
      callback: res => {
        this.setState({
          fyjgList: res.data,
        });
      },
    });
  };
  getJgd = next => {
    let list = [];
    next.yyjgdList &&
      next.yyjgdList.map(event => {
        list.push({
          key: event.id,
          title: `${event.jgd_mc}(${
            event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
          })`,
          description: '',
          disabled: true,
        });
      });
    this.setState({
      list: list,
      listKey: [],
    });
  };
  choiceJg = e => {
    this.getJgd(this.props);
    this.props.form.resetFields(['fyjgsx']);
    this.setState({
      ssjg_dm: e.key,
      listKey: [],
    });
    this.props.dispatch({
      type: 'SuperviseSetup/getfyJgsx',
      payload: {
        ssjg_dm: e.key,
      },
      callback: res => {
        this.setState({
          fyjgsxList: res.data,
        });
      },
    });
  };
  choiceJgsx = e => {
    let yyjgd = [];
    let list1 = [];
    this.props.yyjgdList &&
      this.props.yyjgdList.map(event => {
        yyjgd.push({
          key: event.id,
          title: `${event.jgd_mc}(${
            event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
          })`,
          description: '',
          disabled: true,
        });
      });
    this.setState({
      list: yyjgd,
      listKey: [],
      selectedKeys: [],
    });
    this.props.dispatch({
      type: 'SuperviseSetup/getfyJgd',
      payload: {
        jgsx_dm: e,
        ssjg_dm: this.state.ssjg_dm,
      },
      callback: res => {
        let torf = true;
        res.data.map(event => {
          if (this.props.yyjgdList.length > 0) {
            this.props.yyjgdList.map(e => {
              if (e.id === event.id || e.jgd_mc === event.jgd_mc) {
                torf = false;
              }
            });
            if (torf) {
              yyjgd.push({
                key: event.id,
                title: `${event.jgd_mc}(${
                  event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
                })`,
                description: '',
                disabled: false,
              });
              list1.push(event.id);
            }
          } else {
            yyjgd.push({
              key: event.id,
              title: `${event.jgd_mc}(${
                event.jglx === '0' ? '告警' : event.jglx === '1' ? '预警' : event.jglx
              })`,
              description: '',
              disabled: false,
            });
            list1.push(event.id);
          }
        });
        this.setState({
          fyjgdList: res.data,
          list: yyjgd,
          listKey: list1,
        });
      },
    });
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ listKey: nextTargetKeys });
  };
  handleOks = () => {
    let ids = [];
    this.state.list.map(res => {
      let torf = false;
      if (this.state.listKey.length > 0) {
        this.state.listKey.map(event => {
          if (res.key === event || res.disabled) {
            torf = true;
          }
        });
        if (!torf) {
          ids.push(res.key);
        }
      } else {
        if (!res.disabled) {
          ids.push(res.key);
        }
      }
    });
    if (ids.length > 0) {
      this.props.dispatch({
        type: 'SuperviseSetup/getSaveFy',
        payload: {
          id: ids.toString(),
          ssjg_dm: this.props.fyxzjg.id,
          ssjg_mc: this.props.fyxzjg.label,
          sf_qjjg: this.props.qjjg ? '1' : '0',
        },
        callback: res => {
          if (!res.error) {
            message.success('添加成功');
            this.props.handleSuccess();
          } else {
            message.warn('操作失败，请重试');
          }
        },
      });
    } else {
      message.warn('请选择复用监管点');
    }
  };
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  render() {
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const {
      form: { getFieldDecorator },
    } = this.props;
    const modleLayouts = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        title={'复用监管点添加'}
        width={800}
        visible={this.props.Fyvisible}
        onOk={this.handleOks}
        okText={'完成'}
        onCancel={this.props.handleCancels}
        className={styles.modalStyle}
        maskClosable={false}
        style={{ top: '150px' }}
      >
        <Form>
          <Row gutter={rowLayout}>
            <Col span={12}>
              <div style={{ paddingLeft: '32px' }}>机构：{this.props.fyxzjg.label}</div>
            </Col>
            <Col span={12}>
              <FormItem label="复用机构" {...modleLayouts}>
                {getFieldDecorator('fyjg', {})(
                  <Select
                    labelInValue
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    onChange={e => this.choiceJg(e)}
                  >
                    {this.state.fyjgList &&
                      this.state.fyjgList.map(event => {
                        return <Option value={event.ssjg_dm}>{event.ssjg_mc}</Option>;
                      })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <FormItem label="监管事项" {...modleLayouts}>
                {getFieldDecorator('fyjgsx', {})(
                  <Select
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    onChange={e => this.choiceJgsx(e)}
                  >
                    {this.state.fyjgsxList &&
                      this.state.fyjgsxList.map(event => {
                        return (
                          <Option
                            value={event.jgsx_dm}
                          >{`${event.jgsx_mc}(${event.jglx_mc})`}</Option>
                        );
                      })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24} className={styles.transfer}>
              <Transfer
                titles={['已有监管点', '待选监管点']}
                operations={['移除', '添加']}
                dataSource={this.state.list}
                targetKeys={this.state.listKey}
                onChange={this.handleChange}
                selectedKeys={this.state.selectedKeys}
                onSelectChange={this.handleSelectChange}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
