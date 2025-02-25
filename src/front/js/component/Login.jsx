import React from "react";

export const login = () => {
 return (
    <div>
        <form action="">
           <div className="mb-3">
             <label for="LoginUsername" className="form-label">Username</label>
             <input type="text" className="form-control" id="LoginUsername" placeholder="type your email to log in"/>
           </div>
           <div className="mb-3">
             <label for="LoginPassword" className="form-label">Password</label>
             <input type="password" className="form-control" id="LoginPassword" placeholder="Enter your password"/>
              <div className="d-grid gap-2 d-md-block">
                <button className="btn btn-primary" type="button">Log In</button>
                <button className="btn btn-primary" type="button">Cancel</button>
             </div>
           </div>
        </form>
    </div>
 )   

};