/*
* StatisticsDateSelect.js 统计报表日期选择区域通用组件
* author：lyp
* 20181017
* */

import React, {PureComponent} from 'react';
import {Radio, DatePicker, Select, message} from 'antd';
import moment from 'moment/moment';

const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
export default class StatisticsDateSelect extends PureComponent {
    state = {
        radioValue: '3',
        selectYear: undefined,
        selectQuarter: undefined,
    };
    // 日期改变
    dateChange = (date) => {
        const kssj = date.startOf('day').format('YYYY-MM-DD');
        const jssj = date.endOf('day').format('YYYY-MM-DD');
        const obj = {
            kssj,
            jssj,
        };
        this.props.setSelectDateValue(obj);
    };
    // weekDateChange
    weekDateChange = (date) => {
        const kssj = date.startOf('week').format('YYYY-MM-DD');
        const jssj = date.endOf('week').format('YYYY-MM-DD');
        const obj = {
            kssj,
            jssj,
        };
        this.props.setSelectDateValue(obj);
    };
    // monthDateChange
    monthDateChange = (date) => {
        const kssj = date.startOf('month').format('YYYY-MM-DD');
        const jssj = date.endOf('month').format('YYYY-MM-DD');
        const obj = {
            kssj,
            jssj,
        };
        this.props.setSelectDateValue(obj);
    };
    // 单选框改变
    radioChange = (e) => {
        this.setState({
            radioValue: e.target.value,
            selectYear: undefined,
            selectQuarter: undefined,
        });
        this.props.emptyData();
    };
    // 选择框改变
    handleChange = (value) => {
        this.setState({
            selectYear: value,
        });
        const dateValue = JSON.parse(value);
        this.props.setSelectDateValue(dateValue);
    };
    // 选择季度
    handleChangeQuarter = (value) => {
        this.setState({
            selectQuarter: value,
        });
        const dateValue = JSON.parse(value);
        this.props.setSelectDateValue(dateValue);
    };
    // 禁止选择的日期
    disabledDate = (current) => {
        const startDate = moment().subtract(1, 'years').startOf('years');
        const endDate = moment().endOf('day');
        return current && ((current > endDate) || (current < startDate));
    };
    //
    switchDateSelect = (type) => {
        const {selectYear, selectQuarter} = this.state;
        const nowYear = (new Date()).getFullYear();
        switch (type) {
            case '1': // 年报表
                return (
                    <Select
                        placeholder={this.props.placeholder ? this.props.placeholder : '请选择'}
                        value={selectYear}
                        style={{width: 145}}
                        onChange={this.handleChange}
                        getPopupContainer={() => document.getElementById(this.props.id)}
                    >
                        <Option value={`{"kssj":"${nowYear}-01-01","jssj":"${nowYear}-12-31"}`}>{nowYear}</Option>
                        <Option
                            value={`{"kssj":"${nowYear - 1}-01-01","jssj":"${nowYear - 1}-12-31"}`}>{nowYear - 1}</Option>
                    </Select>
                );
            case '2': // 月报表
                return (
                    <MonthPicker
                        allowClear={false}
                        size='default'
                        placeholder={this.props.placeholder ? this.props.placeholder : '请选择月份'}
                        disabledDate={this.disabledDate}
                        onChange={this.monthDateChange}
                        getCalendarContainer={() => document.getElementById(this.props.id)}
                    />
                );
            case '4':
                return (
                    <WeekPicker
                        allowClear={false}
                        size='default'
                        placeholder={this.props.placeholder ? this.props.placeholder : '请选择周'}
                        disabledDate={this.disabledDate}
                        onChange={this.weekDateChange}
                        getCalendarContainer={() => document.getElementById(this.props.id)}
                    />
                );
            case '5':
                return (
                    <Select
                        placeholder={this.props.placeholder ? this.props.placeholder : '请选择'}
                        value={selectQuarter}
                        style={{width: 145}}
                        onChange={this.handleChangeQuarter}
                        getPopupContainer={() => document.getElementById(this.props.id)}
                    >
                        <Option value={`{"kssj":"${nowYear}-01-01","jssj":"${nowYear}-03-31"}`}>{nowYear}第一季度</Option>
                        <Option value={`{"kssj":"${nowYear}-04-01","jssj":"${nowYear}-06-30"}`}>{nowYear}第二季度</Option>
                        <Option value={`{"kssj":"${nowYear}-07-01","jssj":"${nowYear}-09-30"}`}>{nowYear}第三季度</Option>
                        <Option value={`{"kssj":"${nowYear}-10-01","jssj":"${nowYear}-12-31"}`}>{nowYear}第四季度</Option>
                        <Option
                            value={`{"kssj":"${nowYear - 1}-01-01","jssj":"${nowYear - 1}-03-31"}`}>{nowYear - 1}第一季度</Option>
                        <Option
                            value={`{"kssj":"${nowYear - 1}-04-01","jssj":"${nowYear - 1}-06-30"}`}>{nowYear - 1}第二季度</Option>
                        <Option
                            value={`{"kssj":"${nowYear - 1}-07-01","jssj":"${nowYear - 1}-09-30"}`}>{nowYear - 1}第三季度</Option>
                        <Option
                            value={`{"kssj":"${nowYear - 1}-10-01","jssj":"${nowYear - 1}-12-31"}`}>{nowYear - 1}第四季度</Option>
                    </Select>
                );
            default: // 日报表
                return (
                    <DatePicker
                        allowClear={false}
                        defaultValue={this.props.selectDateValue.kssj ? moment(this.props.selectDateValue.kssj, dateFormat) : ''}
                        format={dateFormat}
                        placeholder={this.props.placeholder ? this.props.placeholder : '请选择日期'}
                        size='default'
                        disabledDate={this.disabledDate}
                        onChange={this.dateChange}
                        getCalendarContainer={() => document.getElementById(this.props.id)}
                    />
                );
        }
    };

    render() {
        const {radioValue} = this.state;

        return (
            <div id={this.props.id}>
                <span style={{marginLeft: '16px'}}>
                    <Radio.Group buttonStyle="solid" value={radioValue} onChange={this.radioChange}>
                        <Radio.Button value="3">日报表</Radio.Button>
                        <Radio.Button value="4">周报表</Radio.Button>
                        <Radio.Button value="2">月报表</Radio.Button>
                        <Radio.Button value="5">季报表</Radio.Button>
                        <Radio.Button value="1">年报表</Radio.Button>
                    </Radio.Group>
                </span>
                <span style={{paddingLeft: 10}}>
                    {this.switchDateSelect(radioValue)}
                </span>
            </div>
        );
    }
}
