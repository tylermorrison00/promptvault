var SB_URL="https://vfyuebkdkxhdrlduqxng.supabase.co",SB_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmeXVlYmtka3hoZHJsZHVxeG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTI1NDQsImV4cCI6MjEwNjc2ODU0NH0.RY-VU33zwySGKmPH34pHs72HaxRt9yi4lAhHO9xn7_4",ADMIN_EMAIL="talhamohsin216@gmail.com",token=localStorage.getItem("pv_admin_token")||"";function $(e){return document.getElementById(e)}function api(e,n,t,o,i){var a={apikey:SB_ANON,Authorization:"Bearer "+(token||SB_ANON)};return o||(a["Content-Type"]="application/json"),"GET"===n||o||i||(a.Prefer="return=representation"),fetch(SB_URL+e,{method:n||"GET",headers:a,body:t}).then(function(e){return e.text().then(function(n){var t=null;try{t=n?JSON.parse(n):null}catch(e){}if(!e.ok)throw new Error(t&&(t.message||t.msg)||"Error "+e.status);return t})})}function esc(e){return String(null==e?"":e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function setViewer(e){window.PVviewer=e;var n=!!e.admin,t=!(!e.admin&&!e.member);document.body.classList.toggle("admin",n),$("navLogin").classList.toggle("hidden",t),$("navSignup").classList.toggle("hidden",t),$("navLogout").classList.toggle("hidden",!t),$("navMembers").classList.toggle("hidden",!n),paintPricing(e)}function closeModals(){["loginBack","signupBack","formBack","payBack","reqBack"].forEach(function(e){$(e).classList.remove("open")})}function openLoginM(){$("loginErr").style.display="none",showLoginPane("login"),$("loginBack").classList.add("open")}function openSignupM(){$("signupErr").style.display="none",$("signupOk").style.display="none",$("signupBack").classList.add("open")}function logout(){token="",localStorage.removeItem("pv_admin_token"),window.PVfavs=new Set,setViewer({guest:!0}),window.PVreload()}function showLoginPane(e){$("loginFields").style.display="login"===e?"":"none",$("resetFields").style.display="reset"===e?"":"none",$("newpassFields").style.display="newpass"===e?"":"none",$("loginTitle").textContent="reset"===e?"Reset password":"newpass"===e?"New password":"Log in"}function boot(){if(!token)return window.PVfavs=new Set,setViewer({guest:!0}),void window.PVreload();api("/auth/v1/user","GET").then(function(e){var n=String(e.email||"").toLowerCase(),t=null;try{t=JSON.parse(atob(token.split(".")[1])).sub}catch(e){}return n&&n===ADMIN_EMAIL.toLowerCase()?(setViewer({admin:!0,email:n,uid:t}),loadFavs(t),void window.PVreload()):t?void api("/rest/v1/rpc/downgrade_expired_plan","POST","{}",!1,!0).catch(function(){}).then(function(){return api("/rest/v1/profiles?select=plan&id=eq."+t,"GET")}).then(function(e){setViewer({member:!0,plan:(e&&e[0]||{}).plan||"free",email:n,uid:t}),loadFavs(t),window.PVreload()}).catch(function(){window.PVfavs=new Set,setViewer({member:!0,plan:"free",uid:t}),window.PVreload()}):(window.PVfavs=new Set,setViewer({member:!0,plan:"free"}),void window.PVreload())}).catch(function(){token="",localStorage.removeItem("pv_admin_token"),window.PVfavs=new Set,setViewer({guest:!0}),window.PVreload()})}function uploadMedia(e){var n=Date.now()+"_"+e.name.replace(/[^a-zA-Z0-9._-]/g,"_");return api("/storage/v1/object/prompt-media/"+n,"POST",e,!0).then(function(){return{url:SB_URL+"/storage/v1/object/public/prompt-media/"+n,type:0===e.type.indexOf("video/")?"video":"image"}})}function deleteMedia(e){var n=(e||"").indexOf("/prompt-media/");return n<0?Promise.resolve():api("/storage/v1/object/prompt-media/"+e.slice(n+14),"DELETE").catch(function(){})}function mediaTypeOf(e){return/\.(mp4|webm|mov|m4v)(\?|$)/i.test(e)?"video":"image"}window.PVviewer={guest:!0},window.PVfavs=new Set,window.PVopenLogin=function(){"function"==typeof openLoginM&&openLoginM()};var r=document.documentElement,t=document.getElementById("theme"),ACCENTS=["emerald","gold","pink","blue","cyan"];function setAccent(e){"emerald"===e?r.removeAttribute("data-accent"):r.setAttribute("data-accent",e),t.title="Theme: "+e.charAt(0).toUpperCase()+e.slice(1);try{localStorage.setItem("pv_accent",e)}catch(e){}}try{var sv=localStorage.getItem("pv_accent");sv&&ACCENTS.indexOf(sv)>0&&setAccent(sv)}catch(e){}function showLoginPane(e){$("loginFields").style.display="login"===e?"":"none",$("resetFields").style.display="reset"===e?"":"none",$("newpassFields").style.display="newpass"===e?"":"none",$("loginTitle").textContent="reset"===e?"Reset password":"newpass"===e?"New password":"Log in"}function boot(){if(!token)return window.PVfavs=new Set,setViewer({guest:!0}),void window.PVreload();api("/auth/v1/user","GET").then(function(e){var n=String(e.email||"").toLowerCase(),t=null;try{t=JSON.parse(atob(token.split(".")[1])).sub}catch(e){}return n&&n===ADMIN_EMAIL.toLowerCase()?(setViewer({admin:!0,email:n,uid:t}),loadFavs(t),void window.PVreload()):t?void api("/rest/v1/rpc/downgrade_expired_plan","POST","{}",!1,!0).catch(function(){}).then(function(){return api("/rest/v1/profiles?select=plan&id=eq."+t,"GET")}).then(function(e){setViewer({member:!0,plan:(e&&e[0]||{}).plan||"free",email:n,uid:t}),loadFavs(t),window.PVreload()}).catch(function(){window.PVfavs=new Set,setViewer({member:!0,plan:"free",uid:t}),window.PVreload()}):(window.PVfavs=new Set,setViewer({member:!0,plan:"free"}),void window.PVreload())}).catch(function(){token="",localStorage.removeItem("pv_admin_token"),window.PVfavs=new Set,setViewer({guest:!0}),window.PVreload()})}t.onclick=function(){var e=r.getAttribute("data-accent")||"emerald";setAccent(ACCENTS[(ACCENTS.indexOf(e)+1)%ACCENTS.length])},function(){var e=document.querySelector(".navlinks"),n=document.getElementById("hamburger");if(n&&e){n.addEventListener("click",function(n){n.stopPropagation(),e.classList.toggle("open")}),document.addEventListener("click",function(n){e.classList.contains("open")&&!n.target.closest(".navlinks")&&e.classList.remove("open")});var t=document.getElementById("menupanel");t.addEventListener("click",function(n){n.target.closest("a,button")&&e.classList.remove("open")});var o=document.getElementById("waChannel");if(o){var i=o.cloneNode(!0);i.removeAttribute("id"),i.className="wachannelrow",t.appendChild(i)}}}(),$("navLogin").onclick=openLoginM,$("navSignup").onclick=openSignupM,$("navLogout").onclick=logout,$("navMembers").onclick=function(){location.href="members.html"},$("forgotLink").onclick=function(e){e.preventDefault(),$("resetErr").style.display="none",$("resetOk").style.display="none",showLoginPane("reset")},$("resetBack").onclick=function(){showLoginPane("login")},$("newpassClose").onclick=closeModals,$("doReset").onclick=function(){var e=$("r_email").value.trim(),n=$("resetErr"),t=$("resetOk");if(n.style.display="none",t.style.display="none",!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))return n.textContent="Enter a valid email address.",void(n.style.display="block");$("doReset").disabled=!0,api("/auth/v1/recover","POST",JSON.stringify({email:e})).then(function(){t.textContent="Reset link sent! Check your inbox (and spam folder).",t.style.display="block"}).catch(function(e){n.textContent="Could not send: "+e.message,n.style.display="block"}).finally(function(){$("doReset").disabled=!1})},$("doNewpass").onclick=function(){var e=$("n_pass").value,n=$("newpassErr");if(n.style.display="none",!e||e.length<6)return n.textContent="Password must be at least 6 characters.",void(n.style.display="block");$("doNewpass").disabled=!0,api("/auth/v1/user","PUT",JSON.stringify({password:e})).then(function(){$("n_pass").value="",closeModals(),boot()}).catch(function(e){n.textContent="Could not update: "+e.message,n.style.display="block"}).finally(function(){$("doNewpass").disabled=!1})},$("doLogin").onclick=function(){var e=$("a_email").value.trim(),n=$("a_pass").value,t=$("loginErr");if(t.style.display="none",!e||!n)return t.textContent="Enter both email and password.",void(t.style.display="block");$("doLogin").disabled=!0,api("/auth/v1/token?grant_type=password","POST",JSON.stringify({email:e,password:n})).then(function(e){token=e.access_token||"",localStorage.setItem("pv_admin_token",token),location.reload()}).catch(function(e){t.textContent="Login failed: "+e.message,t.style.display="block"}).finally(function(){$("doLogin").disabled=!1})},$("doSignup").onclick=function(){var e=$("s_email").value.trim(),n=$("s_pass").value,t=$("signupErr"),o=$("signupOk");if(t.style.display="none",o.style.display="none",!e||n.length<6)return t.textContent="Enter a valid email and a password of at least 6 characters.",void(t.style.display="block");$("doSignup").disabled=!0,api("/auth/v1/signup","POST",JSON.stringify({email:e,password:n})).then(function(e){$("s_pass").value="",e&&e.access_token?(token=e.access_token,localStorage.setItem("pv_admin_token",token),closeModals(),location.reload()):(o.textContent="Account created! You can now log in.",o.style.display="block")}).catch(function(e){t.textContent="Signup failed: "+e.message,t.style.display="block"}).finally(function(){$("doSignup").disabled=!1})},function(){var e=document.getElementById("fabBtn"),n=document.getElementById("fabMenu");e&&n&&(e.addEventListener("click",function(e){e.stopPropagation(),n.hidden=!n.hidden}),document.addEventListener("click",function(){n.hidden=!0}))}();;["loginClose","signupClose","nicheClose","toolClose","formClose","payClose","reqClose","resetBack","newpassClose"].forEach(function(i){var b=document.getElementById(i);if(b)b.onclick=closeModals});document.addEventListener("keydown",function(e){if(e.key==="Escape")closeModals()});
window.PVtrendModal=function(b,s){var d=document,id="pvTB",e=d.getElementById(id);if(!e){e=d.createElement("div");e.className="mback";e.id=id;e.innerHTML='<div class=modal><h3>Suggest a trend</h3><textarea id=pvTT rows=3 maxlength=200 placeholder="What\'s trending?"></textarea><div class=mrow><button class="btn primary" id=pvTS type=button>Send</button><button class="btn secondary" id=pvTC type=button>Cancel</button></div></div>';d.body.appendChild(e);d.getElementById("pvTC").onclick=function(){e.classList.remove("open")};e.onclick=function(x){if(x.target==e)e.classList.remove("open")};d.getElementById("pvTS").onclick=function(){var t=d.getElementById("pvTT"),v=t.value.trim();if(!v){alert("Please write what\'s trending.");return}var k=SB_ANON;fetch(SB_URL+"/rest/v1/trend_suggestions",{method:"POST",headers:{apikey:k,Authorization:"Bearer "+k,"Content-Type":"application/json"},body:JSON.stringify({section:s,description:v})}).then(function(x){if(!x.ok)throw 0;e.classList.remove("open");t.value="";alert("Thanks! Sent.")}).catch(function(){alert("Could not send.")})}}var n=d.getElementById(b);if(n)n.onclick=function(){d.getElementById("pvTT").value="";e.classList.add("open")}};

// Tag custom order (admin) - v2
window.PVtagOrder={};
window.PVloadTagOrder=function(page){
  return api('/rest/v1/tag_orders?page=eq.'+page+'&select=tag,sort_order&order=sort_order.asc','GET').then(function(rows){
    var o={};(rows||[]).forEach(function(r){o[String(r.tag).toLowerCase()]=r.sort_order});
    window.PVtagOrder[page]=o;
  }).catch(function(){window.PVtagOrder[page]={}});
};
window.PVsortTags=function(tags,page){
  var order=window.PVtagOrder[page]||{};
  return tags.slice().sort(function(a,b){
    var oa=order[String(a).toLowerCase()],ob=order[String(b).toLowerCase()];
    if(oa!==undefined&&ob!==undefined)return oa-ob;
    if(oa!==undefined)return -1;
    if(ob!==undefined)return 1;
    var al=String(a).toLowerCase(),bl=String(b).toLowerCase();
    return al<bl?-1:al>bl?1:0;
  });
};

// Tag drag reorder (admin) - long-press 3s then drag
window.PVenableTagDrag=function(page,filtersId,attrPrefix){
  var F=document.getElementById(filtersId);
  if(!F)return;
  var btns=F.querySelectorAll('['+attrPrefix+'^="tag:"]');
  if(!btns.length)return;
  var tags=[];
  btns.forEach(function(b){tags.push(b.getAttribute(attrPrefix).slice(4))});
  btns.forEach(function(btn){
    var pressTimer=null,dragging=false,startX=0,startY=0;
    function isAdmin(){return document.body.classList.contains('admin')}
    function startPress(x,y){
      if(!isAdmin())return;
      startX=x;startY=y;
      pressTimer=setTimeout(function(){
        dragging=true;
        btn.classList.add('tag-dragging');
        document.body.classList.add('tag-drag-active');
        if(navigator.vibrate)try{navigator.vibrate(50)}catch(e){}
      },3000);
    }
    function cancelPress(){
      if(pressTimer){clearTimeout(pressTimer);pressTimer=null}
    }
    function endDrag(x,y){
      cancelPress();
      if(!dragging)return;
      dragging=false;
      btn.classList.remove('tag-dragging');
      document.body.classList.remove('tag-drag-active');
      // Find drop target
      var el=document.elementFromPoint(x,y);
      var target=null;
      if(el){
        target=el.closest('['+attrPrefix+'^="tag:"]');
      }
      if(target&&target!==btn){
        var allTags=[];
        F.querySelectorAll('['+attrPrefix+'^="tag:"]').forEach(function(b){
          allTags.push(b.getAttribute(attrPrefix).slice(4));
        });
        var fromIdx=-1,toIdx=-1,tl=btn.getAttribute(attrPrefix).slice(4).toLowerCase();
        for(var i=0;i<allTags.length;i++){
          if(allTags[i].toLowerCase()===tl)fromIdx=i;
          if(allTags[i].toLowerCase()===target.getAttribute(attrPrefix).slice(4).toLowerCase())toIdx=i;
        }
        if(fromIdx>=0&&toIdx>=0&&fromIdx!==toIdx){
          var moved=allTags.splice(fromIdx,1)[0];
          allTags.splice(toIdx,0,moved);
          var rows=allTags.map(function(t,i){return{page:page,tag:String(t).toLowerCase(),sort_order:i}});
          window.api('/rest/v1/tag_orders?page=eq.'+page,'DELETE').then(function(){
            return window.api('/rest/v1/tag_orders','POST',JSON.stringify(rows));
          }).then(function(){
            location.reload();
          }).catch(function(e){alert('Could not save: '+(e&&e.message?e.message:e))});
        }
      }
    }
    // Touch
    btn.addEventListener('touchstart',function(e){
      if(e.touches.length!==1)return;
      startPress(e.touches[0].clientX,e.touches[0].clientY);
    },{passive:true});
    btn.addEventListener('touchmove',function(e){
      if(!dragging)return;
      e.preventDefault();
      var t=e.touches[0];
      // Visual feedback - move the button slightly
      btn.style.transform='translate('+(t.clientX-startX)+'px,'+(t.clientY-startY)+'px) scale(1.1)';
      btn.style.zIndex='9999';
      btn.style.position='relative';
    },{passive:false});
    btn.addEventListener('touchend',function(e){
      if(dragging){
        var t=e.changedTouches[0];
        btn.style.transform='';btn.style.zIndex='';btn.style.position='';
        endDrag(t.clientX,t.clientY);
      }else{
        cancelPress();
      }
    });
    btn.addEventListener('touchcancel',function(){cancelPress();dragging=false;btn.classList.remove('tag-dragging');document.body.classList.remove('tag-drag-active');btn.style.transform='';btn.style.zIndex='';btn.style.position=''});
    // Mouse (desktop)
    btn.addEventListener('mousedown',function(e){
      if(e.button!==0)return;
      startPress(e.clientX,e.clientY);
    });
    btn.addEventListener('mousemove',function(e){
      if(!dragging)return;
      btn.style.transform='translate('+(e.clientX-startX)+'px,'+(e.clientY-startY)+'px) scale(1.1)';
      btn.style.zIndex='9999';
      btn.style.position='relative';
    });
    btn.addEventListener('mouseup',function(e){
      if(dragging){
        btn.style.transform='';btn.style.zIndex='';btn.style.position='';
        endDrag(e.clientX,e.clientY);
      }else{
        cancelPress();
      }
    });
    btn.addEventListener('mouseleave',function(){
      if(!dragging)cancelPress();
    });
  });
};
