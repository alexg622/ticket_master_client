import React from 'react'
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_TICKET = gql`
  mutation createTicket($userId: ID!, $eventId: ID!) {
    createTicket(userId: $userId, eventId: $eventId) {
      id
      userId
      eventId
    }
  }
`

const DELETE_TICKET = gql`
  mutation deleteTicket($id: ID!) {
    deleteTicket(id: $id) {
      id
    }
  }
`

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      email
      upcomingEvents {
        title
        id
      }
    }
  }
`;

export default (props) => {
  const { upcomingEvents, eventId } = props
  const userId = localStorage.getItem("id")

  const handleClick = (createTicket, event) => {
    event.persist()
    createTicket({ variables: { eventId,  userId }})
    .then(res => {
      event.target.innerText = "Booked"
      props.forceUpdate()
    })
    .catch(err => console.log(err))
  }

  const handleClickDelete = (deleteTicket, event) => {
    event.persist()
    let ticketToDel = null
    let theEventId = event.id
    let theUserId = localStorage.getItem("id")
    upcomingEvents.forEach(upEv => {
      if(upEv.id === eventId) {
        upEv.tickets.forEach(tic => {
          if(tic.userId === theUserId) ticketToDel = tic.id
        })
      }
    })
    deleteTicket({ variables:  {id: ticketToDel} })
    .then(res => {
      event.target.innerText = "Book"
      props.forceUpdate()
    })
    .catch(error => console.log(error))
  }

  const makeEventIds = (upcomingEvents) => {
    return upcomingEvents.map(event => event.id)
  }

  const showBookingStatus = (eventId) => {
    const eventIds = makeEventIds(upcomingEvents)
    if(eventIds.includes(eventId)) {
      return (
        <Mutation
          mutation={DELETE_TICKET}
          update={(cache, { data }) => {
            let res = cache.readQuery({query: GET_USER, variables: {id: localStorage.getItem("id")}})
            cache.writeQuery({
              query: GET_USER,
              variables: localStorage.getItem("id"),
              data
            })
          }}
        >
          {(deleteTicket, { data }) => {
            return (
              <div className="buy-btn" onClick={(event) => handleClickDelete(deleteTicket, event)}>
                Booked
              </div>
            )
          }}
        </Mutation>
      )
    } else {
      return (
        <Mutation
          mutation={CREATE_TICKET}
          update={(cache, { data }) => {
            let res = cache.readQuery({query: GET_USER, variables: {id: localStorage.getItem("id")}})
            cache.writeQuery({
              query: GET_USER,
              variables: localStorage.getItem("id"),
              data
            })
            this.forceUpdate()
          }}
        >
          {(createTicket, { data }) => {
            return (
              <div className="buy-btn" onClick={(event) => handleClick(createTicket, event)}>
                {eventIds.includes(eventId) ? "Booked" : "Book"}
              </div>
            )
          }}
        </Mutation>
      )
    }
  }

  return (
    showBookingStatus(eventId)
  )
}
