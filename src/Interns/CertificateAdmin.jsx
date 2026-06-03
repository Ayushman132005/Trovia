import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { db } from '../firebase'; 
import { doc, setDoc, collection, getDocs, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { 
  FiAward, FiCheckCircle, FiSave, FiRefreshCw, FiList, FiPlus, 
  FiExternalLink, FiSlash, FiCopy, FiSearch, FiFilter, 
  FiEdit2, FiTrash2, FiActivity, FiUserCheck, FiXCircle, 
  FiPrinter, FiCalendar, FiCopy as FiClone, FiSettings, FiDownload, FiFileText
} from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';

/* --- FONTS & GLOBAL STYLES --- */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
`;

/* --- ANIMATIONS --- */
const fadeUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const slideDown = keyframes`from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); }`;
const pulseGlowValid = keyframes`0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }`;

/* --- STYLED COMPONENTS --- */
const AdminContainer = styled.div`
  --accent: ${props => props.$theme.main};
  --accent-hover: ${props => props.$theme.hover};
  --accent-alpha: ${props => props.$theme.alpha};
  min-height: calc(100vh - 80px); 
  background-color: #030305;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.08), transparent 25%);
  color: white; 
  padding: 40px 20px; 
  display: flex; flex-direction: column; align-items: center; 
  font-family: 'Inter', system-ui, sans-serif;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;

  *, *::before, *::after { box-sizing: border-box; }

  @media (max-width: 768px) { padding: 20px 10px; }

  @media print {
    background: white; color: black; padding: 0;
    * { color: black !important; background: transparent !important; box-shadow: none !important; border-color: #ccc !important; }
    .no-print { display: none !important; }
  }
`;

const FloatingHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; max-width: 1100px; margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 12px 20px; 
  border-radius: 100px; 
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: ${fadeUp} 0.5s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column; align-items: stretch; padding: 15px; gap: 15px; border-radius: 24px;
  }
`;

const TabGroup = styled.div`
  display: flex; gap: 8px;
  
  @media (max-width: 768px) {
    overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px;
    -ms-overflow-style: none; scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const TabButton = styled.button`
  padding: 12px 24px; border-radius: 50px; border: none; 
  background: ${props => props.$active ? 'var(--accent)' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#94a3b8'}; 
  font-weight: 600; font-size: 0.95rem; 
  display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap; flex-shrink: 0; 
  box-shadow: ${props => props.$active ? '0 4px 15px var(--accent-alpha)' : 'none'};

  &:hover { 
    color: white; 
    background: ${props => props.$active ? 'var(--accent-hover)' : 'rgba(255,255,255,0.05)'}; 
    transform: ${props => props.$active ? 'translateY(-2px)' : 'none'};
  }
  @media (max-width: 600px) { padding: 10px 16px; font-size: 0.85rem; flex: 1; border-radius: 14px; }
`;

const ControlsGroup = styled.div`
  display: flex; align-items: center; gap: 15px;
  
  @media (max-width: 768px) {
    justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;
  }
`;

const ThemePicker = styled.div`
  display: flex; gap: 8px; align-items: center;
  
  .dot { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0; opacity: 0.6; }
  .dot:hover { opacity: 1; transform: scale(1.1); }
  .dot.active { border-color: white; transform: scale(1.15); box-shadow: 0 0 12px var(--accent-alpha); opacity: 1; }
`;

const FormCard = styled.div`
  width: 100%; max-width: 1100px; 
  background: rgba(15, 17, 26, 0.6); backdrop-filter: blur(24px); 
  border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 28px; padding: 45px; 
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05); 
  animation: ${fadeUp} 0.6s ease-out 0.1s both;

  @media (max-width: 768px) { padding: 25px 15px; border-radius: 20px; }
`;

const TitleHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 10px;
  @media (max-width: 600px) { flex-direction: column; width: 100%; }
`;

const Title = styled.h2`
  font-size: 2.2rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 12px; color: white; flex-wrap: wrap;
  letter-spacing: -0.5px;
  svg { color: var(--accent); flex-shrink: 0; filter: drop-shadow(0 0 10px var(--accent-alpha)); }
  @media (max-width: 768px) { font-size: 1.6rem; gap: 8px; }
`;

const Subtitle = styled.p`
  color: #94a3b8; margin-bottom: 35px; font-size: 0.95rem; line-height: 1.5;
  @media (max-width: 768px) { font-size: 0.85rem; margin-bottom: 25px; }
`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 12px; }
`;

const StatBox = styled.div`
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%); 
  border: 1px solid rgba(255, 255, 255, 0.05); padding: 24px; border-radius: 20px; 
  display: flex; flex-direction: column; gap: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover { transform: translateY(-3px); background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%); }
  
  h3 { margin: 0; font-size: 2.2rem; color: ${props => props.$color || 'white'}; font-weight: 800; line-height: 1; }
  p { margin: 0; font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 700; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
  
  @media (max-width: 600px) { 
    padding: 16px 20px; flex-direction: row; justify-content: space-between; align-items: center; border-radius: 16px;
    h3 { font-size: 1.6rem; } 
  }
`;

const Toolbar = styled.div`
  display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px; margin-bottom: 25px; width: 100%;
  
  .search-box { 
    display: flex; align-items: center; background: rgba(0,0,0,0.4); border-radius: 14px; padding: 0 18px; 
    border: 1px solid rgba(255,255,255,0.08); width: 100%; min-width: 0; transition: all 0.2s;
  }
  select { 
    padding: 14px 18px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255, 255, 255, 0.08); 
    border-radius: 14px; color: white; outline: none; width: 100%; min-width: 0; appearance: none; cursor: pointer; transition: all 0.2s; 
  }
  select:focus, .search-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-alpha); background: rgba(0,0,0,0.6); }
  
  @media (max-width: 768px) { grid-template-columns: 1fr 1fr; .search-box { grid-column: 1 / -1; } }
  @media (max-width: 500px) { grid-template-columns: 1fr; select { padding: 14px; } }
`;

const FormGrid = styled.form`
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%;
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 20px; }
`;

const FormGroup = styled.div`display: flex; flex-direction: column; gap: 10px; grid-column: ${props => props.$fullWidth ? '1 / -1' : 'auto'}; width: 100%;`;
const Label = styled.label`font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 5px;`;
const Input = styled.input`
  padding: 16px 20px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; color: white; font-size: 1rem; transition: all 0.3s ease; width: 100%;
  font-family: ${props => props.$mono ? "'Space Mono', monospace" : 'inherit'}; color: ${props => props.$mono ? "var(--accent)" : "white"};
  &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-alpha); background: rgba(0, 0, 0, 0.6); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  @media (max-width: 600px) { padding: 14px 16px; font-size: 0.95rem; border-radius: 12px; }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1; margin-top: 15px; padding: 18px; width: 100%;
  background: ${props => props.$isEdit ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--accent)'}; 
  color: white; border: none; border-radius: 16px; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  &:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px var(--accent-alpha); filter: brightness(1.1); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
  @media (max-width: 600px) { padding: 16px; font-size: 1rem; }
`;

const Toast = styled.div`
  grid-column: 1 / -1; padding: 16px 24px; border-radius: 14px; animation: ${slideDown} 0.4s cubic-bezier(0.4, 0, 0.2, 1); width: 100%;
  background: ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.1)' : props.$type === 'warn' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; 
  border: 1px solid ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.3)' : props.$type === 'warn' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; 
  color: ${props => props.$type === 'error' ? '#fca5a5' : props.$type === 'warn' ? '#fcd34d' : '#6ee7b7'}; 
  display: flex; align-items: center; gap: 14px; font-weight: 600; word-break: break-word; font-size: 0.95rem;
`;

const InternList = styled.div`display: flex; flex-direction: column; gap: 20px; width: 100%;`;

const InternCard = styled.div`
  background: ${props => props.$selected ? 'var(--accent-alpha)' : 'rgba(255, 255, 255, 0.01)'}; 
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.$selected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)'}; 
  padding: 28px; border-radius: 20px; display: flex; flex-direction: column; gap: 24px; transition: all 0.3s ease;
  opacity: ${props => props.$isRevoked ? 0.5 : 1}; width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  
  &:hover { background: rgba(255, 255, 255, 0.03); border-color: rgba(255,255,255,0.15); opacity: 1; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.25);}
  
  @media (min-width: 900px) { flex-direction: row; align-items: center; justify-content: space-between; }
  @media (max-width: 768px) { padding: 20px; gap: 20px; border-radius: 16px; }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 24px; height: 24px; cursor: pointer; accent-color: var(--accent); flex-shrink: 0; margin-top: 2px;
`;

const InternInfo = styled.div`
  flex: 1; display: flex; align-items: flex-start; gap: 16px; width: 100%; min-width: 0;
  
  .content { flex: 1; min-width: 0; word-break: break-word; }
  h4 { margin: 0 0 6px 0; font-size: 1.3rem; color: white; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;}
  p { margin: 0 0 12px 0; color: #94a3b8; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cert-id { font-family: 'Space Mono', monospace; color: var(--accent); font-size: 0.85rem; margin-top: 14px; word-break: break-all; background: var(--accent-alpha); display: inline-block; padding: 4px 10px; border-radius: 6px; }
  .skills-container { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .skill-badge { background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 50px; font-size: 0.75rem; color: #e2e8f0; border: 1px solid rgba(255,255,255,0.08); letter-spacing: 0.5px; }

  @media (max-width: 768px) { h4 { font-size: 1.15rem; } p { font-size: 0.85rem; } }
`;

const StatusBadge = styled.span`
  font-size: 0.7rem; padding: 6px 12px; border-radius: 50px; font-weight: 800; text-transform: uppercase; white-space: nowrap; letter-spacing: 1px;
  background: ${props => props.$valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; 
  color: ${props => props.$valid ? '#34d399' : '#f87171'}; 
  border: 1px solid ${props => props.$valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  animation: ${props => props.$valid ? pulseGlowValid : 'none'} 2s infinite;
`;

const QRContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 10px; flex-shrink: 0;
  background: rgba(0,0,0,0.3); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);

  .qr-box { background: white; padding: 8px; border-radius: 10px; }
  .qr-box canvas { width: 75px !important; height: 75px !important; } 
  
  .qr-download { 
    background: transparent; border: none; color: var(--accent); cursor: pointer; 
    font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; padding: 4px; letter-spacing: 0.5px; transition: all 0.2s;
    &:hover { color: white; transform: translateY(-1px); }
  }

  @media (min-width: 900px) { .qr-box canvas { width: 85px !important; height: 85px !important; } }
`;

const CardActions = styled.div`
  display: flex; align-items: center; gap: 20px; width: 100%;
  @media (min-width: 900px) { width: auto; }
  @media (max-width: 600px) { flex-direction: row-reverse; justify-content: space-between; align-items: flex-start; gap: 15px; }
`;

const ActionGroup = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px; flex: 1;
  @media (min-width: 900px) { display: grid; grid-template-columns: repeat(2, 1fr); width: 280px; flex: none; }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); color: white; 
  padding: 10px 12px; border-radius: 10px; display: flex; align-items: center; justify-content: center; 
  gap: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-weight: 600;
  flex: 1 1 calc(50% - 10px); 
  
  &:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-1px); }
  &.danger { color: #fca5a5; }
  &.danger:hover { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4); }
  &.success { color: #6ee7b7; }
  &.success:hover { background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); }
  &.primary { background: var(--accent-alpha); border-color: var(--accent); color: white; }
  &.primary:hover { background: var(--accent); }
  
  @media (min-width: 900px) { padding: 12px; font-size: 0.9rem; }
`;

const SmallLinkBtn = styled.button`
  background: transparent; border: none; color: var(--accent); cursor: pointer; font-size: 0.8rem; font-weight: 700; padding: 0 6px; letter-spacing: 0.5px; transition: all 0.2s;
  &:hover { color: white; text-shadow: 0 0 10px var(--accent-alpha); }
`;

const Pagination = styled.div`
  display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 40px; flex-wrap: wrap; width: 100%;
  button { padding: 12px 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.2s; flex: 1 1 auto; max-width: 150px; }
  button:hover:not(:disabled) { background: var(--accent); border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 5px 15px var(--accent-alpha); }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  span { font-size: 0.95rem; color: #94a3b8; font-weight: 600; white-space: nowrap; }
`;

// THEMES CONFIGURATION
const THEMES = {
  purple: { main: '#8b5cf6', hover: '#7c3aed', alpha: 'rgba(139, 92, 246, 0.2)' },
  blue: { main: '#3b82f6', hover: '#2563eb', alpha: 'rgba(59, 130, 246, 0.2)' },
  emerald: { main: '#10b981', hover: '#059669', alpha: 'rgba(16, 185, 129, 0.2)' },
  rose: { main: '#f43f5e', hover: '#e11d48', alpha: 'rgba(244, 63, 94, 0.2)' },
  orange: { main: '#f97316', hover: '#ea580c', alpha: 'rgba(249, 115, 22, 0.2)' }
};

const CertificateAdmin = () => {
  const BASE_DOMAIN = "https://trovia.in"; 
  
  // App States
  const [viewMode, setViewMode] = useState('generate');
  const [internsList, setInternsList] = useState([]);
  const [fetchingList, setFetchingList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); 
  const [activeTheme, setActiveTheme] = useState('purple');

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); 

  // Pagination & Bulk Actions
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const ITEMS_PER_PAGE = 10;

  const generateId = () => `TRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const getToday = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const initialFormState = { certificateId: generateId(), internName: '', role: '', startDate: '', endDate: '', issueDate: getToday(), skills: '' };
  const [formData, setFormData] = useState(initialFormState);

  // Load Draft from LocalStorage
  useEffect(() => {
    const draft = localStorage.getItem('trovia_cert_draft');
    if (draft && viewMode === 'generate') setFormData(JSON.parse(draft));
  }, [viewMode]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchInterns = async () => {
    setFetchingList(true);
    try {
      const querySnapshot = await getDocs(collection(db, "certificates"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setInternsList(data);
    } catch (error) { 
      showToast('error', "Failed to fetch API data.");
    } finally { setFetchingList(false); }
  };

  useEffect(() => { if (viewMode === 'list') { fetchInterns(); setSelectedIds([]); } }, [viewMode]);

  const handleChange = (e) => {
    const newForm = { ...formData, [e.target.name]: e.target.value };
    setFormData(newForm);
    if (viewMode === 'generate') localStorage.setItem('trovia_cert_draft', JSON.stringify(newForm));
  };

  const autoFillDuration = (months) => {
    const startStr = formData.startDate || getToday();
    const start = new Date(startStr.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")); 
    if (isNaN(start)) return showToast('error', 'Please enter a valid Start Date first.');
    const end = new Date(start);
    end.setMonth(start.getMonth() + months);
    const formatDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    handleChange({ target: { name: 'startDate', value: formatDate(start) }});
    handleChange({ target: { name: 'endDate', value: formatDate(end) }});
  };

  const validateForm = () => {
    if (!formData.internName.trim() || !formData.role.trim()) return "Name and Role are required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return showToast('error', errorMsg);

    setLoading(true); setToast(null);
    try {
      const skillsArray = typeof formData.skills === 'string' 
        ? formData.skills.split(',').map(s => s.trim()).filter(s => s !== "")
        : formData.skills;

      const finalData = { ...formData, skills: skillsArray, status: viewMode === 'edit' ? formData.status : 'valid' };
      
      await setDoc(doc(db, "certificates", formData.certificateId), finalData);
      showToast('success', viewMode === 'edit' ? `Updated record successfully!` : `Success! Record generated.`);
      
      localStorage.removeItem('trovia_cert_draft'); 

      if (viewMode === 'edit') setViewMode('list');
      else setFormData({ ...initialFormState, certificateId: generateId() });
      
    } catch (error) { showToast('error', "Database error. Failed to save."); } 
    finally { setLoading(false); }
  };

  const updateStatus = async (certId, newStatus) => {
    try { await updateDoc(doc(db, "certificates", certId), { status: newStatus }); fetchInterns(); showToast('success', `Status changed to ${newStatus}.`); } 
    catch (e) { showToast('error', "Update failed."); }
  };

  const handleDelete = async (certId) => {
    if (window.confirm("DANGER: Permanently delete this record? This cannot be undone.")) {
      try { await deleteDoc(doc(db, "certificates", certId)); fetchInterns(); showToast('success', 'Record deleted permanently.'); } 
      catch (e) { showToast('error', "Failed to delete."); }
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Change status of ${selectedIds.length} records to ${newStatus}?`)) {
      try {
        const batch = writeBatch(db);
        selectedIds.forEach(id => batch.update(doc(db, "certificates", id), { status: newStatus }));
        await batch.commit();
        fetchInterns(); setSelectedIds([]);
        showToast('success', `Bulk update successful.`);
      } catch (e) { showToast('error', 'Bulk update failed.'); }
    }
  };

  const handleClone = (intern) => {
    const clonedData = { ...intern, certificateId: generateId(), issueDate: getToday(), skills: intern.skills.join(', ') };
    setFormData(clonedData); setViewMode('generate');
    showToast('success', 'Data copied. Ready to generate new ID.');
  };

  const copyLink = (certId) => { navigator.clipboard.writeText(`${BASE_DOMAIN}/verify/${certId}`); showToast('success', "Link copied to clipboard!"); };
  const openLink = (certId) => window.open(`${BASE_DOMAIN}/verify/${certId}`, "_blank");

  // Feature: Download QR Code as Image
  const downloadQR = (certId, internName) => {
    const canvas = document.getElementById(`qr-${certId}`);
    if (!canvas) return showToast('error', 'QR Code not found.');
    
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${internName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast('success', 'QR Code downloaded!');
  };

  // Feature: Export to CSV
  const exportToCSV = () => {
    if (internsList.length === 0) return showToast('warn', 'No data to export.');
    const headers = ["Certificate ID", "Intern Name", "Role", "Start Date", "End Date", "Issue Date", "Status", "Skills"];
    const csvRows = [
      headers.join(","),
      ...internsList.map(i => [
        i.certificateId, `"${i.internName}"`, `"${i.role}"`, i.startDate, i.endDate, i.issueDate, i.status, `"${i.skills.join(', ')}"`
      ].join(","))
    ];
    
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Certificates_Export_${getToday().replace(/\s/g, '_')}.csv`);
    a.click();
    showToast('success', 'Database exported to CSV.');
  };

  // Filtering and Sorting Logic
  let processedInterns = internsList.filter(intern => {
    const matchesSearch = intern.internName.toLowerCase().includes(searchTerm.toLowerCase()) || intern.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (sortBy === 'newest') processedInterns.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  if (sortBy === 'oldest') processedInterns.sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
  if (sortBy === 'az') processedInterns.sort((a, b) => a.internName.localeCompare(b.internName));
  if (sortBy === 'za') processedInterns.sort((a, b) => b.internName.localeCompare(a.internName));

  const totalPages = Math.ceil(processedInterns.length / ITEMS_PER_PAGE);
  const paginatedInterns = processedInterns.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = { total: internsList.length, valid: internsList.filter(i => i.status === 'valid').length, revoked: internsList.filter(i => i.status === 'revoked').length };

  return (
    <AdminContainer $theme={THEMES[activeTheme]}>
      <GlobalStyle />
      {/* Sleek Floating Header */}
      <FloatingHeader className="no-print">
        <TabGroup>
          <TabButton $active={viewMode === 'generate'} onClick={() => setViewMode('generate')}><FiPlus /> Generate</TabButton>
          <TabButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}><FiList /> Directory</TabButton>
          {viewMode === 'edit' && <TabButton $active={true}><FiEdit2 /> Editing</TabButton>}
        </TabGroup>
        
        <ControlsGroup>
          {viewMode === 'list' && (
             <ActionButton className="primary" onClick={exportToCSV} style={{ padding: '10px 16px', border: 'none', borderRadius: '50px', background: 'white', color: '#0f172a' }} title="Export to CSV">
               <FiFileText/> Export Data
             </ActionButton>
          )}
          <ThemePicker>
            <FiSettings color="#94a3b8" style={{marginRight: '4px'}}/>
            {Object.keys(THEMES).map(theme => (
              <div key={theme} className={`dot ${activeTheme === theme ? 'active' : ''}`} style={{background: THEMES[theme].main}} onClick={() => setActiveTheme(theme)} title={`Switch theme`} />
            ))}
          </ThemePicker>
        </ControlsGroup>
      </FloatingHeader>

      <FormCard className="form-card">
        {viewMode === 'generate' || viewMode === 'edit' ? (
          <>
            <TitleHeader className="no-print">
              <div>
                <Title>{viewMode === 'edit' ? <FiEdit2 /> : <FiAward />} {viewMode === 'edit' ? 'Update Details' : 'Generate Certificate'}</Title>
                <Subtitle>Secure, verifiable credentials. Form inputs are auto-saved as drafts.</Subtitle>
              </div>
            </TitleHeader>
            
            <FormGrid onSubmit={handleSubmit} className="no-print">
              <FormGroup><Label>Certificate ID</Label><Input type="text" name="certificateId" value={formData.certificateId} disabled={viewMode === 'edit'} onChange={handleChange} required $mono /></FormGroup>
              <FormGroup><Label>Date of Issue</Label><Input type="text" name="issueDate" value={formData.issueDate} onChange={handleChange} required /></FormGroup>
              
              <FormGroup $fullWidth><Label>Intern Full Name</Label><Input type="text" name="internName" value={formData.internName} onChange={handleChange} required placeholder="e.g., Jane Doe" /></FormGroup>
              <FormGroup $fullWidth><Label>Internship Role / Title</Label><Input type="text" name="role" value={formData.role} onChange={handleChange} required placeholder="e.g., Software Engineering Intern" /></FormGroup>
              
              <FormGroup>
                <Label>Start Date <SmallLinkBtn type="button" onClick={() => handleChange({target:{name:'startDate', value: getToday()}})}>Set Today</SmallLinkBtn></Label>
                <Input type="text" name="startDate" value={formData.startDate} onChange={handleChange} required placeholder="DD Mmm YYYY" />
              </FormGroup>
              <FormGroup>
                <Label>End Date 
                  <span style={{display:'flex', gap:'5px'}}>
                    <SmallLinkBtn type="button" onClick={() => autoFillDuration(3)}>+3mo</SmallLinkBtn>
                    <SmallLinkBtn type="button" onClick={() => autoFillDuration(6)}>+6mo</SmallLinkBtn>
                  </span>
                </Label>
                <Input type="text" name="endDate" value={formData.endDate} onChange={handleChange} required placeholder="DD Mmm YYYY" />
              </FormGroup>
              
              <FormGroup $fullWidth><Label>Verified Skills (Comma Separated)</Label><Input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="React, Node.js, System Design" /></FormGroup>
              
              {toast && <Toast $type={toast.type}>{toast.type === 'error' ? <FiXCircle/> : <FiCheckCircle/>}{toast.text}</Toast>}
              
              <SubmitButton type="submit" disabled={loading} $isEdit={viewMode === 'edit'}>
                {loading ? <FiRefreshCw className="spin" /> : <FiSave />} {viewMode === 'edit' ? 'Save Updates to Database' : 'Generate & Store Record'}
              </SubmitButton>
            </FormGrid>
          </>
        ) : (
          <>
            <TitleHeader className="no-print">
              <div>
                <Title><FiList /> Official Directory</Title>
                <Subtitle>Manage records, verify details, export data, and batch process.</Subtitle>
              </div>
              <ActionButton className="primary" onClick={() => window.print()} style={{ width: 'auto', flex: 'none', height: 'fit-content' }}><FiPrinter/> Print View</ActionButton>
            </TitleHeader>

            <StatsGrid className="no-print">
              <StatBox $color="var(--accent)"><p><FiList /> Total Issued</p><h3>{stats.total}</h3></StatBox>
              <StatBox $color="#34d399"><p><FiUserCheck /> Active & Valid</p><h3>{stats.valid}</h3></StatBox>
              <StatBox $color="#f87171"><p><FiXCircle /> Revoked</p><h3>{stats.revoked}</h3></StatBox>
            </StatsGrid>

            <Toolbar className="no-print">
              <div className="search-box">
                <FiSearch color="#94a3b8" style={{flexShrink: 0}} />
                <input type="text" placeholder="Search by Names or IDs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{border:'none', background:'transparent', width:'100%', outline:'none', color:'white', padding:'12px 10px'}} />
              </div>
              <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}>
                <option value="all">Status: All</option>
                <option value="valid">Status: Valid</option>
                <option value="revoked">Status: Revoked</option>
              </select>
              <select value={sortBy} onChange={(e) => {setSortBy(e.target.value); setCurrentPage(1);}}>
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="az">Sort: A-Z</option>
                <option value="za">Sort: Z-A</option>
              </select>
            </Toolbar>

            {/* Bulk Actions Panel */}
            {selectedIds.length > 0 && (
              <div className="no-print" style={{background: 'rgba(255,255,255,0.05)', padding: '16px 20px', borderRadius: '16px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', border: '1px solid var(--accent)', width: '100%', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'}}>
                <span style={{fontWeight: 800, color: 'var(--accent)', fontSize:'1.1rem'}}>{selectedIds.length} Selected</span>
                <ActionButton className="danger" onClick={() => handleBulkStatusChange('revoked')} style={{ flex: 'none', width: 'auto' }}><FiSlash/> Bulk Revoke</ActionButton>
                <ActionButton className="success" onClick={() => handleBulkStatusChange('valid')} style={{ flex: 'none', width: 'auto' }}><FiCheckCircle/> Bulk Restore</ActionButton>
              </div>
            )}

            {toast && <Toast $type={toast.type} style={{marginBottom: '20px'}}>{toast.text}</Toast>}

            {fetchingList ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}><FiRefreshCw className="spin" style={{ fontSize: '2.5rem', marginBottom: '15px' }} /><p>Syncing secure records...</p></div>
            ) : paginatedInterns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>No records match your criteria.</div>
            ) : (
              <InternList>
                {paginatedInterns.map((intern) => (
                  <InternCard key={intern.certificateId} $isRevoked={intern.status === 'revoked'} $selected={selectedIds.includes(intern.certificateId)}>
                    
                    <InternInfo>
                      <div className="no-print">
                        <Checkbox checked={selectedIds.includes(intern.certificateId)} onChange={() => {
                          setSelectedIds(prev => prev.includes(intern.certificateId) ? prev.filter(id => id !== intern.certificateId) : [...prev, intern.certificateId]);
                        }}/>
                      </div>
                      <div className="content">
                        <h4>{intern.internName} <StatusBadge $valid={intern.status === 'valid'}>{intern.status}</StatusBadge></h4>
                        <p><FiAward style={{color:'var(--accent)', flexShrink: 0}}/> {intern.role} &nbsp;•&nbsp; <FiCalendar style={{color:'var(--accent)', flexShrink: 0}}/> {intern.startDate} to {intern.endDate}</p>
                        <div className="skills-container">
                          {intern.skills.map(s => <span key={s} className="skill-badge">{s}</span>)}
                        </div>
                        <div className="cert-id">ID: {intern.certificateId}</div>
                      </div>
                    </InternInfo>

                    <CardActions className="no-print">
                      <QRContainer>
                        <div className="qr-box">
                          <QRCodeCanvas id={`qr-${intern.certificateId}`} value={`${BASE_DOMAIN}/verify/${intern.certificateId}`} size={85} level={"H"} includeMargin={false} />
                        </div>
                        <button className="qr-download" onClick={() => downloadQR(intern.certificateId, intern.internName)} title="Download PNG">
                          <FiDownload /> Save QR
                        </button>
                      </QRContainer>

                      <ActionGroup>
                        <ActionButton onClick={() => copyLink(intern.certificateId)} title="Copy URL"><FiCopy /> Link</ActionButton>
                        <ActionButton onClick={() => openLink(intern.certificateId)} title="View Portal"><FiExternalLink /> Open</ActionButton>
                        <ActionButton onClick={() => handleClone(intern)} title="Clone Data"><FiClone /> Clone</ActionButton>
                        <ActionButton onClick={() => {setFormData({...intern, skills: intern.skills.join(', ')}); setViewMode('edit');}}><FiEdit2 /> Edit</ActionButton>
                        
                        {intern.status === 'valid' ? (
                          <ActionButton className="danger" onClick={() => updateStatus(intern.certificateId, 'revoked')}><FiSlash /> Revoke</ActionButton>
                        ) : (
                          <ActionButton className="success" onClick={() => updateStatus(intern.certificateId, 'valid')}><FiCheckCircle /> Restore</ActionButton>
                        )}
                        {/* <ActionButton className="danger" onClick={() => handleDelete(intern.certificateId)}><FiTrash2 /> Delete</ActionButton> */}
                      </ActionGroup>
                    </CardActions>
                  </InternCard>
                ))}
              </InternList>
            )}

            {totalPages > 1 && (
              <Pagination className="no-print">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </Pagination>
            )}
          </>
        )}
      </FormCard>
    </AdminContainer>
  );
};

export default CertificateAdmin;