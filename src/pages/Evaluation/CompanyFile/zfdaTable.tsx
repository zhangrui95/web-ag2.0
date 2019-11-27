import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Form,
    Button,
    DatePicker,
    Card,
    TreeSelect,
    Select, Icon,
} from 'antd';
import moment from 'moment';
import styles from './index.less';
// import AjSearchModal from '../../../components/ajSearchModal/ajSearchModal';
import { getUserInfos } from '../../../utils/utils';

const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const rowLayout = { md: 8, xl: 16, xxl: 24 };
const colLayouts = { sm: 12, md: 12, xl: 6, xxl: 6 };
const formItemLayout = {
    labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
    wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 20 } },
};
const TreeNode = TreeSelect.TreeNode;
let timeout;
let currentValue;
@connect(({ common, TzList }) => ({
    common,
    TzList,
}))
@Form.create()
export default class zfdaTable extends PureComponent {
    state = {
        loading: false,
        print: false,
        data: moment().subtract(1, 'months'),
        day: moment(new Date()),
        allPolice: [],
        srcUrl: '',
        rightHideBtn: true,
        leftHideBtn: true,
        disableJg: false,
        jz: '',
    };

    componentDidMount() {
        // this.getDeptmentByCode();
        let jg = this.props.jg ? JSON.parse(this.props.jg).id : null;
        if (jg && jg.substring(6) !== '000000') {
            this.setState({
                disableJg: true,
            });
        }
        this.setState({
            treeId: this.props.jg ? this.props.jg : '',
        });
        if (this.props.policNum) {
            this.getPoliceNum(this.props.jg);//获取民警数量
        } else {
            this.getChangeTable(this.props.jg, this.state.data);//改变table
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.srcName !== nextProps.srcName) {
            this.props.form.resetFields();
            this.getAllPolice();
            this.setState({
                srcUrl: window.configUrl.srcUrl + nextProps.srcName[0] + '.jsp?rpx=' + nextProps.srcName[1],
                data: moment().subtract(1, 'months'),
                treeId: this.props.jg ? this.props.jg : '',
                cardId: null,
                rightHideBtn: true,
                leftHideBtn: true,
            });
            if (nextProps.policNum) {
                this.getPoliceNum(this.props.jg);
            } else {
                this.getChangeTable(this.props.jg, nextProps.searchDay ? this.state.day : this.state.data, null, nextProps);
            }
        }
    }

    //警种
    getDeptmentByCode = (code) => {
        if (code) {
            this.props.dispatch({
                type: 'common/getDeptmentByCode',
                payload: {
                    code: code,
                },
                callback: (data) => {
                    if (data) {
                        this.setState({
                            jz: data.police_categorymc ? data.police_categorymc : '',
                        });
                    }
                },
            });
        }
    };
    //重置警种
    resetJz = () => {
        this.setState({
            jz: '',
        });
    };
    getAllPolice = (name) => {
        const values = this.props.form.getFieldsValue();
        const that = this;
        that.setState({
            allPolice: [],
        });
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = name;
        timeout = setTimeout(function() {
            that.props.dispatch({
                type: 'common/getAllPolice',
                payload: {
                    code: values.jg ? JSON.parse(values.jg).id : '',
                    search: name,
                },
                callback: (data) => {
                    if (data && (currentValue === name)) {
                        that.setState({
                            allPolice: data.slice(0, 50),
                        });
                    }
                },
            });
        }, 300);
    };
    // 日期改变
    dateChange = (date, dateString) => {
        if (date) {
            if (this.props.searchDay) {
                this.setState({
                    day: date,
                });
            } else {
                this.setState({
                    data: date,
                });
            }
            this.getChangeTable(this.state.treeId, date, this.state.cardId);
        }
    };
    // 禁止选择的日期
    disabledDate = (current) => {
        const startDate = moment().subtract(1, 'years').startOf('years');
        const endDate = moment().endOf('day');
        return current && ((current > endDate) || (current < startDate));
    };
    // 渲染机构树
    renderloop = data => data.map((item) => {
        const obj = {
            id: item.code,
            label: item.name,
        };
        const objStr = JSON.stringify(obj);
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={objStr} key={objStr}
                             title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={objStr} value={objStr} title={item.name}/>;
    });
    //选择组织结构
    treeChange = (e) => {
        this.props.form.resetFields(['mj']);
        this.setState({
            treeId: e,
        });
        this.getPoliceNum(e);
    };
    //民警人数
    getPoliceNum = (e) => {
        this.props.dispatch({
            type: 'common/getAllPolice',
            payload: {
                code: e ? JSON.parse(e).id : '',
                search: '',
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        policeLength: data.length,
                    });
                    this.getChangeTable(e, this.state.data, null, null, data.length);
                }
            },
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    //查询改变table值
    getChangeTable = (drp, month, idcard, next, policeNum) => {
        this.setState({
            cardId: idcard,
        });
        let url = window.configUrl.srcUrl + (next ? next.srcName[0] : this.props.srcName[0]) + '.jsp?rpx=' + (next ? next.srcName[1] : this.props.srcName[1]);
        let code = drp ? JSON.parse(drp).id : '';
        let dw_mc = drp ? JSON.parse(drp).label : '';
        let policeLength = policeNum ? policeNum : this.state.policeLength;
        let policeName = idcard && idcard.label ? idcard.label : '';
        let sfzh = idcard && idcard.key ? idcard.key : '';
        if (this.props.searchJg && this.props.searchPolice && this.props.searchMonth) {
            this.setState({
                srcUrl: url + '&dw_mc=' + dw_mc + '&mjxm=' + policeName + '&sfzh_or_jh=' + sfzh + '&year=' + moment(month).format('YYYY') + '&month=' + moment(month).format('MM'),
            });
        }
        if (this.props.searchJg && this.props.searchPolice && !this.props.searchMonth) {
            this.setState({
                srcUrl: url + '&mjxm=' + policeName + '&sfzh_or_jh=' + sfzh + '&dw_mc=' + dw_mc + '&dw_dm=' + code,
            });
        }
        if (next ? next.searchJg && !next.searchPolice && next.searchMonth : this.props.searchJg && !this.props.searchPolice && this.props.searchMonth) {
            if (policeLength || policeLength === 0) {
                this.setState({
                    srcUrl: url + '&year=' + moment(month).format('YYYY') + '&month=' + moment(month).format('MM') + '&dw_code=' + code + '&dw_mc=' + dw_mc + '&mjrs=' + policeLength,
                });
            }
        }
        if (next ? next.searchJg && !next.searchPolice && next.searchDay : this.props.searchJg && !this.props.searchPolice && this.props.searchDay) {
            this.setState({
                srcUrl: url + '&year=' + moment(month).format('YYYY') + '&month=' + moment(month).format('MM') + '&day=' + moment(month).format('DD') + '&dw_code=' + code + '&dw_mc=' + dw_mc,
            });
        }
        if (next ? next.searchJg && !next.searchPolice && !next.searchMonth && !next.searchDay : this.props.searchJg && !this.props.searchPolice && !this.props.searchMonth && !this.props.searchDay) {
            this.setState({
                srcUrl: url + '&dw_mc=' + dw_mc + '&dw_dm=' + code,
            });
        }
    };
    //选择多个案件情况下改变table
    getChangeTables = (list, idx) => {
        let url = window.configUrl.srcUrl + this.props.srcName[0] + '.jsp?rpx=' + this.props.srcName[1];
        if (list.length > 0) {
            let record = JSON.parse(list[idx]);
            this.getDeptmentByCode(record.bardw ? record.bardw : record.sldw_dm);
            // if(this.props.srcName[0] === 'xzFySsGjPcAjTjb'){
            let ids = [];
            list.map((item) => {
                ids.push(JSON.parse(item).ajbh);
            });
            this.setState({
                srcUrl: url + '&ajbh=' + ids.toString(),
            });
            // }else{
            //     this.setState({
            //         srcUrl:url + '&dw_mc='+ (record.bardwmc ? record.bardwmc : record.sldw_name ? record.sldw_name : '') +'&ajbh=' + record.ajbh,
            //         ajList:list,
            //         ajIdx:idx,
            //     });
            //     if(idx===0&&list.length > 1){
            //         this.setState({
            //             rightHideBtn:false,
            //         });
            //     }
            // }
        } else {
            if (this.props.searchAjBtn) {
                this.setState({
                    srcUrl: url,
                    rightHideBtn: true,
                    leftHideBtn: true,
                });
            }
            ;
        }
    };
    //左右表格分页监听点击切换表格数据
    getNextAj = (next) => {
        let len = this.state.ajList.length;
        let ajIdx = this.state.ajIdx + 1 * next;
        if (ajIdx === 0) {
            this.setState({
                leftHideBtn: true,
            });
        } else {
            this.setState({
                // leftHideBtn: false,
            });
        }
        if (ajIdx === len - 1) {
            this.setState({
                rightHideBtn: true,
            });
        } else {
            this.setState({
                // rightHideBtn:false,
            });
        }
        this.getChangeTables(this.state.ajList, ajIdx);
    };

    render() {
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const { form: { getFieldDecorator }, common: { depTree }, treeDefaultExpandedKeys } = this.props;
        return (
            <Card className={styles.cardArea}>
                <div>
                    <Form>
                        <Row gutter={rowLayout}>
                            {
                                this.props.searchAjBtn ? <Col {...colLayouts} style={{ marginBottom: 24 }}>
                                    <Button style={{ marginLeft: 8 }} type="primary"
                                            onClick={this.showModal}>案件查询</Button>
                                </Col> : ''
                            }
                            {this.props.searchJg ? <Col {...colLayouts}>
                                <FormItem label="机构" {...formItemLayout}>
                                    {getFieldDecorator('jg', {
                                        initialValue: this.props.jg,
                                    })(
                                        <TreeSelect
                                            disabled={this.state.disableJg}
                                            showSearch
                                            style={{ width: '100%' }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="请选择机构"
                                            allowClear
                                            onChange={this.treeChange}
                                            key='jgSelect'
                                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                                            treeNodeFilterProp="title"
                                        >
                                            {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                                        </TreeSelect>,
                                    )}
                                </FormItem>
                            </Col> : ''}
                            {
                                this.props.searchPolice ? <Col {...colLayouts}>
                                    <FormItem label="民警" {...formItemLayout}>
                                        {getFieldDecorator('mj')(
                                            <Select
                                                labelInValue={true}
                                                mode="combobox"
                                                defaultActiveFirstOption={false}
                                                optionLabelProp='title'
                                                showArrow={false}
                                                filterOption={false}
                                                placeholder="请输入民警"
                                                onSearch={(value) => this.getAllPolice(value)}
                                                onFocus={(value) => this.getAllPolice(value)}
                                                onChange={(e) => this.getChangeTable(this.state.treeId, this.state.data, e)}
                                            >
                                                {allPoliceOptions}
                                            </Select>,
                                        )}
                                    </FormItem>
                                </Col> : ''
                            }
                            {
                                this.props.searchMonth ? <Col {...colLayouts}>
                                    <FormItem label="月份" {...formItemLayout}>
                                        {getFieldDecorator('yf', {
                                            initialValue: this.state.data,
                                        })(
                                            <MonthPicker allowClear={false} size='default' placeholder={'请选择月份'}
                                                         disabledDate={this.disabledDate} onChange={this.dateChange}/>,
                                        )}
                                    </FormItem>
                                </Col> : ''
                            }
                            {
                                this.props.searchDay ? <Col {...colLayouts}>
                                    <FormItem label="日期" {...formItemLayout}>
                                        {getFieldDecorator('rq', {
                                            initialValue: this.state.day,
                                        })(
                                            <DatePicker
                                                disabledDate={this.disabledDate}
                                                style={{ width: '100%' }}
                                                placeholder={'请选择日期'}
                                                onChange={this.dateChange}
                                                allowClear={false}
                                            />,
                                        )}
                                    </FormItem>
                                </Col> : ''
                            }
                        </Row>
                    </Form>
                </div>
                <div className={this.state.print ? styles.grayBoxPrint : styles.grayBox}>
                    <Icon type="left"
                          className={this.state.leftHideBtn ? styles.none : this.props.searchAjBtn ? styles.iconLeft : styles.none}
                          style={{ top: this.props.height ? parseInt(this.props.height) / 2 : 575 + 'px' }}
                          onClick={() => this.getNextAj(-1)}/>
                    <iframe className={styles.box} src={this.state.srcUrl + '&jzmc=' + this.state.jz}
                            height={this.props.height ? this.props.height : '1150px'}></iframe>
                    <Icon type="right"
                          className={this.state.rightHideBtn ? styles.none : this.props.searchAjBtn ? styles.iconRight : styles.none}
                          style={{ top: this.props.height ? parseInt(this.props.height) / 2 : 575 + 'px' }}
                          onClick={() => this.getNextAj(1)}/>
                </div>
                {/*<AjSearchModal visible={this.state.visible} handleCancel={this.handleCancel}*/}
                {/*               getChangeTables={this.getChangeTables} resetJz={this.resetJz} {...this.props}/>*/}
            </Card>
        );
    }
}
