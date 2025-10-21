import React from "react";

/* Handles radio button toggles for instrument states (p1: ON / HUSH) */
export default function InstrumentControls({ onChange }) {
    return (
        <div className="col-md-4">
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="on"
                    defaultChecked
                    onChange={onChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    p1: ON
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    value="hush"
                    onChange={onChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    p1: HUSH
                </label>
            </div>
        </div>
    );
}
