import React, {useState, useEffect, PureComponent} from 'react';
import {Col, Icon, Row} from 'antd';
import liststyles from "../Common/detailShow.less";
import styles from "@/pages/lawEnforcement/docDetail.less";
import Ellipsis from "ant-design-pro/lib/Ellipsis";
import {authorityIsTrue} from "@/utils/authority";
import {userAuthorityCode} from "@/utils/utils";
import {connect} from "dva";
@connect(({global}) => ({
    global
}))
export default class detailShow extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
        };
    }

    //多行详情展开，收起
    getShow = () =>{
        this.setState({
            show:!this.state.show,
        })
    }
    render() {
        let paddingLeft = this.props.paddingLeft ? {paddingLeft:this.props.paddingLeft} : {};
        return (
            <div className={this.props.global&&this.props.global.dark ? '' : styles.detailBoxLight}>
                {this.state.show ? <div className={liststyles.Indextail} style={paddingLeft}>
                    {this.props.word ? this.props.word : ''}
                    <span className={styles.linesBtn} onClick={this.getShow}> 收起<Icon type="up"/></span>
                </div> : <div className={liststyles.Indextail} style={paddingLeft}>
                    <Ellipsis style={{float: "left", width: 'auto', maxWidth: "calc(100% - 50px)"}} lines={1}>
                        {this.props.word ? this.props.word : ''}
                    </Ellipsis>
                    {this.props.word ? <span className={styles.linesBtn} style={{float: "left", marginLeft: 5}}
                          onClick={this.getShow}>展开<Icon type="down"/></span> : ''}
                </div>}
            </div>
        );
    }
};

