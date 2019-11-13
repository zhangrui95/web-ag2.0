/*
* Show.js 大屏展示页面
* author：lyp
* 20180531
* */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './Show.less';
import PictorialBar from '../../components/Show/PictorialBar';
import EchartBar from '../../components/Show/EchartBar';
import DoughnutChart from '../../components/Show/DoughnutChart';
import VideoShow from '../../components/Show/VideoShow';
import EchartMap from '../../components/Show/EchartMap';
import CustomizedPie from '../../components/Show/CustomizedPie';
import InvolvedItems from '../../components/Show/InvolvedItems';

@connect(({ show, loading }) => ({
    show,
    loading: loading.models.show,
}))

export default class Show extends PureComponent {

    // componentWillMount(){
    //     var docElm = document.documentElement;
    //     //W3C
    //     if (docElm.requestFullscreen) {
    //         docElm.requestFullscreen();
    //     }
    //     //FireFox
    //     else if (docElm.mozRequestFullScreen) {
    //         docElm.mozRequestFullScreen();
    //     }
    //     //Chrome等
    //     else if (docElm.webkitRequestFullScreen) {
    //         docElm.webkitRequestFullScreen();
    //     }
    //     //IE11
    //     else if (elem.msRequestFullscreen) {
    //         docElm.msRequestFullscreen();
    //     }
    //
    // }

    state = {
        areaCode: '',
        isShowBag: false,
        isShowSawp: false,
    };

    componentDidMount() {
        // window.addEventListener('resize', this.windowOnResize)
    }

    setAreaCode = (code) => {
        this.setState({
            areaCode: code,
        });
    };

    render() {
        return (
            <div className={styles.wrap}>
                <Row className={styles.header}>
                    <Col span={9} style={{ height: '100%' }}>
                        <div className={styles.headerLeft}>
                            <div className={styles.highlight}></div>
                        </div>
                    </Col>
                    <Col span={6} style={{ height: '100%' }}>
                        <h4 style={{ textAlign: 'center' }}>{configUrl.showDataTitle}公安局案件监督管理看板</h4>
                    </Col>
                    <Col span={9} style={{ height: '100%' }}>
                        <div className={styles.headerRight}>
                            <div className={styles.highlight}></div>
                        </div>
                    </Col>
                </Row>
                <Row className={styles.wrapBody} gutter={96}>
                    <Col span={8} className={styles.fullHeight}>
                        <div className={styles.bigBlock}>
                            <div className={styles.blockHeader}>
                                <div className={styles.letfConner}></div>
                                <div className={styles.rightConner}></div>
                                <h4>办案区数据</h4>
                            </div>
                            <div className={styles.bigBlockBody}>
                                <CustomizedPie {...this.props} areaCode={this.state.areaCode}/>
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={styles.fullHeight}>
                        <EchartMap {...this.props} setAreaCode={this.setAreaCode}/>
                    </Col>
                    <Col span={8} className={styles.fullHeight}>
                        <div className={styles.smallBlock}>
                            <div className={styles.blockHeader}>
                                <div className={styles.letfConner}></div>
                                <div className={styles.rightConner}></div>
                                <h4>办案区视频</h4>
                            </div>
                            <div className={styles.smallBlockBody}>
                                <VideoShow {...this.props} areaCode={this.state.areaCode}/>
                            </div>
                        </div>
                        <div className={styles.smallBlock}>
                            <div className={styles.blockHeader}>
                                <div className={styles.letfConner}></div>
                                <div className={styles.rightConner}></div>
                                <h4>涉案物品数据</h4>
                            </div>
                            <div className={styles.smallBlockBody}>
                                <InvolvedItems {...this.props} areaCode={this.state.areaCode}/>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className={styles.wrapBodyBottom} gutter={96}>
                    <Col span={8} className={styles.fullHeight}>
                        <div className={styles.bigBlock}>
                            <div className={styles.blockHeader}>
                                <div className={styles.letfConner}></div>
                                <div className={styles.rightConner}></div>
                                <h4>案件数据</h4>
                            </div>
                            <div className={styles.bigBlockBody}>
                                <DoughnutChart {...this.props} areaCode={this.state.areaCode}/>
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={styles.fullHeight}>
                        <div className={styles.bigBlock}>
                            <div className={styles.blockHeader}>
                                <div className={styles.letfConner}></div>
                                <div className={styles.rightConner}></div>
                                <h4>刑事案件人员数据</h4>
                            </div>
                            <div className={styles.bigBlockBody}>
                                <EchartBar {...this.props} areaCode={this.state.areaCode}/>
                            </div>
                        </div>
                    </Col>
                    <Col span={8} className={styles.fullHeight}>
                        <div className={styles.bigBlock}>
                            <div className={styles.blockHeader}>
                                <div className={styles.letfConner}></div>
                                <div className={styles.rightConner}></div>
                                <h4>警情数据</h4>
                            </div>
                            <div className={styles.bigBlockBody}>
                                <PictorialBar {...this.props} areaCode={this.state.areaCode}/>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}