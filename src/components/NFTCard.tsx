import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'antd';

export const NFTCard = ({ data }: any) => {
    const [hovered, setHovered] = React.useState<boolean>(false);

    const isMine = () => {
        return localStorage.wallet === data.owner;
    }

    const history = useHistory();

    return (
        <div onClick={() => history.push(`/nft/${data.docID}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`nft-card ${hovered? "slide-top" : "slide-bottom"}`}>
            <>
            <img src={data.url} alt="nft" className="nft-card-image" />
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
