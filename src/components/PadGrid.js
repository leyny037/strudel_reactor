import React from 'react';

export default function PadGrid() {
    return (
        <div className="mt-4">
            <h5>Performance Mode</h5>
            <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-secondary">Sampler</button>
                <button className="btn btn-secondary">Slicer</button>
                <button className="btn btn-secondary">Hot Cue</button>
                <button className="btn btn-secondary">Hot Loop</button>
            </div>
        </div>
    );
}
