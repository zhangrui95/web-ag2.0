/*
 * PoliceDataView.js 警情数据展示
 * author：lyp
 * 20181113
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Row, Col, Card, Icon} from 'antd';
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
    chartsTab:'1',
    jcjtjNoData: false, // 接处警统计无数据
    jqslNoData: false, // 警情数量无数据
    type: 'now',
    showCount:5,
    param1:{currentPage:1, showCount:5},
    param2:{currentPage:1, showCount:5,pd:{ajlx:'1'}},
    pageJcj:{},
    pageAj:{},
  };

  componentDidMount() {
    this.getViewCountData('day');

    const dayTypeTime = this.getTime('today');

    // setTimeout(()=>{
    this.getJcj(this.props,this.state.param1);
    this.getAjsc(this.props,this.state.param2);
    this.getCqwsc(this.props,{});
    // },500)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
        if (this.props.global.dark !== nextProps.global.dark) {
            this.getJcj(nextProps,this.state.param1);
            this.getAjsc(nextProps,this.state.param2);
            this.getCqwsc(nextProps,{});
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
        let params ={};
        let params1 ={};
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
          params = {
              currentPage:1,
              showCount:this.state.showCount,
              pd:{
                  dwdm:nextProps.orgcode,
                  kssj:dayTypeTime[0],
                  jssj:dayTypeTime[1],
              }
          };
            params1 = {
                currentPage:1,
                showCount:this.state.showCount,
                pd:{
                    dwdm:nextProps.orgcode,
                    kssj:dayTypeTime[0],
                    jssj:dayTypeTime[1],
                    ajlx:this.state.chartsTab
                }
            };
          this.getJcj(nextProps,params);
          this.getAjsc(nextProps,params1);
          this.getCqwsc(nextProps,params);
        } else if (nextProps.searchType === 'week') {
          this.getViewCountData('week');
          const weekTypeTime = this.getTime(currentType);
            params = {
                currentPage:1,
                showCount:this.state.showCount,
                pd:{
                    dwdm:nextProps.orgcode,
                    kssj:weekTypeTime[0],
                    jssj:weekTypeTime[1],
                }
            };
            params1 = {
                currentPage:1,
                showCount:this.state.showCount,
                pd:{
                    dwdm:nextProps.orgcode,
                    kssj:weekTypeTime[0],
                    jssj:weekTypeTime[1],
                    ajlx:this.state.chartsTab
                }
            };
          this.getJcj(nextProps,params);
          this.getAjsc(nextProps,params1);
          this.getCqwsc(nextProps,params);
        } else if (nextProps.searchType === 'month') {
          this.getViewCountData('month');
          const monthTypeTime = this.getTime(currentType);
            params = {
                currentPage:1,
                showCount:this.state.showCount,
                pd:{
                    dwdm:nextProps.orgcode,
                    kssj:monthTypeTime[0],
                    jssj:monthTypeTime[1],
                }
            };
            params1 = {
                currentPage:1,
                showCount:this.state.showCount,
                pd:{
                    dwdm:nextProps.orgcode,
                    kssj:monthTypeTime[0],
                    jssj:monthTypeTime[1],
                    ajlx:this.state.chartsTab
                }
            };
          this.getJcj(nextProps,params);
          this.getAjsc(nextProps,params1);
          this.getCqwsc(nextProps,params);
        } else if (nextProps.searchType === 'selectedDate') {
            const { selectedDateVal } = nextProps;
            this.setState({
                currentType,
            },()=>{
                params = {
                    currentPage:1,
                    showCount:this.state.showCount,
                    pd:{
                        dwdm:nextProps.orgcode,
                        kssj:selectedDateVal[0],
                        jssj:selectedDateVal[1],
                    }
                };
                params1 = {
                    currentPage:1,
                    showCount:this.state.showCount,
                    pd:{
                        dwdm:nextProps.orgcode,
                        kssj:selectedDateVal[0],
                        jssj:selectedDateVal[1],
                        ajlx:this.state.chartsTab
                    }
                };
              this.getJcj(nextProps,params);
              this.getAjsc(nextProps,params1);
              this.getCqwsc(nextProps,params);
            })
        }
        this.setState({
            params,
            params1
        })
      }
    }
  }
    //换行
    formatter = val => {
        let strs = val.split(''); //字符串数组
        let str = '';
        for (let i = 0, s; (s = strs[i++]); ) {
            //遍历字符串数组
            str += s;
            if (!(i % 8)) str += '\n'; //按需要求余
        }
        return str;
    };
//接处警统计接口
  getJcj = (nextProps,params) =>{
    this.props.dispatch({
      type: 'VideoDate/getJcjCount',
      payload: params,
      callback:(data)=>{
          console.log('data--->',data);
          let xList = [];
          let jqzs = [];
          let ygscs = [];
          let yscs = [];
          let wscs = [];
          let ygls = [];
          let wgls = [];
          let scwcl = [];
          let glbl = [];
          this.setState({param1:params,pageJcj:data.page});
          data.list&&data.list.map((item)=>{
              jqzs.push(item.jqzs);
              ygscs.push(item.ygscs);
              yscs.push(item.yscs);
              wscs.push(item.wscs);
              wgls.push(item.wgls);
              scwcl.push(item.scwcl);
              glbl.push(item.glbl);
              xList.push(this.formatter(item.jjdw_mc));
          })
          let datas = [
              {
                  name: '警情总数',
                  type: 'bar',
                  data: jqzs,
                  barWidth: 20
              },
              {
                  name: '应上传数',
                  type: 'bar',
                  data: ygscs,
                  barWidth: 20
              },
              {
                  name: '已上传数',
                  type: 'bar',
                  data: yscs,
                  barWidth: 20
              },
              {
                  name: '未上传数',
                  type: 'bar',
                  data: wscs,
                  barWidth: 20
              },
              {
                  name: '已关联数',
                  type: 'bar',
                  data: ygls,
                  barWidth: 20
              },
              {
                  name: '未关联数',
                  type: 'bar',
                  data: wgls,
                  barWidth: 20
              },
              {
                  name: '上传完成率',
                  type: 'line',
                  yAxisIndex: 1,
                  data: scwcl,
                  barWidth: 20
              },
              {
                  name: '关联比例',
                  type: 'line',
                  yAxisIndex: 1,
                  data: glbl,
                  barWidth: 20
              }
          ];
        this.showPoliceEchartLine(nextProps,datas,xList);
        window.addEventListener('resize', policeEchartLine.resize);
      }
    });
  }
  //案件上传统计接口
  getAjsc = (nextProps,params) =>{
    this.props.dispatch({
      type: 'VideoDate/getAjscCount',
      payload: params,
      callback:(data)=>{
          console.log('案件上传统计',data);
          let xList = [];
          let ygscs = [];
          let yscs = [];
          let wscs = [];
          let ygls = [];
          let wgls = [];
          let scwcl = [];
          let glbl = [];
          this.setState({param2:params,pageAj:data.page});
          data.list&&data.list.map((item)=>{
              ygscs.push(item.ygscs);
              yscs.push(item.yscs);
              wscs.push(item.wscs);
              ygls.push(item.ygls);
              wgls.push(item.wgls);
              scwcl.push(item.scwcl);
              glbl.push(item.glbl);
              xList.push(this.formatter(item.ajlbmc));
          })
          let datas = [
              {
                  name: '上传总数',
                  type: 'bar',
                  data: ygscs,
                  barWidth: 20
              },
              {
                  name: '已上传总数',
                  type: 'bar',
                  data: yscs,
                  barWidth: 20
              },
              {
                  name: '未上传总数',
                  type: 'bar',
                  data: wscs,
                  barWidth: 20
              },
              {
                  name: '已关联数',
                  type: 'bar',
                  data: ygls,
                  barWidth: 20
              },
              {
                  name: '未关联数',
                  type: 'bar',
                  data: wgls,
                  barWidth: 20
              },
              {
                  name: '上传完成率',
                  type: 'line',
                  yAxisIndex: 1,
                  data: scwcl,
                  barWidth: 20
              },
              {
                  name: '关联比例',
                  type: 'line',
                  yAxisIndex: 1,
                  data: glbl,
                  barWidth: 20
              }
          ]
        this.showajEchartLine(nextProps,datas,xList);
          window.addEventListener('resize', ajEchart.resize);
      }
    });
  }
  //超期未上传统计接口
  getCqwsc = (nextProps,params) => {
    this.props.dispatch({
      type: 'VideoDate/getCqwscCount',
      payload: params,
      callback:(data)=>{
        this.showcqwscEchartLine(nextProps,data);
      }
    });
      window.addEventListener('resize', cqwscEchart.resize);
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
      let params = {
          currentPage:1,
          showCount:this.state.showCount,
          pd:{
              dwdm:this.props.orgcode,
              kssj:dataTime[0],
              jssj:dataTime[1],
          }
      };
     let params1 = {
          currentPage:1,
          showCount:this.state.showCount,
          pd:{
              dwdm:this.props.orgcode,
              kssj:dataTime[0],
              jssj:dataTime[1],
              ajlx:this.state.chartsTab
          }
      };
      this.getJcj(this.props,params);
      this.getAjsc(this.props,params1);
      this.getCqwsc(this.props,params);
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
  showPoliceEchartLine = (nextProps,data,xList) => {
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
          data: xList,
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
  showajEchartLine = (nextProps,data,xList) => {
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
          data: xList,
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
  //接处警统计分页
  getNext = (next,idx) =>{
      let param = this.state['param'+idx];
      console.log('param',param)
      param.currentPage = this.state['param'+idx].currentPage + next;
      if(idx == 1){
          this.getJcj(this.props,param);
      }else if(idx == 2){
          this.getAjsc(this.props,param);
      }
  }
  //切换案件上传统计刑事，行政
    getChangeCharts = (tab) =>{
      this.setState({
          chartsTab:tab
      });
      let params1 = {
          currentPage:1,
          showCount:this.state.showCount,
          pd:{
              dwdm:this.state.param2&&this.state.param2.pd&&this.state.param2.pd.dwdm ? this.state.param2.pd.dwdm : '',
              kssj:this.state.param2&&this.state.param2.pd&&this.state.param2.pd.kssj ? this.state.param2.pd.kssj : '',
              jssj:this.state.param2&&this.state.param2.pd&&this.state.param2.pd.jssj ? this.state.param2.pd.jssj : '',
              ajlx:tab
          }
      };
      this.getAjsc(this.props,params1);
    }
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
        pageJcj,
        pageAj
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
                  <Icon
                      type="left"
                      className={!pageJcj.currentPage || pageJcj.currentPage==1 ? styles.none : styles.leftGos}
                      onClick={()=>this.getNext(-1,1)}
                  />
                  <div id="jcjtj" className={styles.cardBox}  style={{width:'98%',marginLeft:'1%',height:'400px'}}></div>
                  <Icon
                      type="right"
                      className={pageJcj.totalPage === pageJcj.currentPage || pageJcj.totalPage==1 ? styles.none : styles.rightGos}
                      onClick={()=>this.getNext(1,1)}
                  />
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
                  <div className={styles.cardBox} style={{width:'98%',marginLeft:'1%',height:'400px'}}>
                      <div className={styles.listPageWrap} style={{ top: 51, right: 45 }}>
                          <div className={styles.listPageHeader}>
                              <a className={this.state.chartsTab === '1' ? styles.listPageHeaderCurrent : styles.UnlistPageHeaderCurrent} onClick={()=>this.getChangeCharts('1')}>刑事</a>
                              <span>|</span>
                              <a className={this.state.chartsTab === '1' ?  styles.UnlistPageHeaderCurrent : styles.listPageHeaderCurrent} onClick={()=>this.getChangeCharts('2')}>行政</a>
                          </div>
                      </div>
                      <Icon
                          type="left"
                          className={!pageAj.currentPage || pageAj.currentPage==1 ? styles.none : styles.leftGos}
                          onClick={()=>this.getNext(-1,2)}
                      />
                      <div id="ajsc" style={{width:'100%',height:'400px'}}></div>
                      <Icon
                          type="right"
                          className={pageAj.totalPage === pageAj.currentPage || pageAj.totalPage==1 ? styles.none : styles.rightGos}
                          onClick={()=>this.getNext(1,2)}
                      />
                  </div>
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
