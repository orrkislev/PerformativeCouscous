import Background from "./conponents/Background";
import { pageAtom } from "./conponents/Header";
import Layers from "./conponents/Layers";
import UI from "./conponents/UI";
import { useRecoilValue } from 'recoil';
import Join from "./conponents/Join";
import About from "./conponents/About";
import Home from "./conponents/Home";
import Audio from "./conponents/Audio";
import Test from "./conponents/Test";
import Mobile from "./conponents/Mobile";

export default function App() {
  const page = useRecoilValue(pageAtom);

  // if in mobile, show 

  // return <Test />

  return (
    <div>
        <Mobile />
        {page.page === 'join' && <Join />}
        {page.page === 'about' && <About />}
        {page.page === 'home' && <Home />}
        {page.page === 'performance' && <Background />}
        {page.page === 'performance' && <Audio />}
        <UI />
        {page.page === 'performance' && <Layers />}
    </div>
  );
}
