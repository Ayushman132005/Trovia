import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FiCalendar, 
  FiUser, 
  FiMap, 
  FiDollarSign, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #111827 0%, #0F172A 100%);
  color: #ffffff;
  padding: 80px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-3px);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(135deg, #7DD8F8 0%, #4CC9F0 50%, #4361EE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0;
    font-size: 2rem;
    color: white;
  }

  span {
    color: #94a3b8;
    font-size: 0.9rem;
  }
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const BookingCard = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
  gap: 20px;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TrekInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TrekTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: white;
`;

const TrekDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  div {
    display: flex;
    flex-direction: column;
    
    strong {
      color: #e2e8f0;
      font-size: 0.95rem;
    }
    
    span {
      color: #64748b;
      font-size: 0.85rem;
    }
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Amount = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #10B981;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  width: fit-content;
  
  /* Use transient props ($) to prevent passing to DOM */
  background: ${props => 
    props.$status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : 
    props.$status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 
    'rgba(239, 68, 68, 0.2)'};
  
  color: ${props => 
    props.$status === 'confirmed' ? '#34D399' : 
    props.$status === 'pending' ? '#FBBF24' : 
    '#F87171'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  
  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  
  /* Use transient props ($) here too */
  background: ${props => props.$variant === 'confirm' ? '#4361EE' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$variant === 'confirm' ? 'white' : '#94a3b8'};

  &:hover {
    background: ${props => props.$variant === 'confirm' ? '#3A0CA3' : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  svg {
    font-size: 3rem;
    color: #4CC9F0;
    margin-bottom: 20px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  
  svg {
    font-size: 3rem;
    color: #64748b;
    margin-bottom: 20px;
  }
  
  h3 {
    margin: 0 0 10px 0;
    color: #e2e8f0;
  }
  
  p {
    color: #94a3b8;
    margin: 0;
  }
`;

const OrganizerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/organizer-trek-login');
        return;
      }

      try {
        // Query bookings where organizerId matches current user
        const q = query(
          collection(db, 'bookings'),
          where('organizerId', '==', user.uid),
          orderBy('createdAt', 'desc') // Requires an index
        );

        const querySnapshot = await getDocs(q);
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBookings(bookingsData);

        // Calculate stats
        const total = bookingsData.length;
        const revenue = bookingsData
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
        const pending = bookingsData.filter(b => b.status === 'pending').length;

        setStats({ total, revenue, pending });
        setLoading(false);

      } catch (error) {
        console.error("Error fetching bookings:", error);
        
        // Handle missing index error gracefully
        if (error.message.includes('index')) {
            console.log("Creating fallback query without sort...");
            // Fallback query without orderBy if index is missing
            const qFallback = query(
                collection(db, 'bookings'),
                where('organizerId', '==', user.uid)
            );
            const fallbackSnapshot = await getDocs(qFallback);
            const fallbackData = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(fallbackData);
            setLoading(false);
        } else {
            setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state to reflect change immediately
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <FiClock />
          <p>Loading your bookings...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <TitleGroup>
            <BackButton to="/organizer-dashboard">
              <FiArrowLeft size={20} />
            </BackButton>
            <Title>Manage Bookings</Title>
          </TitleGroup>
        </Header>

        <StatsContainer>
          <StatCard>
            <h3>{stats.total}</h3>
            <span>Total Bookings</span>
          </StatCard>
          <StatCard>
            <h3>${stats.revenue.toLocaleString()}</h3>
            <span>Total Revenue</span>
          </StatCard>
          <StatCard>
            <h3>{stats.pending}</h3>
            <span>Pending Actions</span>
          </StatCard>
        </StatsContainer>

        {bookings.length === 0 ? (
          <EmptyState>
            <FiCalendar />
            <h3>No Bookings Yet</h3>
            <p>When customers book your treks, they will appear here.</p>
          </EmptyState>
        ) : (
          <BookingsList>
            {bookings.map(booking => (
              <BookingCard key={booking.id}>
                <TrekInfo>
                  <TrekTitle>{booking.trekTitle || 'Unknown Trek'}</TrekTitle>
                  <TrekDate>
                    <FiCalendar size={14} />
                    {booking.trekDate ? new Date(booking.trekDate.seconds * 1000).toLocaleDateString() : 'Date N/A'}
                  </TrekDate>
                  <TrekDate>
                     <FiMap size={14} />
                     {booking.participants || 1} Person(s)
                  </TrekDate>
                </TrekInfo>

                <UserInfo>
                  <FiUser size={24} color="#64748b" />
                  <div>
                    <strong>{booking.userName || 'Guest User'}</strong>
                    <span>{booking.userEmail}</span>
                  </div>
                </UserInfo>

                <PaymentInfo>
                  <Amount>
                    <FiDollarSign />
                    {Number(booking.amount || 0).toLocaleString()}
                  </Amount>
                  <StatusBadge $status={booking.status}>
                    {booking.status === 'confirmed' && <FiCheckCircle />}
                    {booking.status === 'pending' && <FiClock />}
                    {booking.status === 'cancelled' && <FiXCircle />}
                    {booking.status?.toUpperCase() || 'UNKNOWN'}
                  </StatusBadge>
                </PaymentInfo>

                <ActionButtons>
                  {booking.status === 'pending' && (
                    <>
                      <Button onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
                        Cancel
                      </Button>
                      <Button $variant="confirm" onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
                        Confirm
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                     <Button onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
                        Cancel Booking
                     </Button>
                  )}
                </ActionButtons>
              </BookingCard>
            ))}
          </BookingsList>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default OrganizerBookings;