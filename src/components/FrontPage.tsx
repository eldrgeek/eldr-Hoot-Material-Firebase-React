import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CurrentModule } from '../js/CurrentModule';

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
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const onClick = () => {
    setText('clicked');
  };
  const changeName = event => {
    setName(event.target.value);
  };
  const [room, setRoom] = React.useState('');
  const changeRoom = event => {
    setRoom(event.target.value);
  };
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <H1> HootNet </H1>
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
            bgcolor="white"
            id="outlined-basic"
            label="Room"
            variant="outlined"
            value={name}
            onChange={changeName}
          />
          <TextField
            bgcolor="white"
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={room}
            onChange={changeRoom}
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
          {text}
        </Box>
      </form>
    </div>
  );
};
export default FrontPage;
CurrentModule(FrontPage);
