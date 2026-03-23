# Halleyx Customer Order Dashboard

A modern, full-stack MERN (MongoDB, Express, React, Node.js) application designed for managing customer orders and providing deep analytics through interactive widgets and AI-powered insights.

## Functions

- **Customer & Order Management**: Comprehensive CRUD operations for managing customer orders efficiently.
- **KPI Widget System**: A dynamic, modular widget system including configurable pie charts, table widgets, and summary cards.
- **Interactive UI**: Clean, modern interface supporting drag-and-drop for customizable dashboard layouts.
- **Data Visualization**: Real-time rendering of complex charts for an intuitive analytics experience.
- **AI-Powered Insights**: An integrated Insights Chatbot and data analysis engine, offering helpful conclusions.

## Project Demo Video

- Google Drive Link: https://drive.google.com/file/d/1qChD17ZG-5vUsCmAWXkXs3b-YQo9amzD/view?usp=sharing

## Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components and Widgets
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express Backend
│   ├── models/             # Mongoose schemas (e.g., Widget, Order)
│   ├── routes/             # API route handlers
│   ├── .env                # Environment variables
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md
```

## Others

- **Customizability**: The dashboard is highly modular and supports easy addition of new widget types.
- **AI Fallback**: Built-in mock data generation ensures the insights engine continues working without an active API key.
- **Performance**: Optimized rendering and API call patterns for a smooth user experience.
