import { useRef, useState } from "react";
import "./App.css";

function App() {
  const fileRef = useRef(null);
  const [copyMessage, setCopyMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e) => {
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileRef.current.files = e.dataTransfer.files;
      onDropSubmit(e.dataTransfer.files[0]);
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(imageUrl);
    setCopyMessage("Copied.");
    setTimeout(() => {
      setCopyMessage("");
    }, 1000);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", fileRef.current.files[0]);
    fetchImage(formData);
  }

  const onDropSubmit = (dropData) => {
    const formData = new FormData();
    formData.append("image", dropData);
    fetchImage(formData);
  }

  const fetchImage = (formData) => {
    setLoading(true);
    fetch("http://localhost:4000/api/image", {
      method: "POST",
      body: formData,
    }).then(res => res.json()).then(data => {
      setImageUrl(data.image);
      setLoading(false);
    });
  }

  return (
    <main>
      <section className="container">
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="image">Upload image:</label>
            <div className={"file-upload" + (dragActive ? " file-border" : "")}>
              <input type="file" name="image" id="image" className="file-input"
              accept={"image/*"} ref={fileRef} 
              onDragEnter={handleDrag} 
              onDragOver={handleDrag} 
              onDragLeave={handleDrag} 
              onDrop={handleDrop} />
            </div>
          </div>
          <button type="submit" className="btn">Submit</button>
        </form>
      </section>

      <section className="uploaded">
        <h2>Uploaded Image</h2>
        {imageUrl && !loading ? (
        <div>
          <img src={imageUrl} alt="uploaded" height="300" width="300" />
          {copyMessage ? <small className="message">{copyMessage}</small> : <></>}
          <button type="button" className="btn" onClick={() => onCopy()}>Copy to clipboard</button>

        </div>
        ) : <></>}
        {loading ? <div className="loader"></div> : <></>}
      </section>
    </main>
  );
}

export default App;
