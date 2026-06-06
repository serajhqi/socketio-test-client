import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useStore } from "../../store";
import { sendRequest } from "../../services/socketio";
import { toast } from "sonner";
import "./Request.scss";

const lightTheme = EditorView.theme({
  ".tok-keyword": { color: "#d73a49" },
  ".tok-number": { color: "#005cc5" },
  ".tok-bool": { color: "#d73a49" },
  ".tok-null": { color: "#6f42c1" },
  ".tok-string": { color: "#032f62" },
  ".tok-propertyName": { color: "#0052cc" },
  ".tok-punctuation": { color: "#24292e" },
  ".tok-brace": { color: "#24292e" },
  ".tok-bracket": { color: "#24292e" },
});

const createAppTheme = (isDarkMode: boolean, isJsonMode: boolean) =>
  EditorView.theme({
  "&": {
    background: "transparent !important",
    height: "100%",
    fontSize: "0.8725rem",
    fontFamily: "var(--font-mono)",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "var(--font-mono)",
  },
  ".cm-content": {
    color: isDarkMode ? "#fbbf24" : isJsonMode ? "#1c1c1c" : "#555555",
    caretColor: isDarkMode ? "#fbbf24" : isJsonMode ? "#1c1c1c" : "#555555",
    padding: "1rem",
    lineHeight: "1.65",
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-activeLine": {
    backgroundColor: isDarkMode ? "rgba(251,191,36,0.04)" : "rgba(124,76,31,0.04)",
  },
  ".cm-activeLineGutter": {
    display: "none",
  },
  ".cm-focused": {
    outline: "none !important",
  },
  "&.cm-focused": {
    outline: "none !important",
  },
  ".cm-cursor": {
    borderLeftColor: isDarkMode ? "#fbbf24" : isJsonMode ? "#1c1c1c" : "#555555",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: isDarkMode ? "rgba(79,158,255,0.25)" : "rgba(9,105,218,0.25)",
  },
  ".tok-keyword": { color: isDarkMode ? "#d97706" : "#555555 !important" },
  ".tok-number": { color: isDarkMode ? "#0891b2" : "#555555 !important" },
  ".tok-bool": { color: isDarkMode ? "#db2777" : "#555555 !important" },
  ".tok-null": { color: isDarkMode ? "#9333ea" : "#555555 !important" },
  ".tok-string": { color: isDarkMode ? "#16a34a" : "#555555 !important" },
  ".tok-propertyName": { color: isDarkMode ? "#0284c7" : "#555555 !important" },
  ".tok-punctuation": { color: isDarkMode ? "#737373" : "#555555 !important" },
  ".tok-brace": { color: isDarkMode ? "#737373" : "#555555 !important" },
  ".tok-bracket": { color: isDarkMode ? "#737373" : "#555555 !important" },
  ".cm-placeholder": { color: `${isDarkMode ? "rgba(204,188,188,0.5)" : "#1c1c1c"} !important` },
});

export function Request() {
  const { request, status, theme } = useStore();
  const [emitName, setEmitName] = useState("");
  const [note, setNote] = useState("");
  const [body, setBody] = useState("");
  const [jsonMode, setJsonMode] = useState(true);
  const [editorStatus, setEditorStatus] = useState("");
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const isDarkMode = theme === 'dark';
  const appTheme = useMemo(() => createAppTheme(isDarkMode, jsonMode), [isDarkMode, jsonMode]);

  useEffect(() => {
    if (request) {
      setEmitName(request.emitName || "");
      setNote(request.note || "");
      setBody(request.body || "");
    }
  }, [request]);

  const validateAndSend = useCallback(() => {
    if (!emitName.trim()) {
      toast.error("Event name is required");
      return;
    }
    if (status !== "connected") {
      toast.error("Not connected to server");
      return;
    }

    try {
      useStore.getState().setRequest({
        emitName,
        note: note.trim() || undefined,
        body: body.trim() || undefined,
      });
      sendRequest();
      toast.success(`Sent: ${emitName}`);
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send request");
    }
  }, [emitName, note, body, status]);

  const handleFormat = () => {
    if (!body.trim()) return;
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {
      toast.error("Cannot format: invalid JSON");
    }
  };

  const handleBarKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      validateAndSend();
    }
  };

  const ctrlEnterExtension = EditorView.domEventHandlers({
    keydown(event, view) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        validateAndSend();
        return true;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        view.contentDOM.blur();
        sendBtnRef.current?.focus();
        setEditorStatus("Exited editor. Focus moved to Send button.");
        setTimeout(() => setEditorStatus(""), 2000);
        return true;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault();
        setEditorStatus("Tab inserts indent. Press Escape to exit the editor.");
        setTimeout(() => setEditorStatus(""), 3000);
        return true;
      }
      return false;
    },
  });

  const isConnected = status === "connected";

  const extensions = jsonMode
    ? [json(), isDarkMode ? oneDark : lightTheme, appTheme, ctrlEnterExtension]
    : [appTheme, ctrlEnterExtension];

  return (
    <div className="request-panel">
      <div role="status" aria-live="polite" className="sr-only">
        {editorStatus}
      </div>
      <div className="request-bar">
        <input
          className="request-bar__emit"
          placeholder="Emit Name"
          value={emitName}
          onChange={(e) => setEmitName(e.target.value)}
          onKeyDown={handleBarKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <input
          className="request-bar__note"
          placeholder="# note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleBarKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          className="request-bar__new"
          onClick={() => useStore.getState().clearRequest()}
          title="Create a new request and clear response"
          aria-label="New request. Clear event name, title, body, and response."
        >
          New
        </button>
        <button
          ref={sendBtnRef}
          className="request-bar__send"
          onClick={validateAndSend}
          disabled={!isConnected}
          title="Send (Ctrl+Enter)"
          aria-label="Send request (Ctrl+Enter)"
        >
          <svg width="20" height="20" viewBox="0 0 1024 1024">
            <path d="M85.333333 896 981.333333 512 85.333333 128 85.333333 426.666667 725.333333 512 85.333333 597.333333 85.333333 896Z" />
          </svg>
        </button>
      </div>

      <div
        className="request-editor"
        role="region"
        aria-label="Request body editor. Tab indents. Press Escape to exit the editor."
      >
        <CodeMirror
          value={body}
          onChange={setBody}
          extensions={extensions}
          placeholder={
            jsonMode
              ? 'JSON data (e.g., {"key": "value"})'
              : "Plain text (e.g., werwer)"
          }
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: jsonMode,
            highlightActiveLine: true,
            highlightSelectionMatches: false,
            searchKeymap: false,
            tabSize: 2,
          }}
          theme="none"
          style={{ height: "100%" }}
        />
      </div>

      <div className="request-editor-footer">
        <button
          className="request-editor-footer__btn"
          onClick={handleFormat}
          disabled={!jsonMode}
          title={
            jsonMode ? "Pretty-print JSON" : "Format only works in JSON mode"
          }
          aria-label="Format JSON body"
        >
          Format
        </button>
        <button
          className={`request-editor-footer__btn request-editor-footer__btn--mode ${jsonMode ? "request-editor-footer__btn--active" : ""}`}
          onClick={() => setJsonMode((m) => !m)}
          title={jsonMode ? "Switch to plain text mode" : "Switch to JSON mode"}
          aria-label={
            jsonMode
              ? "Currently JSON mode. Click to switch to plain text."
              : "Currently text mode. Click to switch to JSON."
          }
          aria-pressed={jsonMode}
        >
          {jsonMode ? "JSON" : "Text"}
        </button>
      </div>
    </div>
  );
}
