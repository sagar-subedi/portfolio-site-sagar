import React from 'react';
import ProjectCard from './ProjectCard';

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

const projects: Omit<ProjectCardProps, 'stars' | 'forks' | 'lastUpdated'>[] = [
  {
    "title": "Litcord",
    "description": "A video/audio calling app with text chat inspired by Discord. Features server channels, peer-to-peer connections, and a scalable architecture.",
    "technologies": ["Angular", "WebRTC", "Spring Boot", "PostgreSQL"],
    "githubLink": "https://github.com/sagar-subedi/litcord",
    "liveLink": "https://litcord.sagar88.com.np"
  },
  {
    "title": "Distributed Nursery Store",
    "description": "A distributed platform for buying plants and gardening items. Developed with microservices architecture.",
    "technologies": ["Java", "Go", "Spring Boot", "Kubernetes", "PostgreSQL"],
    "githubLink": "https://github.com/sagar-subedi/distributed-nursery-store",
    "liveLink": "https://nursery.sagar88.com.np"
  }
];

const ProjectsDisplay: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md md:col-span-2 lg:col-span-3">
      <div className="p-4">
        <h2 className="text-xl font-bold">Featured Projects</h2>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            {...project} 
            stars={0} 
            forks={0} 
            lastUpdated={new Date().toISOString()}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsDisplay;