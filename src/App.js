import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles'
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Home from './components/Home'
import Header from './components/Header'
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div className="container">
        <Header />
        <Switch>
          <Route exact path="/" component={ Home } client={client}/>
        </Switch>
      </div>
    </Router>
  </ApolloProvider>
);

export default App;
