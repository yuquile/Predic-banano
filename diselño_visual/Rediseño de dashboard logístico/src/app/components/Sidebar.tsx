import {
  BarChart2,
  TrendingUp,
  Package,
  Truck,
  Bug,
  Calendar,
  Cpu,
  DollarSign,
  FlaskConical,
  LogOut,
  Leaf,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: TrendingUp, label: "Predicción", active: false },
  { icon: Package, label: "Gestión de Exportaciones", active: false },
  { icon: BarChart2, label: "Inventario y Postcosecha", active: false },
  { icon: FlaskConical, label: "Análisis Estadístico de Producción", active: false },
  { icon: Bug, label: "Control de Plagas y Calidad", active: false },
  { icon: Calendar, label: "Calendario Agrícola", active: false },
  { icon: Cpu, label: "Recomendaciones Inteligentes (IA)", active: true },
  { icon: DollarSign, label: "Gestión de Costos y Rentabilidad", active: false },
];

export function Sidebar() {
  return (
    <aside
      style={{ backgroundColor: "#1B4332", fontFamily: "'Inter', sans-serif" }}
      className="flex flex-col w-64 min-h-screen shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{ backgroundColor: "#D4A373" }}
        >
          <Leaf size={16} color="#1B4332" strokeWidth={2} />
        </div>
        <div>
          <span style={{ color: "#FDF7F0", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em" }}>
            BananaSys
          </span>
          <div style={{ color: "rgba(253,247,240,0.45)", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Agro Intelligence
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div style={{ color: "rgba(253,247,240,0.5)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
          Sesión activa
        </div>
        <div style={{ color: "#FDF7F0", fontSize: "13px", fontWeight: 500 }}>Abel José</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 text-left transition-all group"
            style={{
              backgroundColor: active ? "rgba(212,163,115,0.18)" : "transparent",
              color: active ? "#D4A373" : "rgba(253,247,240,0.6)",
              fontSize: "12.5px",
              fontWeight: active ? 500 : 400,
              border: active ? "1px solid rgba(212,163,115,0.25)" : "1px solid transparent",
            }}
          >
            <Icon size={14} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
            <span className="flex-1 leading-snug">{label}</span>
            {active && <ChevronRight size={12} />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all"
          style={{ color: "rgba(253,247,240,0.45)", fontSize: "12.5px" }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
