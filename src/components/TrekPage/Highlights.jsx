import React from "react";
import styled, { keyframes } from "styled-components";
import { FiStar } from 'react-icons/fi';

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---

const Section = styled.section`
  /* Modern Dark Glass Aesthetic */
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeInUp} 0.6s ease-out forwards;

  &:hover {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled.div`
  padding: 1.75rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const IconWrapper = styled.div`
  /* Glowing Gold Icon for Highlights/Stars */
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  
  /* Amber/Gold Theme */
  background: rgba(245, 158, 11, 0.15); 
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
  
  transition: all 0.3s ease;

  ${Section}:hover & {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.25);
    border-color: #F59E0B;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
  
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.35rem;
  }
`;

const SectionBody = styled.div`
  padding: 2.5rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HighlightGrid = styled.ul`
  padding: 0;
  margin: 0;
  display: grid;
  /* Responsive Grid: 1 col on mobile, 2 cols on tablet+ */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const HighlightItem = styled.li`
  list-style: none;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  
  /* Individual Glass Cards */
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(245, 158, 11, 0.3); /* Subtle Gold border on hover */
    transform: translateX(4px);
  }
`;

const BulletIcon = styled.span`
  margin-top: 2px;
  color: #F59E0B; /* Gold Bullet */
  font-size: 1.1rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.4));
`;

const HighlightText = styled.span`
  font-size: 1rem;
  color: #cbd5e1; /* Soft white */
  line-height: 1.5;
  font-weight: 400;
`;

// --- COMPONENT ---

const Highlights = ({ highlights }) => {
  // Guard clause if highlights don't exist
  if (!highlights || highlights.length === 0) return null;

  return (
    <Section>
      <SectionHeader>
        <IconWrapper>
          <FiStar />
        </IconWrapper>
        <SectionTitle>
          Highlights
        </SectionTitle>
      </SectionHeader>
      <SectionBody>
        <HighlightGrid>
          {highlights.map((highlight, idx) => (
            <HighlightItem key={idx}>
              <BulletIcon>
                <FiStar />
              </BulletIcon>
              <HighlightText>{highlight}</HighlightText>
            </HighlightItem>
          ))}
        </HighlightGrid>
      </SectionBody>
    </Section>
  );
};

export default Highlights;