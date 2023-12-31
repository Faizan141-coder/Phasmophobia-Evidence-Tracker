import { useEffect,useState,useMemo } from "react"
import Card from "../component/Card.js"
import axios from 'axios'

const refresh=()=>{
  window.location.reload()
}


const SecondPage =()=>{
   const [evidences,setevidences] =useState(null)
   const [ghost,setghost]=useState(null)
    const [matchingGhosts, setMatchingGhosts] = useState([]);
    const [selectedEvidences, setSelectedEvidences] = useState([]);
    const [selectedCards,setSelectedCards]=useState([])
    const [gamelist,setgamelist]=useState([])
    const[game,setgame]=useState('Phasmophobia')
    const[extraghosts,setghostsextra]=useState([])
    const[extraevidences,setextraevidences]=useState([])
    const [disabledCards,setDisabledCards]=useState([])

    /*const handleSetGhosts = (matchingGhost) => {
    setMatchingGhosts(matchingGhost);
};
*/
const [evidencecancelled,setevidencecancelled]=useState([])

  // Retrieve selected and doubleClicked from localStorage on component mount
  useEffect(() => {
    localStorage.setItem('Evidence', JSON.stringify(evidencecancelled))
  }
  , [evidencecancelled]);
const handleCardSelect=(evidence)=>{
  const updatedSelectedCards = [...selectedCards, evidence];
    setSelectedCards(updatedSelectedCards);
    const filteredGhosts = ghost.filter((ghost) =>
      updatedSelectedCards.every((selected) =>
        ghost.EvidenceList.includes(selected.Name) && !disabledCards.some((disabled) => ghost.EvidenceList.includes(disabled.Name)
      ))
    );
    setMatchingGhosts(filteredGhosts);
}


 const startGame =()=>{
  const ghooost = extraghosts
  const tobeevidences =extraevidences
  console.log(JSON.stringify(ghost))
     const updatedGhosts = ghooost.map((ghost) => ({
        ...ghost,
        EvidenceList: ghost.EvidenceList.filter((evidenceList) => evidenceList.Game ===game )
          .map((evidenceList) => evidenceList.evidences)
          .flat(),
      }));

const filterEvidenceByGame=(evidenceList, game)=> {
  return evidenceList.filter(item => item.GameList.includes(game));
}

    setghost(updatedGhosts)
    setevidences(filterEvidenceByGame(tobeevidences,game))
    console.log(JSON.stringify(updatedGhosts))
 }



const handleOptionChange = (event) => {
     setgame(event.target.value);
     };


const handleDisableClick=(evidence)=>{

    const updatedDisabledCards = [...disabledCards, evidence];
    setDisabledCards(updatedDisabledCards);
   
    const filteredGhosts = ghost.filter((ghost) =>
      selectedCards.every((selected) =>
         ghost.EvidenceList.includes(selected.Name) && !updatedDisabledCards.some((disabled) => ghost.EvidenceList.includes(disabled.Name)

    )
  ));
    if (selectedCards.length === 0) {
      setMatchingGhosts([]);
    }else{
    setMatchingGhosts(filteredGhosts)
    }
};

const handleEnableClick=(evidence)=>{
const updatedDisabledCards = disabledCards.filter((disabled) => disabled.Name !== evidence.Name);
setDisabledCards(updatedDisabledCards);

  const filteredGhosts = ghost.filter((ghost) =>
    selectedCards.every((selected) =>
      ghost.EvidenceList.includes(selected.Name) && !updatedDisabledCards.some((disabled) => ghost.EvidenceList.includes(disabled.Name))
    )
  );
   if (selectedCards.length === 0) {
      setMatchingGhosts([]);
    }else{
    setMatchingGhosts(filteredGhosts)
    }
};



const handleUnSelect=(evidence)=>{
  const updatedSelectedCards = selectedCards.filter(
      (selected) => selected.Name !== evidence.Name
    );
    setSelectedCards(updatedSelectedCards);
  
    if (updatedSelectedCards.length === 0) {
      setMatchingGhosts([]);
    } else {
      const filteredGhosts = ghost.filter((ghost) =>
        updatedSelectedCards.every((selected) =>
          ghost.EvidenceList.includes(selected.Name) && !disabledCards.some((disabled) => ghost.EvidenceList.includes(disabled.Name)
        )
        )
      );
      setMatchingGhosts(filteredGhosts);
    }
}
const evidencecancelling=(evidence)=>{
    const ecancelled = evidencecancelled.filter((e) => e !== evidence);
    setevidencecancelled(ecancelled);
}
const evidenceaddinto = (evidence) => {
  setevidencecancelled((prevEvidence) => [...prevEvidence, evidence]);
}
const handleSetEvidence = (matchingEvidences, removeGhost) => {
  const uniqueEvidencesSet = new Set(selectedEvidences.concat(matchingEvidences));
  let uniqueEvidences = Array.from(uniqueEvidencesSet);
  if (removeGhost) {
    const removeIndex = uniqueEvidences.findIndex(evidence => evidence._id === removeGhost._id);
    if (removeIndex !== -1) {
      uniqueEvidences.splice(removeIndex, 1);
    }
  }
  setSelectedEvidences(uniqueEvidences);
}
const returnElement=()=>{
 console.log(gamelist)
 console.log(ghost)
 console.log(evidences)
}
  useEffect(() => {
    localStorage.setItem('selectedevidence', JSON.stringify(selectedEvidences))
  },[selectedEvidences])

  useEffect(() => {
    localStorage.setItem('matchingevidence', JSON.stringify(matchingGhosts))
  },[matchingGhosts])

   useEffect(() => {
    localStorage.setItem('evidences', JSON.stringify(evidences))
  },[evidences])
   useEffect(()=> {
        
    

   const fetchEvidence=async()=>{
          
         const evidence=await fetch('/evidence')
         const ghost=await fetch('/ghost')
          const games=await fetch('/game')
          const gamejson   = await games.json()
         const ghostjson=await ghost.json()
         const json = await evidence.json()
         if(evidence.ok){
           setevidences([...json])
           setghost([...ghostjson])
           setghostsextra([...ghostjson])
           setgamelist([...gamejson])
           setextraevidences([...json])
         }
         }
        
         fetchEvidence()
    },[])
    
return(
        <main>
        <section className="ghost-evidence-section">
         <select className="dropdown" 
             
              onChange={handleOptionChange}
              >
              <option value="">Select the Game</option>
             {gamelist && gamelist.map((option) => (
             <option   key={option._id}    value={option.Name}>
             {option.Name}
             </option>
             ))}
             </select>  
           <button className="start-button" onClick={startGame}>Start</button>
           <button className="reset-button" onClick={refresh}>Reset</button>
        <h2>Ghost Evidence</h2>
        
        <div className="cards">
        {evidences&&evidences.map((element)=>(
            <Card key={element._id} e= {element} ghosts={ghost} evidenceaddinto={evidenceaddinto}  evidencecancelling={evidencecancelling} handleEnableClick={handleEnableClick} handleCardSelect={handleCardSelect} handleDisableClick={handleDisableClick} handleUnSelect={handleUnSelect} evidence={evidences} setEvidence={handleSetEvidence} selectedEvidence={selectedEvidences} setSelectedEvidence={setSelectedEvidences}  matchghost={matchingGhosts} />
         ))
        }
      </div>
       </section>
    </main>
)
}
export default SecondPage