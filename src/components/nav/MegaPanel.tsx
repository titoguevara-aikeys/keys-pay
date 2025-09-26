import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface MegaPanelProps {
  panel: {
    title: string;
    description: string;
    sections: Array<{
      title: string;
      items: Array<{
        title: string;
        description: string;
        href: string;
        icon: React.ReactNode;
      }>;
    }>;
    featured?: {
      title: string;
      description: string;
      href: string;
      image: string;
    };
  };
}

const MegaPanel: React.FC<MegaPanelProps> = ({ panel }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Panel Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{panel.title}</h2>
        <p className="text-muted-foreground">{panel.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Navigation Sections */}
        {panel.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <NavLink
                  key={itemIndex}
                  to={item.href}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Featured Content */}
        {panel.featured && (
          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
              <div className="mb-4">
                <img 
                  src={panel.featured.image} 
                  alt={panel.featured.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {panel.featured.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {panel.featured.description}
              </p>
              <Button asChild className="w-full">
                <NavLink to={panel.featured.href}>
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Particle Effects Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MegaPanel;