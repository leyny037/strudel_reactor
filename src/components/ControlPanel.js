import { useState } from "react";
import "./ControlPanel.css";

export default function ControlPanel() {
    const [activeButton, setActiveButton] = useState(null);

    const handleClick = (id) => {
        setActiveButton(id);

        // Remove glow after 400ms
        setTimeout(() => setActiveButton(null), 400);

        switch (id) {
            case "play":
                console.log("Play clicked");
                break;
            case "stop":
                console.log("Stop clicked");
                break;
            case "process":
                console.log("Preprocess clicked");
                break;
            case "process_play":
                console.log("Proc & Play clicked");
                break;
            default:
                break;
        }
    };

    return (
        <div className="col-md-4 control-panel">
            <nav>
                <button
                    id="process"
                    className={activeButton === "process" ? "active-glow" : ""}
                    onClick={() => handleClick("process")}
                >
                    Preprocess
                </button>
                <button
                    id="process_play"
                    className={activeButton === "process_play" ? "active-glow" : ""}
                    onClick={() => handleClick("process_play")}
                >
                    Proc & Play
                </button>
                <br />
                <button
                    id="play"
                    className={activeButton === "play" ? "active-glow" : ""}
                    onClick={() => handleClick("play")}
                >
                    Play
                </button>
                <button
                    id="stop"
                    className={activeButton === "stop" ? "active-glow" : ""}
                    onClick={() => handleClick("stop")}
                >
                    Stop
                </button>
            </nav>
        </div>
    );
}
