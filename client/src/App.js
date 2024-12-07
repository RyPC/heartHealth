import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import moment from "moment"; // To handle timestamp formatting

const API_URL = process.env.REACT_APP_API_URL;

function App() {
    const [timestamps, setTimestamps] = useState([]);
    const [heartRates, setHeartRates] = useState([]);
    const [healthData, setHealthData] = useState([]);

    useEffect(() => {
        const getHealthData = async () => {
            // Construct url for GET request
            const getURL = API_URL + "/get_data";

            // Fetch response from server
            const response = await axios.get(getURL);
            if (response) {
                setTimestamps(response.data.timestamps);
                setHeartRates(response.data.heart_rates);
            }

            // Restructures data for the graph
            const restructured = response.data.timestamps.map(
                (timestamp, index) => ({
                    timestamp: timestamp,
                    heartRate: response.data.heart_rates[index],
                })
            );
            setHealthData(restructured);
        };
        getHealthData();
    }, []);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Health Monitor</h1>
            </header>
            <main className="app-main">
                <div className="graph-container">
                    {/* Graph */}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            width={500}
                            height={300}
                            data={healthData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) =>
                                    moment(timestamp).format(
                                        "MMM DD YYYY, h:mm a"
                                    )
                                }
                            />
                            <YAxis
                                allowDataOverflow={true}
                                // Gives the graph 10% on the top and bottom Y-axis range
                                domain={[
                                    Math.floor(
                                        Math.min(...heartRates) -
                                            0.1 *
                                                (Math.max(...heartRates) -
                                                    Math.min(...heartRates))
                                    ),
                                    Math.ceil(
                                        Math.max(...heartRates) +
                                            0.1 *
                                                (Math.max(...heartRates) -
                                                    Math.min(...heartRates))
                                    ),
                                ]}
                                type="number"
                            />
                            <Tooltip
                                labelFormatter={(timestamp) =>
                                    moment(timestamp).format(
                                        "MMMM Do YYYY, h:mm a"
                                    )
                                }
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="heartRate"
                                stroke="#a81418"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>{" "}
                </div>
            </main>
        </div>
    );
}

export default App;
