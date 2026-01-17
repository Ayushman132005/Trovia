import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FiCalendar, FiSun, FiWind, FiCloudRain, FiThermometer, FiUsers } from 'react-icons/fi';
import { BsSnow } from 'react-icons/bs';

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(167, 139, 250, 0); }
  100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0); }
`;

// --- HELPER DATA ---
const getMonthInfo = (index) => {
  const seasons = [
    { name: 'Winter', icon: <BsSnow />, temp: '-5°C to 10°C', crowd: 'Low' },       // Jan
    { name: 'Winter', icon: <BsSnow />, temp: '-2°C to 12°C', crowd: 'Low' },       // Feb
    { name: 'Spring', icon: <FiSun />, temp: '5°C to 18°C', crowd: 'Moderate' },    // Mar
    { name: 'Spring', icon: <FiSun />, temp: '10°C to 22°C', crowd: 'High' },       // Apr
    { name: 'Summer', icon: <FiSun />, temp: '15°C to 25°C', crowd: 'High' },       // May
    { name: 'Monsoon', icon: <FiCloudRain />, temp: '18°C to 24°C', crowd: 'Low' }, // Jun
    { name: 'Monsoon', icon: <FiCloudRain />, temp: '17°C to 23°C', crowd: 'Low' }, // Jul
    { name: 'Monsoon', icon: <FiCloudRain />, temp: '16°C to 22°C', crowd: 'Moderate' },// Aug
    { name: 'Autumn', icon: <FiWind />, temp: '10°C to 20°C', crowd: 'High' },      // Sep
    { name: 'Autumn', icon: <FiWind />, temp: '5°C to 18°C', crowd: 'High' },       // Oct
    { name: 'Winter', icon: <BsSnow />, temp: '0°C to 15°C', crowd: 'Moderate' },   // Nov
    { name: 'Winter', icon: <BsSnow />, temp: '-5°C to 10°C', crowd: 'Low' },       // Dec
  ];
  return seasons[index];
};

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// --- STYLED COMPONENTS ---

const Section = styled.section`
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
    border-color: rgba(167, 139, 250, 0.3);
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
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  background: rgba(167, 139, 250, 0.15); 
  color: #A78BFA;
  border: 1px solid rgba(167, 139, 250, 0.3);
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.15);
  transition: all 0.3s ease;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
`;

const SectionBody = styled.div`
  padding: 2.5rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const LegendRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
  
  span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color};
    box-shadow: 0 0 8px ${props => props.color};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MonthCard = styled.div`
  position: relative;
  background: ${props => props.active ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.active ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: ${props => props.active ? 1 : 0.4};
  cursor: ${props => props.active ? 'pointer' : 'default'};

  /* Peak Season Glow */
  ${props => props.isPeak && css`
    border-color: #A78BFA;
    box-shadow: 0 0 15px rgba(167, 139, 250, 0.15);
    animation: ${pulse} 3s infinite;
  `}

  &:hover {
    transform: ${props => props.active ? 'translateY(-5px)' : 'none'};
    background: ${props => props.active ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255, 255, 255, 0.02)'};
    z-index: 2;
  }
`;

const MonthName = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.active ? '#fff' : '#64748b'};
`;

const SeasonBadge = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.active ? '#A78BFA' : '#64748b'};
  background: ${props => props.active ? 'rgba(167, 139, 250, 0.1)' : 'transparent'};
  padding: 2px 8px;
  border-radius: 10px;
`;

const PeakTag = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #A78BFA;
  color: #0f172a;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const HoverInfo = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 16px;
  padding: 0.5rem;

  ${MonthCard}:hover & {
    opacity: ${props => props.visible ? 1 : 0};
  }
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #cbd5e1;
  white-space: nowrap;

  svg { color: #A78BFA; }
`;

const WeatherIconContainer = styled.div`
  font-size: 1.5rem;
  color: ${props => props.active ? '#e2e8f0' : '#475569'};
  margin-bottom: 4px;
`;

// --- COMPONENT ---

const BestTimeToVisit = ({ availableMonths }) => {
  if (!availableMonths || availableMonths.length === 0) return null;

  // Logic to determine "Peak" seasons (usually the middle of the available blocks)
  // For simplicity, we assume if it's available and crowd is High/Moderate, it's peak.
  const isMonthPeak = (idx, meta) => {
    return availableMonths.includes(idx) && (meta.crowd === 'High' || meta.name === 'Autumn' || meta.name === 'Spring');
  };

  return (
    <Section>
      <SectionHeader>
        <IconWrapper>
          <FiCalendar />
        </IconWrapper>
        <SectionTitle>Seasonal Planner</SectionTitle>
      </SectionHeader>
      
      <SectionBody>
        <LegendRow>
          <LegendItem color="#A78BFA"><span className="dot" />Peak Season</LegendItem>
          <LegendItem color="rgba(167, 139, 250, 0.3)"><span className="dot" />Off-Peak / Shoulder</LegendItem>
          <LegendItem color="#64748b"><span className="dot" />Unavailable</LegendItem>
        </LegendRow>

        <GridContainer>
          {monthNames.map((name, idx) => {
            const isAvailable = availableMonths.includes(idx);
            const meta = getMonthInfo(idx);
            const isPeak = isMonthPeak(idx, meta);

            return (
              <MonthCard key={idx} active={isAvailable} isPeak={isPeak}>
                {isPeak && isAvailable && <PeakTag>Best</PeakTag>}
                
                <WeatherIconContainer active={isAvailable}>
                  
                  {meta.icon}
                </WeatherIconContainer>
                
                <MonthName active={isAvailable}>{name}</MonthName>
                <SeasonBadge active={isAvailable}>{meta.name}</SeasonBadge>

                {/* Hover Details */}
                <HoverInfo visible={isAvailable}>
                  <StatRow>
                    <FiThermometer /> {meta.temp}
                  </StatRow>
                  <StatRow>
                    <FiUsers /> Crowd: {meta.crowd}
                  </StatRow>
                </HoverInfo>
              </MonthCard>
            );
          })}
        </GridContainer>
      </SectionBody>
    </Section>
  );
};

export default BestTimeToVisit;