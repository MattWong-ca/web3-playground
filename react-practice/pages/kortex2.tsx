import '../src/app/globals.css';
import React, { useState } from 'react';
import { KortexDocument, sampleDocuments } from './kortex';

export default function Kortex() {
    const [filter, setFilter] = useState('');

    const filteredDocuments = filter
        ? sampleDocuments.filter(doc => doc.status === filter)
        : sampleDocuments;

    return (
        // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', width: '100vw', height: '100vh' }}>
        //     <div style={{ width: '500px', height: '500px', color: 'white', border: '1px solid #8B8B8B', borderRadius: '10px' }}>Test</div>
        // </div>
        <div>
            <h1>Documents</h1>
            <select onChange={(e) => setFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Draft">Draft</option>
                <option value="Korenote">Korenote</option>
            </select>
            <div>
                {filteredDocuments.map(doc => (
                    <div key={doc.uuid} style={{ border: '1px solid #8B8B8B', borderRadius: '5px', padding: '4px', margin: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h2>{doc.title}</h2>
                            <p>{doc.status}</p>
                        </div>
                        <p>{new Date(doc.date_modified).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};