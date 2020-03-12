/*
* Online/EvaluateText/index.tsx 测评
* author：jhm
* 20200309
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
import StartExamModal from '../../../components/Online/StartExamModal';
import EvaluateHistory from '../../../components/Online/EvaluateHistory';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import {routerRedux} from "dva/router";
import sign from '@/assets/common/sign.png';
import signw from '@/assets/common/signw.png';


const confirm = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({StartEvaluation,common,global}) => ({
  StartEvaluation,common,global,
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    showDataView:true, // 实时测评和测评历史切换
    StartExamVisible:false, // 开始测评模态框
    TextLabel:[], // 测评类型
    TextRules:{}, // 测评须知
  };


  componentDidMount() {
    this.getEvaluateLabel(); // 获取测评类型及须知
  }

  componentWillReceiveProps(nextProps) {

  }

  // 获取测评类型及须知
  getEvaluateLabel = () => {
    this.props.dispatch({
      type:'StartEvaluation/getEvaluateLabel',
      payload:{},
      callback:(data)=>{
        if(data){
          this.setState({
            TextLabel:data.list,
          })
        }
      }
    })
  };

  // 实时测评和测评历史切换
  changeListPageHeader = () => {
    const {showDataView} = this.state;
    this.setState({
      showDataView: !showDataView,
    });
  };

  // 立即测评
  handleSearch = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({
          StartExamVisible:true,
        })
      }
    });
  };

  // 关闭测评模态框
  handleCancel = () => {
    this.setState({
      StartExamVisible:false,
    })
  }

  // 选择测评类型对应的测评须知
  LabelChoose = (value) => {
    this.setState({
      TextRules:JSON.parse(value),
    })
  }
  render() {
    const {showDataView,StartExamVisible,TextLabel,TextRules} = this.state;
    // console.log('TextRules',TextRules);
    const {form: {getFieldDecorator}, common: {FbdwTypeData, ZllxTypeData}} = this.props;
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    const formItemLayout = {
      labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 4}},
      wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 20}},
    };
    let TextLabelDictOptions = [];
    if (TextLabel.length > 0) {
      for (let i = 0; i < TextLabel.length; i++) {
        const item = TextLabel[i];
        TextLabelDictOptions.push(
          <Option key={item.id} value={JSON.stringify(item)}>{item.cpmbzw}</Option>,
        );
      }
    }
    return (
      <div className={className}>
        <div className={styles.listPageHeader}>
          {showDataView ? (
            <a className={styles.listPageHeaderCurrent}>
              <span>●</span>实时测评
            </a>
          ) : (
            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
              实时测评
            </a>
          )}
          <span className={styles.borderCenter}>|</span>
          {showDataView ? (
            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
              测评历史
            </a>
          ) : (
            <a className={styles.listPageHeaderCurrent}>
              <span>●</span>测评历史
            </a>
          )}
        </div>
        <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
          <EvaluateHistory
            showDataView={showDataView}
            TextLabel={TextLabel}
          />
        </div>
        <div style={showDataView ? {display: 'block'} : {display: 'none'}}>
          <div className={styles.tableListForm} id="cptableListForm">
            <div className={styles.totalStyle}>
              <div className={styles.top}>
                <img src={this.props.global && this.props.global.dark ?signw:sign} width={30} height={30} />
                  测评须知
              </div>
              <div className={styles.Explain1}>
                本着提高执法能力，规范执法水平的宗旨，定期进行执法能力测评，希望测评人员认真对待。<br/>
                题型：分值
              </div>
              <div className={styles.Explain2}>
                单选题：每题{TextRules&&TextRules.dxtfz?TextRules.dxtfz:''}分，只有一个符合题意，答对得{TextRules&&TextRules.dxtfz?TextRules.dxtfz:''}分，不选或答错不得分。<br/>
                多选题：每题{TextRules&&TextRules.duoxtfz?TextRules.duoxtfz:''}分，四个选项，有两个或者两个以上符合题意，错选或者多选，不得分；少选，选对的每个选项0.5分，全部答对得{TextRules&&TextRules.duoxtfz?TextRules.duoxtfz:''}分。<br/>
                简答题：根据提问，进行阐述回答。
              </div>
              <div className={styles.Label}>
                <Form onSubmit={this.handleSearch} style={{height:'auto'}}>
                  <Row >
                    <FormItem label="测评类型" {...formItemLayout}>
                      {getFieldDecorator('cplx', {
                        rules:[{required:true,message:'请选择测评类型'}]
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: '300px'}}
                          getPopupContainer={() => document.getElementById('cptableListForm')}
                          onSelect={this.LabelChoose}
                        >
                          {/*<Option value=''>全部</Option>*/}
                          {TextLabelDictOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Row>
                  <Row>
                    <div className={styles.startButton}>
                      <Button className={styles.ButtonNow} type="primary" htmlType="submit">
                        立即测评
                      </Button>
                    </div>
                  </Row>
                </Form>
              </div>
              <div className={styles.time}>最新同步时间：2018年2月24日 23：05：05</div>
            </div>
          </div>
        </div>

        {StartExamVisible?
          <StartExamModal
            title={<div>执法能力考评</div>}
            visible={StartExamVisible}
            handleCancel={this.handleCancel} // 关闭测评模态框
            TextRules={TextRules} // 当前选中的测评模板
          />
          :
          ''
        }
      </div>
    );
  }
}
