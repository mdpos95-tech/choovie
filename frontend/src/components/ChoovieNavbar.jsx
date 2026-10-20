import { Container, Navbar, Nav } from "react-bootstrap";

function ChoovieNavbar({
  currentUser,
  onHome,
  onDiscover,
  onWatchlist,
  onLogin,
  onLogout,
}) {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="px-3">
      <Container>
        <Navbar.Brand className="fw-bold fs-3">
          Choovie
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="choovie-navbar" />

        <Navbar.Collapse id="choovie-navbar">
          <Nav className="ms-auto">
            <Nav.Link onClick={onHome}>
              Home
            </Nav.Link>

            <Nav.Link onClick={onDiscover}>
              Discover
            </Nav.Link>

            <Nav.Link onClick={onWatchlist}>
              Watchlist
            </Nav.Link>

            {currentUser ? (
              <>
                <Navbar.Text className="me-3">
                  Hi, {currentUser}
                </Navbar.Text>

                <Nav.Link onClick={onLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={onLogin}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ChoovieNavbar;