import React, { Suspense, lazy } from 'react'
import { Link, Routes, Route } from 'react-router-dom'

// import Home from './pages/home'
// import About from './pages/about'

const Home = lazy(() => import('./pages/home'))
const About = lazy(() => import('./pages/about'))

const App = () => (
    <>
        <h1>App</h1>
        <br />
        <ul>
            <li>
                <Link to='/home'>Home</Link>
            </li>
            <li>
                <Link to='/about'>About</Link>
            </li>
        </ul>

        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/about' element={<About />}></Route>
            </Routes>
        </Suspense>
    </>
)

export default App