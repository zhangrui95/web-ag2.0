/*
 * Share/index.tsx 分享功能弹窗
 * author：jhm
 * 20191211
 * */

import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, message, button, Spin, Row, Col, Tooltip, Button, Card } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const Option = Select.Option;
import { connect } from 'dva';
import { getUserInfos } from '../../../utils/utils';
import {routerRedux} from "dva/router";
import {NavigationItem} from "@/components/Navigation/navigation";

const FormItem = Form.Item;

@connect(({ share }) => ({
  share,
}))
class ShareModal extends PureComponent {
  constructor(props, context) {
    super(props);
    this.state = {
      shareSuccess: false,
      loading: false,
      key: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.shareVisible !== nextProps.shareVisible) {
      this.props.form.resetFields();
      this.setState({
        key: this.state.key + 1,
      });
    }
  }

  handleOk = () => {
    const {query:{record,from,tzlx,sx}} = this.props.location;
    this.props.form.validateFields((err, values) => {
      if (!values.sharePerson || values.sharePerson.length === 0) {
        message.warn('请选择分享人');
      } else if (values.shareSuggest && values.shareSuggest.length > 500) {
        message.warn('分享建议不可超过500字');
      } else {
        let card = [];
        let name = [];
        let dirName = [];
        let dirNum = [];
        values.sharePerson.map((item) => {
          card.push(item.key);
          name.push(item.label[0].props.children);
          dirName.push(item.label[1].props.children[1]);
          dirNum.push(item.label[2].props.children);
        });
        this.props.dispatch({
          type: 'share/getMyFollow',
          payload: {
            fx_sfzh: card.toString(),
            fx_dwdm: dirNum.toString(),
            fx_dwmc: dirName.toString(),
            fx_xm: name.toString(),
            agid: record&&(record.tzlx === 'jqwt' || record.tzlx === 'jzwt') ? record.wtid : record.id,
            fxjy: values.shareSuggest,
            lx: from?from:'',
            sx: sx?sx:'',
            type: 2,
            tzlx: tzlx?tzlx:'',
            wtid: record&&record.wtid?record.wtid:'',
            ajbh: record&&record.ajbh?record.ajbh:'',
            system_id: tzlx === 'jqwt' ? record.id : tzlx === 'jzwt' || tzlx === 'jzxx' ? record.dossier_id : tzlx === 'baqwt' ? record.baq_id : record.system_id,
          },
          callback: (res) => {
            if (!res.error) {
              // this.props.handleCancel();
              this.setState({
                shareSuccess: true,
              });
            } else {
              message.error(res.error);
            }
          },
        });
      }
    });
  };
  handleCancel = () => {
    this.setState({
      shareSuccess: false,
    });
    this.onEdit(true)
  };
  handleSearch = (value) => {
    this.setState({
      personList: [],
      loading: true,
    });
    this.props.dispatch({
      type: 'share/sharePerson',
      payload: {
        pd: {
          code: getUserInfos().department,
          name: value,
        },
        showCount: 999999,
      },
      callback: (res) => {
        this.setState({
          personList: res.list,
          loading: false,
        });
      },
    });
    // this.setState({
    // shareVisible: true,
    // shareItem: res,
    // })
  };
  getBlur = () => {
    this.setState({
      personList: [],
    });
  };
  onEdit = (isReset) => {
    const {query:{record,detail,tab}} = this.props.location;
    let key = '/ModuleAll/Share'+this.props.location.query.id;
    // 鍒犻櫎褰撳墠tab骞朵笖灏嗚矾鐢辫烦杞嚦鍓嶄竴涓猼ab鐨刾ath
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch( routerRedux.push({pathname: this.props.location.query.fromPath,query: isReset ? {isReset,id:tab==='表格'?'':this.props.location.query.id,record:tab==='表格'?'':this.props.location.query.record} : {id:tab==='表格'?'':this.props.location.query.id,record:tab==='表格'?'':this.props.location.query.record}}));
      dispatch({
        type: 'global/changeSessonNavigation',
        payload: {
          key,
          isShow: false,
        },
      });
      dispatch({
        type: 'global/changeNavigation',
        payload: {
          key,
          isShow: false,
        },
      });
    }
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 21 },
        sm: { span: 22 },
      },
    };
    const children = [];
    if (this.state.personList && this.state.personList.length > 0) {
      this.state.personList.map((event, idx) => {
        if (event.idcard !== getUserInfos().idCard) {
          children.push(<Option key={event.idcard} label={event.depname}><span>{event.name}</span><span
            style={{ color: '#ccc' }}>&nbsp;&nbsp;{event.depname}</span><span
            style={{ display: 'none' }}>{event.department}</span></Option>);
        }
      });
    }
    const { getFieldDecorator } = this.props.form;
    const {query:{record,detail}} = this.props.location;
    return (
      <div>
        <Card className={styles.standardTable}  id='shareModule'>
          {detail}
          <Form style={{padding:0}}>
            <FormItem {...formItemLayout} label="分享人">
              {getFieldDecorator('sharePerson')(
                <Select
                  labelInValue
                  mode="multiple"
                  filterOption={false}
                  style={{ width: '100%' }}
                  placeholder="请输入分享人"
                  onSearch={this.handleSearch}
                  onFocus={this.handleSearch}
                  notFoundContent={this.state.loading ? <Spin size="small"/> : null}
                  onBlur={this.getBlur}
                  getPopupContainer={() => document.getElementById('shareModule')}
                >
                  {children}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分享建议">
              {getFieldDecorator('shareSuggest')(<TextArea rows={8} style={{resize:'none'}} placeholder='请输入不超过500字'/>)}
            </FormItem>
          </Form>
        </Card>
        <Card>
          <div className={styles.btns}>
            <Button type="primary" style={{ marginLeft: 8 }} className={styles.qxBtn} onClick={()=>this.onEdit(false)}>
              取消
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleOk}>
              确定
            </Button>
          </div>
        </Card>
        <Modal
          title=" "
          visible={this.state.shareSuccess}
          className={styles.shareSuccess}
          width={350}
          style={{ top: '250px' }}
          maskClosable={false}
          cancelText={null}
          onCancel={this.handleCancel}
          footer={<button onClick={this.handleCancel} className={styles.successBtn}>确定</button>}
        >
          分享完成！
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ShareModal);

