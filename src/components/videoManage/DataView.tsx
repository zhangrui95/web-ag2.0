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
    jcjtjNoData: false, // 接处警统计无数据
    jqslNoData: false, // 警情数量无数据
    type: 'now',
  };

  componentDidMount() {
    this.getViewCountData('day');

    const dayTypeTime = this.getTime('today');

    // setTimeout(()=>{
    this.showPoliceEchartLine(this.props);
    this.showajEchartLine(this.props);
    this.showcqwscEchartLine(this.props);
    // },500)

    window.addEventListener('resize', policeEchartLine.resize);
    window.addEventListener('resize', ajEchart.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
        if (this.props.global.dark !== nextProps.global.dark) {
            this.showPoliceEchartLine(nextProps);
            this.showajEchartLine(nextProps);
            this.showcqwscEchartLine(nextProps);
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
        } else if (nextProps.searchType === 'week') {
          this.getViewCountData('week', nextProps.jjdw, nextProps.cjdw);
          const weekTypeTime = this.getTime(currentType);
        } else if (nextProps.searchType === 'month') {
          this.getViewCountData('month', nextProps.jjdw, nextProps.cjdw);
          const monthTypeTime = this.getTime(currentType);
        } else if (nextProps.searchType === 'selectedDate') {
            const { selectedDateVal } = nextProps;
            this.setState({
                currentType,
            },()=>{

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
  showPoliceEchartLine = nextProps => {
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
      series: [
        {
          name: '警情总数',
          type: 'bar',
          data: [239,134,78,91,66],
          barWidth: 20
        },
        {
          name: '应上传数',
          type: 'bar',
          data: [42,167,90,33,215],
          barWidth: 20
        },
        {
          name: '已上传数',
          type: 'bar',
          data: [22,33,55,12,137],
          barWidth: 20
        },
        {
          name: '未上传数',
          type: 'bar',
          data: [20,101,41,15,98],
          barWidth: 20
        },
        {
          name: '已关联数',
          type: 'bar',
          data: [120,133,45,66,79],
          barWidth: 20
        },
        {
          name: '未关联数',
          type: 'bar',
          data: [43,92,156,22,43],
          barWidth: 20
        },
        {
          name: '上传完成率',
          type: 'line',
          yAxisIndex: 1,
          data: [20.0, 21.2, 33.3, 54.5, 16.3],
          barWidth: 20
        },
        {
          name: '关联比例',
          type: 'line',
          yAxisIndex: 1,
          data: [60.0, 72.2, 85.3, 24.5, 66.3],
          barWidth: 20
        }
      ]
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
  showajEchartLine = nextProps => {
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
      series: [
        {
          name: '上传总数',
          type: 'bar',
          data: [120,249,189],
          barWidth: 20
        },
        {
          name: '已上传总数',
          type: 'bar',
          data: [56,67,20],
          barWidth: 20
        },
        {
          name: '未上传总数',
          type: 'bar',
          data: [122,198,167],
          barWidth: 20
        },
        {
          name: '已关联数',
          type: 'bar',
          data: [20,33,145],
          barWidth: 20
        },
        {
          name: '未关联数',
          type: 'bar',
          data: [143,44,65],
          barWidth: 20
        },
        {
          name: '上传完成率',
          type: 'line',
          yAxisIndex: 1,
          data: [66, 92, 37],
          barWidth: 20
        },
        {
          name: '关联比例',
          type: 'line',
          yAxisIndex: 1,
          data: [78, 36, 83],
          barWidth: 20
        }
      ]
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
  showcqwscEchartLine = nextProps => {
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
      series: [
        {
          name: '警情',
          type: 'bar',
          data: [20,49,18,45,32],
          barWidth: 20
        },
        {
          name: '案件',
          type: 'bar',
          data: [6,37,21,56,44],
          barWidth: 20
        },
      ]
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
