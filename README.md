Admin Dashboard Mobile App
A React Native mobile application that provides an administrative dashboard with user management, image handling, statistics, and authentication features.
Features
Authentication

Secure login system with Firebase Authentication
Password reset functionality
Admin-specific features and routes
User session management

User Management

View and manage user listings
Sort users alphabetically or by date
Search functionality for users
Delete user accounts
Admin user creation capability

Image Management

Upload images to Firebase Storage
View image gallery
Delete images
Image preview before upload
Search and filter images

Statistics Dashboard

Visual data representation using charts
User growth analytics
Car statistics tracking
Package distribution overview
Interactive charts (Line, Bar, and Pie charts)

Contact System

Email integration using EmailJS
Contact form with validation
Success/error notifications

Navigation

Slide-out menu navigation
Role-based menu items
Smooth transitions between screens

Technical Stack
Frontend

React Native
Expo
React Navigation
React Native Chart Kit
@expo/vector-icons for icons

Backend Services

Firebase Authentication
Firebase Firestore
Firebase Storage
EmailJS for email services

Installation

Clone the repository:

bashCopygit clone [repository-url]

Install dependencies:

bashCopycd [project-name]
npm install

Configure Firebase:

Create a Firebase project
Enable Authentication, Firestore, and Storage
Update the config.js file with your Firebase credentials


Configure EmailJS:

Create an EmailJS account
Set up an email template
Update the EmailJS configuration in Contact.js


Start the development server:

bashCopyexpo start
Environment Setup
Prerequisites

Node.js (v12 or higher)
npm or yarn
Expo CLI
iOS Simulator (for Mac) or Android Studio (for Android development)

Required Environment Variables
Create a .env file in the root directory and add:
CopyFIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
Usage
Admin Login

Use the default admin credentials:

Email: abah@gmail.com
Password: abah



Managing Users

Access the Users screen from the menu
Use the search bar to find specific users
Click on a user card to expand details
Use the filter button to sort users

Image Management

Navigate to the Images section
Click the + button to upload new images
Preview images before upload
Click the trash icon to delete images

Statistics

Access the Statistics screen from the menu
View different charts showing user data, car data, and package distribution
Scroll through different analytics views

Security

Implements Firebase Authentication for secure user management
Role-based access control for admin features
Secure image upload and storage
Protected API endpoints

Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details
Support
For support, email ayman.waidox@gmail.com or open an issue in the repository.
