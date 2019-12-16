import React, { PureComponent } from 'react';
import {Modal, Form, Input, Select, message, button, Spin, Row, Col, Table, Tooltip, Empty} from 'antd';
import styles from './DetailModal.less';

const { TextArea } = Input;
const Option = Select.Option;
import { connect } from 'dva';
import { getUserInfos } from '../../utils/utils';
import noList from "@/assets/viewData/noList.png";

const FormItem = Form.Item;

@connect(({ Evaluation }) => ({
    Evaluation,
}))
class DetailModal extends PureComponent {
    constructor(props, context) {
        super(props);
        this.state = {
            key: 0,
            detail: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible || this.props.record !== nextProps.record) {
            if (nextProps.visible) {
                this.setState({
                    key: this.state.key + 1,
                });
                this.getDetail(nextProps.record);
            }
        }
    }

    componentDidMount() {

    }

    getDetail = (record) => {
        this.getDetailList(record, 1);
        this.props.dispatch({
            type: 'Evaluation/getAssessmentByAjbhAndKfx',
            payload: {
                ajbh: record ? record.ajbh : '',
                kfxm_mc: record ? record.kfxm_mc : '',
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        detail: data,
                    });
                }
            },
        });
    };
    getDetailList = (record, current) => {
        this.props.dispatch({
            type: 'Evaluation/getKpBzByAjbhAndKfxPgListPage',
            payload: {
                currentPage: current,
                pd: {
                    ajbh: record ? record.ajbh : '',
                    kfxm_mc: record ? record.kfxm_mc : '',
                },
                showCount: 5,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        detailList: data,
                    });
                }
            },
        });
    };
    handleTableChange = (pagination) => {
        this.getDetailList(this.props.record, pagination.current);
    };

    render() {
        let columns = [
            {
                title: '是否扣分',
                dataIndex: 'iskf',
                align: 'center',
            },
            {
                title: '分值',
                dataIndex: 'kfz',
                align: 'center',
            },
            {
                title: '说明',
                dataIndex: 'kpbz',
                align: 'center',
                render: (text) => {
                    return (
                        text && text.length <= 35 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 35) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
        ];
        const { detailList } = this.state;
        const paginationProps = {
            current: detailList && detailList.page ? detailList.page.currentPage : '',
            total: detailList && detailList.page ? detailList.page.totalResult : '',
            pageSize: detailList && detailList.page ? detailList.page.showCount : '',
        };
        return (
            <div>
                <Modal
                    title="考评详情"
                    visible={this.props.visible}
                    footer={null}
                    className={styles.shareHeader}
                    width={900}
                    maskClosable={false}
                    style={{ top: '200px' }}
                    onCancel={this.props.handleCancel}
                >
                    <Row className={styles.detailRow}>
                        <Col span={12}>扣分值：{this.state.detail ? this.state.detail.sum : ''}</Col>
                        <Col span={12}>扣分项目：{this.state.detail ? this.state.detail.kfxm_mc : ''}</Col>
                        <Col span={12}>被考评单位：{this.state.detail ? this.state.detail.bkpdw_mc : ''}</Col>
                        <Col
                            span={12}>被考评人：{this.state.detail && this.state.detail.bkpr_name1 ? this.state.detail.bkpr_name1 + '、' : ''}{this.state.detail && this.state.detail.bkpr_name2 ? this.state.detail.bkpr_name2 : ''}</Col>
                        <Col span={12}>案件名称：{this.state.detail ? this.state.detail.ajmc : ''}</Col>
                        <Col span={12}>案件编号：{this.state.detail ? this.state.detail.ajbh : ''}</Col>
                        <Col span={24}>扣分说明：{this.state.detail ? this.state.detail.kfsm : ''}</Col>
                        <Col
                            span={24}>整改结果：{this.state.detail && this.state.detail.zgjg ? this.state.detail.zgjg.replace(/\/r\/n/g, '') : ''}</Col>
                    </Row>
                    <div className={styles.yybz}>引用标准</div>
                    <Table size={'middle'} dataSource={this.state.detailList ? this.state.detailList.list : []} locale={{ emptyText: <Empty image={noList} description={'暂无数据'} /> }}
                           columns={columns} pagination={paginationProps} onChange={this.handleTableChange}/>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(DetailModal);
