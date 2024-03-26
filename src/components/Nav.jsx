import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import TipoGestion from './TipoGestion';
import '../styles/Nav.css';
import Adder from './Adder';
import ParticionadorFijo from './ParticionadorFijo';
import SelectorAjuste from './SelectorAjuste';
import { dinamicaCC } from '../utils/logica_recompactacion'
import ParticionadorVar from './ParticionadorVar';

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
                    <Route path='/' element={<Adder></Adder>}></Route>
                    <Route path="/fija" element={<ParticionadorFijo></ParticionadorFijo>}></Route>
                    <Route path="/variable" element={<ParticionadorVar></ParticionadorVar>}></Route>
                    <Route path="/dinamica" element={<SelectorAjuste></SelectorAjuste>}></Route>
                    <Route path="/compactacion" element={<TipoGestion algoritmo={dinamicaCC}></TipoGestion>}></Route>
                </Routes>

            </Router>
        </div>
    );
};

export default Nav;