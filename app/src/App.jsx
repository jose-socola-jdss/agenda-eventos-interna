import { CalendarDays, Factory, Filter, MapPin, Package, Users, ClipboardCheck, AlertTriangle, Check, RefreshCw, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
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
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function App() {


  const [filters, setFilters] = useState(filtersBase);
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [currentMonth, setCurrentMonth] = useState(5); // Junio (0-indexed 5)
  const [currentYear, setCurrentYear] = useState(2026);
  
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

  useEffect(() => {
    if (selected) {
      setSelectedId(selected.id);
      // Auto-set the calendar view to the selected event's month
      const eventDate = new Date(selected.date);
      if (!isNaN(eventDate.getTime())) {
        setCurrentMonth(eventDate.getMonth());
        setCurrentYear(eventDate.getFullYear());
      }
    }
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

  // Generate calendar cells dynamically
  const calendarCells = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    const cells = [];
    
    // Day of week of 1st day (0 = Sunday, 1 = Monday, etc.)
    // We want Monday (1) to be index 0, Tuesday (2) index 1, ... Sunday (0) index 6.
    const startDay = date.getDay();
    const offset = startDay === 0 ? 6 : startDay - 1;
    
    // Previous month filler
    const prevMonthDate = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonthDate.getDate();
    for (let i = offset - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      cells.push({
        dayNum,
        monthType: 'prev',
        dateString: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
      });
    }
    
    // Current month days
    const currentMonthDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= currentMonthDays; i++) {
      cells.push({
        dayNum: i,
        monthType: 'current',
        dateString: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    
    // Next month filler
    const totalSlots = cells.length <= 35 ? 35 : 42;
    const nextMonthFiller = totalSlots - cells.length;
    for (let i = 1; i <= nextMonthFiller; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      cells.push({
        dayNum: i,
        monthType: 'next',
        dateString: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    
    return cells;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };



  return (
    <div className="w-full min-h-screen text-slate-900 selection:bg-orange-500/20 selection:text-orange-900 relative overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 select-none">
            <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--color-orange-seguridad)" fill="rgba(249, 115, 22, 0.1)" />
              <path d="M2 7v10l10 5V12z" stroke="#4b5563" fill="rgba(75, 85, 99, 0.1)" />
              <path d="M12 12l10-5v10l-10 5z" stroke="#1f2937" fill="rgba(31, 41, 55, 0.15)" />
            </svg>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-widest text-gray-900 uppercase font-heading" style={{ lineHeight: 1 }}>
                  CEMVANTA
                </span>
                <span style={{ fontSize: 8, fontWeight: 700, tracking: '0.12em', fontFamily: "'Archivo', sans-serif", background: 'var(--color-asfalto)', color: '#fff', padding: '2px 6px', borderRadius: 2 }}>
                  INDUSTRIAL
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono" style={{ margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cementos y Soluciones de Infraestructura
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <Metric label="Eventos Totales" value={events.length} />
            <Metric label="Filtros Activos" value={filtered.length} />
            <Metric label="Inscripciones" value={Object.keys(registrations).length} />
          </div>
        </div>
      </header>

      {/* FILTER & INTERACTIVE ACTION BAR */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="bg-white border border-gray-300 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          
          {/* Filters Form */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Filter className="h-4 w-4" />
              <span className="text-xs uppercase font-heading">Parámetros:</span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                className="input-construction pl-8 py-1.5 text-xs rounded-sm w-48"
                placeholder="Buscar faena o ubicación..."
                value={filters.search}
                onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))}
              />
            </div>

            <select
              className="input-construction py-1.5 text-xs rounded-sm"
              value={filters.area}
              onChange={(e) => setFilters((current) => ({ ...current, area: e.target.value }))}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area === 'Todas' ? 'Todas las Áreas' : `Área: ${area}`}
                </option>
              ))}
            </select>

            <select
              className="input-construction py-1.5 text-xs rounded-sm"
              value={filters.status}
              onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'Todos' ? 'Todos los Estados' : `Estado: ${status}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters(filtersBase)}
              className="btn-construction btn-construction-secondary text-xs py-1.5 px-3 rounded-sm"
            >
              Resetear Filtros
            </button>
          </div>

        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* LEFT COLUMN: THE MONTHLY CALENDAR GRID */}
        <section className="space-y-4">
          
          {/* Calendar Controller */}
          <div className="flex flex-wrap items-center justify-between bg-white border border-gray-300 p-4 shadow-sm gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="btn-construction btn-construction-secondary p-2 rounded-sm"
                aria-label="Mes anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-lg font-bold font-heading uppercase tracking-wider text-gray-900 min-w-[150px] text-center">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="btn-construction btn-construction-secondary p-2 rounded-sm"
                aria-label="Mes siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="text-xs text-gray-500 font-mono hidden sm:block">
              Agenda Técnica Certificada
            </div>
          </div>

          {/* Calendar Board Grid */}
          <div className="hidden lg:block bg-white shadow-sm border border-gray-300 overflow-hidden">
            <div className="calendar-grid">
              
              {/* Day names */}
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                <div key={d} className="calendar-header-cell">
                  {d}
                </div>
              ))}
              
              {/* Calendar cells */}
              {calendarCells.map((cell) => {
                const cellDate = new Date(cell.dateString);
                const isToday = cell.dateString === '2026-06-04'; // Simulate default anchor date in the data range
                
                // Events for this day
                const dayEvents = filtered.filter((event) => event.date === cell.dateString);
                
                return (
                  <div
                    key={cell.dateString}
                    className={`calendar-day-cell ${cell.monthType !== 'current' ? 'other-month' : ''} ${isToday ? 'is-today' : ''}`}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        setSelectedId(dayEvents[0].id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`day-number ${cell.monthType !== 'current' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {cell.dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[7px] font-mono font-extrabold uppercase px-1 bg-yellow-400 text-gray-900 rounded-sm">
                          Hoy
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {dayEvents.map((evt) => {
                        const isSel = selectedId === evt.id;
                        return (
                          <button
                            key={evt.id}
                            title={evt.title}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(evt.id);
                            }}
                            className={`event-block cat-${evt.area.toLowerCase()} w-full text-left font-sans ${isSel ? 'ring-2 ring-gray-900 font-bold scale-102 z-10' : ''}`}
                          >
                            {evt.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* List layout fallback for quick mobile navigation */}
          <div className="block lg:hidden space-y-2">
            <h3 className="text-xs uppercase font-heading text-gray-500 tracking-wider">Lista de Hitos de Obra</h3>
            <div className="space-y-2">
              {filtered.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedId(event.id)}
                  className={`w-full text-left p-4 border bg-white rounded-sm transition-all ${selectedId === event.id ? 'border-orange-500 border-l-4' : 'border-gray-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono uppercase bg-gray-100 px-1.5 py-0.5 font-bold">
                      {event.area}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{event.date}</span>
                  </div>
                  <h4 className="font-bold text-sm mt-1">{event.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{event.location}</p>
                </button>
              ))}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: EVENT DETAIL INSPECTION & SIGN UP */}
        <aside className="side-panel p-6 flex flex-col gap-6">
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
                
                {/* Event header info */}
                <div className="border-b border-gray-300 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600 font-heading">
                      FICHA TÉCNICA // {selected.id}
                    </span>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 bg-gray-100 border border-gray-300`}>
                      {selected.status}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 font-heading leading-tight">
                    {selected.title}
                  </h2>
                </div>

                {/* Event meta fields */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem icon={<CalendarDays className="h-4 w-4 text-orange-600" />} label="Fecha / Hora" value={`${selected.date} · ${selected.time}`} />
                  <InfoItem icon={<MapPin className="h-4 w-4 text-orange-600" />} label="Ubicación" value={selected.location} />
                  <InfoItem icon={<Factory className="h-4 w-4 text-orange-600" />} label="Responsable de Obra" value={selected.responsible} />
                  <InfoItem
                    icon={<Users className="h-4 w-4 text-orange-600" />}
                    label="Plazas / Aforo"
                    value={`${selected.current + (registrations[selected.id] ? 1 : 0)} / ${selected.capacity}`}
                  />
                </div>

                {/* Project summary info */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-heading mb-1.5">Objetivo Operativo</h4>
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 border border-gray-200">
                    {selected.summary}
                  </p>
                </div>

                {/* Progress occupancy bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-600 font-bold uppercase">
                    <span>Nivel de Reservación</span>
                    <span>{Math.round(((selected.current + (registrations[selected.id] ? 1 : 0)) / selected.capacity) * 100)}%</span>
                  </div>
                  <div className="capacity-track p-0.5">
                    <div
                      className={`capacity-fill rounded-sm ${((selected.current + (registrations[selected.id] ? 1 : 0)) / selected.capacity) >= 0.85 ? 'high bg-yellow-500' : ''}`}
                      style={{ width: `${((selected.current + (registrations[selected.id] ? 1 : 0)) / selected.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Required tools & gear */}
                <div className="bg-gray-100 p-4 border border-gray-300">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-900 font-heading mb-2.5">
                    Equipo de Protección EPP Requerido
                  </p>
                  <div className="space-y-2">
                    {selected.materials.map((material) => (
                      <div key={material} className="flex items-center gap-2 text-xs text-gray-700">
                        <Package className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                        <span>{material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User registration form */}
                <div className="border border-gray-300 p-4 space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-heading">
                      Acreditación Técnica de Asistencia
                    </h3>
                    <p className="text-[10px] text-gray-500">Inscríbete en el diario de operaciones.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                        Nombre Completo
                      </label>
                      <input
                        className="w-full input-construction rounded-sm"
                        placeholder="Ej. Ing. Carlos Soto"
                        value={form.name}
                        onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                        Área / Frente de Planta
                      </label>
                      <input
                        className="w-full input-construction rounded-sm"
                        placeholder="Ej. Mantenimiento Mecánico"
                        value={form.area}
                        onChange={(e) => setForm((current) => ({ ...current, area: e.target.value }))}
                      />
                    </div>

                    {error && (
                      <p className="text-[10px] font-mono text-red-600 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {error}
                      </p>
                    )}

                    {registrations[selected.id] && (
                      <div className="bg-green-50 border border-green-300 p-3 text-[10px] text-green-800 font-mono flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                        <div>
                          <p className="font-bold">¡Personal Acreditado!</p>
                          <p className="mt-0.5">Inscrito: {registrations[selected.id].name}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => submitRegistration(selected)}
                      className="w-full btn-construction rounded-sm text-xs font-bold"
                    >
                      {successAnimation ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : registrations[selected.id] ? (
                        <span>Actualizar Registro de Asistencia</span>
                      ) : (
                        <span>Confirmar Asistencia a Obra</span>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-sm">Selecciona una faena de la agenda técnica para revisar sus detalles operativos y gestionar registros.</p>
              </div>
            )}
          </AnimatePresence>
        </aside>

      </main>

      <footer className="py-8 text-center text-sm border-t" style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#fff', marginTop: 40 }}>
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ color: 'var(--color-asfalto)' }}>&copy; {new Date().getFullYear()} Cemvanta Industrial. Todos los derechos reservados.</p>
          <div className="footer-dev">
            <span>Desarrollado por</span>
            <a href="https://jose-socola-jdss.github.io/blyp/" className="footer-logo-link" aria-label="Ir a Blyp">
              <img src="./blyp_logotipo.svg" alt="Blyp Logo" className="footer-logo" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Stats counter helper
function Metric({ label, value }) {
  return (
    <div className="border border-gray-300 bg-gray-50 px-4 py-2 text-center min-w-[100px] shadow-sm">
      <div className="text-lg font-black text-gray-900 font-heading leading-tight">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mt-0.5">{label}</div>
    </div>
  );
}

// Meta item details component
function InfoItem({ icon, label, value }) {
  return (
    <div className="border border-gray-200 bg-white p-3 flex flex-col gap-1 shadow-sm">
      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold font-heading">
        {icon}
        {label}
      </span>
      <p className="text-xs text-gray-900 font-semibold leading-snug">{value}</p>
    </div>
  );
}



export default App;
