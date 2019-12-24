import {PageHeaderWrapper} from '@ant-design/pro-layout';
import React, {useState, useEffect} from 'react';
import {Spin, Button, Tag} from 'antd';
import styles from './index.less';
import {connect} from 'dva';
import {ConnectState} from '@/models/connect';
import {routerRedux} from 'dva/router';

import {Dispatch} from 'redux';

interface Tex3Props {
    dispatch: Dispatch
}

const caseFiling = (props: Tex3Props) => {
    const {dispatch} = props;
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 100);
    }, []);

    const click = () => {
        if (dispatch) {
            dispatch({
                type: 'global/changeNavigation',
                payload: {
                    key: '/test3/test5',
                    name: '测试5',
                    path: '/test3/test5',
                    isShow: true
                },
                callback: () => {
                    dispatch(routerRedux.push('/test3/test5'));

                }
            });
        }
    }


    return (
        <div>
            <Button icon="home" type="primary" onClick={click}>添加一个test5新tab</Button>
        </div>

        // <PageHeaderWrapper
        //   content="这是一个新页面，从这里进行开发！"
        // >
        //   <div style={{ paddingTop: 100, textAlign: 'center' }}>
        //     <Spin spinning={loading} size="large"></Spin>
        //   </div>
        // </PageHeaderWrapper>
    );
};


// export default connect(({ global }: ConnectState) => ({
//   navigation: global.navigation,
// }))(Test3);

export default connect(({global}: ConnectState) => ({
    navigationData: global.navigation,
}))(caseFiling);
