# Streamify Dashboard

## Overview

The Streamify Dashboard is a web application designed to visualize and manage streaming data. It provides insights into user growth, top songs, revenue distribution, and recent streams. The application utilizes React Context for state management, allowing for a more scalable and maintainable codebase.

## Thought Process

When developing this application, I aimed to create a user-friendly interface that allows users to interact with various data visualizations. I chose to use React Context for state management to simplify the data flow between components, making it easier to share state across the application without prop drilling.

### Key Features

- **User Growth Visualization**: Displays user growth data over the last six months.
- **Top Songs**: Lists the most streamed songs.
- **Revenue Distribution**: Shows revenue breakdown by category.
- **Recent Streams Table**: Provides a detailed view of recent streams with filtering and sorting capabilities.

## How to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:aswanthnarayan/streamify-dashboard.git
   cd streamify-dashboard
   cd frontend
   npm install
   npm run dev ## for vite
   npm run server ##for json-server
   ```