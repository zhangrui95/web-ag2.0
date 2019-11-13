/*
 * 监管配置
 * author：zr
 * 20190313
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import stylescommon from '../../common/common.less';
import styles from './index.less';
import {
  Card,
  Divider,
  Table,
  Button,
  Row,
  Col,
  Select,
  Radio,
  Form,
  DatePicker,
  Modal,
  Menu,
  Dropdown,
  TreeSelect,
  message,
  Checkbox,
  Tag,
} from 'antd';
import moment from 'moment';
import { getUserInfos } from '../../../utils/utils';
import SuperviseCopy from '../../../components/Supervise/SuperviseCopy';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

class SuperviseSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      current: 1,
      count: 10,
      jg: '',
      jgsx: '',
      jgd: '',
      jgfs: '',
      jgdzt: '',
      jgqx: '',
      addjgqx: '',
      visible: false,
      Fyvisible: false,
      data: null,
      detailBtn: false,
      updateBtn: false,
      fyxzjg: '',
      personList: [],
      yyjgdList: [],
      qjjg: false,
      treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
    };
  }

  componentDidMount() {
    this.getJgdList();
    // this.getCommon('500830');//监管事项
    this.getCommon('500800'); //监管点
    this.getCommon('500804'); //时间间隔
    this.getCommon('500820'); //提前时间
    this.getCommon('500808'); //一级颜色
    this.getCommon('500812'); //二级颜色
    this.getCommon('500816'); //三级颜色
    this.getCommon('500852'); //提醒人员
    this.getDepTree(JSON.parse(sessionStorage.getItem('user')).department);
  }

  //监管点列表展示
  getJgdList = (pd, current) => {
    this.setState({
      loading: true,
    });
    this.props.dispatch({
      type: 'SuperviseSetup/getJgList',
      payload: {
        currentPage: current ? current : this.state.current,
        showCount: this.state.count,
        pd: pd ? pd : {},
      },
      callback: res => {
        this.setState({
          data: res,
          loading: false,
        });
      },
    });
  };
  getCommon = pid => {
    this.props.dispatch({
      type: 'common/getDictType',
      payload: {
        currentPage: 1,
        pd: {
          pid: pid,
        },
        showCount: 999,
      },
    });
  };
  getSupervise = pid => {
    if (pid) {
      this.props.dispatch({
        type: 'SuperviseSetup/getDictType',
        payload: {
          currentPage: 1,
          pd: {
            pid: pid,
          },
          showCount: 999,
        },
      });
    }
  };

  // 表格分页
  handleTableChange = pagination => {
    this.setState({
      current: pagination.current,
      count: pagination.pageSize,
    });
    this.getJgdList(this.state.pd, pagination.current);
  };
  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      let pd = {
        jgd_dm: values.jgd && values.jgd.key ? values.jgd.key : '',
        jgdzt_dm: values.jgdzt ? values.jgdzt : '',
        jgqx_js: values.jgqx[1] ? moment(values.jgqx[1]).format('YYYY-MM-DD') : '',
        jgqx_ks: values.jgqx[0] ? moment(values.jgqx[0]).format('YYYY-MM-DD') : '',
        jgsx_dm: values.jgsx && values.jgsx.key ? values.jgsx.key : '',
        ssjg_dm: values.jg ? JSON.parse(values.jg).id : '',
        jglx: values.jglx ? values.jglx : '',
      };
      this.setState({
        pd: pd,
      });
      this.getJgdList(pd, 1);
    });
  };
  handleFormReset = () => {
    this.setState({
      pd: {},
    });
    this.props.form.resetFields();
    this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
    this.props.SuperviseSetup.common.JgsxType = [];
    this.handleSearch();
  };
  getChoisePerson = (resSfz, resName) => {
    let person = [];
    if (resSfz && resSfz.length > 0) {
      resSfz.split(',').map((event, idx) => {
        person.push({ key: event, label: resName.split(',')[idx] });
      });
    }
    return person;
  };
  addList = (type, res) => {
    this.props.form.resetFields([
      'addjgxz',
      'addjglx',
      'addjgsx',
      'addjgd',
      'addjgqx',
      'addtxjg',
      'dyctxry1',
      'dyctxry2',
      'dyctxry3',
      'dyjtxry1',
      'dyjtxry2',
      'dyjtxry3',
      'tqsj1',
      'tqsj2',
      'tqsj3',
    ]);
    this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
    if (type === 0) {
      this.getCommon('500830'); //告警监管事项
      this.getClear();
      this.setState({
        qjjg: false,
        addjglx: '0',
        madalTitle: '监管点添加',
        jgdDm: null,
        jgdMc: null,
        ssjgMc: null,
        ssjgDm: null,
        id: null,
        tqsj1: null,
        tqsj2: null,
        tqsj3: null,
      });
    } else if (type === 1 || type === 2) {
      if (res.jglx === '0') {
        this.getCommon('500830'); //告警监管事项
      } else {
        this.getCommon('500772'); //预警监管事项
      }
      this.getSupervise(
        res.jgsx_dm === '5008301'
          ? '2068'
          : res.jgsx_dm === '5008302'
          ? '2016'
          : res.jgsx_dm === '5008303'
          ? '3'
          : res.jgsx_dm === '5008304'
          ? '2017'
          : res.jgsx_dm === '5008305'
          ? '6001'
          : res.jgsx_dm === '5008306'
          ? '5007725'
          : res.jgsx_dm,
      );
      this.setState({
        madalTitle: type === 2 ? '监管点修改' : '监管点详情',
        res: res,
        qjjg: res.sf_qjjg === '1' ? true : false,
        jgdDm: res.jgd_dm,
        jgdMc: res.jgd_mc,
        ssjgMc: res.ssjg_mc,
        ssjgDm: res.ssjg_dm,
        addjglx: res.jglx,
        id: res.id,
        xsys1: res.yjyjtx_ysdm,
        xsys2: res.ejyjtx_ysdm,
        xsys3: res.sjyjtx_ysdm,
        dyjtxry1: this.getChoisePerson(res.yjyjtxr_sfzh, res.yjyjtxr_xm),
        dyjtxry2: this.getChoisePerson(res.ejyjtxr_sfzh, res.ejyjtxr_xm),
        dyjtxry3: this.getChoisePerson(res.sjyjtxr_sfzh, res.sjyjtxr_xm),
        dyctxry1: this.getChoisePerson(res.yjyjtxr_sfzh, res.yjyjtxr_xm),
        dyctxry2: this.getChoisePerson(res.ejyjtxr_sfzh, res.ejyjtxr_xm),
        dyctxry3: this.getChoisePerson(res.sjyjtxr_sfzh, res.sjyjtxr_xm),
        tqsj1: res.yjyjtx_sj,
        tqsj2: res.ejyjtx_sj,
        tqsj3: res.sjyjtx_sj,
        sf_qy: res.sf_qy,
      });
    }
    this.setState({
      visible: true,
      modleType: type,
    });
  };
  handleCancel = () => {
    this.props.form.validateFields((err, values) => {
      if (values.jglx && values.jglx === '0') {
        this.getCommon('500830'); //告警监管事项
      } else if (values.jglx && values.jglx === '1') {
        this.getCommon('500772'); //预警监管事项
      } else {
        this.props.SuperviseSetup.common.JgsxType = [];
      }
      if (values.jgsx) {
        this.getSupervise(
          values.jgsx.key === '5008301'
            ? '2068'
            : values.jgsx.key === '5008302'
            ? '2016'
            : values.jgsx.key === '5008303'
            ? '3'
            : values.jgsx.key === '5008304'
            ? '2017'
            : values.jgsx.key === '5008305'
            ? '6001'
            : values.jgsx.key === '5008306'
            ? '5007725'
            : values.jgsx.key,
        );
      } else {
        this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
      }
    });
    this.setState({
      visible: false,
    });
  };
  handleCancels = () => {
    this.setState({
      Fyvisible: false,
      visible: true,
    });
  };
  handleSuccess = () => {
    this.setState({
      Fyvisible: false,
    });
    this.getJgdList(this.state.pd, 1);
  };
  handleMenuClick = e => {
    this.setState({
      xsys1: e.key,
    });
  };
  handleMenuClick2 = e => {
    this.setState({
      xsys2: e.key,
    });
  };
  handleMenuClick3 = e => {
    this.setState({
      xsys3: e.key,
    });
  };
  changeJglx = e => {
    this.props.form.resetFields([
      'addjgsx',
      'addjgd',
      'addjgqx',
      'addtxjg',
      'dyctxry1',
      'dyctxry2',
      'dyctxry3',
      'dyjtxry1',
      'dyjtxry2',
      'dyjtxry3',
      'tqsj1',
      'tqsj2',
      'tqsj3',
    ]);
    this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
    this.getClear();
    this.setState({
      jgdDm: null,
      jgdMc: null,
      tqsj1: null,
      tqsj2: null,
      tqsj3: null,
    });
    if (e.target.value === '0') {
      this.getCommon('500830'); //告警监管事项
    } else {
      this.getCommon('500772'); //预警监管事项
    }
    this.setState({
      addjglx: e.target.value,
    });
  };
  changeJglx1 = e => {
    this.props.form.resetFields(['jgsx', 'jgd']);
    this.props.SuperviseSetup.SuperviseSetup.JgdType = [];
    this.props.SuperviseSetup.common.JgsxType = [];
    this.setState({
      jgdDm: null,
      jgdMc: null,
      dyjtxry1: [],
      dyjtxry2: [],
      dyjtxry3: [],
      dyctxry1: [],
      dyctxry2: [],
      dyctxry3: [],
      tqsj1: null,
      tqsj2: null,
      tqsj3: null,
    });
    if (e === '0') {
      this.getCommon('500830'); //告警监管事项
    } else if (e === '1') {
      this.getCommon('500772'); //预警监管事项
    }
  };
  del = (id, modleType) => {
    this.handleCancel();
    let that = this;
    confirm({
      title: '确认删除该监管点？',
      content: null,
      okText: '确定',
      cancelText: '取消',
      style: { top: '200px' },
      onOk() {
        that.props.dispatch({
          type: 'SuperviseSetup/getdelJgd',
          payload: {
            id: id,
          },
          callback: res => {
            if (!res.error) {
              message.success('删除成功');
              that.getJgdList(that.state.pd, that.state.current);
            } else {
              message.warn('操作失败，请重试');
            }
          },
        });
      },
      onCancel() {
        if (modleType && modleType === 1) {
          that.setState({
            visible: true,
          });
        }
      },
    });
  };
  getFyModel = () => {
    this.props.form.validateFields((err, values) => {
      if (values.addjgxz) {
        this.setState({
          fyxzjg: JSON.parse(values.addjgxz),
          Fyvisible: true,
          visible: false,
        });
        this.props.dispatch({
          type: 'SuperviseSetup/getfyJgd',
          payload: {
            jgsx_dm: '',
            ssjg_dm: JSON.parse(values.addjgxz).id,
          },
          callback: res => {
            this.setState({
              yyjgdList: res.data,
            });
          },
        });
      } else {
        message.warn('请选择机构');
      }
    });
  };
  emptyJgxz = e => {
    this.props.form.resetFields([
      'addjgd',
      'addjgsx',
      'addjgqx',
      'addtxjg',
      'dyctxry1',
      'dyctxry2',
      'dyctxry3',
      'dyjtxry1',
      'dyjtxry2',
      'dyjtxry3',
      'tqsj1',
      'tqsj2',
      'tqsj3',
      'jgd',
    ]);
    this.props.SuperviseSetup.JgdType = [];
    this.getClear();
    this.setState({
      id: null,
      ssjgMc: e ? JSON.parse(e).label : null,
      ssjgDm: e ? JSON.parse(e).id : null,
      tqsj1: null,
      tqsj2: null,
      tqsj3: null,
      sf_qy: null,
      qjjg: false,
      addHave: false,
    });
  };
  getJgd = e => {
    this.props.form.resetFields([
      'addjgd',
      'addjgqx',
      'addtxjg',
      'dyctxry1',
      'dyctxry2',
      'dyctxry3',
      'dyjtxry1',
      'dyjtxry2',
      'dyjtxry3',
      'tqsj1',
      'tqsj2',
      'tqsj3',
      'jgd',
    ]);
    this.props.SuperviseSetup.JgdType = [];
    this.setState({
      jgdDm: null,
      jgdMc: null,
    });
    this.getSupervise(
      e.key === '5008301'
        ? '2068'
        : e.key === '5008302'
        ? '2016'
        : e.key === '5008303'
        ? '3'
        : e.key === '5008304'
        ? '2017'
        : e.key === '5008305'
        ? '6001'
        : e.key === '5008306'
        ? '5007725'
        : e.key,
    );
  };
  // 获取机构树
  getDepTree = area => {
    const areaNum = [];
    if (area) {
      areaNum.push(area);
    }
    this.props.dispatch({
      type: 'common/getDepTree',
      payload: {
        departmentNum: areaNum,
      },
      callback: data => {
        if (data) {
          let obj = {
            id: data[0].code,
            label: data[0].name,
          };
          let objStr = JSON.stringify(obj);
          this.setState({
            treeDefaultExpandedKeys: [objStr],
          });
        }
      },
    });
  };
  // 渲染机构树
  renderloop = data =>
    data.map(item => {
      let obj = {
        id: item.code,
        label: item.name,
      };
      let objStr = JSON.stringify(obj);
      if (item.childrenList && item.childrenList.length) {
        return (
          <TreeNode value={objStr} key={objStr} title={item.name}>
            {this.renderloops(item.childrenList)}
          </TreeNode>
        );
      }
      // return <TreeNode key={objStr} value={objStr} title={item.name}/>;
    });
  renderloops = data =>
    data.map(item => {
      if (item.code && item.code.substring(6) === '000000') {
        let obj = {
          id: item.code,
          label: item.name,
        };
        let objStr = JSON.stringify(obj);
        return <TreeNode key={objStr} value={objStr} title={item.name} />;
      }
    });
  updateJgdOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!values.addjgsx) {
        message.warn('请选择监管事项');
      } else if (!values.addjgd) {
        message.warn('请选择监管点');
      } else if (!values.addjgqx) {
        message.warn('请选择监管期限');
      } else {
        let name1 = [],
          idcard1 = [],
          name2 = [],
          idcard2 = [],
          name3 = [],
          idcard3 = [];
        values.addjglx === '0' &&
          values.dyctxry1 &&
          values.dyctxry1.map(event => {
            name1.push(event.label);
            idcard1.push(event.key);
          });
        values.addjglx === '0' &&
          values.dyctxry2 &&
          values.dyctxry2.map(event => {
            name2.push(event.label);
            idcard2.push(event.key);
          });
        values.addjglx === '0' &&
          values.dyctxry3 &&
          values.dyctxry3.map(event => {
            name3.push(event.label);
            idcard3.push(event.key);
          });
        values.addjglx === '1' &&
          values.dyjtxry1 &&
          values.dyjtxry1.map(event => {
            name1.push(event.label);
            idcard1.push(event.key);
          });
        values.addjglx === '1' &&
          values.dyjtxry2 &&
          values.dyjtxry2.map(event => {
            name2.push(event.label);
            idcard2.push(event.key);
          });
        values.addjglx === '1' &&
          values.dyjtxry3 &&
          values.dyjtxry3.map(event => {
            name3.push(event.label);
            idcard3.push(event.key);
          });
        this.props.dispatch({
          type: 'SuperviseSetup/getupdateJgd',
          payload: {
            id: this.state.id,
            sf_qjjg: this.state.qjjg ? '1' : '0',
            ejyjtx_sj: values.tqsj2,
            ejyjtx_ysdm: values.addjglx === '1' ? this.state.xsys2 : '',
            ejyjtx_ysmc: values.addjglx === '1' ? this.state.xsys2 : '',
            ejyjtxr_sfzh: idcard2.join(','),
            ejyjtxr_xm: name2.join(','),
            jgd_dm: values.addjgd.key,
            jgd_mc: values.addjgd.label,
            jglx: values.addjglx,
            jgqx_js: moment(values.addjgqx[1]).format('YYYY-MM-DD'),
            jgqx_ks: moment(values.addjgqx[0]).format('YYYY-MM-DD'),
            jgsx_dm: values.addjgsx.key,
            jgsx_mc: values.addjgsx.label,
            sjyjtx_sj: values.tqsj3,
            sjyjtx_ysdm: values.addjglx === '1' ? this.state.xsys3 : '',
            sjyjtx_ysmc: values.addjglx === '1' ? this.state.xsys3 : '',
            sjyjtxr_sfzh: idcard3.join(','),
            sjyjtxr_xm: name3.join(','),
            ssjg_dm: this.state.ssjgDm ? this.state.ssjgDm : '',
            ssjg_mc: this.state.ssjgMc ? this.state.ssjgMc : '',
            txjg_dm: values.addjglx === '0' && values.addtxjg ? values.addtxjg.key : '',
            txjg_mc: values.addjglx === '0' && values.addtxjg ? values.addtxjg.label : '',
            yjyjtx_sj: values.tqsj1,
            yjyjtx_ysdm: values.addjglx === '1' ? this.state.xsys1 : '',
            yjyjtx_ysmc: values.addjglx === '1' ? this.state.xsys1 : '',
            yjyjtxr_sfzh: idcard1.join(','),
            yjyjtxr_xm: name1.join(','),
            sf_qy: this.state.sf_qy ? this.state.sf_qy : '',
          },
          callback: res => {
            if (!res.error) {
              this.handleCancel();
              message.success('修改成功');
              this.getJgdList(this.state.pd, this.state.current);
            } else {
              message.warn('操作失败，请重试');
            }
          },
        });
      }
    });
  };
  handleOk = () => {
    if (this.state.modleType === 0) {
      this.props.form.validateFields((err, values) => {
        if (!values.addjgxz) {
          message.warn('请选择机构');
        } else if (!values.addjgsx) {
          message.warn('请选择监管事项');
        } else if (!values.addjgd) {
          message.warn('请选择监管点');
        } else if (!values.addjgqx) {
          message.warn('请选择监管期限');
        } else {
          let name1 = [],
            idcard1 = [],
            name2 = [],
            idcard2 = [],
            name3 = [],
            idcard3 = [];
          values.addjglx === '0' &&
            values.dyctxry1 &&
            values.dyctxry1.map(event => {
              name1.push(event.label);
              idcard1.push(event.key);
            });
          values.addjglx === '0' &&
            values.dyctxry2 &&
            values.dyctxry2.map(event => {
              name2.push(event.label);
              idcard2.push(event.key);
            });
          values.addjglx === '0' &&
            values.dyctxry3 &&
            values.dyctxry3.map(event => {
              name3.push(event.label);
              idcard3.push(event.key);
            });
          values.addjglx === '1' &&
            values.dyjtxry1 &&
            values.dyjtxry1.map(event => {
              name1.push(event.label);
              idcard1.push(event.key);
            });
          values.addjglx === '1' &&
            values.dyjtxry2 &&
            values.dyjtxry2.map(event => {
              name2.push(event.label);
              idcard2.push(event.key);
            });
          values.addjglx === '1' &&
            values.dyjtxry3 &&
            values.dyjtxry3.map(event => {
              name3.push(event.label);
              idcard3.push(event.key);
            });
          this.props.dispatch({
            type: 'SuperviseSetup/getaddJgd',
            payload: {
              sf_qjjg: this.state.qjjg ? '1' : '0',
              ejyjtx_sj: values.tqsj2,
              ejyjtx_ysdm: values.addjglx === '1' ? this.state.xsys2 : '',
              ejyjtx_ysmc: values.addjglx === '1' ? this.state.xsys2 : '',
              ejyjtxr_sfzh: idcard2.join(','),
              ejyjtxr_xm: name2.join(','),
              jgd_dm: values.addjgd.key,
              jgd_mc: values.addjgd.label,
              jglx: values.addjglx,
              jgqx_js: moment(values.addjgqx[1]).format('YYYY-MM-DD'),
              jgqx_ks: moment(values.addjgqx[0]).format('YYYY-MM-DD'),
              jgsx_dm: values.addjgsx.key,
              jgsx_mc: values.addjgsx.label,
              sjyjtx_sj: values.tqsj3,
              sjyjtx_ysdm: values.addjglx === '1' ? this.state.xsys3 : '',
              sjyjtx_ysmc: values.addjglx === '1' ? this.state.xsys3 : '',
              sjyjtxr_sfzh: idcard3.join(','),
              sjyjtxr_xm: name3.join(','),
              ssjg_dm: JSON.parse(values.addjgxz).id,
              ssjg_mc: JSON.parse(values.addjgxz).label,
              txjg_dm: values.addjglx === '0' && values.addtxjg ? values.addtxjg.key : '',
              txjg_mc: values.addjglx === '0' && values.addtxjg ? values.addtxjg.label : '',
              yjyjtx_sj: values.tqsj1,
              yjyjtx_ysdm: values.addjglx === '1' ? this.state.xsys1 : '',
              yjyjtx_ysmc: values.addjglx === '1' ? this.state.xsys1 : '',
              yjyjtxr_sfzh: idcard1.join(','),
              yjyjtxr_xm: name1.join(','),
            },
            callback: res => {
              if (!res.error) {
                this.handleCancel();
                message.success('添加成功');
                this.getJgdList(this.state.pd, 1);
              } else {
                message.warn('操作失败，请重试');
              }
            },
          });
        }
      });
    }
  };
  //获取该机构是否存在该监管点信息
  changeJgd = e => {
    this.props.form.validateFields((err, values) => {
      if (!values.addjgxz && this.state.modleType === 0) {
        message.warn('请选择机构');
      } else if (!values.addjgxz && this.state.modleType === 0) {
        message.warn('请选择监管事项');
      } else {
        this.props.dispatch({
          type: 'SuperviseSetup/getfyJgd',
          payload: {
            jgsx_dm: values.addjgsx.key,
            ssjg_dm: JSON.parse(values.addjgxz).id,
            jglx: values.addjglx,
            jgd_dm: e.key ? e.key : '',
          },
          callback: reson => {
            if (reson && reson.data.length > 0) {
              let res = reson.data[0];
              this.setState({
                res: res,
                id: res.id,
                ssjgMc: res.ssjg_mc,
                ssjgDm: res.ssjg_dm,
                xsys1: res.yjyjtx_ysdm,
                xsys2: res.ejyjtx_ysdm,
                xsys3: res.sjyjtx_ysdm,
                dyjtxry1: this.getChoisePerson(res.yjyjtxr_sfzh, res.yjyjtxr_xm),
                dyjtxry2: this.getChoisePerson(res.ejyjtxr_sfzh, res.ejyjtxr_xm),
                dyjtxry3: this.getChoisePerson(res.sjyjtxr_sfzh, res.sjyjtxr_xm),
                dyctxry1: this.getChoisePerson(res.yjyjtxr_sfzh, res.yjyjtxr_xm),
                dyctxry2: this.getChoisePerson(res.ejyjtxr_sfzh, res.ejyjtxr_xm),
                dyctxry3: this.getChoisePerson(res.sjyjtxr_sfzh, res.sjyjtxr_xm),
                sf_qy: res.sf_qy,
                qjjg: res.sf_qjjg === '1' ? true : false,
                addHave: true,
              });
            } else {
              this.getClear();
              this.setState({
                sf_qy: null,
                qjjg: this.state.fs_qjjg,
                addHave: false,
              });
            }
          },
        });
      }
    });
  };
  //清空事项
  getClear = () => {
    this.setState({
      res: null,
      xsys1: this.props.SuperviseSetup.common.ColorType1[0]
        ? this.props.SuperviseSetup.common.ColorType1[0].name
        : '',
      xsys2: this.props.SuperviseSetup.common.ColorType2[0]
        ? this.props.SuperviseSetup.common.ColorType2[0].name
        : '',
      xsys3: this.props.SuperviseSetup.common.ColorType3[0]
        ? this.props.SuperviseSetup.common.ColorType3[0].name
        : '',
      dyjtxry1: [],
      dyjtxry2: [],
      dyjtxry3: [],
      dyctxry1: [],
      dyctxry2: [],
      dyctxry3: [],
    });
  };
  getTqsj = (e, tqsj) => {
    this.state[tqsj] = e;
  };
  // 导出
  exportData = () => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'common/exportData',
      payload: {
        tableType: '33',
        ...formValues,
      },
      callback: data => {
        if (data.text) {
          message.error(data.text);
        } else {
          window.open(window.configUrl.serverUrl + data.url);
        }
      },
    });
  };
  disabledEndDate = current => current && current < moment().startOf('day');
  onChangeQjjg = e => {
    this.setState({
      qjjg: e.target.checked,
      fs_qjjg: e.target.checked,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      SuperviseSetup: {
        common: {
          JgsxType,
          JgdztType,
          depTree,
          SjjgType,
          TqsjType,
          ColorType1,
          ColorType2,
          ColorType3,
          TxryType,
        },
        SuperviseSetup: { JgdType },
      },
    } = this.props;
    console.log('common----->', this.props.SuperviseSetup.common);
    console.log('SuperviseSetup----->', this.props.SuperviseSetup.SuperviseSetup);
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: this.state.data && this.state.data.page ? this.state.data.page.currentPage : '',
      total: this.state.data && this.state.data.page ? this.state.data.page.totalResult : '',
      pageSize: this.state.data && this.state.data.page ? this.state.data.page.showCount : '',
      showTotal: (total, range) => (
        <span className={stylescommon.pagination}>{`共 ${
          this.state.data && this.state.data.page ? this.state.data.page.totalPage : 1
        } 页，${
          this.state.data && this.state.data.page ? this.state.data.page.totalResult : 0
        } 条数据 `}</span>
      ),
    };
    const columns = [
      {
        title: '监管点',
        dataIndex: 'jgd_mc',
      },
      {
        title: '监管类型',
        render: record => (
          <div>{record.jglx === '0' ? '告警' : record.jglx === '1' ? '预警' : record.jglx}</div>
        ),
      },
      {
        title: '所属机构',
        dataIndex: 'ssjg_mc',
      },
      {
        title: '监管事项',
        dataIndex: 'jgsx_mc',
      },
      {
        title: '监管期限',
        render: record => (
          <div>
            {record.jgqx_ks}至{record.jgqx_js}
          </div>
        ),
      },
      {
        title: '监管状态',
        render: record => (
          <Tag
            color={
              record.jgdzt_dm === '5008002'
                ? record.sf_qy && record.sf_qy === '1'
                  ? '#00cc00'
                  : '#EE5655'
                : '#ccc'
            }
          >
            {record.jgdzt_mc}
          </Tag>
        ),
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a onClick={() => this.addList(1, record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.addList(2, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.del(record.id)}>删除</a>
          </div>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, md: { span: 16 }, xl: { span: 18 }, xxl: { span: 20 } },
    };
    const rowLayout = { md: 8, xl: 16, xxl: 24 };
    const colLayout = { sm: 24, md: 12, xl: 8 };
    const colLayouts = { sm: 24, md: 12, xl: 16, xxl: 24 };
    const modleLayouts = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const modleLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 12 },
    };
    const modleLayoutColor = {
      labelCol: { span: 14 },
      wrapperCol: { span: 10 },
    };
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {ColorType1 &&
          ColorType1.map(event => {
            return (
              <Menu.Item style={{ padding: '5px 4px' }} key={event.name}>
                <div style={{ width: '20px', height: '20px', background: `${event.name}` }}></div>
              </Menu.Item>
            );
          })}
      </Menu>
    );
    const menu2 = (
      <Menu onClick={this.handleMenuClick2}>
        {ColorType2 &&
          ColorType2.map(event => {
            return (
              <Menu.Item style={{ padding: '5px 4px' }} key={event.name}>
                <div style={{ width: '20px', height: '20px', background: `${event.name}` }}></div>
              </Menu.Item>
            );
          })}
      </Menu>
    );
    const menu3 = (
      <Menu onClick={this.handleMenuClick3}>
        {ColorType3 &&
          ColorType3.map(event => {
            return (
              <Menu.Item style={{ padding: '5px 4px' }} key={event.name}>
                <div style={{ width: '20px', height: '20px', background: `${event.name}` }}></div>
              </Menu.Item>
            );
          })}
      </Menu>
    );
    return (
      <div className={stylescommon.statistics}>
        <Card className={stylescommon.titleArea}>
          监管配置
            <div className={styles.btnAdd}>
                <Button type="primary" onClick={() => this.addList(0)}>
                    添加监管点
                </Button>
                <Button
                    className={stylescommon.export}
                    onClick={this.exportData}
                >
                    导出表格
                </Button>
            </div>
        </Card>
        <Card className={stylescommon.cardArea}>
          <Form>
            <Row gutter={rowLayout}>
              <Col {...colLayout}>
                <FormItem label="机构" {...formItemLayout}>
                  {getFieldDecorator('jg', {
                    // initialValue: this.state.jg,
                  })(
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择机构"
                      allowClear
                      treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                      key="badwSelect"
                      treeNodeFilterProp="title"
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                    </TreeSelect>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="监管类型" {...formItemLayout}>
                  {getFieldDecorator('jglx', {
                    initialValue: '',
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={this.changeJglx1}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      <Option value={''}>全部</Option>
                      <Option value={'0'}>告警</Option>
                      <Option value={'1'}>预警</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="监管事项" {...formItemLayout}>
                  {getFieldDecorator('jgsx', {
                    initialValue: { key: '', name: '' },
                  })(
                    <Select
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={e => this.getJgd(e)}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      <Option value="">全部</Option>
                      {JgsxType &&
                        JgsxType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="监管点" {...formItemLayout}>
                  {getFieldDecorator('jgd', {
                    initialValue: { key: '', name: '' },
                  })(
                    <Select labelInValue placeholder="请选择" style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                      <Option value="">全部</Option>
                      {JgdType &&
                        JgdType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="监管点状态" {...formItemLayout}>
                  {getFieldDecorator('jgdzt', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                      <Option value="">全部</Option>
                      {JgdztType &&
                        JgdztType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="监管期限" {...formItemLayout}>
                  {getFieldDecorator('jgqx', {
                    initialValue: this.state.jgqx,
                  })(<RangePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <span style={{ float: 'right', marginBottom: 24 }}>
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleSearch}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} className={stylescommon.empty}>
                    重置
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className={stylescommon.cardArea}>
          <Table
            // size='middle'
            loading={this.state.loading}
            rowKey={record => record.id}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            columns={columns}
            dataSource={this.state.data ? this.state.data.list : []}
          />
        </Card>
        <Modal
          title={
            this.state.modleType === 0
              ? '监管点添加'
              : this.state.modleType === 1
              ? '监管点详情'
              : this.state.modleType === 2
              ? '监管点修改'
              : ''
          }
          width={800}
          visible={this.state.visible}
          onOk={this.state.addHave ? this.updateJgdOk : this.handleOk}
          okText={'完成'}
          footer={
            this.state.modleType === 1 ? (
              <div>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button type="primary" onClick={() => this.del(this.state.id, 1)}>
                  删除
                </Button>
                <Button type="primary" onClick={this.updateJgdOk}>
                  确认修改
                </Button>
              </div>
            ) : this.state.modleType === 2 ? (
              <div>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button type="primary" onClick={this.updateJgdOk}>
                  完成
                </Button>
              </div>
            ) : (
              undefined
            )
          }
          onCancel={this.handleCancel}
          className={styles.modalStyle}
          maskClosable={false}
          style={{ top: '180px' }}
        >
          <Form>
            <Row gutter={rowLayout}>
              <Col
                span={this.state.ssjgDm && this.state.ssjgDm.substring(4) === '00000000' ? 8 : 24}
                className={this.state.modleType === 0 ? styles.none : styles.jgName}
              >
                <div>机构：{this.state.ssjgMc ? this.state.ssjgMc : ''}</div>
              </Col>
              <Col className={this.state.modleType === 0 ? '' : styles.none} span={12}>
                <FormItem label="机构选择" {...modleLayouts}>
                  {getFieldDecorator('addjgxz', {
                    // initialValue: this.state.addjgxz,
                  })(
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择机构"
                      allowClear
                      treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}
                      key="badwSelect"
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      treeNodeFilterProp="title"
                      onChange={e => this.emptyJgxz(e)}
                    >
                      {depTree && depTree.length > 0 ? this.renderloop(depTree) : null}
                    </TreeSelect>,
                  )}
                </FormItem>
              </Col>
              <Col
                className={
                  this.state.ssjgDm && this.state.ssjgDm.substring(4) === '00000000'
                    ? ''
                    : styles.none
                }
                span={4}
                style={{ margin: '8px 0' }}
              >
                <Checkbox onChange={this.onChangeQjjg} checked={this.state.qjjg}>
                  全局监管
                </Checkbox>
              </Col>
              <Col
                className={this.state.modleType === 0 ? '' : styles.none}
                span={8}
                style={{ margin: '4px 0 14px 0' }}
              >
                <Button
                  type="primary"
                  onClick={this.getFyModel}
                  disabled={this.state.ssjgMc ? false : true}
                >
                  复用其他机构
                </Button>
              </Col>
              <Col span={12}>
                <FormItem label="监管类型" {...modleLayouts}>
                  {getFieldDecorator('addjglx', {
                    initialValue: this.state.addjglx,
                  })(
                    <RadioGroup onChange={this.changeJglx}>
                      <Radio value={'0'}>告警</Radio>
                      <Radio value={'1'}>预警</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="监管事项" {...modleLayouts}>
                  {getFieldDecorator('addjgsx', {
                    initialValue:
                      this.state.res && this.state.res.jgsx_dm
                        ? {
                            key: this.state.res.jgsx_dm,
                            label: this.state.res.jgsx_mc,
                          }
                        : undefined,
                  })(
                    <Select
                      labelInValue={true}
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={e => this.getJgd(e)}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {JgsxType &&
                        JgsxType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="监管点" {...modleLayouts}>
                  {getFieldDecorator('addjgd', {
                    initialValue: this.state.jgdDm
                      ? {
                          key: this.state.jgdDm,
                          label: this.state.jgdMc,
                        }
                      : undefined,
                  })(
                    <Select
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={e => this.changeJgd(e)}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {JgdType &&
                        JgdType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="监管期限" {...modleLayouts}>
                  {getFieldDecorator('addjgqx', {
                    initialValue:
                      this.state.res && this.state.res.jgqx_ks && this.state.res.jgqx_js
                        ? [moment(this.state.res.jgqx_ks), moment(this.state.res.jgqx_js)]
                        : undefined,
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      getCalendarContainer={triggerNode => triggerNode.parentNode}
                      disabledDate={this.disabledEndDate}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={this.state.addjglx === '0' ? '' : styles.none}>
              <Col span={12}>
                <FormItem label="提醒间隔" {...modleLayouts}>
                  {getFieldDecorator('addtxjg', {
                    initialValue:
                      this.state.res && this.state.res.txjg_dm
                        ? {
                            key: this.state.res.txjg_dm,
                            label: this.state.res.txjg_mc,
                          }
                        : undefined,
                  })(
                    <Select
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {SjjgType &&
                        SjjgType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="第一次提醒人员" {...modleLayouts}>
                  {getFieldDecorator('dyctxry1', {
                    initialValue: this.state.dyctxry1,
                  })(
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TxryType &&
                        TxryType.length > 0 &&
                        TxryType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="第二次提醒人员" {...modleLayouts}>
                  {getFieldDecorator('dyctxry2', {
                    initialValue: this.state.dyctxry2,
                  })(
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TxryType &&
                        TxryType.length > 0 &&
                        TxryType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="第三次提醒人员" {...modleLayouts}>
                  {getFieldDecorator('dyctxry3', {
                    initialValue: this.state.dyctxry3,
                  })(
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TxryType &&
                        TxryType.length > 0 &&
                        TxryType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={this.state.addjglx === '1' ? '' : styles.none}>
              <Col span={12}>
                <FormItem
                  label="第一级提醒人员"
                  {...modleLayouts}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {getFieldDecorator('dyjtxry3', {
                    initialValue: this.state.dyjtxry3,
                  })(
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TxryType &&
                        TxryType.length > 0 &&
                        TxryType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="显示颜色" {...modleLayoutColor}>
                  <Dropdown overlay={menu3} trigger={['click']}>
                    <div className={styles.boxColor} style={{ background: this.state.xsys3 }}></div>
                  </Dropdown>
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="提前时间" {...modleLayout}>
                  {getFieldDecorator('tqsj3', {
                    initialValue: this.state.res ? this.state.res.sjyjtx_sj : undefined,
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={e => this.getTqsj(e, 'tqsj3')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TqsjType &&
                        TqsjType.map(event => {
                          return (
                            <Option
                              value={event.code}
                              disabled={
                                !!(
                                  this.state.tqsj2 &&
                                  (parseInt(event.code) < parseInt(this.state.tqsj2) ||
                                    parseInt(event.code) === parseInt(this.state.tqsj2))
                                ) ||
                                (this.state.tqsj1 &&
                                  !this.state.tqsj2 &&
                                  (parseInt(event.code) < parseInt(this.state.tqsj1) ||
                                    parseInt(event.code) === parseInt(this.state.tqsj1)))
                              }
                            >
                              {event.name}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={this.state.addjglx === '1' ? '' : styles.none}>
              <Col span={12}>
                <FormItem label="第二级提醒人员" {...modleLayouts}>
                  {getFieldDecorator('dyjtxry2', {
                    initialValue: this.state.dyjtxry2,
                  })(
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TxryType &&
                        TxryType.length > 0 &&
                        TxryType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="显示颜色" {...modleLayoutColor}>
                  <Dropdown overlay={menu2} trigger={['click']}>
                    <div className={styles.boxColor} style={{ background: this.state.xsys2 }}></div>
                  </Dropdown>
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="提前时间" {...modleLayout}>
                  {getFieldDecorator('tqsj2', {
                    initialValue: this.state.res ? this.state.res.ejyjtx_sj : undefined,
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={e => this.getTqsj(e, 'tqsj2')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TqsjType &&
                        TqsjType.map(event => {
                          return (
                            <Option
                              value={event.code}
                              disabled={
                                !!(
                                  (this.state.tqsj1 &&
                                    (parseInt(event.code) < parseInt(this.state.tqsj1) ||
                                      parseInt(event.code) === parseInt(this.state.tqsj1))) ||
                                  (this.state.tqsj3 &&
                                    (parseInt(event.code) > parseInt(this.state.tqsj3) ||
                                      parseInt(event.code) === parseInt(this.state.tqsj3)))
                                )
                              }
                            >
                              {event.name}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowLayout} className={this.state.addjglx === '1' ? '' : styles.none}>
              <Col span={12}>
                <FormItem label="第三级提醒人员" {...modleLayouts}>
                  {getFieldDecorator('dyjtxry1', {
                    initialValue: this.state.dyjtxry1,
                  })(
                    <Select
                      mode="multiple"
                      labelInValue
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TxryType &&
                        TxryType.length > 0 &&
                        TxryType.map(event => {
                          return <Option value={event.code}>{event.name}</Option>;
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="显示颜色" {...modleLayoutColor}>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <div className={styles.boxColor} style={{ background: this.state.xsys1 }}></div>
                  </Dropdown>
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="提前时间" {...modleLayout}>
                  {getFieldDecorator('tqsj1', {
                    initialValue: this.state.res ? this.state.res.yjyjtx_sj : undefined,
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={e => this.getTqsj(e, 'tqsj1')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {TqsjType &&
                        TqsjType.map(event => {
                          return (
                            <Option
                              value={event.code}
                              disabled={
                                !!(
                                  this.state.tqsj2 &&
                                  (parseInt(event.code) > parseInt(this.state.tqsj2) ||
                                    parseInt(event.code) === parseInt(this.state.tqsj2))
                                ) ||
                                (!this.state.tqsj2 &&
                                  this.state.tqsj3 &&
                                  (parseInt(event.code) > parseInt(this.state.tqsj3) ||
                                    parseInt(event.code) === parseInt(this.state.tqsj3)))
                              }
                            >
                              {event.name}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <SuperviseCopy
          qjjg={this.state.qjjg}
          Fyvisible={this.state.Fyvisible}
          fyxzjg={this.state.fyxzjg}
          yyjgdList={this.state.yyjgdList}
          handleCancels={this.handleCancels}
          handleSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
export default Form.create()(
  connect((SuperviseSetup, common) => ({ SuperviseSetup, common }))(SuperviseSetup),
);
