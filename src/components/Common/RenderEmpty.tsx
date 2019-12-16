import React, { PureComponent } from 'react';
import {Empty} from "antd";
import noList from "@/assets/viewData/noList.png";

export default class RenderEmpty extends PureComponent {

    render() {
        const { emptyWords } = this.props;
        return (
            <Empty image={noList} description={'暂无数据'}/>
        );
    }
}