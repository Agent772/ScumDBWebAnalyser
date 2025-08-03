
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getAvailableLanguages } from '../utils/i18n';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { COLORS } from './helpers/colors';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const languages = getAvailableLanguages();

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <LanguageIcon sx={{ color: COLORS.primary, mr: 1, my: 0.5 }} />
      <FormControl variant="standard" size="small">
        <Select
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          label="Language"
          style={{ minWidth: 50 }}
          size="small"
          sx={{ color: COLORS.text }}
          aria-label="Select language"
          MenuProps={{
            PaperProps: {
              sx: {
                color: COLORS.text,
                backgroundColor: COLORS.elevation2,
              },
            },
          }}
        >
          {languages.map(lang => (
            <MenuItem key={lang} value={lang}>{lang.toUpperCase()}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
