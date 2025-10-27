import { useEffect } from "react";
import { StrudelSetup } from "./StrudelSetup";

export default function RadioControls() {
    const { Proc } = StrudelSetup();

    const handleChange = () => {
        const globalEditor = window.globalEditor;
        if (globalEditor) {
            Proc(globalEditor);
            globalEditor.evaluate();
        }
    };

    useEffect(() => {
        // could later expand to support multiple radio groups
    }, []);

    return (
        <div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    onChange={handleChange}
                    defaultChecked
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
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    p1: HUSH
                </label>
            </div>
        </div>
    );
}
