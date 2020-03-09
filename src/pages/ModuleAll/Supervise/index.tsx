/*
 * Supervise/index.tsx 督办（问题判定）功能弹窗
 * author：jhm
 * 20191211
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
    const {query: {from,wtflId, wtflMc,tab, fromPath, id },} = props.location;
    let record = props.location.query;
    if(record && typeof record === 'string'||typeof record === 'object'){
      record = JSON.parse(sessionStorage.getItem('query')).query.record;
    }

    this.state={
      wtlx: '',
      SureModalVisible: false,
      zgjg: '',
      formValues: {},
      // 刑事类型返回的数据
      returnxsProblemType: '',
      // 警情类型返回的数据
      returnjqProblemType: '',
      // 行政类型返回的数据
      returnxzProblemType: '',
      // 办案区类型返回的数据
      returnbaqProblemType: '',
      // 涉案财物类型返回的数据
      returnsacwProblemType: '',
      // 卷宗类型返回的数据
      returnjzProblemType: '',
      fileList: [],
      zrrValue: [],
      chooseValue: [],
      gqType: false,
      dbLoading: false,
      record,
      from,
      wtflId,
      wtflMc,
      tab,
      fromPath,
      id,
      success:false,
    }
  }

  componentDidMount() {
    this.dicType();
    this.dicType1();
    this.dicType2();
    this.dicType3();
    this.dicType4();
    this.dicType5();
  }

  onCancel1 = () => {
    // this.props.closeModal(false);
  };
  onCancel2 = () => {
    // this.props.closeModal(false);
    this.setState({
      SureModalVisible: false,
    });
  };


  // 刑事案件问题类型字典
  dicType() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '20160001',//2016
      },
      callback: data => {
        this.setState({
          returnxsProblemType: data.data,
        });
      },
    });
  }

  // 警情问题类型字典
  dicType1() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '206800',//2068
      },
      callback: data => {
        this.setState({
          returnjqProblemType: data.data,
        });
      },
    });
  }

  // 行政案件问题类型字典
  dicType2() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '60010001',//6001
      },
      callback: data => {
        this.setState({
          returnxzProblemType: data.data,
        });
      },
    });
  }

  // 办案区问题类型字典
  dicType3() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '3',
      },
      callback: data => {
        this.setState({
          returnbaqProblemType: data.data,
        });
      },
    });
  }

  // 涉案财物问题类型字典
  dicType4() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '2017',
      },
      callback: data => {
        this.setState({
          returnsacwProblemType: data.data,
        });
      },
    });
  }

  // 卷宗问题类型字典
  dicType5() {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        appCode: window.configUrl.appCode,
        code: '5007725',
      },
      callback: data => {
        this.setState({
          returnjzProblemType: data,
        });
      },
    });
  }
    closeConfirm=()=>{
        this.setState({
            SureModalVisible:false,
        })
    }

  handleAlarm = () => {
    const {from } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      const { zrrValue } = this.state;
      this.setState({fieldsValue})
      if (
        from === '警情详情问题判定' ||
        from === '刑事案件详情问题判定' ||
        from === '行政案件详情问题判定' ||
        from === '办案区详情问题判定' ||
        from === '涉案财物详情问题判定' ||
        from === '卷宗详情问题判定'
      ) {
        if (
          fieldsValue.wtlx === '' ||
          fieldsValue.wtlx === undefined ||
          fieldsValue.wtlx === null
        ) {
          message.warning('请选择问题类型');
        } else if (
          (fieldsValue && fieldsValue.zgyj === '') ||
          fieldsValue.zgyj === undefined ||
          fieldsValue.zgyj === null
        ) {
          message.warning('请填写整改意见');
        } else if (fieldsValue.zgyj.length > 500) {
          message.warning('整改意见不可超过500字');
        } else if (
          this.state.gqType &&
          ((fieldsValue && fieldsValue.gqyy === '') ||
            fieldsValue.gqyy === undefined ||
            fieldsValue.gqyy === null)
        ) {
          message.warning('请填写挂起原因');
        } else if (fieldsValue.gqyy && fieldsValue.gqyy.length > 500) {
          message.warning('挂起原因不可超过500字');
        } else if (zrrValue && zrrValue.length === 0) {
          message.warning('请选择责任人');
        } else {
          this.setState({
            SureModalVisible: true,
          });
        }
      } else {
        if (
          (fieldsValue && fieldsValue.zgyj === '') ||
          fieldsValue.zgyj === undefined ||
          fieldsValue.zgyj === null
        ) {
          message.warning('请填写整改意见');
        } else if (fieldsValue.zgyj.length > 500) {
          message.warning('整改意见不可超过500字');
        } else if (
          this.state.gqType &&
          ((fieldsValue && fieldsValue.gqyy === '') ||
            fieldsValue.gqyy === undefined ||
            fieldsValue.gqyy === null)
        ) {
          message.warning('请填写挂起原因');
        } else if (fieldsValue.gqyy && fieldsValue.gqyy.length > 500) {
          message.warning('挂起原因不可超过500字');
        } else if (zrrValue && zrrValue.length === 0) {
          message.warning('请选择责任人');
        } else {
          this.setState({
            SureModalVisible: true,
          });
        }
      }
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

  // foot = () => {
  //   return (
  //     <div>
  //       <Button onClick={this.onCancel1}>取消</Button>
  //       <Button type="primary" onClick={this.handleAlarm}>督办</Button>
  //     </div>
  //   );
  // };
  // foot1 = () => {
  //   return (
  //     <div>
  //       <Button className={styles.qxBtn} onClick={this.onCancel2}>取消</Button>
  //       <Button type="primary" onClick={this.handleAlarmSure} loading={this.state.dbLoading}>确认督办</Button>
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

  handleChange = info => {
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
  chooseWtlx = value => {
    let newValue = [];
    for (let a = 0; a < value.length; a++) {
      newValue.push(value[a].split(','));
    }
    this.setState({
      wtlx: newValue,
    });
  };
  selectJudge = () => {
    const { getFieldDecorator } = this.props.form;
    const { from} = this.state;
    const {
      returnxsProblemType,
      returnjqProblemType,
      returnxzProblemType,
      returnbaqProblemType,
      returnsacwProblemType,
      returnjzProblemType,
    } = this.state;
    let problemTypeOptions = [];
    if (from === '刑事案件详情问题判定') {
      if (returnxsProblemType.length > 0) {
        for (let i = 0; i < returnxsProblemType.length; i++) {
          const item = returnxsProblemType[i];
          problemTypeOptions.push(
            <Option key={item.id} value={[item.name, item.code].join(',')}>
              <Ellipsis lines={1} tooltip>
                {item.name}
              </Ellipsis>
            </Option>,
          );
        }
      }
    } else if (from === '警情详情问题判定') {
      if (returnjqProblemType.length > 0) {
        for (let i = 0; i < returnjqProblemType.length; i++) {
          const item = returnjqProblemType[i];
          problemTypeOptions.push(
            <Option key={item.id} value={[item.name, item.code].join(',')}>
              <Ellipsis lines={1} tooltip>
                {item.name}
              </Ellipsis>
            </Option>,
          );
        }
      }
    } else if (from === '行政案件详情问题判定') {
      if (returnxzProblemType.length > 0) {
        for (let i = 0; i < returnxzProblemType.length; i++) {
          const item = returnxzProblemType[i];
          problemTypeOptions.push(
            <Option key={item.id} value={[item.name, item.code].join(',')}>
              <Ellipsis lines={1} tooltip>
                {item.name}
              </Ellipsis>
            </Option>,
          );
        }
      }
    } else if (from === '办案区详情问题判定') {
      if (returnbaqProblemType && returnbaqProblemType.length > 0) {
        for (let i = 0; i < returnbaqProblemType.length; i++) {
          const item = returnbaqProblemType[i];
          problemTypeOptions.push(
            <Option key={item.id} value={[item.name, item.code].join(',')}>
              <Ellipsis lines={1} tooltip>
                {item.name}
              </Ellipsis>
            </Option>,
          );
        }
      }
    } else if (from === '涉案财物详情问题判定') {
      if (returnsacwProblemType.length > 0) {
        for (let i = 0; i < returnsacwProblemType.length; i++) {
          const item = returnsacwProblemType[i];
          problemTypeOptions.push(
            <Option key={item.id} value={[item.name, item.code].join(',')}>
              <Ellipsis lines={1} tooltip>
                {item.name}
              </Ellipsis>
            </Option>,
          );
        }
      }
    } else if (from === '卷宗详情问题判定') {
      if (returnjzProblemType.length > 0) {
        for (let i = 0; i < returnjzProblemType.length; i++) {
          const item = returnjzProblemType[i];
          problemTypeOptions.push(
            <Option key={item.id} value={[item.name, item.code].join(',')}>
              <Ellipsis lines={1} tooltip>
                {item.name}
              </Ellipsis>
            </Option>,
          );
        }
      }
    }
    return (
      <span>
        {getFieldDecorator('wtlx', {
          // initialValue: this.state.wtlx,
        })(
          <Select
            placeholder="请选择问题类型"
            style={{ width: '100%' }}
            onChange={this.chooseWtlx}
            getPopupContainer={() => document.getElementById('superviseModule'+this.state.record.id)}
          >
            {/*<Option value="">全部</Option>*/}
            {/*<Option value="1">全部1</Option>*/}
            {/*<Option value="2">全部2</Option>*/}
            {problemTypeOptions}
          </Select>,
        )}
      </span>
    );
  };

  handleonChange = value => {
    let newValue = [];
    for (let a = 0; a < value.length; a++) {
      newValue.push(value[a].split(','));
    }
    this.setState({
      chooseValue: value,
      zrrValue: newValue,
    });
  };

  label(labelValue) {
    return (
      <Ellipsis lines={1} tooltip>
        {labelValue}
      </Ellipsis>
    );
  }

  zzrSelect = record => {
    // console.log('record',record);
    const zrdw = record && record.zrdwList ? record.zrdwList : '';
    let zrrTreeNodeTypeOptions = '';
    if (zrdw) {
      zrrTreeNodeTypeOptions = zrdw.map(item => (
        <OptGroup key={item.zrr_dwid} label={this.label(item.zrr_dwmc)}>
          {item.zrrList.map(zrrItem => {
            const newDatazrr = [
              zrrItem.zrr_name,
              zrrItem.zrr_sfzh,
              zrrItem.zrr_dwmc,
              zrrItem.zrr_dwid,
              zrrItem.zrr_jh,
            ].join(',');
            return (
              <Option value={newDatazrr} key={zrrItem.zrr_sfzh}>
                {zrrItem.zrr_name}
              </Option>
            );
          })}
        </OptGroup>
      ));
    } else {
      zrrTreeNodeTypeOptions = '';
    }
    return (
      <Select
        showSearch
        mode="multiple"
        style={{ width: '100%', marginTop: 1 }}
        value={this.state.chooseValue}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择责任人"
        allowClear
        onChange={this.handleonChange}
        // getPopupContainer={triggerNode => triggerNode.parentNode}
        getPopupContainer={() => document.getElementById('superviseModule'+this.state.record.id)}
        className={styles.zrrStyle}
      >
        {zrrTreeNodeTypeOptions}
      </Select>
    );
  };
  onChangeGq = e => {
    this.setState({
      gqType: e.target.checked,
    });
  };
  getZg = e => {
    this.setState({
      zgyj: e.target.value,
    });
  };
  getGq = e => {
    this.setState({
      gqyy: e.target.value,
    });
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
    const uploadButton = (
      <Button>
        <Icon type="upload" icon={'upload'} />
        上传文件
      </Button>
    );
    return (
      <div className={this.props.global && this.props.global.dark ? '' : styles.lightBox}>
        <Card className={styles.standardTable} id={"superviseModule"+this.state.record.id}>
          <Form className={styles.standardForm}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '16px' }}>
              {/*<Col md={12} sm={24}>问题类型：{this.props.from && this.props.from === '案件详情问题判定' ? this.selectJudge():this.props.wtlx}</Col>*/}
              <Col md={12} sm={24}>
                <span className={styles.title1}>问题类型：</span>
                <span className={styles.outtext}>
                  {(from && from === '刑事案件详情问题判定') ||
                  from === '行政案件详情问题判定' ||
                  from === '办案区详情问题判定' ||
                  from === '涉案财物详情问题判定' ||
                  from === '警情详情问题判定' ||
                  from === '卷宗详情问题判定' ? (
                    this.selectJudge()
                  ) : (
                    <span className={styles.wtlxstyle}>{record.wtlx}</span>
                  )}
                </span>
              </Col>
              <Col md={12} sm={24}>
                <span className={styles.title} style={{ left: '24px', top: '3px' }}>
                  责任人：
                </span>
                <span className={styles.outtext} style={{ paddingLeft: '60px' }}>
                  {this.zzrSelect(record)}
                </span>
              </Col>
            </Row>
            <Row style={{ marginBottom: '16px' }}>
              <Col md={24} sm={24}>
                <span className={styles.title}>整改意见：</span>
                <span className={styles.outtext}>
                  {getFieldDecorator('zgyj', {
                    initialValue: this.state.zgyj,
                    rules: [{ max: 500, message: '最多输入500个字！' }],
                  })(
                    <TextArea
                      placeholder="请输入整改意见"
                      style={{ resize: 'none' }}
                      rows={3}
                      onChange={this.getZg}
                    />,
                  )}
                  <span style={{ color: '#1890FF' }}>*请在此处简要描述执法问题和给出整改意见</span>
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
                    // multiple={true}
                    onChange={this.handleChange}
                    onPreview={this.fileOnPreview}
                    onDownload={this.fileOnPreview}
                  >
                    {this.state.fileList.length >= 10 ? '' : uploadButton}
                  </Upload>
                </span>
              </Col>
            </Row>
            <Row style={{ paddingTop: 20 }}>
              <Col>
                <span className={styles.outtext} style={{color: '#1890FF'}}>
                  文件上传最多10个，支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .bmp
                </span>
              </Col>
            </Row>
            <Row style={{ margin: '16px 0' }}>
              <Col md={24} sm={24}>
                <Checkbox onChange={this.onChangeGq}>直接挂起</Checkbox>
              </Col>
            </Row>
            <Row className={this.state.gqType ? '' : styles.none}>
              <Col md={24} sm={24}>
                <span className={styles.title}>挂起原因：</span>
                <span className={styles.outtext}>
                  {getFieldDecorator('gqyy', {
                    initialValue: this.state.gqyy,
                    rules: [{ max: 500, message: '请输入不超过500字' }],
                  })(<TextArea placeholder="请输入不超过500字" rows={3} onChange={this.getGq} />)}
                </span>
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
        {/*{SureModalVisible ?*/}
        {/*<Modal*/}
        {/*maskClosable={false}*/}
        {/*visible={SureModalVisible}*/}
        {/*// title={<p>督办</p>}*/}
        {/*width='500px'*/}
        {/*footer={this.foot1()}*/}
        {/*centered={true}*/}
        {/*onCancel={() => this.onCancel2()}*/}
        {/*// onOk={() => this.onOk(this.props.id)}*/}
        {/*className={styles.indexdeepmodal}*/}
        {/*>*/}
        {/*<div className={styles.question}>是否对该问题进行督办？</div>*/}
        {/*</Modal> : ''*/}
        {/*}*/}
          <Modal visible={SureModalVisible} centered={true} footer={null} header={null} closable={false} width={400} getContainer={()=>document.getElementById('messageBox')}>
              <div className={styles.modalBox}>
                  <div className={styles.question} style={this.props.global && this.props.global.dark ? {color:'#fff'} : {}}><Icon type="question-circle" style={{color:'#faad14',fontSize: '22px',marginRight: '16px'}}/>{this.state.fieldsValue&&this.state.fieldsValue.gqyy&&this.state.gqType?'是否直接挂起？':'确认督办？'}</div>
                  <div style={{marginTop:40,float:"right"}}><Button onClick={this.closeConfirm}>取消</Button><Button type="primary" style={{marginLeft:'16px'}} onClick={this.handleAlarmSure} loading={this.state.dbLoading}>确认</Button></div>
              </div>
          </Modal>
          <Modal
              title=" "
              visible={this.state.success}
              className={this.props.global && this.props.global.dark ? styles.success : styles.successLight}
              width={350}
              style={{top: '250px'}}
              maskClosable={false}
              cancelText={null}
              onCancel={this.handleCancel}
              footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
          >
              {/*{this.state.from === '督办'?'督办完成！':'问题判定完成！'}*/}
              督办完成！
          </Modal>
      </div>
    );
  }
}
