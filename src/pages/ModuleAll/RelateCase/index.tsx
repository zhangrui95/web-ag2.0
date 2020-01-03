/*
 * RelateCase/index.tsx 卷宗关联案件
 * author：jhm
 * 20191225
 * */

import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, message, Table} from 'antd';
import styles from './index.less';
// import AreaDetail from '../../routes/AreaRealData/areaDetail';
// import CaseDetail from '../CaseRealData/caseDetail';
// import XzCaseDetail from '../XzCaseRealData/caseDetail';
import liststyles from '../../common/listDetail.less';
import {routerRedux} from "dva/router";
import {authorityIsTrue} from "@/utils/authority";
import {userResourceCodeDb} from "@/utils/utils";
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

@connect(({CaseData, loading, common}) => ({
    common,
    CaseData,
    loading: loading.models.CaseData,
}))

export default class IntoArea extends PureComponent {
    constructor(props) {
        super(props);
        let res = props.location.query.record;
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            casecurrent: 1,
            record: res,
        };
    }

    componentWillMount() {

    }

    jqDetail = record => {
      if (record.ajlx === '22001') {
        // 刑事案件
        this.props.dispatch(
          routerRedux.push({
            pathname: '/newcaseFiling/caseData/CriminalData/caseDetail',
            query: { record: record, id: record.system_id },
          }),
        );
        // const divs = (
        //     <div>
        //         <Detail
        //             {...this.props}
        //             id={record.system_id}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '刑事案件详情', content: divs, key: record.system_id };
        // this.props.newDetail(AddNewDetail);
      } else if (record.ajlx === '22002') {
        // 行政案件
        this.props.dispatch(
          routerRedux.push({
            pathname: '/newcaseFiling/caseData/AdministrationData/caseDetail',
            query: { id: record.system_id, record: record },
          }),
        );
        // const divs = (
        //     <div>
        //         <XZDetail
        //             {...this.props}
        //             systemId={record.system_id}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '行政案件详情', content: divs, key: record.system_id };
        // this.props.newDetail(AddNewDetail);
      }
    };

    render() {
        const {record} = this.state;
        const AreaColumns = [
          {
            title: '案件名称',
            dataIndex: 'jzmc',
            render: text => {
              return text ? (
                <Ellipsis length={16} tooltip>
                  {text}
                </Ellipsis>
              ) : (
                ''
              );
            },
          },
          {
            title: '案件类别',
            dataIndex: 'jzlb_mc',
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
            title: '操作',
            width: 50,
            render: record => (
              <div>
                <a onClick={() => this.IntoCase(record)}>详情</a>
              </div>
            ),
          },
        ];
        return (
            <div>
              <Table
                pagination={{
                  pageSize: 3,
                  showTotal: (total, range) => (
                    <div style={{color: '#b7b7b7'}}>
                      共 {total} 条记录 第 {this.state.casecurrent} / {Math.ceil(total / 3)} 页
                    </div>
                  ),
                  onChange: page => {
                    this.setState({ casecurrent: page });
                  },
                }}
                dataSource={record ? record.jzList : []}
                columns={AreaColumns}
              />
            </div>
        );
    }

}





