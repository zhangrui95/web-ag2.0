import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty } from 'antd';
import styles from './RenderTable.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
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
    lx: '人员信息',
    tzlx: 'baqxx',
    sx: '',
    current: 1,
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      current: pagination.current,
    });
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
        pathname: '/handlingArea/AreaData/areaDetail',
        query: { record: record, id: record && record.system_id ? record.system_id : '1',movefrom: '办案区常规',current:this.state.current },
      }),
    );
    // const divs = (
    //     <div>
    //         <Detail
    //             {...this.props}
    //             record={record}
    //             id={record.system_id}
    //             sfgz={record.sfgz}
    //             gzid={record.gzid}
    //             tzlx={record.tzlx}
    //             ajbh={record.ajbh}
    //             current={this.state.current}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '人员在区详情', content: divs, key: record.system_id };
    // this.props.newDetail(AddNewDetail);
  };
  refreshDetail = (res) => {
    // console.log('res',res);
    this.props.dispatch({
      type: 'areaData/areaDetailFetch',
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
        (res.salx_mc ? res.salx_mc + '、' : '') +
        (res.name ? res.name : ''),
      shareRecord: res,
    });
    if (type === 2) {
      let areaDetails = res;
      let detail = [
        `人员姓名：${areaDetails && areaDetails.name ? areaDetails.name : ''}`,
        `性别：${areaDetails && areaDetails.xb ? areaDetails.xb : ''}`,
        `人员类型：${areaDetails && areaDetails.salx_mc ? areaDetails.salx_mc : ''}`,
        `强制措施：${areaDetails && areaDetails.qzcs ? areaDetails.qzcs : ''}`,
        `案件名称：${areaDetails && areaDetails.ajmc ? areaDetails.ajmc : ''}`,
        `办案单位：${areaDetails && areaDetails.badw ? areaDetails.badw : ''}`,
        `办案民警：${areaDetails && areaDetails.bar ? areaDetails.bar : ''}`,
      ];
      res.detail = detail;
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: {
            record: res,
            id: res && res.id ? res.id : '1',
            from: this.state.lx,
            tzlx: this.state.tzlx,
            fromPath: '/handlingArea/AreaData',
            tab: '表格',
            sx:
              (res.ajmc ? res.ajmc + '、' : '') +
              (res.salx_mc ? res.salx_mc + '、' : '') +
              (res.name ? res.name : ''),
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
            (res.salx_mc ? res.salx_mc + '、' : '') +
            (res.name ? res.name : ''),
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
            this.props.getArea({ currentPage: this.state.current, pd: this.props.formValues });
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
          this.props.getArea({ currentPage: this.state.current, pd: this.props.formValues });
          this.refreshDetail(record);
        }
      },
    });
  };
  Ledger = (res) => {
      window.open(`${window.configUrl.baqRaqUrl}showReport3.jsp?rpx=TZ-HLJ.rpx&personId=${res && res.system_id ? res.system_id : ''}`);
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/ModuleAll/PersonLedger',
    //     query: {
    //       record: res,
    //       id: res && res.system_id ? res.system_id : '1',
    //       // from: this.state.lx,
    //       // tzlx: this.state.tzlx,
    //       // fromPath: '/handlingArea/AreaData',
    //       // tab: '表格',
    //     },
    //   }),
    // );
  };
  render() {
    const { data, loading } = this.props;
    let columns;
    columns = [
      {
        title: '入区时间',
        dataIndex: 'rqsj',
        width: 100,
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
        dataIndex: 'salx_mc',
        render: text => {
          return (
            <Ellipsis length={8} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '所属办案区',
        dataIndex: 'ha_name',
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
        title: '办案人',
        dataIndex: 'bar',
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
        dataIndex: 'badw',
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
        title: '在区状态',
        dataIndex: 'zt',
        wdith: 50,
      },
      {
        title: '入区原因',
        dataIndex: 'rqyy',
      },
      {
        title: '操作',
        render: record => (
          <div>
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
                getPopupContainer={() => document.getElementById('baqcardArea')}
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
        ),
      },
    ];
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: data.page ? data.page.currentPage : '',
      total: data.page ? data.page.totalResult : '',
      pageSize: data.page ? data.page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.pagination}  style={{
            color: this.props.global && this.props.global.dark ? '#fff' : '#999'
        }}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${
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
          {this.state.shareRecord && this.state.shareRecord.salx_mc
            ? this.state.shareRecord.salx_mc
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
              this.state.shareRecord.badw &&
              this.state.shareRecord.badw.length > 7
                ? this.state.shareRecord.badw
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.badw
              ? this.state.shareRecord.badw.length > 7
                ? this.state.shareRecord.badw.substring(0, 7) + '...'
                : this.state.shareRecord.badw
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          办案民警：
          {this.state.shareRecord && this.state.shareRecord.bar ? this.state.shareRecord.bar : ''}
        </Col>
      </Row>
    );
    return (
      <div className={styles.standardTable} id="baqcardArea">
        <Table
          // size={'middle'}
          loading={loading}
          rowKey={record => record.key}
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
