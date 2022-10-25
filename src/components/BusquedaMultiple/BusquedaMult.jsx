import React, { useEffect } from "react";
import BtnNew from "../BtnNew";
import TblBusquedaMult from "./TblBusquedaMult";

const BusquedaMult = ({
  showBusMult,
  setshowBusMult,
  rangos,
  setrangos,
  ind_rangos,
  setind_rangos,
  type_input,
  settype_input,
}) => {
  useEffect(() => {
    if (showBusMult.length === 0) {
      setrangos([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
    }
  }, [ind_rangos]);

  const AgregarFila = () => {
    if (
      rangos[rangos.length - 1].Low.trim() !== "" ||
      rangos[rangos.length - 1].High !== ""
    ) {
      setrangos([...rangos, { Sign: "I", Option: "EQ", Low: "", High: "" }]);
    }
  };

  const selectOption = (e, key) => {
    switch (e.target.value) {
      case "1":
        rangos[key].Option = "EQ";

        break;
      case "2":
        rangos[key].Option = "GE";

        break;
      case "3":
        rangos[key].Option = "LE";

        break;
      case "4":
        rangos[key].Option = "GT";

        break;
      case "5":
        rangos[key].Option = "LT";

        break;
      case "6":
        rangos[key].Option = "NE";

        break;
      case "7":
        rangos[key].Option = "BT";

        break;
      // case "8":
      //   rangos[key].Option='EQ'
      //   console.log(rangos)
      // break;
      default:
        break;
    }
  };
  //formateo de la fecha para enviar a SAP YYYYMMDD
  function formatDateSAP(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return year + "" + month + "" + day;
  }
  const handleChangeInput = (e, key) => {
    switch (e.target.name) {
      case "de_" + key:
        rangos[key].Low = e.target.value;
        break;
      case "a_" + key:
        rangos[key].High = e.target.value;
      default:
        break;
    }
    listar();
  };
  const EliminarFila = (e, key) => {
    if (key !== 0) {
      rangos.splice(key, 1);
      listar();
    } else {
      if (rangos.length === 1) {
        setrangos([]);
        setrangos([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
      } else {
        rangos.splice(key, 1);
        listar();
      }
    }
  };
  const EliminarTodo = () => {
    setrangos([]);
    setrangos([{ Sign: "I", Option: "EQ", Low: "", High: "" }]);
  };
  const Guardar = () => {
    if (rangos.length >= 2) {
      for (let index = 0; index < rangos.length; index++) {
        if (
          rangos[index].Low.trim() === "" &&
          rangos[index].High.trim() === ""
        ) {
          rangos.splice(index, 1);
        } else if (
          rangos[index].Low.trim() === "" &&
          rangos[index].High.trim() === ""
        ) {
        }
        if (rangos.length - 1 === index) {
          setshowBusMult(false);
          // ind_rangos.bool=false;
          setind_rangos({ num: ind_rangos.num, bool: false });
        }
      }
    } else {
      setshowBusMult(false);
      // ind_rangos.bool=false;
      setind_rangos({ num: ind_rangos.num, bool: false });
    }
    console.log(rangos)
  };
  const listar = () => {
    setrangos([...rangos]);
  };
  return (
    <>
      {showBusMult ? (
        <div className="container-modal-background">
          <div className="modal-wrapper-rangos modal-wrapper-sm">
            <section
              className=""
              style={{ margin: "auto", paddingTop: "50px" }}
            >
              <div className="row" style={{ margin: "10px" }}>
                <div className=" col-xs-12 col-sm-12 col-lg-6">
                  <BtnNew
                    attribute={{
                      name: "btnNuevo",
                      value: "Agregar Fila",
                      classNamebtn: "btn_new",
                    }}
                    onClick={AgregarFila}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-lg-6">
                  <BtnNew
                    attribute={{
                      name: "btnNuevo",
                      value: "Eliminar todo",
                      classNamebtn: "btn_new",
                    }}
                    onClick={EliminarTodo}
                  />
                </div>
              </div>
            </section>
            <TblBusquedaMult
              rangos={rangos}
              selectOption={selectOption}
              handleChangeInput={handleChangeInput}
              EliminarFila={EliminarFila}
              type_input={type_input}
            />
            <section
              className=""
              style={{ margin: "auto", paddingTop: "50px" }}
            >
              <div style={{ margin: "10px" }}>
                <BtnNew
                  attribute={{
                    name: "btnNuevo",
                    value: "Aceptar",
                    classNamebtn: "btn_new",
                  }}
                  onClick={Guardar}
                />
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BusquedaMult;
