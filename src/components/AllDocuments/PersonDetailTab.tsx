/*
* PersonDetailTab 人员档案详情Tab组件
* author：lyp
* 20180123
* */
import React, { PureComponent } from 'react';
import { Tabs, Row, Col, Table, List, Steps, Tooltip } from 'antd';
import Ellipsis from '../Ellipsis';
import styles from './personDetailTab.less';
import PunishTimeLine from './PunishTimeLine';

const TabPane = Tabs.TabPane;

export default class PersonDetailTab extends PureComponent {

    state = {
        jzCurrent: 1,
        rqCurrent: 1,
        gjCurrent: 1,
        sswpCurrent: 1,
        sawpCurrent: 1,
        oWidth: 0,
    };

    componentDidMount() {
        this.getPunishDivWidth();
        window.addEventListener('resize', this.getPunishDivWidth);
    }

    getPunishDivWidth = () => {
        const oWidth = this.refs.stepRef && this.refs.stepRef.offsetWidth ? this.refs.stepRef.offsetWidth : 0;
        this.setState({
            oWidth,
        });
    };


    // 同案人List
    showTarList = (tarList) => {
        return (
            <List
                itemLayout="vertical"
                size="small"
                pagination={tarList.length > 0 ? {
                    size: 'small',
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                        第 {this.state.gjCurrent} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({ gjCurrent: page });
                    },
                } : null}
                dataSource={tarList}
                grid={{
                    gutter: 16, xs: 1, sm: 2, md: 4, lg: 4,
                }}
                className={styles.listItem}
                style={{ color: '#faa' }}
                renderItem={item => (
                    <List.Item>
                        <div className={styles.blueItems}>
                            <div className={styles.listItemContents}>
                                <Row style={{ padding: '10px' }}>
                                    <Col span={12}>姓名：{item.name}</Col>
                                    <Col span={8}>性别：{item.sex}</Col>
                                    <Col span={4}>
                                        <span
                                            className={item.xszk_name && item.xszk_name === '在逃' ? styles.tag : styles.tagBlue}>{item.xszk_name ? item.xszk_name : '未知'}</span>
                                    </Col>
                                </Row>
                                <Row style={{ padding: '10px' }}>
                                    <Col span={24}>证件号：{item.xyr_sfzh}</Col>
                                </Row>
                            </div>
                            <div className={styles.operationButton}
                                 onClick={() => this.props.openPersonDetail(item)}>查看
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        );
    };
    // 涉案物品List
    showSawpList = (sawpList) => {
        return (
            <List
                itemLayout="vertical"
                size="small"
                pagination={sawpList.length > 0 ? {
                    size: 'small',
                    pageSize: 8,
                    showTotal: (total, range) => <div style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                        第 {this.state.sawpCurrent} / {(Math.ceil(total / 8))} 页</div>,
                    onChange: (page) => {
                        this.setState({ sawpCurrent: page });
                    },
                } : null}
                dataSource={sawpList}
                grid={{
                    gutter: 32, xs: 1, sm: 2, md: 4, lg: 4,
                }}
                className={styles.listItem}
                style={{ color: '#faa' }}
                renderItem={item => (
                    <List.Item>
                        <div className={styles.whiteItems}>
                            <div className={styles.listItemContents}>
                                <div className={styles.sawpImg}>
                                    <img width='90' height='90'
                                         src={item && item.imageList && item.imageList.length > 0 ? item.imageList[0].imageurl : 'images/nophoto.png'}/>
                                </div>
                                <div className={styles.sawpName}>
                                    <div className={styles.sawpName1}>物品名称：<Tooltip
                                        overlayStyle={{ wordBreak: 'break-all' }}
                                        title={item.wpmc}>{item.wpmc}</Tooltip></div>
                                    <div className={styles.sawpName1}>物品种类：<Tooltip
                                        overlayStyle={{ wordBreak: 'break-all' }}
                                        title={item.wpzlMc}>{item.wpzlMc}</Tooltip></div>
                                </div>
                            </div>
                            <div className={styles.operationButton}
                                 onClick={() => this.props.SaWpdeatils(item.system_id)}>查看
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        );
    };

    render() {
        const { caseData } = this.props;
        console.log('caseData',caseData);
        const { oWidth } = this.state;
        // 同案人表头
        const rqColumns = [
            {
                title: '办案区名称',
                dataIndex: 'haName',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={20} tooltip>{text}</Ellipsis> : ''
                    );
                },
            },
            {
                title: '入区时间',
                dataIndex: 'rqsj',
            },
            {
                title: '离区时间',
                dataIndex: 'leave_time',
            },
            {
                title: '滞留时长',
                dataIndex: 'detain_time',
            },
            {
                title: '入区原因',
                dataIndex: 'entry_cause',
            },
            {
                title: '办案民警',
                dataIndex: 'bar',
            },
            {
                title: '操作',
                width: 50,
                render: (record) => (
                    <div>
                        <a onClick={() => this.props.IntoArea(caseData.ajbh)}>详情</a>
                    </div>
                ),
            },
        ];
        // 卷宗表头
        const JzColumns = [
            {
                title: '卷宗名称',
                dataIndex: 'jzmc',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={20} tooltip>{text}</Ellipsis> : ''
                    );
                },
            },
            {
                title: '卷宗类别',
                dataIndex: 'jzlb_mc',
            },
            {
                title: '存储状态',
                dataIndex: 'cczt_mc',
            },
            {
                title: '卷宗页数',
                dataIndex: 'jzys',
            },
            {
                title: '电子化',
                dataIndex: 'is_gldzj',
            },
            {
                title: '操作',
                width: 50,
                render: (record) => (
                    <div>
                        <a onClick={() => this.props.JzDetail(record)}>查看</a>
                    </div>
                ),
            },
        ];
        // 随身物品表头
        const sswpColumns = [
            {
                title: '物品名称',
                dataIndex: 'wpName',
                render: (text) => {
                    return (
                        text ? <Ellipsis length={20} tooltip>{text}</Ellipsis> : ''
                    );
                },
            },
            {
                title: '数量',
                dataIndex: 'sl',
            },
            {
                title: '单位',
                dataIndex: 'unit',
            },
            {
                title: '特征',
                dataIndex: 'tz',
            },
            {
                title: '备注',
                dataIndex: 'remark',
            },
            {
                title: '物管员',
                dataIndex: 'wgr',
            },
            {
                title: '办案民警',
                dataIndex: 'bary',
            },
            {
                title: '接领人员',
                dataIndex: 'jlry',
            },
        ];
        return (
            <div style={{ padding: 16 }} className={styles.personTab} ref="stepRef">
                <div className='NameShow'>
                    <Tabs type="card" tabBarGutter={8} className='tabName'>
                        <TabPane tab={caseData.ajmc} key="1" forceRender className='Namesaxx1'>
                            <div className={styles.tabDiv}>
                                <Row className={styles.contentRow}>
                                    <Col md={6} sm={24}>
                                        <div>案件编号：
                                            {
                                                caseData.ajbh ? (
                                                    caseData.system_id && caseData.ajlx ? (
                                                        <a
                                                            onClick={() => this.props.openCaseDetail(caseData.system_id, caseData.ajlx, caseData.ajbh)}
                                                            style={{ textDecoration: 'underline' }}
                                                        >
                                                            {caseData.ajbh}
                                                        </a>
                                                    ) : caseData.ajbh

                                                ) : ''
                                            }
                                        </div>
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <div>案件类型：{caseData.ajlxmc}</div>
                                    </Col>
                                    <Col md={12} sm={24}>
                                        <div>案件名称：{caseData.ajmc}</div>
                                    </Col>


                                </Row>
                                <Row className={styles.contentRow}>
                                    <Col md={6} sm={24}>
                                        <div>案件状态：{caseData.schj}</div>
                                    </Col>
                                    {
                                        caseData.ajlx === '22001' ? (
                                            <Col md={6} sm={24}>
                                                <div>案件类别：{caseData.ajlbmc}</div>
                                            </Col>
                                        ) : null
                                    }
                                    <Col md={6} sm={24}>
                                        <div>办案人：{caseData.barxm}</div>
                                    </Col>
                                </Row>
                                <Row className={styles.contentRow}>
                                    <Col md={12} sm={24}>
                                        <div>{caseData.ajlx === '22001' ? '办案单位' : '受理单位'}：{caseData.bardwmc}</div>
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <div>{caseData.ajlx === '22001' ? '受案时间' : '受理时间'}：{caseData.sasj}</div>
                                    </Col>
                                </Row>
                                <Row className={styles.contentRow}>
                                    <Col md={24} sm={24}>
                                        <div>案发地点：{caseData.afdd}</div>
                                    </Col>
                                </Row>
                                <Row className={styles.contentRow}>
                                    <Col md={24} sm={24}>
                                        <div>简要案情：{caseData.jyaq}</div>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab="历史入区信息" key="2" forceRender className='Namesaxx2'>
                            <div className={styles.tabDiv}>
                                <Row className={styles.contentRow}>
                                    <Col md={24} sm={24}>
                                        <Table
                                            size='middle'
                                            style={{ backgroundColor: '#fff' }}
                                            pagination={{
                                                pageSize: 3,
                                                showTotal: (total, range) => <div
                                                    style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                                                    第 {this.state.rqCurrent} / {(Math.ceil(total / 3))} 页</div>,
                                                onChange: (page) => {
                                                    this.setState({ rqCurrent: page });
                                                },
                                            }}
                                            dataSource={caseData.rqList || []}
                                            columns={rqColumns}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab="同案人" key="3" forceRender className='Namesaxx3'>
                            <div className={styles.tabDiv}>
                                {this.showTarList(caseData.tarList || [])}
                            </div>
                        </TabPane>
                        <TabPane tab='行政处罚记录' key="4" forceRender className='Namesaxx4'>
                            {
                                oWidth ? (
                                    <PunishTimeLine
                                        oWidth={oWidth}
                                        punishData={caseData.xzcfList}
                                    />
                                ) : null
                            }
                        </TabPane>
                        <TabPane tab='强制措施记录' key="5" forceRender className='Namesaxx5'>
                            {
                                oWidth ? (
                                    <PunishTimeLine
                                        oWidth={oWidth}
                                        punishData={caseData.qzcsList}
                                    />
                                ) : null
                            }
                        </TabPane>
                        <TabPane tab="随身物品" key="6" forceRender className='Namesaxx6'>
                            <div className={styles.tabDiv}>
                                <Table
                                    size='middle'
                                    style={{ backgroundColor: '#fff' }}
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                                            第 {this.state.sswpCurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({ sswpCurrent: page });
                                        },
                                    }}
                                    dataSource={caseData.sswpList || []}
                                    columns={sswpColumns}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="涉案物品" key="7" forceRender className='Namesaxx7'>
                            <div className={styles.tabDiv}>
                                {this.showSawpList(caseData.sawpList || [])}
                            </div>
                        </TabPane>
                        <TabPane tab="相关卷宗" key="8" forceRender className='Namesaxx8'>
                            <div className={styles.tabDiv}>
                                <Table
                                    size='middle'
                                    style={{ backgroundColor: '#fff' }}
                                    pagination={{
                                        pageSize: 3,
                                        showTotal: (total, range) => <div
                                            style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                                            第 {this.state.jzCurrent} / {(Math.ceil(total / 3))} 页</div>,
                                        onChange: (page) => {
                                            this.setState({ jzCurrent: page });
                                        },
                                    }}
                                    dataSource={caseData ? caseData.jzList : []}
                                    columns={JzColumns}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div className='NameHide' style={{ display: 'none' }}>
                    <div className='tabDiv1'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>{caseData.ajmc}</div>
                        <div className={styles.tabDiv}>
                            <Row className={styles.contentRow}>
                                <Col md={6} sm={24}>
                                    <div>案件编号：
                                        {
                                            caseData.ajbh ? (
                                                caseData.system_id && caseData.ajlx ? (
                                                    <a
                                                        onClick={() => this.props.openCaseDetail(caseData.system_id, caseData.ajlx, caseData.ajbh)}
                                                        style={{ textDecoration: 'underline' }}
                                                    >
                                                        {caseData.ajbh}
                                                    </a>
                                                ) : caseData.ajbh

                                            ) : ''
                                        }
                                    </div>
                                </Col>
                                <Col md={6} sm={24}>
                                    <div>案件类型：{caseData.ajlxmc}</div>
                                </Col>
                                <Col md={12} sm={24}>
                                    <div>案件名称：{caseData.ajmc}</div>
                                </Col>


                            </Row>
                            <Row className={styles.contentRow}>
                                <Col md={6} sm={24}>
                                    <div>案件状态：{caseData.schj}</div>
                                </Col>
                                {
                                    caseData.ajlx === '22001' ? (
                                        <Col md={6} sm={24}>
                                            <div>案件类别：{caseData.ajlbmc}</div>
                                        </Col>
                                    ) : null
                                }
                                <Col md={6} sm={24}>
                                    <div>办案人：{caseData.barxm}</div>
                                </Col>
                            </Row>
                            <Row className={styles.contentRow}>
                                <Col md={12} sm={24}>
                                    <div>{caseData.ajlx === '22001' ? '办案单位' : '受理单位'}：{caseData.bardwmc}</div>
                                </Col>
                                <Col md={6} sm={24}>
                                    <div>{caseData.ajlx === '22001' ? '受案时间' : '受理时间'}：{caseData.sasj}</div>
                                </Col>
                            </Row>
                            <Row className={styles.contentRow}>
                                <Col md={24} sm={24}>
                                    <div>案发地点：{caseData.afdd}</div>
                                </Col>
                            </Row>
                            <Row className={styles.contentRow}>
                                <Col md={24} sm={24}>
                                    <div>简要案情：{caseData.jyaq}</div>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div className='tabDiv2'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>历史入区信息</div>
                        <div className={styles.tabDiv}>
                            <Row className={styles.contentRow}>
                                <Col md={24} sm={24}>
                                    <Table
                                        size='middle'
                                        style={{ backgroundColor: '#fff' }}
                                        pagination={{
                                            pageSize: 3,
                                            showTotal: (total, range) => <div
                                                style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                                                第 {this.state.rqCurrent} / {(Math.ceil(total / 3))} 页</div>,
                                            onChange: (page) => {
                                                this.setState({ rqCurrent: page });
                                            },
                                        }}
                                        dataSource={caseData.rqList || []}
                                        columns={rqColumns}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div className='tabDiv3'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>同案人</div>
                        <div className={styles.tabDiv}>
                            {this.showTarList(caseData.tarList || [])}
                        </div>
                    </div>

                    <div className='tabDiv4'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>行政处罚记录</div>
                        {
                            oWidth ? (
                                <PunishTimeLine
                                    oWidth={oWidth}
                                    punishData={caseData.xzcfList}
                                />
                            ) : null
                        }
                    </div>

                    <div className='tabDiv5'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>强制措施记录</div>
                        {
                            oWidth ? (
                                <PunishTimeLine
                                    oWidth={oWidth}
                                    punishData={caseData.qzcsList}
                                />
                            ) : null
                        }
                    </div>

                    <div className='tabDiv6'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>随身物品</div>
                        <div className={styles.tabDiv}>
                            <Table
                                size='middle'
                                style={{ backgroundColor: '#fff' }}
                                pagination={{
                                    pageSize: 3,
                                    showTotal: (total, range) => <div
                                        style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                                        第 {this.state.sswpCurrent} / {(Math.ceil(total / 3))} 页</div>,
                                    onChange: (page) => {
                                        this.setState({ sswpCurrent: page });
                                    },
                                }}
                                dataSource={caseData.sswpList || []}
                                columns={sswpColumns}
                            />
                        </div>
                    </div>

                    <div className='tabDiv7'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>涉案物品</div>
                        <div className={styles.tabDiv}>
                            {this.showSawpList(caseData.sawpList || [])}
                        </div>
                    </div>

                    <div className='tabDiv8'>
                        <div style={{ border: '1px solid #ccc', lineHeight: '32px' }}>相关卷宗</div>
                        <div className={styles.tabDiv}>
                            <Table
                                size='middle'
                                style={{ backgroundColor: '#fff' }}
                                pagination={{
                                    pageSize: 3,
                                    showTotal: (total, range) => <div
                                        style={{ position: 'absolute', left: '12px' }}>共 {total} 条记录
                                        第 {this.state.jzCurrent} / {(Math.ceil(total / 3))} 页</div>,
                                    onChange: (page) => {
                                        this.setState({ jzCurrent: page });
                                    },
                                }}
                                dataSource={caseData ? caseData.jzList : []}
                                columns={JzColumns}
                            />
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
