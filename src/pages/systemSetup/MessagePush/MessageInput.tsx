/*
* MessageInput.js 消息推送通用input框
* author：lyp
* 20190515
* */

import React, {PureComponent} from 'react';
import {Input, Switch} from 'antd';

export default class MessageInput extends PureComponent {

    state = {
        disableInput: this.props.value.sfqy,
    };

    componentWillReceiveProps(nextProps) {
// console.log('nextProps---------------------->',nextProps)
//         if(nextProps){
//             if(nextProps.value.sfqy !== this.props.value.sfqy){
//                 this.handleSwitchChange(nextProps.value.sfqy);
//             }
//         }
    }

    handleInputChange = e => {
        this.triggerChange({mData: e.target.value});
    };

    handleSwitchChange = (sfqy) => {
        this.triggerChange({sfqy: sfqy ? 1 : 0});
    };

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        const id = this.props.id;
        if (onChange) {
            const onChangObj = Object.assign({}, this.props.value, changedValue);
            onChange(onChangObj,id);
        }
    };


    render() {
        const {value: {mData, sfqy}} = this.props;
        const divStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 4,
        };
        return (
            <div style={divStyle}>
                <Input
                    style={{width: '90%', textAlign: 'left'}}
                    disabled={!sfqy}
                    value={mData}
                    onChange={this.handleInputChange}
                />
                <Switch
                    style={{width: '8%', maxWidth: '60px'}}
                    onChange={this.handleSwitchChange}
                    checked={sfqy}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                />
            </div>
        );
    }
}
