import { ArrowUpRight, AlertCircle } from "lucide-react";

const exports = [
  {
    id: "EXP001",
    ruta: "Colombia → Ecuador",
    producto: "Banano Cavendish",
    unidades: "23 unidades",
    estado: "Pendiente",
    estadoColor: "#D4A373",
    estadoBg: "rgba(212,163,115,0.1)",
    estadoBorder: "rgba(212,163,115,0.25)",
    alert: false,
  },
  {
    id: "EXP002",
    ruta: "Latacunga → Brasil · Plátano Verde",
    producto: "Plátano Verde",
    unidades: "256 unidades",
    estado: "Procesando",
    estadoColor: "#40916C",
    estadoBg: "rgba(64,145,108,0.08)",
    estadoBorder: "rgba(64,145,108,0.2)",
    alert: false,
  },
  {
    id: "EXP003",
    ruta: "Guayaquil → EE.UU.",
    producto: "Banano Orgánico",
    unidades: "480 unidades",
    estado: "En Tránsito",
    estadoColor: "#2D6A4F",
    estadoBg: "rgba(45,106,79,0.08)",
    estadoBorder: "rgba(45,106,79,0.2)",
    alert: false,
  },
  {
    id: "EXP004",
    ruta: "Machala → Chile",
    producto: "Banano Cavendish",
    unidades: "120 unidades",
    estado: "Alerta",
    estadoColor: "#C0392B",
    estadoBg: "rgba(192,57,43,0.07)",
    estadoBorder: "rgba(192,57,43,0.2)",
    alert: true,
  },
];

export function ExportsTable() {
  return (
    <div
      className="rounded"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #E8E0D5",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #EDE7DC" }}>
        <h3
          style={{
            fontFamily: "'Merriweather', Georgia, serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "#1B4332",
          }}
        >
          Exportaciones Recientes
        </h3>
        <button
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#2D6A4F",
            border: "1px solid rgba(45,106,79,0.3)",
            padding: "4px 12px",
            borderRadius: "2px",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Ver todo <ArrowUpRight size={10} />
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid #EDE7DC" }}>
            {["Ref.", "Ruta / Producto", "Unidades", "Estado", ""].map((h) => (
              <th
                key={h}
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#B5A08A",
                  fontWeight: 500,
                  padding: "10px 20px",
                  textAlign: "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exports.map((exp) => (
            <tr
              key={exp.id}
              style={{ borderBottom: "1px solid #F5EFE6" }}
            >
              <td style={{ padding: "12px 20px" }}>
                <div className="flex items-center gap-1.5">
                  {exp.alert && <AlertCircle size={11} color="#C0392B" strokeWidth={1.5} />}
                  <span style={{ fontSize: "12px", fontWeight: 600, color: exp.alert ? "#C0392B" : "#1B4332", fontFamily: "'Inter', monospace" }}>
                    {exp.id}
                  </span>
                </div>
              </td>
              <td style={{ padding: "12px 20px" }}>
                <div style={{ fontSize: "12px", color: "#3D3026" }}>{exp.ruta}</div>
                <div style={{ fontSize: "10px", color: "#B5A08A", marginTop: "1px" }}>{exp.producto}</div>
              </td>
              <td style={{ padding: "12px 20px" }}>
                <span style={{ fontSize: "12px", color: "#5C4A35", fontVariantNumeric: "tabular-nums" }}>{exp.unidades}</span>
              </td>
              <td style={{ padding: "12px 20px" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: exp.estadoColor,
                    backgroundColor: exp.estadoBg,
                    border: `1px solid ${exp.estadoBorder}`,
                    padding: "2px 8px",
                    borderRadius: "2px",
                    display: "inline-block",
                  }}
                >
                  {exp.estado}
                </span>
              </td>
              <td style={{ padding: "12px 20px" }}>
                <button
                  style={{
                    fontSize: "10px",
                    color: "#8B7355",
                    border: "1px solid #EDE7DC",
                    padding: "3px 10px",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
