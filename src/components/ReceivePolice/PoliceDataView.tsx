/*
 * PoliceDataView.js 警情数据展示
 * author：lyp
 * 20181113
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import moment from 'moment/moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import styles from '../../pages/common/dataView.less';
import DataViewDateShow from '../Common/DataViewDateShow';
import { getDefaultDaysForMonth, getTimeDistance } from '../../utils/utils';
import nonDivImg from '../../assets/viewData/nonData.png';
import noListLight from '@/assets/viewData/noListLight.png';

let policeEchartBar;
let policeEchartRingPie;
let policeEchartLine;
let policeThreePie1;
let policeThreePie2;
const colors1 = [
  '#259DF4',
  '#40537E',
  '#EDB59C',
  '#FED501',
  '#3074B5',
  '#72C4B8',
  '#3FC228',
  '#FFD205',
  '#FB1241',
  '#6465FD',
  '#FF6600',
];
@connect(({ global }) => ({
  global,
}))
export default class PoliceDataView extends PureComponent {
  state = {
    currentType: 'today',
    nowData: 0,
    lastData: 0,
    beforeLastData: 0,
    selectedDateData: 0, // 头部统计警情总数——手动选择日期
    dayType: ['today', 'lastDay', 'beforeLastDay'],
    weekType: ['week', 'lastWeek', 'beforeLastWeek'],
    monthType: ['month', 'lastMonth', 'beforeLastMonth'],
    dateType: {
      today: '0',
      lastDay: '1',
      beforeLastDay: '2',
      week: '3',
      lastWeek: '4',
      beforeLastWeek: '5',
      month: '6',
      lastMonth: '7',
      beforeLastMonth: '8',
    },
    jqzkNoData: false, // 警情状况无数据
    jqslNoData: false, // 警情数量无数据
    type: 'now',
  };

  componentDidMount() {
    this.getViewCountData('day');

    const dayTypeTime = this.getTime('today');
    this.getPoliceSituationCount(dayTypeTime[0], dayTypeTime[1]);
    this.getHandleResult(dayTypeTime[0], dayTypeTime[1]);
    this.getHandlePoliceSituationHadResult(dayTypeTime[0], dayTypeTime[1]);
    this.getAcceptPoliceSituation(dayTypeTime[0], dayTypeTime[1]);
    this.getHandlePoliceSituation('today');

    // setTimeout(()=>{
    this.showPoliceEchartBar(this.props);
    this.showPoliceEchartRingPie(this.props);
    this.showPoliceEchartLine(this.props);
    this.showPoliceThreePie1(this.props);
    this.showPoliceThreePie2(this.props);
    // },500)

    window.addEventListener('resize', policeEchartBar.resize);
    window.addEventListener('resize', policeEchartRingPie.resize);
    window.addEventListener('resize', policeEchartLine.resize);
    window.addEventListener('resize', policeThreePie1.resize);
    window.addEventListener('resize', policeThreePie2.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
        if (this.props.global.dark !== nextProps.global.dark) {
            this.showPoliceEchartBar(nextProps);
            this.showPoliceEchartRingPie(nextProps);
            this.showPoliceEchartLine(nextProps);
            this.showPoliceThreePie1(nextProps);
            this.showPoliceThreePie2(nextProps);
            // this.changeCountButtonCurrent(this.state.type);
        }
        let currentType = '';
        if(this.props.searchType !== nextProps.searchType){
            if (nextProps.searchType === 'day') {
                currentType='today';
            }else if (nextProps.searchType === 'week') {
                currentType='week';
            }else if (nextProps.searchType === 'month') {
                currentType='month';
            }else if (nextProps.searchType === 'selectedDate') {
                currentType='selectedDate';
            }
            this.setState({
                currentType,
            });
        }
      if (
        this.props.searchType !== nextProps.searchType ||
        this.props.jjdw !== nextProps.jjdw ||
        this.props.cjdw !== nextProps.cjdw ||
        this.props.selectedDateVal !== nextProps.selectedDateVal||
        this.props.global.dark !== nextProps.global.dark
      ) {
        currentType = currentType ? currentType : this.state.currentType;
          let type = this.state.type;
          let rqtype = '';
          if(this.props.global.dark !== nextProps.global.dark){
              if (type === 'now') {
                  rqtype = nextProps.searchType === 'day' ? 'today' : nextProps.searchType === 'week' ? 'week' : 'month';
              } else if (type === 'last') {
                  rqtype =
                      nextProps.searchType === 'day' ? 'lastDay' : nextProps.searchType === 'week' ? 'lastWeek' : 'lastMonth';
              } else if (type === 'beforeLast') {
                  rqtype =
                      nextProps.searchType === 'day'
                          ? 'beforeLastDay'
                          : nextProps.searchType === 'week'
                          ? 'beforeLastWeek'
                          : 'beforeLastMonth';
              }
          }
        if (nextProps.searchType === 'day') {
          this.getViewCountData('day', nextProps.jjdw, nextProps.cjdw);
          const dayTypeTime = this.getTime(currentType);
          this.getPoliceSituationCount(
            dayTypeTime[0],
            dayTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getHandleResult(dayTypeTime[0], dayTypeTime[1], nextProps.jjdw, nextProps.cjdw);
          this.getHandlePoliceSituationHadResult(
            dayTypeTime[0],
            dayTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getAcceptPoliceSituation(
            dayTypeTime[0],
            dayTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getHandlePoliceSituation(rqtype?rqtype:'today', nextProps.jjdw, nextProps.cjdw);
        } else if (nextProps.searchType === 'week') {
          this.getViewCountData('week', nextProps.jjdw, nextProps.cjdw);
          const weekTypeTime = this.getTime(currentType);
          this.getPoliceSituationCount(
            weekTypeTime[0],
            weekTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getHandleResult(weekTypeTime[0], weekTypeTime[1], nextProps.jjdw, nextProps.cjdw);
          this.getHandlePoliceSituationHadResult(
            weekTypeTime[0],
            weekTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getAcceptPoliceSituation(
            weekTypeTime[0],
            weekTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getHandlePoliceSituation(rqtype ? rqtype:'week', nextProps.jjdw, nextProps.cjdw);
        } else if (nextProps.searchType === 'month') {
          this.getViewCountData('month', nextProps.jjdw, nextProps.cjdw);
          const monthTypeTime = this.getTime(currentType);
          this.getPoliceSituationCount(
            monthTypeTime[0],
            monthTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getHandleResult(monthTypeTime[0], monthTypeTime[1], nextProps.jjdw, nextProps.cjdw);
          this.getHandlePoliceSituationHadResult(
            monthTypeTime[0],
            monthTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getAcceptPoliceSituation(
            monthTypeTime[0],
            monthTypeTime[1],
            nextProps.jjdw,
            nextProps.cjdw,
          );
          this.getHandlePoliceSituation(rqtype?rqtype:'month', nextProps.jjdw, nextProps.cjdw);
        } else if (nextProps.searchType === 'selectedDate') {
            const { selectedDateVal } = nextProps;
            this.setState({
                currentType,
            },()=>{
                this.getPoliceSituationCount(
                    selectedDateVal[0],
                    selectedDateVal[1],
                    nextProps.jjdw,
                    nextProps.cjdw,
                );
                this.getHandleResult(
                    selectedDateVal[0],
                    selectedDateVal[1],
                    nextProps.jjdw,
                    nextProps.cjdw,
                );
                this.getHandlePoliceSituationHadResult(
                    selectedDateVal[0],
                    selectedDateVal[1],
                    nextProps.jjdw,
                    nextProps.cjdw,
                );
                this.getAcceptPoliceSituation(
                    selectedDateVal[0],
                    selectedDateVal[1],
                    nextProps.jjdw,
                    nextProps.cjdw,
                );
                this.getHandlePoliceSituation(
                    'selectedDate',
                    nextProps.jjdw,
                    nextProps.cjdw,
                    selectedDateVal[0],
                    selectedDateVal[1],
                );
            })
        }
      }
    }
  }

  // 获取头部本、上、前按键数据
  getViewCountData = (type, jjdw = this.props.jjdw, cjdw = this.props.cjdw) => {
    const { dayType, weekType, monthType } = this.state;
    if (type === 'day') {
      for (let i in dayType) {
        const dateTypeTime = this.getTime(dayType[i]);
        this.getPoliceSituationCount(dateTypeTime[0], dateTypeTime[1], jjdw, cjdw, dayType[i]);
      }
    } else if (type === 'week') {
      for (let i in weekType) {
        const weekTypeTime = this.getTime(weekType[i]);
        this.getPoliceSituationCount(weekTypeTime[0], weekTypeTime[1], jjdw, cjdw, weekType[i]);
      }
    } else if (type === 'month') {
      for (let i in monthType) {
        const monthTypeTime = this.getTime(monthType[i]);
        this.getPoliceSituationCount(monthTypeTime[0], monthTypeTime[1], jjdw, cjdw, monthType[i]);
      }
    }
  };
  getTime = type => {
    const time = getTimeDistance(type);
    const startTime = time && time[0] ? moment(time[0]).format('YYYY-MM-DD') : '';
    const endTime = time && time[1] ? moment(time[1]).format('YYYY-MM-DD') : '';
    return [startTime, endTime];
  };

  // 本、昨、前change
  changeCountButtonCurrent = type => {
    const { searchType } = this.props;
    let currentType = '';
    if (type === 'now') {
      currentType = searchType === 'day' ? 'today' : searchType === 'week' ? 'week' : 'month';
    } else if (type === 'last') {
      currentType =
        searchType === 'day' ? 'lastDay' : searchType === 'week' ? 'lastWeek' : 'lastMonth';
    } else if (type === 'beforeLast') {
      currentType =
        searchType === 'day'
          ? 'beforeLastDay'
          : searchType === 'week'
          ? 'beforeLastWeek'
          : 'beforeLastMonth';
    }
    this.setState({
      currentType,
      type: type,
    });
    const dataTime = this.getTime(currentType);
    this.getPoliceSituationCount(dataTime[0], dataTime[1]);
    this.getHandleResult(dataTime[0], dataTime[1]);
    this.getHandlePoliceSituation(currentType);
    this.getHandlePoliceSituationHadResult(dataTime[0], dataTime[1]);
    this.getAcceptPoliceSituation(dataTime[0], dataTime[1]);
  };
  // 警情数量
  getPoliceSituationCount = (
    startTime,
    endTime,
    jjdw = this.props.jjdw,
    cjdw = this.props.cjdw,
    type,
  ) => {
    const { dayType, weekType, monthType, currentType } = this.state;
    this.props.dispatch({
      type: 'policeData/getPoliceSituationCount',
      payload: {
        time_ks: startTime,
        time_js: endTime,
        jjdw,
        cjdw,
      },
      callback: data => {
        if (data) {
          const xData = [];
          const barData = [];
          let countAll = 0;
          let bigestNum = 0;
          for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].name !== '全部') {
              xData.push(data.list[i].name);
              const obj = {
                name: data.list[i].name,
                value: data.list[i].count,
                code: data.list[i].code,
              };
              bigestNum = data.list[i].count > bigestNum ? data.list[i].count : bigestNum;
              barData.push(obj);
            } else {
              countAll = data.list[i].count;
            }
          }
          if (currentType === 'selectedDate') {
            this.setState({
              selectedDateData: countAll,
            });
          }
          if (type) {
            if (type === dayType[0] || type === weekType[0] || type === monthType[0]) {
              this.setState({
                nowData: countAll,
              });
            } else if (type === dayType[1] || type === weekType[1] || type === monthType[1]) {
              this.setState({
                lastData: countAll,
              });
            } else if (type === dayType[2] || type === weekType[2] || type === monthType[2]) {
              this.setState({
                beforeLastData: countAll,
              });
            }
          } else {
            if (barData.length > 0) {
              this.setState({
                jqslNoData: false,
              });
              const arry = [...barData];
              const dataShadow = [];
              // const yMax = Math.max.apply(null,arry);
              for (let i = 0; i < barData.length; i++) {
                dataShadow.push({
                  name: barData[i].name,
                  value: bigestNum > 5 ? bigestNum : 5,
                  code: barData[i].code,
                });
              }
              policeEchartBar.setOption({
                xAxis: {
                  data: xData,
                },
                series: [
                  {
                    data: dataShadow,
                      barWidth: 20,
                  },
                  {
                    data: barData,
                      barWidth: 20,
                  },
                ],
              });
            } else {
              this.setState({
                jqslNoData: true,
              });
            }
          }
        }
      },
    });
  };
  // 处置结果
  getHandleResult = (startTime, endTime, jjdw = this.props.jjdw, cjdw = this.props.cjdw) => {
    this.props.dispatch({
      type: 'policeData/getHandleResult',
      payload: {
        time_ks: startTime,
        time_js: endTime,
        jjdw,
        cjdw,
      },
      callback: data => {
        if (data) {
          let legendData = [];
          let pieData = [];
          let countData = 0;
          let otherData = 0;
          let dataLength = data.list.length > 5 ? 6 : data.list.length;
          for (let i = 0; i < dataLength; i++) {
            if (data.list[i].name === '全部') {
              countData = data.list[i].count;
            } else {
              let obj = {
                name: data.list[i].name,
                icon: 'circle',
              };
              legendData.push(obj);
              pieData.push({
                name: data.list[i].name,
                value: data.list[i].count,
                itemStyle: { color: colors1[i] },
              });
              otherData += data.list[i].count;
            }
          }
          if (window.configUrl.is_area === '2') {
            if (legendData.length === 0 && pieData.length === 0) {
              legendData = [
                '报立刑事案件',
                '受理行政案件',
                '报立经侦案件',
                '报立禁毒案件',
                '不予处理',
                '不予立案统计',
                '其他分类',
              ];
              pieData = [
                {
                  name: '报立刑事案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[0],
                  },
                },
                {
                  name: '受理行政案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[1],
                  },
                },
                {
                  name: '报立经侦案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[2],
                  },
                },
                {
                  name: '报立禁毒案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[3],
                  },
                },
                {
                  name: '不予处理',
                  value: '0',
                  itemStyle: {
                    color: colors1[4],
                  },
                },
                {
                  name: '不予立案统计',
                  value: '0',
                  itemStyle: {
                    color: colors1[9],
                  },
                },
                {
                  name: '其他分类',
                  value: '0',
                  itemStyle: {
                    color: colors1[6],
                  },
                },
              ];
            } else {
              legendData.push(
                { name: '不予立案统计', icon: 'circle', itemStyle: { color: colors1[9] } },
                { name: '其他分类', icon: 'circle', itemStyle: { color: colors1[6] } },
              );
              pieData.push(
                {
                  name: '不予立案统计',
                  value: countData - otherData - data.list[7].count,
                  itemStyle: { color: colors1[9] },
                },
                {
                  name: '其他分类',
                  value: countData - otherData,
                  itemStyle: { color: colors1[6] },
                },
              );
            }
          } else {
            if (legendData.length === 0 && pieData.length === 0) {
              legendData = [
                '报立刑事案件',
                '受理行政案件',
                '报立经侦案件',
                '报立禁毒案件',
                '不予处理',
                '其他分类',
              ];
              pieData = [
                {
                  name: '报立刑事案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[0],
                  },
                },
                {
                  name: '受理行政案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[1],
                  },
                },
                {
                  name: '报立经侦案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[2],
                  },
                },
                {
                  name: '报立禁毒案件',
                  value: '0',
                  itemStyle: {
                    color: colors1[3],
                  },
                },
                {
                  name: '不予处理',
                  value: '0',
                  itemStyle: {
                    color: colors1[4],
                  },
                },
                {
                  name: '其他分类',
                  value: '0',
                  itemStyle: {
                    color: colors1[6],
                  },
                },
              ];
            } else {
              legendData.push({
                name: '其他分类',
                icon: 'circle',
                itemStyle: { color: colors1[6] },
              });
              pieData.push({
                name: '其他分类',
                value: countData - otherData,
                itemStyle: { color: colors1[6] },
              });
            }
          }
          policeEchartRingPie.setOption({
            legend: {
              data: legendData,
              formatter: function(name) {
                let formatStr = '';
                for (let i = 0; i < pieData.length; i++) {
                  if (name === pieData[i].name) {
                    formatStr = `${name} ${pieData[i].value}`;
                    break;
                  }
                }
                return formatStr;
              },
            },
              title:[{
                  text:`${countData}`,
                  textStyle: {
                      fontSize: 22,
                      fontWeight: 'normal',
                      color: this.props.global && this.props.global.dark ? '#fff' : '#4d4d4d'
                  },
                  x: '29.2%',
                  y: '45%',
                  padding: 7,
                  textAlign: 'center',
              }],
            series: [
              {
                data: pieData,
                label: {
                  normal: {
                    formatter: ``,
                  },
                },
              },
            ],
          });
        }
      },
    });
  };
  // 处警状况
  getHandlePoliceSituation = (
    currentDateType,
    jjdw = this.props.jjdw,
    cjdw = this.props.cjdw,
    sTime,
    eTime,
  ) => {
    const { dateType } = this.state;
    let payload = {
      rqType: dateType[currentDateType],
      jjdw,
      cjdw,
    };
    if (currentDateType === 'selectedDate') {
      payload = {
        kssj: sTime,
        jssj: eTime,
        jjdw,
        cjdw,
      };
    }

    this.props.dispatch({
      type: 'policeData/getHandlePoliceSituation',
      payload,
      callback: data => {
        if (data) {
          let xData = [];
          let cjData = []; // 处警
          let jjData = []; // 接警
          if (data.list && data.list.length > 0) {
            this.setState({
              jqzkNoData: false,
            });
            // this.showPoliceEchartLine();

            for (let i = 0; i < data.list.length; i++) {
              xData.push(data.list[i].name);
              cjData.push(data.list[i].count1);
              jjData.push(data.list[i].count2);
            }
          } else {
            // this.setState({
            //     jqzkNoData: true,
            // })
            let momentMonth;
            if (dateType[currentDateType] === '6') {
              momentMonth = moment();
            } else if (dateType[currentDateType] === '7') {
              momentMonth = moment().subtract(1, 'months');
            } else if (dateType[currentDateType] === '8') {
              momentMonth = moment().subtract(2, 'months');
            }
            const dayArry = getDefaultDaysForMonth(momentMonth);
            cjData = [0, 0, 0, 0, 0, 0, 0];
            jjData = [0, 0, 0, 0, 0, 0, 0];
            xData = dayArry;
          }
          // let yMax = Math.max(...cjData,...jjData);
          policeEchartLine.setOption({
            xAxis: {
              data: xData,
            },
              // yAxis:{
              //     max:yMax&&yMax > 0 ? yMax : 5
              // },
            series: [
              {
                data: cjData,
                itemStyle: {
                  color: '#FD0134',
                },
              },
              {
                data: jjData,
                itemStyle: {
                  color: '#40A1EE',
                },
              },
            ],
          });
        }
      },
    });
  };
  // 处警情况
  getHandlePoliceSituationHadResult = (
    startTime,
    endTime,
    jjdw = this.props.jjdw,
    cjdw = this.props.cjdw,
  ) => {
    this.props.dispatch({
      type: 'policeData/getHandlePoliceSituationHadResult',
      payload: {
        time_ks: startTime,
        time_js: endTime,
        jjdw,
        cjdw,
      },
      callback: data => {
        if (data) {
          const pieData = [];
          const hadResult = [];
          const noResult = [];
          let countData = 0;
          for (let i = 0; i < data.list.length; i++) {
            countData += data.list[i].count;
            if (data.list[i].name === '处警' || data.list[i].name === '分流')
              hadResult.push({
                name: data.list[i].name,
                value: data.list[i].count,
                itemStyle: { color: '#1ECE79' },
              });
            if (data.list[i].name === '未处警' || data.list[i].name === '未分流')
              noResult.push({
                name: data.list[i].name,
                value: data.list[i].count,
                itemStyle: { color: '#1E50CE' },
              });
          }
          pieData.push({ name: '警情', value: countData, itemStyle: { color: '#1EB8CE' } });
          policeThreePie1.setOption({
            series: [
              {
                data: pieData,
                label: {
                  normal: {
                    formatter: '{c}',
                  },
                },
              },
              {
                data: hadResult,
              },
              {
                data: noResult,
              },
            ],
          });
        }
      },
    });
  };
  // 受案情况
  getAcceptPoliceSituation = (
    startTime,
    endTime,
    jjdw = this.props.jjdw,
    cjdw = this.props.cjdw,
  ) => {
    this.props.dispatch({
      type: 'policeData/getAcceptPoliceSituation',
      payload: {
        time_ks: startTime,
        time_js: endTime,
        jjdw,
        cjdw,
      },
      callback: data => {
        if (data) {
          const pieData = [];
          const hadResult = [];
          const noResult = [];
          let countData = 0;
          for (let i = 0; i < data.list.length; i++) {
            countData += data.list[i].count;
            if (data.list[i].name === '已受案')
              hadResult.push({
                name: data.list[i].name,
                value: data.list[i].count,
                itemStyle: { color: '#1ECE79' },
              });
            if (data.list[i].name === '未受案')
              noResult.push({
                name: data.list[i].name,
                value: data.list[i].count,
                itemStyle: { color: '#1E50CE' },
              });
          }
          pieData.push({ name: '警情', value: countData, itemStyle: { color: '#1EB8CE' } });
          policeThreePie2.setOption({
            series: [
              {
                data: pieData,
                label: {
                  normal: {
                    formatter: '{c}',
                  },
                },
              },
              {
                data: hadResult,
              },
              {
                data: noResult,
              },
            ],
          });
        }
      },
    });
  };
  // 字符串指定位置插入字符： flag：字符；sn：位置
  insertFlg = (str, flg, sn) => {
    let newstr = '';
    for (let i = 0; i < str.length; i += sn) {
      const tmp = str.substring(i, i + sn);
      newstr += tmp + flg;
    }
    return newstr;
  };
  // 警情数量柱状图
  showPoliceEchartBar = nextProps => {
    const that = this;
    policeEchartBar = echarts.init(document.getElementById('jqsl'));
    const option = {
      color: ['#18BACF'],
      // title: {
      //   text: '警情数量',
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: 'normal',
      //   },
      //   padding: 8,
      // },
      xAxis: {
        type: 'category',
        axisLine: { show: false },
        data: [],
        axisTick: {
          alignWithLabel: true,
          // interval: 0,
        },
        axisLabel: {
          interval: 0,
          rotate: 50,
          formatter: value => this.insertFlg(value, '\n', 6),
          textStyle: {
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
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
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
        },
      },
      series: [
        {
          // For shadow
          type: 'bar',
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0)' },
            emphasis: { color: 'rgba(0,0,0,0.05)' },
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: [],
          animation: false,
        },
        {
          type: 'bar',
          // barWidth: '60%',
          data: [],
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}',
              textStyle: {
                fontSize: 16,
                color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
              },
            },
          },
          itemStyle: {
            normal: {
              color: ['#1EB8CE'],
            },
            emphasis: {
              color: ['#1EB8CE'],
            },
          },
        },
      ],
    };
    policeEchartBar.setOption(option, true);
    policeEchartBar.on('click', function(params) {
      const { currentType } = that.state;
      const dataTime =
        currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
      that.props.changeToListPage({ jjly: params.data.code }, dataTime);
    });
  };
  //处置结果环形饼状图
  showPoliceEchartRingPie = nextProps => {
    policeEchartRingPie = echarts.init(document.getElementById('czjg'));
    const option = {
      // title: {
      //   text: '处置结果',
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: 'normal',
      //   },
      //   padding: 8,
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: '14%',
        show: true,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 15,
        selectedMode: false, // 点击
        textStyle: {
          color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          fontSize: 16,
          lineHeight: 24,
        },
        data: [],
      },
      series: [
        {
          name: '处置结果',
          type: 'pie',
          center: ['30%', '50%'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '22',
                color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
      ],
    };
    policeEchartRingPie.setOption(option, true);
  };
  // 警情状况折线图
  showPoliceEchartLine = nextProps => {
    policeEchartLine = echarts.init(document.getElementById('jqzk'));
    const option = {
      // title: {
      //   text: '警情状况',
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: 'normal',
      //   },
      //   padding: 8,
      // },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['处警', '接警'],
        icon: 'stack',
        top: '5%',
        right: '5%',
        itemWidth: 10, // 设置宽度
        itemHeight: 10, // 设置高度
        textStyle: {
          color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
        },
        data: [],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
        },
      },
      series: [
        {
          name: '处警',
          type: 'line',
          data: [],
        },
        {
          name: '接警',
          type: 'line',
          data: [],
        },
      ],
    };
    policeEchartLine.setOption(option, true);
    // let that = this;
    // policeEchartLine.on('click', function (params) {
    //     let time = params.name ? params.name : '';
    //     if(time != 0){
    //         const dataTime = [time,time];
    //         that.props.changeToListPage(null,dataTime);
    //     }
    // })
  };
  // 处警情况三环形饼状图
  showPoliceThreePie1 = nextProps => {
    const that = this;
    policeThreePie1 = echarts.init(document.getElementById('cjqk'));
    const option = {
      title: [
        // {
        //   text: '处警情况',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'normal',
        //   },
        //   padding: 7,
        // },
      {
          text: '警情总数',
          textStyle: {
              fontSize: 16,
              fontWeight: 'normal',
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          x: '50.1%',
          y: '85%',
          padding: [7, 0],
          textAlign: 'center',
      },
        {
          text: window.configUrl.is_area === '2' ? '分流' : '处警',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          x: '15%',
          y: '80%',
          padding: [7, 0],
          textAlign: 'center',
        },
        {
          text: window.configUrl.is_area === '2' ? '未分流' : '未处警',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          x: '85%',
          y: '80%',
          textAlign: 'center',
          padding: [7, 0],
        },
      ],
      // tooltip: {
      //     trigger: 'item',
      //     formatter: '{b}: {c} ({d}%)',
      // },
      series: [
        {
          name: '处警情况',
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['52%', '62%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                  fontSize: '28',
                  color: '#1EB8CE',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
        {
          name: window.configUrl.is_area === '2' ? '分流' : '处警',
          type: 'pie',
          center: ['15%', '50%'],
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{c}',
              textStyle: {
                fontSize: '26',
                color: '#1ECE79',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
        {
          name: window.configUrl.is_area === '2' ? '未分流' : '未处警',
          type: 'pie',
          center: ['85%', '50%'],
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{c}',
              textStyle: {
                  fontSize: '26',
                  color: '#1E50CE',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
      ],
    };
    policeThreePie1.setOption(option, true);
    policeThreePie1.on('click', function(params) {
      const { currentType } = that.state;
      const dataTime =
        currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
      let isHandled = '';
      if (params.name === '分流' || params.name === '处警') {
        isHandled = '1';
      } else if (params.name === '未分流' || params.name === '未处警') {
        isHandled = '0';
      } else if (params.name === '警情') {
        isHandled = '';
      }
      that.props.changeToListPage({ sfcj: isHandled }, dataTime);
    });
  };
  // 受案情况三环形饼状图
  showPoliceThreePie2 = nextProps => {
    const that = this;
    policeThreePie2 = echarts.init(document.getElementById('saqk'));
    const option = {
      title: [
        // {
        //   text: '受案情况',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'normal',
        //   },
        //   padding: 8,
        // },
        {
          text: '已受案',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          x: '15%',
          y: '80%',
          padding: [7, 0],
          textAlign: 'center',
        },
          {
              text: '警情总数',
              textStyle: {
                  fontSize: 16,
                  fontWeight: 'normal',
                  color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
              },
              x: '50.1%',
              y: '85%',
              padding: [7, 0],
              textAlign: 'center',
          },
        {
          text: '未受案',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          x: '85%',
          y: '80%',
          textAlign: 'center',
          padding: [7, 0],
        },
      ],
      // tooltip: {
      //     trigger: 'item',
      //     formatter: '{b}: {c} ({d}%)',
      // },
      series: [
        {
          name: '受案情况',
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['52%', '62%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                  fontSize: '28',
                  color: '#1EB8CE',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
        {
          name: '已受案',
          type: 'pie',
          center: ['15%', '50%'],
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{c}',
              textStyle: {
                  fontSize: '26',
                  color: '#1ECE79',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
        {
          name: '未受案',
          type: 'pie',
          center: ['85%', '50%'],
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{c}',
              textStyle: {
                  fontSize: '26',
                  color: '#1E50CE',
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [],
        },
      ],
    };
    policeThreePie2.setOption(option, true);
    policeThreePie2.on('click', function(params) {
      const { currentType } = that.state;
      const dataTime =
        currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
      let isHandled = '';
      if (params.name === '已受案') {
        isHandled = '1';
      } else if (params.name === '未受案') {
        isHandled = '0';
      } else if (params.name === '受案情况') {
        isHandled = '';
      }
      that.props.changeToListPage({ sfsa: isHandled }, dataTime);
    });
  };

  render() {
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, lg: 12 };
    const { searchType, selectedDateVal, showDataView } = this.props;
    const {
      currentType,
      beforeLastData,
      lastData,
      nowData,
      jqzkNoData,
      jqslNoData,
      selectedDateData,
    } = this.state;
    let className =
      this.props.global && this.props.global.dark
        ? styles.policeDataCard
        : styles.policeDataCard + ' ' + styles.lightBox;
    return (
      <Card style={{ position: 'relative' }} className={className}>
        <div
          className={styles.policeDataView}
          style={showDataView ? {} : { position: 'absolute', zIndex: -1 }}
        >
          {currentType !== 'selectedDate' ? (
            <div className={styles.viewCount}>
              <div
                className={
                  currentType === 'today' || currentType === 'week' || currentType === 'month'
                    ? styles.countButtonCurrent
                    : styles.countButton
                }
                onClick={() => this.changeCountButtonCurrent('now')}
              >
                {searchType === 'day' ? (
                  <DataViewDateShow dataTypeStr="今日" />
                ) : searchType === 'week' ? (
                  <DataViewDateShow dataTypeStr="本周" />
                ) : (
                  <DataViewDateShow dataTypeStr="本月" />
                )}
                <div className={styles.bigCountButtonNumber}>
                  <div>警情：{nowData}</div>
                </div>
              </div>
              <div
                className={
                  currentType === 'lastDay' ||
                  currentType === 'lastWeek' ||
                  currentType === 'lastMonth'
                    ? styles.countButtonCurrent
                    : styles.countButton
                }
                onClick={() => this.changeCountButtonCurrent('last')}
              >
                {searchType === 'day' ? (
                  <DataViewDateShow dataTypeStr="昨日" />
                ) : searchType === 'week' ? (
                  <DataViewDateShow dataTypeStr="前一周" />
                ) : (
                  <DataViewDateShow dataTypeStr="前一月" />
                )}
                <div className={styles.bigCountButtonNumber}>
                  <div>警情：{lastData}</div>
                </div>
              </div>
              <div
                className={
                  currentType === 'beforeLastDay' ||
                  currentType === 'beforeLastWeek' ||
                  currentType === 'beforeLastMonth'
                    ? styles.countButtonCurrent
                    : styles.countButton
                }
                onClick={() => this.changeCountButtonCurrent('beforeLast')}
              >
                {searchType === 'day' ? (
                  <DataViewDateShow dataTypeStr="前日" />
                ) : searchType === 'week' ? (
                  <DataViewDateShow dataTypeStr="前二周" />
                ) : (
                  <DataViewDateShow dataTypeStr="前二月" />
                )}
                <div className={styles.bigCountButtonNumber}>
                  <div>警情：{beforeLastData}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.viewCount}>
              <div className={styles.countButtonCurrent}>
                <div className={styles.countButtonTitle}>
                  <div>{selectedDateVal[0]}</div>
                  <div style={{ lineHeight: '6px' }}>~</div>
                  <div>{selectedDateVal[1]}</div>
                </div>
                <div className={styles.countButtonNumber}>
                  <div>警情：{selectedDateData}</div>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              backgroundColor: this.props.global && this.props.global.dark ? '#252c3c' : '#fff',
              padding: '0 16px',
              borderRadius: 10,
            }}
          >
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col {...colLayout}>
                <div className={styles.cardBoxTitle}><span
                    style={{
                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                        paddingLeft: 10,
                    }}
                >警情数量</span></div>
                <div id="jqsl" className={styles.cardBox}></div>
                {jqslNoData ? (
                  <div>
                    <div style={{ fontSize: 16, padding: '15px 0 0 8px', fontWeight: 500 }}>
                      警情数量
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={this.props.global && this.props.global.dark ? nonDivImg : noListLight}
                        alt="暂无数据"
                      />
                      <div
                        style={{
                          fontSize: 18,
                          color: this.props.global && this.props.global.dark ? '#fff' : '#999',
                        }}
                      >
                        暂无数据
                      </div>
                    </div>
                  </div>
                ) : null}
              </Col>
              <Col {...colLayout}>
                <div className={styles.cardBoxTitle}><span
                    style={{
                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                        paddingLeft: 10,
                    }}
                >处置结果</span></div>
                <div id="czjg" className={styles.cardBox}></div>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col {...colLayout}>
                <div className={styles.cardBoxTitle}><span
                    style={{
                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                        paddingLeft: 10,
                    }}
                >处警情况</span></div>
                <div id="cjqk" className={styles.cardBox}></div>
              </Col>
              <Col {...colLayout}>
                <div className={styles.cardBoxTitle}><span
                    style={{
                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                        paddingLeft: 10,
                    }}
                >受案情况</span></div>
                <div id="saqk" className={styles.cardBox}></div>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col span={24} style={{ marginBottom: 32 }}>
                <div className={styles.cardBoxTitle}><span
                    style={{
                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                        paddingLeft: 10,
                    }}
                >警情状况</span></div>
                <div id="jqzk" className={styles.cardBox}  style={{width:'98%',marginLeft:'1%'}}></div>
                {jqzkNoData ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      padding: 16,
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ fontSize: 16, padding: '8px 0 0 8px' }}>警情状况</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={this.props.global && this.props.global.dark ? nonDivImg : noListLight}
                        alt="暂无数据"
                      />
                      <div
                        style={{
                          fontSize: 18,
                          color: this.props.global && this.props.global.dark ? '#fff' : '#999',
                        }}
                      >
                        暂无数据
                      </div>
                    </div>
                  </div>
                ) : null}
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    );
  }
}
