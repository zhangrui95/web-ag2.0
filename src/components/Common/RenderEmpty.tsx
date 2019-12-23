import React, {PureComponent} from 'react';
import {Empty} from "antd";
import noList from "@/assets/viewData/noList.png";
import noListLight from "@/assets/viewData/noListLight.png";

export default class RenderEmpty extends PureComponent {

    render() {
        const {emptyWords} = this.props;
        return (
            <Empty image={this.props.global && this.props.global.dark ? noList : noListLight} description={'暂无数据'}/>
        );
    }
}