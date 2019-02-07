import React from 'react';

const PlotToggles = (props) => {
  return (
    <div>
      <button onClick={props.handleRisk}>{'RISK'}</button>
      <button onClick={props.handleImp}>{'IMP'}</button>
      <button onClick={props.handleAsc}>{'ASC'}</button>
    </div>
  );
};

export default PlotToggles;
