export default function StrudelEditor() {
    return (
        <div className="col-md-8 strudel-editor" style={{
            maxHeight: '50vh',
            overflowY: 'auto',
            marginTop: "25px",
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
            <label htmlFor="proc" className="editor-label">Text to preprocess:</label>
            <textarea className="form-control" rows="15" id="proc"></textarea>
        </div>
    );
}
