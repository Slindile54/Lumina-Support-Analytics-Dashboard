import { useEffect, useMemo, useState } from "react";
import luminaLogo from "./lumina_systems_logo_50x50.png";
import bgImage from "./Gemini_Generated_Image_el0amkel0amkel0a.jpg";

type Status = "New" | "Open" | "Pending" | "Solved";
type Priority = "Urgent" | "High" | "Normal" | "Low";
type Page = "dashboard" | "tickets" | "my" | "unassigned" | "analytics" | "customers" | "knowledge" | "settings";
type Ticket = {
  id: string; subject: string; customer: string; email: string; area: string; priority: Priority; status: Status;
  group: string; agent: string; created: string; updated: string; description: string; response: number;
  messages: { from: string; body: string; time: string; internal?: boolean }[];
};

const today = new Date();
const dateAgo = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n).toISOString();
const seed: Ticket[] = [
  ["#LS-1048","Suspicious sign-in alerts","Maya Chen","maya@northstar.io","Security","Urgent","Open","Security","Jordan Ellis",1,35],
  ["#LS-1047","Outlook calendar won't sync","Theo Martin","theo@aperture.co","Microsoft 365","High","Pending","Cloud Services","Avery Brooks",2,52],
  ["#LS-1046","Unable to reset team password","Amara Okafor","amara@verdanthq.com","Account Management","Normal","Solved","Accounts","Jordan Ellis",3,18],
  ["#LS-1045","VPN disconnects every hour","Noah Williams","noah@fieldwork.org","Technical Support","High","Open","Technical Support","Jordan Ellis",5,42],
  ["#LS-1044","Add a new billing administrator","Lina Patel","lina@brightlabs.ai","Account Management","Low","Solved","Accounts","Riley Morgan",7,24],
  ["#LS-1043","SharePoint file permissions","Elliot Reed","elliot@commonroom.com","Microsoft 365","Normal","New","Cloud Services","",9,68],
  ["#LS-1042","Endpoint protection not updating","Sofia Costa","sofia@arcadia.design","Security","Urgent","Pending","Security","Avery Brooks",12,29],
  ["#LS-1041","Desktop app installation error","Owen Park","owen@kindred.studio","Technical Support","Normal","Solved","Technical Support","Jordan Ellis",16,31],
  ["#LS-1040","MFA setup for new device","Priya Shah","priya@atlasworks.co","Security","High","Solved","Security","Riley Morgan",22,22],
  ["#LS-1039","Teams meeting recording missing","Marcus Lee","marcus@nomadline.com","Microsoft 365","Normal","Open","Cloud Services","Avery Brooks",27,47],
  ["#LS-1038","Change subscription plan","Sara Ibrahim","sara@hearthside.io","Account Management","Low","Solved","Accounts","Jordan Ellis",36,15],
  ["#LS-1037","API timeout from dashboard","Leo Grant","leo@signalpath.dev","Technical Support","High","New","","",61,73],
].map(([id,subject,customer,email,area,priority,status,group,agent,days,response]) => ({
  id: id as string, subject: subject as string, customer: customer as string, email: email as string, area: area as string,
  priority: priority as Priority, status: status as Status, group: group as string, agent: agent as string,
  created: dateAgo(days as number), updated: dateAgo(Math.max(0,(days as number)-1)), response: response as number,
  description: `The customer needs help with ${String(subject).toLowerCase()}. They have already tried the standard troubleshooting steps and need guidance from the support team.`,
  messages: [
    { from: customer as string, body: `Hi, I need some help with ${String(subject).toLowerCase()}. Could your team take a look?`, time: dateAgo(days as number) },
    { from: "Lumina Support", body: "Thanks for reaching out. We’re reviewing this now and will guide you through the next steps.", time: dateAgo(Math.max(0,(days as number)-1)) },
  ],
}));

const nav: { id: Page; label: string; icon: string }[] = [
  {id:"dashboard",label:"Dashboard",icon:"grid"},{id:"tickets",label:"All Tickets",icon:"ticket"},
  {id:"my",label:"My Tickets",icon:"user"},{id:"unassigned",label:"Unassigned Tickets",icon:"inbox"},
  {id:"analytics",label:"Analytics",icon:"chart"},{id:"customers",label:"Customers",icon:"users"},
  {id:"knowledge",label:"Knowledge Base",icon:"book"},{id:"settings",label:"Settings",icon:"settings"},
];

function Icon({name,size=18}:{name:string;size?:number}) {
  const paths: Record<string, React.ReactNode> = {
    grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    ticket:<><path d="M4 5h16v4a2 2 0 0 0 0 4v6H4v-6a2 2 0 0 0 0-4V5Z"/><path d="M12 7v10"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    inbox:<><path d="M4 4h16l2 10v6H2v-6L4 4Z"/><path d="M2 14h6l2 3h4l2-3h6"/></>,
    chart:<><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>, book:<><path d="M4 4h6a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H4V4Z"/><path d="M20 4h-2a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h2V4Z"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A8 8 0 0 0 15 6l-.3-2.6h-4L10.4 6A8 8 0 0 0 9 7L6.5 6.1l-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A8 8 0 0 0 10.4 18l.3 2.6h4L15 18a8 8 0 0 0 1.5-1l2.4.9 2-3.4-2-1.5a7 7 0 0 0 .1-1Z"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>, bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    plus:<path d="M12 5v14M5 12h14"/>, clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check:<path d="m5 12 4 4L19 6"/>, alert:<><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 18h.01"/></>,
    menu:<path d="M4 7h16M4 12h16M4 17h16"/>, close:<path d="m5 5 14 14M19 5 5 19"/>, arrow:<path d="m9 18 6-6-6-6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]||paths.grid}</svg>;
}

function Button({children,onClick,kind="primary",type="button",disabled=false}:{children:React.ReactNode;onClick?:()=>void;kind?:string;type?:"button"|"submit";disabled?:boolean}) {
  return <button className={`btn ${kind}`} onClick={onClick} type={type} disabled={disabled}>{children}</button>;
}
function Badge({children,type}:{children:React.ReactNode;type:string}) { return <span className={`badge ${type.toLowerCase().replace(" ","-")}`}>{children}</span>; }
function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="field"><span>{label}</span>{children}</label>; }

function Logo() {
  return <div className="brand">
    <div className="logo-mark"><img src={luminaLogo} alt="Lumina Systems support logo"/></div>
    <div className="brand-copy"><strong>Lumina Systems</strong><small style={{ fontSize: "11px", fontStyle: "italic", lineHeight: "1.2", display: "inline-block", color: "#e8e0ff" }}>BRINGING CLARITY TO<br/>COMPLEX TECH</small></div>
  </div>;
}

function Sidebar({page,setPage,open,setOpen}:{page:Page;setPage:(p:Page)=>void;open:boolean;setOpen:(v:boolean)=>void}) {
  const [profile,setProfile]=useState(false);
  return <><div className={`scrim ${open?"show":""}`} onClick={()=>setOpen(false)}/><aside className={`sidebar ${open?"open":""}`}>
    <div className="side-head">
      <Logo/>
      <button className="icon-btn mobile-only" onClick={()=>setOpen(false)} aria-label="Close menu"><Icon name="close"/></button>
    </div>
    <nav>{nav.map(n=><button key={n.id} className={page===n.id?"active":""} onClick={()=>{setPage(n.id);setOpen(false)}}><Icon name={n.icon}/><span>{n.label}</span>{page===n.id&&<i/>}</button>)}</nav>
    <div className="profile-wrap">
      <button className="profile" onClick={()=>setProfile(!profile)}><span className="avatar">JE</span><span><strong>Jordan Ellis</strong><small>Senior Support Agent</small></span><Icon name="arrow" size={15}/></button>
      {profile&&<div className="profile-menu"><button onClick={()=>setPage("settings")}>Profile</button><button onClick={()=>setPage("settings")}>Preferences</button><button onClick={()=>alert("Demo sign out complete.")}>Sign out</button></div>}
    </div>
  </aside></>;
}

function Header({page,onCreate,query,setQuery,onMenu}:{page:Page;onCreate:()=>void;query:string;setQuery:(s:string)=>void;onMenu:()=>void}) {
  const [notifs,setNotifs]=useState(false);
  const titles:Record<Page,string>={dashboard:"Support Overview",tickets:"All Tickets",my:"My Tickets",unassigned:"Unassigned Tickets",analytics:"Analytics",customers:"Customers",knowledge:"Knowledge Base",settings:"Settings"};
  return <header><div className="header-title"><button className="icon-btn mobile-only" onClick={onMenu} aria-label="Open menu"><Icon name="menu"/></button><div><h1>{titles[page]}</h1><p>{page==="dashboard"?"Here's what's happening with your support team today.":"Manage support operations with clarity and confidence."}</p></div></div>
    <div className="header-actions"><div className="search"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tickets..." aria-label="Search tickets"/></div>
    <div className="relative"><button className="icon-btn bell" onClick={()=>setNotifs(!notifs)} aria-label="Notifications"><Icon name="bell"/><b/></button>{notifs&&<div className="dropdown notifications"><strong>Notifications</strong><p><b>Urgent ticket assigned</b><br/>#LS-1048 needs attention</p><p><b>New customer reply</b><br/>Theo replied 12 min ago</p><button onClick={()=>setNotifs(false)}>Mark all as read</button></div>}</div>
    <Button onClick={onCreate}><Icon name="plus"/>Create Ticket</Button></div>
  </header>;
}

const withinDays=(t:Ticket,days:number)=>new Date(t.created)>=new Date(Date.now()-days*86400000);
function Filters({draft,setDraft,apply,reset}:{draft:any;setDraft:(x:any)=>void;apply:()=>void;reset:()=>void}) {
  return <div className="filters">
    <Field label="Date range"><select value={draft.days} onChange={e=>setDraft({...draft,days:e.target.value})}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="custom">Custom range</option></select></Field>
    {draft.days==="custom"&&<><Field label="Start date"><input type="date" value={draft.start} onChange={e=>setDraft({...draft,start:e.target.value})}/></Field><Field label="End date"><input type="date" value={draft.end} onChange={e=>setDraft({...draft,end:e.target.value})}/></Field></>}
    <Field label="Status"><select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}><option value="">All statuses</option>{["New","Open","Pending","Solved"].map(x=><option key={x}>{x}</option>)}</select></Field>
    <Field label="Priority"><select value={draft.priority} onChange={e=>setDraft({...draft,priority:e.target.value})}><option value="">All priorities</option>{["Urgent","High","Normal","Low"].map(x=><option key={x}>{x}</option>)}</select></Field>
    <Field label="Support group"><select value={draft.group} onChange={e=>setDraft({...draft,group:e.target.value})}><option value="">All groups</option>{["Technical Support","Cloud Services","Security","Accounts"].map(x=><option key={x}>{x}</option>)}</select></Field>
    <Field label="Product area"><select value={draft.area} onChange={e=>setDraft({...draft,area:e.target.value})}><option value="">All areas</option>{["Technical Support","Microsoft 365","Security","Account Management"].map(x=><option key={x}>{x}</option>)}</select></Field>
    <div className="filter-buttons"><Button onClick={apply}>Apply Filters</Button><Button kind="ghost" onClick={reset}>Reset</Button></div>
  </div>;
}

function Kpis({tickets,openList}:{tickets:Ticket[];openList:(key:string,value:string)=>void}) {
  const solved=tickets.filter(t=>t.status==="Solved").length, open=tickets.filter(t=>t.status==="Open"||t.status==="New").length;
  const avg=tickets.length?Math.round(tickets.reduce((a,t)=>a+t.response,0)/tickets.length):0;
  const data=[["Total Tickets",tickets.length,"ticket","All tickets in period","total",""],["Open Tickets",open,"inbox","Need team attention","status","Open"],["Resolved Tickets",solved,"check","Successfully solved","status","Solved"],["Avg. First Response",`${avg}m`,"clock","Target: under 60 min","analytics",""]];
  return <div className="kpis">{data.map((k,i)=><button className="kpi" key={k[0]} onClick={()=>openList(k[4] as string,k[5] as string)}><div className={`kpi-icon c${i}`}><Icon name={k[2] as string}/></div><span>{k[0]}</span><strong>{k[1]}</strong><p>{k[3]}</p><small className={i===1?"down":""}>{i===1?"↓ 8%":"↑ "+(6+i*3)+"%"} <em>vs previous period</em></small><div className="spark">{[10,18,13,24,20,30,34].map((v,j)=><i key={j} style={{height:`${v}px`}}/>)}</div></button>)}</div>;
}

function LineChart({tickets,onDrill}:{tickets:Ticket[];onDrill:(s:string)=>void}) {
  const [period,setPeriod]=useState(30);
  const step=period===30?4:12;
  const buckets=Array.from({length:8},(_,i)=>(7-i)*step).map((d,i)=>({label:new Date(Date.now()-d*86400000).toLocaleDateString("en",{month:"short",day:"numeric"}), created:tickets.filter(t=>withinDays(t,d+step)&&!withinDays(t,d)).length, solved:tickets.filter(t=>t.status==="Solved"&&withinDays(t,d+step)&&!withinDays(t,d)).length,i}));
  const max=Math.max(1,...buckets.flatMap(x=>[x.created,x.solved])); const points=(key:"created"|"solved")=>buckets.map((b,i)=>`${30+i*70},${150-(b[key]/max)*110}`).join(" ");
  const [created,setCreated]=useState(true),[solved,setSolved]=useState(true);
  return <div className="card chart-card"><div className="card-head"><div><h2>Ticket Activity</h2><p>Created and resolved ticket trends</p></div><div className="chart-controls"><select value={period} onChange={e=>setPeriod(Number(e.target.value))} aria-label="Chart period"><option value="30">30 days</option><option value="90">90 days</option></select><div className="legend"><button className={!created?"off":""} onClick={()=>setCreated(!created)}><i className="purple"/>Created</button><button className={!solved?"off":""} onClick={()=>setSolved(!solved)}><i className="green"/>Resolved</button></div></div></div>
    <svg className="line-chart" viewBox="0 0 540 190" role="img" aria-label="Ticket activity line chart"><g className="gridlines">{[40,75,110,145].map(y=><line key={y} x1="28" y1={y} x2="525" y2={y}/>)}</g>
    {created&&<polyline points={points("created")} className="created-line"/>}{solved&&<polyline points={points("solved")} className="solved-line"/>}
    {buckets.map((b,i)=><g key={b.label} onClick={()=>onDrill(i%2?"Open":"Solved")} className="chart-point"><text x={30+i*70} y="178" textAnchor="middle">{b.label}</text>{created&&<circle cx={30+i*70} cy={150-(b.created/max)*110} r="5"><title>{b.created} created</title></circle>}{solved&&<circle className="resolved-dot" cx={30+i*70} cy={150-(b.solved/max)*110} r="5"><title>{b.solved} resolved</title></circle>}</g>)}</svg>
  </div>;
}

function Donut({tickets,onDrill,type="priority"}:{tickets:Ticket[];onDrill:(s:string)=>void;type?:string}) {
  const keys=type==="priority"?["Urgent","High","Normal","Low"]:["New","Open","Pending","Solved"];
  const vals=keys.map(k=>tickets.filter(t=>(type==="priority"?t.priority:t.status)===k).length), total=Math.max(1,vals.reduce((a,b)=>a+b,0));
  let acc=0; const colors=["#C94D60","#C18429","#6C4AB6","#27845A"];
  const gradient=vals.map((v,i)=>{const s=acc;acc+=v/total*360;return `${colors[i]} ${s}deg ${acc}deg`}).join(",");
  return <div className="card donut-card"><div className="card-head"><div><h2>Tickets by {type==="priority"?"Priority":"Status"}</h2><p>Current distribution</p></div></div><div className="donut-wrap"><button className="donut" style={{background:`conic-gradient(${gradient})`}} onClick={()=>onDrill(keys[vals.indexOf(Math.max(...vals))])}><span><b>{vals.reduce((a,b)=>a+b,0)}</b>Total</span></button><div className="donut-list">{keys.map((k,i)=><button key={k} onClick={()=>onDrill(k)}><i style={{background:colors[i]}}/><span>{k}</span><b>{vals[i]}</b></button>)}</div></div></div>;
}

function GroupPerformance({tickets,onDrill}:{tickets:Ticket[];onDrill:(s:string)=>void}) {
  const groups=["Technical Support","Cloud Services","Security","Accounts"];
  return <div className="card group-card"><div className="card-head"><div><h2>Support Group Performance</h2><p>Resolution rate by team</p></div></div><div className="group-bars">{groups.map(g=>{const all=tickets.filter(t=>t.group===g), solved=all.filter(t=>t.status==="Solved").length, rate=all.length?Math.round(solved/all.length*100):0;return <button key={g} onClick={()=>onDrill(g)}><span>{g}<b>{all.length} tickets · {rate}% solved</b></span><i><em style={{width:`${Math.max(rate,5)}%`}}/></i></button>})}</div></div>;
}

type ChartType = "bar" | "line" | "pie" | "doughnut" | "area";
function AnalyticsChart({tickets,onDrill}:{tickets:Ticket[];onDrill:(s:string)=>void}) {
  const [chartType,setChartType]=useState<ChartType>("bar");
  const statuses:Status[]=["New","Open","Pending","Solved"];
  const colors=["#6C4AB6","#D59B43","#5B8CC0","#27845A"];
  const statusData=statuses.map((label,i)=>({label,value:tickets.filter(t=>t.status===label).length,color:colors[i]}));
  const total=statusData.reduce((sum,item)=>sum+item.value,0);
  const maxStatus=Math.max(1,...statusData.map(item=>item.value));
  const oldest=tickets.length?Math.min(...tickets.map(t=>new Date(t.created).getTime())):Date.now()-30*86400000;
  const span=Math.max(7*86400000,Date.now()-oldest);
  const step=span/7;
  const trend=Array.from({length:8},(_,i)=>{
    const start=oldest+i*step,end=i===7?Date.now()+1:oldest+(i+1)*step;
    return {label:new Date(start).toLocaleDateString("en",{month:"short",day:"numeric"}),value:tickets.filter(t=>{const d=new Date(t.created).getTime();return d>=start&&d<end}).length};
  });
  const maxTrend=Math.max(1,...trend.map(item=>item.value));
  const trendPoints=trend.map((item,i)=>`${48+i*70},${176-(item.value/maxTrend)*125}`).join(" ");
  let angle=0;
  const gradient=statusData.map(item=>{const start=angle;angle+=total?item.value/total*360:0;return `${item.color} ${start}deg ${angle}deg`}).join(",");
  const labels:Record<ChartType,string>={bar:"Ticket volume by status",line:"Ticket trends over time",pie:"Ticket status distribution",doughnut:"Ticket status distribution",area:"Ticket volume over time"};
  const isTrend=chartType==="line"||chartType==="area";
  return <section className="card analytics-chart">
    <div className="analytics-chart-head"><div><h2>{labels[chartType]}</h2><p>{isTrend?"Created tickets across the selected date range":"Live status totals for the selected filters"}</p></div>
      <Field label="Chart type"><select value={chartType} onChange={e=>setChartType(e.target.value as ChartType)} aria-label="Select analytics chart type"><option value="bar">Bar Chart</option><option value="line">Line Chart</option><option value="pie">Pie Chart</option><option value="doughnut">Doughnut Chart</option><option value="area">Area Chart</option></select></Field>
    </div>
    {!tickets.length?<div className="analytics-empty"><Icon name="chart" size={28}/><h3>No chart data</h3><p>Adjust or clear the analytics filters to see ticket activity.</p></div>:
    <div className="analytics-visual">
      {chartType==="bar"&&<svg viewBox="0 0 620 260" role="img" aria-label="Bar chart of tickets by status">
        <g className="gridlines">{[55,95,135,175].map(y=><line key={y} x1="52" y1={y} x2="600" y2={y}/>)}</g><text className="axis-title" x="15" y="120" transform="rotate(-90 15 120)">Tickets</text>
        {statusData.map((item,i)=>{const h=item.value/maxStatus*145;return <g className="analytics-mark" key={item.label} onClick={()=>onDrill(item.label)}><rect x={88+i*130} y={190-h} width="68" height={h} rx="8" fill={item.color}><title>{item.label}: {item.value} tickets</title></rect><text className="bar-value" x={122+i*130} y={182-h} textAnchor="middle">{item.value}</text><text x={122+i*130} y="218" textAnchor="middle">{item.label}</text></g>})}
      </svg>}
      {isTrend&&<svg viewBox="0 0 580 250" role="img" aria-label={`${chartType} chart of ticket trends over time`}>
        <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6C4AB6" stopOpacity=".3"/><stop offset="100%" stopColor="#6C4AB6" stopOpacity=".03"/></linearGradient></defs>
        <g className="gridlines">{[50,90,130,175].map(y=><line key={y} x1="44" y1={y} x2="555" y2={y}/>)}</g><text className="axis-title" x="14" y="120" transform="rotate(-90 14 120)">Tickets created</text>
        {chartType==="area"&&<polygon points={`48,176 ${trendPoints} 538,176`} fill="url(#areaFill)"/>}<polyline points={trendPoints} className="analytics-trend-line"/>
        {trend.map((item,i)=><g className="analytics-mark" key={`${item.label}-${i}`}><circle cx={48+i*70} cy={176-(item.value/maxTrend)*125} r="5"><title>{item.label}: {item.value} tickets created</title></circle><text x={48+i*70} y="210" textAnchor="middle">{item.label}</text></g>)}
      </svg>}
      {(chartType==="pie"||chartType==="doughnut")&&<div className="analytics-radial"><div className={`analytics-pie ${chartType}`} style={{background:`conic-gradient(${gradient})`}}>{chartType==="doughnut"&&<span><b>{total}</b>Total tickets</span>}</div><div className="analytics-legend">{statusData.map(item=><button key={item.label} onClick={()=>onDrill(item.label)}><i style={{background:item.color}}/><span>{item.label}</span><b>{item.value} · {total?Math.round(item.value/total*100):0}%</b></button>)}</div></div>}
    </div>}
  </section>;
}

function TicketTable({tickets,onOpen,onEdit,onClear,title="Recent Tickets"}:{tickets:Ticket[];onOpen:(t:Ticket)=>void;onEdit:(t:Ticket)=>void;onClear?:()=>void;title?:string}) {
  const [sort,setSort]=useState<keyof Ticket>("created"),[asc,setAsc]=useState(false),[limit,setLimit]=useState(6);
  const sorted=[...tickets].sort((a,b)=>String(a[sort]).localeCompare(String(b[sort]))*(asc?1:-1));
  const toggle=(k:keyof Ticket)=>{if(sort===k)setAsc(!asc);else{setSort(k);setAsc(true)}};
  return <div className="card table-card"><div className="card-head"><div><h2>{title}</h2><p>{tickets.length} matching tickets</p></div></div>{tickets.length===0?<div className="empty"><div><Icon name="search" size={28}/></div><h3>No tickets found</h3><p>Try adjusting your search or filters.</p>{onClear&&<Button onClick={onClear}>Clear filters</Button>}</div>:<><div className="table-scroll"><table><thead><tr>{[["id","Ticket ID"],["subject","Subject"],["customer","Customer"],["area","Product Area"],["priority","Priority"],["status","Status"],["group","Assigned Group"],["created","Created"]].map(([k,l])=><th key={k}><button onClick={()=>toggle(k as keyof Ticket)}>{l}{sort===k&&(asc?" ↑":" ↓")}</button></th>)}<th>Actions</th></tr></thead>
  <tbody>{sorted.slice(0,limit).map(t=><tr key={t.id} onClick={()=>onOpen(t)}><td><b className="ticket-id">{t.id}</b></td><td><strong>{t.subject}</strong></td><td>{t.customer}<small>{t.email}</small></td><td>{t.area}</td><td><Badge type={t.priority}>{t.priority}</Badge></td><td><Badge type={t.status}>{t.status}</Badge></td><td>{t.group||"Unassigned"}</td><td>{new Date(t.created).toLocaleDateString("en",{month:"short",day:"numeric",year:"numeric"})}</td><td><div className="row-actions"><button onClick={e=>{e.stopPropagation();onOpen(t)}}>View</button><button onClick={e=>{e.stopPropagation();onEdit(t)}}>Edit</button></div></td></tr>)}</tbody></table></div>{limit<tickets.length&&<div className="load"><Button kind="ghost" onClick={()=>setLimit(limit+6)}>Load more</Button></div>}</>}</div>;
}

const emptyForm={customer:"",email:"",subject:"",description:"",area:"Technical Support",priority:"Normal" as Priority,group:"Technical Support",status:"New" as Status};
function TicketModal({onClose,onSave,edit}:{onClose:()=>void;onSave:(f:any)=>void;edit:Ticket|null}) {
  const [form,setForm]=useState(edit?{...edit}:emptyForm),[errors,setErrors]=useState<Record<string,string>>({});
  const submit=(e:React.FormEvent)=>{e.preventDefault();const er:Record<string,string>={};["customer","email","subject","description"].forEach(k=>{if(!form[k as keyof typeof form])er[k]="Required"});if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))er.email="Enter a valid email";setErrors(er);if(!Object.keys(er).length)onSave(form)};
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><form className="modal" onSubmit={submit}><div className="modal-head"><div><h2>{edit?"Edit ticket":"Create a new ticket"}</h2><p>{edit?"Update ticket details and assignment.":"Add a request to the Lumina support queue."}</p></div><button className="icon-btn" onClick={onClose} type="button"><Icon name="close"/></button></div>
  <div className="form-grid"><Field label="Customer name *"><input value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})}/>{errors.customer&&<em>{errors.customer}</em>}</Field><Field label="Customer email *"><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>{errors.email&&<em>{errors.email}</em>}</Field><Field label="Ticket subject *"><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>{errors.subject&&<em>{errors.subject}</em>}</Field><Field label="Product area"><select value={form.area} onChange={e=>setForm({...form,area:e.target.value})}>{["Technical Support","Microsoft 365","Security","Account Management"].map(x=><option key={x}>{x}</option>)}</select></Field>
  <Field label="Description *"><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>{errors.description&&<em>{errors.description}</em>}</Field><Field label="Priority"><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{["Urgent","High","Normal","Low"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Assigned group"><select value={form.group} onChange={e=>setForm({...form,group:e.target.value})}><option value="">Unassigned</option>{["Technical Support","Cloud Services","Security","Accounts"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Status"><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{["New","Open","Pending","Solved"].map(x=><option key={x}>{x}</option>)}</select></Field></div>
  <div className="modal-actions"><Button kind="ghost" onClick={onClose}>Cancel</Button><Button type="submit">{edit?"Save changes":"Create ticket"}</Button></div></form></div>;
}

function TicketDetails({ticket,onBack,onUpdate,toast}:{ticket:Ticket;onBack:()=>void;onUpdate:(t:Ticket)=>void;toast:(s:string)=>void}) {
  const [draft,setDraft]=useState(ticket),[reply,setReply]=useState(""),[internal,setInternal]=useState(false);
  const addReply=()=>{if(!reply.trim())return;const updated={...draft,messages:[...draft.messages,{from:internal?"Jordan Ellis · Internal note":"Jordan Ellis · Lumina Support",body:reply,time:new Date().toISOString(),internal}]};setDraft(updated);onUpdate(updated);setReply("");toast(internal?"Internal note added":"Reply sent successfully")};
  return <div className="detail-page"><button className="back" onClick={onBack}>← Back to tickets</button><div className="detail-head"><div><span>{ticket.id}</span><h1>{ticket.subject}</h1><p>Created {new Date(ticket.created).toLocaleString()}</p></div><div><Badge type={draft.priority}>{draft.priority}</Badge><Badge type={draft.status}>{draft.status}</Badge></div></div>
  <div className="detail-grid"><main><section className="card description"><h2>Issue description</h2><p>{ticket.description}</p></section><section className="card conversation"><h2>Conversation</h2>{draft.messages.map((m,i)=><article key={i} className={m.internal?"internal":m.from===ticket.customer?"customer":""}><div className="avatar">{m.from.slice(0,2).toUpperCase()}</div><div><strong>{m.from}</strong><time>{new Date(m.time).toLocaleString()}</time><p>{m.body}</p>{m.internal&&<Badge type="pending">Internal note</Badge>}</div></article>)}
  <div className="composer"><div className="composer-tabs"><button className={!internal?"active":""} onClick={()=>setInternal(false)}>Reply to customer</button><button className={internal?"active":""} onClick={()=>setInternal(true)}>Internal note</button></div><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder={internal?"Add a private note for your team...":"Write a helpful reply..."}/><Button onClick={addReply} disabled={!reply.trim()}>{internal?"Add note":"Send reply"}</Button></div></section></main>
  <aside><section className="card side-detail"><h2>Ticket details</h2><Field label="Status"><select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value as Status})}>{["New","Open","Pending","Solved"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Priority"><select value={draft.priority} onChange={e=>setDraft({...draft,priority:e.target.value as Priority})}>{["Urgent","High","Normal","Low"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Support group"><select value={draft.group} onChange={e=>setDraft({...draft,group:e.target.value})}><option value="">Unassigned</option>{["Technical Support","Cloud Services","Security","Accounts"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Assigned agent"><select value={draft.agent} onChange={e=>setDraft({...draft,agent:e.target.value})}><option value="">Unassigned</option>{["Jordan Ellis","Avery Brooks","Riley Morgan"].map(x=><option key={x}>{x}</option>)}</select></Field><Button onClick={()=>{onUpdate({...draft,updated:new Date().toISOString()});toast("Ticket changes saved")}}>Save changes</Button></section>
  <section className="card customer-card"><h2>Customer</h2><div className="avatar large">{ticket.customer.split(" ").map(x=>x[0]).join("")}</div><strong>{ticket.customer}</strong><p>{ticket.email}</p><small>{ticket.area}</small></section></aside></div></div>;
}

function Customers({tickets,onTicket}:{tickets:Ticket[];onTicket:(t:Ticket)=>void}) {
  const [q,setQ]=useState(""),[selected,setSelected]=useState<string|null>(null);
  const customers=Array.from(new Map(tickets.map(t=>[t.email,{name:t.customer,email:t.email,area:t.area}])).values()).filter(c=>(c.name+c.email).toLowerCase().includes(q.toLowerCase()));
  if(selected){const c=customers.find(x=>x.email===selected)||Array.from(new Map(tickets.map(t=>[t.email,{name:t.customer,email:t.email,area:t.area}])).values()).find(x=>x.email===selected)!;return <div><button className="back" onClick={()=>setSelected(null)}>← Back to customers</button><div className="customer-hero card"><div className="avatar large">{c.name.split(" ").map(x=>x[0]).join("")}</div><div><h2>{c.name}</h2><p>{c.email} · {c.area}</p></div></div><TicketTable tickets={tickets.filter(t=>t.email===selected)} onOpen={onTicket} onEdit={onTicket} title="Ticket history"/></div>}
  return <><div className="toolbar-search search"><Icon name="search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search customers..."/></div><div className="customer-grid">{customers.map(c=><button className="card customer-tile" onClick={()=>setSelected(c.email)} key={c.email}><div className="avatar large">{c.name.split(" ").map(x=>x[0]).join("")}</div><h3>{c.name}</h3><p>{c.email}</p><span>{tickets.filter(t=>t.email===c.email).length} tickets</span></button>)}</div></>;
}

const articles=[
  {title:"Set up your Lumina workspace",cat:"Getting Started",time:"5 min",body:"Create your workspace, invite your teammates, and configure your core support settings. Start by confirming your company details, then assign teammates to the appropriate support groups."},
  {title:"Troubleshoot VPN connection issues",cat:"Technical Support",time:"8 min",body:"First confirm your internet connection is stable. Restart the VPN client, verify that your credentials are current, and check whether your firewall permits the required ports."},
  {title:"Configure Microsoft 365 sign-in",cat:"Microsoft 365",time:"6 min",body:"Connect your Microsoft 365 account securely using your organisation credentials. Administrators may require multi-factor authentication before access is granted."},
  {title:"Recognise and report phishing",cat:"Security",time:"4 min",body:"Check the sender address, hover over links before opening them, and be cautious of urgent requests. Report suspicious messages to your security team immediately."},
  {title:"Manage team roles and permissions",cat:"Getting Started",time:"7 min",body:"Roles control what each teammate can view and change. Assign only the permissions required for each person’s responsibilities and review access regularly."},
  {title:"Recover a locked account",cat:"Technical Support",time:"3 min",body:"Use the account recovery link on the sign-in screen. Verify your identity with your recovery email or authenticator, then choose a strong new password."},
];
function Knowledge(){
  const [q,setQ]=useState(""),[article,setArticle]=useState<typeof articles[0]|null>(null);
  if(article)return <div><button className="back" onClick={()=>setArticle(null)}>← Back to Knowledge Base</button><article className="article card"><Badge type="normal">{article.cat}</Badge><h1>{article.title}</h1><p className="meta">{article.time} read · Updated recently</p><p>{article.body}</p><h2>Need more help?</h2><p>Contact the Lumina Support team and include any screenshots or error messages you’re seeing.</p><Button onClick={()=>alert("Support request opened.")}>Contact support</Button></article></div>;
  const filtered=articles.filter(a=>(a.title+a.cat).toLowerCase().includes(q.toLowerCase()));
  return <><div className="kb-hero"><h2>How can we help?</h2><div className="search"><Icon name="search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search help articles..."/></div></div><div className="article-grid">{filtered.map(a=><button className="card article-tile" key={a.title} onClick={()=>setArticle(a)}><span>{a.cat}</span><h3>{a.title}</h3><p>{a.body.slice(0,95)}...</p><small>{a.time} read →</small></button>)}</div></>;
}

function Settings({toast}:{toast:(s:string)=>void}) {
  const [prefs,setPrefs]=useState(()=>JSON.parse(localStorage.getItem("lumina-prefs")||'{"email":true,"desktop":true,"compact":false,"weekly":true}'));
  const save=()=>{localStorage.setItem("lumina-prefs",JSON.stringify(prefs));toast("Preferences saved")};
  return <div className="settings-grid"><section className="card settings-card"><h2>Profile preferences</h2><Field label="Display name"><input defaultValue="Jordan Ellis"/></Field><Field label="Role"><input defaultValue="Senior Support Agent"/></Field><Field label="Time zone"><select defaultValue="Europe/London"><option>Europe/London</option><option>America/New_York</option><option>Asia/Singapore</option></select></Field></section><section className="card settings-card"><h2>Notifications</h2>{[["email","Email ticket updates"],["desktop","Desktop notifications"],["weekly","Weekly performance summary"],["compact","Compact dashboard layout"]].map(([k,l])=><label className="toggle-row" key={k}><span>{l}<small>Keep your workspace aligned with your preferences.</small></span><input type="checkbox" checked={prefs[k]} onChange={e=>setPrefs({...prefs,[k]:e.target.checked})}/></label>)}<Button onClick={save}>Save preferences</Button></section></div>;
}

export default function App() {
  const [tickets,setTickets]=useState<Ticket[]>(()=>{try{return JSON.parse(localStorage.getItem("lumina-tickets")||"null")||seed}catch{return seed}});
  const [page,setPage]=useState<Page>("dashboard"),[mobile,setMobile]=useState(false),[query,setQuery]=useState(""),[selected,setSelected]=useState<Ticket|null>(null),[modal,setModal]=useState(false),[edit,setEdit]=useState<Ticket|null>(null),[message,setMessage]=useState("");
  const initialFilters={days:"30",start:"",end:"",status:"",priority:"",group:"",area:""};
  const [draft,setDraft]=useState(initialFilters),[filters,setFilters]=useState(initialFilters);
  useEffect(()=>localStorage.setItem("lumina-tickets",JSON.stringify(tickets)),[tickets]);
  const toast=(s:string)=>{setMessage(s);setTimeout(()=>setMessage(""),2600)};
  const filtered=useMemo(()=>tickets.filter(t=>{
    const q=query.toLowerCase(),search=!q||(t.id+t.subject+t.customer+t.email).toLowerCase().includes(q);
    let date=true;if(filters.days==="custom")date=(!filters.start||new Date(t.created)>=new Date(filters.start))&&(!filters.end||new Date(t.created)<=new Date(filters.end+"T23:59"));else date=withinDays(t,Number(filters.days));
    return search&&date&&(!filters.status||t.status===filters.status)&&(!filters.priority||t.priority===filters.priority)&&(!filters.group||t.group===filters.group)&&(!filters.area||t.area===filters.area)
  }),[tickets,query,filters]);
  const pageTickets=page==="my"?tickets.filter(t=>t.agent==="Jordan Ellis"):page==="unassigned"?tickets.filter(t=>!t.agent||!t.group):filtered;
  const update=(t:Ticket)=>{setTickets(x=>x.map(y=>y.id===t.id?t:y));setSelected(t)};
  const saveModal=(f:any)=>{if(edit){const t={...edit,...f,updated:new Date().toISOString()};update(t)}else{const num=Math.max(...tickets.map(t=>Number(t.id.replace(/\D/g,""))))+1;setTickets([{...f,id:`#LS-${num}`,created:new Date().toISOString(),updated:new Date().toISOString(),agent:"",response:0,messages:[{from:f.customer,body:f.description,time:new Date().toISOString()}]},...tickets])}setModal(false);setEdit(null);toast(edit?"Ticket updated":"Ticket created successfully")};
  const openList=(key:string,value:string)=>{if(key==="analytics"){setPage("analytics");return}setPage("tickets");setFilters({...initialFilters,days:"90",...(key==="status"?{status:value}:{})})};
  const drill=(value:string)=>{const statuses=["New","Open","Pending","Solved"],priorities=["Urgent","High","Normal","Low"];setPage("tickets");setFilters({...initialFilters,days:"90",status:statuses.includes(value)?value:"",priority:priorities.includes(value)?value:"",group:!statuses.includes(value)&&!priorities.includes(value)?value:""})};
  const clear=()=>{setDraft(initialFilters);setFilters(initialFilters);setQuery("")};
  if(selected)return <div className="app"><Sidebar page={page} setPage={p=>{setSelected(null);setPage(p)}} open={mobile} setOpen={setMobile}/><div className="content"><TicketDetails ticket={selected} onBack={()=>setSelected(null)} onUpdate={update} toast={toast}/></div>{message&&<div className="toast"><Icon name="check"/>{message}</div>}</div>;
  return <div className="app"><Sidebar page={page} setPage={setPage} open={mobile} setOpen={setMobile}/><div className="content"><Header page={page} onCreate={()=>{setEdit(null);setModal(true)}} query={query} setQuery={setQuery} onMenu={()=>setMobile(true)}/><div className="page">
    {page==="dashboard"&&<><Filters draft={draft} setDraft={setDraft} apply={()=>{setFilters(draft);toast("Dashboard filters applied")}} reset={clear}/><div className="active-filters"><Badge type="normal">{filters.days==="custom"?`${filters.start||"Start"} — ${filters.end||"End"}`:`Last ${filters.days} days`}</Badge>{Object.entries(filters).filter(([k,v])=>v&&!["days","start","end"].includes(k)).map(([k,v])=><Badge key={k} type="normal">{k}: {v}</Badge>)}</div><Kpis tickets={filtered} openList={openList}/><div className="dashboard-grid"><div className="span-8"><LineChart tickets={filtered} onDrill={drill}/></div><div className="span-4"><Donut tickets={filtered} onDrill={drill}/></div><div className="span-6"><Donut tickets={filtered} onDrill={drill} type="status"/></div><div className="span-6"><GroupPerformance tickets={filtered} onDrill={drill}/></div><div className="span-12"><TicketTable tickets={filtered} onOpen={setSelected} onEdit={t=>{setEdit(t);setModal(true)}} onClear={clear}/></div></div></>}
    {(page==="tickets"||page==="my"||page==="unassigned")&&<><div className="list-toolbar"><p>{page==="my"?"Tickets assigned to you.":page==="unassigned"?"Tickets waiting for an owner.":"Search, filter and manage every support request."}</p><div><Field label="Status"><select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">All statuses</option>{["New","Open","Pending","Solved"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Priority"><select value={filters.priority} onChange={e=>setFilters({...filters,priority:e.target.value})}><option value="">All priorities</option>{["Urgent","High","Normal","Low"].map(x=><option key={x}>{x}</option>)}</select></Field></div></div><TicketTable tickets={pageTickets} onOpen={setSelected} onEdit={t=>{setEdit(t);setModal(true)}} onClear={clear} title={nav.find(n=>n.id===page)?.label}/></>}
    {page==="analytics"&&<><Filters draft={draft} setDraft={setDraft} apply={()=>{setFilters(draft);toast("Analytics filters applied")}} reset={clear}/><div className="analytics-summary"><div><span>Resolution rate</span><strong>{`${filtered.length?Math.round(filtered.filter(t=>t.status==="Solved").length/filtered.length*100):0}%`}</strong><small>Based on filtered tickets</small></div><div><span>Average response</span><strong>{`${filtered.length?Math.round(filtered.reduce((a,t)=>a+t.response,0)/filtered.length):0}m`}</strong><small>Target: within 60 minutes</small></div><div><span>Tickets in view</span><strong>{filtered.length}</strong><small>{filters.days==="custom"?"Custom date range":`Last ${filters.days} days`}</small></div></div><AnalyticsChart tickets={filtered} onDrill={drill}/><div className="dashboard-grid analytics-secondary"><div className="span-6"><GroupPerformance tickets={filtered} onDrill={drill}/></div><div className="span-6"><Donut tickets={filtered} onDrill={drill} type="status"/></div></div></>}
    {page==="customers"&&<Customers tickets={tickets} onTicket={setSelected}/>}
    {page==="knowledge"&&<Knowledge/>}
    {page==="settings"&&<Settings toast={toast}/>}
  </div></div>{modal&&<TicketModal onClose={()=>{setModal(false);setEdit(null)}} onSave={saveModal} edit={edit}/>} {message&&<div className="toast"><Icon name="check"/>{message}</div>}</div>;
}