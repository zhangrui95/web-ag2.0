import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty } from 'antd';
import styles from './learningTable.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
// import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import { connect } from 'dva';
@connect(({ global }) => ({
  global,
}))
class learningTable extends PureComponent {
  state = {

  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      current: pagination.current,
    });
  };

  componentDidMount() {

  }

  //查看
  playVideo=(record)=>{

  }

  // 下载
  downLoad = (record) => {
    // window.open('http://'+file.response.fileUrl);
  }

  render() {
    const { data, loading } = this.props;
    console.log('data',data);
    let columns;
    columns = [
      {
        title: '资料名称',
        dataIndex: 'zlmc',
        // width: 100,
      },
      {
        title: '上传时间',
        dataIndex: 'scsj',
        // width: 100,
      },
      {
        title: '类型',
        dataIndex: 'lx',
        // width: 100,
      },
      {
        title: '发布单位',
        dataIndex: 'fbdw',
        // width: 100,
      },
      {
        title: '文件大小',
        dataIndex: 'wjdx',
        // width: 100,
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.playVideo(record)}>查看</a>
            <Divider type="vertical"/>
            <a onClick={() => this.downLoad(record)}>下载</a>
          </div>
        ),
      },
    ];
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: data.page ? data.page.currentPage : '',
      total: data.page ? data.page.totalResult : '',
      pageSize: data.page ? data.page.showCount : '',
      showTotal: (total, range) => (
        <span className={styles.pagination}  style={{
          color: this.props.global && this.props.global.dark ? '#fff' : '#999'
        }}>{`共 ${data.page ? data.page.totalPage : 1} 页， ${
          data.page ? data.page.totalResult : 0
          } 条记录 `}</span>
      ),
    };
    return (
      <div className={styles.standardTable} id="baqcardArea">
        <Table
          // size={'middle'}
          // loading={loading}
          rowKey={record => record.key}
          dataSource={data.list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={this.props.global && this.props.global.dark ? noList : noListLight}
                description={'暂无数据'}
              />
            ),
          }}
        />
      </div>
    );
  }
}

export default learningTable;
