import { React, useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';
import Course from './Course';

function ClubCourses(props) {

    const [club, setClub] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {

        axios.get(`courses/${props.clubId}`)
            .then(res => {
                setClub(res.data);
                setCourses(res.data?.courses);
            })

    }, [props.clubId]);

    const [currCourse, setCurrCourse] = useState();

    return (
        <div>
            {
                courses.map(course =>
                    <Button key={course.id} onClick={() => setCurrCourse(course.id)}>
                        {course.name}
                    </Button>
                )
            }

            {currCourse != null && <Course selectedCourse={currCourse} {... club}/>}
        </div>
    )
}

export default ClubCourses;