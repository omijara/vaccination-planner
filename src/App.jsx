import { useState, useMemo } from "react";

const VACCINES = [
  { id:"bcg",       vaccine_name:"BCG",                  category:"EPI",     recommended_age_days:0,   disease_protection:["Tuberculosis (TB)"],                                    price_estimate:"Free",        notes:"Given at birth or as soon as possible" },
  { id:"opv0",      vaccine_name:"OPV 0",                category:"EPI",     recommended_age_days:0,   disease_protection:["Poliomyelitis"],                                        price_estimate:"Free",        notes:"Birth dose — oral drops" },
  { id:"hepb",      vaccine_name:"Hepatitis B",          category:"EPI",     recommended_age_days:0,   disease_protection:["Hepatitis B"],                                          price_estimate:"Free",        notes:"Within 24 hours of birth" },
  { id:"penta1",    vaccine_name:"Pentavalent 1",        category:"EPI",     recommended_age_weeks:6,  disease_protection:["Diphtheria","Tetanus","Pertussis","Hepatitis B","Hib"], price_estimate:"Free",        notes:"DTP + HepB + Hib combined" },
  { id:"opv1",      vaccine_name:"OPV 1",                category:"EPI",     recommended_age_weeks:6,  disease_protection:["Poliomyelitis"],                                        price_estimate:"Free" },
  { id:"pcv1",      vaccine_name:"PCV 1",                category:"EPI",     recommended_age_weeks:6,  disease_protection:["Pneumonia","Meningitis"],                               price_estimate:"Free",        notes:"Pneumococcal Conjugate Vaccine" },
  { id:"ipv1",      vaccine_name:"IPV 1",                category:"EPI",     recommended_age_weeks:6,  disease_protection:["Poliomyelitis"],                                        price_estimate:"Free",        notes:"Inactivated Polio Vaccine" },
  { id:"penta2",    vaccine_name:"Pentavalent 2",        category:"EPI",     recommended_age_weeks:10, disease_protection:["Diphtheria","Tetanus","Pertussis","Hepatitis B","Hib"], price_estimate:"Free" },
  { id:"opv2",      vaccine_name:"OPV 2",                category:"EPI",     recommended_age_weeks:10, disease_protection:["Poliomyelitis"],                                        price_estimate:"Free" },
  { id:"pcv2",      vaccine_name:"PCV 2",                category:"EPI",     recommended_age_weeks:10, disease_protection:["Pneumonia","Meningitis"],                               price_estimate:"Free" },
  { id:"penta3",    vaccine_name:"Pentavalent 3",        category:"EPI",     recommended_age_weeks:14, disease_protection:["Diphtheria","Tetanus","Pertussis","Hepatitis B","Hib"], price_estimate:"Free" },
  { id:"opv3",      vaccine_name:"OPV 3",                category:"EPI",     recommended_age_weeks:14, disease_protection:["Poliomyelitis"],                                        price_estimate:"Free" },
  { id:"pcv3",      vaccine_name:"PCV 3",                category:"EPI",     recommended_age_weeks:14, disease_protection:["Pneumonia","Meningitis"],                               price_estimate:"Free" },
  { id:"ipv2",      vaccine_name:"IPV 2",                category:"EPI",     recommended_age_weeks:14, disease_protection:["Poliomyelitis"],                                        price_estimate:"Free" },
  { id:"mr1",       vaccine_name:"MR Vaccine (1st)",     category:"EPI",     recommended_age_months:9, disease_protection:["Measles","Rubella"],                                    price_estimate:"Free" },
  { id:"mr2",       vaccine_name:"MR Vaccine (2nd)",     category:"EPI",     recommended_age_months:15,disease_protection:["Measles","Rubella"],                                    price_estimate:"Free",        notes:"Booster dose" },
  { id:"rota1",     vaccine_name:"Rotavirus 1",          category:"Private", recommended_age_weeks:6,  disease_protection:["Rotavirus Diarrhea"],                                   price_estimate:"৳1,500–2,500",notes:"3-dose oral series" },
  { id:"rota2",     vaccine_name:"Rotavirus 2",          category:"Private", recommended_age_weeks:10, disease_protection:["Rotavirus Diarrhea"],                                   price_estimate:"৳1,500–2,500" },
  { id:"rota3",     vaccine_name:"Rotavirus 3",          category:"Private", recommended_age_weeks:14, disease_protection:["Rotavirus Diarrhea"],                                   price_estimate:"৳1,500–2,500" },
  { id:"varicella", vaccine_name:"Varicella",            category:"Private", recommended_age_months:12,disease_protection:["Chickenpox"],                                           price_estimate:"৳2,500–3,500",notes:"2-dose series recommended" },
  { id:"hepA1",     vaccine_name:"Hepatitis A (Dose 1)", category:"Private", recommended_age_months:12,disease_protection:["Hepatitis A"],                                          price_estimate:"৳2,000–3,000" },
  { id:"hepA2",     vaccine_name:"Hepatitis A (Dose 2)", category:"Private", recommended_age_months:18,disease_protection:["Hepatitis A"],                                          price_estimate:"৳2,000–3,000",notes:"6 months after first dose" },
  { id:"mmr",       vaccine_name:"MMR",                  category:"Private", recommended_age_months:12,disease_protection:["Measles","Mumps","Rubella"],                            price_estimate:"৳1,200–2,000" },
  { id:"typhoid",   vaccine_name:"Typhoid Conjugate",    category:"Private", recommended_age_months:9, disease_protection:["Typhoid Fever"],                                        price_estimate:"৳1,500–2,500",notes:"Highly recommended in Bangladesh" },
  { id:"influenza", vaccine_name:"Influenza",            category:"Private", recommended_age_months:6, disease_protection:["Seasonal Flu"],                                         price_estimate:"৳800–1,500",  notes:"Annual vaccination" },
  { id:"meningo",   vaccine_name:"Meningococcal",        category:"Private", recommended_age_months:9, disease_protection:["Bacterial Meningitis"],                                 price_estimate:"৳3,000–5,000" },
];

function calcVaccineDate(dob, v) {
  const d = new Date(dob);
  if (v.recommended_age_days  !== undefined) d.setDate(d.getDate() + v.recommended_age_days);
  else if (v.recommended_age_weeks  !== undefined) d.setDate(d.getDate() + v.recommended_age_weeks * 7);
  else if (v.recommended_age_months !== undefined) d.setMonth(d.getMonth() + v.recommended_age_months);
  return d;
}
function fmtDate(d) { return d.toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"numeric" }); }
function ageLabel(v) {
  if (v.recommended_age_days  !== undefined) return v.recommended_age_days === 0 ? "At birth" : `Day ${v.recommended_age_days}`;
  if (v.recommended_age_weeks  !== undefined) return `Week ${v.recommended_age_weeks}`;
  if (v.recommended_age_months !== undefined) return `Month ${v.recommended_age_months}`;
  return "";
}
function getStatus(dt) {
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(dt); d.setHours(0,0,0,0);
  const diff = (d - now) / 86400000;
  if (diff < 0)  return "overdue";
  if (diff === 0) return "today";
  if (diff <= 14) return "soon";
  return "upcoming";
}
function gcalUrl(v, dt) {
  const ds = dt.toISOString().replace(/-|:|\.\d{3}/g,"").slice(0,8);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Vaccination: "+v.vaccine_name)}&dates=${ds}/${ds}&details=${encodeURIComponent(`${v.vaccine_name}\nProtects: ${v.disease_protection.join(", ")}\nCost: ${v.price_estimate}${v.notes?"\nNote: "+v.notes:""}`)}`;
}

// ── SVG icon helpers ──────────────────────────────────────────────────────────
const IconShield = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCalendar = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconSyringe = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2l4 4-4 4"/><path d="M14.5 7.5L18 4"/><path d="M2 22l4-4"/><path d="M6 20l-4 4"/><line x1="6" y1="18" x2="18" y2="6"/><line x1="10" y1="14" x2="12" y2="16"/>
  </svg>
);
const IconBell = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconClock = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCheck = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlertCircle = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconHeart = ({ size=28, color="#ef4444", fill="#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconMail = ({ size=14, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconUser = ({ size=14, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const STATUS = {
  overdue:  { label:"Overdue",  color:"#dc2626", bg:"#fef2f2", border:"#fecaca", Icon: IconAlertCircle },
  today:    { label:"Today",    color:"#d97706", bg:"#fffbeb", border:"#fde68a", Icon: IconClock },
  soon:     { label:"Soon",     color:"#0369a1", bg:"#bae6fd", border:"#38bdf8", Icon: IconBell },
  upcoming: { label:"Upcoming", color:"#15803d", bg:"#f0fdf4", border:"#86efac", Icon: IconCheck },
};

function Chip({ children, color, bg, border }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:11, fontWeight:600, color, background:bg, border:`1px solid ${border}`, padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap", lineHeight:"18px" }}>
      {children}
    </span>
  );
}

function VaccineRow({ v, i }) {
  const s  = getStatus(v.vaccineDate);
  const sc = STATUS[s];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"4px 1fr", borderRadius:12, overflow:"hidden", background:"#fff", border:"1px solid #bae6fd", boxShadow:"0 1px 4px rgba(14,165,233,0.07)", marginBottom:8, animation:`slideIn 0.3s ease ${i*0.03}s both` }}>
      <div style={{ background:sc.color }} />
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:8 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:5 }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                <IconSyringe size={13} color="#0369a1" />
                <span style={{ fontSize:14, fontWeight:700, color:"#0c4a6e", letterSpacing:"-0.01em" }}>{v.vaccine_name}</span>
              </span>
              <Chip color={v.category==="EPI"?"#14532d":"#4a1d96"} bg={v.category==="EPI"?"#dcfce7":"#ede9fe"} border={v.category==="EPI"?"#86efac":"#c4b5fd"}>
                {v.category==="EPI" ? <IconShield size={10} color="#14532d" /> : <IconSyringe size={10} color="#4a1d96" />}
                {" "}{v.category}
              </Chip>
              <Chip color={sc.color} bg={sc.bg} border={sc.border}>
                <sc.Icon size={10} color={sc.color} />
                {" "}{sc.label}
              </Chip>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#374151" }}>
              <IconCalendar size={12} color="#0369a1" />
              <span style={{ fontWeight:600, color:"#0c4a6e" }}>{fmtDate(v.vaccineDate)}</span>
              <span style={{ color:"#94a3b8" }}>·</span>
              <span style={{ color:"#64748b" }}>{ageLabel(v)}</span>
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0, fontSize:12, fontWeight:700, color: v.category==="EPI" ? "#15803d" : "#6d28d9" }}>
            {v.price_estimate}
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom: v.notes ? 8 : 6 }}>
          {v.disease_protection.map(d => (
            <Chip key={d} color="#1e40af" bg="#eff6ff" border="#bfdbfe">
              <IconShield size={9} color="#1e40af" /> {d}
            </Chip>
          ))}
        </div>
        {v.notes && (
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#64748b", marginBottom:8 }}>
            <IconAlertCircle size={11} color="#94a3b8" />
            {v.notes}
          </div>
        )}
        <a
          href={gcalUrl(v, v.vaccineDate)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:800, color:"#075985", textDecoration:"none", padding:"6px 12px", borderRadius:7, background:"#bae6fd", border:"1px solid #38bdf8", transition:"all 0.15s" }}
          onMouseOver={e => { e.currentTarget.style.background="#7dd3fc"; e.currentTarget.style.color="#0c4a6e"; }}
          onMouseOut={e  => { e.currentTarget.style.background="#bae6fd"; e.currentTarget.style.color="#075985"; }}
        >
          <IconCalendar size={12} color="currentColor" />
          Add to Google Calendar
        </a>
      </div>
    </div>
  );
}

function StatCard({ n, label, color, bg, border, Icon }) {
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"12px 14px", textAlign:"center", flex:1, minWidth:64 }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}><Icon size={14} color={color} /></div>
      <div style={{ fontSize:22, fontWeight:800, color, lineHeight:1 }}>{n}</div>
      <div style={{ fontSize:10, color, marginTop:4, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", opacity:0.75 }}>{label}</div>
    </div>
  );
}

export default function App() {
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [showEPI, setShowEPI] = useState(true);
  const [showPrivate, setShowPrivate] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const today = new Date().toISOString().split("T")[0];

  const schedule = useMemo(() => {
    if (!dob) return [];
    return VACCINES.map(v => ({ ...v, vaccineDate: calcVaccineDate(dob, v) })).sort((a,b) => a.vaccineDate - b.vaccineDate);
  }, [dob]);

  const counts = useMemo(() => {
    const c = { overdue:0, today:0, soon:0, upcoming:0 };
    schedule.forEach(v => c[getStatus(v.vaccineDate)]++);
    return c;
  }, [schedule]);

  const filtered = useMemo(() => schedule.filter(v => {
    if (v.category==="EPI"     && !showEPI)     return false;
    if (v.category==="Private" && !showPrivate) return false;
    if (statusFilter !== "all" && getStatus(v.vaccineDate) !== statusFilter) return false;
    return true;
  }), [schedule, showEPI, showPrivate, statusFilter]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',-apple-system,sans-serif; background:#e0f2fe; color:#0c4a6e; -webkit-font-smoothing:antialiased; }
        @keyframes fadeIn  { from{opacity:0}              to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        input,select,button { font-family:inherit; }
        input:focus,select:focus { outline:none; }
        a { color:inherit; }
        ::selection { background:#0369a1; color:#fff; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background:"#fff", borderBottom:"1px solid #7dd3fc", position:"sticky", top:0, zIndex:50, animation:"fadeIn 0.4s ease" }}>
        <div style={{ maxWidth:720, margin:"0 auto", padding:"0 20px", height:56, display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, background:"linear-gradient(135deg,#0369a1,#0369a1)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <IconSyringe size={15} color="#fff" />
            </div>
            <span style={{ fontSize:15, fontWeight:700, color:"#0c4a6e", letterSpacing:"-0.02em" }}>VacciTrack BD</span>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(150deg,#0369a1 0%,#0369a1 50%,#0369a1 100%)", padding:"72px 20px 64px", textAlign:"center", animation:"slideDown 0.5s ease" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <h1 style={{ fontSize:"clamp(34px,7vw,54px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.07, marginBottom:18, color:"#fff" }}>
            Your child's<br />
            <span style={{ color:"#fde68a" }}>vaccination schedule,</span><br />
            always on time.
          </h1>
          <p style={{ fontSize:"clamp(14px,2vw,16px)", color:"rgba(255,255,255,0.85)", lineHeight:1.75, maxWidth:420, margin:"0 auto", fontWeight:400 }}>
            Parents in Bangladesh miss vaccines because tracking is hard. Enter your child's date of birth — we handle the rest, with one-click Google Calendar reminders.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background:"#fff", padding:"60px 20px", borderBottom:"1px solid #7dd3fc" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:"#0369a1", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
              <IconShield size={12} color="#0369a1" /> How it works
            </div>
            <div style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:800, color:"#0c4a6e", letterSpacing:"-0.03em" }}>Three steps. That's all.</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
            {[
              {
                step:"01", Icon: IconCalendar, iconBg:"#bae6fd", iconBorder:"#38bdf8", iconColor:"#0369a1",
                title:"Enter your child's date of birth",
                body:"Simply type in when your child was born. That's the only input we need to get started.",
              },
              {
                step:"02", Icon: IconShield, iconBg:"#dcfce7", iconBorder:"#86efac", iconColor:"#15803d",
                title:"Get vaccination schedule based on date of birth",
                body:"Instantly see every EPI and private vaccine with exact dates — auto-calculated from your child's birthday.",
              },
              {
                step:"03", Icon: IconBell, iconBg:"#fef3c7", iconBorder:"#fde68a", iconColor:"#b45309",
                title:"Add reminder to your Google Calendar",
                body:"One click sends the vaccine appointment to Google Calendar with an alert — so you never miss a dose.",
              },
            ].map(({ step, Icon, iconBg, iconBorder, iconColor, title, body }) => (
              <div key={step} style={{ background:"#e0f2fe", border:"1px solid #7dd3fc", borderRadius:16, padding:"26px 22px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:16, right:18, fontSize:32, fontWeight:800, color:"rgba(14,165,233,0.07)", lineHeight:1 }}>{step}</div>
                <div style={{ marginBottom:18, width:50, height:50, background:iconBg, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${iconBorder}` }}>
                  <Icon size={24} color={iconColor} />
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"#0c4a6e", marginBottom:8, lineHeight:1.4, paddingRight:20 }}>{title}</div>
                <div style={{ fontSize:13, color:"#374151", lineHeight:1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANNER ── */}
      <section style={{ maxWidth:720, margin:"0 auto", padding:"44px 20px 80px" }}>

        {/* Input card */}
        <div style={{ background:"linear-gradient(135deg,#0369a1,#0369a1)", borderRadius:16, padding:"26px", marginBottom:24, animation:"slideDown 0.4s ease 0.1s both" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:16, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:4 }}>
              Enter your child's details
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>
              Fill in the details below to generate a personalised vaccination schedule
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:7, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                <IconUser size={11} color="rgba(255,255,255,0.85)" /> Child's name <span style={{ fontWeight:400, opacity:0.65 }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ayaan"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width:"100%", padding:"10px 13px", border:"1.5px solid rgba(255,255,255,0.4)", borderRadius:9, fontSize:14, color:"#0c4a6e", background:"#fff", transition:"border-color 0.15s" }}
                onFocus={e => { e.target.style.borderColor="#fff"; e.target.style.boxShadow="0 0 0 3px rgba(255,255,255,0.3)"; }}
                onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.4)"; e.target.style.boxShadow="none"; }}
              />
            </div>
            <div>
              <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:7, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                <IconCalendar size={11} color="rgba(255,255,255,0.85)" /> Date of birth <span style={{ color:"#fde68a" }}>*</span>
              </label>
              <input
                type="date"
                value={dob}
                max={today}
                onChange={e => setDob(e.target.value)}
                style={{ width:"100%", padding:"10px 13px", border:"1.5px solid rgba(255,255,255,0.4)", borderRadius:9, fontSize:14, color: dob?"#0c4a6e":"#94a3b8", background:"#fff", transition:"border-color 0.15s" }}
                onFocus={e => { e.target.style.borderColor="#fff"; e.target.style.boxShadow="0 0 0 3px rgba(255,255,255,0.3)"; }}
                onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.4)"; e.target.style.boxShadow="none"; }}
              />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!dob && (
          <div style={{ textAlign:"center", padding:"60px 20px", animation:"fadeIn 0.5s ease" }}>
            <div style={{ width:64, height:64, background:"#bae6fd", border:"1px solid #7dd3fc", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3l3 3m0 0l3 3m-3-3l3-3m-3 3l-3 3"/>
                <path d="M12.5 8.5l-1.5 1.5 5 5 1.5-1.5"/>
                <path d="M14 7l3 3"/>
                <path d="M9 12l-4 4a1.414 1.414 0 0 0 2 2l4-4"/>
                <circle cx="18" cy="6" r="2" fill="#7dd3fc" stroke="#0369a1"/>
              </svg>
            </div>
            <p style={{ fontSize:15, fontWeight:600, color:"#0c4a6e", marginBottom:6 }}>Enter a date of birth to begin</p>
            <p style={{ fontSize:13, color:"#374151" }}>Your child's full vaccination timeline will appear here.</p>
          </div>
        )}

        {/* Results */}
        {schedule.length > 0 && (
          <div style={{ animation:"slideIn 0.4s ease both" }}>

            {/* Summary */}
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              <StatCard n={counts.overdue}  label="Overdue"  color="#dc2626" bg="#fef2f2" border="#fecaca" Icon={IconAlertCircle} />
              <StatCard n={counts.today}    label="Today"    color="#b45309" bg="#fffbeb" border="#fde68a" Icon={IconClock} />
              <StatCard n={counts.soon}     label="Soon"     color="#0369a1" bg="#bae6fd" border="#38bdf8" Icon={IconBell} />
              <StatCard n={counts.upcoming} label="Upcoming" color="#15803d" bg="#f0fdf4" border="#86efac" Icon={IconCheck} />
            </div>

            {/* Filters */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#0c4a6e", letterSpacing:"-0.02em", display:"flex", alignItems:"center", gap:7 }}>
                <IconSyringe size={15} color="#0369a1" />
                {name ? `${name}'s schedule` : "Vaccination schedule"}
                <span style={{ fontSize:12, fontWeight:500, color:"#64748b" }}>{filtered.length} vaccines</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["EPI","Private"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => cat==="EPI" ? setShowEPI(p=>!p) : setShowPrivate(p=>!p)}
                    style={{
                      display:"inline-flex", alignItems:"center", gap:5,
                      padding:"5px 12px", borderRadius:7, border:"1.5px solid", cursor:"pointer", transition:"all 0.15s", fontSize:12, fontWeight:600,
                      borderColor: (cat==="EPI"?showEPI:showPrivate) ? "#0369a1"  : "#7dd3fc",
                      background:  (cat==="EPI"?showEPI:showPrivate) ? "#0369a1"  : "#fff",
                      color:       (cat==="EPI"?showEPI:showPrivate) ? "#fff"     : "#0369a1",
                    }}
                  >
                    {cat==="EPI" ? <IconShield size={11} color={(cat==="EPI"?showEPI:showPrivate)?"#fff":"#0369a1"} /> : <IconSyringe size={11} color={(cat==="EPI"?showEPI:showPrivate)?"#fff":"#0369a1"} />}
                    {cat}
                  </button>
                ))}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding:"5px 10px", borderRadius:7, border:"1.5px solid #7dd3fc", fontSize:12, fontWeight:600, color:"#0369a1", background:"#fff", cursor:"pointer" }}
                >
                  <option value="all">All statuses</option>
                  <option value="overdue">Overdue</option>
                  <option value="today">Today</option>
                  <option value="soon">Soon (≤14 days)</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px", background:"#fff", borderRadius:12, border:"1px solid #7dd3fc", fontSize:13, color:"#374151" }}>
                No vaccines match your current filters.
              </div>
            ) : (
              filtered.map((v,i) => <VaccineRow key={v.id} v={v} i={i} />)
            )}

            {/* Disclaimer */}
            <div style={{ marginTop:24, padding:"13px 16px", background:"#fefce8", border:"1px solid #fde68a", borderRadius:10, fontSize:12, color:"#713f12", lineHeight:1.65, display:"flex", gap:8, alignItems:"flex-start" }}>
              <div style={{ flexShrink:0, marginTop:1 }}><IconAlertCircle size={14} color="#b45309" /></div>
              <div><strong>Disclaimer:</strong> Based on the Bangladesh EPI programme and WHO guidelines. Always consult your paediatrician before vaccination. Prices are estimates and may vary by provider.</div>
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"linear-gradient(150deg,#0c4a6e,#0369a1)", padding:"48px 20px 36px", textAlign:"center" }}>
        <div style={{ maxWidth:460, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <IconHeart size={36} color="#ef4444" fill="#ef4444" />
          </div>
          <p style={{ fontSize:16, fontWeight:500, color:"rgba(255,255,255,0.85)", marginBottom:5, lineHeight:1.5 }}>
            Made with love for your child
          </p>
          <p style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginBottom:18 }}>
            by Omi and Mostafez
          </p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.75, marginBottom:28, maxWidth:300, margin:"0 auto 28px" }}>
            Because every child deserves a healthy start, and every parent deserves peace of mind.
          </p>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.22)", paddingTop:22, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, color:"rgba(255,255,255,0.8)" }}>
            <IconMail size={14} color="rgba(255,255,255,0.8)" />
            For any queries, contact{" "}
            <a
              href="mailto:mostafez.dhk@gmail.com"
              style={{ color:"#fff", textDecoration:"none", fontWeight:700 }}
              onMouseOver={e => e.currentTarget.style.textDecoration="underline"}
              onMouseOut={e  => e.currentTarget.style.textDecoration="none"}
            >mostafez.dhk@gmail.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}

