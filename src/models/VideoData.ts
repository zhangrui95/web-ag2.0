import {
  getList,
  getJcjCount,
  getAjscCount,
  getCqwscCount,
  getDetail,
    getGlJq,
    getGlAj,
    addAudioVideoGL,
    cancelAudioVideoGL,
    delAudioAndVideoByid
} from '../services/VideoDate';

export default {
    namespace: 'VideoDate',

    state: {
        Unarea: [],
    },

    effects: {
      //音视频列表
        * getList({payload, callback}, {call, put}) {
            const response = yield call(getList, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        //音视频列表详情
        * getDetail({payload, callback}, {call, put}) {
            const response = yield call(getDetail, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        //音视频详情添加关联警情
        * getGlJq({payload, callback}, {call, put}) {
            const response = yield call(getGlJq, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        //音视频详情添加关联案件
        * getGlAj({payload, callback}, {call, put}) {
            const response = yield call(getGlAj, payload);
            if (callback && response && !response.error && response.data) {
                callback(response.data);
            }
        },
        //音视频详情添加关联保存
        * addAudioVideoGL({payload, callback}, {call, put}) {
            const response = yield call(addAudioVideoGL, payload);
            if (callback && response && !response.error) {
                callback(response);
            }
        },
        //音视频详情取消关联
        * cancelAudioVideoGL({payload, callback}, {call, put}) {
            const response = yield call(cancelAudioVideoGL, payload);
            if (callback && response && !response.error) {
                callback(response);
            }
        },
        //删除音视频
        * delAudioAndVideoByid({payload, callback}, {call, put}) {
            const response = yield call(delAudioAndVideoByid, payload);
            if (callback && response && !response.error) {
                callback(response);
            }
        },
      //接处警统计
      * getJcjCount({payload, callback}, {call, put}) {
          const response = yield call(getJcjCount, payload);
          if (callback && response && !response.error && response.data) {
              callback(response.data);
          }
      },
      //案件上传统计
      * getAjscCount({payload, callback}, {call, put}) {
        const response = yield call(getAjscCount, payload);
        if (callback && response && !response.error && response.data) {
                callback(response.data);//response.data
        }
      },
      //超期未上传统计
      * getCqwscCount({payload, callback}, {call, put}) {
        // const response = yield call(getCqwscCount, payload);
        // if (callback && response && !response.error && response.data) {
        let data = [
          {
            name: '警情',
            type: 'bar',
            data: [20,49,18,45,32],
            barWidth: 20
          },
          {
            name: '案件',
            type: 'bar',
            data: [6,37,21,56,44],
            barWidth: 20
          },
        ];
        callback(data);//response.data
        // }
      },
    },

    reducers: {

    },
};
