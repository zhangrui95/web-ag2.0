/*
* 智慧案管大屏展示
* author：lyp
* 20181119
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment/moment';
import styles from './SCMDataShow.less';
import { getTimeDistance, getUserInfos } from '../../utils/utils';

import headerLeftImg from '../../assets/show/header_left.png';
import headerTitleImg from '../../assets/show/showTitle.png';
import headerTitleImgHeBi from '../../assets/show/showTitle_hb.png';
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
import CriminalCaseCount from '../../components/Show/bigScreenDisplay/CriminalCaseCount';
import HandingVideoAreaPlaying from '../../components/Show/bigScreenDisplay/HandingVideoAreaPlaying';
import DossierData from '../../components/Show/bigScreenDisplay/DossierData';
import SpecialCase from '../../components/Show/bigScreenDisplay/SpecialCase';
import WholeDetectionRate from '../../components/Show/bigScreenDisplay/WholeDetectionRate';
import CaseItemInfo from '../../components/Show/bigScreenDisplay/CaseItemInfo';
import DossierWarning from '../../components/Show/bigScreenDisplay/DossierWarning';
import HandingCaseCount from '../../components/Show/bigScreenDisplay/HandingCaseCount';
import HandingCaseAreaUseInfo from '../../components/Show/bigScreenDisplay/HandingCaseAreaUseInfo';
import SystemUseInfo from '../../components/Show/bigScreenDisplay/SystemUseInfo';
import ShowNumber from '../../components/Show/ShowNumber';
import CenterStatistics from '../../components/Show/bigScreenDisplay/CenterStatistics';

const { mapCityName } = configUrl;

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
        // selectDate: [moment().startOf('week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        selectDate: [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
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
        mapLoopTime: '10',
        orgCode: '',
        org: '',
        userDepNum: getUserInfos().department,
        userGroup: getUserInfos().group,
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
                data&&data.list&&data.list.forEach(item => {
                    const resource_code = item.resource_code?item.resource_code.split(','):[];
                    obj[item.wz] = resource_code[1] || resource_code[0] || '';
                });

                this.setState({
                    ...obj,
                });
            },
        });
    };
    getAllNum = (idx, num, name) => {
        this.setState({
            ['num' + idx]: num,
            ['name' + idx]: name,
        });
    };

    // 配置模块
    handleModuelChange = (type, idx) => {
        const { selectDate, shadeColors, orgCode, org, orglist } = this.state;
        switch (type) {
            case 'xzcf-sl': // 行政处罚数量
                return <SCMAdministrativePenalty idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                                 orglist={orglist}/>;
            case 'xsaj-wtgj': // 刑事案件问题告警
                return <CriminalCaseWarningCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} {...this.props} {...this.state}/>;
            case 'jqzhaj-sl': // 警情转化案件数量
                return <PoliceSituationToCaseCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                                   orglist={orglist}/>;
            case 'qzcsrs': // 强制措施人数
                return <PersonCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                    orglist={orglist}/>;
            case 'sawp-sl': // 涉案物品数量
                return <CaseItemCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                      orglist={orglist}/>;
            case 'jzsl': // 卷宗数量
                return <DossierCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                     orglist={orglist}/>;
            case 'jqgj-tj': // 警情告警统计
                return <PoliceSituationWarningCount getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} idx={idx} selectDate={selectDate} orgCode={orgCode} org={org}
                                                    shadeColors={shadeColors} {...this.props} orglist={orglist}/>;
            case 'jqlysj-tj': // 警情来源数据统计
                return <PoliceSituationFrom idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                            orglist={orglist}/>;
            case 'xzaj-sl': // 行政案件数量
                return <AdministrativeCaseCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                                orglist={orglist}/>;
            case 'sawp-gjsl': // 涉案物品告警数量
                return <CaseItemWarningCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                             orglist={orglist}/>;
            case 'baqxx-xj': // 办案区信息巡检
                return <HandingCaseAreaInfo idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                            orglist={orglist}/>;
            case 'xzaj-gjtj': // 行政案件告警统计
                return <AdministrativeCaseWarning idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} {...this.props} {...this.state}/>;
            case 'zbghjaj-sl': // 侦办各环节案件数量
                return <AllCriminalCaseLinksCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                                  orglist={orglist}/>;
            case 'baqgj-tj': // 办案区告警统计
                return <HandingCaseAreaWarning idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                               orglist={orglist}/>;
            case 'japalzs': // 结案、破案率
                return <CloseAndDetectionRate idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                              orglist={orglist}/>;
            case 'xsajsl': // 刑事案件数量
                return <CriminalCaseCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                          orglist={orglist}/>;
            case 'baqsp': // 办案区视频播放
                return <HandingVideoAreaPlaying idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                                orglist={orglist}/>;
            case 'jzsjtj': // 卷宗数据统计
                return <DossierData idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                    orglist={orglist}/>;
            case 'zxlbaj-zb': // 专项类别占比
                return <SpecialCase idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                    orglist={orglist}/>;
            case 'ztpal': // 整体破案率
                return <WholeDetectionRate idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                           orglist={orglist}/>;
            case 'sawpsj': // 涉案物品数据
                return <CaseItemInfo idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                     orglist={orglist}/>;
            case 'jzgjsl': // 卷宗告警数量Pie
                return <DossierWarning idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                       orglist={orglist}/>;
            case 'zbajtj': // 在办案件统计--漏斗
                return <HandingCaseCount idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                         orglist={orglist}/>;
            case 'baqsyqk': // 办案区使用情况--背景图
                return <HandingCaseAreaUseInfo idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                               orglist={orglist}/>;
            case 'grsyqk': // 个人使用情况--背景图
                return <SystemUseInfo idx={idx} getAllNum={(idx, num, name) => {
                    this.getAllNum(idx, num, name);
                }} selectDate={selectDate} orgCode={orgCode} org={org} shadeColors={shadeColors} {...this.props}
                                      orglist={orglist}/>;
            default:
                return null;
        }
    };
    // 改变数据展示时间段
    changeCurrentDate = (dateType) => {
        // let selectDate = [moment().startOf('week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        let selectDate = [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        if (dateType === 'year') {
            selectDate = [moment().startOf('year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        }
        this.setState({
            selectDate,
            currentDateType: dateType,
        });
    };
    // 设置区划code
    setAreaCode = (code) => {
        this.setState({
            org: code,
        });
    };
    // 设置区划orgcode
    setAreaOrgCode = (code) => {
        this.setState({
            orgCode: code,
        });
    };
    //修改orglist
    setOrgList = (list,dep) => {
        this.setState({
            orglist: list,
            dep: dep ? dep : '',
        });
    };

    render() {
        const { nowTime, currentDateType, selectDate, shadeColors, position1, position2, position3, position4, position5, position6, position7, position8, position9, position10, position11, userDepNum } = this.state;
        // console.log(position1, position2, position3, position4, position5, position6, position7, position8, position9, position10, position11)
        const userDepNumStr = userDepNum.substring(4, 12);
        const titleImg = mapCityName === 'hebi' ? headerTitleImgHeBi : headerTitleImg;
        return (
            <div className={styles.SCMDataShow}>
                <div className={styles.header}>
                    <img src={headerLeftImg} alt=""/>
                    <img className={styles.showTitle} src={titleImg} alt="智慧案件管理系统"/>
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
                            {this.handleModuelChange(position1, 1)}
                        </div>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position2, 2)}
                        </div>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position3, 3)}
                        </div>
                    </div>
                    <div className={styles.wrapMiddle}>
                        {userDepNumStr === '00000000' ? ( // 如果是市局用户显示地图，如果不是显示图片模块
                            <div className={styles.mapCard}>
                                <ChinaMap {...this.state} {...this.props} setAreaCode={this.setAreaCode}/>
                            </div>
                        ) : (
                            <ShowNumber {...this.state} {...this.props} setAreaOrgCode={this.setAreaOrgCode}
                                        setOrgList={this.setOrgList}/>
                        )
                        }
                        {/*<CenterStatistics {...this.state} {...this.props} />*/}
                        <div className={styles.longCard}>
                            {this.handleModuelChange(position4, 4)}
                        </div>
                    </div>
                    <div className={styles.wrapRight}>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position7, 7)}
                        </div>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position6, 6)}
                        </div>
                        <div className={styles.globalCard}>
                            {this.handleModuelChange(position5, 5)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
