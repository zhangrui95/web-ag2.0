/*
* PoliceSituationToCaseCount.js 智慧案管大屏----警情转化案件数量Line
* author：lyp
* 20181120
* */

import React, {PureComponent} from 'react';
import {Button} from 'antd';
import echarts from 'echarts/lib/echarts';
import styles from './bigScreenDisplay.less';

import map from 'echarts/lib/chart/map';
import effectScatter from 'echarts/lib/chart/effectScatter';
import geo from 'echarts/lib/component/geo';
import title from 'echarts/lib/component/title';
import visualMap from 'echarts/lib/component/visualMap';
import china from '../mapData/china';
import mudanjiang from '../mapData/mudanjiangNew';
import hulunbeier from '../mapData/hulunbeier';
import baishan from '../mapData/baishan';
import hebi from '../mapData/hebi';
import erduosi from '../mapData/erduosi';
import guiLin from '../mapData/gui_lin';

let myChart;
let MapData;
let cityName;
let cityPosition;
let renderFlag = 0;
let intervalId;
let count = 0; // 轮播索引

// 市区数据
const {mapCityName} = configUrl;

if (mapCityName === 'baishan') {
    MapData = baishan;
    cityName = [
        {name: '抚松县', code: '220621'},
        {name: '临江市', code: '220681'},
        {name: '浑江区', code: '220602'},
        {name: '江源区', code: '220605'},
        {name: '靖宇县', code: '220622'},
        {name: '长白朝鲜族自治县', code: '220623'},
    ];
} else if (mapCityName === 'mudanjiang') {
    MapData = mudanjiang;
    cityName = [
        {name: '宁安市', code: '231084', cp: [129.470019, 44.346836]},
        {name: '林口县', code: '231025', cp: [130.268402, 45.286645]},
        {name: '海林市', code: '231083', cp: [129.387902, 44.574149]},
        {name: '阳明区', code: '231003', cp: [129.634645, 44.596328]},
        {name: '西安区', code: '231005', cp: [129.61311, 44.581032]},
        {name: '穆棱市', code: '231085', cp: [130.527085, 44.91967]},
        {name: '爱民区', code: '231004', cp: [129.601232, 44.595443]},
        {name: '东宁市', code: '231024', cp: [131.125296, 44.063578]}, // 地图信息代码为231086
        {name: '东安区', code: '231002', cp: [129.623292, 44.582399]},
        {name: '绥芬河市', code: '231081', cp: [131.164856, 44.396864]},
    ];
} else if (mapCityName === 'hebi') {
    MapData = hebi;
    cityName = [
        {name: '山城区', code: '410655', cp: [114.184202, 35.896058]},
        {name: '鹤山区', code: '410656', cp: [114.166551, 35.936128]},
        {name: '淇滨区', code: '410651', cp: [114.293917, 35.748382]},
        {name: '淇县', code: '410622', cp: [114.200379, 35.609478]},
        {name: '浚县', code: '410621', cp: [114.550162, 35.671282]},
    ];
} else if (mapCityName === 'hulunbeier') {
    MapData = hulunbeier;
    cityName = [
        // { name: '鄂伦春自治旗', code: '150723', cp:[123.725684,50.590177]},
        // { name: '扎兰屯市', code: '150783', cp:[122.744401,48.007412]},
        // { name: '牙克石市', code: '150782', cp:[120.729005,49.287024]},
        // { name: '阿荣旗', code: '150721', cp:[123.464615,48.130503]},
        // { name: '莫力达瓦达斡尔族自治旗', code: '150722', cp:[124.507401,48.478385]},
        // { name: '陈巴尔虎旗', code: '150725', cp:[119.437609,49.328422]},
        // { name: '根河市', code: '150785', cp:[121.532724,50.780454]},
        {name: '海拉尔区', code: '150702', cp: [119.764923, 49.213889]},
        // { name: '鄂温克族自治旗', code: '150724', cp:[119.754041,49.143293]},
        // { name: '扎赉诺尔区', code: '150703', cp:[117.716373,49.456567]},
        // { name: '额尔古纳市', code: '150784', cp:[120.178636,50.2439]},
        // { name: '新巴尔虎右旗', code: '150727', cp:[116.825991,48.669134]},
        // { name: '新巴尔虎左旗', code: '150726', cp:[118.267454,48.216571]},
        // { name: '满洲里市', code: '150781', cp:[117.455561,49.590788]},
    ];
    // cityName = [
    //     { name: '鄂伦春自治旗', code: '150723'},
    //     { name: '扎兰屯市', code: '150783'},
    //     { name: '牙克石市', code: '150782'},
    //     { name: '阿荣旗', code: '150721'},
    //     { name: '莫力达瓦达斡尔族自治旗', code: '150722'},
    //     { name: '陈巴尔虎旗', code: '150725'},
    //     { name: '根河市', code: '150785'},
    //     { name: '海拉尔区', code: '150702'},
    //     { name: '鄂温克族自治旗', code: '150724'},
    //     { name: '扎赉诺尔区', code: '150703'},
    //     { name: '额尔古纳市', code: '150784'},
    //     { name: '新巴尔虎右旗', code: '150727'},
    //     { name: '新巴尔虎左旗', code: '150726'},
    //     { name: '满洲里市', code: '150781'},
    // ];
    // cityPosition = {
    //     '鄂伦春自治旗': [123.725684,50.590177],
    //     '扎兰屯市': [122.744401,48.007412],
    //     '牙克石市': [120.729005,49.287024],
    //     '阿荣旗': [123.464615,48.130503],
    //     '莫力达瓦达斡尔族自治旗': [124.507401,48.478385],
    //     '陈巴尔虎旗': [119.437609,49.328422],
    //     '根河市': [121.532724,50.780454],
    //     '海拉尔区': [119.764923,49.213889],
    //     '鄂温克族自治旗': [119.754041,49.143293],
    //     '扎赉诺尔区': [117.716373,49.456567],
    //     '额尔古纳市': [120.178636,50.2439],
    //     '新巴尔虎右旗': [116.825991,48.669134],
    //     '新巴尔虎左旗': [118.267454,48.216571],
    //     '满洲里市': [117.455561,49.590788],
    // };
} else if (mapCityName === 'erduosi') {
    MapData = erduosi;
    cityName = [
        // { name: '康巴什区', code: '150603', cp: [109.790076,39.607472]},
        // { name: '鄂托克前旗', code: '150623', cp: [107.48172,38.183257]},
        // { name: '东胜区', code: '150602', cp: [109.98945,39.81788]},
        {name: '达拉特旗', code: '150621', cp: [110.040281, 40.404076]},
        // { name: '准格尔旗', code: '150622', cp: [111.238332,39.865221]},
        // { name: '鄂托克旗', code: '150624', cp: [107.982604,39.095752]},
        // { name: '乌审旗', code: '150626', cp: [108.842454,38.596611]},
        // { name: '杭锦旗', code: '150625', cp: [108.736324,39.831789]},
        // { name: '伊金霍洛旗', code: '150627', cp: [109.787402,39.604312]},
    ];
} else if (mapCityName === 'guiLin') {
    MapData = guiLin;
    cityName = [
        // { name: '秀峰区', code: '450302', cp: [110.292445,25.278544]},
        // { name: '叠彩区', code: '450303', cp: [110.300783,25.301334]},
        // { name: '象山区', code: '450304', cp: [110.284882,25.261986]},
        // { name: '七星区', code: '450305', cp: [110.317577,25.254339]},
        // { name: '雁山区', code: '450311', cp: [110.305667,25.077646]},
        // { name: '临桂区', code: '450312', cp: [110.205487,25.246257]},
        // { name: '阳朔县', code: '450321', cp: [110.494699,24.77534]},
        // { name: '全州县', code: '450324', cp: [111.072989,25.929897]},
        // { name: '灵川县', code: '450323', cp: [110.325712,25.408541]},
        // { name: '兴安县', code: '450325', cp: [110.670783,25.609554]},
        // { name: '永福县', code: '450326', cp: [109.989208,24.986692]},
        // { name: '灌阳县', code: '450327', cp: [111.160248,25.489098]},
        // { name: '龙胜各族自治县', code: '450328', cp: [110.009423,25.796428]},
        // { name: '资源县', code: '450329', cp: [110.642587,26.0342]},
        {name: '平乐县', code: '450330', cp: [110.642821, 24.632216]},
        // { name: '恭城瑶族自治县', code: '450332', cp: [110.82952,24.833612]},
        // { name: '荔浦县', code: '450331', cp: [110.400149,24.497786]},
    ];
}

export default class ChinaMap extends PureComponent {
    state = {
        caseCountNum: 0,
        warningCountNum: 0,
        criminalNum: 0,
        illegalPersonNum: 0,
        publicTransportation: 0, // 交通
        economicalInvestigation: 0, // 经侦
        criminalInvestigation: 0, // 刑侦
        foodMedicine: 0, // 食药环
        drug: 0, // 禁毒
        mapIntervalTime: this.props.mapLoopTime * 1000,
        mapDataArry: [],
        shadeColors: [
            '#330000',
            '#660000',
            '#990000',
            '#cc0000',
            '#ff0000',
            '#cc3300',
            '#cc3333',
            '#cc6600',
            '#ff6600',
            '#cc9933',
            '#ff9100',
            '#fea500',
            '#fdb60c',
            '#ffcc00',
            '#ffcc66',
            '#cccc00',
            '#FFFF33',
            '#FFFF66',
            '#FFFFCC',
        ],
    };

    componentDidMount() {
        this.showEchart();
        this.getMapData(this.props.selectDate[0], this.props.selectDate[1]);
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (!renderFlag && this.props !== nextProps) {
                const propsArry = Object.values(this.props);
                if (propsArry.includes('ajzs') || propsArry.includes('gjzs')) {
                    this.getCaseAndWarningCount(this.props.selectDate[0], this.props.selectDate[1], '');
                    this.getDirectlyDepCase(this.props.selectDate[0], this.props.selectDate[1], '');
                    renderFlag = 1;
                }
            }
            if ((nextProps.selectDate !== null) && ((this.props.selectDate !== nextProps.selectDate) || (this.props.orgCode !== nextProps.orgCode) || (this.props.org !== nextProps.org))) {
                const propsArry = Object.values(this.props);
                if (propsArry.includes('ajzs') || propsArry.includes('gjzs')) {
                    this.getCaseAndWarningCount(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org);
                    this.getDirectlyDepCase(nextProps.selectDate[0], nextProps.selectDate[1], nextProps.org);
                }
            }
            if ((nextProps.mapLoopTime !== this.props.mapLoopTime) || ((nextProps.selectDate !== null) && (this.props.selectDate !== nextProps.selectDate))) {
                this.getMapData(nextProps.selectDate[0], nextProps.selectDate[1]);
            }
        }
    }

    // 获取案件、告警总数
    getCaseAndWarningCount = (startTime, endTime, orgCode) => {
        this.props.dispatch({
            type: 'show/getCaseAndWarningCount',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: orgCode,
            },
            callback: (data) => {
                if (data) {
                    let caseCountNum = 0;
                    let warningCountNum = 0;
                    let criminalNum = 0;
                    let illegalPersonNum = 0;
                    data.list.forEach(item => {
                        if (item.sj_name === '案件总数') caseCountNum = item.sj_count;
                        if (item.sj_name === '告警总数') warningCountNum = item.sj_count;
                        if (item.sj_name === '违法人员') illegalPersonNum = item.sj_count;
                        if (item.sj_name === '犯罪人员') criminalNum = item.sj_count;
                    });
                    this.setState({
                        caseCountNum,
                        warningCountNum,
                        criminalNum,
                        illegalPersonNum,
                    });
                }
            },
        });
    };
    // 获取直属机构案件数
    getDirectlyDepCase = (startTime, endTime, orgCode) => {
        this.props.dispatch({
            type: 'show/getDirectlyDepCase',
            payload: {
                kssj: startTime,
                jssj: endTime,
                org: orgCode,
            },
            callback: (data) => {
                if (data) {
                    let publicTransportation = 0, // 交通
                        economicalInvestigation = 0, // 经侦
                        criminalInvestigation = 0, // 刑侦
                        foodMedicine = 0, // 食药环
                        drug = 0; // 禁毒
                    if (data.list && data.list.length > 0) {
                        const dataList = data.list;
                        for (let i = 0; i < dataList.length; i++) {
                            if (dataList[i].name === '公交') {
                                publicTransportation = dataList[i].count;
                            } else if (dataList[i].name === '经侦') {
                                economicalInvestigation = dataList[i].count;
                            } else if (dataList[i].name === '刑侦') {
                                criminalInvestigation = dataList[i].count;
                            } else if (dataList[i].name === '食药环') {
                                foodMedicine = dataList[i].count;
                            } else if (dataList[i].name === '禁毒') {
                                drug = dataList[i].count;
                            }
                        }
                    }
                    this.setState({
                        publicTransportation, // 交通
                        economicalInvestigation, // 经侦
                        criminalInvestigation, // 刑侦
                        foodMedicine, // 食药环
                        drug, // 禁毒
                    });
                }
            },
        });
    };
    // 轮播地图
    loopMap = (arry) => {
        const that = this;
        intervalId && clearInterval(intervalId);
        intervalId = setInterval(function () {
            if (count === arry.length) {
                myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                });
                that.props.setAreaCode('');
                count = 0;
            } else {
                myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                });
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: count,
                });
                // myChart.dispatchAction({
                //     type: 'showTip',
                //     seriesIndex: 0,
                //     dataIndex: count,
                // });
                that.props.setAreaCode(arry[count].code);
                count++;
            }
        }, this.props.mapLoopTime * 1000);
    };
    // 停止轮播地图
    stopLoopMap = () => {
        clearInterval(intervalId);
    };
    // 重置地图
    resetMap = () => {
        const {mapDataArry} = this.state;
        if (mapDataArry.length > 0) {
            this.stopLoopMap();
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
            });
            this.props.setAreaCode('');
            count = 0;
            this.loopMap(mapDataArry);
        }
    };
    // 获取地图数据
    getMapData = (startTime, endTime) => {
        this.props.dispatch({
            type: 'show/getMapData',
            payload: {
                kssj: startTime,
                jssj: endTime,
            },
            callback: (data) => {
                if (data) {
                    let arry = [];
                    for (let i in cityName) {
                        let obj = null;
                        if (mapCityName === 'hulunbeier') {
                            if (cityName[i].name === '满洲里市' || cityName[i].name === '扎赉诺尔区' || cityName[i].name === '海拉尔区') {
                                obj = {
                                    label: {
                                        show: false,
                                    },
                                };
                            } else if (cityName[i].name === '扎赉诺尔区') {
                                obj = {
                                    label: {
                                        show: false,
                                    },
                                };
                            }
                        } else if (mapCityName === 'mudanjiang') {
                            if (cityName[i].name === '宁安市') {
                                obj = {
                                    label: {
                                        padding: [80, 20, 0, 0],
                                    },
                                };
                            } else if (cityName[i].name === '海林市') {
                                obj = {
                                    label: {
                                        padding: [0, 80, 0, 0],
                                    },
                                };
                            } else if (cityName[i].name === '爱民区') {
                                obj = {
                                    label: {
                                        padding: [0, 20, 40, 0],
                                    },
                                };
                            } else if (cityName[i].name === '阳明区') {
                                obj = {
                                    label: {
                                        padding: [0, 0, 20, 40],
                                    },
                                };
                            } else if (cityName[i].name === '东安区') {
                                obj = {
                                    label: {
                                        padding: [80, 0, 0, 80],
                                    },
                                };
                            } else if (cityName[i].name === '西安区') {
                                obj = {
                                    label: {
                                        padding: [40, 30, 0, 0],
                                    },
                                };
                            }
                        }

                        arry.push({
                            name: cityName[i].name,
                            value: this.getCityValueByCode(cityName[i].code, data),
                            code: cityName[i].code,
                            cp: cityName[i].cp,
                            ...obj,
                        });
                    }
                    // 先排序
                    arry = arry.sort(function (a, b) {
                        return b.value - a.value;
                    });
                    // 根据排序添加颜色：数据由大到小
                    // for(let i in  arry){
                    //     arry[i] = {
                    //         ...arry[i],
                    //         itemStyle:{
                    //             areaColor: this.state.shadeColors[i],
                    //         },
                    //     }
                    // }
                    // const res = this.convertData(arry.slice(0, 3))

                    myChart.setOption({
                        visualMap: {
                            left: 'right',
                            inRange: {
                                color: [
                                    '#313695',
                                    '#4575b4',
                                    '#74add1',
                                    '#fdae61',
                                    '#f46d43',
                                    '#d73027',
                                    '#a50026',
                                ],
                            },
                            min: arry[arry.length - 1].value,
                            max: arry[0].value,       // 文本，默认为数值文本
                            calculable: false, // 是否展示右侧示例拖拽手柄
                            textStyle: {
                                color: '#fff',
                            },
                        },
                        series: [
                            {
                                data: arry,
                            },
                            // {
                            //     data: res,
                            // },
                        ],
                    });
                    this.setState({mapDataArry: arry});
                    const that = this;
                    // let dataLength = arry.length;
                    this.loopMap(arry);
                    myChart.on('click', function (params) {
                        that.stopLoopMap();
                        myChart.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0,
                        });
                        myChart.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: params.dataIndex,
                        });
                        that.props.setAreaCode(params.data.code);
                    });
                    myChart.on('mouseout', function (params) {
                        that.loopMap(arry);
                    });

                }
            },
        });
    };
    // 根据城市编码获取城市名称
    getCityNameByCode = (code) => {
        for (let i = 0; i < cityName.length; i++) {
            if (code === cityName[i].code) return cityName[i].name;
        }
    };
    // 根据城市编码获取值
    getCityValueByCode = (code, data) => {
        for (let i = 0; i < data.length; i++) {
            if (code === data[i].org) return data[i].count;
        }
        return 0;
    };
    // 根据位置显示数据
    handleCountNumPosition = (type) => {
        const {caseCountNum, warningCountNum, criminalNum, illegalPersonNum} = this.state;
        if (type === 'ajzs') {
            return (
                <div className={styles.countType}>
                    <h4>案件总数</h4>
                    <h2>{caseCountNum}</h2>
                </div>
            );
        } else if (type === 'gjzs') {
            return (
                <div className={styles.countType}>
                    <h4>告警总数</h4>
                    <h2>{warningCountNum}</h2>
                </div>
            );
        } else if (type === 'fzrys') {
            return (
                <div className={styles.countType}>
                    <h4>犯罪人员数</h4>
                    <h2>{criminalNum}</h2>
                </div>
            );
        } else if (type === 'wfrys') {
            return (
                <div className={styles.countType}>
                    <h4>违法人员数</h4>
                    <h2>{illegalPersonNum}</h2>
                </div>
            );
        } else {
            return null;
        }
    };
    convertData = (data) => {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            // let geoCoord = cityPosition[data[i].name];
            // if (geoCoord) {
            //     res.push({
            //         name: data[i].name,
            //         value: geoCoord.concat(data[i].value),
            //         symbolSize: 10,
            //     });
            // }
            res.push({
                name: data[i].name,
                value: [...data[i].cp, data[i].value],
                // value: data[i].value,
                symbolSize: 15,
            });
        }
        return res;

    };

    showEchart = () => {
        echarts.registerMap('MapData', MapData);
        myChart = echarts.init(document.getElementById('ChinaMap'));
        const option = {
            // tooltip:{},
            legend: {
                left: 'left',
                data: ['强', '中', '弱'],
                textStyle: {
                    color: '#ccc',
                },
            },
            geo: {
                map: 'MapData',
                show: false,
                roam: 'scale',
                zoom: 1,
                label: {
                    emphasis: {
                        show: false,
                    },
                },
                itemStyle: {
                    normal: {
                        areaColor: '#000033',
                        borderColor: '#1773c3',
                        shadowColor: '#1773c3',
                        shadowBlur: 20,
                    },
                },
            },
            series: [
                {
                    type: 'map',
                    map: 'MapData',
                    name: '案件总数',
                    zoom: 1,
                    geoIndex: 1,
                    aspectScale: 0.75, // 长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    // tooltip: {
                    //     formatter: function (params) {
                    //         if(params && params.data) return '当前选中城市：' + params.data.name;
                    //     },
                    // },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                            },
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                color: '#fff',
                                fontSize: 18,
                                fontWeight: 'bolder',
                            },
                            // formatter:'{a}:{b}',
                        },
                    },
                    roam: 'scale',
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 1,
                            // color: '#ddb926',
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
                                }],
                                globalCoord: false, // 缺省为 false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            // shadowColor: 'rgba(255, 255, 255, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                        },
                        emphasis: {
                            areaColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: '#6f05c3', // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#c6306c', // 100% 处的颜色
                                }],
                            },
                            borderWidth: 0,
                        },
                    },
                    data: [],
                },
                // {
                //     name: 'Top 3',
                //     type: 'effectScatter',
                //     coordinateSystem: 'geo',
                //     showEffectOn: 'render',
                //     rippleEffect: {
                //         brushType: 'fill',
                //     },
                //     tooltip: {
                //         formatter: function (params) {
                //             return params.seriesName + '<br />' + params.data.name + ':' + params.data.value[2]
                //         },
                //     },
                //     hoverAnimation: true,
                //     itemStyle: {
                //         normal: {
                //             color: '#FF0066',
                //             shadowBlur: 10,
                //             shadowColor: '#4D4D4D',
                //         },
                //     },
                //     zlevel: 1,
                // },
            ],
        };
        myChart.setOption(option);
    };

    render() {
        const {position8, position9, position10, position11} = this.props;
        const {publicTransportation, economicalInvestigation, criminalInvestigation, foodMedicine, drug} = this.state;
        return (
            <div className={styles.mapArea}>
                <div id="ChinaMap" style={{height: '100%', width: '100%'}}></div>
                <div className={styles.countNumberArea}>
                    {this.handleCountNumPosition(position8)}
                    {this.handleCountNumPosition(position9)}
                    {this.handleCountNumPosition(position10)}
                    {this.handleCountNumPosition(position11)}
                </div>
                <div className={styles.directlyDepartments}>
                    <div>
                        <h6>公交</h6>
                        <p>{publicTransportation}</p>
                    </div>
                    <div>
                        <h6>经侦</h6>
                        <p>{economicalInvestigation}</p>
                    </div>
                    <div>
                        <h6>刑侦</h6>
                        <p>{criminalInvestigation}</p>
                    </div>
                    <div>
                        <h6>食药环</h6>
                        <p>{foodMedicine}</p>
                    </div>
                    <div>
                        <h6>禁毒</h6>
                        <p>{drug}</p>
                    </div>


                </div>
                <div onClick={this.resetMap} className={styles.resetMapButton}>全局</div>
            </div>
        );
    }
}
