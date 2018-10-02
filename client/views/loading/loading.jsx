import React from 'react';
import { Spin } from 'antd';
import style from './style.less'


class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.container}>
                <Spin size="large" />
            </div>
        );
    }
}

export default Loading;