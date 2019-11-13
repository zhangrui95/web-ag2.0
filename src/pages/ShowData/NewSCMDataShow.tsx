/*
* 智慧案管新版大屏展示
* author：jhm
* 20181211
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment/moment';
import styles from './NewSCMDataShow.less';
import { getTimeDistance } from '../../utils/utils';

import headerLeftImg from '../../assets/show/header_left.png';
import headerTitleImg from '../../assets/show/showTitle.png';
import headerRightImg from '../../assets/show/header_right.png';

import SCMAdministrativePenalty from '../../components/Show/bigScreenDisplay/AdministrativePenalty';
import CriminalCaseWarningCount from '../../components/Show/bigScreenDisplay/CriminalCaseWarningCount';
import PoliceSituationToCaseCount from '../../components/Show/bigScreenDisplay/PoliceSituationToCaseCount';
import PersonCount from '../../components/Show/bigScreenDisplay/PersonCount';
import CaseItemCount from '../../components/Show/bigScreenDisplay/CaseItemCount';
import DossierCount from '../../components/Show/bigScreenDisplay/DossierCount';
import ChinaMap from '../../components/Show/bigScreenDisplay/ChinaMap';
import PoliceSituationWarningCount from '../../components/Show/bigScreenDisplay/PoliceSituationWarningCount';
import PoliceSituationFrom from '../../components/Show/bigScreenDisplay/PoliceSituationFrom';
import AdministrativeCaseCount from '../../components/Show/bigScreenDisplay/AdministrativeCaseCount';
import CaseItemWarningCount from '../../components/Show/bigScreenDisplay/CaseItemWarningCount';
import HandingCaseAreaInfo from '../../components/Show/bigScreenDisplay/HandingCaseAreaInfo';
import AdministrativeCaseWarning from '../../components/Show/bigScreenDisplay/AdministrativeCaseWarning';
import AllCriminalCaseLinksCount from '../../components/Show/bigScreenDisplay/AllCriminalCaseLinksCount';
import HandingCaseAreaWarning from '../../components/Show/bigScreenDisplay/HandingCaseAreaWarning';
import CloseAndDetectionRate from '../../components/Show/bigScreenDisplay/CloseAndDetectionRate';

import NewVideoShow from '../../components/Show/NewVideoShow';

@connect(({ common, MySuperviseData, UnPoliceData, UnCaseData, UnXzCaseData, UnItemData, XzCaseData, areaData, CaseData, itemData, show }) => ({
    UnXzCaseData,
    common,
    MySuperviseData,
    UnCaseData,
    XzCaseData,
    areaData,
    CaseData,
    show,
    itemData,
    UnPoliceData,
    UnItemData,
}))

export default class SCMDataShow extends PureComponent {
    state = {
        nowTime: moment().format('YYYY-MM-DD HH:mm'),
        currentDateType: 'month',
        selectDate: [moment().startOf('week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        shadeColors: [
            ['#ff4d98', '#ff0062'],
            ['#00e3ff', '#009bcd'],
            ['#6f05c3', '#c6306c'],
            ['#ff4e50', '#f9d423'],
            ['#4971ff', '#9798ff'],
            ['#00c9ff', '#92f39d'],
            ['#ffe000', '#799f0c'],
            ['#00c6ff', '#0072ff'],
            ['#f09819', '#edde5d'],
            ['#8e2de2', '#4a00e0'],
        ],
        position1: '',
        position2: '',
        position3: '',
        position4: '',
        position5: '',
        position6: '',
        position7: '',
        position8: '',
        position9: '',
        position10: '',
        position11: '',
    };

    componentDidMount() {
        this.getScreenConfig();
        this.showNowTime();
    }

    // 当前时间
    showNowTime = () => {
        window.setInterval(() => {
            this.setState({
                nowTime: moment().format('YYYY-MM-DD HH:mm'),
            });
        }, 1000 * 60);
    };
    // 大屏配置项查询
    getScreenConfig = () => {
        this.props.dispatch({
            type: 'show/getScreenConfig',
            payload: {},
            callback: (data) => {
                const obj = {};
                data.list.forEach(item => {
                    const resource_code = item.resource_code.split(',');
                    obj[item.wz] = resource_code[1];
                });
                this.setState({
                    ...obj,
                });
            },
        });
    };
    // 配置模块
    handleModuelChange = (type) => {
        const { selectDate, shadeColors } = this.state;
        switch (type) {
            case 'xzcf-sl': // 行政处罚数量
                return <SCMAdministrativePenalty selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'xsaj-wtgj': // 刑事案件问题告警
                return <CriminalCaseWarningCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'jqzhaj-sl': // 警情转换案件数量
                return <PoliceSituationToCaseCount selectDate={selectDate}
                                                   shadeColors={shadeColors} {...this.props}  />;
            case 'qzcsrs': // 强制措施人数
                return <PersonCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'sawp-sl': // 涉案物品数量
                return <CaseItemCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'jzsl': // 卷宗数量
                return <DossierCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'jqgj-tj': // 警情告警统计
                return <PoliceSituationWarningCount selectDate={selectDate}
                                                    shadeColors={shadeColors} {...this.props}  />;
            case 'jqlysj-tj': // 警情来源数据统计
                return <PoliceSituationFrom selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'xzaj-sl': // 行政案件数量
                return <AdministrativeCaseCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'sawp-gjsl': // 涉案物品告警数量
                return <CaseItemWarningCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'baqxx-xj': // 办案区信息巡检
                return <HandingCaseAreaInfo selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'xzaj-gjtj': // 行政案件告警统计
                return <AdministrativeCaseWarning selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'zbghjaj-sl': // 侦办各环节案件数量
                return <AllCriminalCaseLinksCount selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'baqgj-tj': // 办案区告警统计
                return <HandingCaseAreaWarning selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            case 'japalzs':
                return <CloseAndDetectionRate selectDate={selectDate} shadeColors={shadeColors} {...this.props}  />;
            default:
                return null;
        }
    };
    // 改变数据展示时间段
    changeCurrentDate = (dateType) => {
        let selectDate = [moment().startOf('week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        if (dateType === 'month') {
            selectDate = [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        } else if (dateType === 'year') {
            selectDate = [moment().startOf('year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        }
        this.setState({
            selectDate,
            currentDateType: dateType,
        });
    };

    render() {
        const { nowTime, currentDateType, selectDate, shadeColors, position1, position2, position3, position4, position5, position6, position7, position8, position9, position10, position11 } = this.state;
        return (
            <div className={styles.SCMDataShow}>
                <div className={styles.header}>
                    <img src={headerLeftImg} alt=""/>
                    <img className={styles.showTitle} src={headerTitleImg} alt="智慧案件管理系统"/>
                    <img src={headerRightImg} alt=""/>
                    <div className={styles.nowTime}>
                        <span>当前时间：{nowTime}</span>
                    </div>
                    <div className={styles.dateButtons}>
                        {/*<span className={currentDateType === 'week' ? styles.currentDate : null} onClick={() => this.changeCurrentDate('week')}>本周</span>*/}
                        <span className={currentDateType === 'month' ? styles.currentDate : null}
                              onClick={() => this.changeCurrentDate('month')}>本月</span>
                        <span className={currentDateType === 'year' ? styles.currentDate : null}
                              onClick={() => this.changeCurrentDate('year')}>本年</span>
                    </div>
                </div>
                <div className={styles.wrap}>
                    <div className={styles.wrapLeft}>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position1)}
                        </div>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position2)}
                        </div>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position3)}
                        </div>
                    </div>
                    <div className={styles.wrapMiddle}>
                        <div className={styles.mapCard}>
                            <ChinaMap {...this.state} {...this.props} />
                        </div>
                        <div className={styles.longCard}>
                            {this.handleModuelChange(position4)}
                        </div>
                    </div>
                    <div className={styles.wrapRight}>
                        <div className={styles.globalCard} style={{ height: 620 }}>
                            {/*{this.handleModuelChange(position7)}*/}
                            <div className={styles.smallBlock}>
                                <div className={styles.blockHeader}>
                                    <div className={styles.letfConner}></div>
                                    <div className={styles.rightConner}></div>
                                    <h4>办案区视频</h4>
                                </div>
                                <div className={styles.smallBlockBody}>
                                    <NewVideoShow {...this.props} areaCode={this.state.areaCode}/>
                                </div>
                            </div>
                        </div>
                        {/*<div className={styles.globalCard}>*/}
                        {/*{this.handleModuelChange(position6)}*/}
                        {/*</div>*/}
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position5)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
