import { useContext, useState, type FormEvent } from "react";
import { ExportContext } from "../context/ExportContext";
import { ImageBaseUrlContext } from "../context/ImageBaseUrlContext";
import { NotificationContext } from "../context/NotificationContext";
import { useExportStore } from "../stores/exportStore";
import { useImageBaseUrlStore } from "../stores/imageBaseUrlStore";
import { useNotificationStore } from "../stores/notificationStore";

type Mode = "context" | "zustand";

export function Component1({ mode }: { mode: Mode }) {
  const [notificationText, setNotificationText] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const notificationContext = useContext(NotificationContext);
  const exportContext = useContext(ExportContext);
  const imageBaseUrlContext = useContext(ImageBaseUrlContext);

  const addNotification = useNotificationStore((s) => s.addNotification);
  const exportUrl = useExportStore((s) => s.exportUrl);
  const setExportUrl = useExportStore((s) => s.setExportUrl);
  const imageBaseUrl = useImageBaseUrlStore((s) => s.imageBaseUrl);

  const handleNotificationSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = notificationText.trim();
    if (!text) return;

    if (mode === "context") {
      notificationContext?.addNotification(text);
    } else {
      addNotification(text);
    }

    setNotificationText("");
  };

  const handleExportSubmit = (event: FormEvent) => {
    event.preventDefault();
    const url = urlInput.trim();
    if (!url) return;

    if (mode === "context") {
      exportContext?.setExportUrl(url);
    } else {
      setExportUrl(url);
    }

    setUrlInput("");
  };

  const currentExportUrl =
    mode === "context" ? exportContext?.exportUrl : exportUrl;
  const currentImageBaseUrl =
    mode === "context" ? imageBaseUrlContext?.imageBaseUrl : imageBaseUrl;

  return (
    <div className="card">
      <h3>Component 1 - {mode === "context" ? "Context API" : "Zustand"}</h3>

      <form onSubmit={handleNotificationSubmit} className="form-row">
        <label>
          Notificação
          <input
            value={notificationText}
            onChange={(event) => setNotificationText(event.target.value)}
            placeholder="Texto da notificação"
          />
        </label>
        <button type="submit">Adicionar</button>
      </form>

      <form onSubmit={handleExportSubmit} className="form-row">
        <label>
          Export URL
          <input
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="https://..."
            disabled={Boolean(currentExportUrl)}
          />
        </label>
        <button type="submit" disabled={Boolean(currentExportUrl)}>
          Definir URL
        </button>
      </form>

      <div className="info-row">
        <strong>Base URL de imagem:</strong>
        <span>{currentImageBaseUrl}</span>
      </div>

      <div className="info-row">
        <strong>Export URL atual:</strong>
        <span>{currentExportUrl || "nenhuma"}</span>
      </div>
    </div>
  );
}
