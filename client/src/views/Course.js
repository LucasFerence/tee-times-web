import { React, useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'

import { Button, Select, Title, useMantineTheme } from '@mantine/core';
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

    const theme = useMantineTheme();

    const today = new Date()

    return (
        <form onSubmit={form.onSubmit((values) => submitForm(props, values))}>

            {course != null && <Title>{course.courseName}</Title>}

            <div>
                IMPORTANT: Any days highlighted in green will be executed upon immediately
            </div>

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
                minDate={today}
                dayStyle={(date) =>
                    date.getTime() > today.getTime()
                    && dayjs(date).subtract(7, 'days').subtract(3, 'hours').toDate().getTime() <= today.getTime()
                        ? { backgroundColor: theme.colors.green[2], color: theme.white }
                        : null
                }
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

function submitForm(props, formValues) {
    
    /*
    When the form is submitted, just submit the min/max times and date and let the
    server determine if it will be ran immediately or if it will be scheduled
    */

    const numPlayers = parseInt(formValues.numPlayers);
    const teeTimeDate = dayjs(formValues.teeTimeDate);

    // Need to set the earliest/latest time date to teeTimeDate

    const fixTimeOnDate = (dateToFix) => {
        return teeTimeDate
            .hour(dateToFix.hour())
            .minute(dateToFix.minute())
    }

    const minTime = fixTimeOnDate(dayjs(formValues.minTime));
    const maxTime = fixTimeOnDate(dayjs(formValues.maxTime));

    axios.post('schedule', {
        userId: 'lference',
        clubId: props.clubId,
        courseId: props.courseId,
        date: teeTimeDate.toJSON(),
        amtPlayers: numPlayers,
        earliestTime: minTime.toJSON(),
        latestTime: maxTime.toJSON(),
        checkout: false
    })
}

export default Course;