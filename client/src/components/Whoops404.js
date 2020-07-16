import React from 'react';

const Whoops404 = ({ location }) => (
    <h1 className="whoops">Whoops, {location.pathname} not found</h1>
)


export default Whoops404;