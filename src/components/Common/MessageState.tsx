/*
* MessageState.js 消息状态---多下拉框
* author：lyp
* 20190308
* */

import React, {Component} from 'react';
import {Select, Icon, Table, Row, Col, Form} from 'antd';
import {connect} from "dva";

const {Option} = Select;

class MessageState extends Component {

    state = {
        disableRectification: true, // 禁用整改完毕下拉框
    };

    componentWillReceiveProps(nextProps) {
        // if(nextProps && nextProps.value !== this.props.value ){
        //     if(nextProps.value.dbzt === '00' &&  nextProps.value.zgzt === ''){ // 点击重置按钮时，禁用整改完毕状态下拉框
        //         this.setState({
        //             disableRectification: true,
        //         })
        //     }
        //
        // }
        if (nextProps) {
            if (nextProps.value.dbzt !== this.props.value.dbzt) {
                this.handleSuperviseStatusChange(nextProps.value.dbzt);
            }
        }
    }

    handleRectificationStatusChange = (zgzt) => {
        this.triggerChange({zgzt});
    };

    handleSuperviseStatusChange = (dbzt) => {
        let disabledRect = true;
        if (dbzt === '99') { // 当督办状态code为99（整改完成），开启整改完毕下拉框，否则关闭下拉框
            disabledRect = false;
        }
        this.setState({
            disableRectification: disabledRect,
        });
        this.triggerChange({dbzt, zgzt: ''});
    };

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.props.value, changedValue));
        }
    };


    render() {
        const {value: {dbzt, zgzt}, superviseStatusOptions, rectificationStatusOptions, newId} = this.props;
        const {disableRectification} = this.state;
        const divStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 4,
        };
        return (
            <div style={divStyle}>
                <Select
                    value={dbzt}
                    style={{width: '55%', textAlign: 'left'}}
                    onChange={this.handleSuperviseStatusChange}
                    getPopupContainer={() => document.getElementById(newId)}
                >
                    <Option value="">全部</Option>
                    {superviseStatusOptions}
                </Select>
                <Select
                    value={zgzt}
                    style={{width: '40%', textAlign: 'right'}}
                    disabled={disableRectification}
                    onChange={this.handleRectificationStatusChange}
                    getPopupContainer={() => document.getElementById(newId)}
                >
                    <Option value="">全部</Option>
                    {rectificationStatusOptions}
                </Select>
            </div>
        );
    }
}

export default Form.create()(
    connect((MySuperviseData, loading, common) => ({MySuperviseData, loading, common}))(MessageState),
);
