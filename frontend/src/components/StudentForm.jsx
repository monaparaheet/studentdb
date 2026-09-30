import React, { useState, useEffect } from 'react';
import { User, Hash, BookOpen, Mail, UserPlus, Save, X, Sparkles } from 'lucide-react';

const COMMON_COURSES = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Machine Learning',
  'Cloud Computing & DevOps',
  'Data Science & Big Data',
  'Cyber Security & Forensics',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering'
];

export default function StudentForm({ onSubmit, editingStudent, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNo: '',
    course: '',
    email: ''
  });

  const [customCourse, setCustomCourse] = useState(false);
  const [errors, setErrors] = useState({});

  // When editingStudent prop changes, populate form
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        enrollmentNo: editingStudent.enrollmentNo || '',
        course: editingStudent.course || '',
        email: editingStudent.email || ''
      });
      // Check if course is in preset list
      if (editingStudent.course && !COMMON_COURSES.includes(editingStudent.course)) {
        setCustomCourse(true);
      } else {
        setCustomCourse(false);
      }
      setErrors({});
    } else {
      setFormData({
        name: '',
        enrollmentNo: '',
        course: '',
        email: ''
      });
      setCustomCourse(false);
      setErrors({});
    }
  }, [editingStudent]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.enrollmentNo.trim()) {
      newErrors.enrollmentNo = 'Enrollment Number is required';
    } else if (formData.enrollmentNo.trim().length < 3) {
      newErrors.enrollmentNo = 'Enrollment No must be at least 3 characters';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Please select or enter a course';
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email (e.g., student@university.edu)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Auto-uppercase enrollment number
    if (name === 'enrollmentNo') {
      formattedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for field on type
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCourseSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setCustomCourse(true);
      setFormData((prev) => ({ ...prev, course: '' }));
    } else {
      setCustomCourse(false);
      setFormData((prev) => ({ ...prev, course: val }));
    }

    if (errors.course) {
      setErrors((prev) => ({ ...prev, course: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      enrollmentNo: formData.enrollmentNo.trim().toUpperCase(),
      course: formData.course.trim(),
      email: formData.email.trim().toLowerCase()
    });
  };

  return (
    <div className="card" id="student-form-card" style={{ marginBottom: '2rem' }}>
      <div className="card-header" style={{ background: editingStudent ? '#fffbeb' : '#ffffff' }}>
        <div className="card-title">
          {editingStudent ? (
            <>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--warning)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Save size={16} />
              </div>
              <div>
                <span>Edit Student Record</span>
                <span
                  className="badge badge-mono"
                  style={{ marginLeft: '0.5rem', background: '#fef3c7', color: '#92400e' }}
                >
                  {editingStudent.enrollmentNo}
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UserPlus size={16} />
              </div>
              <span>Register New Student</span>
            </>
          )}
        </div>

        {editingStudent && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancelEdit}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
          >
            <X size={14} />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Student Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="name">
                Student Name <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <User size={18} />
                </span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>
              {errors.name && <div className="form-error-text">{errors.name}</div>}
            </div>

            {/* Enrollment Number */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="enrollmentNo">
                Enrollment Number <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Hash size={18} />
                </span>
                <input
                  id="enrollmentNo"
                  type="text"
                  name="enrollmentNo"
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                  placeholder="e.g. CS2026001"
                  value={formData.enrollmentNo}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>
              {errors.enrollmentNo && <div className="form-error-text">{errors.enrollmentNo}</div>}
            </div>

            {/* Course */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="course">
                Course / Program <span className="required">*</span>
              </label>
              {!customCourse ? (
                <div className="input-wrapper">
                  <span className="input-icon">
                    <BookOpen size={18} />
                  </span>
                  <select
                    id="course"
                    name="course"
                    className="form-select"
                    value={formData.course}
                    onChange={handleCourseSelectChange}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Select Course --</option>
                    {COMMON_COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Enter Custom Course...</option>
                  </select>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <span className="input-icon">
                      <BookOpen size={18} />
                    </span>
                    <input
                      type="text"
                      name="course"
                      className="form-input"
                      placeholder="e.g. Biotechnology"
                      value={formData.course}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setCustomCourse(false);
                      setFormData((p) => ({ ...p, course: '' }));
                    }}
                    title="Choose from standard list"
                  >
                    List
                  </button>
                </div>
              )}
              {errors.course && <div className="form-error-text">{errors.course}</div>}
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="e.g. student@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>
              {errors.email && <div className="form-error-text">{errors.email}</div>}
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            {editingStudent && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: '160px' }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner"
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%'
                    }}
                  ></span>
                  <span>{editingStudent ? 'Updating...' : 'Saving Record...'}</span>
                </>
              ) : editingStudent ? (
                <>
                  <Save size={16} />
                  <span>Update Student</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Submit & Save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
