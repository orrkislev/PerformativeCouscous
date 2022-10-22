import styled from 'styled-components'
import { pageAtom } from './Header';
import { useRecoilState } from 'recoil';
import { performanceAtom } from './Layers';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import { useEffect } from 'react';
import { collectionRef, docRef } from '../utils/useFirebase';

export default function Home() {
    const [snapshot, loading, error, reload] = useCollectionOnce(collectionRef('performers'));
    const [page, setPage] = useRecoilState(pageAtom);

    const data = homeCards.sort((a, b) => a[page.subpage] - b[page.subpage]);

    return (
        <div style={{
            margin: '10em 6em',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1em',
        }}>
            {snapshot && snapshot.docs.map((doc,index) => <HomeCard key={index} {...doc.data()} />)}
            {data.map((card, index) => {
                return <HomeCard key={index} {...card} />
            })}
        </div>
    )
}

const HomeCardDiv = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em;
    cursor: pointer;
    background: #222;
    z-index: 100;
    `;

function HomeCard(props) {
    const [performance, setperformance] = useRecoilState(performanceAtom);
    const [page, setPage] = useRecoilState(pageAtom);

    const handleClick = () => {
        setperformance({ ...props });
        setPage({ page: 'performance', subpage: 1 });
    }
    return (
        <HomeCardDiv onClick={handleClick}>
            <h1>{props.name}</h1>
            <p>{props.description}</p>
        </HomeCardDiv>
    )
}


export const homeCards = [
    { name: 'John Lennon', description: 'Lead Singer', age: 40, skill: 3, intensity: 2, },
    { name: 'Paul McCartney', description: 'Bass Guitar', age: 72, skill: 5, intensity: 4, },
    { name: 'George Harrison', description: 'Lead Guitar', age: 58, skill: 4, intensity: 3, },
    { name: 'Ringo Starr', description: 'Drums', age: 80, skill: 5, intensity: 5, },
    { name: 'Pete Best', description: 'Drums', age: 75, skill: 2, intensity: 1, },
    { name: 'Stuart Sutcliffe', description: 'Bass Guitar', age: 62, skill: 1, intensity: 1, },
    { name: 'Richard Starkey', description: 'Drums', age: 71, skill: 5, intensity: 4, },
    { name: 'George Martin', description: 'Producer', age: 85, skill: 5, intensity: 5, },
    { name: 'Brian Epstein', description: 'Manager', age: 66, skill: 5, intensity: 5, },
    { name: 'Mal Evans', description: 'Roadie', age: 66, skill: 3, intensity: 2, },
    { name: 'Ken Brown', description: 'Roadie', age: 42, skill: 2, intensity: 1, },
    { name: 'Norman Smith', description: 'Roadie', age: 55, skill: 3, intensity: 2, },
    { name: 'Jack Douglas', description: 'Producer', age: 36, skill: 4, intensity: 3, },
    { name: 'Phil Spector', description: 'Producer', age: 80, skill: 5, intensity: 5, },
]