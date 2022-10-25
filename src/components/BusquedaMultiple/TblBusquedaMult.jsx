import React from "react";

const TblBusquedaMult = ({
  rangos,
  selectOption,
  handleChangeInput,
  EliminarFila,
  type_input
}) => {
    
  return (
    <section className="section-table-modal" style={{ top: "0" }}>
      <div className="container-table">
        <div className="container-table-sm">
          <table className="content-table">
            <thead>
              <tr>
                <th>Opción</th>
                <th>de</th>
                <th>A</th>
                <th>--</th>
              </tr>
            </thead>
            <tbody>
              {rangos.length >= 1
                ? rangos.map((response, key) => {
                    return (
                      <tr key={key}>
                        <th style={{ margin: "auto" }}>
                          <select
                            style={{ width: "100%" }}
                            className="fa"
                            onChange={(e) => selectOption(e, key)}
                          >
                            <option
                              value="1"
                              className="fa"
                              selected={response.Option === "EQ" ? true : false}
                            >
                              &#xf52c; valor individual
                            </option>
                            <option
                              value="2"
                              className="fa"
                              selected={response.Option === "GE" ? true : false}
                            >
                              &#xf532; Mayor que o igual a
                            </option>
                            <option
                              value="3"
                              className="fa"
                              selected={response.Option === "LE" ? true : false}
                            >
                              &#xf537; Menor que o igual a
                            </option>
                            <option
                              value="4"
                              className="fa"
                              selected={response.Option === "GT" ? true : false}
                            >
                              &#xf531; Mayor que
                            </option>
                            <option
                              value="5"
                              className="fa"
                              selected={response.Option === "LT" ? true : false}
                            >
                              &#xf536; Menor que
                            </option>
                            <option
                              value="6"
                              className="fa"
                              selected={response.Option === "NE" ? true : false}
                            >
                              &#xf53e; No igual a
                            </option>
                            <option
                              value="7"
                              className="fa"
                              selected={response.Option === "BT" ? true : false}
                            >
                              [ ] Intervalo
                            </option>
                            {/* <option value="8" className="fa">
                                      ][ Fuera de intervalo
                                    </option> */}
                          </select>
                        </th>
                        <th>
                          <input
                            type={type_input}
                            style={{ width: "100%" }}
                            name={"de_" + key}
                            value={response.Low}
                            onChange={(e) => handleChangeInput(e, key)}
                          />
                        </th>
                        <th>
                          <input
                            type={type_input}
                            style={{ width: "100%" }}
                            name={"a_" + key}
                            value={response.High}
                            onChange={(e) => handleChangeInput(e, key)}
                          />
                        </th>
                        <th>
                          <i
                            style={{ cursor: "pointer", margin: "2px" }}
                            className="fas fa-trash-alt"
                            onClick={(e) => EliminarFila(e, key)}
                          ></i>
                        </th>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TblBusquedaMult;
