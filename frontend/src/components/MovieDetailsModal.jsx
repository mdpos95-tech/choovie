import { Modal, Row, Col, Button } from "react-bootstrap";

function MovieDetailsModal({
  movie,
  resultsTitle,
  watchlistMessage,
  onClose,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) {
  return (
    <Modal
      show={movie !== null}
      onHide={onClose}
      centered
      size="lg"
      data-bs-theme="dark"
    >
      {movie && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{movie.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <Col md={5}>
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="img-fluid rounded"
                  />
                )}
              </Col>

              <Col md={7}>
                <h4>{movie.title}</h4>

                <p>
                  <strong>Release date:</strong>{" "}
                  {movie.release_date || "Unknown"}
                </p>

                {movie.vote_average !== undefined && (
                  <p>
                    <strong>Rating:</strong>{" "}
                    ★ {movie.vote_average?.toFixed(1)}
                  </p>
                )}

                <p>
                  {movie.overview || "No description available."}
                </p>
              </Col>
            </Row>

            {watchlistMessage && (
              <div className="alert alert-info mt-3">
                {watchlistMessage}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
  {resultsTitle === "My Watchlist" ? (
    <Button
      variant="outline-danger"
      onClick={onRemoveFromWatchlist}
    >
      Remove from Watchlist
    </Button>
  ) : (
    <Button
      variant="danger"
      onClick={onAddToWatchlist}
    >
      + Add to Watchlist
    </Button>
  )}

  <Button variant="secondary" onClick={onClose}>
    Close
  </Button>
</Modal.Footer>
        </>
      )}
    </Modal>
  );
}

export default MovieDetailsModal;