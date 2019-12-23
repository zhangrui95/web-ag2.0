/*
* DossierMarkingModal.js 卷宗阅卷功能右侧展示页项
* author：jhm
* 20180117
* */
import React, {PureComponent} from 'react';
// import VDraggable from 'vdraggle';
import styles from './AnnotationPreview.less';
import BannerAnimMark from './BannerAnimMark';
import {Card, Row, Button, Upload, Icon, Modal, Col, Menu, Dropdown, Switch, Popconfirm} from 'antd';

export default class AnnotationArea extends React.Component {
    constructor(props) {
        super(props);
        console.log('props', props);
        this.state = {
            currentImg: '',
            currentIndex: this.props.index ? this.props.index : 0,
            electronicVolumeData: this.props.electronicVolumeData,
            titleName: this.props.record ? this.props.record.electronic_catalogues_name : '',
            isShowAnnotation: true,
            base64Url: '',
            pagenumber: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        if (nextProps !== this.props) {
            this.setState({
                electronicVolumeData: nextProps.electronicVolumeData,
                currentIndex: nextProps.index,
                titleName: nextProps.electronicVolumeData && nextProps.electronicVolumeData.length > 0 ? nextProps.electronicVolumeData[nextProps.index].electronic_catalogues_name : '',
                pagenumber: nextProps.electronicVolumeData && nextProps.electronicVolumeData.length > 0 ? nextProps.electronicVolumeData[nextProps.index].electronic_page_pagenumber : '',
            });
        }
    }

    // 获取切换的图片当前显示位置
    currentIndex = (index) => {
        this.setState({
            currentIndex: index,
        });
        let {electronicVolumeData} = this.state;
        if (electronicVolumeData) {
            let item = electronicVolumeData[index];
            // if(item&&item.electronic_page_number){
            //     let xh = Math.round(item.electronic_page_number / 1000); // Math.round 向下取整
            //     this.props.getElectronicVolumeChangeId(xh);
            // }
            this.props.getElectronicVolumeChangeId(item.electronic_catalogues_id);
            this.setState({
                titleName: item.electronic_catalogues_name,
                pagenumber: item.electronic_page_pagenumber,
            });
        }
    };

    render() {
        let imgUrlList = [];
        let imgUrlIdList = [];
        if (this.state.electronicVolumeData && this.state.electronicVolumeData.length > 0) {
            for (let i = 0; i < this.state.electronicVolumeData.length; i++) {
                let item = this.state.electronicVolumeData[i];
                imgUrlList.push(item.electronic_page_url);
                imgUrlIdList.push({
                    id: item.electronic_page_id,
                    Path: item.electronic_page_url,
                    annotationp_page: item.annotationp_page,
                });
            }
        }
        return (
            <Row className={styles.imgAreaWrap} gutter={{md: 6, lg: 12, xl: 24}}>

                <Col xl={24} lg={24} md={24} sm={24}>
                    <Card>
                        <h3 style={{textAlign: 'center', marginBottom: 16, fontWeight: '700'}}>
                            {this.state.titleName} {this.state.pagenumber ? `(${this.state.pagenumber}页) ` : ''}
                        </h3>
                        <div style={{textAlign: 'center', height: '870px'}}>
                            <BannerAnimMark
                                arrayImg={imgUrlIdList}
                                currentImg={this.state.currentImg}
                                index={this.state.currentIndex}
                                currentIndex={this.currentIndex}
                                {...this.props}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        );
    };
}

