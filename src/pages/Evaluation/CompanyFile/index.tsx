import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Form,
    Select,
    Card
} from 'antd';
import {getUserInfos} from '../../../utils/utils';
import styles from './index.less';
import ZFDATable from './zfdaTable';

const {Option} = Select;
let job = getUserInfos() ? getUserInfos().job : '';
let srcName1 = ['dwJbQkDjb', '单位基本情况登记表'];
let srcName2 = ['zfywpxKsQkDjb', '执法业务培训考试情况登记表'];
let srcName3 = ['yDwzfQkZjB', '每月单位执法情况总结'];
let srcName4 = ['xsAjPgb', '刑事案卷评估表'];
// let srcName5 = ['zaXzAjPgb','治安（行政）案卷评估表'];
let srcName5 = ['ajShSpJl', '达拉特旗公安局案件审核审批记录'];
let srcName6 = ['fzyAjShYjDjb', '法制员案件审核意见登记表'];
let srcName7 = ['fzddAjShCpb', '法制大队案件审核测评表'];
let srcName8 = ['zfzlKpQkDjb', '单位执法质量考评情况登记表'];
let srcName9 = ['xzFySsGjPcAjTjb', '行政复议、诉讼、国家赔偿案件统计表'];
let srcName10 = ['xfTsAjDjb', '信访投诉案件登记表'];
let srcName11 = ['zfJcQkJl', '单位执法检查情况记录'];
let srcName12 = ['ygBmJdWs', '有关部门下发的执法监督文书登记表'];
@connect(({common, TzList,global}) => ({
    common,
    TzList,
    global
}))
@Form.create()
export default class UnitArchives extends PureComponent {
    state = {
        loading: false,
        print: false,
        word: '1',
        jg: (getUserInfos().department.substring(4) !== '00000000' && getUserInfos().department.substring(6) === '000000') && JSON.stringify(job).includes('200003') ? undefined : JSON.stringify({
            id: getUserInfos().group.code,
            label: getUserInfos().group.name,
        }),
        treeDefaultExpandedKeys: [], // 办案单位树默认展开keys
        url: '/Evaluation/File/CompanyFile',
        selectedRowsId: [],
    };

    componentWillMount() {
        this.getDepTree(JSON.parse(sessionStorage.getItem('user')).department);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.global.isResetList.isReset !== nextProps.global.isResetList.isReset && nextProps.global.isResetList.url === '/Evaluation/File/CompanyFile') {
            this.setState({
                selectedRowsId: nextProps.history.location.query.selectedRowsId,
            });
        }
    }

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
    change = (e) => {
        this.setState({
            word: e,
        });
    };

    render() {
        let table;
        switch (this.state.word) {
            //searchJg表示是否显示机构查询项，searchMonth是否显示日期查询项，searchAjBtn是否案件查询按钮，policNum是否需要传民警数量;
            //srcName表示润乾报表名称，ajType 案件类型，刑事，行政或者查询全部;
            case '1':
                table = <ZFDATable searchJg={true} srcName={srcName1}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '2':
                table = <ZFDATable jg={this.state.jg} searchJg={true} srcName={srcName2}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '3':
                table =
                    <ZFDATable jg={this.state.jg} searchJg={true} searchMonth={true} srcName={srcName3} policNum={true}
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
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}{...this.state}/>;
                break;
            case '7':
                table = <ZFDATable jg={this.state.jg} searchAjBtn={true} srcName={srcName7}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '8':
                table = <ZFDATable jg={this.state.jg} searchJg={true} srcName={srcName8}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '9':
                table = <ZFDATable jg={this.state.jg} searchAjBtn={true} srcName={srcName9} ajType='xz'
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '10':
                table = <ZFDATable jg={this.state.jg} srcName={srcName10}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '11':
                table = <ZFDATable jg={this.state.jg} searchJg={true} searchDay={true} srcName={srcName11}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys} {...this.state}/>;
                break;
            case '12':
                table = <ZFDATable jg={this.state.jg} srcName={srcName12}
                                   treeDefaultExpandedKeys={this.state.treeDefaultExpandedKeys}{...this.state}/>;
                break;
        }
        return (
            <div className={styles.statistics} id={'formCompanyFile'}>
                <Card className={styles.titleArea}>
                    <div className={styles.dwxz}>
                        <Select placeholder="请选择" style={{width: '100%'}} onChange={this.change}
                                getPopupContainer={() => document.getElementById('formCompanyFile')}
                                value={this.state.word}>
                            <Option value="1">单位基本情况登记表</Option>
                            <Option value="2">执法业务培训考试情况登记表</Option>
                            <Option value="3">月单位执法情况总结</Option>
                            <Option value="4">刑事案卷评估表</Option>
                            {/*<Option value="5">治安（行政）案卷评估表</Option>*/}
                            <Option value="5">案件审核审批表</Option>
                            <Option value="6">法制员案件审核意见登记表</Option>
                            <Option value="7">法制大队案件审核测评表</Option>
                            <Option value="8">执法质量考评情况登记表</Option>
                            <Option value="9">行政复议、诉讼、国家赔偿案件统计表</Option>
                            <Option value="10">信访投诉案件登记表</Option>
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
