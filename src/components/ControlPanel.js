import React, { useState, useEffect, useCallback } from "react";
import "./ControlPanel.css";
import { BASE_BPM, getStrangerTune } from "../tunes";

export default function ControlPanel() {
    const [activeButton, setActiveButton] = useState(null);
    const [bpm, setBpm] = useState(BASE_BPM); // default BPM
    const [volume, setVolume] = useState(50);

    // BPM slider fill effect
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

    // useEffect for controlling actual volume
    useEffect(() => {
        const player = window.strangerTunePlayer;
        if (player?.output?.gain) {
            player.output.gain.value = volume / 100;
        }
        const slider = document.querySelector("#volume-slider");
        if (slider) {
            const percent = ((volume - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.setProperty("--percent", `${percent}%`);
        }
    }, [volume]);

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

    const handleVolumeChange = (e) => {
        const newVol = parseInt(e.target.value, 10);
        setVolume(newVol);

        // Update volune slider fill
        const slider = e.target;
        const percent = ((newVol - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty("--percent", `${percent}%`);
    };

    // Live FX toggle system
    const [activeFx, setActiveFx] = useState(new Set());

    const playerFx = useCallback((type) => {
        const player = window.strangerTunePlayer;
        if (!player) return;

        const newFx = new Set(activeFx);
        if (newFx.has(type)) newFx.delete(type);
        else newFx.add(type);
        setActiveFx(newFx);

        let fxCode = "";
        newFx.forEach((fx) => {
            switch (fx) {
                case "bassBoost":   // Boost volume, low-pass filter, add slight room effect
                    fxCode += `
                    all(x => x.gain(1.8))
                    all(x => x.lpf(180))
                    all(x => x.room(0.3))`;
                    break;
                case "echo":        // Add echo/delay and increase room effect
                    fxCode += `
                    all(x => x.delay(0.3).gain(0.7))
                    all(x => x.room(0.8))`;
                    break;
                case "filterSweep": // Sweep through low-pass and high-pass frequencies
                    fxCode += `
                    all(x => x.lpf(sine.range(300, 5000)))
                    all(x => x.hpf(sine.range(100, 1000)))`;
                    break;
                case "reverse":     // Reverse the pattern and slow down playback slightly
                    fxCode += `
                    all(x => x.jux(rev))
                    all(x => x.speed(0.8))`;
                    break;
                default:
                    break;
            }
        });

        const newCode = getStrangerTune(bpm) + `\n// Active FX\n${fxCode}\n`;
        player.setCode(newCode);
        player.evaluate?.();
    }, [activeFx, bpm]);

    // Allows user to trigger FX with keys 1–4
    useEffect(() => {
        const handleFxHotkeys = (e) => {
            switch (e.key) {
                case "1":
                    playerFx("bassBoost");
                    break;
                case "2":
                    playerFx("echo");
                    break;
                case "3":
                    playerFx("filterSweep");
                    break;
                case "4":
                    playerFx("reverse");
                    break;
                default: break;
            }
        };
        window.addEventListener("keydown", handleFxHotkeys);
        return () => window.removeEventListener("keydown", handleFxHotkeys);
    }, [playerFx]);


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
        //<div className="col-md-4 control-panel">
        <div className="control-panel horizontal-row">
            <div className="left-column">
                <h3 className="panel-title">Audio Controllers</h3>
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
                    <h3 className="panel-title">Tempo</h3>
                    <input
                        type="range"
                        id="bpm-slider"
                        min="0"
                        max="400"
                        step="1"
                        value={bpm}
                        onChange={handleSliderChange}
                    />

                    <div className="number-container">
                        <input
                            type="number"
                            id="bpm-input"
                            value={bpm}
                            onChange={handleBpmChange}
                            min="0"
                            max="400"
                        />
                    </div>
                </div>

                <div className="slider-container">
                    <h3 className="panel-title">Volume</h3>
                    <input
                        type="range"
                        id="volume-slider"
                        min="1"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                    <div className="number-container">
                        <input
                            type="number"
                            id="volume-input"
                            value={volume}
                            onChange={(e) => handleVolumeChange(e)}
                            min="1"
                            max="100"
                        />
                    </div>
                </div>
            </div>

            <div className="right-column">
                <div className="dj-pad">
                    <h3>Live FX Pad</h3>
                    <div className="pad-grid">
                        <div className="pad-grid fx-row">
                            <button className={`pad-btn pad-bass ${activeFx.has('bassBoost') ? 'active-bass' : ''}`}
                                onClick={() =>
                                    playerFx('bassBoost')}>Bass Boost</button>
                            <button className={`pad-btn pad-echo ${activeFx.has('echo') ? 'active-echo' : ''}`}
                                onClick={() =>
                                    playerFx('echo')}>Echo</button>
                            <button className={`pad-btn pad-filter ${activeFx.has('filterSweep') ? 'active-filter' : ''}`}
                                onClick={() =>
                                    playerFx('filterSweep')}>Filter Sweep</button>
                            <button className={`pad-btn pad-rev ${activeFx.has('reverse') ? 'active-rev' : ''}`}
                                onClick={() =>
                                    playerFx('reverse')}>Reverse Beat</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
