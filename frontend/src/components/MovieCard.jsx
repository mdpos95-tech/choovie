import { Card, Button } from "react-bootstrap";

function MovieCard({ movie, onViewDetails }) {
  return (
    <Card className="movie-card h-100 bg-dark text-white border-0 shadow">
      <div className="position-relative">
        {movie.poster_path && (
          <Card.Img
            variant="top"
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        )}

        {movie.vote_average !== undefined && (
          <span className="movie-rating badge rounded-pill bg-warning text-dark">
            ★ {movie.vote_average?.toFixed(1)}
          </span>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <Card.Title className="movie-title mb-1">
            {movie.title}
          </Card.Title>

          <span className="text-secondary small">
            {movie.release_date?.slice(0, 4)}
          </span>
        </div>

        <Card.Text className="movie-overview text-secondary mt-2">
          {movie.overview || "No description available."}
        </Card.Text>

        <Button
          variant="danger"
          className="mt-auto"
          onClick={() => onViewDetails(movie)}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;