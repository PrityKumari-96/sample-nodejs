import { useState } from "react";
import './saved-builds.css';
import { api } from './services/api';
import { money } from './utils/formatters';
import type { SavedItem } from './types/domain';

export default function SavedBuilds() {
  const [salespersonId, setSalespersonId] = useState("");
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selected, setSelected] = useState<SavedItem | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    if (!salespersonId) return;
    setLoading(true);
    try {
      const body = await api<unknown>(`/api/salespersons/${salespersonId}/configurations`);
      const records = Array.isArray(body)
        ? body
        : (body as Record<string, unknown>).content ||
          (body as Record<string, unknown>).configurations ||
          [];
      setItems(records as SavedItem[]);
      setSelected(null);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load configurations",
      );
    } finally {
      setLoading(false);
    }
  };
  const select = async (item: SavedItem) => {
    const id = item.id ?? item.configurationId;
    if (!id) return;
    setLoading(true);
    try {
      setSelected(await api<SavedItem>(`/api/configurations/${id}`));
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load configuration detail",
      );
    } finally {
      setLoading(false);
    }
  };
  const selectedItems =
    selected?.items ||
    selected?.snapshots ||
    selected?.componentSnapshots ||
    selected?.configurationItems ||
    [];
  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">Records / 03</p>
        <h1>Saved builds</h1>
        <p>
          Choose a configuration to view its complete price snapshot on this
          page.
        </p>
      </div>
      <div className="lookup">
        <label>
          Salesperson ID
          <input
            type="number"
            min="1"
            value={salespersonId}
            onChange={(e) => setSalespersonId(e.target.value)}
            placeholder="Enter ID"
          />
        </label>
        <button className="primary" onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Load configurations"}
        </button>
      </div>
      {error && <div className="inline-error">{error}</div>}
      <div className="saved-layout">
        <div className="data-table">
          <div className="table-head">
            <span>Configuration</span>
            <span>Pricing date</span>
            <span>Created</span>
            <span>Total</span>
          </div>
          {items.map((item, index) => {
            const id = item.id ?? item.configurationId;
            return (
              <button
                className={`table-row ${selected && (selected.id ?? selected.configurationId) === id ? "selected-row" : ""}`}
                key={id || index}
                onClick={() => select(item)}
              >
                <strong>
                  {item.configurationName || `Configuration #${id}`}
                </strong>
                <span>{item.pricingDate || "—"}</span>
                <span>{item.createdAt || "—"}</span>
                <strong>{money(item.totalPrice)}</strong>
              </button>
            );
          })}
          {!items.length && !error && (
            <div className="empty">
              Enter a salesperson ID to load saved builds.
            </div>
          )}
        </div>
        <aside className="result-panel saved-detail">
          {selected ? (
            <>
              <p className="eyebrow">
                Snapshot / #{selected.id ?? selected.configurationId}
              </p>
              <h2>{selected.configurationName || "Configuration detail"}</h2>
              {selectedItems.map((raw, index) => {
                const item = raw as Record<string, unknown>;
                const quantity = Number(item.quantity || 1);
                const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
                const lineTotal = Number(
                  item.lineTotal ?? item.totalPrice ?? unitPrice * quantity,
                );
                return (
                  <div className="result-line" key={index}>
                    <span>
                      {String(item.brand || "")} {String(item.name || "")}
                      <small>
                        {quantity} × {money(unitPrice)}
                      </small>
                    </span>
                    <b>{money(lineTotal)}</b>
                  </div>
                );
              })}
              <div className="totals">
                <span>
                  Subtotal <b>{money(selected.subtotal)}</b>
                </span>
                <span>
                  GST {selected.gstPercent ? `(${selected.gstPercent}%)` : ""}
                  <b>{money(selected.gstAmount)}</b>
                </span>
                <span>
                  Discount <b>- {money(selected.discountAmount)}</b>
                </span>
                <strong>
                  Total <b>{money(selected.totalPrice)}</b>
                </strong>
              </div>
            </>
          ) : (
            <div className="empty-result">
              <span className="result-icon">◎</span>
              <h2>
                Select a saved build
                <br />
                to see the details.
              </h2>
              <p>
                The complete component prices and breakdown will appear here.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
