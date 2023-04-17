import { useAuthState } from 'react-firebase-hooks/auth';
import { Login } from './Login';
import { auth, collectionRef, getCollection, removeDoc, removeFile, save, storageRef } from '../utils/useFirebase';
import { useEffect, useState } from 'react';
import FrontUpload from './FrontUpload';
import TopUpload from './TopUpload';
import { TimeLineInput } from './TimeLine';
import styled from 'styled-components';
import useForm from '../utils/useForm';
import Rating from '../conponents/Rating';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { SideBarButton } from '../conponents/UIElements';
import BackUpload from './BackUpload';
import Segmentation from './Segmentation';
import StoryUpload from './StoryUpload';

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
        if (!performer) form.reset()
        else form.setAll(performer);
    }

    function removePerformer(name) {
        removeDoc('performers', name)
        removeFile(`${name}-front`)
        removeFile(`${name}-pose`)
        removeFile(`${name}-expression`)
        removeFile(`${name}-back`)
        removeFile(`${name}-rhythm`)
        removeFile(`${name}-top`)
        removeFile(`${name}-gesture`)
        removeFile(`${name}-story`)

        form.reset()
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
                        withClose={performer.name == form.get('name')}
                        closeFunc={() => removePerformer(performer.name)}
                    />
                })}
                <SideBarButton key="new_one"
                    colors={['white', 'black']}
                    active={false}
                    text="  +  "
                    func={() => selectPerformer(null)}
                />
            </div>
            <div style={{ flex: 7, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1em' }}>
                <UploadContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <InputWithLabel>
                            Name:<input type="text" value={form.get('name') ?? ''} name="name" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Skill Level:<Rating value={form.get('proficienty')} onChange={v => form.set('proficienty', v)} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Age:<input type="text" value={form.get('age') ?? ''} name="age" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Recipe Origin:<input type="text" value={form.get('origin') ?? ''} name="origin" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Filming Location:<input type="text" value={form.get('location') ?? ''} name="location" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Filming Date:<input type="text" value={form.get('date') ?? ''} name="date" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Couscous Heritage:<input type="text" value={form.get('heritage') ?? ''} name="heritage" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Learned from:<input type="text" value={form.get('learned') ?? ''} name="learned" onChange={form.handleChange} />
                        </InputWithLabel>
                        <InputWithLabel>
                            Description:<textarea rows="4" cols="50" value={form.get('description') ?? ''} name="description" onChange={form.handleChange} />
                        </InputWithLabel>
                    </div>

                    <button onClick={savePerformer}>Submit</button>
                </UploadContainer>


                {form.get('name') && (
                    <>
                        <UploadContainer>
                            <FrontUpload name={form.get('name')} updateFile={setFile} />
                            {/* <Segmentation name={form.get('name')} updateFile={setFile} /> */}
                        </UploadContainer>
                        <UploadContainer>
                            <TopUpload name={form.get('name')} />
                        </UploadContainer>
                        <UploadContainer>
                            <BackUpload name={form.get('name')} />
                        </UploadContainer>
                        <UploadContainer>
                            <StoryUpload name={form.get('name')} />
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