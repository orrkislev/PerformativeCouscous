import { useRecoilValue } from "recoil";
import { performanceAtom } from "./Layers";
import { uiStateAtom } from "./UI";
import styled from "styled-components";
import { Centered } from "./Join";

const ProfilePart = styled.div`
    border: 2px solid white;
    min-height: 5em;
`;
const ProfilePartTitle = styled.div`
    font-weight: 600;
    background-color: white;
    color: black;
    padding: .5em 1em;
`;
const ProfilePartText = styled.div`
    padding: .5em 1em;
`;


const proficiencies = {
    1: 'Newbie', 2: 'Novice', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert'
}

export default function Profile(props) {
    const performance = useRecoilValue(performanceAtom)
    const uistate = useRecoilValue(uiStateAtom);

    if (!uistate.profile) return null;

    return (
        <Centered wide>
            <div></div>
            <div style={{display:'flex',gap:'1em'}}>
                <ProfilePart>
                    <ProfilePartTitle>NAME:</ProfilePartTitle>
                    <ProfilePartText>{performance.name}</ProfilePartText>
                </ProfilePart>

                <ProfilePart>
                    <ProfilePartTitle>AGE:</ProfilePartTitle>
                    <ProfilePartText>{performance.age}</ProfilePartText>
                </ProfilePart>

                <ProfilePart>
                    <ProfilePartTitle>COUSCOUS PROFICIENCY: * </ProfilePartTitle>
                    <ProfilePartText>{proficiencies[performance.proficienty]}</ProfilePartText>
                </ProfilePart>

                <ProfilePart>
                    <ProfilePartTitle>DATE FILMED:</ProfilePartTitle>
                    <ProfilePartText>{performance.date}</ProfilePartText>
                </ProfilePart>
            </div>
            <div style={{display:'flex',gap:'1em'}}>
                <ProfilePart>
                    <ProfilePartTitle>RECIPE ORIGIN:</ProfilePartTitle>
                    <ProfilePartText>{performance.origin}</ProfilePartText>
                </ProfilePart>

                <ProfilePart>
                    <ProfilePartTitle>MADE IN:</ProfilePartTitle>
                    <ProfilePartText>{performance.location}</ProfilePartText>
                </ProfilePart>
            </div>

            <div style={{display:'flex',gap:'1em'}}>
                <ProfilePart>
                    <ProfilePartTitle>COUSCOUS MAKING HARITAGE: **</ProfilePartTitle>
                    <ProfilePartText>{performance.heritage}</ProfilePartText>
                </ProfilePart>

                <ProfilePart>
                    <ProfilePartTitle>LEARNED FROM:</ProfilePartTitle>
                    <ProfilePartText>{performance.learned}</ProfilePartText>
                </ProfilePart>
            </div>
            <div>
                <p>* Never - Newbie / Rarely - Novice / Special occasions - Intermediate / Monthly - Advanced / Weekly - Expert</p>
                <p>** How far back does the knowledge of couscous making runs in your family? </p>
            </div>
        </Centered>
    )
}