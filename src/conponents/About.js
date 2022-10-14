import { Centered } from "./Join";

export default function About() {
    return (
        <div>
            <Centered>
                <div>
                    <p>ABOUT:</p>
                    <p>The archive displays and preserves the embodiment of the recipe, specifically, couscous as a case study.</p>
                    <p>The physical embodiment of a recipe is the array of body movements, body pose, gestures, rhythm and facial expressions when cooking, or rather performing a specific recipe. It is a collection of soft parameters analyzed using image recognition. In a world where everything is measurable, the soft parameters are the ones that are often overlooked, omitted from written recipes. While global trends seek to teach machines how to perform gestures of cooking, imitating chefs, the machine will not  know now to embed or copy the soft parameters but we will utilize the machine to analyze them.</p>
                    <p>When I cook I want to engage not only with the words and measurements  of a recipe, but also with my physical expression, the way I embody a recipe. The way my hand moves, the way my body engages and takes part, my state of mind in relation to my movement. </p>
                    <p>Through the archive we can look at the multiplicity of couscous performances. Here there is no one way, there is no right and wrong, the absence of a guideline allows for self-expression and self-accuracy, a physical and emotional experience in the act of cooking.</p>
                </div>
            </Centered>

            <style jsx>{`
                body{
                    background-color: magenta;
                }
            `}</style>
        </div>
    )
}