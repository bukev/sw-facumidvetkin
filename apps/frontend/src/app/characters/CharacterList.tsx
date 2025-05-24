'use client';

import useFetchData from '../../hooks/useFetchData';
import { Animator } from '@arwes/react';
import { Text } from '@arwes/react-text';

export default function CharacterList() {
    const {
        data: characters,
        loading,
        error,
        search,
        setSearch
    } = useFetchData('characters');

    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <>
            <div className="page-title-wrapper">
                <h1>Characters</h1>
                <input
                    type="search"
                    name="Search"
                    placeholder='Search...'
                    value={search as any}
                    onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="box-list-grid">
                {loading && (
                    <p>Loading characters...</p>
                )}

                {!loading && characters?.map((char) => (
                    <div
                        className="box-item"
                        key={char.id}
                    >
                        
                        <p style={{fontWeight: 800}}>{char.name}</p>
                        <p>{char.homeworld}</p>
                        
                    </div>
                ))}
            </div>
        </>
    );
}
