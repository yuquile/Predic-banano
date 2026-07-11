import { Thermometer, Droplets, Wind, Eye, TrendingUp, Award, AlertTriangle } from "lucide-react";

export function WeatherHarvest() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Weather */}
      <div
        className="p-5 rounded"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E8E0D5",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8B7355", fontWeight: 500 }}>
              Milagro, Ecuador
            </div>
            <div style={{ fontSize: "10px", color: "#B5A08A", marginTop: "1px" }}>
              Actualizado hace 5 min
            </div>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#40916C",
              backgroundColor: "rgba(64,145,108,0.08)",
              border: "1px solid rgba(64,145,108,0.2)",
              padding: "2px 8px",
              borderRadius: "2px",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            ACTIVO
          </div>
        </div>

        <div className="flex items-end gap-3 mb-5">
          <div style={{ fontSize: "48px", fontWeight: 200, color: "#1B4332", lineHeight: 1 }}>29</div>
          <div style={{ fontSize: "18px", color: "#8B7355", marginBottom: "6px" }}>°C</div>
          <div style={{ color: "#8B7355", fontSize: "12px", marginBottom: "8px" }}>Soleado · Sensación 32°</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Droplets, label: "Humedad", value: "80%" },
            { icon: Wind, label: "Viento", value: "14.8 km/h" },
            { icon: Eye, label: "UV", value: "8" },
            { icon: Thermometer, label: "Presión", value: "1013 hPa" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: "#FDF7F0", border: "1px solid #EDE7DC" }}>
              <Icon size={12} strokeWidth={1.5} color="#8B7355" />
              <div>
                <div style={{ fontSize: "9px", color: "#B5A08A", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#1B4332" }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Harvest Prediction */}
      <div
        className="p-5 rounded"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E8E0D5",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8B7355", fontWeight: 500 }}>
              Última Predicción de Cosecha
            </div>
            <div style={{ fontSize: "10px", color: "#B5A08A", marginTop: "1px" }}>
              Fecha: 13/02/2026, 9:23 AM
            </div>
          </div>
          <TrendingUp size={16} strokeWidth={1.5} color="#D4A373" />
        </div>

        <div className="flex items-end gap-2 mb-5">
          <div style={{ fontSize: "40px", fontWeight: 200, color: "#1B4332", lineHeight: 1 }}>30.4</div>
          <div style={{ fontSize: "14px", color: "#8B7355", marginBottom: "8px" }}>ton/ha</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-3 rounded" style={{ backgroundColor: "rgba(64,145,108,0.06)", border: "1px solid rgba(64,145,108,0.15)" }}>
            <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#8B7355" }}>Variación</div>
            <div style={{ fontSize: "18px", fontWeight: 500, color: "#40916C" }}>+12%</div>
            <div style={{ fontSize: "10px", color: "#8B7355" }}>vs sem. anterior</div>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: "rgba(27,67,50,0.04)", border: "1px solid #EDE7DC" }}>
            <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: "#8B7355" }}>Confianza</div>
            <div style={{ fontSize: "18px", fontWeight: 500, color: "#1B4332" }}>88%</div>
            <div style={{ fontSize: "10px", color: "#8B7355" }}>modelo ML</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Parcelas activas", value: "38" },
            { label: "Riesgo climático", value: "Alto" },
            { label: "Días cosecha", value: "Alta" },
          ].map(({ label, value }) => (
            <div key={label} className="p-2 rounded text-center" style={{ backgroundColor: "#FDF7F0", border: "1px solid #EDE7DC" }}>
              <div style={{ fontSize: "9px", color: "#B5A08A", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: value === "Alto" ? "#D4A373" : "#1B4332" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
