import React, {Component} from "react";
import {Form, Spin} from "antd";
import {connect} from "dva";

class Detail extends Component {
    render() {
        return (
            <div style={{ paddingTop: 100, textAlign: 'center' }}>
               人员档案详情
            </div>
        );
    }
}
export default Form.create()(
    connect((common) => ({ common }))(Detail),
);
