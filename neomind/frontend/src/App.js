import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Icons = {
  Brain: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.7 3 1.8 4L12 21l6.2-9.5A5.49 5.49 0 0 0 20 7.5 5.5 5.5 0 0 0 14.5 2h-5Z"/><path d="M12 2v19"/><path d="M4.5 10h15"/></svg>,
  Video: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>,
  Audio: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  Clipboard: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>,
  Chart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>,
  Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>,
  Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  Chat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Stethoscope: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6h.87"/><circle cx="20" cy="18" r="2"/></svg>,
  Search: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Phone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Send: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  LogOut: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Baby: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>,
  Note: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>,
};

function FileUpload({ accept, onFileSelect, fileType, icon }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) { setSelectedFile(file); onFileSelect(file); } }, [onFileSelect]);
  const handleChange = (e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); onFileSelect(file); } };
  return (
    <div className={`file-upload ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
      <input type="file" accept={accept} onChange={handleChange} id={`file-${fileType}`} hidden />
      <label htmlFor={`file-${fileType}`} className="upload-label">
        {selectedFile ? (<><div className="upload-success-icon"><Icons.Check /></div><span className="upload-filename">{selectedFile.name}</span><span className="upload-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span></>) : (<><div className="upload-icon">{icon}</div><span className="upload-text">Drop your {fileType} file here</span><span className="upload-subtext">or click to browse</span><span className="upload-formats">Supported: {accept}</span></>)}
      </label>
    </div>
  );
}

function RiskGauge({ score, label, size = 120 }) {
  const r = (size - 20) / 2, c = 2 * Math.PI * r, o = c - (score / 100) * c;
  const col = (s) => s <= 30 ? '#10b981' : s <= 50 ? '#f59e0b' : s <= 70 ? '#f97316' : '#ef4444';
  const lev = (s) => s <= 30 ? 'Minimal' : s <= 50 ? 'Low' : s <= 70 ? 'Moderate' : 'High';
  return (<div className="risk-gauge"><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col(score)} strokeWidth="8" strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:'stroke-dashoffset 1s ease'}}/><text x={size/2} y={size/2-8} textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{score}</text><text x={size/2} y={size/2+12} textAnchor="middle" fill={col(score)} fontSize="11" fontWeight="600">{lev(score)} Risk</text></svg><span className="gauge-label">{label}</span></div>);
}

function LoadingAnalysis({ message }) {
  return (<div className="loading-analysis"><div className="loading-brain"><div className="pulse-ring"></div><div className="pulse-ring delay-1"></div><div className="pulse-ring delay-2"></div><Icons.Brain /></div><h3>{message||'Analyzing...'}</h3><p>NeoMind AI is processing.</p><div className="loading-bar"><div className="loading-bar-fill"></div></div></div>);
}

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const items = [
    {path:'/',icon:<Icons.Home/>,label:'Dashboard'},{path:'/video',icon:<Icons.Video/>,label:'Video Analysis'},{path:'/audio',icon:<Icons.Audio/>,label:'Audio Analysis'},{path:'/health',icon:<Icons.Clipboard/>,label:'Health Data'},{path:'/results',icon:<Icons.Chart/>,label:'Results'},{path:'/chatbot',icon:<Icons.Chat/>,label:'AI Chatbot'},{path:'/doctors',icon:<Icons.Stethoscope/>,label:'Find Doctors'},
    ...(user?.role==='doctor'?[{path:'/doctor-portal',icon:<Icons.Note/>,label:'Doctor Portal'}]:[]),
    ...(user?.role==='parent'?[{path:'/parent-portal',icon:<Icons.Baby/>,label:'Parent Portal'}]:[]),
  ];
  return (
    <nav className="sidebar">
      <div className="sidebar-logo"><div className="logo-icon"><Icons.Brain/></div><div className="logo-text"><span className="logo-name">NeoMind</span><span className="logo-tagline">AI Neuro Screening</span></div></div>
      <div className="nav-items">{items.map(i=><Link key={i.path} to={i.path} className={`nav-item ${location.pathname===i.path?'active':''}`}><span className="nav-icon">{i.icon}</span><span className="nav-label">{i.label}</span></Link>)}</div>
      <div className="sidebar-footer">
        {user?(<div className="user-info-sidebar"><div className="user-badge"><Icons.User/><div><span className="user-name">{user.name}</span><span className="user-role">{user.role}</span></div></div><button className="btn-logout" onClick={onLogout}><Icons.LogOut/></button></div>):(<Link to="/login" className="btn-login-sidebar"><Icons.User/> Login / Register</Link>)}
        <div className="compliance-badge"><Icons.Shield/><span>HIPAA/GDPR Compliant</span></div>
      </div>
    </nav>
  );
}

function LoginPage({ onLogin }) {
  const [isReg, setIsReg] = useState(false);
  const [role, setRole] = useState('parent');
  const [form, setForm] = useState({name:'',email:'',password:'',specialization:'',hospital:''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async () => {
    setLoading(true); setError('');
    try {
      const ep = isReg?'/api/auth/register':'/api/auth/login';
      const payload = isReg?{...form,role}:{email:form.email,password:form.password};
      const res = await axios.post(`${API_URL}${ep}`, payload);
      if(res.data.success){if(isReg){setIsReg(false);alert('Registered! Please login.');}else{onLogin(res.data.user);navigate('/');}}
    } catch(e){setError(e.response?.data?.error||'Error');}
    setLoading(false);
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header"><div className="logo-icon large"><Icons.Brain/></div><h1>NeoMind</h1><p>{isReg?'Create account':'Sign in'}</p></div>
        {isReg&&<div className="role-selector"><button className={`role-btn ${role==='parent'?'active':''}`} onClick={()=>setRole('parent')}><Icons.Baby/> Parent</button><button className={`role-btn ${role==='doctor'?'active':''}`} onClick={()=>setRole('doctor')}><Icons.Stethoscope/> Doctor</button></div>}
        {isReg&&<div className="form-group"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name"/></div>}
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email"/></div>
        <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password"/></div>
        {isReg&&role==='doctor'&&<><div className="form-group"><label>Specialization</label><input value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})}/></div><div className="form-group"><label>Hospital</label><input value={form.hospital} onChange={e=>setForm({...form,hospital:e.target.value})}/></div></>}
        {error&&<div className="error-message"><Icons.Alert/> {error}</div>}
        <button className="btn-primary full-width" onClick={submit} disabled={loading}>{loading?'Wait...':isReg?'Register':'Login'}</button>
        <p className="toggle-auth">{isReg?'Have account?':"No account?"} <button onClick={()=>{setIsReg(!isReg);setError('');}}>{isReg?'Login':'Register'}</button></p>
        <div className="demo-accounts"><h4>Demo Accounts</h4><p>Parent: parent@demo.com / parent123</p><p>Doctor: doctor@demo.com / doctor123</p></div>
      </div>
    </div>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([{role:'bot',content:"Hi! I'm NeoBot, your AI parenting assistant. How can I help? \ud83d\udc76"}]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
  const send = async () => {
    if(!input.trim()||loading)return;
    const msg=input.trim(); setInput('');
    setMessages(p=>[...p,{role:'user',content:msg}]); setLoading(true);
    try{
      const hist=messages.map(m=>({role:m.role==='user'?'user':'assistant',content:m.content}));
      const res=await axios.post(`${API_URL}/api/chatbot`,{message:msg,history:hist});
      setMessages(p=>[...p,{role:'bot',content:res.data.reply}]);
    }catch(e){setMessages(p=>[...p,{role:'bot',content:"Sorry, having trouble. Try again."}]);}
    setLoading(false);
  };
  const suggestions=["What milestones for 3-month-old?","How to improve motor skills?","Signs of autism in infants","When to worry about speech delay?"];
  return (
    <div className="page chatbot-page">
      <div className="page-header"><div><h1><Icons.Chat/> NeoBot AI Assistant</h1><p className="subtitle">Parenting & development advice</p></div></div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m,i)=><div key={i} className={`chat-msg ${m.role}`}><div className="msg-avatar">{m.role==='user'?<Icons.User/>:<Icons.Brain/>}</div><div className="msg-content"><div className="msg-bubble">{m.content}</div></div></div>)}
          {loading&&<div className="chat-msg bot"><div className="msg-avatar"><Icons.Brain/></div><div className="msg-content"><div className="msg-bubble typing">Thinking...</div></div></div>}
          <div ref={endRef}/>
        </div>
        {messages.length<=1&&<div className="chat-suggestions"><p>Try asking:</p><div className="suggestion-chips">{suggestions.map((s,i)=><button key={i} onClick={()=>setInput(s)}>{s}</button>)}</div></div>}
        <div className="chat-input-bar"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about parenting, milestones..." disabled={loading}/><button onClick={send} disabled={loading||!input.trim()} className="send-btn"><Icons.Send/></button></div>
      </div>
    </div>
  );
}

function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  useEffect(()=>{axios.get(`${API_URL}/api/doctors/directory`).then(r=>{setDoctors(r.data.doctors);setLoading(false);}).catch(()=>setLoading(false));},[]);
  const f=doctors.filter(d=>!filter||d.specialization.toLowerCase().includes(filter.toLowerCase())||d.name.toLowerCase().includes(filter.toLowerCase())||d.hospital.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="page">
      <div className="page-header"><div><h1><Icons.Stethoscope/> Find Doctors</h1><p className="subtitle">Pediatric specialists near you</p></div></div>
      <div className="search-bar-container"><Icons.Search/><input placeholder="Search by name, specialization, hospital..." value={filter} onChange={e=>setFilter(e.target.value)}/></div>
      {loading?<LoadingAnalysis message="Loading..."/>:<div className="doctors-grid">{f.map(d=><div key={d.id} className="doctor-card"><div className="doctor-card-header"><div className="doctor-avatar"><Icons.Stethoscope/></div><div><h3>{d.name}</h3><span className="doctor-spec">{d.specialization}</span></div></div><div className="doctor-details"><p><strong>Hospital:</strong> {d.hospital}</p><p><strong>Experience:</strong> {d.experience}</p><p><strong>Address:</strong> {d.address}</p><p><strong>Timings:</strong> {d.timings}</p><p><strong>Fee:</strong> {d.consultation_fee}</p></div><div className="doctor-rating"><div className="stars">{[...Array(5)].map((_,i)=><span key={i} className={i<Math.floor(d.rating)?'star filled':'star'}><Icons.Star/></span>)}</div><span>{d.rating}</span></div><div className="doctor-actions"><a href={`tel:${d.phone}`} className="btn-call"><Icons.Phone/> Call</a><a href={`mailto:${d.email}`} className="btn-email">Email</a></div></div>)}</div>}
    </div>
  );
}

function ParentPortal({ user }) {
  const [babies, setBabies] = useState(user?.babies_data||[]);
  const [showAdd, setShowAdd] = useState(false);
  const [nb, setNb] = useState({name:'',dob:'',gender:''});
  const [sel, setSel] = useState(null);
  const [results, setResults] = useState([]);
  const addB = async () => { try{const r=await axios.post(`${API_URL}/api/parent/add-baby`,{parentId:user.id,...nb});if(r.data.success){setBabies([...babies,{...r.data.baby,results:[]}]);setShowAdd(false);setNb({name:'',dob:'',gender:''});}}catch(e){alert('Failed');} };
  const view = async (b) => { setSel(b); try{const r=await axios.get(`${API_URL}/api/parent/results/${b.id}`);setResults(r.data.results||[]);}catch(e){setResults(b.results||[]);} };
  if(!user) return <Navigate to="/login"/>;
  return (
    <div className="page">
      <div className="page-header"><div><h1><Icons.Baby/> Parent Portal</h1><p className="subtitle">Welcome, {user.name}!</p></div></div>
      <div className="portal-section"><div className="section-bar"><h2>Your Babies</h2><button className="btn-primary small" onClick={()=>setShowAdd(true)}>+ Add Baby</button></div>
        {showAdd&&<div className="add-baby-form"><div className="form-grid"><div className="form-group"><label>Name</label><input value={nb.name} onChange={e=>setNb({...nb,name:e.target.value})}/></div><div className="form-group"><label>DOB</label><input type="date" value={nb.dob} onChange={e=>setNb({...nb,dob:e.target.value})}/></div><div className="form-group"><label>Gender</label><select value={nb.gender} onChange={e=>setNb({...nb,gender:e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option></select></div></div><div className="form-actions"><button className="btn-primary small" onClick={addB}>Save</button><button className="btn-secondary small" onClick={()=>setShowAdd(false)}>Cancel</button></div></div>}
        <div className="babies-list">{babies.map(b=><div key={b.id} className={`baby-card ${sel?.id===b.id?'selected':''}`} onClick={()=>view(b)}><div className="baby-icon"><Icons.Baby/></div><div><h3>{b.name}</h3><p>{b.gender} {b.dob?`Born: ${b.dob}`:''}</p></div><span className="view-arrow">\u2192</span></div>)}{babies.length===0&&<p className="empty-text">No babies yet. Click "+ Add Baby".</p>}</div>
      </div>
      {sel&&<div className="portal-section"><h2>Results for {sel.name}</h2>{results.length===0?<p className="empty-text">No results yet.</p>:<div className="results-timeline">{results.map((r,i)=><div key={i} className="timeline-item"><div className="timeline-dot"></div><div className="timeline-content"><div className="timeline-header"><span className="timeline-type">{r.type==='doctor_note'?'Doctor Note':(r.type||'').toUpperCase()}</span><span className="timeline-date">{new Date(r.timestamp).toLocaleDateString()}</span></div>{r.type==='doctor_note'?<p><strong>{r.data?.doctor_name}:</strong> {r.data?.note}</p>:<p>{r.data?.summary||'View details'}</p>}</div></div>)}</div>}</div>}
    </div>
  );
}

function DoctorPortal({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState('');
  const [nLoad, setNLoad] = useState(false);
  useEffect(()=>{axios.post(`${API_URL}/api/doctor/patients`,{doctorId:user?.id}).then(r=>{setPatients(r.data.patients||[]);setLoading(false);}).catch(()=>setLoading(false));},[user]);
  const addN = async () => {
    if(!note.trim()||!sel)return; setNLoad(true);
    try{await axios.post(`${API_URL}/api/doctor/add-note`,{babyId:sel.id,doctorId:user.id,doctorName:user.name,note});alert('Note added!');setNote('');const r=await axios.post(`${API_URL}/api/doctor/patients`,{doctorId:user?.id});setPatients(r.data.patients||[]);const u=r.data.patients.find(p=>p.id===sel.id);if(u)setSel(u);}catch(e){alert('Failed');}
    setNLoad(false);
  };
  if(!user||user.role!=='doctor') return <Navigate to="/login"/>;
  return (
    <div className="page">
      <div className="page-header"><div><h1><Icons.Stethoscope/> Doctor Portal</h1><p className="subtitle">Welcome, {user.name}</p></div></div>
      {loading?<LoadingAnalysis message="Loading..."/>:<div className="doctor-portal-layout">
        <div className="patients-panel"><h3>Patients ({patients.length})</h3>{patients.length===0?<p className="empty-text">No patients yet.</p>:patients.map(p=><div key={p.id} className={`patient-item ${sel?.id===p.id?'selected':''}`} onClick={()=>setSel(p)}><div className="patient-avatar"><Icons.Baby/></div><div><h4>{p.name}</h4><p>{p.parent_name||'Parent'} \u2022 {p.results?.length||0} results</p></div></div>)}</div>
        <div className="patient-detail-panel">{!sel?<div className="empty-detail"><Icons.Note/><p>Select a patient</p></div>:<>
          <div className="patient-header"><h2>{sel.name}</h2><p>Gender: {sel.gender||'N/A'} | DOB: {sel.dob||'N/A'} | Parent: {sel.parent_name||'N/A'}</p></div>
          <div className="patient-results"><h3>Results</h3>{sel.results?.map((r,i)=><div key={i} className="result-item-compact"><span className="result-type-badge">{r.type==='doctor_note'?'Note':r.type}</span><span className="result-date">{new Date(r.timestamp).toLocaleString()}</span>{r.type==='doctor_note'?<p><strong>{r.data?.doctor_name}:</strong> {r.data?.note}</p>:<p>{r.data?.summary||r.data?.overall_risk_level||'Details'}</p>}</div>)}</div>
          <div className="add-note-section"><h3>Add Clinical Note</h3><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Write observations..." rows={4}/><button className="btn-primary small" onClick={addN} disabled={nLoad||!note.trim()}>{nLoad?'Saving...':'Add Note'}</button></div>
        </>}</div>
      </div>}
    </div>
  );
}

function Dashboard({ user }) {
  const navigate = useNavigate();
  const features = [
    {icon:<Icons.Video/>,title:'Video Analysis',desc:'AI movement & facial analysis',path:'/video',color:'#6366f1'},
    {icon:<Icons.Audio/>,title:'Audio Analysis',desc:'Cry pattern analysis',path:'/audio',color:'#8b5cf6'},
    {icon:<Icons.Clipboard/>,title:'Health Data',desc:'Birth data assessment',path:'/health',color:'#a855f7'},
    {icon:<Icons.Chart/>,title:'Results',desc:'Comprehensive assessment',path:'/results',color:'#c084fc'},
    {icon:<Icons.Chat/>,title:'AI Chatbot',desc:'Parenting advice',path:'/chatbot',color:'#10b981'},
    {icon:<Icons.Stethoscope/>,title:'Find Doctors',desc:'Nearby specialists',path:'/doctors',color:'#f59e0b'},
  ];
  return (
    <div className="page dashboard-page">
      <div className="page-header"><div><h1>Welcome to <span className="gradient-text">NeoMind</span></h1><p className="subtitle">AI-Based Early Detection of Neurodevelopmental Disorders</p></div></div>
      <div className="hero-banner"><div className="hero-content"><h2>Early Detection. Better Outcomes.</h2><p>NeoMind analyzes subtle behavioral, physiological, and genetic markers for early interventions.</p><div className="hero-buttons"><button className="btn-primary" onClick={()=>navigate('/video')}>Start Screening \u2192</button>{!user&&<button className="btn-secondary" onClick={()=>navigate('/login')}>Login / Register</button>}</div></div><div className="hero-visual"><div className="hero-brain-container"><div className="hero-orbit orbit-1"></div><div className="hero-orbit orbit-2"></div><div className="hero-orbit orbit-3"></div><div className="hero-brain-icon"><Icons.Brain/></div></div></div></div>
      <div className="section-title"><h2>All Features</h2></div>
      <div className="features-grid">{features.map((f,i)=><div key={i} className="feature-card" onClick={()=>navigate(f.path)} style={{'--accent':f.color}}><div className="feature-icon" style={{background:`${f.color}20`,color:f.color}}>{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p><span className="feature-arrow">\u2192</span></div>)}</div>
      <div className="disclaimer-banner"><Icons.Alert/><p><strong>Disclaimer:</strong> NeoMind is for educational/research purposes. Consult healthcare professionals.</p></div>
    </div>
  );
}

function VideoAnalysis({onResult}){const[file,setFile]=useState(null);const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);const[error,setError]=useState(null);const navigate=useNavigate();const run=async()=>{if(!file)return;setLoading(true);setError(null);const fd=new FormData();fd.append('video',file);try{const r=await axios.post(`${API_URL}/api/analyze/video`,fd,{headers:{'Content-Type':'multipart/form-data'},timeout:120000});setResult(r.data.analysis);onResult(r.data.analysis);}catch(e){setError(e.response?.data?.error||'Failed');}setLoading(false);};return(<div className="page"><div className="page-header"><div><h1><Icons.Video/> Video Analysis</h1><p className="subtitle">Computer Vision AI analysis</p></div></div>{!result&&!loading&&<div className="analysis-card"><div className="card-section"><h3>Upload Baby Video</h3><FileUpload accept=".mp4,.avi,.mov,.webm" fileType="video" icon={<Icons.Video/>} onFileSelect={setFile}/></div>{error&&<div className="error-message"><Icons.Alert/> {error}</div>}<div className="card-actions"><button className="btn-primary" onClick={run} disabled={!file}><Icons.Brain/> Analyze</button></div></div>}{loading&&<LoadingAnalysis message="Analyzing video..."/>}{result&&<div className="results-container"><div className="result-header"><h2>Video Results</h2><RiskGauge score={100-(result.overall_video_score||70)} label="Risk" size={140}/></div>{result.summary&&<div className="summary-card"><h3>Summary</h3><p>{result.summary}</p></div>}<div className="card-actions"><button className="btn-secondary" onClick={()=>{setResult(null);setFile(null);}}>New</button><button className="btn-primary" onClick={()=>navigate('/audio')}>Audio \u2192</button></div></div>}</div>);}

function AudioAnalysis({onResult}){const[file,setFile]=useState(null);const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);const[error,setError]=useState(null);const navigate=useNavigate();const run=async()=>{if(!file)return;setLoading(true);setError(null);const fd=new FormData();fd.append('audio',file);try{const r=await axios.post(`${API_URL}/api/analyze/audio`,fd,{headers:{'Content-Type':'multipart/form-data'},timeout:120000});setResult(r.data.analysis);onResult(r.data.analysis);}catch(e){setError(e.response?.data?.error||'Failed');}setLoading(false);};return(<div className="page"><div className="page-header"><div><h1><Icons.Audio/> Audio Analysis</h1><p className="subtitle">Cry & vocalization analysis</p></div></div>{!result&&!loading&&<div className="analysis-card"><div className="card-section"><h3>Upload Audio</h3><FileUpload accept=".wav,.mp3,.ogg,.webm" fileType="audio" icon={<Icons.Audio/>} onFileSelect={setFile}/></div>{error&&<div className="error-message"><Icons.Alert/> {error}</div>}<div className="card-actions"><button className="btn-primary" onClick={run} disabled={!file}><Icons.Brain/> Analyze</button></div></div>}{loading&&<LoadingAnalysis message="Analyzing audio..."/>}{result&&<div className="results-container"><div className="result-header"><h2>Audio Results</h2><RiskGauge score={100-(result.overall_audio_score||70)} label="Risk" size={140}/></div>{result.summary&&<div className="summary-card"><h3>Summary</h3><p>{result.summary}</p></div>}<div className="card-actions"><button className="btn-secondary" onClick={()=>{setResult(null);setFile(null);}}>New</button><button className="btn-primary" onClick={()=>navigate('/health')}>Health \u2192</button></div></div>}</div>);}

function HealthData({onResult}){const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);const[error,setError]=useState(null);const navigate=useNavigate();const[fd,setFd]=useState({babyName:'',dateOfBirth:'',gender:'',gestationalAge:'',birthWeight:'',birthLength:'',headCircumference:'',apgar1:'',apgar5:'',birthComplications:'',familyADHD:'No',familyASD:'No',familyDownSyndrome:'No',familyDevDelays:'No',familyOtherNeuro:'',maternalAge:'',prenatalComplications:'',prenatalMedications:''});const ch=(e)=>setFd({...fd,[e.target.name]:e.target.value});const run=async()=>{setLoading(true);setError(null);try{const r=await axios.post(`${API_URL}/api/analyze/health`,fd,{timeout:60000});setResult(r.data.analysis);onResult(r.data.analysis);}catch(e){setError(e.response?.data?.error||'Failed');}setLoading(false);};return(<div className="page"><div className="page-header"><div><h1><Icons.Clipboard/> Health Data</h1><p className="subtitle">Predictive risk modeling</p></div></div>{!result&&!loading&&<div className="analysis-card"><div className="form-section"><h3>Baby Info</h3><div className="form-grid"><div className="form-group"><label>Name</label><input name="babyName" value={fd.babyName} onChange={ch}/></div><div className="form-group"><label>DOB</label><input type="date" name="dateOfBirth" value={fd.dateOfBirth} onChange={ch}/></div><div className="form-group"><label>Gender</label><select name="gender" value={fd.gender} onChange={ch}><option value="">Select</option><option>Male</option><option>Female</option></select></div><div className="form-group"><label>Gestational (wk)</label><input type="number" name="gestationalAge" value={fd.gestationalAge} onChange={ch}/></div><div className="form-group"><label>Weight (g)</label><input type="number" name="birthWeight" value={fd.birthWeight} onChange={ch}/></div><div className="form-group"><label>Length (cm)</label><input type="number" name="birthLength" value={fd.birthLength} onChange={ch}/></div><div className="form-group"><label>Head (cm)</label><input type="number" name="headCircumference" value={fd.headCircumference} onChange={ch}/></div></div></div><div className="form-section"><h3>Apgar</h3><div className="form-grid"><div className="form-group"><label>1 min</label><input type="number" name="apgar1" min="0" max="10" value={fd.apgar1} onChange={ch}/></div><div className="form-group"><label>5 min</label><input type="number" name="apgar5" min="0" max="10" value={fd.apgar5} onChange={ch}/></div></div><div className="form-group full-width"><label>Complications</label><textarea name="birthComplications" value={fd.birthComplications} onChange={ch} rows="2"/></div></div><div className="form-section"><h3>Family History</h3><div className="form-grid">{[['familyADHD','ADHD'],['familyASD','ASD'],['familyDownSyndrome','Down'],['familyDevDelays','Delays']].map(([n,l])=><div className="form-group" key={n}><label>{l}</label><select name={n} value={fd[n]} onChange={ch}><option>No</option><option>Yes</option><option>Unknown</option></select></div>)}</div></div><div className="form-section"><h3>Maternal</h3><div className="form-grid"><div className="form-group"><label>Age</label><input type="number" name="maternalAge" value={fd.maternalAge} onChange={ch}/></div><div className="form-group"><label>Prenatal Issues</label><input name="prenatalComplications" value={fd.prenatalComplications} onChange={ch}/></div><div className="form-group"><label>Medications</label><input name="prenatalMedications" value={fd.prenatalMedications} onChange={ch}/></div></div></div>{error&&<div className="error-message"><Icons.Alert/> {error}</div>}<div className="card-actions"><button className="btn-primary" onClick={run}><Icons.Brain/> Analyze</button></div></div>}{loading&&<LoadingAnalysis message="Analyzing health data..."/>}{result&&<div className="results-container"><div className="result-header"><h2>Health Results</h2><RiskGauge score={result.overall_risk_score||35} label="Risk" size={140}/></div>{result.risk_scores&&<div className="result-cards-grid">{Object.entries(result.risk_scores).map(([k,d])=><div className="result-detail-card" key={k}><h3>{k.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</h3><RiskGauge score={d.score} label="" size={90}/><span className={`risk-badge risk-${d.risk_level?.toLowerCase()}`}>{d.risk_level}</span></div>)}</div>}{result.summary&&<div className="summary-card"><h3>Summary</h3><p>{result.summary}</p></div>}<div className="card-actions"><button className="btn-secondary" onClick={()=>setResult(null)}>Edit</button><button className="btn-primary" onClick={()=>navigate('/results')}>Results \u2192</button></div></div>}</div>);}

function Results({videoResult,audioResult,healthResult}){const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);const[error,setError]=useState(null);const has=videoResult||audioResult||healthResult;const run=async()=>{setLoading(true);setError(null);try{const r=await axios.post(`${API_URL}/api/analyze/comprehensive`,{videoAnalysis:videoResult||{},audioAnalysis:audioResult||{},healthAnalysis:healthResult||{}},{timeout:60000});setResult(r.data.analysis);}catch(e){setError(e.response?.data?.error||'Failed');}setLoading(false);};return(<div className="page"><div className="page-header"><div><h1><Icons.Chart/> Comprehensive Assessment</h1><p className="subtitle">Combined analysis</p></div></div>{!result&&!loading&&<div className="analysis-card"><h3>Status</h3><div className="status-grid"><div className={`status-item ${videoResult?'complete':'pending'}`}><Icons.Video/><span>Video</span><span className="status-badge">{videoResult?'\u2713':'\u25CB'}</span></div><div className={`status-item ${audioResult?'complete':'pending'}`}><Icons.Audio/><span>Audio</span><span className="status-badge">{audioResult?'\u2713':'\u25CB'}</span></div><div className={`status-item ${healthResult?'complete':'pending'}`}><Icons.Clipboard/><span>Health</span><span className="status-badge">{healthResult?'\u2713':'\u25CB'}</span></div></div>{error&&<div className="error-message"><Icons.Alert/> {error}</div>}<div className="card-actions"><button className="btn-primary" onClick={run} disabled={!has}><Icons.Brain/> Generate</button></div></div>}{loading&&<LoadingAnalysis message="Generating..."/>}{result&&<div className="results-container"><div className="result-header"><h2>Assessment</h2>{result.overall_assessment&&<RiskGauge score={result.overall_assessment.risk_score} label="Overall" size={160}/>}</div>{result.overall_assessment?.summary&&<div className="summary-card highlight"><h3>Summary</h3><p>{result.overall_assessment.summary}</p></div>}<div className="disclaimer-banner"><Icons.Alert/><p>{result.disclaimer||'Screening only.'}</p></div><div className="card-actions"><button className="btn-secondary" onClick={()=>setResult(null)}>Redo</button><button className="btn-primary" onClick={()=>window.print()}>Print</button></div></div>}</div>);}

function App() {
  const [user, setUser] = useState(null);
  const [vr, setVr] = useState(null);
  const [ar, setAr] = useState(null);
  const [hr, setHr] = useState(null);
  return (
    <Router>
      <div className="app">
        <Sidebar user={user} onLogout={()=>setUser(null)}/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user}/>}/>
            <Route path="/login" element={<LoginPage onLogin={setUser}/>}/>
            <Route path="/video" element={<VideoAnalysis onResult={setVr}/>}/>
            <Route path="/audio" element={<AudioAnalysis onResult={setAr}/>}/>
            <Route path="/health" element={<HealthData onResult={setHr}/>}/>
            <Route path="/results" element={<Results videoResult={vr} audioResult={ar} healthResult={hr}/>}/>
            <Route path="/chatbot" element={<Chatbot/>}/>
            <Route path="/doctors" element={<DoctorDirectory/>}/>
            <Route path="/parent-portal" element={<ParentPortal user={user}/>}/>
            <Route path="/doctor-portal" element={<DoctorPortal user={user}/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
