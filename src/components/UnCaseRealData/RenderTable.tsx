import React, { PureComponent } from 'react';
import {Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty} from 'antd';
import { connect } from 'dva';
import styles from './RenderTable.less';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";
// import ShareModal from './../ShareModal/ShareModal';
// import SLAXSDetail from '../../../routes/UnCaseRealData/uncaseDetail';
// import Ellipsis from '../Ellipsis';

@connect(({ share,global }) => ({
  share,global
}))
class RenderTable extends PureComponent {
  state = {
    searchDetail: '',
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '案件信息',
    tzlx: window.configUrl.is_area === '1' ? 'xsajwt' + 3 : 'xsajwt' + this.props.ssmk,
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
    if (this.props.location.query && this.props.location.query.id) {
      this.deatils(this.props.location.query.record);
    }
  }

  deatils = record => {
    // const divs = (
    //     <div>
    //         <SLAXSDetail
    //             {...this.props}
    //             id={record.id}
    //             systemId={record.system_id}
    //             dbzt={record.dbzt}
    //             supervise={this.supervise}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '刑事案件告警详情', content: divs, key: record.id };
    // this.props.newDetail(AddNewDetail);
    // this.props.dispatch({
    //   type: 'global/changeNavigation',
    //   payload: {
    //     key: record && record.id ? record.id : '1',
    //     name: '刑事案件告警详情',
    //     path: '/caseFiling/casePolice/CriminalPolice/uncaseDetail',
    //     isShow: true,
    //     query: { record, id: record && record.id ? record.id : '1' },
    //   },
    //   callback: () => {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
            query: { record: record, id: record && record.id ? record.id : '1' },
          }),
        );
    //   },
    // });
  };

  // 打开督办模态框
  supervise = (flag, record) => {
    const { id, system_id } = record;
    this.props.dispatch({
      type: 'UnCaseData/UnCaseDetailFetch',
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
    const { wtid } = record;
    this.props.dispatch({
      type: 'UnCaseData/getUnCaseByProblemId',
      payload: {
        pd: {
          wtid,
        },
        currentPage: 1,
        showCount: 9999,
      },
      callback: data => {
        if (data.list[0].dbzt === '00') {
          const {searchDetail} = this.state;
          // this.props.openModal(this.state.searchDetail, flag, record);
          this.props.dispatch(
            routerRedux.push({
              pathname: '/ModuleAll/Supervise',
              query: { record:searchDetail,searchDetail:record,id: searchDetail && searchDetail.id ? searchDetail.id : '1',from:'督办',tzlx:this.state.tzlx,fromPath:'/newcaseFiling/casePolice/CriminalPolice',tab:'表格'},
            }),
          )
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
        (res.schj ? res.schj + '、' : '') +
        (res.wtlxMc ? res.wtlxMc + '、' : '') +
        (res.gjsj ? res.gjsj : ''),
      shareRecord: res,
    });
    if (type === 2) {
      let detail = (
        <Row
          style={{
            lineHeight:'55px',
            paddingLeft:66,
          }}
        >
          <Col span={12}>
            案件名称：
            <Tooltip
              title={
                res &&
                res.ajmc &&
                res.ajmc.length > 20
                  ? res.ajmc
                  : null
              }
            >
              {res && res.ajmc
                ? res.ajmc.length > 20
                  ? res.ajmc.substring(0, 20) + '...'
                  : res.ajmc
                : ''}
            </Tooltip>
          </Col>
          <Col span={12}>
            办案单位：
            <Tooltip
              title={
                res &&
                res.bardwmc &&
                res.bardwmc.length > 20
                  ? res.bardwmc
                  : null
              }
            >
              {res && res.bardwmc
                ? res.bardwmc.length > 20
                  ? res.bardwmc.substring(0, 20) + '...'
                  : res.bardwmc
                : ''}
            </Tooltip>
          </Col>
          <Col span={12}>
            案件状态：
            {res && res.schj ? res.schj : ''}
          </Col>
          <Col span={12}>
            办案民警：
            {res && res.barxm
              ? res.barxm
              : ''}
          </Col>
        </Row>
      );
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/Share',
          query: { record: res,id: res && res.id ? res.id : '1',from:this.state.lx,tzlx:this.state.tzlx,fromPath:'/newcaseFiling/casePolice/CriminalPolice',detail,tab:'表格',sx: (res.ajmc ? res.ajmc + '、' : '') + (res.schj ? res.schj + '、' : '') + (res.wtlxMc ? res.wtlxMc + '、' : '') + (res.gjsj ? res.gjsj : '') },
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
            (res.schj ? res.schj + '、' : '') +
            (res.wtlxMc ? res.wtlxMc + '、' : '') +
            (res.gjsj ? res.gjsj : ''),
          type: type,
          tzlx: this.state.tzlx,
          wtid: res.wtid,
          ajbh: res.ajbh,
          system_id: res.system_id,
          ajGzLx: ajGzLx,
          ssmk: this.props.ssmk,
        },
        callback: res => {
          if (!res.error) {
            message.success('关注成功');
            this.props.getUnCase({ currentPage: this.state.current, pd: this.props.formValues });
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
          this.props.getUnCase({ currentPage: this.state.current, pd: this.props.formValues });
        }
      },
    });
  };

  render() {
    const {
      data,
      UnCaseData: { loading },
      isDb,
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
        title: '办案单位',
        dataIndex: 'bardwmc',
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
        title: '案件状态',
        dataIndex: 'schj',
        width: 50,
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
              {isDb ? (
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
                        <a onClick={() => this.saveShare(record, 1, 0)}>本案件关注</a>
                      </Menu.Item>
                      <Menu.Item key="1">
                        <a onClick={() => this.saveShare(record, 1, 1)}>全要素关注</a>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  getPopupContainer={() => document.getElementById('xsajgjstandardTable')}
                >
                  <a href="javascript:;">关注</a>
                </Dropdown>
              ) : (
                <a href="javascript:;" onClick={() => this.noFollow(record)}>
                  取消{record.ajgzlx && record.ajgzlx === '0' ? '本案件' : '全要素'}关注
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
        <span className={styles.pagination}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${data.page ? data.page.totalResult : 0} 条记录 `}</span>
      ),
    };
    return (
      <div className={styles.standardTable} id='xsajgjstandardTable'>
        <Table
          // size={'middle'}
          loading={loading}
          rowKey={record => record.id}
          dataSource={data.list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
        />
        {/*<ShareModal*/}
        {/*title="案件信息分享"*/}
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
