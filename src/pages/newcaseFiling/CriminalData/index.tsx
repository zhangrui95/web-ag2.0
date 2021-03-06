/*
 * CaseRealData/index.js 受立案刑事案件数据
 * author：jhm
 * 20180605
 * */

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Select, TreeSelect, Input, Button, DatePicker, Tabs, message, Cascader, Icon} from 'antd';
import moment from 'moment/moment';
import styles from '../../common/listPage.less';
import RenderTable from '../../../components/NewCaseRealData/RenderTable';
import CaseDataView from '../../../components/NewCaseRealData/CaseEnforcementDataViewAll';
// import SeniorSearchModal from '../../components/NewCaseRealData/SeniorSearchModal';
import DataViewButtonArea from '../../../components/Common/DataViewButtonArea';
import {exportListDataMaxDays, getQueryString, getUserInfos, tableList} from '../../../utils/utils';
import SyncTime from '../../../components/Common/SyncTime';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const TreeNode = TreeSelect.TreeNode;

let timeout;
let currentValue;

@connect(({common, CaseData, loading, global}) => ({
    CaseData, loading, common, global
    // loading: loading.models.alarmManagement,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        showDataView: true, // 控制显示图表或者列表（true显示图表）
        ajzt: '',
        bardw: '',
        formValues: {
            is_area: window.configUrl.is_area === '2' ? '0' : window.configUrl.is_area,
        },
        activeKey: '0',
        arrayDetail: [],
        allPolice: [],
        zxlb: '',
        caseAllType: [], // 案件类别
        caseTypeTree: [], // 案件类别树
        typeButtons: 'week', // 图表展示类别（week,month）
        current: '',
        selectedDateVal: null, // 手动选择的日期
        selectedDeptVal: getUserInfos().department, // 手动选择机构
        is_tz: '0',
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        seniorSearchModalVisible: false, // 高级查询框
        statusDate: '102', // 初始状态下，查询项默认为立案日期（code = 102），
        linkToAjzt: '',
        isY: '0', // 判断是高级查询还是普通查询，0是普通查询，1是高级查询
        larq: null,
        searchHeight: false, // 查询条件展开筛选
    };

    componentDidMount() {
        if (this.props.location.query && this.props.location.query.id) {
            this.setState({
                showDataView: false,
            });
        }
       this.getAllList(this.props);
        const jigouArea = sessionStorage.getItem('user');
        const newjigouArea = JSON.parse(jigouArea);
        this.getSpecialCaseType();
        this.getDepTree(newjigouArea.department);
        this.getCaseStatus();
        this.getCaseTypeTree(window.configUrl.is_area);
        this.getEnforcementDictType();
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/newcaseFiling/caseData/CriminalData') {
          if (nextProps.global.isResetList.state){
              this.getAllList(nextProps.global.isResetList.state);
          }else{
              const params = {
                  currentPage: 1,
                  showCount: tableList,
                  pd: {
                      ...this.state.formValues,
                  },
              };
              this.getCase(params);
          }
      }
    }
    getAllList = (props) => {
        if (props.location.state && props.location.state.code && props.location.state.kssj && props.location.state.jssj) {
            this.setState({
                showDataView: false,
                bardw: props.location.state.code,
                larq: [moment(props.location.state.kssj), moment(props.location.state.jssj)],
                searchHeight:true,
            });
            const formValues = {
                bardw: props.location.state.code,
                larq_ks: props.location.state.kssj,
                larq_js: props.location.state.jssj,
                is_tz: '1',
            };
            this.setState({
                formValues,
                is_tz: '1',
            });
            const params = {
                currentPage: 1,
                showCount: tableList,
                pd: {
                    ...formValues,
                },
            };
            this.getCase(params);
        } else {
            this.handleFormReset();
            const org = getQueryString(props.location.search, 'org') || '';
            const larq_ks = getQueryString(props.location.search, 'startTime') || '';
            const larq_js = getQueryString(props.location.search, 'endTime') || '';
            if ((larq_ks !== '') && (larq_js !== '')) {
                props.form.setFieldsValue({
                    larq: [moment(larq_ks, 'YYYY-MM-DD'), moment(larq_js, 'YYYY-MM-DD')],
                });
            }
            const obj = {
                pd: {
                    org,
                    larq_ks,
                    larq_js,
                    ssmk: '',
                },
                currentPage: 1,
                showCount: tableList,
            };
            this.getCase(obj);
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

    getCase(param) {
        this.props.dispatch({
            type: 'CaseData/caseFetch',
            payload: param ? param : '',
        });
    }

    // 获取人员强制措施字典
    getEnforcementDictType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '501028',
            },
        });
    };
    // 获取专项类别字典
    getSpecialCaseType = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '11580',
            },
        });
    };
    // 获取案件状态字典
    getCaseStatus = () => {
        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: '500719',
            },
        });
    };
    // 获取案件类别树
    getCaseTypeTree = (areaNum) => {
        this.props.dispatch({
            type: areaNum === '2' ? 'common/getPlCaseTypeTree' : 'common/getCaseTypeTree',
            payload: {
                ajlb: 'xs', // 案件类别xs,xz
                is_area: areaNum === '1' ? areaNum : '0',
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
    // 获取所有警员
    getAllPolice = (name) => {
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
                    name,
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

    // 关闭页面链接的函数
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
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
        this.setState({
            current: pagination.current,
        });
        this.getCase(params);
    };
    // 查询
    handleSearch = (e) => {
        if (e) e.preventDefault();
        const values = this.props.form.getFieldsValue();
        const larqTime = values.larq;
        const tbsjTime = values.tbsj;
        const ysqsTime = values.ysqssj;
        const qzcslx = [];
        values.qzcslx && values.qzcslx.map((item) => {
            qzcslx.push("'" + item + "'");
        });
        // console.log('values', values);
        const formValues = {
            ajbh: values.ajbh ? values.ajbh.trim() : '',
            ajmc: values.ajmc ? values.ajmc.trim() : '',
            bardw: values.bardw || '',
            barxm: values.bar || '',
            ajzt: values.ajzt || '',
            zxlb: values.zxlb || '',
            ajlb: values.ajlb ? values.ajlb[values.ajlb.length - 1] : '',
            ajlb_dl: values.ajlb ? values.ajlb[0] : '',
            ssmk: '',
            is_tz: this.state.is_tz,
            qzcslx: qzcslx.toString() || '',
            is_area: window.configUrl.is_area === '2' ? '0' : window.configUrl.is_area,
            isY: '0', // 判断是高级查询还是普通查询，0是普通查询，1是高级查询
            sarq_ks: values.slrq && values.slrq.length > 0 ? values.slrq[0].format('YYYY-MM-DD') : '',
            sarq_js: values.slrq && values.slrq.length > 0 ? values.slrq[1].format('YYYY-MM-DD') : '',
            larq_ks: values.larq && values.larq.length > 0 ? values.larq[0].format('YYYY-MM-DD') : '',
            larq_js: values.larq && values.larq.length > 0 ? values.larq[1].format('YYYY-MM-DD') : '',
            parq_ks: values.parq && values.parq.length > 0 ? values.parq[0].format('YYYY-MM-DD') : '',
            parq_js: values.parq && values.parq.length > 0 ? values.parq[1].format('YYYY-MM-DD') : '',
            xarq_ks: values.xarq && values.xarq.length > 0 ? values.xarq[0].format('YYYY-MM-DD') : '',
            xarq_js: values.xarq && values.xarq.length > 0 ? values.xarq[1].format('YYYY-MM-DD') : '',
            jarq_ks: values.jarq && values.jarq.length > 0 ? values.jarq[0].format('YYYY-MM-DD') : '',
            jarq_js: values.jarq && values.jarq.length > 0 ? values.jarq[1].format('YYYY-MM-DD') : '',
            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            qsrq_ks: ysqsTime && ysqsTime.length > 0 ? ysqsTime[0].format('YYYY-MM-DD') : '',
            qsrq_js: ysqsTime && ysqsTime.length > 0 ? ysqsTime[1].format('YYYY-MM-DD') : '',
        };
        this.setState({
            formValues,
            isY: '0',
        });
        const params = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                ...formValues,
            },
        };
        this.getCase(params);
    };
    // 重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {
                ssmk: '',
                is_area: window.configUrl.is_area === '2' ? '0' : window.configUrl.is_area,
            },
            bardw: null,
            larq: null,
            linkToAjzt: null,
            isY: '0',
            statusDate:'102',
        });
        const obj = {
            pd: {
                ssmk: '',
            },
            currentPage: 1,
            showCount: tableList,
        };
        this.getCase(obj);
    };
    // 导出
    exportData = () => {
        // const values = this.props.form.getFieldsValue();
        const {formValues} = this.state;
        // const sarqTime = formValues.slrq;
        // const larqTime = formValues.larq;
        // const parqTime = formValues.parq;
        // const xarqTime = formValues.xarq;
        // const jarqTime = formValues.jarq;
        const tbsjTime = formValues.tbsj;
        const ysqsTime = formValues.ysqssj;
        const qzcslx = [];
        formValues.qzcslx && formValues.qzcslx.map((item) => {
            qzcslx.push("'" + item + "'");
        });
        // const ajztd = [];
        // formValues.ajzt&&formValues.ajzt.map((item)=>{
        //   ajzt.push("'" + item + "'");
        // });
        const newformValues = {
            ajbh:formValues.ajbh ? formValues.ajbh.trim() : '',
            ajmc: formValues.ajmc ?  formValues.ajmc.trim() : '',
            bardw: formValues.bardw || '',
            barxm: formValues.bar || '',
            ajzt: formValues.ajzt || '',
            zxlb: formValues.zxlb || '',
            ajlb: formValues.ajlb ? formValues.ajlb[formValues.ajlb.length - 1] : '',
            ajlb_dl: formValues.ajlb ? formValues.ajlb[0] : '',
            ssmk: '',
            qzcslx: qzcslx.toString() || '',
            is_tz: this.state.is_tz,
            is_area: window.configUrl.is_area === '2' ? '0' : window.configUrl.is_area,
            isY: this.state.isY, // 判断是高级查询还是普通查询，0是普通查询，1是高级查询
            sarq_ks: formValues.sarq_ks,
            sarq_js: formValues.sarq_js,
            larq_ks: formValues.larq_ks,
            larq_js: formValues.larq_js,
            parq_ks: formValues.parq_ks,
            parq_js: formValues.parq_js,
            xarq_ks: formValues.xarq_ks,
            xarq_js: formValues.xarq_js,
            jarq_ks: formValues.jarq_ks,
            jarq_js: formValues.jarq_js,

            tbsj_ks: tbsjTime && tbsjTime.length > 0 ? tbsjTime[0].format('YYYY-MM-DD') : '',
            tbsj_js: tbsjTime && tbsjTime.length > 0 ? tbsjTime[1].format('YYYY-MM-DD') : '',
            qsrq_ks: formValues && formValues.qsrq_ks ? formValues.qsrq_ks : '',
            qsrq_js: formValues && formValues.qsrq_js ? formValues.qsrq_js : '',
        };
        if ((newformValues.jarq_ks && newformValues.jarq_js) || (newformValues.xarq_ks && newformValues.xarq_js) || (newformValues.parq_ks && newformValues.parq_js) || (newformValues.sarq_ks && newformValues.sarq_js) || (newformValues.qsrq_ks && newformValues.qsrq_js) || (newformValues.larq_ks && newformValues.larq_js)) {
            const saisAfterDate = newformValues.sarq_js && newformValues.sarq_ks ? moment(newformValues.sarq_js).isAfter(moment(newformValues.sarq_ks).add(exportListDataMaxDays, 'days')) : true;
            const laisAfterDate = newformValues.larq_js && newformValues.larq_ks ? moment(newformValues.larq_js).isAfter(moment(newformValues.larq_ks).add(exportListDataMaxDays, 'days')) : true;
            const paisAfterDate = newformValues.parq_js && newformValues.parq_ks ? moment(newformValues.parq_js).isAfter(moment(newformValues.parq_ks).add(exportListDataMaxDays, 'days')) : true;
            const xaisAfterDate = newformValues.xarq_js && newformValues.xarq_ks ? moment(newformValues.xarq_js).isAfter(moment(newformValues.xarq_ks).add(exportListDataMaxDays, 'days')) : true;
            const jaisAfterDate = newformValues.jarq_js && newformValues.jarq_ks ? moment(newformValues.jarq_js).isAfter(moment(newformValues.jarq_ks).add(exportListDataMaxDays, 'days')) : true;
            const isAfterDate2 = newformValues.qsrq_js && newformValues.qsrq_ks ? moment(newformValues.qsrq_js).isAfter(moment(newformValues.qsrq_ks).add(exportListDataMaxDays, 'days')) : true;
            // console.log('laisAfterDate',laisAfterDate);
            // console.log('isAfterDate2',isAfterDate2);
            if (saisAfterDate && laisAfterDate && paisAfterDate && xaisAfterDate && jaisAfterDate&& isAfterDate2) { // 选择时间间隔应小于exportListDataMaxDays
                message.warning(`日期间隔需小于${exportListDataMaxDays}天`);
            }
            else {
                this.props.dispatch({
                    type: 'common/exportData',
                    payload: {
                        tableType: '2',
                        lbqf: '受立案-案件数据-刑事案件数据',
                        ...newformValues,
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
    // 渲染机构树
    renderloop = data => data.map((item) => {
        if (item.childrenList && item.childrenList.length) {
            return <TreeNode value={item.code} key={item.code}
                             title={item.name}>{this.renderloop(item.childrenList)}</TreeNode>;
        }
        return <TreeNode key={item.code} value={item.code} title={item.name}/>;
    });
    handleAllPoliceOptionChange = (value) => {
        this.getAllPolice(value);
    };
    // 级联加载数据
    cascaderLoadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.props.dispatch({
            type: 'common/getDictType',
            payload: {
                appCode: window.configUrl.appCode,
                code: (targetOption.id).toString(),
            },
            callback: (data) => {
                targetOption.loading = false;
                if (data.length > 0) {
                    targetOption.children = [];
                    for (let i = 0; i < data.length; i++) {
                        const obj = {
                            label: data[i].name,
                            value: data[i].code,
                            id: data[i].id,
                            isLeaf: selectedOptions.length > 1,
                        };
                        targetOption.children.push(obj);
                    }
                    this.setState({
                        caseAllType: [...this.state.caseAllType],
                    });
                }
            },
        });
    };
    // 级联选择完成后的回调
    cascaderOnChange = (value, selectedOptions) => {
        this.props.form.setFieldsValue({
            zxlb: '',
        });
    };
    // 专项类别选择回调
    specialCaseOnChange = (value) => {
        this.props.form.setFieldsValue({
            ajlb: null,
        });
    };
    // 改变显示图表或列表
    changeListPageHeader = () => {
        const {showDataView} = this.state;
        this.setState({
            showDataView: !showDataView,
            // typeButtons: 'week',
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
        this.setState({
            selectedDeptVal: val,
        });
    };
    // 改变图表类别
    changeTypeButtons = (val) => {
        this.setState({
            typeButtons: val,
        });
    };
    // 图表点击跳转到列表页面
    changeToListPage = (name, dateArry) => {
        this.props.form.resetFields();
        this.setState({
            showDataView: false,
            linkToAjzt: name && name.ajzt ? name.ajzt : null,
            statusDate: '102',
            searchHeight:true,
        });
        let dataShow = {};
        if (name.ajzt && name.ajzt === '101') {
            dataShow = {
                slrq: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')]
            }
        } else if ((name.ajzt && name.ajzt === '102') || (name.ajlb)) {
            dataShow = {
                larq: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')]
            }
        } else if (name.ajzt && name.ajzt === '104') {
            dataShow = {
                parq: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')]
            }
        } else if (name.ajzt && name.ajzt === '105') {
            dataShow = {
                xarq: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')]
            }
        } else if (name.ajzt && name.ajzt === '107') {
            dataShow = {
                jarq: [moment(dateArry[0], 'YYYY-MM-DD'), moment(dateArry[1], 'YYYY-MM-DD')]
            }
        }
        this.props.form.setFieldsValue({
            ...dataShow,
            bardw: this.state.selectedDeptVal || null,
            ...name,
        });
        this.handleSearch();
    };
    // 修改案件状态改变查询的日期名称
    chooseStatus = (item) => {
        this.setState({
            statusDate: item,
        })
    }
    // 高级查询
    seniorSearch = () => {
        this.setState({
            seniorSearchModalVisible: true,
        })
    }
    SeniorSearchCancel = () => {
        this.setState({
            seniorSearchModalVisible: false,
        })
    }
    SearchSuccess = (value) => {
        this.props.form.resetFields();
        const ajzt = [];
        value.ajzt && value.ajzt.map((item) => {
            ajzt.push("'" + item + "'");
        });
        const formValues = {
            is_area: window.configUrl.is_area === '2' ? '0' : window.configUrl.is_area,
            is_tz: this.state.is_tz,
            isY: '1',// 判断是高级查询还是普通查询，0是普通查询，1是高级查询
            ajzt: ajzt.toString() || '',
            ladw: value.ladw || '',
            sadw: value.sadw || '',
            padw: value.padw || '',
            xadw: value.xadw || '',
            jadw_dm: value.jadw || '',
            sarq_ks: value.slrq && value.slrq.length > 0 ? value.slrq[0].format('YYYY-MM-DD') : '',
            sarq_js: value.slrq && value.slrq.length > 0 ? value.slrq[1].format('YYYY-MM-DD') : '',
            larq_ks: value.larq && value.larq.length > 0 ? value.larq[0].format('YYYY-MM-DD') : '',
            larq_js: value.larq && value.larq.length > 0 ? value.larq[1].format('YYYY-MM-DD') : '',
            parq_ks: value.parq && value.parq.length > 0 ? value.parq[0].format('YYYY-MM-DD') : '',
            parq_js: value.parq && value.parq.length > 0 ? value.parq[1].format('YYYY-MM-DD') : '',
            xarq_ks: value.xarq && value.xarq.length > 0 ? value.xarq[0].format('YYYY-MM-DD') : '',
            xarq_js: value.xarq && value.xarq.length > 0 ? value.xarq[1].format('YYYY-MM-DD') : '',
            jarq_ks: value.jarq && value.jarq.length > 0 ? value.jarq[0].format('YYYY-MM-DD') : '',
            jarq_js: value.jarq && value.jarq.length > 0 ? value.jarq[1].format('YYYY-MM-DD') : '',
        };
        this.setState({
            formValues,
            seniorSearchModalVisible: false,
            isY: '1',
        });
        const params = {
            currentPage: 1,
            showCount: tableList,
            pd: {
                ...formValues,
            },
        };
        this.getCase(params);
    }
    // 展开筛选和关闭筛选
    getSearchHeight = () => {
        this.setState({
            searchHeight: !this.state.searchHeight,
        });
    };

    renderForm() {
        const {form: {getFieldDecorator}, common: {depTree, specialCaseType, CaseStatusType, enforcementTypeDict}} = this.props;
        const allPoliceOptions = this.state.allPolice.map(d => <Option key={`${d.idcard},${d.pcard}`}
                                                                       value={`${d.idcard},${d.pcard}$$`}
                                                                       title={d.name}>{`${d.name} ${d.pcard}`}</Option>);
        const formItemLayout = {
            labelCol: {xs: {span: 24}, md: {span: 8}, xl: {span: 6}, xxl: {span: 6}},
            wrapperCol: {xs: {span: 24}, md: {span: 16}, xl: {span: 18}, xxl: {span: 18}},
        };
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        const colLayout = {sm: 24, md: 12, xl: 8};
        const {statusDate} = this.state;
        let specialCaseTypeOptions = [];
        if (specialCaseType.length > 0) {
            for (let i = 0; i < specialCaseType.length; i++) {
                const item = specialCaseType[i];
                specialCaseTypeOptions.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let CaseStatusOption = [];
        if (CaseStatusType.length > 0) {
            for (let i = 0; i < CaseStatusType.length; i++) {
                const item = CaseStatusType[i];
                CaseStatusOption.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        let enforcementTypeDictGroup = [];
        if (enforcementTypeDict.length > 0) {
            for (let i = 0; i < enforcementTypeDict.length; i++) {
                const item = enforcementTypeDict[i];
                enforcementTypeDictGroup.push(
                    <Option key={item.id} value={item.code}>{item.name}</Option>,
                );
            }
        }
        return (
            <Form onSubmit={this.handleSearch} style={{height: this.state.searchHeight ? 'auto' : '50px'}}>
                <Row gutter={rowLayout} className={styles.searchForm}>
                    <Col {...colLayout}>
                        <FormItem label="案件编号" {...formItemLayout}>
                            {getFieldDecorator('ajbh', {
                                // initialValue: this.state.caseType,
                                // rules: [
                                //     {pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的案件编号！'},
                                //     {max: 32, message: '最多输入32个字！'},
                                // ],
                            })(
                                <Input placeholder="请输入案件编号"/>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="案件名称" {...formItemLayout}>
                            {getFieldDecorator('ajmc', {
                                // initialValue: this.state.caseType,
                                // rules: [{max: 128, message: '最多输入128个字！'}],
                            })(
                                <Input placeholder="请输入案件名称"/>,
                            )}
                        </FormItem>
                    </Col>
                    {
                        (!this.state.linkToAjzt || this.state.linkToAjzt === '102') && (!statusDate || statusDate === '102') ?
                            <Col {...colLayout}>
                                <FormItem label={'立案日期'} {...formItemLayout}>
                                    {getFieldDecorator('larq', {
                                        initialValue: this.state.larq ? this.state.larq : undefined,
                                    })(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('newslatableListForm')}
                                        />,
                                    )}
                                </FormItem>
                            </Col> : ''
                    }
                    {
                        (this.state.linkToAjzt && this.state.linkToAjzt === '101') || (statusDate === '101' || statusDate === '103' || statusDate === '106') ?
                            <Col {...colLayout}>
                                <FormItem label={'受理日期'} {...formItemLayout}>
                                    {getFieldDecorator('slrq')(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('newslatableListForm')}
                                        />,
                                    )}
                                </FormItem>
                            </Col> : ''
                    }
                    {
                        (this.state.linkToAjzt && this.state.linkToAjzt === '104') || (statusDate === '104') ?
                            <Col {...colLayout}>
                                <FormItem label={'破案日期'} {...formItemLayout}>
                                    {getFieldDecorator('parq')(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('newslatableListForm')}
                                        />,
                                    )}
                                </FormItem>
                            </Col> : ''
                    }
                    {
                        (this.state.linkToAjzt && this.state.linkToAjzt === '105') || (statusDate === '105') ?
                            <Col {...colLayout}>
                                <FormItem label={'撤案日期'} {...formItemLayout}>
                                    {getFieldDecorator('xarq')(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('newslatableListForm')}
                                        />,
                                    )}
                                </FormItem>
                            </Col> : ''
                    }
                    {
                        (this.state.linkToAjzt && this.state.linkToAjzt === '107') || (statusDate === '107' || statusDate === '108' || statusDate === '109') ?
                            <Col {...colLayout}>
                                <FormItem label={'结案日期'} {...formItemLayout}>
                                    {getFieldDecorator('jarq')(
                                        <RangePicker
                                            disabledDate={this.disabledDate}
                                            style={{width: '100%'}}
                                            getCalendarContainer={() => document.getElementById('newslatableListForm')}
                                        />,
                                    )}
                                </FormItem>
                            </Col> : ''
                    }
                    <Col {...colLayout}>
                        <FormItem label="办案单位" {...formItemLayout}>
                            {getFieldDecorator('bardw', {
                                initialValue: this.state.bardw ? this.state.bardw : undefined,
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    placeholder="请输入办案单位"
                                    allowClear
                                    key='badwSelect'
                                    treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                                    treeNodeFilterProp="title"
                                    getPopupContainer={() => document.getElementById('newslatableListForm')}
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
                                <Select placeholder="请选择案件状态" style={{width: '100%'}} onChange={this.chooseStatus}
                                        getPopupContainer={() => document.getElementById('newslatableListForm')}>
                                    <Option value="">全部</Option>
                                    {CaseStatusOption}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="&nbsp;&nbsp;&nbsp; 办案人" {...formItemLayout}>
                            {getFieldDecorator('bar', {
                                // initialValue: this.state.gzry,
                                //rules: [{max: 32, message: '最多输入32个字！'}],
                            })(
                                <Select
                                    mode="combobox"
                                    defaultActiveFirstOption={false}
                                    optionLabelProp='title'
                                    showArrow={false}
                                    filterOption={false}
                                    placeholder="请输入办案人"
                                    onChange={this.handleAllPoliceOptionChange}
                                    onFocus={this.handleAllPoliceOptionChange}
                                    getPopupContainer={() => document.getElementById('newslatableListForm')}
                                >
                                    {allPoliceOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="案件类别" {...formItemLayout}>
                            {getFieldDecorator('ajlb', {})(
                                <Cascader
                                    options={this.state.caseTypeTree}
                                    placeholder="请选择案件类别"
                                    changeOnSelect={true}
                                    getPopupContainer={() => document.getElementById('newslatableListForm')}
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
                        <FormItem label="专项类别" {...formItemLayout}>
                            {getFieldDecorator('zxlb', {
                                initialValue: this.state.zxlb,
                            })(
                                <Select placeholder="请选择专项类别" style={{width: '100%'}}
                                        onChange={this.specialCaseOnChange}
                                        getPopupContainer={() => document.getElementById('newslatableListForm')}>
                                    <Option value="">全部</Option>
                                    {specialCaseTypeOptions}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col {...colLayout}>
                        <FormItem label="移送起诉时间" {...formItemLayout}>
                            {getFieldDecorator('ysqssj', {
                                // initialValue: this.state.larq ? this.state.larq : undefined,
                            })(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    style={{width: '100%'}}
                                    getCalendarContainer={() => document.getElementById('newslatableListForm')}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    {window.configUrl.is_area === '1' ?
                        <Col {...colLayout}>
                            <FormItem label="强制措施" {...formItemLayout}>
                                {getFieldDecorator('qzcslx', {})(
                                    <Select placeholder="请选择强制措施" style={{width: '100%'}} mode={'multiple'}
                                            getPopupContainer={() => document.getElementById('newslatableListForm')}>
                                        <Option value="">全部</Option>
                                        {enforcementTypeDictGroup}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        :
                        <Col {...colLayout} />
                    }
                </Row>
                <Row className={styles.search}>
          <span style={{float: 'right', marginBottom: 24, marginTop: 5}}>
            <Button style={{borderColor: '#2095FF'}} htmlType="submit">
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

    renderTable() {
        const {CaseData: {returnData, loading}} = this.props;
        return (
            <div>
                <RenderTable
                    loading={loading}
                    data={returnData}
                    onChange={this.handleTableChange}
                    current={this.state.current}
                    dispatch={this.props.dispatch}
                    newDetail={this.newDetail}
                    getCase={(param) => this.getCase(param)}
                    location={this.props.location}
                    formValues={this.state.formValues}
                    isEnforcement={true}
                    from='执法办案'
                />
            </div>
        );
    }

    render() {
        const newAddDetail = this.state.arrayDetail;
        const {CaseData: {returnData, loading}, common: {depTree, CaseStatusType}} = this.props;
        const {showDataView, typeButtons, selectedDeptVal, selectedDateVal, treeDefaultExpandedKeys, seniorSearchModalVisible} = this.state;
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
                        {showDataView ? (
                            ''
                        ) : (
                            <div style={{float: 'right'}}>
                                <Button
                                    className={styles.downloadBtn}
                                    onClick={this.exportData}
                                    icon="download"
                                >
                                    导出表格
                                </Button>
                            </div>
                        )}
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
                            hideDayButton
                            treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                            {...this.props}
                        />
                    </div>
                    <CaseDataView
                        searchType={typeButtons}
                        showDataView={showDataView}
                        orgcode={selectedDeptVal}
                        selectedDateVal={selectedDateVal}
                        changeToListPage={this.changeToListPage}
                        {...this.props}
                    />
                    <div style={showDataView ? {display: 'none'} : {display: 'block'}}>
                        <div className={styles.tableListForm} id="newslatableListForm">
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            {this.renderTable()}
                        </div>
                    </div>
                </div>
                <SyncTime dataLatestTime={returnData.tbCount ? returnData.tbCount.tbsj : ''} {...this.props} />
            </div>
        );
    }
}

