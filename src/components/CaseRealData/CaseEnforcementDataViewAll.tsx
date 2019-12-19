/*
 * CaseEnforcementDataView.js 刑事案件数据展示(受立案和执法办案合并后)
 * author：jhm
 * 20190917
 * */
import React, { PureComponent } from 'react';
import { Row, Col, Card, Divider, Tooltip, Button, Radio, Icon, message } from 'antd';
import moment from 'moment/moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';
// import styles from '../Styles/dataView.less';
import styles from '../../pages/common/dataView.less';
import { getTimeDistance } from '../../utils/utils';
import DataViewDateShow from '../Common/DataViewDateShow';

let caseEchartBar;
let caseEchartRingPie;
let caseTypeStatisticsBar;
const colors1 = ['#279DF5', '#3F557E', '#FFD401', '#3470AF', '#72C4B8'];

export default class CaseEnforcementDataView extends PureComponent {
  state = {
    currentType: 'week',
    nowData: [0, 0],
    nowDataName: [],
    lastData: [0, 0],
    lastDataName: [],
    beforeLastData: [0, 0],
    beforeLastDataName: [],
    selectedDateData: ['立案：0', '受案：0'], // 头部统计警情总数——手动选择日期
    weekType: ['week', 'lastWeek', 'beforeLastWeek'],
    monthType: ['month', 'lastMonth', 'beforeLastMonth'],
  };

  componentDidMount() {
    this.getViewCountData('week');

    const weekTypeTime = this.getTime('week');
    this.getAllCaseProgress(weekTypeTime[0], weekTypeTime[1]);
    this.getEnforcementMeasure(weekTypeTime[0], weekTypeTime[1]);
    this.getCaseTypeStatistics(weekTypeTime[0], weekTypeTime[1]);

    this.showCaseEchartBar();
    this.showCaseEchartRingPie();
    this.showCaseTypeStatisticsBar();

    window.addEventListener('resize', caseEchartBar.resize);
    window.addEventListener('resize', caseEchartRingPie.resize);
    window.addEventListener('resize', caseTypeStatisticsBar.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (
        this.props.searchType !== nextProps.searchType ||
        this.props.orgcode !== nextProps.orgcode ||
        this.props.selectedDateVal !== nextProps.selectedDateVal
      ) {
        if (nextProps.searchType === 'week') {
          this.setState({
            currentType: 'week',
          });
          this.getViewCountData('week', nextProps.orgcode);
          const weekTypeTime = this.getTime('week');
          this.getAllCaseProgress(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
          this.getEnforcementMeasure(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
          this.getCaseTypeStatistics(weekTypeTime[0], weekTypeTime[1], nextProps.orgcode);
        } else if (nextProps.searchType === 'month') {
          this.setState({
            currentType: 'month',
          });
          this.getViewCountData('month', nextProps.orgcode);
          const monthTypeTime = this.getTime('month');
          this.getAllCaseProgress(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
          this.getEnforcementMeasure(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
          this.getCaseTypeStatistics(monthTypeTime[0], monthTypeTime[1], nextProps.orgcode);
        } else if (nextProps.searchType === 'selectedDate') {
          const { selectedDateVal } = nextProps;
          this.setState(
            {
              currentType: 'selectedDate',
            },
            function() {
              this.getAllCaseProgress(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
              this.getEnforcementMeasure(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
              this.getCaseTypeStatistics(selectedDateVal[0], selectedDateVal[1], nextProps.orgcode);
            },
          );
        }
      }
    }
  }

  // 获取头部本、上、前按键数据
  getViewCountData = (type, orgcode = this.props.orgcode) => {
    const { weekType, monthType } = this.state;
    if (type === 'week') {
      for (let i in weekType) {
        const weekTypeTime = this.getTime(weekType[i]);
        this.getAllCaseProgress(weekTypeTime[0], weekTypeTime[1], orgcode, weekType[i]);
      }
    } else if (type === 'month') {
      for (let i in monthType) {
        const monthTypeTime = this.getTime(monthType[i]);
        this.getAllCaseProgress(monthTypeTime[0], monthTypeTime[1], orgcode, monthType[i]);
      }
    }
  };
  getTime = type => {
    const time = getTimeDistance(type);
    const startTime = time[0] === '' ? '' : moment(time[0]).format('YYYY-MM-DD');
    const endTime = time[1] === '' ? '' : moment(time[1]).format('YYYY-MM-DD');
    return [startTime, endTime];
  };
  // 案件办理进度
  getAllCaseProgress = (startTime, endTime, orgcode = this.props.orgcode, type) => {
    const { weekType, monthType, currentType } = this.state;
    this.props.dispatch({
      type: 'CaseData/getAllCaseProgress',
      payload: {
        kssj: startTime,
        jssj: endTime,
        ssmk: '',
        orgcode,
      },
      callback: data => {
        if (data) {
          const xData = [];
          const barData = [];
          let sa = 0;
          let la = 0;
          let saName = '';
          let laName = '';
          for (let i = 0; i < data.list.length; i++) {
            xData.push(data.list[i].name);
            barData.push(data.list[i].count);
            if (data.list[i].code === 101) {
              sa = data.list[i].count;
              saName = data.list[i].name;
            }
            if (data.list[i].code === 102) {
              la = data.list[i].count;
              laName = data.list[i].name;
            }
          }
          if (currentType === 'selectedDate') {
            this.setState({
              selectedDateData: [`${saName}：${sa}`, `${laName}：${la}`],
            });
          }
          if (type) {
            if (type === weekType[0] || type === monthType[0]) {
              this.setState({
                nowData: [sa, la],
                nowDataName: [saName, laName],
              });
            }
            if (type === weekType[1] || type === monthType[1]) {
              this.setState({
                lastData: [sa, la],
                lastDataName: [saName, laName],
              });
            }
            if (type === weekType[2] || type === monthType[2]) {
              this.setState({
                beforeLastData: [sa, la],
                beforeLastDataName: [saName, laName],
              });
            }
          } else {
            const arry = [...barData];
            const dataShadow = [];
            const yMax = Math.max.apply(null, arry);
            for (let i = 0; i < barData.length; i++) {
              dataShadow.push({ value: yMax + 100, code: data.list[i].code });
            }
            caseEchartBar.setOption({
              xAxis: {
                data: xData,
              },
              series: [
                {
                  data: dataShadow,
                },
                {
                  data: barData,
                },
              ],
            });
          }
        }
      },
    });
  };
  // 获取人员强制措施情况
  getEnforcementMeasure = (startTime, endTime, orgcode = this.props.orgcode) => {
    this.props.dispatch({
      type: 'CaseData/getEnforcementMeasure',
      payload: {
        kssj: startTime,
        jssj: endTime,
        ssmk: '',
        orgcode,
      },
      callback: data => {
        if (data) {
          const legendData = [];
          const pieData = [];
          let countData = 0;
          for (let i = 0; i < data.list.length; i++) {
            let obj = {
              name: data.list[i].name,
              icon: 'circle',
            };
            countData += data.list[i].count;
            legendData.push(obj);
            pieData.push({
              name: data.list[i].name,
              value: data.list[i].count,
              itemStyle: { color: colors1[i] },
            });
          }
          caseEchartRingPie.setOption({
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
            series: [
              {
                data: pieData,
                label: {
                  normal: {
                    formatter: '总数\n\n' + countData,
                  },
                },
              },
            ],
          });
        }
      },
    });
  };
  // 获取刑事案件类别统计
  getCaseTypeStatistics = (startTime, endTime, orgcode = this.props.orgcode) => {
    this.props.dispatch({
      type: 'CaseData/getCaseTypeStatistics',
      payload: {
        kssj: startTime,
        jssj: endTime,
        ajlb: 'xs',
        ssmk: '',
        orgcode,
        is_area: window.configUrl.is_area,
      },
      callback: data => {
        const xData = [];
        const barData = [];
        let isLargeData = false;
        if (data && data.list) {
          data.list.forEach((item, index) => {
            xData.push(item.name);
            barData.push({ value: item.count, code: item.code });
            if (index > 14) isLargeData = true;
          });
        }
        if (isLargeData) {
          caseTypeStatisticsBar.setOption({
            xAxis: {
              data: xData,
            },
            dataZoom: [
              {
                show: true,
                start: 0,
                end: 14,
              },
            ],
            series: [
              {
                data: barData,
              },
            ],
          });
        } else {
          caseTypeStatisticsBar.setOption({
            xAxis: {
              data: xData,
            },
            series: [
              {
                data: barData,
              },
            ],
          });
        }
      },
    });
  };
  // 本、昨、前change
  changeCountButtonCurrent = type => {
    const { searchType } = this.props;
    let currentType = '';
    if (type === 'now') {
      currentType = searchType === 'week' ? 'week' : 'month';
    } else if (type === 'last') {
      currentType = searchType === 'week' ? 'lastWeek' : 'lastMonth';
    } else if (type === 'beforeLast') {
      currentType = searchType === 'week' ? 'beforeLastWeek' : 'beforeLastMonth';
    }
    this.setState({
      currentType,
    });
    const dataTime = this.getTime(currentType);
    this.getAllCaseProgress(dataTime[0], dataTime[1]);
    this.getEnforcementMeasure(dataTime[0], dataTime[1]);
    this.getCaseTypeStatistics(dataTime[0], dataTime[1]);
  };
  // 数组排序
  sortNumber = (a, b) => {
    return a - b;
  };
  // 案件办理进度柱状图
  showCaseEchartBar = () => {
    const that = this;
    caseEchartBar = echarts.init(document.getElementById('ajbljd'));
    const option = {
      color: ['#3398DB'],
      title: {
        // text: '案件办理进度',
        // textStyle: {
        //   fontSize: 16,
        //   fontWeight: 'normal',
        // },
        // padding: 8,
      },
      xAxis: {
        type: 'category',
        axisLine: { show: false },
        data: [],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          textStyle:{
            color:'#fff',
          }
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
            color: '#fff',
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
                color: '#fff',
              },
            },
          },
        },
      ],
    };
    caseEchartBar.setOption(option);
    caseEchartBar.on('click', function(params) {
      const { currentType } = that.state;
      const dataTime =
        currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
      that.props.changeToListPage(
        {
          ajzt: params.data.code
            ? params.data.code.toString()
            : params.name === '受理'
            ? '101'
            : params.name === '立案'
            ? '102'
            : params.name === '破案'
            ? '104'
            : params.name === '撤案'
            ? '105'
            : params.name === '结案'
            ? '107'
            : '',
        },
        dataTime,
      );
    });
  };

  // 人员强制措施环形饼状图
  showCaseEchartRingPie = () => {
    caseEchartRingPie = echarts.init(document.getElementById('ryqzcsqk'));
    const option = {
      title: {
        // text: '人员强制措施情况',
        // textStyle: {
        //   fontSize: 16,
        //   fontWeight: 'normal',
        // },
        // padding: 8,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '8%',
        top: '15%',
        show: true,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 15,
        selectedMode: true, // 点击
        textStyle: {
          color: '#fff',
          fontSize: 16,
          lineHeight: 24,
        },
        data: [],
      },
      series: [
        {
          name: '人员强制措施情况',
          type: 'pie',
          center: ['30%', '50%'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '本周\n\n547',
              textStyle: {
                fontSize: '22',
                // fontWeight: 'bold',
                color: '#fff',
              },
            },
            emphasis: {
              show: false,
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
    caseEchartRingPie.setOption(option, true);
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
  // 案件类型统计柱状图
  showCaseTypeStatisticsBar = () => {
    const that = this;
    caseTypeStatisticsBar = echarts.init(document.getElementById('ajlxtj'));
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      title: {
        // text: '案件类型统计',
        // textStyle: {
        //   fontSize: 16,
        //   fontWeight: 'normal',
        // },
        // padding: 8,
      },
      xAxis: {
        type: 'category',
        axisLine: { show: false },
        data: [],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
          formatter: value => this.insertFlg(value, '\n', 10),
          textStyle:{
            color:'#fff',
          }
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
            color: '#fff',
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: '80%',
          data: [],
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}',
              textStyle: {
                fontSize: 16,
                color: '#fff',
              },
            },
          },
        },
      ],
    };
    caseTypeStatisticsBar.setOption(option);
    caseTypeStatisticsBar.getZr().on('click', function(params) {
      let point = [params.offsetX, params.offsetY];
      if (caseTypeStatisticsBar.containPixel('grid', point)) {
        let xIndex = parseInt(caseTypeStatisticsBar.convertFromPixel({ seriesIndex: 0 }, point)[0]);
        let op = caseTypeStatisticsBar.getOption();
        let code = op.series[0].data[xIndex].code;
        if (code) {
          const { currentType } = that.state;
          const dataTime =
            currentType === 'selectedDate' ? that.props.selectedDateVal : that.getTime(currentType);
          that.props.changeToListPage({ ajlb: [code] }, dataTime);
        }
      }
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
      nowDataName,
      lastDataName,
      beforeLastDataName,
      selectedDateData,
    } = this.state;
    return (
      <Card style={{ position: 'relative' }} className={styles.policeDataCard}>
        <div
          className={styles.caseDataView}
          style={showDataView ? {} : { position: 'absolute', zIndex: -1 }}
        >
          {currentType !== 'selectedDate' ? (
            <div className={styles.viewCount}>
              <div
                className={
                  currentType === 'week' || currentType === 'month'
                    ? styles.countButtonCurrent
                    : styles.countButton
                }
                onClick={() => this.changeCountButtonCurrent('now')}
              >
                {searchType === 'week' ? (
                  <DataViewDateShow dataTypeStr="本周" />
                ) : (
                  <DataViewDateShow dataTypeStr="本月" />
                )}
                <div className={styles.countButtonNumber}>
                  <div>
                    {nowDataName[0]}：{nowData[0]}
                  </div>
                  <div>
                    {nowDataName[1]}：{nowData[1]}
                  </div>
                </div>
              </div>
              <div
                className={
                  currentType === 'lastWeek' || currentType === 'lastMonth'
                    ? styles.countButtonCurrent
                    : styles.countButton
                }
                onClick={() => this.changeCountButtonCurrent('last')}
              >
                {searchType === 'week' ? (
                  <DataViewDateShow dataTypeStr="前一周" />
                ) : (
                  <DataViewDateShow dataTypeStr="前一月" />
                )}
                <div className={styles.countButtonNumber}>
                  <div>
                    {lastDataName[0]}：{lastData[0]}
                  </div>
                  <div>
                    {lastDataName[1]}：{lastData[1]}
                  </div>
                </div>
              </div>
              <div
                className={
                  currentType === 'beforeLastWeek' || currentType === 'beforeLastMonth'
                    ? styles.countButtonCurrent
                    : styles.countButton
                }
                onClick={() => this.changeCountButtonCurrent('beforeLast')}
              >
                {searchType === 'week' ? (
                  <DataViewDateShow dataTypeStr="前二周" />
                ) : (
                  <DataViewDateShow dataTypeStr="前二月" />
                )}
                <div className={styles.countButtonNumber}>
                  <div>
                    {beforeLastDataName[0]}：{beforeLastData[0]}
                  </div>
                  <div>
                    {beforeLastDataName[1]}：{beforeLastData[1]}
                  </div>
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
                  <div>{selectedDateData[0]}</div>
                  <div>{selectedDateData[1]}</div>
                </div>
              </div>
            </div>
          )}
          <div style={{ backgroundColor: '#252c3c', padding: '0 16px' }}>
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col {...colLayout}>
                <div className={styles.cardBoxTitle}>| 案件办理进度</div>
                <div id="ajbljd" className={styles.cardBox}></div>
              </Col>
              <Col {...colLayout}>
                <div className={styles.cardBoxTitle}>| 人员强制措施情况</div>
                <div id="ryqzcsqk" className={styles.cardBox}></div>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={styles.listPageRow}>
              <Col span={24} style={{marginBottom:32}}>
                <div className={styles.cardBoxTitle}>| 案件类型统计</div>
                <div id="ajlxtj" className={styles.cardBox}></div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    );
  }
}
