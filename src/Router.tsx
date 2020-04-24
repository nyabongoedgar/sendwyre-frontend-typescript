import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Trade from './components/Trade';
import LandingPage from './components/LandingPage';
import History from './components/History';

function AppRouter() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <ul className="navbar-nav mr-auto">
                        <li>
                            <Link to="/" className='nav-link'>Home</Link>
                        </li>
                        <li>
                            <Link to="/trade" className='nav-link'>Trade</Link>
                        </li>
                        <li>
                            <Link to="/history" className='nav-link'>History</Link>
                        </li>
                    </ul>
                </nav>

                {/* <Route path="/" exact component={Index} />
                <Route path="/products/:id" component={Product} /> */}
                <Route path="/trade" component={Trade} />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/history" component={History} />
            </div>
        </Router>
    );
}

export default AppRouter;