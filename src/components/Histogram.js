import React, { useState, useEffect, useRef } from 'react';
import { min, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { togglesToFill } from '../lib/color';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const baseWidth = 800;
const tickPct = 0.2;

const Histogram = ({ data, impToggle, riskToggle }) => {
    const svgNode = useRef(null);

    const [dimensions, setDimensions] = useState({
        rectSide: null,
        rectPad: null,
        svgH: null,
        svgW: null,
        histH: null,
        histW: null,
        maxY: null,
        trueBins: null
    });

    useEffect(() => {
        setRectAttr();
        drawHistogram();
    }, [data, impToggle, riskToggle]); // Re-render if data or toggles change

    const setRectAttr = () => {
        const binLabels = data.map(d => d.x);
        const binMin = min(binLabels);
        const binMax = max(binLabels);
        const binDiff = binMax - binMin;
        const trueBins = binDiff + 1;
        const rectSide = baseWidth / trueBins;
        const rectPad = rectSide * 0.1;
        const histW = binDiff * (rectSide + rectPad) + rectSide; // no outer pads
        const maxY = max(data.map(d => d.y));
        const histH = maxY * (rectSide + rectPad) + rectSide; // no outer pads

        setDimensions({
            rectSide,
            rectPad,
            svgW: histW + margin.left + margin.right,
            svgH: histH + margin.top + margin.bottom,
            histW,
            histH,
            maxY,
            trueBins
        });
    };

    const drawHistogram = () => {
        // This will now be moved to JSX
        window.scrollTo(0, dimensions.svgH);
    };

    const xScale = scaleLinear()
        .domain([min(data.map(d => d.featVal)), max(data.map(d => d.featVal))])
        .range([0, dimensions.histW]);

    const yScale = scaleLinear()
        .domain([0, dimensions.maxY])
        .range([dimensions.histH, 0]);

    return (
        <svg ref={svgNode} width={dimensions.svgW} height={dimensions.svgH}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {data.map((d, i) => (
                    <rect
                        key={i}
                        stroke="hsl(0, 0%, 15%)"
                        width={dimensions.rectSide}
                        height={dimensions.rectSide}
                        rx={dimensions.rectSide * 0.15}
                        ry={dimensions.rectSide * 0.15}
                        x={d.x * (dimensions.rectSide + dimensions.rectPad)}
                        y={dimensions.histH - d.y * (dimensions.rectSide + dimensions.rectPad) - dimensions.rectSide}
                        fill={togglesToFill(impToggle ? d.imp : null, riskToggle ? d.score : null)}
                        title={d.featVal}
                    />
                ))}
                <g
                    className="xAxis"
                    transform={`translate(0,${dimensions.histH + dimensions.rectPad})`}
                    ref={node => select(node).call(axisBottom(xScale).ticks(Math.round(dimensions.trueBins * tickPct)))}
                />
                <g
                    className="yAxis"
                    transform={`translate(${margin.left - dimensions.rectPad},0)`}
                    ref={node => {
                        const axis = axisLeft(yScale).ticks(Math.round(dimensions.maxY * tickPct));
                        select(node).call(axis).call(g => g.select(".domain").remove());
                    }}
                />
            </g>
        </svg>
    );
}

export default Histogram;