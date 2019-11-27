/*
 * SeniorSearchModal.js 刑事案件高级查询
 * author：lyp
 * 20181108
 * */
import React, { PureComponent } from 'react';
import { Row, Col, Radio, Modal, Form, DatePicker, TreeSelect, Select, Button } from 'antd';
import styles from './SeniorSearchModal.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
const { Option } = Select;

@Form.create()
export default class SeniorSearchModal extends PureComponent {
  state = {};

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}
  // 无法选择的日期
  disabledDate = current => {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  };
  handleSearch = e => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.SearchSuccess(values);
      }
    });
  };
  // 渲染机构树
  renderloop = data =>
    data.map(item => {
      if (item.childrenList && item.childrenList.length) {
        return (
          <TreeNode value={item.code} key={item.code} title={item.name}>
            {this.renderloop(item.childrenList)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.code} value={item.code} title={item.name} />;
    });
  resetSearch = () => {
    this.props.form.resetFields();
  };
  foot = () => {
    return (
      <div>
        <Button style={{ color: '#2095FF', borderColor: '#2095FF' }} onClick={this.resetSearch}>
          重置
        </Button>
        <Button type="primary" onClick={this.handleSearch}>
          查询
        </Button>
        <Button onClick={this.props.SeniorSearchCancel}>取消</Button>
      </div>
    );
  };
  render() {
    const {
      form: { getFieldDecorator },
      treeDefaultExpandedKeys,
      depTree,
      CaseStatusType,
    } = this.props;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 } },
    };
    let CaseStatusOption = [];
    if (CaseStatusType.length > 0) {
      for (let i = 0; i < CaseStatusType.length; i++) {
        const item = CaseStatusType[i];
        CaseStatusOption.push(
          <Option key={item.id} value={item.code}>
            {item.name}
          </Option>,
        );
      }
    }
    return (
      <Modal
        visible={this.props.visible}
        className={styles.shareHeader}
        title="高级查询"
        centered
        width={1200}
        maskClosable={false}
        onCancel={this.props.SeniorSearchCancel}
        onOk={this.handleSearch}
        okText={'查询'}
        footer={this.foot()}
      >
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '16px' }}>
            <Col md={8} sm={24}>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="案件状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('ajzt', {
                      rules: [{ required: true, message: '请选择案件状态' }],
                    })(
                      <Select
                        placeholder="请选择案件状态"
                        style={{ width: '100%' }}
                        mode={'multiple'}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {CaseStatusOption}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col md={8} sm={24}>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="受案日期" {...formItemLayout}>
                    {getFieldDecorator(
                      'slrq',
                      {},
                    )(<RangePicker disabledDate={this.disabledDate} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="立案日期" {...formItemLayout}>
                    {getFieldDecorator(
                      'larq',
                      {},
                    )(<RangePicker disabledDate={this.disabledDate} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="破案日期" {...formItemLayout}>
                    {getFieldDecorator(
                      'parq',
                      {},
                    )(<RangePicker disabledDate={this.disabledDate} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="撤案日期" {...formItemLayout}>
                    {getFieldDecorator(
                      'xarq',
                      {},
                    )(<RangePicker disabledDate={this.disabledDate} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="结案日期" {...formItemLayout}>
                    {getFieldDecorator(
                      'jarq',
                      {},
                    )(<RangePicker disabledDate={this.disabledDate} style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col md={8} sm={24}>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="受案单位" {...formItemLayout}>
                    {getFieldDecorator(
                      'sadw',
                      {},
                    )(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请输入受案单位"
                        allowClear
                        key="sadwSelect"
                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                        treeNodeFilterProp="title"
                      >
                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                      </TreeSelect>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="立案单位" {...formItemLayout}>
                    {getFieldDecorator(
                      'ladw',
                      {},
                    )(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请输入立案单位"
                        allowClear
                        key="ladwSelect"
                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                        treeNodeFilterProp="title"
                      >
                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                      </TreeSelect>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="破案单位" {...formItemLayout}>
                    {getFieldDecorator(
                      'padw',
                      {},
                    )(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请输入破案单位"
                        allowClear
                        key="padwSelect"
                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                        treeNodeFilterProp="title"
                      >
                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                      </TreeSelect>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="撤案单位" {...formItemLayout}>
                    {getFieldDecorator(
                      'xadw',
                      {},
                    )(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请输入撤案单位"
                        allowClear
                        key="cadwSelect"
                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                        treeNodeFilterProp="title"
                      >
                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                      </TreeSelect>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem label="结案单位" {...formItemLayout}>
                    {getFieldDecorator(
                      'jadw',
                      {},
                    )(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请输入结案单位"
                        allowClear
                        key="jadwSelect"
                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                        treeNodeFilterProp="title"
                      >
                        {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                      </TreeSelect>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
