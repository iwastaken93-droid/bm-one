import React, { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Globe, ZoomIn, ZoomOut } from "lucide-react";
import { getService } from "@/services";

export interface BrowserSurfaceProps {
  surfaceId: string;
  url?: string;
}

export function BrowserSurface({ surfaceId, url = "https://google.com" }: BrowserSurfaceProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [inputUrl, setInputUrl] = useState(url);
  const [zoom, setZoom] = useState(1.0);
  const service = getService();

  const handleNavigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    let target = inputUrl.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = `https://${target}`;
    }
    setCurrentUrl(target);
    await service.navigateBrowserSurface({ surfaceId, url: target });
  };

  return (
    <div className="browser-pane">
      <header className="browser-pane__toolbar">
        <div className="browser-pane__nav">
          <button
            className="chrome-button"
            onClick={() => service.controlBrowserSurface({ surfaceId, action: "back" })}
            title="Back"
            type="button"
          >
            <ArrowLeft size={13} />
          </button>
          <button
            className="chrome-button"
            onClick={() => service.controlBrowserSurface({ surfaceId, action: "forward" })}
            title="Forward"
            type="button"
          >
            <ArrowRight size={13} />
          </button>
          <button
            className="chrome-button"
            onClick={() => service.controlBrowserSurface({ surfaceId, action: "reload" })}
            title="Reload"
            type="button"
          >
            <RotateCw size={13} />
          </button>
        </div>

        <form className="browser-pane__address-form" onSubmit={handleNavigate}>
          <Globe size={13} className="browser-pane__address-icon" />
          <input
            type="text"
            className="browser-pane__address-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Address or search…"
          />
        </form>

        <div className="browser-pane__tools">
          <button
            className="chrome-button"
            onClick={() => {
              const next = Math.max(0.5, zoom - 0.1);
              setZoom(next);
              service.controlBrowserSurface({ surfaceId, action: "zoom", value: next });
            }}
            type="button"
          >
            <ZoomOut size={13} />
          </button>
          <span className="browser-pane__zoom">{Math.round(zoom * 100)}%</span>
          <button
            className="chrome-button"
            onClick={() => {
              const next = Math.min(2.0, zoom + 0.1);
              setZoom(next);
              service.controlBrowserSurface({ surfaceId, action: "zoom", value: next });
            }}
            type="button"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </header>

      <main className="browser-pane__content">
        <iframe
          src={currentUrl}
          title="Browser Preview"
          className="browser-pane__iframe"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </main>
    </div>
  );
}
