/*
 * IntoArea/index.tsx 案件查看关联卷宗
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
        // console.log('res',typeof res)
        if (typeof res == 'string'||typeof res == 'object') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            jqcurrent: 1,
            record: res,
        };
    }

    componentWillMount() {

    }

    IntoDossierDetail = record => {
        this.props.dispatch(
            routerRedux.push({
                pathname: '/dossierPolice/DossierData/DossierDetail',
                query: {record: record, id: record && record.dossier_id ? record.dossier_id : '1'},
            }),
        );
        // const divs = (
        //     <div>
        //         <DossierDetail
        //             {...this.props}
        //             id={id}
        //         />
        //     </div>
        // );
        // const AddJqDetail = { title: '卷宗详情', content: divs, key: id };
        // this.props.newDetail(AddJqDetail);
    };

    render() {
        const {record} = this.state;
        const DossierColumns = [
            {
                title: '卷宗名称',
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
                title: '卷宗类别',
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
                title: '储存状态',
                dataIndex: 'cczt_mc',
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
                title: '卷宗页数',
                dataIndex: 'jzys',
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
                title: '电子化',
                dataIndex: 'is_gldzj',
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
                        <a onClick={() => this.IntoDossierDetail(record)}>详情</a>
                    </div>
                ),
            },
        ];
        return (
            <div style={{padding:'12px 0'}}>
                <Table
                    style={{ borderRadius: 10 }}
                    pagination={{
                        pageSize: 3,
                        showTotal: (total, range) => <div
                            style={{color: '#999'}}>共 {(Math.ceil(total / 3))} 页， {total} 条记录</div>,
                        onChange: (page) => {
                            this.setState({dossiercurrent: page});
                        },
                    }}
                    dataSource={record ? record : []}
                    columns={DossierColumns}
                />
            </div>
        );
    }

}





