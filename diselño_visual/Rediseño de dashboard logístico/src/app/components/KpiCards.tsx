import { ShoppingCart, Truck, RefreshCw, Send, CheckCircle } from "lucide-react";

const kpis = [
  { icon: ShoppingCart, label: "Total Pedidos", value: "2", delta: null, color: "#1B4332" },
  { icon: Truck, label: "Transporte", value: "1", delta: null, color: "#2D6A4F" },
  { icon: RefreshCw, label: "En Proceso", value: "1", delta: null, color: "#40916C" },
  { icon: Send, label: "Enviados", value: "0", delta: null, color: "#74C69D" },
  { icon: CheckCircle, label: "Completados", value: "0", delta: null, color: "#B7E4C7" },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {kpis.map(({ icon: Icon, label, value, color }, i) => (
        <div
          key={label}
          className="flex flex-col justify-between p-4 rounded"
          style={{
            backgroundColor: i < 3 ? color : "#fff",
            border: i >= 3 ? `1px solid ${color}33` : "none",
            minHeight: "96px",
          }}
        >
          <div className="flex items-center justify-between">
            <Icon
              size={14}
              strokeWidth={1.5}
              color={i < 3 ? "rgba(253,247,240,0.7)" : color}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: i < 3 ? "rgba(253,247,240,0.6)" : color,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
              }}
            >
              {label}
            </span>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 300,
              fontFamily: "'Inter', sans-serif",
              color: i < 3 ? "#FDF7F0" : color,
              lineHeight: 1,
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
