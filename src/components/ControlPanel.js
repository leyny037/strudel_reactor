export default function ControlPanel() {
    return (
        <div className="col-md-4">
            <nav>
                <button id="process" className="btn btn-outline-primary m-1">Preprocess</button>
                <button id="process_play" className="btn btn-outline-primary m-1">Proc & Play</button>
                <br />
                <button id="play" className="btn btn-outline-success m-1">Play</button>
                <button id="stop" className="btn btn-outline-danger m-1">Stop</button>
            </nav>
        </div>
    );
}
