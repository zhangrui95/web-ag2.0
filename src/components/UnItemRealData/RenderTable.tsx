import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty } from 'antd';
import styles from './RenderTable.less';
// import Detail from '../../routes/UnItemRealData/unitemDetail';
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
    searchDetail: '',
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '物品信息',
    tzlx: 'wpwt',
    sx: '',
    current: '',
  };
  itemTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      current: pagination.current,
    });
  };

  componentDidMount() {
    // if (this.props.location.query && this.props.location.query.id) {
    //   this.deatils(this.props.location.query.id, this.props.location.query.system_id, null);
    // }
  }

  deatils = record => {
    //id, systemId, dbzt  record.id, record.system_id, record.dbzt
    this.props.dispatch(
      routerRedux.push({
        pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
        query: { record: record, id: record && record.id ? record.id : '1' },
      }),
    );
    // const divs = (
    //   <div>
    //     <Detail
    //       id={id}
    //       systemId={systemId}
    //       supervise={this.supervise}
    //       dbzt={dbzt}
    //       {...this.props}
    //     />
    //   </div>
    // );
    // const AddNewDetail = { title: '涉案财物告警详情', content: divs, key: id };
    // this.props.newDetail(AddNewDetail);
  };

  // 打开督办模态框
  supervise = (flag, record) => {
    const { id, system_id } = record;
    this.props.dispatch({
      type: 'UnItemData/UnitemDetailFetch',
      payload: {
        id,
        system_id,
      },
      callback: data => {
        if (data) {
          this.setState({
            searchDetail: data,
          });
          this.searchDetail(flag, record);
        }
      },
    });
  };
  searchDetail = (flag, record) => {
    const { id } = record;
    this.props.dispatch({
      type: 'UnItemData/getUnitemByProblemId',
      payload: {
        pd: {
          wtid: id,
        },
        currentPage: 1,
        showCount: 9999,
      },
      callback: data => {
        if (data.list[0].dbzt === '00') {
          const { searchDetail } = this.state;
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/Supervise',
              query: {
                record: searchDetail,
                searchDetail: record,
                id: searchDetail && searchDetail.id ? searchDetail.id : '1',
                from: '督办',
                tzlx: this.state.tzlx,
                fromPath: '/articlesInvolved/ArticlesPolice',
                tab: '表格',
              },
            }),
          );
          // this.props.openModal(this.state.searchDetail, flag, record);
        } else {
          message.warning('该问题已督办，请点击详情查看');
          this.props.refreshTable();
        }
      },
    });
  };
  saveShare = (res, type, ajGzLx) => {
    this.setState({
      sx:
        (res.ajmc ? res.ajmc + '、' : '') +
        (res.wpmc ? res.wpmc + '、' : '') +
        (res.wpzt ? res.wpzt + '、' : '') +
        (res.wtlxMc ? res.wtlxMc + '、' : '') +
        (res.gjsj ? res.gjsj : ''),
      shareRecord: res,
    });
    if (type === 2) {
      let itemDetails = res;
      let detail = [
        `财物名称：${itemDetails && itemDetails.wpmc ? itemDetails.wpmc : ''}`,
        `财物分类：${itemDetails && itemDetails.cwflzw ? itemDetails.cwflzw : ''}`,
        `财物状态：${itemDetails && itemDetails.wpzt ? itemDetails.wpzt : ''}`,
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
            from: this.state.lx,
            tzlx: this.state.tzlx,
            fromPath: '/articlesInvolved/ArticlesPolice',
            tab: '表格',
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.wpmc ? res.wpmc + '、' : '') +
              (res.wpzt ? res.wpzt + '、' : '') +
              (res.wtlxMc ? res.wtlxMc + '、' : '') +
              (res.gjsj ? res.gjsj : ''),
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
            (res.wpzt ? res.wpzt + '、' : '') +
            (res.wtlxMc ? res.wtlxMc + '、' : '') +
            (res.gjsj ? res.gjsj : ''),
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
    const {
      data,
      UnItemData: { loading },
    } = this.props;
    let columns;
    columns = [
      {
        title: '告警时间',
        dataIndex: 'gjsj',
        width: 100,
      },
      {
        title: '问题类型',
        dataIndex: 'wtlxMc',
        width: 130,
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
        dataIndex: 'wpzt',
        width: 120,
      },
      {
        title: '消息状态',
        dataIndex: 'dbztMc',
      },
      {
        title: '产生方式',
        dataIndex: 'csfs',
      },
      {
        title: '库管员',
        dataIndex: 'kfgly',
      },
      {
        title: '存储单位',
        dataIndex: 'ccdwzw',
      },
      {
        title: '操作',
        render: record => {
          return (
            <div>
              {this.props.isDb ? (
                <span style={{ display: 'inlineBlock' }}>
                  {record.dbzt === '00' ? (
                    <a onClick={() => this.supervise(true, record)}>督办</a>
                  ) : (
                    <a style={{ color: '#C3C3C3',cursor: 'not-allowed' }}>督办</a>
                  )}
                  <Divider type="vertical" />
                </span>
              ) : null}
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
                  getPopupContainer={() => document.getElementById('sawpgjcardArea')}
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
        <span className={styles.pagination}>{`共 ${data.page.totalPage} 页，${data.page.totalResult} 条记录`}</span>
      ),
    };
    return (
      <div className={styles.standardTable} id="sawpgjcardArea">
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
