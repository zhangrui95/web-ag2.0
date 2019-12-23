/*
 * IntoArea/index.tsx 案件查看关联的涉案人员
 * author：jhm
 * 20191211
 * */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, message, Table } from 'antd';
import styles from './index.less';
// import AreaDetail from '../../routes/AreaRealData/areaDetail';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
import liststyles from '../../common/listDetail.less';
import {routerRedux} from "dva/router";
import {authorityIsTrue} from "@/utils/authority";
import {userResourceCodeDb} from "@/utils/utils";
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

@connect(({ CaseData, loading, common }) => ({
  common,
  CaseData,
  loading: loading.models.CaseData,
}))

export default class IntoArea extends PureComponent {
  constructor(props) {
    super(props);
    let res = props.location.query.record;
    if(typeof res == 'string'){
      res = JSON.parse(sessionStorage.getItem('query')).query.record;
    }
    this.state = {
      jqcurrent: 1,
      record:res,
    };
  }
  componentWillMount() {

  }

  // 点击案件轨迹人员的在区情况
  IntoArea = (record) => {
    if (record) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/ModuleAll/IntoArea',
          query: { record: record,id: record && record.id ? record.id : '1',movefrom:'警情常规' },
        }),
      )
      // const divs = (
      //     <div>
      //         <PersonIntoArea
      //             {...this.props}
      //             sfzh={sfzh}
      //             ajbh={ajbh}
      //         />
      //     </div>
      // );
      // const AddNewDetail = { title: '涉案人员在区情况', content: divs, key: sfzh + 'ryzq' };
      // this.props.newDetail(AddNewDetail);
    } else {
      message.warning('暂无涉案人员在区情况');
    }
  };

  render() {
    const {record} = this.state;
    const AreaColumns = [
      {
        title: '姓名',
        dataIndex: 'xyrName',
        render: text => {
          return text ? (
            <Ellipsis length={10} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: text => {
          return text ? (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          ) : (
            ''
          );
        },
      },
      {
        title: '证件号',
        dataIndex: 'sfzh',
        render: text => {
          if (text) {
            let str = '';
            const strArry = text.split(',');
            if (strArry.length > 0) {
              str = strArry[strArry.length - 1];
              return (
                <Ellipsis length={20} tooltip>
                  {str}
                </Ellipsis>
              );
            }
            return str;
          }
          return '';
          // return(
          //   text.split(',')[record.split(',').length-1] && record.split(',')[record.split(',').length-1].length <= 20 ? record.split(',')[record.split(',').length-1] :
          //     <Tooltip title={record.split(',')[record.split(',').length-1]}>
          //       <span>{record.split(',')[record.split(',').length-1] && record.split(',')[record.split(',').length-1].substring(0, 20) + '...'}</span>
          //     </Tooltip>
          // )
        },
      },
      {
        title: '操作',
        width: 50,
        render: record => (
          <div>
            <a onClick={() => this.IntoArea(record)}>详情</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <Table
          size={'middle'}
          style={{ backgroundColor: '#fff' }}
          pagination={{
            pageSize: 3,
            showTotal: (total, range) => <div
              style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
              第 {this.state.areacurrent} / {(Math.ceil(total / 3))} 页</div>,
            onChange: (page) => {
              this.setState({ areacurrent: page });
            },
          }}
          dataSource={record ? record : []}
          columns={AreaColumns}
        />
      </div>
    );
  }

}





