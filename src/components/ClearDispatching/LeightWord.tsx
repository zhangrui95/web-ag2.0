import React, {PureComponent} from 'react';
import {Tooltip} from 'antd';

class LeightWord extends PureComponent {
    getLeight = (string, item) => {
        let reg = new RegExp(item, 'g');
        let result = string.replace(reg, `<b style='color: #f00;'>${item}</b>`);
        return result;
    };

    render() {
        let string = this.props.newsString;
        let strings = this.props.newsString;
        if (this.props.newsString.length > 16) {
            strings = strings.substring(0, 16) + '...';
        }
        const keyWord = this.props.keyWord;
        keyWord.map((item) => {
            string = this.getLeight(string, item);
            strings = this.getLeight(strings, item);
        });
        return (
            <span>
                <Tooltip
                    title={this.props.newsString.length > 16 && this.props.type !== 'all' ?
                        <span dangerouslySetInnerHTML={{__html: string}}></span> : null}>
                    <span dangerouslySetInnerHTML={{__html: this.props.type === 'all' ? string : strings}}></span>
                </Tooltip>
            </span>
        );
    }
}

export default LeightWord;
