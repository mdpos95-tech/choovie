import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

function App() {
  const [movies, setMovies] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [runtime, setRuntime] = useState("");
  const [releasePeriod, setReleasePeriod] = useState("");
  const [resultsTitle, setResultsTitle] = useState("Popular Movies");
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="px-3">
        <Container>
          <Navbar.Brand className="fw-bold fs-3">Choovie</Navbar.Brand>

          <Navbar.Toggle aria-controls="choovie-navbar" />

          <Navbar.Collapse id="choovie-navbar">
            <Nav className="ms-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Discover</Nav.Link>
              <Nav.Link href="#">Watchlist</Nav.Link>
              <Nav.Link href="#">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

      <Container className="py-5">
        <h2 className="mb-4">{resultsTitle}</h2>
        {loading && <p>Finding your movies...</p>}
      

        <Row>
          {movies.map((movie) => (
            <Col lg={3} md={4} sm={6} className="mb-4" key={movie.id}>
              <Card className="h-100 bg-dark text-white border-secondary">
                {movie.poster_path && (
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  />
                )}

                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>

                  <Card.Text>
                    {movie.release_date?.slice(0, 4)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default App;