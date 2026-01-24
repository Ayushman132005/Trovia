import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Icons/Assets (Conceptualizing modern UI iconography)
const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 1.25rem;
  background: ${(props) => props.bgColor || '#f3f4f6'};
  color: ${(props) => props.iconColor || '#374151'};
  transition: all 0.3s ease;
`;

const AdminContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 640px) {
    padding: 2rem 1rem;
  }
`;

const HeaderSection = styled.header`
  margin-bottom: 3.5rem;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #e0e7ff;
  color: #4338ca;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const Header = styled.h1`
  color: #111827;
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin-top: 0.5rem;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AdminCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
    border-color: #6366f1;

    ${IconWrapper} {
      background: #6366f1;
      color: #ffffff;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const Title = styled.h2`
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
`;

const CardFooter = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;

  &::after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.2s;
  }

  ${AdminCard}:hover &::after {
    transform: translateX(4px);
  }
`;

const SimpleAdmin = () => {
  return (
    <AdminContainer>
      <HeaderSection>
        <Badge>Administration</Badge>
        <Header>System Dashboard</Header>
        <Subtitle>Manage your platform's core entities and permissions.</Subtitle>
      </HeaderSection>

      <AdminGrid>
        <AdminCard to="/admin/communities">
          <IconWrapper bgColor="#dcfce7" iconColor="#15803d">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </IconWrapper>
          <Title>Community Admin</Title>
          <Description>
            Manage communities, toggle featured status, and moderate listings.
          </Description>
          <CardFooter>Manage Communities</CardFooter>
        </AdminCard>

        <AdminCard to="/admin/treks">
          <IconWrapper bgColor="#fef3c7" iconColor="#b45309">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 20l1.3-1.3M18.5 4.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </IconWrapper>
          <Title>Trek Admin</Title>
          <Description>
            Curate trek experiences, set featured status, and update routes.
          </Description>
          <CardFooter>Manage Treks</CardFooter>
        </AdminCard>

        <AdminCard to="/admin/users">
          <IconWrapper bgColor="#e0e7ff" iconColor="#4338ca">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 11c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z" />
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            </svg>
          </IconWrapper>
          <Title>User Management</Title>
          <Description>
            Assign organizer roles, control permissions, and manage accounts.
          </Description>
          <CardFooter>Manage Users</CardFooter>
        </AdminCard>

        <AdminCard to="/admin/coupons">
          <IconWrapper bgColor="#fce7f3" iconColor="#be185d">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </IconWrapper>
          <Title>Coupon Management</Title>
          <Description>
            Create discount strategies, track usage, and set validity periods.
          </Description>
          <CardFooter>Manage Coupons</CardFooter>
        </AdminCard>
      </AdminGrid>
    </AdminContainer>
  );
};

export default SimpleAdmin;