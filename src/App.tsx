import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBreed, setSelectedBreed] = useState<string>("hound");
  const [selectedSubBreed, setSelectedSubBreed] = useState<string>("");
  const [selectedNumber, setSelectedNumber] = useState<number>(5);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [subBreeds, setSubBreeds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  

  const handleNext = () => {
      if (currentImageIndex === images.length - 1) {
          setCurrentImageIndex(0);
      } else {
          setCurrentImageIndex(currentImageIndex + 1);
      }
  };

  const handlePrev = () => {
      if (currentImageIndex === 0) {
          setCurrentImageIndex(images.length - 1);
      } else {
          setCurrentImageIndex(currentImageIndex - 1);
      }
  };

  const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        backgroundColor       : 'white',
        padding               : '20px',
        border                : 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay : {
        backgroundColor  : 'rgba(0,0,0,0.6)'
    }
};

  //Get all
  useEffect(() => {
    const fetchBreeds = async () => {
      const res = await fetch("https://dog.ceo/api/breeds/list/all");
      const data = await res.json();
      setBreeds(Object.keys(data.message));      
    };
    fetchBreeds();
  }, []);


  // Get breeds
  useEffect(() => {
    if (!selectedBreed) {
      setSubBreeds([]);
      return;
    }


    const fetchSubBreeds = async () => {
      const res = await fetch(`https://dog.ceo/api/breed/${selectedBreed}/list`);
      const data = await res.json();
      const subBreeds = Object.values(data.message).flat()
      setSubBreeds(subBreeds);
    };
    fetchSubBreeds();
  }, [selectedBreed]);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(event.target.value);
  };

  const handleSubBreedSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubBreed(event.target.value);
  };

  const handleNumberSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumber(parseInt(event.target.value));
  };


// const handleViewImages = async () => {
//   setShowMessage(true);
//   if (!selectedBreed || !selectedNumber) {
//     setError("Please select a breed and a number of images");
//     return;
//   }
//   setError("");
//   try {
//     let url = `https://dog.ceo/api/breed/${selectedBreed}/images/random/${selectedNumber}`
//     if (selectedSubBreed) {
//       url = `https://dog.ceo/api/breed/${selectedBreed}/${selectedSubBreed}/images/random/${selectedNumber}`
//     }
//     const res = await fetch(url);
//     const data = await res.json();
//     setImages(data.message);
//   } catch (error) {
//     setError("An error occurred while fetching images. Please try again later.");
//   }
// };

const handleViewImages = async () => {
  setLoading(true);
  setShowMessage(true);
  if (!selectedBreed || !selectedNumber ) {
    setError("Please select a breed and a number of images");
  return;
}
  setError("");
try {
  //const res = await fetch(`https://dog.ceo/api/breed/${selectedBreed}/${selectedSubBreed}/images/random/${selectedNumber}`);
  const res = await fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random/${selectedNumber}`);
  const data = await res.json();
  setImages(data.message);
} catch (error) {
  setError("An error occurred while fetching images. Please try again later.");
}
finally {
  setLoading(false);
}
};

const isInvalid = error !== "" ;

return (
<div>

<img src="https://dog.ceo/img/dog-api-logo.svg" className="logo" alt="dog ceo api"/>

  <h1>Dog Image Finder Example</h1>
  <h5>Welcome or shall I say Woof Woof! Created By <a href="https://www.linkedin.com/in/benjamin-dordoigne/" target="_blank" rel="noreferrer">BenjaminTheDev</a> - Using, CRA, TypeScript and flexbox</h5>

<form>







    <div className="selects__flex">
  
    <select
        className={isInvalid ? "invalid" : ""}
        onChange={handleSelect}
        value={selectedBreed}
      >
      {breeds.map((breed) => (
        <option key={breed} value={breed}>
        {breed}
        </option>
      ))}
    </select>

    {subBreeds.length > 0 && 
    
      <select
        className={isInvalid ? "invalid" : ""}
        onChange={handleSubBreedSelect}
        value={selectedSubBreed}
      >
        {subBreeds.map((subBreed) => (
          <option key={subBreed} value={subBreed}>
            {subBreed}
          </option>
        ))}
      </select>
      
}
  <select
    className={isInvalid ? "invalid" : ""}
    onChange={handleNumberSelect}
    value={selectedNumber}
  >
      {[1,2,3,4,5,6,7,8,9,10,11,12,13,15].map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
      ))}
  </select>
  
  <button type="button"  onClick={handleViewImages}>View Images</button>

  </div>

  


  <div className="selectedBreed__flex">
    {!showMessage && <p><strong>Please click view images!</strong></p>}
    {showMessage && <p>You have selected : <strong>{selectedBreed}</strong></p>}
  </div>
 

{ error && <div className="error">{error}</div> }

<div className="flex__images">

{loading && <p>Woof Woof I am loading doggy images...</p>}


  {images && images.map((image) => (
    <div className="image"> 
      <img 
          
          src={image} 
          alt="Dog"
          onClick={(event) => {
              setModalImage(event.currentTarget.src);
              setModalOpen(true);
          }}
      />
    </div>
  ))}
</div>


<Modal 
    isOpen={modalOpen} 
    onRequestClose={() => setModalOpen(false)}
    style={customStyles}
>
    <button onClick={handlePrev}>Prev</button>
    <button onClick={handleNext}>Next</button>
    <img src={images[currentImageIndex]} alt="Selected Dog" />
</Modal>

</form>
</div>




  
)
}

export default App;
