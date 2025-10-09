export interface Service {
  id: string;
  title: string;
  category: string;
  color: string;
  borderColor: string;
  items: string[];
  icon: string;
  bgGradient: string;
}

export const services: Service[] = [
  {
    id: 'custom-dev',
    title: 'Custom Development',
    category: 'Development',
    color: '#10b981',
    borderColor: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
    items: ['CMS Development', 'Web Applications', 'Mobile Apps'],
    icon: '💻'
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    category: 'Infrastructure',
    color: '#f97316',
    borderColor: '#f97316',
    bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))',
    items: ['Performance Optimization', '24/7 Monitoring', 'Cloud Migration'],
    icon: '☁️'
  },
  {
    id: 'ai-data',
    title: 'AI & Data Solutions',
    category: 'AI/ML',
    color: '#6366f1',
    borderColor: '#6366f1',
    bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))',
    items: ['NLP Solutions', 'Machine Learning Models', 'Data Analytics'],
    icon: '🤖'
  }
];
