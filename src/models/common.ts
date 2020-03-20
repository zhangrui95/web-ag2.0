import {
    getDictType,
    getDepTree,
    getItemsStorage,
    getAllPolice,
    exportData,
    getBaqTree,
    downFile,
    getDeptmentByCodes,
    getNextLevelDeps,
    saveSystemInfo,
    getQueryLowerDept,
    getDepGxTree,
    findSubordinateDeptByCodeAndUids,
    getCaseTypeTree,
    getPlCaseTypeTree,
    getExportEffectServices,
    getSyncTime,
    getCaseManagementDicts,
    getPoliceTypeTreeServices,
    getDepPcsTree,
    getDictTypeOld,
    getfbdwzllxDict,
} from '../services/common';
import {ddjl} from '../services/Dispatch';

export default {
    namespace: 'common',

    state: {
        WtlxBaqTypeData: [],
        WtlxXzAjTypeData: [],
        WtlxJzAjTypeData: [],
        sourceOfAlarmDict: [], // 接警来源字典
        depTree: [], // 机构树
        deptrees: [], // 机构及管辖树
        involvedType: [], // 人员类型
        rqyyType: [], //入区原因
        itemsTypesDict: [], // 财物分类
        itemsTypesDictNew: [], // 分类新版
        WtlxSawpTypeData: [],
        problemTypeDict: [],
        jqproblemTypeDict: [],
        superviseStatusDict: [], // 督办状态
        rectificationStatusDict: [], // 整改完毕状态
        itemsStorage: [],
        allPolice: [],
        libraryPositionType: [],
        itemStatus: [],
        itemStatusS: [],
        searchAjlx: [],
        searchAjzt: [],
        searchWpzl: [],
        searchWpzt: [],
        searchRylx: [],
        searchRyxb: [],
        baqTree: [], // 办案区树
        dossierType: [], // 卷宗类型
        specialCaseType: [], // 专项类别
        CaseStatusType: [], // 刑事案件状态
        XzCaseStatusType: [], // 行政案件状态
        JgsxType: [], //监管事项
        JgdztType: [], //监管点状态
        SjjgType: [], //时间间隔
        TqsjType: [], //提前时间
        ColorType1: [], //一级颜色
        ColorType2: [], //二级颜色
        ColorType3: [], //三级颜色
        caseProcessDict: [], // 办案环节
        dossierSaveTypeDict: [], // 卷宗存储状态
        YJJBType: [],
        TxryType: [],
        JzCaseStatusType: [], // 卷宗告警问题类型
        XsyjType: [],
        XzyjType: [],
        JqyjType: [],
        JqyjVeidoType: [],
        ajVeidoType: [],
        YSLXType: [], // 要素类型
        itemsCode: [],
        pushMattersDict: [], // 推送事项
        pushTypeDict: [], // 推送类型
        pushWayDict: [], // 推送方式
        returnExportEffectData: null, // 图表统计导出功能
        syncTime: {}, // 同步时间
        enforcementTypeDict: [], // 人员强制措施
        handleStatusDict: [], // 警情处理状态
        jqType: [], //警情状态
        xmType: [], //项目类型
        FbdwTypeData:[], // 发布单位
        ZllxTypeData:[], // 资料类型
        TklxTypeData:[], // 题目类型
        DxtTypeData:[], // 单选题分值设定集合
        DxtNumTypeData:[], // 单选题数量设定集合
        mDxtNumTypeData:[], // 多选题数量设定集合
        mDxtTypeData:[], // 多选题分值设定集合
        jdtNumTypeData:[], // 简答题数量设定集合
        jdtTypeData:[], // 简答题分值设定集合
    },

    effects: {
        //根据id,获取字典项
        * getDictType({payload, callback}, {call, put}) {
            const response = yield call(getDictType, payload);

            if (payload.code === '3') {
                // 告警类型
                yield put({
                    type: 'returnWtlxBaqType',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response) {
                    callback(response);
                }
            }
            if (payload.code === '24') {
                //人员类型
                yield put({
                    type: 'involvedType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '21') {
                //入区原因
                yield put({
                    type: 'rqyyType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '1215') {
                // 卷宗类型字典
                yield put({
                    type: 'setDossierType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '2000') {
                // 接警来源字典
                yield put({
                    type: 'setSourceOfAlarmDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '2008' || payload.code === '5308000') {
                // 获取分类
                yield put({
                    type: 'itemsTypes',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '501133' || payload.code === '5308000' ) {
                // 获取分类新版
                yield put({
                    type: 'itemsTypesNew',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '2016' || payload.code === '20160001') {
                //获取问题类型
                yield put({
                    type: 'setProblemTypeDict',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response) {
                    callback(response);
                }
            }
            if (payload.code === '2068' || payload.code === '206800') {
                //获取警情问题类型
                yield put({
                    type: 'setjqProblemTypeDict',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response) {
                    callback(response);
                }
            }
            if (payload.code === '2017') {
                //获取涉案财物的问题类型
                yield put({
                    type: 'returnSawpTypeDict',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response) {
                    callback(response);
                }
            }
            if (payload.code === '2039') {
                //获取督办状态
                yield put({
                    type: 'setSuperviseStatusDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }

            if (payload.code === '2049') {
                //获取库位类型
                yield put({
                    type: 'setLibraryPositionType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '2057') {
                //获取物品状态
                yield put({
                    type: 'setItemStatus',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '501126' || payload.code === '5315000') {
                //获取物品状态新版
                yield put({
                    type: 'setItemStatusS',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5300') {
                // 案件类型
                yield put({
                    type: 'setSearchAjlx',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5303') {
                // 案件状态
                yield put({
                    type: 'setSearchAjzt',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5308'|| payload.code === '5308000') {
                // 财物分类
                yield put({
                    type: 'setSearchWpzl',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5315' || payload.code === '5315000' ) {
                // 财物状态
                yield put({
                    type: 'setSearchWpzt',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5321') {
                // 人员类型
                yield put({
                    type: 'setSearchRylx',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5324') {
                // 人员性别
                yield put({
                    type: 'setSearchRyxb',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '6001' || payload.code === '60010001') {
                // 告警类型
                yield put({
                    type: 'returnXzWtlxAjType',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response) {
                    callback(response);
                }
            }
            if (payload.code === '500286') {
                // 获取卷宗问题类型
                yield put({
                    type: 'returnJzWtlxAjType',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response) {
                    callback(response);
                }
            }
            if (payload.code === '11580') {
                // 专项类别
                yield put({
                    type: 'setSpecialCaseType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500719') {
                // 刑事案件状态
                yield put({
                    type: 'setCaseStatus',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response && !response.error) {
                    callback(response.data);
                }
            }
            if (payload.code === '500729') {
                // 行政案件状态
                yield put({
                    type: 'setXzCaseStatus',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response && !response.error) {
                    callback(response.data);
                }
            }
            if (payload.code === '500847') {
                // 行政案件状态
                yield put({
                    type: 'setYjCaseStatus',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500740') {
                // 整改完毕状态
                yield put({
                    type: 'setRectificationStatusDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500772' || payload.code === '500830') {
                //监管事项
                yield put({
                    type: 'setJgsx',
                    payload: response && response.error === null ? response.data : [],
                });
                if (response && callback) {
                    callback(response.data);
                }
            }
            if (payload.code === '500800') {
                //监管点状态
                yield put({
                    type: 'setJgdzt',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500804') {
                //时间间隔
                yield put({
                    type: 'setSjjg',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500820') {
                //提前时间
                yield put({
                    type: 'setTqsj',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500852') {
                //提前人员
                yield put({
                    type: 'setTxry',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500808') {
                //一级颜色
                yield put({
                    type: 'setColor1',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5007725') {
                // 卷宗告警问题类型
                yield put({
                    type: 'setJzCaseStatus',
                    payload: response && response.error === null ? response.data : [],
                });
                if (callback && response && !response.error) {
                    callback(response.data);
                }
            }
            if (payload.code === '500812') {
                //二级颜色
                yield put({
                    type: 'setColor2',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500816') {
                //三级颜色
                yield put({
                    type: 'setColor3',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5007726' || payload.code === '20160003') {
                //刑事案件预警
                yield put({
                    type: 'setXsyj',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '60010003') {
                //行政案件预警
                yield put({
                    type: 'setXzyj',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '5025300') {
                //行政案件预警
                yield put({
                    type: 'setJqyj',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '61000') {
                //音视频警情预警类型
                yield put({
                    type: 'setVedioJqyj',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '62000') {
                //音视频案件预警类型
                yield put({
                    type: 'setVedioAj',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500837') {
                // 办案环节
                yield put({
                    type: 'setCaseProcessDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500842') {
                // 卷宗存储状态
                yield put({
                    type: 'setDossierSaveTypeDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '2032') {
                // 推送事项
                yield put({
                    type: 'setPushMattersDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500967') {
                // 推送类型
                yield put({
                    type: 'setPushTypeDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '500971') {
                // 推送方式
                yield put({
                    type: 'setPushWayDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '2032') {
                // 我的督办中的要素类型
                yield put({
                    type: 'setMySuperviseTypeDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '501028') {
                // 人员强制措施
                yield put({
                    type: 'setEnforcementDictType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '501046') {
                // 警情状态
                yield put({
                    type: 'setJqType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.code === '501051') {
                // 项目类型
                yield put({
                    type: 'setXmType',
                    payload: response && response.error === null ? response.data : [],
                });
            }
            if (payload.isCaseAll) {
                if (callback && response && !response.error) {
                    callback(response.data);
                }
            }
        },
        //根据id,获取字典项
        * getDictTypeOld({payload, callback}, {call, put}) {
            const response = yield call(getDictTypeOld, payload);
            if (payload.pd&&payload.pd.pid === '2000') {
                // 接警来源字典
                yield put({
                    type: 'setSourceOfAlarmDict',
                    payload: response && response.error === null&&response.data.list ? response.data.list : [],
                });
            }
            if (payload.isCaseAll) {
                if (callback && response && !response.error) {
                    callback(response.data);
                }
            }
        },
        // 获取案管字典项
        * getCaseManagementDicts({payload, callback}, {call, put}) {
            const response = yield call(getCaseManagementDicts, payload);
            if (payload.pd.zdbh === '3') {
                // 警情处理状态
                yield put({
                    type: 'setHandleStatusDict',
                    payload: response && response.error === null ? response.data : [],
                });
            }
        },
        // 获取机构树
        * getDepTree({payload, callback}, {call, put}) {
            const response = yield call(getDepTree, payload);
            yield put({
                type: 'setDepTree',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 获取机构及管辖树
        * getDepAndGxTree({payload, callback}, {call, put}) {
            const response = yield call(getDepGxTree, payload);
            yield put({
                type: 'setDepTrees',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 根据机构代码获取机构信息
        * getDeptmentByCode({payload, callback}, {call, put}) {
            const response = yield call(getDeptmentByCodes, payload);
            yield put({
                type: 'setDeptmentByCode',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 获取所在仓库
        * getItemsStorage({payload, callback}, {call, put}) {
            const response = yield call(getItemsStorage, payload);
            yield put({
                type: 'setItemsStorage',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 获取所有警员
        * getAllPolice({payload, callback}, {call, put}) {
            const response = yield call(getAllPolice, payload);
            yield put({
                type: 'setAllPolice',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 导出
        * exportData({payload, callback}, {call, put}) {
            const user = sessionStorage.getItem('user');
            const userObj = JSON.parse(user);
            const params = {
                // 所有导出请求添加警员编号参数
                pcard: userObj.pcard,
                ...payload,
            };
            const response = yield call(exportData, params);
            if (callback && response) callback(response);
        },
        // 办案区树
        * getBaqTree({payload, callback}, {call, put}) {
            const response = yield call(getBaqTree, payload);
            yield put({
                type: 'setBaqTree',
                payload: response && response.error === null&&response.data&&response.data.list ? response.data.list : [],
            });
            if (callback && !response.error) callback();
        },

        // 案管系统-通过机构码及用户id查询下级机构
        * findSubordinateDeptByCodeAndUid({payload, callback}, {call, put}) {
            const response = yield call(findSubordinateDeptByCodeAndUids, payload);
            if (callback && !response.error) callback(response.data);
        },
        * downFile({payload, callback}, {call, put}) {
            const response = yield call(downFile, payload);
            if (callback && !response.error) callback();
        },
        // 获取下一级机构
        * getNextLevelDeps({payload, callback}, {call, put}) {
            const response = yield call(getNextLevelDeps, payload);
            // yield put({
            //     type: 'setNextLevelDeps',
            //     payload: response && response.error === null ? response.data : [],
            // });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 获取当前机构
        * getQueryLowerDepts({payload, callback}, {call, put}) {
            const response = yield call(getQueryLowerDept, payload);
            if (callback && !response.error && response.data) callback(response.data);
        },
        * saveSystemInfo({payload, callback}, {call, put}) {
            const response = yield call(saveSystemInfo, payload);
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 案件类别树
        * getCaseTypeTree({payload, callback}, {call, put}) {
            const response = yield call(getCaseTypeTree, payload);
            if (callback && response && response.data && !response.error) callback(response.data);
        },
        // 平乐案件类别树
        * getPlCaseTypeTree({payload, callback}, {call, put}) {
            const response = yield call(getPlCaseTypeTree, payload);
            if (callback && response && response.data && !response.error) callback(response.data);
        },
        // 警情类别树
        * getPoliceTypeTree({payload, callback}, {call, put}) {
            const response = yield call(getPoliceTypeTreeServices, payload);
            if (callback && response && response.data && !response.error) callback(response.data);
        },
        // 所内处罚机构类别树
        * getPoliceTypePcsTree({payload, callback}, {call, put}) {
            const response = yield call(getDepPcsTree, payload);
            if (callback && response && response.data && !response.error) callback(response.data);
        },
        // 图表统计导出功能
        * getExportEffect({payload, callback}, {call, put}) {
            const response = yield call(getExportEffectServices, payload);
            yield put({
                type: 'SetExportEffectType',
                payload: response ? response.result : [],
            });
            if (callback) {
                callback(response);
            }
        },
        // 获取同步时间
        * getSyncTime({payload, callback}, {call, put}) {
            const response = yield call(getSyncTime, payload);
            yield put({
                type: 'setSyncTime',
                payload: response && response.error === null ? response.data : [],
            });
            if (callback && !response.error && response.data) callback(response.data);
        },
        // 获取发布单位字典 资料类型字典
        * getfbdwDictType({payload, callback}, {call, put}) {
          const response = yield call(getfbdwzllxDict, payload);
          if (payload.pd.id === '587e4f3b-70c0-448a-a7df-a9ca78d4919a') {
            // 发布单位
            yield put({
              type: 'returnfbdwType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === 'e71fc6ad-d568-4d27-ba9c-00ea0cfdebfb') {
            // 资料类型
            yield put({
              type: 'returnzllxType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === '117b5fb2-953e-4983-835d-c5d082feb9d5') {
            // 题库类型字典项
            yield put({
              type: 'returntklxType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }

          if (payload.pd.id === '169f3e8a-2805-404a-a802-1c160d0e262c') {
            // 单选题分值字典项
            yield put({
              type: 'returndxtType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === '1368b400-c289-4d11-b67c-a79af7269913') {
            // 单选题数量字典项
            yield put({
              type: 'returndxtNumType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === '9f624ef3-01de-457c-a7f4-da1fe2c22bd2') {
            // 多选题分值字典项
            yield put({
              type: 'returnmdxtType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === 'ebbfd1d8-425d-49dc-a9a8-9a3612a8659e') {
            // 多选题数量字典项
            yield put({
              type: 'returnmdxtNumType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === '2186a256-871d-43df-9176-2cd5cf40d1d6') {
            // 简答题数量字典项
            yield put({
              type: 'returnjdtNumType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          if (payload.pd.id === 'd7901059-ed7a-4dc0-93f9-8926ef7ac592') {
            // 简答题分值字典项
            yield put({
              type: 'returnjdtType',
              payload: response && response.error === null && response.data && response.data.list ? response.data.list : [],
            });
            if (callback && response) {
              callback(response);
            }
          }
          // yield put({
          //   type: 'setSyncTime',
          //   payload: response && response.error === null ? response.data : [],
          // });
          // if (callback && !response.error && response.data) callback(response.data);
        },

    },

    reducers: {
        returnWtlxBaqType(state, action) {
            return {
                ...state,
                WtlxBaqTypeData: action.payload,
            };
        },
        returnXzWtlxAjType(state, action) {
            return {
                ...state,
                WtlxXzAjTypeData: action.payload,
            };
        },
        returnJzWtlxAjType(state, action) {
            return {
                ...state,
                WtlxJzAjTypeData: action.payload,
            };
        },
        returnSawpTypeDict(state, action) {
            return {
                ...state,
                WtlxSawpTypeData: action.payload,
            };
        },
        setSourceOfAlarmDict(state, action) {
            return {
                ...state,
                sourceOfAlarmDict: action.payload,
            };
        },
        setDepTree(state, action) {
            return {
                ...state,
                depTree: action.payload,
            };
        },
        setDepTrees(state, action) {
            return {
                ...state,
                deptrees: action.payload,
            };
        },
        setDeptmentByCode(state, action) {
            return {
                ...state,
                itemsCode: action.payload,
            };
        },
        involvedType(state, action) {
            return {
                ...state,
                involvedType: action.payload,
            };
        },
        rqyyType(state, action) {
            return {
                ...state,
                rqyyType: action.payload,
            };
        },
        itemsTypes(state, action) {
            return {
                ...state,
                itemsTypesDict: action.payload,
            };
        },
        itemsTypesNew(state, action) {
            return {
                ...state,
                itemsTypesDictNew: action.payload,
            };
        },
        setProblemTypeDict(state, action) {
            return {
                ...state,
                problemTypeDict: action.payload,
            };
        },
        setjqProblemTypeDict(state, action) {
            return {
                ...state,
                jqproblemTypeDict: action.payload,
            };
        },
        setSuperviseStatusDict(state, action) {
            return {
                ...state,
                superviseStatusDict: action.payload,
            };
        },
        setRectificationStatusDict(state, action) {
            return {
                ...state,
                rectificationStatusDict: action.payload,
            };
        },
        setItemsStorage(state, action) {
            return {
                ...state,
                itemsStorage: action.payload,
            };
        },
        setAllPolice(state, action) {
            return {
                ...state,
                allPolice: action.payload,
            };
        },
        setLibraryPositionType(state, action) {
            return {
                ...state,
                libraryPositionType: action.payload,
            };
        },
        setItemStatus(state, action) {
            return {
                ...state,
                itemStatus: action.payload,
            };
        },
        setItemStatusS(state, action) {
            return {
                ...state,
                itemStatusS: action.payload,
            };
        },
        setSearchAjlx(state, action) {
            return {
                ...state,
                searchAjlx: action.payload,
            };
        },
        setSearchAjzt(state, action) {
            return {
                ...state,
                searchAjzt: action.payload,
            };
        },
        setSearchWpzl(state, action) {
            return {
                ...state,
                searchWpzl: action.payload,
            };
        },
        setSearchWpzt(state, action) {
            return {
                ...state,
                searchWpzt: action.payload,
            };
        },
        setSearchRylx(state, action) {
            return {
                ...state,
                searchRylx: action.payload,
            };
        },
        setSearchRyxb(state, action) {
            return {
                ...state,
                searchRyxb: action.payload,
            };
        },
        setBaqTree(state, action) {
            return {
                ...state,
                baqTree: action.payload,
            };
        },
        setDossierType(state, action) {
            return {
                ...state,
                dossierType: action.payload,
            };
        },
        setSpecialCaseType(state, action) {
            return {
                ...state,
                specialCaseType: action.payload,
            };
        },
        setCaseStatus(state, action) {
            return {
                ...state,
                CaseStatusType: action.payload,
            };
        },
        setXzCaseStatus(state, action) {
            return {
                ...state,
                XzCaseStatusType: action.payload,
            };
        },
        setJgsx(state, action) {
            return {
                ...state,
                JgsxType: action.payload,
            };
        },
        setJgdzt(state, action) {
            return {
                ...state,
                JgdztType: action.payload,
            };
        },
        setSjjg(state, action) {
            return {
                ...state,
                SjjgType: action.payload,
            };
        },
        setTqsj(state, action) {
            return {
                ...state,
                TqsjType: action.payload,
            };
        },
        setTxry(state, action) {
            return {
                ...state,
                TxryType: action.payload,
            };
        },
        setColor1(state, action) {
            return {
                ...state,
                ColorType1: action.payload,
            };
        },
        setColor2(state, action) {
            return {
                ...state,
                ColorType2: action.payload,
            };
        },
        setColor3(state, action) {
            return {
                ...state,
                ColorType3: action.payload,
            };
        },
        setCaseProcessDict(state, action) {
            return {
                ...state,
                caseProcessDict: action.payload,
            };
        },
        setDossierSaveTypeDict(state, action) {
            return {
                ...state,
                dossierSaveTypeDict: action.payload,
            };
        },
        setYjCaseStatus(state, action) {
            return {
                ...state,
                YJJBType: action.payload,
            };
        },
        setXsyj(state, action) {
            return {
                ...state,
                XsyjType: action.payload,
            };
        },
        setXzyj(state, action) {
            return {
                ...state,
                XzyjType: action.payload,
            };
        },
        setJqyj(state, action) {
            return {
                ...state,
                JqyjType: action.payload,
            };
        },
        setVedioJqyj(state, action) {
            return {
                ...state,
                JqyjVeidoType: action.payload,
            };
        },
        setVedioAj(state, action) {
            return {
                ...state,
                ajVeidoType: action.payload,
            };
        },
        setJzCaseStatus(state, action) {
            return {
                ...state,
                JzCaseStatusType: action.payload,
            };
        },
        setMySuperviseTypeDict(state, action) {
            return {
                ...state,
                YSLXType: action.payload,
            };
        },
        setPushMattersDict(state, action) {
            return {
                ...state,
                pushMattersDict: action.payload,
            };
        },
        setPushTypeDict(state, action) {
            return {
                ...state,
                pushTypeDict: action.payload,
            };
        },
        setPushWayDict(state, action) {
            return {
                ...state,
                pushWayDict: action.payload,
            };
        },
        SetExportEffectType(state, action) {
            return {
                ...state,
                returnExportEffectData: action.payload,
            };
        },
        setSyncTime(state, action) {
            return {
                ...state,
                syncTime: action.payload,
            };
        },
        setEnforcementDictType(state, action) {
            return {
                ...state,
                enforcementTypeDict: action.payload,
            };
        },
        setJqType(state, action) {
            return {
                ...state,
                jqType: action.payload,
            };
        },
        setXmType(state, action) {
            return {
                ...state,
                xmType: action.payload,
            };
        },
        setHandleStatusDict(state, action) {
            return {
                ...state,
                handleStatusDict: action.payload,
            };
        },
        returnfbdwType(state, action) {
          return {
            ...state,
            FbdwTypeData: action.payload,
          };
        },
        returnzllxType(state, action) {
          return {
            ...state,
            ZllxTypeData: action.payload,
          };
        },
        returntklxType(state, action) {
          return {
            ...state,
            TklxTypeData: action.payload,
          };
        },
        returndxtType(state, action) {
          return {
            ...state,
            DxtTypeData: action.payload,
          };
        },
        returndxtNumType(state, action) {
          return {
            ...state,
            DxtNumTypeData: action.payload,
          };
        },
        returnmdxtNumType(state, action) {
          return {
            ...state,
            mDxtNumTypeData: action.payload,
          };
        },
        returnmdxtType(state, action) {
          return {
            ...state,
            mDxtTypeData: action.payload,
          };
        },
        returnjdtNumType(state, action) {
          return {
            ...state,
            jdtNumTypeData: action.payload,
          };
        },
        returnjdtType(state, action) {
          return {
            ...state,
            jdtTypeData: action.payload,
          };
        },
    },
};
