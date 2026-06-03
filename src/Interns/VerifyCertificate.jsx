import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { 
  FiCheckCircle, FiXCircle, FiAward, FiCalendar, FiArrowLeft, 
  FiShield, FiLock, FiDownload 
} from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import certificateTemplate from '../assets/images/blank-certificate.png';

/* --- FONTS & GLOBAL STYLES --- */
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

/* --- ANIMATIONS --- */
const fadeUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const pulseGlow = keyframes`0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }`;
const ambientDrift = keyframes`0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }`;

/* --- STYLED COMPONENTS --- */
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #030305;
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.08), transparent 25%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;

  @media (max-width: 768px) { padding: 20px 15px; }
`;

const NavBar = styled.nav`
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 100px;
  animation: ${fadeUp} 0.6s ease-out;

  @media (max-width: 600px) {
    flex-direction: column; gap: 15px; border-radius: 20px; padding: 15px;
  }
`;

const BackLink = styled(Link)`
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 50px;
  
  &:hover { color: white; background: rgba(255,255,255,0.05); transform: translateX(-3px); }
`;

const DownloadBtn = styled.button`
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  color: #0f172a;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  
  &:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2); 
    background: white;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  
  @media (max-width: 600px) { width: 100%; justify-content: center; padding: 14px; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 30px;
  width: 100%;
  max-width: 1100px;
  animation: ${fadeUp} 0.8s ease-out 0.1s both;

  @media (max-width: 968px) { grid-template-columns: 1fr; }
`;

/* --- PREMIUM CERTIFICATE CARD --- */
const CertPreviewCard = styled.div`
  background: linear-gradient(145deg, #0f111a 0%, #07080c 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
  padding: 70px 40px; 
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Subtle inner glow/texture */
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 100%;
    background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1), transparent 60%);
    pointer-events: none;
  }

  @media (max-width: 768px) { padding: 50px 20px; border-radius: 20px; }
`;

const CertHeader = styled.div`
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  
  svg { font-size: 2.5rem; color: #8b5cf6; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3)); }
`;

const InternName = styled.h1`
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 600;
  margin: 15px 0 25px 0;
  line-height: 1.1;
  font-size: clamp(2.5rem, 6vw, 4rem); 
  background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
`;

const CertRole = styled.p`
  font-size: 1.25rem;
  color: #94a3b8;
  font-weight: 400;
  margin-bottom: 40px;
  letter-spacing: 0.5px;
`;

/* --- QR CODE STYLES --- */
const QRContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* Space between the QR box and the text */
  margin-top: 10px;
`;

const QRBox = styled.div`
  background: white;
  padding: 8px; /* The white space between the QR code and the border */
  border: 1.5px solid #283553; /* The dark navy border color */
  border-radius: 8px; /* Slightly rounded corners */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QRText = styled.div`
  color: #283553; /* Matches the border color */
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
`;

/* --- BENTO BOX SIDEBAR --- */
const VerificationSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidePanel = styled.div`
  background: rgba(15, 17, 26, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const StatusBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

const StatusTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  background: ${props => props.$valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$valid ? '#34d399' : '#f87171'};
  border: 1px solid ${props => props.$valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  animation: ${props => props.$valid ? pulseGlow : 'none'} 2s infinite;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
  
  &:last-child { margin-bottom: 0; }
  
  .label { 
    color: #64748b; 
    font-size: 0.75rem; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 1px;
  }
  .value { 
    font-weight: 500; 
    color: #f8fafc; 
    font-size: 1rem; 
  }
  .mono {
    font-family: 'Space Mono', monospace;
    color: #8b5cf6;
    font-size: 0.9rem;
    background: rgba(139, 92, 246, 0.1);
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
    width: fit-content;
  }
`;

const SecurityPanel = styled(SidePanel)`
  background: linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.01) 100%);
  border-color: rgba(16, 185, 129, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Loader = styled.div`
  width: 40px; height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const blankCertificateBase64 = "";

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "certificates", certificateId));
        if (snap.exists()) setCertData(snap.data()); else setError(true);
      } catch { setError(true); } finally { setLoading(false); }
    };
    fetch();
  }, [certificateId]);

  const generatePDF = () => {
    // 1. Setup Document
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = 297; 
    const h = 210;

    // 2. Load the image from the public folder
    const img = new Image();
    
    img.crossOrigin = "Anonymous"; 
    
    // Feed the imported variable directly here, NOT a string!
    img.src = certificateTemplate; 
    
    img.onerror = () => {
      alert("Error: Still failing to load image. Check console for details.");
    };

    // 3. Wait for the image to load, THEN draw the PDF
    img.onload = () => {
      // Draw background
      doc.addImage(img, 'PNG', 0, 0, w, h);

      // Setup styling
      const darkNavy = '#0f172a';
      
      // Intern Name
      doc.setTextColor(darkNavy); 
      doc.setFont('times', 'bold'); 
      doc.setFontSize(50); 
      doc.text(certData.internName, w / 1.9, 85, { align: 'center' });

      // Role
      doc.setFont('helvetica', 'bold'); 
      doc.setFontSize(23); 
      doc.text(certData.role.toUpperCase(), w / 1.9, 118, { align: 'center' });

      // ID and Dates
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(certData.certificateId, 90, 167); 
      doc.setFont('helvetica', 'bold');
      doc.text(`${certData.startDate} - ${certData.endDate}`, 90, 187);

      // 1. Set the color of the line (using a hex code, e.g., slate gray)
      doc.setDrawColor('#778eaeff'); 

      // 2. Set the thickness of the line (in mm)
      doc.setLineWidth(0.3); 

      // 3. Draw the line: doc.line(startX, startY, endX, endY)
      // Because startX and endX are both 75, it draws straight down.
      doc.line(137, 151, 137, 187);
      
      // QR Code
      const qrCanvas = document.getElementById('cert-qr-code'); // Looks for the ID we added
      
      if (qrCanvas) {
        // x = (w/2)-15 centers it. y = 145 places it vertically. 30,30 is the width/height
        doc.addImage(qrCanvas.toDataURL('image/png'), 'PNG', (w / 1.8) - 13, 155, 25, 25);
        
        doc.setDrawColor('#283553'); // Dark navy
        doc.setLineWidth(0.5);
        doc.roundedRect((w / 1.8) - 15, 153, 29, 29, 2, 2, 'S');
        // Link under the QR code

        doc.setFontSize(9);
        doc.setTextColor('#536ba2ff');
        doc.setFont('helvetica', 'bold');
        doc.text("Scan to Verify", (w / 1.8)  , 188, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor('#1e3a8a'); 
        doc.text(`https://trovia.in/verify/${certData.certificateId}`, (w / 2) + 16  , 193, { align: 'center' });
      } else {
        console.warn("Could not find the QR code on the screen!");
      }

      // Save the file
      doc.save(`${certData.internName.replace(/\s+/g, '_')}_Certificate.pdf`);
    };
  };
  if (loading) return <PageContainer style={{justifyContent: 'center'}}><GlobalFonts /><Loader /></PageContainer>;
  
  if (error) return (
    <PageContainer style={{justifyContent: 'center'}}>
      <GlobalFonts />
      <div style={{textAlign: 'center', animation: `${fadeUp} 0.5s ease-out`}}>
        <FiXCircle style={{fontSize: '4rem', color: '#ef4444', marginBottom: '20px'}}/>
        <h2>Record Not Found</h2>
        <p style={{color: '#94a3b8', marginTop: '10px', marginBottom: '30px'}}>This certificate ID does not exist in our database.</p>
        <BackLink to="/" style={{justifyContent: 'center', background: 'rgba(255,255,255,0.1)'}}>Return to Portal</BackLink>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <GlobalFonts />
      
      <NavBar>
        <BackLink to="/"><FiArrowLeft /> Back to Portal</BackLink>
        <DownloadBtn onClick={generatePDF}><FiDownload /> Download Certificate</DownloadBtn>
      </NavBar>

      <MainGrid>
        {/* Visual Certificate Representation */}
        <CertPreviewCard>
          <CertHeader>
            <FiAward />
            Certificate of Completion
          </CertHeader>
          
          <InternName>{certData.internName}</InternName>
          <CertRole>{certData.role}</CertRole>
          
         {/* Replace your old QRWrapper with this */}
          <QRContainer>
            <QRBox>
              <QRCodeCanvas 
                id="cert-qr-code"
                value={`https://trovia.in/verify/${certData.certificateId}`} 
                size={100} /* Slightly smaller to account for the new padding */
                bgColor="#ffffff" 
                fgColor="#000000" 
              />
            </QRBox>
            <QRText>Scan to Verify</QRText>
          </QRContainer>
        </CertPreviewCard>

        {/* Data & Verification Panel */}
        <VerificationSidebar>
          <SidePanel>
            <StatusBadgeContainer>
              <span style={{color: 'white', fontWeight: 600, fontSize: '1.1rem'}}>Status</span>
              <StatusTag $valid={certData.status === 'valid'}>
                {certData.status === 'valid' ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />} 
                {certData.status === 'valid' ? 'OFFICIAL & VALID' : 'REVOKED'}
              </StatusTag>
            </StatusBadgeContainer>
            
            <DetailRow>
              <span className="label">Issued To</span>
              <span className="value">{certData.internName}</span>
            </DetailRow>
            <DetailRow>
              <span className="label">Designation</span>
              <span className="value">{certData.role}</span>
            </DetailRow>
            <DetailRow>
              <span className="label">Tenure Duration</span>
              <span className="value">{certData.startDate} — {certData.endDate}</span>
            </DetailRow>
            <DetailRow>
              <span className="label">Unique Credential ID</span>
              <span className="mono">{certData.certificateId}</span>
            </DetailRow>
          </SidePanel>

          <SecurityPanel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
              <FiShield size={20} /> BLOCKCHAIN / CRYPTOGRAPHIC SECURED
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
              This record is directly fetched from the official Trovia secure database. Any modification or tampering to the physical or digital document renders this verification link invalid.
            </p>
          </SecurityPanel>
        </VerificationSidebar>
      </MainGrid>
    </PageContainer>
  );
};

export default VerifyCertificate;