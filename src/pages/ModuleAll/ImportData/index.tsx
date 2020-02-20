/*
 * Supervise/index.tsx 导入资料
 * author：jhm
 * 20200219
 * */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
  TreeSelect,
  Checkbox,
  Input,
  Card,
} from 'antd';
import { routerRedux } from 'dva/router';
import { getSysAuthority } from '../../../utils/authority';
import styles from './index.less';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { NavigationItem } from '@/components/Navigation/navigation';
import moment from "moment";

const TreeNode = TreeSelect.TreeNode;
const { Option, OptGroup } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;
@connect(({ common, global }) => ({
  common,
  global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class SuperviseModal extends PureComponent {
  constructor(props){
    super(props);
    // const {query: {from,wtflId, wtflMc,tab, fromPath, id },} = props.location;
    let record = props.location.query;
    if(record && typeof record === 'string'||typeof record === 'object'){
      record = JSON.parse(sessionStorage.getItem('query')).query.record;
    }

    this.state={
      // wtlx: '',
      // SureModalVisible: false,
      // zgjg: '',
      // formValues: {},
      // fileList: [],
      // zrrValue: [],
      // chooseValue: [],
      // gqType: false,
      // dbLoading: false,
      record,
      // from,
      // wtflId,
      // wtflMc,
      // tab,
      // fromPath,
      // id,
      // success:false,
    }
  }

  componentDidMount() {

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
    const objPart = JSON.parse(sessionStorage.getItem('user'));
    const zlxx = obj&&obj.scwj&&obj.scwj.fileList?obj.scwj.fileList:'';
    console.log('objPart',objPart);
    let Objwjxx=[];
    for(let a = 0; a < zlxx.length; a++ ){
      let wj = {
        zlmc:zlxx[a].response.fileName,
        scsj:moment().format('YYYY-MM-DD'),
        lx:zlxx[a].type,
        wjdx:zlxx[a].size/1024/1024,
        xzlj:zlxx[a].response.fileUrl,
      }
      Objwjxx.push(wj);
    }
    console.log('Objwjxx',Objwjxx);
    const param = {
        fbdw:obj.fbdw,
        wjxx:Objwjxx,
    }
    this.props.dispatch({
      type:'Learning/getInsertList',
      payload:param?param:'',
      callback:(data)=>{
        console.log('data---',data);
      }
    })
  }

  handleAlarm = () => {
    const {from } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if(!err){
        console.log('fieldsValue',fieldsValue);
        // this.setState({fieldsValue})
        this.getinfoview(fieldsValue);
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
    });
  };
  handleCancel = () => {
    this.setState({
      success: false,
    });
    this.onEdit(true)
  };
  handleAlarmSure = () => {
    this.setState({
      dbLoading: true,
    });
    const values = this.props.form.getFieldsValue();
    const { fileList, zrrValue, record, from, wtflId, wtflMc } = this.state;
    let wjxx = [];
    for (let i in fileList) {
      const obj = {
        // wj_name: fileList[i].fileName,
        // wj_url: fileList[i].fileUrl,
        wj_name: fileList[i]&&fileList[i].response&&fileList[i].response.fileName||'',
        wj_url: fileList[i]&&fileList[i].response&&fileList[i].response.fileUrl||'',
      };
      wjxx.push(obj);
    }
    const dbzrr = [],
      dbzrdw = [],
      dbzrdwid = [],
      dbzrrsfzh = [],
      dbzrrjh = [];
    for (let a = 0; a < zrrValue.length; a++) {
      dbzrr.push(zrrValue[a][0]);
      dbzrdw.push(zrrValue[a][2]);
      dbzrdwid.push(zrrValue[a][3]);
      dbzrrsfzh.push(zrrValue[a][1]);
      dbzrrjh.push(zrrValue[a][4]);
    }
    const newdbzrr = dbzrr.join(',');
    const newdbzrdw = dbzrdw.join(',');
    const newdbzrdwid = dbzrdwid.join(',');
    const newdbzrrsfzh = dbzrrsfzh.join(',');
    const newdbzrrjh = dbzrrjh.join(',');
    // this.props.saveModal(false, values.zgyj, wjxx, newdbzrr, newdbzrdw, newdbzrdwid, newdbzrrsfzh, values.wtlx.split(',')[1], values.wtlx.split(',')[0], this.state.gqType ? '挂起' : '', values.gqyy ? values.gqyy : '');
    if (from === '督办') {
      this.props.dispatch({
        type: 'UnPoliceData/SureSupervise',
        payload: {
          wtid: record.wtid,
          wjxx,
          id: record.id,
          zgyj: values.zgyj,
          zrr_dwid: newdbzrdwid,
          zrr_dwmc: newdbzrdw,
          zrr_name: newdbzrr,
          zrr_sfzh: newdbzrrsfzh,
          zrr_jh: newdbzrrjh,
          ajbh: record && record.ajbh ? record.ajbh : '',
          ajmc: record && record.ajmc ? record.ajmc : '',
          cljg_mc: this.state.gqType ? '挂起' : '',
          cljg_yy: values.gqyy ? values.gqyy : '',
        },
        callback: data => {
          // message.success('督办成功');
          this.setState({
            SureModalVisible: false,
            dbLoading: false,
          });
          this.closeConfirm();
          // this.onEdit(true);
          // this.props.getRefresh(false);
          this.setState({
            success:true,
          });
        },
      });
    } else {
      this.props.dispatch({
        type: 'CaseData/CaseSureSupervise',
        payload: {
          wjxx,
          ag_id: record.id,
          system_id: record.system_id,
          wtfl_id: wtflId,
          wtfl_mc: wtflMc,
          wtlx_id: values.wtlx.split(',')[1],
          wtlx_mc: values.wtlx.split(',')[0],
          zgyj: values.zgyj,
          zrr_dwid: newdbzrdwid,
          zrr_dwmc: newdbzrdw,
          zrr_name: newdbzrr,
          zrr_sfzh: newdbzrrsfzh,
          zrr_jh: newdbzrrjh,
          ajbh: record && record.ajbh ? record.ajbh : '',
          ajmc: record && record.ajmc ? record.ajmc : '',
          cljg_mc: this.state.gqType ? '挂起' : '',
          cljg_yy: values.gqyy ? values.gqyy : '',
        },
        callback: data => {
          // message.success('问题判定保存完成');
          this.setState({
            SureModalVisible: false,
            dbLoading: false,
          });
          this.closeConfirm();
          // this.getDetail(this.props.id);
          // this.props.getRefresh(false);
          // this.onEdit(true);
          this.setState({
            success:true,
          });
        },
      });
    }
  };


  beforeUploadFun = (file, fileList) => {
    // if (this.state.fileList.length >= 10) {
    //   message.error('最多上传10个文件');
    //   return false;
    // }
    const allowTypeArry = ['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'bmp', 'mp4'];
    const nameArry = file.name.split('.');
    const fileType = nameArry[nameArry.length - 1];
    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      message.error('上传的文件大小不能超过50M');
    }
    const allowType = allowTypeArry.includes(fileType);
    if (!allowType) {
      message.error('支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .bmp .mp4');
    }
    return isLt50M && allowType;
  };

  handleChange = info => {
    let fileList = info.fileList;
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      const allowTypeArry = ['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'bmp', 'mp4'];
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

  onEdit = isReset => {
    const {record, tab, fromPath, id} = this.state;
    // console.log('fromPath',fromPath);
    // console.log('isReset',isReset);
    let key = '/ModuleAll/Supervise' + this.props.location.query.id;
    // 鍒犻櫎褰撳墠tab骞朵笖灏嗚矾鐢辫烦杞嚦鍓嶄竴涓猼ab鐨刾ath
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch(
        routerRedux.push({
          pathname: fromPath ? fromPath : '',
          query: { id: tab === '表格' ? '' : id, record: tab === '表格' ? '' : record },
        }),
      );
      if(isReset){
        dispatch({
          type: 'global/changeResetList',
          payload: {
            isReset: !this.props.global.isResetList.isReset,
            url:fromPath ? fromPath : ''
          },
        });
      }
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
    // console.log('window.configUrl.weedUrl',window.configUrl.weedUrl)
    return (
      <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
        <Card className={styles.standardTable} id="importModule">
          <Form className={styles.standardForm}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '16px' }}>
              <Col {...colLayout}>
                <FormItem label="发布单位" {...formItemLayout}>
                  {getFieldDecorator('fbdw', {
                    // initialValue: this.state.caseType,
                    rules: [{required:true, message: '请选择发布单位'}],
                  })(
                    <Select
                      placeholder="请选择发布单位"
                      style={{width: '100%'}}
                      // getPopupContainer={() => document.getElementById('slaxsgjsearchForm')}
                    >
                      <Option value="">全部</Option>
                      {fblxAlarmDictOptions}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col {...colLayout}>
                <FormItem label="上传文件" {...formItemLayout}>
                  {getFieldDecorator('scwj', {
                    // initialValue: this.state.caseType,
                    rules: [{required:true, message: '请上传文件'}],
                  })(
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
                  )}
                </FormItem>
                {/*<span className={styles.title}>上传附件：</span>*/}
                {/*<span className={styles.outtext}>*/}
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
                {/*</span>*/}
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
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              onClick={this.handleAlarm}
              className={styles.okBtn}
              loading={this.state.dbLoading}
            >
              确定
            </Button>
          </div>
        </Card>
        <Modal visible={SureModalVisible} centered={true} footer={null} header={null} closable={false} width={400} getContainer={()=>document.getElementById('messageBox')}>
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
          onCancel={this.handleCancel}
          footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
        >
          上传成功！
        </Modal>
      </div>
    );
  }
}
