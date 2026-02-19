import { useState, useEffect } from 'react';
import api from '../api/axios';

export const usePagination = (endpoint, params = {}) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(endpoint, {
                    params: { page: currentPage, ...params }
                });
                setData(response.data.results);
                setTotalCount(response.data.count);
                setTotalPages(Math.ceil(response.data.count / 10));
            } catch (err) {
                setError('Помилка завантаження даних');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint, currentPage]);

    return { data, currentPage, totalPages, totalCount, setCurrentPage, loading, error };
};