import React from "react";
import styled, { keyframes, css } from "styled-components";
import { FaMountain, FaMedal, FaUserCheck, FaEnvelope, FaStar, FaLeaf, FaFirstAid } from "react-icons/fa";

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---

const Section = styled.section`
  /* Premium Glass Aesthetic */
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  position: relative;
  
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeInUp} 0.6s ease-out forwards;

  &:hover {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(74, 222, 128, 0.3); /* Green Hint */
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  
  /* Emerald/Green Theme for Trust */
  background: rgba(74, 222, 128, 0.15); 
  color: #4ADE80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.15);
`;

const SectionTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -0.01em;
`;

const ContactBtn = styled.button`
  background: rgba(74, 222, 128, 0.1);
  color: #4ADE80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  padding: 0.6rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
  }
`;

const SectionBody = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

/* --- PROFILE HEADER --- */
const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.4rem;
  
  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const Name = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

const VerifiedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(59, 130, 246, 0.2);
  color: #60A5FA;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

const RoleText = styled.div`
  color: #94a3b8;
  font-size: 0.95rem;
`;

/* --- STATS GRID --- */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -0.5rem;
    top: 20%;
    height: 60%;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  svg { font-size: 1rem; color: #FBBF24; } /* Gold Star */
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* --- DESCRIPTION & BADGES --- */
const DescriptionText = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const BadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  svg { color: #4ADE80; }
`;

// --- COMPONENT ---

const MeetOrganizer = ({ 
  organizerId, 
  organizerName, 
  trekCount, 
  organizerVerified, 
  organizerDescription, 
  organizerExperience 
}) => {
  if (!organizerId || !organizerName) return null;

  // Get Initials for Avatar
  const initials = organizerName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleMessage = () => {
    // Placeholder for messaging logic
    alert(`Starting chat with ${organizerName}...`);
  };

  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <IconWrapper>
            <FaMountain />
          </IconWrapper>
          <SectionTitle>Lead Organizer</SectionTitle>
        </HeaderLeft>
        
        <ContactBtn onClick={handleMessage}>
          <FaEnvelope /> Message
        </ContactBtn>
      </SectionHeader>
      
      <SectionBody>
        <ProfileRow>
          <Avatar>{initials}</Avatar>
          <ProfileInfo>
            <NameRow>
              <Name>{organizerName}</Name>
              {organizerVerified && (
                <VerifiedBadge>
                  <FaUserCheck /> Verified
                </VerifiedBadge>
              )}
            </NameRow>
            <RoleText>Certified Trekking Partner • Since 2021</RoleText>
          </ProfileInfo>
        </ProfileRow>

        <StatsGrid>
          <StatItem>
            <StatValue>{trekCount || 1}</StatValue>
            <StatLabel>Treks Led</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{organizerExperience || '2+ Yrs'}</StatValue>
            <StatLabel>Experience</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>
              4.9 <FaStar />
            </StatValue>
            <StatLabel>Rating</StatLabel>
          </StatItem>
        </StatsGrid>

        <DescriptionText>
          {organizerDescription || 
           `${organizerName} is an experienced trek leader passionate about mountain ecology and sustainable tourism. With extensive knowledge of the local terrain, they ensure every trek is safe, educational, and memorable.`}
        </DescriptionText>

        <BadgesRow>
          <TrustBadge>
            <FaMedal /> Gov. Registered
          </TrustBadge>
          <TrustBadge>
            <FaFirstAid /> First Aid Certified
          </TrustBadge>
          <TrustBadge>
            <FaLeaf /> Eco-Friendly
          </TrustBadge>
        </BadgesRow>
      </SectionBody>
    </Section>
  );
};

export default MeetOrganizer;