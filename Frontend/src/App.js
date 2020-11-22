import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import Personas from './components/Personas';
import Editar from './components/Editar';

function App() {
  const baseUrl="https://desarrollo-pruebas-nexus.000webhostapp.com/";
  // Estados
  const[data,setData] = useState([]);
  const [consulta, setConsulta] = useState(true);
// 
    const peticionGet = async () =>{
      await axios.get(baseUrl)
        .then(response=>{
          setData(response.data);
          setConsulta(false);
        })
    }

    // Add use effect
    useEffect( () =>{
      peticionGet();
    },[consulta]);
    
  return (
    <Router>
      <Switch>
        <Route 
          path="/"
          exact
          component={ ()=> 
            <Personas 
              data={data}
              setData={setData}
              setConsulta={setConsulta}
              baseUrl={baseUrl}            
            />
          }
        />
        <Route
          exact
          path="/persona/:id"
          render={ (props) =>{
            const datoPersona = data.filter(persona => persona.id === props.match.params.id); 
            // console.log(datoPersona);
            return(
              <Editar
                datoPersona = {datoPersona[0]}
                setConsulta={setConsulta}   
                baseUrl={baseUrl}             
              />
            )
          }}  
        />
      </Switch>
    </Router>
  );
}

export default App;
