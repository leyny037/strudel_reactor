import { useEffect, useRef } from "react";
import { StrudelSetup } from "./StrudelSetup";
import StrudelEditor from "./StrudelEditor";
import ControlPanel from "./ControlPanel";
import RadioControls from "./RadioControls";
import CanvasDisplay from "./CanvasDisplay";
import { stranger_tune } from "../tunes";

export default function StrudelDemo() {
    const hasRun = useRef(false);
    const { initStrudel, Proc, SetupButtons } = StrudelSetup();

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            const globalEditor = initStrudel("editor", "roll");
            document.getElementById("proc").value = stranger_tune;
            SetupButtons(globalEditor, Proc);
            Proc(globalEditor);
        }
    }, [initStrudel, Proc, SetupButtons]);

    return (
        <main className="container-fluid">
            <div className="row">
                <StrudelEditor />
                <ControlPanel />
            </div>

            <div className="row mt-3">
                <div className="col-md-8">
                    <div id="editor" />
                    <div id="output" />
                </div>
                <div className="col-md-4">
                    <RadioControls />
                </div>
            </div>

            <CanvasDisplay />
        </main>
    );
}
