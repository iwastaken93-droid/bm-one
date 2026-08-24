import React, { useState } from "react";
import type { PluginDescriptor } from "@/types";
import { Puzzle, Search } from "lucide-react";

export const BUILTIN_PLUGINS: PluginDescriptor[] = [
  { id: "apollo", name: "Apollo", vendor: "Apollo.io", summary: "Find leads and enrich contacts mid-task.", authentication: "oauthMCP", prefersDarkTile: true, logo: { file: "plugin-apollo" }, fallbackIcon: null },
  { id: "blender", name: "Blender", vendor: "Blender Foundation", summary: "Inspect the open .blend and run bpy in running session.", authentication: "localMCP", prefersDarkTile: false, logo: { file: "plugin-blender" }, fallbackIcon: null },
  { id: "cloudflare", name: "Cloudflare", vendor: "Cloudflare", summary: "Manage Workers, DNS, R2, and D1 on your account.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-cloudflare-onDark", onLight: "plugin-cloudflare-onLight" }, fallbackIcon: null },
  { id: "fal", name: "fal", vendor: "fal.ai", summary: "Generate images and videos with your credits.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-fal-onDark", onLight: "plugin-fal-onLight" }, fallbackIcon: null },
  { id: "github", name: "GitHub", vendor: "GitHub", summary: "Read repos, issues, and pull requests without leaving your thread.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-github-onDark", onLight: "plugin-github-onLight" }, fallbackIcon: null },
  { id: "gmail", name: "Gmail", vendor: "Google", summary: "Read and send mail on the connected account.", authentication: "oauthMCP", prefersDarkTile: false, logo: { file: "plugin-gmail" }, fallbackIcon: null },
  { id: "googleads", name: "Google Ads", vendor: "Google", summary: "Read Google Ads campaigns. Going live needs builder approval.", authentication: "oauthMCP", prefersDarkTile: false, logo: { file: "plugin-googleads" }, fallbackIcon: null },
  { id: "higgsfield", name: "Higgsfield", vendor: "Higgsfield AI", summary: "Generate images and videos with your Higgsfield credits.", authentication: "oauthMCP", prefersDarkTile: false, logo: { onDark: "plugin-higgsfield-onDark", onLight: "plugin-higgsfield-onLight" }, fallbackIcon: null },
  { id: "linear", name: "Linear", vendor: "Linear", summary: "Find, create, and update issues, projects, and cycles.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-linear-onDark", onLight: "plugin-linear-onLight" }, fallbackIcon: null },
  { id: "metaads", name: "Meta Ads", vendor: "Meta", summary: "Read Meta campaigns. Going live needs builder approval.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-metaads-onDark", onLight: "plugin-metaads-onLight" }, fallbackIcon: null },
  { id: "notion", name: "Notion", vendor: "Notion", summary: "Search, read, and update pages in your connected workspace.", authentication: "oauthMCP", prefersDarkTile: false, logo: { onDark: "plugin-notion-onDark", onLight: "plugin-notion-onLight" }, fallbackIcon: null },
  { id: "resend", name: "Resend", vendor: "Resend", summary: "Send transactional email and read logs on your domains.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-resend-onDark", onLight: "plugin-resend-onLight" }, fallbackIcon: null },
  { id: "revenuecat", name: "RevenueCat", vendor: "RevenueCat", summary: "Read subscribers, offerings, and charts. Grants stay blocked.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-revenuecat-onDark", onLight: "plugin-revenuecat-onLight" }, fallbackIcon: null },
  { id: "sentry", name: "Sentry", vendor: "Sentry", summary: "Search errors, issues, and traces on the connected organization.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-sentry-onDark", onLight: "plugin-sentry-onLight" }, fallbackIcon: null },
  { id: "shopify", name: "Shopify", vendor: "Shopify", summary: "Manage products, orders, and inventory.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-shopify-onDark", onLight: "plugin-shopify-onLight" }, fallbackIcon: null },
  { id: "slack", name: "Slack", vendor: "Slack", summary: "Read channels and post with builder approval.", authentication: "oauthMCP", prefersDarkTile: false, logo: { file: "plugin-slack" }, fallbackIcon: null },
  { id: "stripe", name: "Stripe", vendor: "Stripe", summary: "Read customers, invoices, and catalog. Charges stay blocked.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-stripe-onDark", onLight: "plugin-stripe-onLight" }, fallbackIcon: null },
  { id: "supabase", name: "Supabase", vendor: "Supabase", summary: "Read database schema and run SQL on the connected project.", authentication: "apiKey", prefersDarkTile: false, logo: { onDark: "plugin-supabase-onDark", onLight: "plugin-supabase-onLight" }, fallbackIcon: null }
];

export function PluginsMarketplaceView() {
  const [query, setQuery] = useState("");

  const filtered = BUILTIN_PLUGINS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="pane destination-pane plugin-pane">
      <header className="pane-titlebar pane-titlebar--large">
        <span aria-hidden="true" className="pane-titlebar__icon">
          <Puzzle size={14} />
        </span>
        <span className="pane-titlebar__copy">
          <strong>Plugins</strong>
          <small>Accounts and services your agents can act through.</small>
        </span>
      </header>

      <div className="agent-pane__rule" />

      <div className="plugin-pane__body">
        <div className="plugin-pane__column">
          <label className="plugin-search">
            <Search size={14} aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plugins"
            />
          </label>

          <div className="plugin-grid">
            {filtered.map((plugin) => (
              <article
                key={plugin.id}
                aria-label={`${plugin.name}, ${plugin.vendor}`}
                className="plugin-card"
                title={`${plugin.vendor}\n${plugin.summary}`}
              >
                <span className="plugin-card__head">
                  <span
                    aria-hidden="true"
                    className={`plugin-card__tile ${plugin.prefersDarkTile ? "plugin-card__tile--ink" : ""}`}
                  >
                    <img
                      src={`/output/assets/logos/plugin-${plugin.id}-onDark.png`}
                      alt=""
                      style={{ width: 22, height: 22, objectFit: "contain" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/output/assets/logos/plugin-${plugin.id}.png`;
                      }}
                    />
                  </span>
                  <span className="plugin-card__copy">
                    <strong>{plugin.name}</strong>
                    <small>{plugin.summary}</small>
                  </span>
                </span>
                <span className="plugin-card__status">Preview</span>
              </article>
            ))}
          </div>

          <p className="plugin-pane__footnote">
            Plugins connect your agents to external services. More connectors are on the roadmap.
          </p>
        </div>
      </div>
    </section>
  );
}
