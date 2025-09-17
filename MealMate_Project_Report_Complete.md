# Project Report
## Project Title: Meal_Mate – Smart Meal Planning & Recipe Management System
**Developer:** Tooba  
**Date:** August 2025  
**Technologies Used:** Vue 3, Vuex, Node.js, Express.js, JSON Server, Axios, Element Plus, XState.

## 1. Introduction
Meal_Mate is a comprehensive full-stack meal planning and recipe management platform designed to simplify daily cooking decisions and grocery management. The system enables users to discover recipes, plan meals, manage grocery lists, and track their favorite dishes through an intuitive interface. Built with Vue 3 for the frontend and JSON Server for backend simulation, it demonstrates modern web development practices including state management with Vuex, responsive design, and RESTful API integration.

## 2. Features

### Core Functionality:
• **User Authentication System**: Secure login/signup with Vuex state management for user sessions
• **Recipe Discovery**: Browse extensive recipe collection with detailed instructions and ingredients
• **Meal Planning**: Add, edit, and delete meals with date-based organization
• **Grocery List Management**: Smart grocery tracking with add/remove functionality
• **Favorites System**: Save and manage favorite recipes for quick access
• **Responsive Design**: Mobile-first approach ensuring accessibility across all devices

### Advanced Features:
• **Real-time Data Sync**: Vuex store ensures consistent data across components
• **Search & Filter**: Find recipes by ingredients, cuisine type, or dietary preferences
• **Detailed Recipe Views**: Comprehensive recipe information with cooking instructions
• **State Persistence**: User preferences and data maintained across sessions
• **Interactive UI**: Smooth animations and transitions for enhanced user experience

## 3. Technical Architecture

### Frontend Stack:
- **Vue 3**: Progressive JavaScript framework for building user interfaces
- **Vuex**: Centralized state management for application data
- **Vue Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication
- **Vite**: Next-generation frontend tooling for fast development

### Backend Architecture:
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **JSON Server**: REST API simulation with zero coding (development)
- **RESTful Endpoints**: Standard CRUD operations for all entities

### Design & Styling:
- **CSS3**: Modern styling with flexbox and grid layouts
- **Responsive Design**: Mobile-first approach with breakpoints
- **Custom Components**: Reusable Vue components for consistent UI

## 4. Backend Implementation

### Server.js - Express.js Backend Server
The `server.js` file serves as the main backend server for Meal_Mate, providing a production-ready REST API built with Node.js and Express.js. This server handles all CRUD operations for recipes, users, meals, and grocery items.

#### Key Features:
- **RESTful API Design**: Follows REST principles for all endpoints
- **Middleware Integration**: CORS, body parsing, and authentication
- **Database Integration**: MongoDB connection with Mongoose ODM
- **Authentication**: JWT-based user authentication
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Input validation and sanitization

#### Server Structure:
```javascript
// server.js - Main Express Server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import route handlers
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const mealRoutes = require('./routes/meals');
const groceryRoutes = require('./routes/grocery');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/grocery', groceryRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meal_mate');
```

#### API Endpoints:
- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- **Recipes**: `/api/recipes` (GET, POST, PUT, DELETE)
- **Meals**: `/api/meals` (GET, POST, PUT, DELETE)
- **Grocery**: `/api/grocery` (GET, POST, PUT, DELETE)
- **Users**: `/api/users/profile` (GET, PUT)

## 5. State Management with XState

### StateMachine.js - Advanced State Management
The `stateMachine.js` file implements XState for complex state management scenarios, providing a robust finite state machine architecture for handling user interactions and application workflows.

#### State Machine Architecture:
```javascript
// stateMachine.js - XState Implementation
import { createMachine, interpret, assign } from 'xstate';

// Authentication State Machine
const authMachine = create
