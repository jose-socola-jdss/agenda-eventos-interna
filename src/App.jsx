import { CalendarDays, Factory, Filter, MapPin, Package, Users, ClipboardCheck, Sparkles, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const events = [
  {
    id: 'cem-101',
    title: 'Jornada de coordinación de vaciado estructural - Tramo Norte',
    date: '2026-06-04',
    time: '07:30',
    location: 'Sala Prisma / Planta San Jerónimo',
    responsible: 'Ing. Teresa Galván - Infraestructura Regional',
    capacity: 48,
    current: 31,
    materials: ['Plano de secuencia', 'Casco clase E', 'Ficha de calidad CM-22'],
    status: 'Confirmado',
    area: 'Operaciones',
    summary: 'Sesión operativa para alinear ventanas de suministro, tolerancias de mezcla y control de despachos tempranos.',
  },
  {
    id: 'cem-102',
    title: 'Simulacro de continuidad en molienda y despacho',
    date: '2026-06-06',
    time: '15:00',
    location: 'Patio Logístico B / Centro Integral Monterroca',
    responsible: 'Mario Escobedo - Seguridad Industrial',
    capacity: 90,
    current: 67,
    materials: ['Chaleco reflejante', 'Radio interno', 'Check-list de contingencia'],
    status: 'Prioritario',
    area: 'Seguridad',
    summary: 'Prueba interárea para evaluar tiempos de respuesta, relevo de turnos y trazabilidad de materiales en incidente crítico.',
  },
  {
    id: 'cem-103',
    title: 'Foro interno de mantenimiento predictivo en bandas y silos',
    date: '2026-06-10',
    time: '10:00',
    location: 'Auditorio Nexo / Torre Corporativa',
    responsible: 'Patricia Mena - Excelencia Operativa',
    capacity: 120,
    current: 84,
    materials: ['Tablet o libreta', 'Indicadores MTBF', 'Último reporte de inspección'],
    status: 'Confirmado',
    area: 'Mantenimiento',
    summary: 'Conversatorio técnico con líderes de planta para revisar alarmas recurrentes, vida útil y planes de intervención.',
  },
  {
    id: 'cem-104',
    title: 'Mesa ejecutiva de abastecimiento de clinker y aditivos',
    date: '2026-06-14',
    time: '09:15',
    location: 'Sala Cantera / Planta Bajío',
    responsible: 'Lorena Vejar - Compras Estratégicas',
    capacity: 22,
    current: 15,
    materials: ['Pronóstico semanal', 'Contrato marco vigente', 'Análisis de consumo'],
    status: 'Cupos limitados',
    area: 'Abastecimiento',
    summary: 'Revisión de stock de seguridad, riesgos de proveedor y ventanas de negociación para el tercer trimestre.',
  },
];

const filtersBase = { area: 'Todas', status: 'Todos', search: '' };

function App() {
  const [filters, setFilters] = useState(filtersBase);
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem('cemvanta-registrations');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [form, setForm] = useState({ name: '', area: '' });
  const [error, setError] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  useEffect(() => {
    localStorage.setItem('cemvanta-registrations', JSON.stringify(registrations));
  }, [registrations]);

  const areas = ['Todas', ...new Set(events.map((event) => event.area))];
  const statuses = ['Todos', ...new Set(events.map((event) => event.status))];

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchesArea = filters.area === 'Todas' || event.area === filters.area;
      const matchesStatus = filters.status === 'Todos' || event.status === filters.status;
      const text = `${event.title} ${event.location} ${event.responsible}`.toLowerCase();
      const matchesSearch = text.includes(filters.search.toLowerCase());
      return matchesArea && matchesStatus && matchesSearch;
    });
  }, [filters]);

  const selected = filtered.find((event) => event.id === selectedId) || filtered[0] || events[0];
  const upcoming = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);

  useEffect(() => {
    if (selected) setSelectedId(selected.id);
  }, [selected?.id]);

  const submitRegistration = (event) => {
    if (!form.name.trim() || !form.area.trim()) {
      setError('Por favor, indica tu nombre completo y área de planta.');
      return;
    }
    setRegistrations((current) => ({
      ...current,
      [event.id]: { ...form, createdAt: new Date().toISOString() },
    }));
    setForm({ name: '', area: '' });
    setError('');
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2000);
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-orange-500/20 selection:text-orange-300">
      {/* Structural ambient grids */}
      <div className="absolute top-0 right-10 -z-10 h-[500px] w-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
      <div className="absolute bottom-10 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 opacity-50 blur transition group-hover:opacity-75" />
              <div className="relative h-11 w-11 rounded-xl border border-white/10 bg-slate-900 flex items-center justify-center">
                <Factory className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <div>
              <p className="text-lg font-black tracking-wider text-white flex items-center gap-1.5 uppercase">
                CEMVANTA
                <span className="text-[10px] tracking-widest font-mono font-bold bg-orange-950 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">OPERACIONES</span>
              </p>
              <p className="text-xs text-slate-400">Coordinación de faenas y cronograma de infraestructura.</p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-3 text-sm shrink-0">
            <Metric label="Eventos" value={events.length} />
            <Metric label="Próximos" value={upcoming.length} />
            <Metric label="Registros" value={Object.keys(registrations).length} />
          </div>
        </div>
      </header>

      {/* Main Structural Grid */}
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* LEFT COLUMN: FILTERS & TIMELINE */}
        <section className="space-y-6">
          
          {/* SEARCH & FILTER BAR */}
          <div className="glass rounded-3xl p-5 border-white/5 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <Filter className="h-4.5 w-4.5" />
                <span className="text-xs uppercase tracking-wider">Módulos de Filtrado</span>
              </div>
              <button
                onClick={() => setFilters(filtersBase)}
                className="text-[10px] font-mono text-slate-400 hover:text-white transition"
              >
                Limpiar Criterios
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500 transition-colors"
                placeholder="Buscar por sede o tema..."
                value={filters.search}
                onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))}
              />
              <select
                className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-orange-500 transition"
                value={filters.area}
                onChange={(e) => setFilters((current) => ({ ...current, area: e.target.value }))}
              >
                {areas.map((area) => <option key={area} value={area} className="bg-slate-950">{area === 'Todas' ? 'Todas las Áreas' : area}</option>)}
              </select>
              <select
                className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-orange-500 transition"
                value={filters.status}
                onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
              >
                {statuses.map((status) => <option key={status} value={status} className="bg-slate-950">{status === 'Todos' ? 'Todos los Estados' : status}</option>)}
              </select>
            </div>
          </div>

          {/* UPCOMING FEATURED ROW */}
          <div className="grid gap-4 sm:grid-cols-3">
            {upcoming.map((event, idx) => (
              <button
                key={event.id}
                onClick={() => setSelectedId(event.id)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-36 ${
                  selectedId === event.id
                    ? 'border-orange-500/40 bg-orange-500/5 shadow-md shadow-orange-950/20'
                    : 'border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-orange-400 tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    <span>Hito Próximo</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-white group-hover:text-orange-400 transition line-clamp-2">
                    {event.title}
                  </h3>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-2">
                  {event.date} · {event.time}
                </p>
              </button>
            ))}
          </div>

          {/* CHRONOLOGICAL EVENTS LIST */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border-white/5">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                <p className="text-lg font-bold text-slate-400">Sin eventos coincidentes</p>
                <p className="mt-1 text-xs text-slate-500">Prueba ajustando los filtros operacionales.</p>
              </div>
            ) : (
              filtered.map((event) => {
                const isRegistered = registrations[event.id];
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedId(event.id)}
                    className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden ${
                      selectedId === event.id
                        ? 'border-orange-500/40 bg-slate-950 shadow-md shadow-orange-950/10'
                        : 'border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase font-bold tracking-wider">
                          <span className="rounded bg-white/5 px-2 py-0.5 text-slate-400 border border-white/5">
                            {event.area}
                          </span>
                          <span className="rounded bg-orange-500/10 px-2 py-0.5 text-orange-400 border border-orange-500/10">
                            {event.status}
                          </span>
                          {isRegistered && (
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/10 flex items-center gap-1 font-sans">
                              <Check className="h-2.5 w-2.5" /> Registrado
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {event.summary}
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 font-mono sm:text-right shrink-0">
                        <p className="font-bold text-white">{event.date}</p>
                        <p className="mt-1">{event.time} Hrs</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: EVENTS DETAIL PANEL */}
        <aside className="glass rounded-[2rem] p-6 border-white/5 self-start lg:sticky lg:top-24 shadow-2xl flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                      FAENA // {selected.id}
                    </span>
                    <h2 className="mt-1 text-xl font-black text-white leading-snug">{selected.title}</h2>
                  </div>
                  <div className="rounded-lg bg-orange-500/10 p-2.5 text-orange-400 shrink-0">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                </div>

                {/* Details list */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem icon={<CalendarDays className="h-4 w-4 text-orange-400" />} label="Fecha / Hora" value={`${selected.date} · ${selected.time}`} />
                  <InfoItem icon={<MapPin className="h-4 w-4 text-orange-400" />} label="Ubicación" value={selected.location} />
                  <InfoItem icon={<Factory className="h-4 w-4 text-orange-400" />} label="Líder Responsable" value={selected.responsible} />
                  <InfoItem
                    icon={<Users className="h-4 w-4 text-orange-400" />}
                    label="Capacidad / Registro"
                    value={`${selected.current + (registrations[selected.id] ? 1 : 0)} / ${selected.capacity}`}
                  />
                </div>

                {/* Dynamic Capacity Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold uppercase">
                    <span>Ocupación de Aula</span>
                    <span>{Math.round(((selected.current + (registrations[selected.id] ? 1 : 0)) / selected.capacity) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${((selected.current + (registrations[selected.id] ? 1 : 0)) / selected.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Materials Required list */}
                <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3">Requisitos de Ingreso</p>
                  <div className="space-y-2">
                    {selected.materials.map((material) => (
                      <div key={material} className="flex items-center gap-2.5 text-xs text-slate-350">
                        <Package className="h-4 w-4 text-slate-500 shrink-0" />
                        <span>{material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registration Form */}
                <div className="rounded-xl border border-white/5 bg-slate-950 p-4 space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-white">Confirmación de Asistencia</p>
                    <p className="text-[10px] text-slate-500">Inscríbete para reservar tu plaza en esta sesión técnica.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Nombre Completo</span>
                      <input
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500 transition"
                        placeholder="Ej. Ing. Carlos Soto"
                        value={form.name}
                        onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Área / Frente Técnico</span>
                      <input
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500 transition"
                        placeholder="Ej. Mantenimiento Mecánico"
                        value={form.area}
                        onChange={(e) => setForm((current) => ({ ...current, area: e.target.value }))}
                      />
                    </div>

                    {error && (
                      <p className="text-[10px] font-mono text-orange-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {error}
                      </p>
                    )}

                    {registrations[selected.id] && (
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[10px] text-emerald-300 font-mono flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <div>
                          <p className="font-bold">¡Registro Verificado!</p>
                          <p className="mt-0.5 text-slate-400">Inscrito como: {registrations[selected.id].name}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => submitRegistration(selected)}
                      className="w-full rounded-lg bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold py-2.5 text-xs transition-all shadow-md flex items-center justify-center gap-2 group"
                    >
                      {successAnimation ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Registrando...</span>
                        </>
                      ) : registrations[selected.id] ? (
                        <span>Actualizar Ficha de Asistencia</span>
                      ) : (
                        <span>Reservar Plaza Operativa</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                <p className="text-sm">Selecciona una faena de la agenda para revisar sus detalles operativos y gestionar registros.</p>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </main>
    </div>
  );
}

// Subcomponents Helpers
function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/60 px-4 py-2.5 text-center shrink-0 min-w-[90px]">
      <div className="text-lg font-black text-white leading-tight">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{label}</div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3.5 flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
        {icon}
        {label}
      </span>
      <p className="text-xs text-slate-200 font-semibold leading-snug">{value}</p>
    </div>
  );
}

export default App;
