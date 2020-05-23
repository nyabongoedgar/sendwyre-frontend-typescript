import React from 'react';
import ReactLoading from 'react-loading';

const Loader = ({ type , color }: any) => (
    // <ReactLoading type={type} color={color} height={667} width={375} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "50%"}}>
        <ReactLoading type={'spin'} color={'red'} />
    </div>
);

export default Loader;