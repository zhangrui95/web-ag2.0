/*
 * 首页我的分享列表切换
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
  state = {
    searchHeight: false, // 我的分享展开筛选
    searchHeight1: false, // 分享给我展开筛选
  };
  getSearchHeight = () => {
    this.setState({
      searchHeight: !this.state.searchHeight,
    });
  };
  getSearchHeight1 = () => {
    this.setState({
      searchHeight1: !this.state.searchHeight1,
    });
  };
  // 无法选择的日期
  // disabledDate = current => {
  //   // Can not select days before today and today
  //   return current && current.valueOf() > Date.now();
  // };
  render() {
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, md: { span: 10 }, xl: { span: 8 }, xxl: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, md: { span: 14 }, xl: { span: 16 }, xxl: { span: 18 } },
    };
    const {
      form: { getFieldDecorator },
      treeDefaultExpandedKeys,
    } = this.props;
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 12 };
    const colLayouts = { sm: 24, md: 12, xl: 16 };
    const {
      common: { depTree },
    } = this.props;
    return (
      <div className={styles.TabsStyle}>
        <Tabs defaultActiveKey="s1" onChange={this.props.callBackTabs} type="card">
          <TabPane
            tab={
              <div className={styles.mysharestyle}>
                <IconFont type={'icon-fenxiang'} className={styles.iconLefts}/>
                <span>我的分享({this.props.wdfx ? this.props.wdfx : 0})</span>
              </div>
            }
            key="s1"
          >
            <Card title={null} id="myshare" style={{borderRadius:0,border:'0px solid #252C3C',borderTop:'1px solid #171925'}}>
              <Form
                style={{
                  padding: '20px 30px 0 10px',
                  height: this.state.searchHeight ? 'auto' : '75px',
                }}
              >
                <Row gutter={rowLayout} className={stylescommon.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="分享时间" {...formItemLayout}>
                      {getFieldDecorator('fxsj')(
                        <RangePicker
                          disabledDate={this.disabledDate}
                          getCalendarContainer={() => document.getElementById('myshare')}
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="分享单位" {...formItemLayout}>
                      {getFieldDecorator(
                        'fxdw',
                        {},
                      )(
                        <TreeSelect
                          showSearch
                          style={{ width: '100%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择"
                          allowClear
                          key="badwSelect"
                          treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                          treeNodeFilterProp="title"
                          getPopupContainer={()=>document.getElementById('myshare')}
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
                        <Select placeholder="请选择" style={{ width: '100%' }} getPopupContainer={()=>document.getElementById('myshare')}>
                          <Option value="">全部</Option>
                          <Option value="案件信息">案件信息</Option>
                          <Option value="人员信息">人员信息</Option>
                          <Option value="物品信息">物品信息</Option>
                          <Option value="卷宗信息">卷宗信息</Option>
                          <Option value="警情信息">警情信息</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="被分享人" {...formItemLayout}>
                      {getFieldDecorator(
                        'fxr',
                        {},
                      )(
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="请选择被分享人"
                          onSearch={this.props.handleSearchPerson}
                          onFocus={this.props.handleSearchPerson}
                          notFoundContent={this.props.loadings ? <Spin size="small" /> : null}
                          onBlur={this.props.getBlur}
                          getPopupContainer={()=>document.getElementById('myshare')}
                        >
                          {this.props.children}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className={stylescommon.search}>
                  <span style={{ float: 'right', marginBottom: 24, marginTop: 2 }}>
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={() => this.props.handleSearch(0)}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.handleFormReset}
                      className={stylescommon.empty}
                    >
                      重置
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.getSearchHeight}
                      className={stylescommon.empty}
                    >
                      {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                      <Icon type={this.state.searchHeight ? 'up' : 'down'} />
                    </Button>
                  </span>
                </Row>
              </Form>
              <Table
                size="middle"
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
                <span>分享给我({this.props.fxgw ? this.props.fxgw : 0})</span>
              </div>
            }
            key="s2"
          >
            <Card title={null} id="shareme" style={{borderRadius:0,border:'0px solid #252C3C',borderTop:'1px solid #171925'}}>
              <Form
                style={{
                  padding: '20px 30px 0 10px',
                  height: this.state.searchHeight1 ? 'auto' : '75px',
                }}
              >
                <Row gutter={rowLayout} className={stylescommon.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="分享时间" {...formItemLayout}>
                      {getFieldDecorator('fxsj')(
                        <RangePicker
                          disabledDate={this.disabledDate}
                          getCalendarContainer={() => document.getElementById('shareme')}
                          style={{ width: '100%' }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="分享单位" {...formItemLayout}>
                      {getFieldDecorator(
                        'fxdw',
                        {},
                      )(
                        <TreeSelect
                          showSearch
                          style={{ width: '100%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择"
                          allowClear
                          key="badwSelect"
                          treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                          treeNodeFilterProp="title"
                          getPopupContainer={()=>document.getElementById('shareme')}
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
                        <Select placeholder="请选择" style={{ width: '100%' }} getPopupContainer={()=>document.getElementById('shareme')}>
                          <Option value="">全部</Option>
                          <Option value="案件信息">案件信息</Option>
                          <Option value="人员信息">人员信息</Option>
                          <Option value="物品信息">物品信息</Option>
                          <Option value="卷宗信息">卷宗信息</Option>
                          <Option value="警情信息">警情信息</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="分享人" {...formItemLayout}>
                      {getFieldDecorator(
                        'fxr',
                        {},
                      )(
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="请选择分享人"
                          onSearch={this.props.handleSearchPerson}
                          onFocus={this.props.handleSearchPerson}
                          notFoundContent={this.props.loadings ? <Spin size="small" /> : null}
                          onBlur={this.props.getBlur}
                          getPopupContainer={()=>document.getElementById('shareme')}
                        >
                          {this.props.children}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className={stylescommon.search}>
                  <span style={{ float: 'right', marginBottom: 24, marginTop: 2 }}>
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
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.getSearchHeight1}
                      className={stylescommon.empty}
                    >
                      {this.state.searchHeight1 ? '收起筛选' : '展开筛选'}{' '}
                      <Icon type={this.state.searchHeight1 ? 'up' : 'down'} />
                    </Button>
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
