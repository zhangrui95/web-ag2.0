import React, { PureComponent } from 'react';
import { Card, Empty, Form, Table, Tooltip } from 'antd';
import styles from './RenderTable.less';
// import UncaseDetail from '../../routes/UnCaseRealData/uncaseDetail';
// import UnareaDetail from '../../routes/UnAreaRealData/unareaDetail';
// import UnitemDetail from '../../routes/UnItemRealData/unitemDetail';
// import UnXzCaseDetail from '../../routes/UnXzCaseRealData/caseDetail';
// import UnDossierDetail from '../../routes/UnDossierData/UnDossierDetail';
// import UnPoliceDetail from '../../routes/UnPoliceRealData/unpoliceDetail';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { connect } from 'dva';
import stylescommon from '../../pages/common/common.less';
import noList from '@/assets/viewData/noList.png';
import {routerRedux} from "dva/router";

class RenderTable extends PureComponent {
  state = {};

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.record) {
      this.deatils(this.props.location.query.record);
    }
  }

  // 根据案件编号打开案件窗口
  deatils = record => {
     let index = this.props.data.list.indexOf(record);
     if(index > -1){
         this.props.data.list[index].dqzt = '1';
     }
    const { wt_id: wtId, system_id: systemId, wtflId, dqzt, id, dbid, fkzt } = record;
    record.wtid = wtId;
    if (wtflId === '203203') { // 办案区
        this.props.dispatch(
            routerRedux.push({
                pathname: '/handlingArea/AreaPolice/UnareaDetail',
                query: { record: record, id:wtId, baqId:systemId },
            }),
        );
    } else if (wtflId === '203204') { // 涉案财物
        this.props.dispatch(
            routerRedux.push({
                pathname: '/articlesInvolved/ArticlesPolice/unitemDetail',
                query: { record: record,id: wtId, system_id:systemId },
            }),
        )
    } else if (wtflId === '203202') { //刑事案件告警
        this.props.dispatch(
            routerRedux.push({
                pathname: '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail',
                query: { record: record, id: wtId, system_id:systemId},
            }),
        );
    } else if (wtflId === '203205') { // 行政案件问题数据
        this.props.dispatch(
            routerRedux.push({
                pathname: '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail',
                query: { record: record, id: wtId , system_id:systemId},
            }),
        );
    } else if (wtflId === '203206') {//卷宗告警
        this.props.dispatch(
            routerRedux.push({
                pathname: '/dossierPolice/DossierPolice/UnDossierDetail',
                query: { record: record, id: id },
            }),
        );
    } else if (wtflId === '203201') {//警情告警
        this.props.dispatch(
            routerRedux.push({
                pathname: '/receivePolice/AlarmPolice/unpoliceDetail',
                query: { record: record,id:id, wtid:wtId },
            }),
        )
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const { data, loading } = this.props;
    let columns;
    columns = [
      {
        title: '',
        dataIndex: 'dqzt',
        render: (text, record) => {
          if (text === '0' && record.fkzt === '1') {
            return (
              <div>
                <span style={{ color: '#f40' }}>（未读）</span>
              </div>
            );
          }
        },
      },
      {
        title: '问题类型',
        dataIndex: 'wtlxMc',
      },
      {
        title: '案件名称',
        dataIndex: 'ajmc',
        width:'15%',
        render: (text, record) => {
          return text && text !== '' ? (
            <Ellipsis lines={2} tooltip>
              {text}
            </Ellipsis>
          ) : record.ajbh ? (
            '未生成案件名称'
          ) : (
            '未关联案件'
          );
        },
      },
      {
        title: '案件编号',
        dataIndex: 'ajbh',
        render: text => {
          return text || '未关联案件';
        },
      },
      {
        title: '督办状态',
        dataIndex: 'dbztMc',
      },
      {
        title: '督办时间',
        dataIndex: 'dbsj',
      },
      {
        title: '反馈状态',
        dataIndex: 'fkztMc',
      },
      {
        title: '要素类型',
        dataIndex: 'wtflMc',
      },
      {
        title: '反馈时间',
        dataIndex: 'fksj',
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            <a onClick={() => this.deatils(record)}>详情</a>
          </div>
        ),
      },
    ];
    const paginationProps = {
      current: this.state.data && this.state.data.page ? this.state.data.page.currentPage : '',
      total: this.state.data && this.state.data.page ? this.state.data.page.totalResult : '',
      pageSize: this.state.data && this.state.data.page ? this.state.data.page.showCount : '',
      showTotal: (total, range) => (
        <span className={stylescommon.pagination}>{`共 ${
          data && data.page ? data.page.totalPage : 1
        } 页，${data && data.page ? data.page.totalResult : 0} 条数据 `}</span>
      ),
    };
    return (
      <Card className={stylescommon.cardArea}>
        <Table
          loading={loading.loading}
          rowKey={record => record.key}
          dataSource={data && data.list ? data.list : []}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
        />
      </Card>
    );
  }
}

export default Form.create()(
  connect((MySuperviseData, loading, common) => ({ MySuperviseData, loading, common }))(
    RenderTable,
  ),
);
