/*
* AlarmData/index.js 在线学习
* author：jhm
* 20200218
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Form,
  Select,
  TreeSelect,
  Input,
  Button,
  DatePicker,
  Tabs,
  Radio,
  message,
  Cascader,
  Icon,
  Card, Icon, Upload, Modal,
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import RenderTable from '../../../components/Online/learningTable';
import ImportFileModal from '../../../components/Online/ImportFileModal';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import {routerRedux} from "dva/router";


const confirm = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({Learning,common,global}) => ({
  Learning,common,global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    // searchHeight: false, // 查询条件展开筛选
    dataList:'', // 数据列表
    formValues:'', // 条件
    fileList: [],
    fbdwData:[], // 发布单位字典
    zllxData:[], // 资料类型字典
    deletedata:[], // 选择删除的数据
    ImportModal:false, // 导入文件模态框
    pagenow:1, // 默认当前处在第几页
  };


  componentDidMount() {
    this.getfbdwList(); // 发布单位
    this.getzllxList(); // 资料类型
    const param = {
      currentPage: 1,
      pd: {},
      showCount: tableList,
    }
    this.getDataList(param); // 获取文件列表
  }

  componentWillReceiveProps(nextProps) {

  }

  // 发布单位字典
  getfbdwList = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd: {id: "587e4f3b-70c0-448a-a7df-a9ca78d4919a", name: "", appCode: "106305"},
        showCount: tableList,
      },
      callback:(data)=>{

      }
    })
  }

  // 资料类型字典
  getzllxList = () => {
    this.props.dispatch({
      type:'common/getfbdwDictType',
      payload:{
        currentPage: 1,
        pd: {id: "e71fc6ad-d568-4d27-ba9c-00ea0cfdebfb", name: "", appCode: "106305"},
        showCount: tableList,
      },
      callback:(data)=>{

      }
    })
  }

  getDataList = (param) => {
    this.props.dispatch({
      type:'Learning/getLearningList',
      payload:param?param:'',
      callback:(data)=>{
        this.setState({
          dataList:data,
        })
        // console.log('data',data);
      }
    })
  }


  // 无法选择的日期
  disabledDate = current => {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  };

  // // 展开筛选和关闭筛选
  // getSearchHeight = () => {
  //   this.setState({
  //     searchHeight: !this.state.searchHeight,
  //   });
  // }

  // 导出
  exportData = () => {
    const {formValues} = this.state;
    const values = this.props.form.getFieldsValue();
    const scTime = values.scsj;
    if (scTime && scTime.length > 0) {
      const isAfterDate = moment(formValues.scsj_js).isAfter(moment(formValues.scsj_ks).add(exportListDataMaxDays, 'days'));
      if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
        message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
      } else {
        this.props.dispatch({
          type: 'common/exportData',
          payload: {
            tableType: '42',
            ...formValues,
          },
          callback: (data) => {
            if (data.text) {
              message.error(data.text);
            } else {
              window.open(configUrl.serverUrl + data.url);
            }
          },
        });
      }
    } else {
      message.warning(`请选择需要导出的数据日期，日期间隔需小于${exportListDataMaxDays}天`);
    }
  };

  // 表格操作的删除单条数据功能
  deleteOneData = (obj) =>{
    let deleteId = [],that=this;
    let objDelete={
      id:obj.id,
    }
    deleteId.push(objDelete);
    confirm({
      title: '确定删除？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      style: {top: 417},
      onOk() {
        that.delete(deleteId)
      },
    });
  }

  // 资料删除
  deleteData = () => {
    const { deletedata } = this.state;
    let that = this;
    let deleteId = [], objDeleteId={};
    if(deletedata&&deletedata.length>0){
      deletedata.map((item) => {
        objDeleteId = {
          id:item,
        }
        deleteId.push(objDeleteId);
      });
      confirm({
        title: '确定删除这'+deletedata.length+'条资料？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        style: {top: 417},
        onOk() {
          that.delete(deleteId)
        },
      });
    }
    else{
      message.warning('请选择要删除的资料');
    }
  }

  delete = (deleteId) => {
    this.props.dispatch({
      type:'Learning/getDeleteList',
      payload:{
        wjxx:deleteId,
      },
      callback:(obj)=>{
        if(obj.error === null){
          message.success('删除成功');
          this.handleFormReset()
          this.setState({
            deletedata:[],
          })
        }
      }
    })
  }
  // 表格分页
  handleTableChange = (pagination, filtersArg, sorter) => {
    const {formValues} = this.state;
    const params = {
      pd: {
        ...formValues,
      },
      currentPage: pagination.current,
      showCount: pagination.pageSize,
    };
    this.getDataList(params);
    this.setState({
      pagenow:pagination.current,
    })
  };
  // 视图分页
  viewChange = (page) => {
    const {formValues} = this.state;
    const params = {
      pd: {
        ...formValues,
      },
      currentPage: page,
      showCount: tableList,
    };
    this.getDataList(params);
    this.setState({
      pagenow:page,
    })
  }

  // 查询
  handleSearch = (e) => {
    if (e) e.preventDefault();
    // const values = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('values',values);
        const formValues = {
          scsj_ks:values&&values.scsj?moment(values.scsj[0]).format('YYYY-MM-DD'):'',
          scsj_js:values&&values.scsj?moment(values.scsj[1]).format('YYYY-MM-DD'):'',
          lx:values.zllx,
          fbdw:values.fbdw,
          zlmc:values.zlmc,
        };
        this.setState({
          formValues,
        });
        const params = {
          currentPage: 1,
          showCount: tableList,
          pd: {
            ...formValues,
          },
        };
        this.getDataList(params);
      }
    })
  };

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      formValues:'',
      deletedata:[],
    })
    const params = {
      currentPage: 1,
      showCount: tableList,
      pd: {

      },
    };
    this.getDataList(params);
  };

  // 资料导入
  importData = (flag) => {
    // const {form: {getFieldDecorator}, common: {FbdwTypeData, ZllxTypeData}} = this.props;
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/ModuleAll/ImportData',
    //     query: {
    //       record: FbdwTypeData,
    //       // searchDetail: record,
    //       // id: NewDossierDetail && NewDossierDetail.id ? NewDossierDetail.id : '1',
    //       // from: '督办',
    //       // tzlx: 'jzwt',
    //       fromPath: '/ShowData/Learning',
    //       // tab: '表格',
    //     },
    //   }),
    // );
    this.setState({
      ImportModal:!!flag,
    })
  }

  // beforeUploadFun = (file, fileList) => {
  //   const allowTypeArry = ['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'bmp', 'mp4'];
  //   const nameArry = file.name.split('.');
  //   const fileType = nameArry[nameArry.length - 1];
  //   const isLt50M = file.size / 1024 / 1024 < 50;
  //   if (!isLt50M) {
  //     message.error('上传的文件大小不能超过50M');
  //   }
  //   const allowType = allowTypeArry.includes(fileType);
  //   if (!allowType) {
  //     message.error('支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .bmp .mp4',);
  //   }
  //   return isLt50M && allowType;
  // };
  //
  // handleChange = info => {
  //   let fileList = info.fileList;
  //   for (let i = 0; i < fileList.length; i++) {
  //     let file = fileList[i];
  //     const allowTypeArry = ['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'bmp', 'mp4'];
  //     const nameArry = file.name.split('.');
  //     const fileType = nameArry[nameArry.length - 1];
  //     const isLt50M = file.size / 1024 / 1024 < 50;
  //     if (!isLt50M) {
  //       return false;
  //     }
  //     const allowType = allowTypeArry.includes(fileType);
  //     if (!allowType) {
  //       return false;
  //     }
  //   }
  //   fileList = fileList.map(file => {
  //     if (file.response && file.response.data) {
  //       file.url = file.response.data.url;
  //     }
  //     return file;
  //   });
  //   // 3. Filter successfully uploaded files according to response from server
  //   // fileList = fileList.filter(file => {
  //   //   if (file.response) {
  //   //     return file.response.error === null;
  //   //   }
  //   //   return true;
  //   // });
  //   this.setState({ fileList });
  //   this.getinfoview(fileList);
  //
  // };

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

  // 选择删除的数据
  chooseSelect = (deletedata) => {
    // console.log()
    this.setState({
      deletedata,
    })
  };

  // 关闭导入文件模态框
  handleCancel = () => {
    this.setState({
      ImportModal:false,
    })
  }

  renderForm() {
    const {form: {getFieldDecorator}, common: {FbdwTypeData, ZllxTypeData}} = this.props;
    console.log('FbdwTypeData',FbdwTypeData);
    let zllxAlarmDictOptions = [], fblxAlarmDictOptions = [];
    if (ZllxTypeData.length > 0) {
      for (let i = 0; i < ZllxTypeData.length; i++) {
        const item = ZllxTypeData[i];
        zllxAlarmDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    if (FbdwTypeData.length > 0) {
      for (let i = 0; i < FbdwTypeData.length; i++) {
        const item = FbdwTypeData[i];
        fblxAlarmDictOptions.push(
          <Option key={item.id} value={item.name}>{item.name}</Option>,
        );
      }
    }
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    return (
      <Form
        onSubmit={this.handleSearch}
        // style={{height: this.state.searchHeight ? 'auto' : '59px'}}
        style={{height:  'auto' }}
      >
        <Row gutter={rowLayout} className={styles.searchForm}>
          <Col {...colLayout}>
            <FormItem label="上传时间" {...formItemLayout}>
              {getFieldDecorator('scsj', {
                // initialValue: this.state.wtlx,
              })(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{width: '100%'}}
                  getCalendarContainer={() => document.getElementById('zxpxzlksearchForm')}
                />,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="资料类型" {...formItemLayout}>
              {getFieldDecorator('zllx', {
              })(
                <Select
                  placeholder="请选择资料类型"
                  style={{width: '100%'}}
                  getPopupContainer={() => document.getElementById('zxpxzlksearchForm')}
                >
                  <Option value="">全部</Option>
                  {zllxAlarmDictOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="发布单位" {...formItemLayout}>
              {getFieldDecorator('fbdw', {
                // initialValue: this.state.caseType,
              })(
                <Select
                  placeholder="请选择发布单位"
                  style={{width: '100%'}}
                  getPopupContainer={() => document.getElementById('zxpxzlksearchForm')}
                >
                  <Option value="">全部</Option>
                  {fblxAlarmDictOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="资料名称" {...formItemLayout}>
              {getFieldDecorator('zlmc', {
                // initialValue: this.state.badw,
              })(
                <Input placeholder="请输入资料名称"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row className={styles.search}>
          <span style={{ marginTop: 5}}>
            <Button style={{marginLeft: 8}} type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button
              style={{ borderColor: '#2095FF',marginLeft: 8 }}
              onClick={this.exportData}
              icon="download"
            >
            导出表格
          </Button>
          </span>
        </Row>
        <Row className={styles.search}>
          <span style={{marginTop: 5}}>
            <Button
              style={{ borderColor: '#2095FF', marginLeft: 8 }}
              onClick={()=>this.importData(true)}
              // icon="download"
            >
              资料导入
            </Button>
            <Button
              style={{ borderColor: '#2095FF', marginLeft: 8 }}
              onClick={this.deleteData}
              // icon="download"
            >
              资料删除
            </Button>
          </span>
        </Row>
      </Form>
    );
  }

  renderTable() {
    const {dataList, pagenow} = this.state;
    // console.log('pagenow',pagenow);
    return (
      <div>
        <RenderTable
          data={dataList}
          onChange={this.handleTableChange}
          deleteOneData={this.deleteOneData}  // 删除单条数据
          chooseSelect={this.chooseSelect} // 删除多条数据
          // dispatch={this.props.dispatch}
          pagenow={pagenow} // 当前视图处在第几页
          viewChange={this.viewChange} // 视图分页
        />
      </div>
    );
  }

  render() {
    const {ImportModal} = this.state;
    const {form: {getFieldDecorator}, common: {FbdwTypeData, ZllxTypeData}} = this.props;
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    // console.log('dark',this.props)
    return (
      <div className={className}>
        <div className={styles.tableListForm} id="zxpxzlksearchForm">
          {this.renderForm()}
        </div>
        <div className={styles.tableListOperator} style={{marginBottom: 0}}>
          {this.renderTable()}
        </div>

        {ImportModal?
          <ImportFileModal
            visible={ImportModal}
            record={FbdwTypeData}
            handleCancel={this.handleCancel}
            handleFormReset={this.handleFormReset}

          />
          :
          ''
        }
      </div>
    );
  }
}
