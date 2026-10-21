(function(root){
  function offer(food, retailer){
    const names=retailer==="Both"?["Woolworths","Coles"]:[retailer];
    return names.map(r=>({retailer:r,...(food.offers ? food.offers[r] : {price:food.prices[r],pack:food.pack})}))
      .filter(o=>Number.isFinite(o.price)&&o.price>0&&o.pack>0&&!o.out_of_stock&&!o.is_stale)
      .map(o=>({...o,unitPrice:o.price/o.pack*100}))
      .sort((a,b)=>a.unitPrice-b.unitPrice)[0]||null;
  }
  function calculate(foods,meal,retailer){
    let protein=0,kcal=0,cost=0,purchase=0,missing=false;
    const lines=Object.entries(meal).filter(([,g])=>Number.isFinite(g)&&g>0).map(([id,g])=>{
      const food=foods.find(f=>f.id===id);if(!food)throw Error("Unknown food");
      const selected=offer(food,retailer),p=food.protein*g/100;
      protein+=p;kcal+=food.kcal*g/100;
      const portion=selected?selected.unitPrice*g/100:null;
      const packs=selected?Math.ceil(g/selected.pack):null;
      if(selected){cost+=portion;purchase+=packs*selected.price}else missing=true;
      return {food,g,selected,protein:p,portion,packs};
    });
    return {lines,protein,kcal,cost:missing?null:cost,purchase:missing?null:purchase,knownCost:cost,missing};
  }
  const api={offer,calculate};if(typeof module!=="undefined")module.exports=api;root.Planner=api;
})(typeof window!=="undefined"?window:globalThis);
