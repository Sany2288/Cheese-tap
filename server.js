<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<title>Cheese Combat Admin</title>
<style>
body{ font-family:Arial; background:#f2f2f2; display:flex; justify-content:center; align-items:center; height:100vh; }
.panel{ background:white; padding:20px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.2); width:350px; text-align:center; }
input,button{ margin:10px 0; padding:10px; width:90%; }
#topPlayers{ margin-top:20px; text-align:left; max-height:200px; overflow:auto; }
</style>
</head>
<body>
<div class="panel">
<h2>🛠 Адмін-панель</h2>
<input id="password" type="password" placeholder="Пароль">
<input id="amount" type="number" placeholder="Кількість сиру (+/-)">
<button id="addBtn">Змінити сир усім</button>
<div id="result"></div>
<h3>🏆 Топ 10 гравців</h3>
<div id="topPlayers"></div>
<button id="refreshTop">Оновити топ</button>
</div>

<script>
async function fetchTop(){
  const res=await fetch("/top");
  const data=await res.json();
  const topDiv=document.getElementById("topPlayers");
  topDiv.innerHTML="";
  data.slice(0,10).forEach((u,i)=>{ topDiv.innerHTML+=`${i+1}. ${u.username||"Anon"} — ${u.cheese} 🧀<br>`; });
}
document.getElementById("refreshTop").addEventListener("click", fetchTop);
fetchTop();

document.getElementById("addBtn").addEventListener("click", async()=>{
  const password=document.getElementById("password").value;
  const amount=parseInt(document.getElementById("amount").value);
  const res=await fetch("/admin/change",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password,amount}) });
  const data=await res.json();
  document.getElementById("result").innerText=JSON.stringify(data);
  fetchTop();
});
</script>
</body>
</html>
