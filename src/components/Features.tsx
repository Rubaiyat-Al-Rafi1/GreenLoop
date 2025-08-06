import React from 'react';
import { Smartphone, BarChart, Users, Leaf, Clock, Award } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Access GreenLoop anywhere in Bangladesh with our responsive platform optimized for mobile devices.",
      color: "emerald"
    },
    {
      icon: BarChart,
      title: "Impact Analytics",
      description: "Track your environmental impact with detailed analytics and see how your actions contribute to a greener Bangladesh.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with like-minded individuals, businesses, and recycling facilities across the country.",
      color: "purple"
    },
    {
      icon: Leaf,
      title: "Eco Rewards",
      description: "Earn GreenPoints for every recycling activity and redeem them for sustainable products and services.",
      color: "green"
    },
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "AI-powered scheduling system that optimizes pickup routes and times for maximum efficiency.",
      color: "orange"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Unlock badges and achievements as you reach recycling milestones and inspire others to join.",
      color: "red"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600"
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From individual households to large businesses, GreenLoop provides the tools needed 
            to make recycling accessible and rewarding throughout Bangladesh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of Bangladeshi citizens already using GreenLoop to create positive environmental impact.
          </p>
          <button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;