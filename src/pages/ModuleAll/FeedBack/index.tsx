/*
 * DailyRecord/index.tsx 反馈
 * author：jhm
 * 20191213
 * */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Modal, Button, message, Icon, Row, Col, Form, Select, Upload, TreeSelect, Checkbox, Input, Card} from 'antd';
import styles from '../../common/modalStyle.less';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {getUserInfos} from '../../../utils/utils';
import {routerRedux} from "dva/router";

const TreeNode = TreeSelect.TreeNode;
const {Option, OptGroup} = Select;
const FormItem = Form.Item;
const {TextArea} = Input;
const userInfo = getUserInfos();
const { confirm } = Modal;
@connect(({common, global}) => ({
    common, global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class FeedBack extends PureComponent {
    constructor(props){
      super(props);
      let res = props.location.query.record;
      if(res && typeof res === 'string'){
        res = JSON.parse(sessionStorage.getItem('query')).query.record;
      }
      this.state={
        SureModalVisible: false,
        fkr_dwmc: userInfo ? userInfo.group.name : '', // 反馈人单位名称(当前登录人)
        fkr_name: userInfo ? userInfo.name : '', // 反馈人名称(当前登录人)
        fileList: [],
        record:res,
      }
    }

    componentDidMount() {
        this.getRectificationStatusDict();
    };

    // 关闭反馈模态框
    // onCancelFeedbackModal = () => {
    //   this.props.closeModal(false);
    // };
    // 关闭反馈确认模态框
    onCancelConfirmModal = () => {
        // this.setState({
        //   SureModalVisible: false,
        // });
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
                let that = this;
                confirm({
                    title: '是否取消反馈?',
                    centered: true,
                    okText: '确认',
                    cancelText: '取消',
                    getContainer: document.getElementById('messageBox'),
                    onOk() {
                        that.handleAlarmSure();
                    },
                    onCancel() {
                        // console.log('Cancel');
                    },
                });
            }
        });
    };
    // 反馈确认
    handleAlarmSure = () => {
        const values = this.props.form.getFieldsValue();
        const {fileList,record} = this.state;
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
        if (record.dbid === '') {
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
            if (record.dbList && record.dbList.length > 0) {
                const nowDbIndex = record.dbList.length - 1; // 当前督办流程index
                zrr_name = record.dbList[nowDbIndex].bdbrMC;
                zrr_dwmc = record.dbList[nowDbIndex].bdbrDwmc;
                zrr_dwid = record.dbList[nowDbIndex].bdbrDwmcid;
                zrr_sfzh = record.dbList[nowDbIndex].bdbrMCid;
                zgyj = record.dbList[nowDbIndex].zgyj;
            }
        }
        let params = {
            ajmc: record.ajmc || '',
            ajbh: record.ajbh,
            cljg_dm: values.cljg.key,
            cljg_mc: values.cljg.label,
            cljg_yy: values.fkjg,
            is_zjfk: '1',
            wjxx,
            wtid: record.wtid,
            dbid: record.dbid,
            zgyj,
            zrr_dwid,
            zrr_dwmc,
            zrr_name,
            zrr_sfzh,
        };
        // this.setState({
        //   SureModalVisible: false,
        // });
        this.saveFeedbackModal(params);
        // this.props.saveModal(params);
    };
    saveFeedbackModal = (params) => {
        this.props.dispatch({
            type: 'MySuperviseData/saveFeedback',
            payload: params,
            callback: (data) => {
                this.setState({
                    feedbackButtonLoading: false,
                });
                if (data) {
                    message.success('反馈保存完成');
                    this.onEdit(true);
                    // this.getDetail(this.props.id, this.props.wtid);
                    // if (this.props.getPolice) {
                    //   this.props.getPolice({ currentPage: this.props.current, pd: this.props.formValues });
                    // }
                } else {
                    message.error('反馈保存失败');
                }
            },
        });
    }
    // 反馈模态框底部按钮
    // foot = () => {
    //   return (
    //     <div>
    //       <Button onClick={this.onCancelFeedbackModal}>取消</Button>
    //       <Button type="primary" onClick={this.handleFeedback}>完成</Button>
    //     </div>
    //   );
    // };
    // 确认反馈模态框底部按钮
    // confirmModalFoot = () => {
    //   return (
    //     <div>
    //       <Button className={styles.qxBtn} onClick={this.onCancelConfirmModal}>取消</Button>
    //       <Button type="primary" onClick={this.handleAlarmSure}>确认反馈</Button>
    //     </div>
    //   );
    // };

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
        window.open(configUrl.serverUrl + '/downFile?name=' + file.name + '&url=' + file.url);
    };

    onEdit = (isReset) => {
        const {query: {record, detail, tab, fromPath, id}} = this.props.location;
        // console.log('fromPath',fromPath);
        // console.log('isReset',isReset);
        let key = '/ModuleAll/FeedBack' + this.props.location.query.id;
        // 鍒犻櫎褰撳墠tab骞朵笖灏嗚矾鐢辫烦杞嚦鍓嶄竴涓猼ab鐨刾ath
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(routerRedux.push({pathname: fromPath ? fromPath : '',
                query: isReset ? {
                    isReset,
                    id: tab === '表格' ? '' : id,
                    record: tab === '表格' ? '' : record
                } : {id: tab === '表格' ? '' : id, record: tab === '表格' ? '' : record}
            }));
            dispatch({
                type: 'global/changeSessonNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
            dispatch({
                type: 'global/changeNavigation',
                payload: {
                    key,
                    isShow: false,
                },
            });
        }
    };

    render() {
        const {SureModalVisible, fkr_dwmc, fkr_name,record} = this.state;
        const {form: {getFieldDecorator}, common: {rectificationStatusDict}} = this.props;
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
        if (record && record.zrdwList) {
            zrrTreeNodeTypeOptions = record.zrdwList.map(item => (
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
            <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
                <Card className={styles.standardTable} id='FeedBackModule'>
                    <Form className={styles.standardForm}>
                        <Row gutter={{md: 8, lg: 24, xl: 48}} style={{marginBottom: '16px'}}>
                            <Col md={12} sm={24}>
                                <span className={styles.title1}>问题类型：</span>
                                <span className={styles.outtext}>
                      <span className={styles.wtlxstyle}>{record.wtlx}</span>
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
                          record.dbid === '' ? (
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
                                      // getPopupContainer={triggerNode => triggerNode.parentNode}
                                      getPopupContainer={() => document.getElementById('FeedBackModule')}
                                  >
                                      {zrrTreeNodeTypeOptions}
                                  </Select>,
                              )
                          ) : (
                              <span
                                  className={styles.wtlxstyle}>{record.dbList && record.dbList.length > 0 ? record.dbList[0].bdbrMC : ''}</span>
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
                          <Select placeholder="请选择处理结果" labelInValue
                                  getPopupContainer={() => document.getElementById('FeedBackModule')}>
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
                          action={`${configUrl.serverUrl}/uploadFile`}
                          beforeUpload={this.beforeUploadFun}
                          fileList={this.state.fileList}
                          onChange={this.handleChange}
                          onPreview={this.fileOnPreview}
                      >
                          {this.state.fileList.length >= 10 ? '' : uploadButton}
                      </Upload>
                  </span>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: 20}}>
                            <Col>
                                <span className={styles.outtext} style={{color: 'rgba(255, 255, 255)'}}>文件上传最多10个，支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .bmp</span>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card>
                    <div className={styles.btns}>
                        {/*<Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}*/}
                        {/*        onClick={() => this.onEdit(false)}>*/}
                        {/*    取消*/}
                        {/*</Button>*/}
                        <Button type="primary" style={{marginLeft: 8}} onClick={this.handleFeedback}
                                className={styles.okBtn}>
                            确定
                        </Button>
                    </div>
                </Card>
                {/*{*/}
                {/*SureModalVisible ? (*/}
                {/*<Modal*/}
                {/*maskClosable={false}*/}
                {/*visible={SureModalVisible}*/}
                {/*title={<p>反馈</p>}*/}
                {/*width='500px'*/}
                {/*centered={true}*/}
                {/*footer={this.confirmModalFoot()}*/}
                {/*onCancel={() => this.onCancelConfirmModal()}*/}
                {/*className={styles.indexdeepmodal}*/}
                {/*>*/}
                {/*<div className={styles.question}>是否对该问题进行反馈？</div>*/}
                {/*</Modal>*/}
                {/*) : null*/}
                {/*}*/}
            </div>
        );
    }
}



