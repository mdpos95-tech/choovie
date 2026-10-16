import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/movies/popular/')
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching popular movies:', error);
      });
  }, []);

  return (
    <Container className="py-4">
      <h1 className='mb-4'>Choovie</h1>
      <Row>
        {movies.map((movie) => (
          <Col md={3} className='mb-4' key={movie.id}>
            <Card className='h-100'>
              {movie.poster_path && (<Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              />)}
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.overview}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
</Row>  
    </Container>
  );
} 

        export default App;