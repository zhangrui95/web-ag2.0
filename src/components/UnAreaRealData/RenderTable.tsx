import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty } from 'antd';
import styles from './RenderTable.less';
// import Detail from '../../routes/UnAreaRealData/unareaDetail';
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
    lx: '人员信息',
    tzlx: 'baqwt',
    sx: '',
    current: '',
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      current: pagination.current,
    });
  };

  componentDidMount() {
    // if (this.props.location.query && this.props.location.query.id) {
    //     this.deatils(this.props.location.query.id, this.props.location.query.system_id, null);
    // }
  }

  deatils = record => {
    // record.id, record.baq_id, record.dbzt
    // this.props.dispatch({
    //   type: 'global/changeNavigation',
    //   payload: {
    //     key: record && record.id ? record.id : '1',
    //     name: '人员在区告警详情',
    //     path: '/handlingArea/AreaPolice/UnareaDetail',
    //     isShow: true,
    //     query: { record, id: record && record.id ? record.id : '1' },
    //   },
    //   callback: () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/handlingArea/AreaPolice/UnareaDetail',
        query: { record: record, id: record && record.id ? record.id : '1' },
      }),
    );
    //   },
    // });
    // const divs = (
    //     <div>
    //         <Detail
    //             {...this.props}
    //             id={id}
    //             baqId={baqId}
    //             dbzt={dbzt}
    //             supervise={this.supervise}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '人员在区告警详情', content: divs, key: id };
    // this.props.newDetail(AddNewDetail);
  };
  // 打开督办模态框
  supervise = (flag, record) => {
    const { id, baq_id } = record;
    this.props.dispatch({
      type: 'UnareaData/UnareaDetailFetch',
      payload: {
        id,
        baq_id,
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
    const { id, people_id } = record;
    this.props.dispatch({
      type: 'UnareaData/getUnareaByProblemId',
      payload: {
        pd: {
          wtid: id,
          people_id,
        },
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
                tzlx: 'baqwt',
                fromPath: '/handlingArea/AreaPolice',
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
        (res.salxMc ? res.salxMc + '、' : '') +
        (res.name ? res.name + '、' : '') +
        (res.wtlxMc ? res.wtlxMc + '、' : '') +
        (res.gjsj ? res.gjsj : ''),
      shareRecord: res,
    });
    if (type === 2) {
      let areaDetails = res;
      let detail = [
        `人员姓名：${areaDetails && areaDetails.name ? areaDetails.name : ''}`,
        `性别：${areaDetails && areaDetails.xb ? areaDetails.xb : ''}`,
        `人员类型：${areaDetails && areaDetails.salxMc ? areaDetails.salxMc : ''}`,
        `强制措施：${areaDetails && areaDetails.qzcs ? areaDetails.qzcs : ''}`,
        `案件名称：${areaDetails && areaDetails.ajmc ? areaDetails.ajmc : ''}`,
        `办案单位：${areaDetails && areaDetails.badwMc ? areaDetails.badwMc : ''}`,
        `办案民警：${areaDetails && areaDetails.barxm ? areaDetails.barxm : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: res,
            id: res && res.id ? res.id : '1',
            from: '人员信息',
            tzlx: 'baqxx',
            fromPath: '/handlingArea/AreaPolice',
            tab: '表格',
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.salxMc ? res.salxMc + '、' : '') +
              (res.name ? res.name + '、' : '') +
              (res.wtlxMc ? res.wtlxMc + '、' : '') +
              (res.gjsj ? res.gjsj : ''),
          },
        }),
      );
      this.setState({
        shareVisible: true,
        shareItem: res,
      });
    } else {
      this.props.dispatch({
        type: 'share/getMyFollow',
        payload: {
          agid: res.id,
          lx: this.state.lx,
          sx:
            (res.ajmc ? res.ajmc + '、' : '') +
            (res.salxMc ? res.salxMc + '、' : '') +
            (res.name ? res.name + '、' : '') +
            (res.wtlxMc ? res.wtlxMc + '、' : '') +
            (res.gjsj ? res.gjsj : ''),
          type: type,
          tzlx: this.state.tzlx,
          wtid: res.wtid,
          ajbh: res.ajbh,
          system_id: res.baq_id,
          ajGzLx: ajGzLx,
        },
        callback: data => {
          if (!data.error) {
            message.success('关注成功');
            this.props.getUnArea({ currentPage: this.state.current, pd: this.props.formValues });
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
          this.props.getUnArea({ currentPage: this.state.current, pd: this.props.formValues });
        }
      },
    });
  };
  Ledger = (res) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ModuleAll/PersonLedger',
        query: {
          record: res,
          id: res && res.system_id ? res.system_id : '1',
          // from: this.state.lx,
          // tzlx: this.state.tzlx,
          // fromPath: '/handlingArea/AreaData',
          // tab: '表格',
        },
      }),
    );
  };
  render() {
    const {
      data,
      UnareaData: { loading },
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
        title: '所属办案区',
        dataIndex: 'haName',
        width: 260,
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '涉案人员',
        dataIndex: 'name',
        render: text => {
          return (
            <Ellipsis length={8} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '人员类型',
        dataIndex: 'salxMc',
        render: text => {
          return (
            <Ellipsis length={8} tooltip>
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
        width: 300,
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '办案人',
        dataIndex: 'barxm',
        render: text => {
          return (
            <Ellipsis length={8} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '办案单位',
        dataIndex: 'badwMc',
        width: '250',
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
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
        title: '操作',
        render: record => {
          return (
            <div>
              {this.props.isDb ? (
                <span style={{ display: 'inlineBlock' }}>
                  {record.dbzt === '00' ? (
                    <a onClick={() => this.supervise(true, record)}>督办</a>
                  ) : (
                    <a style={{ color: '#C3C3C3' }}>督办</a>
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
                        <a onClick={() => this.saveShare(record, 1, 0)}>本人员关注</a>
                      </Menu.Item>
                      <Menu.Item key="1">
                        <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  getPopupContainer={() => document.getElementById('baqgjcardArea')}
                >
                  <a href="javascript:;">关注</a>
                </Dropdown>
              ) : (
                <a href="javascript:;" onClick={() => this.noFollow(record)}>
                  取消{record.ajgzlx && record.ajgzlx === '0' ? '本人员' : '全要素'}关注
                </a>
              )}
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.saveShare(record, 2)}>
                分享
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.Ledger(record)}>
                台账
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
        <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${
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
          人员姓名：
          {this.state.shareRecord && this.state.shareRecord.name ? this.state.shareRecord.name : ''}
        </Col>
        <Col span={6}>
          性别：
          {this.state.shareRecord && this.state.shareRecord.xb ? this.state.shareRecord.xb : ''}
        </Col>
        <Col span={6}>
          人员类型：
          {this.state.shareRecord && this.state.shareRecord.salxMc
            ? this.state.shareRecord.salxMc
            : ''}
        </Col>
        <Col span={6}>
          强制措施：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.qzcs &&
              this.state.shareRecord.qzcs.length > 7
                ? this.state.shareRecord.qzcs
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.qzcs
              ? this.state.shareRecord.qzcs.length > 7
                ? this.state.shareRecord.qzcs.substring(0, 7) + '...'
                : this.state.shareRecord.qzcs
              : ''}
          </Tooltip>
        </Col>
        <Col span={6}>
          案件名称：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.ajmc &&
              this.state.shareRecord.ajmc.length > 7
                ? this.state.shareRecord.ajmc
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.ajmc
              ? this.state.shareRecord.ajmc.length > 7
                ? this.state.shareRecord.ajmc.substring(0, 7) + '...'
                : this.state.shareRecord.ajmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={6}>
          办案单位：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.badwMc &&
              this.state.shareRecord.badwMc.length > 7
                ? this.state.shareRecord.badwMc
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.badwMc
              ? this.state.shareRecord.badwMc.length > 7
                ? this.state.shareRecord.badwMc.substring(0, 7) + '...'
                : this.state.shareRecord.badwMc
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          办案民警：
          {this.state.shareRecord && this.state.shareRecord.barxm
            ? this.state.shareRecord.barxm
            : ''}
        </Col>
      </Row>
    );
    return (
      <div className={styles.standardTable} id="baqgjcardArea">
        <Table
          // size={'middle'}
          loading={loading}
          rowKey={record => record.id}
          dataSource={data.list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={this.props.global && this.props.global.dark ? noList : noListLight}
                description={'暂无数据'}
              />
            ),
          }}
        />
        {/*<ShareModal*/}
        {/*title="人员信息分享"*/}
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
