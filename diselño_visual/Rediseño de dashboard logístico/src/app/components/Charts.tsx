import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const areaData = [
  { mes: "Ene", pendiente: 4, proceso: 2, enviado: 1, completado: 3 },
  { mes: "Feb", pendiente: 6, proceso: 4, enviado: 2, completado: 5 },
  { mes: "Mar", pendiente: 3, proceso: 5, enviado: 4, completado: 2 },
  { mes: "Abr", pendiente: 8, proceso: 3, enviado: 6, completado: 7 },
  { mes: "May", pendiente: 5, proceso: 7, enviado: 3, completado: 4 },
  { mes: "Jun", pendiente: 2, proceso: 1, enviado: 1, completado: 0 },
];

const destinos = [
  { destino: "EE.UU.", cajas: 1200, normal: 1000 },
  { destino: "Colombia", cajas: 850, normal: 900 },
  { destino: "Brasil", cajas: 1450, normal: 1000 },
  { destino: "Perú", cajas: 630, normal: 800 },
  { destino: "Chile", cajas: 920, normal: 900 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E8E0D5",
          padding: "8px 12px",
          borderRadius: "2px",
          fontSize: "11px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ color: "#8B7355", marginBottom: "4px", fontWeight: 500 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color, display: "flex", gap: "8px", justifyContent: "space-between" }}>
            <span style={{ color: "#8B7355" }}>{p.name}</span>
            <span style={{ fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Charts() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Area Chart — Order States */}
      <div
        className="p-5 rounded"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E8E0D5",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3
            style={{
              fontFamily: "'Merriweather', Georgia, serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#1B4332",
            }}
          >
            Estados de Pedidos
          </h3>
        </div>
        <div style={{ fontSize: "10px", color: "#B5A08A", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Últimos 6 meses · Por estado
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={areaData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gPendiente" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B4332" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gProceso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A373" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D4A373" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gEnviado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#40916C" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#40916C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE7DC" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 10, fill: "#B5A08A", fontFamily: "'Inter', sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#B5A08A", fontFamily: "'Inter', sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="pendiente" name="Pendiente" stroke="#1B4332" strokeWidth={1.5} fill="url(#gPendiente)" dot={false} />
            <Area type="monotone" dataKey="proceso" name="En Proceso" stroke="#D4A373" strokeWidth={1.5} fill="url(#gProceso)" dot={false} />
            <Area type="monotone" dataKey="enviado" name="Enviado" stroke="#40916C" strokeWidth={1.5} fill="url(#gEnviado)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          {[
            { color: "#1B4332", label: "Pendiente" },
            { color: "#D4A373", label: "En Proceso" },
            { color: "#40916C", label: "Enviado" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div style={{ width: "16px", height: "1.5px", backgroundColor: color }} />
              <span style={{ fontSize: "10px", color: "#8B7355" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart — Destinations */}
      <div
        className="p-5 rounded"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E8E0D5",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3
            style={{
              fontFamily: "'Merriweather', Georgia, serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#1B4332",
            }}
          >
            Destinos Principales
          </h3>
        </div>
        <div style={{ fontSize: "10px", color: "#B5A08A", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Cajas exportadas vs. objetivo
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={destinos} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE7DC" vertical={false} />
            <XAxis
              dataKey="destino"
              tick={{ fontSize: 10, fill: "#B5A08A", fontFamily: "'Inter', sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#B5A08A", fontFamily: "'Inter', sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={1000} stroke="#EDE7DC" strokeDasharray="4 4" />
            <Bar dataKey="normal" name="Objetivo" fill="#EDE7DC" radius={[2, 2, 0, 0]} maxBarSize={24} />
            <Bar
              dataKey="cajas"
              name="Cajas"
              radius={[2, 2, 0, 0]}
              maxBarSize={24}
              fill="#2D6A4F"
              shape={(props: any) => {
                const { x, y, width, height, value, index } = props;
                const normal = destinos[index]?.normal ?? 1000;
                const isAlert = value > normal * 1.2 || value < normal * 0.8;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={isAlert ? "#D4A373" : "#2D6A4F"}
                    rx={2}
                    ry={2}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          {[
            { color: "#EDE7DC", label: "Objetivo" },
            { color: "#2D6A4F", label: "Cajas (normal)" },
            { color: "#D4A373", label: "Fuera de rango" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div style={{ width: "10px", height: "10px", backgroundColor: color, borderRadius: "1px" }} />
              <span style={{ fontSize: "10px", color: "#8B7355" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
