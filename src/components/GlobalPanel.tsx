import { useContext } from "react";
import { ExportContext } from "../context/ExportContext";
import { ImageBaseUrlContext } from "../context/ImageBaseUrlContext";
import { NotificationContext } from "../context/NotificationContext";
import { useExportStore } from "../stores/exportStore";
import { useImageBaseUrlStore } from "../stores/imageBaseUrlStore";
import { useNotificationStore } from "../stores/notificationStore";

type Mode = "context" | "zustand";

export function GlobalPanel({ mode }: { mode: Mode }) {
  const notificationContext = useContext(NotificationContext);
  const exportContext = useContext(ExportContext);
  const imageBaseUrlContext = useContext(ImageBaseUrlContext);

  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const exportUrl = useExportStore((s) => s.exportUrl);
  const clearExportUrl = useExportStore((s) => s.clearExportUrl);
  const imageBaseUrl = useImageBaseUrlStore((s) => s.imageBaseUrl);

  const currentNotifications =
    mode === "context" ? notificationContext?.notifications : notifications;
  const currentExportUrl =
    mode === "context" ? exportContext?.exportUrl : exportUrl;
  const currentImageBaseUrl =
    mode === "context" ? imageBaseUrlContext?.imageBaseUrl : imageBaseUrl;
  const remove =
    mode === "context"
      ? notificationContext?.removeNotification
      : removeNotification;
  const clearUrl =
    mode === "context" ? exportContext?.clearExportUrl : clearExportUrl;

  return (
    <div className="card panel-card">
      <h3>GlobalPanel - {mode === "context" ? "Context API" : "Zustand"}</h3>

      <div className="section-row">
        <div>
          <strong>Notificações</strong>
          {currentNotifications?.length ? (
            <ul>
              {currentNotifications.map((item) => (
                <li key={item.id} className="list-item">
                  <span>{item.text}</span>
                  <button type="button" onClick={() => remove?.(item.id)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma notificação</p>
          )}
        </div>

        <div>
          <strong>Export URL</strong>
          <div className="info-row">
            <span>{currentExportUrl || "nenhuma"}</span>
            {currentExportUrl ? (
              <button type="button" onClick={clearUrl}>
                Remover
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="info-row">
        <strong>Base URL de imagem:</strong>
        <span>{currentImageBaseUrl}</span>
      </div>
    </div>
  );
}
