import { Link } from "react-router";

export const NotFoundPage = () => {
    const linkStyle = {
        color: '#000080',
    }
    
    return (
        <div>
            <Link to={"/"} style={linkStyle}>-BACK ON TRACK-</Link>
        </div>
    )
}

// export default NotFoundPage;