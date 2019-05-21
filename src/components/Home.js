import React, { Component } from 'react'
import gql from "graphql-tag";
import { Query } from "react-apollo";
import BookTicket from './bookTicket'
import ApolloClient from "apollo-boost";
import Register from './Register'

// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql"
// });
const GET_EVENTS = gql`
  {
    events {
      id
      title
      tickets {
        id
        userId
        eventId
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
          eventId
          userId
        }
      }
    }
  }
`

class Home extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    bookedIds: []
  }

  // loadEvents = async () => {
  //   const data = await client.query({query: GET_EVENTS});
  //   console.log(data);
  // }
  //
  // componentDidMount() {
  //   this.loadEvents()
  // }


  showBookedTicket = (theEvent, GET_EVENTS, upcomingEvents, data) => {
    if(data.user) {
      return <BookTicket forceUpdate={this.forceUpdate.bind(this)} theEvent={theEvent} getEvents={GET_EVENTS} eventId={theEvent.id} upcomingEvents={upcomingEvents} />
    } else {
      return (
        <div className="buy-btn">
          Book
        </div>
      )
    }
  }

  showTickets = (events) => {
    console.log(localStorage.getItem("id"));
    return <Query query={GET_USER} variables={{ id: localStorage.getItem("id") }}>
      {({ loading, error, data }) => {
        if (loading) return null
        console.log(data);
        const { upcomingEvents } = data.user || []
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

  showRegister = () => {
    if(!(localStorage.getItem("id").length > 0)) return <Register forceUpdate={this.forceUpdate.bind(this)} />
  }

  render() {
    console.log("rerender");
    return(
      <Query query={GET_EVENTS}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error! ${error.message}`;
          return (
            <div className="home-container">
              {this.showRegister()}
              {this.showTickets(data.events)}
            </div>
          );
        }}
      </Query>
    )
  }
}

export default Home
