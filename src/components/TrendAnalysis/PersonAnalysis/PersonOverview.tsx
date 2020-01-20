/*
 * PersonOverview.js 涉案人员分析--综述
 * author：lyp
 * 20181227
 * */

import React, {PureComponent} from 'react';
import {Tooltip, Icon, Table, Row, Col, Spin, Empty} from 'antd';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import pie from 'echarts/lib/chart/pie';
import tooltip from 'echarts/lib/component/tooltip';
import legend from 'echarts/lib/component/legend';
import grid from 'echarts/lib/component/grid';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

let suspectCountBar;
let dealSuspectTypeBar;

export default class PersonOverview extends PureComponent {
    state = {
        suspectCountTableData: [],
        dealSuspectTypeTableData: [],
        loadingData: false,
    };

    componentDidMount() {
        this.getPersonOverview(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (
                (nextProps.selectedDate !== null &&
                    (this.props.selectedDate !== nextProps.selectedDate ||
                        this.props.userOrgCode !== nextProps.userOrgCode)) || this.props.global.dark !== nextProps.global.dark
            ) {
                this.getPersonOverview(nextProps);
            }
        }
    }

    getPersonOverview = propsData => {
        this.props.changeLoadingStatus({personOverviewLoadingStatus: true});
        this.setState({loadingData: true});
        const {
            dispatch,
            selectedDateStr,
            yearOnYearDateStr,
            monthOnMonthDateStr,
            selectedDate,
            yearOnYearDate,
            monthOnMonthDate,
            userOrgCode,
        } = propsData;
        dispatch({
            type: 'trendAnalysis/getPersonOverview',
            payload: {
                nowtime: selectedDate,
                lastyear: yearOnYearDate,
                lastmonth: monthOnMonthDate,
                orgcode12: userOrgCode,
            },
            callback: data => {
                if (data) {
                    const {fz, pzdb, tqdb, wf, ysqs} = data;
                    let dealBarData = [];
                    let suspectCountTableData = [];
                    let dealSuspectTypeTableData = [];
                    const dealXData = ['提请逮捕人数', '批准逮捕人数', '移送起诉人数'];
                    const xData = ['犯罪嫌疑人', '违法行为人'];
                    let barData = [];
                    if (tqdb && pzdb && ysqs) {
                        dealBarData = [
                            {
                                name: selectedDateStr,
                                type: 'bar',
                                cursor: 'pointer',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                    },
                                },
                                data: [
                                    {
                                        name: '提请逮捕人数',
                                        value: tqdb.nowtime || 0,
                                        itemStyle: {color: '#3AA0FF'},
                                        code: 12,
                                    },
                                    {
                                        name: '批准逮捕人数',
                                        value: pzdb.nowtime || 0,
                                        itemStyle: {color: '#3AA0FF'},
                                        code: 17,
                                    },
                                    {
                                        name: '移送起诉人数',
                                        value: ysqs.nowtime || 0,
                                        itemStyle: {color: '#3AA0FF'},
                                        code: 11,
                                    },
                                ],
                            },
                            {
                                name: yearOnYearDateStr,
                                type: 'bar',
                                cursor: 'pointer',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                    },
                                },
                                data: [
                                    {
                                        name: '提请逮捕人数',
                                        value: tqdb.lastyear || 0,
                                        itemStyle: {color: '#DCCA23'},
                                        code: 12,
                                    },
                                    {
                                        name: '批准逮捕人数',
                                        value: pzdb.lastyear || 0,
                                        itemStyle: {color: '#DCCA23'},
                                        code: 17,
                                    },
                                    {
                                        name: '移送起诉人数',
                                        value: ysqs.lastyear || 0,
                                        itemStyle: {color: '#DCCA23'},
                                        code: 11,
                                    },
                                ],
                            },
                            {
                                name: monthOnMonthDateStr,
                                type: 'bar',
                                cursor: 'pointer',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                    },
                                },
                                data: [
                                    {
                                        name: '提请逮捕人数',
                                        value: tqdb.lastmonth || 0,
                                        itemStyle: {color: '#31BD74'},
                                        code: 12,
                                    },
                                    {
                                        name: '批准逮捕人数',
                                        value: pzdb.lastmonth || 0,
                                        itemStyle: {color: '#31BD74'},
                                        code: 17,
                                    },
                                    {
                                        name: '移送起诉人数',
                                        value: ysqs.lastmonth || 0,
                                        itemStyle: {color: '#31BD74'},
                                        code: 11,
                                    },
                                ],
                            },
                        ];
                        dealSuspectTypeTableData = [
                            {
                                categories: '提请逮捕（人）',
                                selectedDateStr: tqdb.nowtime || 0,
                                yearOnYearDateStr: tqdb.lastyear || 0,
                                tbzf_q: tqdb.tbzf || 0,
                                tbzf_l: tqdb.tbzf100 || '0%',
                                monthOnMonthDateStr: tqdb.lastmonth,
                                hbzf_q: tqdb.hbzf || 0,
                                hbzf_l: tqdb.hbzf100 || '0%',
                            },
                            {
                                categories: '批准逮捕（人）',
                                selectedDateStr: pzdb.nowtime || 0,
                                yearOnYearDateStr: pzdb.lastyear || 0,
                                tbzf_q: pzdb.tbzf || 0,
                                tbzf_l: pzdb.tbzf100 || '0%',
                                monthOnMonthDateStr: pzdb.lastmonth,
                                hbzf_q: pzdb.hbzf || 0,
                                hbzf_l: pzdb.hbzf100 || '0%',
                            },
                            {
                                categories: '移送起诉（人）',
                                selectedDateStr: ysqs.nowtime || 0,
                                yearOnYearDateStr: ysqs.lastyear || 0,
                                tbzf_q: ysqs.tbzf || 0,
                                tbzf_l: ysqs.tbzf100 || '0%',
                                monthOnMonthDateStr: ysqs.lastmonth,
                                hbzf_q: ysqs.hbzf || 0,
                                hbzf_l: ysqs.hbzf100 || '0%',
                            },
                        ];
                        if (document.getElementById('dealSuspectTypeBar')) {
                            this.showEchart(dealXData, dealBarData);
                            window.addEventListener('resize', dealSuspectTypeBar.resize);
                        }
                    }
                    if (fz && wf) {
                        suspectCountTableData = [
                            {
                                categories: selectedDateStr,
                                suspect: fz.nowtime,
                                illegal: wf.nowtime,
                            },
                            {
                                categories: yearOnYearDateStr,
                                suspect: fz.lastyear,
                                illegal: wf.lastyear,
                            },
                            {
                                categories: '同比增幅（起）',
                                suspect: fz.tbzf,
                                illegal: wf.tbzf,
                            },
                            {
                                categories: '同比增幅（%）',
                                suspect: fz.tbzf100,
                                illegal: wf.tbzf100,
                            },
                            {
                                categories: monthOnMonthDateStr,
                                suspect: fz.lastmonth,
                                illegal: wf.lastmonth,
                            },
                            {
                                categories: '环比增幅（起）',
                                suspect: fz.hbzf,
                                illegal: wf.hbzf,
                            },
                            {
                                categories: '环比增幅（%）',
                                suspect: fz.hbzf100,
                                illegal: wf.hbzf100,
                            },
                        ];
                        barData = [
                            {
                                name: selectedDateStr,
                                type: 'bar',
                                cursor: 'pointer',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                    },
                                },
                                data: [
                                    {
                                        name: '犯罪嫌疑人',
                                        value: fz.nowtime || 0,
                                        itemStyle: {color: '#3AA0FF'},
                                        code: '01',
                                    },
                                    {
                                        name: '违法行为人',
                                        value: wf.nowtime || 0,
                                        itemStyle: {color: '#3AA0FF'},
                                        code: '02',
                                    },
                                ],
                            },
                            {
                                name: yearOnYearDateStr,
                                type: 'bar',
                                cursor: 'pointer',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                    },
                                },
                                data: [
                                    {
                                        name: '犯罪嫌疑人',
                                        value: fz.lastyear || 0,
                                        itemStyle: {color: '#DCCA23'},
                                        code: '01',
                                    },
                                    {
                                        name: '违法行为人',
                                        value: wf.lastyear || 0,
                                        itemStyle: {color: '#DCCA23'},
                                        code: '02',
                                    },
                                ],
                            },
                            {
                                name: monthOnMonthDateStr,
                                type: 'bar',
                                cursor: 'pointer',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                    },
                                },
                                data: [
                                    {
                                        name: '犯罪嫌疑人',
                                        value: fz.lastmonth || 0,
                                        itemStyle: {color: '#31BD74'},
                                        code: '01',
                                    },
                                    {
                                        name: '违法行为人',
                                        value: wf.lastmonth || 0,
                                        itemStyle: {color: '#31BD74'},
                                        code: '02',
                                    },
                                ],
                            },
                        ];
                        // suspectCountBar.setOption({
                        //     xAxis: {
                        //         data: xData,
                        //     },
                        //     series: barData,
                        // });
                        if (document.getElementById('suspectCountBar')) {
                            this.showDealSuspectTypeBar(xData, barData);
                            window.addEventListener('resize', suspectCountBar.resize);
                        }
                    }
                    this.setState({
                        suspectCountTableData,
                        dealSuspectTypeTableData,
                    });
                    this.props.goToCarousel(0);
                }
                this.setState({loadingData: false});
                this.props.changeLoadingStatus({personOverviewLoadingStatus: false});
            },
        });
    };

    showEchart = (dealXData, dealBarData) => {
        const that = this;
        dealSuspectTypeBar = echarts.init(document.getElementById('dealSuspectTypeBar'));
        const option = {
            color: ['#3AA0FF', '#DCCA23', '#31BD74'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: {
                type: 'category',
                data: dealXData,
                axisLabel: {
                    // X轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    },
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6',
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    // X轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    },
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6',
                    },
                },
            },
            series: dealBarData,
        };
        dealSuspectTypeBar.setOption(option);
        if (window.configUrl.is_area === '2') {
            dealSuspectTypeBar.on('click', function (param) {
                const {departorgan} = that.props;
                const {
                    selectedDateStr,
                    selectedDate,
                    yearOnYearDateStr,
                    yearOnYearDate,
                    monthOnMonthDateStr,
                    monthOnMonthDate,
                } = that.props.dateArr;
                that.props.dispatch(
                    routerRedux.push({
                        pathname: '/allDocuments/personalDocTransfer/personalDoc',
                        queryChange: {
                            departmentId: departorgan && departorgan.id ? departorgan.id : '',
                            qzcsName: param.data.code,
                            searchTime:
                                param.seriesName === selectedDateStr
                                    ? selectedDate
                                    : param.seriesName === yearOnYearDateStr
                                    ? yearOnYearDate
                                    : monthOnMonthDate,
                            from: 'rylx',
                        },
                    }),
                );
            });
        }
    };
    // 处理嫌疑人
    showDealSuspectTypeBar = (xData, barData) => {
        const that = this;
        suspectCountBar = echarts.init(document.getElementById('suspectCountBar'));
        const option = {
            color: ['#3AA0FF', '#DCCA23', '#31BD74'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            xAxis: {
                type: 'category',
                axisLine: {show: false},
                data: xData,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    // X轴线 标签修改
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
                    },
                },
                axisLine: {
                    show: true, // X轴 网格线 颜色类型的修改
                    lineStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6',
                    },
                },
            },
            yAxis: {
                taxisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
                    },
                },
            },
            series: barData,
        };
        suspectCountBar.setOption(option);
        if (window.configUrl.is_area === '2') {
            suspectCountBar.on('click', function (param) {
                const {departorgan} = that.props;
                const {
                    selectedDateStr,
                    selectedDate,
                    yearOnYearDateStr,
                    yearOnYearDate,
                    monthOnMonthDateStr,
                    monthOnMonthDate,
                } = that.props;
                that.props.dispatch(
                    routerRedux.push({
                        pathname: '/allDocuments/personalDocTransfer/personalDoc',
                        queryChange: {
                            departmentId: departorgan && departorgan.id ? departorgan.id : '',
                            qzcsName: param.data.code,
                            searchTime:
                                param.seriesName === selectedDateStr
                                    ? selectedDate
                                    : param.seriesName === yearOnYearDateStr
                                    ? yearOnYearDate
                                    : monthOnMonthDate,
                            from: 'rylx',
                        },
                    }),
                );
            });
        }
        // suspectCountBar.getZr().on('click',function(params){
        //   console.log('params',params);
        //   const point = [params.offsetX, params.offsetY];
        //   // console.log('point',point)
        //   if (suspectCountBar.containPixel('grid', point)) {
        //     let xIndex = parseInt(suspectCountBar.convertFromPixel({ seriesIndex: 0 }, point)[0]);
        //     // console.log('xIndex',xIndex);
        //     let op = suspectCountBar.getOption();
        //     // console.log('op',op);
        //     let code = op.series[0].data[xIndex].code;
        //     // console.log('code',code);
        //     if (code) {
        //       const { currentType } = that.state;
        //       const dataTime = currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
        //       that.props.changeToListPage({ ajlb: [code.substring(0, 2) + '0000', code.substring(0, 4) + '00', code] }, dataTime);
        //     }
        //   }
        // })
    };

    render() {
        const {selectedDateStr, yearOnYearDateStr, monthOnMonthDateStr} = this.props;
        const {suspectCountTableData, dealSuspectTypeTableData, loadingData} = this.state;
        const columns = [
            {
                title: '类别',
                dataIndex: 'categories',
                key: 'categories',
            },
            {
                title: selectedDateStr,
                dataIndex: 'selectedDateStr',
                key: 'selectedDateStr',
            },
            {
                title: yearOnYearDateStr,
                dataIndex: 'yearOnYearDateStr',
                key: 'yearOnYearDateStr',
            },
            {
                title: (
                    <span>
            同比增幅（起）
            <Tooltip title="同比增幅=本期数-同期数">
              <Icon type="info-circle-o"/>
            </Tooltip>
          </span>
                ),
                key: 'tbzf_q',
                dataIndex: 'tbzf_q',
            },
            {
                title: (
                    <span>
            同比增幅（%）
            <Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%">
              <Icon type="info-circle-o"/>
            </Tooltip>
          </span>
                ),
                key: 'tbzf_l',
                dataIndex: 'tbzf_l',
            },
            {
                title: monthOnMonthDateStr,
                dataIndex: 'monthOnMonthDateStr',
                key: 'monthOnMonthDateStr',
            },
            {
                title: (
                    <span>
            环比增幅（起）
            <Tooltip title="环比增幅=本期数-上期数">
              <Icon type="info-circle-o"/>
            </Tooltip>
          </span>
                ),
                key: 'hbzf_q',
                dataIndex: 'hbzf_q',
            },
            {
                title: (
                    <span>
            环比增幅（%）
            <Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%">
              <Icon type="info-circle-o"/>
            </Tooltip>
          </span>
                ),
                key: 'hbzf_l',
                dataIndex: 'hbzf_l',
            },
        ];
        const suspectCountColumns = [
            {
                title: '对比时间',
                dataIndex: 'categories',
                key: 'categories',

                render: text => {
                    if (text === '同比增幅（起）') {
                        return (
                            <span>
                同比增幅（起）
                <Tooltip title="同比增幅=本期数-同期数">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              </span>
                        );
                    } else if (text === '同比增幅（%）') {
                        return (
                            <span>
                同比增幅（%）
                <Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              </span>
                        );
                    } else if (text === '环比增幅（起）') {
                        return (
                            <span>
                环比增幅（起）
                <Tooltip title="环比增幅=本期数-上期数">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              </span>
                        );
                    } else if (text === '环比增幅（%）') {
                        return (
                            <span>
                环比增幅（%）
                <Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              </span>
                        );
                    } else {
                        return text;
                    }
                },
            },
            {
                title: '犯罪嫌疑人（个）',
                dataIndex: 'suspect',
                key: 'suspect',
            },
            {
                title: '违法行为人（个）',
                dataIndex: 'illegal',
                key: 'illegal',
            },
        ];
        let className = this.props.global && this.props.global.dark ? styles.analysis : styles.analysis + ' ' + styles.lightBox
        return (
            <Spin spinning={loadingData} size="large" tip="数据加载中...">
                <div className={className}>
                    <AnalysisTitleArea analysisTitle="人员综述" {...this.props} />
                    <Row className={styles.fraudArea}>
                        <Col lg={12} md={24}>
                            <div id="suspectCountBar" style={{height: 420,marginLeft:'4%'}}
                                 className={this.props.global && this.props.global.dark ? '' : styles.lightChartBox}/>
                        </Col>
                        <Col lg={12} md={24}>
                            <Table
                                columns={suspectCountColumns}
                                dataSource={suspectCountTableData}
                                bordered
                                className={styles.tableArea}
                                style={{paddingTop: 0,margin:'0 2%'}}
                                pagination={false}
                                locale={{
                                    emptyText: <Empty
                                        image={this.props.global && this.props.global.dark ? noList : noListLight}
                                        description={'暂无数据'}/>
                                }}
                            />
                        </Col>
                    </Row>
                    <h2 className={styles.areaTitle}></h2>
                    <div id="dealSuspectTypeBar" style={{height: 300}}
                         className={this.props.global && this.props.global.dark ? '' : styles.lightChartBox}/>
                    <Table
                        columns={columns}
                        dataSource={dealSuspectTypeTableData}
                        className={styles.fraudTable}
                        bordered
                        pagination={false}
                        locale={{
                            emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                              description={'暂无数据'}/>
                        }}
                    />
                </div>
            </Spin>
        );
    }
}
