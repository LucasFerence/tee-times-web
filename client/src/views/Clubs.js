import { React, useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';
import ClubCourses from './ClubCourses';

function Clubs(props) {

    const [clubs, setClubs] = useState([]);

    useEffect(() => {

        axios.get('clubs')
            .then(res => {
                setClubs(res.data)
            })

    }, []);

    const [currClub, setCurrClub] = useState();

    return (
        <div>
            {
                clubs.map(club =>
                    <Button key={club.id} onClick={() => setCurrClub(club.id)}>
                        {club.name}
                    </Button>
                )
            }
            
            {currClub != null && <ClubCourses clubId={currClub}/>}
        </div>
    )
}

export default Clubs