import React, { useEffect, useState } from "react";
import InputForm from "../../components/InputForm";
import BtnAcept from "../../components/BtnSearch";
import { ConsPedidoFiltro } from "../../Services/ServicePedidos";

const FiltroConsultaPedido = ({
  showFiltroConsultaPedido,
  setshowFiltroConsultaPedido,
  model_filtro,
  setmodel_filtro,
  model_conspedido,
  setresponse_consulta_pedido,
  setspinner,
  setTotalData,
  indicadorfiltro,
  pageNumber
}) => {

  // const [response_consulta_pedido, setresponse_consulta_pedido] = useState([]);
  const [vbelnField, setvbelnField] = useState("");
  const [vkorgField, setvkorgField] = useState("");
  const [erdatField, seterdatField] = useState("");
  const [kunnrField, setkunnrField] = useState("");
  const [name1Field, setname1Field] = useState("");
  const [netwrField, setnetwrField] = useState("");
  const [waerkField, setwaerkField] = useState("");
  // const [text1Field, settext1Field] = useState("");
  const [statusField, setstatusField] = useState("");
  // const [motivoField, setmotivoField] = useState("");

  useEffect(() => {
    setvbelnField("");
    setvkorgField("");
    seterdatField("");
    setkunnrField("");
    setname1Field("");
    setnetwrField("");
    setwaerkField("");
    setstatusField("");
    // if(showFiltroConsultaPedido==true){
    //   setindicadorfiltro(true);
    // }
    // else{
    //   setindicadorfiltro(false);
    // }
  }, [showFiltroConsultaPedido]);

  function handleChange(name, value) {
    switch (name) {
      case "vbelnField":
        model_filtro.vbelnField = value;
        setvbelnField(value);
        break;
      case "vkorgField":
        model_filtro.vkorgField = value;
        setvkorgField(value);
        break;
      case "erdatField":
        model_filtro.erdatField = value;
        seterdatField(value);
        break;
      case "kunnrField":
        model_filtro.kunnrField = value;
        setkunnrField(value);
        break;
      case "name1Field":
        model_filtro.name1Field = value;
        setname1Field(value);
        break;
      case "netwrField":
        model_filtro.netwrField = value;
        setnetwrField(value);
        break;
      case "waerkField":
        model_filtro.waerkField = value;
        setwaerkField(value);
        break;
      // case "text1Field":
      //   settext1Field(value);
      //   break;
      case "statusField":
        setstatusField(value);
        break;
      // case "motivoField":
      //   setmotivoField(value);
      //   break;
      default:
        break;
    }
  }
  useEffect(() => {
    if(indicadorfiltro==true)
    {
      Guardar()
    }
    
  }, [pageNumber]);
  function Guardar() {
    let model = {
      IsExport: model_conspedido.IsExport,
      IsNpag: pageNumber,
      IsRegxpag: model_conspedido.IsRegxpag,
      IsUser: model_conspedido.IsUser,
      ItErdat: model_conspedido.ItErdat,
      ItErnam: model_conspedido.ItErnam,
      ItKunnr: model_conspedido.ItKunnr,
      ItMatnr: model_conspedido.ItMatnr,
      ItVbeln: model_conspedido.ItVbeln,
      ItVkbur: model_conspedido.ItVkbur,
      ItVkorg: model_conspedido.ItVkorg,
      ItFilter: [
        {
          Vbeln: vbelnField,
          Vkorg: vkorgField,
          Erdat: erdatField,
          Kunnr: kunnrField,
          Name1: name1Field,
          Netwr: netwrField,
          Waerk: waerkField,
          Bstdk: "",
          Zterm: "",
          Text1: "",
          Status: statusField,
          Motivo: "",
        },
      ],
    };
    setmodel_filtro(model);
    setresponse_consulta_pedido([]);
    setshowFiltroConsultaPedido(false);
    setspinner(true);

    ConsPedidoFiltro(model).then((result) => {

      setspinner(false);
      setresponse_consulta_pedido(
        result.itConsultaPedidosField.map((d) => {
          return {
            select: false,
            bstdkField: d.bstdkField,
            erdatField: d.erdatField,
            kunnrField: d.kunnrField,
            motivoField: d.motivoField,
            name1Field: d.name1Field,
            netwrField: d.netwrField,
            statusField: d.statusField,
            text1Field: d.text1Field,
            vbelnField: d.vbelnField,
            vkorgField: d.vkorgField,
            waerkField: d.waerkField,
            ztermField: d.ztermField,
          };
        })
      );
      setTotalData(result.esRegtotField)
      
    });
  }
  function CloseModal() {
    setshowFiltroConsultaPedido(false);
  }
  return (
    <>
      {showFiltroConsultaPedido ? (
        <div className="container-modal-background">
          <div className="modal-wrapper modal-wrapper-sm">
            <section
              className="row"
              style={{ margin: "auto", paddingTop: "50px" }}
            >
              <div className="col-sm-12 d-flex align-items-center">
                <label>N° Pedido</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "vbelnField",
                    type: "text",
                    value: vbelnField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>OrgVt</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "vkorgField",
                    type: "text",
                    value: vkorgField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Creado el</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "erdatField",
                    type: "date",
                    value: erdatField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Cliente</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "kunnrField",
                    type: "text",
                    value: kunnrField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Razón Social</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "name1Field",
                    type: "text",
                    value: name1Field,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Valor Neto</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "netwrField",
                    type: "text",
                    value: netwrField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Moneda</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "waerkField",
                    type: "text",
                    value: waerkField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Estado de Operación</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "statusField",
                    type: "text",
                    value: statusField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              {/* <div className="col-sm-12 d-flex align-items-center">
            <label>Condición de Pago</label>
          </div>
          <div className="col-sm-12">
            <InputForm
              attribute={{
                name: "text1Field",
                type: "text",
                value: text1Field,
                disabled: false,
                checked: false,
                matchcode: false,
              }}
              handleChange={handleChange}
            />
          </div>
          <div className="col-sm-12 d-flex align-items-center">
            <label>Est.Operac.</label>
          </div>
          <div className="col-sm-12">
            <InputForm
              attribute={{
                name: "statusField",
                type: "text",
                value: statusField,
                disabled: false,
                checked: false,
                matchcode: false,
              }}
              handleChange={handleChange}
            />
          </div>
          <div className="col-sm-12 d-flex align-items-center">
            <label>Motivo</label>
          </div>
          <div className="col-sm-12">
            <InputForm
              attribute={{
                name: "motivoField",
                type: "text",
                value: motivoField,
                disabled: false,
                checked: false,
                matchcode: false,
              }}
              handleChange={handleChange}
            />
          </div> */}
            </section>
            <div style={{ margin: "15px", padding: "15px" }}>
              <BtnAcept
                attribute={{ name: "Aceptar", classNamebtn: "btn_search" }}
                onClick={() => Guardar()}
              />
            </div>
            <div className="close-modal-button">
              <i className="fas fa-times" onClick={CloseModal}></i>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FiltroConsultaPedido;
