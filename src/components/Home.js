import React, { Component } from 'react'
import gql from "graphql-tag";
import { Query } from "react-apollo";
import BookTicket from './bookTicket'
const GET_EVENTS = gql`
  {
    events {
      id
      title
      tickets {
        id
      }
    }
  }
`;

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      email
      upcomingEvents {
        id
        title
        tickets {
          id
        }
      }
    }
  }
`

class Home extends Component {
  state = {
    bookedIds: []
  }

  showBookedTicket = (theEvent, GET_EVENTS, upcomingEvents, data) => {
    if(data.user) {
      console.log("here");
      return <BookTicket theEvent={theEvent} getEvents={GET_EVENTS} eventId={theEvent.id} upcomingEvents={upcomingEvents} />
    } else {
      return (
        <div className="buy-btn">
          Book
        </div>
      )
    }
  }

  showTickets = (events) => {
    return <Query query={GET_USER} variables={{ id: localStorage.getItem("id") }}>
      {({ loading, error, data }) => {
        if (loading) return null
        const { upcomingEvents } = data.user || []
        console.log(data.user);
        return (
          events.map( theEvent  => {
            return (
              <div key={String(theEvent.title) + String(theEvent.id)} className="ticket-container">
                <img className="ticket-img" src="https://cdn.pixabay.com/photo/2014/04/02/10/23/ticket-303706__340.png" alt="" />
                <div className="event-title">
                  <div>{theEvent.title}</div>
                  {this.showBookedTicket(theEvent, GET_EVENTS, upcomingEvents, data)}
                </div>
             </div>
            )
          })
        );
      }}
    </Query>
  }

  render() {
    return(
      <Query query={GET_EVENTS}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error! ${error.message}`;
          return (
            <div className="home-container">
              {this.showTickets(data.events)}
            </div>
          );
        }}
      </Query>
    )
  }
}

export default Home
