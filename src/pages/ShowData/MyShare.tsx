/*
 * 首页我的分享查看
 * author：zr
 * 20190424
 * */
import React, {PureComponent} from 'react';
import {Col, Row, Modal} from 'antd';
import {connect} from 'dva';
// import styles from '../../pages/ShowData/Show.less';
import styles from './HomepageCommon.less';
import {routerRedux} from 'dva/router';

@connect(({home, global}) => ({
    home, global
}))
export default class MyShare extends PureComponent {
    constructor(props) {
        super(props);
        let res = this.props.location.query && this.props.location.query.record ? this.props.location.query.record : '';
        if (typeof res == 'string') {
            res = JSON.parse(sessionStorage.getItem('query')).query.record;
        }
        this.state = {
            res:res,
        }
    }
    goCaseData = record => {
        this.props.dispatch(
            routerRedux.push({
                pathname:
                    record.tzlx === 'wpwt'
                        ? '/articlesInvolved/ArticlesPolice/unitemDetail'
                        : record.tzlx === 'xzajwt1'
                        ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
                        : record.tzlx === 'xzajwt2'
                            ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
                            : record.tzlx === 'xzajwt3'
                                ? '/newcaseFiling/casePolice/AdministrationPolice/uncaseDetail'
                                : record.tzlx === 'jqwt'
                                    ? '/receivePolice/AlarmPolice/unpoliceDetail'
                                    : record.tzlx === 'xsajwt1'
                                        ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
                                        : record.tzlx === 'xsajwt2'
                                            ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
                                            : record.tzlx === 'xsajwt3'
                                                ? '/newcaseFiling/casePolice/CriminalPolice/uncaseDetail'
                                                : record.tzlx === 'baqwt'
                                                    ? '/handlingArea/AreaPolice/UnareaDetail'
                                                    : record.tzlx === 'jzwt'
                                                        ? '/dossierPolice/DossierPolice/UnDossierDetail'
                                                        : record.tzlx === 'wpxx'
                                                            ? '/articlesInvolved/ArticlesPolice/unitemDetail'
                                                            : record.tzlx === 'xzajxx1'
                                                                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                                                                : record.tzlx === 'xzajxx2'
                                                                    ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                                                                    : record.tzlx === 'xzajxx3'
                                                                        ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                                                                        : record.tzlx === 'jqxx'
                                                                            ? '/receivePolice/AlarmData/policeDetail'
                                                                            : record.tzlx === 'xsajxx1'
                                                                                ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                                                                                : record.tzlx === 'xsajxx2'
                                                                                    ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                                                                                    : record.tzlx === 'xsajxx3'
                                                                                        ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                                                                                        : record.tzlx === 'baqxx'
                                                                                            ? '/handlingArea/AreaData/areaDetail'
                                                                                            : record.tzlx === 'jzxx'
                                                                                                ? '/dossierPolice/DossierData/DossierDetail'
                                                                                                : record.tzlx === 'jqyj'
                                                                                                    ? '/receivePolice/AlarmData/policeDetail'
                                                                                                    : record.tzlx === 'xzajyj1'
                                                                                                        ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                                                                                                        : record.tzlx === 'xsajyj1'
                                                                                                            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                                                                                                            : record.tzlx === 'xzajyj2'
                                                                                                                ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                                                                                                                : record.tzlx === 'xsajyj2'
                                                                                                                    ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                                                                                                                    : record.tzlx === 'xzajyj3'
                                                                                                                        ? '/newcaseFiling/caseData/AdministrationData/caseDetail'
                                                                                                                        : record.tzlx === 'xsajyj3'
                                                                                                                            ? '/newcaseFiling/caseData/CriminalData/caseDetail'
                                                                                                                            : record.tzlx === 'baqyj'
                                                                                                                                ? '/handlingArea/AreaData/areaDetail'
                                                                                                                                : record.tzlx === 'wpyj'
                                                                                                                                    ? '/articlesInvolved/ArticlesData/itemDetail'
                                                                                                                                    : record.tzlx === 'jzyj'
                                                                                                                                        ? '/dossierPolice/DossierData/DossierDetail'
                                                                                                                                        : '',
                query: {
                    id: record.tzlx === 'jqwt' ? record.id :
                        record.tzlx === 'xsajxx1' || record.tzlx === 'xsajxx2' || record.tzlx === 'xsajxx3'||
                        record.tzlx === 'xsajyj1' || record.tzlx === 'xsajyj2' || record.tzlx === 'xsajyj3'||
                        record.tzlx === 'xzajyj1' || record.tzlx === 'xzajyj2' || record.tzlx === 'xzajyj3'||
                        record.tzlx === 'xzajxx1' || record.tzlx === 'xzajxx2' || record.tzlx === 'xzajxx3' ? record.ajbh :
                            record.agid,
                    system_id: record.system_id,
                    wtid: record.wtid,
                    record: record,
                    from:'首页'
                },
            }),
        );
    };

    render() {
        // console.log('this.props', this.props);
        const rowLayout = {md: 8, xl: 16, xxl: 24};
        let dark = this.props.global && this.props.global.dark;
        let type = this.props.location.query.tab;
        return (
            /*<Modal
              title="我的分享"
              visible={this.props.visibleShare}
              onCancel={this.props.handleCancel}
              footer={null}
              width={900}
              maskClosable={false}
              className={styles.myNewsModal}
              centered={true}
            >
              <Row>
                {this.props.tabs === 's2' ? (
                  <Col
                    span={
                      this.props.shareDatail &&
                      this.props.shareDatail.shareItem &&
                      this.props.shareDatail.shareItem.length > 20
                        ? 6
                        : 8
                    }
                  >
                    分享人：
                    {this.props.shareDatail && this.props.shareDatail.czr
                      ? this.props.shareDatail.czr
                      : ''}
                  </Col>
                ) : (
                  <Col
                    span={
                      this.props.shareDatail &&
                      this.props.shareDatail.shareItem &&
                      this.props.shareDatail.shareItem.length > 20
                        ? 6
                        : 8
                    }
                  >
                    被分享人：
                    {this.props.shareDatail && this.props.shareDatail.fx_xm
                      ? this.props.shareDatail.fx_xm
                      : ''}
                  </Col>
                )}
                <Col
                  span={
                    this.props.shareDatail &&
                    this.props.shareDatail.shareItem &&
                    this.props.shareDatail.shareItem.length > 20
                      ? 12
                      : 10
                  }
                >
                  分享事项：
                  <a href="javascript:;" onClick={() => this.props.goLook(this.props.shareDatail, 2)}>
                    {this.props.shareDatail && this.props.shareDatail.sx ? this.props.shareDatail.sx : ''}
                  </a>
                </Col>
                <Col span={6}>
                  分享时间：
                  {this.props.shareDatail && this.props.shareDatail.czsj
                    ? this.props.shareDatail.czsj
                    : ''}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  分享类型：
                  {this.props.shareDatail && this.props.shareDatail.lx ? this.props.shareDatail.lx : ''}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className={styles.content}>分享建议：</div>
                  <div className={styles.content} style={{ width: '700px' }}>
                    {this.props.shareDatail && this.props.shareDatail.fxjy
                      ? this.props.shareDatail.fxjy
                      : ''}
                  </div>
                </Col>
              </Row>
            </Modal>*/
            <div className={styles.box}>
                <div style={{backgroundColor: dark ? '#202839' : '#fff',padding:'16px 16px 0'}}>
                  <span className={ dark ? styles.title : styles.titles}>
                      {type==='1' ? '分享给我' : '我的分享'}
                  </span>
                </div>
                <div className={styles.myNewsMessage} style={{backgroundColor: dark ? '#202839' : '#fff'}}>
                    <Row gutter={rowLayout} style={{marginBottom: 24}}>
                        {type==='1' ? <Col span={8}>
                            分享人：
                            {this.props.location &&
                            this.props.location.query &&
                            this.state.res &&
                            this.state.res.czr
                                ? this.state.res.czr
                                : ''}
                        </Col> :<Col span={8}>
                            被分享人：
                            {this.props.location &&
                            this.props.location.query &&
                            this.state.res &&
                            this.state.res.fx_xm
                                ? this.state.res.fx_xm
                                : ''}
                        </Col>}
                        <Col span={8}>
                            分享事项：
                            <a
                                href="javascript:;"
                                onClick={() => this.goCaseData(this.state.res)}
                            >
                                {this.props.location &&
                                this.props.location.query &&
                                this.state.res &&
                                this.state.res.sx
                                    ? this.state.res.sx
                                    : ''}
                            </a>
                        </Col>
                        <Col span={8}>
                            分享时间：
                            {this.props.location &&
                            this.props.location.query &&
                            this.state.res &&
                            this.state.res.czsj
                                ? this.state.res.czsj
                                : ''}
                        </Col>
                        <Col span={24}>
                            分享类型：
                            {this.props.location &&
                            this.props.location.query &&
                            this.state.res &&
                            this.state.res.lx
                                ? this.state.res.lx
                                : ''}
                        </Col>
                        <Col span={24}>
                            <div className={styles.content}>分享建议：</div>
                            <div className={styles.content} style={{width: '700px'}}>
                                {this.props.location &&
                                this.props.location.query &&
                                this.state.res &&
                                this.state.res.fxjy
                                    ? this.state.res.fxjy
                                    : ''}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
