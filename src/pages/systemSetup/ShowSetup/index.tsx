/*
* 智慧案管设置监管看板
* */
import React, { PureComponent } from 'react';
import moment from 'moment/moment';
import { connect } from 'dva';
import styles from './index.less';
import { getTimeDistance, autoheight } from '../../../utils/utils';
import { Button, Select, Row, Col, Icon, message, Modal } from 'antd';
import headerLeftImg from '../../../assets/show/header_left.png';
import headerTitleImg from '../../../assets/show/showTitle.png';
import headerRightImg from '../../../assets/show/header_right.png';

const confirm = Modal.confirm;
const Option = Select.Option;
@connect(({ setUpShow }) => ({
    setUpShow,
}))
export default class SetUpShow extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menu: JSON.parse(sessionStorage.getItem('authoMenuList')),
            posList: [
                { position1: [] },
                { position2: [] },
                { position3: [] },
                { position4: [] },
                { position5: [] },
                { position6: [] },
                { position7: [] },
                { position8: [] },
                { position9: [] },
                { position10: [] },
                { position11: [] },
            ],
            list: [],
            saveList: [],
            loading: true,
            code: [],
            mapLoopTime: '10', // 地图区域轮转频率（秒）
        };
        this.getPosList();
    }

    componentDidMount() {
            let save = [];
        this.state.posList.map((event, i) => {
            this.props.dispatch({
                type: 'setUpShow/getQueryList',
                payload: {
                    wz: 'position' + (i + 1),
                    pzfl: '2',
                },
                callback: (res) => {
                    if (res.data.length !== 0 && res.data.list.length > 0) {
                        this.state.menu.map((e, idx) => {
                            if (e.resourceCode === res.data.list[0].resource_code) {
                                save.push({
                                    name: res.data.list[0].name,
                                    resource_code: res.data.list[0].resource_code,
                                    wz: 'position' + (i + 1),
                                    pzfl: '2',
                                });
                                this.setState({
                                    ['code' + i]: res.data.list[0].resource_code,
                                    saveList: save,
                                });
                            }
                        });
                    }
                },
            });
        });
        this.props.dispatch({
            type: 'setUpShow/getQueryList',
            payload: {
                wz: 'mapLoopTime',
                pzfl: '2',
            },
            callback: (res) => {
                if (res.data && res.data.list) {
                    this.setState({
                        mapLoopTime: res.data.list[0].resource_code,
                    });
                }
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.setUpShow.code !== nextProps.setUpShow.code) {
            this.setState({
                posList: this.state.posList,
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            loading: true,
            list: [],
        });
    }

    getPosList = () => {
        this.state.posList.map((event, i) => {
            this.state.menu.map((item) => {
                if (item.resourceCode === 'position' + (i + 1)) {
                    let id = item.id;
                    this.state.menu.map((e, idx) => {
                        if (e.pid === id) {
                            this.state.posList[i]['position' + (i + 1)].push(e);
                        }
                    });
                }
            });
        });
    };
    goBack = () => {
        history.go(-1);
    };
    getSave = () => {
        let saveList = [...this.state.saveList];
        if(this.state.mapLoopTime){
            saveList.push({
                name: '地图区域轮转频率',
                resource_code: this.state.mapLoopTime,
                wz: 'mapLoopTime',
                pzfl: '2',
            });
        }
        if (saveList.length === 12) {
            this.props.dispatch({
                type: 'setUpShow/getSave',
                payload: {
                    configs: saveList,
                },
                callback: () => {
                    history.go(-1);
                },
            });
        } else {
            message.warning('选择项不可为空');
        }
    };
    changeSelect = (e, res, idx) => {
        if (e) {
            this.getChangeValue(e, res, idx);
        } else {
            this.state.saveList && this.state.saveList.map((item, i) => {
                if (item.wz === 'position' + (idx + 1)) {
                    this.state.saveList.splice(i, 1);
                    this.setState({
                        ['code' + idx]: undefined,
                    });
                }
            });
        }
    };
    getChangeValue = (e, res, idx) => {
        let arr = false;
        let change = true;
        let index;
        if (this.state.saveList.length > 0) {
            this.state.saveList.map((item, i) => {
                // if(item.resource_code)
                if (item.resource_code.split(',')[1] === e.split(',')[1]) {
                    let number = this.state.saveList.findIndex((value) => value.wz == e.split(',')[0]);//获取当前选择项在saveList中角标，不存在为-1
                    // message.warning('选择项不可重复，请重新选择');
                    change = false;
                    let that = this;
                    confirm({
                        title: '“' + item.name + '”选项已被其他模块占用，是否仍确定选择?',
                        content: '',
                        okText: '确定',
                        cancelText: '取消',
                        style: { top: 200 },
                        onOk() {
                            let num = parseInt(item.wz.substring(8)) - 1;//获取原有重复模块位置
                            that.state.saveList.splice(i, 1, {
                                name: res.props.children,
                                resource_code: res.props.value,
                                wz: 'position' + (idx + 1),
                                pzfl: '2',
                            });//替换原有选项位置
                            if (number > -1) {
                                that.state.saveList.splice(number, 1);//如该选择位置原来有数据，清除原有数据
                            }
                            that.setState({
                                ['code' + idx]: e,
                                ['code' + num]: undefined,//清空原有重复模块内数据
                            });
                        },
                    });
                } else {
                    if (item.wz === 'position' + (idx + 1)) {
                        arr = true;
                        index = i;
                    }
                }
            });
            if (change) {
                if (arr) {
                    this.state.saveList[index] = {
                        name: res.props.children,
                        resource_code: res.props.value,
                        wz: 'position' + (idx + 1),
                        pzfl: '2',
                    };
                } else {
                    this.state.saveList.push({
                        name: res.props.children,
                        resource_code: res.props.value,
                        wz: 'position' + (idx + 1),
                        pzfl: '2',
                    });
                }
            }
        } else {
            if (change) {
                this.state.saveList.push({
                    name: res.props.children,
                    resource_code: res.props.value,
                    wz: 'position' + (idx + 1),
                    pzfl: '2',
                });
            }
        }
        if (change) {
            this.setState({
                ['code' + idx]: e,
            });
        }
    };
    handleChangeMapLoopTime = (value) => {
        this.setState({
            mapLoopTime: value,
        });
    };
    // getEmpty = () => {
    //   this.state.posList.map((event,i)=> {
    //     this.setState({
    //       ['code'+i]: undefined,
    //       saveList:[]
    //     })
    //   })
    // }
    render() {
        const dropDownStyle = {
            border: '1px solid #60a0d6',
            background: 'transparent',
            boxShadow: '0 0 10px #60a0d6 inset',
            color: '#fff',
        };
        return (
            <div className={styles.SCMDataShow} style={{ height: autoheight() }}>
                <div className={styles.header}>
                    <img src={headerLeftImg} alt=""/>
                    <img className={styles.showTitle} src={headerTitleImg} alt="智慧案件管理系统"/>
                    <img src={headerRightImg} alt=""/>
                    {/*<div className={styles.dateButtons}>*/}
                    {/*<span className={styles.currentDate} onClick={this.getEmpty}>重置</span>*/}
                    {/*</div>*/}
                </div>
                <div className={styles.wrap}>
                    <div className={styles.wrapLeft}>
                        <div className={styles.globalCard}>
                            <Select value={this.state['code0']} defaultActiveFirstOption={false} showSearch={true}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } allowClear={true} onChange={(e, res, idx) => this.changeSelect(e, res, 0)}
                                    placeholder="请选择" dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[0].position1.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                        <div className={styles.globalCard}>
                            <Select value={this.state['code1']} defaultActiveFirstOption={false} showSearch={true}
                                    allowClear={true} filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } onChange={(e, res, idx) => this.changeSelect(e, res, 1)} placeholder="请选择"
                                    dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[1].position2.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                        <div className={styles.globalCard}>
                            <Select value={this.state['code2']} defaultActiveFirstOption={false} showSearch={true}
                                    allowClear={true} filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } onChange={(e, res, idx) => this.changeSelect(e, res, 2)} placeholder="请选择"
                                    dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[2].position3.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className={styles.wrapMiddle}>
                        <div className={styles.mapCard}>
                            <div className={styles.centerSelect}>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <Select value={this.state['code7']} defaultActiveFirstOption={false} showSearch={true}
                                        allowClear={true} filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } onChange={(e, res, idx) => this.changeSelect(e, res, 7)} placeholder="请选择"
                                        dropdownClassName={styles.selectDropdown}>
                                    {this.state.posList[7].position8.map((item, i) => {
                                        return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                    })}
                                </Select>
                            </div>
                            <div className={styles.centerSelect}>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <Select value={this.state['code8']} defaultActiveFirstOption={false} showSearch={true}
                                        allowClear={true} filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } onChange={(e, res, idx) => this.changeSelect(e, res, 8)} placeholder="请选择"
                                        dropdownClassName={styles.selectDropdown}>
                                    {this.state.posList[8].position9.map((item, i) => {
                                        return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                    })}
                                </Select>
                            </div>
                            <div className={styles.centerSelect}>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <Select value={this.state['code9']} defaultActiveFirstOption={false} showSearch={true}
                                        allowClear={true} filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } onChange={(e, res, idx) => this.changeSelect(e, res, 9)} placeholder="请选择"
                                        dropdownClassName={styles.selectDropdown}>
                                    {this.state.posList[9].position10.map((item, i) => {
                                        return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                    })}
                                </Select>
                            </div>
                            <div className={styles.centerSelect}>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <div className={styles.center}></div>
                                <Select value={this.state['code10']} defaultActiveFirstOption={false} showSearch={true}
                                        allowClear={true} filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } onChange={(e, res, idx) => this.changeSelect(e, res, 10)} placeholder="请选择"
                                        dropdownClassName={styles.selectDropdown}>
                                    {this.state.posList[10].position11.map((item, i) => {
                                        return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                    })}
                                </Select>
                            </div>
                            <Row style={{ clear: 'both' }}>
                                <Col span={24} className={styles.mapLoopTimeSelect}>
                                    <span style={{ color: '#fff', fontSize: 18 }}>地图区域轮转频率：</span>
                                    <Select style={{ width: 120 }} defaultActiveFirstOption={false} showSearch={true}
                                            allowClear={true} filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } value={this.state.mapLoopTime} onChange={this.handleChangeMapLoopTime}
                                            dropdownClassName={styles.selectDropdown}>
                                        <Option value="10">10秒</Option>
                                        <Option value="30">30秒</Option>
                                        <Option value="60">1分钟</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.longCard}>
                            <Select value={this.state['code3']} defaultActiveFirstOption={false} showSearch={true}
                                    allowClear={true} filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } onChange={(e, res, idx) => this.changeSelect(e, res, 3)} placeholder="请选择"
                                    dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[3].position4.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className={styles.wrapRight}>
                        <div className={styles.globalCard}>
                            <Select value={this.state['code6']} defaultActiveFirstOption={false} showSearch={true}
                                    allowClear={true} filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } onChange={(e, res, idx) => this.changeSelect(e, res, 6)} placeholder="请选择"
                                    dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[6].position7.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                        <div className={styles.globalCard}>
                            <Select value={this.state['code5']} defaultActiveFirstOption={false} showSearch={true}
                                    allowClear={true} filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } onChange={(e, res, idx) => this.changeSelect(e, res, 5)} placeholder="请选择"
                                    dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[5].position6.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                        <div className={styles.globalCard}>
                            <Select value={this.state['code4']} defaultActiveFirstOption={false} showSearch={true}
                                    allowClear={true} filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } onChange={(e, res, idx) => this.changeSelect(e, res, 4)} placeholder="请选择"
                                    dropdownClassName={styles.selectDropdown}>
                                {this.state.posList[4].position5.map((item, i) => {
                                    return <Option key={i} value={item.resourceCode}>{item.name}</Option>;
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
                <div className={styles.btn}>
                    <Button onClick={this.goBack}>取消</Button>
                    <Button onClick={this.getSave} type="primary">确认</Button>
                </div>
            </div>
        );
    }
}
