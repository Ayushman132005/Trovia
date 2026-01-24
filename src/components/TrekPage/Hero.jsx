import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FiMapPin, FiClock, FiArrowRight, FiHeart, FiShare2 } from "react-icons/fi";
import {
  FaMountain,
  FaLeaf,
  FaSnowflake,
  FaSun,
  FaCloudRain
} from "react-icons/fa";
import ImageCarousel from "../ImageCarousel";

/* ---------------- ANIMATIONS ---------------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ---------------- LAYOUT ---------------- */

const ModernHero = styled.section`
  position: relative;
  /* 100dvh handles mobile browser address bars better than 100vh */
  height: 100dvh;
  min-height: 600px;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background: #0a0a0a;

  /* Adjust min-height for smaller landscape devices */
  @media (max-height: 500px) and (orientation: landscape) {
    min-height: 100dvh;
  }
`;

const HeroParallax = styled.div`
  position: absolute;
  inset: 0;
  height: 120%;
  will-change: transform;
  z-index: 0;
`;

const HeroImgWrapper = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.2s ease-out;

  &.loaded {
    opacity: 1;
  }

  .hero-img-legacy {
    width: 100%;
    height: 100%;
    background-image: url(${p => p.image});
    background-size: cover;
    background-position: center;
  }

  .hero-img-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.6);
    background: #1a1a1a;
    height: 100%;
  }
`;

const HeroGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.35) 0%,
    rgba(0,0,0,0) 30%,
    rgba(0,0,0,0.15) 55%,
    rgba(0,0,0,0.85) 90%,
    rgba(0,0,0,0.95) 100%
  );
  pointer-events: none;
`;

const HeroGrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
`;

/* ---------------- FLOATING ACTIONS ---------------- */

const FloatingActions = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 20;
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    gap: 0.5rem;
  }
`;

const FloatingBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10px);
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.25);
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
  }
`;

/* ---------------- CONTENT ---------------- */

const HeroContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  /* Responsive padding: Less on mobile to maximize space */
  padding: 0 5% 4rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 2.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 1.25rem 2rem;
  }
`;

const ContentInner = styled.div`
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: ${fadeIn} 1s ease-out forwards;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LocationTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 600;
  color: rgba(255,255,255,0.9);

  svg {
    color: #ffd2bf;
  }

  /* Hidden on Mobile as requested */
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroHeading = styled.h1`
  /* Clamp allows fluid scaling between 2.2rem and 4.5rem based on viewport width */
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: white;
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 480px) {
    font-size: 2rem; /* Fallback for very small screens */
    line-height: 1.2;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255,255,255,0.95);
  max-width: 620px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const HeroFactsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const FactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.25);
  font-size: 0.9rem;
  color: white;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }
`;

const HeroDesc = styled.p`
  max-width: 560px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.85);

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 1rem;
    /* Limit lines on mobile to prevent scrolling too far */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
`;

const HeroPrimaryBtn = styled.button`
  background: white;
  color: #0a0a0a;
  border: none;
  padding: 1rem 2.2rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center; /* Center content for mobile stacking */
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.9rem 1rem;
  }
`;

const HeroSecondaryBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255,255,255,0.45);
  color: white;
  padding: 1rem 2rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center; /* Center content for mobile stacking */
  
  &:hover {
    background: rgba(255,255,255,0.12);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.9rem 1rem;
  }
`;

const SocialProof = styled.div`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
`;

/* ---------------- HELPERS ---------------- */

const getSeasonIcon = season => {
  if (!season) return <FaSun />;
  const s = season.toLowerCase();
  if (s.includes("winter") || s.includes("snow")) return <FaSnowflake />;
  if (s.includes("monsoon") || s.includes("rain")) return <FaCloudRain />;
  if (s.includes("spring") || s.includes("autumn")) return <FaLeaf />;
  return <FaSun />;
};

/* ---------------- COMPONENT ---------------- */

const Hero = ({
  trek,
  trekImage,
  trekLocation,
  trekCountry,
  trekTitle,
  trekDifficulty,
  trekDays,
  trekSeason,
  trekDescription,
  onBookClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      // Disable parallax on mobile for better performance
      if (window.innerWidth > 768 && parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (trekImage) {
      const img = new Image();
      img.src = trekImage;
      img.onload = () => setImageLoaded(true);
    } else if (trek?.imageUrls?.length) {
      setImageLoaded(true);
    }
  }, [trekImage, trek]);

  return (
    <ModernHero>
      <HeroParallax ref={parallaxRef}>
        <HeroImgWrapper image={trekImage} className={imageLoaded ? "loaded" : ""}>
          {trek?.imageUrls?.length ? (
            <ImageCarousel
              images={trek.imageUrls}
              autoplay
              interval={6000}
            />
          ) : trekImage ? (
            <div className="hero-img-legacy" />
          ) : (
            <div className="hero-img-fallback">No images available</div>
          )}
        </HeroImgWrapper>
      </HeroParallax>

      <HeroGradientOverlay />
      <HeroGrainOverlay />

      <HeroContentWrapper>
        <ContentInner>
          <LocationTag>
            <FiMapPin />
            {trekLocation}, {trekCountry}
          </LocationTag>

          <HeroHeading>{trekTitle}</HeroHeading>

          <HeroSubtitle>
            Walk through a Himalayan valley that blooms once a year.
          </HeroSubtitle>

          <HeroFactsRow>
            <FactItem><FaMountain /> {trekDifficulty}</FactItem>
            <FactItem><FiClock /> {trekDays} Days</FactItem>
            <FactItem>{getSeasonIcon(trekSeason)} {trekSeason}</FactItem>
          </HeroFactsRow>

          <HeroDesc>{trekDescription}</HeroDesc>

          <HeroActions>
            <HeroPrimaryBtn onClick={onBookClick}>
              Book Your Spot <FiArrowRight />
            </HeroPrimaryBtn>
            <HeroSecondaryBtn>View Itinerary</HeroSecondaryBtn>
          </HeroActions>

          <SocialProof>
            ⭐ 4.8 · 2,000+ trekkers completed this trek
          </SocialProof>
        </ContentInner>
      </HeroContentWrapper>
    </ModernHero>
  );
};

export default Hero;