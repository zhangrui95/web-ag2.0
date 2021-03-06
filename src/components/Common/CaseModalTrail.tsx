/*
 *  CaseModalTrail.js 案件轨迹轴
 *  author：jhm
 *  20190228
 */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
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
    Steps,
    Timeline,
} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './CaseModalTrail.less';
// import PersonDetail from '../../routes/AllDocuments/PersonalDocDetail';
import left from '../../assets/common/left.png';
import left1 from '../../assets/common/left1.png';
import right from '../../assets/common/right.png';
import right1 from '../../assets/common/right1.png';
import man from '../../assets/common/man.png';
import woman from '../../assets/common/woman.png';

const {Option} = Select;
const {Step} = Steps;
@connect(({AllDetail, global}) => ({
    AllDetail, global
}))
export default class CaseModalTrail extends PureComponent {
    constructor(props) {
        super(props);
        let TrackPaddingBottom = '',
            TrackPaddingTop = '';
        if (props.caseDetails) {
            if (props.caseDetails.xyrList.length > 0) {
                const AllLength = [];
                for (let a = 0; a < props.caseDetails.xyrList.length; a++) {
                    AllLength.push(props.caseDetails.xyrList[a].qzcsList.length);
                }
                const maxLength = AllLength.sort(function (a, b) {
                    return a - b;
                }).reverse()[0];
                if (maxLength > 5) {
                    TrackPaddingBottom = 160;
                    TrackPaddingTop = 210;
                } else {
                    TrackPaddingBottom = (maxLength - 2) * 60;
                    TrackPaddingTop = 210;
                }
            } else {
                TrackPaddingBottom = 0;
                TrackPaddingTop = 90;
            }
        }
        this.state = {
            TrackPaddingBottom: TrackPaddingBottom,
            TrackPaddingTop: TrackPaddingTop,
            TrackPaddingBottom1: 220,
            trailLeft: 4,
            open: '0', // 显示‘显示更多’还是‘收起更多’,默认显示更多；
            colortrailleft: 'gray', // 左滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
            colortrailright: 'blue', // 右滑动按钮，若到达开始或者结束，是gray(置灰)，否则是blue(蓝色)(轨迹)
        };
    }

    // 根据物品案件编号和身份证号打开人员档案窗口
    openPersonDetail = (text) => {
        // console.log('text',text)
        if (text.sfzh) {
            text.xyr_sfzh = text.sfzh;
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/lawEnforcement/PersonFile/Detail',
                    query: {id: text.sfzh, record: text},
                }),
            );
        } else {
            message.error('该人员暂无人员档案');
        }
    };

    extraBottomDescription(text, caseDetails) {
        const newArrayText = [];
        const newQczsList = [...text.qzcsList];
        if (text.qzcsList.length > 5) {
            newArrayText.push(newQczsList.slice(0, 5));
            return (
                <div className={styles.AllTimeLine}>
                    {this.state.open === '0' ? (
                        <Timeline>
                            {newArrayText[0].map(pane => (
                                <Timeline.Item>
                                    <div className={styles.IndexTitle}>
                                        <span className={styles.TimeLineStyle}/>
                                        <span className={styles.spanTitle}>{pane.qzcsName}</span>
                                        <span className={styles.spanTitle}>{pane.qzcsTime}</span>
                                    </div>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    ) : (
                        <Timeline>
                            {text.qzcsList.map(pane => (
                                <Timeline.Item>
                                    <div className={styles.IndexTitle}>
                                        <span className={styles.TimeLineStyle}/>
                                        <span className={styles.spanTitle}>{pane.qzcsName}</span>
                                        <span className={styles.spanTitle}>{pane.qzcsTime}</span>
                                    </div>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    )}
                    {/*<span className={styles.DetailRightline1}/>*/}
                </div>
            );
        } else {
            return (
                <div className={styles.AllTimeLine}>
                    <Timeline>
                        {text.qzcsList.map(pane => (
                            <Timeline.Item>
                                <div className={styles.IndexTitle}>
                                    <span className={styles.TimeLineStyle}/>
                                    <span className={styles.spanTitle}>{pane.qzcsName}</span>
                                    <span className={styles.spanTitle}>{pane.qzcsTime}</span>
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                    {/*<span className={styles.DetailRightline1}/>*/}
                </div>
            );
        }
    }

    extraBottomTitle(text, caseDetails) {
        return (
            <div className={styles.personFiles}>
                <div className={styles.TopPersonFiles}>
                    <Row className={styles.headerTop}>
                        {text.sex === '女' ? (
                            <Col md={24} sm={24}>
                                <div className={styles.personImg}>
                                    <img src={woman} width="20" height="25" alt="暂无图片"/>
                                </div>
                            </Col>
                        ) : (
                            <Col md={24} sm={24}>
                                <div className={styles.personImg}>
                                    <img src={man} width="20" height="25" alt="暂无图片"/>
                                </div>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col md={24} sm={24} style={{paddingLeft: '12px'}}>
                            <Row style={{textAlign: 'left', padding: '5px 0 0'}}>
                                <Col md={24} sm={24}>
                                    {text.xyrName}{text.xszk_name && text.xszk_name === '在逃' ? (
                                    <span className={styles.tag}>{text.xszk_name}</span>
                                ) : (
                                    ''
                                )}
                                </Col>
                            </Row>
                            {/*<div style={{ textAlign: 'left', padding: '5px 0' }}>*/}
                            {/*性别：{text.sex}*/}
                            {/*</div>*/}
                            <div className={styles.CdCard}>{text.sfzh}</div>
                        </Col>
                    </Row>
                </div>
                <div
                    className={styles.sawpSee}
                    style={{color: '#fff'}}
                    onClick={() => this.openPersonDetail(text)}
                >
                    人员档案
                </div>
            </div>
        );
    }

    openMore = maxLength => {
        this.setState({
            TrackPaddingBottom: 60 * (maxLength - 2),
            TrackPaddingBottom1: 60 * (maxLength - 2) + 40,
            open: '1',
        });
    };
    closeMore = () => {
        // if(this.props.from==='刑事'){
        this.setState({
            TrackPaddingBottom: '160px',
            TrackPaddingBottom1: '220px',
            open: '0',
        });
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
        newQzcsListLength.sort(function (a, b) {
            return a - b;
        });
        maxLength = newQzcsListLength[newQzcsListLength.length - 1];
        return (
            <div>
                <Timeline className={styles.TimelineAllsa} style={{position: 'relative', minHeight: 254}}>
                    {caseDetails.ajgjList.map(item => {
                        return (
                            <Timeline.Item>
                <span className={styles.timeline}>
                  <span className={styles.spanTitles}>{item.ajzt}</span>
                  <span className={styles.spanTitles}>{item.time}</span>
                </span>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
                {this.props.from === '刑事' ? (
                    <div>
                        <div>
                            {/*<span className={styles.DetailLineIcon1} />*/}
                            {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ? (
                                <span>
                  <span className={styles.DetailLeftline}/>
                  <span className={styles.DetailLineIcon}/>
                </span>
                            ) : (
                                ''
                            )}
                            <div
                                className={styles.listStyle}
                                style={{paddingBottom: this.state.TrackPaddingBottom1}}
                            >
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ? (
                                    <div>
                                        <Steps
                                            progressDot
                                            className={styles.trailsteps}
                                            style={{left: this.state.trailLeft}}
                                            current={caseDetails.xyrList.length}
                                        >
                                            {caseDetails.xyrList.map(text => (
                                                <Step
                                                    title={this.extraBottomTitle(text, caseDetails)}
                                                    description={this.extraBottomDescription(text, caseDetails)}
                                                />
                                            ))}
                                        </Steps>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div>
                            {/*<span className={styles.DetailLineIcon1} />*/}
                            {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ? (
                                <span>
                  <span className={styles.DetailLeftline}/>
                  <span className={styles.DetailLineIcon}/>
                </span>
                            ) : (
                                ''
                            )}
                            <div
                                className={styles.listStyle}
                                style={{paddingBottom: this.state.TrackPaddingBottom1}}
                            >
                                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ? (
                                    <div>
                                        <Steps
                                            progressDot
                                            className={styles.trailsteps}
                                            style={{left: this.state.trailLeft}}
                                            current={caseDetails.xyrList.length}
                                        >
                                            {caseDetails.xyrList.map(text => (
                                                <Step
                                                    title={this.extraBottomTitle(text, caseDetails)}
                                                    description={this.extraBottomDescription(text, caseDetails)}
                                                />
                                            ))}
                                        </Steps>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {maxLength > 5 ? (
                    this.state.open === '0' ? (
                        <a
                            style={{color: '#2095FF', position: 'absolute', bottom: '20px', left: '50%'}}
                            onClick={() => this.openMore(maxLength, caseDetails.ajzt)}
                        >
                            加载更多...
                        </a>
                    ) : (
                        <a
                            style={{color: '#2095FF', position: 'absolute', bottom: '20px', left: '50%'}}
                            onClick={() => this.closeMore(caseDetails.ajzt)}
                        >
                            收起更多...
                        </a>
                    )
                ) : (
                    ''
                )}
            </div>
        );
    }

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
            if (this.state.trailLeft + 350 * 2 >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + 350 * 2,
                    colortrailleft: 'blue',
                    colortrailright: 'blue',
                });
            }
        } else if (newObjWidth === 1680) {
            if (this.state.trailLeft + 390 * 2 >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + 390 * 2,
                    colortrailleft: 'blue',
                    colortrailright: 'blue',
                });
            }
        } else if (newObjWidth === 1920) {
            if (this.state.trailLeft + 340 * 3 >= 0) {
                this.setState({
                    trailLeft: 0,
                    colortrailleft: 'gray',
                    colortrailright: 'blue',
                });
                // message.info('已经到达最开始');
            } else {
                this.setState({
                    trailLeft: this.state.trailLeft + 340 * 3,
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
                if (this.state.trailLeft - 350 * 2 <= -(350 * (num - 2))) {
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
                        trailLeft: this.state.trailLeft - 350 * 2,
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
                if (this.state.trailLeft - 390 * 2 <= -(390 * (num - 2))) {
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
                        trailLeft: this.state.trailLeft - 390 * 2,
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
                if (this.state.trailLeft - 340 * 3 <= -(340 * (num - 3))) {
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
                        trailLeft: this.state.trailLeft - 340 * 3,
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
                    <div className={styles.IconStyle} style={{width: '210px', top: '160px'}}>
                        {this.state.colortrailleft === 'blue' ? (
                            <img
                                src={left}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                                style={{cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={left1}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                            />
                        )}
                        {this.state.colortrailright === 'blue' ? (
                            <img
                                src={right}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px', cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={right1}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px'}}
                            />
                        )}
                    </div>
                );
            } else if (length === 1) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        <img src={left1} width="46" height="46"/>
                        <img src={right1} width="46" height="46" style={{marginLeft: '10px'}}/>
                    </div>
                );
            }
        } else if (newObjWidth === 1600) {
            if (length > 2) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        {this.state.colortrailleft === 'blue' ? (
                            <img
                                src={left1}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                                style={{cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={left1}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                            />
                        )}
                        {this.state.colortrailright === 'blue' ? (
                            <img
                                src={right}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px', cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={right1}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px'}}
                            />
                        )}
                    </div>
                );
            } else if (length < 2) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        <img src={left1} width="46" height="46"/>
                        <img src={right1} width="46" height="46" style={{marginLeft: '10px'}}/>
                    </div>
                );
            }
        } else if (newObjWidth === 1680) {
            if (length > 2) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        {this.state.colortrailleft === 'blue' ? (
                            <img
                                src={left}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                                style={{cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={left1}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                            />
                        )}
                        {this.state.colortrailright === 'blue' ? (
                            <img
                                src={right}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px', cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={right1}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px'}}
                            />
                        )}
                    </div>
                );
            } else if (length < 2) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        <img src={left1} width="46" height="46"/>
                        <img src={right1} width="46" height="46" style={{marginLeft: '10px'}}/>
                    </div>
                );
            }
        } else if (newObjWidth === 1920) {
            if (length > 3) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        {this.state.colortrailleft === 'blue' ? (
                            <img
                                src={left}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                                style={{cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={left1}
                                width="46"
                                height="46"
                                onClick={() => this.trailLeftClick(newObjWidth, length)}
                            />
                        )}
                        {this.state.colortrailright === 'blue' ? (
                            <img
                                src={right}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px', cursor: 'pointer'}}
                            />
                        ) : (
                            <img
                                src={right1}
                                width="46"
                                height="46"
                                onClick={() => this.trailRightClick(newObjWidth, length)}
                                style={{marginLeft: '10px'}}
                            />
                        )}
                    </div>
                );
            } else if (length <= 3) {
                return (
                    <div className={styles.IconStyle} style={{width: '210px', top: '0px'}}>
                        <img src={left1} width="46" height="46"/>
                        <img src={right1} width="46" height="46" style={{marginLeft: '10px'}}/>
                    </div>
                );
            }
        }
    };

    index() {
        const {caseDetails} = this.props;
        const obj1 = document.getElementsByTagName('body');
        const objheight = obj1[0].clientHeight;
        const allheight = obj1[0].scrollHeight;
        const objwidth = obj1[0].clientWidth;
        let newObjWidth = '',
            superveWidth = '';
        if (objheight >= allheight) {
            if (objwidth < 1280 || objwidth === 1280) {
                newObjWidth = 1280;
                superveWidth = 905;
            } else if (objwidth > 1280 && objwidth < 1600) {
                newObjWidth = 1280;
                superveWidth = 905;
                // newObjWidth = 1600;
                // superveWidth = 1225;
            } else if (objwidth >= 1600 && objwidth < 1680) {
                newObjWidth = 1600;
                superveWidth = 1225;
                // newObjWidth = 1680;
                // superveWidth = 1305;
            } else if (objwidth >= 1680 && objwidth < 1920) {
                newObjWidth = 1680;
                superveWidth = 1305;
                // newObjWidth = 1920;
                // superveWidth = 1545;
            } else if (objwidth >= 1920) {
                newObjWidth = 1920;
                superveWidth = 1545;
            }
        } else if (objheight < allheight) {
            if (objwidth < 1263 || objwidth === 1263) {
                newObjWidth = 1280;
                superveWidth = 905;
            } else if (objwidth > 1263 && objwidth < 1583) {
                newObjWidth = 1280;
                superveWidth = 905;
                // newObjWidth = 1600;
                // superveWidth = 1225;
            } else if (objwidth >= 1583 && objwidth < 1663) {
                newObjWidth = 1600;
                superveWidth = 1225;
                // newObjWidth = 1680;
                // superveWidth = 1305;
            } else if (objwidth >= 1663 && objwidth < 1903) {
                newObjWidth = 1680;
                superveWidth = 1305;
                // newObjWidth = 1920;
                // superveWidth = 1545;
            } else if (objwidth >= 1903) {
                newObjWidth = 1920;
                superveWidth = 1545;
            }
        }
        // console.log('this.props.global&&this.props.global.dark',this.props.global&&this.props.global.dark)
        return (
            <div
                className={this.props.global && this.props.global.dark ? styles.message : styles.message + ' ' + styles.lightBoxMessage}
                style={{
                    paddingBottom: this.state.TrackPaddingBottom,
                    paddingTop: this.state.TrackPaddingTop,
                }}
            >
                {this.timeline(caseDetails, caseDetails && caseDetails.ajzt ? caseDetails.ajzt : '')}
                {caseDetails && caseDetails.xyrList && caseDetails.xyrList.length > 0 ? (
                    <div>{this.AllButton(newObjWidth, caseDetails.xyrList.length)}</div>
                ) : (
                    ''
                )}
            </div>
        );
    }

    render() {
        return <div>{this.index()}</div>;
    }
}
