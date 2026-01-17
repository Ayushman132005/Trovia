import React from "react";
import styled, { keyframes } from "styled-components";
import { FiStar } from 'react-icons/fi';
import ReviewsList from "../Reviews"; 

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
  /* Glowing Amber Icon for Reviews */
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  
  /* Amber Theme */
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

// --- COMPONENT ---

const ReviewsSection = ({ trekId }) => {
  return (
    <Section>
      <SectionHeader>
        <IconWrapper>
          <FiStar />
        </IconWrapper>
        <SectionTitle>
          Reviews
        </SectionTitle>
      </SectionHeader>
      <SectionBody>
        {/* Using the Firebase-backed Reviews component */}
        <ReviewsList trekId={String(trekId)} />
      </SectionBody>
    </Section>
  );
};

export default ReviewsSection;