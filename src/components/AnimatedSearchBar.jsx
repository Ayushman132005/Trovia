import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSearch } from 'react-icons/fi';

// Animations
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(128, 255, 219, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(128, 255, 219, 0.4);
  }
`;

const barAnimation = keyframes`
  0% {
    height: 5px;
  }
  50% {
    height: 15px;
  }
  100% {
    height: 5px;
  }
`;

// Styled Components
const SearchIconContainer = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: 1000;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const SearchIcon = styled(FiSearch)`
  font-size: 1.5rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const VoiceBars = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props.visible ? 0.8 : 0};
  transition: opacity 0.3s ease;
`;

const Bar = styled.div`
  width: 3px;
  background: white;
  border-radius: 3px;
  animation: ${barAnimation} 0.5s infinite ease;
  animation-delay: ${props => props.delay}s;
`;

// Main component
const AnimatedSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const toggleSearchDialog = () => {
    setIsOpen(!isOpen);
  };
  
  // Toggle animation when hovering over search icon
  const handleMouseEnter = () => {
    setIsAnimating(true);
  };
  
  const handleMouseLeave = () => {
    setIsAnimating(false);
  };
  
  return (
    <>
      <SearchIconContainer 
        onClick={toggleSearchDialog}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SearchIcon />
        <VoiceBars visible={isAnimating}>
          <Bar delay={0} />
          <Bar delay={0.1} />
          <Bar delay={0.2} />
          <Bar delay={0.3} />
          <Bar delay={0.2} />
        </VoiceBars>
      </SearchIconContainer>
    </>
  );
};

export default AnimatedSearchBar;
