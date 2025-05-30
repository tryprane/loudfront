import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Grid,
} from '@mui/material';
import { getMembers } from '../services/api';
import { MemberCard } from '../components/MemberCard';

export const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: membersData, isLoading, error } = useQuery(
    'members',
    getMembers,
    { refetchInterval: 30000 }
  );

  const filteredMembers = React.useMemo(() => {
    if (!membersData?.data) return [];
    
    const query = searchQuery.toLowerCase();
    return membersData.data.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.handle.toLowerCase().includes(query) ||
      member.rank.toString().includes(query)
    );
  }, [membersData?.data, searchQuery]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading members
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Members
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, handle, or rank..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          {filteredMembers.length} members found
        </Typography>
      </Box>

      {filteredMembers.length === 0 ? (
        <Alert severity="info">
          No members found matching your search criteria
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <MemberCard member={member} />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}; 