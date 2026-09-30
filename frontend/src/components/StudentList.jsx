import React from 'react';
import StudentRow from './StudentRow';
import { Search, Filter, ArrowUpDown, RefreshCw, Download, AlertCircle, UserCheck } from 'lucide-react';

export default function StudentList({
  students,
  isLoading,
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  sortBy,
  onSortChange,
  onRefresh,
  onEditStudent,
  onDeleteStudent,
  availableCourses
}) {
  // Export table data to CSV format
  const exportToCSV = () => {
    if (!students || students.length === 0) return;

    const headers = ['Name', 'Enrollment Number', 'Course', 'Email', 'Created Date'];
    const rows = students.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.enrollmentNo}"`,
      `"${s.course.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      `"${new Date(s.createdAt).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      {/* List Header with Title and Quick Counts */}
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Student Directory</h2>
          <span className="badge badge-primary">
            {students.length} {students.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Refresh Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh student list"
          >
            <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export to CSV */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={exportToCSV}
            disabled={isLoading || students.length === 0}
            title="Export filtered records as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {/* Search input */}
        <div className="input-wrapper" style={{ flex: 2 }}>
          <span className="input-icon">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem 0.5rem 2.25rem' }}
            placeholder="Search by student name or enrollment no..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter by Course */}
        <div className="input-wrapper">
          <span className="input-icon">
            <Filter size={16} />
          </span>
          <select
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem 0.5rem 2.25rem' }}
            value={courseFilter}
            onChange={(e) => onCourseFilterChange(e.target.value)}
          >
            <option value="All">All Courses</option>
            {availableCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by dropdown */}
        <div className="input-wrapper">
          <span className="input-icon">
            <ArrowUpDown size={16} />
          </span>
          <select
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem 0.5rem 2.25rem' }}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="enrollment_asc">Enrollment: Low to High</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table or Loading or Empty State */}
      <div>
        {isLoading ? (
          /* Loading Indicator */
          <div
            style={{
              padding: '4rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div
              className="spinner"
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%'
              }}
            ></div>
            <div style={{ fontSize: '0.925rem', fontWeight: 500 }}>
              Querying MongoDB Atlas database...
            </div>
          </div>
        ) : students.length === 0 ? (
          /* Empty State */
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--text-muted)'
              }}
            >
              <AlertCircle size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No students found
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
              {searchQuery || courseFilter !== 'All'
                ? `No student matches your current filter criteria. Try clearing search or selecting a different course.`
                : `No student records are currently in the database. Use the form above to add your first student record.`}
            </p>
            {(searchQuery || courseFilter !== 'All') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onSearchChange('');
                  onCourseFilterChange('All');
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          /* Table View */
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Enrollment No</th>
                  <th>Course / Program</th>
                  <th>Admission Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <StudentRow
                    key={student._id || student.enrollmentNo}
                    student={student}
                    onEdit={onEditStudent}
                    onDelete={onDeleteStudent}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Table Footer */}
      {!isLoading && students.length > 0 && (
        <div
          style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            Showing <strong>{students.length}</strong> active records from cloud database
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <UserCheck size={14} color="var(--success)" />
            <span>MongoDB Atlas Synced</span>
          </div>
        </div>
      )}
    </div>
  );
}
