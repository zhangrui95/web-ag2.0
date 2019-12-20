/*
 * ItemRealData/RenderTable.js 涉案物品数据表格组件
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty} from 'antd';
import styles from './RenderTable.less';
// import Detail from '../../routes/ItemRealData/itemDetail';
// import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {routerRedux} from "dva/router";
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
import {connect} from "dva";
@connect(({ global }) => ({
    global
}))
class RenderTable extends PureComponent {
  state = {
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '物品信息',
    tzlx: 'wpxx',
    sx: '',
    current: '',
  };
  itemTableChange = (pagination, filters, sorter) => {
    this.setState({
      current: pagination.current,
    });
    this.props.onChange(pagination, filters, sorter);
  };

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.id) {
      let record = this.props.location.query.record;
      this.deatils(record);
    }
  }

  deatils = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/articlesInvolved/ArticlesData/itemDetail',
        query: { record: record,id: record && record.system_id ? record.system_id : '1' },
      }),
    )
    // const divs = (
    //   <div>
    //     <Detail
    //       {...this.props}
    //       record={record}
    //       id={record.system_id}
    //       sfgz={record.sfgz}
    //       gzid={record.gzid}
    //       tzlx={record.tzlx}
    //       ajbh={record.ajbh}
    //       current={this.state.current}
    //     />
    //   </div>
    // );
    // const AddNewDetail = { title: '涉案物品详情', content: divs, key: record.system_id };
    // this.props.newDetail(AddNewDetail);
  };
  saveShare = (res, type, ajGzLx) => {
    this.setState({
      sx:
        (res.ajmc ? res.ajmc + '、' : '') +
        (res.wpmc ? res.wpmc + '、' : '') +
        (res.zt ? res.zt : ''),
      shareRecord: res,
    });
    if (type === 2) {
      let detail=(
        <Row
          style={{
            lineHeight:'50px',
            paddingLeft:66,
          }}
        >
          <Col span={6}>
            物品名称：
            {res && res.wpmc ? res.wpmc : ''}
          </Col>
          <Col span={6}>
            物品种类：
            {res && res.wplx_mc
              ? res.wplx_mc
              : ''}
          </Col>
          <Col span={6}>
            物品状态：
            {res && res.zt ? res.zt : ''}
          </Col>
          <Col span={6}>
            库房信息：
            <Tooltip
              title={
                res &&
                res.szkf &&
                res.szkf.length > 8
                  ? res.szkf
                  : null
              }
            >
              {res && res.szkf
                ? res.szkf.length > 8
                  ? res.szkf.substring(0, 8) + '...'
                  : res.szkf
                : ''}
            </Tooltip>
          </Col>
          <Col span={12}>
            关联案件名称：
            <Tooltip
              title={
                res &&
                res.ajmc &&
                res.ajmc.length > 18
                  ? res.ajmc
                  : null
              }
            >
              {res && res.ajmc
                ? res.ajmc.length > 18
                  ? res.ajmc.substring(0, 18) + '...'
                  : res.ajmc
                : ''}
            </Tooltip>
          </Col>
          <Col span={12}>
            办案单位：
            <Tooltip
              title={
                res &&
                res.kfgly_dwmc &&
                res.kfgly_dwmc.length > 18
                  ? res.kfgly_dwmc
                  : null
              }
            >
              {res && res.kfgly_dwmc
                ? res.kfgly_dwmc.length > 18
                  ? res.kfgly_dwmc.substring(0, 18) + '...'
                  : res.kfgly_dwmc
                : ''}
            </Tooltip>
          </Col>
        </Row>
      )
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: { record: res,id: res && res.system_id ? res.system_id : '1',from:'物品信息',tzlx:'wpxx',fromPath:'/articlesInvolved/ArticlesData',detail,tab:'表格',sx:
            (res.ajmc ? res.ajmc + '、' : '') +
            (res.wpmc ? res.wpmc + '、' : '') +
            (res.zt ? res.zt : ''), },
        }),
      )
      // this.setState({
      //   shareVisible: true,
      //   shareItem: res,
      // });
    } else {
      this.props.dispatch({
        type: 'share/getMyFollow',
        payload: {
          agid: res.id,
          lx: this.state.lx,
          sx:
            (res.ajmc ? res.ajmc + '、' : '') +
            (res.wpmc ? res.wpmc + '、' : '') +
            (res.zt ? res.zt : ''),
          type: type,
          tzlx: this.state.tzlx,
          wtid: res.wtid,
          ajbh: res.ajbh,
          system_id: res.system_id,
          ajGzLx: ajGzLx,
        },
        callback: data => {
          if (!data.error) {
            message.success('关注成功');
            this.props.getItem({ currentPage: this.state.current, pd: this.props.formValues });
          }
        },
      });
    }
  };
  handleCancel = e => {
    this.setState({
      shareVisible: false,
    });
  };
  noFollow = record => {
    this.props.dispatch({
      type: 'share/getNoFollow',
      payload: {
        id: record.gzid,
        tzlx: record.tzlx,
        ajbh: record.ajbh,
        ajGzlx: record.ajgzlx,
      },
      callback: res => {
        if (!res.error) {
          message.success('取消关注成功');
          this.props.getItem({ currentPage: this.state.current, pd: this.props.formValues });
        }
      },
    });
  };

  render() {
    const { data, loading } = this.props;
    let columns;
    columns = [
      {
        title: '入库时间',
        dataIndex: 'rksj',
        width: 100,
      },
      {
        title: '物品名称',
        dataIndex: 'wpmc',
      },
      {
        title: '物品种类',
        dataIndex: 'wplx_mc',
      },
      {
        title: '所在库房',
        dataIndex: 'szkf',
        width: '15%',
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '案件编号',
        dataIndex: 'ajbh',
        width: 200,
      },
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        width: '20%',
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '物品状态',
        dataIndex: 'zt',
        width: 120,
      },
      {
        title: '操作',
        render: record => {
          return (
            <div>
              <a onClick={() => this.deatils(record)}>详情</a>
              <Divider type="vertical" />
              {record.sfgz === 0 ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <a onClick={() => this.saveShare(record, 1, 0)}>本物品关注</a>
                      </Menu.Item>
                      <Menu.Item key="1">
                        <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  getPopupContainer={() => document.getElementById('sawpsjcardArea')}
                >
                  <a href="javascript:;">关注</a>
                </Dropdown>
              ) : (
                <a href="javascript:;" onClick={() => this.noFollow(record)}>
                  取消{record.ajgzlx && record.ajgzlx === '0' ? '本物品' : '全要素'}关注
                </a>
              )}
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>
                分享
              </a>
            </div>
          );
        },
      },
    ];

    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: data.page ? data.page.currentPage : '',
      total: data.page ? data.page.totalResult : '',
      pageSize: data.page ? data.page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页，${
          data.page ? data.page.totalResult : 0
        } 条记录 `}</span>
      ),
    };
    let detail = (
      <Row
        style={{
          width: '90%',
          margin: '0 38px 10px',
          lineHeight: '36px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <Col span={6}>
          物品名称：
          {this.state.shareRecord && this.state.shareRecord.wpmc ? this.state.shareRecord.wpmc : ''}
        </Col>
        <Col span={6}>
          物品种类：
          {this.state.shareRecord && this.state.shareRecord.wplx_mc
            ? this.state.shareRecord.wplx_mc
            : ''}
        </Col>
        <Col span={6}>
          物品状态：
          {this.state.shareRecord && this.state.shareRecord.zt ? this.state.shareRecord.zt : ''}
        </Col>
        <Col span={6}>
          库房信息：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.szkf &&
              this.state.shareRecord.szkf.length > 8
                ? this.state.shareRecord.szkf
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.szkf
              ? this.state.shareRecord.szkf.length > 8
                ? this.state.shareRecord.szkf.substring(0, 8) + '...'
                : this.state.shareRecord.szkf
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          关联案件名称：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.ajmc &&
              this.state.shareRecord.ajmc.length > 18
                ? this.state.shareRecord.ajmc
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.ajmc
              ? this.state.shareRecord.ajmc.length > 18
                ? this.state.shareRecord.ajmc.substring(0, 18) + '...'
                : this.state.shareRecord.ajmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          办案单位：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.kfgly_dwmc &&
              this.state.shareRecord.kfgly_dwmc.length > 18
                ? this.state.shareRecord.kfgly_dwmc
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.kfgly_dwmc
              ? this.state.shareRecord.kfgly_dwmc.length > 18
                ? this.state.shareRecord.kfgly_dwmc.substring(0, 18) + '...'
                : this.state.shareRecord.kfgly_dwmc
              : ''}
          </Tooltip>
        </Col>
      </Row>
    );
    return (
      <div className={styles.standardTable} id='sawpsjcardArea'>
        <Table
          // size={'middle'}
          loading={loading}
          rowKey={record => record.key}
          dataSource={data.list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.itemTableChange}
          locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
        />
        {/*<ShareModal*/}
        {/*title="物品信息分享"*/}
        {/*detail={detail}*/}
        {/*shareVisible={this.state.shareVisible}*/}
        {/*handleCancel={this.handleCancel}*/}
        {/*shareItem={this.state.shareItem}*/}
        {/*personList={this.state.personList}*/}
        {/*lx={this.state.lx}*/}
        {/*tzlx={this.state.tzlx}*/}
        {/*sx={this.state.sx}*/}
        {/*/>*/}
      </div>
    );
  }
}

export default RenderTable;
