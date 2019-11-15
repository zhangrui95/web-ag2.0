import React, { PureComponent } from 'react';
import { Table, Tooltip } from 'antd';
import styles from './RenderTable.less';
// import UncaseDetail from '../../routes/UnCaseRealData/uncaseDetail';
// import UnareaDetail from '../../routes/UnAreaRealData/unareaDetail';
// import UnitemDetail from '../../routes/UnItemRealData/unitemDetail';
// import UnXzCaseDetail from '../../routes/UnXzCaseRealData/caseDetail';
// import UnDossierDetail from '../../routes/UnDossierData/UnDossierDetail';
// import UnPoliceDetail from '../../routes/UnPoliceRealData/unpoliceDetail';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

class RenderTable extends PureComponent {
    state = {};

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.record) {
            this.deatils(this.props.location.query.record);
        }
    }

    // 根据案件编号打开案件窗口
    deatils = (record) => {
        // const { wt_id: wtId, system_id: systemId, wtflId, dqzt, id, dbid, fkzt } = record;
        // if (wtflId === '203203') { // 办案区
        //     const divs = (
        //         <div>
        //             <UnareaDetail
        //                 {...this.props}
        //                 id={wtId}
        //                 baqId={systemId}
        //                 refreshTable={this.props.refreshTable}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '人员在区告警详情', content: divs, key: wtId };
        //     this.props.newDetail(AddNewDetail);
        // } else if (wtflId === '203204') { // 涉案财物
        //     const divs = (
        //         <div>
        //             <UnitemDetail
        //                 {...this.props}
        //                 id={wtId}
        //                 systemId={systemId}
        //                 refreshTable={this.props.refreshTable}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '涉案物品告警详情', content: divs, key: wtId };
        //     this.props.newDetail(AddNewDetail);
        //
        // } else if (wtflId === '203202') { //案件流程
        //     const divs = (
        //         <div>
        //             <UncaseDetail
        //                 {...this.props}
        //                 id={wtId}
        //                 systemId={systemId}
        //                 refreshTable={this.props.refreshTable}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '刑事案件告警详情', content: divs, key: wtId };
        //     this.props.newDetail(AddNewDetail);
        //
        // } else if (wtflId === '203205') { // 行政案件问题数据
        //     const divs = (
        //         <div>
        //             <UnXzCaseDetail
        //                 {...this.props}
        //                 id={wtId}
        //                 systemId={systemId}
        //                 refreshTable={this.props.refreshTable}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '行政案件告警详情', content: divs, key: wtId };
        //     this.props.newDetail(AddNewDetail);
        // } else if (wtflId === '203206') {
        //     const divs = (
        //         <div>
        //             <UnDossierDetail
        //                 {...this.props}
        //                 id={id}
        //                 wtid={wtId}
        //                 dossierId={systemId}
        //                 refreshTable={this.props.refreshTable}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '卷宗告警详情', content: divs, key: wtId };
        //     this.props.newDetail(AddNewDetail);
        // } else if (wtflId === '203201') {
        //     const divs = (
        //         <div>
        //             <UnPoliceDetail
        //                 id={id}
        //                 wtid={wtId}
        //                 {...this.props}
        //             />
        //         </div>
        //     );
        //     const AddNewDetail = { title: '警情告警详情', content: divs, key: id };
        //     this.props.newDetail(AddNewDetail);
        // }
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    };

    render() {
        const { data, loading } = this.props;
        let columns;
        columns = [
            {
                title: '',
                dataIndex: 'dqzt',
                render: (text, record) => {
                    if (text === '0' && record.fkzt === '1') {
                        return (
                            <div>
                                <span style={{ color: '#f40' }}>（未读）</span>
                            </div>
                        );
                    }
                },
                width: 75,
            },
            {
                title: '问题类型',
                dataIndex: 'wtlxMc',
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                width: '20%',
                render: (text, record) => {
                    return text && text !== '' ? <Ellipsis lines={2} tooltip>{text}</Ellipsis> : (
                        record.ajbh ? '未生成案件名称' : '未关联案件'
                    );
                },
            },
            {
                title: '案件编号',
                dataIndex: 'ajbh',
                width: 200,
                render: (text) => {
                    return text || '未关联案件';
                },
            },
            {
                title: '督办状态',
                dataIndex: 'dbztMc',
            },
            {
                title: '督办时间',
                dataIndex: 'dbsj',
                width: 100,
            },
            {
                title: '反馈状态',
                dataIndex: 'fkztMc',
            },
            {
                title: '要素类型',
                dataIndex: 'wtflMc',
            },
            {
                title: '反馈时间',
                dataIndex: 'fksj',
                width: 100,
            },
            {
                title: '操作',
                render: (text, record) => (
                    <div>
                        <a onClick={() => this.deatils(record)}>详情</a>
                    </div>
                ),
            },
        ];
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            current: data && data.page ? data.page.currentPage : '',
            total: data && data.page ? data.page.totalResult : '',
            pageSize: data && data.page ? data.page.showCount : '',
            showTotal: (total, range) =>
                <span
                    className={styles.pagination}>{`共 ${data.page ? data.page.totalResult : 0} 条记录 第 ${data.page ? data.page.currentPage : 1} / ${data.page ? data.page.totalPage : 1} 页`}</span>,
        };

        return (
            <div className={styles.standardTable}>
                <Table
                    size={'middle'}
                    loading={loading}
                    rowKey={record => record.key}
                    dataSource={data.list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                />
            </div>
        );
    }
}

export default RenderTable;
