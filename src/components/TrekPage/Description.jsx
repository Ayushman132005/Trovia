import React from "react";
import styled, { keyframes } from "styled-components";
import { FiInfo } from 'react-icons/fi';

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
  /* Glowing Sky Blue Icon for Information */
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  
  /* Sky Blue Theme */
  background: rgba(14, 165, 233, 0.15); 
  color: #38BDF8;
  border: 1px solid rgba(14, 165, 233, 0.3);
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.15);
  
  transition: all 0.3s ease;

  ${Section}:hover & {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(14, 165, 233, 0.25);
    border-color: #38BDF8;
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

const DescriptionText = styled.div`
  color: #cbd5e1; /* Soft gray-white for easier reading */
  font-size: 1.05rem;
  line-height: 1.8; /* Generous line height for editorial feel */
  font-weight: 400;
  
  p {
    margin-bottom: 1.25rem;
    text-align: left; /* Better for readability than justify on web */
  }
  
  p:last-child {
    margin-bottom: 0;
  }

  /* Optional: Add a subtle drop cap effect to the first letter */
  p:first-of-type::first-letter {
    float: left;
    font-size: 3rem;
    line-height: 0.8;
    margin-right: 0.75rem;
    color: #38BDF8;
    font-weight: 700;
  }
`;

// --- COMPONENT ---

const Description = ({ description }) => {
  // If no description, render nothing
  if (!description) return null;

  return (
    <Section>
      <SectionHeader>
        <IconWrapper>
          <FiInfo />
        </IconWrapper>
        <SectionTitle>
          Detailed Description
        </SectionTitle>
      </SectionHeader>
      <SectionBody>
        <DescriptionText>
          {description.split('\n').map((paragraph, idx) => (
            paragraph.trim() && <p key={idx}>{paragraph}</p>
          ))}
        </DescriptionText>
      </SectionBody>
    </Section>
  );
};

export default Description;