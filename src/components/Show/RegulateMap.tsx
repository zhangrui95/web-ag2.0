/*
* RegulateMap.js 监管面板页面--地图
* author：lyp
* 20180623
* */

import React, {PureComponent} from 'react';
import {Row, Col, DatePicker, Button, Card} from 'antd';
import echarts from 'echarts/lib/echarts';
import map from 'echarts/lib/chart/map';
import title from 'echarts/lib/component/title';
import tooltip from 'echarts/lib/component/tooltip';
import toolbox from 'echarts/lib/component/toolbox';
import visualMap from 'echarts/lib/component/visualMap';
import mudanjiang from './mapData/mudanjiang_bak';
import hulunbeier from './mapData/hulunbeier';
import baishan from './mapData/baishan';
import styles from './Regulate.less';

let myChart;
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


export default class RegulateMap extends PureComponent {

    state = {
        mapAreaName: configUrl.showDataTitle,
    };

    componentDidMount() {
        this.showEchart();
        this.getMapData();
        window.addEventListener('resize', myChart.resize);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps.mapData',nextProps.mapData)
        // if(this.props.mapData !== nextProps.mapData){
        //     if(nextProps.mapData !== []){
        //         myChart.setOption({
        //             visualMap: {
        //                 min: 1200,
        //                 max: 2000,
        //                 // text:['High','Low'],
        //                 // realtime: false,
        //                 // calculable: false,
        //                 show: false,
        //                 inRange: {
        //                     color: ['#EFF3F6','#E5EFF9', '#D7E0E7', '#C2CBD4']
        //                 }
        //             },
        //             series: [{
        //                 data: nextProps.mapData,
        //             }]
        //         })
        //     }
        // }
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
                        visualMap: {
                            min: 1200,
                            max: 2000,
                            // text:['High','Low'],
                            // realtime: false,
                            // calculable: false,
                            show: false,
                            inRange: {
                                color: ['#EFF3F6', '#E5EFF9', '#D7E0E7', '#C2CBD4'],
                            },
                        },
                        series: [{
                            data: arry,
                        }],
                    });
                }
            },
        });
    };
    // 根据城市编码获取值
    getCityValueByCode = (code, data) => {
        for (let i = 0; i < data.length; i++) {
            if (code === data[i].org) return data[i].count;
        }
        return 0;
    };
    // 设置地图返回初始值
    setMapDefault = () => {
        // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        this.getMapData();
        this.props.setAreaCode('');
        this.setState({
            mapAreaName: configUrl.showDataTitle,
        });
    };

    showEchart = () => {
        echarts.registerMap('MapData', MapData);
        myChart = echarts.init(document.getElementById('RegulateMap'));
        const that = this;
        const option = {
            // title: {
            //     text: '',
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

            series: [
                {
                    name: 'maapp',
                    type: 'map',
                    mapType: 'MapData', // 自定义扩展图表类型
                    zoom: 1,
                    // roam:true, // 缩放
                    label: {
                        color: '#fff',
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                                color: '#222',
                                formatter: '{c}',
                                fontSize: 16,
                            },
                        },
                        emphasis: {
                            label: {
                                show: true,
                                color: '#4D4D4D',
                            },
                            areaColor: '#3398DB',

                        },
                    },
                    data: [],
                },
            ],
        };
        myChart.setOption(option);
        myChart.on('click', function (params) {
            // console.log('ppppppppppppppppppppppppp', params);
            that.props.setAreaCode(params.data.code);
            myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
            });
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: params.dataIndex,
            });
            that.setState({
                mapAreaName: params.data.name,
            });
        });
    };

    render() {
        return (
            <Card bodyStyle={{height: 565, padding: 0}}>
                <div className={styles.blockTitle}
                     style={{position: 'absolute', top: 10, left: 20}}>{this.state.mapAreaName}</div>
                <div className={styles.setMapDefaultBtn}><a onClick={() => this.setMapDefault()}>返回全局</a></div>
                <div id="RegulateMap" style={{height: '100%', width: '100%', maxWidth: 515}}></div>
            </Card>
        );
    }
}