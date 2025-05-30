import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const theme = useTheme();
  const {
    name,
    handle,
    rank,
    change,
    followers,
    engaged,
    percentage,
    balance,
    balanceUsd,
    profileImage,
    twitterUrl,
  } = member;

  const getChangeColor = (change: number) => {
    if (change > 0) return theme.palette.success.main;
    if (change < 0) return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUpIcon />;
    if (change < 0) return <TrendingDownIcon />;
    return <RemoveIcon />;
  };

  const numericChange = typeof change === 'string' ? parseFloat(change) : change;
  const numericPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  const numericFollowers = typeof followers === 'string' ? parseInt(followers) : followers;
  const numericEngaged = typeof engaged === 'string' ? parseInt(engaged) : engaged;
  const numericBalanceUsd = typeof balanceUsd === 'string' ? parseFloat(balanceUsd) : balanceUsd;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={profileImage}
            alt={name}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {handle}
              </Typography>
              {twitterUrl && (
                <Tooltip title="View Twitter Profile">
                  <Chip
                    icon={<TwitterIcon />}
                    label="Twitter"
                    size="small"
                    onClick={() => window.open(twitterUrl, '_blank')}
                    sx={{
                      height: 24,
                      '& .MuiChip-icon': { fontSize: 16 },
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          </Box>
          <Chip
            label={`Rank #${rank}`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Followers
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {numericFollowers.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Engagement
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {numericEngaged.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Engagement Rate
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {numericPercentage.toFixed(2)}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Balance
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ${numericBalanceUsd.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
            borderRadius: 1,
            backgroundColor: getChangeColor(numericChange) + '15',
          }}
        >
          {getChangeIcon(numericChange)}
          <Typography
            variant="subtitle1"
            sx={{
              color: getChangeColor(numericChange),
              fontWeight: 600,
            }}
          >
            {numericChange > 0 ? '+' : ''}
            {numericChange}% Change
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 