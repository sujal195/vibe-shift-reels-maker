
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  useEffect(() => {
    console.log('LandingPage mounted');
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Your Memories, Forever Alive.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Turn your emotions into a living timeline. Build your story before it fades away.
        </p>
        
        <Link
          to="/auth"
          className="inline-block px-8 py-4 text-lg font-semibold text-white 
            rounded-full bg-gradient-to-r from-purple-600 to-violet-500 
            hover:scale-105 transition-all duration-300"
        >
          Start Building MEMORIA
        </Link>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10" />
    </div>
  );
};

export default LandingPage;
