import {Link } from 'react-router-dom';
export default function Navbar(){
    return(
        <nav className='tab-bar'>
            <Link to="/" className="tab">Dashboard</Link>
            <Link to="/bill" className="tab">Bill</Link>
            <Link to="/catalogue" className="tab">Catalogue</Link>
        </nav>
    );
}