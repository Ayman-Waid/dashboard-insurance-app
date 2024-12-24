# Admin Dashboard Mobile App

A React Native mobile application that provides an administrative dashboard with user management, image handling, statistics, and authentication features.

## Features

### Authentication
- Secure login system with Firebase Authentication
- Password reset functionality
- Admin-specific features and routes
- User session management

### User Management
- View and manage user listings
- Sort users alphabetically or by date
- Search functionality for users
- Delete user accounts
- Admin user creation capability

### Image Management
- Upload images to Firebase Storage
- View image gallery
- Delete images
- Image preview before upload
- Search and filter images

### Statistics Dashboard
- Visual data representation using charts
- User growth analytics
- Car statistics tracking
- Package distribution overview
- Interactive charts (Line, Bar, and Pie charts)

### Contact System
- Email integration using EmailJS
- Contact form with validation
- Success/error notifications

### Navigation
- Slide-out menu navigation
- Role-based menu items
- Smooth transitions between screens

## Technical Stack

### Frontend
- React Native
- Expo
- React Navigation
- React Native Chart Kit
- @expo/vector-icons for icons

### Backend Services
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- EmailJS for email services

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
cd [project-name]
npm install
```

3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update the `config.js` file with your Firebase credentials

4. Configure EmailJS:
   - Create an EmailJS account
   - Set up an email template
   - Update the EmailJS configuration in `Contact.js`

5. Start the development server:
```bash
expo start
```

## Environment Setup

### Prerequisites
- Node.js (v12 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Required Environment Variables
Create a `.env` file in the root directory and add:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Usage

### Admin Login
- Use the default admin credentials:
  - Email: abah@gmail.com
  - Password: abah

### Managing Users
1. Access the Users screen from the menu
2. Use the search bar to find specific users
3. Click on a user card to expand details
4. Use the filter button to sort users

### Image Management
1. Navigate to the Images section
2. Click the + button to upload new images
3. Preview images before upload
4. Click the trash icon to delete images

### Statistics
1. Access the Statistics screen from the menu
2. View different charts showing user data, car data, and package distribution
3. Scroll through different analytics views

## Security

- Implements Firebase Authentication for secure user management
- Role-based access control for admin features
- Secure image upload and storage
- Protected API endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, email ayman.waidox@gmail.com or open an issue in the repository.
