const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];
        const delta = 2;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <div style={styles.container}>
            <button
                style={styles.button}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ← Назад
            </button>

            {getPages().map((page, index) =>
                page === '...' ? (
                    <span key={index} style={styles.dots}>...</span>
                ) : (
                    <button
                        key={index}
                        style={page === currentPage ? styles.activeButton : styles.button}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                style={styles.button}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Вперед →
            </button>
        </div>
    );
};

const styles = {
    container: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' },
    button: { padding: '8px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' },
    activeButton: { padding: '8px 12px', cursor: 'pointer', border: '1px solid #007bff', borderRadius: '4px', background: '#007bff', color: '#fff' },
    dots: { padding: '8px 4px' },
};

export default Pagination;