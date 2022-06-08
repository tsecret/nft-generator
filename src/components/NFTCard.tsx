import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'antd';

export const NFTCard = ({ data }: any) => {
    const [hovered, setHovered] = React.useState<boolean>(false);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [imageStyle, setImageStyle] = React.useState<any>({display: "none"});

    const isMine = () => {
        return localStorage.wallet === data.owner;
    }

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/nft/${data.docID}`)}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            className={`nft-card ${hovered? "slide-top" : "slide-bottom"}`}
        >
            <>
            {!loaded && <div className="nft-card-image-skeleton gradient" />}
            <img src={data.url} alt="nft" className="nft-card-image"  onLoad={() => {setLoaded(true); setImageStyle({})}} style={imageStyle} />
            <span className="nft-card-name">{data.name}</span>
            </>

            {isMine()?
            (<span className="nft-card-price">{data.price} 🍋</span>)
            :
            (<div className="row" style={{ justifyContent: "space-evenly" }}> 
                <span className="nft-card-price">{data.price} 🍋</span>
                <Button type="text" href={`/nft/${data.docID}`} className="button-buy gradient-border">Buy</Button>
            </div>)
            }
            
            
        </div>
    )
}

export default NFTCard
