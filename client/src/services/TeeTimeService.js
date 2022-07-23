import axios from 'axios';

async function bookTime() {

    console.log('Booking time!');

    const response = await axios.post('schedule', {
        "userId": "lference",
        "clubId": "18159",
        "courseId": "21182",
        "date": "2022-07-27",
        "amtPlayers": 4,
        "earliestTime": "7:30 AM",
        "latestTime": "4:00 PM",
        "isInstant": true,
        "isHeadless": true
    });
    
    return response.data;
}

export default bookTime;