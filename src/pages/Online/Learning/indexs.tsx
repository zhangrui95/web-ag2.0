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
  Card
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';


const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({policeData, loading, common, global}) => ({
  policeData, loading, common, global
  // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {

  };


  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    return (
      <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>
        在线学习
      </div>
    );
  }
}
