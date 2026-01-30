import React from 'react';

/**
 *
 * This component renders Footer 
 */
function Footer() {
    return (
        <div style={footerStyle.pos}>
            <nav className="navbar navbar-dark" style={footerStyle.bg}>
                <div className="container-fluid">
                    <span className="navbar-text">
                        IET CDAC, PUNE
                    </span>
                </div>
            </nav>
        </div>
    );
};

let footerStyle = {
    pos : {
        position : "relative"
    },
    bg : {
        background : "#00001a"
    }
}

export default Footer;