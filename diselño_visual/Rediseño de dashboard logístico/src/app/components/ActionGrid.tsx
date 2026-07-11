import {
  PackageCheck,
  BarChart3,
  Truck,
  ShieldCheck,
  Sprout,
  Calculator,
  FileText,
  Cpu,
  Map,
  Bell,
  Settings,
  Users,
  Download,
  RefreshCw,
  Search,
  PlusCircle,
} from "lucide-react";

const actions = [
  { icon: PackageCheck, label: "Nueva Exportación", accent: true },
  { icon: Sprout, label: "Registrar Cosecha", accent: false },
  { icon: Truck, label: "Asignar Transporte", accent: false },
  { icon: BarChart3, label: "Ver Reportes", accent: false },
  { icon: ShieldCheck, label: "Control Calidad", accent: false },
  { icon: Calculator, label: "Calcular Costos", accent: false },
  { icon: Map, label: "Mapa de Parcelas", accent: false },
  { icon: Cpu, label: "IA Predicciones", accent: false },
  { icon: Bell, label: "Alertas", accent: false },
  { icon: FileText, label: "Documentación", accent: false },
  { icon: Users, label: "Equipos", accent: false },
  { icon: Download, label: "Exportar Data", accent: false },
  { icon: RefreshCw, label: "Sincronizar", accent: false },
  { icon: Search, label: "Buscar Pedido", accent: false },
  { icon: PlusCircle, label: "Nuevo Pedido", accent: false },
  { icon: Settings, label: "Configuración", accent: false },
];

export function ActionGrid() {
  return (
    <div
      className="p-5 rounded"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #E8E0D5",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          style={{
            fontFamily: "'Merriweather', Georgia, serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "#1B4332",
            letterSpacing: "-0.01em",
          }}
        >
          Acciones Rápidas
        </h2>
        <span style={{ fontSize: "10px", color: "#B5A08A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          16 módulos
        </span>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {actions.map(({ icon: Icon, label, accent }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded transition-all group"
            style={{
              aspectRatio: "1 / 1",
              backgroundColor: accent ? "#1B4332" : "#FDF7F0",
              border: accent ? "none" : "1px solid #EDE7DC",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!accent) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F5EFE6";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4A373";
              }
            }}
            onMouseLeave={(e) => {
              if (!accent) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FDF7F0";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#EDE7DC";
              }
            }}
          >
            <Icon
              size={18}
              strokeWidth={1.5}
              color={accent ? "#FDF7F0" : "#2D6A4F"}
            />
            <span
              style={{
                fontSize: "9px",
                textAlign: "center",
                lineHeight: "1.2",
                color: accent ? "rgba(253,247,240,0.85)" : "#5C4A35",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
