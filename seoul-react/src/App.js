// 공통 CSS
import './assets/css/main/App.css';
// React Router Setting
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

// Common Component
import Home from "./components/main/Home";
import MainLayout from "./components/main/MainLayout";

// Component
import CultureMain from "./components/culture/CultureMain";
import HealthMain from './components/health/HealthMain';
import EducationMain from './components/education/EducationMain';
import ExerciseMain from './components/exercise/ExerciseMain';

import InsertDB from './components/db/InsertDB';

// Tour Component
import TourInfo from './components/tour/MapComponent';
import TourFestival from './components/tour/MapComponentFestival';
import TourPet from './components/tour/MapComponentPet';
// import TourCamping from './components/tour/MapComponentCamping';

function App() {
  const menuNames = [ '어린이', '문화', '체육', '환경', '건강', '관광' ];
  const addressNames = [ 'education', 'culture', 'exercise', 'environment', 'health', 'tour' ];

  return (
    <BrowserRouter>
      <div className="App">
        <MainLayout menuNames={ menuNames } addressNames={ addressNames }>
          <Routes>
            <Route path="/" element={<Navigate to="/seoul" />} />
            <Route path="/seoul" element={ <Home menuNames={ menuNames } addressNames={ addressNames } /> }></Route>
            <Route path="/seoul/culture" element={ <CultureMain /> }></Route>
            <Route path="/seoul/education" element={ <EducationMain /> }></Route>
            <Route path="/seoul/exercise" element={ <ExerciseMain /> }></Route>
            <Route path="/seoul/health" element={ <HealthMain /> }></Route>

            <Route path="/seoul/tour" element={ <TourInfo /> }></Route>
            <Route path="/seoul/tour/festival" element={ <TourFestival /> }></Route>
            <Route path="/seoul/tour/pet" element={ <TourPet /> }></Route>
            {/*<Route path="/seoul/tour/camping" element={ <TourCamping /> }></Route>*/}

            <Route path="/seoul/db" element={ <InsertDB /> }></Route>
          </Routes>
        </MainLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;
