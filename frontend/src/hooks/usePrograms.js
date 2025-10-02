import { useState, useEffect } from 'react';
import { programService } from '../services/programService';

export const usePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programService.getAllPrograms();
      console.log('Données reçues:', response.data);
      setPrograms(response.data.data);
      setError(null);
    } catch (err) {
        console.error('Erreur lors de la récupération des programmes:', err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (programData) => {
    try {
      const response = await programService.createProgram(programData);
      setPrograms(prev => [...prev, response.data.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const updateProgram = async (id, programData) => {
    try {
      const response = await programService.updateProgram(id, programData);
      setPrograms(prev => 
        prev.map(program => 
          program.id === id ? response.data.data : program
        )
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const deleteProgram = async (id) => {
    try {
      await programService.deleteProgram(id);
      setPrograms(prev => prev.filter(program => program.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    error,
    createProgram,
    updateProgram,
    deleteProgram,
    refetch: fetchPrograms
  };
};