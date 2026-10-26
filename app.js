const $=id=>document.getElementById(id), money=v=>v===null?"Unavailable":"$"+(Math.round((v+Number.EPSILON)*100)/100).toFixed(2);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const meal={};let target=40,budget=5;
let liveTimer=null;
const short=f=>f.name.split(",").slice(0,2).join(",");
const basisLabel=f=>`${f.basis||100} ${f.unit||'g'}`;
const cost25=(f,r)=>{const o=Planner.offer(f,r);return o&&(o.nutrition?.protein??f.protein)>0?25*o.unitPrice/(o.nutrition?.protein??f.protein):null};
const announce=(message,delay=250)=>{clearTimeout(liveTimer);liveTimer=setTimeout(()=>{$("liveStatus").textContent="";setTimeout(()=>{$("liveStatus").textContent=message},40)},delay)};
const focusSoon=selector=>setTimeout(()=>document.querySelector(selector)?.focus({preventScroll:true}),30);
for(const c of [...new Set(FOODS.map(f=>f.category))].sort())$("category").add(new Option(c,c));
function render(options={}){
 const retailer=$("retailer").value;
 let list=FOODS.filter(f=>f.name.toLowerCase().includes($("search").value.toLowerCase())&&(!$("category").value||f.category===$("category").value));
 list.sort((a,b)=>$("sort").value==="name"?a.name.localeCompare(b.name):(value(b)-value(a)||a.name.localeCompare(b.name)));
 function value(f){const o=Planner.offer(f,retailer);return o?(o.nutrition?.protein??f.protein)/o.unitPrice:-1}
 $("count").textContent=`${list.length} / ${FOODS.length} foods`;
 const renderPriceCell=(f,r)=>{
   const price=Planner.offer(f,r)?.unitPrice??null;
   const other=Planner.offer(f,r==="Woolworths"?"Coles":"Woolworths")?.unitPrice??null;
   const lower=price!==null&&(other===null||price<other-1e-9);
   return `<td role="cell" data-label="${r} price" class="price-cell${lower?" lower-price":""}"><span class="price-main">${money(price)}</span><small>/${basisLabel(f)}${lower?" · lower":""}</small></td>`;
 };
 $("foods").innerHTML=list.map(f=>{const o=Planner.offer(f,retailer),inMeal=Object.hasOwn(meal,f.id);return `<tr role="row" class="${inMeal?"selected-row":""}"><th scope="row" role="rowheader"><div class="food-title"><strong>${esc(f.name)}</strong>${inMeal?'<span class="meal-badge">IN MEAL</span>':""}</div>${f.comparison?`<small>${esc(f.comparison)}</small>`:""}${!o?`<small>${esc(f.missingReason)}</small>`:""}<small>${(o?.nutrition?.protein??f.protein).toFixed(1)} g protein / ${basisLabel(f)} · ${esc(o?.nutrition?.nutritionSourceType||f.nutritionSourceType||'AFCD')} reference</small></th>${renderPriceCell(f,"Woolworths")}${renderPriceCell(f,"Coles")}<td role="cell" data-label="Protein per dollar">${o?((o.nutrition?.protein??f.protein)/o.unitPrice).toFixed(1):"—"}</td><td role="cell" data-label="Cost per 25 g protein" class="cost-cell">${money(cost25(f,retailer))}</td><td role="cell" data-label="Meal action"><button class="add" type="button" data-add="${f.id}" aria-label="Add ${esc(f.name)} to meal">+</button></td></tr>`}).join("")||'<tr role="row"><td role="cell" colspan="6">No matching foods. Try another search.</td></tr>';
 const pricedVisible=list.filter(f=>cost25(f,retailer)!==null);
 const cheapest=pricedVisible.reduce((best,f)=>{const v=cost25(f,retailer);return !best||v<best.v?{f,v}:best},null);
 const widest=pricedVisible.map(f=>{
   const w=cost25(f,"Woolworths"),c=cost25(f,"Coles");
   if(w===null||c===null||Math.max(w,c)===0)return null;
   return {f,pct:Math.abs(w-c)/Math.max(w,c)*100,cheaper:w<c?"Woolworths":"Coles",low:Math.min(w,c)};
 }).filter(Boolean).sort((a,b)=>b.pct-a.pct)[0];
 $("catalogueInsight").innerHTML=list.length?`<span class="insight-label">CURRENT VIEW</span><strong>${cheapest?`${esc(short(cheapest.f))} gives the cheapest visible protein at ${money(cheapest.v)} per 25 g.`:"No priced food matches this view."}</strong><p>${widest?`The largest retailer gap is ${esc(short(widest.f))}: ${widest.cheaper} is ${widest.pct.toFixed(0)}% lower.`:"Retailer-gap comparison needs prices from both stores."}</p>`:`<span class="insight-label">CURRENT VIEW</span><strong>No foods match the current filters.</strong><p>Clear the search or choose another category.</p>`;
 const result=Planner.calculate(FOODS,meal,retailer);
 $("meal").innerHTML=result.lines.map(l=>`<div class="meal-row"><div><strong>${esc(short(l.food))}</strong><small>${l.selected?l.selected.retailer+" · catalogue "+esc(l.selected.updated_at?.slice(0,10)||"unknown date"):"Price unavailable"} · ${l.food.unit}</small><small>${esc(l.food.quality)}</small></div><input aria-label="${esc(l.food.name)} serving in ${l.food.unit}" inputmode="decimal" type="number" min="${l.food.basis===1?0.5:1}" max="${l.food.basis===1?100:10000}" step="${l.food.basis===1?0.5:1}" value="${l.g}" data-grams="${l.food.id}"><button type="button" data-remove="${l.food.id}" aria-label="Remove ${esc(l.food.name)} from meal">×</button></div>`).join("")||'<div class="empty">Add an ingredient to start your meal.</div>';
 $("totalProtein").textContent=result.protein.toFixed(1)+" g";$("totalEnergy").textContent=Math.round(result.kcal)+" kcal";$("totalCost").textContent=money(result.cost);$("packCost").textContent=money(result.purchase);
 if(result.estimatedPurchase&&result.purchase!==null)$("packCost").textContent="Estimated "+money(result.purchase);
 $("packList").innerHTML=result.lines.map(l=>`<div class="pack-line">${esc(short(l.food))}: ${l.packs!==null?`${l.selected.estimatedPack?'Estimated: ':''}${l.packs} × ${l.selected.pack} ${l.food.unit} (${l.selected.retailer}) · ${money(l.packs*l.selected.price)} · ${Number((l.packs*l.selected.pack-l.g).toFixed(1))} ${l.food.unit} left${l.selected.estimatedPack?' · actual weight and checkout total vary':''}`:l.selected?'Unit price available; purchase total depends on actual weighed pack.':'no priced pack available'}</div>`).join("");
 const wwMeal=Planner.calculate(FOODS,meal,"Woolworths"),colesMeal=Planner.calculate(FOODS,meal,"Coles"),splitMeal=Planner.calculate(FOODS,meal,"Both");
 const hasMeal=result.lines.length>0;
 const storeCard=(label,cost,active,tone)=>`<div class="store-card ${active?"active":""} ${tone||""}"><span>${label}</span><strong>${money(cost)}</strong><small>portion cost</small></div>`;
 $("storeCompare").innerHTML=hasMeal?`${storeCard("Woolworths only",wwMeal.cost,retailer==="Woolworths")}${storeCard("Coles only",colesMeal.cost,retailer==="Coles")}${storeCard("Split basket",splitMeal.cost,retailer==="Both","split")}`:'<p class="empty compact-empty">Add ingredients to compare a one-store shop with a split basket.</p>';
 if(!hasMeal){$("retailerInsight").textContent="";}
 else{
   const oneStore=[wwMeal.cost,colesMeal.cost].filter(v=>v!==null);
   const cheapOne=oneStore.length?Math.min(...oneStore):null;
   const saving=cheapOne!==null&&splitMeal.cost!==null?cheapOne-splitMeal.cost:null;
   $("retailerInsight").textContent=saving===null?"A single-store comparison is unavailable because at least one selected item lacks a price.":saving>=0.05?`Splitting this list by item costs ${money(splitMeal.cost)}, ${money(saving)} less than the cheaper one-store total — but it requires visiting both supermarkets.`:`Splitting saves only ${money(saving)} versus the cheaper one-store total; shopping at one store is simpler.`;
 }
 const pp=result.protein/target*100;
 $("proteinProgress").textContent=`${result.protein.toFixed(1)} / ${target} g`;$("proteinBar").value=Math.min(100,pp);$("proteinBar").setAttribute("aria-valuetext",`${result.protein.toFixed(1)} of ${target} grams of protein`);
 $("proteinStatus").textContent=result.protein>=target?"Meal protein target reached. More is not automatically better.":`${(target-result.protein).toFixed(1)} g remaining for this meal.`;
 $("budgetProgress").textContent=`${money(result.cost)} / ${money(budget)}`;
 $("budgetBar").value=result.cost===null?0:Math.min(100,result.cost/budget*100);$("budgetBar").classList.toggle("over",result.cost>budget);
 $("budgetBar").setAttribute("aria-valuetext",result.cost===null?"Portion cost unavailable":`${money(result.cost)} of ${money(budget)} portion budget`);
 $("budgetStatus").textContent=result.missing?`Budget status unknown: some prices are missing. Known portion subtotal: ${money(result.knownCost)}.`:result.cost>budget?`${money(result.cost-budget)} over the meal budget.`:`${money(budget-result.cost)} remaining for this meal.`;
 const max=Math.max(1,...result.lines.map(l=>l.protein));
 const proteinSummary=result.lines.length?result.lines.map(l=>`${short(l.food)}: ${l.protein.toFixed(1)} grams`).join("; "):"No ingredients selected.";
 $("proteinChart").setAttribute("aria-label",`Protein contribution chart. ${proteinSummary}`);
 $("proteinChart").innerHTML=result.lines.map(l=>`<div class="chart-row"><div class="chart-label"><span>${esc(short(l.food))}</span><strong>${l.protein.toFixed(1)} g</strong></div><div class="track"><div class="bar ${l.protein===max?"top-contributor":""}" style="width:${l.protein/max*100}%"></div></div></div>`).join("")||'<p class="empty">Your ingredient contributions will appear here.</p>';
 $("proteinData").innerHTML=result.lines.length?`<ul>${result.lines.map(l=>`<li>${esc(short(l.food))}: ${l.protein.toFixed(1)} grams of protein</li>`).join("")}</ul>`:'<p>No ingredients selected.</p>';
 const chartLimit=Math.max(1,+$("chartLimit").value||10);
 const chartFoods=pricedVisible.slice().sort((a,b)=>cost25(a,retailer)-cost25(b,retailer)).slice(0,chartLimit);
 const priceMax=Math.max(1,...chartFoods.flatMap(f=>["Woolworths","Coles"].filter(r=>retailer==="Both"||r===retailer).map(r=>cost25(f,r)||0)));
 $("priceChartCaption").textContent=`Showing the ${chartFoods.length} cheapest of ${pricedVisible.length} visible foods. Filters and retailer choice update this chart.`;
 $("priceChart").innerHTML=chartFoods.map(f=>{const vals=["Woolworths","Coles"].filter(r=>retailer==="Both"||r===retailer).map(r=>({r,v:cost25(f,r)}));const rowMin=Math.min(...vals.map(x=>x.v)),winners=vals.filter(x=>Math.abs(x.v-rowMin)<1e-9);const tag=vals.length===1?"":winners.length>1?'<span class="lowest-tag">same price</span>':winners[0]?.r==="Woolworths"?'<span class="lowest-tag">lowest: W</span>':winners[0]?.r==="Coles"?'<span class="lowest-tag coles-tag">lowest: C</span>':"";return `<div class="chart-row"><div class="chart-label"><span>${esc(short(f))}</span>${tag}</div>${vals.map(({r,v})=>`<div class="price-pair"><div class="track"><div class="bar ${r==="Coles"?"coles":""}" style="width:${v!==null?v/priceMax*100:0}%"></div></div><span>${v!==null?money(v):"N/A"}</span></div>`).join("")}</div>`}).join("")||'<p class="empty">No usable price records for the current filters.</p>';
 const priceSummary=chartFoods.slice(0,3).map(f=>`${short(f)}: ${["Woolworths","Coles"].filter(r=>retailer==="Both"||r===retailer).map(r=>`${r} ${money(cost25(f,r))}`).join(", ")}`).join("; ");
 $("priceChart").setAttribute("aria-label",`Cost per 25 grams of protein chart. ${priceSummary||"No priced foods match the current filters."}`);
 $("priceData").innerHTML=chartFoods.length?`<ul>${chartFoods.map(f=>`<li>${esc(short(f))}: ${["Woolworths","Coles"].filter(r=>retailer==="Both"||r===retailer).map(r=>`${r} ${money(cost25(f,r))}`).join(", ")}</li>`).join("")}</ul>`:'<p>No usable price records for the current filters.</p>';
 $("sources").innerHTML=`<details><summary>Inspect all ${FOODS.length} source mappings</summary>${FOODS.map(f=>`<p class="sub"><strong>${esc(f.name)}</strong><br>${f.nutritionSourceType==='AFCD'?`AFCD ${esc(f.id)} · ${esc(f.nutritionSheet)} row ${f.nutritionRow} · Food Details row ${f.detailsRow}`:esc(f.nutritionSourceType)} · displayed per ${basisLabel(f)}<br>${esc(f.quality)}<br>${Object.entries(f.offers).map(([r,o])=>`${esc(r)}: <a href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.name)}<span class="sr-only"> (opens in a new tab)</span></a> · ${o.pack?`${o.estimatedPack?'estimated ':''}${o.pack} ${f.unit} · ${money(o.price)}`:`unit price only ${money(o.unitPrice)} / ${basisLabel(f)}`} · updated ${esc(o.updated_at)} · WhichGrocer catalogue price`).join("<br>")||esc(f.missingReason)}</p>`).join("")}</details>`;
 $("coverage").textContent=`${FOODS.filter(f=>Planner.offer(f,'Both')).length} of ${FOODS.length} foods have usable prices. ${FOODS.filter(f=>Planner.offer(f,"Woolworths")&&Planner.offer(f,"Coles")).length} of ${FOODS.length} foods have BOTH retailer prices. ${FOODS.reduce((n,f)=>n+Object.keys(f.offers).length,0)} selected retailer offers.`;
 if(options.announce){
   const insight=cheapest?`The cheapest visible protein is ${short(cheapest.f)} at ${money(cheapest.v)} per 25 grams.`:"No priced food matches the current filters.";
   const mealText=hasMeal?`Meal protein is ${result.protein.toFixed(1)} grams and portion cost is ${money(result.cost)}.`:"No ingredients are selected.";
   const message=options.mealChange?`${options.action||"Meal updated."} ${mealText}`:`${options.action||"View updated."} ${list.length} of ${FOODS.length} foods shown. ${insight}`;
   announce(message,options.delay??250);
 }
}
$("foods").addEventListener("click",e=>{const id=e.target.closest("[data-add]")?.dataset.add;if(id){const food=FOODS.find(f=>f.id===id);meal[id]=(meal[id]||0)+(food.basis||100);render({announce:true,mealChange:true,action:`${short(food)} added to the meal.`});focusSoon(`[data-add="${id}"]`)}});
$("meal").addEventListener("click",e=>{const id=e.target.closest("[data-remove]")?.dataset.remove;if(id){const food=FOODS.find(f=>f.id===id);delete meal[id];render({announce:true,mealChange:true,action:`${short(food)} removed from the meal.`});focusSoon("#mealTitle")}});
$("meal").addEventListener("change",e=>{const id=e.target.dataset.grams;if(id){if(!e.target.checkValidity()||!Number.isFinite(+e.target.value)||+e.target.value<=0){e.target.reportValidity();e.target.value=meal[id];return}const food=FOODS.find(f=>f.id===id);meal[id]=+e.target.value;render({announce:true,mealChange:true,action:`${short(food)} updated to ${meal[id]} ${food.unit}.`});focusSoon(`[data-grams="${id}"]`)}});
for(const id of ["search","category","sort","retailer","chartLimit"])$(id).addEventListener("input",()=>render({announce:true,action:id==="search"?"Search updated.":"View updated.",delay:id==="search"?450:100}));
for(const id of ["proteinTarget","budgetTarget"])$(id).addEventListener("change",e=>{if(!e.target.checkValidity()||+e.target.value<=0){e.target.value=id==="proteinTarget"?target:budget;return}if(id==="proteinTarget")target=+e.target.value;else budget=+e.target.value;render({announce:true,action:id==="proteinTarget"?`Protein target set to ${target} grams.`:`Portion budget set to ${money(budget)}.`})});
$("clear").onclick=()=>{Object.keys(meal).forEach(k=>delete meal[k]);render({announce:true,mealChange:true,action:"Meal cleared."});focusSoon("#mealTitle")};
for(const [id,g] of [["F002594",200],["F006143",80]])if(FOODS.some(f=>f.id===id))meal[id]=g;
render();
