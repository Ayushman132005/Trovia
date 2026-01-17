import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FiCheck, FiX, FiDownload, FiLayers, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

// --- STYLED COMPONENTS ---

const Section = styled.section`
  position: relative;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  transition: all 0.4s ease;
  animation: ${fadeInUp} 0.6s ease-out forwards;

  &:hover {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

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
  /* Emerald Theme */
  background: rgba(16, 185, 129, 0.15); 
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
`;

const SectionTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -0.01em;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`;

const DownloadBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border-color: rgba(16, 185, 129, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const SectionBody = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
`;

/* --- TAB SYSTEM --- */
const TabContainer = styled.div`
  display: flex;
  padding: 1rem 2rem 0 2rem;
  gap: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 600px) {
    padding: 1rem 1.5rem 0;
    gap: 1rem;
    overflow-x: auto;
  }
`;

const TabButton = styled.button`
  background: transparent;
  border: none;
  padding-bottom: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.active ? '#fff' : '#94a3b8'};
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? props.color : 'transparent'};
    transition: background 0.3s;
    box-shadow: ${props => props.active ? `0 -2px 10px ${props.color}` : 'none'};
  }

  &:hover {
    color: #e2e8f0;
  }
`;

/* --- CONTENT GRID --- */
const ContentArea = styled.div`
  padding: 2rem;
  min-height: 300px;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
  /* Dynamic Styling based on Include/Exclude */
  background: ${props => props.type === 'inc' 
    ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(6, 78, 59, 0.2))' 
    : 'linear-gradient(145deg, rgba(244, 63, 94, 0.05), rgba(136, 19, 55, 0.1))'};
    
  border: 1px solid ${props => props.type === 'inc' 
    ? 'rgba(16, 185, 129, 0.15)' 
    : 'rgba(244, 63, 94, 0.15)'};

  &:hover {
    transform: translateY(-3px);
    border-color: ${props => props.type === 'inc' ? '#10B981' : '#F43F5E'};
    box-shadow: 0 10px 30px -10px ${props => props.type === 'inc' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'};
  }
`;

const ItemIcon = styled.div`
  margin-top: 2px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.9rem;
  
  background: ${props => props.type === 'inc' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'};
  color: ${props => props.type === 'inc' ? '#34D399' : '#FB7185'};
  border: 1px solid ${props => props.type === 'inc' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'};
`;

const ItemText = styled.div`
  font-size: 0.95rem;
  color: #e2e8f0;
  line-height: 1.5;
  font-weight: 400;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  padding: 3rem;
  font-style: italic;
`;

// --- COMPONENT ---

const IncludedExcluded = ({ included, excluded }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'included', 'excluded'

  // Guard clause
  if ((!included || included.length === 0) && (!excluded || excluded.length === 0)) return null;

  // Logic to filter content based on tab
  const showIncluded = activeTab === 'all' || activeTab === 'included';
  const showExcluded = activeTab === 'all' || activeTab === 'excluded';

  // Handle Download (Mock functionality creating a text file)
  const handleDownload = () => {
    const incText = included ? included.map(i => `+ ${i}`).join('\n') : '';
    const excText = excluded ? excluded.map(e => `- ${e}`).join('\n') : '';
    const fileContent = `PACKAGE DETAILS\n\nWHAT'S INCLUDED:\n${incText}\n\nWHAT'S NOT INCLUDED:\n${excText}`;
    
    const element = document.createElement("a");
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Trek_Package_Details.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <IconWrapper>
            <FiLayers />
          </IconWrapper>
          <SectionTitle>Package Transparency</SectionTitle>
        </HeaderLeft>
        
        <HeaderControls>
          <DownloadBtn onClick={handleDownload}>
            <FiDownload /> Save List
          </DownloadBtn>
        </HeaderControls>
      </SectionHeader>

      <SectionBody>
        <TabContainer>
          <TabButton 
            active={activeTab === 'all'} 
            color="#38BDF8"
            onClick={() => setActiveTab('all')}
          >
            Full View
          </TabButton>
          <TabButton 
            active={activeTab === 'included'} 
            color="#10B981"
            onClick={() => setActiveTab('included')}
          >
            What's Included ({included?.length || 0})
          </TabButton>
          <TabButton 
            active={activeTab === 'excluded'} 
            color="#F43F5E"
            onClick={() => setActiveTab('excluded')}
          >
            Exclusions ({excluded?.length || 0})
          </TabButton>
        </TabContainer>

        <ContentArea>
          <Grid>
            {/* INCLUDED ITEMS */}
            {showIncluded && included?.map((item, idx) => (
              <ItemCard key={`inc-${idx}`} type="inc">
                <ItemIcon type="inc">
                  <FiCheck />
                </ItemIcon>
                <ItemText>{item}</ItemText>
              </ItemCard>
            ))}

            {/* EXCLUDED ITEMS */}
            {showExcluded && excluded?.map((item, idx) => (
              <ItemCard key={`ex-${idx}`} type="exc">
                <ItemIcon type="exc">
                  <FiX />
                </ItemIcon>
                <ItemText>{item}</ItemText>
              </ItemCard>
            ))}

            {/* Empty State */}
            {(!included?.length && !excluded?.length) && (
              <EmptyState>No details available for this package.</EmptyState>
            )}
          </Grid>
        </ContentArea>
      </SectionBody>
    </Section>
  );
};

export default IncludedExcluded;