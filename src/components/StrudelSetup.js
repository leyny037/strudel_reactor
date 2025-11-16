import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from '../console-monkey-patch';

export function StrudelSetup() {
    let globalEditor = null;

    const initStrudel = (editorId, canvasId) => {
        console_monkey_patch();
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const drawTime = [-2, 2];

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById(editorId),
            drawTime,
            onDraw: (haps, time) => drawPianoroll({ haps, time, ctx, drawTime, fold: 0 }),
            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import('@strudel/core'),
                    import('@strudel/draw'),
                    import('@strudel/mini'),
                    import('@strudel/tonal'),
                    import('@strudel/webaudio')
                );
                await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
            },
        });
        return globalEditor;
    };

    const ProcessText = () => {
        let replace = "";
        const radio = document.getElementById("radioDJ");
        if (radio && radio.checked) {
            replace = "_";
        }
        return replace;
    };

    const Proc = (editor = globalEditor) => {
        const proc_text = document.getElementById('proc').value;
        const proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText());
        editor?.setCode(proc_text_replaced);
    };

    const SetupButtons = (editor = globalEditor, ProcFn) => {
        const play = document.getElementById('play');
        const stop = document.getElementById('stop');
        const process = document.getElementById('process');
        const processPlay = document.getElementById('process_play');

        play?.addEventListener('click', () => editor.evaluate());
        stop?.addEventListener('click', () => editor.stop());
        process?.addEventListener('click', () => ProcFn(editor));
        processPlay?.addEventListener('click', () => {
            ProcFn(editor);
            editor.evaluate();
        });
    };

    return { initStrudel, Proc, SetupButtons };
}
