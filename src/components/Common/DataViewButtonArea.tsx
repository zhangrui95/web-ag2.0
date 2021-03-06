/*
 * DataViewButtonArea.js 统计图表通用头部查询区域
 * author：lyp
 * 20190521
 * */

import React, {PureComponent} from 'react';
import {
    Row,
    Col,
    Form,
    Select,
    TreeSelect,
    Input,
    Button,
    DatePicker,
    Popover,
    Icon,
    message,
    Cascader,
    Radio,
    Tooltip,
    Card,
} from 'antd';
import moment from 'moment/moment';
import style from './DataViewButtonArea.less';
import {getUserInfos} from "@/utils/utils";

const {RangePicker} = DatePicker;

export default class DataViewButtonArea extends PureComponent {
    state = {
        popoverVisible: false,
        time:[],
    };
    handleRangePickerChange = val => {
        const sTime = moment(val[0]).format('YYYY-MM-DD');
        const eTime = moment(val[1]).format('YYYY-MM-DD');
        this.props.setSelectedDate([sTime, eTime]);
        this.setState({
            popoverVisible: false,
            time:val,
        });
    };
    // 接警树
    jJTreeSelectChange = (val = '') => {
        this.props.setJjdw(val);
    };
    // 处警树
    cJTreeSelectChange = (val = '') => {
        this.props.setCjdw(val);
    };
    handleTreeSelectChange = (val = '') => {
        this.props.setSelectedDep(val);
    };
    handlePopoverVisibleChange = visible => {
        this.setState({
            popoverVisible: visible,
        });
    };
    getChangeDate = (type) =>{
        this.setState({
            time:[],
        });
        this.props.changeTypeButtons(type);
    }
    render() {
        const {
            styles,
            typeButtons,
            disabledDate,
            depTree,
            renderloop,
            showDataView,
            hideDayButton,
            hideWeekButton,
            hideMonthButton,
            isPolice,
            treeDefaultExpandedKeys,
        } = this.props;
        const {popoverVisible} = this.state;
        const screeWidth = document.body.offsetWidth;
        let dark = this.props.global && this.props.global.dark;
        let pathname = this.props.location && this.props.location.pathname ? this.props.location.pathname : '';
        return (
            <div
                className={dark ? styles.typeButtonsArea : styles.typeButtonsArea + ' ' + style.lightBox}
                style={showDataView ? {} : {position: 'absolute', zIndex: -1}}
                id={"tongjiCommon" + pathname}
            >
                {isPolice ? (
                    <span>
            <span style={{paddingRight: 50}}>
              <span>管辖单位：</span>
              <span>
                <TreeSelect
                    showSearch
                    style={{width: screeWidth > 1690 ? 365 : 220}}
                    // value={this.state.value}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto', padding:'8px 0'}}
                    placeholder="请选择机构"
                    allowClear
                    key="jjSelect"
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    onChange={this.jJTreeSelectChange}
                    treeNodeFilterProp="title"
                    getPopupContainer={() => document.getElementById('tongjiCommon' + pathname)}
                    defaultValue={getUserInfos().department}
                >
                  {depTree && depTree.length > 0 ? renderloop(depTree) : []}
                </TreeSelect>
              </span>
            </span>
            <span style={{paddingRight: 50}}>
              <span>处警单位：</span>
              <span>
                <TreeSelect
                    showSearch
                    style={{width: screeWidth > 1690 ? 365 : 220}}
                    // value={this.state.value}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto', padding:'8px 0'}}
                    placeholder="请选择机构"
                    allowClear
                    key="cjSelect"
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    onChange={this.cJTreeSelectChange}
                    treeNodeFilterProp="title"
                    getPopupContainer={() => document.getElementById('tongjiCommon' + pathname)}
                    defaultValue={getUserInfos().department}
                >
                  {depTree && depTree.length > 0 ? renderloop(depTree) : []}
                </TreeSelect>
              </span>
            </span>
          </span>
                ) : (
                    <span style={{paddingRight: 50}}>
            <span>机构：</span>
            <span>
              <TreeSelect
                  showSearch
                  style={{width: 365}}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto', padding:'8px 0'}}
                  placeholder="请选择机构"
                  allowClear
                  key="jgSelect"
                  onChange={this.handleTreeSelectChange}
                  treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                  treeNodeFilterProp="title"
                  getPopupContainer={() => document.getElementById('tongjiCommon' + pathname)}
                  defaultValue={getUserInfos().department}
              >
                {depTree && depTree.length > 0 ? renderloop(depTree) : []}
              </TreeSelect>
            </span>
          </span>
                )}
                {
                    hideDayButton ? null : <Button type="primary" className={style.btnRadius + ' ' + style.btnFirst}
                                                   style={{
                                                       color: typeButtons === 'day' ? '#fff' : dark ? '#fff' : '#4d4d4d',
                                                       backgroundColor: typeButtons === 'day' ? (dark ? '#3285FF' : '#3C43DF') : (dark ? '#171925' : '#fff'),
                                                       borderRight: '1px solid #252C3C'
                                                   }} onClick={() => this.getChangeDate('day')}>日</Button>
                }
                {
                    hideWeekButton ? null :
                        <Button type="primary" className={style.btnRadius + ' ' + (hideDayButton ? style.btnFirst : '')}
                                style={{
                                    color: typeButtons === 'week' ? '#fff' : dark ? '#fff' : '#4d4d4d',
                                    backgroundColor: typeButtons === 'week' ? (dark ? '#3285FF' : '#3C43DF') : (dark ? '#171925' : '#fff'),
                                    borderRight: '1px solid #252C3C'
                                }} onClick={() => this.getChangeDate('week')}>周</Button>
                }
                {
                    hideMonthButton ? null : <Button type="primary" className={style.btnRadius} style={{
                        color: typeButtons === 'month' ? '#fff' : dark ? '#fff' : '#4d4d4d',
                        backgroundColor: typeButtons === 'month' ? (dark ? '#3285FF' : '#3C43DF') : (dark ? '#171925' : '#fff'),
                        borderRight: '1px solid #252C3C'
                    }} onClick={() => this.getChangeDate('month')}>月</Button>
                }

                <Popover
                    content={
                        <RangePicker
                            disabledDate={disabledDate}
                            style={{width: '200'}}
                            onChange={this.handleRangePickerChange}
                            getCalendarContainer={() => document.getElementById('tongjiCommon' + pathname)}
                            value={this.state.time}
                        />
                    }
                    placement="bottomRight"
                    trigger="click"
                    visible={popoverVisible}
                    onVisibleChange={this.handlePopoverVisibleChange}
                    getPopupContainer={() => document.getElementById('tongjiCommon' + pathname)}
                >
                    <Button
                        // type="primary"
                        className={style.btnRadius + ' ' + style.btnLast}
                        style={{
                            color: typeButtons === 'selectedDate' ? '#fff' : dark ? '#fff' : '#4d4d4d',
                            backgroundColor: typeButtons === 'selectedDate' ? (dark ? '#3285FF' : '#3C43DF') : (dark ? '#171925' : '#fff')
                        }}
                    >
                        其他
                    </Button>
                </Popover>
            </div>
        );
    }
}
