import { Bell, Search, ChevronDown } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { KpiCards } from "./components/KpiCards";
import { WeatherHarvest } from "./components/WeatherHarvest";
import { ActionGrid } from "./components/ActionGrid";
import { Charts } from "./components/Charts";
import { ExportsTable } from "./components/ExportsTable";

export default function App() {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#FDF7F0",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-8 py-4 shrink-0"
          style={{
            backgroundColor: "#FDF7F0",
            borderBottom: "1px solid #E8E0D5",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Merriweather', Georgia, serif",
                fontSize: "18px",
                fontWeight: 400,
                color: "#1B4332",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              Panel de Control de Banano
            </h1>
            <div style={{ fontSize: "10px", color: "#B5A08A", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>
              Temporada activa · Sem. 23 · 07 Jun 2026
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E8E0D5",
                color: "#B5A08A",
                fontSize: "12px",
                minWidth: "200px",
              }}
            >
              <Search size={13} strokeWidth={1.5} />
              <span>Buscar pedidos, parcelas...</span>
            </div>

            <button
              className="relative flex items-center justify-center w-8 h-8 rounded"
              style={{ backgroundColor: "#fff", border: "1px solid #E8E0D5" }}
            >
              <Bell size={14} strokeWidth={1.5} color="#8B7355" />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#D4A373" }}
              />
            </button>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer"
              style={{ backgroundColor: "#fff", border: "1px solid #E8E0D5" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#1B4332" }}
              >
                <span style={{ fontSize: "10px", color: "#FDF7F0", fontWeight: 600 }}>AJ</span>
              </div>
              <span style={{ fontSize: "12px", color: "#3D3026", fontWeight: 500 }}>Abel José</span>
              <ChevronDown size={11} color="#B5A08A" />
            </div>
          </div>
        </header>

        {/* Dashboard body */}
        <main className="flex-1 px-8 py-6 flex flex-col gap-5">
          {/* KPIs */}
          <section>
            <div
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#B5A08A",
                fontWeight: 500,
                marginBottom: "10px",
              }}
            >
              Indicadores Clave
            </div>
            <KpiCards />
          </section>

          {/* Weather + Harvest */}
          <section>
            <div
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#B5A08A",
                fontWeight: 500,
                marginBottom: "10px",
              }}
            >
              Condiciones Operativas
            </div>
            <WeatherHarvest />
          </section>

          {/* Action Grid */}
          <section>
            <ActionGrid />
          </section>

          {/* Charts */}
          <section>
            <div
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#B5A08A",
                fontWeight: 500,
                marginBottom: "10px",
              }}
            >
              Análisis y Visualización
            </div>
            <Charts />
          </section>

          {/* Exports Table */}
          <section className="pb-8">
            <ExportsTable />
          </section>
        </main>
      </div>
    </div>
  );
}
