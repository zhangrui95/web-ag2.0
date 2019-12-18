/*
*  CriminalCaseTrendAnalysis.js 刑事案件趋势分析
* author：lyp
* 20181226
* */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, DatePicker, Icon, Card, Table, Carousel, Spin, Button } from 'antd';
import moment from 'moment';
import html2canvas from 'html2canvas';
import CriminalCaseOverview from '../../../components/TrendAnalysis/CirminalCaseAnalysis/CriminalCaseOverview';
import CriminalCaseType from '../../../components/TrendAnalysis/CirminalCaseAnalysis/CriminalCaseType';
import CriminalCaseAndPolice from '../../../components/TrendAnalysis/CirminalCaseAnalysis/CriminalCaseAndPolice';
import styles from '../../trendAnalysis/PoliceAnalysis/index.less';

const { MonthPicker } = DatePicker;
let imgBase = [];

@connect(({ common, trendAnalysis, loading,global }) => ({
    common,
    trendAnalysis,
    loading: loading.models.trendAnalysis,
    global
}))
export default class CriminalCaseTrendAnalysis extends PureComponent {

    constructor(props) {
        super(props);
        this.nextCarousel = this.nextCarousel.bind(this);
        this.previousCarousel = this.previousCarousel.bind(this);
    }

    state = {
        selectedDate: moment().subtract(1, 'month').format('YYYY-MM'), // 默认展示上个月的数据
        yearOnYearDate: moment().subtract(1, 'month').subtract(1, 'years').format('YYYY-MM'),
        monthOnMonthDate: moment().subtract(2, 'month').format('YYYY-MM'),
        selectedDateStr: moment().subtract(1, 'month').format('YYYY年M月'),
        yearOnYearDateStr: moment().subtract(1, 'month').subtract(1, 'years').format('YYYY年M月'),
        monthOnMonthDateStr: moment().subtract(2, 'month').format('YYYY年M月'),
        hadLoadedData: false, // 是否已经有加载完成的数据
        criminalCaseOverviewLoadingStatus: false, // 综述加载数据状态
        criminalCaseTypeLoadingStatus: false, // 类型分析
        criminalCaseAndPoliceLoadingStatus: false, // 警情、受理、立案
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
        const { hadLoadedData } = this.state;
        if (!hadLoadedData) {
            this.setState({ hadLoadedData: true });
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
                docx_name: '刑事案件分析图表统计导出',
                header: '刑事案件分析',
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
                ],
            },
            callback: (data) => {
                if (data && data.result) {
                    window.location.href = `${configUrl.tbtjExportUrl}/down-docx/刑事案件分析图表统计导出.docx`;
                }
            },
        });
    };
    // 图表统计导出功能参数集合
    addBase = (add) => {
        imgBase.push(add);
        if (imgBase.length === 3) {
            this.exprotService(imgBase);
        }
    };
    // 图表统计导出功能
    ExportStatistics = () => {
        imgBase = [];
        html2canvas(document.querySelector('#capture1')).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
        html2canvas(document.querySelector('#capture2')).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
        html2canvas(document.getElementsByClassName('capture3')[1]).then(canvas => {
            this.addBase(canvas.toDataURL().split('base64,')[1]);
        });
    };

    render() {
        const { criminalCaseOverviewLoadingStatus, criminalCaseTypeLoadingStatus, criminalCaseAndPoliceLoadingStatus } = this.state;
        const exportButtonStatus = criminalCaseOverviewLoadingStatus || criminalCaseTypeLoadingStatus || criminalCaseAndPoliceLoadingStatus; // 导出按钮禁用状态
        let className = this.props.global&&this.props.global.dark ? styles.trendAnalysis : styles.trendAnalysis + ' '+ styles.lightBox
        return (
            <div className={className}>
                <div className={styles.titleArea}>
                    <Card style={{padding:'10px'}} id={'formCriminaAnalysis'}>
                        <Row>
                            <Col span={12}>
                                <MonthPicker size='default' placeholder="请选择月份" disabledDate={this.disabledDate}   getCalendarContainer={() => document.getElementById('formCriminaAnalysis')}
                                             onChange={this.dateChange} defaultValue={moment(this.state.selectedDate)}/>
                            </Col>
                            <Col span={12}>
                                <div className={styles.selectDateArea}>
                                    <Button type='primary' style={{ marginLeft: 16 }}
                                            onClick={() => this.ExportStatistics()}
                                            disabled={exportButtonStatus}>导出</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <Card className={styles.cardArea} bordered={false}>
                    <div className={styles.prevCarousel} onClick={this.previousCarousel}>
                        <Icon type="double-left" className={styles.buttonIcon}/>
                    </div>
                    <div className={styles.nextCarousel} onClick={this.nextCarousel}>
                        <Icon type="double-right" className={styles.buttonIcon}/>
                    </div>
                    <Carousel ref={c => (this.slider = c)}>
                        <div id='capture1'>
                            <CriminalCaseOverview {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                                  changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                        <div id='capture2'>
                            <CriminalCaseType {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                              changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                        <div id='capture3' className='capture3'>
                            <CriminalCaseAndPolice {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                                   changeLoadingStatus={this.changeLoadingStatus}/>
                        </div>
                    </Carousel>
                </Card>
            </div>
        );
    }
}
