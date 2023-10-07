import React from 'react';
import feattable from '../assets/json/feattable.json';
import range from 'lodash/range';
import zipObject from 'lodash/zipObject';
import sampleSize from 'lodash/sampleSize';

let rTypes = new Set(feattable.map(d => d.rType));
rTypes = Array.from(rTypes);

const hues = range(0, 330, 20);
const colors = hues.map(d => `hsl(${d}, 30%, 40%)`);
const colorMap = zipObject(rTypes, sampleSize(colors, rTypes.length));
const rectSide = 6;
const rectPad = 0.6;
const nCols = 47;
const nRows = 32;
const width = nCols * (rectSide + rectPad) + rectPad;
const height = nRows * (rectSide + rectPad) + rectPad;
const margin = { top: 12, right: 12, bottom: 3, left: 12 };

const Gallery = ({ handleData }) => {

    return (
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {feattable.map((d, i) => (
                    <rect
                        key={i}
                        className="gallery"
                        width={rectSide}
                        height={rectSide}
                        rx={rectSide * 0.15}
                        ry={rectSide * 0.15}
                        x={d.x * (rectSide + rectPad) + rectPad}
                        y={d.y * (rectSide + rectPad) + rectPad}
                        fill={colorMap[d.rType]}
                        onClick={() => handleData(i)}
                    />
                ))}
            </g>
        </svg>
    );
}

export default Gallery;