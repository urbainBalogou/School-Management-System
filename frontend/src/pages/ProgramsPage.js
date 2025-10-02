import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import ProgramList from '../components/ProgramList';  // ✅ AJOUTEZ CECI
import { usePrograms } from '../hooks/usePrograms';

const ProgramsPage = () => {
  console.log("ProgramsPage rendered");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { createProgram, loading } = usePrograms();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', description: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProgram(formData);
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error);
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">Programmes Académiques</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
        >
          Ajouter un Programme
        </Button>
      </div>
     
      <ProgramList />   {/* ✅ AJOUTEZ CETTE LIGNE */}
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un Programme</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nom du Programme"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            style={{ marginBottom: '15px' }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProgramsPage;