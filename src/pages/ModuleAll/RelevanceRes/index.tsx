/*
 * IntoArea/index.tsx 案件查看关联物品
 * author：jhm
 * 20191211
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
        if (typeof res == 'string'||typeof res === 'object') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            jqcurrent: 1,
            record: res,
        };
    }

    componentWillMount() {

    }

    openItemsDetail = record => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/articlesInvolved/ArticlesData/itemDetail',
                query: {record: record, id: record && record.system_id ? record.system_id : '1'},
            }),
        )
        // const divs = (
        //     <div>
        //         <ItemDetail
        //             {...this.props}
        //             id={systemId}
        //         />
        //     </div>
        // );
        // const AddNewDetail = { title: '涉案物品详情', content: divs, key: systemId };
        // this.props.newDetail(AddNewDetail);
    };

    render() {
        const {record} = this.state;
        // console.log('record',record);
        const WpColumns = [
            {
                title: '物品名称',
                dataIndex: 'wpmc',
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
                title: '物品种类',
                dataIndex: 'wpzlMc',
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
                title: '操作',
                width: 50,
                render: record => (
                    <div>
                        <a onClick={() => this.openItemsDetail(record)}>查看</a>
                    </div>
                ),
            },
        ];
        return (
            <div style={{padding:'12px 0'}}>
                <Table
                    style={{ borderRadius: 0, padding: 24 }}
                    pagination={{
                        pageSize: 3,
                        showTotal: (total, range) => <div style={{color: '#b7b7b7'}}>共 {(Math.ceil(total / 3))} 页， {total} 条记录</div>,
                        onChange: (page) => {
                            this.setState({jqcurrent: page});
                        },
                    }}
                    dataSource={record ? record : []}
                    columns={WpColumns}
                />
            </div>
        );
    }

}





