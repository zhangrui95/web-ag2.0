import React, { PureComponent } from 'react';
import { Table, Divider, Tooltip, message, Dropdown, Menu, Row, Col, Empty, Icon, Radio,Card,Checkbox,Pagination,Modal } from 'antd';
import styles from './learningTable.less';
// import Detail from '../../routes/AreaRealData/areaDetail';
// import ShareModal from './../ShareModal/ShareModal';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { routerRedux } from 'dva/router';
import noList from '@/assets/viewData/noList.png';
import noListLight from '@/assets/viewData/noListLight.png';
import suspend from '@/assets/common/suspend.png';
import { connect } from 'dva';
import {tableList} from "@/utils/utils";
@connect(({ global }) => ({
  global,
}))
class learningTable extends PureComponent {
  state = {
    mode:'left',
    selectedRows:[],
    previewModal:false, // 预览模态框
    previewRecord:'',
    tablechoose:[], // 表格中的选中项
    checkboxchoose:[],
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({
      current: pagination.current,
    });
  };
  handleStandardTableChanges = (page) => {
    this.props.viewChange(page);
  }

  componentDidMount() {

  }

  //查看
  playVideo=(record)=>{
    this.setState({
      previewModal:true,
      previewRecord:record,
    })
  }

  // 下载
  downLoad = (record) => {
    // console.log('record',record);
    window.open('http://'+record.xzlj+'?dl=true');
  }

  // 删除
  DeleteVideo = (record) => {
    this.props.deleteOneData(record);
  }
  // 左右切换
  handleModeChange = (e) => {
    const mode = e.target.value;
    // console.log('mode',mode);
    this.setState({ mode });
  };
  checkboxView = (checkedValues) => {
    // console.log('checkedValues',checkedValues)
    this.setState({
      tablechoose:checkedValues,
    })
    if(this.props.chooseSelect){
      this.props.chooseSelect(checkedValues);
    }
  }
  CaseQuery(){
    const { data } = this.props;
    const { tablechoose,checkboxchoose } = this.state;
    const list = data.list;
    const rows = [];
    // console.log('tablechoose',this.state.tablechoose);
    if (data&&list) {
      list.map((item)=>{
        return(
          rows.push(
            <div className={styles.list}>
              <Checkbox value={item.id} className={styles.checkbox} />
              <div className={styles.card} style={{padding: '0 24px 24px 0'}} onClick={()=>this.playVideo(item)}>
                <Card className={styles.card}>
                    <img width='100%' height={150} src={suspend}/>
                    <div className={styles.listmes}>
                      <div style={{fontSize: 16}}><Ellipsis length={16} tooltip>{item.zlmc}</Ellipsis></div>
                      <div>{item.scsj}</div>
                    </div>
                </Card>
              </div>
            </div>
          )
        )
      })

    }
    return <Checkbox.Group defaultValue={[...tablechoose]} className={styles.CheckGroup} onChange={this.checkboxView}>{rows}</Checkbox.Group>;
  }
  // CaseQuery() {
  //   {/*<Checkbox.Group onChange={this.onChange}>*/}
  //     {/*<Checkbox value='a'>a</Checkbox>*/}
  //     {/*<Checkbox value='b'>b</Checkbox>*/}
  //     {/*<Checkbox value='c'>c</Checkbox>*/}
  //   {/*</Checkbox.Group>*/}
  //   const { data } = this.props;
  //   const list = data.list;
  //   const dataLength = list.length;
  //   if (data&&list) {
  //     const rowLength = Math.floor(dataLength / 5);
  //     const restLength = dataLength % 5;
  //     const rows = [];
  //     const rows1 = [];
  //     const rows2 = [];
  //     const casequery = [];
  //     for (let a = 0; a < rowLength; a++) {
  //       const cols = [];
  //       for (let b = 5 * a; b < 5 * (a + 1); b++) {
  //         cols.push(
  //             <div className={styles.list}>
  //               <div className={styles.card} style={{padding: '0 24px 24px 0'}}>
  //                 <Card className={styles.card}>
  //                   <img width='100%' height={150} src={noList} />
  //                   <div className={styles.listmes}>
  //                     <div style={{fontSize:20}}>{list[b].zlmc}</div>
  //                     <div>{list[b].scsj}</div>
  //                   </div>
  //                 </Card>
  //               </div>
  //             </div>
  //         );
  //       }
  //       rows1.push(cols);
  //     }
  //     if (restLength) {
  //       for (let c = 0; c < 5; c++) {
  //         if (c < restLength) {
  //           casequery.push(
  //             <div className={styles.list}>
  //               <div className={styles.card} style={{padding: '0 24px 24px 0'}}>
  //                 <Card className={styles.card}>
  //                   <img width='100%' height={150} src={noList} />
  //                   <div className={styles.listmes}>
  //                     <div style={{fontSize:20}}>{list[c].zlmc}</div>
  //                     <div>{list[c].scsj}</div>
  //                   </div>
  //                 </Card>
  //               </div>
  //             </div>
  //           );
  //         } else {
  //           casequery.push(
  //             <div className={styles.list}>
  //               {/*<div className={styles.card}>*/}
  //                 {/*<Card className={styles.card} />*/}
  //               {/*</div>*/}
  //             </div>
  //           );
  //         }
  //       }
  //     }
  //     rows2.push({casequery});
  //     rows.push(rows1);
  //     rows.push(rows2);
  //     return rows;
  //   }
  // }
  tabLeft = () => {
    const { data } = this.props;
    const { mode,checkboxchoose,tablechoose } = this.state;
    let columns, checkboxchooseObj = [];
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
        title: '文件大小(M/KB)',
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
            <Divider type="vertical"/>
            <a onClick={() => this.DeleteVideo(record)}>删除</a>
          </div>
        ),
      },
    ];
    const rowSelection = {
      // selections:checkboxchoose,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys',selectedRowKeys);
        // console.log('selectedRows',selectedRows);
        this.setState({
          tablechoose:selectedRowKeys,

        })
        if(this.props.chooseSelect){
          this.props.chooseSelect(selectedRowKeys);
        }

        // this.setState({
        //   selectedRows,
        // })
      },
      selectedRowKeys: [...tablechoose],
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
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
      <div>
        <Table
          // size={'middle'}
          // loading={loading}
          rowKey={record => record.id}
          dataSource={data.list}
          columns={columns}
          rowSelection={rowSelection}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          className={styles.showTable}
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
  };
  tabRight = () => {
    const { data,pagenow } = this.props;
    // console.log('data',pagenow);
    return (
      <div className={styles.ListStyle}>
        {data&&data.list ? this.CaseQuery(): ''}
        <div style={{ padding: '24px 0', position: 'relative' }}>
          <Pagination
            className={styles.paginations}
            total={data.page.totalResult}
            // size="small"
            current={pagenow}
            // showSizeChanger
            // showQuickJumper
            onChange={this.handleStandardTableChanges}
            // onShowSizeChange={this.onShowSizeChange}
            pageSize={tableList}
            showTotal={() => `共 ${data ? data.page.totalPage : 1} 页，${data ? data.page.totalResult : 0} 条记录`}
          />

        </div>
      </div>
    );
  }
  // onChange=(e)=>{
    // console.log('e----',e);
  // }
  previewModalCancel = () => {
    this.setState({
      previewModal:false,
      previewRecord:'',
    })
  }
  render() {
    const { data } = this.props;
    const { mode,previewModal,previewRecord } = this.state;
    return (
      <div className={styles.standardTable}>
        <Radio.Group onChange={this.handleModeChange} value={mode} className={styles.radio} buttonStyle="solid">
          <Tooltip title="列表展示">
            <Radio.Button value="left">
              <span>列表展示</span>
              <Icon type="bars" style={{ fontSize: 16 }} />
            </Radio.Button>
          </Tooltip>
          <Tooltip title="图表展示">
            <Radio.Button value="right">
              <span>图表展示</span>
              <Icon type="appstore-o" style={{ fontSize: 16 }} />
            </Radio.Button>
          </Tooltip>
        </Radio.Group>
        {mode === 'left' ? this.tabLeft() : this.tabRight()}
        {data && data.page && data.page.totalResult === 0 && mode === 'right' ?
          <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)', padding: '16px' }}>暂无数据</div>
          :
          ''
        }
        {
          previewModal?
            <Modal
              visible={previewModal}
              footer={null}
              title='法规培训'
              className={styles.show}
              onCancel={this.previewModalCancel}
            >
              <iframe
                // title="集体通案记载表"
                className={styles.box}
                src={previewRecord.lx==='文档'?previewRecord.yllj:'http://'+previewRecord.xzlj}
                width="1170px"
                height="607px"
              />
            </Modal>
            :
            ''
        }
      </div>
    );
  }
}

export default learningTable;
