import { Box } from '@mui/material';
import { LOGO_PATH, COMPANY_NAME, APP_NAME } from '../../utils/constants';

function BrandLogo({
  height = 48,
  maxWidth,
  showAppName = false,
  centered = false,
  sx = {},
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        ...sx,
      }}
    >
      <Box
        component="img"
        src={LOGO_PATH}
        alt={COMPANY_NAME}
        sx={{
          height,
          width: 'auto',
          maxWidth: maxWidth || '100%',
          objectFit: 'contain',
          display: 'block',
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 0.5,
        }}
      />
      {showAppName && (
        <Box
          component="span"
          sx={{
            mt: 0.5,
            fontSize: '0.75rem',
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: centered ? 'center' : 'left',
          }}
        >
          {APP_NAME}
        </Box>
      )}
    </Box>
  );
}

export default BrandLogo;
