/*
 * 首页我的关注列表切换
 * author：zr
 * 20190424
 * */
import React, { PureComponent } from 'react';
import {
    Col,
    Row,
    Card,
    Form,
    TreeSelect,
    Select,
    Spin,
    Button,
    Table,
    Tabs,
    DatePicker,
    Icon, Empty,
} from 'antd';
import { connect } from 'dva';
import styles from '../../pages/ShowData/Show.less';
import stylescommon from '../../pages/common/common.less';
import noList from "@/assets/viewData/noList.png";
import iconFont from '../../utils/iconfont'
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconFont
})
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
    const {
      form: { getFieldDecorator },
    } = this.props;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 12 };
    return (
      <div className={styles.TabsStyle}>
        <Tabs
          defaultActiveKey="f1"
          className={styles.tabsBox}
          onChange={this.props.callBackTabs}
          type="card"
        >
          <TabPane
            tab={
              <div className={styles.mysharestyle}>
                <IconFont type={'icon-xingxing'} className={styles.iconLefts}/>
                <span>正在关注({this.props.zzgz ? this.props.zzgz : 0})</span>
              </div>
            }
            key="f1"
          >
            <Card title={null} id="followForm">
              <Form style={{ padding: '20px 30px 0 10px' }}>
                <Row gutter={rowLayout} className={stylescommon.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="关注时间" {...formItemLayout}>
                      {getFieldDecorator('gzsj')(
                        <RangePicker
                          getCalendarContainer={() => document.getElementById('followForm')}
                          disabledDate={this.disabledDate}
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="关注类型" {...formItemLayout}>
                      {getFieldDecorator('gzlx', {
                        initialValue: this.props.yjjb,
                      })(
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%' }}
                          getPopupContainer={() => document.getElementById('followForm')}
                        >
                          <Option value="">全部</Option>
                          <Option value="案件信息">案件信息</Option>
                          <Option value="人员信息">人员信息</Option>
                          <Option value="物品信息">物品信息</Option>
                          <Option value="卷宗信息">卷宗信息</Option>
                          <Option value="警情信息">警情信息</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col {...colLayout}>*/}
                  {/*<span style={{ float: 'right', marginBottom: 24 }}>*/}
                  {/*<Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.props.handleSearch(1)}>查询</Button>*/}
                  {/*<Button style={{ marginLeft: 8 }} onClick={this.props.handleFormReset}>重置</Button>*/}
                  {/*</span>*/}
                  {/*</Col>*/}
                </Row>
                <Row className={stylescommon.search}>
                  <span style={{ float: 'left', marginBottom: 24, marginTop: 2 }}>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={() => this.props.handleSearch(0)}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.props.handleFormReset}
                      className={stylescommon.empty}
                    >
                      重置
                    </Button>
                    {/*<Button style={{ marginLeft: 8 }} onClick={this.getSearchHeight1} className={stylescommon.empty}>*/}
                    {/*{this.state.searchHeight1 ? '收起筛选' : '展开筛选'} <Icon type={this.state.searchHeight1 ? "up" :"down"}/>*/}
                    {/*</Button>*/}
                  </span>
                </Row>
              </Form>
              <Table
                // size="middle"
                loading={this.props.loading}
                pagination={this.props.paginationPage}
                columns={this.props.columns}
                dataSource={this.props.data}
                className={styles.homeTable}
                locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
              />
            </Card>
          </TabPane>
          <TabPane
            tab={
              <div className={styles.mysharestyle}>
                <span>历史关注({this.props.lsgz ? this.props.lsgz : 0})</span>
              </div>
            }
            key="f2"
          >
            <Card title={null} id="followForm1">
              <Form style={{ padding: '20px 30px 0 10px' }}>
                <Row gutter={rowLayout} className={stylescommon.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="关注时间" {...formItemLayout}>
                      {getFieldDecorator('gzsj')(
                        <RangePicker
                          getCalendarContainer={() => document.getElementById('followForm1')}
                          disabledDate={this.disabledDate}
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="关注类型" {...formItemLayout}>
                      {getFieldDecorator('gzlx', {
                        initialValue: this.props.yjjb,
                      })(
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%' }}
                          getPopupContainer={() => document.getElementById('followForm1')}
                        >
                          <Option value="">全部</Option>
                          <Option value="案件信息">案件信息</Option>
                          <Option value="人员信息">人员信息</Option>
                          <Option value="物品信息">物品信息</Option>
                          <Option value="卷宗信息">卷宗信息</Option>
                          <Option value="警情信息">警情信息</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  {/*<Col {...colLayout}>*/}
                  {/*<span style={{ float: 'right', marginBottom: 24 }}>*/}
                  {/*<Button style={{ marginLeft: 8 }} type="primary"*/}
                  {/*onClick={() => this.props.handleSearch(1)}>查询</Button>*/}
                  {/*<Button style={{ marginLeft: 8 }} onClick={this.props.handleFormReset}>重置</Button>*/}
                  {/*</span>*/}
                  {/*</Col>*/}
                </Row>
                <Row className={stylescommon.search}>
                  <span style={{ float: 'left', marginBottom: 24, marginTop: 2 }}>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={() => this.props.handleSearch(0)}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.props.handleFormReset}
                      className={stylescommon.empty}
                    >
                      重置
                    </Button>
                    {/*<Button style={{ marginLeft: 8 }} onClick={this.getSearchHeight1} className={stylescommon.empty}>*/}
                    {/*{this.state.searchHeight1 ? '收起筛选' : '展开筛选'} <Icon type={this.state.searchHeight1 ? "up" :"down"}/>*/}
                    {/*</Button>*/}
                  </span>
                </Row>
              </Form>
              <Table
                // size="middle"
                loading={this.props.loading}
                pagination={this.props.paginationPage}
                columns={this.props.columns}
                dataSource={this.props.data}
                className={styles.homeTable}
                locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
