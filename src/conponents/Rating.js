import { useEffect, useState } from "react";

export default function Rating(props){


    const val = props.value || 0;

    const stars = Array(5).fill(0).map((_,i) => {
        return <span key={i} onClick={() => props.onChange(i+1)}>{val > i ? '★' : '☆'}</span>
    })

    return (
        <div>
            {stars}
        </div>
    )
}