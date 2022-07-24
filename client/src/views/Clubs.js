import React from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';
import ClubCourses from './ClubCourses';

class Clubs extends React.Component {

    constructor(props) {
        super(props);

        this.selectClub = this.selectClub.bind(this);

        this.state = {
            clubs: [],
            currClub: null
        }
      }

    componentDidMount() {

        axios.get('clubs')
            .then(res => {
                const clubs = res.data;
                this.setState({ clubs })
            })
    }

    selectClub(clubId) {
        this.setState({currClub: clubId})
    }

    render() {

        let currClub = this.state.currClub
            ? <ClubCourses clubId={this.state.currClub}/>
            : null

        return (
            <div>
                <ul>
                    {
                        this.state.clubs
                            .map(club =>
                                <Button
                                    key={club.clubId} color="green"
                                    onClick={() => this.selectClub(club.clubId)}
                                >
                                    {club.clubName}
                                </Button>
                            )
                    }
                </ul>

                {currClub}
            </div>
        )
    }
}

export default Clubs