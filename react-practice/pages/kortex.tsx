import '../src/app/globals.css';
import React, { useState } from 'react';

export enum KortexDocumentStatus {
    DRAFT = "Draft",
    KORENOTE = "Korenote",
}

export interface KortexDocument {
    title: string;
    uuid: string;
    content: string;
    status: KortexDocumentStatus;
    keywords: string[];
    date_created: string;
    date_modified: string;
    parent: string | null;
}

export const sampleDocuments: KortexDocument[] = [
    {
        title: "Romeo and Juliet",
        uuid: "1",
        content: "Thy sayeth to be or not to be, that is the question.",
        status: KortexDocumentStatus.DRAFT,
        keywords: ["Shakespeare", "Hamlet"],
        date_created: "2023-11-10T10:00:00.000Z",
        date_modified: "2023-11-11T11:00:00.000Z",
        parent: "4",
    },
    {
        title: "When Breath Becomes Air",
        uuid: "2",
        content: "What is the meaning of life?",
        status: KortexDocumentStatus.DRAFT,
        keywords: ["Cancer", "Hope"],
        date_created: "2023-11-07T07:00:00.000Z",
        date_modified: "2023-11-07T08:00:00.000Z",
        parent: null,
    },
    {
        title: "Hunger Games",
        uuid: "3",
        content: "May the odds be ever in your favor.",
        status: KortexDocumentStatus.KORENOTE,
        keywords: ["Shakespeare", "Fiction"],
        date_created: "2023-11-08T08:00:00.000Z",
        date_modified: "2023-11-09T09:00:00.000Z",
        parent: "4",
    },
    {
        title: "All Quiet on the Western Front",
        uuid: "4",
        content: "War is hell.",
        status: KortexDocumentStatus.KORENOTE,
        keywords: ["War"],
        date_created: "2023-11-09T09:00:00.000Z",
        date_modified: "2023-11-10T10:00:00.000Z",
        parent: "5",
    },
    {
        title: "Steve Jobs",
        uuid: "5",
        content: "Stay hungry, stay foolish.",
        status: KortexDocumentStatus.KORENOTE,
        keywords: ["Apple", "Jobs"],
        date_created: "2023-11-11T11:00:00.000Z",
        date_modified: "2023-11-12T12:00:00.000Z",
        parent: null,
    },
];

const organizeDocuments = (documents: KortexDocument[]) => {
    const documentMap: { [uuid: string]: KortexDocument & { children?: KortexDocument[] } } = {};
    documents.forEach(doc => documentMap[doc.uuid] = { ...doc, children: [] });

    const rootDocuments: (KortexDocument & { children?: KortexDocument[] })[] = [];
    documents.forEach(doc => {
        if (doc.parent) {
            documentMap[doc.parent].children?.push(documentMap[doc.uuid]);
        } else {
            rootDocuments.push(documentMap[doc.uuid]);
        }
    });

    return rootDocuments;
};



const DocumentList: React.FC<{ documents: (KortexDocument & { children?: KortexDocument[] })[], indent?: number }> = ({ documents, indent = 0 }) => {
    const [showChildren, setShowChildren] = useState(false);
    const handleClick = () => {
        setShowChildren(!showChildren);
    }
    return (
        <ul style={{ paddingLeft: indent, width: '100%' }}>
            {documents.map(doc => (
                <div key={doc.uuid}>
                    <div onClick={handleClick} style={{ marginTop: '4px', border: '1px solid #8B8B8B', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }} key={doc.uuid}>
                        <div>
                            {doc.title}&nbsp;&nbsp;&nbsp;&nbsp;(UUID: {doc.uuid})
                        </div>
                        <div>
                            {showChildren && doc.children ? '-' : (doc.children && doc.children.length > 0 ? '+' : '')}
                        </div>
                    </div>
                    {showChildren && doc.children && doc.children.length > 0 && (
                        <div>
                            <DocumentList documents={doc.children} indent={20} />
                        </div>
                    )}
                </div>
            ))}
        </ul>
    );
};

export default function Kortex() {
    const rootDocuments = organizeDocuments(sampleDocuments);
    const [filter, setFilter] = useState('');

    const filteredDocuments = filter
        ? sampleDocuments.filter(doc => doc.status === filter)
        : sampleDocuments;

    return (
        // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', width: '100vw', height: '100vh' }}>
        //     <div style={{ width: '500px', height: '500px', color: 'white', border: '1px solid #8B8B8B', borderRadius: '10px' }}>Test</div>
        // </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
            <DocumentList documents={rootDocuments} />
        </div>
        // <div>
        //     <h1>Documents</h1>
        //     <select onChange={(e) => setFilter(e.target.value)}>
        //         <option value="">All</option>
        //         <option value="Draft">Draft</option>
        //         <option value="Korenote">Korenote</option>
        //     </select>
        //     <div>
        //         {filteredDocuments.map(doc => (
        //             <div key={doc.uuid} style={{ border: '1px solid #8B8B8B', borderRadius: '5px', padding: '4px', margin: '4px' }}>
        //                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        //                     <h2>{doc.title}</h2>
        //                     <p>{doc.status}</p>
        //                 </div>
        //                 <p>{new Date(doc.date_modified).toLocaleDateString()}</p>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
};