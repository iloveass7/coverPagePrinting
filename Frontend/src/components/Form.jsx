import React, { useState, useEffect } from 'react';
import { api } from '../config/api';

// Loading Modal Component
const LoadingModal = ({ isOpen, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-8 max-w-2xl w-full mx-4">
                <div className="flex flex-col items-center">
                    {/* Spinning Animation */}
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600 mb-4"></div>

                    {/* Loading Message */}
                    <h3 className="text-[1.5rem] font-semibold text-gray-800 mb-2">Processing...</h3>
                    <p className="text-gray-600 text-center text-[1.1rem]">{message}</p>
                </div>
            </div>
        </div>
    );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, message, token }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 max-w-2xl w-full mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-white">Success!</h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl font-bold leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p className="text-gray-800 text-xl">{message}</p>
                    </div>

                    {token && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-xl text-gray-600 mb-2">Your Print Token:</p>
                            <div className="bg-white border border-gray-300 rounded px-3 py-2">
                                <code className="text-xl font-bold text-green-700 tracking-wider">{token}</code>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Form = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        labGroup: '',
        department: '',
        program: '',
        courseNo: '',
        courseTitle: '',
        assignmentNo: '',
        assignmentName: '',
        dateOfSubmission: '',
        submittedTo: '',
        teacherDepartment: ''
    });

    const [loading, setLoading] = useState({
        pdf: false,
        docx: false,
        email: false
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [modalState, setModalState] = useState({
        isOpen: false,
        message: '',
        token: ''
    });

    // Loading modal state
    const [loadingModal, setLoadingModal] = useState({
        isOpen: false,
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    const mapFormDataToBackend = () => {
        const backendData = {
            name: formData.studentName,
            studentId: formData.studentId,
            department: formData.department,
            program: 'Bachelor of Science',
            labGroup: formData.labGroup,
            courseNo: formData.courseNo || null,
            courseTitle: formData.courseTitle || null,
            assignmentNo: formData.assignmentNo,
            assignmentName: formData.assignmentName || null,
            submissionDate: formData.dateOfSubmission,
            teacher: {
                name: formData.submittedTo,
                department: formData.teacherDepartment || formData.department
            }
        };

        console.log('🔄 Form data mapped for backend:', JSON.stringify(backendData, null, 2));
        return backendData;
    };

    // Client-side validation
    const validateForm = () => {
        const errors = [];

        const requiredFields = [
            { field: 'studentName', backendField: 'name', label: 'Student Name' },
            { field: 'studentId', backendField: 'studentId', label: 'Student ID' },
            { field: 'department', backendField: 'department', label: 'Department' },
            { field: 'labGroup', backendField: 'labGroup', label: 'Lab Group' },
            { field: 'assignmentNo', backendField: 'assignmentNo', label: 'Assignment No' },
            { field: 'dateOfSubmission', backendField: 'submissionDate', label: 'Date of Submission' },
            { field: 'submittedTo', backendField: 'teacher', label: 'Submitted To (Teacher Name)' }
        ];

        // Check for missing required fields
        requiredFields.forEach(({ field, label }) => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                errors.push(`${label} is required`);
            }
        });

        // Validate Student ID format
        if (formData.studentId && !/^[a-zA-Z0-9-]+$/.test(formData.studentId)) {
            errors.push('Student ID should contain only letters, numbers, and hyphens');
        }

        // Validate name length
        if (formData.studentName) {
            if (formData.studentName.length < 2) {
                errors.push('Name must be at least 2 characters long');
            }
            if (formData.studentName.length > 100) {
                errors.push('Name must not exceed 100 characters');
            }
        }

        // Validate optional fields
        if (formData.courseTitle && formData.courseTitle.length > 200) {
            errors.push('Course title must not exceed 200 characters');
        }

        if (formData.assignmentName && formData.assignmentName.length > 200) {
            errors.push('Assignment name must not exceed 200 characters');
        }

        // Validate date format
        if (formData.dateOfSubmission) {
            const datePattern = /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/;
            const isValidDateFormat = datePattern.test(formData.dateOfSubmission) ||
                !isNaN(Date.parse(formData.dateOfSubmission));

            if (!isValidDateFormat) {
                errors.push('Invalid date format for submission date');
            }
        }

        // Display errors
        if (errors.length > 0) {
            setError(errors.join('. '));
            return false;
        }

        return true;
    };

    // Sanitize input data 
    const sanitizeFormData = () => {
        const sanitized = {};

        for (const key in formData) {
            if (typeof formData[key] === 'string') {
                sanitized[key] = formData[key].trim().replace(/[<>]/g, '');
            } else {
                sanitized[key] = formData[key];
            }
        }

        return sanitized;
    };

    // Generic API call function
    const makeAPICall = async (endpoint, action) => {
        console.log(`🚀 ${action} process started`);

        if (!validateForm()) {
            console.log('❌ Client-side validation failed');
            return null;
        }

        const loadingKey = action.toLowerCase();

        // Show loading modal with message
        setLoadingModal({
            isOpen: true,
            message: action === 'PDF'
                ? 'Generating PDF document...'
                : action === 'DOCX'
                    ? 'Generating Word document...'
                    : 'Sending to print shop...',
        });

        setLoading(prev => ({ ...prev, [loadingKey]: true }));
        setError('');
        setSuccess('');

        // Enforce a 2–3s delay before executing the API request
        const delayMs = 2200; // 2.2 seconds
        await new Promise(res => setTimeout(res, delayMs));

        try {
            const originalFormData = { ...formData };
            const sanitizedData = sanitizeFormData();
            Object.assign(formData, sanitizedData);
            const backendData = mapFormDataToBackend();
            Object.assign(formData, originalFormData);

            console.log(`📡 Making ${action} request to: ${endpoint}`);
            console.log('📦 Sanitized payload:', JSON.stringify(backendData, null, 2));

            const { data } = await api.post(endpoint, backendData, {
                responseType: endpoint.includes('pdf') || endpoint.includes('docx') ? 'blob' : 'json',
            });

            console.log(`✅ ${action} request successful`);
            return { data };
        } catch (error) {
            console.error(`🚨 Network/API Error for ${action}:`, error);

            if (error.response?.data) {
                let errorMessage = `Server error: ${error.response.status}`;
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    errorMessage = error.response.data.errors.join('. ');
                } else {
                    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                }
                setError(errorMessage);
            } else {
                setError(error.message || `${action} failed`);
            }
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
            setLoadingModal({ isOpen: false, message: '' });
        }
    };

    const handleDownloadPDF = async () => {
        console.log('📄 PDF Download initiated');

        try {
            setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }, 50);
        } catch (e) {
            console.log('Scroll failed:', e);
        }

        try {
            const result = await makeAPICall('/cover/download/pdf', 'PDF');
            if (!result?.data) return;
            const data = result.data;

            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `assignment_cover_${formData.studentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess('PDF downloaded successfully!');
        } catch (error) {
            console.error('❌ PDF download failed:', error);
        }
    };

    const handleDownloadDOCX = async () => {
        console.log('📄 DOCX Download initiated');

        try {
            setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }, 50);
        } catch (e) {
            console.log('Scroll failed:', e);
        }

        try {
            const result = await makeAPICall('/cover/download/docx', 'DOCX');
            if (!result?.data) return;
            const data = result.data;

            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `assignment_cover_${formData.studentId}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess('DOCX downloaded successfully!');
        } catch (error) {
            console.error('❌ DOCX download failed:', error);
        }
    };

    const handleSendToShop = async () => {
        console.log('📧 Send to Print Shop initiated');

        try {
            setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }, 50);
        } catch (e) {
            console.log('Scroll failed:', e);
        }

        try {
            const result = await makeAPICall('/cover/send-to-shop', 'EMAIL');
            if (!result?.data) return;
            const data = result.data;

            if (data.success && data.token) {
                setModalState({
                    isOpen: true,
                    message: 'Email sent successfully!',
                    token: data.token
                });
            } else {
                throw new Error(data.message || 'Email sending failed');
            }
        } catch (error) {
            console.error('❌ Send to shop failed:', error);
        }
    };

    // Close modal handler
    const closeModal = () => {
        setModalState({
            isOpen: false,
            message: '',
            token: ''
        });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="max-w-8xl">
            {/* Loading Modal */}
            <LoadingModal
                isOpen={loadingModal.isOpen}
                message={loadingModal.message}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                message={modalState.message}
                token={modalState.token}
            />

            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden">
                {/* Browser Header Bar */}
                <div className="bg-[#1A1B1B] border-b border-gray-300 px-4 py-4 flex items-center justify-between">
                    <div className="pl-5 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 cursor-pointer"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 cursor-pointer"></div>
                    </div>
                    <div className="mr-3 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-400 hover:bg-green-600 cursor-pointer flex items-center justify-center rounded-sm">
                            <span className="text-lg text-white font-bold">−</span>
                        </div>
                        <div className="w-6 h-6 bg-gray-400 hover:bg-red-600 cursor-pointer flex items-center justify-center rounded-sm">
                            <span className="text-lg text-white font-bold">×</span>
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-600 p-4 m-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-lg font-semibold text-red-900">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-600 p-4 m-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-lg font-semibold text-green-900">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Two Column Layout Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-3">

                    {/* Left Column - Form Fields */}
                    <div className="bg-white text-gray-800 p-8 px-12 border-r border-gray-200">
                        {/* Student Information Section */}
                        <div className="mb-6">
                            <h2 className="text-[1.8rem] font-bold mb-2 text-gray-800">Student Information</h2>
                            <p className="text-gray-600 text-xl mb-8">Enter your personal and academic details</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">
                                        Student Name
                                    </label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        maxLength={100}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleInputChange}
                                        pattern="[a-zA-Z0-9-]+"
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Enter your student ID"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="e.g., XX Engineering"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">Lab Group</label>
                                    <input
                                        type="text"
                                        name="labGroup"
                                        value={formData.labGroup}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 mb-2"
                                        placeholder="e.g., A2, B1, C3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Course Information Section */}
                        <div className="mb-6">
                            <h2 className="text-[1.8rem] font-bold mb-2 text-gray-800">Course Information</h2>
                            <p className="text-gray-600 text-xl mb-8">Enter course and assignment details</p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg mb-2 text-gray-700">Course No</label>
                                        <input
                                            type="text"
                                            name="courseNo"
                                            value={formData.courseNo}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            placeholder="e.g., XXX 1111"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-lg mb-2 text-gray-700">Assignment No *</label>
                                        <input
                                            type="text"
                                            name="assignmentNo"
                                            value={formData.assignmentNo}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            placeholder="e.g., XX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        name="courseTitle"
                                        value={formData.courseTitle}
                                        onChange={handleInputChange}
                                        maxLength={200}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="e.g., XXX Lab"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">
                                        Assignment Name
                                        <span className="text-sm text-gray-500">    (optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="assignmentName"
                                        value={formData.assignmentName}
                                        onChange={handleInputChange}
                                        maxLength={200}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Enter assignment name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">Date of Submission</label>
                                    <input
                                        type="date"
                                        name="dateOfSubmission"
                                        value={formData.dateOfSubmission}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 mb-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Teacher Information Section */}
                        <div>
                            <h2 className="text-[2.2rem] font-bold mb-2 text-gray-800">Teacher Information</h2>
                            <p className="text-gray-600 text-xl mb-6">Enter teacher and department details</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">
                                        Submitted To (Teacher Name)
                                    </label>
                                    <input
                                        type="text"
                                        name="submittedTo"
                                        value={formData.submittedTo}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Enter teacher's name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-gray-700">Teacher's Department
                                        <span className="text-sm text-gray-500">    (will be set to default Department if not filled)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="teacherDepartment"
                                        value={formData.teacherDepartment}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="e.g., Department of XXX, AUST"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview and Buttons */}
                    <div className="bg-white p-8 px-10">
                        {/* Preview Section */}
                        <div className="mb-6">
                            <h2 className="text-[2.2rem] font-bold mb-2 text-gray-800">Preview</h2>
                            <p className="text-gray-600 text-xl mb-6">Review your assignment cover page before generating</p>

                            {/* Assignment Cover Page Preview */}
                            <div className="bg-white border border-gray-300 rounded p-12 shadow-inner h-[1080px] overflow-y-auto">
                                <div className="flex flex-col h-full">
                                    {/* University Logo */}
                                    <div className="text-center mt-2 mb-8">
                                        <img
                                            src="/austLogo.png"
                                            alt="AUST Logo"
                                            className="mx-auto h-34 w-auto object-contain"
                                        />
                                    </div>

                                    {/* University Header */}
                                    <div className="text-center mb-12">
                                        <h1 className="text-[1.4rem] font-bold text-black mb-5 leading-relaxed">
                                            Ahsanullah University of Science and Technology
                                        </h1>
                                        <h2 className="text-[1.1rem] font-semibold text-black mb-3 leading-relaxed">
                                            Department of {formData.department || 'XXX'}
                                        </h2>
                                    </div>

                                    {/* Course Information */}
                                    <div className="text-left space-y-4 mb-19">
                                        <div className="flex leading-relaxed">
                                            <span className="font-bold text-black w-38 text-lg">Course No:</span>
                                            <span className="text-black text-lg">{formData.courseNo || 'Your course number'}</span>
                                        </div>

                                        <div className="flex leading-relaxed">
                                            <span className="font-bold text-black w-38 text-lg">Course Title:</span>
                                            <span className="text-black text-lg">{formData.courseTitle || 'Your course title'}</span>
                                        </div>

                                        <div className="flex leading-relaxed">
                                            <span className="font-bold text-black w-38 text-lg">Assignment No:</span>
                                            <span className="text-black text-lg">{formData.assignmentNo || 'Your assignment number'}</span>
                                        </div>

                                        {formData.assignmentName && (
                                            <div className="flex leading-relaxed">
                                                <span className="font-bold text-black w-46 text-lg">Assignment Name:</span>
                                                <span className="text-black text-lg">{formData.assignmentName}</span>
                                            </div>
                                        )}

                                        <div className="flex leading-relaxed">
                                            <span className="font-bold text-black w-46 text-lg">Date of Submission:</span>
                                            <span className="text-black text-lg">
                                                {formData.dateOfSubmission ?
                                                    new Date(formData.dateOfSubmission).toLocaleDateString('en-GB') :
                                                    'Your selected date'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submitted To Section */}
                                    <div className="text-left mb-19">
                                        <h4 className="font-bold text-black mb-4 text-lg">Submitted To:</h4>
                                        <div className="ml-6 space-y-2">
                                            <p className="text-black font-semibold text-lg leading-relaxed">
                                                {formData.submittedTo || "Designated Teacher's Name"}
                                            </p>
                                            <p className="text-black text-lg leading-relaxed">
                                                {formData.teacherDepartment || "Designated Teacher's Department"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submitted By Section */}
                                    <div className="flex-grow flex flex-col">
                                        <div className="text-left">
                                            <h4 className="font-bold text-black mb-4 text-lg">Submitted By:</h4>
                                            <div className="ml-6 space-y-2">
                                                <p className="text-black font-semibold text-lg leading-relaxed">
                                                    {formData.studentName || 'Your Student Name'}
                                                </p>
                                                <p className="text-black text-lg leading-relaxed">
                                                    ID: {formData.studentId || 'Your Student ID'}
                                                </p>
                                                <p className="text-black text-lg leading-relaxed">
                                                    Lab Group: {formData.labGroup || 'Your Lab Group'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Buttons Section */}
                        <div className="space-y-3">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={loading.pdf || loadingModal.isOpen}
                                className="w-full px-3 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-red-600 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-[1.0rem] font-medium flex items-center justify-center"
                            >
                                Download PDF
                            </button>

                            <button
                                onClick={handleDownloadDOCX}
                                disabled={loading.docx || loadingModal.isOpen}
                                className="w-full px-3 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-blue-700 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-[1.0rem] font-medium flex items-center justify-center"
                            >
                                Download Word
                            </button>

                            <button
                                onClick={handleSendToShop}
                                disabled={loading.email || loadingModal.isOpen}
                                className="w-full px-3 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-green-700 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-[1.0rem] font-medium flex items-center justify-center"
                            >
                                Send to Print Shop
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;