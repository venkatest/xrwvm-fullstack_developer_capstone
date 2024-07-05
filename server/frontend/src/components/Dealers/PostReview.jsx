import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const params = useParams();

  // Moved inside useEffect to ensure it has the correct value
  let root_url = window.location.href.substring(0, window.location.href.indexOf("postreview"));
  let id = params.id; // Ensure this is declared at the correct scope

  let review_url = `${root_url}djangoapp/add_review`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    // If the first and second name are stored as null, use the username
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory")
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `${window.location.origin}/dealer/${id}`;
    }
  };

  useEffect(() => {
    let dealer_url = `${root_url}djangoapp/dealer/${id}`;
    let carmodels_url = `${root_url}djangoapp/get_cars`;

    const get_dealer = async () => {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();

      if (retobj.status === 200) {
        let dealerobjs = Array.from(retobj.dealer)
        if (dealerobjs.length > 0)
          setDealer(dealerobjs[0])
      }
    }

    const get_cars = async () => {
      const res = await fetch(carmodels_url, {
        method: "GET"
      });
      const retobj = await res.json();

      let carmodelsarr = Array.from(retobj.CarModels)
      setCarmodels(carmodelsarr)
    }
    get_dealer();
    get_cars();
  }, [id, root_url]); // No external dependencies are expected to change

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)}></textarea>
        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className='input_field'>
          Car Make
          <select name="cars" id="cars" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, index) => (
              <option key={index} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>{carmodel.CarMake} {carmodel.CarModel}</option>
            ))}
          </select>
        </div >

        <div className='input_field'>
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />
        </div>

        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  )
}
export default PostReview;