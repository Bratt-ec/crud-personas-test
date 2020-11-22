import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Personas = ({ data, setData, setConsulta, baseUrl}) => {
  const Personas = data;
  const [dato, setDato] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [persona, setPersona] = useState({
    id: "",
    nombre: "",
    texto: "",
  });
  
  // Captura el valor de los inputs del modal Add
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e);
    setPersona((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log(persona);
  };
  //
  const alertaSucces = () => {
    toast.success("Registro Creado!", {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  };
  const alertaError = (error) =>{
    toast.error("Error!" + error, {
      position: toast.POSITION.BOTTOM_LEFT
    });
  }
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };
  //      Regresar registros
  function CancelarFiltro() {
    setConsulta(true);
  }
  //  Post
  const peticionPost = async () => {
    const { nombre, texto } = persona;
    var f = new FormData();
    f.append("imagen", imagen);
    f.append("nombre", nombre);
    f.append("texto", texto);
    f.append("METHOD", "POST");
    await axios({
      url: baseUrl,
      method: "POST",
      data: f,
      enctype: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        toast('¡Registro Creado!',{ 
          type: 'success',
          autoClose: 3000,
          position: "bottom-left",
          onClose: () => {
            setDato(dato.concat(response.data));
            abrirCerrarModalInsertar();
            setConsulta(true);
            }
          });

      })
      .catch((error) => {
        console.log(error);
        alertaError(error);
      });
  };


  return (
    <Fragment>
      <ToastContainer />
      <div className="container">
        <div className="__header">
          <div className="header">Amobasoftware</div>
        </div>
        <div className="opcion_buscar">
          <div className="input_buscar">
            <div className="input-group input-group-lg">
              <div className="input-group-prepend">
                <i className="bx bx-search-alt input-group-text "></i>
              </div>
              <input
                type="text"
                className="form-control"
                name="txt-buscar"
                aria-label="Sizing example input"
                placeholder="Buscar Persona"
                aria-describedby="inputGroup-sizing-lg"
                onChange={(e) => {
                  const Busqueda = Personas.filter(
                    (personas) => personas.nombre === e.target.value
                  );
                  // console.log(e);
                  if (Busqueda[0] !== undefined) {
                    setData(Busqueda);
                    const cancelBtn = document.querySelector("#cancel");
                    cancelBtn.classList.toggle("ocultar");
                  }
                }}
              />
              <i
                className="bx bx-x cancel"
                id="cancel"
                onClick={() => CancelarFiltro()}
              ></i>
            </div>
          </div>
        </div>

        <div className="opcion_nuevo ">
          <div className="btn-nuevo">
            <button
              name="btn-agregar"
              className="btn btn-warning btn-lg"
              id="btn-agregar"
              onClick={() => abrirCerrarModalInsertar()}
            >
              <span className="bx bxs-user-plus m-1"></span>
              Agregar Contacto
            </button>
          </div>
        </div>
        <div className="personas_contenido">
          {Personas.map((persona) => (
            <div className="datos_persona m-2" key={persona.id}>
              <div className="content_foto">
                <img
                  className="foto_perfil rounded-circle my-2"
                  src={baseUrl + "fotos/" + persona.foto}
                  alt={persona.nombre}
                ></img>
              </div>
              <div className="content_nombre">
                <p className="nombre_persona">{persona.nombre}</p>
              </div>
              <div className="content_opciones">
                <div className="row">
                  <p className="texto_persona col-xm-12">{persona.texto}</p>
                  <Link
                    to={`/persona/${persona.id}`}
                    className="editar-op col-xm-12"
                    key={persona.id}
                  >
                    <i className="bx bxs-edit"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={modalInsertar} className="modal-open">
        <ModalHeader>Insertar Framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Cargar Imagen </label>
            <br />
            <div className="cargar-foto">
              <input
                type="file"
                name="imagen"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </div>
            <br />
            <label>Nombre:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
            />
            <br />
            <label>Descripción: </label>
            <br />
            <textarea
              type="text"
              className="form-control"
              name="texto"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-warning" onClick={() => peticionPost()}>
            Guardar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </button>
        </ModalFooter>
        <ToastContainer />
      </Modal>
    </Fragment>
  );
};

export default Personas;
