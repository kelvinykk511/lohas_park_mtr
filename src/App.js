import logo from './logo.svg';
import './App.css';
import {useEffect, useLayoutEffect, useState} from "react";
import axios from "axios";
import {
    Box, createTheme,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    ThemeProvider, Typography
} from "@mui/material";
import AdSense from 'react-adsense';

import {StationEnum} from "./enum/StationEnum";

function App() {

    const [trainTimeTable, setTrainTimeTable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("fromLHP");

    useEffect(() => {
        getCarData();
    }, [tab]);

    const getCarData = async () => {
        setLoading(true)
        let stationName = "LHP";
        if (tab !== "fromLHP"){
            stationName = "TIK";
        }
        let url = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta="+ stationName;
        const {data} = await axios.get(url);
        setTrainTimeTable(data['data']['TKL-'+stationName]);
        setLoading(false)
    }

    const theme = createTheme({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    });

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleDate =(dateStr)=>{
        return dateStr.split(" ")[1]
    }

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Tabs sx={{marginTop:"3vh"}} value={tab} centered variant="fullWidth" onChange={handleTabChange}>
                    <Tab label="從康城出發" value="fromLHP"/>
                    <Tab label="調景嶺往康城" value="toLHP"/>
                </Tabs>
                {loading && <div>Loading</div>}
                {!loading &&
                    <div>
                        <Box sx={{paddingY:"3vh"}} onClick={getCarData}>
                            <Typography variant="h7">數據更新時間： {!loading ? trainTimeTable["curr_time"] : `Loading`}</Typography>
                            <br/>
                            <Typography sx={{fontSize:'0.8rem', color:'grey'}} variant="h7">按下以更新</Typography>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>出發地</TableCell>
                                        <TableCell align="left">目的地</TableCell>
                                        <TableCell align="left">預計<br/>開車時間</TableCell>
                                        <TableCell align="left">剩餘時間</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trainTimeTable[tab==="fromLHP"?"DOWN":"UP"]?.map((train) => (
                                        <TableRow
                                            key={train.time}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell align="left">{tab==="toLHP"?StationEnum['TIK']:StationEnum['LHP']}</TableCell>
                                            <TableCell align="left">{StationEnum[train["dest"]]}</TableCell>
                                            <TableCell align="left">{handleDate(train["time"])}</TableCell>
                                            <TableCell align="left">{train["ttnt"]}分鐘</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
            </ThemeProvider>
            <AdSense.Google
                client='ca-pub-3706987806583518'
                slot='7010513989'
            />
        </div>
    );
}

export default App;
