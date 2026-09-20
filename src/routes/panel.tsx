import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  getPanelData,
  logout,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  guardarAsistenciaDia,
  asignarCalificacionDocente,
  type DiagnosticoIntento,
  type Momento,
} from "@/lib/api";
import type { ActivityRecord, EstadoAsistencia } from "@/lib/server/store";
import { DIMENSIONES, ITEMS, type Dimension } from "@/lib/diagnostico-data";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Compass,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
  Lock,
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  Check,
  AlertCircle,
  X,
  BookOpen,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/panel")({
  loader: async () => {
    const data = await getPanelData();
    if (!data) throw redirect({ to: "/ingresar" });
    return data;
  },
  head: () => ({
    meta: [{ title: "Panel Docente — I.E. Ciudad de Tunja" }],
  }),
  component: PanelDocentePage,
});

const ACTIVIDADES: { id: string; label: string; icon: string; modulo: "lectura" | "estadistica" }[] = [
  { id: "diag-lectura", label: "Diag. Lectura", icon: "🧭", modulo: "lectura" },
  { id: "tutor-tutor_reto_1", label: "IA Reto 1", icon: "💡", modulo: "lectura" },
  { id: "tutor-tutor_reto_2", label: "IA Reto 2", icon: "🤖", modulo: "lectura" },
  { id: "tutor-tutor_reto_3", label: "IA Reto 3", icon: "🌱", modulo: "lectura" },
  { id: "eval-formativa-lectura", label: "Examen Lectura", icon: "📝", modulo: "lectura" },
  { id: "modulo-1", label: "M1 Frutas", icon: "🥭", modulo: "estadistica" },
  { id: "modulo-2", label: "M2 Gráficos", icon: "🏪", modulo: "estadistica" },
  { id: "modulo-3", label: "M3 Moda", icon: "🧃", modulo: "estadistica" },
  { id: "reto-moneda", label: "Azar Moneda", icon: "🪙", modulo: "estadistica" },
  { id: "reto-ruleta", label: "Azar Ruleta", icon: "🎡", modulo: "estadistica" },
];

function fechaHoyStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fechaCorta(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

function formatFechaLarga(fechaIso: string) {
  const [y, m, d] = fechaIso.split("-").map(Number);
  if (!y || !m || !d) return fechaIso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pct(ok: number, total: number) {
  return total === 0 ? 0 : Math.round((ok / total) * 100);
}

function PanelDocentePage() {
  const data = Route.useLoaderData();
  const router = useRouter();

  type TabId = "estudiantes" | "calificaciones" | "asistencia" | "diagnostico";
  const [activeTab, setActiveTab] = useState<TabId>("calificaciones");

  async function handleSalir() {
    await logout();
    router.navigate({ to: "/" });
  }

  return (
    <main className="bg-paper min-h-screen pb-20">
      {/* HEADER INSTITUCIONAL DOCENTE */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-institutional hover:text-coral transition-colors"
            >
              <span>←</span>
              <span>Portal Principal</span>
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏫</span>
              <div>
                <span className="block text-xs font-bold text-institutional-deep leading-none">
                  I.E. Ciudad de Tunja
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Sede Escilda Medina · Grado 3°
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-cream/70 border border-institutional/20 px-3 py-1.5 rounded-full">
              <span className="text-sm">👩‍🏫</span>
              <span className="text-xs font-bold text-institutional-deep">
                Prof. {data.docente}
              </span>
            </div>
            <button
              onClick={handleSalir}
              className="text-xs font-semibold text-muted-foreground hover:text-coral transition-colors px-2 py-1"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* BARRA DE PESTAÑAS (TABS) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 border-t border-border/50">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab("estudiantes")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "estudiantes"
                  ? "bg-institutional text-white shadow-sm"
                  : "text-muted-foreground hover:bg-cream hover:text-institutional-deep"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gestión de Estudiantes</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === "estudiantes" ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {data.estudiantes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("calificaciones")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "calificaciones"
                  ? "bg-institutional text-white shadow-sm"
                  : "text-muted-foreground hover:bg-cream hover:text-institutional-deep"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Calificaciones y Tareas</span>
            </button>

            <button
              onClick={() => setActiveTab("asistencia")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "asistencia"
                  ? "bg-institutional text-white shadow-sm"
                  : "text-muted-foreground hover:bg-cream hover:text-institutional-deep"
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Control de Asistencia</span>
            </button>

            <button
              onClick={() => setActiveTab("diagnostico")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "diagnostico"
                  ? "bg-institutional text-white shadow-sm"
                  : "text-muted-foreground hover:bg-cream hover:text-institutional-deep"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Pruebas Diagnósticas</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {activeTab === "estudiantes" && (
          <SeccionEstudiantes estudiantes={data.estudiantes} onRefresh={() => router.invalidate()} />
        )}

        {activeTab === "calificaciones" && (
          <SeccionCalificaciones
            estudiantes={data.estudiantes}
            docente={data.docente}
            onRefresh={() => router.invalidate()}
          />
        )}

        {activeTab === "asistencia" && (
          <SeccionAsistencia
            estudiantes={data.estudiantes}
            asistenciaHistorica={data.asistencia}
            onRefresh={() => router.invalidate()}
          />
        )}

        {activeTab === "diagnostico" && (
          <SeccionDiagnosticos
            estudiantes={data.estudiantes}
          />
        )}
      </div>
    </main>
  );
}

/* =========================================================================
   1. SECCIÓN: GESTIÓN DE ESTUDIANTES (CRUD)
   ========================================================================= */

type EstudianteData = {
  usuario: string;
  nombre: string;
  activo: boolean;
  creadoEn?: string;
  actividades: Record<string, ActivityRecord>;
  diagnostico: Partial<Record<Momento, DiagnosticoIntento>>;
  diagnosticoLectura?: any;
};

function SeccionEstudiantes({
  estudiantes,
  onRefresh,
}: {
  estudiantes: EstudianteData[];
  onRefresh: () => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [modalCrear, setModalCrear] = useState(false);
  const [estudianteAEditar, setEstudianteAEditar] = useState<EstudianteData | null>(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState<EstudianteData | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return estudiantes;
    return estudiantes.filter(
      (e) => e.nombre.toLowerCase().includes(q) || e.usuario.toLowerCase().includes(q),
    );
  }, [estudiantes, busqueda]);

  const activosCount = estudiantes.filter((e) => e.activo !== false).length;
  const inactivosCount = estudiantes.length - activosCount;

  return (
    <div className="space-y-6">
      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="card-soft p-4 text-center">
          <div className="text-2xl sm:text-3xl font-display font-bold text-institutional">
            {estudiantes.length}
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Matriculados
          </div>
        </div>
        <div className="card-soft p-4 text-center">
          <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-600">
            {activosCount}
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Estudiantes Activos
          </div>
        </div>
        <div className="card-soft p-4 text-center">
          <div className="text-2xl sm:text-3xl font-display font-bold text-coral">
            {inactivosCount}
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Inactivos / Pausados
          </div>
        </div>
        <div className="card-soft p-4 text-center">
          <div className="text-2xl sm:text-3xl font-display font-bold text-turquoise">
            Grado 3°
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sede Escilda Medina
          </div>
        </div>
      </div>

      {mensaje && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between gap-3 text-sm font-semibold ${
            mensaje.tipo === "ok" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{mensaje.texto}</span>
          <button onClick={() => setMensaje(null)} className="text-xs opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* BARRA DE HERRAMIENTAS: BÚSQUEDA Y CREAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white text-sm focus:border-institutional focus:outline-none"
          />
        </div>

        <button
          onClick={() => setModalCrear(true)}
          className="btn-primary w-full sm:w-auto text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Estudiante</span>
        </button>
      </div>

      {/* TABLA DE ESTUDIANTES */}
      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-institutional text-white">
              <th className="text-left px-4 py-3 font-display">Estudiante</th>
              <th className="text-left px-4 py-3 font-display">Usuario / Código</th>
              <th className="text-center px-4 py-3 font-display">Estado</th>
              <th className="text-center px-4 py-3 font-display">Actividades</th>
              <th className="text-right px-4 py-3 font-display">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                  No se encontraron estudiantes con «{busqueda}».
                </td>
              </tr>
            ) : (
              filtrados.map((est, idx) => {
                const totalCompletadas = ACTIVIDADES.filter((a) => est.actividades[a.id]).length;
                return (
                  <tr key={est.usuario} className={idx % 2 ? "bg-cream/40" : "bg-white"}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-institutional-deep">{est.nombre}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {est.creadoEn ? `Registrado: ${fechaCorta(est.creadoEn)}` : "Lista oficial"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-institutional">
                      {est.usuario}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          est.activo !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {est.activo !== false ? "● Activo" : "○ Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-bold text-institutional-deep">
                        {totalCompletadas} / {ACTIVIDADES.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setEstudianteAEditar(est)}
                          title="Editar nombre o clave"
                          className="p-1.5 rounded-lg bg-cream hover:bg-institutional/10 text-institutional transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEstudianteAEliminar(est)}
                          title="Eliminar estudiante"
                          className="p-1.5 rounded-lg bg-coral/10 hover:bg-coral/25 text-coral transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR ESTUDIANTE */}
      {modalCrear && (
        <ModalCrearEstudiante
          onClose={() => setModalCrear(false)}
          onSuccess={(nombre) => {
            setModalCrear(false);
            setMensaje({ tipo: "ok", texto: `Estudiante «${nombre}» registrado exitosamente.` });
            onRefresh();
          }}
        />
      )}

      {/* MODAL EDITAR ESTUDIANTE */}
      {estudianteAEditar && (
        <ModalEditarEstudiante
          estudiante={estudianteAEditar}
          onClose={() => setEstudianteAEditar(null)}
          onSuccess={() => {
            setEstudianteAEditar(null);
            setMensaje({ tipo: "ok", texto: "Datos actualizados correctamente." });
            onRefresh();
          }}
        />
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {estudianteAEliminar && (
        <ModalEliminarEstudiante
          estudiante={estudianteAEliminar}
          onClose={() => setEstudianteAEliminar(null)}
          onSuccess={() => {
            setEstudianteAEliminar(null);
            setMensaje({ tipo: "ok", texto: "Estudiante eliminado del sistema." });
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ModalCrearEstudiante({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (nombre: string) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sugerencia de usuario automático al escribir el nombre
  function handleNombreChange(val: string) {
    setNombre(val);
    if (!usuario) {
      const parts = val.trim().split(/\s+/);
      if (parts.length >= 2) {
        const apellido = parts[0].toLowerCase().replace(/[^a-z]/g, "");
        const inicial = parts[1][0]?.toLowerCase() || "";
        setUsuario(`${apellido}${inicial}301t`);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !usuario.trim() || !clave.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await crearEstudiante({
        data: {
          nombre: nombre.trim(),
          usuario: usuario.trim(),
          clave: clave.trim(),
        },
      });
      if (res.ok) {
        onSuccess(nombre.trim());
      } else {
        setError(res.error || "No se pudo crear el estudiante.");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h3 className="font-display font-bold text-lg text-institutional-deep">
              Registrar Nuevo Estudiante
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-institutional">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Nombre Completo (Apellidos y Nombres)
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Pérez Gómez Juan David"
              value={nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border focus:border-institutional text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Usuario de Ingreso
            </label>
            <input
              required
              type="text"
              placeholder="Ej: perezj301t"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border focus:border-institutional text-sm font-mono focus:outline-none"
            />
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Identificador único con el que el niño entrará a la plataforma.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Contraseña Inicial
            </label>
            <input
              required
              type="text"
              placeholder="Ej: 12345 o palabra sencilla"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border focus:border-institutional text-sm focus:outline-none"
            />
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Recomendado usar algo fácil de recordar para un niño de 3° de primaria.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-cream rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !nombre || !usuario || !clave}
              className="btn-primary text-xs py-2 px-4 shadow-xs"
            >
              {loading ? "Guardando…" : "Guardar Estudiante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalEditarEstudiante({
  estudiante,
  onClose,
  onSuccess,
}: {
  estudiante: EstudianteData;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nombre, setNombre] = useState(estudiante.nombre);
  const [nuevaClave, setNuevaClave] = useState("");
  const [activo, setActivo] = useState(estudiante.activo !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await actualizarEstudiante({
        data: {
          usuario: estudiante.usuario,
          nombre: nombre.trim(),
          clave: nuevaClave.trim() || undefined,
          activo,
        },
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError(res.error || "No se pudo actualizar.");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-institutional" />
            <h3 className="font-display font-bold text-lg text-institutional-deep">
              Editar Estudiante
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-institutional">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Usuario (No modificable)
            </label>
            <input
              type="text"
              disabled
              value={estudiante.usuario}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-muted/50 text-sm font-mono text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Nombre Completo
            </label>
            <input
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border focus:border-institutional text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Nueva Contraseña (Opcional)
            </label>
            <input
              type="text"
              placeholder="Dejar en blanco para mantener la actual"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border focus:border-institutional text-sm focus:outline-none"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-4 h-4 rounded text-institutional focus:ring-institutional"
              />
              <span className="text-sm font-semibold text-institutional-deep">
                Estudiante Activo (Puede ingresar a la plataforma)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-cream rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !nombre.trim()}
              className="btn-primary text-xs py-2 px-4 shadow-xs"
            >
              {loading ? "Guardando…" : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalEliminarEstudiante({
  estudiante,
  onClose,
  onSuccess,
}: {
  estudiante: EstudianteData;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await eliminarEstudiante({ data: { usuario: estudiante.usuario } });
      if (res.ok) {
        onSuccess();
      } else {
        setError(res.error || "No se pudo eliminar.");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <div className="text-center">
          <h3 className="font-display font-bold text-lg text-institutional-deep">
            ¿Eliminar estudiante?
          </h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Se eliminará a <strong>{estudiante.nombre}</strong> (<code>{estudiante.usuario}</code>).
            Esta acción no se puede deshacer.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-cream rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
          >
            {loading ? "Eliminando…" : "Sí, Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. SECCIÓN: CALIFICACIONES Y TAREAS (CON AJUSTE MANUAL)
   ========================================================================= */

function SeccionCalificaciones({
  estudiantes,
  docente,
  onRefresh,
}: {
  estudiantes: EstudianteData[];
  docente: string;
  onRefresh: () => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroModulo, setFiltroModulo] = useState<"todos" | "lectura" | "estadistica">("todos");
  const [calificando, setCalificando] = useState<{
    estudiante: EstudianteData;
    actividad: (typeof ACTIVIDADES)[number];
    record?: ActivityRecord;
  } | null>(null);

  const actividadesMostradas = useMemo(() => {
    if (filtroModulo === "todos") return ACTIVIDADES;
    return ACTIVIDADES.filter((a) => a.modulo === filtroModulo);
  }, [filtroModulo]);

  const filas = useMemo(() => {
    return estudiantes.map((e) => {
      const completadas = ACTIVIDADES.filter((a) => e.actividades[a.id]).length;
      const notas = ACTIVIDADES.map((a) => {
        const r = e.actividades[a.id];
        if (!r) return undefined;
        return r.notaManual !== undefined ? r.notaManual : r.nota;
      }).filter((n): n is number => n !== undefined);

      const promedio = notas.length
        ? Math.round(notas.reduce((s, n) => s + n, 0) / notas.length)
        : null;

      return {
        ...e,
        completadas,
        promedio,
        pct: Math.round((completadas / ACTIVIDADES.length) * 100),
      };
    });
  }, [estudiantes]);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return filas;
    return filas.filter(
      (f) => f.nombre.toLowerCase().includes(q) || f.usuario.toLowerCase().includes(q),
    );
  }, [filas, busqueda]);

  function exportarCSV() {
    const head = [
      "Estudiante",
      "Usuario",
      ...ACTIVIDADES.map((a) => `${a.label} (Nota Final)`),
      ...ACTIVIDADES.map((a) => `${a.label} (Intentos)`),
      ...ACTIVIDADES.map((a) => `${a.label} (Obs. Docente)`),
      "Actividades Completadas",
      "Progreso %",
      "Promedio Final",
    ];

    const rows = filas.map((f) => [
      f.nombre,
      f.usuario,
      ...ACTIVIDADES.map((a) => {
        const r = f.actividades[a.id];
        if (!r) return "";
        return r.notaManual !== undefined ? r.notaManual : r.nota;
      }),
      ...ACTIVIDADES.map((a) => f.actividades[a.id]?.intentos ?? ""),
      ...ACTIVIDADES.map((a) => f.actividades[a.id]?.observacionDocente ?? ""),
      f.completadas,
      f.pct,
      f.promedio ?? "",
    ]);

    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `libro-calificaciones-tunja-${fechaHoyStr()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-5">
      {/* CABECERA CON ACCIONES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-institutional-deep">
            Libro de Calificaciones Oficial
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Haz clic en cualquier celda para calificar manualmente o agregar retroalimentación.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl bg-muted/60 p-1 border border-border">
            <button
              onClick={() => setFiltroModulo("todos")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filtroModulo === "todos" ? "bg-white shadow-xs text-institutional-deep" : "text-muted-foreground"
              }`}
            >
              Todas (10)
            </button>
            <button
              onClick={() => setFiltroModulo("lectura")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filtroModulo === "lectura" ? "bg-white shadow-xs text-coral" : "text-muted-foreground"
              }`}
            >
              📖 Lectura (5)
            </button>
            <button
              onClick={() => setFiltroModulo("estadistica")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filtroModulo === "estadistica" ? "bg-white shadow-xs text-turquoise" : "text-muted-foreground"
              }`}
            >
              📊 Estadística (5)
            </button>
          </div>

          <button onClick={exportarCSV} className="btn-primary text-xs py-2 px-3.5 flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE CALIFICACIONES */}
      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[850px]">
          <thead>
            <tr className="bg-institutional text-white">
              <th className="text-left px-4 py-3 font-display sticky left-0 bg-institutional z-10">
                Estudiante
              </th>
              {actividadesMostradas.map((a) => (
                <th key={a.id} className="px-2 py-3 text-center font-display whitespace-nowrap">
                  {a.icon} {a.label}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-display">Progreso</th>
              <th className="px-3 py-3 text-center font-display">Definitiva</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((f, i) => (
              <tr key={f.usuario} className={i % 2 ? "bg-cream/50" : "bg-white"}>
                <td className="px-4 py-2.5 sticky left-0 bg-inherit z-10">
                  <div className="font-semibold text-institutional-deep leading-tight">
                    {f.nombre}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{f.usuario}</div>
                </td>

                {actividadesMostradas.map((a) => {
                  const rec: ActivityRecord | undefined = f.actividades[a.id];
                  const tieneManual = rec?.notaManual !== undefined;
                  const notaFinal = tieneManual ? rec.notaManual! : rec?.nota;

                  return (
                    <td
                      key={a.id}
                      onClick={() => setCalificando({ estudiante: f, actividad: a, record: rec })}
                      className="px-2 py-2.5 text-center cursor-pointer hover:bg-turquoise/10 transition-colors group"
                      title="Clic para editar o ajustar nota"
                    >
                      {rec && notaFinal !== undefined ? (
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold text-xs ${
                              notaFinal >= 80
                                ? "bg-turquoise/20 text-institutional-deep"
                                : notaFinal >= 60
                                  ? "bg-gold/30 text-institutional-deep"
                                  : "bg-coral/15 text-coral"
                            }`}
                          >
                            <span>{notaFinal}</span>
                            {tieneManual && (
                              <span className="text-[10px]" title="Nota asignada o ajustada por el profesor">
                                ✏️
                              </span>
                            )}
                          </span>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {rec.intentos} {rec.intentos === 1 ? "intento" : "intentos"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30 group-hover:text-institutional text-xs">
                          + Calificar
                        </span>
                      )}
                    </td>
                  );
                })}

                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-14 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-turquoise to-coral"
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-institutional-deep w-8">{f.pct}%</span>
                  </div>
                </td>

                <td className="px-3 py-2.5 text-center font-display font-bold text-base text-institutional-deep">
                  {f.promedio !== null ? (
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg ${
                        f.promedio >= 80
                          ? "bg-emerald-100 text-emerald-900"
                          : f.promedio >= 60
                            ? "bg-amber-100 text-amber-900"
                            : "bg-rose-100 text-rose-900"
                      }`}
                    >
                      {f.promedio}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CALIFICAR / AJUSTAR NOTA */}
      {calificando && (
        <ModalCalificarActividad
          estudiante={calificando.estudiante}
          actividad={calificando.actividad}
          record={calificando.record}
          onClose={() => setCalificando(null)}
          onSuccess={() => {
            setCalificando(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ModalCalificarActividad({
  estudiante,
  actividad,
  record,
  onClose,
  onSuccess,
}: {
  estudiante: EstudianteData;
  actividad: (typeof ACTIVIDADES)[number];
  record?: ActivityRecord;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nota, setNota] = useState(
    record?.notaManual !== undefined ? String(record.notaManual) : record ? String(record.nota) : "100",
  );
  const [observacion, setObservacion] = useState(record?.observacionDocente || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(nota);
    if (isNaN(num) || num < 0 || num > 100) {
      setError("La nota debe estar entre 0 y 100.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await asignarCalificacionDocente({
        data: {
          usuario: estudiante.usuario,
          actividadId: actividad.id,
          nota: num,
          observacion: observacion.trim() || undefined,
        },
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError(res.error || "Error al asignar la calificación.");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{actividad.icon}</span>
              <h3 className="font-display font-bold text-lg text-institutional-deep">
                Calificar: {actividad.label}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Estudiante: <strong>{estudiante.nombre}</strong>
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-institutional">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {record && (
          <div className="bg-cream/60 p-3 rounded-xl border border-border/80 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nota calculada por sistema:</span>
              <span className="font-bold text-institutional-deep">{record.nota} / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Intentos realizados:</span>
              <span className="font-bold text-institutional-deep">{record.intentos}</span>
            </div>
            {record.detalle && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Detalle del logro:</span>
                <span className="font-semibold text-institutional">{record.detalle}</span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Calificación Final del Docente (0 - 100)
            </label>
            <input
              required
              type="number"
              min="0"
              max="100"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-institutional/20 focus:border-coral text-lg font-bold text-institutional-deep focus:outline-none text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-turquoise mb-1">
              Retroalimentación / Observación Pedagógica
            </label>
            <textarea
              rows={3}
              placeholder="Ej: Excelente lectura comprensiva, demostró buen vocabulario en el manglar."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border focus:border-institutional text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-cream rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Guardando…" : "Guardar Nota"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   3. SECCIÓN: CONTROL DE ASISTENCIA DIARIO
   ========================================================================= */

function SeccionAsistencia({
  estudiantes,
  asistenciaHistorica,
  onRefresh,
}: {
  estudiantes: EstudianteData[];
  asistenciaHistorica: Record<string, { fecha: string; tema?: string; registros: Record<string, { estado: EstadoAsistencia; observacion?: string }> }>;
  onRefresh: () => void;
}) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaHoyStr());
  const [temaClase, setTemaClase] = useState(asistenciaHistorica[fechaHoyStr()]?.tema || "");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Registro del día actual en memoria local
  const [registrosLocales, setRegistrosLocales] = useState<
    Record<string, { estado: EstadoAsistencia; observacion?: string }>
  >(() => {
    return asistenciaHistorica[fechaHoyStr()]?.registros || {};
  });

  // Al cambiar la fecha seleccionada, cargar sus datos correspondientes
  function handleCambiarFecha(nuevaFecha: string) {
    setFechaSeleccionada(nuevaFecha);
    const dia = asistenciaHistorica[nuevaFecha];
    setTemaClase(dia?.tema || "");
    setRegistrosLocales(dia?.registros || {});
    setMensaje(null);
  }

  function handleEstadoChange(usuario: string, estado: EstadoAsistencia) {
    setRegistrosLocales((prev) => ({
      ...prev,
      [usuario]: {
        ...prev[usuario],
        estado,
      },
    }));
  }

  function handleObservacionChange(usuario: string, observacion: string) {
    setRegistrosLocales((prev) => ({
      ...prev,
      [usuario]: {
        ...prev[usuario],
        estado: prev[usuario]?.estado || "presente",
        observacion,
      },
    }));
  }

  function marcarTodosPresentes() {
    const nuevo: Record<string, { estado: EstadoAsistencia; observacion?: string }> = {};
    for (const e of estudiantes) {
      nuevo[e.usuario] = {
        estado: "presente",
        observacion: registrosLocales[e.usuario]?.observacion || "",
      };
    }
    setRegistrosLocales(nuevo);
  }

  async function handleGuardar() {
    setGuardando(true);
    setMensaje(null);
    try {
      const res = await guardarAsistenciaDia({
        data: {
          fecha: fechaSeleccionada,
          tema: temaClase.trim() || undefined,
          registros: registrosLocales,
        },
      });
      if (res.ok) {
        setMensaje("¡Asistencia guardada con éxito en el sistema!");
        onRefresh();
      }
    } catch (err: any) {
      setMensaje("Error al guardar asistencia: " + err.message);
    } finally {
      setGuardando(false);
    }
  }

  // Cálculos estadísticos del día
  const activos = estudiantes.filter((e) => e.activo !== false);
  const presentesCount = activos.filter((e) => (registrosLocales[e.usuario]?.estado || "presente") === "presente").length;
  const retardosCount = activos.filter((e) => registrosLocales[e.usuario]?.estado === "retardo").length;
  const excusasCount = activos.filter((e) => registrosLocales[e.usuario]?.estado === "excusa").length;
  const ausentesCount = activos.filter((e) => registrosLocales[e.usuario]?.estado === "ausente").length;
  const pctAsistenciaDia = activos.length ? Math.round(((presentesCount + retardosCount) / activos.length) * 100) : 100;

  function exportarAsistenciaCSV() {
    const fechas = Object.keys(asistenciaHistorica).sort();
    const head = ["Estudiante", "Usuario", ...fechas.map((f) => `Fecha ${f}`)];
    const rows = estudiantes.map((e) => [
      e.nombre,
      e.usuario,
      ...fechas.map((f) => {
        const r = asistenciaHistorica[f]?.registros?.[e.usuario];
        if (!r) return "—";
        return r.estado.toUpperCase() + (r.observacion ? ` (${r.observacion})` : "");
      }),
    ]);

    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reporte-asistencia-${fechaHoyStr()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-6">
      {/* NAVEGADOR DE FECHAS */}
      <div className="card-soft p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-bold uppercase tracking-wider text-institutional-deep">
            Fecha de Clase:
          </label>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => handleCambiarFecha(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border font-semibold text-sm focus:border-institutional focus:outline-none"
          />
          <button
            onClick={() => handleCambiarFecha(fechaHoyStr())}
            className="text-xs font-bold text-institutional px-2.5 py-1 bg-white rounded-lg border border-border hover:bg-cream"
          >
            Hoy
          </button>
          <span className="text-xs font-semibold text-muted-foreground capitalize">
            🗓️ {formatFechaLarga(fechaSeleccionada)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={marcarTodosPresentes}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Todos Presentes</span>
          </button>

          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-xs w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>{guardando ? "Guardando…" : "Guardar Asistencia"}</span>
          </button>

          <button
            onClick={exportarAsistenciaCSV}
            title="Exportar reporte acumulado"
            className="p-2 rounded-xl bg-white border border-border text-muted-foreground hover:text-institutional hover:bg-cream"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
          {mensaje}
        </div>
      )}

      {/* TEMA DE LA CLASE Y RESUMEN RÁPIDO */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="col-span-2 card-soft p-3 flex flex-col justify-center">
          <label className="text-[11px] font-bold uppercase text-turquoise mb-1">
            Tema de la sesión (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Taller 3 · Gráficos de barras y Cuento del Manglar"
            value={temaClase}
            onChange={(e) => setTemaClase(e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-white focus:outline-none"
          />
        </div>
        <div className="card-soft p-3 text-center">
          <div className="font-display font-bold text-xl text-emerald-600">{presentesCount}</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Presentes</div>
        </div>
        <div className="card-soft p-3 text-center">
          <div className="font-display font-bold text-xl text-amber-600">{retardosCount}</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Retardos</div>
        </div>
        <div className="card-soft p-3 text-center">
          <div className="font-display font-bold text-xl text-rose-600">{ausentesCount}</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Ausentes</div>
        </div>
      </div>

      {/* LISTA INTERACTIVA DE ESTUDIANTES PARA ASISTENCIA */}
      <div className="card-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-institutional text-white">
              <th className="text-left px-4 py-3 font-display">Estudiante</th>
              <th className="text-center px-4 py-3 font-display">Estado de Asistencia</th>
              <th className="text-left px-4 py-3 font-display">Observación / Excusa</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est, i) => {
              const reg = registrosLocales[est.usuario];
              const estado: EstadoAsistencia = reg?.estado || "presente";

              return (
                <tr key={est.usuario} className={i % 2 ? "bg-cream/40" : "bg-white"}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-institutional-deep">{est.nombre}</div>
                    <div className="text-xs text-muted-foreground font-mono">{est.usuario}</div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-border shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleEstadoChange(est.usuario, "presente")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          estado === "presente"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "text-muted-foreground hover:bg-emerald-50"
                        }`}
                      >
                        P · Presente
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEstadoChange(est.usuario, "retardo")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          estado === "retardo"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-muted-foreground hover:bg-amber-50"
                        }`}
                      >
                        R · Retardo
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEstadoChange(est.usuario, "excusa")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          estado === "excusa"
                            ? "bg-sky-500 text-white shadow-xs"
                            : "text-muted-foreground hover:bg-sky-50"
                        }`}
                      >
                        E · Excusa
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEstadoChange(est.usuario, "ausente")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          estado === "ausente"
                            ? "bg-rose-500 text-white shadow-xs"
                            : "text-muted-foreground hover:bg-rose-50"
                        }`}
                      >
                        A · Ausente
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Nota rápida opcional…"
                      value={reg?.observacion || ""}
                      onChange={(e) => handleObservacionChange(est.usuario, e.target.value)}
                      className="w-full px-3 py-1 rounded-lg border border-border text-xs focus:border-institutional focus:outline-none"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   4. SECCIÓN: PRUEBAS DIAGNÓSTICAS (LECTURA Y ESTADÍSTICA)
   ========================================================================= */

function CeldaMomento({ intento }: { intento?: DiagnosticoIntento }) {
  if (!intento) return <span className="text-muted-foreground/40">—</span>;
  const t = intento.evaluacion.total;
  const p = pct(t.ok, t.total);
  return (
    <div>
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 font-bold text-xs ${
          p >= 80
            ? "bg-turquoise/20 text-institutional-deep"
            : p >= 60
              ? "bg-gold/30 text-institutional-deep"
              : "bg-coral/15 text-coral"
        }`}
      >
        {p}%
      </span>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        {(["d1", "d2", "d3"] as Dimension[])
          .map((d) => {
            const dim = intento.evaluacion.porDimension[d];
            return `${d.toUpperCase()} ${pct(dim.ok, dim.total)}`;
          })
          .join(" · ")}
      </div>
    </div>
  );
}

function SeccionDiagnosticos({
  estudiantes,
}: {
  estudiantes: EstudianteData[];
}) {
  const presentaronPre = estudiantes.filter((e) => e.diagnostico.pre);
  const presentaronPost = estudiantes.filter((e) => e.diagnostico.post);
  const itemsEvaluables = ITEMS.filter((i) => !i.abierta);

  return (
    <div className="space-y-8">
      {/* SUB-SECCIÓN: DIAGNÓSTICO DE COMPRENSIÓN LECTORA */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coral">
              Módulo de Lectura e IA · Grado 3°
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-institutional-deep">
              Diagnóstico Automatizado de Lectura
            </h3>
          </div>
          <Link
            to="/diagnostico-lectura"
            target="_blank"
            className="text-xs font-semibold text-institutional underline hover:text-coral"
          >
            Abrir prueba de diagnóstico ↗
          </Link>
        </div>

        <div className="card-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="bg-institutional text-white">
                <th className="text-left px-4 py-3 font-display">Estudiante</th>
                <th className="text-center px-4 py-3 font-display">Nivel Asignado</th>
                <th className="text-center px-4 py-3 font-display">Literal (4)</th>
                <th className="text-center px-4 py-3 font-display">Inferencial (4)</th>
                <th className="text-center px-4 py-3 font-display">Crítico (2)</th>
                <th className="text-center px-4 py-3 font-display">Aciertos / %</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((e, idx) => {
                const dl = e.diagnosticoLectura;
                return (
                  <tr key={e.usuario} className={idx % 2 ? "bg-cream/40" : "bg-white"}>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-institutional-deep">{e.nombre}</div>
                      <div className="text-xs text-muted-foreground font-mono">{e.usuario}</div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {dl ? (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                            dl.nivelAsignado === "maestro"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : dl.nivelAsignado === "aventurero"
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          {dl.nivelAsignado}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">Pendiente</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center font-semibold">
                      {dl ? `${dl.desglose.literal} / 4` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center font-semibold">
                      {dl ? `${dl.desglose.inferencial} / 4` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center font-semibold">
                      {dl ? `${dl.desglose.critico} / 2` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-institutional">
                      {dl ? `${dl.desglose.porcentaje}% (${dl.desglose.total}/10)` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* SUB-SECCIÓN: PRUEBA DIAGNÓSTICA DE ESTADÍSTICA (PRE/POST) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-turquoise">
              Módulo de Estadística · Grado 3°
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-institutional-deep">
              Prueba Diagnóstica «Exploradores de Datos» (Pre y Post Test)
            </h3>
          </div>
          <div className="text-xs text-muted-foreground">
            Pre-test: <strong>{presentaronPre.length}</strong> · Post-test:{" "}
            <strong>{presentaronPost.length}</strong>
          </div>
        </div>

        <div className="card-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="bg-institutional text-white">
                <th className="text-left px-4 py-3 font-display">Estudiante</th>
                <th className="px-3 py-3 text-center font-display">🧭 Prueba Inicial</th>
                <th className="px-3 py-3 text-center font-display">🏁 Prueba Final</th>
                <th className="px-3 py-3 text-center font-display">Δ Avance</th>
                <th className="px-3 py-3 text-center font-display">Respuestas Abiertas</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((e, i) => {
                const pre = e.diagnostico.pre;
                const post = e.diagnostico.post;
                const delta =
                  pre && post
                    ? pct(post.evaluacion.total.ok, post.evaluacion.total.total) -
                      pct(pre.evaluacion.total.ok, pre.evaluacion.total.total)
                    : null;
                return (
                  <tr key={e.usuario} className={i % 2 ? "bg-cream/40" : "bg-white"}>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-institutional-deep">{e.nombre}</div>
                      <div className="text-xs text-muted-foreground font-mono">{e.usuario}</div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <CeldaMomento intento={pre} />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <CeldaMomento intento={post} />
                    </td>
                    <td className="px-3 py-2.5 text-center font-display font-bold">
                      {delta === null ? (
                        <span className="text-muted-foreground/40">—</span>
                      ) : (
                        <span className={delta >= 0 ? "text-emerald-600" : "text-coral"}>
                          {delta > 0 ? "+" : ""}
                          {delta}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {pre || post ? (
                        <details className="text-left">
                          <summary className="cursor-pointer text-xs font-bold text-coral text-center">
                            Ver ✍️
                          </summary>
                          <div className="mt-2 space-y-2 text-xs text-institutional-deep max-w-56">
                            {(["pre", "post"] as Momento[]).map((m) => {
                              const d = e.diagnostico[m];
                              if (!d) return null;
                              return (
                                <div key={m} className="bg-cream rounded-lg p-2">
                                  <div className="font-bold uppercase text-[10px] text-turquoise">
                                    {m === "pre" ? "Inicial" : "Final"}
                                  </div>
                                  <p>
                                    <strong>19 (ruletas):</strong> {d.abiertas.i19 || "—"}
                                  </p>
                                  <p>
                                    <strong>24 (aprendizaje):</strong> {d.abiertas.i24 || "—"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}