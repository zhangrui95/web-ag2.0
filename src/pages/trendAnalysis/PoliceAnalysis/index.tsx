/*
*  PoliceTrendAnalysis.js 警情趋势分析
* author：lyp
* 20181218
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, DatePicker, Icon, Card, Table, Carousel, Spin, Button,Modal,Progress} from 'antd';
import moment from 'moment';
import html2canvas from 'html2canvas';
import Overview from '../../../components/TrendAnalysis/PoliceAnalysis/Overview';
import AgainstProperty from '../../../components/TrendAnalysis/PoliceAnalysis/AgainstProperty';
import RobGrabFraud from '../../../components/TrendAnalysis/PoliceAnalysis/RobGrabFraud';
import Steal from '../../../components/TrendAnalysis/PoliceAnalysis/Steal';
import styles from './index.less';

const {MonthPicker} = DatePicker;
let imgBase = [];
let num = 0;
@connect(({common, trendAnalysis, loading, global}) => ({
    common,
    trendAnalysis,
    loading: loading.models.trendAnalysis,
    global
}))
export default class PoliceTrendAnalysis extends PureComponent {

    constructor(props) {
        super(props);
        this.nextCarousel = this.nextCarousel.bind(this);
        this.previousCarousel = this.previousCarousel.bind(this);
        this.goToCarousel = this.goToCarousel.bind(this);
    }

    state = {
        selectedDate: moment().subtract(1, 'month').format('YYYY-MM'), // 默认展示上个月的数据
        yearOnYearDate: moment().subtract(1, 'month').subtract(1, 'years').format('YYYY-MM'),
        monthOnMonthDate: moment().subtract(2, 'month').format('YYYY-MM'),
        selectedDateStr: moment().subtract(1, 'month').format('YYYY年M月'),
        yearOnYearDateStr: moment().subtract(1, 'month').subtract(1, 'years').format('YYYY年M月'),
        monthOnMonthDateStr: moment().subtract(2, 'month').format('YYYY年M月'),
        hadLoadedData: false, // 是否已经有加载完成的数据
        overViewLoadingStatus: false, // 综述加载数据状态
        againstPropertyLoadingStatus: false, // 侵财、伤害
        robGrabFraudLoadingStatus: false, // 抢劫、抢夺、诈骗
        stealLoadingStatus: false, // 盗窃
        percent:0,
        downLoading:false,
    };
    // 改变模块加载状态
    changeLoadingStatus = (status) => {
        this.setState({
            ...status,
        });
    };
    // 走马灯下一幅
    nextCarousel = () => {
        this.slider.next();
    };
    // 走马灯上一幅
    previousCarousel = () => {
        this.slider.prev();
    };
    // 跳转到对应页面
    goToCarousel = (number) => {
        const {hadLoadedData} = this.state;
        if (!hadLoadedData) {
            this.setState({hadLoadedData: true});
            if (this.slider) {
                this.slider.goTo(number);
            }
        }
    };

    // 禁止选择的日期
    disabledDate = (current) => {
        const startDate = moment().subtract(1, 'years').startOf('years');
        const endDate = moment().subtract(1, 'month').endOf('day');
        return current && ((current > endDate) || (current < startDate));
    };
    // 日期改变
    dateChange = (date) => {
        if (date) {
            this.setState({
                selectedDate: moment(date).format('YYYY-MM'),
                yearOnYearDate: moment(date).subtract(1, 'years').format('YYYY-MM'),
                monthOnMonthDate: moment(date).subtract(1, 'month').format('YYYY-MM'),
                selectedDateStr: moment(date).format('YYYY年M月'),
                yearOnYearDateStr: moment(date).subtract(1, 'years').format('YYYY年M月'),
                monthOnMonthDateStr: moment(date).subtract(1, 'month').format('YYYY年M月'),
                hadLoadedData: false,
            });
        }

    };
    // 图表统计导出功能请求
    exprotService = (imagesBase) => {
        this.props.dispatch({
            type: 'common/getExportEffect',
            payload: {
                docx_name: '警情分析图表统计导出',
                header: '警情分析',
                tiles: [
                    {
                        type: 'image',
                        width: 6.3,
                        base64: imagesBase[0],
                    },
                    {
                        type: 'image',
                        width: 6.3,
                        base64: imagesBase[1],
                    },
                    {
                        type: 'image',
                        width: 6.3,
                        base64: imagesBase[2],
                    },
                    {
                        type: 'image',
                        width: 6.3,
                        base64: imagesBase[3],
                    },
                ],
            },
            callback: (data) => {
                if (data && data.result) {
                    setTimeout(()=>{
                        this.setState({
                            downLoading:false,
                        },()=>{
                            setTimeout(()=>{
                                this.setState({
                                    percent:0,
                                });
                            },100);
                        });
                    },100);
                    window.location.href = `${configUrl.tbtjExportUrl}/down-docx/警情分析图表统计导出.docx`;
                    num = 0;
                }
            },
        });
    };
    // 图表统计导出功能参数集合
    addBase = (add) => {
        num ++;
        let percent = (num/5)*100;
        this.setState({
            percent:percent,
        });
        imgBase.push(add);
        if (imgBase.length === 4) {
            this.exprotService(imgBase);
        }
    };
    // // 图表统计导出功能
    ExportStatistics = async () => {
        this.setState({
            downLoading:true
        });
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        imgBase = [];
       await html2canvas(document.querySelector('#capture1')).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
        await html2canvas(document.querySelector('#capture2')).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
        await  html2canvas(document.querySelector('#capture3')).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
        await  html2canvas(document.getElementsByClassName('capture4')[1]).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
    };

    render() {
        const {overViewLoadingStatus, againstPropertyLoadingStatus, robGrabFraudLoadingStatus, stealLoadingStatus} = this.state;
        const exportButtonStatus = overViewLoadingStatus || againstPropertyLoadingStatus || robGrabFraudLoadingStatus || stealLoadingStatus; // 导出按钮禁用状态
        let className = this.props.global && this.props.global.dark ? styles.trendAnalysis : styles.trendAnalysis + ' ' + styles.lightBox
        return (
            <div className={className}>
                <div className={styles.titleArea}>
                    <Card style={{padding: '10px'}} id={'formPoliceAnalysis'}>
                        <Row>
                            <Col span={12}>
                                <MonthPicker size='default' placeholder="请选择月份" disabledDate={this.disabledDate}
                                             getCalendarContainer={() => document.getElementById('formPoliceAnalysis')}
                                             onChange={this.dateChange} defaultValue={moment(this.state.selectedDate)}/>
                            </Col>
                            <Col span={12}>
                                <div className={styles.selectDateArea}>
                                    <Button type='primary' style={{marginLeft: 16}}
                                            onClick={this.ExportStatistics}
                                            disabled={exportButtonStatus}>导出</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className={styles.cardArea} bordered={false}>
                    <div className={styles.prevCarousel} onClick={this.previousCarousel}>
                        <Icon type="double-left" className={styles.buttonIcon}/>
                    </div>
                    <div className={styles.nextCarousel} onClick={this.nextCarousel}>
                        <Icon type="double-right" className={styles.buttonIcon}/>
                    </div>
                    <Carousel ref={c => (this.slider = c)}>
                        <div id='capture1'>
                            <Overview {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                      changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                        <div id='capture2'>
                            <AgainstProperty {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                             changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                        <div id='capture3'>
                            <RobGrabFraud {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                          changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                        <div id='capture4' className='capture4'>
                            <Steal {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                   changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                    </Carousel>
                </div>
                <Modal
                    visible={this.state.downLoading}
                    closable={false}
                    footer={null}
                    centered={true}
                    getContainer={()=>document.getElementById('messageBox')}
                >
                    <p className={this.props.global && this.props.global.dark ? styles.dcWords : styles.dcWord}>正在导出</p>
                    <Progress percent={this.state.percent} strokeColor={this.props.global && this.props.global.dark ? '#3285ff':'#4662D5'}/>
                </Modal>
            </div>
        );
    }
}
