import { useEffect, useState } from "react"

export default function Mobile() {
    const [show,setShow] = useState(false)

    useEffect(() => {
        if (window.innerWidth < 768) {
            setShow(true)
        }
    },[])

    if (!show) return null

    return (
        <div id="mobileContainer">
            <div id="mobileAlert">
                <p>
                    Welcome to the archive! For the best browsing experience, we recommend accessing our website on a desktop or laptop.
                </p>
                <button onClick={() => setShow(false)}>CLOSE</button>
            </div>
            <style jsx>{`
                #mobileContainer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    backdrop-filter: blur(30px);
                }
                #mobileAlert {
                    width: 50%;
                    height: 50%;
                    background-color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }
                #mobileAlert p {
                    font-size: 1.5em;
                    text-align: center;
                    color: black;
                }
                #mobileAlert button {
                    border: none;
                    background-color: black;
                    color: white;
                    font-size: 1.5em;
                    cursor: pointer;
                }
            `}</style>
        </div>
    )

}