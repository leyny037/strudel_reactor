import { useEffect, useRef} from "react";
import { StrudelSetup } from "./StrudelSetup";
import StrudelEditor from "./StrudelEditor";
import ControlPanel from "./ControlPanel";
import RadioControls from "./RadioControls";
import D3Graph from "./D3Graph";
import { getStrangerTune, BASE_BPM } from "../tunes";

export default function StrudelDemo() {
    const hasRun = useRef(false);
    const { initStrudel, Proc, SetupButtons } = StrudelSetup();

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            const globalEditor = initStrudel("editor", "roll");
            document.getElementById("proc").value = getStrangerTune(BASE_BPM);
            SetupButtons(globalEditor, Proc);
            Proc(globalEditor);

            // Expose Strudel player globally so ControlPanel can access it
            window.strangerTunePlayer = globalEditor;
        }
    }, [initStrudel, Proc, SetupButtons]);

    return (
        <main className="w-full space-y-6">

            {/* D3 Visualizer on top, full width */}
            <div className="col-span-12">
                <D3Graph />
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-5">
                    <ControlPanel />
                </div>

                <div className="col-span-12 md:col-span-7">
                    <StrudelEditor />
                </div>

                {/* Radio / FX controls below the editor, full width */}
                <div className="col-span-12 md:col-span-7 md:col-start-6">
                    <RadioControls />
                </div>
            </div>

             {/*Strudel output */}
            <div
                id="strudel-output"
                className="col-md-8 strudel-editor"
                style={{
                    marginTop: "25px",
                    maxHeight: "50vh",
                    overflowY: "auto",
                    fontSize: "0.8rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    padding: "10px",
                    border: "1px solid #0ff",
                    borderRadius: "6px",
                    backgroundColor: "rgba(0,0,0,0.35)",
                    width: "100%",
                    boxSizing: "border-box"
                }}>
                <div id="editor" style={{ textAlign: "left" }} />
                <div id="output" style={{ textAlign: "left" }} />
            </div>

            <canvas id="roll" className="w-full mt-2" style={{ height: "100px" }} ></canvas>
        </main>
    );
}
