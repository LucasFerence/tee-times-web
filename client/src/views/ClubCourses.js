import React from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';

class ClubCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            currCourse: null
        }
    }

    componentDidMount() {

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
            ? <Button>Book: {this.state.currCourse}</Button>
            : null

        return (
            <div>
                <ul>
                    {
                        this.state.courses
                            .map(courses =>
                                <Button
                                    key={courses.courseId} color="green"
                                    onClick={() => this.selectCourse(courses.courseId)}
                                >
                                    {courses.courseName}
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