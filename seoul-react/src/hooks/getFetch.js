import { useEffect, useState } from 'react';

function GetFetch(url) {
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
    }, []);

    return data;
}

export default GetFetch;