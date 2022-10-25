import React, { useEffect, useState } from "react";
import InputForm from "../../components/InputForm";
import BtnAcept from "../../components/BtnSearch";
import { ConsultarStockFiltro } from "../../Services/ServiceConsultaStock";

const FiltroConsultaStock = ({
  showFiltroConsultaStock,
  setshowFiltroConsultaStock,
  model_filtro,
  setmodel_filtro,
  model_consStock,
  setresponse_consulta_Stock,
  setspinner,
  setTotalData,
  indicadorfiltro,
  pageNumber,
  DataSet,
  setDataSet
}) => {
  const [werksField, setwerksField] = useState("");
  const [matnrField, setmatnrField] = useState("");
  const [maktxField, setmaktxField] = useState("");
  const [labstField, setlabstField] = useState("");
  const [meinsField, setmeinsField] = useState("");
  const [chargField, setchargField] = useState("");
  const [clabsField, setclabsField] = useState("");
  const [fvencField, setfvencField] = useState("");
  const [mtartField, setmtartField] = useState("");
  //PARA ALMACENAR LOS DATOS A EXPORTAR
  // const [DataSet, setDataSet] = useState([{ columns: [], data: [] }]);

  // const [ItFilter, setItFilter] = useState([
  //   {
  //     Werks: "",
  //     Matnr: "",
  //     Maktx: "",
  //     Labst: "",
  //     Meins: "",
  //     Charg: "",
  //     Clabs: "",
  //     Fvenc: "",
  //     Mtart: "",
  //   },
  // ]);
  // ItFilter =[
  //   {
  //     Werks: "",
  //     Matnr: "",
  //     Maktx: "",
  //     Labst: "",
  //     Meins: "",
  //     Charg: "",
  //     Clabs: "",
  //     Fvenc: "",
  //     Mtart: "",
  //   },
  // ];
  useEffect(() => {
    setwerksField("");
    setmatnrField("");
    setmaktxField("");
    setlabstField("");
    setmeinsField("");
    setchargField("");
    setclabsField("");
    setfvencField("");
    setmtartField("");
  }, [setshowFiltroConsultaStock]);

  function handleChange(name, value) {
    switch (name) {
      case "werksField":
        model_filtro.werksField = value;
        setwerksField(value);
        break;
      case "matnrField":
        model_filtro.matnrField = value;
        setmatnrField(value);
        break;
      case "maktxField":
        model_filtro.maktxField = value;
        setmaktxField(value);
        break;
      case "labstField":
        model_filtro.labstField = value;
        setlabstField(value);
        break;
      case "meinsField":
        model_filtro.meinsField = value;
        setmeinsField(value);
        break;
      case "chargField":
        model_filtro.chargField = value;
        setchargField(value);
        break;
      case "clabsField":
        model_filtro.clabsField = value;
        setclabsField(value);
        break;
      case "fvencField":
        model_filtro.fvencField = value;
        setfvencField(value);
        break;
      case "mtartField":
        model_filtro.mtartField = value;
        setmtartField(value);
        break;
      default:
        break;
    }
  }
  //formateo de la fecha para visualizar
  function formatDate(value) {
    var datePart = value.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "-" + month + "-" + year;
  }
  //completar decimal de 2 digitos
  function convertDecimal(num) {
    // return num.toFixed(Math.max(((num+'').split(".")[1]||"").length, 2));
    if (num.toString().split(".").length == 2) {
      // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + "."+num.toString().split(".")[1]);
      return (
        num
          .toString()
          .split(".")[0]
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") +
        "." +
        num.toString().split(".")[1].padStart(2, "0")
      );
    } else {
      // console.log( num.toString().split(".")[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00");
      return (
        num
          .toString()
          .split(".")[0]
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + ".00"
      );
    }
  }
  function Exportar(){
    let model_consulta_export = {
      IsCampo: "",
      IsOrden: "",
      IsNpag: pageNumber,
      IsRegxpag: model_consStock.IsRegxpag,
      IsExport: "X",
      IsUser: model_consStock.IsUser,
      ItCharg: model_consStock.ItCharg,
      ItLgort: model_consStock.ItLgort,
      ItMatnr: model_consStock.ItMatnr,
      ItVkorg: model_consStock.ItVkorg,
      ItWerks: model_consStock.ItWerks,
      ItFilter: [
        {
          Werks: werksField,
          Matnr: matnrField,
          Maktx: maktxField,
          Labst: labstField,
          Meins: meinsField,
          Charg: chargField,
          Clabs: clabsField,
          Fvenc: fvencField,
          Mtart: mtartField,
        },
      ],
    };
    // ExportarConsultaStock(model_consulta).then((result)=>{

    // });

      ConsultarStockFiltro(model_consulta_export).then((result) => {
        console.log(result);
        setDataSet([
          {
            columns: [
              {
                title: "Ce.",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Material",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Texto breve material",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Libre utiliz.",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "UMB",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Lote",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Stock/Lote",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "Fecha vencimiento",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
              {
                title: "TpMt.",
                style: { font: { sz: "18", bold: true } },
                width: { wpx: 125 },
              },
            ],
            data: result.etStockField.map((data) => {
              return [
                { value: data.werksField, style: { font: { sz: "14" } } },
                { value: data.matnrField, style: { font: { sz: "14" } } },
                { value: data.maktxField, style: { font: { sz: "14" } } },
                {
                  value: convertDecimal(data.labstField, 2),
                  style: { font: { sz: "14" } },
                },
                { value: data.meinsField, style: { font: { sz: "14" } } },
                { value: data.chargField, style: { font: { sz: "14" } } },
                {
                  value: convertDecimal(data.clabsField, 2),
                  style: { font: { sz: "14" } },
                },
                {
                  value: formatDate(data.fvencField),
                  style: { font: { sz: "14" } },
                },
                { value: data.mtartField, style: { font: { sz: "14" } } },
              ];
            }),
          },
        ]);
      });
    
  }
  useEffect(() => {
    if (indicadorfiltro == true) {
      Guardar();
    }
  }, [pageNumber]);

  function Guardar() {
    Exportar();
    let model = {
      IsCampo: "",
      IsOrden: "",
      IsNpag: pageNumber,
      IsRegxpag: model_consStock.IsRegxpag,
      IsExport: model_consStock.IsExport,
      IsUser: model_consStock.IsUser,
      ItCharg: model_consStock.ItCharg,
      ItLgort: model_consStock.ItLgort,
      ItMatnr: model_consStock.ItMatnr,
      ItVkorg: model_consStock.ItVkorg,
      ItWerks: model_consStock.ItWerks,
      ItFilter: [
        {
          Werks: werksField,
          Matnr: matnrField,
          Maktx: maktxField,
          Labst: labstField,
          Meins: meinsField,
          Charg: chargField,
          Clabs: clabsField,
          Fvenc: fvencField,
          Mtart: mtartField,
        },
      ],
    };
    setmodel_filtro(model);
    setresponse_consulta_Stock([]);
    setshowFiltroConsultaStock(false);
    setspinner(true);

    ConsultarStockFiltro(model).then((result) => {
      setspinner(false);
      setresponse_consulta_Stock(
        result.etStockField.map((d) => {
          return {
            select: false,
            werksField: d.werksField,
            matnrField: d.matnrField,
            maktxField: d.maktxField,
            labstField: d.labstField,
            meinsField: d.meinsField,
            chargField: d.chargField,
            clabsField: d.clabsField,
            fvencField: d.fvencField,
            mtartField: d.mtartField,
          };
        })
      );
      setTotalData(result.esRegtotField);
    });
  }
  function CloseModal() {
    setshowFiltroConsultaStock(false);
  }
  return (
    <>
      {showFiltroConsultaStock ? (
        <div className="container-modal-background">
          <div className="modal-wrapper modal-wrapper-sm">
            <section
              className="row"
              style={{ margin: "auto", paddingTop: "50px" }}
            >
              <div className="col-sm-12 d-flex align-items-center">
                <label>Ce.</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "werksField",
                    type: "text",
                    value: werksField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Material</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "matnrField",
                    type: "text",
                    value: matnrField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Texto breve material</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "maktxField",
                    type: "text",
                    value: maktxField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Libre utiliz.</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "labstField",
                    type: "text",
                    value: labstField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>UMB</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "meinsField",
                    type: "text",
                    value: meinsField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Lote</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "chargField",
                    type: "text",
                    value: chargField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Stock/Lote</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "clabsField",
                    type: "text",
                    value: clabsField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>Fecha vencimiento</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "fvencField",
                    type: "date",
                    value: fvencField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <label>TpMt.</label>
              </div>
              <div className="col-sm-12">
                <InputForm
                  attribute={{
                    name: "mtartField",
                    type: "text",
                    value: mtartField,
                    disabled: false,
                    checked: false,
                    matchcode: false,
                  }}
                  handleChange={handleChange}
                />
              </div>
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

export default FiltroConsultaStock;
