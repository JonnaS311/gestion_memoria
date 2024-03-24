import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import TipoGestion from './TipoGestion';
import '../styles/Nav.css';

const Nav = () => {
    return (
        <div>
            <Router>
                <nav>
                    <h1>Gestión de memoria</h1>
                    <ul>
                        <li><Link className='link' to="/">Home</Link></li>
                        <li><Link className='link' to="/fija">Estatica fija</Link></li>
                        <li><Link className='link' to="/variable">Estatica variable</Link></li>
                        <li><Link className='link' to="/dinamica">Dinamica</Link></li>
                        <li><Link className='link' to="/compactacion">Dinamica Compactación</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path='/'></Route>
                    <Route path="/fija" element={<TipoGestion></TipoGestion>}></Route>
                    <Route path="/variable" element={<TipoGestion></TipoGestion>}></Route>
                    <Route path="/dinamica" element={<TipoGestion></TipoGestion>}></Route>
                    <Route path="/compactacion" element={<TipoGestion></TipoGestion>}></Route>
                </Routes>

            </Router>
        </div>
    );
};

export default Nav;