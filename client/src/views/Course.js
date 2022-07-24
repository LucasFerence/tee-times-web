import React from 'react';
import axios from 'axios';

class Course extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            course: null
        }
    }

    componentDidMount() {
        this.refreshStateFromApi()
    }

    componentDidUpdate(prevProps) {

        if (this.props.courseId !== prevProps.courseId) {
            this.refreshStateFromApi()
        }
    }

    refreshStateFromApi() {
        axios.get(`courses/${this.props.clubId}/${this.props.courseId}`)
            .then(res => {
                const course = res.data;
                this.setState({ course })
            })
    }

    render() {

        let courseName = this.state.course != null
            ? this.state.course.courseName
            : null

        return (
            <div>
                {courseName}
            </div>
        )
    }
}

export default Course;