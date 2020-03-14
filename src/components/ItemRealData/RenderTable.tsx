/*
 * ItemRealData/RenderTable.js 涉案财物数据表格组件
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty } from 'antd';
import styles from './RenderTable.less';
// import Detail from '../../routes/ItemRealData/itemDetail';
// import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import { connect } from 'dva';
@connect(({ global }) => ({
  global,
}))
class RenderTable extends PureComponent {
  state = {
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '物品信息',
    tzlx: 'wpxx',
    sx: '',
    current: 1,
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
        query: { record: record, id: record && record.system_id ? record.system_id : '1',movefrom:'物品常规',current:this.state.current },
      }),
    );
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
    // const AddNewDetail = { title: '涉案财物详情', content: divs, key: record.system_id };
    // this.props.newDetail(AddNewDetail);
  };
  // 是否关注详情刷新
  refreshDetail = (res) => {
    // console.log('res',res);
    this.props.dispatch({
      type: 'itemData/getSawpXqById',
      payload: {
        system_id: res.system_id,
      },
      callback: data => {
        // if (data) {
        //   this.setState({
        //     policeDetails: data,
        //     IsSure: true,
        //   });
        // }
      },
    });
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
      let itemDetails = res;
      let detail = [
        `财物名称：${itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}`,
        `财物分类：${itemDetails && itemDetails.cwflzw ? itemDetails.cwflzw : ''}`,
        `财物状态：${itemDetails && itemDetails.zt ? itemDetails.zt : ''}`,
        `库房信息：${itemDetails && itemDetails.szkf ? itemDetails.szkf : ''}`,
        `关联案件名称：${itemDetails && itemDetails.ajmc ? itemDetails.ajmc : ''}`,
        `办案单位：${itemDetails && itemDetails.kfgly_dwmc ? itemDetails.kfgly_dwmc : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: res,
            id: res && res.system_id ? res.system_id : '1',
            from: '物品信息',
            tzlx: 'wpxx',
            fromPath: '/articlesInvolved/ArticlesData',
            tab: '表格',
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.wpmc ? res.wpmc + '、' : '') +
              (res.zt ? res.zt : ''),
          },
        }),
      );
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
            is_fxgz:'0',
        },
        callback: data => {
          if (!data.error) {
            message.success('关注成功');
            this.props.getItem({ currentPage: this.state.current, pd: this.props.formValues });
            this.refreshDetail(res)
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
          this.refreshDetail(record)
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
        title: '财物名称',
        dataIndex: 'wpmc',
      },
      {
        title: '财物分类',
        dataIndex: 'cwflzw',
      },
      {
        title: '所在库房',
        dataIndex: 'szkf',
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
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '财物状态',
        dataIndex: 'zt',
        width: 120,
      },
      {
        title: '存储单位',
        dataIndex: 'ccdw_mc',
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
    return (
      <div className={styles.standardTable} id="sawpsjcardArea">
        <Table
          // size={'middle'}
          loading={loading}
          rowKey={record => record.key}
          dataSource={data.list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.itemTableChange}
          locale={{
            emptyText: (
              <Empty
                image={this.props.global && this.props.global.dark ? noList : noListLight}
                description={'暂无数据'}
              />
            ),
          }}
        />
      </div>
    );
  }
}

export default RenderTable;
