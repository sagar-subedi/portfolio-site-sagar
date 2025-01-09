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
    "githubLink": "https://github.com/sagarsubedi/litcord",
    "liveLink": "https://sagar88.com.np/litcord"
  },
  {
    "title": "Distributed E-Learning Platform",
    "description": "A distributed platform for online learning. Includes user management, course creation, and video streaming, with microservices architecture.",
    "technologies": ["Java", "Go", "Spring Boot", "Kubernetes", "PostgreSQL"],
    "githubLink": "https://github.com/sagarsubedi/distributed-e-learning",
    "liveLink": "https://sagar88.com.np/e-learning"
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