/*
* 考评数据展示
* author：zr
* 20190506
* */
import React, { PureComponent } from 'react';
import { Row, Col, Icon, Select } from 'antd';
import echarts from 'echarts/lib/echarts';
import bar from 'echarts/lib/chart/bar';
import title from 'echarts/lib/component/title';
import legend from 'echarts/lib/component/legend';
import tooltip from 'echarts/lib/component/tooltip';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from '../Styles/dataView.less';
import { getUserInfos } from '../../utils/utils';
const { Option } = Select;

export default class EvaluationChats extends PureComponent {
    state = {
        sortCharts1: false,
        sortCharts3: false,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
    };

    componentDidMount() {
        this.initData(0, this.props,false,'0');
        this.initRyData(0, this.props,false,'0');
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.isSearch !== nextProps.isSearch || this.props.reset !== nextProps.reset) {
            this.setState({
                ryValue:undefined,
            })
            if(nextProps.tjnrRedio === '0'){
                this.initDataAj(0, nextProps, this.state.sortCharts1,nextProps.tjnrCode);
                this.initRyDataAj(0, nextProps, this.state.sortCharts3,nextProps.tjnrCode);
            }else if(nextProps.tjnrRedio === '1'){
                this.initDataGj(0, nextProps, this.state.sortCharts1,nextProps.tjnrCode);
                this.initRyDataGj(0, nextProps, this.state.sortCharts3,nextProps.tjnrCode);
            }else{
                this.initData(0, nextProps, this.state.sortCharts1,nextProps.tjnrCode);
                this.initRyData(0, nextProps, this.state.sortCharts3,nextProps.tjnrCode);
            }
        }
    }
    getSort = (idx) => {
        this.setState({
            ['sortCharts' + idx]: !this.state['sortCharts' + idx],
        });
        if (idx === '1') {
            if(this.props.tjnrRedio === '0'){
                this.initDataAj(0, this.props, !this.state['sortCharts' + idx],'0');
            }else if(this.props.tjnrRedio === '1'){
                this.initDataGj(0, this.props, !this.state['sortCharts' + idx],'0');
            }else{
                this.initData(0, this.props, !this.state['sortCharts' + idx],'0');
            }
        } else {
            if(this.props.tjnrRedio === '0'){
                this.initRyDataAj(0, this.props, !this.state['sortCharts' + idx],'0');
            }else if(this.props.tjnrRedio === '1'){
                this.initRyDataGj(0, this.props, !this.state['sortCharts' + idx],'0');
            }else{
                this.initRyData(0, this.props, !this.state['sortCharts' + idx],'0');
            }
        }
    };
    //换行
    formatter = (val) => {
        let strs = val.split(''); //字符串数组
        let str = '';
        for (let i = 0, s; s = strs[i++];) { //遍历字符串数组
            str += s;
            if (!(i % 6)) str += '\n'; //按需要求余
        }
        return str;
    };
    initData = (next, nextProps, sort, type) => {
        let legendData = ['刑事', '行政'];
        let bgColorList = ['#3aa1ff', '#4ecb73'];
        let axisLabel = [];
        let arrDatal = {};
        let seriesValue = [];
        let currentPage1 = this.state.currentPage1 + next * 1;
        this.setState({
            currentPage1: next === 0 ? 1 : currentPage1,
        });
        this.props.dispatch({
            type: 'Evaluation/getJgKfQkTjPgListPage',
            payload: {
                currentPage: currentPage1,
                pd: {
                    bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                    kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                    kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                    tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                    sort: sort ? '0' : '1',
                    xm_type: type
                },
                showCount: 8,
            },
            callback: (data) => {
                if (data.page.totalPage === currentPage1 || data.page.totalPage === 0 || data.page.totalPage === 1) {
                    this.setState({
                        noneRight1: true,
                    });
                } else {
                    this.setState({
                        noneRight1: false,
                    });
                }
                this.setState({
                    jgkf: data.list,
                });
                legendData.map((e,i)=>{
                    arrDatal['arr'+i] = [];
                })
                data.list.map((event) => {
                    let num = 0;
                    legendData.map((e,i)=>{
                        arrDatal['arr'+i].push({ value: event.kflx_kfz.split(',')[i] ? event.kflx_kfz.split(',')[i] : '0', code: event.bkpdw_dm, name: event.bkpdw_mc })
                        num += parseInt(event.kflx_kfz.split(',')[i] ? event.kflx_kfz.split(',')[i] : '0');
                    });
                    axisLabel.push(`${this.formatter(event.bkpdw_mc)}(${num})`);
                });
                for (let i = 0; i < legendData.length; i++) {
                    let seriesDataVal = null;
                    seriesDataVal = {
                        barWidth: 30,//柱状条宽度
                        name: legendData[i],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                show: true,//鼠标悬停时显示label数据
                                color: bgColorList[i],
                            },
                        },
                        label: {
                            normal: {
                                show: true, //显示数据
                                position: 'top',//显示数据位置 'top/right/left/insideLeft/insideRight/insideTop/insideBottom'
                            },
                        },
                        data: arrDatal['arr' + i],
                    };
                    seriesValue.push(seriesDataVal);
                }
                this.buildChart(legendData, axisLabel, seriesValue,'kfqk');
            },
        });
    };
    initDataAj = (next, nextProps, sort, type) => {
        let legendData = ['刑事', '行政'];
        let bgColorList = ['#3aa1ff', '#4ecb73'];
        let axisLabel = [];
        let arrDatal = {};
        let seriesValue = [];
        let currentPage1 = this.state.currentPage1 + next * 1;
        this.setState({
            currentPage1: next === 0 ? 1 : currentPage1,
        });
        this.props.dispatch({
            type: 'Evaluation/getJgKhOfAjslPgListPage',
            payload: {
                currentPage: currentPage1,
                pd: {
                    bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                    kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                    kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                    tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                    sort: sort ? '0' : '1',
                },
                showCount: 8,
            },
            callback: (data) => {
                if (data.page.totalPage === currentPage1 || data.page.totalPage === 0 || data.page.totalPage === 1) {
                    this.setState({
                        noneRight1: true,
                    });
                } else {
                    this.setState({
                        noneRight1: false,
                    });
                }
                this.setState({
                    jgkf: data.list,
                });
                legendData.map((e,i)=>{
                    arrDatal['arr'+i] = [];
                })
                data.list.map((event) => {
                    let num = 0;
                    legendData.map((e,i)=>{
                        arrDatal['arr'+i].push({ value: event.kflx_kfz.split(',')[i] ? event.kflx_kfz.split(',')[i] : '0', code: event.bkpdw_dm, name: event.bkpdw_mc })
                        num += parseInt(event.kflx_kfz.split(',')[i] ? event.kflx_kfz.split(',')[i] : '0');
                    });
                    axisLabel.push(`${this.formatter(event.bkpdw_mc)}(${num})`);
                });
                for (let i = 0; i < legendData.length; i++) {
                    let seriesDataVal = null;
                    seriesDataVal = {
                        barWidth: 30,//柱状条宽度
                        name: legendData[i],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                show: true,//鼠标悬停时显示label数据
                                color: bgColorList[i],
                            },
                        },
                        label: {
                            normal: {
                                show: true, //显示数据
                                position: 'top',//显示数据位置 'top/right/left/insideLeft/insideRight/insideTop/insideBottom'
                            },
                        },
                        data: arrDatal['arr' + i],
                    };
                    seriesValue.push(seriesDataVal);
                }
                this.buildChart(legendData, axisLabel, seriesValue,'kfqkAj');
            },
        });
    };
    initDataGj = (next, nextProps, sort, type) => {
        let legendData = ['行政案件', '刑事案件','涉案物品','办案区','卷宗'];
        let bgColorList = ['#3aa1ff', '#4ecb73'];
        let axisLabel = [];
        let arrDatal = {};
        let seriesValue = [];
        let currentPage1 = this.state.currentPage1 + next * 1;
        this.setState({
            currentPage1: next === 0 ? 1 : currentPage1,
        });
        this.props.dispatch({
            type: 'Evaluation/getJgKhOGjPgListPage',
            payload: {
                currentPage: currentPage1,
                pd: {
                    bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                    kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                    kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                    tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                    sort: sort ? '0' : '1',
                },
                showCount: 8,
            },
            callback: (data) => {
                if (data.page.totalPage === currentPage1 || data.page.totalPage === 0 || data.page.totalPage === 1) {
                    this.setState({
                        noneRight1: true,
                    });
                } else {
                    this.setState({
                        noneRight1: false,
                    });
                }
                this.setState({
                    jgkf: data.list,
                });
                legendData.map((e,i)=>{
                    arrDatal['arr'+i] = [];
                })
                data.list.map((event) => {
                    let num = 0;
                    legendData.map((e,i)=>{
                        arrDatal['arr'+i].push({ value: event.gjlx_count.split(',')[i] ? event.gjlx_count.split(',')[i] : '0', code: event.bkpr_dwdm, name: event.bkpr_dwmc,typeGj:i.toString() })
                        num += parseInt(event.gjlx_count.split(',')[i] ? event.gjlx_count.split(',')[i] : '0');
                    });
                    axisLabel.push(`${this.formatter(event.bkpr_dwmc)}(${num})`);
                });
                for (let i = 0; i < legendData.length; i++) {
                    let seriesDataVal = null;
                    seriesDataVal = {
                        barWidth: 20,//柱状条宽度
                        name: legendData[i],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                show: true,//鼠标悬停时显示label数据
                                color: bgColorList[i],
                            },
                        },
                        label: {
                            normal: {
                                show: true, //显示数据
                                position: 'top',//显示数据位置 'top/right/left/insideLeft/insideRight/insideTop/insideBottom'
                            },
                        },
                        data: arrDatal['arr' + i],
                    };
                    seriesValue.push(seriesDataVal);
                }
                this.buildChart(legendData, axisLabel, seriesValue,'kfqkGj');
            },
        });
    };
    buildChart = (legendData, axisLabel, seriesValue,id) => {
        let chart = document.getElementById(id);
        let echart = echarts.init(chart);
        let that = this;
        let option = {
            title: {
                text: '机构排名',//正标题
                textStyle: {
                    fontSize: 16,
                    fontWeight: '700',
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',//阴影，若需要为直线，则值为'line'
                },
                formatter: function(params) {
                    let res = params[0].name.replace(/\n/g, '');
                    legendData.map((item,idx)=>{
                        res += '<div>' + params[idx].seriesName + '：' + params[idx].value + '</div>';
                    })
                    return res;
                },
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true },
                },
            },
            legend: {
                data: legendData,
                y: 'bottom',//图例说明文字设置
            },
            grid: {
                left: '2%',
                right: '3%',
                bottom: '10%',
                top: '15%',
                containLabel: true,
            },
            xAxis: [{
                min: 0,
                type: 'category', //纵向柱状图，若需要为横向，则此处值为'value'， 下面 yAxis 的type值为'category'
                data: axisLabel,
            }],
            yAxis: [{
                min: 0,
                type: 'value',
                splitArea: { show: false },
            }],
            label: {
                normal: { //显示bar数据
                    show: true,
                    position: 'top',
                },
            },
            series: seriesValue,
        };
        echart.setOption(option);
        if(id === 'kfqkGj'){
            echart.on('click', function(params) {
                that.props.changeToListPage(params.data, '0');
            });
        }else{
            echart.getZr().on('click',function(params){
                let point=[params.offsetX,params.offsetY];
                if(echart.containPixel('grid',point)){
                    let xIndex=parseInt(echart.convertFromPixel({seriesIndex:0}, point)[0]);
                    let op=echart.getOption();
                    let data=op.series[0].data[xIndex];
                    that.props.changeToListPage(data, '0');
                }
            });
        }
    };
    uniqueByKey = (arr, key) => {//数组去重
        let hash = {};
        let result = arr.reduce((total, currentValue) => {
            if (!hash[currentValue[key]]) { //如果当前元素的key值没有在hash对象里，则可放入最终结果数组
                hash[currentValue[key]] = true; //把当前元素key值添加到hash对象
                total.push(currentValue); //把当前元素放入结果数组
            }
            return total; //返回结果数组
        }, []);
        return result;
    };
    initRyData = (next, nextProps, sort, type, bkpr_sfzh,noSearchPerson) => {
        let currentPage3 = this.state.currentPage3 + next * 1;
        this.setState({
            currentPage3: next === 0 ? 1 : currentPage3,
        });
        let legendData = ['分值'];
        let bgColorList = ['#3aa1ff'];
        let axisLabel = [];
        let arrData = [];
        let seriesValue = [];
        this.props.dispatch({
            type: 'Evaluation/getRyKhPmTjPgListPage',
            payload: {
                currentPage: currentPage3,
                pd: {
                    bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                    kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                    kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                    sort: sort ? '0' : '1',
                    tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                    xm_type: type,
                    bkpr_sfzh: bkpr_sfzh ?  bkpr_sfzh : '',
                },
                showCount: 8,
            },
            callback: (data) => {
                if (data.page.totalPage === currentPage3 || data.page.totalPage === 0 || data.page.totalPage === 1) {
                    this.setState({
                        noneRight3: true,
                    });
                } else {
                    this.setState({
                        noneRight3: false,
                    });
                }
                this.setState({
                    rykh: data.list,
                });
                data.list.map((event) => {
                    axisLabel.push(this.formatter(event.bkpr_name));
                    arrData.push({ value: event.kfz ? event.kfz : '0', code: event.bkpr_jh, bkpr_name: event.bkpr_name, bkpr_dwdm: event.bkpr_dwdm });
                });
                for (let i = 0; i < legendData.length; i++) {
                    let seriesDataVal = null;
                    seriesDataVal = {
                        barWidth: 80,//柱状条宽度
                        name: legendData[i],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                show: true,//鼠标悬停时显示label数据
                                color: bgColorList[i],
                            },
                        },
                        label: {
                            normal: {
                                show: true, //显示数据
                                position: 'top',//显示数据位置 'top/right/left/insideLeft/insideRight/insideTop/insideBottom'
                            },
                        },
                        data: arrData,
                    };
                    seriesValue.push(seriesDataVal);
                }
                this.buildRyChart(legendData, axisLabel, seriesValue,'rykh');
            },
        });
        if(!noSearchPerson){
            this.props.dispatch({
                type: 'Evaluation/getRyKhPmTjPgListPage',
                payload: {
                    currentPage: currentPage3,
                    pd: {
                        bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                        kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                        kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                        sort: sort ? '0' : '1',
                        tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                        xm_type: type,
                        bkpr_sfzh: bkpr_sfzh ?  bkpr_sfzh : '',
                    },
                    showCount: 9999,
                },
                callback: (data) => {
                    this.setState({
                        ryList:this.uniqueByKey(data.list, 'bkpr_jh'),
                    });
                },
            });
        }
    };
    initRyDataAj = (next, nextProps, sort, type, bkpr_sfzh,noSearchPerson) => {
        let currentPage3 = this.state.currentPage3 + next * 1;
        this.setState({
            currentPage3: currentPage3,
        });
        let legendData = ['刑事', '行政'];
        let bgColorList = ['#3aa1ff', '#4ecb73'];
        let axisLabel = [];
        let arrData = [];
        let seriesValue = [];
        this.props.dispatch({
            type: 'Evaluation/getRyKhOfAjslPgListPage',
            payload: {
                currentPage: next === 0 ? 1 : currentPage3,
                pd: {
                    bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                    kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                    kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                    sort: sort ? '0' : '1',
                    tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                    bkpr_sfzh:  bkpr_sfzh ?  bkpr_sfzh : '',
                },
                showCount: 8,
            },
            callback: (data) => {
                if (data.page.totalPage === currentPage3 || data.page.totalPage === 0 || data.page.totalPage === 1) {
                    this.setState({
                        noneRight3: true,
                    });
                } else {
                    this.setState({
                        noneRight3: false,
                    });
                }
                this.setState({
                    rykh: data.list,
                });
                legendData.map((e,i)=>{
                    arrData['arr'+i] = [];
                })
                data.list.map((event) => {
                    let num = 0;
                    legendData.map((e,i)=>{
                        arrData['arr'+i].push({ value: event.kflx_kfz.split(',')[i] ? event.kflx_kfz.split(',')[i] : '0', code: event.bkpr_jh, bkpr_name: event.bkpr_name, bkpr_dwdm: event.bkpr_dwdm })
                        num += parseInt(event.kflx_kfz.split(',')[i] ? event.kflx_kfz.split(',')[i] : '0') ;
                    });
                    axisLabel.push(`${this.formatter(event.bkpr_name)}(${num})`);
                });
                for (let i = 0; i < legendData.length; i++) {
                    let seriesDataVal = null;
                    seriesDataVal = {
                        barWidth: 30,//柱状条宽度
                        name: legendData[i],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                show: true,//鼠标悬停时显示label数据
                                color: bgColorList[i],
                            },
                        },
                        label: {
                            normal: {
                                show: true, //显示数据
                                position: 'top',//显示数据位置 'top/right/left/insideLeft/insideRight/insideTop/insideBottom'
                            },
                        },
                        data: arrData['arr' + i],
                    };
                    seriesValue.push(seriesDataVal);
                }
                this.buildRyChart(legendData, axisLabel, seriesValue,'rykhAj');
            },
        });
        if(!noSearchPerson){
            this.props.dispatch({
                type: 'Evaluation/getRyKhOfAjslPgListPage',
                payload: {
                    currentPage: next === 0 ? 1 : currentPage3,
                    pd: {
                        bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                        kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                        kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                        sort: sort ? '0' : '1',
                        tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                        bkpr_sfzh:  bkpr_sfzh ?  bkpr_sfzh : '',
                    },
                    showCount: 9999,
                },
                callback: (data) => {
                    this.setState({
                        ryList:this.uniqueByKey(data.list, 'bkpr_jh'),
                    });
                },
            });
        }
    };
    initRyDataGj = (next, nextProps, sort, type, bkpr_sfzh,noSearchPerson) => {
        let currentPage3 = this.state.currentPage3 + next * 1;
        this.setState({
            currentPage3: next === 0 ? 1 : currentPage3,
        });
        let legendData = ['行政案件', '刑事案件','涉案物品','办案区','卷宗'];
        let bgColorList = ['#3aa1ff', '#4ecb73'];
        let axisLabel = [];
        let arrData = [];
        let seriesValue = [];
        this.props.dispatch({
            type: 'Evaluation/getRyKhOGjPgListPage',
            payload: {
                currentPage: currentPage3,
                pd: {
                    bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                    kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                    kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                    sort: sort ? '0' : '1',
                    tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                    bkpr_sfzh: bkpr_sfzh ?  bkpr_sfzh : ''
                },
                showCount: 8,
            },
            callback: (data) => {
                if (data.page.totalPage === currentPage3 || data.page.totalPage === 0 || data.page.totalPage === 1) {
                    this.setState({
                        noneRight3: true,
                    });
                } else {
                    this.setState({
                        noneRight3: false,
                    });
                }
                this.setState({
                    rykh: data.list,
                });
                legendData.map((e,i)=>{
                    arrData['arr'+i] = [];
                })
                data.list.map((event) => {
                    let num = 0;
                    legendData.map((e,i)=>{
                        arrData['arr'+i].push({ value: event.gjlx_count.split(',')[i] ? event.gjlx_count.split(',')[i] : '0', code: event.bkpr_jh, bkpr_name: event.bkpr_name,typeGj:i.toString(), bkpr_dwdm: event.bkpr_dwdm})
                        num += parseInt(event.gjlx_count.split(',')[i]? event.gjlx_count.split(',')[i] : '0');
                    });
                    axisLabel.push(`${this.formatter(event.bkpr_name)}(${num})`);
                });
                for (let i = 0; i < legendData.length; i++) {
                    let seriesDataVal = null;
                    seriesDataVal = {
                        barWidth: 20,//柱状条宽度
                        name: legendData[i],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                show: true,//鼠标悬停时显示label数据
                                color: bgColorList[i],
                            },
                        },
                        label: {
                            normal: {
                                show: true, //显示数据
                                position: 'top',//显示数据位置 'top/right/left/insideLeft/insideRight/insideTop/insideBottom'
                            },
                        },
                        data: arrData['arr' + i],
                    };
                    seriesValue.push(seriesDataVal);
                }
                this.buildRyChart(legendData, axisLabel, seriesValue,'rykhGj');
            },
        });
        if(!noSearchPerson){
            this.props.dispatch({
                type: 'Evaluation/getRyKhOGjPgListPage',
                payload: {
                    currentPage: currentPage3,
                    pd: {
                        bkpdw_dm: nextProps.bkpdwTb.toString() ? nextProps.bkpdwTb.toString() : '',
                        kprq_ks: nextProps.kprqTb && nextProps.kprqTb[0] ? nextProps.kprqTb[0].format('YYYY-MM-DD') : '',
                        kprq_js: nextProps.kprqTb && nextProps.kprqTb[1] ? nextProps.kprqTb[1].format('YYYY-MM-DD') : '',
                        sort: sort ? '0' : '1',
                        tjfw: nextProps.tjfw ? nextProps.tjfw : '',
                        bkpr_sfzh: bkpr_sfzh ?  bkpr_sfzh : ''
                    },
                    showCount: 9999,
                },
                callback: (data) => {
                    this.setState({
                        ryList:this.uniqueByKey(data.list, 'bkpr_jh'),
                    });
                },
            });
        }
    };
    buildRyChart = (legendData, axisLabel, seriesValue,id) => {
        let chart = document.getElementById(id);
        let that = this;
        let echart = echarts.init(chart);
        let option = {
            title: {
                text: '人员考核排名',//正标题
                textStyle: {
                    fontSize: 16,
                    fontWeight: '700',
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',//阴影，若需要为直线，则值为'line'
                },
                formatter: function(params) {
                    let res = params[0].name.replace(/\n/g, '');
                    legendData.map((e,idx)=>{
                        res += '<div>' + params[idx].seriesName + '：' + params[idx].value + '</div>';
                    })
                    return res;
                },
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true },
                },
            },
            grid: {
                left: '2%',
                right: '3%',
                bottom: '10%',
                top: '15%',
                containLabel: true,
            },
            xAxis: [{
                min: 0,
                type: 'category', //纵向柱状图，若需要为横向，则此处值为'value'， 下面 yAxis 的type值为'category'
                data: axisLabel,
            }],
            yAxis: [{
                min: 0,
                type: 'value',
                splitArea: { show: false },
            }],
            label: {
                normal: { //显示bar数据
                    show: true,
                    position: 'top',
                },
            },
            series: seriesValue,
        };
        echart.setOption(option);
        if(id === 'rykhGj'){
            echart.on('click', function(params) {
                that.props.changeToListPage(params.data, '2');
            });
        }else{
            echart.getZr().on('click',function(params){
                let point=[params.offsetX,params.offsetY];
                if(echart.containPixel('grid',point)){
                    let xIndex=parseInt(echart.convertFromPixel({seriesIndex:0}, point)[0]);
                    let op=echart.getOption();
                    let data=op.series[0].data[xIndex];
                    that.props.changeToListPage(data, '2');
                }
            });
        }
    };
    getRy = (value) =>{
        this.setState({
            ryValue:value,
        })
        if(this.props.tjnrRedio === '0'){
            this.initRyDataAj(0, this.props, this.state['sortCharts3'],'0',value.toString(),true);
        }else if(this.props.tjnrRedio === '1'){
            this.initRyDataGj(0, this.props, this.state['sortCharts3'],'0',value.toString(),true);
        }else{
            this.initRyData(0, this.props, this.state['sortCharts3'],'0',value.toString(),true);
        }
    }
    getKeyDown = (value)=>{
        this.props.handleAllPoliceOptionChange(value, false,getUserInfos().department)
    }
    render() {
        const rowLayout = { xxl: 24 };
        const colLayout = { sm: 24, lg: 24 };
        const { lastData, nowData } = this.state;
        const allPoliceOptions = this.props.allPolice&&this.props.allPolice.map(d => <Option key={`${d.idcard}`}
                                                                       value={`${d.idcard}`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        return (
            <div className={styles.evalDataView}>
                <Row gutter={rowLayout} className={styles.listPageRow}>
                    <Col {...colLayout} className={styles.cardBox}>
                        <Icon type="left" className={this.state.currentPage1 === 1 ? styles.none : styles.leftGo}
                              onClick={() => this.props.tjnrRedio === '0' ? this.initDataAj(-1, this.props, this.state.sortCharts1) : this.props.tjnrRedio === '1' ? this.initDataGj(-1, this.props, this.state.sortCharts1)  : this.initData(-1, this.props, this.state.sortCharts1,this.props.tjnrCode)}/>
                        <div className={styles.sortIcon} style={{ left: '110px' }} onClick={() => this.getSort('1')}>
                            <Icon type="caret-up" style={this.state.sortCharts1 ? {} : { color: '#1890ff' }}/>
                            <Icon type="caret-down" style={this.state.sortCharts1 ? { color: '#1890ff' } : {}}/>
                        </div>
                        <div id="kfqkAj" className={this.props.tjnrRedio === '0' ? styles.rightCharts : styles.none}></div>
                        <div id="kfqkGj" className={this.props.tjnrRedio === '1' ? styles.rightCharts : styles.none}></div>
                        <div id="kfqk" className={this.props.tjnrRedio === '3' ? styles.rightCharts : styles.none}></div>
                        <Icon type="right" className={this.state.noneRight1 ? styles.none : styles.rightGo}
                              onClick={() => this.props.tjnrRedio === '0' ? this.initDataAj(1, this.props, this.state.sortCharts1) : this.props.tjnrRedio === '1' ? this.initDataGj(1, this.props, this.state.sortCharts1)  : this.initData(1, this.props, this.state.sortCharts1,this.props.tjnrCode)}/>
                        <div className={styles.leftNunList}>
                            {
                                this.state.jgkf && this.state.jgkf.map((event) => {
                                    return <Row
                                        // onClick={() => this.props.changeToListPage({ data: { code: event.bkpdw_dm } }, '0')}
                                        className={styles.rightList}>
                                        <Col span={14} className={styles.nameRight}><Ellipsis lines={1}
                                                                                              tooltip>{this.props.tjnrRedio === '1' ? event.bkpr_dwmc : event.bkpdw_mc}</Ellipsis></Col>
                                        <Col span={8}>：{this.props.tjnrRedio === '0' ? event.aj_count :this.props.tjnrRedio === '1' ? event.gj_count : event.kfz == '0' ? event.kfz : event.kfz}</Col>
                                    </Row>;

                                })
                            }
                        </div>
                    </Col>
                </Row>
                <Row gutter={rowLayout} className={styles.listPageRow}>
                    <Col {...colLayout} className={styles.cardBox}>
                        <Icon type="left" className={styles.leftGo}
                              className={this.state.currentPage3 === 1 ? styles.none : styles.leftGo}
                              onClick={() => this.props.tjnrRedio === '0' ?  this.initRyDataAj(-1, this.props, this.state.sortCharts3, this.props.tjnrCode) : this.props.tjnrRedio === '1' ?  this.initRyDataGj(-1, this.props, this.state.sortCharts3, this.props.tjnrCode): this.initRyData(-1, this.props, this.state.sortCharts3, this.props.tjnrCode)}/>
                        <div className={styles.sortIcon} onClick={() => this.getSort('3')}>
                            <Icon type="caret-up" style={this.state.sortCharts3 ? {} : { color: '#1890ff' }}/>
                            <Icon type="caret-down" style={this.state.sortCharts3 ? { color: '#1890ff' } : {}}/>
                        </div>
                        <Select
                            showSearch
                            value={this.state.ryValue}
                            onChange={this.getRy}
                            className={styles.choiceRy}
                            placeholder="请选择人员"
                            mode="multiple"
                            optionLabelProp='title'
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.indexOf(input) >= 0
                            }
                        >
                            {this.state.ryList&&this.state.ryList.map((d)=>{
                               return <Option key={`${d.bkpr_jh}`} value={`${d.bkpr_jh}`} title={d.bkpr_name}>{`${d.bkpr_name} ${d.bkpr_jh}`}</Option>
                            })}
                        </Select>
                        <div id="rykhAj" className={this.props.tjnrRedio === '0' ? styles.rightCharts : styles.none}></div>
                        <div id="rykhGj" className={this.props.tjnrRedio === '1' ? styles.rightCharts : styles.none}></div>
                        <div id="rykh" className={this.props.tjnrRedio === '3' ? styles.rightCharts : styles.none}></div>
                        <Icon type="right" className={this.state.noneRight3 ? styles.none : styles.rightGo}
                              onClick={() => this.props.tjnrRedio === '0' ?  this.initRyDataAj(1, this.props, this.state.sortCharts3, this.props.tjnrCode) : this.props.tjnrRedio === '1' ?  this.initRyDataGj(1, this.props, this.state.sortCharts3, this.props.tjnrCode): this.initRyData(1, this.props, this.state.sortCharts3, this.props.tjnrCode)}/>
                        <div className={styles.leftNunListRy}>
                            {
                                this.state.rykh && this.state.rykh.map((event) => {
                                    return <Row
                                        // onClick={() => this.props.changeToListPage({ data: { code: event.bkpr_jh } }, '2')}
                                        className={styles.rightList}>
                                        <Col span={15} className={styles.nameCenter}>
                                            <div><Ellipsis lines={1}
                                                           tooltip>{event.bkpr_dwmc ? event.bkpr_dwmc : ''}</Ellipsis>
                                            </div>
                                            <div className={styles.nameCenter}><Ellipsis lines={1}
                                                                                         tooltip>{event.bkpr_name ? event.bkpr_name : ''}</Ellipsis>
                                            </div>
                                        </Col>
                                        <Col span={7}
                                             style={{ lineHeight: '40px' }}>：{this.props.tjnrRedio === '0' ? event.aj_count :this.props.tjnrRedio === '1' ? event.gj_count : event.kfz == '0' ? event.kfz : event.kfz}</Col>
                                    </Row>;

                                })
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
