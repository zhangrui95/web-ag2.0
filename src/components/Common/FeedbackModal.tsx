/*
* FeedbackModal.js 反馈模态框
* author：lyp
* 20190311
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Modal, Button, message, Icon, Row, Col, Form, Select, Upload, TreeSelect, Checkbox, Input} from 'antd';
import styles from '../../pages/common/modalStyle.less';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {getUserInfos} from '../../utils/utils';

const TreeNode = TreeSelect.TreeNode;
const {Option, OptGroup} = Select;
const FormItem = Form.Item;
const {TextArea} = Input;
const userInfo = getUserInfos();

@connect(({common}) => ({
    common,
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class FeedbackModal extends PureComponent {

    state = {
        SureModalVisible: false,
        fkr_dwmc: userInfo ? userInfo.group.name : '', // 反馈人单位名称(当前登录人)
        fkr_name: userInfo ? userInfo.name : '', // 反馈人名称(当前登录人)
        fileList: [],
    };

    componentDidMount() {
        this.getRectificationStatusDict();
    };

    // 关闭反馈模态框
    onCancelFeedbackModal = () => {
        this.props.closeModal(false);
    };
    // 关闭反馈确认模态框
    onCancelConfirmModal = () => {
        this.setState({
            SureModalVisible: false,
        });
    };

    // 获取处理结果(整改完毕状态)
    getRectificationStatusDict = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500740',
            },
        });
    };
    // 反馈
    handleFeedback = () => {
        this.props.form.validateFields((err) => {
            if (err) {
                message.warning(err.zrr ? err.zrr.errors[0].message : err.fkjg.errors[0].message);
            } else {
                this.setState({
                    SureModalVisible: true,
                });
            }
        });
    };
    // 反馈确认
    handleAlarmSure = () => {
        const values = this.props.form.getFieldsValue();
        const {fileList} = this.state;
        const {detailsData} = this.props;
        let wjxx = [];
        for (let i in fileList) {
            const obj = {
                wj_name: fileList[i].name,
                wj_url: fileList[i].url,
            };
            wjxx.push(obj);
        }
        let zrr_dwid = '';
        let zrr_dwmc = '';
        let zrr_name = '';
        let zrr_sfzh = '';
        let zgyj = '';
        if (detailsData.dbid === '') {
            const zrrValue = values.zrr;
            const zrr = [], zrdw = [], zrdwid = [], zrrsfzh = [];
            for (let i in zrrValue) {
                const info = zrrValue[i];
                const infoObj = info.split(',');
                zrr.push(infoObj[0]);
                zrdw.push(infoObj[2]);
                zrdwid.push(infoObj[3]);
                zrrsfzh.push(infoObj[1]);
            }
            zrr_dwid = zrdwid.join(',');
            zrr_dwmc = zrdw.join(',');
            zrr_name = zrr.join(',');
            zrr_sfzh = zrrsfzh.join(',');
        } else {
            if (detailsData.dbList && detailsData.dbList.length > 0) {
                const nowDbIndex = detailsData.dbList.length - 1; // 当前督办流程index
                zrr_name = detailsData.dbList[nowDbIndex].bdbrMC;
                zrr_dwmc = detailsData.dbList[nowDbIndex].bdbrDwmc;
                zrr_dwid = detailsData.dbList[nowDbIndex].bdbrDwmcid;
                zrr_sfzh = detailsData.dbList[nowDbIndex].bdbrMCid;
                zgyj = detailsData.dbList[nowDbIndex].zgyj;
            }
        }
        let params = {
            ajmc: detailsData.ajmc || '',
            ajbh: detailsData.ajbh,
            cljg_dm: values.cljg.key,
            cljg_mc: values.cljg.label,
            cljg_yy: values.fkjg,
            is_zjfk: '1',
            wjxx,
            wtid: detailsData.wtid,
            dbid: detailsData.dbid,
            zgyj,
            zrr_dwid,
            zrr_dwmc,
            zrr_name,
            zrr_sfzh,
        };
        this.setState({
            SureModalVisible: false,
        });
        this.props.saveModal(params);
    };
    // 反馈模态框底部按钮
    foot = () => {
        return (
            <div>
                <Button onClick={this.onCancelFeedbackModal}>取消</Button>
                <Button type="primary" onClick={this.handleFeedback}>完成</Button>
            </div>
        );
    };
    // 确认反馈模态框底部按钮
    confirmModalFoot = () => {
        return (
            <div>
                <Button onClick={this.onCancelConfirmModal}>取消</Button>
                <Button type="primary" onClick={this.handleAlarmSure}>确认反馈</Button>
            </div>
        );
    };

    beforeUploadFun = (file, fileList) => {

        if (this.state.fileList.length >= 10) {
            message.error('最多上传10个文件');
            return false;
        }
        const allowTypeArry = ['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'bmp'];
        const nameArry = file.name.split('.');
        const fileType = nameArry[nameArry.length - 1];
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            message.error('上传的文件大小不能超过50M');
        }
        const allowType = allowTypeArry.includes(fileType);
        if (!allowType) {
            message.error('支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .bmp');
        }
        return isLt50M && allowType;
    };

    handleChange = (info) => {
        let fileList = info.fileList;
        for (let i = 0; i < fileList.length; i++) {
            let file = fileList[i];
            const allowTypeArry = ['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'bmp'];
            const nameArry = file.name.split('.');
            const fileType = nameArry[nameArry.length - 1];
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                return false;
            }
            const allowType = allowTypeArry.includes(fileType);
            if (!allowType) {
                return false;
            }

        }
        fileList = fileList.map((file) => {
            if (file.response && file.response.data) {
                file.url = file.response.data.url;
            }
            return file;
        });
        // 3. Filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.error === null;
            }
            return true;
        });
        this.setState({fileList});
    };
    // 点击文件查看
    fileOnPreview = (file) => {
        window.open('http://'+file.response.fileUrl);
    };

    handleonChange = (value) => {
        let newValue = [];
        for (let a = 0; a < value.length; a++) {
            newValue.push(value[a].split(','));
        }
        this.setState({
            chooseValue: value,
            zrrValue: newValue,
        });
    };


    render() {
        const {SureModalVisible, fkr_dwmc, fkr_name} = this.state;
        const {detailsData, form: {getFieldDecorator}, common: {rectificationStatusDict}} = this.props;
        let rectificationStatusOptions = [];
        if (rectificationStatusDict.length > 0) {
            for (let i = 0; i < rectificationStatusDict.length; i++) {
                const item = rectificationStatusDict[i];
                rectificationStatusOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let zrrTreeNodeTypeOptions = [];
        if (detailsData && detailsData.zrdwList) {
            zrrTreeNodeTypeOptions = detailsData.zrdwList.map(item => (
                <OptGroup key={item.zrr_dwid} label={<Ellipsis lines={1} tooltip>{item.zrr_dwmc}</Ellipsis>}>
                    {
                        item.zrrList.map((zrrItem) => {
                                const newDatazrr = [zrrItem.zrr_name, zrrItem.zrr_sfzh, zrrItem.zrr_dwmc, zrrItem.zrr_dwid].join(',');
                                return (
                                    <Option value={newDatazrr} key={zrrItem.zrr_sfzh}>{zrrItem.zrr_name}</Option>
                                );
                            },
                        )}
                </OptGroup>
            ));
        }
        const uploadButton = (
            <Button>
                <Icon type="upload"/>上传文件
            </Button>
        );
        return (
            <div className={styles.ModalTitle}>
                <Modal
                    maskClosable={false}
                    visible={this.props.visible}
                    title={<div style={{color: '#fff'}}>反馈</div>}
                    onCancel={() => this.onCancelFeedbackModal()}
                    width={800}
                    footer={this.foot()}
                    className={styles.indexmodal}
                >
                    <div>
                        <Form>
                            <Row gutter={{md: 8, lg: 24, xl: 48}} style={{marginBottom: '16px'}}>
                                <Col md={12} sm={24}>
                                    <span className={styles.title1}>问题类型：</span>
                                    <span className={styles.outtext}>
                                        <span className={styles.wtlxstyle}>{detailsData.wtlx}</span>
                                    </span>
                                </Col>

                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}} style={{marginBottom: '16px'}}>
                                <Col md={12} sm={24}>
                                    <span className={styles.title1}>反馈单位：</span>
                                    <span className={styles.outtext}>
                                        <span className={styles.wtlxstyle}>{fkr_dwmc}</span>
                                    </span>
                                </Col>
                                <Col md={12} sm={24}>
                                    <span className={styles.title} style={{left: '24px', top: '3px'}}>责任人：</span>
                                    <span className={styles.outtext} style={{paddingLeft: '60px'}}>
                                        {
                                            detailsData.dbid === '' ? (
                                                getFieldDecorator('zrr', {
                                                    initialValue: [],
                                                    rules: [
                                                        {required: true, message: '请选择责任人'},
                                                    ],
                                                })(
                                                    <Select
                                                        showSearch
                                                        mode="multiple"
                                                        style={{width: '100%'}}
                                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                        placeholder="请选择责任人"
                                                        allowClear
                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    >
                                                        {zrrTreeNodeTypeOptions}
                                                    </Select>,
                                                )
                                            ) : (
                                                <span
                                                    className={styles.wtlxstyle}>{detailsData.dbList && detailsData.dbList.length > 0 ? detailsData.dbList[0].bdbrMC : ''}</span>
                                            )
                                        }
                                    </span>
                                </Col>
                            </Row>
                            <Row gutter={{md: 8, lg: 24, xl: 48}} style={{marginBottom: '16px'}}>
                                <Col md={12} sm={24}>
                                    <span className={styles.title1} style={{left: 36}}>反馈人：</span>
                                    <span className={styles.outtext}>
                                        <span className={styles.wtlxstyle}>{fkr_name}</span>
                                    </span>
                                </Col>
                                <Col md={12} sm={24}>
                                    <span className={styles.title} style={{left: '10px', top: '3px'}}>处理结果：</span>
                                    <span className={styles.outtext} style={{paddingLeft: '60px'}}>
                                        {getFieldDecorator('cljg', {
                                            initialValue: {key: '500741', label: '已处理'},
                                        })(
                                            <Select placeholder="请选择处理结果" labelInValue>
                                                {rectificationStatusOptions}
                                            </Select>,
                                        )}
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: '16px'}}>
                                <Col md={24} sm={24}>
                                    <span className={styles.title}>反馈结果：</span>
                                    <span className={styles.outtext}>
                                        {getFieldDecorator('fkjg', {
                                            initialValue: '',
                                            rules: [
                                                {required: true, message: '请填写反馈结果', whitespace: true},
                                                {max: 500, message: '最多输入500个字！'},
                                            ],
                                        })(
                                            <TextArea placeholder="如实填写反馈结果，挂起原因，延期原因" rows={3}/>,
                                        )}
                                        <span style={{color: '#1890FF'}}>*请在此处简要描述处理结果，挂起原因，延期原因</span>
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <span className={styles.title}>上传附件：</span>
                                    <span className={styles.outtext}>
                                        <Upload
                                            action={`${window.configUrl.weedUrl}/submit`}
                                            beforeUpload={this.beforeUploadFun}
                                            fileList={this.state.fileList}
                                            onChange={this.handleChange}
                                            onPreview={this.fileOnPreview}
                                            onDownload={this.fileOnPreview}
                                        >
                                            {this.state.fileList.length >= 10 ? '' : uploadButton}
                                        </Upload>
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{paddingTop: 20}}>
                                <Col>
                                    <span className={styles.outtext} style={{color: '#1890FF'}}>文件上传最多10个，支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .bmp</span>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>

                {
                    SureModalVisible ? (
                        <Modal
                            maskClosable={false}
                            visible={SureModalVisible}
                            title={<p>反馈</p>}
                            width='1000px'
                            centered={true}
                            footer={this.confirmModalFoot()}
                            onCancel={() => this.onCancelConfirmModal()}
                            className={styles.indexdeepmodal}
                        >
                            <div className={styles.question}>是否对该问题进行反馈？</div>
                        </Modal>
                    ) : null
                }
            </div>
        );
    }
}

