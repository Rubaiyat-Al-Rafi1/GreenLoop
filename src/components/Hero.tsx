import React from 'react';
import { ArrowRight, MapPin, Calendar, Trophy } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Building a Greener
            <span className="text-emerald-600 block">Bangladesh Together</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join Bangladesh's first comprehensive recycling platform. Connect with local recycling centers, 
            schedule pickups, earn rewards, and track your environmental impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Recycling Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200">
              Learn More
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Centers</h3>
              <p className="text-gray-600">
                Locate nearby recycling centers with real-time availability and directions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Pickups</h3>
              <p className="text-gray-600">
                Book convenient pickup times for your recyclable materials at home or office.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Rewards</h3>
              <p className="text-gray-600">
                Get points for every recycling action and redeem them for eco-friendly rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;