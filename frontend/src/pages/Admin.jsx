import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../data/mock";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import {
  Lock, LogOut, Trash2, Mail, Phone, Building2, MessageSquare,
  Briefcase, Users, Calendar, Search, RefreshCw, ArrowUpRight,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = "trombeta_admin_token";

const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function Admin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [authChecking, setAuthChecking] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setAuthChecking(false);
      return;
    }
    axios
      .get(`${API}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setAuthChecking(false))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setAuthChecking(false);
      });
  }, [token]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex gap-2">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e6df]">
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0a0a0b",
            border: "1px solid rgba(212,166,71,0.45)",
            color: "#e8e6df",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
      {!token ? (
        <LoginScreen
          onLogged={(t) => {
            localStorage.setItem(TOKEN_KEY, t);
            setToken(t);
          }}
          onBack={() => navigate("/")}
        />
      ) : (
        <Dashboard
          token={token}
          onLogout={() => {
            localStorage.removeItem(TOKEN_KEY);
            setToken("");
          }}
          onBack={() => navigate("/")}
        />
      )}
    </div>
  );
}

/* ---------------- LOGIN ---------------- */
const LoginScreen = ({ onLogged, onBack }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Preencha usuário e senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { username, password });
      onLogged(res.data.access_token);
      toast.success("Bem-vindo de volta.");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        toast.error(err?.response?.data?.detail || "Muitas tentativas. Aguarde 15 minutos.");
      } else {
        toast.error(err?.response?.data?.detail || "Credenciais inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden px-6">
      <div className="absolute inset-0 dot-grid opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,166,71,0.18),transparent_55%)]" />

      <form
        onSubmit={submit}
        data-testid="admin-login-form"
        className="relative w-full max-w-[440px] border border-gold-strong bg-[#0a0a0b] p-9 md:p-11"
      >
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 right-5 text-[10px] tracking-[0.3em] uppercase text-[#7d7a72] hover:text-gold transition"
        >
          ← Voltar ao site
        </button>

        <div className="flex items-center gap-3 mb-7">
          <img
            src={BRAND.logoMark}
            alt="Trombeta"
            width={44}
            height={44}
            className="w-11 h-11 object-contain"
          />
          <div>
            <div className="font-display text-gold text-[18px] tracking-[0.22em] font-semibold">
              TROMBETA
            </div>
            <div className="text-[10px] text-[#9a978d] tracking-[0.42em] uppercase">
              Painel admin
            </div>
          </div>
        </div>

        <div className="section-label mb-3">Acesso restrito</div>
        <h2 className="font-display text-[28px] text-[#f0ecdf] mb-7 leading-tight">
          Entre para acessar os{" "}
          <span className="serif-italic text-gold-light">leads</span>.
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-[#9a978d] mb-2 block">
              Usuário
            </label>
            <input
              data-testid="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#050505] border border-gold text-[#e8e6df] px-4 py-3 text-[14px] focus:border-gold-strong outline-none transition"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-[#9a978d] mb-2 block">
              Senha
            </label>
            <input
              data-testid="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-gold text-[#e8e6df] px-4 py-3 text-[14px] focus:border-gold-strong outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="admin-login-submit"
          className="btn-gold w-full mt-7 justify-center disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <Lock size={14} strokeWidth={2.2} />}
        </button>
      </form>
    </div>
  );
};

/* ---------------- DASHBOARD ---------------- */
const Dashboard = ({ token, onLogout, onBack }) => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/leads`, { headers }),
        axios.get(`${API}/admin/stats`, { headers }),
      ]);
      setLeads(leadsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        onLogout();
      } else {
        toast.error("Erro ao carregar dados.");
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const remove = async (id) => {
    if (!window.confirm("Excluir este lead?")) return;
    try {
      await axios.delete(`${API}/admin/leads/${id}`, { headers });
      setLeads((arr) => arr.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Lead removido.");
    } catch {
      toast.error("Erro ao remover lead.");
    }
  };

  const filtered = leads.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.company?.toLowerCase().includes(q) ||
      l.service?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-8 md:py-12">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <img
            src={BRAND.logoMark}
            alt="Trombeta"
            width={44}
            height={44}
            className="w-11 h-11 object-contain"
          />
          <div>
            <div className="font-display text-gold text-[18px] tracking-[0.22em] font-semibold">
              TROMBETA
            </div>
            <div className="text-[10px] text-[#9a978d] tracking-[0.42em] uppercase">
              Painel · leads
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAll}
            data-testid="admin-refresh"
            className="btn-outline-gold"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
          <button
            onClick={onBack}
            className="btn-outline-gold"
          >
            <ArrowUpRight size={14} />
            Site
          </button>
          <button
            onClick={onLogout}
            data-testid="admin-logout"
            className="btn-outline-gold"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatBox icon={Users} label="Total de leads" value={stats?.total ?? "·"} />
        <StatBox icon={Calendar} label="Últimas 24h" value={stats?.last_24h ?? "·"} />
        <StatBox icon={Calendar} label="Últimos 7 dias" value={stats?.last_7d ?? "·"} />
        <StatBox
          icon={Briefcase}
          label="Serviço top"
          value={stats?.top_services?.[0]?.service?.split(" ")[0] || "·"}
          small
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7a72]" />
          <input
            data-testid="admin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, empresa, serviço..."
            className="w-full bg-[#0a0a0b] border border-gold text-[#e8e6df] pl-9 pr-4 py-2.5 text-[13px] focus:border-gold-strong outline-none transition"
          />
        </div>
        <div className="text-[11px] tracking-[0.3em] uppercase text-[#7d7a72]">
          {filtered.length} de {leads.length}
        </div>
      </div>

      {/* Leads table + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 border border-gold bg-[#0a0a0b] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="admin-leads-table">
              <thead>
                <tr className="border-b border-gold text-[10px] tracking-[0.28em] uppercase text-[#9a978d]">
                  <th className="text-left px-5 py-3">Nome</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Empresa</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">Serviço</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Quando</th>
                  <th className="text-right px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-[#7d7a72] text-[12px] tracking-[0.3em] uppercase">
                      Carregando...
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-[#7d7a72] text-[13px]">
                      Nenhum lead encontrado.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((l) => (
                    <tr
                      key={l.id}
                      data-testid={`admin-lead-row-${l.id}`}
                      onClick={() => setSelected(l)}
                      className={`border-b border-[rgba(212,166,71,0.12)] cursor-pointer transition hover:bg-[#0e0e0f] ${
                        selected?.id === l.id ? "bg-[#0e0e0f]" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="font-display text-[16px] text-[#f0ecdf]">{l.name}</div>
                        <div className="text-[11px] text-[#7d7a72] mt-0.5">{l.email}</div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#bcb9af] hidden md:table-cell">
                        {l.company || "·"}
                      </td>
                      <td className="px-5 py-4 text-[12px] hidden lg:table-cell">
                        {l.service ? (
                          <span className="text-[10px] tracking-[0.22em] uppercase text-gold-light border border-gold px-2 py-0.5">
                            {l.service}
                          </span>
                        ) : (
                          <span className="text-[#5e5b54]">·</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#bcb9af] hidden md:table-cell">
                        {fmtDate(l.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(l.id);
                          }}
                          data-testid={`admin-lead-delete-${l.id}`}
                          className="text-[#7d7a72] hover:text-gold transition"
                          aria-label="Remover"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="lg:col-span-5 border border-gold bg-[#0a0a0b] p-7" data-testid="admin-detail">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 grid place-items-center border border-gold rounded-full mb-4">
                <Users size={20} className="text-gold-light" />
              </div>
              <p className="text-[13px] text-[#9a978d] max-w-[22ch]">
                Selecione um lead à esquerda para ver os detalhes.
              </p>
            </div>
          ) : (
            <div>
              <div className="section-label mb-3">Lead</div>
              <h3 className="font-display text-[26px] text-[#f0ecdf] leading-tight">
                {selected.name}
              </h3>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#7d7a72] mt-1">
                {fmtDate(selected.created_at)}
              </div>

              <div className="h-divider my-6" />

              <ul className="space-y-4 text-[13px] text-[#dcd8c8]">
                <DetailRow icon={Mail} label="Email">
                  <a href={`mailto:${selected.email}`} className="text-gold-light hover:underline">
                    {selected.email}
                  </a>
                </DetailRow>
                <DetailRow icon={Phone} label="Telefone">
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-light hover:underline"
                  >
                    {selected.phone}
                  </a>
                </DetailRow>
                <DetailRow icon={Building2} label="Empresa">
                  {selected.company || "·"}
                </DetailRow>
                <DetailRow icon={Briefcase} label="Serviço">
                  {selected.service || "·"}
                </DetailRow>
                <DetailRow icon={MessageSquare} label="Mensagem">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {selected.message || "·"}
                  </p>
                </DetailRow>
              </ul>

              <div className="mt-7 flex gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="btn-gold flex-1 justify-center"
                >
                  Responder por email
                </a>
                <button
                  onClick={() => remove(selected.id)}
                  className="btn-outline-gold"
                  data-testid="admin-detail-delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, small }) => (
  <div className="border border-gold bg-[#0a0a0b] p-5 relative overflow-hidden">
    <Icon size={16} className="text-gold-light mb-3" />
    <div
      className={`font-display gold-text-grad leading-tight ${
        small ? "text-[18px]" : "text-[28px]"
      }`}
    >
      {value}
    </div>
    <div className="text-[10px] tracking-[0.3em] uppercase text-[#9a978d] mt-2">
      {label}
    </div>
  </div>
);

const DetailRow = ({ icon: Icon, label, children }) => (
  <li className="flex gap-3">
    <Icon size={15} strokeWidth={1.6} className="text-gold-light shrink-0 mt-1" />
    <div className="flex-1">
      <div className="text-[10px] tracking-[0.3em] uppercase text-[#7d7a72] mb-1">
        {label}
      </div>
      <div>{children}</div>
    </div>
  </li>
);
