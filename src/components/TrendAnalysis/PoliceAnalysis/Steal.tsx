/*
 * Steal.js 警情分析--盗窃类警情
 * author：lyp
 * 20181218
 * */

import React, { PureComponent } from 'react';
import { Tooltip, Icon, Table, Col, Row, Spin, message, Empty } from 'antd';
import echarts from 'echarts';
import AnalysisTitleArea from '../AnalysisTitleArea';
import styles from '../analysisStyles.less';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';

let myChart;
let radarChart;

export default class Steal extends PureComponent {
  state = {
    tableData: [],
    list: [],
    loadingData: false,
  };

  componentDidMount() {
    this.getStealData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (
        (nextProps.selectedDate !== null && this.props.selectedDate !== nextProps.selectedDate) ||
        this.props.global.dark !== nextProps.global.dark
      ) {
        this.getStealData(nextProps);
      }
    }
  }

  getStealData = propsData => {
    this.props.changeLoadingStatus({ stealLoadingStatus: true });
    this.setState({ loadingData: true });
    const {
      dispatch,
      selectedDateStr,
      yearOnYearDateStr,
      monthOnMonthDateStr,
      selectedDate,
      yearOnYearDate,
      monthOnMonthDate,
    } = propsData;
    dispatch({
      type: 'trendAnalysis/getStealData',
      payload: {
        nowtime: selectedDate,
        lastyear: yearOnYearDate,
        lastmonth: monthOnMonthDate,
        jqlbmc: window.configUrl.is_ssds,
      },
      callback: data => {
        if (data) {
          // const { daoqie, dqcheneiwupin, dqdiandongche, dqdiandongchedianping, dqmotuoceh, dqshangdian, dqzixingche, linbao, paqie, qt, ruhu } = data;
          const { daoqie, list } = data;
          let barData = [];
          let radarData = [];
          let radarMaxNum = 0;
          let tableData = [];
          let radarvalue = [];
          // console.log('daoqie',daoqie)
          if (daoqie && list && list.length > 0) {
            barData = [
              {
                name: monthOnMonthDateStr,
                value: daoqie.lastmonth || 0,
                itemStyle: {
                  color: '#31BD74',
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                  },
                },
              },
              {
                name: yearOnYearDateStr,
                value: daoqie.lastyear || 0,
                itemStyle: {
                  color: '#DCCA23',
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                  },
                },
              },
              {
                name: selectedDateStr,
                value: daoqie.nowtime || 0,
                itemStyle: {
                  color: '#3AA0FF',
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                  },
                },
              },
            ];
            const value1 = [],
              value2 = [],
              value3 = [],
              value4 = [];
            list.map(item => value1.push(item.nowtime));
            list.map(item => value2.push(item.lastyear));
            list.map(item => value3.push(item.lastmonth));
            radarData = [
              {
                name: selectedDateStr,
                value: value1,
                itemStyle: { color: '#3AA0FF' },
              },
              {
                name: yearOnYearDateStr,
                value: value2,
                itemStyle: { color: '#DCCA23' },
              },
              {
                name: monthOnMonthDateStr,
                value: value3,
                itemStyle: { color: '#31BD74' },
              },
            ];
            radarMaxNum = Math.max.apply(null, [
              ...radarData[0].value,
              ...radarData[1].value,
              ...radarData[2].value,
            ]);
            list.map(item =>
              radarvalue.push({
                name: item.jqlbmc,
                max: radarMaxNum,
              }),
            );

            list.map(item =>
              value4.push({
                title: item.jqlbmc,
                dataIndex: '',
              }),
            );

            tableData = [
              {
                categories: selectedDateStr,
                daoqie: daoqie.nowtime,
                param1: list[0].nowtime,
                param2: list[1].nowtime,
                param3: list[2].nowtime,
                param4: list[3].nowtime,
                param5: list[4].nowtime,
                param6: list[5].nowtime,
                param7: list[6].nowtime,
                param8: list[7].nowtime,
                param9: list[8].nowtime,
                param10: list[9].nowtime,
              },
              {
                categories: yearOnYearDateStr,
                daoqie: daoqie.lastyear,
                param1: list[0].lastyear,
                param2: list[1].lastyear,
                param3: list[2].lastyear,
                param4: list[3].lastyear,
                param5: list[4].lastyear,
                param6: list[5].lastyear,
                param7: list[6].lastyear,
                param8: list[7].lastyear,
                param9: list[8].lastyear,
                param10: list[9].lastyear,
              },
              {
                categories: '同比增幅（起）',
                daoqie: daoqie.tbzf,
                param1: list[0].tbzf,
                param2: list[1].tbzf,
                param3: list[2].tbzf,
                param4: list[3].tbzf,
                param5: list[4].tbzf,
                param6: list[5].tbzf,
                param7: list[6].tbzf,
                param8: list[7].tbzf,
                param9: list[8].tbzf,
                param10: list[9].tbzf,
              },
              {
                categories: '同比增幅（%）',
                daoqie: daoqie.tbzf100,
                param1: list[0].tbzf100,
                param2: list[1].tbzf100,
                param3: list[2].tbzf100,
                param4: list[3].tbzf100,
                param5: list[4].tbzf100,
                param6: list[5].tbzf100,
                param7: list[6].tbzf100,
                param8: list[7].tbzf100,
                param9: list[8].tbzf100,
                param10: list[9].tbzf100,
              },
              {
                categories: monthOnMonthDateStr,
                daoqie: daoqie.lastmonth,
                param1: list[0].lastmonth,
                param2: list[1].lastmonth,
                param3: list[2].lastmonth,
                param4: list[3].lastmonth,
                param5: list[4].lastmonth,
                param6: list[5].lastmonth,
                param7: list[6].lastmonth,
                param8: list[7].lastmonth,
                param9: list[8].lastmonth,
                param10: list[9].lastmonth,
              },
              {
                categories: '环比增幅（起）',
                daoqie: daoqie.hbzf,
                param1: list[0].hbzf,
                param2: list[1].hbzf,
                param3: list[2].hbzf,
                param4: list[3].hbzf,
                param5: list[4].hbzf,
                param6: list[5].hbzf,
                param7: list[6].hbzf,
                param8: list[7].hbzf,
                param9: list[8].hbzf,
                param10: list[9].hbzf,
              },
              {
                categories: '环比增幅（%）',
                daoqie: daoqie.hbzf100,
                param1: list[0].hbzf100,
                param2: list[1].hbzf100,
                param3: list[2].hbzf100,
                param4: list[3].hbzf100,
                param5: list[4].hbzf100,
                param6: list[5].hbzf100,
                param7: list[6].hbzf100,
                param8: list[7].hbzf100,
                param9: list[8].hbzf100,
                param10: list[9].hbzf100,
              },
            ];
            this.setState({
              tableData,
              list,
            });
          } else {
            radarvalue = [
              { name: '扒窃', max: radarMaxNum },
              { name: '盗窃车内物品', max: radarMaxNum },
              { name: '盗窃电动车', max: radarMaxNum },
              { name: '盗窃电动车电瓶', max: radarMaxNum },
              { name: '盗窃摩托车', max: radarMaxNum },
              { name: '盗窃商店', max: radarMaxNum },
              { name: '盗窃自行车', max: radarMaxNum },
              { name: '拎包', max: radarMaxNum },
              { name: '入户盗窃', max: radarMaxNum },
              { name: '其他盗窃', max: radarMaxNum },
            ];
            // message.info('盗窃类警情暂无数据')
          }
          let yAxis = [monthOnMonthDateStr, yearOnYearDateStr, selectedDateStr];
          if (document.getElementsByClassName('stealBar')[1]) {
            this.showEchart(yAxis, barData);
            window.addEventListener('resize', myChart.resize);
          }
          if (document.getElementsByClassName('stealAllType')[1]) {
            this.showRadar(radarvalue, radarData);
            window.addEventListener('resize', radarChart.resize);
          }
          this.props.goToCarousel(3);
        }
        this.setState({ loadingData: false });
        this.props.changeLoadingStatus({ stealLoadingStatus: false });
      },
    });
  };

  showEchart = (yAxis, barData) => {
    const stealBar = document.getElementsByClassName('stealBar')[1];
    myChart = echarts.init(stealBar);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: 100,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          // X轴线 标签修改
          textStyle: {
            color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
          },
        },
        splitLine: {
          show: true, // X轴线 颜色类型的修改
          lineStyle: {
            color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6',
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
        type: 'category',
        data: yAxis,
        axisLabel: {
          // y轴线 标签修改
          textStyle: {
            color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d', //坐标值得具体的颜色
          },
        },
        axisLine: {
          show: true, // y轴 网格线 颜色类型的修改
          lineStyle: {
            color: this.props.global && this.props.global.dark ? '#fff' : '#e6e6e6',
          },
        },
      },
      series: {
        name: '盗窃',
        type: 'bar',
        cursor: 'default',
        data: barData,
      },
    };
    myChart.setOption(option);
  };
  // 盗窃种类雷达图
  showRadar = (radarvalue, radarData) => {
    const stealAllType = document.getElementsByClassName('stealAllType')[1];
    radarChart = echarts.init(stealAllType);
    const option = {
      tooltip: {
        confine: true,
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d',
          },
        },
        indicator: radarvalue,
      },
      series: [
        {
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          // areaStyle: {normal: {}},
          cursor: 'default',
          data: radarData,
        },
      ],
    };
    radarChart.setOption(option);
  };

  render() {
    const { tableData, loadingData, list } = this.state;
    let columns = [];
    if (list.length > 0) {
      columns = [
        {
          title: '对比时间',
          dataIndex: 'categories',
          key: 'categories',
          width: 150,
          render: text => {
            if (text === '同比增幅（起）') {
              return (
                <span>
                  同比增幅（起）
                  <Tooltip title="同比增幅=本期数-同期数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else if (text === '同比增幅（%）') {
              return (
                <span>
                  同比增幅（%）
                  <Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else if (text === '环比增幅（起）') {
              return (
                <span>
                  环比增幅（起）
                  <Tooltip title="环比增幅=本期数-上期数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else if (text === '环比增幅（%）') {
              return (
                <span>
                  环比增幅（%）
                  <Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else {
              return text;
            }
          },
        },
        {
          title: '盗窃案（起）',
          dataIndex: 'daoqie',
          key: 'daoqie',
        },
        {
          title: list[0].jqlbmc,
          dataIndex: 'param1',
          key: 'paqie',
        },
        {
          title: list[1].jqlbmc,
          key: 'dqcheneiwupin',
          dataIndex: 'param2',
        },
        {
          title: list[2].jqlbmc,
          key: 'dqdiandongche',
          dataIndex: 'param3',
        },
        {
          title: list[3].jqlbmc,
          dataIndex: 'param4',
          key: 'dqdiandongchedianping',
        },
        {
          title: list[4].jqlbmc,
          key: 'dqmotuoceh',
          dataIndex: 'param5',
        },
        {
          title: list[5].jqlbmc,
          key: 'dqshangdian',
          dataIndex: 'param6',
        },
        {
          title: list[6].jqlbmc,
          key: 'dqzixingche',
          dataIndex: 'param7',
        },
        {
          title: list[7].jqlbmc,
          key: 'linbao',
          dataIndex: 'param8',
        },
        {
          title: list[8].jqlbmc,
          key: 'ruhu',
          dataIndex: 'param9',
        },
        {
          title: list[9].jqlbmc,
          key: 'qt',
          dataIndex: 'param10',
        },
      ];
    } else {
      columns = [
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
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else if (text === '同比增幅（%）') {
              return (
                <span>
                  同比增幅（%）
                  <Tooltip title="同比增涨率=（本期数-同期数）/同期数×100%">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else if (text === '环比增幅（起）') {
              return (
                <span>
                  环比增幅（起）
                  <Tooltip title="环比增幅=本期数-上期数">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else if (text === '环比增幅（%）') {
              return (
                <span>
                  环比增幅（%）
                  <Tooltip title="环比增涨率=（本期数-上期数）/上期数×100%">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                </span>
              );
            } else {
              return text;
            }
          },
        },
        {
          title: '盗窃案（起）',
          dataIndex: 'daoqie',
          key: 'daoqie',
        },
        {
          title: '扒窃（起）',
          dataIndex: 'param1',
          key: 'paqie',
        },
        {
          title: '盗窃车内物品',
          key: 'dqcheneiwupin',
          dataIndex: 'param2',
        },
        {
          title: '盗窃电动车',
          key: 'dqdiandongche',
          dataIndex: 'param3',
        },
        {
          title: '盗窃电动车电瓶',
          dataIndex: 'param4',
          key: 'dqdiandongchedianping',
        },
        {
          title: '盗窃摩托车',
          key: 'dqmotuoceh',
          dataIndex: 'param5',
        },
        {
          title: '盗窃商店',
          key: 'dqshangdian',
          dataIndex: 'param6',
        },
        {
          title: '盗窃自行车',
          key: 'dqzixingche',
          dataIndex: 'param7',
        },
        {
          title: '拎包',
          key: 'linbao',
          dataIndex: 'param8',
        },
        {
          title: '入户盗窃',
          key: 'ruhu',
          dataIndex: 'param9',
        },
        {
          title: '其他盗窃',
          key: 'qt',
          dataIndex: 'param10',
        },
      ];
    }

    return (
      <Spin spinning={loadingData} size="large" tip="数据加载中...">
        <div className={styles.analysis}>
          <AnalysisTitleArea analysisTitle="盗窃类警情" {...this.props} />
          <Row>
            <Col lg={12} md={24}>
              <div
                className={
                  'stealBar' +
                  ' ' +
                  (this.props.global && this.props.global.dark ? '' : styles.lightChartBox)
                }
                style={{ height: 300 }}
              />
            </Col>
            <Col lg={12} md={24}>
              <div
                className={
                  'stealAllType' +
                  ' ' +
                  (this.props.global && this.props.global.dark ? '' : styles.lightChartBox)
                }
                style={{ height: 300 }}
              />
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={tableData}
            bordered
            className={styles.tableArea}
            locale={{
              emptyText: (
                <Empty
                  image={this.props.global && this.props.global.dark ? noList : noListLight}
                  description={'暂无数据'}
                />
              ),
            }}
            pagination={false}
          />
        </div>
      </Spin>
    );
  }
}
