import React, { useState, ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Avatar,
  IconButtonProps
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface ExpandableCardProps {
  title: ReactNode;
  children: ReactNode;
  icon?: ReactNode;          // optional leading icon/avatar
  defaultExpanded?: boolean;
  disablePadding?: boolean;  // handy if the child already has its own CardContent
  sx?: object;               // forward extra SX styles
}

interface ExpandMoreButtonProps extends IconButtonProps {
  expand: boolean;
}

// rotate the chevron
const ExpandMore = styled((props: ExpandMoreButtonProps) => (
  <IconButton {...props} />
))(({ theme, expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  children,
  icon,
  defaultExpanded = false,
  disablePadding = false,
  sx = {},
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        mb: 3,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <CardHeader
        avatar={
          icon ? (
            typeof icon === 'string' ? (
              <Avatar sx={{ bgcolor: 'primary.main', fontSize: 16 }}>{icon}</Avatar>
            ) : (
              icon
            )
          ) : undefined
        }
        title={
          typeof title === 'string' ? (
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          ) : (
            title
          )
        }
        action={
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
        sx={{ bgcolor: 'grey.100', py: 1.5, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {disablePadding ? (
          children
        ) : (
          <CardContent sx={{ pt: 2 }}>{children}</CardContent>
        )}
      </Collapse>
    </Card>
  );
};

export default ExpandableCard;
