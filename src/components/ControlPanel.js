import React, { useState, useEffect } from "react";
import "./ControlPanel.css";
import { BASE_BPM, getStrangerTune } from "../tunes";

export default function ControlPanel() {
    const [activeButton, setActiveButton] = useState(null);
    const [bpm, setBpm] = useState(BASE_BPM); // default BPM

    // Slider fill effect
    useEffect(() => {
        const slider = document.querySelector("#bpm-slider");

        function updateSlider() {
            const value = slider.value;
            const max = slider.max;
            const percent = (value / max) * 100;

            // Set CSS variable for Chrome
            slider.style.setProperty('--percent', percent + '%');
        }        
        updateSlider(); // Reflect the current value

        // Add event listener
        slider.addEventListener("input", updateSlider);

        // Cleanup
        return () => slider.removeEventListener("input", updateSlider);
    }, []);

    const handleClick = (id) => {
        const player = window.strangerTunePlayer;
        if (!player) return;

        if (id === "stop") {
            setActiveButton(null);
            console.log("Stop clicked");
            return;
        }
        setActiveButton((prev) => (prev === id ? null : id));

        switch (id) {
            case "play":
                player.evaluate?.();
                break;
            case "process":
                player.stop?.();
                break;
            case "process_play":
                player.stop?.();
                player.evaluate?.();
                break;
            default:
                break;
        }
    };

    const updateBpm = (newBpm) => {
        const player = window.strangerTunePlayer;
        if (!player) return;

        setBpm(newBpm);

        // Generate updated Strudel code with new BPM
        const newCode = getStrangerTune(newBpm);

        // Update textarea (#proc) live so user sees the new BPM in editor
        const procText = document.getElementById("proc");
        if (procText) {
            procText.value = newCode;
        }

        // Update Strudel editor + audio
        player.setCode(newCode);
        player.output?.setCps(newBpm / 60 / 4);
    };

    const playerFx = (type) => {
        const player = window.strangerTunePlayer;
        if (!player) return;

        switch (type) {
            case 'bassBoost':
                player.output?.setFilter?.('bass', Math.random() * 0.8 + 0.2);
                break;
            case 'echo':
                player.output?.setEcho?.(Math.random() * 0.7);
                break;
            case 'filterSweep':
                player.output?.setFilter?.('lowpass', Math.random() * 0.9);
                break;
            case 'reverse':
                player.evaluate?.('rev $ n "bd sn cp"');
                break;
            default:
                break;
        }
    };


    const handleSliderChange = (e) => {
        const newBpm = parseInt(e.target.value, 10);
        updateBpm(newBpm);
    };

    const handleBpmChange = (e) => {
        let newBpm = parseInt(e.target.value, 10);
        if (isNaN(newBpm)) newBpm = BASE_BPM;
        if (newBpm < 0) newBpm = 0;
        if (newBpm > 400) newBpm = 400;
        updateBpm(newBpm);
    };

    return (
        <div className="col-md-4 control-panel">
            <h3 style={{ textAlign: "center", marginBottom: "12px" }}>Audio Controllers</h3>
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

            <div className="slider-container">
                <h3 style={{ textAlign: "center", marginBottom: "12px" }}>Beat</h3>
                <input
                    type="range"
                    id="bpm-slider"
                    min="0"
                    max="400"
                    step="1"
                    value={bpm}
                    onChange={handleSliderChange}
                />

                <div className="bpm-container">
                    <input
                        type="number"
                        id="bpm-input"
                        value={bpm}
                        onChange={handleBpmChange}
                        min="0"
                        max="400"
                        style={{ textAlign: "center" }}
                    />
                </div>
            </div>

            <div className="dj-pad">
                <h3>Live FX Pad</h3>
                <div className="pad-grid">
                    <button className="pad-btn pad-bass" onClick={() => playerFx('bassBoost')}>Bass Boost</button>
                    <button className="pad-btn pad-echo" onClick={() => playerFx('echo')}>Echo</button>
                    <button className="pad-btn pad-filter" onClick={() => playerFx('filterSweep')}>Filter Sweep</button>
                    <button className="pad-btn pad-rev" onClick={() => playerFx('reverse')}>Reverse Beat</button>
                </div>
            </div>
        </div>
    );
}
