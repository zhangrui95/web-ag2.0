/*
*  PeopleTrendAnalysis.js 涉案人员趋势分析
* author：lyp
* 20181227
* */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, DatePicker, Icon, Card, Table, Carousel, TreeSelect, Spin, Button } from 'antd';
import moment from 'moment';
import html2canvas from 'html2canvas';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import PersonOverview from '../../../components/TrendAnalysis/PersonAnalysis/PersonOverview';
import PersonIllegalPunish from '../../../components/TrendAnalysis/PersonAnalysis/PersonIllegalPunish';
import PersonSuspectPunish from '../../../components/TrendAnalysis/PersonAnalysis/PersonSuspectPunish';
import styles from '../../trendAnalysis/PoliceAnalysis/index.less';
import { getUserInfos } from '../../../utils/utils';

const { MonthPicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
let imgBase = [];

@connect(({ common, trendAnalysis, loading }) => ({
    common,
    trendAnalysis,
    loading: loading.models.trendAnalysis,
}))
export default class PeopleTrendAnalysis extends PureComponent {

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
        userOrgCode: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).department : '',
        userOrgName: getUserInfos().group ? getUserInfos().group.name : '',
        hadLoadedData: false, // 是否已经有加载完成的数据
        personOverviewLoadingStatus: false, // 综述加载数据状态
        personIllegalPunishLoadingStatus: false, // 违法行为人处罚
        personSuspectPunishLoadingStatus: false, // 强制措施
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
    };

    componentWillMount() {
        const { userOrgCode } = this.state;
        if (userOrgCode !== '') {
            this.getDepTree(this.state.userOrgCode);
        }
    }

    // 获取机构树
    getDepTree = (area) => {
        const areaNum = [];
        if (area) {
            areaNum.push(area);
        }
        this.props.dispatch({
            type: 'common/getDepTree',
            payload: {
                departmentNum: areaNum,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        treeDefaultExpandedKeys: [data[0].code],
                    });
                }
            },
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
    // 改变模块加载状态
    changeLoadingStatus = (status) => {
        this.setState({
            ...status,
        });
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
    // 渲染机构树
    renderloop = data => data.map((item) => {
        const obj = {
            id: item.code,
            label: item.name,
        };
        const objStr = JSON.stringify(obj);
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={objStr} key={item.code} title={<Ellipsis tooltip
                                                                             length={24}>{item.name}</Ellipsis>}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={item.code} value={objStr} title={<Ellipsis tooltip length={24}>{item.name}</Ellipsis>}/>;
    });
    // 选择机构树
    onSelectTreeChange = (val) => {
        const depTreeObj = JSON.parse(val);
        this.setState({
            userOrgCode: depTreeObj.id,
            userOrgName: depTreeObj.label,
        });
    };
    // 图表统计导出功能请求
    exprotService = (imagesBase) => {
        this.props.dispatch({
            type: 'common/getExportEffect',
            payload: {
                docx_name: '涉案人员分析图表统计导出',
                header: '涉案人员分析',
                tiles: [
                    {
                        'type': 'text',
                        'content': '机构名称：' + this.state.userOrgName,
                    },
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
                    window.location.href = `${configUrl.tbtjExportUrl}/down-docx/涉案人员分析图表统计导出.docx`;
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
        const { common: { depTree } } = this.props;
        const { userOrgName, userOrgCode, personIllegalPunishLoadingStatus, personOverviewLoadingStatus, personSuspectPunishLoadingStatus,selectedDate,yearOnYearDate,monthOnMonthDate,selectedDateStr,yearOnYearDateStr,monthOnMonthDateStr } = this.state;
        const exportButtonStatus = personIllegalPunishLoadingStatus || personOverviewLoadingStatus || personSuspectPunishLoadingStatus;
        const obj = {
            id: userOrgCode,
            label: userOrgName,
        };
        const dateArr={
            selectedDate:selectedDate,
            yearOnYearDate:yearOnYearDate,
            monthOnMonthDate:monthOnMonthDate,
            selectedDateStr:selectedDateStr,
            yearOnYearDateStr:yearOnYearDateStr,
            monthOnMonthDateStr:monthOnMonthDateStr,
        }
        const objStr = JSON.stringify(obj);
        return (
            <div className={styles.trendAnalysis}>
                <div className={styles.titleArea}>
                    <Card style={{padding:'10px'}} id={'formPersonPolice'}>
                        <Row>
                            <Col span={12}>
                                {
                                    depTree && depTree.length > 0 ? (
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 260, marginRight: 10 }}
                                            // value={this.state.value}
                                            defaultValue={objStr}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="请选择要查询的机构"
                                            allowClear
                                            treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                            key='jjdwSelect'
                                            onChange={this.onSelectTreeChange}
                                            getPopupContainer={() => document.getElementById('formPersonPolice')}
                                        >
                                            {this.renderloop(depTree)}
                                        </TreeSelect>
                                    ) : null
                                }


                                <MonthPicker size='default' placeholder="请选择月份" disabledDate={this.disabledDate} getCalendarContainer={() => document.getElementById('formPersonPolice')}
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
                            <PersonOverview {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                            changeLoadingStatus={this.changeLoadingStatus}
                                            departorgan={obj} dateArr={dateArr} />
                        </div>
                        <div id='capture2'>
                            <PersonIllegalPunish {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                                 changeLoadingStatus={this.changeLoadingStatus}
                                                 departorgan={obj} dateArr={dateArr} />
                        </div>
                        <div id='capture3' className='capture3'>
                            <PersonSuspectPunish {...this.state} {...this.props} goToCarousel={this.goToCarousel}
                                                 changeLoadingStatus={this.changeLoadingStatus}
                                                 departorgan={obj} dateArr={dateArr} />
                        </div>
                    </Carousel>
                </Card>
            </div>
        );
    }
}
