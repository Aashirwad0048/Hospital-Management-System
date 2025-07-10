# HMS (Hospital Management System)

A full-stack hospital management system with React frontend and Node.js/Express backend.

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

---

## 1. **Backend is only listening on localhost (127.0.0.1)**

By default, many Node.js servers only listen on `localhost`, which means they are only accessible from your own computer—not from other devices on your network.

**Solution:**  
In your `server.js`, make sure your server listens on `0.0.0.0` (all network interfaces), not just `localhost` or `127.0.0.1`.

**Example:**
```js
// BAD (only accessible from your computer)
app.listen(5000, 'localhost', () => { ... });

// GOOD (accessible from other devices on your WiFi)
app.listen(5000, '0.0.0.0', () => { ... });
```
Or simply:
```js
app.listen(5000, () => { ... }); // This usually works too
```

---

## 2. **Firewall or Windows Defender is blocking connections**

Your computer's firewall may block incoming connections to your Node.js server.

**Solution:**  
- Allow Node.js through Windows Defender Firewall.
- Open port 5000 (or whatever port your server uses) for inbound connections.

---

## 3. **Using the wrong IP address on your phone**

You must use your computer's **local network IP address** (not `localhost` or `127.0.0.1`) in your phone's browser.

**How to find your computer's IP:**
- Open Command Prompt or PowerShell and run:
  ```
  ipconfig
  ```
- Look for the IPv4 Address (e.g., `192.168.1.42`).

**On your phone, visit:**  
```
http://192.168.1.42:5000/
```
(Replace with your actual IP and port.)

---

## 4. **Both devices must be on the same WiFi network**

Your phone and your computer must be connected to the same WiFi network for this to work.

---

## 5. **CORS issues**

If your frontend is running on your phone and the backend is on your computer, you may need to enable CORS in your backend.

**In `server.js`:**
```js
const cors = require('cors');
app.use(cors());
```

---

## **Checklist**

- [ ] Server is listening on `0.0.0.0`
- [ ] Firewall allows inbound connections on your server port
- [ ] You use your computer's local IP address on your phone
- [ ] Both devices are on the same WiFi
- [ ] CORS is enabled on the backend

---

Would you like help editing your `server.js` to listen on all interfaces, or step-by-step instructions for any of the above steps? 

### Here’s what you need to do:

---

## 1. Change the server to listen on all interfaces

**Replace:**
```js
const HOST = process.env.HOST || 'localhost';
```

**With:**
```js
const HOST = process.env.HOST || '0.0.0.0';
```

This will make your backend accessible from other devices on your WiFi.

---

## 2. (Optional) Add a security note

When you open your server to the network, anyone on your WiFi can access it. For development, this is usually fine, but be careful on public networks.

---

## 3. Restart your server

After making this change, stop your server (Ctrl+C in the terminal) and start it again with `node server.js`.

---

## 4. Access from your phone

- Find your computer’s local IP address (e.g., `192.168.1.42`).
- On your phone, visit: `http://192.168.1.42:5000/` (replace with your actual IP and port).

---

**Would you like me to make this change to your `server.js` now?** 

### Here’s a review of your `vercel.json`:

```json
{
 "version": 2,
 "builds": [
  {
   "src": "/server.js",
   "use": "@vercel/node"
  }
 ],
 "routes": [
  {
   "src": "/(.*)",
   "dest": "/server.js"
  }
 ]
}
```

### **Analysis**

- **"builds"**:  
  - `"src": "/server.js"`: The leading slash is not necessary and can sometimes cause issues. It should be `"src": "server.js"`.
  - `"use": "@vercel/node"`: Correct for deploying a Node.js serverless function.

- **"routes"**:  
  - `"src": "/(.*)"`, `"dest": "/server.js"`: Again, the leading slashes are not needed. Should be `"src": "/(.*)"`, `"dest": "server.js"`.

### **Recommended Correction**

```json
<code_block_to_apply_changes_from>
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

### **Other Considerations**
- Vercel is designed for serverless functions, not for running a persistent Express server. If your app relies on things like WebSockets or long-lived connections, it may not work as expected.
- If you have both frontend and backend, you may want to split them into separate Vercel projects or use Vercel for frontend and another service (like Render or Railway) for backend.

---

**Would you like me to update your `vercel.json` to the recommended format?**  
Or do you want advice on deploying both frontend and backend with Vercel? 