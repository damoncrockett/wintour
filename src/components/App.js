import React, { useState, useEffect, useCallback } from 'react';
import Histogram from './Histogram';
import Gallery from './Gallery';
import { bin } from 'd3-array';
import orderBy from 'lodash/orderBy';

const bins = 100;

const App = () => {
    const [riskToggle, setRiskToggle] = useState(false);
    const [impToggle, setImpToggle] = useState(false);
    const [ascToggle, setAscToggle] = useState(false);
    const [featNum, setFeatNum] = useState('0');
    const [data, setData] = useState(null);

    const handleRisk = useCallback(() => setRiskToggle(prevRisk => !prevRisk), []);
    const handleImp = useCallback(() => setImpToggle(prevImp => !prevImp), []);
    const handleAsc = useCallback(() => setAscToggle(prevAsc => !prevAsc), []);
    const handleData = useCallback((i) => setFeatNum(String(i)), []);

    const assignCoords = useCallback((dataToAssign) => {
        const sortOrder = ascToggle ? 'asc' : 'desc';

        const histGenerator = bin()
            .value(d => d.featVal)
            .domain([d3.min(dataToAssign, d => d.featVal), d3.max(dataToAssign, d => d.featVal)])
            .thresholds(bins);

        let processData = histGenerator(dataToAssign).map(d => orderBy(d, 'score', sortOrder));

        processData.forEach((histBin, binNum) => {
            histBin.forEach((item, idx) => {
                item.x = binNum;
                item.y = idx;
            })
        });

        return processData.flat();
    }, [ascToggle]);

    useEffect(() => {
        fetch('http://localhost:8888/' + featNum + '.json')
            .then(response => response.json())
            .then(fetchedData => setData(assignCoords(fetchedData)));
    }, [featNum, assignCoords]);

    useEffect(() => {
        setData(prevData => assignCoords(prevData));
    }, [ascToggle, assignCoords]);

    const riskStyle = {
        backgroundColor: riskToggle ? 'white' : 'hsl(0, 0%, 15%)',
        color: riskToggle ? 'black' : 'hsl(0, 0%, 45%)',
    };
    const impStyle = {
        backgroundColor: impToggle ? 'white' : 'hsl(0, 0%, 15%)',
        color: impToggle ? 'black' : 'hsl(0, 0%, 45%)',
    };
    const ascStyle = {
        backgroundColor: ascToggle ? 'white' : 'hsl(0, 0%, 15%)',
        color: ascToggle ? 'black' : 'hsl(0, 0%, 45%)',
    };

    return (
        <div className='app'>
            <div className='field'>
                <Histogram data={data} riskToggle={riskToggle} impToggle={impToggle} />
            </div>
            <div className='panel'>
                <Gallery handleData={handleData} />
                <div className='buttonStrip'>
                    <button onClick={handleRisk} style={riskStyle}>RISK</button>
                    <button onClick={handleImp} style={impStyle}>IMP</button>
                    <button onClick={handleAsc} style={ascStyle}>ASC</button>
                </div>
            </div>
        </div>
    );
}

export default App;
