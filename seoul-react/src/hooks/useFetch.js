import { useEffect, useState } from 'react';

function UseFetch(url) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
            })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
    }, [url]);

    return data;
}

export default UseFetch;