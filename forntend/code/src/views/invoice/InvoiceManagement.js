import React, { Component } from 'react';
import InvoiceFrom from './InvoiceFrom';
import { connect } from 'react-redux';
import { Card } from '@material-ui/core';

class InvoiceManagement extends Component {
    state = { };
    
    render() {
        return <Card>
            <InvoiceFrom />
        </Card>;
    }
}

const mapStateToProps = state => { return state; };
export default connect(mapStateToProps)(InvoiceManagement);