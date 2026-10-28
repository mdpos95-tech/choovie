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
  const [recommendationPool, setRecommendationPool] = useState([]);
  const [seenRecommendationIds, setSeenRecommendationIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [showQuickChoose, setShowQuickChoose] = useState(false);
  const [quickGenre, setQuickGenre] = useState("");
  const [quickMood, setQuickMood] = useState("");
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
        const pool = response.data.results;

        setRecommendationPool(pool);
        setMovies(pool);
        setResultsTitle("Your Choovie Picks");


        setShowPreferences(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting recommendations:", error);
        setLoading(false);
      });
  };

  const handleQuickChoose = () => {
    setShowQuickChoose(false);
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/movies/recommend/", {
        params: {
          genre: quickGenre,
          mood: quickMood,
          runtime: "",
          release_period: "",
        },
      })
      .then((response) => {
        const pool = response.data.results;

        setRecommendationPool(pool);

        const shuffledMovies = [...pool].sort(
          () => Math.random() - 0.5
        );

        const firstPicks = shuffledMovies.slice(0, 3);

        setMovies(firstPicks);
        setSeenRecommendationIds(
          firstPicks.map((movie) => movie.id)
        );
        setResultsTitle("Choovie's 3 Picks");
        setshowQuickChoose(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting quick recommendations:", error);
        setLoading(false);
      });
  };

  const handleSurpriseMe = () => {
  setLoading(true);

  axios
    .get("http://127.0.0.1:8000/api/movies/recommend/", {
      params: {
        genre: "",
        mood: "",
        runtime: "",
        release_period: "",
      },
    })
    .then((response) => {
      const pool = response.data.results;

      const shuffledMovies = [...pool].sort(
        () => Math.random() - 0.5
      );

      setMovies(shuffledMovies.slice(0, 3));
      setResultsTitle("Surprise Picks");
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error getting surprise picks:", error);
      setLoading(false);
    });
};

  const handleReroll = () => {
    if (recommendationPool.length === 0) {
      return;
    }

    const unseenMovies = recommendationPool.filter(
      (movie) => !seenRecommendationIds.includes(movie.id)
    );

    if (unseenMovies.length < 3) {
      const currentMovieIds = movies.map((movie) => movie.id);

      const freshCycle = recommendationPool.filter(
        (movie) => !currentMovieIds.includes(movie.id)
      );

      const shuffledMovies = [...freshCycle].sort(
        () => Math.random() - 0.5
      );

      const nextPicks = shuffledMovies.slice(0, 3);

      setMovies(nextPicks);
      setSeenRecommendationIds(
        nextPicks.map((movie) => movie.id)
      );

      return;
    }

    const shuffledMovies = [...unseenMovies].sort(
      () => Math.random() - 0.5
    );

    const nextPicks = shuffledMovies.slice(0, 3);

    setMovies(nextPicks);

    setSeenRecommendationIds((previousIds) => [
      ...previousIds,
      ...nextPicks.map((movie) => movie.id),
    ]);
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

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="danger"
              onClick={() => setShowPreferences(true)}
            >
              Help Me Choose
            </Button>

            <Button
              variant="outline-light"
              onClick={() => setShowQuickChoose(true)}
            >
              Choose For Me
            </Button>
            <Button 
              variant="outline-warning"
              onClick={handleSurpriseMe}>
                Surprise Me
              </Button>
          </div>
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
            Show Matching Movies
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showQuickChoose}
        onHide={() => setShowQuickChoose(false)}
        centered
        data-bs-theme="dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose For Me</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-secondary">
            Pick a genre and Choovie will choose 3 movies for you.
          </p>

          <Form.Group>
            <Form.Label>Genre</Form.Label>

            <Form.Select
              value={quickGenre}
              onChange={(event) => setQuickGenre(event.target.value)}
            >
              <option value="">Any Genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Thriller">Thriller</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Mood</Form.Label>

            <Form.Select
              value={quickMood}
              onChange={(e) => setQuickMood(e.target.value)}
            >
              <option value="">Any Mood</option>
              <option value="Funny">Funny</option>
              <option value="Relaxing">Relaxing</option>
              <option value="Exciting">Exciting</option>
              <option value="Emotional">Emotional</option>
              <option value="Dark">Dark</option>
              <option value="Thought-provoking">Thought-provoking</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowQuickChoose(false)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleQuickChoose}
          >
            Give Me 3 Picks
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
          <div className="d-flex gap-2 mb-4">
            <Form.Control
              type="text"
              placeholder="Search for a movie..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />


            <Button variant="danger" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{resultsTitle}</h2>
            {resultsTitle === "Your Choovie Picks" && (
              <Button variant="outline-light" onClick={handleShowPopular}>
                Show Popular Movies
              </Button>
            )}
            {resultsTitle === "Choovie's 3 Picks" && (
              <Button
                variant="danger"
                onClick={handleReroll}
              >
                Instant Reroll
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