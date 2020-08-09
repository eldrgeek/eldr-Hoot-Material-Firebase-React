import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { CurrentModule } from '../CurrentModule';
import { useApp } from '../../app';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useQueryState } from 'use-location-state';
import { H1, H3 } from './Typography';
const from = 'frontPage';
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
  const { actions, state, reaction } = useApp();
  const [roomName, setRoomName] = useQueryState('room', 'main');
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  // React.useEffect(() => {
  //   actions.rooms.updateFromStorage()
  // },[])
  React.useEffect(() => {
    actions.rooms.updateFromStorage({ from });
    actions.rooms.setRoomName({ from, roomName });
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const cleanup = reaction(
      ({ rooms }) => rooms.roomName,
      roomName => {
        actions.rooms.updateStorage({ from });
        setRoomName(roomName);
      }
    );
    window.addEventListener('beforeunload', function(e) {
      delete e['returnValue'];
      actions.rooms.leaveRoom({ from: 'FrontPage before Unloada' });
    });
    return () => {
      cleanup();
    };
    // eslint-disable-next-line
  }, []);
  const changeUser = event => {
    actions.rooms.setUserName({ from, userName: event.target.value });
    actions.rooms.updateStorage({ from });
  };
  const onClick = async () => {
    if (!state.rooms.roomName) {
      setText('Please enter a room name');
      setOpen(true);
    } else if (!state.rooms.userName) {
      setText('Please enter a user name');
      setOpen(true);
    } else {
      const sequence = await actions.rooms.getSessionId({ from });
      setText(' sequence is ' + sequence);
      setOpen(true);
      actions.rooms.joinRoomByName({ from });
      actions.setPage({ from, page: 'chat' });
    }
  };
  const handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }
    setOpen(false);
  };

  const changeRoom = event => {
    actions.rooms.setRoomName({ from, roomName: event.target.value });
  };
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <H1> HootNet </H1>
      <H3> make music together </H3>

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
