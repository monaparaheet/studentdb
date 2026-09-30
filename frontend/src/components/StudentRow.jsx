import React from 'react';
import { Edit2, Trash2, Mail, Calendar, BookOpen } from 'lucide-react';

export default function StudentRow({ student, onEdit, onDelete }) {
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get course badge class
  const getCourseClass = (course) => {
    const c = (course || '').toLowerCase();
    if (c.includes('intelligence') || c.includes('ai')) return 'badge-course ai';
    if (c.includes('cloud')) return 'badge-course cloud';
    if (c.includes('cyber')) return 'badge-course cyber';
    return 'badge-course';
  };

  return (
    <tr>
      {/* Student Details (Avatar + Name) */}
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="student-avatar" title={student.name}>
            {getInitials(student.name)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
              {student.name}
            </div>
            <div
              style={{
                fontSize: '0.775rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '1px'
              }}
            >
              <Mail size={12} color="var(--text-muted)" />
              <a
                href={`mailto:${student.email}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
              >
                {student.email}
              </a>
            </div>
          </div>
        </div>
      </td>

      {/* Enrollment No */}
      <td>
        <span className="badge badge-mono">{student.enrollmentNo}</span>
      </td>

      {/* Course */}
      <td>
        <span className={getCourseClass(student.course)}>{student.course}</span>
      </td>

      {/* Created Date */}
      <td>
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Calendar size={13} color="var(--text-muted)" />
          <span>{formatDate(student.createdAt)}</span>
        </div>
      </td>

      {/* Actions */}
      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(student)}
            title="Edit student details"
            style={{ padding: '0.4rem 0.65rem' }}
          >
            <Edit2 size={14} />
            <span style={{ fontSize: '0.775rem' }}>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(student)}
            title="Delete student record"
            style={{
              padding: '0.4rem 0.65rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.color = '#dc2626';
            }}
          >
            <Trash2 size={14} />
            <span style={{ fontSize: '0.775rem' }}>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
