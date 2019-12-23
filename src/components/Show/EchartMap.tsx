/*
* EchartMap.js 大屏展示页面 地图组件
* author：lyp
* 20180604
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col} from 'antd';
import echarts from 'echarts/lib/echarts';
import map from 'echarts/lib/chart/map';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';
import toolbox from 'echarts/lib/component/toolbox';
import visualMap from 'echarts/lib/component/visualMap';
import styles from './ComponentStyles.less';
import mudanjiang from './mapData/mudanjiang_bak';
import hulunbeier from './mapData/hulunbeier';
import baishan from './mapData/baishan';

let myChart;
let intervalId;
let MapData;
let cityName;

// 市区数据
const {mapCityName, mapAreaChangeTime} = configUrl;

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
        {name: '宁安市', code: '231084'},
        {name: '林口县', code: '231025'},
        {name: '海林市', code: '231083'},
        {name: '阳明区', code: '231003'},
        {name: '西安区', code: '231005'},
        {name: '穆棱市', code: '231085'},
        {name: '爱民区', code: '231004'},
        {name: '东宁县', code: '231086'},
        {name: '东安区', code: '231002'},
        {name: '绥芬河市', code: '231081'},
    ];
} else if (mapCityName === 'hulunbeier') {
    MapData = hulunbeier;
    cityName = [
        {name: '鄂伦春自治旗', code: '150723'},
        {name: '扎兰屯市', code: '150783'},
        {name: '牙克石市', code: '150782'},
        {name: '阿荣旗', code: '150721'},
        {name: '莫力达瓦达斡尔族自治旗', code: '150722'},
        {name: '陈巴尔虎旗', code: '150725'},
        {name: '根河市', code: '150785'},
        {name: '海拉尔区', code: '150702'},
        {name: '鄂温克族自治旗', code: '150724'},
        {name: '扎赉诺尔区', code: '150703'},
        {name: '额尔古纳市', code: '150784'},
        {name: '新巴尔虎右旗', code: '150727'},
        {name: '新巴尔虎左旗', code: '150726'},
        {name: '满洲里市', code: '150781'},
    ];
}


export default class EchartMap extends PureComponent {

    state = {
        mapIntervalTime: mapAreaChangeTime * 1000,
    };

    componentDidMount() {
        this.getMapData();
        this.showEchart();
        window.addEventListener('resize', myChart.resize);
        // window.onresize = myChart.resize;
    }

    // 获取地图数据
    getMapData = () => {
        this.props.dispatch({
            type: 'show/getMapData',
            payload: {},
            callback: (data) => {
                if (data) {
                    const arry = [];
                    for (let i in cityName) {
                        arry.push({
                            name: cityName[i].name,
                            value: this.getCityValueByCode(cityName[i].code, data),
                            code: cityName[i].code,
                        });
                    }
                    myChart.setOption({
                        series: [{
                            data: arry,
                        }],
                    });
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: (count) % dataLength,
                        // dataIndex: 7,
                    });
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: (count) % dataLength,
                        // dataIndex: 7,
                    });
                    let count = 0;
                    let dataLength = arry.length;
                    const that = this;
                    intervalId && clearInterval(intervalId);
                    intervalId = setInterval(function () {
                        myChart.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0,
                        });
                        myChart.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: (count) % dataLength,
                            // dataIndex: 7,
                        });
                        myChart.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0,
                            dataIndex: (count) % dataLength,
                            // dataIndex: 7,
                        });
                        that.props.setAreaCode(arry[(count) % dataLength].code);
                        // that.props.setAreaCode('150702');
                        count++;
                    }, this.state.mapIntervalTime);
                    // myChart.dispatchAction()
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
    showEchart = () => {
        echarts.registerMap('MapData', MapData);
        myChart = echarts.init(document.getElementById('echartMap'));
        const option = {
            // title: {
            //     text: '案件总数：2018',
            //     top: 'bottom',
            //     left: 'center',
            //     textStyle: {
            //         color: '#fff',
            //         fontSize: 24,
            //     },
            // },
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br>案件数为：{c} ',
            },
            // toolbox: {
            //     show: true,
            //     orient: 'vertical',
            //     left: 'right',
            //     top: 'center',
            //     feature: {
            //         dataView: {readOnly: false},
            //         restore: {},
            //         saveAsImage: {}
            //     }
            // },
            visualMap: {
                min: 0,
                max: 2000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: false,
                show: false,
                inRange: {
                    color: ['#165B7F', '#064377', '#0A1C39'],
                },
            },
            series: [
                {
                    name: 'maapp',
                    type: 'map',
                    mapType: 'MapData', // 自定义扩展图表类型
                    zoom: 1.2,
                    // roam:true,
                    label: {
                        color: '#fff',
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                                color: '#fff',
                                formatter: '{c}',
                                fontSize: 12,
                            },
                            borderColor: 'rgba(83,125,194,0.6)',
                            borderWidth: 2,
                        },
                        emphasis: {
                            label: {
                                show: true,
                            },
                            areaColor: '#70e3fe',
                        },
                    },
                    data: [],
                },
            ],
        };
        myChart.setOption(option);
        // myChart.on('rendered', function (params) {
        // });
    };
    initMapData = () => {

        this.props.setAreaCode('');
        this.getMapData();
    };

    render() {
        return (
            <div className={styles.componentBlock} style={{background: 'none'}}>
                <p id="echartMap" style={{width: '100%', height: '100%'}}></p>
                <a style={{position: 'absolute', bottom: 20, left: 300, color: '#fff'}}
                   onClick={() => this.initMapData()}>返回</a>
            </div>
        );
    }
}