"use client";

import { useMemo, useState } from "react";
import RecordsModule from "@/components/records-module";
import {
  Activity, AlertTriangle, Archive, ArrowUpRight, BadgeCheck, Bell, BookOpen,
  BriefcaseBusiness, Building2, CalendarClock, Camera, ChevronDown, ClipboardList,
  FileSearch, Fingerprint, FolderClosed, Gauge, KeyRound, LayoutDashboard, Menu,
  Plus, Radio, Search, Settings, Shield, ShieldAlert, UserRound, Users, X
} from "lucide-react";

type CaseItem = { code: string; title: string; status: string; priority: string; division: string; lead: string; updated: string };
const initialCases: CaseItem[] = [
  { code: "FBI-2026-014", title: "Operation Black Harbor", status: "ACTIVE", priority: "CRITICAL", division: "CID", lead: "A. Morgan", updated: "12 perce" },
  { code: "FBI-2026-013", title: "West Vinewood fegyverkereskedelem", status: "REVIEW", priority: "HIGH", division: "CID", lead: "J. Carter", updated: "48 perce" },
  { code: "FBI-2026-012", title: "Városházi korrupciós ügy", status: "ACTIVE", priority: "HIGH", division: "ISD", lead: "M. Reed", updated: "2 órája" },
  { code: "FBI-2026-011", title: "Cypress Flats megfigyelés", status: "OPEN", priority: "NORMAL", division: "SOD", lead: "S. Brooks", updated: "Tegnap" },
  { code: "FBI-2026-009", title: "Pacific Standard pénzmosás", status: "ACTIVE", priority: "HIGH", division: "CID", lead: "A. Morgan", updated: "Tegnap" }
];
const nav = [
  { name: "Áttekintés", icon: LayoutDashboard, group: "FŐMENÜ" },
  { name: "Nyomozati ügyek", icon: FolderClosed, group: "FŐMENÜ" },
  { name: "Személyi adatbázis", icon: Users, group: "FŐMENÜ" },
  { name: "Járműnyilvántartás", icon: BriefcaseBusiness, group: "FŐMENÜ" },
  { name: "Bizonyítéktár", icon: Archive, group: "FŐMENÜ" },
  { name: "Jelentések", icon: ClipboardList, group: "FŐMENÜ" },
  { name: "Műveletek", icon: ShieldAlert, group: "OPERATÍV" },
  { name: "Fedőazonosságok", icon: Fingerprint, group: "OPERATÍV" },
  { name: "Megfigyelés / CCTV", icon: Camera, group: "OPERATÍV" },
  { name: "Ügynökök", icon: UserRound, group: "ADMINISZTRÁCIÓ" },
  { name: "Osztályok és rangok", icon: Building2, group: "ADMINISZTRÁCIÓ" },
  { name: "Audit napló", icon: Activity, group: "ADMINISZTRÁCIÓ" },
  { name: "Beállítások", icon: Settings, group: "ADMINISZTRÁCIÓ" }
];
const navNotes: Record<string, string> = {
  "Nyomozati ügyek": "Ügyek, státuszok, prioritások, felelős ügynökök és kapcsolódó bizonyítékok.",
  "Személyi adatbázis": "Személyek, aliasok, kockázati besorolás, körözések és ügykapcsolatok.",
  "Járműnyilvántartás": "Rendszámok, járműadatok, tulajdonosok és nyomozati összefüggések.",
  "Bizonyítéktár": "Bizonyítékazonosítók, átadási lánc, gyűjtő ügynök és tárolási státusz.",
  "Jelentések": "Nyomozói, kihallgatási, megfigyelési és műveleti jelentések.",
  "Műveletek": "Műveleti tervek, célok, helyszínek, besorolás és jóváhagyás.",
  "Fedőazonosságok": "RP fedőnevek, ideiglenes személyes adatok és engedélyezési státusz.",
  "Megfigyelés / CCTV": "Kamerapontok, megfigyelési jegyzetek és élő kamerarendszer-integráció helye.",
  "Ügynökök": "Ügynöki profilok, jelvényszámok, részlegek, rangok és aktív státusz.",
  "Osztályok és rangok": "CID, SOD, ISD és az FBI hierarchia konfigurációja.",
  "Audit napló": "Adminisztratív események és adatváltozások naplózása.",
  "Beállítások": "Frakció neve, adatkezelési beállítások és alkalmazáskonfiguráció."
};

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate: "border-slate-700 bg-slate-800/70 text-slate-300",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300"
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold tracking-[.12em] ${tones[tone] || tones.slate}`}>{children}</span>;
}

export default function Dashboard() {
  const [active, setActive] = useState("Áttekintés");
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState(initialCases);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [mobileNav, setMobileNav] = useState(false);
  const filtered = useMemo(() => cases.filter(c => `${c.code} ${c.title} ${c.division} ${c.lead}`.toLowerCase().includes(search.toLowerCase())), [cases, search]);
  const isHome = active === "Áttekintés";
  function createCase() {
    if (!title.trim()) return;
    const num = String(15 + cases.length - initialCases.length).padStart(3, "0");
    setCases([{ code: `FBI-2026-${num}`, title, status: "OPEN", priority, division: "CID", lead: "Saját ügynök", updated: "Most" }, ...cases]);
    setTitle(""); setModal(false); setActive("Nyomozati ügyek");
  }

  return <div className="min-h-screen bg-[#080d15] text-slate-100">
    <div className="flex min-h-screen">
      <aside className={`${mobileNav ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"} w-[250px] shrink-0 flex-col border-r border-white/[.07] bg-[#0b121d] lg:flex`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-white/[.07] px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300"><Shield size={22}/></div>
          <div><div className="text-[13px] font-bold tracking-[.18em]">FBI <span className="text-blue-400">OPS</span></div><div className="mt-1 text-[9px] tracking-[.22em] text-slate-500">OPERATIONS CENTER</div></div>
          {mobileNav && <button className="ml-auto text-slate-400" onClick={() => setMobileNav(false)}><X size={18}/></button>}
        </div>
        <div className="mx-4 mt-4 rounded-xl border border-white/[.07] bg-white/[.025] p-3">
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"/><span className="text-[10px] font-semibold tracking-[.15em] text-emerald-300">SECURE CONNECTION</span></div>
          <div className="mt-2 text-xs text-slate-400">Los Santos Field Office</div>
          <div className="mt-1 text-[10px] text-slate-600">SESSION: LS-OPS-0148</div>
        </div>
        <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-5">
          {["FŐMENÜ", "OPERATÍV", "ADMINISZTRÁCIÓ"].map(group => <div key={group} className="mb-5">
            <div className="mb-2 px-3 text-[9px] font-bold tracking-[.2em] text-slate-600">{group}</div>
            {nav.filter(n => n.group === group).map(n => <button key={n.name} onClick={() => { setActive(n.name); setMobileNav(false); }} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-left text-[12px] transition ${active === n.name ? "border border-blue-400/15 bg-blue-500/[.12] text-blue-200" : "text-slate-400 hover:bg-white/[.04] hover:text-slate-200"}`}>
              <n.icon size={15} strokeWidth={1.8}/><span>{n.name}</span>{n.name === "Nyomozati ügyek" && <span className="ml-auto rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">{cases.length}</span>}
            </button>)}
          </div>)}
        </nav>
        <div className="border-t border-white/[.07] p-4">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/30 to-slate-700 text-xs font-bold text-blue-100">AM</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Alex Morgan</div><div className="mt-1 text-[10px] text-slate-500">Special Agent in Charge</div></div><ChevronDown size={14} className="text-slate-500"/></div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-white/[.07] px-4 sm:px-7">
          <div className="flex items-center gap-3"><button className="text-slate-400 lg:hidden" onClick={() => setMobileNav(true)}><Menu size={19}/></button><div><div className="text-[10px] tracking-[.18em] text-slate-500">FEDERAL BUREAU OF INVESTIGATION</div><div className="mt-1 text-sm font-semibold">{active}</div></div></div>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-2 md:flex"><Radio size={13} className="text-emerald-400"/><span className="text-[10px] text-slate-400">SYSTEMS OPERATIONAL</span></div><button className="relative rounded-lg border border-white/[.08] p-2 text-slate-400 hover:bg-white/[.04]"><Bell size={16}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"/></button><div className="hidden h-8 w-px bg-white/[.08] sm:block"/><div className="hidden text-right sm:block"><div className="text-[11px] font-semibold">FBI-001</div><div className="mt-1 text-[9px] text-slate-500">LEVEL 4 ACCESS</div></div></div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-7">
          {isHome ? <>
            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div><div className="mb-2 flex items-center gap-2"><Badge tone="blue">FIELD OFFICE · LOS SANTOS</Badge><Badge tone="green">LIVE</Badge></div><h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">Operations overview<span className="text-blue-400">.</span></h1><p className="mt-2 text-xs text-slate-500">Üdvözöljük a központi műveleti felületen, ügynök.</p></div>
              <button onClick={() => setModal(true)} className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400"><Plus size={15}/> Új nyomozati ügy</button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "AKTÍV NYOMOZÁSOK", value: String(cases.filter(c => c.status === "ACTIVE").length), detail: "+2 ezen a héten", icon: FileSearch, color: "text-blue-300", bg: "bg-blue-400/10" },
                { label: "NYITOTT ÜGYEK", value: String(cases.filter(c => c.status === "OPEN").length), detail: "Feldolgozásra vár", icon: FolderClosed, color: "text-amber-300", bg: "bg-amber-400/10" },
                { label: "KRITIKUS PRIORITÁS", value: String(cases.filter(c => c.priority === "CRITICAL").length), detail: "Azonnali figyelmet igényel", icon: AlertTriangle, color: "text-red-300", bg: "bg-red-400/10" },
                { label: "AKTÍV ÜGYNÖKÖK", value: "18", detail: "3 részleg szolgálatban", icon: Users, color: "text-emerald-300", bg: "bg-emerald-400/10" }
              ].map(s => <div key={s.label} className="rounded-xl border border-white/[.07] bg-[#0d1521] p-4">
                <div className="flex items-start justify-between"><div className="text-[9px] font-bold tracking-[.16em] text-slate-500">{s.label}</div><div className={`rounded-lg p-2 ${s.bg} ${s.color}`}><s.icon size={16}/></div></div><div className="mt-3 text-[28px] font-semibold tracking-tight">{s.value}</div><div className="mt-1 text-[10px] text-slate-500">{s.detail}</div>
              </div>)}
            </div>

            <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
              <section className="overflow-hidden rounded-xl border border-white/[.07] bg-[#0d1521]">
                <div className="flex flex-col gap-3 border-b border-white/[.06] p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">Legutóbbi nyomozati ügyek</h2><p className="mt-1 text-[10px] text-slate-500">Folyamatban lévő és friss akták</p></div><div className="flex gap-2"><div className="flex items-center gap-2 rounded-lg border border-white/[.08] px-2.5 py-2"><Search size={13} className="text-slate-500"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Keresés..." className="w-28 bg-transparent text-[11px] outline-none placeholder:text-slate-600 sm:w-36"/></div><button onClick={() => setActive("Nyomozati ügyek")} className="text-[10px] font-semibold text-blue-300 hover:text-blue-200">Összes ügy <ArrowUpRight size={12} className="ml-1 inline"/></button></div></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-white/[.05] text-[9px] tracking-[.14em] text-slate-600"><th className="px-4 py-3 font-semibold">ÜGY / AZONOSÍTÓ</th><th className="px-3 py-3 font-semibold">STÁTUSZ</th><th className="px-3 py-3 font-semibold">PRIORITÁS</th><th className="px-3 py-3 font-semibold">FELELŐS</th><th className="px-4 py-3 text-right font-semibold">FRISSÍTVE</th></tr></thead><tbody>{filtered.map(c => <tr key={c.code} className="border-b border-white/[.04] transition hover:bg-white/[.02]"><td className="px-4 py-3.5"><div className="text-[11px] font-medium">{c.title}</div><div className="mt-1 text-[9px] tracking-[.1em] text-slate-600">{c.code} <span className="mx-1">/</span>{c.division}</div></td><td className="px-3 py-3.5"><Badge tone={c.status === "ACTIVE" ? "blue" : c.status === "REVIEW" ? "amber" : "slate"}>{c.status}</Badge></td><td className="px-3 py-3.5"><Badge tone={c.priority === "CRITICAL" ? "red" : c.priority === "HIGH" ? "amber" : "slate"}>{c.priority}</Badge></td><td className="px-3 py-3.5 text-[11px] text-slate-400">{c.lead}</td><td className="px-4 py-3.5 text-right text-[10px] text-slate-500">{c.updated}</td></tr>)}</tbody></table></div>
                <div className="flex items-center justify-between px-4 py-3"><span className="text-[10px] text-slate-600">Demo adatok · helyi állapot</span><button onClick={() => setActive("Nyomozati ügyek")} className="text-[10px] text-slate-400 hover:text-white">Ügykezelő megnyitása →</button></div>
              </section>

              <div className="space-y-5">
                <section className="rounded-xl border border-white/[.07] bg-[#0d1521] p-4">
                  <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Műveleti állapot</h2><p className="mt-1 text-[10px] text-slate-500">Részlegek aktivitása</p></div><Gauge size={16} className="text-slate-500"/></div>
                  {[["CID · Criminal Investigation", 78, "text-blue-300"], ["SOD · Special Operations", 52, "text-amber-300"], ["ISD · Internal Security", 34, "text-emerald-300"]].map(([label, value, color]) => <div key={String(label)} className="mb-4 last:mb-0"><div className="mb-2 flex justify-between text-[10px]"><span className="text-slate-400">{label}</span><span className={String(color)}>{value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${value === 78 ? "bg-blue-400" : value === 52 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${value}%` }}/></div></div>)}
                </section>
                <section className="rounded-xl border border-white/[.07] bg-[#0d1521] p-4">
                  <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Operatív események</h2><Badge tone="red">2 PRIORITY</Badge></div>
                  {[["13:42", "Műveleti engedély szükséges", "Operation Black Harbor · SOD", "red"], ["12:18", "Bizonyíték feltöltve", "FBI-2026-013 · CID", "blue"], ["10:56", "Új megfigyelési pont", "Cypress Flats · Surveillance", "amber"]].map(([time, name, sub, tone]) => <div key={time} className="flex gap-3 border-b border-white/[.04] py-3 last:border-0"><div className="pt-0.5 text-[10px] tabular-nums text-slate-600">{time}</div><div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "red" ? "bg-red-400" : tone === "blue" ? "bg-blue-400" : "bg-amber-400"}`}/><div><div className="text-[11px] font-medium">{name}</div><div className="mt-1 text-[10px] text-slate-500">{sub}</div></div></div>)}
                </section>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[["Új jelentés", ClipboardList, "Jelentés készítése"], ["Személy keresése", UserRound, "Adatbázis megnyitása"], ["Művelet tervezése", ShieldAlert, "Operatív tervező"], ["Bizonyíték rögzítése", Archive, "Bizonyítéktár"]].map(([label, Icon, sub]) => <button key={String(label)} onClick={() => setActive(String(label) === "Új jelentés" ? "Jelentések" : String(label) === "Személy keresése" ? "Személyi adatbázis" : String(label) === "Művelet tervezése" ? "Műveletek" : "Bizonyítéktár")} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-[#0d1521] p-3 text-left transition hover:border-blue-400/20 hover:bg-blue-500/[.04]"><div className="rounded-lg bg-slate-800/70 p-2 text-blue-300"><Icon size={16}/></div><div><div className="text-[11px] font-semibold">{String(label)}</div><div className="mt-1 text-[9px] text-slate-500">{String(sub)}</div></div></button>)}
            </div>
          </> : <RecordsModule module={{
            "Nyomozati ügyek":"cases",
            "Személyi adatbázis":"subjects",
            "Járműnyilvántartás":"vehicles",
            "Bizonyítéktár":"evidence",
            "Jelentések":"reports",
            "Műveletek":"operations",
            "Fedőazonosságok":"aliases",
            "Megfigyelés / CCTV":"cameras",
            "Ügynökök":"agents",
            "Osztályok és rangok":"divisions"
          }[active] || "unsupported"} />}
        </div>
      </main>
    </div>
    {modal && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101a28] p-5 shadow-2xl sm:p-6"><div className="mb-5 flex items-start justify-between"><div><div className="text-[10px] tracking-[.18em] text-blue-300">CASE MANAGEMENT</div><h2 className="mt-2 text-lg font-semibold">Új nyomozati ügy</h2><p className="mt-1 text-xs text-slate-500">Rögzítsd az új ügy alapadatait.</p></div><button onClick={() => setModal(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><X size={17}/></button></div><label className="mb-2 block text-[11px] font-medium text-slate-400">Ügy megnevezése</label><input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Pl. Operation Silent Echo" className="mb-4 w-full rounded-lg border border-white/10 bg-[#080d15] px-3 py-3 text-sm outline-none focus:border-blue-400/50"/><label className="mb-2 block text-[11px] font-medium text-slate-400">Prioritás</label><select value={priority} onChange={e => setPriority(e.target.value)} className="mb-5 w-full rounded-lg border border-white/10 bg-[#080d15] px-3 py-3 text-sm outline-none"><option value="LOW">Alacsony</option><option value="NORMAL">Normál</option><option value="HIGH">Magas</option><option value="CRITICAL">Kritikus</option></select><div className="flex justify-end gap-2"><button onClick={() => setModal(false)} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-slate-300">Mégse</button><button onClick={createCase} className="rounded-lg bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-400">Ügy létrehozása</button></div></div></div>}
  </div>;
}
