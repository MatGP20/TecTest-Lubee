import React from "react";

export default function AppHeader({ icon = "real_estate_agent", title = "InmoGestión", username, onLogout, showGreeting = true }) {
  return (
    <header className="border-bottom" style={{ borderColor: "var(--border-surface)" }}>
      <div className="bg-glass-dark px-3 py-3">
        <div className="container-fluid d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2 text-white">
            <span className="material-symbols-outlined fs-3 text-success">{icon}</span>
            <span className="fw-bold d-none d-sm-inline">{title}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            {showGreeting && username && <span className="text-secondary small">Hola, {username}</span>}
            {onLogout && (
              <button className="btn btn-outline-light btn-sm pill-btn" onClick={onLogout}>
                Salir
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
