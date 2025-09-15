# Cheese-tap
require("dotenv").config();
const express=require("express");
const fs=require("fs");
const bodyParser=require("body-parser");
const bcrypt=require("bcrypt");
const app=express();
app.use(bodyParser.json());
app.use(express.static("."));

let dbFile="./db.json";
let db={};
if(fs.existsSync(dbFile)) db=JSON.parse(fs.readFileSync(dbFile));

function saveDB(){ fs.writeFileSync(dbFile,JSON.stringify(db,null,2)); }

// Оновлення даних гравця
app.post("/update",(req,res)=>{
  const {user_id,username,cheese,multiplier,farmers}=req.body;
  if(!user_id) return res.status(400).send({error:"No user"});
  if(!db[user_id]) db[user_id]={username,cheese:0,multiplier:1,farmers:0};
  db[user_id].username=username;
  db[user_id].cheese=cheese;
  db[user_id].multiplier=multiplier;
  db[user_id].farmers=farmers;
  saveDB();
  res.send({total:db[user_id].cheese});
});

// Додати/забрати сир усім
app.post("/admin/change",async(req,res)=>{
  const {password,amount}=req.body;
  const match=await bcrypt.compare(password,process.env.ADMIN_PASS_HASH);
  if(!match) return res.status(403).send({error:"Wrong password"});
  for(let u in db) db[u].cheese+=amount;
  saveDB();
  res.send({success:true,changed:amount});
});

// Топ гравців
app.get("/top",(req,res)=>{
  let arr=Object.entries(db).map(([id,u])=>u);
  arr.sort((a,b)=>b.cheese-a.cheese);
  res.send(arr);
});

// Завантажити стан конкретного гравця
app.get("/player/:id",(req,res)=>{
  const id=req.params.id;
  if(db[id]) res.send(db[id]);
  else res.send({cheese:0,multiplier:1,farmers:0});
});

app.listen(3000,()=>console.log("Server running http://localhost:3000"));
