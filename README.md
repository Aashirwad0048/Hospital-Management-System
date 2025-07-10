# HMS (Hospital Management System)

A full-stack hospital management system with React frontend and Node.js/Express backend.
##Login
 Its an admin point website so for the safety standards use
 - Email - kailash@123gmail.com
 -password-123
## Features

- Patient Management
- Doctor Management  
- Appointment Scheduling
- CRUD operations for all entities

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your configuration:
```env
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# MongoDB Connection String - REPLACE WITH YOUR ACTUAL MONGODB URL
MONGODB_URI=mongodb+srv://aashirwadsingh23:eJmM1eaWp8B23R1i@hms-storing.odbui9g.mongodb.net/hms?retryWrites=true&w=majority&appName=HMS-storing
```

**Environment Variables:**
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string

**MongoDB Connection String Examples:**

- **Local MongoDB**: `mongodb://localhost:27017/hms`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/hms?retryWrites=true&w=majority`
- **MongoDB with Authentication**: `mongodb://username:password@localhost:27017/hms`

**To get your MongoDB Atlas connection string:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster or use existing one
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `hms`

3. Start the backend server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The backend will run on `http://localhost:3000`

**Server Status Check:**
- API Status: `http://localhost:3000/`
- Health Check: `http://localhost:3000/health`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd myapp
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the `myapp` directory for environment variables:
```env
# React App Environment Variables
REACT_APP_API_URL=http://localhost:3000
REACT_APP_NAME=HMS Frontend
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3001` (React will automatically choose the next available port)

## API Endpoints

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments/add` - Create new appointment
- `POST /appointments/update/:id` - Update appointment
- `DELETE /appointments/delete/:id` - Delete appointment

### Patients
- `GET /patients` - Get all patients
- `POST /patients/add` - Create new patient
- `POST /patients/update/:id` - Update patient
- `DELETE /patients/delete/:id` - Delete patient

### Doctors
- `GET /doctors` - Get all doctors
- `POST /doctors/add` - Create new doctor
- `POST /doctors/update/:id` - Update doctor
- `DELETE /doctors/delete/:id` - Delete doctor

## Database Schema

### Appointment
- `patientName` (String, required)
- `doctorName` (String, required)
- `date` (Date, required)

### Patient
- `name` (String, required)
- `age` (Number, required)
- `gender` (String, required)

### Doctor
- `name` (String, required)
- `specialization` (String, required)
- `experience` (Number, required)

## Configuration

### Backend Environment Variables
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)
- `NODE_ENV`: Environment mode
- `MONGODB_URI`: MongoDB connection string

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3000)
- `REACT_APP_NAME`: Application name

### API Configuration
The frontend uses a centralized API configuration file (`src/config/api.js`) that manages:
- Base URL for all API calls
- Endpoint definitions
- Request configuration (timeout, headers)

## Troubleshooting

1. **MongoDB Connection Error**: 
   - Make sure MongoDB is running locally or your Atlas cluster is accessible
   - Check your connection string in the .env file
   - Verify username/password if using authentication

2. **Port Already in Use**: 
   - Change the PORT in .env file
   - Kill existing processes using the port
   - React will automatically use the next available port

3. **CORS Issues**: 
   - The backend is configured with CORS to allow requests from the frontend
   - If using a different frontend URL, update CORS settings

4. **Environment Variables Not Loading**:
   - Make sure .env file is in the root directory (same level as server.js)
   - For React, .env file should be in the myapp directory
   - Restart the server after creating/modifying .env file

5. **Frontend Can't Connect to Backend**:
   - Make sure backend is running on the configured port
   - Check if frontend is using the correct API URL
   - Use the "Test Connection" button in the frontend to verify

6. **Host Configuration Issues**:
   - Update HOST environment variable if not using localhost
   - Ensure firewall allows connections on the configured port

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Axios, Tailwind CSS
- **Development**: Nodemon, dotenv 