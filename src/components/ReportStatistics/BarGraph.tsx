/**
 * 受立案统计情况--柱状图
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Icon, Spin } from 'antd';
import echarts from 'echarts/lib/echarts';
import dataZoom from 'echarts/lib/component/dataZoom';
import bar from 'echarts/lib/chart/bar';
import styles from './BarGraph.less';
import { tableList } from '../../utils/utils';
import { message } from 'antd/lib/index';

let echartBar;
let app = {};
let labelOption = {};
let headerArry = [];//x轴名称
let saDataArry = [];//受理
let laDataArry = [];//立案
let jaDataArry = [];//结案
let xaDataArry = [];//销案
let parentIdArray = [];//父id
let orgIdArray = [];//机构id
let depthArray = [];//机构的节点深度
let saDataArry1 = [];//受理
let laDataArry1 = [];//立案
let jaDataArry1 = [];//结案
let xaDataArry1 = [];//销案
let parentIdArray1 = [];//父id
let orgIdArray1 = [];//机构id
let depthArray1 = [];//机构的节点深度
let optionList = {};//正常柱状图的option
let optionCompared = {};//时间对比柱状图的option

export default class BarGraph extends PureComponent {
    state = {
        laDataArry: [],//立案
        levelState: '',//判断此次操作是查询2下一级还是1上一级
        depth: '',//机构的节点深度1省2市3区县4大队
        parentId: '',//选中记录的父级主键id
        orgId: '',//选中记录的主键Id
        formValues: {},
        isTimeCompared: false,//是否是时间对比查询
        upperLevelButtonState: false,//上一级是否显示
        xzrq_ks: '',//列表选择日期开始
        xzrq_js: '',
        loading1: false,//查询加载效果
    };

    componentDidMount() {
        // this.getAcceptAndRegisterData();
        this.showEchart();
        window.addEventListener('resize', echartBar.resize);
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        console.log('Bar', nextProps);
        if (nextProps) {
            if ((nextProps.condition !== null) && (this.props.condition !== nextProps.condition)) {
                const { comparedRq1_ks, comparedRq1_js, comparedRq2_ks, comparedRq2_js, xzrq_ks, xzrq_js, parentId, orgId, levelState, depth } = nextProps.condition;
                if (levelState != '' && levelState != null) {
                    //判断此次操作是查询下一级还是上一级
                    if (levelState == 2) {
                        this.setState({
                            upperLevelButtonState: true,
                        });
                    }
                }
                //对比时间不为空，进行时间对此查询
                if (comparedRq1_ks != null && comparedRq1_js != null && comparedRq2_js != null && comparedRq2_ks != null
                    && comparedRq1_ks != '' && comparedRq1_js != '' && comparedRq2_js != '' && comparedRq2_ks != '') {
                    this.setState({
                        comparedRq1_ks: comparedRq1_ks,
                        comparedRq1_js: comparedRq1_js,
                        comparedRq2_ks: comparedRq2_ks,
                        comparedRq2_js: comparedRq2_js,
                        isTimeCompared: true,
                        loading1: true,
                        parentId: parentId,
                        orgId: orgId,
                        levelState: levelState,
                        depth: depth,
                    }, () => {
                        //这里打印的是最新的state值
                        this.getAcceptAndRegisterData();
                    });
                } else {
                    if (xzrq_ks != null && xzrq_js != null && xzrq_ks != '' && xzrq_js != '') {
                        this.setState({
                            comparedRq1_ks: '',
                            comparedRq1_js: '',
                            comparedRq2_ks: '',
                            comparedRq2_js: '',
                            xzrq_ks: xzrq_ks,
                            xzrq_js: xzrq_js,
                            isTimeCompared: false,
                            loading1: true,
                            parentId: parentId,
                            orgId: orgId,
                            levelState: levelState,
                            depth: depth,
                        }, () => {
                            this.getAcceptAndRegisterData();
                        });
                    } else {
                        this.setState({
                            comparedRq1_ks: '',
                            comparedRq1_js: '',
                            comparedRq2_ks: '',
                            comparedRq2_js: '',
                            xzrq_ks: '',
                            xzrq_js: '',
                            isTimeCompared: false,
                            loading1: true,
                            parentId: parentId,
                            orgId: orgId,
                            levelState: levelState,
                            depth: depth,
                        }, () => {
                            this.getAcceptAndRegisterData();
                        });
                    }
                }
            }
        }
    }

    // 获取案件实时数据
    getAcceptAndRegisterData = (param) => {
        const { parentId, orgId, levelState, comparedRq1_ks, comparedRq1_js, comparedRq2_ks, comparedRq2_js, isTimeCompared, depth, xzrq_ks, xzrq_js } = this.state;
        const formValues = {
            parentId: parentId,
            orgId: orgId,
            levelState: levelState,
            comparedRq1_ks: comparedRq1_ks,
            comparedRq1_js: comparedRq1_js,
            comparedRq2_ks: comparedRq2_ks,
            comparedRq2_js: comparedRq2_js,
            type: '1',//如果是柱状图页面，则不分页
            depth: depth,
            xzrq_ks: xzrq_ks,
            xzrq_js: xzrq_js,
        };
        //给AcceptAndRegisterList传值，用于放大柱状图的时候传值使用
        this.props.toBarFullScreenParams(parentId, orgId, levelState, depth, levelState);
        this.setState({
            formValues,
        });
        const params = {
            pd: {
                ...formValues,
            },
        };
        this.props.dispatch({
            type: 'AcceptAndRegisterData/AcceptAndRegisterFetch',
            payload: params ? params : '',
            callback: (data) => {
                //每次查询列表的父id记录，用于上一级查询传参
                const parentIdOfList = data.list[0].parentId;
                if (parentIdOfList != '' && parentIdOfList != null) {
                    this.setState({
                        parentId: data.list[0].parentId,
                    });
                }
                //为表格标题赋值
                this.props.changeHeadCityNameFromBarGraph(data.headCityName.toString());

                //判断上一级按钮是否显示
                if (levelState == 1) {
                    //返回到用户登录级别上一级按钮不显示
                    // alert('upperButtonShow==='+data.upperButtonShow.toString())
                    if (data.upperButtonShow.toString() === '0') {
                        this.setState({
                            upperLevelButtonState: false,
                            levelState: '',
                        });
                    } else {
                        this.setState({
                            upperLevelButtonState: true,
                        });
                    }
                }
                //去掉加载中遮罩
                this.setState({
                    loading1: false,
                });
                // console.log(data.list)
                data = data.list;
                if (echartBar) {
                    //如果是时间对比查询，要多加series
                    // alert('isTimeCompared'+isTimeCompared)
                    if (isTimeCompared) {
                        //柱状图配置设置--start
                        let posList = [
                            'left', 'right', 'top', 'bottom',
                            'inside',
                            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight',
                        ];
                        app.configParameters = {
                            rotate: {
                                min: -90,
                                max: 90,
                            },
                            align: {
                                options: {
                                    left: 'left',
                                    center: 'center',
                                    right: 'right',
                                },
                            },
                            verticalAlign: {
                                options: {
                                    top: 'top',
                                    middle: 'middle',
                                    bottom: 'bottom',
                                },
                            },
                            position: {
                                options: echarts.util.reduce(posList, function(map, pos) {
                                    map[pos] = pos;
                                    return map;
                                }, {}),
                            },
                            distance: {
                                min: 0,
                                max: 100,
                            },
                        };
                        app.config = {
                            rotate: 0,
                            align: 'center',
                            verticalAlign: 'middle',
                            position: 'top',
                            distance: 15,
                            onChange: function() {
                                var labelOption = {
                                    normal: {
                                        rotate: app.config.rotate,
                                        align: app.config.align,
                                        verticalAlign: app.config.verticalAlign,
                                        position: app.config.position,
                                        distance: app.config.distance,
                                    },
                                };
                                // echartBar.setOption({
                                //   series: [{
                                //     label: labelOption
                                //   }, {
                                //     label: labelOption
                                //   }, {
                                //     label: labelOption
                                //   }, {
                                //     label: labelOption
                                //   }]
                                // });
                            },
                        };
                        labelOption = {
                            normal: {
                                show: true,
                                position: app.config.position,
                                distance: app.config.distance,
                                align: app.config.align,
                                verticalAlign: app.config.verticalAlign,
                                rotate: app.config.rotate,
                                formatter: '{c}  {name|{a}}',
                                fontSize: 16,
                                rich: {
                                    name: {
                                        textBorderColor: '#fff',
                                    },
                                },
                            },
                        };
                        //柱状图配置设置--end

                        headerArry = [];
                        saDataArry = [];//受理
                        laDataArry = [];//立案
                        jaDataArry = [];//结案
                        xaDataArry = [];//销案
                        parentIdArray = [];//父id
                        depthArray = [];//机构的节点深度
                        orgIdArray = [];//机构id
                        saDataArry1 = [];//受理
                        laDataArry1 = [];//立案
                        jaDataArry1 = [];//结案
                        xaDataArry1 = [];//销案
                        parentIdArray1 = [];//父id
                        orgIdArray1 = [];//机构id
                        depthArray1 = [];//机构的节点深度
                        let comparedTime = '';//后台返回的对比时间
                        let comparedTime1 = '';//后台返回的第二个对比时间
                        for (let i = 0; i < data.length; i++) {
                            if (i % 2 === 1) {
                                saDataArry1.push(data[i].sa);
                                laDataArry1.push(data[i].la);
                                jaDataArry1.push(data[i].ja);
                                xaDataArry1.push(data[i].xa);
                                parentIdArray1.push(data[i].parentId);
                                orgIdArray1.push(data[i].orgId);
                                depthArray1.push(data[i].depth);
                                comparedTime1 = data[i].comparedTime;
                            } else {
                                saDataArry.push(data[i].sa);
                                laDataArry.push(data[i].la);
                                jaDataArry.push(data[i].ja);
                                xaDataArry.push(data[i].xa);
                                parentIdArray.push(data[i].parentId);
                                orgIdArray.push(data[i].orgId);
                                headerArry.push(data[i].ladwmc);
                                depthArray.push(data[i].depth);
                                comparedTime = data[i].comparedTime;
                            }
                        }

                        optionCompared = {
                            toolbox: {
                                show: false,
                                orient: 'vertical',
                                left: 'right',
                                top: 'center',
                                feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                                    restore: { show: true },
                                    saveAsImage: { show: true },
                                },
                            },
                            calculable: true,

                            color: ['rgba(24, 144, 255, 0.847058823529412)', 'rgba(255, 0, 0, 0.647058823529412)', 'rgba(0, 128, 0, 0.847058823529412)', 'rgba(255, 128, 0, 0.847058823529412)'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow',
                                },
                            },
                            legend: {
                                data: ['受理', '立案', '结案', '销案'],
                            },
                            grid: {
                                left: '1%',
                                right: '4%',
                                bottom: '8%',
                                containLabel: true,
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    axisTick: { show: false },
                                    axisLabel: {
                                        interval: 0,//横轴信息全部显示
                                        // rotate:-30,//-30度角倾斜显示
                                        formatter: function(value) {
                                            // debugger
                                            var ret = '';//拼接加\n返回的类目项
                                            var maxLength = 7;//每项显示文字个数
                                            var valLength = value.length;//X轴类目项的文字个数
                                            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                                            if (rowN > 1)//如果类目项的文字大于3,
                                            {
                                                for (var i = 0; i < rowN; i++) {
                                                    var temp = '';//每次截取的字符串
                                                    var start = i * maxLength;//开始截取的位置
                                                    var end = start + maxLength;//结束截取的位置
                                                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                                    temp = value.substring(start, end) + '\n\n';
                                                    ret += temp; //凭借最终的字符串
                                                }
                                                ret += comparedTime + '\n\n' + comparedTime1 + '\n';
                                                return ret;
                                            } else {
                                                return value + '\n\n' + comparedTime + '\n\n' + comparedTime1 + '\n';
                                            }
                                        },
                                    },
                                    data: headerArry,
                                },
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                },
                            ],
                            dataZoom: [
                                {
                                    type: 'slider',
                                    show: true,
                                    start: 0,
                                    end: 30,
                                    startValue: 0,                           //数据窗口范围的起始数值
                                    endValue: 30,
                                    handleSize: 8,
                                },
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 30,
                                    startValue: 0,                           //数据窗口范围的起始数值
                                    endValue: 30,
                                },
                            ],
                            series: [
                                {
                                    name: '\n' + '受理',
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: saDataArry,
                                    itemStyle: {
                                        normal: {
                                            color: 'rgba(24, 144, 255, 0.847058823529412)',
                                        },
                                    },
                                }
                                , {
                                    name: '\n' + '受理',
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: saDataArry1,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(24, 144, 255, 0.847058823529412)'
                                            color: 'rgba(255, 0, 0, 0.647058823529412)',
                                        },
                                    },
                                }
                                ,
                                {
                                    name: '\n' + '立案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: laDataArry,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(255, 0, 0, 0.647058823529412)'
                                            color: 'rgba(24, 144, 255, 0.847058823529412)',
                                        },
                                    },
                                },
                                {
                                    name: '\n' + '立 案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: laDataArry1,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(255, 0, 0, 0.647058823529412)'
                                            color: 'rgba(255, 0, 0, 0.647058823529412)',
                                        },
                                    },
                                },
                                {
                                    name: '\n' + '结案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: jaDataArry,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(0, 128, 0, 0.847058823529412)'
                                            color: 'rgba(24, 144, 255, 0.847058823529412)',
                                        },
                                    },
                                },
                                {
                                    name: '\n' + '结 案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: jaDataArry1,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(0, 128, 0, 0.847058823529412)'
                                            color: 'rgba(255, 0, 0, 0.647058823529412)',
                                        },
                                    },
                                },
                                {
                                    name: '\n' + '销案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: xaDataArry,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(255, 128, 0, 0.847058823529412)'
                                            color: 'rgba(24, 144, 255, 0.847058823529412)',
                                        },
                                    },
                                },
                                {
                                    name: '\n' + '销 案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: xaDataArry1,
                                    itemStyle: {
                                        normal: {
                                            // color: 'rgba(255, 128, 0, 0.847058823529412)'
                                            color: 'rgba(255, 0, 0, 0.647058823529412)',
                                        },
                                    },
                                    barCategoryGap: '30%',
                                },
                            ],
                        };
                        echartBar = echarts.init(document.getElementById('BarGraph'));
                        echartBar.clear();//清空画布，防止缓存
                        echartBar.setOption(optionCompared);
                    } else {
                        //柱状图配置设置--start
                        let posList = [
                            'left', 'right', 'top', 'bottom',
                            'inside',
                            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight',
                        ];
                        app.configParameters = {
                            rotate: {
                                min: -90,
                                max: 90,
                            },
                            align: {
                                options: {
                                    left: 'left',
                                    center: 'center',
                                    right: 'right',
                                },
                            },
                            verticalAlign: {
                                options: {
                                    top: 'top',
                                    middle: 'middle',
                                    bottom: 'bottom',
                                },
                            },
                            position: {
                                options: echarts.util.reduce(posList, function(map, pos) {
                                    map[pos] = pos;
                                    return map;
                                }, {}),
                            },
                            distance: {
                                min: 0,
                                max: 100,
                            },
                        };
                        app.config = {
                            rotate: 0,
                            align: 'center',
                            verticalAlign: 'middle',
                            position: 'top',
                            distance: 15,
                            onChange: function() {
                                var labelOption = {
                                    normal: {
                                        rotate: app.config.rotate,
                                        align: app.config.align,
                                        verticalAlign: app.config.verticalAlign,
                                        position: app.config.position,
                                        distance: app.config.distance,
                                    },
                                };
                                // echartBar.setOption({
                                //   series: [{
                                //     label: labelOption
                                //   }, {
                                //     label: labelOption
                                //   }, {
                                //     label: labelOption
                                //   }, {
                                //     label: labelOption
                                //   }]
                                // });
                            },
                        };
                        labelOption = {
                            normal: {
                                show: true,
                                position: app.config.position,
                                distance: app.config.distance,
                                align: app.config.align,
                                verticalAlign: app.config.verticalAlign,
                                rotate: app.config.rotate,
                                formatter: '{c}  {name|{a}}',
                                fontSize: 16,
                                rich: {
                                    name: {
                                        textBorderColor: '#fff',
                                    },
                                },
                            },
                        };
                        //柱状图配置设置--end

                        headerArry = [];
                        saDataArry = [];//受理
                        laDataArry = [];//立案
                        jaDataArry = [];//结案
                        xaDataArry = [];//销案
                        parentIdArray = [];//父id
                        orgIdArray = [];//机构id
                        depthArray = [];
                        for (let i = 0; i < data.length; i++) {
                            saDataArry.push(data[i].sa);
                            laDataArry.push(data[i].la);
                            jaDataArry.push(data[i].ja);
                            xaDataArry.push(data[i].xa);
                            parentIdArray.push(data[i].parentId);
                            orgIdArray.push(data[i].orgId);
                            headerArry.push(data[i].ladwmc);
                            depthArray.push(data[i].depth);
                        }
                        // echartBar = echarts.init(document.getElementById('BarGraph'));

                        optionList = {
                            toolbox: {
                                show: false,
                                orient: 'vertical',
                                left: 'right',
                                top: 'center',
                                feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                                    restore: { show: true },
                                    saveAsImage: { show: true },
                                },
                            },
                            calculable: true,

                            color: ['rgba(24, 144, 255, 0.847058823529412)', 'rgba(255, 0, 0, 0.647058823529412)', 'rgba(0, 128, 0, 0.847058823529412)', 'rgba(255, 128, 0, 0.847058823529412)'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow',
                                },
                            },
                            legend: {
                                data: ['受理', '立案', '结案', '销案'],
                            },
                            grid: {
                                left: '1%',
                                right: '4%',
                                bottom: '8%',
                                containLabel: true,
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    axisTick: { show: false },
                                    axisLabel: {
                                        interval: 0,//横轴信息全部显示
                                        // rotate:-30,//-30度角倾斜显示
                                        formatter: function(value) {
                                            // debugger
                                            var ret = '';//拼接加\n返回的类目项
                                            var maxLength = 7;//每项显示文字个数
                                            var valLength = value.length;//X轴类目项的文字个数
                                            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                                            if (rowN > 1)//如果类目项的文字大于3,
                                            {
                                                for (var i = 0; i < rowN; i++) {
                                                    var temp = '';//每次截取的字符串
                                                    var start = i * maxLength;//开始截取的位置
                                                    var end = start + maxLength;//结束截取的位置
                                                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                                    temp = value.substring(start, end) + '\n\n';
                                                    ret += temp; //凭借最终的字符串
                                                }
                                                return ret;
                                            } else {
                                                return value;
                                            }
                                        },
                                    },
                                    data: headerArry,
                                    // data: ['2012', '2013', '2014', '2015', '2016']
                                },
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                },
                            ],
                            dataZoom: [
                                {
                                    type: 'slider',
                                    show: true,
                                    start: 0,
                                    end: 30,
                                    startValue: 0,                           //数据窗口范围的起始数值
                                    endValue: 30,
                                    handleSize: 8,
                                },
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 30,
                                    startValue: 0,                           //数据窗口范围的起始数值
                                    endValue: 30,
                                },
                            ],
                            series: [
                                {
                                    name: '受理',
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: saDataArry,
                                }
                                ,
                                {
                                    name: '立案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: laDataArry,
                                },
                                {
                                    name: '结案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: jaDataArry,
                                },
                                {
                                    name: '销案',
                                    type: 'bar',
                                    label: labelOption,
                                    data: xaDataArry,
                                    barCategoryGap: '30%',
                                },
                            ],
                        };
                        echartBar = echarts.init(document.getElementById('BarGraph'));
                        echartBar.clear();//清空画布，防止缓存
                        echartBar.setOption(optionList);
                    }
                }
            },
        });
        // this.showEchart();
    };
    showEchart = () => {
        echartBar = echarts.init(document.getElementById('BarGraph'));
        //点击某单位的柱状图，直接钻取到子单位
        const myself = this;
        echartBar.on('click', function(params) {

            const index = params.dataIndex;
            //首先判断是否还有下一级单位
            myself.props.dispatch({
                type: 'AcceptAndRegisterData/getOrgListByParentIdFetch',
                payload: {
                    pd: {
                        orgId: orgIdArray[index],
                    },
                },
                callback: (data) => {
                    if (data.list == '') {
                        message.warning('无下级机构，不可查询！');
                    } else {
                        myself.setState({
                            parentId: parentIdArray[index],
                            orgId: orgIdArray[index],
                            depth: depthArray[index],
                            levelState: 2,
                            loading1: true,//加载中
                        }, () => {
                            //这里打印的是最新的state值后执行的操作
                            //显示【上一级】按钮
                            myself.setState({
                                upperLevelButtonState: true,
                            });
                            myself.getAcceptAndRegisterData();
                        });
                    }
                },
            });
        });
    };
    //上一级查询
    getLevelCaseStatisticPgListPage = (levelState) => {
        this.setState({
            levelState: levelState,
            loading1: true,
        }, () => {
            this.getAcceptAndRegisterData();
        });

    };
    //打开放大版的柱状图
    toOpenBarGraphFullScreen = () => {
        this.props.toOpenBarGraphFullScreen();
    };

    render() {
        const { upperLevelButtonState } = this.state;
        return (
            <Spin spinning={this.state.loading1}>
                <Card bodyStyle={{ height: 650 }}>
                    <div style={{ position: 'relative' }}>

                        {upperLevelButtonState ?
                            <Button type="primary" className={styles.forBarMenu}
                                    onClick={() => this.getLevelCaseStatisticPgListPage(1)}>上一级</Button>
                            : ''}
                        <Icon type="arrows-alt" className={styles.forBar}
                              onClick={() => this.toOpenBarGraphFullScreen()}/>


                    </div>
                    {/*<div style={{overflowX: 'auto'}}>*/}
                    <div id="BarGraph" style={{ height: 600, width: '100%' }}></div>
                    {/*</div>*/}
                </Card>
            </Spin>

        );
    }
}
