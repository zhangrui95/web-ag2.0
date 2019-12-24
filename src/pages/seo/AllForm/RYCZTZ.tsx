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
        levels: [], // 查询层级
        data: [],
        current: 1,
        count: autoheight() > 900 ? 10 : 5,
    };

    componentDidMount() {
        this.searchData(this.state.selectDateValue);
    }

    //清除列表
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
        let formValues = params.pd ? params.pd : {};
        this.setState({
            formValues,
            loading: true,
            data: [],
        });
        this.props.dispatch({
            type: 'TzList/getRyCzTz',
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
            this.setState({
                levels: [],
            });
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
        const {levels} = this.state;
        return (
            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                <Col md={12} sm={24}>
                    <StatisticsDateSelect
                        setSelectDateValue={this.setSelectDateValue}
                        selectDateValue={this.state.selectDateValue}
                        emptyData={this.emptyData}
                        id={'RYCZTZ'}
                    />
                </Col>
                <Col md={12} sm={24}>
                    <div className={stylescommon.buttonArea}>
                        <Button type="submit" icon={'download'} onClick={() => this.exportData()}>
                            导出
                        </Button>
                    </div>
                </Col>
            </Row>
        );
    }

    // 导出
    exportData = () => {
        const {formValues} = this.state;
        this.props.dispatch({
            type: 'common/exportData',
            payload: {
                tableType: '21',
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
                    className={
                        data &&
                        data.page &&
                        data.page.totalResult &&
                        data.page.totalResult.toString().length < 5
                            ? stylescommon.pagination
                            : stylescommon.paginations
                    }
                >{`共 ${data && data.page ? data.page.totalPage : 1} 页，${
                    data && data.page ? data.page.totalResult : 0
                    } 条数据 `}</span>
            ),
        };
        const columns = [
            {
                title: '序号',
                render: (text, record, index) => (
                    <span>{(this.state.current - 1) * this.state.count + (index + 1)}</span>
                ),
            },
            {
                title: '案件编号',
                width: 200,
                dataIndex: 'ajbh',
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                width: 200,
                render: text => (
                    <Ellipsis lines={2} tooltip>
                        {text}
                    </Ellipsis>
                ),
            },
            {
                title: '案件类型',
                dataIndex: 'ajlx',
            },
            {
                title: '人员姓名',
                dataIndex: 'ryxm',
            },
            {
                title: '身份证号',
                dataIndex: 'sfzh',
            },
            {
                title: '行政处罚',
                children: [
                    {
                        title: '行政拘留',
                        dataIndex: 'xzjl',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'xzjl_zxsj',
                            },
                            {
                                title: '拘留时限',
                                dataIndex: 'xzjl_jlsx',
                            },
                        ],
                    },
                    {
                        title: '罚款',
                        dataIndex: 'fk',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'fk_zxsj',
                            },
                            {
                                title: '金额',
                                dataIndex: 'fk_je',
                            },
                        ],
                    },
                    {
                        title: '拘留并处罚款',
                        dataIndex: 'jlbfk',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'jlfk_zxsj',
                            },
                            {
                                title: '拘留时限',
                                dataIndex: 'jlfk_jlsx',
                            },
                            {
                                title: '金额',
                                dataIndex: 'jlfk_je',
                            },
                        ],
                    },
                    {
                        title: '警告',
                        dataIndex: 'jg',
                    },
                    {
                        title: '社区戒毒',
                        dataIndex: 'sqjd',
                    },
                    {
                        title: '其他行政处罚',
                        dataIndex: 'qtxzcf',
                    },
                ],
            },
            {
                title: '强制措施',
                children: [
                    {
                        title: '拘传',
                        dataIndex: 'jc',
                    },
                    {
                        title: '刑事拘留',
                        dataIndex: 'xsjl',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'xsjl_zxsj',
                            },
                            {
                                title: '重新计算羁押期限一',
                                dataIndex: 'xsjl_jyqx1',
                            },
                            {
                                title: '延长时限',
                                dataIndex: 'xsjl_ycsx1',
                            },
                            {
                                title: '重新计算羁押期限二',
                                dataIndex: 'xsjl_jyqx2',
                            },
                            {
                                title: '延长时限',
                                dataIndex: 'xsjl_ycsx2',
                            },
                            {
                                title: '释放',
                                dataIndex: 'sf',
                            },
                        ],
                    },
                    {
                        title: '监视居住',
                        dataIndex: 'jsjz',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'jsjz_zxsj',
                            },
                            {
                                title: '解除时间',
                                dataIndex: 'jsjz_jcsj',
                            },
                        ],
                    },
                    {
                        title: '取保候审',
                        dataIndex: 'qbhs',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'qbhs_zxsj',
                            },
                            {
                                title: '保证人',
                                dataIndex: 'qbhs_bzr',
                            },
                            {
                                title: '保证金',
                                dataIndex: 'qbhs_bzj',
                            },
                            {
                                title: '解除时间',
                                dataIndex: 'qbhs_jcsj',
                            },
                        ],
                    },
                    {
                        title: '强制隔离戒毒',
                        dataIndex: 'qzgljd',
                    },
                ],
            },
            {
                title: '诉讼环节',
                children: [
                    {
                        title: '提请逮捕',
                        dataIndex: 'tqdb',
                    },
                    {
                        title: '批准逮捕',
                        dataIndex: 'pzdb',
                        children: [
                            {
                                title: '执行时间',
                                dataIndex: 'pzdb_zxsj',
                            },
                            {
                                title: '重新计算羁押期限一',
                                dataIndex: 'pzdb_jyqx1',
                            },
                            {
                                title: '重新计算羁押期限二',
                                dataIndex: 'pzdb_jyqx2',
                            },
                            {
                                title: '重新计算羁押期限三',
                                dataIndex: 'pzdb_jyqx3',
                            },
                        ],
                    },
                    {
                        title: '移送起诉',
                        dataIndex: 'ysqs',
                    },
                ],
            },
            {
                title: '上网追逃',
                dataIndex: 'swzt',
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
                            scroll={{
                                x:
                                    this.state.data && this.state.data.list && this.state.data.list.length > 0
                                        ? '350%'
                                        : '100%',
                            }}
                            className={stylescommon.scrollTable}
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
