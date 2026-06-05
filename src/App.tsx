import { ExportProvider } from "./context/ExportContext";
import { ImageBaseUrlProvider } from "./context/ImageBaseUrlContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Component1 } from "./components/Component1";
import { Component2 } from "./components/Component2";
import { Component3 } from "./components/Component3";
import { GlobalPanel } from "./components/GlobalPanel";

function App() {
  return (
    <div className="app-shell">
      <h1>Zustand vs Context API</h1>
      <p>
        Exemplo prático com notificações, export URL e base URL de imagem em
        duas versões paralelas.
      </p>

      <section className="section">
        <h2>Context API version</h2>
        <NotificationProvider>
          <ExportProvider>
            <ImageBaseUrlProvider>
              <div className="grid">
                <Component1 mode="context" />
                <Component2 mode="context" />
                <Component3 mode="context" />
              </div>
              <GlobalPanel mode="context" />
            </ImageBaseUrlProvider>
          </ExportProvider>
        </NotificationProvider>
      </section>

      <section className="section">
        <h2>Zustand version</h2>
        <div className="grid">
          <Component1 mode="zustand" />
          <Component2 mode="zustand" />
          <Component3 mode="zustand" />
        </div>
        <GlobalPanel mode="zustand" />
      </section>
    </div>
  );
}

export default App;
