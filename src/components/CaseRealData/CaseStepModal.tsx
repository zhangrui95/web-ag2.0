import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Modal,
    Table,
    Divider,
    Button,
    Popconfirm,
    message,
    Icon,
    Tag,
    Tooltip,
    Row,
    Col,
    Form,
    Select,
    Upload,
    TreeSelect,
    Timeline,
    Steps,
    Card,
} from 'antd';
import { routerRedux } from 'dva/router';
import { getSysAuthority } from '../../utils/authority';
import styles from './CaseTrailModal.less';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const TreeNode = TreeSelect.TreeNode;
const { Option, OptGroup } = Select;
const { Step } = Steps;

export default class CaseTrailModal extends PureComponent {
    // constructor(props) {
    //   super(props);
    //   console.log('nextProps',props);
    //   this.state={
    //
    //   }
    // }
    // componentWillReceiveProps(nextProps) {
    //   console.log('nextProps',nextProps);
    //   this.setState({
    //     TrackPaddingBottom1: nextProps.TrackPaddingBottom1,
    //     TrackPaddingTop:nextProps.TrackPaddingTop,
    //     trailLeft:nextProps.trailLeft,
    //     TrackPaddingBottom:nextProps.TrackPaddingBottom,
    //   })
    // }
    extraDescriptionSa = (sasj, sadwmc, sabar) => {
        return (
            <div style={{ position: 'relative', left: '-40px', top: '10px' }}>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={sasj}>
                        受案时间：{sasj}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={sadwmc}>
                        受案单位：{sadwmc}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={sabar}>
                        受案人：{sabar}
                    </Tooltip>
                </p>
            </div>
        );
    };
    extraDescriptionLa = (larq, ladwmc, labar) => {
        return (
            <div style={{ position: 'relative', left: '-40px', top: '10px' }}>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={larq}>
                        立案时间：{larq}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={ladwmc}>
                        立案单位：{ladwmc}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={labar}>
                        立案人：{labar}
                    </Tooltip>
                </p>
            </div>
        );
    };
    extraDescriptionPa = (parq, padwmc, pabar) => {
        return (
            <div style={{ position: 'relative', left: '-40px', top: '10px' }}>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={parq}>
                        破案时间：{parq}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={padwmc}>
                        破案单位：{padwmc}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={pabar}>
                        破案人：{pabar}
                    </Tooltip>
                </p>
            </div>
        );
    };
    extraDescriptionJa = (jarq, jadwmc, jabar) => {
        return (
            <div style={{ position: 'relative', left: '-40px', top: '10px' }}>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={jarq}>
                        结案时间：{jarq}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={jadwmc}>
                        结案单位：{jadwmc}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={jabar}>
                        结案人：{jabar}
                    </Tooltip>
                </p>
            </div>
        );
    };
    extraDescriptionXa = (xarq, xadwmc, xabar) => {
        return (
            <div style={{ position: 'relative', left: '-40px', top: '10px' }}>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={xarq}>
                        销案时间：{xarq}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={xadwmc}>
                        销案单位：{xadwmc}
                    </Tooltip>
                </p>
                <p className={styles.clsj_time}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={xabar}>
                        销案人：{xabar}
                    </Tooltip>
                </p>
            </div>
        );
    };

    currentNum(policeDetails) {
        if (policeDetails.ajzt === '受理') {
            return (
                0
            );
        } else if (policeDetails.ajzt === '立案') {
            return (
                1
            );
        } else if (policeDetails.ajzt === '破案') {
            return (
                2
            );
        } else if (policeDetails.ajzt === '结案') {
            return (
                3
            );
        } else if (policeDetails.ajzt === '销案') {
            return (
                4
            );
        }
    }

    ajlc(policeDetails, superveWidth) {
        // alert(1)
        return (
            <div style={{ width: superveWidth }} className={styles.superve}>
                <Steps current={this.currentNum(policeDetails)}>
                    {
                        policeDetails.sarq || policeDetails.sadw || policeDetails.sabar ?
                            <Step status={policeDetails.ajzt === '受理' ? 'process' : 'wait'}
                                  title={<span style={{ fontSize: 14 }}>受理</span>}
                                  description={this.extraDescriptionSa(policeDetails.sarq, policeDetails.sadw, policeDetails.sabar)}/>
                            :
                            ''
                    }
                    {
                        policeDetails.larq || policeDetails.ladw || policeDetails.labar ?
                            <Step status={policeDetails.ajzt === '立案' ? 'process' : 'wait'}
                                  title={<span style={{ fontSize: 14 }}>立案</span>}
                                  description={this.extraDescriptionLa(policeDetails.larq, policeDetails.ladw, policeDetails.labar)}/>
                            :
                            ''
                    }
                    {
                        policeDetails.parq || policeDetails.padw || policeDetails.pabar ?
                            <Step status={policeDetails.ajzt === '破案' ? 'process' : 'wait'}
                                  title={<span style={{ fontSize: 14 }}>破案</span>}
                                  description={this.extraDescriptionPa(policeDetails.parq, policeDetails.padw, policeDetails.pabar)}/>
                            :
                            ''
                    }
                    {
                        policeDetails.jarq || policeDetails.jadw || policeDetails.jabar ?
                            <Step status={policeDetails.ajzt === '结案' ? 'process' : 'wait'}
                                  title={<span style={{ fontSize: 14 }}>结案</span>}
                                  description={this.extraDescriptionJa(policeDetails.jarq, policeDetails.jadw, policeDetails.jabar)}/>
                            :
                            ''
                    }
                    {
                        policeDetails.xarq || policeDetails.xadw || policeDetails.xabar ?
                            <Step status={policeDetails.ajzt === '销案' ? 'process' : 'wait'}
                                  title={<span style={{ fontSize: 14 }}>销案</span>}
                                  description={this.extraDescriptionXa(policeDetails.xarq, policeDetails.xadw, policeDetails.xabar)}/>
                            :
                            ''
                    }
                </Steps>
            </div>
        );
    }

    render() {
        const { caseDetails, superveWidth } = this.props;
        return (
            <div>
                <Card title={'案件流程'} style={{ margin: '0 12px' }}>
                    {this.ajlc(caseDetails, superveWidth)}
                </Card>
            </div>
        );
    }
}
