# Mulligan - Golf Tournament Management System

A web-based application for managing golf tournaments, including inter-club and individual competitions.

## Features

- User authentication and authorization
- Tournament management (create, edit, delete)
- Club management
- Golfer management
- Tournament participant management
- Score entry and tracking
- Tournament standings and points calculation
- PDF report generation

## Tech Stack

- Backend: Python/Django
- Frontend: React + Tailwind CSS
- Database: PostgreSQL
- Containerization: Docker

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mulligan.git
   cd mulligan
   ```

2. Create a `.env` file in the root directory:
   ```
   DJANGO_SECRET_KEY=your-secret-key
   POSTGRES_DB=mulligan
   POSTGRES_USER=mulligan_user
   POSTGRES_PASSWORD=mulligan_password
   ```

3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. Run database migrations:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin interface: http://localhost:8000/admin

## Development

### Backend Development

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Testing

### Backend Tests

```bash
python manage.py test
```

### Frontend Tests

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.