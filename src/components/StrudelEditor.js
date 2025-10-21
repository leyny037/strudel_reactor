import React from 'react';

export default function StrudelEditor() {
    return (
        <div>
            <h5>Strudel Output</h5>
            <div
                id="editor"
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '8px',
                    height: '300px',
                    background: '#1e1e1e',
                    color: '#fff',
                    overflowY: 'auto'
                }}
            />
        </div>
    );
}
