function switchTab(id, el){
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.querySelectorAll("nav div").forEach(n => n.classList.remove("active"));
    el.classList.add("active");
}

const salaireMensuel = 2650;
const debutMois = new Date("2024-04-01");
const heuresHebdo = 39;

function heuresJour(d){ return d.getDay() === 5 ? 7 : 8; }
function estJourTravail(d){ return d.getDay() >= 1 && d.getDay() <= 5; }

function heuresCumulees(){
    let d = new Date(debutMois), total = 0;
    while(d <= new Date()){ if(estJourTravail(d)) total += heuresJour(d); d.setDate(d.getDate()+1); }
    return total;
}

function setRing(id, progress){
    const c = document.getElementById(id);
    const total = 785;
    c.style.strokeDashoffset = total - total * progress;
}

function timeline(){
    const now = new Date();
    const h = now.getHours() + now.getMinutes()/60;
    let p = 0;
    if(h <= 9) p=0;
    else if(h <= 12.5) p=(h-9)/8;
    else if(h <= 13.5) p=(3.5)/8;
    else if(h <= 18) p=(3.5+(h-13.5))/8;
    else p=1;
    document.getElementById("timeline").style.width = (p*100)+"%";
}

function salaireHeure(){ return salaireMensuel/(39*4.33); }
function salaireDepuisDebut(){ return heuresCumulees()*salaireHeure(); }

function heuresAujourd(){
    const now = new Date(); const h = now.getHours() + now.getMinutes()/60;
    if(h < 9) return 0; if(h <= 12.5) return h-9;
    if(h <= 13.5) return 3.5; if(h <= 18) return 3.5+(h-13.5);
    return 8;
}

function remplirHistorique(){
    let html = "", d = new Date("2024-04-01");
    while(d <= new Date()){
        if(estJourTravail(d)){
            let h = heuresJour(d);
            let g = (h*salaireHeure()).toFixed(2);
            html += `<div class="history-item">
                        <div>${d.toLocaleDateString()}</div>
                        <div class="history-values">${h}h — ${g}€</div>
                    </div>`;
        }
        d.setDate(d.getDate()+1);
    }
    document.getElementById("historyList").innerHTML = html;
}

function updateUI(){
    const hCum = heuresCumulees();
    const sTot = salaireDepuisDebut();
    document.getElementById("salaireMois").textContent = sTot.toFixed(2)+" €";
    const sJour = heuresAujourd()*salaireHeure();
    document.getElementById("salaireJour").textContent = sJour.toFixed(2)+" €";
    timeline();
    setRing("ring-month", hCum/(39*4.33));
    setRing("ring-week", (hCum%39)/39);
    setRing("ring-day", heuresAujourd()/8);
    document.getElementById("statsHeures").textContent = hCum.toFixed(1)+" h";
    document.getElementById("statsSalaire").textContent = sTot.toFixed(2)+" €";
}

setInterval(updateUI, 1000);
updateUI();
remplirHistorique();
