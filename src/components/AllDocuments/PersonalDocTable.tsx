/*
* PersonalDocTable 人员档案列表表格
* author：lyp
* 20181225
* */
import React, { PureComponent } from 'react';
import {Table, message, Card, Empty} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './docTable.less';
// import PersonDetail from '../../routes/AllDocuments/PersonalDocDetail';
import stylescommon from "@/pages/common/common.less";
import noList from "@/assets/viewData/noList.png";

export default class PersonalDocTable extends PureComponent {
    state = {
        lx: '案件信息',
        tzlx: 'xzajxx',
        current: '',
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
        this.setState({
            current: pagination.current,
        });
    };
    openPersonDetail = (record) => {
        // const { xyr_sfzh: idcard, system_id } = record;
        // if (idcard) {
        //     this.props.dispatch({
        //         type: 'AllDetail/AllDetailPersonFetch',
        //         payload: {
        //             sfzh: idcard,
        //         },
        //         callback: (data) => {
        //             if (data && data.ryxx) {
        //                 const divs = (
        //                     <div>
        //                         <PersonDetail
        //                             {...this.props}
        //                             idcard={idcard}
        //                             id={system_id}
        //                             ly='常规数据'
        //                             from='人员档案'
        //                         />
        //                     </div>
        //                 );
        //                 const AddNewDetail = { title: '人员档案', content: divs, key: idcard + 'ryda' };
        //                 this.props.newDetail(AddNewDetail);
        //             } else {
        //                 message.error('该人员暂无人员档案');
        //             }
        //         },
        //     });
        // } else {
        //     message.error('该人员暂无人员档案');
        // }

    };

    handleCancel = (e) => {
        this.setState({
            shareVisible: false,
        });
    };

    render() {
        const { data, loading } = this.props;
        const columns = [
            {
                title: '涉案人员',
                dataIndex: 'name',
            },
            {
                title: '人员性别',
                dataIndex: 'sex',
            },
            {
                title: '证件号',
                dataIndex: 'xyr_sfzh',
            },
            {
                title: '人员类型',
                dataIndex: 'salx_mc',
            },
            {
                title: '案件名称',
                dataIndex: 'ajmc',
                // width: '30%',
                render: (text) => {
                    return <Ellipsis lines={2} tooltip>{text}</Ellipsis>;
                },
            },
            {
                title: '案件编号',
                dataIndex: 'ajbh',
            },
            {
              title: '强制措施时间',
              dataIndex: 'qssj',
            },
            {
              title: '受理时间',
              dataIndex: 'slsj',
            },
            {
                title: '强制措施',
                dataIndex: 'qzcsmc',
            },
            {
              title: '案件类别',
              dataIndex: 'ajlbmc',
            },
            {
                title: '操作',
                render: (record) => {
                    return <a onClick={() => this.openPersonDetail(record)}>详情</a>;
                },
            },
        ];

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

        return (
            <Card className={stylescommon.cardArea}>
                <Table
                    loading={loading}
                    rowKey={record => record.key}
                    dataSource={data.list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    locale={{ emptyText: <Empty image={noList} description={'暂无记录'} /> }}
                />
            </Card>
        );
    }
}
