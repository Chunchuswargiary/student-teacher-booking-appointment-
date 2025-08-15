# student-teacher-booking-appointment-
## 🎯 Overview

The Student-Teacher Booking Appointment System is a modern, responsive web application that facilitates seamless appointment scheduling between students and teachers within educational institutions. The system provides role-based access control and real-time updates for efficient communication and scheduling.

### 🎨 Key Highlights

- **Role-Based Access Control**: Admin, Teacher, and Student interfaces
- **Real-Time Updates**: Live appointment status changes
- **Responsive Design**: Mobile-first approach
- **Secure Authentication**: Firebase Authentication integration
- **Comprehensive Logging**: Complete action tracking
- **Modular Architecture**: Clean, maintainable codebase

## ✨ Features

### 👨‍💼 Admin Features
- ➕ Add, update, and delete teacher profiles
- ✅ Approve student registration requests
- 📊 System-wide appointment management
- 📈 Generate comprehensive reports
- 👥 User account management
- 🔍 Advanced search and filtering

### 👩‍🏫 Teacher Features
- 🏠 Personal dashboard
- 📅 Set availability schedules
- ✅ Approve/decline appointment requests
- 💬 Message students directly
- 📱 View appointment calendar
- 👤 Profile management
- 🔔 Real-time notifications

### 👨‍🎓 Student Features
- 📝 Registration system (requires approval)
- 🔍 Search teachers by department/subject
- 📅 Book appointments with available teachers
- 💬 Send messages to teachers
- 📋 View appointment history
- ❌ Cancel appointments
- 📱 Mobile-friendly interface

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)               │
├─────────────────────────────────────────────────────────┤
│                    Firebase Services                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │Authentication│ │  Firestore  │ │      Hosting       ││
│  │              │ │   Database  │ │                    ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Database Collections

```javascript
// Firestore Collections Structure
collections: {
  users: {
    uid: string,
    email: string,
    role: 'admin' | 'teacher' | 'student',
    name: string,
    approved: boolean,
    // ... role-specific fields
  },
  appointments: {
    id: string,
    studentId: string,
    teacherId: string,
    date: string,
    time: string,
    status: 'pending' | 'approved' | 'cancelled' | 'completed',
    purpose: string,
    message: string
  },
  messages: {
    id: string,
    senderId: string,
    receiverId: string,
    content: string,
    timestamp: number,
    read: boolean
  },
  availability: {
    teacherId: string,
    schedule: object // day-wise time slots
  }
}
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Client-side logic
- **Responsive Design** - Mobile-first approach

### Backend Services
- **Firebase Authentication** - User management
- **Firestore Database** - NoSQL data storage
- **Firebase Hosting** - Static file hosting
- **Firebase Functions** (Optional) - Server-side logic

### Development Tools
- **Git** - Version control
- **GitHub** - Repository hosting
- **Firebase CLI** - Deployment tool
- **Winston** - Logging library

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- Firebase CLI

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/student-teacher-booking.git
cd student-teacher-booking
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 4: Firebase Login

```bash
firebase login
```
