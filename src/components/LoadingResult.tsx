import React from 'react';

import { Result, Button } from 'antd';
export const LoadingResult = ({ type, status, text,  url }: any) => {
    const [buttons, setButtons] = React.useState<any[]>([]);


    React.useEffect(() => {
        if(type === "generation"){
            setButtons([
                <Button href={url} type="primary" key="view">View NFT</Button>,
                <Button href="/generate" key="back">Generate another one</Button>
            ])
        } else if(type === "buying"){
            setButtons([
                <Button href={url} type="primary" key="view">View NFT</Button>,
                <Button href="/marketplace" key="back">Back</Button>
            ])
        } else {
            setButtons([<Button href="/marketplace" key="back">Back</Button>])
        }
    }, [])

    return (
        <Result
            status={status}
            title={text}
            extra={buttons}
        />
    )
}

export default LoadingResult;