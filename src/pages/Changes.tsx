import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getChanges, triggerScrape } from '../services/api';
import { ChangesList } from '../components/ChangesList';
import { wsService } from '../services/websocket';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`changes-tabpanel-${index}`}
      aria-labelledby={`changes-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Changes: React.FC = () => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('24h');

  const { data: recentChangesData, isLoading: recentLoading, error: recentError } = useQuery(
    ['changes', timeRange],
    () => getChanges(5, timeRange),
    { refetchInterval: 30000 }
  );

  const { data: allChangesData, isLoading: allLoading, error: allError } = useQuery(
    'allChanges',
    () => getChanges(100),
    { refetchInterval: 30000 }
  );

  const handleScrape = async () => {
    try {
      await triggerScrape();
      queryClient.invalidateQueries(['changes', 'allChanges']);
    } catch (error) {
      console.error('Failed to trigger scrape:', error);
    }
  };

  React.useEffect(() => {
    const handleMemberChanges = () => {
      queryClient.invalidateQueries(['changes', 'allChanges']);
    };

    wsService.subscribe('member_changes', handleMemberChanges);

    return () => {
      wsService.unsubscribe('member_changes', handleMemberChanges);
    };
  }, [queryClient]);

  if (recentLoading || allLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (recentError || allError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading changes data
      </Alert>
    );
  }

  const recentChanges = [
    ...(recentChangesData?.data.newMembers?.map(m => ({
      type: 'added' as const,
      member: m,
      timestamp: new Date()
    })) || []),
    ...(recentChangesData?.data.removedMembers?.map(m => ({
      type: 'removed' as const,
      member: m,
      timestamp: new Date()
    })) || []),
    ...(recentChangesData?.data.rankChanges?.map(rc => ({
      type: 'rank_changed' as const,
      member: rc.member,
      previousRank: rc.previousRank,
      timestamp: new Date()
    })) || [])
  ];

  const allChanges = [
    ...(allChangesData?.data.newMembers?.map(m => ({
      type: 'added' as const,
      member: m,
      timestamp: new Date()
    })) || []),
    ...(allChangesData?.data.removedMembers?.map(m => ({
      type: 'removed' as const,
      member: m,
      timestamp: new Date()
    })) || []),
    ...(allChangesData?.data.rankChanges?.map(rc => ({
      type: 'rank_changed' as const,
      member: rc.member,
      previousRank: rc.previousRank,
      timestamp: new Date()
    })) || [])
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Member Changes</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleScrape}
        >
          Trigger Scrape
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Recent Changes" />
          <Tab label="All Changes" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <FormControl sx={{ mb: 2, minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
        <ChangesList changes={recentChanges} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ChangesList changes={allChanges} />
      </TabPanel>
    </Paper>
  );
}; 