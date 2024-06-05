import '../src/app/globals.css';
import React, { useState } from 'react';
import { KortexDocument, sampleDocuments } from './kortex';

export default function Kortex() {
    const [filter, setFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocuments = sampleDocuments.filter(doc => {
        const matchesFilter = filter ? doc.status === filter : true;
        const matchesSearchQuery = searchQuery ? doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.content.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesFilter && matchesSearchQuery;
    });

    return (
        <div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '24px' }}>
                <select onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Draft">Draft</option>
                    <option value="Korenote">Korenote</option>
                </select>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginLeft: '16px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div>
                    {filteredDocuments.map((doc, index) => {
                        return (
                            <div key={index} style={{ width: '500px', height: '100px', border: '1px solid black', marginBottom: '8px', borderRadius: '10px', padding: '8px', paddingLeft: '12px', paddingRight: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>{doc.title}</div>
                                    <div style={{ fontStyle: 'italic' }}>{doc.status}</div>
                                </div>
                                <div>
                                    {
                                        doc.keywords.length > 0 &&
                                        doc.keywords.map((word, i) => {
                                            return (
                                                <div key={i} style={{ fontSize: '14px', display: 'inline-block', backgroundColor: 'black', color: 'white', width: 'auto', paddingLeft: '6px', paddingRight: '6px', marginRight: '4px', borderRadius: '6px' }}>{word}</div>
                                            )
                                        })
                                    }
                                    <div style={{ fontStyle: 'italic', paddingTop: '12px' }}>{doc.content}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};