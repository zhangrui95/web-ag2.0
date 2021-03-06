/*
* AlarmData/index.js 接处警警情数据
* author：jhm
* 20180605
* */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Row,
    Col,
    Form,
    Select,
    TreeSelect,
    Input,
    Button,
    DatePicker,
    Tabs,
    Radio,
    message,
    Cascader,
    Icon,
    Card
} from 'antd';
import moment from 'moment/moment';
import styles from './index.less';
import RenderTable from '../../../components/videoManage/RenderTable';
import DataView from '../../../components/videoManage/DataView';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import {exportListDataMaxDays, getQueryString, tableList} from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';

const FormItem = Form.Item;
const {Option,OptGroup} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
let timeout;
let currentValue;

@connect(({policeData, loading, common, global,VideoDate}) => ({
    policeData, loading, common, global,VideoDate
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        jjly: '',
        jjdw: '',
        cjdw: '',
        formValues: {},
        activeKey: '0',
        arrayDetail: [],
        sfcj: '',
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        typeButtons: 'day', // 图表展示类别（week,month）
        allPolice: [],
        cjrPolice: [],
        is_tz: '0',
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: '', // 手动选择机构
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        caseTypeTree: [], // 警情类别树
        searchHeight: false, // 查询条件展开筛选
        dataList:[],
        sfgl:'',
        loading:false,
        ajztList:[],
    };


    componentDidMount() {
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        this.getDepTree(newjigouArea.department);
        this.getCaseStatus();
        this.getCaseTypeTree(window.configUrl.is_area);
        if(this.props.location.state&&(this.props.location.state.jqbh || this.props.location.state.ajbh)){
            let {jqbh,ajbh} = this.props.location.state;
            this.setState({
                showDataView:false,
                searchHeight: true,
            },()=>{
                this.props.form.setFieldsValue({
                    jqbh: jqbh ? jqbh : '',
                    ajbh: ajbh ? ajbh : '',
                });
                this.handleSearch();
            });
        }else{
            this.getList({});
        }
    }

    componentWillReceiveProps(nextProps) {
      // console.log('nextProps',nextProps);
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url ===  '/videoManage/videoData') {
            // this.handleFormReset();
            if (nextProps.global.isResetList.state){
                let {jqbh,ajbh} = nextProps.global.isResetList.state;
                this.setState({
                    showDataView:false,
                    searchHeight: true,
                },()=>{
                    this.props.form.setFieldsValue({
                        jqbh: jqbh ? jqbh : '',
                        ajbh: ajbh ? ajbh : '',
                    });
                    this.handleSearch();
                });
            }else{
                const params = {
                    currentPage: 1,
                    showCount: tableList,
                    pd: {
                        ...this.state.formValues,
                    },
                };
                this.getList(params);
            }
        }
    }

    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };

    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey);  // this.remove(targetKey);
    };

    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };

    // 关闭页面
    onEdit = (targetKey, action) => {
        this[action](targetKey);  // this.remove(targetKey);
    };


    getList(param) {
      console.log('查询--------->',param);
      this.setState({
          loading:true
      });
        this.props.dispatch({
            type: 'VideoDate/getList',
            payload: param ? param : '',
            callback:(data)=>{
                this.setState({
                    dataList:data,
                    loading:false,
                })
            }
        });
    }

    // 获取所有警员
    getAllPolice = (name, cjr) => {
        const that = this;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = name;
        timeout = setTimeout(function () {
            that.props.dispatch({
                type: 'common/getAllPolice',
                payload: {
                    search: name,
                },
                callback: (data) => {
                    if (data && (currentValue === name)) {
                        if (cjr) {
                            that.setState({
                                cjrPolice: data.slice(0, 50),
                            });
                        } else {
                            that.setState({
                                allPolice: data.slice(0, 50),
                            });
                        }
                    }
                },
            });
        }, 300);

    };
    handleAllPoliceOptionChange = (value, cjr) => {
        this.getAllPolice(value, cjr);
    };
    // 获取机构树
    getDepTree = (area) => {
        const areaNum = [];
        if (area) {
            areaNum.push(area);
        }
        this.props.dispatch({
            type: 'common/getDepTree',
            payload: {
                departmentNum: areaNum,
            },
            callback: (data) => {
                if (data) {
                    this.setState({
                        treeDefaultExpandedKeys: [data[0].code],
                    });
                }
            },
        });
    };
    // 关闭页面链接的函数
    remove = (targetKey) => {
        let {activeKey} = this.state;
        let lastIndex;
        this.state.arrayDetail.forEach((pane, i) => {
            if (pane.key === targetKey) {
                if (i === 0) {
                    lastIndex = 0;
                } else {
                    lastIndex = i - 1;
                }
            }
        });
        const panes = this.state.arrayDetail.filter(pane => pane.key !== targetKey);
        if (panes.length > 0) {
            if (lastIndex >= 0 && activeKey === targetKey) {
                activeKey = panes[lastIndex].key;
            }
            this.setState({
                arrayDetail: panes,
                activeKey: activeKey,
            });
        } else {
            this.setState({
                arrayDetail: panes,
                activeKey: '0',
            });
        }
    };
    // 打开新的详情页面
    newDetail = (addDetail) => {
        let newDetail = [];
        let isDetail = true;
        newDetail = [...this.state.arrayDetail];
        for (let a = 0; a < newDetail.length; a++) {
            if (addDetail.key === newDetail[a].key) {
                isDetail = false;
                break;
            }
        }
        if (isDetail) {
            newDetail.push(addDetail);
            this.setState({
                arrayDetail: newDetail,
                activeKey: addDetail.key,
            });
        } else {
            this.setState({
                activeKey: addDetail.key,
            });
        }
    };

    // 无法选择的日期
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    };
    // 表格分页
    handleTableChange = (pagination, filtersArg, sorter) => {
        const {formValues} = this.state;
        const params = {
            pd: {
                ...formValues,
            },
            currentPage: pagination.current,
            showCount: pagination.pageSize,
        };
        this.getList(params);
    };
    // 查询
    handleSearch = (e) => {
        if (e) e.preventDefault();
        // const values = this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const formValues = {
                ajbh:values.ajbh ? values.ajbh.trim() : '',
                ajmc:values.ajmc ? values.ajmc.trim() : '',
                badw_dm:values.badw ? values.badw : '',
                ajzt:values.ajzt&&values.ajzt.length > 0 ? values.ajzt.toString() : '',
                ajlb:values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
                bar:values.bar ? values.bar : '',
                jqbh:values.jqbh ? values.jqbh : '',
                lzrq_ks:values.lzrq && values.lzrq.length > 0 ? values.lzrq[0].format('YYYY-MM-DD') : '',
                lzrq_js:values.lzrq && values.lzrq.length > 0 ? values.lzrq[1].format('YYYY-MM-DD') : '',
                scrq_ks:values.scrq && values.scrq.length > 0 ? values.scrq[0].format('YYYY-MM-DD') : '',
                scrq_js:values.scrq && values.scrq.length > 0 ? values.scrq[1].format('YYYY-MM-DD') : '',
                ly_dm:values.ysply&&values.ysply.length > 0 ? values.ysply.toString() : '',
                wjmc:values.wjmc ? values.wjmc : '',
                sfgl:values.sfgl ? values.sfgl : '',
                lb_dm:values.wjlx&&values.wjlx.length > 0 ? values.wjlx.toString() : '',
            };
            this.setState({
              formValues,
            });
            const params = {
              currentPage: 1,
              showCount: tableList,
              pd: {
                ...formValues,
              },
            };
            this.getList(params);
          }
        })
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {},
            sfgl:'',
        });
        const obj = {
            currentPage: 1,
            showCount: tableList,
            pd: {},
        };
        this.getList(obj);
    };
    // 导出
    exportData = () => {
        const values = this.props.form.getFieldsValue();
        const jjTime = values.jjsj;
        const formValues = {
            ajbh:values.ajbh ? values.ajbh.trim() : '',
            ajmc:values.ajmc ? values.ajmc.trim() : '',
            badw_dm:values.badw ? values.badw : '',
            ajzt:values.ajzt&&values.ajzt.length > 0 ? values.ajzt.toString() : '',
            ajlb:values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            bar:values.bar ? values.bar : '',
            jqbh:values.jqbh ? values.jqbh : '',
            lzrq_ks:values.lzrq && values.lzrq.length > 0 ? values.lzrq[0].format('YYYY-MM-DD') : '',
            lzrq_js:values.lzrq && values.lzrq.length > 0 ? values.lzrq[1].format('YYYY-MM-DD') : '',
            scrq_ks:values.scrq && values.scrq.length > 0 ? values.scrq[0].format('YYYY-MM-DD') : '',
            scrq_js:values.scrq && values.scrq.length > 0 ? values.scrq[1].format('YYYY-MM-DD') : '',
            ly_dm:values.ysply&&values.ysply.length > 0 ? values.ysply.toString() : '',
            wjmc:values.wjmc ? values.wjmc.trim() : '',
            sfgl:values.sfgl ? values.sfgl : '',
            lb_dm:values.wjlx&&values.wjlx.length > 0 ? values.wjlx.toString() : '',
        };
        if (values.lzrq && values.lzrq.length > 0 || values.scrq && values.scrq.length > 0) {
            const isAfterDate = moment(formValues.jjsj_js).isAfter(moment(formValues.jjsj_ks).add(exportListDataMaxDays, 'days'));
            if (isAfterDate) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            } else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '1',
                        sqdd_type: '2',
                        ...formValues,
                    },
                    callback: (data) => {
                        if (data.text) {
                            message.error(data.text);
                        } else {
                            window.open(configUrl.serverUrl + data.url);
                        }
                    },
                });
            }
        } else {
            message.warning(`请选择需要导出的数据日期，日期间隔需小于${exportListDataMaxDays}天`);
        }

    };
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
            // typeButtons: 'day',
        });
        // if(showDataView) this.handleFormReset();
    };
    // 设置手动选择日期
    setSelectedDate = (val) => {
        this.setState({
            typeButtons: 'selectedDate',
            selectedDateVal: val,
        });
    };
    // 设置手动选择机构
    setSelectedDep = (val) => {
      console.log('val-------->',val)
        this.setState({
            selectedDeptVal: val,
        });
    };
    // 设置手动选择接警单位
    setJjdw = (val) => {
        this.setState({
            jjdw: val,
        });
    };
    // 设置手动选择处警单位
    setCjdw = (val) => {
        this.setState({
            cjdw: val,
        });
    };
    // 改变图表类别
    changeTypeButtons = (val) => {
        this.setState({
            typeButtons: val,
        });
    };
    // 渲染机构树
    renderloop = data => data.map((item) => {
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={item.code} key={item.code}
                             title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={item.code} value={item.code} title={item.name}/>;
    });

    filter = (inputValue, path) => {
        return (path.some(items => (items.searchValue).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    };

    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };
    // 获取案件状态字典
    getCaseStatus = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500729',
            },
        });
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500719',
            },
        });
    };
  // // 获取案件状态字典
  // getCaseStatus = () => {
  //     const options = [
  //         {
  //             value: 'xz',
  //             label: '行政',
  //             children: [],
  //         },
  //         {
  //             value: 'xs',
  //             label: '刑事',
  //             children: [],
  //         },
  //     ];
  //   this.props.dispatch({
  //     type: 'common/getDictType',
  //     payload: {
  //       appCode: window.configUrl.appCode,
  //       code: '500729',//行政
  //     },
  //       callback: (data) => {
  //          console.log('data1',data);
  //           data.map((item)=>{
  //               options[0].children.push({value: item.code, label: item.name});
  //           });
  //       },
  //   });
  //     this.props.dispatch({
  //         type: 'common/getDictType',
  //         payload: {
  //             appCode: window.configUrl.appCode,
  //             code: '500719',//刑事
  //         },
  //         callback: (data) => {
  //             console.log('data2',data);
  //             data.map((item)=>{
  //                 options[1].children.push({value: item.code, label: item.name});
  //             });
  //         },
  //     });
  //     this.setState({
  //         ajztList:options,
  //     });
  // };
  // 获取案件类别树
  getCaseTypeTree = (areaNum) => {
    this.props.dispatch({
      type: areaNum === '2' ? 'common/getPlCaseTypeTree' : 'common/getCaseTypeTree',
      payload: {
        ajlb: 'xs,xz', // 案件类别xs,xz
        is_area: '0',
      },
      callback: (data) => {
        if (data.list) {
          this.setState({
            caseTypeTree: data.list,
          });
        }
      },
    });
  };
    renderForm() {
        const {form: {getFieldDecorator}, common: {sourceOfAlarmDict, depTree, handleStatusDict}} = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard}`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const cjrPoliceOptions = this.state.cjrPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard}`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const {caseTypeTree} = this.state;
        let sourceOfAlarmDictOptions = [];
        if (sourceOfAlarmDict.length > 0) {
            for (let i = 0; i < sourceOfAlarmDict.length; i++) {
                const item = sourceOfAlarmDict[i];
                sourceOfAlarmDictOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const handleStatusDictOptions = [];
        if (handleStatusDict && handleStatusDict.length > 0) {
            for (let i = 0; i < handleStatusDict.length; i++) {
                const item = handleStatusDict[i];
                handleStatusDictOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        const formItemLayout = {
            labelCol: {xs: {span: 12}, md: {span: 8}, xl: {span: 6}, xxl: {span: 5}},
            wrapperCol: {xs: {span: 12}, md: {span: 16}, xl: {span: 18}, xxl: {span: 19}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 12, xxl:8};
      const {common: { XzCaseStatusType,CaseStatusType}} = this.props;
      let XzCaseStatusOption = [];
      let CaseStatusOption = [];
      if (XzCaseStatusType.length > 0) {
        for (let i = 0; i < XzCaseStatusType.length; i++) {
          const item = XzCaseStatusType[i];
          XzCaseStatusOption.push(
            <Option key={item.id} value={item.code}>{item.name}(行政)</Option>,
          );
        }
      }
        if (CaseStatusType.length > 0) {
            for (let i = 0; i < CaseStatusType.length; i++) {
                const item = CaseStatusType[i];
                CaseStatusOption.push(
                    <Option key={item.id} value={item.code}>{item.name}(刑事)</Option>,
                );
            }
        }
        return (
            <Form onSubmit={this.handleSearch} style={{height: this.state.searchHeight ? 'auto' : '50px',}}>
                <Row gutter={rowLayout} className={styles.searchForm}>
                  <Col {...colLayout}>
                    <FormItem label="案件编号" {...formItemLayout}>
                      {getFieldDecorator('ajbh', {
                        // initialValue: this.state.MySuperviseType,
                      })(
                        <Input placeholder="请输入案件编号"/>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="案件名称" {...formItemLayout}>
                      {getFieldDecorator('ajmc')(
                        <Input placeholder="请输入案件名称"/>,
                      )}
                    </FormItem>
                  </Col>
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('badw', {})(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入办案单位"
                                    allowClear
                                    key='jjdwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('videoListForm')}
                                >
                                    {depTree && depTree.length > 0 ? this.renderloop(depTree) : []}
                                </TreeSelect>,
                            )}
                        </FormItem>
                    </Col>
                  <Col {...colLayout}>
                    <FormItem label="案件状态" {...formItemLayout}>
                      {getFieldDecorator('ajzt', {
                        initialValue: this.state.ajzt,
                      })(
                        <Select placeholder="请选择案件状态" style={{width: '100%'}}
                                mode="multiple"
                                getPopupContainer={() => document.getElementById('videoListForm')}>
                          {/*<Option value="">全部</Option>*/}
                            <OptGroup label="行政案件状态">
                                {XzCaseStatusOption}
                            </OptGroup>
                            <OptGroup label="刑事案件状态">
                                {CaseStatusOption}
                            </OptGroup>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  {/*  <Col {...colLayout}>*/}
                  {/*      <FormItem label="案件状态" {...formItemLayout}>*/}
                  {/*          {getFieldDecorator('ajzt', {*/}
                  {/*              // initialValue: this.state.caseAllType,*/}
                  {/*          })(*/}
                  {/*              <Cascader*/}
                  {/*                  options={this.state.ajztList}*/}
                  {/*                  placeholder="请选择案件状态"*/}
                  {/*                  changeOnSelect={true}*/}
                  {/*                  getPopupContainer={() => document.getElementById('videoListForm')}*/}
                  {/*                  showSearch={*/}
                  {/*                      {*/}
                  {/*                          filter: (inputValue, path) => {*/}
                  {/*                              return (path.some(items => (items.searchValue).indexOf(inputValue) > -1));*/}
                  {/*                          },*/}
                  {/*                          limit: 5,*/}
                  {/*                      }*/}
                  {/*                  }*/}
                  {/*              />,*/}
                  {/*          )}*/}
                  {/*      </FormItem>*/}
                  {/*  </Col>*/}
                  <Col {...colLayout}>
                    <FormItem label="案件类别" {...formItemLayout}>
                      {getFieldDecorator('ajlb', {
                        // initialValue: this.state.caseAllType,
                      })(
                        <Cascader
                          options={this.state.caseTypeTree}
                          placeholder="请选择案件类别"
                          changeOnSelect={true}
                          getPopupContainer={() => document.getElementById('videoListForm')}
                          showSearch={
                            {
                              filter: (inputValue, path) => {
                                return (path.some(items => (items.searchValue).indexOf(inputValue) > -1));
                              },
                              limit: 5,
                            }
                          }
                        />,
                      )}
                    </FormItem>
                  </Col>
                    <Col {...colLayout}>
                        <FormItem label="办案人" {...formItemLayout}>
                            {getFieldDecorator('bar', {
                                // initialValue: this.state.caseType,
                                //rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入办案人"
                                    onChange={(value) => this.handleAllPoliceOptionChange(value, false)}
                                    onFocus={(value) => this.handleAllPoliceOptionChange(value, false)}
                                    getPopupContainer={() => document.getElementById('videoListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                  <Col {...colLayout}>
                    <FormItem label="警情编号" {...formItemLayout}>
                      {getFieldDecorator('jqbh', {
                      })(
                        <Input placeholder="请输入警情编号"/>,
                      )}
                    </FormItem>
                  </Col>
                    <Col {...colLayout}>
                        <FormItem label="录制日期" {...formItemLayout}>
                            {getFieldDecorator('lzrq', {
                                // initialValue: this.state.jjsj,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    // showTime={{format: 'HH:mm:ss'}}
                                    // format="YYYY-MM-DD HH:mm:ss"
                                    getCalendarContainer={() => document.getElementById('videoListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="上传日期" {...formItemLayout}>
                            {getFieldDecorator('scrq', {
                                // initialValue: this.state.jjsj,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    // showTime={{format: 'HH:mm:ss'}}
                                    // format="YYYY-MM-DD HH:mm:ss"
                                    getCalendarContainer={() => document.getElementById('videoListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="音视频来源" {...formItemLayout}>
                            {getFieldDecorator('ysply', {
                                initialValue: this.state.ysply,
                            })(
                                <Select placeholder="请选择音视频来源" style={{width: '100%'}}
                                        mode="multiple"
                                        getPopupContainer={() => document.getElementById('videoListForm')}>
                                    <Option  value='2'>办案区</Option>
                                    <Option value='1'>执法记录仪</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                  <Col {...colLayout}>
                    <FormItem label="文件名称" {...formItemLayout}>
                      {getFieldDecorator('wjmc', {
                      })(
                        <Input placeholder="请输入文件名称"/>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="是否关联" {...formItemLayout}>
                      {getFieldDecorator('sfgl', {
                        initialValue: this.state.sfgl,
                      })(
                        <Radio.Group>
                          <Radio value=''>全部</Radio>
                          <Radio value='1'>已关联</Radio>
                          <Radio value='0'>未关联</Radio>
                        </Radio.Group>,
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="文件类型" {...formItemLayout}>
                      {getFieldDecorator('wjlx', {
                        initialValue: this.state.wjlx,
                      })(
                          <Select placeholder="请选择文件类型" style={{width: '100%'}}
                                  mode="multiple"
                                  getPopupContainer={() => document.getElementById('videoListForm')}>
                              <Option  value='2'>视频</Option>
                              <Option value='1'>音频</Option>
                          </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className={styles.search}>
            <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
              <Button
                  style={{marginLeft: 8}}
                  type="primary"
                  htmlType="submit"
              >
                查询
              </Button>
              <Button
                  style={{marginLeft: 8}}
                  onClick={this.handleFormReset}
                  className={styles.empty}
              >
                重置
              </Button>
              <Button
                  style={{marginLeft: 8}}
                  onClick={this.getSearchHeight}
                  className={styles.empty}
              >
                {this.state.searchHeight ? '收起筛选' : '展开筛选'}{' '}
                  <Icon type={this.state.searchHeight ? 'up' : 'down'}/>
              </Button>
            </span>
                </Row>
            </Form>
        );
    }


    // newArray() {
    //
    // }
    renderTable() {
        const {policeData: {police}} = this.props;
        // console.log('policeData', this.props.policeData);
        return (
            <div>
                <RenderTable
                    // loading={loading}
                    data={this.state.dataList}
                    onChange={this.handleTableChange}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getList={(params) => this.getList(params)}
                    location={this.state.loading}
                    formValues={this.state.formValues}
                />
            </div>
        );
    }

    render() {
        const {policeData: {police, loading}, common: {depTree}} = this.props;
        const {arrayDetail} = this.state;
        const {showDataView, typeButtons, selectedDeptVal, selectedDateVal, jjdw, cjdw, treeDefaultExpandedKeys} = this.state;
        let className = this.props.global && this.props.global.dark ? styles.listPageWrap : styles.listPageWrap + ' ' + styles.lightBox;
        return (
            <div className={this.props.location.query && this.props.location.query.id ? styles.onlyDetail : ''}>

                <div className={className}>
                    <div className={styles.listPageHeader}>
                        {
                            showDataView ? (
                                <a className={styles.listPageHeaderCurrent}><span>●</span>数据统计</a>
                            ) : (
                                <a className={styles.UnlistPageHeaderCurrent}
                                   onClick={this.changeListPageHeader}>数据统计</a>
                            )
                        }
                        <span className={styles.borderCenter}>|</span>
                        {
                            showDataView ? (
                                <a className={styles.UnlistPageHeaderCurrent}
                                   onClick={this.changeListPageHeader}>数据列表</a>
                            ) : (
                                <a className={styles.listPageHeaderCurrent}><span>●</span>数据列表</a>
                            )
                        }
                        {
                            showDataView ?
                                '' :
                                <div style={{float: 'right'}}>
                                    <Button className={styles.downloadBtn} icon="download"
                                            onClick={this.exportData}>导出表格</Button>
                                </div>
                        }

                        <DataViewButtonArea
                            showDataView={showDataView}
                            styles={styles}
                            typeButtons={typeButtons}
                            changeTypeButtons={this.changeTypeButtons}
                            disabledDate={this.disabledDate}
                            depTree={depTree}
                            renderloop={this.renderloop}
                            setSelectedDate={this.setSelectedDate}
                            setSelectedDep={this.setSelectedDep}
                            setJjdw={this.setJjdw}
                            setCjdw={this.setCjdw}
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <DataView
                        showDataView={showDataView}
                        searchType={typeButtons}
                        changeToListPage={this.changeToListPage}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id='videoListForm'>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            {this.renderTable()}
                        </div>
                    </div>
                </div>
                <SyncTime dataLatestTime={police.tbCount ? police.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}
