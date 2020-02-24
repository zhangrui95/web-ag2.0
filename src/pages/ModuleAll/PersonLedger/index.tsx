/*
 * PersonLedger/index.tsx 办案区人员信息台账
 * author：jhm
 * 20191227
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

export default class PersonLedger extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {

    }

    render() {
        const {query:{id}}  = this.props.location
        console.log(`${window.configUrl.baqRaqUrl}showReport3.jsp?rpx=TZ-HLJ.rpx&personId=${id}`)
        return (
            <Card className={styles.boxTable}>
              <iframe
                title="台账"
                className={styles.box}
                src={`${window.configUrl.baqRaqUrl}showReport3.jsp?rpx=TZ-HLJ.rpx&personId=${id}`}
                width="1300px"
                height="1700px"
              />
            </Card>
        );
    }

}





