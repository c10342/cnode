import React from 'react';

class Err extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p style={{fontSize:24,fontWeight:'bold',lineHeight:'300px',textAlign:'center'}}>请求的页面出错</p>
            </div>
        );
    }
}

export default Err;