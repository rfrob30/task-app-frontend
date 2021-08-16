import React, { useState, useEffect, useContext } from "react";
import { Store } from "../../context/Store";
import UserService from "../../services/user.service";
import {
  Grid,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  Button,
  Checkbox,
  Modal,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import TaskModal from "./TaskModal";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const TaskList = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [searched, setSearched] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    UserService.getAllTasks().then(
      (response) => {
        setTaskList(response.data);
        setFilteredTaskList(response.data);
        dispatch({ type: "setTaskList", taskList: response.data });
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setTaskList(_content);
      }
    );
  }, []);

  useEffect(() => {
    setFilteredTaskList(state.taskList);
  }, [state.taskList]);

  const requestSearch = (searchedVal) => {
    setSearched(searchedVal);
    const filteredRows = state.taskList.filter((task) => {
      return task.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setFilteredTaskList(filteredRows);
  };

  const updateTask = (completed, name, task) => {
    UserService.updateTask(task._id, name, completed).then(
      (response) => {
        task.completed = response.data.completed;
        dispatch({ type: "update", newTask: response.data });
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteTask = (task) => {
    UserService.deleteTask(task._id).then(
      (response) => {
        setFilteredTaskList(filteredTaskList.filter((e) => e._id !== task._id));
        dispatch({ type: "delete", id: task._id });
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
      <Grid
        justifyContent='space-between'
        container
        className='mb-2'
        spacing={2}>
        <Grid item>
          <Typography variant='h5' component='h2'>
            Tasks
          </Typography>
        </Grid>

        <Grid item>
          <TextField
            className='mx-1'
            id='outlined-search'
            label='Search tasks'
            type='search'
            variant='outlined'
            value={searched}
            onChange={(e) => requestSearch(e.target.value)}
          />
          <Button variant='contained' color='primary' onClick={handleOpenModal}>
            + New Task
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} className='mb-5'>
        <Grid xs={12} item>
          <Card>
            <List className={classes.root}>
              {filteredTaskList.map((task) => {
                const labelId = `checkbox-list-label-${task._id}`;

                return (
                  <ListItem key={task._id} role={undefined} dense button>
                    <ListItemIcon>
                      <Checkbox
                        onChange={(e) =>
                          updateTask(e.target.checked, task.name, task)
                        }
                        edge='start'
                        checked={task.completed}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${task.name}`} />
                    <ListItemSecondaryAction
                      onClick={() => handleDeleteTask(task)}>
                      <IconButton edge='end' aria-label='delete'>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'>
        <TaskModal handleCloseModal={handleCloseModal}></TaskModal>
      </Modal>
    </>
  );
};

export default TaskList;
