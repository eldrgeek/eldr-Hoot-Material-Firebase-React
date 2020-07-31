import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
const H1 = props => {
  return (
    <Typography align="center" variant="h1" {...props}>
      {props.children}
    </Typography>
  );
};

const H2 = props => {
  return (
    <Typography align="center" variant="h2" {...props}>
      {props.children}
    </Typography>
  );
};
const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
      textAlign: 'center',
    },
  },
}));
const FrontPage = () => {
  const classes = useStyles();
  const { actions, state } = useApp();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  const changeUser = event => {
    actions.rooms.setUserName(event.target.value);
  };
  const onClick = () => {
    if (!state.rooms.roomName) {
      setText('Please enter a room name');
      setOpen(true);
    } else if (!state.rooms.userName) {
      setText('Please enter a user name');
      setOpen(true);
    } else {
      actions.rooms.joinRoomByName();
    }
  };
  const handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }
    setOpen(false);
  };

  const changeRoom = event => {
    actions.rooms.setRoomName(event.target.value);
  };
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <H1> HootNet </H1>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {text}
        </Alert>
      </Snackbar>
      <form className={classes.root} noValidate autoComplete="off">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={1}
          m={3}
          color="primary.contrastText"
          // bgcolor="background.paper"
        >
          <TextField
            bgolor="white"
            id="outlined-basic"
            label="Room"
            variant="outlined"
            value={state.rooms.roomName}
            onChange={changeRoom}
          />
          <TextField
            bgcolor="white"
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={state.rooms.userName}
            onChange={changeUser}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={1}
          // color="primary.contrastText"
        >
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={onClick}
          >
            Hoot!
          </Button>
        </Box>
      </form>
    </div>
  );
};
export default FrontPage;
CurrentModule(FrontPage);
