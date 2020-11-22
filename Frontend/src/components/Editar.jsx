import React, { Fragment, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


const Editar = (props) => {
  // Estados
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [editPersona, setEditPersona] = useState({
    id: "",
    nombre: "",
    imagen: "",
    texto: "",
  });

  if (!props.datoPersona) {
    props.history.push("/");
    return null;
  }
  const persona = props.datoPersona;
  const baseUrl = props.baseUrl;

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };
  //
  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  // Captura el valor de los inputs del modal Add
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e);
    setEditPersona((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log(persona);
  };

  // PUT
  const peticionPut = async () => {
    const { id, nombre, foto, texto } = editPersona;
    var f = new FormData();
    f.append("id", id);
    f.append("nombre", nombre);
    f.append("foto", foto);
    f.append("texto", texto);
    f.append("METHOD", "PUT");
    await axios
      .post(baseUrl, f)
      .then((response) => {
        toast('¡Registro Editado!',{ 
          type: 'info',
          autoClose: 3000,
          position: "bottom-left",
          onClose: () => {
            setEditPersona(editPersona);
            abrirCerrarModalEditar();
            props.history.push("/");
            props.setConsulta(true);
            }
          });


      })
      .catch((error) => {
        console.log(error);
      });
  };
  // DELETE
  const peticionDelete = async () => {
    var f = new FormData();
    f.append("id", editPersona.id);
    f.append("METHOD", "DELETE");
    await axios
      .post(baseUrl, f)
      .then((response) => {
        toast('¡Registro Eliminado!',{ 
          type: 'error',
          autoClose: 3000,
          position: "bottom-left",
          onClose: () => {
            abrirCerrarModalEliminar();
            props.history.push("/");
            props.setConsulta(true);
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarOpcion = (dato, caso) => {
    setEditPersona(dato);

    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };
  return (
    <Fragment>
      <ToastContainer />
      <div className="container">
        <div className="__header justify-content-between">
          <Link to="/" className="btn btn-info m-3">
            Regresar
          </Link>
          <div className="header">Amobasoftware</div>
        </div>
        <div className="personas_contenido">
          {
            <div className="datos_persona m-2" key={persona.id}>
              <div className="content_foto">
                <img
                  className="foto_perfil rounded-circle p-2"
                  src={baseUrl + 'fotos/' + persona.foto}
                  alt={persona.nombre}
                ></img>
              </div>
              <div className="content_nombre">
                <p className="nombre_persona">{persona.nombre}</p>
              </div>
              <div className="content_opciones">
                <div className="row">
                  <p className="texto_persona col-xm-12">{persona.texto}</p>
                  <div className="botones">
                    <span
                      className="bx bxs-edit opciones"
                      onClick={() => seleccionarOpcion(persona, "Editar")}
                    ></span>
                    <span
                      className="bx bxs-trash opciones trash"
                      onClick={() => seleccionarOpcion(persona, "Eliminar")}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        {/* Modal para editar */}
        <Modal isOpen={modalEditar}  className="modal-open">
          <ModalHeader>Editar person</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Nombre: </label>
              <br />
              <input
                type="text"
                className="form-control"
                name="nombre"
                onChange={handleChange}
                value={editPersona.nombre && editPersona.nombre}
              />
              <br />
              <label>imagen: </label>
              <br />
              <input
                type="input"
                disabled
                className="form-control"
                name="imagen"
                onChange={handleChange}
                value={editPersona.foto && editPersona.foto}
              />
              <br />
              <label>texto: </label>
              <br />
              <textarea
                type="text"
                className="form-control"
                name="texto"
                onChange={handleChange}
                value={editPersona.texto && editPersona.texto}
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => peticionPut()}>
              Editar
            </button>
            {"   "}
            <button
              className="btn btn-danger"
              onClick={() => abrirCerrarModalEditar()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        {/* MODAL ELIMINAR */}
        <Modal isOpen={modalEliminar}  className="modal-open"> 
          <ModalBody>
            ¿Estás seguro que deseas eliminar a{" "}
            {editPersona && editPersona.nombre}?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => peticionDelete()}>
              Sí
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => abrirCerrarModalEliminar()}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default withRouter(Editar);
