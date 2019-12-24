/*
* HandingVideoAreaPlaying.js 新大屏展示页面 办案区视频播放
* author：jhm
* 20181212
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, List, Avatar} from 'antd';
import styles from '../ComponentStyles.less';
import videoImg from '../../../assets/show/videoImg.png';
import videoplay from '../../../assets/show/videoplay.png';

export default class HandingVideoAreaPlaying extends PureComponent {
    state = {};

    componentDidMount() {
        this.getVideoList(this.props.areaCode);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((this.props.areaCode !== nextProps.areaCode)) {
                this.getVideoList(nextProps.areaCode);
            }
        }

    }

    getVideoList = (areaCode) => {
        if (configUrl.isSyncBaq) {
            this.props.dispatch({
                type: 'show/getVideoList',
                payload: {
                    currentPage: 1,
                    showCount: 3,
                    pd: {
                        org: areaCode,
                    },
                },
                // callback: (data) => {
                //     if(data){
                //     }
                // }
            });
        }

    };

    videoPlay = (personId, handleareaNum) => {
        this.props.dispatch({
            type: 'show/videoPlay',
            payload: {
                handleareaNum,
                personId,
            },
        });
    };

    render() {
        const {show: {videoList}} = this.props;
        return (
            <div className={styles.componentBlock}>
                <div className={styles.videoShow} style={{overflowX: 'hidden', backgroundColor: 'transparent'}}>
                    <div>
                        <div className={styles.smallBlock}>
                            <div className={styles.blockHeader}>
                                <h4>办案区视频</h4>
                            </div>
                        </div>
                        <ul className={styles.videopicture}>
                            {
                                videoList.list && videoList.list.length > 0 ? videoList.list.map(item => (

                                    <li style={{width: '33.33%', float: 'left', padding: '0 5px'}}>
                                        <div style={{position: 'relative'}} className={styles.ImgHover}>
                        <span className={styles.videoplayImgout}>
                          <img src={videoplay} alt='暂无图片' className={styles.videoplayImg}
                               onClick={() => this.videoPlay(item.person_id, item.handlearea_num)}/>
                        </span>
                                            <img src={videoImg} alt='暂无图片'/>
                                        </div>
                                        <div className={styles.videoName}>{item.name}</div>
                                    </li>
                                )) : (
                                    <div style={{
                                        overflow: 'hidden',
                                        width: '100%',
                                        height: '100%',
                                        textAlign: 'center',
                                        fontSize: '1.4rem',
                                        color: '#13227B',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        marginTop: 5,
                                        backgroundColor: 'rgba(0, 0, 153, 0.2)',
                                    }}>暂无视频信息</div>
                                )
                            }


                            {/*<li style={{width:'33.33%',float:'left',padding:'0 5px'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                            {/*<li style={{width:'33.33%',float:'left'}}>*/}
                            {/*<div style={{position:'relative'}} className={styles.ImgHover}>*/}
                            {/*<span className={styles.videoplayImgout}>*/}
                            {/*<img src={videoplay} alt='暂无图片' className={styles.videoplayImg} onClick={() => this.videoPlay(item.person_id, item.handlearea_num)} />*/}
                            {/*</span>*/}
                            {/*<img src={videoImg} alt='暂无图片' />*/}
                            {/*</div>*/}
                            {/*<div className={styles.videoName}>新添加01</div>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
