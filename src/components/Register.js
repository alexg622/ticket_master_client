import React, { useState, useRef } from 'react'
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_USER = gql`
  mutation createUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
      email
    }
  }
`;

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("")
  const modalContainer = useRef(null)

  const handleSubmit = (e, createUser) => {
    e.preventDefault()
    createUser({ variables: { email, password } })
    .then( ( {data: { createUser: { id } } } ) => {
      localStorage.setItem("id", id)
      modalContainer.current.style.display = "none"
    })
    .catch(e => {
      let newErrors = e.graphQLErrors[0].message
      setErrors(newErrors)
      setTimeout(() => {
        setErrors("")
      }, 5000)
    })
  }

  return(
    <div  ref={modalContainer} className="modal">
      <Mutation
        mutation={CREATE_USER}
        update={(cache, { data: { createUser } }) => {
          console.log(createUser);
          console.log(cache);
        }}
      >
        {(createUser, { data }) => (
          <form
            onSubmit={e => handleSubmit(e, createUser)}
            className="register-form"
          >
            {errors.length > 0 ? <div style={{ marginBottom: "2%", color: "red"}} className="errors">{errors}</div> : null}
            <div className="register-text">Register for Ticket Master</div>
            <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="submit" value="Register" />
          </form>
        )}
      </Mutation>
    </div>
  )
}
