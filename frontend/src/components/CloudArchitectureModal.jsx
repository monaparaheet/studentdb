import React from 'react';
import { X, Cloud, Server, Database, Globe, ShieldCheck, Cpu } from 'lucide-react';

export default function CloudArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #eef2ff, #f8fafc)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Cloud size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>
                Cloud Computing Architecture
              </h3>
              <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                3-Tier Full-Stack Cloud Deployment Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Architecture Visual Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* Frontend Tier */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1d4ed8', marginBottom: '0.5rem' }}>
                <Globe size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Presentation Tier</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>React.js</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Hosted on <strong>Vercel / Netlify</strong>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                Global Edge CDN, SSL/TLS, SPA Routing, Client Caching
              </div>
            </div>

            {/* Backend Tier */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #c7d2fe',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <Cpu size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Compute / Logic Tier</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Express & Node.js</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Hosted on <strong>Render Cloud</strong>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                RESTful APIs, Mongoose ODM, CORS security, auto-restarts
              </div>
            </div>

            {/* Data Tier */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                <Database size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Data Storage Tier</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>MongoDB Atlas</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Managed <strong>Cloud DBaaS</strong>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                Multi-region clusters, automatic backups, encrypted storage
              </div>
            </div>
          </div>

          {/* Key Cloud Computing Concepts */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Key Cloud Concepts Demonstrated
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
              <Server size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Cloud Compute Services (PaaS):</strong> The Node/Express API runs in containerized isolated micro-instances on Render, demonstrating elasticity and automated deployment via GitHub webhooks.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
              <Database size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Cloud Database Storage (DBaaS):</strong> MongoDB Atlas provides highly available NoSQL storage with automated sharding, indexing, and managed IP access lists without managing bare-metal servers.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
              <Globe size={18} color="#0ea5e9" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Internet Accessibility:</strong> Frontend and backend communicate across independent public domain endpoints secured with HTTPS/TLS certificates and Cross-Origin Resource Sharing (CORS) rules.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
              <ShieldCheck size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Resource & Secret Management:</strong> Database credentials and API URLs are decoupled from source code using environment variables (<code>MONGODB_URI</code>, <code>VITE_API_BASE_URL</code>), fulfilling 12-factor cloud-native best practices.
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
}
