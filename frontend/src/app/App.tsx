import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "../pages/home/home"
import Reg from "../pages/registration/regestration"
import { NotFoundPage } from "../pages/not-found-page/notFoundPage"
import { useEffect } from 'react';

function App () {

    useEffect(() => {
        fetch('http://localhost:3001')
        .then(res => res.text())
        .then(data => console.log(data));
    }, []);
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/reg" element={<Reg/>}/>            
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App