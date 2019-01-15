import React, { Component } from 'react';
import Histogram from './Histogram';
import jsonData from '../assets/data/json/data.json';

class App extends Component {
    render() {
        return (
            <div>
                <Histogram data={jsonData}/>
            </div>
        );
    }
}

export default App;
