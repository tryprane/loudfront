import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getMembers, getChanges, getStats } from '../services/api';
import { MemberCard } from '../components/MemberCard';
import { ChangesList } from '../components/ChangesList';
import { wsService } from '../services/websocket';

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  
  const { data: membersData, isLoading: membersLoading, error: membersError } = useQuery(
    'members',
    getMembers,
    { refetchInterval: 30000 }
  );

  const { data: changesData, isLoading: changesLoading, error: changesError } = useQuery(
    'changes',
    () => getChanges(5),
    { refetchInterval: 30000 }
  );

  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
    'stats',
    getStats,
    { refetchInterval: 30000 }
  );

  React.useEffect(() => {
    const handleMemberChanges = (changes: any) => {
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries(['members', 'changes', 'stats']);
    };

    wsService.subscribe('member_changes', handleMemberChanges);
    wsService.subscribe('stats_update', handleMemberChanges);

    return () => {
      wsService.unsubscribe('member_changes', handleMemberChanges);
      wsService.unsubscribe('stats_update', handleMemberChanges);
    };
  }, [queryClient]);

  if (membersLoading || changesLoading || statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (membersError || changesError || statsError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading dashboard data
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: 'primary.dark' }}>
                <Typography variant="h6">Total Members</Typography>
                <Typography variant="h4">
                  {statsData?.data.totalMembers || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: 'secondary.dark' }}>
                <Typography variant="h6">Recent Changes</Typography>
                <Typography variant="h4">
                  {(changesData?.data.newMembers?.length ?? 0) + (changesData?.data.removedMembers?.length ?? 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: 'success.dark' }}>
                <Typography variant="h6">Active Clients</Typography>
                <Typography variant="h4">
                  {statsData?.data.wsClients || 0}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Top Members
          </Typography>
          <Grid container spacing={2}>
            {membersData?.data.slice(0, 3).map((member) => (
              <Grid item xs={12} key={member.id}>
                <MemberCard member={member} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Recent Changes
          </Typography>
          <ChangesList
            changes={[
              ...(changesData?.data.newMembers.map(m => ({
                type: 'added' as const,
                member: m,
                timestamp: new Date()
              })) || []),
              ...(changesData?.data.removedMembers.map(m => ({
                type: 'removed' as const,
                member: m,
                timestamp: new Date()
              })) || []),
              ...(changesData?.data.rankChanges.map(rc => ({
                type: 'rank_changed' as const,
                member: rc.member,
                previousRank: rc.previousRank,
                timestamp: new Date()
              })) || [])
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}; 