/*
* DataViewButtonArea.js 统计图表通用头部查询区域
* author：lyp
* 20190521
* */

import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, TreeSelect, Input, Button, DatePicker, Popover, Icon, message, Cascader } from 'antd';
import moment from 'moment/moment';
import style from './DataViewButtonArea.less';

const { RangePicker } = DatePicker;

export default class DataViewButtonArea extends PureComponent {
    state = {
        popoverVisible: false,
    };
    handleRangePickerChange = (val) => {
        const sTime = moment(val[0]).format('YYYY-MM-DD');
        const eTime = moment(val[1]).format('YYYY-MM-DD');
        this.props.setSelectedDate([sTime, eTime]);
        this.setState({
            popoverVisible: false,
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
    handlePopoverVisibleChange = (visible) => {
        this.setState({
            popoverVisible: visible,
        });
    };

    render() {
        const { styles, typeButtons, changeTypeButtons, disabledDate, depTree, renderloop, showDataView, hideDayButton, hideWeekButton, hideMonthButton, isPolice, treeDefaultExpandedKeys } = this.props;
        const { popoverVisible } = this.state;
        const screeWidth = document.body.offsetWidth;
        return (
            <div className={styles.typeButtonsArea} style={showDataView ? {} : { position: 'absolute', zIndex: -1 }}>
                {
                    isPolice ? (
                        <span>
                            <span style={{ paddingRight: 50 }}>
                                <span>管辖单位：</span>
                                <span>
                                    <TreeSelect
                                        showSearch
                                        style={{ width: screeWidth > 1690 ? 365 : 220 }}
                                        // value={this.state.value}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="请选择机构"
                                        allowClear
                                        key='jjSelect'
                                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                                        onChange={this.jJTreeSelectChange}
                                        treeNodeFilterProp="title"
                                    >
                                        {depTree && depTree.length > 0 ? renderloop(depTree) : null}
                                    </TreeSelect>
                                </span>
                            </span>
                            <span style={{ paddingRight: 50 }}>
                                <span>处警单位：</span>
                                <span>
                                    <TreeSelect
                                        showSearch
                                        style={{ width: screeWidth > 1690 ? 365 : 220 }}
                                        // value={this.state.value}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="请选择机构"
                                        allowClear
                                        key='cjSelect'
                                        treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                                        onChange={this.cJTreeSelectChange}
                                        treeNodeFilterProp="title"
                                    >
                                        {depTree && depTree.length > 0 ? renderloop(depTree) : null}
                                    </TreeSelect>
                                </span>
                            </span>
                        </span>
                    ) : (
                        <span style={{ paddingRight: 50 }}>
                            <span>机构：</span>
                            <span>
                                <TreeSelect
                                    showSearch
                                    style={{ width: 365 }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择机构"
                                    allowClear
                                    key='jgSelect'
                                    onChange={this.handleTreeSelectChange}
                                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                >
                                    {depTree && depTree.length > 0 ? renderloop(depTree) : null}
                                </TreeSelect>
                            </span>
                        </span>
                    )
                }

                {
                    hideDayButton ? null : <Button type="primary" shape="circle" ghost={typeButtons !== 'day'} className={style.btnRadius}
                                                   onClick={() => changeTypeButtons('day')}>日</Button>
                }
                {
                    hideWeekButton ? null : <Button type="primary" shape="circle" ghost={typeButtons !== 'week'} className={style.btnRadius}
                                                    onClick={() => changeTypeButtons('week')}>周</Button>
                }
                {
                    hideMonthButton ? null : <Button type="primary" shape="circle" ghost={typeButtons !== 'month'} className={style.btnRadius}
                                                     onClick={() => changeTypeButtons('month')}>月</Button>
                }

                <Popover
                    content={
                        <RangePicker
                            disabledDate={disabledDate}
                            style={{ width: '200' }}
                            onChange={this.handleRangePickerChange}
                        />
                    }
                    placement="bottomRight"
                    trigger="click"
                    visible={popoverVisible}
                    onVisibleChange={this.handlePopoverVisibleChange}
                >
                    <Button style={{ borderRadius: 30, width: 50 }} type="primary" className={style.btnRadius}
                            ghost={typeButtons !== 'selectedDate'}>其他</Button>
                </Popover>


            </div>
        );
    }
}
