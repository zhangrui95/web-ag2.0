/*
* DossierMarkingModal.js 卷宗阅卷功能
* author：jhm
* 20180115
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Modal,
    Table,
    Divider,
    Button,
    Popconfirm,
    message,
    Icon,
    Tag,
    Tooltip,
    Row,
    Col,
    Form,
    Select,
    Upload,
    Carousel,
    TreeSelect,
    Spin,
} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './DossierMarkingModal.less';
import nocollect from '../../../public/images/nocollect.png';
import PreviewTable from './PreviewTable';
import AnnotationArea from './AnnotationArea';
import {getUserInfos} from '../../utils/utils';

const FormItem = Form.Item;

export default class DossierMarkingModal extends PureComponent {
    state = {
        CatalogList: '',
        record: '',
        pageId: '',
        changeId: '',//电子页切换时的目录id
        electronicVolumeData: '',
    };

    componentDidMount() {
        // 获取目录
        this.getCatalogList();
        // 获取电子卷列表
        this.getElectronicVolumeList();
    };

    // componentWillReceiveProps(nextProps) {
    //   if(nextProps) {
    //     console.log('nextprops', nextProps);
    //     // this.setState({
    //     //   // DossierDetailData:
    //     // })
    //   }
    // }

    onCancel = () => {
        this.props.closeModal(false);
    };
    // 获取目录的点击行数据
    getCatalogClickData = (record) => {
        this.setState({
            record: record,
        });
    };
    // 获取点击目录时，应该展示的电子页id
    getPageId = (id) => {
        this.setState({
            pageId: id,
        });
    };
    // 获取目录列表
    getCatalogList = () => {
        // let { dossier_id, electronic_apply_id } = this.state;
        const user = getUserInfos('user', true) ? getUserInfos('user', true) : '';
        // console.log('user',user);
        this.props.dispatch({
            type: 'DossierData/fetchSynchronizationList',
            payload: {
                dossier_id: this.props.DossierDetailData.dossier_id,
                operator: {
                    police_idcard: user ? user.idCard : '',
                    police_name: user ? user.name : '',
                    police_number: user ? user.pcard : '',
                    // police_phone: user ? user.contact : '',
                    police_unit_code: user ? user.group.code : '',
                    police_unit_name: user ? user.group.name : '',
                },
                electronic_apply_id: '',
            },
            callback: (data) => {
                if (data) {
                    console.log('data---', data);
                    this.setState({
                        CatalogList: data.list,
                    });
                }
            },
        });
    };
    //
    // 获取电子卷
    getElectronicVolumeList = () => {
        let record = this.state.record;
        let {dossier_id, electronic_apply_id} = this.state;
        this.props.dispatch({
            type: 'DossierData/fetchElectronicPageList',
            payload: {
                dossier_id: this.props.DossierDetailData.dossier_id,
                // relation_type: 1,
                // type: '2',
                electronic_page_annotationp_type: 0,
            },
            callback: (data) => {
                if (data) {
                    console.log('data***', data);
                    this.setState({
                        electronicVolumeData: data.list,
                    });
                }
            },
        });
    };
    // 获取电子卷切换的时候的目录id
    getElectronicVolumeChangeId = (id) => {
        this.setState({
            changeId: id,
        });
    };

    render() {
        const {CatalogList, electronicVolumeData} = this.state;
        const {dossier_id} = this.props.DossierDetailData;
        // console.log('CatalogList',CatalogList);
        let index = 0;
        if (electronicVolumeData && electronicVolumeData.length > 0) {
            for (let i = 0; i < electronicVolumeData.length; i++) {
                if (electronicVolumeData[i].electronic_page_id === this.state.pageId) {
                    index = i;
                    break;
                }
            }
        }
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={this.props.visible}
                    title={this.props.DossierDetailData.jzmc}
                    onCancel={() => this.onCancel()}
                    width={1400}
                    footer={null}
                    className={styles.markModal}
                >
                    <Row gutter={24}>
                        <Col md={5} sm={24} lg={5} xl={5} span={24}>
                            <PreviewTable
                                {...this.props}
                                data={CatalogList}
                                getCatalogClickData={this.getCatalogClickData}
                                electronicVolumeData={electronicVolumeData}
                                getPageId={this.getPageId}
                                record={this.state.record}
                                changeId={this.state.changeId}
                                index={index}
                                // CataloguesListByYWXZ={CataloguesListByYWXZ}
                            />
                        </Col>
                        <Col md={19} sm={24} lg={19} xl={19} span={24}>
                            <AnnotationArea
                                {...this.props}
                                record={this.state.record}
                                electronicVolumeData={electronicVolumeData}
                                pageId={this.state.pageId}
                                index={index}
                                getElectronicVolumeChangeId={this.getElectronicVolumeChangeId}
                                // isChecked={this.isChecked}
                                // checked={this.state.checked}
                                dossier_id={dossier_id}
                                getElectronicVolumeList={this.getElectronicVolumeList}
                                getPageId={this.getPageId}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
