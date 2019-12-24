/*
* VideoShow.js 大屏展示页面 中间综合数据展示模块
* author：zr
* 20190404
* */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import styles from '../../pages/ShowData/SCMDataShow.less';
import yqImg1 from '../../assets/show/yq1.png';
import yqImg2 from '../../assets/show/yq2.png';
import yhbjImg from '../../assets/show/yhbj.png';
import yhdImg from '../../assets/show/yhd.png';
import showJt from '../../assets/show/showJt.png';
import {getTimeDistance, getUserInfos} from '../../utils/utils';

let theta = 0;
let index = 0;
export default class ShowNumber extends PureComponent {
    state = {
        transformProp: '',
        pcslist: [],
        data: [],
        ajzs: '0',
        depNum: this.props.userDepNum.substring(0, 6),
        groupList: getUserInfos().groupList,
        orglist: [],
    };

    componentDidMount() {
        this.getOrgList(this.props.userDepNum, 0);//获取组织机构列表
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if ((nextProps.selectDate !== null) && (this.props.selectDate !== nextProps.selectDate)) {
                this.getNum(nextProps.selectDate[0], nextProps.selectDate[1], this.state.id, this.state.orglist);
            }
        }
    }

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
    getDepts = (dep, orgGxType) => {
        // console.log('dep---------->',dep)
        this.props.dispatch({
            type: 'common/getQueryLowerDepts',
            payload: {
                departmentNum: dep,
            },
            callback: (data) => {
                let stu = '';
                if (data.length > 0) {
                    if (!orgGxType) {//判断是否为管辖机构，orgGxType true为管辖机构(管辖机构查本身) false子机构(子机构查下级全部)
                        if (dep === this.props.userDepNum) {//判断是否为总机构，总机构需包含管辖机构
                            data = this.uniqueByKey(data.concat(this.state.groupList), 'code');
                        }
                        stu = data.map(item => {
                            return item.code;
                        }).join();
                    } else {
                        let list = [];
                        list.push(data[0]);
                        stu = list.map(item => {
                            return item.code;
                        }).join();
                    }
                    this.props.setOrgList(stu, dep);
                    this.setState({
                        orglist: stu,
                    });
                    this.getNum(this.props.selectDate[0], this.props.selectDate[1], '', stu);
                } else {
                    this.setState({
                        orglist: '',
                    });
                    this.props.setAreaOrgCode(dep);
                    this.getNum(this.props.selectDate[0], this.props.selectDate[1], dep, '');
                }
            },
        });
    };
    getOrgList = (code, type, parentCode) => {
        let job = getUserInfos().job;
        this.props.dispatch({
            type: 'common/getNextLevelDeps',
            payload: {
                code: code,
            },
            callback: (data) => {
                if (data && data.length > 0 || type === 2 || parentCode) {
                    if (parentCode) {
                        parentCode['code'] = this.props.userDepNum;
                    }
                    ;
                    data.unshift(parentCode ? parentCode : this.props.userGroup);
                    data.map((item) => {
                        return item['orgGxType'] = false;
                    });//标记为子机构
                    if (type !== 2) {
                        this.state.groupList.map((item) => {
                            return item['orgGxType'] = true;
                        });//标记为管辖机构
                        data = this.uniqueByKey(data.concat(this.state.groupList), 'code');
                    }
                    if (data && data.length < 10 && data.length > 2) {//保证数据成圆环展示
                        data = data.concat(data).concat(data);
                    }
                    let tan = data.length > 0 ? Math.tan((180 / data.length) * (Math.PI / 180)) : 1;
                    let r = data.length > 2 ? Math.round(130 / tan) : 450;//圆环半径
                    this.setState({
                        transformProp: 'translateZ( -' + r + 'px ) rotateY(0deg)',
                        pcslist: data,
                        preId: data[data.length - 1] ? data[data.length - 1].code : null,//上一个组织id
                        nextId: data[1] ? data[1].code : null,//下一个组织id
                        id: data[0].code,//当前展示id
                    });
                    this.getDepts(parentCode ? this.props.userDepNum : data[0].code);
                } else {
                    if (JSON.stringify(job).includes('200003')) {
                        this.props.dispatch({
                            type: 'common/getQueryLowerDepts',
                            payload: {
                                departmentNum: this.state.depNum + '000000',
                            },
                            callback: (data) => {
                                this.setState({
                                    isJob: true,
                                });
                                this.getOrgList(this.props.userDepNum, 1, data[0]);//type 0 正常有子集机构，1 无子集机构但为法制， 2无子组织机构也无法制
                            },
                        });
                    } else {
                        this.getOrgList(this.props.userDepNum, 2);
                    }
                }
            },
        });
    };
    getNum = (startTime, endTime, id, orglist) => {
        this.props.dispatch({
            type: 'show/getCaseAndWarningCount',
            payload: {
                kssj: startTime,
                jssj: endTime,
                orgcode: id,
                orglist: orglist,
            },
            callback: (res) => {
                res.list.map(item => {
                    if (item.sj_name === '案件总数') {
                        this.setState({
                            ajzs: item.sj_count.toString(),
                        });
                    }
                });
            },
        });
    };

    getNext = (num) => {
        index = index + num;
        if (Math.abs(index) > this.state.pcslist.length - 1) {
            index = 0;
        }
        let tan = this.state.pcslist.length > 0 ? Math.tan((180 / this.state.pcslist.length) * (Math.PI / 180)) : 1;
        let r = this.state.pcslist.length > 2 ? Math.round(130 / tan) : 450;
        theta += (360 / this.state.pcslist.length) * num * -1;
        let id = '', name = '', nextId = '', preId = '';
        if (index > -1) {
            id = this.state.pcslist[index].code;
            nextId = this.state.pcslist[index + 1 > this.state.pcslist.length - 1 ? 0 : index + 1] ? this.state.pcslist[index + 1 > this.state.pcslist.length - 1 ? 0 : index + 1].code : null;
            preId = this.state.pcslist[index - 1 < 0 ? this.state.pcslist.length - 1 : index - 1] ? this.state.pcslist[index - 1 < 0 ? this.state.pcslist.length - 1 : index - 1].code : null;
            name = this.state.pcslist[index].name;
            this.getDepts(id, this.state.pcslist[index].orgGxType);
        } else {
            id = this.state.pcslist[this.state.pcslist.length + index].code;
            nextId = this.state.pcslist[this.state.pcslist.length + index + 1 > this.state.pcslist.length - 1 ? 0 : this.state.pcslist.length + index + 1] ? this.state.pcslist[this.state.pcslist.length + index + 1 > this.state.pcslist.length - 1 ? 0 : this.state.pcslist.length + index + 1].code : null;
            preId = this.state.pcslist[this.state.pcslist.length + index - 1] ? this.state.pcslist[this.state.pcslist.length + index - 1].code : null;
            name = this.state.pcslist[this.state.pcslist.length + index].name;
            this.getDepts(id, this.state.pcslist[this.state.pcslist.length + index].orgGxType);
        }
        this.setState({
            transformProp: 'translateZ( -' + r + 'px ) rotateY(' + theta + 'deg)',
            id: id,
            name: name,
            nextId: nextId,
            preId: preId,
            index: index,
        });
    };

    changeAnimate = (type, idx) => {
        this.setState({
            ['numAnimate' + idx]: type ? styles.bounce : styles.yhBox,
        });
    };

    render() {
        let tan = this.state.pcslist.length > 0 ? Math.tan((180 / this.state.pcslist.length) * (Math.PI / 180)) : 1;
        let r = Math.round(130 / tan) > 0 && this.state.pcslist.length > 2 ? Math.round(130 / tan) : 450;
        return (
            <div className={styles.allNumCard}>
                <img src={yqImg1} className={styles.yqImg1}/>
                <img src={yqImg1} className={styles.yqImg2}/>
                <img src={yqImg2} className={styles.yqImg3}/>
                <div className={this.state.numAnimate3 ? this.state.numAnimate3 : styles.yhBox}
                     style={{left: '55px', top: '210px'}} onMouseEnter={() => this.changeAnimate(true, 3)}
                     onMouseLeave={() => this.changeAnimate(false, 3)}>
                    <div className={styles.yhCenter}>
                        <div className={styles.num}>{this.props.num3 ? this.props.num3 : 0}</div>
                        <div className={styles.name}>{this.props.name3 ? this.props.name3 : ''}</div>
                    </div>
                </div>
                <div className={this.state.numAnimate4 ? this.state.numAnimate4 : styles.yhBox}
                     style={{left: '250px', top: '350px', width: '116px', height: '116px'}}
                     onMouseEnter={() => this.changeAnimate(true, 4)} onMouseLeave={() => this.changeAnimate(false, 4)}>
                    <div className={styles.yhCenter} style={{width: '100px', height: '100px'}}>
                        <div className={styles.num}>{this.props.num4 ? this.props.num4 : 0}</div>
                        <div className={styles.name}>{this.props.name4 ? this.props.name4 : ''}</div>
                    </div>
                </div>
                <div className={this.state.numAnimate6 ? this.state.numAnimate6 : styles.yhBox}
                     style={{right: '70px', top: '260px', width: '116px', height: '116px'}}
                     onMouseEnter={() => this.changeAnimate(true, 6)} onMouseLeave={() => this.changeAnimate(false, 6)}>
                    <div className={styles.yhCenter} style={{width: '100px', height: '100px'}}>
                        <div className={styles.num}>{this.props.num6 ? this.props.num6 : 0}</div>
                        <div className={styles.name}>{this.props.name6 ? this.props.name6 : ''}</div>
                    </div>
                </div>
                <div className={this.state.numAnimate1 ? this.state.numAnimate1 : styles.yhBox}
                     style={{right: '310px', top: '-15px', width: '111px', height: '111px'}}
                     onMouseEnter={() => this.changeAnimate(true, 1)} onMouseLeave={() => this.changeAnimate(false, 1)}>
                    <div className={styles.yhCenter} style={{width: '95px', height: '95px'}}>
                        <div className={styles.num}>{this.props.num1 ? this.props.num1 : 0}</div>
                        <div className={styles.name}>{this.props.name1 ? this.props.name1 : ''}</div>
                    </div>
                </div>
                <div className={this.state.numAnimate7 ? this.state.numAnimate7 : styles.yhBox}
                     style={{right: '170px', top: '95px'}} onMouseEnter={() => this.changeAnimate(true, 7)}
                     onMouseLeave={() => this.changeAnimate(false, 7)}>
                    <div className={styles.yhCenter}>
                        <div className={styles.num}>{this.props.num7 ? this.props.num7 : 0}</div>
                        <div className={styles.name}>{this.props.name7 ? this.props.name7 : ''}</div>
                    </div>
                </div>
                <div className={this.state.numAnimate2 ? this.state.numAnimate2 : styles.yhBox}
                     style={{left: '195px', top: '50px', border: '1px solid #ff3366'}}
                     onMouseEnter={() => this.changeAnimate(true, 2)} onMouseLeave={() => this.changeAnimate(false, 2)}>
                    <div className={styles.yhCenters}>
                        <div className={styles.num}>{this.props.num2 ? this.props.num2 : 0}</div>
                        <div className={styles.name}>{this.props.name2 ? this.props.name2 : ''}</div>
                    </div>
                </div>
                <div className={this.state.numAnimate5 ? this.state.numAnimate5 : styles.yhBox} style={{
                    right: '190px',
                    top: '380px',
                    width: '116px',
                    height: '116px',
                    border: '1px solid #ff3366',
                }} onMouseEnter={() => this.changeAnimate(true, 5)} onMouseLeave={() => this.changeAnimate(false, 5)}>
                    <div className={styles.yhCenters} style={{width: '100px', height: '100px'}}>
                        <div className={styles.num}>{this.props.num5 ? this.props.num5 : 0}</div>
                        <div className={styles.name}>{this.props.name5 ? this.props.name5 : ''}</div>
                    </div>
                </div>
                <div className={styles.allNumBox}
                     style={{left: '-' + 70 * this.state.ajzs.split('').length / 2 + 'px'}}>
                    {
                        this.state.ajzs.split('').map((item) => {
                            return <div className={styles.numBg}>{item}</div>;
                        })
                    }
                </div>
                <img src={yhbjImg} className={styles.yhbjImg}/>
                <img src={yhdImg} className={styles.yhdImg}/>
                <img src={showJt} className={styles.showJt}/>
                <section className={styles.container}>
                    <div className={styles.carousel} style={{transform: this.state.transformProp}}>
                        {this.state.pcslist.length > 0 && this.state.pcslist.map((event, idx) => {
                            return <figure style={{
                                opacity: this.state.id === event.code ? 1 : this.state.nextId === event.code || this.state.preId === event.code ? 0.5 : 0,
                                transform: this.state.pcslist.length > 1 && this.state.nextId === event.code ? 'rotateY(' + idx * (360 / this.state.pcslist.length) + 'deg) translateZ( ' + r + 'px ) rotateZ(-6deg) translateY(-12px)' : this.state.pcslist.length > 1 && this.state.preId === event.code ? 'rotateY(' + idx * (360 / this.state.pcslist.length) + 'deg) translateZ( ' + r + 'px ) rotateZ(6deg) translateY(-12px)' : 'rotateY(' + idx * (360 / this.state.pcslist.length) + 'deg) translateZ( ' + r + 'px )',
                            }}>{event.name}</figure>;
                        })}
                    </div>
                </section>
                <div className={this.state.pcslist.length > 1 ? styles.BtnNextBox : styles.none}>
                    <div className={styles.preBtn} onClick={() => this.getNext(-1)}>&lt;</div>
                    <div className={styles.nextBtn} onClick={() => this.getNext(1)}>&gt;</div>
                </div>
            </div>
        );
    }
}
