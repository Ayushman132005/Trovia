import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { FiClock, FiUsers, FiStar, FiRefreshCw, FiInfo } from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// --- STYLED COMPONENTS ---

const StatsContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 992px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

/* Decorative Background Icon that moves on hover */
const BgIcon = styled.div`
  position: absolute;
  right: -15px;
  bottom: -25px;
  font-size: 6.5rem;
  color: #fff;
  opacity: 0.03;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 0;
  transform: rotate(0deg);
`;

const BentoCard = styled.div`
  /* Premium Holographic Glass */
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 1.5rem;
  height: 150px;
  position: relative;
  overflow: hidden;
  cursor: ${props => props.interactive ? 'pointer' : 'default'};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeInUp} 0.6s ease-out forwards;
  
  /* Stagger animation delay based on index (passed via style in component) */

  /* Inner Light Gradient */
  background: linear-gradient(
    145deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(30, 41, 59, 0.4) 100%
  );

  /* Hover Effects */
  &:hover {
    transform: translateY(-5px) scale(1.02);
    border-color: ${props => props.glowColor ? props.glowColor : 'rgba(255,255,255,0.2)'};
    /* Colored Shadow Bloom */
    box-shadow: 0 15px 35px -10px ${props => props.glowColor ? `${props.glowColor}40` : 'rgba(0,0,0,0.3)'}; 
    
    /* Parallax Effect on BG Icon */
    & ${BgIcon} {
      transform: scale(1.1) rotate(-15deg) translate(-5px, -5px);
      opacity: 0.08;
      color: ${props => props.glowColor};
    }
  }

  /* Active/Click Effect */
  &:active {
    transform: ${props => props.interactive ? 'scale(0.96)' : 'translateY(-5px)'};
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  
  /* Glassy Icon Container */
  background: ${props => props.bg};
  color: ${props => props.color};
  box-shadow: 0 4px 15px ${props => props.shadow};
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;

  ${BentoCard}:hover & {
    transform: scale(1.1);
  }
`;

const ActionIcon = styled.div`
  font-size: 1rem;
  color: #94a3b8;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.1);
  padding: 6px;
  border-radius: 50%;
  display: flex;

  ${BentoCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StatTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
  display: flex;
  align-items: baseline;
  gap: 4px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);

  small {
    font-size: 0.85rem;
    color: #94a3b8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
`;

// --- COMPONENT ---

const Stats = ({ trekDays, trekAltitude, trekCapacity, trekRating }) => {
  // State for Altitude Unit Toggle
  const [useFeet, setUseFeet] = useState(true);
  const [displayAltitude, setDisplayAltitude] = useState({ val: "0", unit: "ft" });

  // Intelligent Altitude Conversion
  useEffect(() => {
    if (!trekAltitude) return;

    // Normalize input (remove commas, handle strings)
    const rawString = trekAltitude.toString().toLowerCase().replace(/,/g, '');
    const numericPart = parseFloat(rawString.match(/\d+/)?.[0] || 0);
    const isSourceMeters = rawString.includes('m') && !rawString.includes('ft');

    if (useFeet) {
      // If source is meters, convert to feet. If source is feet, keep it.
      const val = isSourceMeters ? Math.round(numericPart * 3.28084) : numericPart;
      setDisplayAltitude({ val: val.toLocaleString(), unit: "FT" });
    } else {
      // If source is meters, keep it. If source is feet, convert to meters.
      const val = isSourceMeters ? numericPart : Math.round(numericPart / 3.28084);
      setDisplayAltitude({ val: val.toLocaleString(), unit: "M" });
    }
  }, [trekAltitude, useFeet]);

  return (
    <StatsContainer>
      <Grid>
        {/* 1. DURATION - Blue Theme */}
        <BentoCard glowColor="#38BDF8" style={{ animationDelay: '0ms' }}>
          <BgIcon><FiClock /></BgIcon>
          <CardContent>
            <HeaderRow>
              <IconBox bg="rgba(56, 189, 248, 0.15)" color="#38BDF8" shadow="rgba(56, 189, 248, 0.25)">
                <FiClock />
              </IconBox>
            </HeaderRow>
            <StatTextWrapper>
              <StatValue>{trekDays} <small>{trekDays === 1 ? 'Day' : 'Days'}</small></StatValue>
              <StatLabel>Duration</StatLabel>
            </StatTextWrapper>
          </CardContent>
        </BentoCard>

        {/* 2. ALTITUDE - Emerald Theme (Interactive) */}
        <BentoCard 
          glowColor="#34D399" 
          interactive 
          onClick={() => setUseFeet(!useFeet)}
          title="Click to toggle Units"
          style={{ animationDelay: '100ms' }}
        >
          <BgIcon><FaMountain /></BgIcon>
          <CardContent>
            <HeaderRow>
              <IconBox bg="rgba(52, 211, 153, 0.15)" color="#34D399" shadow="rgba(52, 211, 153, 0.25)">
                <FaMountain />
              </IconBox>
              <ActionIcon>
                <FiRefreshCw />
              </ActionIcon>
            </HeaderRow>
            <StatTextWrapper>
              <StatValue>{displayAltitude.val} <small>{displayAltitude.unit}</small></StatValue>
              <StatLabel>Max Altitude</StatLabel>
            </StatTextWrapper>
          </CardContent>
        </BentoCard>

        {/* 3. CAPACITY - Pink Theme */}
        <BentoCard glowColor="#F472B6" style={{ animationDelay: '200ms' }}>
          <BgIcon><FiUsers /></BgIcon>
          <CardContent>
            <HeaderRow>
              <IconBox bg="rgba(244, 114, 182, 0.15)" color="#F472B6" shadow="rgba(244, 114, 182, 0.25)">
                <FiUsers />
              </IconBox>
              <ActionIcon>
                <FiInfo title="Small group sizes for better experience" />
              </ActionIcon>
            </HeaderRow>
            <StatTextWrapper>
              <StatValue>{trekCapacity} <small>PAX</small></StatValue>
              <StatLabel>Group Size</StatLabel>
            </StatTextWrapper>
          </CardContent>
        </BentoCard>

        {/* 4. RATING - Gold Theme */}
        <BentoCard glowColor="#FBBF24" style={{ animationDelay: '300ms' }}>
          <BgIcon><FiStar /></BgIcon>
          <CardContent>
            <HeaderRow>
              <IconBox bg="rgba(251, 191, 36, 0.15)" color="#FBBF24" shadow="rgba(251, 191, 36, 0.25)">
                <FiStar />
              </IconBox>
            </HeaderRow>
            <StatTextWrapper>
              <StatValue>{trekRating} <small>/ 5.0</small></StatValue>
              <StatLabel>Average Rating</StatLabel>
            </StatTextWrapper>
          </CardContent>
        </BentoCard>
      </Grid>
    </StatsContainer>
  );
};

export default Stats;