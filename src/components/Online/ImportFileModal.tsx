/*
* Show/ImportFileModal.tsx 在线学习导入文件模态框
* author：jhm
* 20200221
* */

import React, {PureComponent} from 'react';
import {Modal, Form, Input, Select, message, button, Card, Button, Row, Col, Icon, Upload} from 'antd';
import styles from './ImportFileModal.less';

const {TextArea} = Input;
const {Option, OptGroup} = Select;
import {connect} from 'dva';
import {getUserInfos} from '../../utils/utils';
import moment from "moment";
import fileImgwhite from '@/assets/common/fileWhite.png';
import fileImgBlack from '@/assets/common/fileBlack.png';
import importImg from '@/assets/common/import.png';

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
      fileList:[],
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
    // console.log('obj',obj);
    const zlxx = this.state.fileList;
    let ChiType= '';
    let beforeObjwjxx=[],afterObjwjxx=[], wjdxSize='';
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
      let beforewj = {
        filename:zlxxName,
        scsj:moment().format('YYYY-MM-DD'),
        lx:ChiType,
        wjdx:wjdxSize,
        filepath:zlxx[a].response.fileUrl,
      }
      let afterwj = {
        zlmc:zlxxName,
        scsj:moment().format('YYYY-MM-DD'),
        lx:ChiType,
        wjdx:wjdxSize,
        xzlj:zlxx[a].response.fileUrl,
      }
      beforeObjwjxx.push(beforewj)
      afterObjwjxx.push(afterwj);
    }
    // console.log('Objwjxx',Objwjxx);
    const beforeparam = {
      // fbdw:obj.fbdw,
      wjxx:beforeObjwjxx,
    };
    const afterparam = {
      fbdw:obj.fbdw,
      wjxx:afterObjwjxx,
    }
    if(ChiType === '文档'){
      this.FormatConvert(beforeparam,obj);
    }
    else{
      this.getInsert(afterparam);
    }
  }

  FormatConvert = (param,obj) => {
    this.props.dispatch({
      type:'Learning/getFormatConvert',
      payload:param?param:'',
      callback:(data)=>{
        // console.log('data',data);
        let newObj = [];
        data.list.map((item)=>{
          const newObjSty = {
            zlmc:item.filename,
            scsj:item.scsj,
            lx:item.lx,
            wjdx:item.wjdx,
            xzlj:item.filepath,
            yllj:item.yllj,
          }
          newObj.push(newObjSty);
          return newObj
        })
        // console.log('newObj',newObj);
        const afterObjSty = {
          fbdw:obj.fbdw,
          wjxx:newObj,
        }
        this.getInsert(afterObjSty);
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
    // console.log('values',values);
    // console.log('fileList',this.state.fileList);
    if(values.fbdw&&this.state.fileList.length>0){
      this.setState({
        SureModalVisible:true,
      })
      // this.getinfoview(values);
    }
    else{
      message.warning('请选择发布单位或者上传文件')
    }
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
    if (this.state.fileList.length >= 10) {
      message.error('一次最多上传10个文件');
      return false;
    }
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
    window.open('http://'+file.response.fileUrl);
  };

  render() {
    const { SureModalVisible,record, from } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 6}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 18}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    const uploadButton = (
      <Button className={styles.outtext}>
        <img src={this.props.dark?fileImgBlack:fileImgwhite} width={48} height={40} />
        打开文件选择器
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
      <div id='zldrsearchForm'>
        <Modal
          visible={this.props.visible}
          title={<div><img src={importImg} width={20} height={20} style={{marginTop:'-5px',marginRight:"12px"}} />资料导入</div>}
          // onOk={this.handleOk}
          onCancel={this.props.handleCancel}
          className={this.props && this.props.dark ? styles.darkshareHeader : styles.lightshareHeader}
          // confirmLoading={this.state.btnLoading}
          width={600}
          maskClosable={false}
          style={{top: '300px'}}
          footer={null}
        >
          <Form className={styles.standardForm}>
            <Row style={{padding:'0 100px'}}>
              <Col sm={24} md={24} xl={24}>
                <FormItem label="发布单位" {...formItemLayout}>
                  {getFieldDecorator('fbdw', {
                    // initialValue: this.state.caseType,
                    // rules: [{required:true, message: '请选择发布单位'}],
                  })(
                    <Select
                      placeholder="请选择发布单位"
                      style={{width: '100%'}}
                      getPopupContainer={() => document.getElementById('zldrsearchForm')}
                    >
                      <Option value="">全部</Option>
                      {fblxAlarmDictOptions}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginBottom:16,paddingLeft:'226px'}}>
              <Col sm={24} md={24} xl={24}>
                <span className={styles.outtext}>
                  <Upload
                    // action={`${window.configUrl.weedUrl}/submit`}
                    action='http://192.168.3.92:9222/submit'
                    beforeUpload={this.beforeUploadFun}
                    // fileList={this.state.fileList}
                    // multiple={true}
                    className={styles.Upload}
                    onChange={this.handleChange}
                    onPreview={this.fileOnPreview}
                    onDownload={this.fileOnPreview}
                    style={{diaplay:'inlineBlock'}}
                  >

                  {this.state.fileList.length >= 10 ? '' : uploadButton}
                  </Upload>
                </span>
                {/*<span className={styles.title}>打开文件选择器</span>*/}
              </Col>
            </Row>
          </Form>
          <div className={styles.btns}>
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              onClick={this.handleAlarm}
              // loading={this.state.dbLoading}
            >
              确定
            </Button>
            <Button style={{marginLeft: 8}} className={styles.qxBtn} onClick={this.props.handleCancel}>
                取消
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
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ImportFileModal);
