/*
* Show/ImportFileModal.tsx 在线学习导入文件模态框
* author：jhm
* 20200221
* */

import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button, Card, Button, Row, Col, Icon, Upload} from 'antd';
import styles from './ImportFIleModal.less';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
import {connect} from 'dva';
import {getUserInfos} from '../../utils/utils';
import moment from "moment";

const FormItem = Form.Item;

@connect(({share}) => ({
  share,
}))
class ImportFileModal extends PureComponent {
  constructor(props, context) {
    super(props);
    // console.log('props',props)
    // const {query: {from,wtflId, wtflMc,tab, fromPath, id },} = props.location;
    let record = props.record;
    // if(record && typeof record === 'string'||typeof record === 'object'){
    //   record = JSON.parse(sessionStorage.getItem('query')).query.record;
    // }
    this.state = {
      record,
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  onCancel2 = () => {
    // this.props.closeModal(false);
    this.setState({
      SureModalVisible: false,
    });
  };

  closeConfirm=()=>{
    this.setState({
      SureModalVisible:false,
    })
  }

  // 保存上传的文件
  getinfoview = (obj) => {
    console.log('obj',obj);
    const zlxx = obj&&obj.scwj&&obj.scwj.fileList?obj.scwj.fileList:'';
    let ChiType= '';
    let Objwjxx=[], wjdxSize='';
    for(let a = 0; a < zlxx.length; a++ ){
      const zlxxName = zlxx[a].response.fileName;
      if(zlxxName.split('.')[1] === 'mp4'){
        ChiType = '视频'
      }
      else if(zlxxName.split('.')[1] === 'mp3'){
        ChiType = '音频'
      }
      else if(zlxxName.split('.')[1] === 'doc'||zlxxName.split('.')[1] === 'docx'||zlxxName.split('.')[1] === 'pdf'){
        ChiType = '文档'
      }
      if(zlxx[a].size/1024/1024>1){
        wjdxSize=(zlxx[a].size/1024/1024).toFixed(2)+'M'
      }
      else {
        wjdxSize=(zlxx[a].size/1024).toFixed(2)+'KB'
      }
      let wj = {
        zlmc:zlxxName,
        scsj:moment().format('YYYY-MM-DD'),
        lx:ChiType,
        wjdx:wjdxSize,
        xzlj:zlxx[a].response.fileUrl,
      }
      Objwjxx.push(wj);
    }
    // console.log('Objwjxx',Objwjxx);
    const param = {
      fbdw:obj.fbdw,
      wjxx:Objwjxx,
    }
    this.FormatConvert(param,obj);

  }

  FormatConvert = (param,obj) => {
    this.props.dispatch({
      type:'Learning/getFormatConvert',
      payload:param?param:'',
      callback:(data)=>{
        console.log('data',data);
        this.getInsert();
      }
    })

  }

  getInsert = (param) => {
    this.props.dispatch({
      type:'Learning/getInsertList',
      payload:param?param:'',
      callback:(data)=>{
        // console.log('data---',data);
        if(data.error===null&&this.props.handleFormReset){
          this.props.handleFormReset()
          this.props.handleCancel()
          this.setState({
            dbLoading: false,
            SureModalVisible:false,
            success:true,
          })
        }
      }
    })
  }

  handleAlarm = () => {
    const values = this.props.form.getFieldsValue();
    if(values.scwj&&values.fbdw){
      this.setState({
        SureModalVisible:true,
      })
      // this.getinfoview(values);
    }
    else{
      message.warning('请选择发布单位或者上传文件')
    }


      // if (
      //   from === '警情详情问题判定' ||
      //   from === '刑事案件详情问题判定' ||
      //   from === '行政案件详情问题判定' ||
      //   from === '办案区详情问题判定' ||
      //   from === '涉案物品详情问题判定' ||
      //   from === '卷宗详情问题判定'
      // ) {
      //   if (
      //     fieldsValue.wtlx === '' ||
      //     fieldsValue.wtlx === undefined ||
      //     fieldsValue.wtlx === null
      //   ) {
      //     message.warning('请选择问题类型');
      //   } else if (
      //     (fieldsValue && fieldsValue.zgyj === '') ||
      //     fieldsValue.zgyj === undefined ||
      //     fieldsValue.zgyj === null
      //   ) {
      //     message.warning('请填写整改意见');
      //   } else if (fieldsValue.zgyj.length > 500) {
      //     message.warning('整改意见不可超过500字');
      //   } else if (
      //     this.state.gqType &&
      //     ((fieldsValue && fieldsValue.gqyy === '') ||
      //       fieldsValue.gqyy === undefined ||
      //       fieldsValue.gqyy === null)
      //   ) {
      //     message.warning('请填写挂起原因');
      //   } else if (fieldsValue.gqyy && fieldsValue.gqyy.length > 500) {
      //     message.warning('挂起原因不可超过500字');
      //   } else if (zrrValue && zrrValue.length === 0) {
      //     message.warning('请选择责任人');
      //   } else {
      //     this.setState({
      //       SureModalVisible: true,
      //     });
      //   }
      // }
      // else {
      //   if (
      //     (fieldsValue && fieldsValue.zgyj === '') ||
      //     fieldsValue.zgyj === undefined ||
      //     fieldsValue.zgyj === null
      //   ) {
      //     message.warning('请填写整改意见');
      //   } else if (fieldsValue.zgyj.length > 500) {
      //     message.warning('整改意见不可超过500字');
      //   } else if (
      //     this.state.gqType &&
      //     ((fieldsValue && fieldsValue.gqyy === '') ||
      //       fieldsValue.gqyy === undefined ||
      //       fieldsValue.gqyy === null)
      //   ) {
      //     message.warning('请填写挂起原因');
      //   } else if (fieldsValue.gqyy && fieldsValue.gqyy.length > 500) {
      //     message.warning('挂起原因不可超过500字');
      //   } else if (zrrValue && zrrValue.length === 0) {
      //     message.warning('请选择责任人');
      //   } else {
      //     this.setState({
      //       SureModalVisible: true,
      //     });
      //   }
      // }
  };
  handleCancel = () => {
    this.setState({
      success: false,
    });
  };
  handleAlarmSure = () => {
    const values = this.props.form.getFieldsValue();
    this.setState({
      dbLoading: true,
    });
    this.getinfoview(values);
  };


  beforeUploadFun = (file, fileList) => {
    // if (this.state.fileList.length >= 10) {
    //   message.error('最多上传10个文件');
    //   return false;
    // }
    const allowTypeArry = [ 'doc', 'docx', 'mp4', 'mp3', 'pdf'];
    const nameArry = file.name.split('.');
    const fileType = nameArry[nameArry.length - 1];
    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      message.error('上传的文件大小不能超过50M');
    }
    const allowType = allowTypeArry.includes(fileType);
    if (!allowType) {
      message.error('支持扩展名：.doc .docx .mp4 .mp3 .pdf');
    }
    return isLt50M && allowType;
  };

  handleChange = info => {
    let fileList = info.fileList;
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      const allowTypeArry = [ 'doc', 'docx', 'mp4', 'mp3', 'pdf'];
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
    fileList = fileList.map(file => {
      if (file.response && file.response.data) {
        file.url = file.response.data.url;
      }
      return file;
    });
    // 3. Filter successfully uploaded files according to response from server
    // fileList = fileList.filter(file => {
    //   if (file.response) {
    //     return file.response.error === null;
    //   }
    //   return true;
    // });
    this.setState({ fileList });
  };
  // 点击文件查看
  fileOnPreview = file => {
    // console.log('file',file);
    // this.props.dispatch({
    //     type: 'common/downFile',
    //     payload: {
    //         name: file.name,
    //         url: file.url,
    //     },
    // })
    window.open('http://'+file.response.fileUrl);
  };

  render() {
    const { SureModalVisible,record, from } = this.state;
    const { getFieldDecorator } = this.props.form;
    // console.log('record',record);
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    const uploadButton = (
      <Button>
        <Icon type="upload" icon={'upload'} />
        上传文件
      </Button>
    );
    let zllxAlarmDictOptions = [], fblxAlarmDictOptions = [];
    if (record.length > 0) {
      for (let i = 0; i < record.length; i++) {
        const item = record[i];
        fblxAlarmDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    return (
      <Modal
        visible={this.props.visible}
        title="资料导入"
        // onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        className={styles.shareHeader}
        // confirmLoading={this.state.btnLoading}
        width={900}
        maskClosable={false}
        style={{top: '250px'}}
        footer={null}
      >
        <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
            <Form className={styles.standardForm}>
              <Row  style={{ marginBottom: '16px' }}>
                {/*<Col {...colLayout}>*/}
                  {/*<FormItem label="发布单位" {...formItemLayout}>*/}
                    {/*{getFieldDecorator('fbdw', {*/}
                      {/*// initialValue: this.state.caseType,*/}
                      {/*// rules: [{required:true, message: '请选择发布单位'}],*/}
                    {/*})(*/}
                      {/*<Select*/}
                        {/*placeholder="请选择发布单位"*/}
                        {/*style={{width: '100%'}}*/}
                        {/*// getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}*/}
                      {/*>*/}
                        {/*<Option value="">全部</Option>*/}
                        {/*{fblxAlarmDictOptions}*/}
                      {/*</Select>,*/}
                    {/*)}*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
                <span>发布单位</span>
                <span>
                  <Col md={24} sm={24}>
                    <Select
                      placeholder="请选择发布单位"
                      style={{width: '100%'}}
                      // getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                    >
                      <Option value="">全部</Option>
                      {fblxAlarmDictOptions}
                    </Select>,
                  </Col>
                </span>
              </Row>
              <Row>
                <Col {...colLayout}>
                  {/*<FormItem label="上传文件" {...formItemLayout}>*/}
                    {/*{getFieldDecorator('scwj', {*/}
                      {/*// initialValue: this.state.caseType,*/}
                      {/*// rules: [{required:true, message: '请上传文件'}],*/}
                    {/*})(*/}
                      {/*<Upload*/}
                        {/*// action={`${window.configUrl.weedUrl}/submit`}*/}
                        {/*action='http://192.168.3.92:9222/submit'*/}
                        {/*beforeUpload={this.beforeUploadFun}*/}
                        {/*// fileList={this.state.fileList}*/}
                        {/*// multiple={true}*/}
                        {/*onChange={this.handleChange}*/}
                        {/*onPreview={this.fileOnPreview}*/}
                        {/*onDownload={this.fileOnPreview}*/}
                        {/*style={{diaplay:'inlineBlock'}}*/}
                      {/*>*/}
                        {/*{uploadButton}*/}
                      {/*</Upload>*/}
                    {/*)}*/}
                  {/*</FormItem>*/}
                  <span className={styles.title}>上传附件：</span>
                  <span className={styles.outtext}>
                  <Upload
                    // action={`${window.configUrl.weedUrl}/submit`}
                    action='http://192.168.3.92:9222/submit'
                    beforeUpload={this.beforeUploadFun}
                    // fileList={this.state.fileList}
                    // multiple={true}
                    onChange={this.handleChange}
                    onPreview={this.fileOnPreview}
                    onDownload={this.fileOnPreview}
                    style={{diaplay:'inlineBlock'}}
                  >
                  {uploadButton}
                  </Upload>
                  </span>
                </Col>
              </Row>
            </Form>
            <div className={styles.btns}>
              {/*<Button type="primary" style={{marginLeft: 8}} className={styles.qxBtn}*/}
              {/*        onClick={() => this.onEdit(false)}>*/}
              {/*    取消*/}
              {/*</Button>*/}
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={this.handleAlarm}
                className={styles.okBtn}
                // loading={this.state.dbLoading}
              >
                确定
              </Button>
            </div>
          <Modal visible={SureModalVisible} centered={true} footer={null} header={null} closable={false} width={400}>
            <div className={styles.modalBox}>
              <div className={styles.question} style={this.props.global && this.props.global.dark ? {color:'#fff'} : {}}><Icon type="question-circle" style={{color:'#faad14',fontSize: '22px',marginRight: '16px'}}/>确认上传文件?</div>
              <div style={{marginTop:40,float:"right"}}><Button onClick={this.closeConfirm}>取消</Button><Button type="primary" style={{marginLeft:'16px'}} onClick={this.handleAlarmSure} loading={this.state.dbLoading}>确认</Button></div>
            </div>
          </Modal>
          <Modal
            title=""
            visible={this.state.success}
            className={this.props.global && this.props.global.dark ? styles.success : styles.successLight}
            width={350}
            style={{top: '250px'}}
            maskClosable={false}
            cancelText={null}
            // onCancel={this.handleCancel}
            footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
          >
            上传成功！
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(ImportFileModal);
