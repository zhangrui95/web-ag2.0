/*
 * XzCaseRealData/index.js 受立案行政案件表格组件
 * author：jhm
 * 20180605
 * */

import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Card } from 'antd';
import { connect } from 'dva';
import styles from './RenderTable.less';
// import ShareModal from './../ShareModal/ShareModal';
// import Detail from '../../routes/XzCaseRealData/caseDetail';
// import MakeTableModal from '../CaseRealData/MakeTableModal';
// import AdministrativeCaseDocDetail from '../../routes/AllDocuments/AdministrativeCaseDocDetail';
import { userAuthorityCode } from '../../utils/utils';
import { authorityIsTrue } from '../../utils/authority';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import stylescommon from '@/pages/common/common.less';
import { routerRedux } from 'dva/router';

@connect(({ share }) => ({
  share,
}))
class RenderTable extends PureComponent {
  state = {
    shareVisible: false,
    shareItem: null,
    personList: [],
    lx: '案件信息',
    tzlx: window.configUrl.is_area === '1' ? 'xzajxx' + 3 : 'xzajxx' + this.props.ssmk,
    sx: '',
    current: '',
    makeTableModalVisible: false, // 制表
    isZb: authorityIsTrue(userAuthorityCode.ZHIBIAO), // 制表权限
    caseRecord: null,
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
    // const divs = (
    //     <div>
    //         <Detail
    //             {...this.props}
    //             id={record.id}
    //             systemId={record.system_id}
    //             record={record}
    //             sfgz={record.sfgz}
    //             gzid={record.gzid}
    //             tzlx={this.state.tzlx}
    //             ajbh={record.ajbh}
    //             details={this.deatils}
    //             current={this.state.current}
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '行政案件详情', content: divs, key: record.system_id };
    // this.props.newDetail(AddNewDetail);
    // this.props.dispatch({
    //   type: 'global/changeNavigation',
    //   payload: {
    //     key: record && record.id ? record.id : '1',
    //     name: '行政案件详情',
    //     path: '/caseFiling/caseData/AdministrationData/caseDetail',
    //     isShow: true,
    //     query: { record, id: record && record.id ? record.id : '1' },
    //   },
    //   callback: () => {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
            query: {id: record && record.id ? record.id : '1',record: record },
          }),
        );
    //   },
    // });
  };
  // 行政案件档案详情
  administrativeCaseDocDetails = record => {
      // this.props.dispatch({
      //     type: 'global/changeNavigation',
      //     payload: {
      //         key: record && record.system_id ? record.system_id : '1',
      //         name: '行政案件档案详情',
      //         path: '/lawEnforcement/File/AdministrativeFile/Detail',
      //         isShow: true,
      //         query: { record, id: record && record.system_id ? record.system_id : '1' },
      //     },
      //     callback: () => {
              this.props.dispatch(
                  routerRedux.push({
                      pathname: '/lawEnforcement/File/AdministrativeFile/Detail',
                      query: { id: record && record.system_id ? record.system_id : '1',record: record },
                  }),
              );
      //     },
      // });
    // const divs = (
    //     <div>
    //         <AdministrativeCaseDocDetail
    //             {...this.props}
    //             id={record.id}
    //             systemId={record.system_id}
    //             record={record}
    //             sfgz={record.sfgz}
    //             gzid={record.gzid}
    //             tzlx={this.state.tzlx}
    //             ajbh={record.ajbh}
    //             details={this.deatils}
    //             from='行政案件档案导出'
    //         />
    //     </div>
    // );
    // const AddNewDetail = { title: '行政案件档案详情', content: divs, key: record.id };
    // this.props.newDetail(AddNewDetail);
  };
  saveShare = (res, type, ajGzLx) => {
    this.setState({
      sx: (res.ajmc ? res.ajmc + '、' : '') + (res.ajzt ? res.ajzt : ''),
      shareRecord: res,
    });
    if (type === 2) {
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
          sx: (res.ajmc ? res.ajmc + '、' : '') + (res.ajzt ? res.ajzt : ''),
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
            this.props.getCase({ currentPage: this.state.current, pd: this.props.formValues });
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
          this.props.getCase({ currentPage: this.state.current, pd: this.props.formValues });
        }
      },
    });
  };
  // 制表
  makeTable = (record, flag) => {
    this.setState({
      caseRecord: record,
      makeTableModalVisible: !!flag,
    });
  };
  // 关闭制表modal
  MakeTableCancel = () => {
    this.setState({
      makeTableModalVisible: false,
    });
  };

  render() {
    const { data, loading } = this.props;
    const { makeTableModalVisible, caseRecord, isZb } = this.state;
    let columns;
    columns = [
      {
        title: '案件编号',
        dataIndex: 'ajbh',
      },
      {
        title: '案件名称',
        width:'20%',
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
        title: '受理单位',
         width:'15%',
        dataIndex: 'sldwName',
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
        title: '受理日期',
        dataIndex: 'slrq',
      },
      {
        title: '案件状态',
        dataIndex: 'ajzt',
      },
      {
        title: '案件类别',
        dataIndex: 'ajlb_name',
        width:'10%',
        render: text => {
          return (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      // window.configUrl.is_area === '1'?
      //   {
      //     title: '强制措施',
      //     dataIndex: 'qzcsmc',
      //   }:{},
      {
        title: '操作',
        render: record => {
          if (this.props.isDocument) {
            return (
              <div>
                <a onClick={() => this.administrativeCaseDocDetails(record)}>详情</a>
                {isZb ? (
                  <span>
                    <Divider type="vertical" />
                    <a onClick={() => this.makeTable(record, true)}>制表</a>
                  </span>
                ) : null}
              </div>
            );
          }
          return (
            <div>
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
              {isZb ? (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() => this.makeTable(record, true)}>制表</a>
                </span>
              ) : null}
            </div>
          );
        },
      },
    ];

    const paginationProps = {
      current: data && data.page ? data.page.currentPage : '',
      total: data && data.page ? data.page.totalResult : '',
      pageSize: data && data.page ? data.page.showCount : '',
      showTotal: (total, range) => (
        <span
          className={
            data &&
            data.page &&
            data.page.totalResult &&
            data.page.totalResult.toString().length < 5
              ? stylescommon.pagination
              : stylescommon.paginations
          }
        >{`共 ${data && data.page ? data.page.totalPage : 1} 页，${
          data && data.page ? data.page.totalResult : 0
        } 条数据 `}</span>
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
        <Col span={12}>
          案件名称：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.ajmc &&
              this.state.shareRecord.ajmc.length > 20
                ? this.state.shareRecord.ajmc
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.ajmc
              ? this.state.shareRecord.ajmc.length > 20
                ? this.state.shareRecord.ajmc.substring(0, 20) + '...'
                : this.state.shareRecord.ajmc
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          受理单位：
          <Tooltip
            title={
              this.state.shareRecord &&
              this.state.shareRecord.sldwName &&
              this.state.shareRecord.sldwName.length > 20
                ? this.state.shareRecord.sldwName
                : null
            }
          >
            {this.state.shareRecord && this.state.shareRecord.sldwName
              ? this.state.shareRecord.sldwName.length > 20
                ? this.state.shareRecord.sldwName.substring(0, 20) + '...'
                : this.state.shareRecord.sldwName
              : ''}
          </Tooltip>
        </Col>
        <Col span={12}>
          案件状态：
          {this.state.shareRecord && this.state.shareRecord.ajzt ? this.state.shareRecord.ajzt : ''}
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
      <Card className={stylescommon.cardArea}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={data.list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        {/*<ShareModal title="案件信息分享" detail={detail} shareVisible={this.state.shareVisible}*/}
        {/*            handleCancel={this.handleCancel} shareItem={this.state.shareItem}*/}
        {/*            personList={this.state.personList}*/}
        {/*            lx={this.state.lx} tzlx={this.state.tzlx} sx={this.state.sx}/>*/}
        {/*{*/}
        {/*    makeTableModalVisible ? (*/}
        {/*        <MakeTableModal*/}
        {/*            title='表格选择'*/}
        {/*            makeTableModalVisible={makeTableModalVisible}*/}
        {/*            MakeTableCancel={this.MakeTableCancel}*/}
        {/*            caseRecord={caseRecord}*/}
        {/*        />*/}
        {/*    ) : null*/}
        {/*}*/}
      </Card>
    );
  }
}

export default RenderTable;
