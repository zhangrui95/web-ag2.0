import React, {PureComponent} from 'react';
import {Table, Alert, Badge, Divider, Tooltip, Button, Radio, Icon, message, Form, Switch, Empty} from 'antd';
import styles from './AcceptAndRegisterRenderTable.less';
import {routerRedux} from 'dva/router';
import Detail from '../../routes/ReportStatistics/AcceptAndRegisterDetail';
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";


const FormItem = Form.Item;
const showSa = true;
const showLa = true;
const showJa = true;
const showXa = true;

class AcceptAndRegisterRenderTable extends PureComponent {
    state = {
        showSa,//是否显示受案
        showLa,//是否显示立案
        showJa,//是否显示结案
        showXa,//是否显示销案
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    };

    //选中当前行的机构id和父级id
    onRowClick(record) {
        // alert(record.orgId)
        this.props.timeComparedModalonRowClick(record.orgId, record.parentId, record.depth, 2);
    }

    //判断几种状态列的显示与否
    handleSaStateChange = (enable) => {
        this.setState({showSa: enable ? showSa : false});
    };
    handleLaStateChange = (enable) => {
        this.setState({showLa: enable ? showLa : false});
    };
    handleJaStateChange = (enable) => {
        this.setState({showJa: enable ? showJa : false});
    };
    handleXaStateChange = (enable) => {
        this.setState({showXa: enable ? showXa : false});
    };

    render() {
        const {data, AcceptAndRegisterData: {loading}} = this.props;
        const status = ['否', '是'];
        const statusMap = ['default', 'success'];
        const obj1 = document.getElementsByTagName('body');
        const objwidth = obj1[0].clientWidth;
        const {showAll, showSa, showLa, showJa, showXa} = this.state;
        let columns;
        let child = [
            {
                title: '单位',
                dataIndex: 'ladwmc',
                key: 'ladwmc',
                width: 400,
                fixed: 'center',
                render: (text) => {
                    return (
                        text && text.length <= 20 ? text :
                            <Tooltip title={text}>
                                <span>{text && text.substring(0, 20) + '...'}</span>
                            </Tooltip>
                    );
                },
            },
        ];
        {
            showSa ?
                child.push({
                    title: '受理',
                    dataIndex: 'sa',
                    show: false,
                    display: 'none',
                    render: (text) => {
                        return (
                            text && text.length <= 7 ? text :
                                <Tooltip title={text}>
                                    <span>{text && text.substring(0, 7) + '...'}</span>
                                </Tooltip>
                        );
                    },
                })
                : '';
        }
        {
            showLa ?
                child.push({
                    title: '立案',
                    dataIndex: 'la',
                    render: (text) => {
                        return (
                            text && text.length <= 15 ? text :
                                <Tooltip title={text}>
                                    <span>{text && text.substring(0, 15) + '...'}</span>
                                </Tooltip>
                        );
                    },
                })
                : '';
        }
        {
            showJa ?
                child.push({
                    title: '结案',
                    dataIndex: 'ja',
                    render: (text) => {
                        return (
                            text && text.length <= 5 ? text :
                                <Tooltip title={text}>
                                    <span>{text && text.substring(0, 5) + '...'}</span>
                                </Tooltip>
                        );
                    },
                })
                : '';
        }
        {
            showXa ?
                child.push({
                    title: '销案',
                    dataIndex: 'xa',
                    render: (text) => {
                        return (
                            text && text.length <= 10 ? text :
                                <Tooltip title={text}>
                                    <span>{text && text.substring(0, 10) + '...'}</span>
                                </Tooltip>
                        );
                    },
                })
                : '';
        }

        // columns = [
        //   {
        //     title: '单位',
        //     dataIndex: 'ladwmc',
        //     key:'ladwmc',
        //     width:400,
        //     fixed:'center',
        //     render: (text) =>{
        //       return (
        //         text && text.length <= 20 ? text :
        //           <Tooltip title={text}>
        //             <span>{text && text.substring(0, 20) + '...'}</span>
        //           </Tooltip>
        //       )
        //     },
        //   },
        //   {
        //     title:'受立案',
        //     children: child
        //   }
        // ]

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            current: data.page ? data.page.currentPage : '',
            total: data.page ? data.page.totalResult : '',
            pageSize: data.page ? data.page.showCount : '',
            showTotal: (total, range) =>
                <span
                    className={styles.pagination}>{`共 ${data.page ? data.page.totalResult : 0} 条记录 第 ${data.page ? data.page.currentPage : 1} / ${data.page ? data.page.totalPage : 1} 页`}</span>,
        };

        return (
            <div className={styles.standardTable}>
                <div className={styles.FormMenu}>
                    <Form>
                        <FormItem label="受理">
                            <Switch checked={!!this.state.showSa} onChange={this.handleSaStateChange}/>
                        </FormItem>
                        <FormItem label="立案">
                            <Switch checked={!!this.state.showLa} onChange={this.handleLaStateChange}/>
                        </FormItem>
                        <FormItem label="结案">
                            <Switch checked={!!this.state.showJa} onChange={this.handleJaStateChange}/>
                        </FormItem>
                        <FormItem label="销案">
                            <Switch checked={!!this.state.showXa} onChange={this.handleXaStateChange}/>
                        </FormItem>
                    </Form>
                </div>
                <Table
                    size={'middle'}
                    loading={loading}
                    rowKey={record => record.id}
                    dataSource={data.list}
                    columns={child}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    locale={{
                        emptyText: <Empty image={this.props.global && this.props.global.dark ? noList : noListLight}
                                          description={'暂无数据'}/>
                    }}
                    style={{marginLeft: 8}}
                    // title:'点击进入下一级机构'
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                this.onRowClick(record);
                            },       // 点击行
                        };
                    }}
                />
            </div>
        );
    }
}

export default AcceptAndRegisterRenderTable;
