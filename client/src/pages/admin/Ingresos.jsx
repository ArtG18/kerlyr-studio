import { useState, useEffect } from "react";
import { useWorkers } from "../../hooks/useWorkers";
import { useServices } from "../../hooks/useServices";

const SERVICIOS_CAJA_VECINA = [
  { grupo: "Pagos de servicios", opciones: ["Agua","Luz","Gas","Internet","TV cable","Teléfono fijo","Otro servicio"] },
  { grupo: "Recarga móvil", opciones: ["Recarga móvil"] },
  { grupo: "Financieras", opciones: ["Giro en efectivo","Depósito"] },
];
const METODOS_PAGO = ["Efectivo","Transferencia","Tarjeta"];

const hoy = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => `$${Math.round(Number(n)).toLocaleString("es-CL")}`;
const uid = () => Math.random().toString(36).slice(2, 9);

// ── API helper ────────────────────────────────────────────────────────────────
const API = (import.meta.env.VITE_API_URL || 'https://kerlyr-studio-server.onrender.com').replace(/\/$/, '')
const token = () => localStorage.getItem('kr_token') || ''
const apiFetch = (path, opts = {}) =>
  fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    ...opts,
  }).then(r => r.json())

// ── UI Atoms ──────────────────────────────────────────────────────────────────
function Badge({ children, color = "rose" }) {
  const colors = {
    rose:  "bg-kr-rose-light text-kr-rose-dark",
    amber: "bg-amber-50 text-amber-700",
    blue:  "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    gray:  "bg-gray-100 text-gray-500",
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[color] || colors.gray}`}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>{children}</div>;
}

function StatCard({ label, value, color = "rose" }) {
  const accent = color === "amber" ? "text-amber-600" : "text-kr-rose-dark";
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
      <div className={`text-lg font-semibold ${accent}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function Input({ label, children }) {
  return (
    <div>
      {label && <label className="text-xs text-gray-500 mb-1 block">{label}</label>}
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 outline-none focus:border-kr-rose focus:ring-1 focus:ring-kr-rose transition-all";

// ── Modal Salón ───────────────────────────────────────────────────────────────
function ModalSalon({ onClose, onSave, registro, workers, services }) {
  const primeraColab = workers.length > 0 ? workers[0].name : "";
  const primerServicio = services.length > 0 ? services[0].name : "";
  const [form, setForm] = useState(registro || { fecha: hoy(), colaboradora: primeraColab, servicio: primerServicio, monto: "", metodo: "Efectivo", nota: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const guardar = () => {
    if (!form.monto || isNaN(form.monto) || Number(form.monto) <= 0) { alert("Ingresa un monto válido"); return; }
    onSave({ ...form, id: form.id || uid(), monto: Number(form.monto) });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{registro ? "Editar ingreso" : "+ Nuevo ingreso"} — Salón</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Fecha"><input type="date" className={inputCls} value={form.fecha} onChange={e => set("fecha", e.target.value)} /></Input>
          <Input label="Colaboradora">
            <select className={inputCls} value={form.colaboradora} onChange={e => set("colaboradora", e.target.value)}>
              {workers.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
            </select>
          </Input>
        </div>
        <Input label="Servicio">
          <select className={inputCls} value={form.servicio} onChange={e => set("servicio", e.target.value)}>
            {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            <option value="Otro">Otro</option>
          </select>
        </Input>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Monto (CLP)"><input type="number" min="0" step="100" placeholder="0" className={inputCls} value={form.monto} onChange={e => set("monto", e.target.value)} /></Input>
          <Input label="Método de pago"><select className={inputCls} value={form.metodo} onChange={e => set("metodo", e.target.value)}>{METODOS_PAGO.map(m => <option key={m}>{m}</option>)}</select></Input>
        </div>
        <Input label="Nota (opcional)"><input className={inputCls} placeholder="Ej: cliente nueva, propina…" value={form.nota} onChange={e => set("nota", e.target.value)} /></Input>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={guardar} className="flex-1 py-2.5 rounded-xl bg-kr-rose text-white text-sm font-semibold shadow hover:opacity-90">Guardar</button>
        </div>
      </div>
    </div>
  );
}

function ModalCajaVecina({ onClose, onSave, registro }) {
  const [grupo, setGrupo] = useState(registro?.grupo || SERVICIOS_CAJA_VECINA[0].grupo);
  const opcionesActuales = SERVICIOS_CAJA_VECINA.find(g => g.grupo === grupo)?.opciones ?? [];
  const [form, setForm] = useState(registro || { fecha: hoy(), servicio: opcionesActuales[0], monto: "", comision: "", metodo: "Efectivo", nota: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cambiarGrupo = (g) => { setGrupo(g); const opts = SERVICIOS_CAJA_VECINA.find(x => x.grupo === g)?.opciones ?? []; set("servicio", opts[0]); };
  const guardar = () => {
    if (!form.monto || isNaN(form.monto) || Number(form.monto) <= 0) { alert("Ingresa un monto válido"); return; }
    onSave({ ...form, grupo, id: form.id || uid(), monto: Number(form.monto), comision: Number(form.comision) || 0 });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{registro ? "Editar registro" : "+ Nuevo registro"} — Caja Vecina</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <Input label="Categoría">
          <div className="flex flex-wrap gap-2 mt-1">
            {SERVICIOS_CAJA_VECINA.map(g => (
              <button key={g.grupo} onClick={() => cambiarGrupo(g.grupo)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${grupo === g.grupo ? "bg-kr-rose text-white border-kr-rose" : "border-gray-200 text-gray-600 hover:border-kr-rose"}`}>
                {g.grupo}
              </button>
            ))}
          </div>
        </Input>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Fecha"><input type="date" className={inputCls} value={form.fecha} onChange={e => set("fecha", e.target.value)} /></Input>
          <Input label="Servicio"><select className={inputCls} value={form.servicio} onChange={e => set("servicio", e.target.value)}>{opcionesActuales.map(s => <option key={s}>{s}</option>)}</select></Input>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Monto operación (CLP)"><input type="number" min="0" step="100" placeholder="0" className={inputCls} value={form.monto} onChange={e => set("monto", e.target.value)} /></Input>
          <Input label="Comisión ganada (CLP)"><input type="number" min="0" step="50" placeholder="0" className={inputCls} value={form.comision} onChange={e => set("comision", e.target.value)} /></Input>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Método de pago"><select className={inputCls} value={form.metodo} onChange={e => set("metodo", e.target.value)}>{METODOS_PAGO.map(m => <option key={m}>{m}</option>)}</select></Input>
          <Input label="Nota (opcional)"><input className={inputCls} placeholder="Detalle…" value={form.nota} onChange={e => set("nota", e.target.value)} /></Input>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={guardar} className="flex-1 py-2.5 rounded-xl bg-kr-rose text-white text-sm font-semibold shadow hover:opacity-90">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ── Fila de registro ──────────────────────────────────────────────────────────
function FilaRegistro({ r, onDelete, onEdit, tipo }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className="text-sm font-medium text-gray-800 truncate">{r.servicio}</span>
          {tipo === "salon" && <Badge color="rose">{r.colaboradora}</Badge>}
          {tipo === "caja" && r.grupo && <Badge color="amber">{r.grupo}</Badge>}
          <Badge color="blue">{r.metodo}</Badge>
          {r.source === 'appointment' && (
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-100">✓ Auto</span>
          )}
        </div>
        <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
          <span>{r.fecha}</span>
          {r.nota && <span>· {r.nota}</span>}
          {tipo === "caja" && r.comision > 0 && <span className="text-emerald-600 font-medium">· Comisión: {fmt(r.comision)}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-semibold text-sm text-kr-rose-dark">{fmt(r.monto)}</span>
        <button onClick={() => onEdit(r)} className="w-6 h-6 rounded-md bg-blue-50 text-blue-400 hover:bg-blue-100 flex items-center justify-center text-xs transition-colors" title="Editar">✏️</button>
        {confirm ? (
          <div className="flex gap-1">
            <button onClick={() => onDelete(r.id)} className="w-6 h-6 rounded-md bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs font-bold">✓</button>
            <button onClick={() => setConfirm(false)} className="w-6 h-6 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center text-xs">✕</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="w-6 h-6 rounded-md bg-red-50 text-red-300 hover:bg-red-100 flex items-center justify-center text-xs transition-colors" title="Eliminar">🗑</button>
        )}
      </div>
    </div>
  );
}

// ── Tab Salón ─────────────────────────────────────────────────────────────────
function TabSalon({ registros, onAdd, onDelete, onEdit, workers, services }) {
  const [filtroColab, setFiltroColab] = useState("Todas");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [modal, setModal] = useState(null);

  const nombresWorkers = workers.map(w => w.name);
  const filtrados = registros.filter(r =>
    (filtroColab === "Todas" || r.colaboradora === filtroColab) &&
    (!filtroFecha || r.fecha === filtroFecha)
  );
  const totalHoy = registros.filter(r => r.fecha === hoy()).reduce((s, r) => s + r.monto, 0);
  const totalGeneral = registros.reduce((s, r) => s + r.monto, 0);
  const porColaboradora = nombresWorkers.map(c => ({
    nombre: c,
    total: registros.filter(r => r.colaboradora === c).reduce((s, r) => s + r.monto, 0),
    count: registros.filter(r => r.colaboradora === c).length,
  })).filter(c => c.count > 0);

  return (
    <div className="space-y-4">
      {modal && (
        <ModalSalon
          registro={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={(r) => { modal === "new" ? onAdd(r) : onEdit(r); setModal(null); }}
          workers={workers}
          services={services}
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Total hoy" value={fmt(totalHoy)} color="rose" />
        <StatCard label="Total general" value={fmt(totalGeneral)} color="rose" />
      </div>
      {porColaboradora.length > 0 && (
        <Card>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Por colaboradora</h4>
          <div className="grid grid-cols-2 gap-2">
            {porColaboradora.map(c => (
              <div key={c.nombre} className="flex items-center justify-between bg-kr-rose-light rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-gray-700">{c.nombre}</span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-kr-rose-dark">{fmt(c.total)}</div>
                  <div className="text-xs text-gray-400">{c.count} serv.</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card>
        <div className="flex gap-2 flex-wrap items-center mb-2">
          <select className={`${inputCls} flex-1 min-w-0`} value={filtroColab} onChange={e => setFiltroColab(e.target.value)}>
            <option>Todas</option>
            {nombresWorkers.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="date" className={`${inputCls} flex-1 min-w-0`} value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
          {(filtroColab !== "Todas" || filtroFecha) && (
            <button onClick={() => { setFiltroColab("Todas"); setFiltroFecha(""); }} className="text-xs text-kr-rose hover:text-kr-rose-dark">Limpiar</button>
          )}
        </div>
        {(filtroColab !== "Todas" || filtroFecha) && (
          <p className="text-xs text-gray-500 mb-2">{filtrados.length} registro(s) · <span className="font-semibold text-kr-rose-dark">{fmt(filtrados.reduce((s,r)=>s+r.monto,0))}</span></p>
        )}
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Registros ({filtrados.length})</h4>
          <button onClick={() => setModal("new")} className="btn-primary text-xs px-3 py-1.5">+ Agregar</button>
        </div>
        {filtrados.length === 0
          ? <div className="text-center py-8 text-gray-300 text-sm">Sin registros aún</div>
          : filtrados.slice().reverse().map(r => (
            <FilaRegistro key={r.id} r={r} tipo="salon" onDelete={onDelete} onEdit={(reg) => setModal(reg)} />
          ))
        }
      </Card>
    </div>
  );
}

// ── Tab Caja Vecina ───────────────────────────────────────────────────────────
function TabCajaVecina({ registros, onAdd, onDelete, onEdit }) {
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [modal, setModal] = useState(null);

  const filtrados = registros.filter(r =>
    (filtroGrupo === "Todos" || r.grupo === filtroGrupo) &&
    (!filtroFecha || r.fecha === filtroFecha)
  );
  const totalComisiones  = registros.reduce((s, r) => s + (r.comision || 0), 0);
  const totalOperaciones = registros.reduce((s, r) => s + r.monto, 0);
  const comisionesHoy    = registros.filter(r => r.fecha === hoy()).reduce((s, r) => s + (r.comision || 0), 0);
  const porGrupo = SERVICIOS_CAJA_VECINA.map(g => ({
    grupo: g.grupo,
    total:    registros.filter(r => r.grupo === g.grupo).reduce((s, r) => s + r.monto, 0),
    comision: registros.filter(r => r.grupo === g.grupo).reduce((s, r) => s + (r.comision || 0), 0),
    count:    registros.filter(r => r.grupo === g.grupo).length,
  })).filter(g => g.count > 0);

  return (
    <div className="space-y-4">
      {modal && (
        <ModalCajaVecina
          registro={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={(r) => { modal === "new" ? onAdd(r) : onEdit(r); setModal(null); }}
        />
      )}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Op. totales"  value={fmt(totalOperaciones)} color="amber" />
        <StatCard label="Comisiones"   value={fmt(totalComisiones)}  color="amber" />
        <StatCard label="Comis. hoy"   value={fmt(comisionesHoy)}    color="amber" />
      </div>
      {porGrupo.length > 0 && (
        <Card>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Por categoría</h4>
          <div className="space-y-2">
            {porGrupo.map(g => (
              <div key={g.grupo} className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
                <div>
                  <div className="text-sm font-medium text-gray-700">{g.grupo}</div>
                  <div className="text-xs text-gray-400">{g.count} operación(es)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{fmt(g.total)}</div>
                  <div className="text-sm font-semibold text-amber-600">+{fmt(g.comision)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card>
        <div className="flex gap-2 flex-wrap items-center mb-2">
          <select className={`${inputCls} flex-1 min-w-0`} value={filtroGrupo} onChange={e => setFiltroGrupo(e.target.value)}>
            <option>Todos</option>
            {SERVICIOS_CAJA_VECINA.map(g => <option key={g.grupo}>{g.grupo}</option>)}
          </select>
          <input type="date" className={`${inputCls} flex-1 min-w-0`} value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
          {(filtroGrupo !== "Todos" || filtroFecha) && (
            <button onClick={() => { setFiltroGrupo("Todos"); setFiltroFecha(""); }} className="text-xs text-kr-rose hover:text-kr-rose-dark">Limpiar</button>
          )}
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Registros ({filtrados.length})</h4>
          <button onClick={() => setModal("new")} className="btn-primary text-xs px-3 py-1.5">+ Agregar</button>
        </div>
        {filtrados.length === 0
          ? <div className="text-center py-8 text-gray-300 text-sm">Sin registros aún</div>
          : filtrados.slice().reverse().map(r => (
            <FilaRegistro key={r.id} r={r} tipo="caja" onDelete={onDelete} onEdit={(reg) => setModal(reg)} />
          ))
        }
      </Card>
    </div>
  );
}

// ── App principal ─────────────────────────────────────────────────────────────
export default function Ingresos() {
  const [tab,      setTab]      = useState("salon");
  const [regSalon, setRegSalon] = useState([]);
  const [regCaja,  setRegCaja]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { workers } = useWorkers();
  const { services } = useServices();

  useEffect(() => {
    Promise.all([
      apiFetch('/incomes?source=salon'),
      apiFetch('/incomes?source=caja'),
    ]).then(([salon, caja]) => {
      setRegSalon(Array.isArray(salon) ? salon : []);
      setRegCaja(Array.isArray(caja)  ? caja  : []);
    }).finally(() => setLoading(false));
  }, []);

  const addSalon  = async (r) => { const n = await apiFetch('/incomes', { method: 'POST', body: JSON.stringify({ ...r, source: 'manual' }) }); setRegSalon(p => [n, ...p]); };
  const editSalon = async (r) => { const u = await apiFetch(`/incomes/${r.id}`, { method: 'PATCH', body: JSON.stringify(r) }); setRegSalon(p => p.map(x => x.id === u.id ? u : x)); };
  const delSalon  = async (id) => { await apiFetch(`/incomes/${id}`, { method: 'DELETE' }); setRegSalon(p => p.filter(r => r.id !== id)); };

  const addCaja  = async (r) => { const n = await apiFetch('/incomes', { method: 'POST', body: JSON.stringify({ ...r, source: 'caja' }) }); setRegCaja(p => [n, ...p]); };
  const editCaja = async (r) => { const u = await apiFetch(`/incomes/${r.id}`, { method: 'PATCH', body: JSON.stringify(r) }); setRegCaja(p => p.map(x => x.id === u.id ? u : x)); };
  const delCaja  = async (id) => { await apiFetch(`/incomes/${id}`, { method: 'DELETE' }); setRegCaja(p => p.filter(r => r.id !== id)); };

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400 text-sm">Cargando ingresos…</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0 bg-white">
        <h2 className="text-base font-medium text-gray-900">Ingresos</h2>
      </div>
      <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
        <button onClick={() => setTab("salon")}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === "salon" ? "border-kr-rose text-kr-rose-dark" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          💅 Salón
        </button>
        <button onClick={() => setTab("caja")}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === "caja" ? "border-amber-400 text-amber-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          🏧 Caja Vecina
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {tab === "salon"
          ? <TabSalon registros={regSalon} onAdd={addSalon} onDelete={delSalon} onEdit={editSalon} workers={workers} services={services} />
          : <TabCajaVecina registros={regCaja} onAdd={addCaja} onDelete={delCaja} onEdit={editCaja} />
        }
      </div>
    </div>
  );
}