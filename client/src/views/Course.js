import { React, useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'

import { Button, Select, Title } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

function Course(props) {

    // Load the course, add it to state
    const [course, setCourse] = useState();

    useEffect(() => {

        axios.get(`courses/${props.clubId}/${props.courseId}`)
            .then(res => {
                setCourse(res.data)
            })

    }, [props.clubId, props.courseId])

    // Initialize the form

    const form = useForm({

        initialValues: {
            numPlayers: '4',
            teeTimeDate: null,
            minTime: null,
            maxTime: null
        },

        validate: {
            teeTimeDate: (value) => (value == null ? 'Must select tee time date' : null),
            minTime: (value) => (value == null ? 'Must select minimum time' : null),
            maxTime: (value) => (value == null ? 'Must select maxium time' : null)
        }
    })

    return (
        <form onSubmit={form.onSubmit(console.log)}>

            <Title>{course.courseName}</Title>

            <Select
                label="Number of players"
                data={['1','2','3','4']}
                required
                {...form.getInputProps('numPlayers')}
            />

            <DatePicker
                placeholder="Pick Date"
                label="Tee time date"
                required
                minDate={dayjs(new Date()).toDate()}
                {...form.getInputProps('teeTimeDate')}
            />

            <TimeInput
                label="Earliest Time"
                format="12"
                required
                {...form.getInputProps('minTime')}
            />

            <TimeInput
                label="Latest Time"
                format="12"
                required
                {...form.getInputProps('maxTime')}
            />

            <Button type="submit">Submit</Button>
        </form>
    );
}

export default Course;