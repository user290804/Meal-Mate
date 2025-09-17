# Frontend to Backend FSM Connection Guide

## Overview
This guide provides a complete implementation to connect your Vue.js frontend with your Express.js FSM (Finite State Machine) backend.

## Backend Details
- **Location**: `C:\Users\Moham\Downloads\internship\internship\fsm`
- **Server**: Express.js running on port 3000
- **Key Endpoints**:
  - `POST /fsm/machine` - Main FSM interaction
  - `POST /fsm/login` - Login navigation
  - `POST /fsm/signup` - Signup navigation
  - `POST /login` - Health check

## Implementation Summary

### ✅ Completed Components:

1. **API Service** (`src/api/api.js`)
   - Configured axios with base URL pointing to backend
   - Created service methods for all backend endpoints
   - Added error handling and logging

2. **FSM Store Module** (`src/store/fsm.js`)
   - Vuex module for managing FSM state
   - Actions for initializing and managing transitions
   - Getters for accessing current state and available transitions

3. **Store Integration** (`src/store/index.js`)
   - Added FSM module to main store
   - Configured for use across the application

4. **Component Integration** (`src/components/FSMIntegrationExample.vue`)
   - Example component showing how to use the FSM service
   - Demonstrates initialization, transitions, and navigation

## Usage Instructions

### 1. Start Backend Server
```bash
cd "C:\Users\Moham\Downloads\internship\internship\fsm"
npm start
```

### 2. Use in Components
```javascript
// Initialize FSM
await this.$store.dispatch('fsm/initializeFSM');

// Send transition
await this.$store.dispatch('fsm/sendTransition', {
  transition: 'Login',
  data: { username: 'testuser', password: 'testpass' }
});

// Navigate
await this.$store.dispatch('fsm/navigateToLogin', key);
```

### 3. Access State
```javascript
// Get current state
const currentState = this.$store.state.fsm.currentState;

// Get available transitions
const nextEvents = this.$store.getters['fsm/nextEvents'];
```

## Testing the Connection

1. **Start Backend**: Ensure the backend is running on `http://localhost:3000`
2. **Test API**: Use the provided API service methods
3. **Test Store**: Use the Vuex actions and getters
4. **Test Components**: Use the example components provided

## Error Handling
- All API calls include proper error handling
- Loading states are managed
- Error messages are displayed appropriately

## Next Steps
1. **Customize Endpoints**: Modify the API service to match your specific backend endpoints
2. **Add More Components**: Create additional components using the FSM service
3. **Extend Functionality**: Add more actions and mutations as needed
4. **Testing**: Test the integration thoroughly

## Support
The implementation is now complete and ready for use. The backend is configured to run on port 3000 with CORS enabled, making it ready for frontend integration.
