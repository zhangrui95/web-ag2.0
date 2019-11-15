/*
* RegulatePanel.js 监管面板页面
* author：lyp
* 20180623
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    DatePicker,
    Card,
    Table,
    Tag,
    Tooltip,
    Divider,
    message,
    Tabs,
    Form, Select, Dropdown, Menu, TreeSelect,
} from 'antd';
import Home1 from './Home1';
import Home2 from './Home2';

@connect(({ home, share, common }) => ({
    home, share, common,
}))
@Form.create()

export default class RegulatePanel extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {/*{*/}
                {/*    window.configUrl.clearHome ? <Home2/> : <Home1/>*/}
                {/*}*/}
            </div>
        );
    }
}
