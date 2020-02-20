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
            maxLen:90,
        };
    }
    componentDidMount(){
        window.addEventListener('resize',()=>{
            const obj1 = document.getElementsByTagName('body');
            const objwidth = obj1[0].clientWidth;
            let maxLen = '';
            if(objwidth<1280){
                maxLen = 35;
            }else if(objwidth>=1280 && objwidth < 1360){
                maxLen = 45;
            }else if(objwidth>=1360 && objwidth < 1440 ){
                maxLen=50;
            }else if(objwidth>=1440 && objwidth < 1600){
                maxLen=60;
            }else if(objwidth>=1600 && objwidth < 1680){
                maxLen=70;
            }else if(objwidth>=1680 && objwidth < 1920){
                maxLen=80;
            }else if(objwidth>=1920){
                maxLen=90;
            }else if(objwidth>=2500){
                maxLen=160;
            }
            this.setState({
                maxLen,
            });
        });
    }
    componentWillReceiveProps(nextProps){
        if(this.props.word !== nextProps.word){
            this.setState({
                wordLen:this.realSubstring(nextProps.word),
            });
        }
    }
    //多行详情展开，收起
    getShow = () =>{
        this.setState({
            show:!this.state.show,
        })
    }
    realLength = (word) =>{
        return word.replace(/[^\x00-\xff]/g, "**").length; // [^\x00-\xff] - 匹配非双字节的字符
    }
    realSubstring = (word) =>{
        let strLen = word.length;
        if(this.realLength(word)<=strLen){
            return strLen;
        }else{
            return Math.floor(this.realLength(word)/2);
        }
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
                    {this.props.word && this.state.wordLen > this.state.maxLen ? <span className={styles.linesBtn} style={{float: "left", marginLeft: 5}}
                          onClick={this.getShow}>展开<Icon type="down"/></span> : ''}
                </div>}
            </div>
        );
    }
};

