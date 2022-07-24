import React from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';
import Course from './Course';

class ClubCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            currCourse: null
        }
    }

    componentDidMount() {
        this.refreshStateFromApi()
    }

    componentDidUpdate(prevProps) {

        if (this.props.clubId !== prevProps.clubId) {
            this.refreshStateFromApi()
        }
    }

    refreshStateFromApi() {
        axios.get(`courses/${this.props.clubId}`)
            .then(res => {
                const courses = res.data.courses;
                this.setState({ courses })
            })
    }

    selectCourse(courseId) {
        this.setState({currCourse: courseId})
    }

    render() {

        let currCourse = this.state.currCourse
            ? <Course clubId={this.props.clubId} courseId={this.state.currCourse}/>
            : null

        return (
            <div>
                <ul>
                    {
                        this.state.courses
                            .map(course =>
                                <Button
                                    key={course.courseId} color="green"
                                    onClick={() => this.selectCourse(course.courseId)}
                                >
                                    {course.courseName}
                                </Button>
                            )
                    }
                </ul>

                {currCourse}
            </div>
        )
    }
}

export default ClubCourses;