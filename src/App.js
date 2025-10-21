import './cors-redirect';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { initStrudel, evalScope, getAudioContext, webaudioOutput, registerSynthSounds, initAudioOnFirstClick, transpiler } from "@strudel/web";
import { StrudelMirror } from '@strudel/codemirror';
import { stranger_tune } from './tunes';

// Components
import StrudelEditor from "./components/StrudelEditor";
import ControlsPanel from "./components/ControlsPanel";
import InstrumentControls from "./components/InstrumentControls";
import PadGrid from "./components/PadGrid";

let globalEditor = null;

export default function StrudelDemo() {
  const hasRun = useRef(false);
  const [procText, setProcText] = useState(stranger_tune);
  const [isReady, setIsReady] = useState(false);
  const [isHushed, setIsHushed] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const setupStrudel = async () => {
      try {
        console.log("Initializing Strudel...");
        await initStrudel();

        const editorRoot = document.getElementById('editor');
        if (!editorRoot) {
          console.error("No editor element found — Strudel editor cannot attach!");
          return;
        }

        globalEditor = new StrudelMirror({
          defaultOutput: webaudioOutput,
          getTime: () => getAudioContext().currentTime,
          transpiler,
          root: editorRoot,
          prebake: async () => {
            initAudioOnFirstClick();
            const loadModules = evalScope(
              import('@strudel/core'),
              import('@strudel/draw'),
              import('@strudel/mini'),
              import('@strudel/tonal'),
              import('@strudel/webaudio'),
            );
            await Promise.all([
              loadModules,
              registerSynthSounds()
            ]);
          },
        });

        // Load initial tune
        globalEditor.setCode(stranger_tune);

        console.log("Strudel initialized");
        setIsReady(true);
      } catch (err) {
        console.error("Error initializing Strudel:", err);
      }
    };

    setupStrudel();
  }, []);

  // Preprocessing function
  const processText = (hushState) => {
    let processed = procText;

    // Replace <p1_Radio> placeholder with _ if hushed
    if (hushState) {
      processed = processed.replaceAll('<p1_Radio>', '_');
    } else {
      processed = processed.replaceAll('<p1_Radio>', '');
    }

    return processed;
    };

    const toggleHush = (value) => {
        const isHush = value === "hush";
        setIsHushed(isHush);

        // Reprocess immediately and optionally replay
        if (globalEditor) {
            const newCode = processText(isHush);
            globalEditor.setCode(newCode);
            globalEditor.evaluate();
        }
    };


  const handleProc = () => {
    if (globalEditor) {
      const newCode = processText(isHushed);
      console.log("Setting processed code...");
      globalEditor.setCode(newCode);
    }
  };

  const handlePlay = () => {
    if (globalEditor) {
      console.log("Playing Strudel tune...");
      globalEditor.evaluate();
    }
  };

  const handleStop = () => {
    if (globalEditor) {
      console.log("Stopping playback...");
      globalEditor.stop();
    }
  };

  const handleProcAndPlay = () => {
    handleProc();
    setTimeout(handlePlay, 300);
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-3">Strudel Demo</h2>

      {/* Control Buttons */}
      <ControlsPanel
        onPlay={handlePlay}
        onStop={handleStop}
        onProc={handleProc}
        onProcPlay={handleProcAndPlay}
      />

      {!isReady && (
        <div className="alert alert-info mt-2">
          Loading Strudel... please wait a few seconds.
        </div>
      )}

      {/* Main Rows */}
      <div className="row mt-4">
        <div className="col-md-8">
          {/* Preprocessing Text Area */}
          <label htmlFor="proc" className="form-label">Text to preprocess:</label>
          <textarea
            id="proc"
            className="form-control"
            rows="10"
            value={procText}
            onChange={(e) => setProcText(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <InstrumentControls onChange={(e) => {
              toggleHush(e.target.value);
            }} 
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <StrudelEditor />
        </div>
        <div className="col-md-4">
          <PadGrid />
        </div>
      </div>
    </div>
  );
}


