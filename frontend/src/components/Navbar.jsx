import React from 'react';
import { GraduationCap, Cloud, RefreshCw, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export default function Navbar({ serverStatus, onCheckHealth, onOpenArchitecture }) {
  return (
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
                EduPortal
              </h1>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                Cloud Native
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
              Student Information & Management System
            </p>
          </div>
        </div>

        {/* Right Actions: Server Status & Cloud Architecture */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Server Connection Status Pill */}
          <button
            type="button"
            onClick={onCheckHealth}
            title="Click to re-check backend status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              transition: 'all 0.15s ease',
              ...(serverStatus === 'online'
                ? {
                    background: 'var(--success-bg)',
                    color: 'var(--success-text)',
                    borderColor: 'var(--success-border)'
                  }
                : serverStatus === 'checking'
                ? {
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    borderColor: '#bfdbfe'
                  }
                : {
                    background: 'var(--danger-bg)',
                    color: 'var(--danger-text)',
                    borderColor: 'var(--danger-border)'
                  })
            }}
          >
            {serverStatus === 'online' ? (
              <>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--success)',
                    display: 'inline-block'
                  }}
                ></span>
                <span>Backend Online</span>
              </>
            ) : serverStatus === 'checking' ? (
              <>
                <RefreshCw size={12} className="spinner" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} />
                <span>Server Offline</span>
              </>
            )}
          </button>

          {/* Architecture Modal Trigger */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenArchitecture}
            style={{ gap: '0.375rem', fontSize: '0.775rem' }}
          >
            <Cloud size={14} />
            <span>Cloud Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
}
