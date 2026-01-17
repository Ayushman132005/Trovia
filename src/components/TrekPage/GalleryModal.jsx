import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- STYLED COMPONENTS ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 24px;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 32px;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
  
  /* Disable button visually if needed, though usually we loop */
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
`;

const PrevBtn = styled(NavBtn)`
  left: 20px;
  @media (max-width: 768px) { left: 10px; }
`;

const NextBtn = styled(NavBtn)`
  right: 20px;
  @media (max-width: 768px) { right: 10px; }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 90%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 95%;
    height: 70%;
  }
`;

const MainImage = styled.img`
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  
  /* State-based styling */
  opacity: ${props => props.active ? 1 : 0};
  transform: ${props => props.active ? 'scale(1)' : 'scale(0.9)'};
  pointer-events: ${props => props.active ? 'auto' : 'none'};
`;

const Counter = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  z-index: 10;

  @media (max-width: 768px) {
    bottom: 90px;
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const ThumbnailsStrip = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  max-width: 90%;
  overflow-x: auto;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  scrollbar-width: none;
  -ms-overflow-style: none;
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    max-width: 95%;
    padding: 8px;
  }
`;

const ThumbnailBtn = styled.button`
  background: none;
  border: 2px solid ${props => props.active ? '#4ECDC4' : 'transparent'};
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
  width: 60px;
  height: 60px;
  box-shadow: ${props => props.active ? '0 0 20px rgba(78, 205, 196, 0.5)' : 'none'};

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

// --- COMPONENT ---

const GalleryModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Filter valid images
  const validImages = images?.filter(url => url && typeof url === 'string') || [];

  // Update internal state when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Navigation Logic
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Keyboard Support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev]);

  // Touch/Swipe Logic
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  if (!isOpen || validImages.length === 0) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <CloseBtn onClick={onClose} aria-label="Close gallery">
          <FiX />
        </CloseBtn>
        
        {/* Navigation Buttons */}
        <PrevBtn onClick={goToPrev} aria-label="Previous image">
          <FiChevronLeft />
        </PrevBtn>
        
        <NextBtn onClick={goToNext} aria-label="Next image">
          <FiChevronRight />
        </NextBtn>
        
        {/* Main Image Area with Touch Support */}
        <ImageContainer
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {validImages.map((imageUrl, index) => (
            <MainImage
              key={index}
              src={imageUrl}
              alt={`Gallery Image ${index + 1}`}
              active={index === currentIndex}
            />
          ))}
        </ImageContainer>
        
        {/* Counter */}
        <Counter>
          {currentIndex + 1} / {validImages.length}
        </Counter>
        
        {/* Thumbnails */}
        <ThumbnailsStrip>
          {validImages.map((imageUrl, index) => (
            <ThumbnailBtn
              key={index}
              active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={imageUrl} alt={`Thumbnail ${index + 1}`} />
            </ThumbnailBtn>
          ))}
        </ThumbnailsStrip>
      </ModalContent>
    </ModalOverlay>
  );
};

export default GalleryModal;