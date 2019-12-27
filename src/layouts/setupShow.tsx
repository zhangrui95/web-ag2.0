import React, {Fragment} from 'react';
import ShowSetup from '../pages/systemSetup/ShowSetup/index';
import {message} from "antd";
import styles from './setupShow.less';
import {connect} from "dva";
@connect(({global}) => ({
    global,
}))
class setupShow extends React.PureComponent {
    componentDidMount(){
        let options = {top:20,getContainer: () => document.getElementById('root')};
        message.config(options);
    }
    render() {
        return (
            <div  className={styles.box} id={'messageBoxs'}>
                 <ShowSetup/>
            </div>
        );
    }
}

export default setupShow;
