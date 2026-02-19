import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

const ClassfieldList = () => {
    const { data, currentPage, totalPages, totalCount, setCurrentPage, loading, error } =
        usePagination('classfields/');

    if (loading) return <div style={{ textAlign: 'center' }}>Завантаження...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>Оголошення ({totalCount})</h2>

            {data.map(item => (
                <div key={item.id} style={styles.card}>
                    {item.photo && (
                        <img src={`http://localhost:8000${item.photo}`} alt={item.title} style={styles.photo} />
                    )}
                    <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <strong>{item.price} грн</strong>
                    </div>
                </div>
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

const styles = {
    card: { border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px' },
    photo: { width: '120px', height: '90px', objectFit: 'cover', borderRadius: '4px' },
};

export default ClassfieldList;