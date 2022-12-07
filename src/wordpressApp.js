import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
    let [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const results = await axios(
                "http://localhost/wordpress-react/wp-json/wp/v2/posts"
            );
            console.log(results);
            setData(results);
        };
        fetchData();
    }, []);
    return <div>chuj</div>;
};

export default App;
