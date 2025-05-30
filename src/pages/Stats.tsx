import React from 'react';
import { useQuery } from 'react-query';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getStats } from '../services/api';

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const Stats: React.FC = () => {
  const { data: statsData, isLoading, error } = useQuery(
    'stats',
    getStats,
    { refetchInterval: 30000 }
  );

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
        Error loading statistics
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            System Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Uptime</Typography>
              <Typography variant="h6">
                {formatUptime(statsData?.data.uptime ?? 0)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Memory Usage</Typography>
              <Typography variant="h6">
                {formatBytes(statsData?.data.memoryUsage ?? 0)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Active WebSocket Clients</Typography>
              <Typography variant="h6">
                {statsData?.data.wsClients ?? 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Member Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Total Members</Typography>
              <Typography variant="h6">
                {statsData?.data.totalMembers ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Total Changes</Typography>
              <Typography variant="h6">
                {statsData?.data.totalChanges ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">History Snapshots</Typography>
              <Typography variant="h6">
                {statsData?.data.historySnapshots ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Last Update</Typography>
              <Typography variant="h6">
                {statsData?.data.lastUpdate ? new Date(statsData.data.lastUpdate).toLocaleString() : 'Never'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}; 