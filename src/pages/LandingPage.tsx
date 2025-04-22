
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ParticlesContainer } from '@/components/landing/ParticlesContainer';

const LandingPage = () => {
  useEffect(() => {
    // Add fade-in classes after component mounts for animation
    const elements = document.querySelectorAll('.animate-on-mount');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
        el.classList.remove('opacity-0');
      }, index * 500); // Stagger animations
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <ParticlesContainer />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        <h1 
          className="animate-on-mount opacity-0 text-4xl md:text-6xl font-bold text-white mb-6 font-display"
        >
          Your Memories, Forever Alive.
        </h1>
        
        <p 
          className="animate-on-mount opacity-0 text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Turn your emotions into a living timeline. Build your story before it fades away.
        </p>
        
        <Link
          to="/auth"
          className="animate-on-mount opacity-0 inline-block px-8 py-4 text-lg font-semibold text-white 
            rounded-full bg-gradient-to-r from-[#9A67EA] to-[#FF5CA8] 
            hover:scale-105 transition-all duration-300 
            shadow-[0_0_20px_rgba(154,103,234,0.5)] 
            animate-float"
        >
          Start Building MEMORIA
        </Link>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9A67EA]/20 to-[#FF5CA8]/20 animate-pulse-slow" />
    </div>
  );
};

export default LandingPage;
