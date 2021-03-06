import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/Group";
import CompletedIcon from "@material-ui/icons/VerifiedUser";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { read, update } from "./api-course.js";
// import { enrollmentStats } from "./../enrollment/api-enrollment";
import { Link, Redirect } from "react-router-dom";
import auth from "./../auth/auth-helper";
import DeleteCourse from "./DeleteCourse";
import Divider from "@material-ui/core/Divider";
import NewLesson from "./NewLesson";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Enroll from "./../enrollment/Enroll";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 190,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statSpan: {
    margin: "7px 10px 0 10px",
    alignItems: "center",
    color: "#616161",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#b6ab9a",
    },
  },
  enroll: {
    float: "right",
  },
}));

const Course = ({ match }) => {
  const classes = useStyles();

  const [stats, setStats] = useState({});
  const [course, setCourse] = useState({ instructor: {} });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const [open, setOpen] = useState(false);

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: match.params.courseId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse(data);
      }
    });
    return () => {
      abortController.abort();
    };
  }, [match.params.courseId]);

  //TODO enrollment useEffect

  const clickPublish = () => {
    console.log(course.lessons.length);
    if (course.lessons.length > 0) {
      setOpen(true);
    }
  };

  //Why there is no new course data
  //It's in edit course data
  const publish = () => {
    let courseData = new FormData();
    courseData.append("published", true);
    update(
      { courseId: match.params.courseId },
      { t: jwt.token },
      courseData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse({ ...course, publish: true });
        setOpen(false);
      }
    });
  };

  const removeCourse = (course) => {
    setValues({ ...values, redirect: true });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addLesson = (course) => {
    setCourse(course);
  };

  if (values.redirect) {
    return <Redirect to={"/teach/courses"} />;
  }

  const imageUrl = course._id
    ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
    : "/api/courses/defaultphoto";

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          title={course.name}
          subtitle={
            <div>
              <Link
                to={"/user/" + course.instructor._id}
                className={classes.sub}
              >
                by {course.instructor.name}
              </Link>
              <span className={classes.category}>{course.category}</span>
            </div>
          }
          action={
            <>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id == course.instructor._id && (
                  <span className={classes.action}>
                    <Link to={"/teach/course/edit/" + course._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>

                    {!course.published ? (
                      <>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={clickPublish}
                        >
                          {course.lessons.length == 0
                            ? "Add at least 1 lesson to publish"
                            : "Publish"}
                        </Button>
                        <DeleteCourse course={course} onRemove={removeCourse} />
                      </>
                    ) : (
                      <>
                        <Button color="secondary" variant="outlined">
                          Published
                        </Button>
                      </>
                    )}
                  </span>
                )}

              {course.published && (
                <div>
                  <span className={classes.statSpan}>
                    <PeopleIcon />
                    {stats.totalEnrolled} enrolled
                  </span>

                  <span className={classes.statSpan}>
                    <PeopleIcon />
                    {stats.totalCompleted} completed
                  </span>
                </div>
              )}
            </>
          }
        />

        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={course.name}
          />

          <div className={classes.details}>
            <Typography variant="body1" className={classes.subheading}>
              {course.description}
              <br />
            </Typography>

            {/* {course.published && (
              <div>
                <Enroll courseId={course._id} />
              </div>
            )} */}
          </div>
        </div>
        <Divider />

        <CardHeader
          title={
            <Typography variant="h6" className={classes.subheading}>
              lessons
            </Typography>
          }
          subheader={
            <Typography variant="body1" className={classes.subheading}>
              {course.lessons && course.lessons.length} lessons
            </Typography>
          }
          action={
            auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == course.instructor._id &&
            !course.published && (
              <span className={classes.action}>
                <NewLesson courseId={course._id} addLesson={addLesson} />
              </span>
            )
          }
        />

        <List>
          {course.lessons &&
            course.lessons.map((lesson, index) => {
              return (
                <span key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{index + 1}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={lesson.title} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </span>
              );
            })}
        </List>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Publish course</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Publishing your course will make it live to students for enrollment.
          </Typography>
          <Typography variant="body1">
            Make sure all lessons are added and ready for publishing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={publish} color="primary" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Course;
