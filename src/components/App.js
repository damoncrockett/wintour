import React, { Component } from 'react';
import Histogram from './Histogram';
import RiskToggle from './RiskToggle';
import jsonData from '../assets/data/json/data.json';

class App extends Component {
    render() {
        return (
            <div>
                <Histogram data={jsonData}/>
                <RiskToggle />
            </div>
        );
    }
}

export default App;
