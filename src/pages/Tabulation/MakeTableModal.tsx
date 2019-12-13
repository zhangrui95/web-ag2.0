/*
* MakeTableModal 刑事案件制表
* author：lyp
* 20190530
* */
import React, { PureComponent } from 'react';
import { Modal, Select, Card } from 'antd';
import { connect } from 'dva';
import styles from './MakeTableModal.less';
import { getUserInfos } from '../../utils/utils';

const { Option } = Select;
@connect(({ common }) => ({
    common,
}))
export default class MakeTableModal extends PureComponent {
    state = {
        word: '1',
    };
    change = (e) => {
        this.setState({
            word: e,
        });
    };

    componentDidMount() {
        let res = this.props.location.query.record;
        if(typeof res == 'string'){
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.getDeptmentByCode(res&&res.bardw ? res.bardw : '');
    }

    // 警种
    getDeptmentByCode = (bardw) => {
        this.props.dispatch({
            type: 'common/getDeptmentByCode',
            payload: {
                code: bardw,
            },
        });
    };

    render() {
        const { word } = this.state;
        const { srcUrl } = window.configUrl;
        let res = this.props.location.query.record;
        if(typeof res == 'string'){
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        let ajbh = res&&res.ajbh ? res.ajbh : '';
        let police_categorymc = this.props.common.itemsCode && this.props.common.itemsCode.police_categorymc ? this.props.common.itemsCode.police_categorymc : '';
        return (
            <div>
                <Card className={styles.headerBox}>
                    <Select placeholder="请选择" style={{ width: '300px' }} onChange={this.change} value={word}
                            getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <Option value="1">集体通案记载表</Option>
                        <Option value="2">案件审核审批表</Option>
                    </Select>
                </Card>
                <Card className={styles.boxTable}>
                    {
                        word === '1' ? (
                            <iframe title="集体通案记载表" className={styles.box}
                                    src={`${srcUrl}jtTaJz.jsp?rpx=集体通案记载表.rpx&ajbh=${ajbh}&jzmc=${police_categorymc}`}
                                    width='1100px' height='1200px'/>
                        ) : (
                            <iframe title="案件审核审批表" className={styles.box}
                                    src={`${srcUrl}ajShSpJl.jsp?rpx=达拉特旗公安局案件审核审批记录.rpx&ajbh=${ajbh}&jzmc=${police_categorymc}`}
                                    width='1100px' height='1200px'/>
                        )
                    }
                </Card>
            </div>
        );
    }
}
