import React, { useState } from "react";
import styled from "styled-components";
import { 
  FiMap, FiMapPin, FiCompass, FiArrowUp, FiHome, 
  FiChevronDown, FiMaximize2, FiMinimize2, FiDownload 
} from 'react-icons/fi';

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
  position: relative;

  &:hover {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(20, 184, 166, 0.3); /* Teal hint on hover */
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const SectionHeader = styled.div`
  padding: 1.75rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  background: rgba(20, 184, 166, 0.15); 
  color: #14B8A6;
  border: 1px solid rgba(20, 184, 166, 0.3);
  box-shadow: 0 0 15px rgba(20, 184, 166, 0.15);
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
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ControlBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(20, 184, 166, 0.1);
    color: #14B8A6;
    border-color: rgba(20, 184, 166, 0.2);
  }
`;

const SectionBody = styled.div`
  padding: 2.5rem;
  position: relative;
  @media (max-width: 768px) { padding: 1.5rem; }
`;

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  padding-left: 1rem;
  
  /* Vertical Guide Line */
  &:before {
    content: '';
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 27px; /* Aligned with center of markers */
    width: 2px;
    background: linear-gradient(to bottom, rgba(20, 184, 166, 0.8), rgba(20, 184, 166, 0.1));
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding-left: 0;
    &:before { left: 19px; }
  }
`;

const TimelineItem = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 1.5rem;
  align-items: flex-start;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr;
    gap: 1rem;
  }
`;

const DayMarker = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0f172a;
  border: 2px solid ${props => props.active ? '#14B8A6' : '#334155'};
  color: ${props => props.active ? '#14B8A6' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 2;
  box-shadow: ${props => props.active ? '0 0 15px rgba(20, 184, 166, 0.4)' : 'none'};
  transition: all 0.3s ease;
`;

const TimelineCard = styled.div`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.active ? 'rgba(20, 184, 166, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(20, 184, 166, 0.3);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.active ? '#5EEAD4' : '#e2e8f0'};
  transition: color 0.3s;
`;

const LocationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #94a3b8;
  
  svg { color: #14B8A6; }
`;

const ExpandIcon = styled.div`
  color: #94a3b8;
  transition: transform 0.3s ease;
  transform: ${props => props.active ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const CardBody = styled.div`
  /* Smooth Collapse Animation */
  max-height: ${props => props.active ? '500px' : '0'};
  opacity: ${props => props.active ? '1' : '0'};
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  border-top: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
`;

const BodyContent = styled.div`
  padding: 1.5rem;
  padding-top: 1rem;
`;

const Description = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0 0 1.25rem 0;
`;

const DetailsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const DetailChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.6);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  svg { color: #14B8A6; }
  span { color: #e2e8f0; font-weight: 500; }
`;

// --- COMPONENT ---

const Itinerary = ({ itinerary }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Toggle single item
  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle all items
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedItems({});
    } else {
      const newExpandedState = {};
      itinerary.forEach((_, idx) => newExpandedState[idx] = true);
      setExpandedItems(newExpandedState);
    }
    setAllExpanded(!allExpanded);
  };

  const handleDownload = () => {
    alert("Downloading Itinerary PDF..."); // Placeholder for actual download logic
  };

  // Guard clause
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <Section>
      <SectionHeader>
        <HeaderLeft>
          <IconWrapper>
            <FiMap />
          </IconWrapper>
          <SectionTitle>
            Itinerary
          </SectionTitle>
        </HeaderLeft>
        
        <HeaderControls>
          <ControlBtn onClick={toggleAll}>
            {allExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
            {allExpanded ? "Collapse All" : "Expand All"}
          </ControlBtn>
          <ControlBtn onClick={handleDownload}>
            <FiDownload /> PDF
          </ControlBtn>
        </HeaderControls>
      </SectionHeader>

      <SectionBody>
        <TimelineWrapper>
          {itinerary.map((item, idx) => {
            const isActive = !!expandedItems[idx];
            
            return (
              <TimelineItem key={idx}>
                {/* Day Marker (Glows when active) */}
                <DayMarker active={isActive}>
                  {item.day || idx + 1}
                </DayMarker>
                
                {/* Expandable Card */}
                <TimelineCard active={isActive} onClick={() => toggleItem(idx)}>
                  <CardHeader>
                    <HeaderContent>
                      <Title active={isActive}>{item.title}</Title>
                      {item.location && (
                        <LocationBadge>
                          <FiMapPin size={12} />
                          {item.location}
                        </LocationBadge>
                      )}
                    </HeaderContent>
                    <ExpandIcon active={isActive}>
                      <FiChevronDown size={20} />
                    </ExpandIcon>
                  </CardHeader>
                  
                  <CardBody active={isActive}>
                    <BodyContent>
                      <Description>{item.description}</Description>
                      
                      {/* Additional Details */}
                      {(item.distance || item.elevation || item.accommodation) && (
                        <DetailsGrid>
                          {item.distance && (
                            <DetailChip>
                              <FiCompass /> <span>{item.distance}</span>
                            </DetailChip>
                          )}
                          {item.elevation && (
                            <DetailChip>
                              <FiArrowUp /> <span>{item.elevation}</span>
                            </DetailChip>
                          )}
                          {item.accommodation && (
                            <DetailChip>
                              <FiHome /> <span>{item.accommodation}</span>
                            </DetailChip>
                          )}
                        </DetailsGrid>
                      )}
                    </BodyContent>
                  </CardBody>
                </TimelineCard>
              </TimelineItem>
            );
          })}
        </TimelineWrapper>
      </SectionBody>
    </Section>
  );
};

export default Itinerary;