import React from 'react';
import { Users, BookOpen, Database, CloudLightning } from 'lucide-react';

export default function StatsCards({ totalStudents, courseCount, serverStatus, dbProvider = 'Neon PostgreSQL' }) {
  const cards = [
    {
      title: 'Total Enrolled',
      value: totalStudents,
      label: 'Registered Students',
      icon: Users,
      color: '#4f46e5',
      bgColor: '#eef2ff'
    },
    {
      title: 'Programs & Courses',
      value: courseCount,
      label: 'Active Disciplines',
      icon: BookOpen,
      color: '#0ea5e9',
      bgColor: '#f0f9ff'
    },
    {
      title: 'Cloud Database',
      value: dbProvider || 'PostgreSQL / Atlas',
      label: serverStatus === 'online' ? 'Cloud Instance Connected' : 'Waiting for connection',
      icon: Database,
      color: '#10b981',
      bgColor: '#ecfdf5',
      statusPill: serverStatus === 'online' ? 'Connected' : 'Offline'
    },
    {
      title: 'Compute Service',
      value: 'Express / Node.js',
      label: 'RESTful API Layer',
      icon: CloudLightning,
      color: '#8b5cf6',
      bgColor: '#f5f3ff'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.25rem'
                }}
              >
                {card.title}
              </p>
              <h3
                style={{
                  fontSize: typeof card.value === 'number' ? '1.875rem' : '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  margin: '0.2rem 0'
                }}
              >
                {card.value}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {card.label}
              </p>
            </div>

            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0
              }}
            >
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
