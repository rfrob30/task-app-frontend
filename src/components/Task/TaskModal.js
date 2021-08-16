import React, { useState, useContext } from "react";
import { Store } from "../../context/Store";
import { makeStyles } from "@material-ui/core/styles";
import UserService from "../../services/user.service";
import { TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TaskModal = React.forwardRef(({ handleCloseModal }) => {
  const classes = useStyles();
  const { dispatch } = useContext(Store);
  const [modalStyle] = useState(getModalStyle);
  const [name, setName] = useState("");

  const handleSubmitTask = () => {
    const data = {
      name,
      completed: false,
    };
    UserService.createTask(data).then(
      (response) => {
        if (!!handleCloseModal) {
          handleCloseModal();
        }
        dispatch({ type: "add", newTask: response.data });
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  };

  return (
    <>
      <div style={modalStyle} className={classes.paper}>
        <h2>+ New Task</h2>
        <TextField
          id='task-name'
          label='Task Name'
          variant='outlined'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='my-3'
        />
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmitTask}>
            + New Task
          </Button>
        </div>
      </div>
    </>
  );
});

export default TaskModal;
