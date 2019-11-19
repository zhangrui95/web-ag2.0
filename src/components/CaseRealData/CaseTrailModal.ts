import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Modal,
    Table,
    Divider,
    Button,
    Popconfirm,
    message,
    Icon,
    Tag,
    Tooltip,
    Row,
    Col,
    Form,
    Select,
    Upload,
    TreeSelect,
    Timeline,
    Steps,
} from 'antd';
import { routerRedux } from 'dva/router';
import { getSysAuthority } from '../../utils/authority';
import styles from './CaseTrailModal.less';
import Ellipsis from '../../components/Ellipsis';

const TreeNode = TreeSelect.TreeNode;
const { Option, OptGroup } = Select;
const { Step } = Steps;

export default class CaseTrailModal extends PureComponent {
    constructor(props) {
        super(props);
        console.log('nextProps', props);
        this.state = {
            TrackPaddingBottom1: props.TrackPaddingBottom1,
            // TrackPaddingTop:props.TrackPaddingTop,
            trailLeft: props.trailLeft,
            // TrackPaddingBottom:props.TrackPaddingBottom,
            caseDetails: props.caseDetails,
            open: '0', // 显示‘显示更多’还是‘收起更多’,默认显示更多；
        };
        if (props.caseDetails.ajzt === '受理') {
            if (props.caseDetails.xyrList.length > 0) {
                const AllLength = [];
                for (let a = 0; a < props.caseDetails.xyrList.length; a++) {
                    AllLength.push(props.caseDetails.xyrList[a].qzcsList.length);
                }
                const maxLength = AllLength.sort(function(a, b) {
                    return a - b;
                }).reverse()[0];
                if (maxLength > 5) {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: '170px',
                    };
                } else {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                    };
                }
            } else {
                this.state = {
                    TrackPaddingTop: '90px',
                    TrackPaddingBottom: '0px',
                };
            }
        } else if (props.caseDetails.ajzt === '立案') {
            if (props.caseDetails.xyrList.length > 0) {
                const AllLength = [];
                for (let a = 0; a < props.caseDetails.xyrList.length; a++) {
                    AllLength.push(props.caseDetails.xyrList[a].qzcsList.length);
                }
                const maxLength = AllLength.sort(function(a, b) {
                    return a - b;
                }).reverse()[0];
                if (maxLength > 5) {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: '170px',
                    };
                } else {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                    };
                }
            } else {
                this.state = {
                    TrackPaddingTop: '90px',
                    TrackPaddingBottom: '0px',
                };
            }
        } else if (props.caseDetails.ajzt === '破案') {
            if (props.caseDetails.xyrList.length > 0) {
                const AllLength = [];
                for (let a = 0; a < props.caseDetails.xyrList.length; a++) {
                    AllLength.push(props.caseDetails.xyrList[a].qzcsList.length);
                }
                const maxLength = AllLength.sort(function(a, b) {
                    return a - b;
                }).reverse()[0];
                if (maxLength > 5) {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: '170px',
                    };
                } else {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                    };
                }
            } else {
                this.state = {
                    TrackPaddingTop: '90px',
                    TrackPaddingBottom: '0px',
                };
            }
        } else if (props.caseDetails.ajzt === '结案') {
            if (props.caseDetails.xyrList.length > 0) {
                const AllLength = [];
                for (let a = 0; a < props.caseDetails.xyrList.length; a++) {
                    AllLength.push(props.caseDetails.xyrList[a].qzcsList.length);
                }
                const maxLength = AllLength.sort(function(a, b) {
                    return a - b;
                }).reverse()[0];
                if (maxLength > 5) {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: '170px',
                    };
                } else {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                    };
                }
            } else {
                this.state = {
                    TrackPaddingTop: '90px',
                    TrackPaddingBottom: '0px',
                };
            }
        } else if (props.caseDetails.ajzt === '销案') {
            if (props.caseDetails.xyrList.length > 0) {
                const AllLength = [];
                for (let a = 0; a < props.caseDetails.xyrList.length; a++) {
                    AllLength.push(props.caseDetails.xyrList[a].qzcsList.length);
                }
                const maxLength = AllLength.sort(function(a, b) {
                    return a - b;
                }).reverse()[0];
                if (maxLength > 5) {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: '170px',
                        TrackPaddingBottom1: '220px',
                    };
                } else {
                    this.state = {
                        TrackPaddingTop: '150px',
                        TrackPaddingBottom: (maxLength - 2) * 60 - 40,
                    };
                }
            } else {
                this.state = {
                    TrackPaddingTop: '90px',
                    TrackPaddingBottom: '0px',
                };
            }
        }
    }

    // componentWillReceiveProps(nextProps) {
    //   console.log('nextProps',nextProps);
    //   this.setState({
    //     TrackPaddingBottom1: nextProps.TrackPaddingBottom1,
    //     TrackPaddingTop:nextProps.TrackPaddingTop,
    //     trailLeft:nextProps.trailLeft,
    //     TrackPaddingBottom:nextProps.TrackPaddingBottom,
    //   })
    // }
    openMore = (maxLength, ajzt) => {
        if (ajzt === '受理') {
            this.setState({
                TrackPaddingBottom: (60 * (maxLength - 1) - 70),
                TrackPaddingBottom1: (60 * (maxLength - 2) + 40),
                open: '1',
            });
        } else if (ajzt === '立案') {
            this.setState({
                TrackPaddingBottom: (60 * (maxLength - 1) - 70),
                TrackPaddingBottom1: (60 * (maxLength - 2) + 40),
                open: '1',
            });
        } else if (ajzt === '破案') {
            this.setState({
                TrackPaddingBottom: (60 * (maxLength - 1) - 70),
                TrackPaddingBottom1: (60 * (maxLength - 2) + 40),
                open: '1',
            });
        } else if (ajzt === '结案') {
            this.setState({
                TrackPaddingBottom: (60 * (maxLength - 1) - 70),
                TrackPaddingBottom1: (60 * (maxLength - 2) + 40),
                open: '1',
            });
        } else if (ajzt === '销案') {
            this.setState({
                TrackPaddingBottom: (60 * (maxLength - 1) - 70),
                TrackPaddingBottom1: (60 * (maxLength - 2) + 40),
                open: '1',
            });
        }
    };
    closeMore = (ajzt) => {
        if (ajzt === '受理') {
            this.setState({
                TrackPaddingBottom: '170px',
                TrackPaddingBottom1: '220px',
                open: '0',
            });
        } else if (ajzt === '立案') {
            this.setState({
                TrackPaddingBottom: '170px',
                TrackPaddingBottom1: '220px',
                open: '0',
            });
        } else if (ajzt === '破案') {
            this.setState({
                TrackPaddingBottom: '170px',
                TrackPaddingBottom1: '220px',
                open: '0',
            });
        } else if (ajzt === '结案') {
            this.setState({
                TrackPaddingBottom: '170px',
                TrackPaddingBottom1: '220px',
                open: '0',
            });
        } else if (ajzt === '销案') {
            this.setState({
                TrackPaddingBottom: '170px',
                TrackPaddingBottom1: '220px',
                open: '0',
            });
        }
    };

    extraBottomTitle(text, caseDetails) {
        return (
            <div className={styles.personFiles}>
                <div className={styles.TopPersonFiles}>
                    <Row>
                        <Col md={7} sm={24}>
                            <div style={{
                                textAlign: 'center',
                                borderRadius: 50,
                                backgroundColor: '#1388BA',
                                width: 85,
                                height: 85,
                                marginLeft: 10,
                                color: '#fff',
                                lineHeight: '85px',
                                fontSize: '24px',
                            }}>
                                涉案
                            </div>
                        </Col>
                        <Col md={17} sm={24} style={{ paddingLeft: '12px' }}>
                            <Row style={{ textAlign: 'left', padding: '5px 0' }}>
                                <Col md={18} sm={24}>
                                    姓名：{text.xyrName}
                                </Col>
                                {/*<Col md={6} sm={24}>*/}
                                {/*<a onClick={() => this.openPersonDetail(text.sfzh, text.xyrName, text.xyrId)}>人员档案</a>*/}
                                {/*</Col>*/}
                            </Row>
                            <div style={{ textAlign: 'left', padding: '5px 0' }}>
                                性别：{text.sex}
                            </div>
                            <div className={styles.CdCard}>
                                证件号：{text.sfzh}
                            </div>
                        </Col>
                    </Row>
                </div>
                {/*<div className={styles.sawpSee} onClick={() => this.IntoArea(text.sfzh, text.ajbh)}>在区情况</div>*/}
            </div>
        );
    };

    extraBottomDescription(text, caseDetails) {
        const newArrayText = [];
        const newQczsList = [...text.qzcsList];
        if (text.qzcsList.length > 5) {
            newArrayText.push(newQczsList.slice(0, 5));
            console.log('newArrayText', newArrayText);
            console.log('open', this.state);
            return (
                <div className={styles.AllTimeLine}>
                    {this.state.open === '0' ?
                        <Timeline>
                            {newArrayText[0].map((pane) =>
                                <Timeline.Item>
                                    <div className={styles.IndexTitle}>
                                        <span className={styles.TimeLineStyle}/>
                                        <span className={styles.spanTitle}>{pane.qzcsName}</span>
                                        <span className={styles.spanTitle}>{pane.qzcsTime}</span>
                                    </div>
                                </Timeline.Item>,
                            )}
                        </Timeline>
                        :
                        <Timeline>
                            {text.qzcsList.map((pane) =>
                                <Timeline.Item>
                                    <div className={styles.IndexTitle}>
                                        <span className={styles.TimeLineStyle}/>
                                        <span className={styles.spanTitle}>{pane.qzcsName}</span>
                                        <span className={styles.spanTitle}>{pane.qzcsTime}</span>
                                    </div>
                                </Timeline.Item>,
                            )}
                        </Timeline>
                    }
                    <span className={styles.DetailRightline1}/>
                    {/*{this.state.open === '0' ?*/}
                    {/*<a style={{color: '#2095FF'}} onClick={()=>this.openMore(text.qzcsList,caseDetails.ajzt)}>加载更多...</a>*/}
                    {/*:*/}
                    {/*<a style={{color: '#2095FF'}} onClick={()=>this.closeMore(caseDetails.ajzt)}>收起更多...</a>*/}
                    {/*}*/}
                </div>
            );
        } else {
            return (
                <div className={styles.AllTimeLine}>
                    <Timeline>
                        {text.qzcsList.map((pane) =>
                            <Timeline.Item>
                                <div className={styles.IndexTitle}>
                                    <span className={styles.TimeLineStyle}/>
                                    <span className={styles.spanTitle}>{pane.qzcsName}</span>
                                    <span className={styles.spanTitle}>{pane.qzcsTime}</span>
                                </div>
                            </Timeline.Item>,
                        )}
                    </Timeline>
                    <span className={styles.DetailRightline1}/>
                </div>
            );
        }
    }

    // 轨迹左右切换
    trailLeftClick = (newObjWidth, num) => {
        if (newObjWidth === 1280) {
            if (this.state.trailLeft + 400 >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + 400,
                    colortrailleft: 'blue',
                    colortrailright: 'blue',
                });
            }
        } else if (newObjWidth === 1600) {
            if (this.state.trailLeft + (350 * 2) >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + (350 * 2),
                    colortrailleft: 'blue',
                    colortrailright: 'blue',
                });
            }
        } else if (newObjWidth === 1680) {
            if (this.state.trailLeft + (390 * 2) >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + (390 * 2),
                    colortrailleft: 'blue',
                    colortrailright: 'blue',
                });
            }
        } else if (newObjWidth === 1920) {
            if (this.state.trailLeft + (340 * 3) >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + (340 * 3),
                    colortrailleft: 'blue',
                    colortrailright: 'blue',
                });
            }
        }
    };
    trailRightClick = (newObjWidth, num) => {
        if (newObjWidth === 1280) {
            if (num > 1) {
                if (this.state.trailLeft - 400 <= -(400 * (num - 1))) {
                    this.setState({
                        trailLeft: -(400 * (num - 1)),
                        colortrailright: 'gray',
                        colortrailleft: 'blue',
                    });
                    // message.info('已经到达最末端');
                } else {
                    this.setState({
                        colortrailright: 'blue',
                        colortrailleft: 'blue',
                        trailLeft: this.state.trailLeft - 400,
                    });
                }
            } else {
                this.setState({
                    colortrailright: 'gray',
                    colortrailleft: 'blue',
                });
                // message.info('已经到达最末端');
            }
        } else if (newObjWidth === 1600) {
            if (num > 2) {
                if (this.state.trailLeft - (350 * 2) <= -(350 * (num - 2))) {
                    this.setState({
                        trailLeft: -(350 * (num - 2)),
                        colortrailright: 'gray',
                        colortrailleft: 'blue',
                    });
                    // message.info('已经到达最末端');
                } else {
                    this.setState({
                        colortrailright: 'blue',
                        colortrailleft: 'blue',
                        trailLeft: this.state.trailLeft - (350 * 2),
                    });
                }
            } else {
                this.setState({
                    colortrailright: 'gray',
                    colortrailleft: 'blue',
                });
                // message.info('已经到达最末端');
            }
        } else if (newObjWidth === 1680) {
            if (num > 2) {
                if (this.state.trailLeft - (390 * 2) <= -(390 * (num - 2))) {
                    this.setState({
                        trailLeft: -(390 * (num - 2)),
                        colortrailright: 'gray',
                        colortrailleft: 'blue',
                    });
                    // message.info('已经到达最末端');
                } else {
                    this.setState({
                        colortrailright: 'blue',
                        colortrailleft: 'blue',
                        trailLeft: this.state.trailLeft - (390 * 2),
                    });
                }
            } else {
                this.setState({
                    colortrailright: 'gray',
                    colortrailleft: 'blue',
                });
                // message.info('已经到达最末端');
            }
        } else if (newObjWidth === 1920) {
            if (num > 3) {
                if (this.state.trailLeft - (340 * 3) <= -(340 * (num - 3))) {
                    this.setState({
                        trailLeft: -(340 * (num - 3)),
                        colortrailright: 'gray',
                        colortrailleft: 'blue',
                    });
                    // message.info('已经到达最末端');
                } else {
                    this.setState({
                        colortrailright: 'blue',
                        colortrailleft: 'blue',
                        trailLeft: this.state.trailLeft - (340 * 3),
                    });
                }
            } else {
                this.setState({
                    colortrailright: 'gray',
                    colortrailleft: 'blue',
                });
                // message.info('已经到达最末端');
            }
        }
    };
    AllButton = (newObjWidth, length) => {
        if (newObjWidth === 1280) {
            if (length > 1) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        {this.state.colortrailleft === 'blue' ?
                            <img src='/images/left.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}
                                 style={{ cursor: 'pointer' }}/>
                            :
                            <img src='/images/left1.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}/>
                        }
                        {this.state.colortrailright === 'blue' ?
                            <img src='/images/right.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px', cursor: 'pointer' }}/>
                            :
                            <img src='/images/right1.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px' }}/>
                        }

                    </div>
                );
            } else if (length === 1) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        <img src='/images/left1.png' width='60' height='60'/>
                        <img src='/images/right1.png' width='60' height='60' style={{ marginLeft: '30px' }}/>
                    </div>
                );
            }
        } else if (newObjWidth === 1600) {
            if (length > 2) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        {this.state.colortrailleft === 'blue' ?
                            <img src='/images/left.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}
                                 style={{ cursor: 'pointer' }}/>
                            :
                            <img src='/images/left1.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}/>
                        }
                        {this.state.colortrailright === 'blue' ?
                            <img src='/images/right.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px', cursor: 'pointer' }}/>
                            :
                            <img src='/images/right1.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px' }}/>
                        }
                    </div>
                );
            } else if (length < 2) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        <img src='/images/left1.png' width='60' height='60'/>
                        <img src='/images/right1.png' width='60' height='60' style={{ marginLeft: '30px' }}/>
                    </div>
                );
            }
        } else if (newObjWidth === 1680) {
            if (length > 2) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        {this.state.colortrailleft === 'blue' ?
                            <img src='/images/left.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}
                                 style={{ cursor: 'pointer' }}/>
                            :
                            <img src='/images/left1.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}/>
                        }
                        {this.state.colortrailright === 'blue' ?
                            <img src='/images/right.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px', cursor: 'pointer' }}/>
                            :
                            <img src='/images/right1.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px' }}/>
                        }
                    </div>
                );
            } else if (length < 2) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        <img src='/images/left1.png' width='60' height='60'/>
                        <img src='/images/right1.png' width='60' height='60' style={{ marginLeft: '30px' }}/>
                    </div>
                );
            }
        } else if (newObjWidth === 1920) {
            if (length > 3) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        {this.state.colortrailleft === 'blue' ?
                            <img src='/images/left.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}
                                 style={{ cursor: 'pointer' }}/>
                            :
                            <img src='/images/left1.png' width='60' height='60'
                                 onClick={() => this.trailLeftClick(newObjWidth, length)}/>
                        }
                        {this.state.colortrailright === 'blue' ?
                            <img src='/images/right.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px', cursor: 'pointer' }}/>
                            :
                            <img src='/images/right1.png' width='60' height='60'
                                 onClick={() => this.trailRightClick(newObjWidth, length)}
                                 style={{ marginLeft: '30px' }}/>
                        }
                    </div>
                );
            } else if (length <= 3) {
                return (
                    <div className={styles.IconStyle} style={{ width: '210px', top: '160px' }}>
                        <img src='/images/left1.png' width='60' height='60'/>
                        <img src='/images/right1.png' width='60' height='60' style={{ marginLeft: '30px' }}/>
                    </div>
                );
            }
        }
    };

    timeline(caseDetails, ajzt) {
        const newQzcsListLength = [];
        const xyrListLength = caseDetails.xyrList;
        let maxLength;
        for (let a = 0; a < xyrListLength.length; a++) {
            const qzcsListLength = xyrListLength[a].qzcsList.length;
            if (qzcsListLength > 0) {
                newQzcsListLength.push(qzcsListLength);
            } else {
                maxLength = 0;
            }
        }
        newQzcsListLength.sort(function(a, b) {
            return a - b;
        });
        maxLength = newQzcsListLength[newQzcsListLength.length - 1];
        if (ajzt) {
            if (ajzt === '受理') {
                return (
                    <Timeline className={styles.TimelineAllsa} style={{ position: 'relative' }}>
                        <Timeline.Item>
                            <span className={styles.timeline}>
                                <span className={styles.spanTitle}>案件受理</span>
                                <span className={styles.spanTitle}>{caseDetails.sarq}</span>
                            </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                            <div className={styles.timeline}>
                                <span className={styles.spanTitle}>立案侦查</span>
                                <span className={styles.spanTitle}>{caseDetails.larq}</span>
                                <span className={styles.DetailLineIcon1}/>
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                    <span>
                    <span className={styles.DetailLeftline}/>
                    <span className={styles.DetailLineIcon}/>
                  </span>
                                    :
                                    ''
                                }
                                <div className={styles.listStyle}
                                     style={{ paddingBottom: this.state.TrackPaddingBottom1 }}>
                                    {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                        <div>
                                            <Steps progressDot className={styles.trailsteps}
                                                   style={{ left: this.props.trailLeft }}
                                                   current={caseDetails.xyrList.length}>
                                                {
                                                    caseDetails.xyrList.map((text) =>
                                                        <Step title={this.extraBottomTitle(text, caseDetails)}
                                                              description={this.extraBottomDescription(text, caseDetails)}/>,
                                                    )
                                                }
                                            </Steps>
                                            {
                                                maxLength > 5 ?
                                                    (this.state.open === '0' ?
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.openMore(maxLength, caseDetails.ajzt)}>加载更多...</a>
                                                            :
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.closeMore(caseDetails.ajzt)}>收起更多...</a>
                                                    )
                                                    :
                                                    ''
                                            }

                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>案件侦破</span>
                            <span className={styles.spanTitle}>{caseDetails.parq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>侦查终结</span>
                            <span className={styles.spanTitle}>{caseDetails.jarq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>撤销案件</span>
                            <span className={styles.spanTitle}>{caseDetails.xarq}</span>
                          </span>
                        </Timeline.Item>
                    </Timeline>
                );
            } else if (ajzt === '立案') {
                return (
                    <Timeline className={styles.TimelineAllla}>
                        <Timeline.Item>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>案件受理</span>
                            <span className={styles.spanTitle}>{caseDetails.sarq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item>
                            <div className={styles.timeline}>
                                <span className={styles.spanTitle}>立案侦查</span>
                                <span className={styles.spanTitle}>{caseDetails.larq}</span>
                                <span className={styles.DetailLineIcon1} style={{ top: '7px' }}/>
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                    <span>
                                    <span className={styles.DetailLeftline}/>
                                    <span className={styles.DetailLineIcon}/>
                                  </span>
                                    :
                                    ''
                                }
                                <div className={styles.listStyle}
                                     style={{ paddingBottom: this.state.TrackPaddingBottom1 }}>
                                    {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                        <div>
                                            <Steps progressDot className={styles.trailsteps}
                                                   style={{ left: this.props.trailLeft }}
                                                   current={caseDetails.xyrList.length}>
                                                {
                                                    caseDetails.xyrList.map((text) =>
                                                        <Step title={this.extraBottomTitle(text, caseDetails)}
                                                              description={this.extraBottomDescription(text, caseDetails)}/>,
                                                    )
                                                }
                                            </Steps>
                                            {
                                                maxLength > 5 ?
                                                    (this.state.open === '0' ?
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.openMore(maxLength, caseDetails.ajzt)}>加载更多...</a>
                                                            :
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.closeMore(caseDetails.ajzt)}>收起更多...</a>
                                                    )
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                            <span className={styles.timeline}>
                              <span className={styles.spanTitle}>案件侦破</span>
                              <span className={styles.spanTitle}>{caseDetails.parq}</span>
                            </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>侦查终结</span>
                            <span className={styles.spanTitle}>{caseDetails.jarq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>撤销案件</span>
                            <span className={styles.spanTitle}>{caseDetails.xarq}</span>
                          </span>
                        </Timeline.Item>
                    </Timeline>
                );
            } else if (ajzt === '破案') {
                return (
                    <Timeline className={styles.TimelineAllpa}>
                        <Timeline.Item>
                <span className={styles.timeline}>
                  <span className={styles.spanTitle}>案件受理</span>
                  <span className={styles.spanTitle}>{caseDetails.sarq}</span>
                </span>
                        </Timeline.Item>
                        <Timeline.Item>
                            <div className={styles.timeline}>
                                <span className={styles.spanTitle}>立案侦查</span>
                                <span className={styles.spanTitle}>{caseDetails.larq}</span>
                                <span className={styles.DetailLineIcon1} style={{ top: '69px' }}/>
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                    <span>
                    <span className={styles.DetailLeftline}/>
                    <span className={styles.DetailLineIcon}/>
                  </span>
                                    :
                                    ''
                                }
                                <div className={styles.listStyle}
                                     style={{ paddingBottom: this.state.TrackPaddingBottom1 }}>
                                    {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                        <div>
                                            <Steps progressDot className={styles.trailsteps}
                                                   style={{ left: this.props.trailLeft }}
                                                   current={caseDetails.xyrList.length}>
                                                {
                                                    caseDetails.xyrList.map((text) =>
                                                        <Step title={this.extraBottomTitle(text, caseDetails)}
                                                              description={this.extraBottomDescription(text, caseDetails)}/>,
                                                    )
                                                }
                                            </Steps>
                                            {
                                                maxLength > 5 ?
                                                    (this.state.open === '0' ?
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.openMore(maxLength, caseDetails.ajzt)}>加载更多...</a>
                                                            :
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.closeMore(caseDetails.ajzt)}>收起更多...</a>
                                                    )
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item>
              <span className={styles.timeline}>
                  <span className={styles.spanTitle}>案件侦破</span>
                  <span className={styles.spanTitle}>{caseDetails.parq}</span>
              </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
              <span className={styles.timeline}>
                <span className={styles.spanTitle}>侦查终结</span>
                <span className={styles.spanTitle}>{caseDetails.jarq}</span>
              </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
              <span className={styles.timeline}>
                <span className={styles.spanTitle}>撤销案件</span>
                <span className={styles.spanTitle}>{caseDetails.xarq}</span>
              </span>
                        </Timeline.Item>
                    </Timeline>
                );
            } else if (ajzt === '结案') {
                return (
                    <Timeline className={styles.TimelineAllja}>
                        <Timeline.Item>
              <span className={styles.timeline}>
                <span className={styles.spanTitle}>案件受理</span>
                <span className={styles.spanTitle}>{caseDetails.sarq}</span>
              </span>
                        </Timeline.Item>
                        <Timeline.Item>
                            <div className={styles.timeline}>
                                <span className={styles.spanTitle}>立案侦查</span>
                                <span className={styles.spanTitle}>{caseDetails.larq}</span>
                                <span className={styles.DetailLineIcon1} style={{ top: '131px' }}/>
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                    <span>
                    <span className={styles.DetailLeftline}/>
                    <span className={styles.DetailLineIcon}/>
                  </span>
                                    :
                                    ''
                                }
                                <div className={styles.listStyle}
                                     style={{ paddingBottom: this.state.TrackPaddingBottom1 }}>
                                    {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                        <div>
                                            <Steps progressDot className={styles.trailsteps}
                                                   style={{ left: this.props.trailLeft }}
                                                   current={caseDetails.xyrList.length}>
                                                {
                                                    caseDetails.xyrList.map((text) =>
                                                        <Step title={this.extraBottomTitle(text, caseDetails)}
                                                              description={this.extraBottomDescription(text, caseDetails)} /*className={styles.stepStyles}*/ />,
                                                    )
                                                }
                                            </Steps>
                                            {
                                                maxLength > 5 ?
                                                    (this.state.open === '0' ?
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.openMore(maxLength, caseDetails.ajzt)}>加载更多...</a>
                                                            :
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.closeMore(caseDetails.ajzt)}>收起更多...</a>
                                                    )
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>案件侦破</span>
                            <span className={styles.spanTitle}>{caseDetails.parq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item>
                            <span className={styles.timeline}>
                                <span className={styles.spanTitle}>侦查终结</span>
                                <span className={styles.spanTitle}>{caseDetails.jarq}</span>
                            </span>
                        </Timeline.Item>
                        <Timeline.Item color='#D9D9D9'>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>撤销案件</span>
                            <span className={styles.spanTitle}>{caseDetails.xarq}</span>
                          </span>
                        </Timeline.Item>
                    </Timeline>
                );
            } else if (ajzt === '销案') {
                return (
                    <Timeline className={styles.TimelineAllxa}>
                        <Timeline.Item>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>案件受理</span>
                            <span className={styles.spanTitle}>{caseDetails.sarq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item>
                            <div className={styles.timeline}>
                                <span className={styles.spanTitle}>立案侦查</span>
                                <span className={styles.spanTitle}>{caseDetails.larq}</span>
                                <span className={styles.DetailLineIcon1} style={{ top: '193px' }}/>
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                    <span>
                                <span className={styles.DetailLeftline}/>
                                <span className={styles.DetailLineIcon}/>
                              </span>
                                    :
                                    ''
                                }
                                <div className={styles.listStyle}
                                     style={{ paddingBottom: this.state.TrackPaddingBottom1 }}>
                                    {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                                        <div>
                                            <Steps progressDot className={styles.trailsteps}
                                                   style={{ left: this.props.trailLeft }}
                                                   current={caseDetails.xyrList.length}>
                                                {
                                                    caseDetails.xyrList.map((text) =>
                                                        <Step title={this.extraBottomTitle(text, caseDetails)}
                                                              description={this.extraBottomDescription(text, caseDetails)}/>,
                                                    )
                                                }
                                            </Steps>
                                            {
                                                maxLength > 5 ?
                                                    (this.state.open === '0' ?
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.openMore(maxLength, caseDetails.ajzt)}>加载更多...</a>
                                                            :
                                                            <a style={{
                                                                color: '#2095FF',
                                                                position: 'absolute',
                                                                bottom: '0px',
                                                                left: '50%',
                                                            }}
                                                               onClick={() => this.closeMore(caseDetails.ajzt)}>收起更多...</a>
                                                    )
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>案件侦破</span>
                            <span className={styles.spanTitle}>{caseDetails.parq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item>
                          <span className={styles.timeline}>
                            <span className={styles.spanTitle}>侦查终结</span>
                            <span className={styles.spanTitle}>{caseDetails.jarq}</span>
                          </span>
                        </Timeline.Item>
                        <Timeline.Item>
                            <span className={styles.timeline}>
                                <span className={styles.spanTitle}>撤销案件</span>
                                <span className={styles.spanTitle}>{caseDetails.xarq}</span>
                            </span>
                        </Timeline.Item>
                    </Timeline>
                );
            } else if (ajzt === '未受理') {
                return (
                    <div className={styles.noAccept}>案件处于未受理状态，暂无轨迹</div>
                );
            }
        } else {

        }

    }

    detail() {
        console.log('TrackPaddingBottom', this.state.TrackPaddingBottom);
        const { caseDetails, newObjWidth } = this.props;
        const { TrackPaddingBottom, TrackPaddingTop } = this.state;
        return (
            <div className={styles.message} style={{ paddingBottom: TrackPaddingBottom, paddingTop: TrackPaddingTop }}>
                {this.timeline(caseDetails, (caseDetails && caseDetails.ajzt ? caseDetails.ajzt : ''))}
                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ?
                    <div>
                        {this.AllButton(newObjWidth, caseDetails.xyrList.length)}
                    </div>
                    :
                    ''
                }
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.detail()}
            </div>
        );
    }
}
