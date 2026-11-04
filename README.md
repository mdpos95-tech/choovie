# Choovie

Choovie is a full-stack movie recommendation web application designed to help users decide what to watch. Users can browse popular movies, search for specific titles, receive personalised recommendations based on their preferences, and save movies to a personal watchlist.

The application includes several recommendation modes, including Help Me Choose, Choose For Me, and Surprise Me. Movie data is provided by The Movie Database (TMDB) API, while OpenAI is used to rank movie recommendations for the Choose For Me feature.

Choovie was built using React for the frontend and Django REST Framework for the backend. User accounts, authentication, watchlists, and recommendation activity are managed through Django, with PostgreSQL used for the deployed database.

Live Application

Frontend: https://choovie-frontend.onrender.com

Backend API: https://choovie.onrender.com


# Features

- User registration, login, and logout
- Token-based authentication using Django REST Framework
- Browse popular movies from TMDB
- Search for movies by title
- View movie details including overview, release date, rating, and poster
- Personal watchlist for authenticated users
- Add and remove movies from the watchlist
- Persistent watchlist storage using the deployed PostgreSQL database
- Help Me Choose recommendation mode using selected preferences
- Choose For Me mode using OpenAI to rank suitable movie choices
- Surprise Me mode for randomised recommendations
- Instant reroll functionality for additional recommendations
- Recommendation filtering by genre, mood, runtime, and release period
- Responsive layout for desktop, tablet, and mobile
- Django admin interface for viewing users, watchlist data, and recommendation logs
- Automated backend tests for authentication, watchlists, permissions, and recommendations
- Production deployment using Render


# Development Experience

This project was my first time building an application with React. Before starting Choovie, I had not previously used React for a full project, so part of the development process involved learning how to work with components, state, hooks, event handlers, and API requests.

Using React alongside Django REST Framework also gave me experience separating a frontend and backend into two independent applications and connecting them through REST API endpoints. I learned how authentication tokens can be used by the frontend when making protected requests, how state changes affect the interface, and how data returned from an API can be transformed and displayed dynamically.

One of the main challenges was managing the different recommendation flows and keeping the user interface in sync with data such as watchlist status and recommendation results. Working through these issues helped me become more comfortable with React and with debugging full-stack applications.


# Technology Stack

Frontend

- React
- Vite
- JavaScript
- React Bootstrap
- Axios
- HTML5
- CSS3

Backend

- Python
- Django
- Django REST Framework
- Django Token Authentication
- django-cors-headers
- WhiteNoise
- Gunicorn
- Uvicorn

Database

- SQLite for local development
- PostgreSQL for the deployed application

External APIs

- The Movie Database (TMDB) API for movie data, posters, search results, and recommendations
- OpenAI API for AI-assisted ranking in the Choose For Me recommendation mode

Testing and Development

- Python "unittest" through Django's testing framework
- Git and GitHub for version control
- Feature branches for testing and deployment work
- Visual Studio Code

Deployment

- Render Web Service for the Django backend
- Render PostgreSQL for the production database
- Render Static Site for the React frontend

# Local Installation and Setup

1. Clone the Repository

git clone https://github.com/mdpos95-tech/choovie.git
cd choovie

2. Backend Setup

Move into the backend folder:

cd backend

Create and activate a virtual environment, then install the required Python packages:

python -m venv .venv

On Windows:

.venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create a ".env" file inside the "backend" folder and add:

TMDB_API_KEY=your_tmdb_api_key
OPENAI_API_KEY=your_openai_api_key
DJANGO_SECRET_KEY=your_django_secret_key

Run the database migrations:

python manage.py migrate

Start the Django development server:

python manage.py runserver

The backend will run at:

http://127.0.0.1:8000

3. Frontend Setup

Open a second terminal and move into the frontend folder:

cd frontend

Install the frontend dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend will run at:

http://localhost:5173

4. Local API Configuration

The frontend uses the following local fallback API URL:

http://127.0.0.1:8000

For production, the frontend reads the backend address from:

VITE_API_BASE_URL




# Environment Variables

The application uses environment variables to keep API keys and production settings out of the source code.

Backend-

The Django backend uses:

TMDB_API_KEY
OPENAI_API_KEY
DJANGO_SECRET_KEY
DATABASE_URL
DEBUG
FRONTEND_URL

"DATABASE_URL" is used by the deployed application to connect to PostgreSQL.

"DEBUG" should be set to:

False

in production.

"FRONTEND_URL" should contain the deployed React frontend address so that Django CORS settings allow requests from the frontend.

Frontend-

The React frontend uses:

VITE_API_BASE_URL

In production, this points to the deployed Django backend:

https://choovie.onrender.com

Sensitive values such as API keys and secret keys are stored in environment variables and are not committed to GitHub.


# Testing

Automated backend tests were created using Django's built-in testing framework and "unittest".

The project currently includes 7 automated tests covering:

- User registration
- User login
- Authentication requirements for the watchlist
- Adding movies to the watchlist
- Removing movies from the watchlist
- Preventing users from deleting another user's watchlist items
- Recommendation behaviour with the OpenAI ranking function mocked during testing

To run the tests locally from the project root:

./backend/.venv/Scripts/python.exe backend/manage.py test

All tests should pass before deployment.

The deployed application was also manually tested to confirm that:

- Registration and login work correctly
- Popular movies load from TMDB
- Movie search works
- Movies can be added to and removed from the watchlist
- Watchlist data persists after refreshing
- Help Me Choose works
- Choose For Me returns AI-ranked recommendations
- Surprise Me works
- Instant Reroll returns additional recommendations
- The interface remains usable on smaller screen sizes

# Deployment

Choovie is deployed using Render.

Backend

The Django REST Framework backend is deployed as a Render Web Service.

Production setup includes:

- Gunicorn and Uvicorn for serving the Django application
- WhiteNoise for static files
- Environment variables for secrets and production configuration
- PostgreSQL provided by Render
- Automatic database migrations during the build process

The backend is available at:

https://choovie.onrender.com

A health-check endpoint is available at:

https://choovie.onrender.com/api/health/

Frontend

The React frontend is deployed as a Render Static Site.

The frontend is available at:

https://choovie-frontend.onrender.com

The production frontend connects to the Django API using:

VITE_API_BASE_URL=https://choovie.onrender.com

Database

Local development uses SQLite.

The deployed application uses PostgreSQL through Render. The production database connection is provided to Django through the "DATABASE_URL" environment variable.


# API

Choovie uses The Movie Database (TMDB) API to retrieve movie information including titles, posters, release dates, ratings, overviews, popular movies, and search results.

This product uses the TMDB API but is not certified by TMDB.

The application also uses the OpenAI API to rank suitable movie candidates for the Choose For Me recommendation mode.


# Acknowledgements

- The Movie Database (TMDB) for providing the movie data used throughout the application.
- OpenAI for providing the API used to support the AI-assisted recommendation feature.
- Django, Django REST Framework, React, Vite, and React Bootstrap for the frameworks and tools used to build the project.
- Render for hosting the frontend, backend, and PostgreSQL production database.

This project was also a valuable learning experience, particularly as it was my first full project built with React.