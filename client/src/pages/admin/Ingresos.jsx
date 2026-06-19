import { useState, useEffect } from "react";

// ─── Datos base ────────────────────────────────────────────────────────────────
const COLABORADORAS = ["Yo", "Adri", "Liz", "Yune", "Josi", "Jefa"];

const SERVICIOS_SALON = [
  "Manicure sencilla",
  "Manicure con esmaltado semipermanente",
  "Pedicure sencilla",
  "Pedicure con esmaltado semipermanente",
  "Acrílicas",
  "Gel",
  "Nail art",
  "Retiro de acrílicas",
  "Retiro de gel",
  "Reparación de uña",
  "Manicure + Pedicure combo",
  "Otro",
];

const SERVICIOS_CAJA_VECINA = [
  { grupo: "Pagos de servicios", opciones: ["Agua", "Luz", "Gas", "Internet", "TV cable", "Teléfono fijo", "Otro servicio"] },
  { grupo: "Recarga móvil", opciones: ["Recarga móvil"] },
  { grupo: "Financieras", opciones: ["Giro en efectivo", "Depósito"] },
];

const METODOS_PAGO = ["Efectivo", "Transferencia", "Tarjeta"];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const hoy = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => `$${Math.round(Number(n)).toLocaleString("es-CL")}`;
const uid = () => Math.random().toString(36).slice(2, 9);

function useStore(key, init) {
  const [val, setVal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init; }
    catch { return init; }
  });
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [val, set];
}

// ─── Componentes pequeños ──────────────────────────────────────────────────────
function Badge({ children, color = "pink" }) {
  const colors = {
    pink: "bg-pink-100 text-pink-700",
    gold: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[color]}`}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-pink-50 p-4 ${className}`}>{children}</div>;
}

function StatBox({ label, value, sub, color = "pink" }) {
  const accent = color === "gold" ? "text-yellow-600" : "text-pink-600";
  return (
    <div className="bg-white rounded-xl p-3 border border-pink-50 shadow-sm text-center">
      <div className={`text-xl font-bold ${accent}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

// ─── Modal de nuevo registro SALÓN ────────────────────────────────────────────
function ModalSalon({ onClose, onSave }) {
  const [form, setForm] = useState({
    fecha: hoy(),
    colaboradora: "Yo",
    servicio: SERVICIOS_SALON[0],
    monto: "",
    metodo: "Efectivo",
    nota: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = () => {
    if (!form.monto || isNaN(form.monto) || Number(form.monto) <= 0) {
      alert("Ingresa un monto válido");
      return;
    }
    onSave({ ...form, id: uid(), monto: Number(form.monto) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
        <h3 className="font-bold text-gray-800 text-lg">+ Nuevo ingreso — Salón</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
            <input type="date" className="input w-full" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Colaboradora</label>
            <select className="input w-full" value={form.colaboradora} onChange={e => set("colaboradora", e.target.value)}>
              {COLABORADORAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Servicio</label>
          <select className="input w-full" value={form.servicio} onChange={e => set("servicio", e.target.value)}>
            {SERVICIOS_SALON.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Monto ($)</label>
            <input type="number" min="0" step="500" placeholder="0" className="input w-full"
              value={form.monto} onChange={e => set("monto", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Método de pago</label>
            <select className="input w-full" value={form.metodo} onChange={e => set("metodo", e.target.value)}>
              {METODOS_PAGO.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Nota (opcional)</label>
          <input className="input w-full" placeholder="Ej: cliente nueva, propina…" value={form.nota}
            onChange={e => set("nota", e.target.value)} />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">Cancelar</button>
          <button onClick={guardar} className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-bold shadow">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de nuevo registro CAJA VECINA ──────────────────────────────────────
function ModalCajaVecina({ onClose, onSave }) {
  const [grupo, setGrupo] = useState(SERVICIOS_CAJA_VECINA[0].grupo);
  const opcionesActuales = SERVICIOS_CAJA_VECINA.find(g => g.grupo === grupo)?.opciones ?? [];
  const [form, setForm] = useState({
    fecha: hoy(),
    servicio: opcionesActuales[0],
    monto: "",
    comision: "",
    metodo: "Efectivo",
    nota: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const cambiarGrupo = (g) => {
    setGrupo(g);
    const opts = SERVICIOS_CAJA_VECINA.find(x => x.grupo === g)?.opciones ?? [];
    set("servicio", opts[0]);
  };

  const guardar = () => {
    if (!form.monto || isNaN(form.monto) || Number(form.monto) <= 0) {
      alert("Ingresa un monto válido");
      return;
    }
    onSave({ ...form, grupo, id: uid(), monto: Number(form.monto), comision: Number(form.comision) || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
        <h3 className="font-bold text-gray-800 text-lg">+ Nuevo registro — Caja Vecina</h3>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
          <div className="flex flex-wrap gap-2">
            {SERVICIOS_CAJA_VECINA.map(g => (
              <button key={g.grupo} onClick={() => cambiarGrupo(g.grupo)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${grupo === g.grupo ? "bg-yellow-400 border-yellow-400 text-white" : "border-gray-200 text-gray-600"}`}>
                {g.grupo}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
            <input type="date" className="input w-full" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Servicio</label>
            <select className="input w-full" value={form.servicio} onChange={e => set("servicio", e.target.value)}>
              {opcionesActuales.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Monto operación ($)</label>
            <input type="number" min="0" step="1000" placeholder="0" className="input w-full"
              value={form.monto} onChange={e => set("monto", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Comisión ganada ($)</label>
            <input type="number" min="0" step="50" placeholder="0" className="input w-full"
              value={form.comision} onChange={e => set("comision", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Método de pago</label>
            <select className="input w-full" value={form.metodo} onChange={e => set("metodo", e.target.value)}>
              {METODOS_PAGO.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nota (opcional)</label>
            <input className="input w-full" placeholder="Detalle…" value={form.nota}
              onChange={e => set("nota", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">Cancelar</button>
          <button onClick={guardar} className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-white text-sm font-bold shadow">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Fila de registro ──────────────────────────────────────────────────────────
function FilaRegistro({ r, onDelete, tipo }) {
  const accent = tipo === "salon" ? "text-pink-600" : "text-yellow-600";
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-800 truncate">{r.servicio}</span>
          {tipo === "salon" && <Badge color="pink">{r.colaboradora}</Badge>}
          {tipo === "caja" && r.grupo && <Badge color="gold">{r.grupo}</Badge>}
          <Badge color="blue">{r.metodo}</Badge>
        </div>
        <div className="text-xs text-gray-400 mt-0.5 flex gap-2">
          <span>{r.fecha}</span>
          {r.nota && <span>· {r.nota}</span>}
          {tipo === "caja" && r.comision > 0 && <span className="text-green-600">· Comisión: {fmt(r.comision)}</span>}
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        <span className={`font-bold text-sm ${accent}`}>{fmt(r.monto)}</span>
        <button onClick={() => onDelete(r.id)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">✕</button>
      </div>
    </div>
  );
}

// ─── Pestaña SALÓN ────────────────────────────────────────────────────────────
function TabSalon({ registros, onAdd, onDelete }) {
  const [filtroColab, setFiltroColab] = useState("Todas");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [modal, setModal] = useState(false);

  const filtrados = registros.filter(r =>
    (filtroColab === "Todas" || r.colaboradora === filtroColab) &&
    (!filtroFecha || r.fecha === filtroFecha)
  );

  const totalFiltrado = filtrados.reduce((s, r) => s + r.monto, 0);
  const totalHoy = registros.filter(r => r.fecha === hoy()).reduce((s, r) => s + r.monto, 0);

  // resumen por colaboradora
  const porColaboradora = COLABORADORAS.map(c => ({
    nombre: c,
    total: registros.filter(r => r.colaboradora === c).reduce((s, r) => s + r.monto, 0),
    count: registros.filter(r => r.colaboradora === c).length,
  }));

  return (
    <div className="space-y-4">
      {modal && <ModalSalon onClose={() => setModal(false)} onSave={(r) => { onAdd(r); setModal(false); }} />}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Total hoy" value={fmt(totalHoy)} color="pink" />
        <StatBox label="Total general" value={fmt(registros.reduce((s, r) => s + r.monto, 0))} color="pink" />
      </div>

      {/* Resumen colaboradoras */}
      <Card>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resumen por colaboradora</h4>
        <div className="grid grid-cols-2 gap-2">
          {porColaboradora.map(c => (
            <div key={c.nombre} className="flex items-center justify-between bg-pink-50 rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-gray-700">{c.nombre}</span>
              <div className="text-right">
                <div className="text-sm font-bold text-pink-600">{fmt(c.total)}</div>
                <div className="text-xs text-gray-400">{c.count} serv.</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filtros */}
      <Card>
        <div className="flex gap-2 flex-wrap items-center">
          <select className="input flex-1 min-w-0 text-sm" value={filtroColab} onChange={e => setFiltroColab(e.target.value)}>
            <option>Todas</option>
            {COLABORADORAS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="date" className="input flex-1 min-w-0 text-sm" value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)} />
          {(filtroColab !== "Todas" || filtroFecha) &&
            <button onClick={() => { setFiltroColab("Todas"); setFiltroFecha(""); }}
              className="text-xs text-pink-400 hover:text-pink-600">Limpiar</button>}
        </div>
        {(filtroColab !== "Todas" || filtroFecha) &&
          <div className="text-sm text-gray-500 mt-2">
            {filtrados.length} registro(s) · <span className="font-bold text-pink-600">{fmt(totalFiltrado)}</span>
          </div>}
      </Card>

      {/* Lista */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-700">Registros</h4>
          <button onClick={() => setModal(true)}
            className="bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-pink-600 transition-colors">
            + Agregar
          </button>
        </div>
        {filtrados.length === 0
          ? <div className="text-center py-8 text-gray-300 text-sm">Sin registros{filtroColab !== "Todas" || filtroFecha ? " con estos filtros" : " aún"}</div>
          : filtrados.slice().reverse().map(r => <FilaRegistro key={r.id} r={r} onDelete={onDelete} tipo="salon" />)
        }
      </Card>
    </div>
  );
}

// ─── Pestaña CAJA VECINA ──────────────────────────────────────────────────────
function TabCajaVecina({ registros, onAdd, onDelete }) {
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [modal, setModal] = useState(false);

  const filtrados = registros.filter(r =>
    (filtroGrupo === "Todos" || r.grupo === filtroGrupo) &&
    (!filtroFecha || r.fecha === filtroFecha)
  );

  const totalComisiones = registros.reduce((s, r) => s + (r.comision || 0), 0);
  const totalOperaciones = registros.reduce((s, r) => s + r.monto, 0);
  const comisionesHoy = registros.filter(r => r.fecha === hoy()).reduce((s, r) => s + (r.comision || 0), 0);

  const porGrupo = SERVICIOS_CAJA_VECINA.map(g => ({
    grupo: g.grupo,
    total: registros.filter(r => r.grupo === g.grupo).reduce((s, r) => s + r.monto, 0),
    comision: registros.filter(r => r.grupo === g.grupo).reduce((s, r) => s + (r.comision || 0), 0),
    count: registros.filter(r => r.grupo === g.grupo).length,
  }));

  return (
    <div className="space-y-4">
      {modal && <ModalCajaVecina onClose={() => setModal(false)} onSave={(r) => { onAdd(r); setModal(false); }} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Op. totales" value={fmt(totalOperaciones)} color="gold" />
        <StatBox label="Comisiones" value={fmt(totalComisiones)} color="gold" />
        <StatBox label="Comis. hoy" value={fmt(comisionesHoy)} color="gold" />
      </div>

      {/* Resumen por categoría */}
      <Card>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Por categoría</h4>
        <div className="space-y-2">
          {porGrupo.map(g => (
            <div key={g.grupo} className="flex items-center justify-between bg-yellow-50 rounded-lg px-3 py-2">
              <div>
                <div className="text-sm font-medium text-gray-700">{g.grupo}</div>
                <div className="text-xs text-gray-400">{g.count} operación(es)</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{fmt(g.total)}</div>
                <div className="text-sm font-bold text-yellow-600">+{fmt(g.comision)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filtros */}
      <Card>
        <div className="flex gap-2 flex-wrap items-center">
          <select className="input flex-1 min-w-0 text-sm" value={filtroGrupo} onChange={e => setFiltroGrupo(e.target.value)}>
            <option>Todos</option>
            {SERVICIOS_CAJA_VECINA.map(g => <option key={g.grupo}>{g.grupo}</option>)}
          </select>
          <input type="date" className="input flex-1 min-w-0 text-sm" value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)} />
          {(filtroGrupo !== "Todos" || filtroFecha) &&
            <button onClick={() => { setFiltroGrupo("Todos"); setFiltroFecha(""); }}
              className="text-xs text-yellow-500 hover:text-yellow-700">Limpiar</button>}
        </div>
      </Card>

      {/* Lista */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-700">Registros</h4>
          <button onClick={() => setModal(true)}
            className="bg-yellow-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-yellow-500 transition-colors">
            + Agregar
          </button>
        </div>
        {filtrados.length === 0
          ? <div className="text-center py-8 text-gray-300 text-sm">Sin registros aún</div>
          : filtrados.slice().reverse().map(r => <FilaRegistro key={r.id} r={r} onDelete={onDelete} tipo="caja" />)
        }
      </Card>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("salon");
  const [regSalon, setRegSalon] = useStore("salon_registros", []);
  const [regCaja, setRegCaja] = useStore("caja_registros", []);

  const addSalon = (r) => setRegSalon(prev => [...prev, r]);
  const delSalon = (id) => setRegSalon(prev => prev.filter(r => r.id !== id));
  const addCaja = (r) => setRegCaja(prev => [...prev, r]);
  const delCaja = (id) => setRegCaja(prev => prev.filter(r => r.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50">
      <style>{`
        .input {
          border: 1px solid #f3e8ee;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 14px;
          background: #fff;
          color: #374151;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #f9a8d4; box-shadow: 0 0 0 2px #fce7f355; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-pink-100 px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-lg">💅</div>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">Mi Salón</h1>
            <p className="text-xs text-gray-400">Registro de ingresos</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-gray-400">{new Date().toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-pink-50 mb-4">
          <button onClick={() => setTab("salon")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "salon" ? "bg-pink-500 text-white shadow" : "text-gray-500 hover:text-pink-500"}`}>
            💅 Salón de uñas
          </button>
          <button onClick={() => setTab("caja")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "caja" ? "bg-yellow-400 text-white shadow" : "text-gray-500 hover:text-yellow-500"}`}>
            🏦 Caja Vecina
          </button>
        </div>

        {/* Contenido */}
        <div className="pb-8">
          {tab === "salon"
            ? <TabSalon registros={regSalon} onAdd={addSalon} onDelete={delSalon} />
            : <TabCajaVecina registros={regCaja} onAdd={addCaja} onDelete={delCaja} />
          }
        </div>
      </div>
    </div>
  );
}