import { useAuthState } from 'react-firebase-hooks/auth';
import { Login } from './Login';
import { auth, collectionRef, getCollection, save } from '../utils/useFirebase';
import { useEffect, useState } from 'react';
import FrontUpload from './FrontUpload';
import TopUpload from './TopUpload';
import { TimeLineInput } from './TimeLine';
import styled from 'styled-components';
import useForm from '../utils/useForm';
import Rating from '../conponents/Rating';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { SideBarButton } from '../conponents/UIElements';

const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: #1a1a1a;
    border-radius: 1rem;
    `;
const InputWithLabel = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    width: 30%;
    `;

export default function Upload() {
    const [performers, loadingCollection, errorLoadingCollection, reloadCollection] = useCollectionData(collectionRef('performers'));
    const [user, error, loading] = useAuthState(auth);
    const [file, setFile] = useState(null);
    const form = useForm()

    function savePerformer() {
        save('performers', form.get('name'), form.getAll())
    }

    function selectPerformer(performer) {
        form.setAll(performer);
    }

    if (!user) return <Login />

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2em' }}>
                {performers && performers.map((performer, index) => {
                    return <SideBarButton key={index}
                        colors={['white', 'black']}
                        active={performer.name == form.get('name')}
                        text={performer.name}
                        func={() => selectPerformer(performer)}
                    />
                })
                }
            </div>
            <div style={{ flex: 7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <UploadContainer>
                    <InputWithLabel>
                        Name:<input type="text" value={form.get('name') ?? ''} name="name" onChange={form.handleChange} />
                    </InputWithLabel>
                    <InputWithLabel>
                        {/* Skill Level:<input type="text" value={form.get('proficienty')} name="proficiency" onChange={form.handleChange} /> */}
                        Skill Level:<Rating value={form.get('proficienty')} onChange={v => form.set('proficienty', v)} />
                    </InputWithLabel>
                    <InputWithLabel>
                        Age:<input type="text" value={form.get('age') ?? ''} name="age" onChange={form.handleChange} />
                    </InputWithLabel>
                    <InputWithLabel>
                        Location:<input type="text" value={form.get('location') ?? ''} name="location" onChange={form.handleChange} />
                    </InputWithLabel>
                    <button onClick={savePerformer}>Submit</button>
                </UploadContainer>


                {form.get('name') && (
                    <>
                        <UploadContainer>
                            <FrontUpload name={form.get('name')} updateFile={setFile} />
                        </UploadContainer>
                        <UploadContainer>
                            <TopUpload name={form.get('name')} />
                        </UploadContainer>
                        <UploadContainer>
                            {file && <TimeLineInput value={form.get('timeline')} name={form.get('name')} file={file} />}
                        </UploadContainer>
                    </>
                )}
            </div >
        </div>
    )
}