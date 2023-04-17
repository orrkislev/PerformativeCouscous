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

    return (
        <div style={{
            margin: '10em 6em',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '3em',
        }}>
            {snapshot && snapshot.docs.map((doc,index) => <HomeCard key={index} {...doc.data()} />)}
        </div>
    )
}

const HomeCardDiv = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1em;
    cursor: pointer;
    z-index: 100;
    aspect-ratio: 1/1;
    background: white;
    ${props => props.hoverColor && `
        &:hover {
            background: ${props.hoverColor};
        }
    `}
    transition: background 0.1s;
    `;
const HomeCardTitle = styled.h1`
    font-size: 3em;
    color: black;
    `;
const HomeCardDescription = styled.p`
    font-size: 1em;
    color: black;
    `;

const hoverColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
]
function HomeCard(props) {
    const [performance, setperformance] = useRecoilState(performanceAtom);
    const [page, setPage] = useRecoilState(pageAtom);
    const hoverColor = hoverColors[Math.floor(Math.random() * hoverColors.length)];

    const handleClick = () => {
        setperformance({ ...props });
        setPage({ page: 'performance', subpage: 1 });
    }
    return (
        <HomeCardDiv onClick={handleClick} hoverColor={hoverColor}>
            <HomeCardTitle>{props.name}</HomeCardTitle>
            <HomeCardDescription>{props.description}</HomeCardDescription>
        </HomeCardDiv>
    )
}