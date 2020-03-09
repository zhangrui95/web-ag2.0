/*
 * ReportStatistics/XZAJXDRYTJ.js 行政案件吸毒人员统计
 * author：jhm
 * 20190918
 * */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Row,
    Col,
    Form,
    Button,
    DatePicker,
    Tabs,
    Radio,
    message,
    Table,
    Card,
    Tooltip,
    Empty,
} from 'antd';
import moment from 'moment';
import {getUserInfos, tableList, autoheight} from '../../../utils/utils';
import stylescommon from '../../common/common.less';
import StatisticsDateSelect from '../../../components/ReportStatistics/StatisticsDateSelect';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import noList from '@/assets/viewData/noList.png';
import noListLight from "@/assets/viewData/noListLight.png";

// const {Column, ColumnGroup} = Table;

@connect(({common, TzList, global}) => ({
    common,
    TzList,
    global
}))
@Form.create()
export default class RYCZTZ extends PureComponent {
    state = {
        selectDateValue: {
            kssj: moment().format('YYYY-MM-DD'),
            jssj: moment().format('YYYY-MM-DD'),
        },
        loading: false,
        data: [],
        current: 1,
        count: autoheight() > 900 ? 10 : 5,
    };

    componentDidMount() {
        this.searchData(this.state.selectDateValue);
    }

    // 清除列表
    emptyData = () => {
        this.setState({
            data: [],
            selectDateValue: {
                kssj: '',
                jssj: '',
            },
        });
    };
    // 获取统计数据
    getStatisticsData = params => {
        const formValues = params.pd ? params.pd : {};
        this.setState({
            formValues,
            loading: true,
            data: [],
        });
        this.props.dispatch({
            type: 'TzList/getXDRYTJ',
            payload: params,
            callback: res => {
                this.setState({
                    data: res.data,
                    loading: false,
                });
            },
        });
    };
    // 设置已选择的日期
    setSelectDateValue = value => {
        this.setState({
            selectDateValue: value,
        });
        this.searchData(value);
    };
    // 查询数据
    searchData = value => {
        this.setState({
            current: 1,
        });
        const userInfo = getUserInfos();
        if (userInfo) {
            const params = {
                pd: {
                    ...value,
                },
                currentPage: 1,
                showCount: this.state.count,
            };
            this.getStatisticsData(params);
        }
    };
    // 表格分页
    handleTableChange = (pagination, filtersArg, sorter) => {
        this.setState({
            current: pagination.current,
            count: pagination.pageSize,
        });
        const {selectDateValue} = this.state;
        const params = {
            pd: {
                ...selectDateValue,
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.getStatisticsData(params);
    };

    search() {
        return (
            <div>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                  <Col md={18} sm={24} xl={18}>
                        <StatisticsDateSelect
                            setSelectDateValue={this.setSelectDateValue}
                            selectDateValue={this.state.selectDateValue}
                            emptyData={this.emptyData}
                            id={'XZAJXDRYTJ'}
                        />
                    </Col>
                  <Col md={6} sm={24} xl={6}>
                        <div className={stylescommon.buttonArea}>
                            <Button type="submit" onClick={() => this.exportData()}>
                                导出
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    // 导出
    exportData = () => {
        const {formValues} = this.state;
        this.props.dispatch({
            type: 'common/exportData',
            payload: {
                tableType: '38',
                ...formValues,
            },
            callback: data => {
                if (data.text) {
                    message.error(data.text);
                } else {
                    window.open(configUrl.serverUrl + data.url);
                }
            },
        });
    };

    render() {
        const {data} = this.state;
        const paginationProps = {
            current: data && data.page ? data.page.currentPage : '',
            total: data && data.page ? data.page.totalResult : '',
            pageSize: data && data.page ? data.page.showCount : '',
            showTotal: (total, range) => (
                <span
                    className={stylescommon.pagination}
                >{`共 ${data && data.page ? data.page.totalPage : 1} 页，${
                    data && data.page ? data.page.totalResult : 0
                    } 条数据 `}</span>
            ),
        };
        const columns = [
            //   {
            //     title: '序号',
            //     render: (text, record, index) => <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>,
            // },
            {
                title: '案件编号',
                // width: 200,
                dataIndex: 'ajbh',
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                // width: 200,
                render: text => (
                    <Ellipsis lines={2} tooltip>
                        {text}
                    </Ellipsis>
                ),
            },
            {
                title: '案件类别',
                dataIndex: 'ajlb_name',
            },
            {
                title: '案件状态',
                dataIndex: 'ajzt',
            },
            {
                title: '嫌疑人姓名',
                dataIndex: 'name',
            },
            {
                title: '身份证号',
                dataIndex: 'zjhm',
            },
            {
                title: '家庭住址',
                dataIndex: 'address',
            },
            {
                title: '现实状况',
                dataIndex: 'xszk_name',
            },
        ];
        let className = this.props.global && this.props.global.dark ? stylescommon.statistics : stylescommon.statistics + ' ' + stylescommon.lightFromBox;
        return (
            <div className={className}>
                <Card className={stylescommon.listPageWrap}>{this.search()}</Card>
                <Card className={stylescommon.cardArea}>
                    <div>
                        <Table
                            bordered
                            loading={this.state.loading}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.handleTableChange}
                            columns={columns}
                            dataSource={this.state.data.list}
                            className={stylescommon.scrollTable + ' '+ stylescommon.tableBox}
                            locale={{
                                emptyText: <Empty
                                    image={this.props.global && this.props.global.dark ? noList : noListLight}
                                    description={'暂无数据'}/>
                            }}
                        />
                    </div>
                </Card>
            </div>
        );
    }
}
