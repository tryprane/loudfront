import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  useTheme,
  Divider,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { MemberChange } from '../types';

interface ChangesListProps {
  changes: MemberChange[];
}

export const ChangesList: React.FC<ChangesListProps> = ({ changes }) => {
  const theme = useTheme();

  const getChangeIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'new':
        return <PersonAddIcon sx={{ color: theme.palette.success.main }} />;
      case 'removed':
        return <PersonRemoveIcon sx={{ color: theme.palette.error.main }} />;
      case 'rank_up':
        return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'rank_down':
        return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <PersonAddIcon sx={{ color: theme.palette.primary.main }} />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'new':
        return theme.palette.success.main;
      case 'removed':
        return theme.palette.error.main;
      case 'rank_up':
        return theme.palette.success.main;
      case 'rank_down':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getChangeLabel = (type: string) => {
    switch (type) {
      case 'new':
        return 'New Member';
      case 'removed':
        return 'Removed';
      case 'rank_up':
        return 'Rank Up';
      case 'rank_down':
        return 'Rank Down';
      default:
        return type;
    }
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {changes.map((change, index) => (
        <React.Fragment key={`${change.member.handle}-${change.timestamp}-${index}`}>
          <ListItem
            alignItems="flex-start"
            sx={{
              py: 2,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={change.member.profileImage}
                alt={change.member.name}
                sx={{
                  border: `2px solid ${getChangeColor(change.type)}`,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                  >
                    {change.member.name}
                  </Typography>
                  <Chip
                    icon={getChangeIcon(change.type)}
                    label={getChangeLabel(change.type)}
                    size="small"
                    sx={{
                      backgroundColor: getChangeColor(change.type) + '15',
                      color: getChangeColor(change.type),
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    {change.member.handle}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {new Date(change.timestamp).toLocaleString()}
                  </Typography>
                  {change.previousRank && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      Previous Rank: #{change.previousRank}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
          {index < changes.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}; 