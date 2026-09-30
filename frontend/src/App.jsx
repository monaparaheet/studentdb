import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import CloudArchitectureModal from './components/CloudArchitectureModal';
import { studentApi } from './services/api';

export default function App() {
  // State variables
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit and Delete targets
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Server & Health status
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'checking' | 'offline'
  const [dbProvider, setDbProvider] = useState('Neon PostgreSQL');

  // Modals & Toasts
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = useCallback((type, message, title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all students from backend REST API
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await studentApi.getStudents({
        search: searchQuery,
        course: courseFilter,
        sort: sortBy
      });

      if (res.success) {
        setStudents(res.data || []);
        setServerStatus('online');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setServerStatus('offline');
      addToast(
        'error',
        err.message || 'Could not fetch students from the server. Verify your backend is running.',
        'Connection Error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, courseFilter, sortBy, addToast]);

  // Initial load
  useEffect(() => {
    fetchStudents();
    studentApi.checkHealth().then((h) => {
      if (h.database) setDbProvider(h.database);
    }).catch(() => {});
  }, [fetchStudents]);

  // Check health manually
  const handleCheckHealth = async () => {
    setServerStatus('checking');
    try {
      const health = await studentApi.checkHealth();
      setServerStatus('online');
      if (health.database) setDbProvider(health.database);
      addToast('success', `Backend server is running and connected to ${health.database || 'Database'}!`, 'Status Healthy');
      fetchStudents();
    } catch (err) {
      setServerStatus('offline');
      addToast('error', 'Cannot reach backend server. Check backend terminal or Vercel logs.', 'Status Check Failed');
    }
  };

  // Submit Student Form (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // UPDATE Existing Student
        const res = await studentApi.updateStudent(editingStudent._id, formData);
        if (res.success) {
          addToast(
            'success',
            `Student '${formData.name}' (${formData.enrollmentNo}) has been updated.`,
            'Updated Successfully'
          );
          setEditingStudent(null);
          fetchStudents();
        }
      } else {
        // CREATE New Student
        const res = await studentApi.createStudent(formData);
        if (res.success) {
          addToast(
            'success',
            `Student '${formData.name}' with ID ${formData.enrollmentNo} added to MongoDB.`,
            'Registration Successful'
          );
          fetchStudents();
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      addToast(
        'error',
        err.message || 'Failed to save student record.',
        editingStudent ? 'Update Failed' : 'Registration Failed'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Edit
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    // Smoothly scroll to the form card for great user experience
    const formElement = document.getElementById('student-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Trigger Delete confirmation dialog
  const handleDeleteRequest = (student) => {
    setStudentToDelete(student);
  };

  // Confirm and perform Delete
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      const res = await studentApi.deleteStudent(studentToDelete._id);
      if (res.success) {
        addToast(
          'success',
          `Student '${studentToDelete.name}' has been deleted from MongoDB Atlas.`,
          'Record Deleted'
        );
        // If we were editing this student, cancel edit mode
        if (editingStudent && editingStudent._id === studentToDelete._id) {
          setEditingStudent(null);
        }
        setStudentToDelete(null);
        fetchStudents();
      }
    } catch (err) {
      console.error('Delete error:', err);
      addToast('error', err.message || 'Failed to delete student.', 'Deletion Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    setStudentToDelete(null);
  };

  // Extract unique courses for filtering
  const availableCourses = useMemo(() => {
    const defaultList = [
      'Computer Science & Engineering',
      'Artificial Intelligence & Machine Learning',
      'Cloud Computing & DevOps',
      'Data Science & Big Data',
      'Cyber Security & Forensics',
      'Information Technology'
    ];
    const fromStudents = students.map((s) => s.course).filter(Boolean);
    return Array.from(new Set([...defaultList, ...fromStudents])).sort();
  }, [students]);

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation */}
      <Navbar
        serverStatus={serverStatus}
        onCheckHealth={handleCheckHealth}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Container */}
      <main className="main-content">
        {/* Statistics Overview */}
        <StatsCards
          totalStudents={students.length}
          courseCount={availableCourses.length}
          serverStatus={serverStatus}
          dbProvider={dbProvider}
        />

        {/* Student Registration / Edit Form */}
        <StudentForm
          onSubmit={handleFormSubmit}
          editingStudent={editingStudent}
          onCancelEdit={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

        {/* Student Records List / Table */}
        <StudentList
          students={students}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          courseFilter={courseFilter}
          onCourseFilterChange={setCourseFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={fetchStudents}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteRequest}
          availableCourses={availableCourses}
        />
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Delete Student Record"
        student={studentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />

      {/* Cloud Architecture Info Modal */}
      <CloudArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ margin: 0 }}>
            <strong>Student Information Portal</strong> • Full-Stack Cloud Computing Practical Assignment
          </p>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Built with <strong>React.js (Vercel)</strong>, <strong>Node.js & Express (Render)</strong>, and{' '}
            <strong>MongoDB Atlas (Cloud DBaaS)</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
