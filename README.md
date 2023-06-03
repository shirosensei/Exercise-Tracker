# Exercise Tracker

The Exercise Tracker allows users to track their daily exercise activities by storing them in a MongoDB database. The application provides a simple and intuitive user interface for adding, updating, and deleting exercise entries. 

Here's how it works:

**User Interface:**

The application consists of a form where users can enter details about their exercise activity, including the activity name, duration, and date.
There are buttons for adding a new exercise, updating an existing exercise, and deleting an exercise.
The list of exercises is displayed in a table format, showing the activity name, duration, and date.

**Backend Server:**

The backend server is responsible for handling the HTTP requests from the client and interacting with the MongoDB database.
It provides API endpoints for performing CRUD operations on the exercise data.
The server uses an Express.js framework to handle the routing and request/response handling.

**MongoDB Database:**

The MongoDB database stores the exercise data, with each exercise represented as a document in a collection.
Each exercise document contains fields such as activity name, duration, and date.

**Functionality:**

When a user adds a new exercise through the form, the client sends an HTTP POST request to the server's API endpoint.
The server receives the request, extracts the exercise data, and stores it as a new document in the MongoDB collection.
The updated list of exercises is then sent back to the client, and the table on the UI is updated to display the new exercise entry.
Users can also update or delete existing exercises by sending appropriate requests to the server's API endpoints.

**Retrieving Exercise Data:**

Users can view their exercise history by retrieving the exercise data from the MongoDB database.
When the application loads or when a user performs a refresh, the client sends an HTTP GET request to the server's API endpoint.
The server fetches the exercise data from the database and sends it back to the client.
The client receives the exercise data and updates the table on the UI to display the user's exercise history.