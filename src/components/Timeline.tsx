import React from 'react';

interface TimelineItem {
  type: 'education' | 'experience';
  title: string;
  organization: string;
  date: string;
  location?: string;
  description?: string;
  skills?: string[];
}

const educationItems: TimelineItem[] = [
  {
    type: 'education',
    title: 'Bachelor\'s in Computer Science and Engineering',
    organization: 'Tribhuvan University',
    date: 'Graduation: 2023',
    description: 'A comprehensive degree focusing on software engineering, distributed systems, cloud computing, and data management.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Cloud Computing', 'Database Management', 'Agile Methodologies']
  },
  {
    type: 'education',
    title: 'High School Science',
    organization: 'Amarsingh Secondary School',
    date: 'Aug 2016 - May 2018',
    description: 'Studied high school level physical science (Physics, Chemistry and Mathematics)',
    skills: ['Physics', 'Chemistry', 'Maths']
  }
];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Full Stack Developer',
    organization: 'Cotiviti',
    date: 'Aug 2023 - Present · 3 years',
    location: 'Hybrid',
    description: 'Developed and maintained various healthcare data analysis tools and web applications using Java, Spring Boot, Angular, and Oracle. Optimized SQL queries and ensured high system availability. Built a custom web app for licensing and validation and integrated with external systems.',
    skills: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'SQL', 'RESTful APIs', 'JPA', 'Microservices']
  },
  {
    type: 'experience',
    title: 'Mobile Developer (Flutter)',
    organization: 'MarginTop Solutions',
    date: 'Jan 2020 - May 2021 · 1 year 5 months',
    location: 'Remote',
    description: 'Developed mobile applications for people with cerebral palsy, using Flutter to design user-friendly interfaces and communicate with ESP32 microcontrollers for targeted rhythmic massage treatment.',
    skills: ['Flutter', 'Dart', 'Mobile Development', 'Bluetooth', 'Embedded Systems']
  },
  {
    type: 'experience',
    title: 'Internship in Network Engineering',
    organization: 'Nepal Telecommunications',
    date: 'Sept 2018 - Dec 2022 · 3 months',
    location: 'Nepal',
    description: 'Worked on network configuration, maintenance, and troubleshooting. Gained hands-on experience with network devices, firewalls, and routers.',
    skills: ['Networking', 'Cisco Devices', 'Network Troubleshooting', 'IT Support']
  }
];

const TimelineItem: React.FC<{ item: TimelineItem }> = ({ item }) => (
  <div className="mb-8 relative">
    <div className="absolute top-0 left-0 w-2 h-full bg-gray-200 dark:bg-gray-700" />
    <div className="ml-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="absolute left-0 top-4 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{item.organization}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{item.date}</p>
      {item.location && (
        <p className="text-sm text-gray-500 dark:text-gray-500">{item.location}</p>
      )}
      {item.description && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
      )}
      {item.skills && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Timeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Experience</h2>
          {experienceItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Education</h2>
          {educationItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;