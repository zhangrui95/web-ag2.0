/*
 * CaseItemCount.js 智慧案管大屏---涉案财物数量funnel
 * author：lyp
 * 20181120
 * */

import React, { PureComponent } from 'react';
import echarts from 'echarts/lib/echarts';
import funnel from 'echarts/lib/chart/funnel';
import title from 'echarts/lib/component/title';

let myChart;

export default class CaseItemCount extends PureComponent {
  componentDidMount() {
    const { selectDate, org, orgCode, orglist } = this.props;
    this.getCaseItemCount(selectDate[0], selectDate[1], org, orgCode, orglist);
    this.showEchart();
    window.addEventListener('resize', myChart.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (
        nextProps.selectDate !== null &&
        (this.props.selectDate !== nextProps.selectDate ||
          this.props.orgCode !== nextProps.orgCode ||
          this.props.org !== nextProps.org ||
          this.props.orglist !== nextProps.orglist)
      ) {
        this.getCaseItemCount(
          nextProps.selectDate[0],
          nextProps.selectDate[1],
          nextProps.org,
          nextProps.orgCode,
          nextProps.orglist,
        );
      }
    }
  }

  // 获取涉案财物数量
  getCaseItemCount = (startTime, endTime, org, orgCode, orglist) => {
    const { shadeColors } = this.props;
    this.props.dispatch({
      type: 'itemData/itemDataView',
      payload: {
        kssj: startTime,
        jssj: endTime,
        org: org,
        orgcode: orgCode,
        orglist: orglist,
      },
      callback: data => {
        if (data) {
          const legendData = [];
          const funnelData = [];
          const dataList = data.list;
          let maxNum = 0;
          let num = 0;
          for (let i = 0; i < dataList.length; i++) {
            legendData.push({
              name: dataList[i].name,
              icon: 'triangle',
            });
            const color = shadeColors[i];
            funnelData.push({
              value: dataList[i].count,
              name: dataList[i].name,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: color[0], // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: color[1], // 100% 处的颜色
                    },
                  ],
                },
              },
            });
            num = num + parseInt(dataList[i].count);
            maxNum = maxNum > dataList[i].count ? maxNum : dataList[i].count;
          }
          this.props.getAllNum(this.props.idx, num, '涉案财物数量');
          // maxNum = maxNum + 100;
          myChart.setOption({
            legend: {
              data: legendData,
            },
            series: [
              {
                max: maxNum,
                data: funnelData,
              },
            ],
          });
        }
      },
    });
  };

  showEchart = () => {
    myChart = echarts.init(document.getElementById('CaseItemCount'));

    const option = {
      title: {
        text: '涉案财物数量',
        textStyle: {
          color: '#66ccff',
          fontSize: 20,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: '10%',
        show: true,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
        selectedMode: false, // 点击
        textStyle: {
          color: '#fff',
          fontSize: 16,
          lineHeight: 16,
        },
        data: [],
      },
      calculable: true,
      series: [
        {
          name: '漏斗图',
          type: 'funnel',
          left: '20',
          top: 60,
          bottom: 60,
          width: '60%',
          min: 0,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 5,
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: function(param) {
                return param.value;
              },
            },
            emphasis: {
              textStyle: {
                fontSize: 20,
              },
            },
          },
          itemStyle: {
            normal: {
              borderWidth: 0,
            },
          },
          data: [],
        },
      ],
    };
    myChart.setOption(option);
  };

  render() {
    return <div id="CaseItemCount" style={{ height: '100%', width: '100%' }}></div>;
  }
}
