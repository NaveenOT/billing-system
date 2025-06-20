import {Link } from 'react-router-dom';
export default function Navbar(){
    return(
        <nav className='fixed top-0 left-0 w-full z-50 shadow-md py-4 max-h-24 bg-white'>
            <div className = "flex justify-between items-center px-5 mx-auto max-w-7xl">
                <h1 className='text-6xl font-extrabold'>AV Traders</h1>
                <div className = "flex justify-end space-x-30">
                    <Link to="/" className="tab text-4xl">Dashboard</Link>
                    <Link to="/bill" className="tab text-4xl">Bill</Link>
                    <Link to="/catalogue" className="tab text-4xl">Catalogue</Link>
                </div>
            </div>
        </nav>
    );
}