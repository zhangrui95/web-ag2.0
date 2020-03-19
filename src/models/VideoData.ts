import {
  getList,
  getJcjCount,
  getAjscCount,
  getCqwscCount,
  getDetail,
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
      //接处警统计
      * getJcjCount({payload, callback}, {call, put}) {
        // const response = yield call(getJcjCount, payload);
        // if (callback && response && !response.error && response.data) {
        let data = [
          {
            name: '警情总数',
            type: 'bar',
            data: [239,134,78,91,66],
            barWidth: 20
          },
          {
            name: '应上传数',
            type: 'bar',
            data: [42,167,90,33,215],
            barWidth: 20
          },
          {
            name: '已上传数',
            type: 'bar',
            data: [22,33,55,12,137],
            barWidth: 20
          },
          {
            name: '未上传数',
            type: 'bar',
            data: [20,101,41,15,98],
            barWidth: 20
          },
          {
            name: '已关联数',
            type: 'bar',
            data: [120,133,45,66,79],
            barWidth: 20
          },
          {
            name: '未关联数',
            type: 'bar',
            data: [43,92,156,22,43],
            barWidth: 20
          },
          {
            name: '上传完成率',
            type: 'line',
            yAxisIndex: 1,
            data: [20.0, 21.2, 33.3, 54.5, 16.3],
            barWidth: 20
          },
          {
            name: '关联比例',
            type: 'line',
            yAxisIndex: 1,
            data: [60.0, 72.2, 85.3, 24.5, 66.3],
            barWidth: 20
          }
        ];
        callback(data);//response.data
        // }
      },
      //案件上传统计
      * getAjscCount({payload, callback}, {call, put}) {
        // const response = yield call(getAjscCount, payload);
        // if (callback && response && !response.error && response.data) {
        let data = [
          {
            name: '上传总数',
            type: 'bar',
            data: [120,249,189],
            barWidth: 20
          },
          {
            name: '已上传总数',
            type: 'bar',
            data: [56,67,20],
            barWidth: 20
          },
          {
            name: '未上传总数',
            type: 'bar',
            data: [122,198,167],
            barWidth: 20
          },
          {
            name: '已关联数',
            type: 'bar',
            data: [20,33,145],
            barWidth: 20
          },
          {
            name: '未关联数',
            type: 'bar',
            data: [143,44,65],
            barWidth: 20
          },
          {
            name: '上传完成率',
            type: 'line',
            yAxisIndex: 1,
            data: [66, 92, 37],
            barWidth: 20
          },
          {
            name: '关联比例',
            type: 'line',
            yAxisIndex: 1,
            data: [78, 36, 83],
            barWidth: 20
          }
        ]
        callback(data);//response.data
        // }
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
      //音视频查看详情
      * getDetail({payload, callback}, {call, put}) {
        // const response = yield call(getDetail, payload);
        // if (callback && response && !response.error && response.data) {
        let data = {
            spgs:'MP4',
            spdx:'16.5M',
            spsc:'00:13:26',
            spcs:'海康威视',
            scyh:'李洋',
            scdw:'抚顺市公安局',
            scsj:'2020-03-02 18:22:37',
            djsb:'接入',
            sjly:'执法记录仪',
        };
        callback(data);//response.data
        // }
      },
    },

    reducers: {

    },
};
