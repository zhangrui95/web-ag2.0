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

let policeEchartLine;
let ajEchart;
let cqwscEchart;
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
@connect(({ global,VideoDate }) => ({
  global,VideoDate
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
    jcjtjNoData: false, // 接处警统计无数据
    jqslNoData: false, // 警情数量无数据
    type: 'now',
  };

  componentDidMount() {
    this.getViewCountData('day');

    const dayTypeTime = this.getTime('today');

    // setTimeout(()=>{
    this.getJcj(this.props);
    this.getAjsc(this.props);
    this.getCqwsc(this.props);
    // },500)

    window.addEventListener('resize', policeEchartLine.resize);
    window.addEventListener('resize', ajEchart.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
        if (this.props.global.dark !== nextProps.global.dark) {
            this.getJcj(nextProps);
            this.getAjsc(nextProps);
            this.getCqwsc(nextProps);
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
        if(this.props.orgcode!==nextProps.orgcode){
          console.log('orgcode',nextProps.orgcode);
        }
      if (
        this.props.searchType !== nextProps.searchType ||
        this.props.orgcode!==nextProps.orgcode||
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
          this.getViewCountData('day');
          const dayTypeTime = this.getTime(currentType);
          this.getJcj(nextProps,dayTypeTime[0], dayTypeTime[1], nextProps.orgcode);
          this.getAjsc(nextProps,dayTypeTime[0], dayTypeTime[1], nextProps.orgcode);
          this.getCqwsc(nextProps,dayTypeTime[0], dayTypeTime[1], nextProps.orgcode);
        } else if (nextProps.searchType === 'week') {
          this.getViewCountData('week');
          const weekTypeTime = this.getTime(currentType);
          this.getJcj(nextProps,weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
          this.getAjsc(nextProps,weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
          this.getCqwsc(nextProps,weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
        } else if (nextProps.searchType === 'month') {
          this.getViewCountData('month');
          const monthTypeTime = this.getTime(currentType);
          this.getJcj(nextProps,monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
          this.getAjsc(nextProps,monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
          this.getCqwsc(nextProps,monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
        } else if (nextProps.searchType === 'selectedDate') {
            const { selectedDateVal } = nextProps;
            this.setState({
                currentType,
            },()=>{
              this.getJcj(nextProps,selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
              this.getAjsc(nextProps,selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
              this.getCqwsc(nextProps,selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
            })
        }
      }
    }
  }
//接处警统计接口
  getJcj = (nextProps,startTime,endTime,org) =>{
    this.props.dispatch({
      type: 'VideoDate/getJcjCount',
      payload: {},
      callback:(data)=>{
        this.showPoliceEchartLine(nextProps,data);
      }
    });
  }
  //案件上传统计接口
  getAjsc = (nextProps,startTime,endTime,org) =>{
    this.props.dispatch({
      type: 'VideoDate/getAjscCount',
      payload: {},
      callback:(data)=>{
        this.showajEchartLine(nextProps,data);
      }
    });
  }
  //超期未上传统计接口
  getCqwsc = (nextProps,startTime,endTime,org) => {
    this.props.dispatch({
      type: 'VideoDate/getCqwscCount',
      payload: {},
      callback:(data)=>{
        this.showcqwscEchartLine(nextProps,data);
      }
    });
  }
  // 获取头部本、上、前按键数据
  getViewCountData = (type) => {
    const { dayType, weekType, monthType } = this.state;
    if (type === 'day') {
      for (let i in dayType) {
        const dateTypeTime = this.getTime(dayType[i]);
      }
    } else if (type === 'week') {
      for (let i in weekType) {
        const weekTypeTime = this.getTime(weekType[i]);
      }
    } else if (type === 'month') {
      for (let i in monthType) {
        const monthTypeTime = this.getTime(monthType[i]);
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
  // 接处警统计
  showPoliceEchartLine = (nextProps,data) => {
    policeEchartLine = echarts.init(document.getElementById('jcjtj'));
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        // feature: {
        //   dataView: {show: true, readOnly: false},
        //   magicType: {show: true, type: ['line', 'bar']},
        //   restore: {show: true},
        //   saveAsImage: {show: true}
        // }
      },
      legend: {
        data: ['警情总数', '应上传数','已上传数','未上传数','已关联数','未关联数', '上传完成率', '关联比例'],
        top:20,
        right:'10%',
        textStyle: {
          color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
        },
      },
      xAxis: [
        {
          type: 'category',
          data: ['辽阳公安局', '盘锦公安局', '抚顺公安局', '丹东公安局', '铁岭公安局'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          axisLine: {
            show: true, // X轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
          axisLine: {
            show: true, // y轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        },
        {
          type: 'value',
          name: '',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value} %',
            textStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },axisLine: {
            show: true, // y轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        }
      ],
      series: data
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
  // 案件上传统计
  showajEchartLine = (nextProps,data) => {
    ajEchart = echarts.init(document.getElementById('ajsc'));
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        // feature: {
        //   dataView: {show: true, readOnly: false},
        //   magicType: {show: true, type: ['line', 'bar']},
        //   restore: {show: true},
        //   saveAsImage: {show: true}
        // }
      },
      legend: {
        data: ['上传总数', '已上传总数','未上传总数','已关联数','未关联数', '上传完成率', '关联比例'],
        top:20,
        right:'10%',
        textStyle: {
          color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
        },
      },
      xAxis: [
        {
          type: 'category',
          data: ['两抢一盗', '侵财案件', '八类案件'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          axisLine: {
            show: true, // X轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value}'
          },
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
          axisLine: {
            show: true, // y轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        },
        {
          type: 'value',
          name: '',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value} %'
          },
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
          axisLine: {
            show: true, // y轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        }
      ],
      series: data,
    };

    ajEchart.setOption(option, true);
    // let that = this;
    // policeEchartLine.on('click', function (params) {
    //     let time = params.name ? params.name : '';
    //     if(time != 0){
    //         const dataTime = [time,time];
    //         that.props.changeToListPage(null,dataTime);
    //     }
    // })
  };
  //超期未上传统计
  showcqwscEchartLine = (nextProps,data) => {
    cqwscEchart = echarts.init(document.getElementById('cqwsc'));
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        // feature: {
        //   dataView: {show: true, readOnly: false},
        //   magicType: {show: true, type: ['line', 'bar']},
        //   restore: {show: true},
        //   saveAsImage: {show: true}
        // }
      },
      legend: {
        data: ['警情', '案件'],
        top:20,
        right:'10%',
        textStyle: {
          color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
        },
      },
      xAxis: [
        {
          type: 'category',
          data: ['辽阳公安局', '盘锦公安局', '抚顺公安局', '丹东公安局', '铁岭公安局'],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
          },
          axisLine: {
            show: true, // X轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          axisLabel: {
            formatter: '{value}'
          },
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
          axisLine: {
            show: true, // y轴 网格线 颜色类型的修改
            lineStyle: {
              color: nextProps.global && nextProps.global.dark ? '#fff' : '#4d4d4d',
            },
          },
        },
      ],
      series: data,
    };

    cqwscEchart.setOption(option, true);
    // let that = this;
    // policeEchartLine.on('click', function (params) {
    //     let time = params.name ? params.name : '';
    //     if(time != 0){
    //         const dataTime = [time,time];
    //         that.props.changeToListPage(null,dataTime);
    //     }
    // })
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
      jcjtjNoData,
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
                {/*<div className={styles.bigCountButtonNumber}>*/}
                  {/*<div>警情：{nowData}</div>*/}
                {/*</div>*/}
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
                {/*<div className={styles.bigCountButtonNumber}>*/}
                  {/*<div>警情：{lastData}</div>*/}
                {/*</div>*/}
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
                {/*<div className={styles.bigCountButtonNumber}>*/}
                  {/*<div>警情：{beforeLastData}</div>*/}
                {/*</div>*/}
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
              <Col span={24}>
                <div className={styles.cardBoxTitle}><span
                    style={{
                        borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                        paddingLeft: 10,
                    }}
                >接处警统计</span></div>
                <div id="jcjtj" className={styles.cardBox}  style={{width:'98%',marginLeft:'1%',height:'400px'}}></div>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col span={24}>
                <div className={styles.cardBoxTitle}><span
                  style={{
                    borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                    paddingLeft: 10,
                  }}
                >案件上传统计</span></div>
                <div id="ajsc" className={styles.cardBox}  style={{width:'98%',marginLeft:'1%',height:'400px'}}></div>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col span={24} style={{ marginBottom: 32 }}>
                <div className={styles.cardBoxTitle}><span
                  style={{
                    borderLeft: this.props.global && this.props.global.dark ? '3px solid #fff' : '3px solid #3D63D1',
                    paddingLeft: 10,
                  }}
                >超期未上传统计</span></div>
                <div id="cqwsc" className={styles.cardBox}  style={{width:'98%',marginLeft:'1%',height:'400px'}}></div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    );
  }
}
