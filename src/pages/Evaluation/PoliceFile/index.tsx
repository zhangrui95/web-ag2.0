import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Card,
    Form,
    Select,
} from 'antd';
import {getUserInfos} from '../../../utils/utils';
import styles from '../CompanyFile/index.less';
import ZFDATable from '../CompanyFile/zfdaTable';

const {Option} = Select;
let job = getUserInfos() ? getUserInfos().job : '';
let srcName1 = ['mjJbQkDjb', '民警基本情况登记表'];
let srcName2 = ['flPxKsKhQk', '法律培训考试考核情况登记表'];
let srcName3 = ['myMjZfQk', '月民警执法情况总结表'];
let srcName4 = ['xsAjPgb', '刑事案卷评估表'];
// let srcName5 = ['zaXzAjShCpJl','治安（行政）案件审核测评记录'];
let srcName5 = ['ajShSpJl', '达拉特旗公安局案件审核审批记录'];
let srcName6 = ['fzyAjShYjDjb', '法制员案件审核意见登记表'];
let srcName7 = ['xsAjShCpJl', '刑事案件审核测评记录'];
let srcName8 = ['zfzlKpQkDjbMj', '执法质量考评情况登记表'];
let srcName9 = ['mjZfJcQkDjb', '民警执法奖惩情况登记表'];
let srcName10 = ['btsZfxwDjb', '被投诉执法行为登记表（包括行政复议、诉讼、国家赔偿案件、信访案件）'];
let srcName11 = ['zfJcQkJlMj', '执法检查情况记录'];
let srcName12 = ['ygBmJdWs', '有关部门下发的执法监督文书登记表'];
@connect(({common, TzList,global}) => ({
    common,
    TzList,
    global
}))
@Form.create()
export default class PoliceArchives extends PureComponent {
    state = {
        loading: false,
        print: false,
        word: '1',
        jg: (getUserInfos().department.substring(4) !== '00000000' && getUserInfos().department.substring(6) === '000000') && JSON.stringify(job).includes('200003') ? undefined : JSON.stringify({
            id: getUserInfos().group.code,
            label: getUserInfos().group.name,
        }),
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        url: '/Evaluation/File/PoliceFile',
    };

    componentWillMount() {
        this.getDepTree(JSON.parse(sessionStorage.getItem('user')).department);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === this.state.url) {
            this.setState({
                selectedRowsId: nextProps.history.location.query.selectedRowsId,
            });
        }
    }

    change = (e) => {
        this.setState({
            word: e,
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
                    const obj = {
                        id: data[0].code,
                        label: data[0].name,
                    };
                    const objStr = JSON.stringify(obj);
                    this.setState({
                        treeDefaultExpandedKeys: [objStr],
                    });
                }
            },
        });
    };

    render() {
        let table;
        switch (this.state.word) {
            //searchJg表示是否显示机构查询项，searchMonth是否显示日期查询项，searchPolice是否显示民警查询项，searchAjBtn是否显示案件查询按钮，policNum是否需要传民警数量;
            //srcName表示润乾报表名称，ajType 案件类型，刑事，行政或者查询全部;
            case '1':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchPolice={true} srcName={srcName1}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '2':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchPolice={true} srcName={srcName2}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '3':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchPolice={true} searchMonth={true}
                                   srcName={srcName3}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '4':
                table = <ZFDATable jg={this.state.jg} searchAjBtn={true} srcName={srcName4} ajType='xs'
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '5':
                table = <ZFDATable jg={this.state.jg} searchAjBtn={true} srcName={srcName5} ajType='xz'
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '6':
                table = <ZFDATable jg={this.state.jg} searchAjBtn={true} srcName={srcName6}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '7':
                table = <ZFDATable jg={this.state.jg} searchAjBtn={true} srcName={srcName7} ajType='xs'
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '8':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchPolice={true} srcName={srcName8}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '9':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchPolice={true} srcName={srcName9}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '10':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchPolice={true} srcName={srcName10}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '11':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchDay={true} srcName={srcName11}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '12':
                table = <ZFDATable jg={this.state.jg} srcName={srcName12}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
        }
        return (
            <div className={styles.statistics} id={'formPoliceFile'}>
                <Card className={styles.titleArea}>
                    <div className={styles.dwxz}>
                        <Select placeholder="请选择" style={{width: '100%'}} onChange={this.change}
                                getPopupContainer={() => document.getElementById('formPoliceFile')}
                                value={this.state.word}>
                            <Option value="1">民警基本情况登记表</Option>
                            <Option value="2">法律培训考试考核情况登记表</Option>
                            <Option value="3">月民警执法情况总结表</Option>
                            <Option value="4">刑事案卷评估表</Option>
                            <Option value="5">案件审核审批表</Option>
                            <Option value="6">法制员案件审核意见登记表</Option>
                            <Option value="7">刑事案件审核测评记录</Option>
                            <Option value="8">执法质量考评情况登记表</Option>
                            <Option value="9">民警执法奖惩情况登记表</Option>
                            <Option value="10">被投诉执法行为登记表</Option>
                            <Option value="11">执法检查情况记录</Option>
                            <Option value="12">有关部门下发的执法监督文书登记表</Option>
                        </Select>
                    </div>
                </Card>
                {table}
            </div>
        );
    }
}
