
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Camera, Music } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20 animate-pulse-slow"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-pink-500 animate-float">
        <Heart className="w-8 h-8" />
      </div>
      <div className="absolute top-32 right-16 text-blue-500 animate-float" style={{ animationDelay: '1s' }}>
        <Camera className="w-6 h-6" />
      </div>
      <div className="absolute bottom-32 left-20 text-purple-500 animate-float" style={{ animationDelay: '2s' }}>
        <Music className="w-7 h-7" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-pink-200 bg-clip-text text-transparent mb-6 font-display">
            MEMORIA
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
            Your emotions, captured forever.<br />
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Turn feelings into living memories.
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/auth"
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-black 
              rounded-full bg-gradient-to-r from-blue-400 to-pink-400 
              hover:from-blue-500 hover:to-pink-500 
              transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="text-sm text-gray-400">
            Join thousands preserving their stories
          </div>
        </div>

        {/* Feature preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
          <div className="glass-card p-6 rounded-2xl text-center hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Emotion Tracking</h3>
            <p className="text-gray-400 text-sm">Capture how you feel with every memory</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Rich Media</h3>
            <p className="text-gray-400 text-sm">Add photos, voice notes, and more</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center hover-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Timeline View</h3>
            <p className="text-gray-400 text-sm">Watch your life story unfold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
