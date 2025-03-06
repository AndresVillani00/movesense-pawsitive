import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";

export const PostProduct = () =>{
  const { store, actions } = useContext(Context);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      name,
      price,
      description
      };
    
     
    await actions.PostProduct(dataToSend)
    
    
  }
   return(
    <form onSubmit={handleSubmit}>
<div className="mb-3">
  <label for="basic-url" className="form-label">New Post</label>
  <div className="input-group">
    <span className="input-group-text" id="basic-addon3">Name</span>
    <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"
    value={name} onChange={(event) => setName(event.target.name)}/>
  </div>
  <div className="input-group">
    <span className="input-group-text" id="basic-addon3">Image Url</span>
    <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4"
    value={imageUrl} onChange={(event) => setImageUrl(event.target.imageUrl)}/>
  </div>
</div>

<div className="input-group mb-3">
  <span className="input-group-text">Price</span>
  <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)"
  value={price} onChange={(event) => setPrice(event.target.price)}/>
  <span className="input-group-text">.00</span>
</div>
<div className="input-group">
  <span className="input-group-text">Description</span>
  <textarea className="form-control" aria-label="With textarea"
  value={description} onChange={(event) => setDescription(event.target.description)}></textarea>
</div>
<div className="mt-3 mx-auto">
   <button  type="submit" className="btn btn-primary btn-sm ">Post</button>
   <button type="button" className="btn btn-secondary btn-sm ">Cancel</button>
</div>
    </form>
   )
}