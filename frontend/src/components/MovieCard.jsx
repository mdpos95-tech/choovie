import { Card, Button } from "react-bootstrap";
import { useState } from "react";

function MovieCard({ movie, onViewDetails, onAddToWatchlist, isInWatchlist }) {
    const [showFullOverview, setShowFullOverview] = useState(false);
    return (
        <Card className="movie-card h-100 bg-dark text-white border-0 shadow rounded-4 overflow-hidden">
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

                <Card.Text className="text-secondary mt-2">
                    {movie.overview
                        ? showFullOverview
                            ? movie.overview
                            : `${movie.overview.slice(0, 120)}${movie.overview.length > 120 ? "..." : ""
                            }`
                        : "No description available."}
                </Card.Text>

                {movie.overview?.length > 120 && (
                    <Button
                        variant="link"
                        className="p-0 mb-3 text-light text-decoration-none"
                        onClick={() => setShowFullOverview(!showFullOverview)}
                    >
                        {showFullOverview ? "Less" : "More"}
                    </Button>
                )}
                <div className="d-flex gap-2 mt-auto">
                    <Button
                        variant="danger"
                        className="flex-grow-1"
                        onClick={() => onViewDetails(movie)}
                    >
                        View Details
                    </Button>
                    <Button
                        variant={isInWatchlist ? "success" : "outline-light"}
                        onClick={() => onAddToWatchlist(movie)}
                        aria-label={'Add ${movie.title} to watchlist'}>
                        {isInWatchlist ? "✔" : "+"}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default MovieCard;