# Full stack app 

A basic API server and a React page that presents a flow graph to the user of a microservice environment.
In a microservice environment, microservices send or receive data to each other.
The graph shows all network connections between different microservices.

* The user can then select and "focus" on a microservice he wishes to center on and view its connections.
* The upper Autosuggest component should allow the user to choose a service to "focus" on in the flow graph.
* After choosing a service, the following should happen:
   * The chosen service appears at the center of the horizontal flow graph.
   * On the left side of the graph, there are all the services sending data to the chosen service.
   * On the right side of the graph, there are all the services receiving data from the chosen service.
* When clicking on a node on the flow graph - also center that microservice on the flow graph, just like the Autosuggest components focuses on it.

# Local run
1. `cd apiserver` `npm install` `node server.js`
2. `cd webapp` `npm install` `npm start`
4. View the project locally at http://localhost:3000

![image info](./pictures/services-graph.png)
