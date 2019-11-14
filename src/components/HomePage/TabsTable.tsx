/*
* 首页我的分享列表切换
* author：zr
* 20190424
* */
import React, { PureComponent } from 'react';
import { Col, Row, Card, Form, TreeSelect, Select, Spin, Button, Table, Tabs, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from '../../pages/ShowData/Show.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

@connect(({ home }) => ({
    home,
}))
@Form.create()
export default class TabsTable extends PureComponent {
    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, md: { span: 10 }, xl: { span: 8 }, xxl: { span: 6 } },
            wrapperCol: { xs: { span: 24 }, md: { span: 14 }, xl: { span: 16 }, xxl: { span: 18 } },
        };
        const { form: { getFieldDecorator }, treeDefaultExpandedKeys } = this.props;
        const rowLayout = { md: 8, xl: 16, xxl: 24 };
        const colLayout = { sm: 24, md: 12, xl: 8 };
        const colLayouts = { sm: 24, md: 12, xl: 16 };
        const { common: { depTree } } = this.props;
        let lx = (
            <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">全部</Option>
                <Option value="案件信息">案件信息</Option>
                <Option value="人员信息">人员信息</Option>
                <Option value="物品信息">物品信息</Option>
                <Option value="卷宗信息">卷宗信息</Option>
                <Option value="警情信息">警情信息</Option>
            </Select>
        );
        return (
            <Tabs defaultActiveKey="s1" onChange={this.props.callBackTabs} type="card">
                <TabPane
                    tab={
                        <div className={styles.iconPerson}>
                            <img src="images/iconpreson.png"/>
                            <span>我的分享({this.props.wdfx ? this.props.wdfx : 0})</span>
                        </div>
                    }
                    key="s1"
                >
                    <Card title={null}>
                        <Form style={{ padding: '20px 30px 0 10px' }}>
                            <Row gutter={rowLayout}>
                                <Col {...colLayout}>
                                    <FormItem label="分享时间" {...formItemLayout}>
                                        {getFieldDecorator('fxsj')(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                style={{ width: '100%' }}
                                            />,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...colLayout}>
                                    <FormItem label="分享单位" {...formItemLayout}>
                                        {getFieldDecorator('fxdw', {})(
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="请选择"
                                                allowClear
                                                key='badwSelect'
                                                treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                                                treeNodeFilterProp="title"
                                            >
                                                {depTree && depTree.length > 0 ? this.props.renderloop(depTree) : null}
                                            </TreeSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...colLayout}>
                                    <FormItem label="分享类型" {...formItemLayout}>
                                        {getFieldDecorator('fxlx', {
                                            initialValue: this.props.yjjb,
                                        })(
                                            lx,
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={rowLayout}>
                                <Col {...colLayout}>
                                    <FormItem label="被分享人" {...formItemLayout}>
                                        {getFieldDecorator('fxr', {})(
                                            <Select
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="请选择被分享人"
                                                onSearch={this.props.handleSearchPerson}
                                                onFocus={this.props.handleSearchPerson}
                                                notFoundContent={this.props.loadings ? <Spin size="small"/> : null}
                                                onBlur={this.props.getBlur}
                                            >
                                                {this.props.children}
                                            </Select>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...colLayouts}>
                                    <span style={{ float: 'right', marginBottom: 24 }}>
                                        <Button style={{ marginLeft: 8 }} type="primary"
                                                onClick={() => this.props.handleSearch(0)}>查询</Button>
                                        <Button style={{ marginLeft: 8 }}
                                                onClick={this.props.handleFormReset}>重置</Button>
                                    </span>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            size="middle"
                            loading={this.props.loading}
                            pagination={this.props.paginationPage}
                            columns={this.props.columns}
                            dataSource={this.props.data}
                            className={styles.homeTable}
                        />
                    </Card>
                </TabPane>
                <TabPane
                    tab={
                        <div className={styles.iconPerson}>
                            <img src="images/iconpreson.png"/>
                            <span>分享给我({this.props.fxgw ? this.props.fxgw : 0})</span>
                        </div>
                    }
                    key="s2"
                >
                    <Card title={null}>
                        <Form style={{ padding: '20px 30px 0 10px' }}>
                            <Row gutter={rowLayout}>
                                <Col {...colLayout}>
                                    <FormItem label="分享时间" {...formItemLayout}>
                                        {getFieldDecorator('fxsj')(
                                            <RangePicker
                                                disabledDate={this.disabledDate}
                                                style={{ width: '100%' }}
                                            />,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...colLayout}>
                                    <FormItem label="分享单位" {...formItemLayout}>
                                        {getFieldDecorator('fxdw', {})(
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="请选择"
                                                allowClear
                                                key='badwSelect'
                                                treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                                                treeNodeFilterProp="title"
                                            >
                                                {depTree && depTree.length > 0 ? this.props.renderloop(depTree) : null}
                                            </TreeSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...colLayout}>
                                    <FormItem label="分享类型" {...formItemLayout}>
                                        {getFieldDecorator('fxlx', {
                                            initialValue: this.props.yjjb,
                                        })(
                                            lx,
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={rowLayout}>
                                <Col {...colLayout}>
                                    <FormItem label="分享人" {...formItemLayout}>
                                        {getFieldDecorator('fxr', {})(
                                            <Select
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="请选择分享人"
                                                onSearch={this.props.handleSearchPerson}
                                                onFocus={this.props.handleSearchPerson}
                                                notFoundContent={this.props.loadings ? <Spin size="small"/> : null}
                                                onBlur={this.props.getBlur}
                                            >
                                                {this.props.children}
                                            </Select>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...colLayouts}>
                                    <span style={{ float: 'right', marginBottom: 24 }}>
                                        <Button style={{ marginLeft: 8 }} type="primary"
                                                onClick={() => this.props.handleSearch(0)}>查询</Button>
                                        <Button style={{ marginLeft: 8 }}
                                                onClick={this.props.handleFormReset}>重置</Button>
                                    </span>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            size="middle"
                            loading={this.props.loading}
                            pagination={this.props.paginationPage}
                            columns={this.props.columns}
                            dataSource={this.props.data}
                            className={styles.homeTable}
                        />
                    </Card>
                </TabPane>
            </Tabs>
        );
    }
}
