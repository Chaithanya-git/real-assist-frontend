import { useState } from "react";
import printJS from "print-js";
import printer from "./assets/printer.svg";

import "./App.css";

interface DataItem {
  data_year: number;
  Burglary: number;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);

    fetch(
      "https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv"
    )
      .then((response) => response.json())
      .then((apiData: { data: DataItem[] }) => {
        const extractedData = apiData.data.map((item) => ({
          data_year: item.data_year,
          Burglary: item.Burglary,
        }));

        sendPostRequest(
          "https://real-assist-backend-kfg7.onrender.com/api/report-generate",
          extractedData
        );
      })
      .catch((error) => console.error(error));
  };

  const sendPostRequest = (url: string, requestBody: DataItem[]) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const pdfURL = data.pdfURL;
        printJS({ printable: pdfURL, type: "pdf", showModal: true });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="card">
        <button onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? (
            <>Loading....</>
          ) : (
            <>
              <img src={printer} alt="printer" />
              Print
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default App;
