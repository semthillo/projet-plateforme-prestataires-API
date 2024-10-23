import express from "express"

const router = express.Router();


router.get("api/", () => {
    console.log("bienvenue dans mon api");
    
})


export default { router };