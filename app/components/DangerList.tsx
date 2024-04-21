// DangerList component
import { useEffect, useState } from 'react';

export default function DangerList({ propertyDocument }) {
    const [dangerList, setDangerList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDangerList = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/danger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviews: propertyDocument.reviews.map(review => review.comments) })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch danger list');
            }
            const data = await response.json();
            setDangerList(data.dangerList);
        } catch (error) {
            console.error("Error fetching danger list:", error);
            setDangerList([]); // Handle error by setting an empty list or appropriate error handling
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDangerList(); // Automatically fetch on component mount or define a button to trigger this
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div>
            <h1>Danger List</h1>
            {isLoading ? (
                <p>Loading hazards...</p>
            ) : dangerList && dangerList.length > 0 ? (
                <>
                    <p>Here is a list of potential dangers travellers have previously reported:</p>
                    <ul>
                        {dangerList.map((danger, index) => (
                            <li key={index}>{danger}</li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>There are no reported hazards.</p>
            )}
        </div>
    );
}
