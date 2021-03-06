import React, { useState, useEffect, useContext } from "react";
import UserService from "../services/user.service";
import { Store } from "../context/Store";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import TaskList from "./Task/TaskList";
import TaskModal from "./Task/TaskModal";
import { Redirect, Route } from "react-router-dom";
import { Pie } from "react-chartjs-2";

const Dashboard = () => {
  const { state, dispatch } = useContext(Store);
  const [content, setContent] = useState("");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // get dashboard summary
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
        updateChartData(response.data);
        dispatch({ type: "setSummary", summary: response.data });
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  useEffect(() => {
    updateChartData(content);
  }, [content.totalTasks, content.tasksCompleted]);

  const updateChartData = (data) => {
    setChartData({
      labels: ["Completed", "Incomplete"],
      datasets: [
        {
          label: "Completed Tasks",
          data: [data.tasksCompleted, data.totalTasks - data.tasksCompleted],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <Route
      render={() =>
        state.isLoggedIn ? (
          <>
            {content.totalTasks === 0 ? (
              <TaskModal></TaskModal>
            ) : (
              <>
                <Grid container spacing={2} className='my-5'>
                  <Grid xs={12} sm={4} item>
                    <Card style={{ height: 200 }}>
                      <CardContent>
                        <Typography variant='h5' component='h2'>
                          Tasks Completed
                        </Typography>
                        <Typography variant='h5' component='h2'>
                          {content.tasksCompleted} / {content.totalTasks}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <Card style={{ height: 200 }}>
                      <CardContent>
                        <Typography variant='h5' component='h2'>
                          Latest Created Tasks
                        </Typography>
                        <List>
                          {content &&
                            content.latestTasks &&
                            content.latestTasks.map((item) => (
                              <ListItem
                                key={`item-${item._id}`}
                                className={item.completed ? "cross-text" : ""}>
                                - {item.name}
                              </ListItem>
                            ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={4} item>
                    <Card style={{ height: 200 }}>
                      <CardContent>
                        <Pie
                          data={chartData}
                          width={300}
                          height={150}
                          options={{ maintainAspectRatio: false }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <TaskList></TaskList>
              </>
            )}
          </>
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

export default Dashboard;
