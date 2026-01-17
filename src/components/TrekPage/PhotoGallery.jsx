import React from "react";
import styled, { keyframes } from "styled-components";
import { FaRegImages, FaExpandArrowsAlt } from 'react-icons/fa';
import { getValidImageUrl } from "../../utils/images"; 

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const zoomIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
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
  /* Glowing Indigo Icon for Gallery */
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  
  /* Indigo Theme */
  background: rgba(99, 102, 241, 0.15); 
  color: #6366F1;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
  
  transition: all 0.3s ease;

  ${Section}:hover & {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(99, 102, 241, 0.25);
    border-color: #6366F1;
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

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
`;

const ExpandIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const GalleryImage = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  padding-bottom: 75%; /* 4:3 Aspect Ratio */
  
  /* Image Setting */
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  
  /* Shadow for depth */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    border-color: rgba(99, 102, 241, 0.4); /* Indigo border on hover */
    z-index: 2;
  }
  
  &:hover ${Overlay} {
    opacity: 1;
  }

  &:hover ${ExpandIcon} {
    transform: scale(1);
    background: rgba(99, 102, 241, 0.8);
  }
`;

// --- COMPONENT ---

const PhotoGallery = ({ images, onImageClick }) => {
  // Filter valid images only
  const validImages = images && Array.isArray(images) 
    ? images.filter(url => url && typeof url === 'string') 
    : [];

  if (validImages.length === 0) return null;

  return (
    <Section>
      <SectionHeader>
        <IconWrapper>
          <FaRegImages />
        </IconWrapper>
        <SectionTitle>
          Photo Gallery
        </SectionTitle>
      </SectionHeader>
      <SectionBody>
        <GalleryGrid>
          {validImages.map((img, idx) => (
            <GalleryImage 
              key={idx} 
              src={getValidImageUrl(img)} 
              onClick={() => onImageClick && onImageClick(idx)}
            >
              <Overlay>
                <ExpandIcon>
                  <FaExpandArrowsAlt />
                </ExpandIcon>
              </Overlay>
            </GalleryImage>
          ))}
        </GalleryGrid>
      </SectionBody>
    </Section>
  );
};

export default PhotoGallery;