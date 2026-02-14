import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'; 
import { db, auth } from '../firebase'; 
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, getDoc } from 'firebase/firestore'; 

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- STYLED COMPONENTS ---
const Page = styled.div`
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  position: relative;
`;

// ✅ Custom Modal Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background: #1a1a2e;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(255, 75, 31, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #fff;
`;

const ModalText = styled.p`
  color: #bbb;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &.confirm {
    background: #ff4d4d;
    color: white;
    &:hover { background: #ff3333; transform: scale(1.05); }
  }
  
  &.cancel {
    background: #333;
    color: white;
    &:hover { background: #444; }
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 75, 31, 0.1), rgba(255, 142, 83, 0.05));
  filter: blur(40px);
  animation: ${float} 6s ease-in-out infinite;
  &:nth-child(1) { top: 10%; right: 10%; animation-delay: 0s; }
  &:nth-child(2) { bottom: 20%; left: 10%; animation-delay: 3s; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #FF4B1F 50%, #FF8E53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  margin: 0 auto;
`;

const CreateButton = styled(Link)`
  margin-top: 30px;
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 75, 31, 0.5);
  color: #FF8E53;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%);
    color: white;
    transform: translateY(-3px);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 32px;
  margin-top: 40px;
`;

const BlogCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(255, 75, 31, 0.3);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  ${BlogCard}:hover & { transform: scale(1.1); }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 75, 31, 0.2) 0%, rgba(255, 142, 83, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  ${BlogCard}:hover & { opacity: 1; }
  pointer-events: none; 
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.85);
  color: #ff4d4d;
  border: 2px solid #ff4d4d;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 999; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;

  &:hover {
    background: #ff4d4d;
    color: white;
    transform: scale(1.1);
  }
`;

const BlogContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BlogTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
`;

const BlogSummary = styled.p`
  color: #bbb;
  font-size: 1rem;
  margin-bottom: 24px;
  line-height: 1.6;
  flex: 1;
`;

const ReadButton = styled.button`
  background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(135deg, #d13a13 0%, #e6683d 100%);
  }
`;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null); // ✅ New state for Modal
  const navigate = useNavigate();

  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'ayushmaanpatel13@gmail.com'];

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        if (ADMIN_EMAILS.includes(user.email)) {
          setIsAdmin(true);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
              setIsAdmin(true);
            }
          } catch (err) { console.error("Error fetching role", err); }
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribeBlogs = onSnapshot(q, (snapshot) => {
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    });

    return () => { unsubscribeAuth(); unsubscribeBlogs(); };
  }, []);

  // ✅ New Final Delete Logic
  const executeDelete = async () => {
    if (!blogToDelete) return;

    try {
      await deleteDoc(doc(db, "blogs", blogToDelete));
      setBlogToDelete(null); // Close modal
      alert("Success: Blog has been removed.");
    } catch (error) {
      console.error("Firebase Delete Error:", error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  return (
    <Page>
      <FloatingElement />
      <FloatingElement />

      {/* --- ✅ CUSTOM CONFIRMATION MODAL --- */}
      {blogToDelete && (
        <ModalOverlay onClick={() => setBlogToDelete(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Adventure?</ModalTitle>
            <ModalText>This action is permanent and cannot be recovered.</ModalText>
            <ButtonGroup>
              <ModalButton className="cancel" onClick={() => setBlogToDelete(null)}>
                Cancel
              </ModalButton>
              <ModalButton className="confirm" onClick={executeDelete}>
                Delete
              </ModalButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
      
      <Container>
        <Header>
          <SectionTitle>Adventure Blog</SectionTitle>
          <Subtitle>Discover epic adventures, expert tips, and inspiring stories.</Subtitle>
          <CreateButton to="/create-blog">+ Share Your Adventure</CreateButton>
        </Header>

        <BlogGrid>
          {blogs.length === 0 ? (
            <div style={{color: "#aaa", textAlign: "center", gridColumn: "1/-1"}}>
              No stories found.
            </div>
          ) : (
            blogs.map((blog) => {
              const isOwner = currentUser && blog.authorId === currentUser.uid;
              const showDelete = isOwner || isAdmin;

              return (
                <BlogCard key={blog.id}>
                  <ImageContainer>
                    <BlogImage 
                      src={blog.imageUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba"} 
                      alt={blog.title} 
                    />
                    <ImageOverlay /> 

                    {showDelete && (
                      <DeleteButton 
                        onClick={(e) => {
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          setBlogToDelete(blog.id); // ✅ Open Modal instead of alert
                        }}
                        title="Delete this blog"
                      >
                        🗑️
                      </DeleteButton>
                    )}
                  </ImageContainer>
                  
                  <BlogContent>
                    <BlogTitle>{blog.title}</BlogTitle>
                    <BlogSummary>{blog.summary}</BlogSummary>
                    <ReadButton onClick={() => navigate(`/blogs/${blog.id}`)}>
                      Read More
                    </ReadButton>
                  </BlogContent>
                </BlogCard>
              );
            })
          )}
        </BlogGrid>
      </Container>
    </Page>
  );
};

export default Blog;