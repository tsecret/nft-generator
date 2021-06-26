import React from 'react';
import { Result, Button } from 'antd';

export const NFTGenerationResult = ({ status, url }: any) => {
    return (
        <Result
            status={status}
            title="Your NFT is ready!"
            extra={[
            <Button href={url} type="primary" key="view">View NFT</Button>,
            <Button href="/generate" key="generate">Generate another one</Button>,
            ]}
        />
    )
}

export default NFTGenerationResult;