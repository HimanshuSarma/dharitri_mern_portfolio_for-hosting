import React from 'react';

const ContentWrapper = (props) => {
    return (
        <div className={`content-wrapper ${props.className ? props.className : ''}`} 
            style={props.isProductsPage && {gridTemplateColumns: `repeat(auto-fit, minmax(15rem, 1fr))`,
                                     columnGap: '1.5rem'}}>
            {props.children}
        </div>
    )
}

export default ContentWrapper
