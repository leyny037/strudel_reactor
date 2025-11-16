import { useEffect } from "react";
import { StrudelSetup } from "./StrudelSetup";
import { tunes } from "../tunes";

export default function RadioControls() {
    const { Proc } = StrudelSetup();

    const handleChange = (event) => {
        const selectedTune = event.target.value;
        const globalEditor = window.globalEditor;

        if (globalEditor) {
            // Set the editor’s value to the chosen tune code
            globalEditor.setValue(tunes[selectedTune]);

            // Process and evaluate the tune
            Proc(globalEditor);
            globalEditor.evaluate();
        }
    };

    useEffect(() => {
        // could later expand to support more tune presets
    }, []);

    return (
        <div className="dj-radio-group" style={{ marginTop: "10px" }}>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="tuneSelector"
                    id="radioStranger"
                    value="stranger"
                    onChange={handleChange}
                    defaultChecked
                />
                <label className="form-check-label" htmlFor="radioStranger">
                    Stranger Tune
                </label>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="tuneSelector"
                    id="radioDJ"
                    value="dj"
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="radioDJ">
                    DJ Strudel
                </label>
            </div>
        </div>
    );
}
