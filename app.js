// Student-Teacher Booking Appointment System
// Main Application Logic

// Global state management
let currentUser = null;
let currentRole = null;
let selectedTeacher = null;

// Sample data storage (simulating Firebase)
let systemData = {
    users: [
        { id: 'admin1', email: 'admin@demo.com', password: 'password', role: 'admin', name: 'System Admin', approved: true },
        { id: 'teacher1', email: 'john.smith@school.edu', password: 'password', role: 'teacher', name: 'Dr. John Smith', department: 'Computer Science', subject: 'JavaScript, Python, Database', phone: '+1-555-0101', approved: true },
        { id: 'teacher2', email: 'sarah.johnson@school.edu', password: 'password', role: 'teacher', name: 'Prof. Sarah Johnson', department: 'Mathematics', subject: 'Calculus, Statistics, Algebra', phone: '+1-555-0102', approved: true },
        { id: 'student1', email: 'alice.wilson@student.edu', password: 'password', role: 'student', name: 'Alice Wilson', department: 'Computer Science', phone: '+1-555-0201', approved: true },
        { id: 'student2', email: 'bob.jones@student.edu', password: 'password', role: 'student', name: 'Bob Jones', department: 'Mathematics', phone: '+1-555-0202', approved: false }
    ],
    appointments: [
        { id: 'apt1', studentId: 'student1', teacherId: 'teacher1', date: '2025-08-18', time: '10:00', status: 'pending', purpose: 'Project Discussion', message: 'Need help with my final project' },
        { id: 'apt2', studentId: 'student1', teacherId: 'teacher2', date: '2025-08-19', time: '14:00', status: 'approved', purpose: 'Math Tutoring', message: 'Statistics homework questions' }
    ],
    availability: {
        'teacher1': { monday: '09:00-12:00,14:00-17:00', tuesday: '10:00-13:00,15:00-18:00', wednesday: '09:00-12:00', thursday: '10:00-13:00,15:00-18:00', friday: '09:00-12:00,14:00-16:00' },
        'teacher2': { monday: '08:00-11:00,13:00-16:00', tuesday: '09:00-12:00,14:00-17:00', wednesday: '08:00-11:00', thursday: '09:00-12:00,14:00-17:00', friday: '08:00-11:00,13:00-15:00' }
    },
    messages: [
        { id: 'msg1', senderId: 'student1', receiverId: 'teacher1', content: 'Hello Professor, I need help with the assignment', timestamp: '2025-08-15T10:00:00Z', read: false }
    ]
};

// Utility functions
function logAction(action, details = '') {
    const timestamp = new Date().toISOString();
    const user = currentUser ? `${currentUser.name} (${currentUser.role})` : 'Anonymous';
    console.log(`[${timestamp}] ${user}: ${action}${details ? ' - ' + details : ''}`);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="font-weight: 500;">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
    
    logAction('Toast notification', `${type}: ${message}`);
}

function showLoading() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingIndicator').classList.add('hidden');
}

function generateId(prefix = '') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Page navigation functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    logAction('Page navigation', `Switched to ${pageId}`);
}

function showLanding() {
    showPage('landingPage');
    currentUser = null;
    currentRole = null;
}

function showLogin(role) {
    currentRole = role;
    showPage('loginPage');
    document.getElementById('loginTitle').textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
    
    // Show/hide register link based on role
    const registerLink = document.getElementById('registerLink');
    registerLink.style.display = role === 'student' ? 'block' : 'none';
    
    logAction('Login page accessed', `Role: ${role}`);
}

function showRegister() {
    showPage('registerPage');
    logAction('Registration page accessed');
}

// Authentication functions
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading();
    
    // Simulate API delay
    setTimeout(() => {
        const user = systemData.users.find(u => 
            u.email === email && 
            u.password === password && 
            u.role === currentRole &&
            u.approved
        );
        
        hideLoading();
        
        if (user) {
            currentUser = user;
            logAction('Login successful', `User: ${user.email}, Role: ${user.role}`);
            showToast('Login successful!', 'success');
            
            // Navigate to appropriate dashboard
            switch (user.role) {
                case 'admin':
                    showPage('adminDashboard');
                    document.getElementById('adminUserName').textContent = user.name;
                    loadAdminData();
                    break;
                case 'teacher':
                    showPage('teacherDashboard');
                    document.getElementById('teacherUserName').textContent = user.name;
                    loadTeacherData();
                    break;
                case 'student':
                    showPage('studentDashboard');
                    document.getElementById('studentUserName').textContent = user.name;
                    loadStudentData();
                    break;
            }
        } else {
            logAction('Login failed', `Email: ${email}, Role: ${currentRole}`);
            showToast('Invalid credentials or account not approved', 'error');
        }
    }, 1000);
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        department: document.getElementById('regDepartment').value,
        password: document.getElementById('regPassword').value
    };
    
    showLoading();
    
    setTimeout(() => {
        // Check if email already exists
        const existingUser = systemData.users.find(u => u.email === formData.email);
        
        hideLoading();
        
        if (existingUser) {
            showToast('Email already registered', 'error');
            return;
        }
        
        // Create new student user
        const newUser = {
            id: generateId('student_'),
            ...formData,
            role: 'student',
            approved: false
        };
        
        systemData.users.push(newUser);
        
        logAction('Student registration', `New user: ${formData.name} (${formData.email})`);
        showToast('Registration submitted! Waiting for admin approval.', 'info');
        showLogin('student');
    }, 1000);
});

function logout() {
    logAction('Logout', `User: ${currentUser.email}`);
    currentUser = null;
    currentRole = null;
    showLanding();
    showToast('Logged out successfully', 'info');
}

// Tab management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    logAction('Tab switched', `Tab: ${tabName}`);
}

function showTeacherTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'appointments') {
        loadTeacherAppointments();
    } else if (tabName === 'messages') {
        loadTeacherMessages();
    }
    
    logAction('Teacher tab switched', `Tab: ${tabName}`);
}

function showStudentTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'book') {
        loadTeachersForBooking();
    } else if (tabName === 'appointments') {
        loadStudentAppointments();
    } else if (tabName === 'messages') {
        loadStudentMessages();
    }
    
    logAction('Student tab switched', `Tab: ${tabName}`);
}

// Admin functions
function loadAdminData() {
    loadTeachers();
    loadStudents();
    loadAllAppointments();
    loadReports();
}

function loadTeachers() {
    const teachers = systemData.users.filter(u => u.role === 'teacher');
    const grid = document.getElementById('teachersGrid');
    
    grid.innerHTML = teachers.map(teacher => `
        <div class="data-item">
            <div class="data-item-header">
                <h4 class="data-item-title">${teacher.name}</h4>
                <div class="data-item-actions">
                    <button class="action-btn edit" onclick="editTeacher('${teacher.id}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteTeacher('${teacher.id}')">Delete</button>
                </div>
            </div>
            <div class="data-item-content">
                <p><strong>Email:</strong> ${teacher.email}</p>
                <p><strong>Department:</strong> ${teacher.department}</p>
                <p><strong>Subjects:</strong> ${teacher.subject}</p>
                <p><strong>Phone:</strong> ${teacher.phone}</p>
            </div>
        </div>
    `).join('');
    
    logAction('Teachers data loaded', `Count: ${teachers.length}`);
}

function loadStudents() {
    const students = systemData.users.filter(u => u.role === 'student');
    const grid = document.getElementById('studentsGrid');
    
    grid.innerHTML = students.map(student => `
        <div class="data-item">
            <div class="data-item-header">
                <h4 class="data-item-title">${student.name}</h4>
                <div class="data-item-actions">
                    <span class="status-badge ${student.approved ? 'approved' : 'pending'}">
                        ${student.approved ? 'Approved' : 'Pending'}
                    </span>
                    ${!student.approved ? `<button class="action-btn approve" onclick="approveStudent('${student.id}')">Approve</button>` : ''}
                    <button class="action-btn delete" onclick="deleteStudent('${student.id}')">Delete</button>
                </div>
            </div>
            <div class="data-item-content">
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Department:</strong> ${student.department || 'N/A'}</p>
                <p><strong>Phone:</strong> ${student.phone}</p>
            </div>
        </div>
    `).join('');
    
    logAction('Students data loaded', `Count: ${students.length}`);
}

function loadAllAppointments() {
    const grid = document.getElementById('appointmentsGrid');
    
    grid.innerHTML = systemData.appointments.map(apt => {
        const student = systemData.users.find(u => u.id === apt.studentId);
        const teacher = systemData.users.find(u => u.id === apt.teacherId);
        
        return `
            <div class="data-item">
                <div class="data-item-header">
                    <h4 class="data-item-title">${apt.purpose}</h4>
                    <div class="data-item-actions">
                        <span class="status-badge ${apt.status}">${apt.status.toUpperCase()}</span>
                        <button class="action-btn delete" onclick="deleteAppointment('${apt.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Student:</strong> ${student?.name || 'Unknown'}</p>
                    <p><strong>Teacher:</strong> ${teacher?.name || 'Unknown'}</p>
                    <p><strong>Date:</strong> ${apt.date}</p>
                    <p><strong>Time:</strong> ${apt.time}</p>
                    <p><strong>Message:</strong> ${apt.message}</p>
                </div>
            </div>
        `;
    }).join('');
    
    logAction('All appointments loaded', `Count: ${systemData.appointments.length}`);
}

function loadReports() {
    const totalTeachers = systemData.users.filter(u => u.role === 'teacher').length;
    const totalStudents = systemData.users.filter(u => u.role === 'student' && u.approved).length;
    const pendingStudents = systemData.users.filter(u => u.role === 'student' && !u.approved).length;
    const totalAppointments = systemData.appointments.length;
    const pendingAppointments = systemData.appointments.filter(a => a.status === 'pending').length;
    const approvedAppointments = systemData.appointments.filter(a => a.status === 'approved').length;
    
    document.getElementById('statsContent').innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${totalTeachers}</span>
            <div class="stat-label">Teachers</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${totalStudents}</span>
            <div class="stat-label">Students</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${pendingStudents}</span>
            <div class="stat-label">Pending Approvals</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${totalAppointments}</span>
            <div class="stat-label">Total Appointments</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${pendingAppointments}</span>
            <div class="stat-label">Pending Appointments</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${approvedAppointments}</span>
            <div class="stat-label">Approved Appointments</div>
        </div>
    `;
    
    logAction('Reports loaded', 'System statistics updated');
}

// Teacher functions
function loadTeacherData() {
    loadTeacherSchedule();
    loadTeacherAppointments();
}

function loadTeacherSchedule() {
    const availability = systemData.availability[currentUser.id] || {};
    const grid = document.getElementById('scheduleGrid');
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    grid.innerHTML = days.map(day => `
        <div class="schedule-day">
            <h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4>
            <div class="schedule-times">
                ${availability[day] || 'Not available'}
            </div>
        </div>
    `).join('');
    
    logAction('Teacher schedule loaded', `Teacher: ${currentUser.name}`);
}

function loadTeacherAppointments() {
    const appointments = systemData.appointments.filter(apt => apt.teacherId === currentUser.id);
    const grid = document.getElementById('teacherAppointmentsGrid');
    
    grid.innerHTML = appointments.map(apt => {
        const student = systemData.users.find(u => u.id === apt.studentId);
        
        return `
            <div class="data-item">
                <div class="data-item-header">
                    <h4 class="data-item-title">${apt.purpose}</h4>
                    <div class="data-item-actions">
                        <span class="status-badge ${apt.status}">${apt.status.toUpperCase()}</span>
                        ${apt.status === 'pending' ? `
                            <button class="action-btn approve" onclick="approveAppointment('${apt.id}')">Approve</button>
                            <button class="action-btn reject" onclick="rejectAppointment('${apt.id}')">Reject</button>
                        ` : ''}
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Student:</strong> ${student?.name || 'Unknown'}</p>
                    <p><strong>Date:</strong> ${apt.date}</p>
                    <p><strong>Time:</strong> ${apt.time}</p>
                    <p><strong>Message:</strong> ${apt.message}</p>
                </div>
            </div>
        `;
    }).join('');
    
    logAction('Teacher appointments loaded', `Count: ${appointments.length}`);
}

function loadTeacherMessages() {
    const messages = systemData.messages.filter(msg => msg.receiverId === currentUser.id);
    const grid = document.getElementById('teacherMessagesGrid');
    
    grid.innerHTML = messages.map(msg => {
        const sender = systemData.users.find(u => u.id === msg.senderId);
        
        return `
            <div class="message-item">
                <div class="message-header">
                    <span class="message-sender">${sender?.name || 'Unknown'}</span>
                    <span class="message-time">${new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div class="message-content">${msg.content}</div>
            </div>
        `;
    }).join('');
    
    logAction('Teacher messages loaded', `Count: ${messages.length}`);
}

// Student functions
function loadStudentData() {
    loadTeachersForBooking();
    loadStudentAppointments();
}

function loadTeachersForBooking() {
    const teachers = systemData.users.filter(u => u.role === 'teacher');
    const grid = document.getElementById('teachersForBooking');
    
    grid.innerHTML = teachers.map(teacher => `
        <div class="teacher-card">
            <div class="teacher-info">
                <h4>${teacher.name}</h4>
                <div class="department">${teacher.department}</div>
                <div class="subjects">Subjects: ${teacher.subject}</div>
                <div class="subjects">Phone: ${teacher.phone}</div>
            </div>
            <button class="btn btn--primary" onclick="bookAppointment('${teacher.id}')">Book Appointment</button>
        </div>
    `).join('');
    
    logAction('Teachers for booking loaded', `Count: ${teachers.length}`);
}

function filterTeachers() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const subjectFilter = document.getElementById('subjectFilter').value.toLowerCase();
    
    let teachers = systemData.users.filter(u => u.role === 'teacher');
    
    if (departmentFilter) {
        teachers = teachers.filter(t => t.department === departmentFilter);
    }
    
    if (subjectFilter) {
        teachers = teachers.filter(t => t.subject.toLowerCase().includes(subjectFilter));
    }
    
    const grid = document.getElementById('teachersForBooking');
    grid.innerHTML = teachers.map(teacher => `
        <div class="teacher-card">
            <div class="teacher-info">
                <h4>${teacher.name}</h4>
                <div class="department">${teacher.department}</div>
                <div class="subjects">Subjects: ${teacher.subject}</div>
                <div class="subjects">Phone: ${teacher.phone}</div>
            </div>
            <button class="btn btn--primary" onclick="bookAppointment('${teacher.id}')">Book Appointment</button>
        </div>
    `).join('');
    
    logAction('Teachers filtered', `Department: ${departmentFilter}, Subject: ${subjectFilter}, Results: ${teachers.length}`);
}

function loadStudentAppointments() {
    const appointments = systemData.appointments.filter(apt => apt.studentId === currentUser.id);
    const grid = document.getElementById('studentAppointmentsGrid');
    
    grid.innerHTML = appointments.map(apt => {
        const teacher = systemData.users.find(u => u.id === apt.teacherId);
        
        return `
            <div class="data-item">
                <div class="data-item-header">
                    <h4 class="data-item-title">${apt.purpose}</h4>
                    <div class="data-item-actions">
                        <span class="status-badge ${apt.status}">${apt.status.toUpperCase()}</span>
                        ${apt.status === 'pending' || apt.status === 'approved' ? `
                            <button class="action-btn reject" onclick="cancelAppointment('${apt.id}')">Cancel</button>
                        ` : ''}
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Teacher:</strong> ${teacher?.name || 'Unknown'}</p>
                    <p><strong>Date:</strong> ${apt.date}</p>
                    <p><strong>Time:</strong> ${apt.time}</p>
                    <p><strong>Message:</strong> ${apt.message}</p>
                </div>
            </div>
        `;
    }).join('');
    
    logAction('Student appointments loaded', `Count: ${appointments.length}`);
}

function loadStudentMessages() {
    const messages = systemData.messages.filter(msg => msg.receiverId === currentUser.id);
    const grid = document.getElementById('studentMessagesGrid');
    
    grid.innerHTML = messages.map(msg => {
        const sender = systemData.users.find(u => u.id === msg.senderId);
        
        return `
            <div class="message-item">
                <div class="message-header">
                    <span class="message-sender">${sender?.name || 'Unknown'}</span>
                    <span class="message-time">${new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div class="message-content">${msg.content}</div>
            </div>
        `;
    }).join('');
    
    logAction('Student messages loaded', `Count: ${messages.length}`);
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    
    // Clear form if exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

function showAddTeacherModal() {
    showModal('addTeacherModal');
    logAction('Add teacher modal opened');
}

function showAvailabilityModal() {
    showModal('availabilityModal');
    
    // Load current availability
    const availability = systemData.availability[currentUser.id] || {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    days.forEach(day => {
        if (availability[day]) {
            const times = availability[day].split(',')[0].split('-');
            if (times.length === 2) {
                document.getElementById(day + 'Start').value = times[0];
                document.getElementById(day + 'End').value = times[1];
            }
        }
    });
    
    logAction('Availability modal opened');
}

function bookAppointment(teacherId) {
    selectedTeacher = teacherId;
    const teacher = systemData.users.find(u => u.id === teacherId);
    document.getElementById('bookingModalTitle').textContent = `Book with ${teacher.name}`;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    
    showModal('bookAppointmentModal');
    logAction('Book appointment modal opened', `Teacher: ${teacher.name}`);
}

// Form submissions
document.getElementById('addTeacherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: generateId('teacher_'),
        name: document.getElementById('teacherName').value,
        email: document.getElementById('teacherEmail').value,
        phone: document.getElementById('teacherPhone').value,
        department: document.getElementById('teacherDepartment').value,
        subject: document.getElementById('teacherSubjects').value,
        role: 'teacher',
        password: 'password',
        approved: true
    };
    
    systemData.users.push(formData);
    loadTeachers();
    closeModal('addTeacherModal');
    
    logAction('Teacher added', `Name: ${formData.name}, Email: ${formData.email}`);
    showToast('Teacher added successfully!', 'success');
});

document.getElementById('bookAppointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const appointmentData = {
        id: generateId('apt_'),
        studentId: currentUser.id,
        teacherId: selectedTeacher,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        purpose: document.getElementById('appointmentPurpose').value,
        message: document.getElementById('appointmentMessage').value,
        status: 'pending'
    };
    
    // Check for conflicts
    const conflicts = systemData.appointments.filter(apt => 
        apt.teacherId === selectedTeacher && 
        apt.date === appointmentData.date && 
        apt.time === appointmentData.time &&
        apt.status !== 'cancelled'
    );
    
    if (conflicts.length > 0) {
        showToast('Time slot already booked. Please choose another time.', 'error');
        return;
    }
    
    systemData.appointments.push(appointmentData);
    loadStudentAppointments();
    closeModal('bookAppointmentModal');
    
    const teacher = systemData.users.find(u => u.id === selectedTeacher);
    logAction('Appointment booked', `Teacher: ${teacher.name}, Date: ${appointmentData.date}, Time: ${appointmentData.time}`);
    showToast('Appointment booked successfully! Waiting for teacher approval.', 'success');
});

document.getElementById('availabilityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const availability = {};
    
    days.forEach(day => {
        const start = document.getElementById(day + 'Start').value;
        const end = document.getElementById(day + 'End').value;
        
        if (start && end) {
            availability[day] = `${start}-${end}`;
        }
    });
    
    systemData.availability[currentUser.id] = availability;
    loadTeacherSchedule();
    closeModal('availabilityModal');
    
    logAction('Availability updated', `Days configured: ${Object.keys(availability).length}`);
    showToast('Schedule updated successfully!', 'success');
});

// Action functions
function approveStudent(studentId) {
    const student = systemData.users.find(u => u.id === studentId);
    if (student) {
        student.approved = true;
        loadStudents();
        logAction('Student approved', `Name: ${student.name}, Email: ${student.email}`);
        showToast(`${student.name} has been approved!`, 'success');
    }
}

function deleteStudent(studentId) {
    const student = systemData.users.find(u => u.id === studentId);
    if (student && confirm(`Delete student ${student.name}?`)) {
        systemData.users = systemData.users.filter(u => u.id !== studentId);
        loadStudents();
        logAction('Student deleted', `Name: ${student.name}, Email: ${student.email}`);
        showToast('Student deleted successfully', 'info');
    }
}

function deleteTeacher(teacherId) {
    const teacher = systemData.users.find(u => u.id === teacherId);
    if (teacher && confirm(`Delete teacher ${teacher.name}?`)) {
        systemData.users = systemData.users.filter(u => u.id !== teacherId);
        loadTeachers();
        logAction('Teacher deleted', `Name: ${teacher.name}, Email: ${teacher.email}`);
        showToast('Teacher deleted successfully', 'info');
    }
}

function editTeacher(teacherId) {
    const teacher = systemData.users.find(u => u.id === teacherId);
    if (teacher) {
        // Pre-fill form with teacher data
        document.getElementById('teacherName').value = teacher.name;
        document.getElementById('teacherEmail').value = teacher.email;
        document.getElementById('teacherPhone').value = teacher.phone;
        document.getElementById('teacherDepartment').value = teacher.department;
        document.getElementById('teacherSubjects').value = teacher.subject;
        
        showModal('addTeacherModal');
        logAction('Teacher edit initiated', `Name: ${teacher.name}`);
    }
}

function approveAppointment(appointmentId) {
    const appointment = systemData.appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'approved';
        loadTeacherAppointments();
        
        const student = systemData.users.find(u => u.id === appointment.studentId);
        logAction('Appointment approved', `Student: ${student?.name}, Date: ${appointment.date}`);
        showToast('Appointment approved!', 'success');
    }
}

function rejectAppointment(appointmentId) {
    const appointment = systemData.appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'cancelled';
        loadTeacherAppointments();
        
        const student = systemData.users.find(u => u.id === appointment.studentId);
        logAction('Appointment rejected', `Student: ${student?.name}, Date: ${appointment.date}`);
        showToast('Appointment rejected', 'info');
    }
}

function cancelAppointment(appointmentId) {
    const appointment = systemData.appointments.find(a => a.id === appointmentId);
    if (appointment && confirm('Cancel this appointment?')) {
        appointment.status = 'cancelled';
        loadStudentAppointments();
        
        logAction('Appointment cancelled by student', `Date: ${appointment.date}, Time: ${appointment.time}`);
        showToast('Appointment cancelled', 'info');
    }
}

function deleteAppointment(appointmentId) {
    const appointment = systemData.appointments.find(a => a.id === appointmentId);
    if (appointment && confirm('Delete this appointment?')) {
        systemData.appointments = systemData.appointments.filter(a => a.id !== appointmentId);
        loadAllAppointments();
        
        logAction('Appointment deleted by admin', `ID: ${appointmentId}`);
        showToast('Appointment deleted', 'info');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    logAction('Application initialized', 'System loaded successfully');
    showToast('Welcome to Student-Teacher Booking System', 'info');
    
    // Set up click handlers for modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    console.log('=== DEMO CREDENTIALS ===');
    console.log('Admin: admin@demo.com / password');
    console.log('Teacher: john.smith@school.edu / password');
    console.log('Teacher: sarah.johnson@school.edu / password');
    console.log('Student: alice.wilson@student.edu / password');
    console.log('========================');
});