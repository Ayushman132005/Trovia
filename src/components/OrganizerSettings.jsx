import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { 
  FiArrowLeft, 
  FiUser, 
  FiLock, 
  FiBell, 
  FiGlobe, 
  FiSave,
  FiLogOut
} from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #111827 0%, #0F172A 100%);
  color: #ffffff;
  padding: 80px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.2); }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(135deg, #7DD8F8 0%, #4CC9F0 50%, #4361EE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SettingsSection = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 { margin: 0; font-size: 1.2rem; color: #e2e8f0; }
  svg { color: #4CC9F0; font-size: 1.2rem; }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #94a3b8;
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CC9F0;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.2)' : '#4361EE'};
  color: ${props => props.$danger ? '#F87171' : 'white'};
  border: ${props => props.$danger ? '1px solid rgba(239, 68, 68, 0.5)' : 'none'};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.3)' : '#3A0CA3'};
    transform: translateY(-2px);
  }
`;

const Message = styled.div`
  padding: 15px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.2);
  color: #34D399;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrganizerSettings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch additional data from Firestore
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            displayName: data.displayName || '',
            email: currentUser.email || '',
            phone: data.organizationDetails?.phone || '',
            website: data.organizationDetails?.website || ''
          });
        }
      } else {
        navigate('/organizer-trek-login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        'organizationDetails.phone': formData.phone,
        'organizationDetails.website': formData.website,
        updatedAt: new Date()
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update settings");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error(error);
      alert("Error sending password reset email");
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <BackButton to="/organizer-dashboard"><FiArrowLeft /></BackButton>
          <Title>Account Settings</Title>
        </Header>

        {message && <Message><FiSave /> {message}</Message>}

        <SettingsSection>
          <SectionHeader>
            <FiUser />
            <h2>Profile Details</h2>
          </SectionHeader>
          <FormGroup>
            <label>Organization / Display Name</label>
            <Input name="displayName" value={formData.displayName} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Email Address</label>
            <Input value={formData.email} disabled />
          </FormGroup>
          <FormGroup>
            <label>Contact Phone</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91..." />
          </FormGroup>
          <FormGroup>
            <label>Website URL</label>
            <Input name="website" value={formData.website} onChange={handleChange} placeholder="www.example.com" />
          </FormGroup>
          <Button onClick={handleSave}><FiSave /> Save Changes</Button>
        </SettingsSection>

        <SettingsSection>
          <SectionHeader>
            <FiLock />
            <h2>Security</h2>
          </SectionHeader>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            Need to change your password? We will send you an email link.
          </p>
          <Button onClick={handlePasswordReset}>Send Password Reset Link</Button>
        </SettingsSection>

        <SettingsSection>
          <SectionHeader>
             <FiLogOut />
             <h2>Sign Out</h2>
          </SectionHeader>
          <Button $danger onClick={() => { auth.signOut(); navigate('/'); }}>
            Log Out of Account
          </Button>
        </SettingsSection>

      </ContentWrapper>
    </PageContainer>
  );
};

export default OrganizerSettings;