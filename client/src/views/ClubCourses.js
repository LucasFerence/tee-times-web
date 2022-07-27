import { React, useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';
import Course from './Course';

function ClubCourses(props) {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        axios.get(`courses/${props.clubId}`)
            .then(res => {
                setCourses(res.data?.courses)
            })

    }, [props.clubId]);

    const [currCourse, setCurrCourse] = useState();

    return (
        <div>
            {
                courses.map(course =>
                    <Button key={course.courseId} onClick={() => setCurrCourse(course.courseId)}>
                        {course.courseName}
                    </Button>
                )
            }

            {currCourse != null && <Course clubId={props.clubId} courseId={currCourse}/>}
        </div>
    )
}

export default ClubCourses;