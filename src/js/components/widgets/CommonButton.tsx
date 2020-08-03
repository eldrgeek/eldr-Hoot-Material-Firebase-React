import React from 'react';
import Button from '@material-ui/core/Button';
import { CurrentModule } from '../../CurrentModule';

const CommonButton = ({ onClick = () => null, label = 'label' }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      component="span"
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
export default CommonButton;
CurrentModule(CommonButton);
