const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const toast=(m)=>{let t=$("#toast");t.textContent=m;t.style.display="block";setTimeout(()=>t.style.display="none",3000)};
$("#menuBtn")?.addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$("[data-open]").forEach(x=>x.addEventListener("click",()=>{$("#"+x.dataset.open).classList.add("show");$("#nav")?.classList.remove("open")}));
$$(".close").forEach(x=>x.addEventListener("click",()=>x.closest(".modal").classList.remove("show")));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));

const get=(k,d=[])=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d));
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

$("#contactForm").addEventListener("submit",e=>{e.preventDefault();let f=new FormData(e.target);let a=get("contacts");a.push({name:f.get("name"),phone:f.get("phone"),message:f.get("message"),date:new Date().toLocaleString("ps-AF")});set("contacts",a);e.target.reset();toast("ستاسې پیغام ثبت شو.")});

$("#admissionForm").addEventListener("submit",e=>{e.preventDefault();let f=new FormData(e.target);let a=get("admissions");a.push({student:f.get("student"),father:f.get("father"),grade:f.get("grade"),phone:f.get("phone"),note:f.get("note"),status:"نوی",date:new Date().toLocaleDateString("ps-AF")});set("admissions",a);e.target.reset();$("#admissionModal").classList.remove("show");toast("د نوم‌لیکنې غوښتنه په بریالیتوب ثبت شوه.")});

let selectedRole="student";
$$(".rolegrid button").forEach(b=>b.addEventListener("click",()=>{$$(".rolegrid button").forEach(x=>x.classList.remove("active"));b.classList.add("active");selectedRole=b.dataset.role}));
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();let u=$("#loginUser").value,p=$("#loginPass").value;if(u==="admin"&&p==="1234"){openDash("admin")}else if(u==="student"&&p==="1234"){openDash("student")}else if(u==="teacher"&&p==="1234"){openDash("teacher")}else toast("Username یا Password سم نه دی. Demo: admin / 1234")});

function openDash(role){$("#login").classList.remove("show");$("#dashboard").classList.add("show");$("#roleLabel").textContent=role==="admin"?"Administrator":role==="teacher"?"Teacher":"Student";renderPage("overview",role)}
const pageNames={overview:"Dashboard",students:"Students",teachers:"Teachers",results:"Results",attendance:"Attendance",fees:"Fees",admissions:"Admissions",settings:"Settings"};
$$(".side").forEach(b=>b.addEventListener("click",()=>renderPage(b.dataset.page,$("#roleLabel").textContent==="Administrator"?"admin":$("#roleLabel").textContent==="Teacher"?"teacher":"student")));

function renderPage(page,role){
  $("#dashTitle").textContent=pageNames[page]||page;$$(".side").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  let c=$("#dashContent");
  if(page==="overview"){let ad=get("admissions"),ct=get("contacts");c.innerHTML=`<div class="dashcontent"><div class="dashcards"><div class="dcard"><b>1,248</b><span>ټول زده‌کوونکي</span></div><div class="dcard"><b>56</b><span>ښوونکي</span></div><div class="dcard"><b>${ad.length}</b><span>نوي Admissions</span></div><div class="dcard"><b>${ct.length}</b><span>پیغامونه</span></div></div><div class="tablebox"><div class="toolbar"><h3>وروستي فعالیتونه</h3><button class="smallbtn" data-page2="admissions">Admissions</button></div><table class="table"><tr><th>برخه</th><th>معلومات</th><th>حالت</th></tr><tr><td>تعلیمي کال</td><td>۱۴۰۵</td><td><span class="pill">Active</span></td></tr><tr><td>سیستم</td><td>Student Management</td><td><span class="pill">Online</span></td></tr><tr><td>Portal</td><td>${role}</td><td><span class="pill">Logged in</span></td></tr></table></div></div>`}
  else if(page==="students") tablePage(c,"زده‌کوونکي",["ID","نوم","پلار نوم","ټولګی","حالت"],[["ST-001","احمد خان","محمد خان","۷","Active"],["ST-002","مریم احمد","عبدالله","۶","Active"],["ST-003","حمیدالله","رحیم","۹","Active"],["ST-004","فاطمه","کریم","۸","Active"]]);
  else if(page==="teachers") tablePage(c,"ښوونکي",["ID","نوم","مضمون","ټیلیفون","حالت"],[["T-001","استاد احمد","ریاضیات","0700000000","Active"],["T-002","استاده مریم","پښتو","0700000001","Active"],["T-003","استاد فرید","ساینس","0700000002","Active"]]);
  else if(page==="results") tablePage(c,"د زده‌کوونکو پایلې",["Student ID","نوم","ټولګی","اوسط","حالت"],[["ST-001","احمد خان","۷","91%","Passed"],["ST-002","مریم احمد","۶","88%","Passed"],["ST-003","حمیدالله","۹","76%","Passed"]]);
  else if(page==="attendance") tablePage(c,"حاضري",["Student ID","نوم","ټولګی","حاضري","Status"],[["ST-001","احمد خان","۷","96%","Present"],["ST-002","مریم احمد","۶","98%","Present"],["ST-003","حمیدالله","۹","91%","Present"]]);
  else if(page==="fees") tablePage(c,"فیسونه",["Student ID","نوم","ټولګی","فیس","حالت"],[["ST-001","احمد خان","۷","3,500 AFN","Paid"],["ST-002","مریم احمد","۶","3,500 AFN","Paid"],["ST-003","حمیدالله","۹","3,500 AFN","Pending"]]);
  else if(page==="admissions"){let a=get("admissions");let rows=a.map((x,i)=>[`#${i+1}`,x.student,x.father,x.grade,x.phone,x.status]);tablePage(c,"Online Admissions",["#","زده‌کوونکی","پلار","ټولګی","شمېره","حالت"],rows.length?rows:[["—","تر اوسه کومه نوم‌لیکنه نشته","—","—","—","—"]])}
  else if(page==="settings"){c.innerHTML=`<div class="dashcontent"><div class="tablebox"><h3>System Settings</h3><p class="empty">دلته وروسته د اکاډمۍ نوم، Logo، پته، فیسونه، ټولګي، تعلیمي کال، کاروونکي او نور تنظیمات مدیریت کېدای شي.</p><button class="smallbtn" onclick="localStorage.clear();toast('Demo data پاک شول.')">Clear Demo Data</button></div></div>`}
}
function tablePage(c,title,heads,rows){c.innerHTML=`<div class="dashcontent"><div class="tablebox"><div class="toolbar"><h3>${title}</h3><button class="smallbtn" onclick="toast('دا برخه د Database سره د وصلېدو لپاره چمتو ده.')">+ Add New</button></div><table class="table"><tr>${heads.map(h=>`<th>${h}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</table></div></div>`}
