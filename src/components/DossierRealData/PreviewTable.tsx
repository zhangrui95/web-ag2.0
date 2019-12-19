/*
* DossierMarkingModal.js 卷宗阅卷功能左侧菜单项
* author：jhm
* 20180117
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Form, Input, Button, Row, Col, Radio, Modal, message, Select, Table, Tooltip, Empty} from 'antd';
import styles from './Index.less';
import { routerRedux } from 'dva/router';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const Option = Select.Option;


@Form.create()
export default class PreviewTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            clickKey: '',
            selectId: [],//选择目录
            numValue: '',
            electronicVolumeData: this.props.electronicVolumeData,
            isClick: false,
        };

    }

    componentWillReceiveProps(nextProps) {
        console.log('nextprops', nextProps);
        if (nextProps !== this.props) {
            this.setState({
                electronicVolumeData: nextProps.electronicVolumeData,
                clickKey: nextProps.changeId,
            });

        }
    }

    // 分页页码变化的回调
    handlepageChange = (page, pageSize) => {
        this.props.handleStandardTableChange(page, pageSize);
    };

    rowClassNameHandle = (record, index) => {
        console.log('this.state.clickKey***', this.state.clickKey);
        if (this.state.clickKey) {
            if (record.electronic_catalogues_id === this.state.clickKey) {
                this.props.getCatalogClickData(record);
                return `rowChange`;

            } else {
                return '';
            }
        } else {
            if (this.state.isClick === false) {
                if (record.electronic_catalogues_number == 1) {
                    this.props.getCatalogClickData(record);
                    return `rowChange`;
                }
            }

        }

    };
    // 目录选择下拉的事件
    selectChange = (value) => {
        this.setState({
            selectId: value,
            clickKey: value,
        });
        let id = '';
        if (this.state.electronicVolumeData && this.state.electronicVolumeData.length > 0) {
            for (let i = 0; i < this.state.electronicVolumeData.length; i++) {
                if (this.state.electronicVolumeData[i].electronic_catalogues_id === value) {
                    id = this.state.electronicVolumeData[i].electronic_page_id;
                    break;
                }
            }
        }
        this.props.getPageId(id);

    };
    // 跳转页面的事件
    numOnChange = (e) => {
        this.setState({
            numValue: e.target.value,
        });
    };
    PressEnter = (e) => {
        const data = this.props.data;
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (e.target.value >= item.electronic_catalogues_beginpage && e.target.value <= item.electronic_catalogues_endpage) {
                    this.setState({
                        clickKey: item.electronic_catalogues_id,
                    });
                    let id = '';
                    console.log('this.state.electronicVolumeData', this.state.electronicVolumeData);
                    if (this.state.electronicVolumeData && this.state.electronicVolumeData.length > 2) {
                        for (let i = 0; i < this.state.electronicVolumeData.length; i++) {
                            if (this.state.electronicVolumeData[i].electronic_catalogues_id === item.electronic_catalogues_id) {
                                if (this.state.electronicVolumeData[i].electronic_page_pagenumber == e.target.value) {
                                    id = this.state.electronicVolumeData[i].electronic_page_id;
                                    break;
                                }

                            }
                        }
                    }
                    this.props.getPageId(id);
                    break;
                }
            }

        }


    };
    // 筛选下拉框里的信息
    filterOptionSelect = (inputValue, option) => {
        let str = option.props.children;
        if (str.indexOf(inputValue) != -1) {
            return option;
        }
    };

    render() {
        let { selectId, numValue } = this.state;
        const columns = [
            {
                title: '页码',
                dataIndex: 'allpage',
                key: 'allpage',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.electronic_catalogues_number === 1 || record.electronic_catalogues_number === 2 ? '' :
                                    <span>{text}</span>}
                        </div>
                    );
                },
            },
            {
                title: '目录',
                dataIndex: 'electronic_catalogues_name',
                key: 'electronic_catalogues_name',
                align: 'center',
                render: (val, record) => {
                    return (
                        val && val.length > 9 ?
                            <Tooltip title={val}>
                            <span>
                                {val.slice(0, 9) + '……'}
                            </span>
                            </Tooltip> :
                            <span>
                            {val}
                        </span>
                    );
                },
            }];
        const data = this.props.data;
        let option = [];
        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                option.push(<Option value={item.electronic_catalogues_id} key={item.electronic_catalogues_id}
                                    title={item.electronic_catalogues_name}>{item.electronic_catalogues_name}</Option>);
            }
        }
        return (
            <Row className={styles.synWrap}>
                <Row style={{ padding: 16 }}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectId}
                        placeholder='请选择'
                        onChange={this.selectChange}
                        showSearch={true}
                        filterOption={this.filterOptionSelect}
                    >
                        {option}
                    </Select>
                </Row>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                    loading={this.props.loading}
                    locale={{ emptyText: <Empty image={this.props.global&&this.props.global.dark ? noList : noListLight} description={'暂无数据'} /> }}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                this.setState({
                                    clickKey: record.electronic_catalogues_id,
                                    isClick: true,
                                });
                                this.props.getCatalogClickData(record);
                                // 确定电子卷的位置
                                let id = '';
                                if (this.state.electronicVolumeData && this.state.electronicVolumeData.length > 0) {
                                    for (let i = 0; i < this.state.electronicVolumeData.length; i++) {
                                        if (this.state.electronicVolumeData[i].electronic_catalogues_id === record.electronic_catalogues_id) {
                                            id = this.state.electronicVolumeData[i].electronic_page_id;
                                            break;
                                        }
                                    }
                                }
                                this.props.getPageId(id);

                            },       // 点击行

                        };
                    }}
                    rowClassName={(record, index) => this.rowClassNameHandle(record, index)}
                />
                <Row style={{ padding: 16, textAlign: 'right' }}>
                    跳至<Input value={numValue} onChange={this.numOnChange} style={{ width: '20%', margin: '0 8px' }}
                             onPressEnter={this.PressEnter}/>页
                </Row>
            </Row>
        );
    }
}

// ReactDOM.render(<EditableTable />, mountNode);
// export default SynchronizationTable;
