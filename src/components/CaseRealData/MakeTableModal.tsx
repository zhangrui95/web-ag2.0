/*
 * MakeTableModal 刑事案件制表
 * author：lyp
 * 20190530
 * */
import React, {PureComponent} from 'react';
import {Modal, Select} from 'antd';
import {connect} from 'dva';
import styles from './MakeTableModal.less';
import {getUserInfos} from '../../utils/utils';

const {Option} = Select;
@connect(({common}) => ({
    common,
}))
export default class MakeTableModal extends PureComponent {
    state = {
        word: '1',
    };
    change = e => {
        this.setState({
            word: e,
        });
    };

    componentDidMount() {
        this.getDeptmentByCode();
    }

    // 警种
    getDeptmentByCode = () => {
        this.props.dispatch({
            type: 'common/getDeptmentByCode',
            payload: {
                code: this.props.caseRecord.bardw,
            },
        });
    };

    render() {
        const {word} = this.state;
        const {srcUrl} = window.configUrl;
        const {
            caseRecord: {ajbh},
        } = this.props;
        let police_categorymc =
            this.props.common.itemsCode && this.props.common.itemsCode.police_categorymc
                ? this.props.common.itemsCode.police_categorymc
                : '';
        return (
            <div>
                <Modal
                    title="表格选择"
                    visible={this.props.makeTableModalVisible}
                    onCancel={this.props.MakeTableCancel}
                    className={styles.shareHeader}
                    width={1350}
                    maskClosable={false}
                    footer={null}
                >
                    <div style={{width: 300, paddingBottom: 20}}>
                        <Select
                            placeholder="请选择"
                            style={{width: '100%'}}
                            onChange={this.change}
                            value={word}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            <Option value="1">集体通案记载表</Option>
                            <Option value="2">案件审核审批表</Option>
                        </Select>
                    </div>
                    {word === '1' ? (
                        <iframe
                            title="集体通案记载表"
                            className={styles.box}
                            src={`${srcUrl}jtTaJz.jsp?rpx=集体通案记载表.rpx&ajbh=${ajbh}&jzmc=${police_categorymc}`}
                            width="1300px"
                            height="1200px"
                        />
                    ) : (
                        <iframe
                            title="案件审核审批表"
                            className={styles.box}
                            src={`${srcUrl}ajShSpJl.jsp?rpx=达拉特旗公安局案件审核审批记录.rpx&ajbh=${ajbh}&jzmc=${police_categorymc}`}
                            width="1300px"
                            height="1200px"
                        />
                    )}
                </Modal>
            </div>
        );
    }
}
