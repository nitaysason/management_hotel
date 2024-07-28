# Hotel Management System

A web-based application for managing hotel operations, including user authentication, room management, treatment management, order management, and more. The application uses Django for the backend and Angular for the frontend.

## CRUD Functionality

### Users

- **Register User:**
  - Endpoint: `/register`
  - Method: `POST`
  - Description: Register a new user.

- **Login User:**
  - Endpoint: `/login`
  - Method: `POST`
  - Description: Login a user.

- **Logout User:**
  - Endpoint: `/logout`
  - Method: `POST`
  - Description: Logout a user.

### Rooms

- **Create Room:**
  - Endpoint: `/rooms/manage/`
  - Method: `POST`
  - Description: Add a new room to the hotel.

- **Read Rooms:**
  - Endpoint: `/rooms/manage/`
  - Method: `GET`
  - Description: Get information about all rooms.

- **Update Room:**
  - Endpoint: `/rooms/manage/{room_id}/`
  - Method: `PUT`
  - Description: Update information about a specific room.

- **Delete Room:**
  - Endpoint: `/rooms/manage/{room_id}/`
  - Method: `DELETE`
  - Description: Delete a room from the hotel.

### Treatments

- **Create Treatment:**
  - Endpoint: `/treatments/manage/`
  - Method: `POST`
  - Description: Add a new treatment to the hotel.

- **Read Treatments:**
  - Endpoint: `/treatments/manage/`
  - Method: `GET`
  - Description: Get information about all treatments.

- **Update Treatment:**
  - Endpoint: `/treatments/manage/{treatment_id}/`
  - Method: `PUT`
  - Description: Update information about a specific treatment.

- **Delete Treatment:**
  - Endpoint: `/treatments/manage/{treatment_id}/`
  - Method: `DELETE`
  - Description: Delete a treatment from the hotel.

### Orders

- **Read Orders:**
  - Endpoint: `/orders/manage/`
  - Method: `GET`
  - Description: Get information about all orders.

### Tickets

- **Read Tickets:**
  - Endpoint: `/tickets/manage/`
  - Method: `GET`
  - Description: Get information about all tickets.

- **Update Ticket:**
  - Endpoint: `/tickets/manage/{ticket_id}/`
  - Method: `PUT`
  - Description: Update information about a specific ticket.

- **Delete Ticket:**
  - Endpoint: `/tickets/manage/{ticket_id}/`
  - Method: `DELETE`
  - Description: Delete a ticket from the hotel.

## Prerequisites

- Python 3.x
- Django
- Django REST Framework
- Angular CLI
- Node.js
- npm

## Installation

### Backend

1. Clone the repository:

    ```bash
    git clone https://github.com/nitaysason/hotel-management.git
    cd hotel-management/backend
    ```

2. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Set up the database:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

4. Create a superuser:

    ```bash
    python manage.py createsuperuser
    ```

5. Run the server:

    ```bash
    python manage.py runserver
    ```

### Frontend

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the Angular application:

    ```bash
    ng serve
    ```

4. Access the application at [http://localhost:4200](http://localhost:4200).

## Usage

1. Open your web browser and navigate to the Angular application at [http://localhost:4200](http://localhost:4200).

2. Use the provided functionalities to manage rooms, treatments, orders, and tickets.

## Screenshots

Include some screenshots of your application here to showcase the UI and features.

## License

Include information about the project's license here, if applicable.
