/*
 * QuestionBankConfig/EvaluateTemplate.tsx 题库配置测评模板
 * author：jhm
 * 20200302
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
  Icon, Modal,
} from 'antd';
import moment from 'moment/moment';
import styles from './EvaluateTemplate.less';
import EvaluateTemplateTable from '../../../components/QuestionBankConfig/EvaluateTemplateTable';
import AddTemplateVisibleModal from '../../../components/QuestionBankConfig/AddTemplateVisibleModal';
import {exportListDataMaxDays, getUserInfos, tableList} from '../../../utils/utils';


const FormItem = Form.Item;
const {Option} = Select;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({QuestionBankConfig, loading, common, global}) => ({
  QuestionBankConfig,
  loading,
  common,
  global
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class EvaluateTemplate extends PureComponent {
  state = {
    formValues: {},
    addTemplateVisible:false, // 添加模板的模态框判断
    TemplateList:'', // 模板列表
    deletedata:[], // 选择删除的数据
  };

  componentDidMount() {
    const param = {
      pd:{},
      currentPage:1,
      showCount:10,
    }
    this.getTemplateConfigList(param);
  }

  componentWillReceiveProps(nextProps) {

  }
  // 获取模板列表
  getTemplateConfigList = (param) => {
    this.props.dispatch({
      type:'QuestionBankConfig/getTemplateList',
      payload:param?param:'',
      callback:(data)=>{
        if(data){
          this.setState({
            TemplateList:data,
          })
        }
      },
    })
  }

  // 模板删除(多个)
  deleteData = () => {
    const { deletedata } = this.state;
    let that = this;
    let deleteId = [], objDeleteId={};
    if(deletedata&&deletedata.length>0){
      deletedata.map((item) => {
        objDeleteId = {
          tkid:item,
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

  // 删除模板（单个）
  deleteTemplateData = (obj) => {
    let deleteId = [],that=this;
    let objDelete={
      cpid:obj.id,
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

  delete = (deleteId) => {
    this.props.dispatch({
      type:'QuestionBankConfig/getDeleteQuestion',
      payload:{
        cpmb:deleteId,
      },
      callback:(obj)=>{
        if(obj.error === null){
          message.success('删除成功');
          this.handleFormReset();
          this.setState({
            deletedata:[],
          })
        }
      }
    })
  }

  // 选择删除的数据
  chooseSelect = (deletedata) => {
    // console.log()
    this.setState({
      deletedata,
    })
  };

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
    this.getTemplateConfigList(params);
  };
  // 查询
  handleSearch = e => {
    if (e) e.preventDefault();
    const values = this.props.form.getFieldsValue();
    const formValues = {
      cpmbzw:values.mbmc,
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
    this.getTemplateConfigList(params);
  };
  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      formValues: {},
    });
    const param = {
      pd:{},
      currentPage:1,
      showCount:10,
    }
    this.getTemplateConfigList(param);
  };
  // 导出
  exportData = () => {
    const values = this.props.form.getFieldsValue();
    const rqsj = values.rqsj;
    const formValues = {
      ajbh: values.ajbh ? values.ajbh.trim() : '',
      ajmc: values.ajmc ? values.ajmc.trim() : '',
      bar: values.bar || '',
      name: values.xm || '',
      ha_name: values.ssbaq || '',
      rqyy_dm: values.rqyy || '',
      rqsj_ks: rqsj && rqsj.length > 0 ? rqsj[0].format('YYYY-MM-DD') : '',
      rqsj_js: rqsj && rqsj.length > 0 ? rqsj[1].format('YYYY-MM-DD') : '',
    };
    if (rqsj && rqsj.length > 0) {
      const isAfterDate = moment(formValues.rqsj_js).isAfter(
        moment(formValues.rqsj_ks).add(exportListDataMaxDays, 'days'),
      );
      if (isAfterDate) {
        // 选择时间间隔应小于exportListDataMaxDays
        message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
      } else {
        this.props.dispatch({
          type: 'common/exportData',
          payload: {
            tableType: '4',
            ...formValues,
          },
          callback: data => {
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

  // 添加模板
  addTemplate = () => {
    this.setState({
      addTemplateVisible:true,
    })
  }

  // 关闭模板
  closeCancel = () => {
    this.setState({
      addTemplateVisible:false,
    })
  }


  renderForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
    };
    const formItemLayouts = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 4}, xxl: {span: 3}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 19}, xxl: {span: 20}},
    };
    const rowLayout = {md: 8, xl: 16, xxl: 24};
    const colLayout = {sm: 24, md: 12, xl: 8};
    const colLayouts = {sm: 24, md: 12, xl: 12};
    return (
      <Form
        onSubmit={this.handleSearch}
        style={{height: 'auto' }}
      >
        <Row gutter={rowLayout} className={styles.searchForm}>
          <Col {...colLayout}>
            <FormItem label="模板名称" {...formItemLayout}>
              {getFieldDecorator('mbmc', {
                // initialValue: this.state.caseType,
                //rules: [{max: 32, message: '最多输入32个字！'}],
              })(<Input placeholder="请输入模板名称"/>)}
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
          <span style={{ marginTop: 5}}>
            <Button style={{ borderColor: '#2095FF', marginLeft: 8 }} type='primary' onClick={this.addTemplate}>添加测评模板</Button>
            <Button
              style={{ borderColor: '#2095FF', marginLeft: 8 }}
              onClick={this.deleteData}
              // icon="download"
            >
              模板删除
            </Button>
          </span>
        </Row>
      </Form>
    );
  }

  renderTable() {
    const {TemplateList} = this.state;
    return (
      <div>
        <EvaluateTemplateTable
          data={TemplateList}
          onChange={this.handleTableChange}
          deleteTemplateData={this.deleteTemplateData} // 表格删除
          chooseSelect={this.chooseSelect} // 删除多条数据
        />
      </div>
    );
  }

  render() {
    const { common: {depTree}} = this.props;
    const {
      addTemplateVisible,
    } = this.state;
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    return (
      <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>
        <div className={className}>
          {/*<div className={styles.listPageHeader}>*/}
            {/*<Button type='primary' className={styles.exportTable}>导出表格</Button>*/}
          {/*</div>*/}
          <div>
            <div className={styles.tableListForm} id="baqsjtableListForm">
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>{this.renderTable()}</div>
          </div>
        </div>

        {addTemplateVisible?
          <AddTemplateVisibleModal
            title="测评模板添加"
            visible={addTemplateVisible}
            CloseCancelModal={this.closeCancel} // 关闭模板添加模态框
            getTemplateConfigList={this.getTemplateConfigList} // 刷新表格
            // closeAddDataVisibleModal={this.closeAddDataVisibleModal} // 题目添加完毕关闭'题目添加'模态框
          />
          :
          ''
        }
      </div>
    );
  }
}
