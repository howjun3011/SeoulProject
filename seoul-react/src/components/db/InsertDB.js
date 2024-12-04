import SendFetchPost from '../../db/sendFetchPost';
import db from '../../db/culture/BestSeller_202112.json';

function InsertDB() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    padding: '15px 30px',
                    background: '#e2e2e2',
                    borderRadius: '10px',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    SendFetchPost(`http://localhost:9002/seoul/culture/insertDB`);
                }}
            >
                Insert
            </div>
        </div>
    );
}

export default InsertDB;