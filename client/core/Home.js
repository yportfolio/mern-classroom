import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import { listPublished } from "./../course/api-course";
// import { listEnrolled, listCompleted } from "./../enrollment/api-enrollment";
import Typography from "@material-ui/core/Typography";
import auth from "./../auth/auth-helper";
// import Courses from "./../course/Courses";
// import Enrollments from "../enrollment/Enrollments";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "90%",
    margin: "auto",
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: "#ffffff",
  },
  extraTop: {
    marginTop: theme.spacing(12),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  gridList: {
    width: "100%",
    minHeight: 200,
    padding: "16px 0 10px",
  },
  tile: {
    textAlign: "center",
  },
  image: {
    height: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    textAlign: "left",
  },
  enrolledTitle: {
    color: "#efefef",
    marginBottom: 5,
  },
  action: {
    margin: "0 10px",
  },
  enrolledCard: {
    backgroundColor: "#616161",
  },
  divider: {
    marginBottom: 16,
    backgroundColor: "rgb(157, 157, 157)",
  },
  noTitle: {
    color: "lightgrey",
    marginBottom: 12,
    marginLeft: 8,
  },
}));

export default function Home() {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [courses, setCourses] = useState([]);

  //TODO enrollment feat

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCourses(courses);
      }
    });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Card className={classes.card}>
      <Typography variant="h5" component="h2">
        All Courses
      </Typography>
    </Card>
  );
}
