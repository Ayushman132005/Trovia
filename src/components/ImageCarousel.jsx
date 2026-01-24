import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { getValidImageUrl } from '../utils/images';

// --- ANIMATIONS ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- STYLED COMPONENTS ---

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a0a0a; /* Fallback color */
  touch-action: pan-y; /* Allows vertical scrolling while swiping horizontally */
`;

const ImageSlider = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  transform: translateX(-${props => props.currentIndex * 100}%);
  will-change: transform; /* Hardware acceleration */
`;

const CarouselImage = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  /* darker overlay ensures text on top is readable */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 20%, transparent 80%, rgba(0,0,0,0.4));
  }
`;

const ImagePlaceholder = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  gap: 1rem;
  
  svg {
    font-size: 3rem;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0; /* Hidden by default */
  transition: all 0.3s ease;
  z-index: 10;
  
  /* Show on hover of the container */
  ${CarouselContainer}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: white;
    color: black;
    transform: translateY(-50%) scale(1.1);
  }

  /* Hide arrows on mobile/tablet (use swipe instead) */
  @media (max-width: 768px) {
    display: none; 
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 20px;
`;

const NextButton = styled(NavigationButton)`
  right: 20px;
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
  pointer-events: none; /* Let clicks pass through around dots */
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  border: none;
  padding: 0;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: ${props => props.active ? '1' : '0.3'};
  transform: ${props => props.active ? 'scale(1.2)' : 'scale(1)'};
  
  &:hover {
    opacity: 1;
  }
`;

/**
 * Image Carousel Component
 */
const ImageCarousel = ({
  images = [],
  initialIndex = 0,
  autoplay = true,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  
  // Swipe State
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const validImages = useMemo(() => {
    return Array.isArray(images) 
      ? images.filter(img => img && typeof img === 'string')
      : [];
  }, [images]);

  const length = validImages.length;

  // --- NAVIGATION HANDLERS ---

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % length);
  }, [length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  // --- AUTOPLAY LOGIC ---

  useEffect(() => {
    if (autoplay && length > 1 && !isPaused) {
      const timer = setInterval(goToNext, interval);
      return () => clearInterval(timer);
    }
  }, [autoplay, length, isPaused, interval, goToNext]);

  // --- TOUCH / SWIPE LOGIC ---

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Threshold

    // If swipe distance is significant
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        goToNext(); // Swiped Left
      } else {
        goToPrev(); // Swiped Right
      }
    }
    
    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // --- RENDER ---

  if (length === 0) {
    return (
      <CarouselContainer>
        <ImagePlaceholder>
          <FiImage />
          <span>No images available</span>
        </ImagePlaceholder>
      </CarouselContainer>
    );
  }
  
  return (
    <CarouselContainer
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ImageSlider currentIndex={currentIndex}>
        {validImages.map((image, index) => (
          <CarouselImage 
            key={index} 
            src={getValidImageUrl(image)}
            role="img"
            aria-label={`Slide ${index + 1} of ${length}`}
          />
        ))}
      </ImageSlider>
      
      {length > 1 && (
        <>
          <PrevButton onClick={(e) => { e.stopPropagation(); goToPrev(); }} aria-label="Previous Image">
            <FiChevronLeft />
          </PrevButton>
          
          <NextButton onClick={(e) => { e.stopPropagation(); goToNext(); }} aria-label="Next Image">
            <FiChevronRight />
          </NextButton>
          
          <DotsContainer>
            {validImages.map((_, index) => (
              <Dot 
                key={index} 
                active={index === currentIndex} 
                onClick={(e) => { e.stopPropagation(); goToIndex(index); }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </DotsContainer>
        </>
      )}
    </CarouselContainer>
  );
};

export default ImageCarousel;