import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import ProgramsPage from './pages/ProgramsPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Système de Gestion Scolaire
          </Typography>
          <Button color="inherit">Programmes</Button>
          <Button color="inherit">Niveaux</Button>
          <Button color="inherit">Examens</Button>
        </Toolbar>
      </AppBar>
      
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<ProgramsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          {/* Ajouter d'autres routes ici */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;