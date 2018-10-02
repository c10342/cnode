import React from 'react';

import TabBar from './tab-bar/tab-bar.jsx'

import style from './style.less'

import '../base.css'
import Helement from 'react-helmet'


import router from '../config/router.jsx'



class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Helement>
                    <title>cnode</title>
                    <meta name='keywords' content='cnode'/>
                    <meta name="description" content="cnode,mobx,react,ssr" />
                    <meta name='author' content='c10342'/>
                </Helement>
                <TabBar/>
                <div className={style["main-container"]}>
                    {router()}
                </div>
            </div>
        )
    }
}



export default App;