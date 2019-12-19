import {
  itemDatas,
  getSawpXqById,
  ItemDatasView,
  ItemCRKDatasView,
  ItemZKNumDatasView,
  ItemWpqsDatasView,
} from '../services/itemData';

export default {
  namespace: 'itemData',

  state: {
    item: [],
    itemDetails: [],
    loading: true,
    returnDataView: [],
    returnCRKDataView: [],
    returnZKNumDataView: [],
    returnWpqsDataView: [],
  },

  effects: {
    *itemFetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(itemDatas, payload);
      yield put({
        type: 'itemSearch',
        payload: response && response.error === null ? response.data : {},
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 按ID查询物品详情
    *getSawpXqById({ payload, callback }, { call, put }) {
      const response = yield call(getSawpXqById, payload);
      yield put({
        type: 'itemDetail',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 数据展示
    *itemDataView({ payload, callback }, { call, put }) {
      const response = yield call(ItemDatasView, payload);
      yield put({
        type: 'setItemDataView',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 物品出入框情况
    *itemCRKDataView({ payload, callback }, { call, put }) {
      const response = yield call(ItemCRKDatasView, payload);
      yield put({
        type: 'setItemCRKDataView',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 在库物品数量展示
    *itemZKNumDataView({ payload, callback }, { call, put }) {
      const response = yield call(ItemZKNumDatasView, payload);
      yield put({
        type: 'setItemZKNumDataView',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
    // 物品趋势
    *itemWpqsDataView({ payload, callback }, { call, put }) {
      const response = yield call(ItemWpqsDatasView, payload);
      yield put({
        type: 'setItemWpqsDataView',
        payload: response && response.error === null ? response.data : {},
      });
      if (callback && response && !response.error&& response.data) {
        callback(response.data);
      }
    },
  },

  reducers: {
    itemSearch(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
    itemDetail(state, action) {
      return {
        ...state,
        itemDetails: action.payload,
      };
    },
    setItemDataView(state, action) {
      return {
        ...state,
        returnDataView: action.payload,
      };
    },
    setItemCRKDataView(state, action) {
      return {
        ...state,
        returnCRKDataView: action.payload,
      };
    },
    setItemZKNumDataView(state, action) {
      return {
        ...state,
        returnZKNumDataView: action.payload,
      };
    },
    setItemWpqsDataView(state, action) {
      return {
        ...state,
        returnWpqsDataView: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
