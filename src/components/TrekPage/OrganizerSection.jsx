import React from "react";
import styled from "styled-components";
// Importing the existing component from parent directory
import OrganizerCard from "../OrganizerCard"; 

// --- STYLED COMPONENTS ---

const OrganizerWrapper = styled.div`
  margin-top: 1.5rem;
  width: 100%; 
  
  /* Target the OrganizerCard specifically to adjust styles for the sidebar context */
  & > div {
    box-shadow: none;
    border: 1px solid #f3f4f6;
    background: #f9fafb; /* Slightly darker bg to differentiate from the white booking card */
  }
`;

// --- COMPONENT ---

const OrganizerSection = ({ 
  organizerId, 
  organizerName, 
  trekCount, 
  verified, 
  description, 
  experience 
}) => {
  // Guard clause: Don't render if essential info is missing
  if (!organizerId || !organizerName) return null;

  return (
    <OrganizerWrapper>
      <OrganizerCard 
        name={organizerName}
        id={organizerId}
        trekCount={trekCount}
        verified={verified}
        description={description}
        experience={experience}
      />
    </OrganizerWrapper>
  );
};

export default OrganizerSection;