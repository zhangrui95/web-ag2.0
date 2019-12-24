/*
* Show.js 大屏展示页面
* author：lyp
* 20180531
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col} from 'antd';
import styles from './Show.less';
import PictorialBar from '../../components/Show/PictorialBar';
import EchartBar from '../../components/Show/EchartBar';
import DoughnutChart from '../../components/Show/DoughnutChart';

export default class Show extends PureComponent {
    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <DoughnutChart/>
            </div>
        );
    }
}
