import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FiSearch } from 'react-icons/fi';

// --- Animation keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10); }
  50% { box-shadow: 0 4px 32px 0 rgba(0,0,0,0.13); }
`;


// --- Styled components ---
const SearchTapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  min-height: 48px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
  padding: 0 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  ${css`animation: ${pulse} 2.5s infinite;`}
  position: relative;
  border: 1.5px solid #e6e6e6;
  z-index: 1;
  
  &:hover {
    box-shadow: 0 6px 32px 0 rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.02);
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;
const SearchIcon = styled(FiSearch)`
  font-size: 1.3rem;
  color: #2d3748;
  margin-right: 12px;
  flex-shrink: 0;
`;
const AnimatedTextBase = styled.span`
  font-size: 1.13rem;
  font-weight: 500;
  color: #2d3748;
  min-width: 180px;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;

  min-width: 180px; 
  
  @media (max-width: 350px) {
    min-width: auto; /* Let flexbox handle it on tiny screens */
    font-size: 1rem; /* Slightly smaller text */
  }
`;

const FadeInText = styled(AnimatedTextBase)`
  ${css`animation: ${fadeIn} 0.5s;`}
  opacity: 1;
`;

const FadeOutText = styled(AnimatedTextBase)`
  ${css`animation: ${fadeOut} 0.35s;`}
  opacity: 0;
`;
const ArrowIndicator = styled.span`
  margin-left: 14px;
  color: #b5b5b5;
  font-size: 1.2rem;
  user-select: none;
  @media (max-width: 480px) { display: none; }
`;

// --- Main component ---
const PHRASES = [
  'Explore Adventures',
  'Find Your Trek',
  'Search Destinations',
  'Discover Trails',
  'Plan Your Journey'
];

// Removed overlay component

const AnimatedSearchTapBar = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  // Phrase animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIdx((idx) => (idx + 1) % PHRASES.length);
        setFade(true);
      }, 350);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const toggleSearchDialog = () => {
    // Navigate directly to search results page instead of opening dialog
    navigate('/search-results');
  };
  
  // --- Render ---
  return (
    <>
      <SearchTapContainer
        onClick={toggleSearchDialog}
        aria-label="Open Search"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSearchDialog(); }}
      >        <SearchIcon />
        {fade ? (
          <FadeInText>{PHRASES[phraseIdx]}</FadeInText>
        ) : (
          <FadeOutText>{PHRASES[phraseIdx]}</FadeOutText>
        )}
        <ArrowIndicator>→</ArrowIndicator>      </SearchTapContainer>    </>
  );
};

export default AnimatedSearchTapBar;