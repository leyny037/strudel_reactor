import React from 'react';
export default function ControlsPanel({ onPlay, onStop, onProc, onProcPlay }) {
    return (
        <div className="d-flex gap-2 mb-3">
            <button className="btn btn-outline-primary" onClick={onProc}>Preprocess</button>
            <button className="btn btn-outline-primary" onClick={onProcPlay}>Proc & Play</button>
            <button className="btn btn-outline-primary" onClick={onPlay}>Play</button>
            <button className="btn btn-outline-danger" onClick={onStop}>Stop</button>
        </div>
    );
}