import React, { Component } from 'react';
import PageTitle from '../PageTitle/PageTitle'

class Dashborad extends Component {
    state = {  }
    render() { 
        return <>
            <PageTitle title="Dashboard" button="Latest Reports" />
            <h1>Dashborad</h1>
        </>
    }
}
 
export default Dashborad;