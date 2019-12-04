/*
* DossierData.js 智慧案管大屏----卷宗数据统计
* author：lyp
* 20181222
* */

import React, { PureComponent } from 'react';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import title from 'echarts/lib/component/title';
import styles from './bigScreenDisplay.less';

export default class DossierData extends PureComponent {

    state = {
        storeHouseCount: '0',
        inHouseDossiers: '0',
        toDossierRate: '0',
        toPcDossierRate: '0',
    };

    componentDidMount() {
        const { selectDate, org, orgCode, orglist } = this.props;
        this.getDossierData(selectDate[0], selectDate[1], org, orgCode, orglist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org) || (this.props.orglist !== nextProps.orglist))) {
                this.getDossierData(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org, nextProps.orgCode, nextProps.orglist);
            }
        }
    }

    // 获取卷宗数据
    getDossierData = (startTime, endTime, org, orgCode, orglist) => {
        this.props.dispatch({
            type: 'show/getDossierData',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: org,
                orgcode: orgCode,
                orglist: orglist,
            },
            callback: (data) => {
                if (data && data.list) {
                    console.log('data-------------------', data);
                    let num = parseInt(data.list.kfsl) + parseInt(data.list.zkjzsl) + parseInt(data.list.cjl) + parseInt(data.list.dzzhl);
                    this.props.getAllNum(this.props.idx, num, '卷宗数据统计');
                    this.setState({
                        storeHouseCount: data.list.kfsl || '0',
                        inHouseDossiers: data.list.zkjzsl || '0',
                        toDossierRate: data.list.cjl || '0',
                        toPcDossierRate: data.list.dzzhl || '0',
                    });
                }
            },
        });
    };


    render() {
        const { storeHouseCount, inHouseDossiers, toDossierRate, toPcDossierRate } = this.state;
        return (
            <div id="" style={{ height: '100%', width: '100%' }}>
                <h4 className={styles.cardTitle}>卷宗数据统计</h4>
                <div className={styles.cardContent}>
                    <div className={styles.baqUse}>
                        <div>库房数</div>
                        <div>{storeHouseCount}</div>
                    </div>
                    <div className={styles.baqCase}>
                        <div>在库卷宗数</div>
                        <div>{inHouseDossiers}</div>
                    </div>
                    <div className={styles.baqPolice}>
                        <div>成卷率</div>
                        <div>{toDossierRate}</div>
                    </div>
                    <div className={styles.baqCriminal}>
                        <div>电子化率</div>
                        <div>{toPcDossierRate}</div>
                    </div>
                </div>
            </div>
        );
    }
}
