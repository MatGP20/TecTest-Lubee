import React from "react";

export default function AppFooter({ text = "© 2025 TTL Inmuebles SA. Todos los derechos reservados.", align = "center" }) {
  const justifyClass = align === "center" ? "justify-content-center" : "justify-content-between";
  return (
    <footer
      className={`py-4 px-4 border-top d-flex flex-column flex-md-row ${justifyClass} align-items-center text-secondary gap-2`}
      style={{ borderColor: "var(--border-surface)", backgroundColor: "#131b11" }}
    >
      <small>{text}</small>
    </footer>
  );
}
