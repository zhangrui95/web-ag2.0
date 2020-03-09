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
import EvaluateHistory from '../../../components/Online/EvaluateHistory';
import ImportFileModal from '../../../components/Online/ImportFileModal';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import {routerRedux} from "dva/router";
import sign from '@/assets/common/sign.png';


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
    showDataView:true,
  };


  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  // 实时测评和测评历史切换
  changeListPageHeader = () => {
    const {showDataView} = this.state;
    this.setState({
      showDataView: !showDataView,
    });
  };

  render() {
    const {showDataView} = this.state;
    const {form: {getFieldDecorator}, common: {FbdwTypeData, ZllxTypeData}} = this.props;
    let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
    // console.log('dark',this.props)
    return (
      <div className={className}>
        <div className={styles.listPageHeader}>
          {showDataView ? (
            <a className={styles.listPageHeaderCurrent}>
              <span>●</span>实时测评
            </a>
          ) : (
            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
              测评历史
            </a>
          )}
          <span className={styles.borderCenter}>|</span>
          {showDataView ? (
            <a className={styles.UnlistPageHeaderCurrent} onClick={this.changeListPageHeader}>
              实时测评
            </a>
          ) : (
            <a className={styles.listPageHeaderCurrent}>
              <span>●</span>测评历史
            </a>
          )}
        </div>
        <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
          {/*<EvaluateHistory*/}
            {/*{...this.props}*/}
            {/*showDataView={showDataView}*/}
          {/*/>*/}
        </div>
        <div style={showDataView ? {display: 'block'} : {display: 'none'}}>
          <div className={styles.tableListForm} id="cptableListForm">
            <div className={styles.totalStyle}>
              <div className={styles.top}>
                <img src={sign} width={30} height={30} />
                  测评须知
              </div>
              <div className={styles.Explain1}>
                本着提高执法能力，规范执法水平的宗旨，定期进行执法能力测评，希望测评人员认真对待。<br/>
                题型、分值
              </div>
              <div className={styles.Explain2}>
                单选题：每题{}分，只有一个符合题意，答对得{}分，不选或答错不得分。<br/>
                多选题：每题{}分，四个选项，有两个或者两个以上符合题意，错选或者多选，不得分；少选，选对的每个选项0.5分，答对得{}分。<br/>
                简答题：根据提问，进行阐述回答。
              </div>
              <div className={styles.Label}>
                <span style={{float:'left',marginTop:'4px'}}>测评类型：</span>
                <span>
                  <Select
                    placeholder="请选择"
                    style={{width: '300px'}}
                    getPopupContainer={() => document.getElementById('cptableListForm')}
                  >
                    <Option value=''>全部</Option>
                  </Select>
                </span>
              </div>
              <div className={styles.startButton}>
                <Button type="primary" className={styles.ButtonNow}>立即测评</Button>
              </div>
              <div className={styles.time}>最新同步时间：2018年2月24日 23：05：05</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
