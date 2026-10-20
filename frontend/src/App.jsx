import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import ChoovieNavbar from "./components/ChoovieNavbar";
import MovieCard from "./components/MovieCard";
import MovieDetailsModal from "./components/MovieDetailsModal";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [runtime, setRuntime] = useState("");
  const [releasePeriod, setReleasePeriod] = useState("");
  const [resultsTitle, setResultsTitle] = useState("Popular Movies");
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlistMessage, setWatchlistMessage] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authToken, setAuthToken] = useState(localStorage.getItem("choovieToken") || "");
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("choovieUser") || "");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/movies/popular/")
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error loading movies:", error);
      });
  }, []);

  const handleRecommendation = () => {

    setLoading(true);
    axios

      .get("http://127.0.0.1:8000/api/movies/recommend/", {
        params: {
          genre: genre,
          mood: mood,
          runtime: runtime,
          release_period: releasePeriod,
        },
      })
      .then((response) => {
        setMovies(response.data.results);
        setResultsTitle("Your Choovie Picks");
        setShowPreferences(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting recommendations:", error);
        setLoading(false);
      });
  };

  const handleShowPopular = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/movies/popular/")
      .then((response) => {
        setMovies(response.data.results);
        setResultsTitle("Popular Movies");
        setGenre("");
        setMood("");
        setRuntime("");
        setReleasePeriod("");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading movies:", error);
        setLoading(false);
      });
  };


  const handleSearch = () => {
  if (!searchQuery.trim()) {
    return;
  }

  setLoading(true);

  axios
    .get("http://127.0.0.1:8000/api/movies/search/", {
      params: {
        query: searchQuery,
      },
    })
    .then((response) => {
      setMovies(response.data.results);
      setResultsTitle(`Search Results for "${searchQuery}"`);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error searching movies:", error);
      setLoading(false);
    });
};

  const handleAuthSubmit = () => {
    setAuthError("");

    const endpoint =
      authMode === "login"
        ? "http://127.0.0.1:8000/api/auth/login/"
        : "http://127.0.0.1:8000/api/auth/register/";

    const data =
      authMode === "login"
        ? {
          username: authUsername,
          password: authPassword,
        }
        : {
          username: authUsername,
          email: authEmail,
          password: authPassword,
        };

    axios
      .post(endpoint, data)
      .then((response) => {
        const token = response.data.token;

        setAuthToken(token);
        setCurrentUser(authUsername);

        localStorage.setItem("choovieToken", token);
        localStorage.setItem("choovieUser", authUsername);

        setShowAuth(false);
        setAuthUsername("");
        setAuthEmail("");
        setAuthPassword("");
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setAuthError("Login or registration failed. Please check your details.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("choovieToken");
    localStorage.removeItem("choovieUser");
    setAuthToken("");
    setCurrentUser("");
  };

  const handleAddToWatchlist = () => {
    if (!authToken) {
      setAuthMode("login");
      setShowAuth(true);
      return;
    }

    if (!selectedMovie) {
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/watchlist/",
        {
          tmdb_id: selectedMovie.id,
          title: selectedMovie.title,
          poster_path: selectedMovie.poster_path || "",
          release_date: selectedMovie.release_date || "",
          overview: selectedMovie.overview || "",
          vote_average: selectedMovie.vote_average ?? null,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      )
      .then(() => {
        setWatchlistMessage("Added to your watchlist.");
      })
      .catch((error) => {
        if (error.response?.data?.detail) {
          setWatchlistMessage(error.response.data.detail);
        } else {
          setWatchlistMessage("Could not add movie to watchlist.");
        }
      });
  };

  const handleShowWatchlist = () => {
    if (!authToken) {
      setAuthMode("login");
      setShowAuth(true);
      return;
    }

    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/watchlist/", {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then((response) => {
        const watchlistMovies = response.data.map((item) => ({
          id: item.tmdb_id,
          watchlistItemId: item.id,
          title: item.title,
          poster_path: item.poster_path,
          release_date: item.release_date,
          overview: item.overview,
          vote_average: item.vote_average,
        }));

        setMovies(watchlistMovies);
        setResultsTitle("My Watchlist");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading watchlist:", error);
        setLoading(false);
      });
  };

  const handleRemoveFromWatchlist = () => {
    if (!selectedMovie?.watchlistItemId) {
      return;
    }

    axios
      .delete(
        `http://127.0.0.1:8000/api/watchlist/${selectedMovie.watchlistItemId}/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      )
      .then(() => {
        setSelectedMovie(null);
        setWatchlistMessage("");
        handleShowWatchlist();
      })
      .catch((error) => {
        console.error("Error removing movie from watchlist:", error);
      });
  };

  return (
    <>
      <ChoovieNavbar
        currentUser={currentUser}
        onHome={handleShowPopular}
        onDiscover={() => setShowPreferences(true)}
        onWatchlist={handleShowWatchlist}
        onLogin={() => {
          setAuthMode("login");
          setShowAuth(true);
        }}
        onLogout={handleLogout}
      />

      <section className="hero-section">
        <Container className="text-center">
          <h1 className="display-3 fw-bold">What should you watch tonight?</h1>

          <p className="lead mt-3 mb-4">
            Tell Choovie what you're in the mood for and get movie suggestions
            picked around your preferences.
          </p>

          <Button size="lg" variant="danger" onClick={() => setShowPreferences(true)}>
            Help Me Choose
          </Button>
        </Container>
      </section>
      <Modal show={showPreferences} onHide={() => setShowPreferences(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>What are you in the mood for?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option>Any Genre</option>
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Horror</option>
                <option>Romance</option>
                <option>Science Fiction</option>
                <option>Thriller</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mood</Form.Label>
              <Form.Select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option>Surprise Me</option>
                <option>Funny</option>
                <option>Relaxing</option>
                <option>Exciting</option>
                <option>Emotional</option>
                <option>Dark</option>
                <option>Thought-provoking</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Runtime</Form.Label>
              <Form.Select value={runtime} onChange={(e) => setRuntime(e.target.value)}>
                <option>Any Length</option>
                <option>Short (under 90 min)</option>
                <option>Medium (90-120 min)</option>
                <option>Long (over 120 min)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Select value={releasePeriod} onChange={(e) => setReleasePeriod(e.target.value)}>
                <option> Any Year</option>
                <option>2020s</option>
                <option>2010s</option>
                <option>2000s</option>
                <option>1990s</option>
                <option> Before 1990</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreferences(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRecommendation}>
            Find My Movie
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showAuth}
        onHide={() => setShowAuth(false)}
        centered
        data-bs-theme="dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {authMode === "login" ? "Login to Choovie" : "Create an Account"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>

            {authMode === "register" && (
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>
          </Form>
          {authError && (
            <div className="alert alert-danger" mt-3>
              {authError}
            </div>
          )}

          <div className="text-center mt-3">
            {authMode === "login" ? (
              <p>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setAuthMode("register")}
                >
                  Register
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </Button>
              </p>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAuth(false)}>
            Cancel
          </Button>

          <Button variant="danger" onClick={handleAuthSubmit}>
            {authMode === "login" ? "Login" : "Register"}
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="movies-section">
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{resultsTitle}</h2>
            {resultsTitle === "Your Choovie Picks" && (
              <Button variant="outline-light" onClick={handleShowPopular}>
                Show Popular Movies
              </Button>
            )}
          </div>
          {loading && <p>Finding your movies...</p>}

          {resultsTitle === "My Watchlist" && movies.length === 0 && !loading && (
            <div className="text-center py-5">
              <h3>Your watchlist is empty</h3>
              <p className="text-secondary">
                Add some movies and they will appear here.
              </p>

              <Button variant="danger" onClick={() => setShowPreferences(true)}>
                Discover Movies
              </Button>
            </div>
          )}


          <Row>
            {movies.map((movie) => (
              <Col lg={3} md={4} sm={6} className="mb-4" key={movie.id}>
                <MovieCard
                  movie={movie}
                  onViewDetails={(movie) => {
                    setSelectedMovie(movie);
                    setWatchlistMessage("");
                  }}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
     <MovieDetailsModal
     movie={selectedMovie}
     resultsTitle={resultsTitle}
     watchlistMessage={watchlistMessage}
     onClose={() => setSelectedMovie(null)}
     onAddToWatchlist={handleAddToWatchlist}
     onRemoveFromWatchlist={handleRemoveFromWatchlist}
   />
    </>
  );
}

export default App;