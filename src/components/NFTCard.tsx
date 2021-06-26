import React from 'react';
import { useHistory } from 'react-router-dom';

export const NFTCard = ({ data }: any) => {
    const [hovered, setHovered] = React.useState<boolean>(false);

    const history = useHistory();

    return (
        <div onClick={() => history.push(`/nft/${data.docID}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`nft-card ${hovered? "slide-top" : "slide-bottom"}`}>
            <img src={data.url} alt="nft" className="nft-card-image" />
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }} >
                <span className="nft-card-name">{data.name}</span>
                <span className="nft-card-price">{data.price}</span>
            </div>
        </div>
    )
}

export default NFTCard
